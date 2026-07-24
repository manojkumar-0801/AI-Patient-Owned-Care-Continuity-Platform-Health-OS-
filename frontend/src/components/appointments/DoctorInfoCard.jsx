import React from 'react';
import { Card, CardBody } from '../ui';
import { Stethoscope, Phone, Mail } from 'lucide-react';

export const DoctorInfoCard = ({ appointment }) => {
  return (
    <Card className="rounded-xl shadow-sm h-full border-primary/10">
      <CardBody className="p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Doctor Information</h2>
        
        <div className="space-y-4">
          <div className="flex items-center text-text-secondary">
            <Stethoscope className="w-5 h-5 mr-3 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">Name & Specialization</p>
              <p className="text-sm">Dr. {appointment.doctor_name}</p>
              <p className="text-xs text-text-secondary mt-0.5">{appointment.doctor_specialization}</p>
            </div>
          </div>
          
          <div className="flex items-center text-text-secondary">
            <Mail className="w-5 h-5 mr-3 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">Email</p>
              <p className="text-sm truncate w-48" title={appointment.doctor_email}>
                {appointment.doctor_email || 'No email provided.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center text-text-secondary">
            <Phone className="w-5 h-5 mr-3 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">Contact</p>
              <p className="text-sm">{appointment.doctor_phone || 'No phone provided.'}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
