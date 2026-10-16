import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import DeviceTable from '../components/devices/DeviceTable';
import DeviceFormModal from '../components/devices/DeviceFormModal';
import DeviceQuickViewModal from '../components/devices/DeviceQuickViewModal';
import SearchBar from '../components/common/SearchBar';
import { exportToCSV } from '../utils/exportCSV';
import { Plus, Download, Cpu, Activity, ShieldAlert, Sparkles } from 'lucide-react';

export default function Devices() {
  const { devices, metrics, globalSearch, setGlobalSearch } = useIoT();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickViewDevice, setQuickViewDevice] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const handleDeviceAdded = (newDevice) => {
    setSuccessToast(`Device ${newDevice.name} (${newDevice.id}) registered successfully!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleExportCSV = () => {
    const exportColumns = [
      { key: 'id', label: 'Device ID' },
      { key: 'name', label: 'Device Name' },
      { key: 'type', label: 'Type' },
      { key: 'location', label: 'Location' },
      { key: 'region', label: 'Region' },
      { key: 'status', label: 'Status' },
      { key: 'batteryVoltage', label: 'Battery Voltage (V)' },
      { key: 'batteryCurrent', label: 'Battery Current (A)' },
      { key: 'solarVoltage', label: 'Solar Voltage (V)' },
      { key: 'energyGenerated', label: 'Energy Generated (kWh)' },
      { key: 'temperature', label: 'Temperature (°C)' },
      { key: 'uptime', label: 'Uptime (%)' },
      { key: 'lastUpdated', label: 'Last Updated' },
    ];
    exportToCSV(devices, `IoTCloud_Devices_${new Date().toISOString().split('T')[0]}`, exportColumns);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="h-4 w-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              IoT Device Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              {devices.length} Total Units
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time sensory telemetry, electrical ratings, health telemetry, and status indicators.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Add Device Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Device</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Online Units</span>
            <p className="text-xl font-bold text-emerald-600">{metrics.online}</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Activity className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Warning Threshold</span>
            <p className="text-xl font-bold text-amber-600">{metrics.warning}</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Critical Alerts</span>
            <p className="text-xl font-bold text-rose-600">{metrics.critical}</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Offline Devices</span>
            <p className="text-xl font-bold text-slate-600">{metrics.offline}</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
            <Cpu className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Search Input Bar for Mobile & Quick Access */}
      <div className="w-full sm:w-80">
        <SearchBar
          value={globalSearch}
          onChange={setGlobalSearch}
          onClear={() => setGlobalSearch('')}
          placeholder="Filter devices by name, ID, or site..."
        />
      </div>

      {/* Main Interactive Devices Table */}
      <DeviceTable
        devices={devices}
        searchQuery={globalSearch}
        onQuickView={(device) => setQuickViewDevice(device)}
      />

      {/* Add Device Modal */}
      <DeviceFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDeviceAdded={handleDeviceAdded}
      />

      {/* Quick View Device Modal */}
      <DeviceQuickViewModal
        device={quickViewDevice}
        isOpen={Boolean(quickViewDevice)}
        onClose={() => setQuickViewDevice(null)}
      />
    </div>
  );
}
