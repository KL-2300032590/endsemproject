import React from 'react';
import EventCard from './EventCard';

const CompletedEvents = ({ events }) => {
  const completedEvents = events.flatMap(category => 
    category.Events.filter(event => event.status === 'completed')
  );

  return (
    <div className="grid gap-6">
      {completedEvents.length > 0 ? (
        completedEvents.map(event => (
          <EventCard key={event._id} event={event} />
        ))
      ) : (
        <p className="text-center text-gray-400">No completed events</p>
      )}
    </div>
  );
};

export default CompletedEvents; 