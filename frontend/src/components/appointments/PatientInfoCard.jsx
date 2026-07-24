import React from 'react';
import { Card, CardBody } from '../ui';
import { User, Phone, Users } from 'lucide-react';

export const PatientInfoCard = ({ appointment }) => {
  return (
    <Card className="rounded-xl shadow-sm h-full border-primary/10">
      <CardBody className="p-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Patient Information</h2>
        
        <div className="space-y-4">
          <div className="flex items-center text-text-secondary">
            <User className="w-5 h-5 mr-3 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">Name</p>
              <p className="text-sm">{appointment.patient_name}</p>
            </div>
          </div>
          
          <div className="flex items-center text-text-secondary">
            <Users className="w-5 h-5 mr-3 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">Gender & Age</p>
              <p className="text-sm">
                {appointment.patient_gender ? appointment.patient_gender : 'Not specified'} 
                {appointment.patient_age ? `, ${appointment.patient_age} yrs` : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center text-text-secondary">
            <Phone className="w-5 h-5 mr-3 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">Contact</p>
              <p className="text-sm">{appointment.patient_phone || 'No phone provided.'}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
