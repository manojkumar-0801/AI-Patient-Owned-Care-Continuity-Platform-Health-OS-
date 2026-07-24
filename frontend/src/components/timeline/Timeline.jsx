import React from 'react';
import { TimelineItem } from './TimelineItem';
import { TimelineEmpty } from './TimelineEmpty';

export const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return <TimelineEmpty />;
  }

  return (
    <div className="py-4">
      {events.map((event, index) => (
        <TimelineItem 
          key={event.id} 
          event={event} 
          isLast={index === events.length - 1} 
        />
      ))}
    </div>
  );
};
