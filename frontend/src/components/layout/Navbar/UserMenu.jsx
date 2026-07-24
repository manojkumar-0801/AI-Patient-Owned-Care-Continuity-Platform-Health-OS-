import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

export const UserMenu = ({ user = { name: 'Vasanth', role: 'Patient' }, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 rounded-full sm:rounded-lg p-1 sm:pr-2 hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User Menu"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-text-primary leading-none mb-1">{user.name}</p>
          <p className="text-xs text-text-secondary leading-none">{user.role}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-text-secondary hidden sm:block" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-border bg-background py-1 shadow-lg ring-1 ring-black/5 animate-fade-in z-50">
          
          {/* Mobile-only User Info Header */}
          <div className="px-4 py-3 border-b border-border sm:hidden">
            <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
            <p className="text-xs text-text-secondary truncate">{user.role}</p>
          </div>
          
          {/* Menu Items */}
          <div className="py-1">
            <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors">
              <User className="h-4 w-4" />
              {user.role === 'DOCTOR' ? 'Doctor Profile' : 'My Profile'}
            </button>
            <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
          
          {/* Logout Section */}
          <div className="border-t border-border py-1">
            <button 
              onClick={onLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
