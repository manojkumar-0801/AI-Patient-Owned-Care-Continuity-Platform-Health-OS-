import React, { useState } from 'react';
import { DoctorSelect } from './DoctorSelect';
import { Input, Textarea, Button } from '../ui';
import { Calendar } from 'lucide-react';

export const AppointmentForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // clear error for the field when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.doctor) newErrors.doctor = 'Please select a doctor.';
    if (!formData.date) newErrors.date = 'Appointment date is required.';
    if (!formData.time) newErrors.time = 'Appointment time is required.';
    if (!formData.reason.trim()) newErrors.reason = 'Reason cannot be empty.';
    
    // Check if date is in the past
    if (formData.date && formData.time) {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`);
      if (scheduledAt < new Date()) {
        newErrors.date = 'Appointment date and time cannot be in the past.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Combine date and time to ISO string
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      onSubmit({
        doctor: formData.doctor,
        scheduled_at: scheduledAt,
        reason: formData.reason
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DoctorSelect 
        value={formData.doctor} 
        onChange={handleChange} 
        error={errors.doctor} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
        />
        <Input
          label="Time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          error={errors.time}
        />
      </div>

      <Textarea
        label="Reason for Visit"
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        placeholder="Briefly describe your symptoms or reason for the appointment"
        rows={4}
        error={errors.reason}
      />

      <Button 
        type="submit" 
        variant="primary" 
        className="w-full" 
        iconLeft={Calendar}
        loading={loading}
      >
        Book Appointment
      </Button>
    </form>
  );
};
