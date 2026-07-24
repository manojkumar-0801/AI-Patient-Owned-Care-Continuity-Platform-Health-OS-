import React from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button } from '../ui';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, Eye, FileText } from 'lucide-react';

export const HistoryCard = ({ appointment }) => {
  const navigate = useNavigate();
  const date = parseISO(appointment.scheduled_at);
  const formattedDate = format(date, 'MMM dd, yyyy');
  const formattedTime = format(date, 'h:mm a');

  return (
    <Card className="rounded-xl shadow-sm border border-divider hover:shadow-md transition-shadow">
      <CardBody className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              Dr.
            </div>
            <div>
              <h3 className="font-bold text-text-primary">{appointment.doctor_name || 'Doctor'}</h3>
              <p className="text-sm text-text-secondary">{appointment.doctor_specialization || 'Specialist'}</p>
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
          
          {appointment.has_notes && (
            <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 w-max px-2 py-1 rounded-md">
              <FileText className="w-4 h-4" />
              <span>Consultation Notes Available</span>
            </div>
          )}
        </div>

        {appointment.reason && (
          <div className="mb-4">
            <p className="text-sm text-text-primary line-clamp-2">
              <span className="font-medium">Reason: </span>
              {appointment.reason}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-divider">
          <Button 
            variant="outline" 
            className="w-full justify-center p-2"
            onClick={() => navigate(`/appointments/${appointment.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" /> View Details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
