import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import AlertsTable from '../components/alerts/AlertsTable';
import SearchBar from '../components/common/SearchBar';
import { exportToCSV } from '../utils/exportCSV';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle,
  Download,
  Filter
} from 'lucide-react';

export default function Alerts() {
  const { alerts } = useIoT();
  const [searchQuery, setSearchQuery] = useState('');

  // Tally counts
  const criticalCount = alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const highCount = alerts.filter((a) => a.severity === 'High' && a.status !== 'Resolved').length;
  const mediumCount = alerts.filter((a) => a.severity === 'Medium' && a.status !== 'Resolved').length;
  const lowCount = alerts.filter((a) => a.severity === 'Low' && a.status !== 'Resolved').length;
  const resolvedCount = alerts.filter((a) => a.status === 'Resolved').length;

  const handleExportAlerts = () => {
    const columns = [
      { key: 'id', label: 'Alert ID' },
      { key: 'deviceId', label: 'Device ID' },
      { key: 'deviceName', label: 'Device Name' },
      { key: 'alertType', label: 'Alert Type' },
      { key: 'severity', label: 'Severity' },
      { key: 'status', label: 'Status' },
      { key: 'description', label: 'Description' },
      { key: 'actualValue', label: 'Recorded Value' },
      { key: 'threshold', label: 'Threshold' },
      { key: 'timestamp', label: 'Timestamp' },
    ];
    exportToCSV(alerts, `IoTCloud_Incidents_${new Date().toISOString().split('T')[0]}`, columns);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              System Alerts & Incidents
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              {criticalCount + highCount + mediumCount + lowCount} Open
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time threshold triggers, battery safety cutoffs, and connection diagnostics.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleExportAlerts}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>Export Incidents CSV</span>
        </button>
      </div>

      {/* Severity Tally Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-rose-600 uppercase">Critical</span>
            <p className="text-xl font-bold text-slate-900">{criticalCount}</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <AlertOctagon className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase">High</span>
            <p className="text-xl font-bold text-slate-900">{highCount}</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-yellow-600 uppercase">Medium</span>
            <p className="text-xl font-bold text-slate-900">{mediumCount}</p>
          </div>
          <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase">Low</span>
            <p className="text-xl font-bold text-slate-900">{lowCount}</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Bell className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 uppercase">Resolved</span>
            <p className="text-xl font-bold text-slate-900">{resolvedCount}</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full sm:w-80">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search by alert type, device, or ID..."
        />
      </div>

      {/* Main Alerts Table */}
      <AlertsTable alerts={alerts} searchQuery={searchQuery} />
    </div>
  );
}
