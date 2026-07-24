import React from 'react';
import { Loader2 } from 'lucide-react';

const CardContext = React.createContext({ padding: 'md' });

export const Card = React.forwardRef(({ 
  className = '', 
  variant = 'default', 
  padding = 'md', 
  interactive = false,
  isLoading = false,
  onClick,
  children,
  ...props 
}, ref) => {
  
  const isClickable = interactive || !!onClick;

  const baseStyles = 'rounded-2xl relative overflow-hidden text-text-primary transition-all duration-300';
  
  const variants = {
    default: 'bg-surface border border-border shadow-sm',
    outlined: 'bg-transparent border-2 border-border',
    elevated: 'bg-surface border border-transparent shadow-lg shadow-black/5 dark:shadow-black/20',
  };

  const interactiveStyles = isClickable 
    ? 'cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary' 
    : '';

  const Component = isClickable ? 'div' : 'div';
  
  const handleKeyDown = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <CardContext.Provider value={{ padding }}>
      <Component
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${interactiveStyles} ${className}`}
        onClick={isClickable ? onClick : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/50 backdrop-blur-sm rounded-2xl">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        {children}
      </Component>
    </CardContext.Provider>
  );
});

Card.displayName = 'Card';

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  none: '',
};

export const CardHeader = React.forwardRef(({ className = '', children, ...props }, ref) => {
  const { padding } = React.useContext(CardContext);
  
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 ${paddingStyles[padding]} pb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={`font-semibold leading-none tracking-tight text-xl text-text-primary ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-text-secondary ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

export const CardBody = React.forwardRef(({ className = '', children, ...props }, ref) => {
  const { padding } = React.useContext(CardContext);
  
  return (
    <div
      ref={ref}
      className={`${paddingStyles[padding]} pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef(({ className = '', children, ...props }, ref) => {
  const { padding } = React.useContext(CardContext);
  
  return (
    <div
      ref={ref}
      className={`flex items-center ${paddingStyles[padding]} pt-0 mt-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';
