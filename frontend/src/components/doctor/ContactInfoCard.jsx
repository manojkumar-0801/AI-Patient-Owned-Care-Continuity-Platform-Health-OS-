import React from 'react';
import { Card, CardBody, EmptyState } from '../ui';
import { Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

export const ContactInfoCard = ({ patient }) => {
  const hasEmergencyContact = patient.emergency_name || patient.emergency_phone;

  return (
    <Card className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Phone className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Contact & Emergency</h2>
      </div>
      <CardBody className="p-6 flex-1 flex flex-col">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4" /> Email
              </p>
              <p className="text-text-primary truncate" title={patient.email}>{patient.email || '--'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
                <Phone className="h-4 w-4" /> Phone Number
              </p>
              <p className="text-text-primary">{patient.phone_number || '--'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4" /> Address
              </p>
              <p className="text-text-primary italic text-text-tertiary">Address not provided (Placeholder)</p>
            </div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-error" /> Emergency Contact
            </h3>
            
            {hasEmergencyContact ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Name</p>
                  <p className="text-text-primary">{patient.emergency_name || '--'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Phone</p>
                  <p className="text-text-primary">{patient.emergency_phone || '--'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-text-secondary mb-1">Relationship</p>
                  <p className="text-text-primary">{patient.emergency_relation || '--'}</p>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <EmptyState 
                  icon={AlertCircle} 
                  title="No emergency contact" 
                  description="This patient has not provided emergency contact details." 
                />
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
