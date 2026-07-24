import React, { useState } from 'react';
import { Card, CardBody, EmptyState, Button } from '../ui';
import { FileQuestion, Download, Loader2 } from 'lucide-react';

export const DocumentPreview = ({ record }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fileUrl = record.file;
  const fileType = record.file_type?.toLowerCase() || '';

  // Determine if it's previewable inline
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType);
  const isPdf = fileType === 'pdf';
  const isPreviewable = isImage || isPdf;

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text-primary">Document Preview</h2>
        {fileUrl && (
           <Button variant="outline" size="sm" iconLeft={Download} onClick={handleDownload} className="md:hidden">
             Download
           </Button>
        )}
      </div>
      <CardBody className="p-0 flex-1 flex flex-col min-h-[500px] relative bg-surface-alt">
        
        {!fileUrl && (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState 
              icon={FileQuestion} 
              title="File Missing" 
              description="This document record does not have an attached file." 
            />
          </div>
        )}

        {fileUrl && !isPreviewable && (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState 
              icon={FileQuestion} 
              title="Preview not available" 
              description={`The file type (${fileType.toUpperCase()}) cannot be previewed in the browser.`} 
              action={
                <Button variant="primary" iconLeft={Download} onClick={handleDownload}>
                  Download File
                </Button>
              }
            />
          </div>
        )}

        {fileUrl && isPreviewable && (
          <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-white/5">
            {loading && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-alt/80 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
                 <EmptyState 
                  icon={FileQuestion} 
                  title="Failed to load preview" 
                  description="There was an error rendering the document. The browser might be blocking it."
                  action={
                    <Button variant="outline" iconLeft={Download} onClick={handleDownload}>
                      Download Instead
                    </Button>
                  }
                />
              </div>
            )}

            {isImage && (
              <img 
                src={fileUrl} 
                alt={record.title}
                className={`max-w-full max-h-[800px] object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
              />
            )}

            {isPdf && (
              <iframe 
                src={`${fileUrl}#view=FitH`}
                title={record.title}
                className="w-full h-full min-h-[700px] border-none"
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
              />
            )}
          </div>
        )}

      </CardBody>
    </Card>
  );
};
