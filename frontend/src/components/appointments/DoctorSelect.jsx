import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import { Select } from '../ui';

export const DoctorSelect = ({ value, onChange, error }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await appointmentService.getAvailableDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to load doctors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const options = doctors.map(doc => ({
    value: doc.id.toString(),
    label: `Dr. ${doc.full_name} - ${doc.specialization}`
  }));

  return (
    <Select
      label="Select a Doctor"
      name="doctor"
      value={value}
      onChange={onChange}
      options={[{ value: '', label: 'Select a Doctor' }, ...options]}
      error={error}
      disabled={loading}
    />
  );
};
