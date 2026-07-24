import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import appointmentService from '../services/appointmentService';
import { AppointmentTable } from '../components/appointments/AppointmentTable';
import { AppointmentCard } from '../components/appointments/AppointmentCard';
import { Spinner, EmptyState, Button } from '../components/ui';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppointmentList() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Appointments</h1>
          <p className="text-text-secondary">
            {user?.role === 'DOCTOR' 
              ? 'View and manage your assigned patient consultations.' 
              : 'View your scheduled and past appointments.'}
          </p>
        </div>
        
        {user?.role === 'PATIENT' && (
          <Button 
            variant="primary" 
            iconLeft={Plus}
            onClick={() => navigate('/appointments/book')}
          >
            Book Appointment
          </Button>
        )}
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="No appointments found"
          description={user?.role === 'DOCTOR' ? "You have no upcoming appointments assigned to you." : "You haven't booked any appointments yet."}
          action={user?.role === 'PATIENT' && {
            label: "Book your first appointment",
            onClick: () => navigate('/appointments/book')
          }}
        />
      ) : (
        <>
          {/* Desktop View (Table) */}
          <div className="hidden md:block">
            <AppointmentTable appointments={appointments} role={user?.role} />
          </div>

          {/* Mobile View (Cards) */}
          <div className="md:hidden space-y-4">
            {appointments.map(appt => (
              <AppointmentCard key={appt.id} appointment={appt} role={user?.role} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
