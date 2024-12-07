import React, { useState, useEffect, useCallback } from "react";
import { IoChevronDown, IoChevronUp, IoCalendarClear, IoLocationSharp, IoTime } from "react-icons/io5";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import AddEventModal from "./Events/AddEventModal";
import CategoryModal from "./Events/CategoryModal";
import EventRegistrations from "./Events/EventRegistrations";
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const EventModal = React.memo(
  ({
    eventForm,
    setEventForm,
    handleEventSubmit,
    closeEventModal,
    editingEvent,
  }) => {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-gray-800 rounded-xl w-full max-w-2xl my-8 mx-4 relative">
          <button
            onClick={closeEventModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <form onSubmit={handleEventSubmit} className="p-6 space-y-4">
            <h3 className="text-2xl font-bold text-purple-400 pr-8 mb-4">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-300 mb-2">Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  className="w-full bg-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  className="w-full bg-gray-700 rounded-lg p-2.5 text-white h-24 resize-y min-h-[96px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2">Venue</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, venue: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2">Time</label>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, time: e.target.value })
                  }
                  className="w-full bg-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={eventForm.image}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, image: e.target.value })
                  }
                  className="w-full bg-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2">
                  Terms and Conditions
                </label>
                <textarea
                  value={eventForm.termsandconditions}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      termsandconditions: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 rounded-lg p-2.5 text-white h-24 resize-y min-h-[96px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-purple-500 text-white px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
              <button
                type="button"
                onClick={closeEventModal}
                className="flex-1 bg-gray-600 text-white px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

const AdminPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("events");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    image: "",
    termsandconditions: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    categoryName: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  const closeEventModal = useCallback(() => {
    setShowEventModal(false);
    setEventForm({
      title: "",
      description: "",
      venue: "",
      date: "",
      time: "",
      image: "",
      termsandconditions: "",
    });
    setEditingEvent(null);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setShowCategoryModal(false);
    setCategoryForm({ categoryName: "" });
  }, []);

  useEffect(() => {
    if (view === "registrations") {
      fetchRegistrations();
    } else {
      fetchEvents();
    }
  }, [filter, view]);

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      const url = `/api/admin/registrations${filter !== "all" ? `?status=${filter}` : ""}`;
      const response = await axiosInstance.get(url);
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setRegistrations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleApproval = async (userId, status) => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/registrations/${userId}`,
        { status }
      );
      if (response.status === 200) {
        await fetchRegistrations();
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      alert("Failed to update registration status");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDeleteEvent = async (categoryId, eventId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/events/${categoryId}/events/${eventId}`
      );
      if (response.status === 200) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleEventSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const eventData = {
          title: eventForm.title,
          eventType: 'webinar',
          status: 'upcoming',
          details: {
            description: eventForm.description,
            venue: eventForm.venue,
            date: eventForm.date,
            time: eventForm.time
          },
          image: eventForm.image,
          termsandconditions: eventForm.termsandconditions
        };

        const response = await axiosInstance({
          method: editingEvent ? "PUT" : "POST",
          url: `/api/events/category/${selectedCategory}/events`,
          data: eventData
        });

        if (response.status === 201 || response.status === 200) {
          await fetchEvents();
          closeEventModal();
        }
      } catch (error) {
        console.error("Error saving event:", error);
        alert("Failed to save event. Please try again.");
      }
    },
    [eventForm, selectedCategory, editingEvent, closeEventModal]
  );

  const handleAddEvent = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setShowEventModal(true);
  }, []);

  const handleEditEvent = useCallback((category, event) => {
    setSelectedCategory(category._id);
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.details.description,
      venue: event.details.venue,
      date: event.details.date,
      time: event.details.time,
      image: event.image,
      termsandconditions: event.termsandconditions,
    });
    setShowEventModal(true);
  }, []);

  const handleAddCategory = () => {
    setCategoryForm({ categoryName: "" });
    document.body.style.overflow = "hidden";
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const response = await axiosInstance.post(
          "/api/events/category",
          categoryForm
        );
        await fetchEvents();
        closeCategoryModal();
        setCategoryForm({ categoryName: "" });
      } catch (error) {
        console.error("Error creating category:", error);
        alert(error.response?.data?.message || "Failed to create category. Please try again.");
      }
    },
    [categoryForm, closeCategoryModal, fetchEvents]
  );

  const handleUpdateCategory = useCallback(async (categoryId, newName) => {
    try {
      const response = await axiosInstance.put(
        `/api/events/category/${categoryId}`,
        { categoryName: newName }
      );
      if (response.status === 200) {
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  }, []);

  const handleDeleteCategory = useCallback(async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? All events in this category will be deleted.")) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/events/category/${categoryId}`);
      if (response.status === 200) {
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  }, []);

  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
  };

  const toggleEventExpansion = (eventId) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="pt-16 sm:pt-20"></div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Admin Dashboard
          </h2>
          <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setView("registrations")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === "registrations"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-500"
              }`}
            >
              Registrations
            </button>
            <button
              onClick={() => setView("events")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === "events"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-500"
              }`}
            >
              Events
            </button>
          </div>
        </div>

        {view === "registrations" && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-yellow-500"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg ${
                filter === "approved"
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-green-500"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-lg ${
                filter === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-red-500"
              }`}
            >
              Rejected
            </button>
          </div>
        )}

        {view === "registrations" ? (
          <div className="grid gap-6">
            {registrations.map((user) => (
              <div
                key={user._id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-700"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl text-purple-300 font-bold mb-1">
                        {user.fullName}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${getStatusBadgeColor(
                            user.paymentStatus
                          )}`}
                        >
                          {user.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-purple-200">
                          <span className="text-purple-400">Email:</span>{" "}
                          {user.email}
                        </p>
                        <p className="text-purple-200">
                          <span className="text-purple-400">College:</span>{" "}
                          {user.college}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-purple-200">
                            <span className="text-purple-400">ID:</span>{" "}
                            {user.collegeId}
                          </p>
                          <button
                            onClick={() => copyToClipboard(user.collegeId)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-purple-200">
                            <span className="text-purple-400">Payment ID:</span>{" "}
                            {user.paymentId || "N/A"}
                          </p>
                          {user.paymentId && (
                            <button
                              onClick={() => copyToClipboard(user.paymentId)}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {user.paymentStatus === "pending" && (
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleApproval(user._id, "approved")}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(user._id, "rejected")}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {user.paymentScreenshot && (
                  <div className="mt-6">
                    <p className="text-purple-300 mb-3 font-medium">
                      Payment Screenshot:
                    </p>
                    <img
                      src={user.paymentScreenshot}
                      alt="Payment Proof"
                      className="w-full sm:max-w-md rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-purple-500"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            ))}

            {registrations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-purple-300 text-lg">
                  No registrations found for {filter} status
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleAddCategory}
                className="px-6 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Add Category
              </button>
            </div>
            {events.map((category) => (
              <div key={category._id} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-purple-400">
                    {category.categoryName}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-purple-500 rounded-lg text-white hover:bg-purple-600"
                      onClick={() => handleAddEvent(category._id)}
                    >
                      Add Event
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Delete Category
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.Events.map((event) => (
                    <div
                      key={event._id}
                      className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300"
                    >
                      {/* Event Header - Always Visible */}
                      <div
                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700"
                        onClick={() => toggleEventExpansion(event._id)}
                      >
                        <div className="flex items-center space-x-4">
                          <h4 className="text-xl font-semibold text-white">
                            {event.title}
                          </h4>
                          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                            Registrations:{" "}
                            {event.registeredStudents?.length || 0}
                          </span>
                        </div>
                        {expandedEvents.has(event._id) ? (
                          <IoChevronUp className="text-2xl text-purple-400" />
                        ) : (
                          <IoChevronDown className="text-2xl text-purple-400" />
                        )}
                      </div>

                      {/* Expandable Content */}
                      {expandedEvents.has(event._id) && (
                        <div className="p-4 border-t border-gray-700 bg-gray-750">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <p className="text-gray-300">
                                <span className="font-semibold text-purple-400">
                                  Description:
                                </span>{" "}
                                {event.details.description}
                              </p>
                              <p className="text-gray-300">
                                <span className="font-semibold text-purple-400">
                                  Venue:
                                </span>{" "}
                                {event.details.venue}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-300">
                                <span className="font-semibold text-purple-400">
                                  Date:
                                </span>{" "}
                                {event.details.date}
                              </p>
                              <p className="text-gray-300">
                                <span className="font-semibold text-purple-400">
                                  Time:
                                </span>{" "}
                                {event.details.time}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewRegistrations(event);
                              }}
                              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200"
                            >
                              View Registrations
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvent(category._id, event);
                              }}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(category._id, event._id);
                              }}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showEventModal && (
        <AddEventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedCategory(null);
          }}
          categoryId={selectedCategory}
          onSubmit={async (eventData) => {
            try {
              await fetchEvents();
              setShowEventModal(false);
              setSelectedCategory(null);
            } catch (error) {
              console.error("Error refreshing events:", error);
              alert("Event added but failed to refresh the list. Please reload the page.");
            }
          }}
        />
      )}
      {showCategoryModal && (
        <CategoryModal
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          handleCategorySubmit={handleCategorySubmit}
          closeCategoryModal={closeCategoryModal}
        />
      )}
      {selectedEvent && (
        <EventRegistrations
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
