import Event from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";
import User from "../models/user.model.js";

export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category', 'name');
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
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

    // Delete all registrations for this event
    await Registration.deleteMany({ eventId: req.params.id });
    
    // Remove event from users' registeredEvents arrays
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

export const registerForEvent = async (req, res) => {
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
      status: 'pending'
    });

    // Update user's registeredEvents
    await User.findByIdAndUpdate(
      userId,
      { $push: { registeredEvents: eventId } }
    );

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegisteredEvents = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all categories that have events with this user registered
    const categories = await Event.find({
      "Events.registeredStudents": userId,
    });

    // Format the response to include only registered events
    const registeredEvents = categories.flatMap((category) =>
      category.Events.filter((event) =>
        event.registeredStudents.includes(userId)
      ).map((event) => ({
        eventId: event._id,
        categoryId: category._id,
        categoryName: category.categoryName,
        title: event.title,
        details: event.details,
        image: event.image,
        date: event.details.date,
        time: event.details.time,
        venue: event.details.venue,
      }))
    );

    console.log("Found registered events:", registeredEvents); // Debug log
    res.status(200).json(registeredEvents);
  } catch (error) {
    console.error("Error in getRegisteredEvents:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createEventInCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    let category;

    // If categoryId is 'default', create or get the default category
    if (categoryId === 'default') {
      category = await Event.findOne({ categoryName: 'General Events' });
      if (!category) {
        category = new Event({
          categoryName: 'General Events',
          Events: []
        });
      }
    } else {
      category = await Event.findById(categoryId);
    }

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const maxEventId = Math.max(...category.Events.map((e) => e.eventId || 0), 0);
    const newEventId = maxEventId + 1;

    const newEvent = {
      title: req.body.title,
      eventId: newEventId,
      eventType: req.body.eventType,
      status: req.body.status,
      details: {
        description: req.body.details.description,
        venue: req.body.details.venue,
        date: req.body.details.date,
        time: req.body.details.time,
      },
      image: req.body.image,
      termsandconditions: req.body.termsandconditions,
      registeredStudents: [],
    };

    category.Events.push(newEvent);
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateEventInCategory = async (req, res) => {
  try {
    const { categoryId, eventId } = req.params;
    const category = await Event.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const event = category.Events.find((e) => e.eventId.toString() === eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    Object.assign(event, {
      title: req.body.title,
      details: req.body.details,
      image: req.body.image,
      termsandconditions: req.body.termsandconditions,
    });

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Event.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Event({
      categoryName,
      Events: [],
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Event.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteEventInCategory = async (req, res) => {
  try {
    const { categoryId, eventId } = req.params;

    const category = await Event.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const eventIndex = category.Events.findIndex(
      (event) => event._id.toString() === eventId
    );
    if (eventIndex === -1) {
      return res.status(404).json({ message: "Event not found" });
    }

    category.Events.splice(eventIndex, 1);
    await category.save();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { categoryId, eventId } = req.params;
    const { status } = req.body;

    const category = await Event.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const event = category.Events.find(e => e._id.toString() === eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = status;
    await category.save();

    res.status(200).json({ message: "Event status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
