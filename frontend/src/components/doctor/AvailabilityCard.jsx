import React from 'react';
import { Card, CardBody, Badge } from '../ui';
import { Calendar, Clock, Monitor } from 'lucide-react';

export const AvailabilityCard = ({ profile }) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Availability</h2>
      </div>
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Working Days
            </p>
            <div className="flex flex-wrap gap-2">
              {profile?.working_days?.length > 0 ? (
                profile.working_days.map(day => (
                  <Badge key={day} variant="outline">{day}</Badge>
                ))
              ) : (
                <span className="text-text-primary text-sm">Not specified</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Working Hours
            </p>
            <p className="text-text-primary">{profile?.working_hours || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
              <Monitor className="h-4 w-4" /> Consultation Mode
            </p>
            <Badge variant="primary" className="uppercase">
              {profile?.consultation_mode?.replace('_', ' ') || 'N/A'}
            </Badge>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
