import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Users, Calendar, Activity } from 'lucide-react';
import { Card, CardBody } from '../../components/ui';

export default function DoctorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Welcome, Dr. <span className="text-primary">{user?.last_name || 'Doctor'}</span>
          </h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Here's an overview of your schedule and patients.
          </p>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">My Patients</p>
              <h3 className="text-2xl font-bold text-text-primary">0</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Today's Appointments</p>
              <h3 className="text-2xl font-bold text-text-primary">0</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-text-primary">0</h3>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
