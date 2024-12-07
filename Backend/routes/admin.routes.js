import express from "express";
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
  getRegistrations,
  getEventRegistrations,
  updateRegistration,
  updateEventRegistration,
  createEvent,
  updateEvent,
  deleteEvent,
  createCategory,
  deleteCategory,
  getCategories
} from '../controllers/admin.controller.js';

const router = express.Router();

// Apply protection to all admin routes
router.use(protect, isAdmin);

// User registration routes
router.get("/registrations", getRegistrations);
router.put("/registrations/:id", updateRegistration);

// Event registration routes
router.get("/event-registrations", getEventRegistrations);
router.put("/event-registrations/:id", updateEventRegistration);

// Event management routes
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// Category management routes
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
