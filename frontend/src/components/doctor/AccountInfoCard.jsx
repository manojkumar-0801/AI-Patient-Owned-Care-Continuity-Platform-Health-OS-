import React from 'react';
import { Card, CardBody, Badge } from '../ui';
import { Shield, Clock } from 'lucide-react';

export const AccountInfoCard = ({ profile }) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Account Information</h2>
      </div>
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Account Role</p>
            <Badge variant="primary">DOCTOR</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Status</p>
            <Badge variant={profile?.user?.is_active ? "success" : "error"}>
              {profile?.user?.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Created Date
            </p>
            <p className="text-text-primary">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Last Updated
            </p>
            <p className="text-text-primary">
              {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
