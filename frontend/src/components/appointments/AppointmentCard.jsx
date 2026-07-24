import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Card, CardBody } from '../ui';
import { Calendar, Clock, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const AppointmentCard = ({ appointment, role }) => {
  const navigate = useNavigate();
  const date = parseISO(appointment.scheduled_at);
  const formattedDate = format(date, 'MMM dd, yyyy');
  const formattedTime = format(date, 'h:mm a');

  const otherPersonName = role === 'DOCTOR' ? appointment.patient_name : appointment.doctor_name;
  const personRoleLabel = role === 'DOCTOR' ? 'Patient' : 'Doctor';
  const detailPath = role === 'DOCTOR' ? `/doctor/appointments/${appointment.id}` : `/appointments/${appointment.id}`;

  return (
    <Card 
      className="mb-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(detailPath)}
    >
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <div className="flex items-center text-text-primary font-medium">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              {formattedDate}
            </div>
            <div className="flex items-center text-text-secondary text-sm">
              <Clock className="w-4 h-4 mr-2" />
              {formattedTime}
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="border-t border-divider pt-3 mt-3">
          <div className="flex items-center text-sm mb-2">
            <User className="w-4 h-4 mr-2 text-text-secondary" />
            <span className="text-text-secondary mr-1">{personRoleLabel}:</span>
            <span className="font-medium text-text-primary">
              {role !== 'DOCTOR' ? `Dr. ${otherPersonName}` : otherPersonName}
            </span>
          </div>
          {appointment.reason && (
            <p className="text-sm text-text-secondary mt-2 line-clamp-2">
              <span className="font-medium mr-1">Reason:</span>
              {appointment.reason}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
