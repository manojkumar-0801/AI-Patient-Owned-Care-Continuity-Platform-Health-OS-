import React from 'react';
import { Card, CardBody } from '../ui';
import { User, Activity, Ruler, Weight, Calendar } from 'lucide-react';

export const PatientSummaryCard = ({ patient }) => {
  return (
    <Card className="h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Biological Summary</h2>
      </div>
      <CardBody className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4" /> Date of Birth
            </p>
            <p className="text-text-primary">{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : '--'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
              <User className="h-4 w-4" /> Age
            </p>
            <p className="text-text-primary">{patient.age ? `${patient.age} years` : '--'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4" /> Blood Group
            </p>
            <p className="text-text-primary">{patient.blood_group || '--'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
              <User className="h-4 w-4" /> Gender
            </p>
            <p className="text-text-primary capitalize">{patient.gender || '--'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
              <Ruler className="h-4 w-4" /> Height (Latest)
            </p>
            <p className="text-text-primary italic text-text-tertiary">-- cm (Placeholder)</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
              <Weight className="h-4 w-4" /> Weight (Latest)
            </p>
            <p className="text-text-primary italic text-text-tertiary">-- kg (Placeholder)</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
