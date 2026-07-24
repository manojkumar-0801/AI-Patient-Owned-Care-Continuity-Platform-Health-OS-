import React from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '../ui';
import { StatusBadge } from './StatusBadge';
import { CheckCircle, XCircle, PlayCircle, Eye } from 'lucide-react';

export const DoctorAppointmentTable = ({ appointments, onAction }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-divider overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light border-b border-divider">
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Patient Name</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date & Time</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Reason</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {appointments.map((appt) => {
              const date = parseISO(appt.scheduled_at);
              const formattedDate = format(date, 'MMM dd, yyyy');
              const formattedTime = format(date, 'h:mm a');

              return (
                <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {appt.patient_name ? appt.patient_name.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <span className="font-medium text-text-primary">{appt.patient_name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-text-primary">{formattedDate}</div>
                    <div className="text-xs text-text-secondary">{formattedTime}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-text-secondary truncate max-w-[200px]">
                      {appt.reason || 'No reason provided'}
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {appt.status === 'REQUESTED' && (
                        <>
                          <Button 
                            variant="outline" 
                            className="p-2 border-green-200 text-green-600 hover:bg-green-50"
                            onClick={() => onAction('CONFIRM', appt)}
                            title="Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            className="p-2 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => onAction('REJECT', appt)}
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {appt.status === 'CONFIRMED' && (
                        <Button 
                          variant="outline" 
                          className="p-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => onAction('COMPLETE', appt)}
                          title="Mark Completed"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="p-2"
                        onClick={() => navigate(`/doctor/appointments/${appt.id}`)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
