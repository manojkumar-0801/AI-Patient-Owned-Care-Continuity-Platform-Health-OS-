import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui';

export const HistoryFilters = ({ currentFilter, onFilterChange, searchQuery, onSearchChange }) => {
  const filters = [
    { id: 'ALL', label: 'All' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2">
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
      
      <div className="w-full md:w-72">
        <Input 
          icon={Search}
          placeholder="Search doctor or reason..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};
