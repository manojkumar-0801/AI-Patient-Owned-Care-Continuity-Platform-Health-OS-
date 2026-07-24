import React from 'react';
import { Menu, Activity, Bell, Search } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useLocation } from 'react-router-dom';

export const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  
  // Basic mapping of paths to page titles
  const getPageTitle = (path) => {
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('profile')) return 'Patient Profile';
    if (path.includes('records')) return 'Medical Records';
    if (path.includes('doctors')) return 'Doctors';
    if (path.includes('appointments')) return 'Appointments';
    if (path.includes('insights')) return 'AI Insights';
    if (path.includes('settings')) return 'Settings';
    return 'Dashboard'; // Fallback
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Mobile Menu Toggle & Branding */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 -ml-2 text-text-secondary hover:bg-surface hover:text-text-primary rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Toggle Menu"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Mobile Branding (Visible only when Sidebar is hidden) */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg text-text-primary tracking-tight">Health OS</span>
          </div>

          {/* Desktop Page Title */}
          <h1 className="hidden md:block text-xl font-semibold text-text-primary tracking-tight">
            {pageTitle}
          </h1>
        </div>

        {/* Center Section: Global Search (Placeholder) */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-text-secondary" />
            </div>
            <input
              type="text"
              placeholder="Search patients, records, or appointments..."
              aria-label="Global Search"
              className="block w-full rounded-full border border-border bg-surface py-1.5 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow"
            />
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Notifications */}
          <button 
            className="relative p-2 text-text-secondary hover:bg-surface hover:text-text-primary rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-error ring-2 ring-background"></span>
          </button>
          
          {/* Divider */}
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          
          {/* User Menu */}
          <UserMenu user={{ name: 'Vasanth', role: 'Patient' }} />
        </div>
      </div>
    </header>
  );
};
