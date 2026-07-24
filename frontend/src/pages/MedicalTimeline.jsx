import React, { useState, useEffect } from 'react';
import { Timeline } from '../components/timeline/Timeline';
import { TimelineHeader } from '../components/timeline/TimelineHeader';
import { TimelineFilters } from '../components/timeline/TimelineFilters';
import timelineService from '../services/timelineService';
import { Spinner } from '../components/ui';

export default function MedicalTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await timelineService.getTimeline();
        if (res.success) {
          setEvents(res.data);
        } else {
          setError(res.message || "Failed to fetch timeline");
        }
      } catch (err) {
        setError("An error occurred while fetching your timeline.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeline();
  }, []);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedDateRange('all');
  };

  // Derived filtered events
  const filteredEvents = events.filter((event) => {
    // 1. Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = event.title?.toLowerCase().includes(query);
      const descMatch = event.description?.toLowerCase().includes(query);
      if (!titleMatch && !descMatch) return false;
    }

    // 2. Type filter
    if (selectedType !== 'all') {
      if (event.type !== selectedType) return false;
    }

    // 3. Date range filter
    if (selectedDateRange !== 'all') {
      const eventDate = new Date(event.date);
      const now = new Date();
      // Normalize both to start of day for accurate day diffs
      eventDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      
      const diffTime = now.getTime() - eventDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (selectedDateRange === 'today' && diffDays > 0) return false;
      if (selectedDateRange === 'last7' && diffDays > 7) return false;
      if (selectedDateRange === 'last30' && diffDays > 30) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-8 animate-fade-in max-w-4xl mx-auto px-4 sm:px-6">
      <TimelineHeader />

      <TimelineFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        onClear={handleClearFilters}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20 min-h-[300px]">
          <Spinner size="lg" label="Loading your healthcare journey..." />
        </div>
      ) : error ? (
        <div className="bg-error/10 border border-error/50 text-error px-6 py-4 rounded-xl flex items-center justify-center my-8">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <Timeline events={filteredEvents} />
      )}
    </div>
  );
}
