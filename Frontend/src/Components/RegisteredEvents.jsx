import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoLocationSharp,
  IoCalendarClear,
  IoTime,
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchRegisteredEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/events/registered",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch registered events"
        );
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-red-400 bg-red-900/20 p-4 rounded-lg"
        >
          Error: {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="pt-12"></div>
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-purple-400 mb-8 text-center"
        >
          Registered Events
        </motion.h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search events by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-purple-400"
          />
        </div>

        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">
              {searchTerm
                ? "No events match your search."
                : "You haven't registered for any events yet."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.eventId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-400/10 transition-all duration-300"
                >
                  <div className="relative h-48 group">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 bg-purple-400 text-white px-3 py-1 m-2 rounded-full text-sm">
                      {event.categoryName}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">
                      {event.title}
                    </h3>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedEvent(
                          expandedEvent === event.eventId ? null : event.eventId
                        )
                      }
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p
                          className={`text-gray-400 ${
                            expandedEvent === event.eventId
                              ? ""
                              : "line-clamp-2"
                          }`}
                        >
                          {event.details.description}
                        </p>
                        {expandedEvent === event.eventId ? (
                          <IoChevronUp className="text-purple-400" />
                        ) : (
                          <IoChevronDown className="text-purple-400" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-3 mt-4">
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <IoLocationSharp className="text-purple-400" />
                        <span>{event.details.venue}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <IoCalendarClear className="text-purple-400" />
                        <span>{event.details.date}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <IoTime className="text-purple-400" />
                        <span>{event.details.time}</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredEvents;
