import React from 'react';
import { Card, CardBody, Badge, Button } from '../ui';
import { PatientStatusBadge } from './PatientStatusBadge';
import { Eye, FileText, FilePlus, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PatientCard = ({ patient }) => {
  const navigate = useNavigate();

  const getInitials = () => {
    return patient.full_name?.substring(0, 2).toUpperCase() || 'P';
  };

  return (
    <Card className="hover:shadow-md transition-shadow group h-full flex flex-col">
      <CardBody className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
              {patient.profile_photo ? (
                <img src={patient.profile_photo} alt={patient.full_name} className="h-full w-full rounded-full object-cover" />
              ) : (
                getInitials()
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary line-clamp-1">{patient.full_name}</h3>
              <p className="text-sm text-text-secondary font-mono">{patient.patient_id}</p>
            </div>
          </div>
          <PatientStatusBadge isActive={patient.is_active} />
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-text-secondary mb-6">
          <div className="flex flex-col">
            <span className="text-xs text-text-tertiary">Age / Gender</span>
            <span className="font-medium text-text-primary">
              {patient.age || '--'} / {patient.gender ? patient.gender.charAt(0).toUpperCase() : '--'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-tertiary">Blood Group</span>
            <span className="font-medium text-text-primary">
              {patient.blood_group ? <Badge variant="outline" className="text-xs py-0.5 px-2">{patient.blood_group}</Badge> : '--'}
            </span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-xs text-text-tertiary">Last Visit</span>
            <span className="font-medium text-text-primary flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {patient.last_visit_date ? new Date(patient.last_visit_date).toLocaleDateString() : 'No previous visits'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button variant="outline" size="sm" iconLeft={Eye} onClick={() => navigate(`/doctor/patients/${patient.id}`)}>
            Details
          </Button>
          <Button variant="outline" size="sm" iconLeft={FileText} onClick={() => alert('Medical Records')}>
            Records
          </Button>
          <Button variant="outline" size="sm" iconLeft={FilePlus} onClick={() => alert('Add Note')}>
            Note
          </Button>
          <Button variant="outline" size="sm" iconLeft={CalendarIcon} onClick={() => alert('Appointments')}>
            Appt
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
