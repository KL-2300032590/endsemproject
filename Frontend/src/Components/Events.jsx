import React, { useState, useEffect } from "react";
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import AddEventModal from './Events/AddEventModal';
import { motion } from "framer-motion";
import { IoCalendarClear, IoLocationSharp, IoTime } from "react-icons/io5";

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [userRegistrations, setUserRegistrations] = useState([]);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/events");
      console.log("API Response:", response.data);

      const allEvents = response.data.flatMap(category => 
        (category.Events || []).map(event => ({
          ...event,
          categoryId: category._id,
          categoryName: category.categoryName,
          details: {
            ...event.details,
            date: event.details?.date || '',
            time: event.details?.time || '',
            venue: event.details?.venue || '',
            description: event.details?.description || ''
          }
        }))
      );

      console.log("Transformed Events:", allEvents);
      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const response = await axiosInstance.get('/api/events/user-registrations');
      const registeredEventIds = new Set(response.data.map(reg => reg.eventId));
      setRegisteredEvents(registeredEventIds);
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      const isRegistered = registeredEvents.has(eventId);
      const endpoint = isRegistered ? 'unregister' : 'register';

      const response = await axiosInstance({
        method: isRegistered ? 'DELETE' : 'POST',
        url: `/api/events/${eventId}/${endpoint}`
      });

      if (response.status === 200) {
        await fetchUserRegistrations();
        if (isRegistered) {
          alert('Successfully unregistered from the event');
        } else {
          setShowSuccessPopup(true);
        }
        await fetchEvents();
      }
    } catch (error) {
      console.error('Error handling event registration:', error);
      alert(error.response?.data?.message || `Failed to ${isRegistered ? 'unregister from' : 'register for'} event`);
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.details?.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'upcoming':
        return eventDate > today;
      case 'ongoing':
        return eventDate.toDateString() === today.toDateString();
      case 'completed':
        return eventDate < today;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center pt-14">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-lg">
            Events
          </h1>
          {isAdmin && (
            <button
              onClick={() => setShowAddEventModal(true)}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-8 py-3 rounded-lg 
              hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 
              shadow-lg hover:shadow-purple-500/25 font-semibold transform hover:scale-105"
            >
              Create Event
            </button>
          )}
        </div>

        <div className="flex justify-center space-x-6 my-12">
          {['upcoming', 'ongoing', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div 
                  key={event._id} 
                  className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl 
                  hover:shadow-purple-500/20 transition-all duration-300 border border-white/10
                  transform hover:scale-[1.02] hover:rotate-1"
                >
                  {event.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                        }}
                      />
                      <div className="absolute top-0 left-0 m-4">
                        <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1.5 
                        rounded-full text-sm font-semibold shadow-lg">
                          {event.categoryName}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                    from-pink-400 to-purple-400 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-white/80 mb-4 line-clamp-2">
                      {event.details?.description}
                    </p>
                    <div className="space-y-3 text-sm text-white/70">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="text-pink-400 font-medium">Date:</span>
                        <span>{new Date(event.details?.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="text-purple-400 font-medium">Time:</span>
                        <span>{event.details?.time}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="text-indigo-400 font-medium">Venue:</span>
                        <span>{event.details?.venue}</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => handleRegisterEvent(event._id)}
                        className={`w-full py-3 rounded-lg transition-all duration-300 font-semibold
                        transform hover:scale-105 ${
                          registeredEvents.has(event._id)
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                            : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600'
                        } text-white shadow-lg hover:shadow-xl`}
                      >
                        {registeredEvents.has(event._id) ? 'Unregister' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-white/70 text-xl font-medium">
                  No {activeTab} events found.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl 
          max-w-sm w-full mx-4 border border-purple-500/20 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
            from-green-400 to-emerald-400 mb-4">Registration Successful!</h3>
            <p className="text-white/80 mb-6">You have successfully registered for the event.</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 
              rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 
              shadow-lg hover:shadow-green-500/25 font-semibold transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isAdmin && showAddEventModal && (
        <AddEventModal
          isOpen={showAddEventModal}
          onClose={() => setShowAddEventModal(false)}
          onSubmit={async (eventData) => {
            try {
              const token = localStorage.getItem("token");
              const response = await axiosInstance.post(
                "/api/events",
                eventData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              if (response.status === 201) {
                setShowAddEventModal(false);
                fetchEvents();
                alert("Event added successfully!");
              }
            } catch (error) {
              console.error("Error adding event:", error);
              alert(error.response?.data?.message || "Failed to add event");
            }
          }}
        />
      )}
    </div>
  );
};

export default Events;
