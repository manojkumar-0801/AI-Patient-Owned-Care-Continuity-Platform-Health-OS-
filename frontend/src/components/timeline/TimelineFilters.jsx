import React from 'react';
import { Select, Button } from '../ui';
import { TimelineSearch } from './TimelineSearch';

export const TimelineFilters = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedDateRange,
  setSelectedDateRange,
  onClear
}) => {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 mb-8">
      
      <TimelineSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="w-full md:w-48 shrink-0">
        <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="all">All Events</option>
          <option value="appointment">Appointments</option>
          <option value="medical_record">Medical Records</option>
          <option value="doctor_note">Doctor Notes</option>
        </Select>
      </div>

      <div className="w-full md:w-48 shrink-0">
        <Select value={selectedDateRange} onChange={(e) => setSelectedDateRange(e.target.value)}>
          <option value="all">Any Time</option>
          <option value="today">Today</option>
          <option value="last7">Last 7 Days</option>
          <option value="last30">Last 30 Days</option>
        </Select>
      </div>

      <div className="w-full md:w-auto shrink-0">
        <Button variant="outline" onClick={onClear} className="w-full">
          Clear Filters
        </Button>
      </div>

    </div>
  );
};
