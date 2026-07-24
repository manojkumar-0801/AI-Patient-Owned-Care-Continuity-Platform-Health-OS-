import React from 'react';
import { Card, CardBody } from '../ui';
import { Stethoscope, Award, Briefcase, Building } from 'lucide-react';

export const ProfessionalInfoCard = ({ profile }) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Stethoscope className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Professional Information</h2>
      </div>
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" /> Specialization
            </p>
            <p className="text-text-primary">{profile?.specialization || 'General Practitioner'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Award className="h-4 w-4" /> Qualification
            </p>
            <p className="text-text-primary">{profile?.qualification || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Experience
            </p>
            <p className="text-text-primary">{profile?.years_of_experience} years</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Building className="h-4 w-4" /> Hospital / Clinic
            </p>
            <p className="text-text-primary">{profile?.hospital_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" /> Department
            </p>
            <p className="text-text-primary">{profile?.department || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Award className="h-4 w-4" /> License Expiry
            </p>
            <p className="text-text-primary">{profile?.license_expiry_date || 'N/A'}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
