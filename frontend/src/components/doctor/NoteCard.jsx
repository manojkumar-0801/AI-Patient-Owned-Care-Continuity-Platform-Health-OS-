import React from 'react';
import { Card, CardBody, Badge, Button } from '../ui';
import { FileText, Calendar, Edit2, Trash2, Eye } from 'lucide-react';

export const NoteCard = ({ note, onView, onEdit, onDelete }) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <CardBody className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {note.title || `${note.consultation_type.replace('_', ' ')} Note`}
            </h3>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {note.consultation_date ? new Date(note.consultation_date).toLocaleDateString() : '--'}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {note.doctor_name || 'Doctor'}
              </span>
            </div>
          </div>
          <Badge variant={note.status === 'FINAL' ? 'primary' : 'warning'}>
            {note.status}
          </Badge>
        </div>

        <div className="text-sm text-text-primary mb-4 bg-surface-alt p-3 rounded-md line-clamp-2">
          {note.chief_complaint || note.diagnosis || note.content || "No clinical information provided yet."}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <p className="text-xs text-text-secondary">Last updated: {new Date(note.updated_at).toLocaleDateString()}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" iconLeft={Eye} onClick={() => onView(note)}>View</Button>
            {note.status !== 'FINAL' && (
               <Button variant="outline" size="sm" iconLeft={Edit2} onClick={() => onEdit(note)}>Edit</Button>
            )}
            <Button variant="outline" size="sm" iconLeft={Trash2} onClick={() => onDelete(note)} className="text-error hover:bg-error/10 hover:border-error hover:text-error">
              Delete
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
