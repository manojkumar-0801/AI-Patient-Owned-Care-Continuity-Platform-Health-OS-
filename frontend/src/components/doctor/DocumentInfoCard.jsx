import React from 'react';
import { Card, CardBody, Badge } from '../ui';
import { FileText, Calendar, Building, Tag, HardDrive } from 'lucide-react';

export const DocumentInfoCard = ({ record }) => {
  
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <Card>
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Document Details</h2>
      </div>
      <CardBody className="p-6">
        <div className="space-y-4">
          
          <div>
            <h3 className="text-sm font-medium text-text-secondary flex items-center gap-2 mb-1">Title</h3>
            <p className="text-text-primary font-medium">{record.title}</p>
          </div>

          {record.description && (
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Description</h3>
              <p className="text-sm text-text-primary bg-surface-alt p-3 rounded-md border border-border">{record.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <h3 className="text-xs font-medium text-text-secondary flex items-center gap-1 mb-1">
                <Tag className="h-3 w-3" /> Category
              </h3>
              <Badge variant="outline">{record.category}</Badge>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-secondary flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3" /> Document Date
              </h3>
              <p className="text-sm text-text-primary">{record.document_date ? new Date(record.document_date).toLocaleDateString() : '--'}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-secondary flex items-center gap-1 mb-1">
                <Building className="h-3 w-3" /> Provider
              </h3>
              <p className="text-sm text-text-primary truncate" title={record.provider_name}>{record.provider_name || '--'}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-secondary flex items-center gap-1 mb-1">
                <HardDrive className="h-3 w-3" /> File Size
              </h3>
              <p className="text-sm text-text-primary">{formatBytes(record.file_size_bytes)}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
