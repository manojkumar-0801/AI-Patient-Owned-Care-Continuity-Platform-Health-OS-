import React from 'react';
import { Card, CardBody, EmptyState } from '../ui';
import { Activity, Clock } from 'lucide-react';

export const RecentActivityCard = () => {
  return (
    <Card className="h-full">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
        </div>
      </div>
      <CardBody className="p-6">
        <div className="py-8">
           <EmptyState 
             icon={Activity} 
             title="No recent activity" 
             description="Recent consultations and medical records will appear here once the system is fully connected (Coming Soon)." 
           />
        </div>
      </CardBody>
    </Card>
  );
};
