import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';

const AddEventModal = ({ isOpen, onClose, onSubmit, categoryId }) => {
  const [eventData, setEventData] = useState({
    title: '',
    eventType: 'webinar',
    status: 'upcoming',
    details: {
      description: '',
      venue: '',
      date: '',
      time: ''
    },
    image: '',
    termsandconditions: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formattedData = {
        ...eventData,
        details: {
          ...eventData.details,
          date: new Date(eventData.details.date).toISOString(),
        }
      };

      const response = await axios.post(
        `https://surabhi-final.onrender.com/api/events/category/${categoryId}/events`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        console.log("Event created successfully:", response.data);
        onSubmit(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.response?.data?.message || 'Failed to create event');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-purple-400">Add New Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              className="w-full bg-gray-700 text-white p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={eventData.details.description}
              onChange={(e) => setEventData({
                ...eventData,
                details: {...eventData.details, description: e.target.value}
              })}
              className="w-full bg-gray-700 text-white p-2 rounded"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={eventData.details.date}
                onChange={(e) => setEventData({
                  ...eventData,
                  details: {...eventData.details, date: e.target.value}
                })}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Time</label>
              <input
                type="time"
                value={eventData.details.time}
                onChange={(e) => setEventData({
                  ...eventData,
                  details: {...eventData.details, time: e.target.value}
                })}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Venue</label>
            <input
              type="text"
              value={eventData.details.venue}
              onChange={(e) => setEventData({
                ...eventData,
                details: {...eventData.details, venue: e.target.value}
              })}
              className="w-full bg-gray-700 text-white p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Image URL</label>
            <input
              type="url"
              value={eventData.image}
              onChange={(e) => setEventData({...eventData, image: e.target.value})}
              className="w-full bg-gray-700 text-white p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Terms and Conditions</label>
            <textarea
              value={eventData.termsandconditions}
              onChange={(e) => setEventData({...eventData, termsandconditions: e.target.value})}
              className="w-full bg-gray-700 text-white p-2 rounded"
              rows="3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal; 