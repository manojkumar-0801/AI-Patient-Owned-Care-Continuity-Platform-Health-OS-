import React from 'react';
import { Card, CardBody, Badge, Button } from '../ui';
import { PatientStatusBadge } from './PatientStatusBadge';
import { FileText, FilePlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PatientHeader = ({ patient }) => {
  const navigate = useNavigate();

  const getInitials = () => {
    return patient.full_name?.substring(0, 2).toUpperCase() || 'P';
  };

  return (
    <Card className="bg-gradient-to-r from-surface to-primary/5 mb-6">
      <CardBody className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Avatar and Info */}
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl flex-shrink-0 shadow-sm border border-primary/20">
            {patient.profile_photo ? (
              <img src={patient.profile_photo} alt={patient.full_name} className="h-full w-full rounded-full object-cover" />
            ) : (
              getInitials()
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-text-primary line-clamp-1">{patient.full_name}</h1>
              <PatientStatusBadge isActive={patient.is_active} />
            </div>
            <p className="text-sm text-text-secondary font-mono mb-2">ID: {patient.patient_id}</p>
            <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                Age: <span className="font-medium text-text-primary">{patient.age || '--'}</span>
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                Gender: <span className="font-medium text-text-primary capitalize">{patient.gender || '--'}</span>
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                Blood: {patient.blood_group ? <Badge variant="outline" size="sm">{patient.blood_group}</Badge> : <span className="font-medium text-text-primary">--</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="outline" iconLeft={ArrowLeft} onClick={() => navigate('/doctor/patients')}>
            Back to List
          </Button>
          <Button variant="outline" iconLeft={FileText} onClick={() => alert('View Medical Records')}>
            Records
          </Button>
          <Button variant="primary" iconLeft={FilePlus} onClick={() => alert('Add Doctor Note')}>
            Add Note
          </Button>
        </div>

      </CardBody>
    </Card>
  );
};
