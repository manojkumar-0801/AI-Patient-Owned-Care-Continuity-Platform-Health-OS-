import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import { Sidebar } from './Sidebar/Sidebar';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col bg-background text-text-primary overflow-hidden">
      {/* Top Navigation remains fixed at the top */}
      <Navbar onMenuToggle={() => setIsSidebarOpen(true)} />
      
      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar remains fixed on the left */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-surface/50 p-4 md:p-6 lg:p-8 w-full">
          <div className="mx-auto max-w-7xl h-full">
            {/* The child routes render here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
