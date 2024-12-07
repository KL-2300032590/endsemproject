import User from "../models/user.model.js";
import { Registration } from "../models/registration.model.js";
import Event from "../models/event.model.js";
import Category from "../models/category.model.js";
import bcrypt from "bcryptjs";

// User registration management
export const getRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { college: { $ne: "kluniversity" } };

    if (status && status !== "all") {
      query.paymentStatus = status;
    }

    const registrations = await User.find(query)
      .select("-password -registrationData.originalPassword")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations" });
  }
};

export const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.paymentStatus = status;
    user.isApproved = status === 'approved';

    if (status === 'approved') {
      if (user.registrationData?.originalPassword) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.registrationData.originalPassword, salt);
        user.registrationData = undefined;
      }

      await Registration.updateMany(
        { userId: id, status: 'pending' },
        { status: 'approved' }
      );
    } else if (status === 'rejected') {
      await Registration.updateMany(
        { userId: id, status: 'pending' },
        { status: 'rejected' }
      );
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      email: user.email,
      college: user.college,
      paymentStatus: user.paymentStatus,
      isApproved: user.isApproved
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating registration" });
  }
};

// Event registration management
export const getEventRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    
    const registrations = await Registration.find(query)
      .populate('userId', 'fullName email college collegeId paymentId paymentStatus paymentScreenshot')
      .populate('eventId', 'title')
      .sort({ createdAt: -1 });
      
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event registrations" });
  }
};

// Event management
export const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      category: req.body.categoryId
    });
    const savedEvent = await event.save();
    await savedEvent.populate('category', 'name');
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, category: req.body.categoryId },
      { new: true, runValidators: true }
    ).populate('category', 'name');
    
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Registration.deleteMany({ eventId: req.params.id });
    await User.updateMany(
      { registeredEvents: req.params.id },
      { $pull: { registeredEvents: req.params.id } }
    );

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Category management
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete all events in this category
    const events = await Event.find({ category: req.params.id });
    for (const event of events) {
      await Registration.deleteMany({ eventId: event._id });
      await User.updateMany(
        { registeredEvents: event._id },
        { $pull: { registeredEvents: event._id } }
      );
    }
    await Event.deleteMany({ category: req.params.id });

    await category.deleteOne();
    res.status(200).json({ message: "Category and associated events deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
