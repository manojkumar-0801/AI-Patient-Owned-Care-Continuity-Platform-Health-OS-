import React from 'react';
import { Card, CardBody, Button, Badge } from '../ui';
import { Navigation, FileText, Calendar, Activity, BrainCircuit, ChevronRight, ClipboardList } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const QuickNavigation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <Card>
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Navigation className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Quick Navigation</h2>
      </div>
      <CardBody className="p-0 flex flex-col">
        <button 
          onClick={() => navigate(`/doctor/patients/${id}/notes`)}
          className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-surface-alt transition-colors group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-text-primary group-hover:text-primary transition-colors">Consultation Notes</p>
              <p className="text-xs text-text-secondary">View and add patient notes</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-text-secondary group-hover:text-primary transition-colors" />
        </button>

        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="flex-col h-auto py-4 gap-2 w-full justify-center">
            <FileText className="h-6 w-6 text-primary" />
            <span>Medical Records</span>
          </Button>
          
          <Button variant="outline" className="flex-col h-auto py-4 gap-2 w-full justify-center relative opacity-70 cursor-not-allowed pointer-events-none">
            <Badge variant="primary" className="absolute -top-2 -right-2 text-[10px] py-0 px-1">Sprint 6</Badge>
            <Activity className="h-6 w-6 text-text-secondary" />
            <span className="text-text-secondary">Timeline</span>
          </Button>

          <Button variant="outline" className="flex-col h-auto py-4 gap-2 w-full justify-center relative opacity-70 cursor-not-allowed pointer-events-none">
            <Badge variant="primary" className="absolute -top-2 -right-2 text-[10px] py-0 px-1">Sprint 5</Badge>
            <Calendar className="h-6 w-6 text-text-secondary" />
            <span className="text-text-secondary">Appointments</span>
          </Button>

          <Button variant="outline" className="flex-col h-auto py-4 gap-2 w-full justify-center relative opacity-70 cursor-not-allowed pointer-events-none">
            <Badge variant="primary" className="absolute -top-2 -right-2 text-[10px] py-0 px-1">Sprint 8</Badge>
            <BrainCircuit className="h-6 w-6 text-text-secondary" />
            <span className="text-text-secondary">AI Insights</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
