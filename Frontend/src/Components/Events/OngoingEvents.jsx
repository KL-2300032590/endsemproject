import React from 'react';
import EventCard from './EventCard';

const OngoingEvents = ({ events }) => {
  const ongoingEvents = events.flatMap(category => 
    category.Events.filter(event => event.status === 'ongoing')
  );

  return (
    <div className="grid gap-6">
      {ongoingEvents.length > 0 ? (
        ongoingEvents.map(event => (
          <EventCard key={event._id} event={event} />
        ))
      ) : (
        <p className="text-center text-gray-400">No ongoing events</p>
      )}
    </div>
  );
};

export default OngoingEvents; 