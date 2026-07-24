import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import { HistoryFilters } from '../components/appointments/HistoryFilters';
import { HistoryTable } from '../components/appointments/HistoryTable';
import { HistoryCard } from '../components/appointments/HistoryCard';
import { EmptyHistory } from '../components/appointments/EmptyHistory';
import { Spinner, Button } from '../components/ui';
import { Plus } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const filters = { ordering: '-scheduled_at' };
        
        if (currentFilter !== 'ALL') {
          filters.status = currentFilter;
        }
        if (debouncedSearch.trim()) {
          filters.search = debouncedSearch.trim();
        }

        const data = await appointmentService.getAppointments(filters);
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointment history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentFilter, debouncedSearch]);

  const isSearchOrFilterActive = currentFilter !== 'ALL' || debouncedSearch !== '';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Appointment History</h1>
          <p className="text-text-secondary">Review your past consultations and track upcoming appointments.</p>
        </div>
        <Button 
          variant="primary" 
          iconLeft={Plus}
          onClick={() => navigate('/appointments/book')}
        >
          Book Appointment
        </Button>
      </div>

      <HistoryFilters 
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm">
            <Spinner size="md" className="text-primary" />
          </div>
        )}
        
        {appointments.length === 0 && !loading ? (
          <EmptyHistory isSearchOrFilterActive={isSearchOrFilterActive} />
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <HistoryTable appointments={appointments} />
            </div>

            {/* Mobile/Tablet View */}
            <div className="lg:hidden space-y-4">
              {appointments.map(appt => (
                <HistoryCard key={appt.id} appointment={appt} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
