import React from 'react';
import { Card, CardBody, Badge } from '../ui';
import { Activity } from 'lucide-react';

export const TimelineReferences = () => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3">
        <Badge variant="outline" className="shadow-sm opacity-70">Coming Soon</Badge>
      </div>
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Activity className="h-5 w-5 text-text-secondary" />
        <h2 className="text-lg font-semibold text-text-primary">Related Timeline</h2>
      </div>
      <CardBody className="p-6 opacity-60">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 mt-2 rounded-full bg-border"></div>
            <div>
              <p className="text-sm font-medium text-text-primary">Previous Document</p>
              <p className="text-xs text-text-secondary">Related to this event (Placeholder)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 mt-2 rounded-full bg-border"></div>
            <div>
              <p className="text-sm font-medium text-text-primary">Next Appointment</p>
              <p className="text-xs text-text-secondary">Follow-up check (Placeholder)</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
