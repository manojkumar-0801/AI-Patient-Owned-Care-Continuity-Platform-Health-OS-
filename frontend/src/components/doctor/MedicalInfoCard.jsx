import React from 'react';
import { Card, CardBody, Badge } from '../ui';
import { HeartPulse, AlertTriangle, Pill, ClipboardList } from 'lucide-react';

export const MedicalInfoCard = ({ patient }) => {
  return (
    <Card className="h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <HeartPulse className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Medical Information</h2>
      </div>
      <CardBody className="p-6">
        <div className="space-y-6">
          
          <div>
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-warning" /> Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.allergies && patient.allergies.length > 0 ? (
                patient.allergies.map((allergy, i) => (
                  <Badge key={i} variant="warning">{allergy}</Badge>
                ))
              ) : (
                <span className="text-sm text-text-tertiary">No known allergies</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
              <Pill className="h-4 w-4 text-primary" /> Current Medications
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.current_medications && patient.current_medications.length > 0 ? (
                patient.current_medications.map((med, i) => (
                  <Badge key={i} variant="outline">{med}</Badge>
                ))
              ) : (
                <span className="text-sm text-text-tertiary">No current medications</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
              <ClipboardList className="h-4 w-4 text-error" /> Chronic Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                patient.chronic_conditions.map((cond, i) => (
                  <Badge key={i} variant="error">{cond}</Badge>
                ))
              ) : (
                <span className="text-sm text-text-tertiary">No chronic conditions</span>
              )}
            </div>
          </div>

          <hr className="border-border" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Past Surgeries</h3>
              <p className="text-sm text-text-tertiary italic">No record (Placeholder)</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Family Medical History</h3>
              <p className="text-sm text-text-tertiary italic">No record (Placeholder)</p>
            </div>
            <div className="sm:col-span-2">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Lifestyle Information</h3>
              <p className="text-sm text-text-tertiary italic">Smoking, Alcohol data (Placeholder)</p>
            </div>
          </div>

        </div>
      </CardBody>
    </Card>
  );
};
