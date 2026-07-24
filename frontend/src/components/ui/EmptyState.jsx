import React from 'react';
import { Button } from './Button';
import { Search, AlertCircle, ShieldAlert, Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: CustomIcon,
  title,
  description,
  action, 
  actionText, 
  onAction, 
  variant = 'default', 
  className = '',
}) => {
  const defaultIcons = {
    default: Inbox,
    search: Search,
    error: AlertCircle,
    permission: ShieldAlert,
  };

  const Icon = CustomIcon || defaultIcons[variant] || defaultIcons.default;

  const iconColors = {
    default: 'text-text-secondary bg-secondary',
    search: 'text-primary bg-primary/10',
    error: 'text-error bg-error/10',
    permission: 'text-warning bg-warning/10',
  };

  const currentIconColor = iconColors[variant] || iconColors.default;

  return (
    <div className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-8 md:p-12 text-center animate-fade-in ${className}`}>
      {Icon && (
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${currentIconColor}`}>
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
      )}
      {title && <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>}
      {description && <p className="text-text-secondary max-w-sm mx-auto mb-6">{description}</p>}
      
      {action ? (
        <div>{action}</div>
      ) : actionText && onAction ? (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      ) : null}
    </div>
  );
};
