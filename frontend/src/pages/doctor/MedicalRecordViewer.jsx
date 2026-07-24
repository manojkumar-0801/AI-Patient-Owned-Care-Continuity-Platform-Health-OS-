import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import { Spinner, EmptyState, Button } from '../../components/ui';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { DocumentPreview } from '../../components/doctor/DocumentPreview';
import { DocumentInfoCard } from '../../components/doctor/DocumentInfoCard';
import { AISummaryCard } from '../../components/doctor/AISummaryCard';
import { TimelineReferences } from '../../components/doctor/TimelineReferences';
import { ViewerActions } from '../../components/doctor/ViewerActions';

export default function MedicalRecordViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await doctorService.getMedicalRecord(id);
        setRecord(data);
      } catch (err) {
        console.error("Failed to load medical record", err);
        setError("You are not authorized to view this record, or it does not exist.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner size="lg" label="Loading document viewer..." />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="max-w-3xl mx-auto mt-12 animate-fade-in">
        <EmptyState 
          icon={ShieldAlert}
          title="Access Denied"
          description={error || "Unable to load document."}
          action={
            <Button variant="outline" iconLeft={ArrowLeft} onClick={() => navigate('/doctor/patients')}>
              Return to Dashboard
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in max-w-screen-2xl mx-auto">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Medical Record Viewer</h1>
          <p className="text-text-secondary mt-1">
            Viewing document <span className="font-medium text-text-primary">{record.title}</span> for Patient <span className="font-mono text-text-primary">{record.patient}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" iconLeft={ArrowLeft} onClick={() => navigate(`/doctor/patients/${record.patient}`)}>
            Back to Patient
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left/Main Column: Document Preview (Spans 2 columns on XL screens) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <DocumentPreview record={record} />
        </div>

        {/* Right Column: Metadata, AI, Actions */}
        <div className="flex flex-col gap-6">
          <ViewerActions record={record} />
          <DocumentInfoCard record={record} />
          <AISummaryCard />
          <TimelineReferences />
        </div>

      </div>
    </div>
  );
}
