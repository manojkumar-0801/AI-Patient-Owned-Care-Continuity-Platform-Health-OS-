import React from 'react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';
import { 
  LayoutDashboard, 
  User, 
  FolderOpen, 
  Users, 
  Calendar, 
  Brain, 
  Settings,
  LogOut,
  Activity
} from 'lucide-react';

export const Sidebar = ({ 
  user = { name: 'John Doe', role: 'Patient' }, // Default placeholder
  onLogout,
  className = '',
  isOpen,
  onClose
}) => {
  const isDoctor = user?.role === 'DOCTOR';

  const patientNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patient Profile', path: '/profile', icon: User },
    { name: 'Medical Timeline', path: '/timeline', icon: Activity },
    { name: 'Medical Records', path: '/records', icon: FolderOpen },
    { name: 'Doctors', path: '/doctors', icon: Users, placeholder: true },
    { name: 'Appointments', path: '/appointments', icon: Calendar, placeholder: true },
    { name: 'Health Insights', path: '/health-insights', icon: Brain },
  ];

  const doctorNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctor Profile', path: '/doctor/profile', icon: User },
    { name: 'My Patients', path: '/doctor/patients', icon: Users, placeholder: true },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar, placeholder: true },
  ];

  const navItems = isDoctor ? doctorNavItems : patientNavItems;

  const bottomNavItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full w-64 border-r border-border bg-surface transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${className}`}>
        <SidebarHeader />

      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <SidebarItem key={item.name} item={item} onClick={onClose} />
        ))}
      </nav>

      <div className="px-3 py-2 shrink-0">
        {bottomNavItems.map((item) => (
          <SidebarItem key={item.name} item={item} onClick={onClose} />
        ))}
      </div>

      <div className="border-t border-border p-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
            <p className="truncate text-xs text-text-secondary">{user.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg p-2 text-text-secondary hover:bg-error/10 hover:text-error transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};
