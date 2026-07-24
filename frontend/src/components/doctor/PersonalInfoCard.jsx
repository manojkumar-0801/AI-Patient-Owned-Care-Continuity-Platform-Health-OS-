import React from 'react';
import { Card, CardBody } from '../ui';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export const PersonalInfoCard = ({ profile }) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Personal Information</h2>
      </div>
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <User className="h-4 w-4" /> Full Name
            </p>
            <p className="text-text-primary">{profile?.user?.first_name} {profile?.user?.last_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </p>
            <p className="text-text-primary">{profile?.user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Phone className="h-4 w-4" /> Phone Number
            </p>
            <p className="text-text-primary">{profile?.user?.phone_number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Hospital/Clinic Address
            </p>
            <p className="text-text-primary">{profile?.hospital_address || 'N/A'}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
