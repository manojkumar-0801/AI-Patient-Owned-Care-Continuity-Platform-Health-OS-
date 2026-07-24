import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import { Spinner, EmptyState, Button } from '../../components/ui';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { PatientHeader } from '../../components/doctor/PatientHeader';
import { PatientSummaryCard } from '../../components/doctor/PatientSummaryCard';
import { ContactInfoCard } from '../../components/doctor/ContactInfoCard';
import { MedicalInfoCard } from '../../components/doctor/MedicalInfoCard';
import { RecentActivityCard } from '../../components/doctor/RecentActivityCard';
import { QuickNavigation } from '../../components/doctor/QuickNavigation';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await doctorService.getPatientDetails(id);
        setPatient(data);
      } catch (err) {
        console.error("Failed to load patient details", err);
        // If 404 or 403, we assume unauthorized or patient doesn't exist
        setError("You are not authorized to view this patient, or the patient does not exist.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner size="lg" label="Loading patient details..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-3xl mx-auto mt-12 animate-fade-in">
        <EmptyState 
          icon={ShieldAlert}
          title="Access Denied"
          description={error || "Unable to load patient information."}
          action={
            <Button variant="outline" iconLeft={ArrowLeft} onClick={() => navigate('/doctor/patients')}>
              Return to Patient List
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header Section */}
      <PatientHeader patient={patient} />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Summary & Contact) */}
        <div className="space-y-6 lg:col-span-1">
          <PatientSummaryCard patient={patient} />
          <ContactInfoCard patient={patient} />
        </div>

        {/* Right Column (Medical & Activity) */}
        <div className="space-y-6 lg:col-span-2">
          <QuickNavigation />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MedicalInfoCard patient={patient} />
            <RecentActivityCard patient={patient} />
          </div>
        </div>

      </div>
    </div>
  );
}
