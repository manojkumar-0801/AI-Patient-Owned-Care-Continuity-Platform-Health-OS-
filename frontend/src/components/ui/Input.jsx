import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(({
  className = '',
  label,
  helperText,
  error,
  iconLeft: IconLeft,
  iconRight: IconRight,
  fullWidth = true,
  type = 'text',
  required,
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Determine wrapper classes
  const wrapperClasses = `relative flex flex-col ${fullWidth ? 'w-full' : ''}`;
  
  // Determine input classes based on states
  const baseInputClasses = 'flex w-full min-h-[44px] rounded-xl border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-300';
  const stateInputClasses = error 
    ? 'border-error focus-visible:ring-2 focus-visible:ring-error/50' 
    : 'border-border focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 hover:border-text-muted';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-background' : 'read-only:bg-surface-hover read-only:opacity-70 read-only:cursor-default';
  const iconLeftClasses = IconLeft ? 'pl-10' : '';
  const iconRightClasses = (IconRight || isPassword) ? 'pr-10' : '';
  
  const inputClasses = `${baseInputClasses} ${stateInputClasses} ${disabledClasses} ${iconLeftClasses} ${iconRightClasses} ${className}`;

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      
      <div className="relative">
        {IconLeft && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none flex items-center justify-center">
            <IconLeft className="w-5 h-5" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none rounded-lg p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {IconRight && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center justify-center">
            <IconRight className="w-5 h-5" />
          </div>
        )}
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

Input.displayName = 'Input';
