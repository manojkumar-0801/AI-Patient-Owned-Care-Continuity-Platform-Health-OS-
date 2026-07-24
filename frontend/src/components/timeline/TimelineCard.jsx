import React from 'react';
import { Card, CardBody, Badge } from '../../ui';

export const TimelineCard = ({ date, title, description, icon: Icon, type }) => {
  return (
    <div className="relative pl-8 md:pl-0">
      <div className="md:hidden absolute left-0 top-6 w-px h-full bg-border -translate-x-1/2 z-0" />
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 relative z-10">
        <div className="hidden md:flex flex-col items-end shrink-0 w-32 pt-5">
          <span className="text-sm font-semibold text-text-primary">{date}</span>
        </div>
        
        <div className="absolute left-0 md:relative md:left-auto top-5 md:top-0 -translate-x-1/2 md:translate-x-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center shrink-0 mt-0 md:mt-3 shadow-sm z-10">
           {Icon ? <Icon className="w-4 h-4 text-primary" /> : <div className="w-2 h-2 rounded-full bg-primary" />}
        </div>
        
        <Card className="flex-1 hover:border-primary/50 transition-colors">
          <CardBody className="p-5">
            <div className="md:hidden mb-2">
              <span className="text-xs font-semibold text-text-secondary">{date}</span>
            </div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold text-text-primary text-lg">{title}</h3>
              <Badge variant="secondary" size="sm">{type}</Badge>
            </div>
            {description && (
              <p className="text-text-secondary text-sm mt-2">{description}</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
