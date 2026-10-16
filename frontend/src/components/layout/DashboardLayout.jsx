import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Info } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content wrapper */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-200">
        {/* Top Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Global Simulated Telemetry Banner Notice */}
        <div className="bg-blue-50/70 border-b border-blue-100/80 px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] text-blue-800">
          <div className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>
              <strong>Notice:</strong> Operating in high-fidelity mock demonstration mode. Telemetry updates and device streams are simulated in real-time.
            </span>
          </div>
          <span className="hidden md:inline text-blue-600/80 font-mono">
            Vite + React 19 + Tailwind CSS
          </span>
        </div>

        {/* Main Routed Page Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Subtle Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 IoTCloud Technologies Inc. Enterprise IoT Monitoring & Renewable Asset Telemetry.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All Systems Operational
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400 font-mono">Sampling: 1-hour interval</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
