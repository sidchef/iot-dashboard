import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import DateRangeFilter from '../common/DateRangeFilter';
import SearchBar from '../common/SearchBar';

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    alerts,
    metrics,
    dateRange,
    setDateRange,
    globalSearch,
    setGlobalSearch,
    isLiveActive,
    setIsLiveActive,
    settings,
    acknowledgeAlert
  } = useIoT();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const alertRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        setIsAlertOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumb details
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Fleet Overview', breadcrumbs: ['IoTCloud', 'Overview'] };
    if (path.startsWith('/devices/')) return { title: 'Device Telemetry Details', breadcrumbs: ['IoTCloud', 'Devices', 'Device Details'] };
    if (path === '/devices') return { title: 'IoT Device Management', breadcrumbs: ['IoTCloud', 'Devices'] };
    if (path === '/analytics') return { title: 'Telemetry & Energy Analytics', breadcrumbs: ['IoTCloud', 'Analytics'] };
    if (path === '/alerts') return { title: 'System Alerts & Incidents', breadcrumbs: ['IoTCloud', 'Alerts'] };
    if (path === '/reports') return { title: 'Performance Reports & Exports', breadcrumbs: ['IoTCloud', 'Reports'] };
    if (path === '/settings') return { title: 'Platform Settings & Thresholds', breadcrumbs: ['IoTCloud', 'Settings'] };
    return { title: 'Dashboard', breadcrumbs: ['IoTCloud'] };
  };

  const { title, breadcrumbs } = getPageInfo();
  const activeAlerts = alerts.filter((a) => a.status === 'Active');

  const handleGlobalSearchChange = (val) => {
    setGlobalSearch(val);
    // If not currently on Devices or Alerts, navigate to Devices so user sees results
    if (val && location.pathname !== '/devices' && location.pathname !== '/alerts') {
      navigate('/devices');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger + Breadcrumbs / Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
                  <span className={idx === breadcrumbs.length - 1 ? 'font-semibold text-slate-800' : 'hover:text-slate-700'}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Search */}
          <div className="hidden md:block w-48 lg:w-64">
            <SearchBar
              value={globalSearch}
              onChange={handleGlobalSearchChange}
              onClear={() => setGlobalSearch('')}
              placeholder="Search devices or IDs..."
            />
          </div>

          {/* Date range selector */}
          <div className="hidden sm:block">
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
          </div>

          {/* Live Simulation Stream Toggle */}
          <button
            type="button"
            onClick={() => setIsLiveActive(!isLiveActive)}
            title={isLiveActive ? 'Pause simulated telemetry updates' : 'Resume simulated telemetry updates'}
            className={`hidden xl:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isLiveActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isLiveActive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Live Feed (Simulated)</span>
                <Pause className="h-3 w-3 text-emerald-600" />
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span>Feed Paused</span>
                <Play className="h-3 w-3 text-slate-500" />
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={alertRef}>
            <button
              type="button"
              onClick={() => setIsAlertOpen(!isAlertOpen)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {isAlertOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-slate-700" />
                    <span className="text-sm font-semibold text-slate-900">Active System Alerts</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    {activeAlerts.length} new
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {activeAlerts.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                      All telemetry thresholds normal. No active alerts.
                    </div>
                  ) : (
                    activeAlerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            alert.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                            alert.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-[11px] text-slate-400">{alert.timestamp.split(' ')[1]}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 mt-1">{alert.alertType} — {alert.deviceName}</p>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{alert.description}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-mono">{alert.deviceId}</span>
                          <button
                            type="button"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                  <Link
                    to="/alerts"
                    onClick={() => setIsAlertOpen(false)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View All {alerts.length} Incidents &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
                {settings?.profile?.name?.split(' ').map((n) => n[0]).join('') || 'AM'}
              </div>
              <div className="hidden md:block text-left pr-1">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {settings?.profile?.name || 'Alex Morgan'}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {settings?.profile?.role || 'Admin'}
                </p>
              </div>
            </button>

            {/* Profile Popover */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{settings?.profile?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{settings?.profile?.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Account & Thresholds</span>
                </Link>
                <Link
                  to="/reports"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 text-slate-400" />
                  <span>Fleet Reports</span>
                </Link>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    alert("Logged in as Administrator (Local Demo Session)");
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Session Profile</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
