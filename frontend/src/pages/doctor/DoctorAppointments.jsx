import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import { DashboardStats } from '../../components/appointments/DashboardStats';
import { AppointmentFilter } from '../../components/appointments/AppointmentFilter';
import { DoctorAppointmentTable } from '../../components/appointments/DoctorAppointmentTable';
import { DoctorAppointmentCard } from '../../components/appointments/DoctorAppointmentCard';
import { ConfirmationDialog } from '../../components/appointments/ConfirmationDialog';
import { Spinner, EmptyState } from '../../components/ui';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('ALL');
  
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    actionType: null,
    appointment: null,
    title: '',
    message: '',
    isDestructive: false,
    confirmText: ''
  });

  const fetchData = async () => {
    try {
      const filters = currentFilter === 'ALL' ? {} : { status: currentFilter };
      const [apptsData, statsData] = await Promise.all([
        appointmentService.getAppointments(filters),
        appointmentService.getAppointmentStats()
      ]);
      setAppointments(apptsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilter]);

  const handleActionClick = (type, appointment) => {
    const config = {
      CONFIRM: {
        title: 'Confirm Appointment',
        message: `Are you sure you want to confirm the appointment for ${appointment.patient_name}?`,
        isDestructive: false,
        confirmText: 'Yes, Confirm'
      },
      REJECT: {
        title: 'Reject Appointment',
        message: `Are you sure you want to reject the appointment for ${appointment.patient_name}?`,
        isDestructive: true,
        confirmText: 'Yes, Reject'
      },
      COMPLETE: {
        title: 'Complete Appointment',
        message: `Mark the appointment for ${appointment.patient_name} as completed?`,
        isDestructive: false,
        confirmText: 'Yes, Complete'
      }
    };

    setDialogState({
      isOpen: true,
      actionType: type,
      appointment,
      ...config[type]
    });
  };

  const handleActionConfirm = async () => {
    setActionLoading(true);
    try {
      let targetStatus = '';
      if (dialogState.actionType === 'CONFIRM') targetStatus = 'CONFIRMED';
      if (dialogState.actionType === 'REJECT') targetStatus = 'CANCELLED';
      if (dialogState.actionType === 'COMPLETE') targetStatus = 'COMPLETED';

      await appointmentService.updateStatus(dialogState.appointment.id, targetStatus);
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setActionLoading(false);
      setDialogState(prev => ({ ...prev, isOpen: false }));
    }
  };

  if (loading && Object.keys(stats).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Doctor Dashboard</h1>
        <p className="text-text-secondary">Manage your daily appointments and schedule.</p>
      </div>

      <DashboardStats stats={stats} />
      
      <AppointmentFilter 
        currentFilter={currentFilter} 
        onFilterChange={setCurrentFilter} 
      />

      <div className="relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm">
            <Spinner size="md" className="text-primary" />
          </div>
        )}
        
        {appointments.length === 0 && !loading ? (
          <EmptyState
            icon={CalendarIcon}
            title="No appointments found"
            description={`You have no ${currentFilter !== 'ALL' ? currentFilter.toLowerCase() : ''} appointments.`}
          />
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <DoctorAppointmentTable 
                appointments={appointments} 
                onAction={handleActionClick} 
              />
            </div>

            {/* Mobile/Tablet View */}
            <div className="lg:hidden space-y-4">
              {appointments.map(appt => (
                <DoctorAppointmentCard 
                  key={appt.id} 
                  appointment={appt} 
                  onAction={handleActionClick} 
                />
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmationDialog 
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleActionConfirm}
        title={dialogState.title}
        message={dialogState.message}
        isDestructive={dialogState.isDestructive}
        confirmText={dialogState.confirmText}
      />
    </div>
  );
}
