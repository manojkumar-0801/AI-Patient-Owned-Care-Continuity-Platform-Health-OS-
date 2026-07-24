import React from 'react';
import { Card, CardBody, Badge } from '../ui';
import { TimelineIcon } from './TimelineIcon';
import { TimelineDate } from './TimelineDate';
import { useNavigate } from 'react-router-dom';

export const TimelineItem = ({ event, isLast }) => {
  const navigate = useNavigate();
  const { type, title, description, date, status } = event;

  const getStatusColor = (s) => {
    if (!s) return 'secondary';
    const lower = s.toLowerCase();
    if (lower === 'requested') return 'warning';
    if (lower === 'confirmed' || lower === 'completed' || lower === 'uploaded' || lower === 'ready' || lower === 'final') return 'success';
    if (lower === 'cancelled' || lower === 'failed') return 'danger';
    return 'primary';
  };

  return (
    <div className="relative flex gap-6 md:gap-8">
      {/* Date Column (Left) - Hidden on very small screens, displayed normally otherwise */}
      <div className="hidden sm:block pt-3">
        <TimelineDate date={date} />
      </div>

      {/* Center Line and Icon */}
      <div className="relative flex flex-col items-center">
        <TimelineIcon type={type} />
        {!isLast && <div className="absolute top-10 bottom-[-1.5rem] w-px bg-border -z-10" />}
      </div>

      {/* Card Content (Right) */}
      <div className="flex-1 pb-8">
        <Card className="hover:border-primary/50 transition-colors shadow-sm h-full cursor-pointer hover:shadow-md" onClick={() => navigate(`/timeline/${event.id}`)}>
          <CardBody className="p-5 flex flex-col justify-center h-full">
            <div className="sm:hidden mb-3">
              <span className="text-xs font-semibold text-text-secondary uppercase">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-text-primary text-lg leading-tight group-hover:text-primary transition-colors">{title}</h3>
              {status && (
                <Badge variant={getStatusColor(status)} size="sm" className="w-fit shrink-0">
                  {status}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-text-secondary text-sm mt-2 line-clamp-3 leading-relaxed">
                {description}
              </p>
            )}
            <div className="mt-4 flex items-center text-sm font-medium text-primary">
              View Details <span className="ml-1">→</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
