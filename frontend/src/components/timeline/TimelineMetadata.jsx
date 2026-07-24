import React from 'react';

export const TimelineMetadata = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8 p-6 bg-surface rounded-xl border border-border shadow-sm">
      {Object.entries(data).map(([key, value]) => {
        if (!value) return null;
        return (
          <div key={key} className="flex flex-col">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              {key}
            </span>
            <span className="text-sm font-medium text-text-primary break-words">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
