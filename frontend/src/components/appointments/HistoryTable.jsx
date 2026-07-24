import React from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { StatusBadge } from './StatusBadge';
import { Eye, FileText } from 'lucide-react';

export const HistoryTable = ({ appointments }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-divider overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light border-b border-divider">
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Doctor</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date & Time</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Reason</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Notes</th>
              <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
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
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        Dr.
                      </div>
                      <div>
                        <span className="font-medium text-text-primary block">{appt.doctor_name || 'Doctor'}</span>
                        <span className="text-xs text-text-secondary">{appt.doctor_specialization || 'Specialist'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-text-primary">{formattedDate}</div>
                    <div className="text-xs text-text-secondary">{formattedTime}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-text-secondary truncate max-w-[150px]" title={appt.reason}>
                      {appt.reason || 'No reason provided'}
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="p-4">
                    {appt.has_notes ? (
                      <div className="flex items-center gap-1 text-primary text-sm font-medium">
                        <FileText className="w-4 h-4" /> Available
                      </div>
                    ) : (
                      <span className="text-text-secondary text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="outline" 
                      className="p-2 inline-flex"
                      onClick={() => navigate(`/appointments/${appt.id}`)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
