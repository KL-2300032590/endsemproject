import React from 'react';
import EventCard from './EventCard';

const UpcomingEvents = ({ events }) => {
  const upcomingEvents = events.filter(event => 
    event.status === 'upcoming' || 
    new Date(event.date) > new Date()
  );

  return (
    <div className="grid gap-6">
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map(event => (
          <EventCard key={event._id} event={event} />
        ))
      ) : (
        <p className="text-center text-gray-400">No upcoming events</p>
      )}
    </div>
  );
};

export default UpcomingEvents; 