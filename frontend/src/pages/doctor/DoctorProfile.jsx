import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import { Spinner, Button } from '../../components/ui';
import { Users, LayoutDashboard, Key } from 'lucide-react';

import { DoctorProfileHeader } from '../../components/doctor/DoctorProfileHeader';
import { PersonalInfoCard } from '../../components/doctor/PersonalInfoCard';
import { ProfessionalInfoCard } from '../../components/doctor/ProfessionalInfoCard';
import { AvailabilityCard } from '../../components/doctor/AvailabilityCard';
import { AccountInfoCard } from '../../components/doctor/AccountInfoCard';

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await doctorService.getProfile();
        if (response.success) {
          setProfile(response.data);
        }
      } catch (err) {
        console.error("Failed to load doctor profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner size="lg" label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* 1. Profile Header */}
      <DoctorProfileHeader profile={profile} onEdit={() => alert('Edit mode not fully implemented yet')} />
      
      {/* Quick Actions (Row) */}
      <div className="flex flex-wrap gap-4 py-2">
        <Button variant="outline" iconLeft={LayoutDashboard} onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
        <Button variant="outline" iconLeft={Users} onClick={() => navigate('/doctor/patients')}>
          View Patients
        </Button>
        <Button variant="outline" iconLeft={Key}>
          Change Password
        </Button>
      </div>

      {/* Grid for Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          <PersonalInfoCard profile={profile} />
          <AvailabilityCard profile={profile} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ProfessionalInfoCard profile={profile} />
          <AccountInfoCard profile={profile} />
        </div>

      </div>
    </div>
  );
}
