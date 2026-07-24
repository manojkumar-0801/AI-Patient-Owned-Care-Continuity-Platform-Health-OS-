import React from 'react';
import { Card, CardBody, Badge, Button } from '../ui';
import { Edit2, ArrowLeft, Calendar, FileText, Activity } from 'lucide-react';

export const NoteViewer = ({ note, onBack, onEdit }) => {
  
  const Section = ({ title, content }) => {
    if (!content) return null;
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2 border-b border-border pb-1">
          {title}
        </h4>
        <div className="text-text-primary whitespace-pre-wrap bg-surface-alt p-4 rounded-md border border-border/50">
          {content}
        </div>
      </div>
    );
  };

  return (
    <Card className="animate-fade-in">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface-alt/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" iconLeft={ArrowLeft} onClick={onBack}>Back</Button>
          <h2 className="text-lg font-semibold text-text-primary">Consultation Note</h2>
        </div>
        {note.status !== 'FINAL' && (
          <Button variant="outline" size="sm" iconLeft={Edit2} onClick={() => onEdit(note)}>
            Edit Note
          </Button>
        )}
      </div>
      
      <CardBody className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-border gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">{note.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {note.consultation_date ? new Date(note.consultation_date).toLocaleDateString() : '--'}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> {note.consultation_type?.replace('_', ' ')}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-4 w-4" /> {note.doctor_name}
              </span>
            </div>
          </div>
          <div>
            <Badge variant={note.status === 'FINAL' ? 'primary' : 'warning'} className="text-sm px-3 py-1">
              {note.status} Note
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <Section title="Chief Complaint" content={note.chief_complaint} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Symptoms" content={note.symptoms} />
            <Section title="Examination Findings" content={note.examination_findings} />
          </div>
          <Section title="Diagnosis" content={note.diagnosis} />
          <Section title="Treatment Plan" content={note.treatment_plan} />
          <Section title="Prescription" content={note.prescription} />
          <Section title="Follow-up Instructions" content={note.follow_up_instructions} />
          <Section title="Additional Notes" content={note.content} />
        </div>
      </CardBody>
    </Card>
  );
};
