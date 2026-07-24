import React, { useState } from 'react';
import { Button, Card, CardBody } from '../ui';
import { ConfirmationDialog } from './ConfirmationDialog';
import appointmentService from '../../services/appointmentService';
import { CheckCircle, XCircle, PlayCircle, Ban } from 'lucide-react';

export const AppointmentActions = ({ appointment, role, onUpdate }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    actionType: null, // 'CONFIRM', 'REJECT', 'COMPLETE', 'CANCEL'
    title: '',
    message: '',
    isDestructive: false
  });
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      let targetStatus = '';
      if (dialogState.actionType === 'CONFIRM') targetStatus = 'CONFIRMED';
      if (dialogState.actionType === 'REJECT') targetStatus = 'CANCELLED';
      if (dialogState.actionType === 'COMPLETE') targetStatus = 'COMPLETED';
      if (dialogState.actionType === 'CANCEL') targetStatus = 'CANCELLED';

      const updated = await appointmentService.updateStatus(appointment.id, targetStatus);
      if (onUpdate) onUpdate(updated);
    } catch (error) {
      console.error("Failed to update status", error);
      // Let the parent or a toast handle the error in a real app
    } finally {
      setLoading(false);
      setDialogState(prev => ({ ...prev, isOpen: false }));
    }
  };

  const openDialog = (type) => {
    const config = {
      CONFIRM: {
        title: 'Confirm Appointment',
        message: 'Are you sure you want to confirm this appointment?',
        isDestructive: false,
      },
      REJECT: {
        title: 'Reject Appointment',
        message: 'Are you sure you want to reject this appointment? This action cannot be undone.',
        isDestructive: true,
      },
      COMPLETE: {
        title: 'Complete Appointment',
        message: 'Are you sure you want to mark this appointment as completed?',
        isDestructive: false,
      },
      CANCEL: {
        title: 'Cancel Appointment',
        message: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
        isDestructive: true,
      }
    };
    
    setDialogState({
      isOpen: true,
      actionType: type,
      ...config[type]
    });
  };

  // Determine what to render based on role and status
  const renderDoctorActions = () => {
    if (appointment.status === 'REQUESTED') {
      return (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700" 
            iconLeft={CheckCircle}
            onClick={() => openDialog('CONFIRM')}
            disabled={loading}
          >
            Confirm
          </Button>
          <Button 
            variant="outline"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50" 
            iconLeft={XCircle}
            onClick={() => openDialog('REJECT')}
            disabled={loading}
          >
            Reject
          </Button>
        </div>
      );
    }
    
    if (appointment.status === 'CONFIRMED') {
      return (
        <Button 
          variant="primary"
          className="w-full"
          iconLeft={PlayCircle}
          onClick={() => openDialog('COMPLETE')}
          disabled={loading}
        >
          Mark as Completed
        </Button>
      );
    }

    if (appointment.status === 'COMPLETED') {
      return <p className="text-center text-text-secondary font-medium">Appointment Completed</p>;
    }
    
    if (appointment.status === 'CANCELLED') {
      return <p className="text-center text-text-secondary font-medium">Appointment Cancelled</p>;
    }

    return null;
  };

  const renderPatientActions = () => {
    if (appointment.status === 'REQUESTED') {
      return (
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600" 
          iconLeft={Ban}
          onClick={() => openDialog('CANCEL')}
          disabled={loading}
        >
          Cancel Appointment
        </Button>
      );
    }

    return null;
  };

  const actions = role === 'DOCTOR' ? renderDoctorActions() : renderPatientActions();

  if (!actions) return null;

  return (
    <>
      <Card className="rounded-xl shadow-sm border-primary/10">
        <CardBody className="p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Actions</h2>
          {actions}
        </CardBody>
      </Card>

      <ConfirmationDialog 
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleAction}
        title={dialogState.title}
        message={dialogState.message}
        isDestructive={dialogState.isDestructive}
        confirmText={dialogState.actionType === 'REJECT' || dialogState.actionType === 'CANCEL' ? 'Yes, Cancel' : 'Yes, Confirm'}
      />
    </>
  );
};
