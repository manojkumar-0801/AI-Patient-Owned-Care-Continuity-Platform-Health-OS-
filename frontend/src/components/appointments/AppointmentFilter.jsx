import React from 'react';

export const AppointmentFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'ALL', label: 'All' },
    { id: 'REQUESTED', label: 'Pending' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2 mb-6">
      <div className="flex bg-background-light p-1 rounded-xl border border-divider">
        {filters.map(filter => {
          const isActive = currentFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
