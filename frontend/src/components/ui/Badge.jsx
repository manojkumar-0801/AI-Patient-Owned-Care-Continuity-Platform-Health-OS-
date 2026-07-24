import React from 'react';

export const Badge = ({ 
  className = '', 
  variant = 'primary', 
  size = 'md',
  shape = 'pill',
  icon: Icon,
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors border';
  
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-surface text-text-secondary border-border',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-error/10 text-error border-error/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    // Fallbacks for backward compatibility
    default: 'bg-surface text-text-secondary border-border',
    error: 'bg-error/10 text-error border-error/20',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const shapes = {
    pill: 'rounded-full',
    rounded: 'rounded-md',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${shapes[shape] || shapes.pill} ${className}`} {...props}>
      {Icon && <Icon className={`${iconSizes[size] || iconSizes.md} flex-shrink-0`} />}
      {children}
    </span>
  );
};
