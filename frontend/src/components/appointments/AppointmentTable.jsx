import React from 'react';
import { StatusBadge } from './StatusBadge';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const AppointmentTable = ({ appointments, role }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto bg-surface rounded-xl shadow-sm border border-divider">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-background-light border-b border-divider text-text-secondary text-sm">
            <th className="py-3 px-4 font-medium">Date & Time</th>
            <th className="py-3 px-4 font-medium">{role === 'DOCTOR' ? 'Patient' : 'Doctor'}</th>
            <th className="py-3 px-4 font-medium">Reason</th>
            <th className="py-3 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">
          {appointments.map((appt) => {
            const date = parseISO(appt.scheduled_at);
            const otherPersonName = role === 'DOCTOR' ? appt.patient_name : `Dr. ${appt.doctor_name}`;
            const detailPath = role === 'DOCTOR' ? `/doctor/appointments/${appt.id}` : `/appointments/${appt.id}`;
            
            return (
              <tr 
                key={appt.id} 
                className="hover:bg-primary/5 transition-colors group cursor-pointer"
                onClick={() => navigate(detailPath)}
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-text-primary">{format(date, 'MMM dd, yyyy')}</div>
                  <div className="text-sm text-text-secondary">{format(date, 'h:mm a')}</div>
                </td>
                <td className="py-3 px-4 text-text-primary font-medium">
                  {otherPersonName}
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary max-w-xs truncate" title={appt.reason}>
                  {appt.reason || '-'}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={appt.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
