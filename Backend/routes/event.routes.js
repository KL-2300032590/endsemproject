import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent
} from '../controllers/events.controller.js';
import { Registration } from '../models/registration.model.js';
import Event from '../models/event.model.js';
import User from '../models/user.model.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/register/:eventId', protect, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      userId,
      eventId
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Create registration
    const registration = await Registration.create({
      userId,
      eventId,
      status: req.user.isApproved ? 'approved' : 'pending'
    });

    // Update user's registeredEvents
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { registeredEvents: eventId } }
    );

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user-registrations', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate('eventId')
      .populate('userId', 'fullName email college collegeId')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations" });
  }
});

// Admin routes
router.use(protect, isAdmin); // Apply both middlewares to all routes below
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/admin/registrations', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const registrations = await Registration.find(query)
      .populate('userId', 'fullName email college collegeId paymentId paymentStatus paymentScreenshot')
      .populate('eventId', 'title')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations" });
  }
});

export default router;
