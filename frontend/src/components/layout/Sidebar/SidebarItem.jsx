import React from 'react';
import { NavLink } from 'react-router-dom';

export const SidebarItem = ({ item, onClick }) => {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
        }`
      }
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 truncate">{item.name}</span>
      {item.placeholder && (
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-secondary text-text-secondary px-1.5 py-0.5 rounded-md">
          Soon
        </span>
      )}
    </NavLink>
  );
};
