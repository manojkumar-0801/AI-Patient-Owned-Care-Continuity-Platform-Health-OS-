import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { EmptyState, Button } from '../ui';

export const EmptyHistory = ({ isSearchOrFilterActive }) => {
  const navigate = useNavigate();

  if (isSearchOrFilterActive) {
    return (
      <EmptyState
        icon={Calendar}
        title="No matches found"
        description="We couldn't find any appointments matching your filters."
      />
    );
  }

  return (
    <div className="text-center py-16 px-4 bg-surface rounded-xl border border-divider">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
        <Calendar className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">No Appointments Yet</h3>
      <p className="text-text-secondary max-w-md mx-auto mb-6">
        Your appointment history is currently empty. Book a consultation with a doctor to get started with your healthcare journey.
      </p>
      <Button 
        variant="primary" 
        iconLeft={Plus}
        onClick={() => navigate('/appointments/book')}
        className="mx-auto"
      >
        Book Appointment
      </Button>
    </div>
  );
};
