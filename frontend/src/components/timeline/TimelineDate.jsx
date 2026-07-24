import React from 'react';

export const TimelineDate = ({ date }) => {
  if (!date) return null;
  
  const d = new Date(date);
  const day = d.toLocaleDateString('en-US', { day: '2-digit' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.toLocaleDateString('en-US', { year: 'numeric' });
  
  return (
    <div className="flex flex-col items-center justify-center shrink-0 w-24">
      <span className="text-2xl font-bold text-text-primary leading-none">{day}</span>
      <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{month} {year}</span>
    </div>
  );
};
