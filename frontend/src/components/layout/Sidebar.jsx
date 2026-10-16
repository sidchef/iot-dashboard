import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  LineChart,
  Bell,
  FileSpreadsheet,
  Settings,
  Radio,
  X,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { metrics, isLiveActive } = useIoT();

  const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Devices', href: '/devices', icon: Cpu, badge: metrics.total },
    { name: 'Analytics', href: '/analytics', icon: LineChart },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: Bell,
      badge: metrics.activeAlerts > 0 ? metrics.activeAlerts : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0b1329] border-r border-[#162347] flex flex-col transition-transform duration-200 ease-in-out dark-sidebar ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#162347]">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={() => onClose && onClose()}>
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight">IoTCloud</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Monitoring & Telemetry</p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Status Header Widget */}
        <div className="px-4 py-3 border-b border-[#162347] bg-[#080d1d]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Radio className={`h-3.5 w-3.5 ${isLiveActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              Telemetry Feed
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isLiveActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-slate-800 text-slate-400'
            }`}>
              {isLiveActive ? 'Simulated Live' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => onClose && onClose()}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                    : 'text-slate-300 hover:bg-[#131e3d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      item.badgeColor || (isActive ? 'bg-blue-700 text-blue-100' : 'bg-[#1b2a54] text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Health / Footer status card */}
        <div className="p-4 border-t border-[#162347] bg-[#070b16]">
          <div className="rounded-lg bg-[#0e1730] p-3 border border-[#1b2a54]">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Fleet Health
              </span>
              <span className="font-bold text-emerald-400">
                {metrics.total > 0 ? ((metrics.online / metrics.total) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-[#1b2a54] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${metrics.total > 0 ? (metrics.online / metrics.total) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>{metrics.online} Online</span>
              <span>{metrics.offline} Offline</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
