import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Textarea = React.forwardRef(({
  className = '',
  label,
  helperText,
  error,
  fullWidth = true,
  required,
  disabled,
  ...props
}, ref) => {
  // Determine wrapper classes
  const wrapperClasses = `relative flex flex-col ${fullWidth ? 'w-full' : ''}`;
  
  // Determine input classes based on states
  const baseInputClasses = 'flex min-h-[80px] w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-300 resize-y';
  const stateInputClasses = error 
    ? 'border-error focus:ring-2 focus:ring-error/50' 
    : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-text-muted';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-background' : '';
  
  const inputClasses = `${baseInputClasses} ${stateInputClasses} ${disabledClasses} ${className}`;

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <div className="mt-1.5 ml-1 text-sm text-error flex items-center animate-fade-in">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div className="mt-1.5 ml-1 text-xs text-text-muted">
          {helperText}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
