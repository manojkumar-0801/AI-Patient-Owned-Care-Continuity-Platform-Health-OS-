import os

files = {
    'src/components/ui/Input.jsx': '''import React from 'react';

export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
''',
    'src/components/ui/Card.jsx': '''import React from 'react';

export const Card = ({ className = '', children, ...props }) => {
  return (
    <div className={`rounded-3xl border border-border bg-surface text-text-primary shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};
''',
    'src/components/ui/Badge.jsx': '''import React from 'react';

export const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    primary: 'bg-primary/20 text-primary border border-primary/30',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30',
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
''',
    'src/components/ui/Textarea.jsx': '''import React from 'react';

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`flex min-h-[80px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
''',
    'src/components/ui/Select.jsx': '''import React from 'react';

export const Select = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`flex h-10 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
''',
    'src/components/ui/Spinner.jsx': '''import React from 'react';

export const Spinner = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };
  
  return (
    <div className={`animate-spin rounded-full border-solid border-primary border-t-transparent ${sizes[size]} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};
''',
    'src/components/ui/EmptyState.jsx': '''import React from 'react';

export const EmptyState = ({ title, description, icon: Icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center animate-fade-in">
      {Icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
          <Icon className="h-8 w-8 text-text-secondary" />
        </div>
      )}
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      {description && <p className="text-text-secondary max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
''',
    'src/components/ui/index.js': '''export * from './Button';
export * from './Input';
export * from './Card';
export * from './Badge';
export * from './Textarea';
export * from './Select';
export * from './Spinner';
export * from './EmptyState';
''',
    'src/components/layout/Navbar.jsx': '''import React from 'react';

export const Navbar = ({ children }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {children}
      </div>
    </header>
  );
};
''',
    'src/components/layout/Sidebar.jsx': '''import React from 'react';

export const Sidebar = ({ children }) => {
  return (
    <aside className="hidden w-[250px] flex-col border-r border-border bg-background md:flex">
      {children}
    </aside>
  );
};
''',
    'src/components/layout/Layout.jsx': '''import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout = ({ children, navbarContent, sidebarContent }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Navbar>{navbarContent}</Navbar>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <Sidebar>{sidebarContent}</Sidebar>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
''',
    'src/components/layout/index.js': '''export * from './Navbar';
export * from './Sidebar';
export * from './Layout';
'''
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Scaffolded component files successfully.")
