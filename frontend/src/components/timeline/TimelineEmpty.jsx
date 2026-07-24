import React from 'react';
import { Activity } from 'lucide-react';
import { Button } from '../ui';
import { useNavigate } from 'react-router-dom';

export const TimelineEmpty = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-2xl bg-surface my-8">
      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Activity className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">No medical history available yet.</h3>
      <p className="text-text-secondary max-w-md mb-6">
        Your timeline will automatically populate as you book appointments, upload records, and consult with doctors.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => navigate('/appointments/book')} variant="primary">
          Book Appointment
        </Button>
        <Button onClick={() => navigate('/records')} variant="outline">
          Upload Record
        </Button>
      </div>
    </div>
  );
};
