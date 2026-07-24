import React from 'react';
import { Search } from 'lucide-react';

export const TimelineSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex-1 w-full relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-text-secondary" />
      </div>
      <input
        type="text"
        placeholder="Search timeline..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
};
