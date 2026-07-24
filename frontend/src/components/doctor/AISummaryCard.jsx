import React from 'react';
import { Card, CardBody, Badge } from '../ui';
import { BrainCircuit } from 'lucide-react';

export const AISummaryCard = () => {
  return (
    <Card className="bg-gradient-to-br from-surface to-primary/5 border-primary/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3">
        <Badge variant="primary" className="shadow-sm">Sprint 8</Badge>
      </div>
      <div className="px-6 py-4 border-b border-primary/10 flex items-center gap-3">
        <BrainCircuit className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">AI Summary</h2>
      </div>
      <CardBody className="p-6">
        <div className="bg-surface/60 backdrop-blur-sm rounded-md p-4 border border-primary/10 border-dashed text-center">
          <p className="text-text-secondary text-sm italic">
            "AI-generated summary will be available after AI integration."
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
