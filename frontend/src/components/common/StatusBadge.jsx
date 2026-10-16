import React from 'react';

export default function StatusBadge({ status, size = 'md', showDot = true, className = '' }) {
  const norm = String(status || '').toLowerCase().trim();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-400';
  let label = status || 'Unknown';

  if (norm === 'online' || norm === 'healthy' || norm === 'active' || norm === 'success' || norm === 'resolved') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    dotClass = 'bg-emerald-500';
    if (norm === 'online') label = 'Online';
    else if (norm === 'resolved') label = 'Resolved';
  } else if (norm === 'warning' || norm === 'medium' || norm === 'acknowledged') {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotClass = 'bg-amber-500';
    if (norm === 'warning') label = 'Warning';
    else if (norm === 'acknowledged') label = 'Acknowledged';
  } else if (norm === 'critical' || norm === 'high') {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200/80';
    dotClass = 'bg-rose-500';
    if (norm === 'critical') label = 'Critical';
    else if (norm === 'high') label = 'High';
  } else if (norm === 'offline') {
    bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
    dotClass = 'bg-slate-400';
    label = 'Offline';
  } else if (norm === 'low') {
    bgClass = 'bg-blue-50 text-blue-700 border-blue-200/80';
    dotClass = 'bg-blue-500';
    label = 'Low';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-medium px-3 py-1.5 gap-2',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium transition-colors ${sizeClasses} ${bgClass} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {(norm === 'online' || norm === 'critical') && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotClass}`} />
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}
