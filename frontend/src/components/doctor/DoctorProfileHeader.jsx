import React from 'react';
import { Card, CardBody, Badge, Button } from '../ui';
import { Edit2 } from 'lucide-react';

export const DoctorProfileHeader = ({ profile, onEdit }) => {
  const getInitials = () => {
    return `${profile?.user?.first_name?.[0] || ''}${profile?.user?.last_name?.[0] || ''}`.toUpperCase();
  };

  return (
    <Card className="bg-gradient-to-r from-surface to-primary/5">
      <CardBody className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-primary text-primary-foreground flex flex-shrink-0 items-center justify-center text-3xl md:text-5xl font-bold shadow-lg">
          {profile?.profile_photo ? (
            <img src={profile.profile_photo} alt="Profile" loading="lazy" className="h-full w-full object-cover rounded-full" />
          ) : (
            getInitials()
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-bold text-text-primary">
              Dr. {profile?.user?.first_name} {profile?.user?.last_name}
            </h1>
            <Badge variant={profile?.is_verified ? "success" : "warning"}>
              {profile?.is_verified ? "Verified" : "Pending Verification"}
            </Badge>
          </div>
          <p className="text-lg text-text-secondary">{profile?.specialization || 'General Practitioner'}</p>
          <p className="text-sm text-text-secondary font-mono">
            Registration No: {profile?.license_number || 'N/A'}
          </p>
        </div>

        <div className="flex-shrink-0 mt-4 md:mt-0">
          <Button variant="primary" iconLeft={Edit2} onClick={onEdit}>
            Edit Profile
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
