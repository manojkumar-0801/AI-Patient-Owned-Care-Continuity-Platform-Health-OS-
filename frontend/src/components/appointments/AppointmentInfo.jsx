import React from 'react';
import { Card, CardBody } from '../ui';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const AppointmentInfo = ({ appointment }) => {
  const date = parseISO(appointment.scheduled_at);
  const formattedDate = format(date, 'EEEE, MMMM dd, yyyy');
  const formattedTime = format(date, 'h:mm a');

  return (
    <Card className="rounded-xl shadow-sm border-primary/10">
      <CardBody className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-text-primary">Appointment Info</h2>
          <StatusBadge status={appointment.status} />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-text-secondary">
            <Calendar className="w-5 h-5 mr-3 text-primary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Date</p>
              <p className="text-sm">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-center text-text-secondary">
            <Clock className="w-5 h-5 mr-3 text-primary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Time</p>
              <p className="text-sm">{formattedTime} ({appointment.duration_minutes} min)</p>
            </div>
          </div>
          
          <div className="flex items-start text-text-secondary">
            <FileText className="w-5 h-5 mr-3 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">Reason for Visit</p>
              <p className="text-sm mt-1">{appointment.reason || 'No reason provided.'}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
