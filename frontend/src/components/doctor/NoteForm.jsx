import React, { useState } from 'react';
import { Card, CardBody, Button, Input, Select, Textarea } from '../ui';
import { Save, X, Calendar } from 'lucide-react';

export const NoteForm = ({ initialData, patientId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    consultation_date: initialData?.consultation_date || new Date().toISOString().split('T')[0],
    consultation_type: initialData?.consultation_type || 'INITIAL',
    chief_complaint: initialData?.chief_complaint || '',
    symptoms: initialData?.symptoms || '',
    examination_findings: initialData?.examination_findings || '',
    diagnosis: initialData?.diagnosis || '',
    treatment_plan: initialData?.treatment_plan || '',
    prescription: initialData?.prescription || '',
    follow_up_instructions: initialData?.follow_up_instructions || '',
    status: initialData?.status || 'DRAFT',
    patient: patientId
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <Card className="animate-fade-in">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface-alt/50">
        <h2 className="text-lg font-semibold text-text-primary">
          {initialData ? 'Edit Consultation Note' : 'New Consultation Note'}
        </h2>
      </div>
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Information */}
          <div>
            <h3 className="text-md font-medium text-text-primary mb-4 border-b border-border pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Note Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Follow-up for Hypertension"
                required
              />
              <Input
                label="Consultation Date"
                type="date"
                name="consultation_date"
                value={formData.consultation_date}
                onChange={handleChange}
                required
              />
              <Select
                label="Consultation Type"
                name="consultation_type"
                value={formData.consultation_type}
                onChange={handleChange}
                options={[
                  { value: 'INITIAL', label: 'Initial' },
                  { value: 'FOLLOW_UP', label: 'Follow-up' },
                  { value: 'EMERGENCY', label: 'Emergency' },
                  { value: 'ROUTINE', label: 'Routine Checkup' }
                ]}
              />
            </div>
          </div>

          {/* Clinical Information */}
          <div>
            <h3 className="text-md font-medium text-text-primary mb-4 border-b border-border pb-2">Clinical Information</h3>
            <div className="space-y-4">
              <Textarea
                label="Chief Complaint"
                name="chief_complaint"
                value={formData.chief_complaint}
                onChange={handleChange}
                placeholder="Patient's primary reason for visit..."
                rows={2}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  label="Symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Reported symptoms..."
                  rows={3}
                />
                <Textarea
                  label="Examination Findings"
                  name="examination_findings"
                  value={formData.examination_findings}
                  onChange={handleChange}
                  placeholder="Clinical observations and vitals..."
                  rows={3}
                />
              </div>
              <Textarea
                label="Diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Primary and secondary diagnoses..."
                rows={2}
              />
              <Textarea
                label="Treatment Plan"
                name="treatment_plan"
                value={formData.treatment_plan}
                onChange={handleChange}
                placeholder="Recommended procedures, lifestyle changes..."
                rows={3}
              />
              <Textarea
                label="Prescription"
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                placeholder="Medications, dosage, frequency..."
                rows={3}
              />
              <Textarea
                label="Follow-up Instructions"
                name="follow_up_instructions"
                value={formData.follow_up_instructions}
                onChange={handleChange}
                placeholder="When to return, warning signs to watch for..."
                rows={2}
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'FINAL', label: 'Final (Read-only)' }
              ]}
              className="w-48"
            />
            <p className="text-sm text-text-secondary mt-5">
              Warning: Final notes cannot be edited later.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" iconLeft={X} onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" iconLeft={Save} loading={loading}>
              Save Note
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
