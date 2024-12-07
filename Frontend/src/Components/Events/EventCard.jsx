import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        {event.image && (
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-48 object-cover"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-purple-400 mb-2">{event.title}</h3>
        <p className="text-gray-300 mb-4">{event.details?.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>{event.details?.date}</span>
          <span>{event.details?.venue}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 