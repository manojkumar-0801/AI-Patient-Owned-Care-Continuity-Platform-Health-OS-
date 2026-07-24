import React from 'react';
import { Card, CardBody, Badge } from '../ui';
import { TimelineIcon } from './TimelineIcon';
import { TimelineMetadata } from './TimelineMetadata';
import { TimelineAttachments } from './TimelineAttachments';

export const TimelineDetailCard = ({ event }) => {
  if (!event) return null;

  const { type, title, status, description } = event;

  const getStatusColor = (s) => {
    if (!s) return 'secondary';
    const lower = s.toLowerCase();
    if (lower === 'requested') return 'warning';
    if (lower === 'confirmed' || lower === 'completed' || lower === 'uploaded' || lower === 'ready' || lower === 'final') return 'success';
    if (lower === 'cancelled' || lower === 'failed') return 'danger';
    return 'primary';
  };

  // Compile metadata specifically based on the returned fields
  const buildMetadata = () => {
    const meta = {
      'Date': new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      'Type': type.replace('_', ' '),
    };

    if (event.doctor) meta['Doctor'] = event.doctor;
    if (event.provider) meta['Provider'] = event.provider;
    if (event.category) meta['Category'] = event.category;
    if (event.duration_minutes) meta['Duration'] = `${event.duration_minutes} minutes`;

    return meta;
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardBody className="p-6 md:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 pb-8 border-b border-border">
          <TimelineIcon type={type} />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-2">
              {title}
            </h1>
            {status && (
              <Badge variant={getStatusColor(status)} className="uppercase text-xs font-bold tracking-wider">
                {status}
              </Badge>
            )}
          </div>
        </div>

        {/* Metadata Section */}
        <TimelineMetadata data={buildMetadata()} />

        {/* Dynamic Content Section */}
        <div className="space-y-6 text-text-primary">
          {event.description && (
            <div className="prose prose-sm md:prose-base max-w-none text-text-secondary">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Description / Reason</h4>
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
          
          {event.notes && (
            <div className="prose prose-sm md:prose-base max-w-none text-text-secondary mt-6">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Consultation Notes</h4>
              <p className="whitespace-pre-wrap">{event.notes}</p>
            </div>
          )}

          {event.chief_complaint && (
            <div className="prose prose-sm md:prose-base max-w-none text-text-secondary mt-6">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Chief Complaint</h4>
              <p className="whitespace-pre-wrap">{event.chief_complaint}</p>
            </div>
          )}

          {event.diagnosis && (
            <div className="prose prose-sm md:prose-base max-w-none text-text-secondary mt-6">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Diagnosis</h4>
              <p className="whitespace-pre-wrap">{event.diagnosis}</p>
            </div>
          )}

          {event.treatment_plan && (
            <div className="prose prose-sm md:prose-base max-w-none text-text-secondary mt-6">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Treatment Plan</h4>
              <p className="whitespace-pre-wrap">{event.treatment_plan}</p>
            </div>
          )}

          {event.prescription && (
            <div className="prose prose-sm md:prose-base max-w-none text-text-secondary mt-6">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Prescription</h4>
              <p className="whitespace-pre-wrap">{event.prescription}</p>
            </div>
          )}
        </div>

        {/* Attachments Section */}
        {(event.file_url || event.file_name) && (
          <TimelineAttachments 
            fileName={event.file_name} 
            fileUrl={event.file_url} 
            fileSize={event.file_size} 
          />
        )}
        
      </CardBody>
    </Card>
  );
};
