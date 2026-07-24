import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import { Spinner, EmptyState, Button, Input, Select } from '../../components/ui';
import { ShieldAlert, Plus, ArrowLeft, FileText, Search, X } from 'lucide-react';
import { NoteCard } from '../../components/doctor/NoteCard';
import { NoteForm } from '../../components/doctor/NoteForm';
import { NoteViewer } from '../../components/doctor/NoteViewer';
import { AIInsightsCard } from '../../components/doctor/AIInsightsCard';

export default function DoctorNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewState, setViewState] = useState('LIST'); // 'LIST', 'CREATE', 'EDIT', 'VIEW'
  const [selectedNote, setSelectedNote] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      // First try to fetch the patient info for the header (optional but good for UX)
      try {
        const patientData = await doctorService.getPatientDetails(id);
        setPatient(patientData);
      } catch (e) {
        // Not critical if we just want notes, but good to have
      }
      
      const notesData = await doctorService.getPatientNotes(id);
      setNotes(notesData);
      setError(null);
    } catch (err) {
      console.error("Failed to load notes", err);
      setError("Unable to load patient notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaveNote = async (formData) => {
    try {
      if (viewState === 'CREATE') {
        await doctorService.createNote(formData);
      } else if (viewState === 'EDIT') {
        await doctorService.updateNote(selectedNote.id, formData);
      }
      setViewState('LIST');
      fetchNotes();
    } catch (err) {
      console.error("Failed to save note", err);
      alert("Failed to save note. Please check the form and try again.");
    }
  };

  const handleDelete = async (note) => {
    if (window.confirm("Delete Consultation Note?\n\nThis action cannot be undone.")) {
      try {
        await doctorService.deleteNote(note.id);
        fetchNotes();
      } catch (err) {
        console.error("Failed to delete note", err);
        alert("Failed to delete note.");
      }
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchTerm === '' || 
      (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (note.diagnosis && note.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || note.status === statusFilter;
    const matchesType = typeFilter === '' || note.consultation_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading && viewState === 'LIST' && notes.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner size="lg" label="Loading consultation notes..." />
      </div>
    );
  }

  if (error && viewState === 'LIST') {
    return (
      <div className="max-w-3xl mx-auto mt-12 animate-fade-in">
        <EmptyState 
          icon={ShieldAlert}
          title="Error Loading Notes"
          description={error}
          action={
            <Button variant="outline" iconLeft={ArrowLeft} onClick={() => navigate(`/doctor/patients/${id}`)}>
              Return to Patient
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in max-w-screen-xl mx-auto">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Doctor Notes</h1>
          <p className="text-text-secondary mt-1">
            Patient: <span className="font-medium text-text-primary">{patient?.full_name || id}</span>
          </p>
        </div>
        
        {viewState === 'LIST' && (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" iconLeft={ArrowLeft} onClick={() => navigate(`/doctor/patients/${id}`)}>
              Patient Details
            </Button>
            <Button variant="outline" iconLeft={FileText} onClick={() => alert('Sprint 5: Medical Records')}>
              Medical Records
            </Button>
            <Button variant="primary" iconLeft={Plus} onClick={() => setViewState('CREATE')}>
              Add New Note
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {viewState === 'LIST' && (
            <>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-lg shadow-sm border border-border">
                <Input
                  placeholder="Search title or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                  className="flex-1"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'DRAFT', label: 'Draft' },
                    { value: 'FINAL', label: 'Final' }
                  ]}
                  className="w-full md:w-40"
                />
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Types' },
                    { value: 'INITIAL', label: 'Initial' },
                    { value: 'FOLLOW_UP', label: 'Follow-up' },
                    { value: 'EMERGENCY', label: 'Emergency' },
                    { value: 'ROUTINE', label: 'Routine Checkup' }
                  ]}
                  className="w-full md:w-48"
                />
                {(searchTerm || statusFilter || typeFilter) && (
                  <Button 
                    variant="ghost" 
                    iconLeft={X} 
                    onClick={() => { setSearchTerm(''); setStatusFilter(''); setTypeFilter(''); }}
                    className="md:w-auto w-full"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {/* Notes List */}
              {filteredNotes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No notes found"
                  description="There are no consultation notes matching your criteria."
                  action={
                    <Button variant="primary" iconLeft={Plus} onClick={() => setViewState('CREATE')}>
                      Create First Note
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredNotes.map(note => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      onView={(n) => { setSelectedNote(n); setViewState('VIEW'); }}
                      onEdit={(n) => { setSelectedNote(n); setViewState('EDIT'); }}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {viewState === 'CREATE' && (
            <NoteForm 
              patientId={id} 
              onSave={handleSaveNote} 
              onCancel={() => setViewState('LIST')} 
            />
          )}

          {viewState === 'EDIT' && (
             <NoteForm 
             initialData={selectedNote}
             patientId={id} 
             onSave={handleSaveNote} 
             onCancel={() => { setSelectedNote(null); setViewState('LIST'); }} 
           />
          )}

          {viewState === 'VIEW' && (
            <NoteViewer 
              note={selectedNote} 
              onBack={() => { setSelectedNote(null); setViewState('LIST'); }} 
              onEdit={(n) => setViewState('EDIT')}
            />
          )}
        </div>

        {/* Right Sidebar - Insights & Info */}
        <div className="space-y-6">
          <AIInsightsCard />
        </div>

      </div>
    </div>
  );
}
