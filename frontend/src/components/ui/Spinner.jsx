import React from 'react';

export const Spinner = ({
  variant = 'circular', // 'circular', 'dots', 'pulse'
  size = 'md', // 'sm', 'md', 'lg'
  color = 'primary', // 'primary', 'white', 'success'
  label,
  fullScreen = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const dotSizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4',
  };

  const colorMap = {
    primary: 'text-primary',
    white: 'text-white',
    success: 'text-success',
  };

  const resolvedSize = sizeMap[size] || sizeMap.md;
  const resolvedDotSize = dotSizeMap[size] || dotSizeMap.md;
  const resolvedColor = colorMap[color] || colorMap.primary;

  let spinnerElement = null;

  if (variant === 'circular') {
    spinnerElement = (
      <svg
        className={`animate-spin ${resolvedSize} ${resolvedColor}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
        <span className="sr-only">Loading...</span>
      </svg>
    );
  } else if (variant === 'dots') {
    spinnerElement = (
      <div className={`flex items-center justify-center space-x-1 ${resolvedColor}`} role="status">
        <div
          className={`${resolvedDotSize} bg-current rounded-full animate-bounce`}
          style={{ animationDelay: '0ms' }}
        ></div>
        <div
          className={`${resolvedDotSize} bg-current rounded-full animate-bounce`}
          style={{ animationDelay: '150ms' }}
        ></div>
        <div
          className={`${resolvedDotSize} bg-current rounded-full animate-bounce`}
          style={{ animationDelay: '300ms' }}
        ></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  } else if (variant === 'pulse') {
    spinnerElement = (
      <div
        className={`${resolvedSize} ${resolvedColor} bg-current rounded-full animate-pulse opacity-75 flex`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Base layout: if fullscreen, stack them (col). If inline, row them.
  const content = (
    <div
      className={`inline-flex items-center justify-center ${
        label ? (fullScreen ? 'flex-col gap-3' : 'flex-row gap-2') : ''
      } ${className}`}
    >
      {spinnerElement}
      {label && (
        <span
          className={`text-sm font-medium ${fullScreen ? resolvedColor : 'text-inherit'}`}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
