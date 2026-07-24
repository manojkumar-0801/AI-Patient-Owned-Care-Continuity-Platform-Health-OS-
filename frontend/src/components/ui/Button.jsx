import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  disabled = false,
  fullWidth = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  type = 'button',
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    success: 'bg-success text-primary-foreground hover:bg-success/90',
    danger: 'bg-error text-white hover:bg-error/90',
    outline: 'border border-border bg-transparent hover:bg-surface text-text-primary',
  };
  
  const sizes = {
    sm: 'h-10 px-3 text-xs gap-1.5',
    md: 'h-11 px-4 py-2 text-sm gap-2',
    lg: 'h-12 px-8 text-base gap-2.5',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const classes = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthClass} ${className}`;

  // Icon sizing based on button size
  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  const currentIconSize = iconSizeClasses[size] || iconSizeClasses.md;

  return (
    <button 
      ref={ref} 
      type={type}
      className={classes} 
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={`${currentIconSize} animate-spin`} aria-hidden="true" />
      ) : IconLeft ? (
        <IconLeft className={currentIconSize} aria-hidden="true" />
      ) : null}
      
      {children}
      
      {!isLoading && IconRight && (
        <IconRight className={currentIconSize} aria-hidden="true" />
      )}
    </button>
  );
});

Button.displayName = 'Button';
