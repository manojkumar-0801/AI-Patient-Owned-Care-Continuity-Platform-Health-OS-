import React from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button } from '../ui';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, CheckCircle, XCircle, PlayCircle, Eye } from 'lucide-react';

export const DoctorAppointmentCard = ({ appointment, onAction }) => {
  const navigate = useNavigate();
  const date = parseISO(appointment.scheduled_at);
  const formattedDate = format(date, 'MMM dd, yyyy');
  const formattedTime = format(date, 'h:mm a');

  return (
    <Card className="rounded-xl shadow-sm border border-divider hover:shadow-md transition-shadow">
      <CardBody className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {appointment.patient_name ? appointment.patient_name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <h3 className="font-bold text-text-primary">{appointment.patient_name || 'Unknown'}</h3>
              <p className="text-sm text-text-secondary">Patient</p>
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formattedTime} ({appointment.duration_minutes} min)</span>
          </div>
        </div>

        {appointment.reason && (
          <div className="mb-4">
            <p className="text-sm text-text-primary line-clamp-2">
              <span className="font-medium">Reason: </span>
              {appointment.reason}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-divider">
          {appointment.status === 'REQUESTED' && (
            <>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 p-2"
                onClick={() => onAction('CONFIRM', appointment)}
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Confirm
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 p-2"
                onClick={() => onAction('REJECT', appointment)}
              >
                <XCircle className="w-4 h-4 mr-1" /> Reject
              </Button>
            </>
          )}
          
          {appointment.status === 'CONFIRMED' && (
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 p-2"
              onClick={() => onAction('COMPLETE', appointment)}
            >
              <PlayCircle className="w-4 h-4 mr-1" /> Mark Completed
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="flex-1 p-2"
            onClick={() => navigate(`/doctor/appointments/${appointment.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
