import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import appointmentService from '../services/appointmentService';
import { CalendarCheck, AlertCircle } from 'lucide-react';

export default function AppointmentBooking() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBookAppointment = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await appointmentService.bookAppointment(formData);
      setSuccess(true);
      // Wait a moment then redirect to dashboard (or appointment history if it existed)
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error("Booking failed:", err);
      // Backend returns validation errors in err.response.data
      const errMessage = err.response?.data?.reason?.[0] || 
                         err.response?.data?.scheduled_at?.[0] || 
                         "Failed to book appointment. Please try again.";
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Book an Appointment</h1>
        <p className="text-text-secondary">Schedule a consultation with one of our specialized doctors.</p>
      </div>

      <Card className="rounded-xl shadow-lg border-primary/10">
        <CardBody className="p-6 md:p-8">
          
          {success ? (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg p-6 text-center animate-fade-in">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                <CalendarCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">✓ Appointment booked successfully!</h3>
              <p className="text-sm opacity-90">Your request has been sent to the doctor. Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 bg-error/10 text-error border border-error/20 rounded-md p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <AppointmentForm 
                onSubmit={handleBookAppointment} 
                loading={loading} 
              />
            </>
          )}

        </CardBody>
      </Card>
    </div>
  );
}
