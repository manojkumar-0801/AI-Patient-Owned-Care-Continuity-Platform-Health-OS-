import React from 'react';
import { Paperclip, Download } from 'lucide-react';
import { Button } from '../ui';

export const TimelineAttachments = ({ fileName, fileUrl, fileSize }) => {
  if (!fileUrl && !fileName) return null;

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `(${mb.toFixed(2)} MB)`;
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center">
        <Paperclip className="w-4 h-4 mr-2" />
        Attachments
      </h4>
      <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <Paperclip className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-text-primary truncate">
              {fileName || 'Document File'}
            </span>
            {fileSize && (
              <span className="text-xs text-text-secondary">
                {formatSize(fileSize)}
              </span>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!fileUrl}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};
