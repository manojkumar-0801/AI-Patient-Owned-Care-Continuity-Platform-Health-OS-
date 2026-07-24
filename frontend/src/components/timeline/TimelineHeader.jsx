import React from 'react';
import { Activity } from 'lucide-react';

export const TimelineHeader = () => {
  return (
    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2 flex items-center">
          <Activity className="w-8 h-8 mr-3 text-primary" />
          Medical Timeline
        </h1>
        <p className="text-text-secondary">
          Your complete health history in chronological order.
        </p>
      </div>
    </section>
  );
};
