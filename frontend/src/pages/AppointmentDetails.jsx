import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import appointmentService from '../services/appointmentService';
import { AppointmentInfo } from '../components/appointments/AppointmentInfo';
import { PatientInfoCard } from '../components/appointments/PatientInfoCard';
import { DoctorInfoCard } from '../components/appointments/DoctorInfoCard';
import { AppointmentActions } from '../components/appointments/AppointmentActions';
import { Spinner, Card, CardBody, Button } from '../components/ui';
import { ArrowLeft, FileText } from 'lucide-react';

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await appointmentService.getAppointmentDetails(id);
        setAppointment(data);
      } catch (err) {
        console.error("Failed to load appointment details:", err);
        setError("Failed to load appointment details. You might not have permission to view this.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <h2 className="text-xl font-bold text-text-primary mb-2">Error</h2>
        <p className="text-text-secondary mb-6">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)} iconLeft={ArrowLeft}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(user?.role === 'DOCTOR' ? '/doctor/appointments' : '/appointments')}
          className="p-2 hover:bg-surface-hover rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Appointment Details</h1>
          <p className="text-sm text-text-secondary font-mono mt-1">ID: {appointment.id}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AppointmentInfo appointment={appointment} />
          
          {/* Notes Section */}
          <Card className="rounded-xl shadow-sm border-primary/10 bg-slate-50 dark:bg-slate-900/50">
            <CardBody className="p-6">
              <div className="flex items-center mb-4 text-text-primary">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-lg font-bold">Doctor Notes</h2>
              </div>
              {appointment.notes ? (
                <div className="whitespace-pre-wrap text-sm text-text-secondary bg-surface p-4 rounded-lg border border-divider max-h-64 overflow-y-auto">
                  {appointment.notes}
                </div>
              ) : (
                <p className="text-sm text-text-secondary italic">No doctor notes available yet.</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <AppointmentActions 
            appointment={appointment} 
            role={user?.role} 
            onUpdate={(updatedAppt) => setAppointment(updatedAppt)} 
          />
          <PatientInfoCard appointment={appointment} />
          <DoctorInfoCard appointment={appointment} />
        </div>
      </div>
      
    </div>
  );
}
