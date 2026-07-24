import React from 'react';
import { Card, CardBody } from '../ui';
import { Users, Clock, CheckCircle, CheckSquare } from 'lucide-react';

export const DashboardStats = ({ stats }) => {
  const statItems = [
    { label: 'Total Appointments', value: stats.total || 0, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Pending Requests', value: stats.requested || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Confirmed', value: stats.confirmed || 0, icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: stats.completed || 0, icon: CheckSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="rounded-xl shadow-sm border-primary/10 hover:shadow-md transition-shadow">
            <CardBody className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">{item.label}</p>
                <h3 className="text-3xl font-bold text-text-primary">{item.value}</h3>
              </div>
              <div className={`p-4 rounded-full ${item.bg} ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};
