import React from 'react';
import { Activity } from 'lucide-react';

export const SidebarHeader = () => {
  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Activity className="h-5 w-5" />
      </div>
      <span className="font-bold text-lg text-text-primary tracking-tight">Health OS</span>
    </div>
  );
};
