import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useIoT } from '../../context/IoTContext';
import { PlusCircle, Cpu, MapPin, Zap, BatteryCharging, AlertCircle } from 'lucide-react';

export default function DeviceFormModal({ isOpen, onClose, onDeviceAdded }) {
  const { devices, addDevice } = useIoT();

  // Next suggested ID
  const nextId = `DEV-${String(devices.length + 1).padStart(3, '0')}`;

  const [formData, setFormData] = useState({
    id: nextId,
    name: '',
    type: 'Solar Unit',
    location: 'Austin Solar Farm, TX',
    region: 'Texas',
    batteryVoltage: 12.6,
    batteryCurrent: 12.0,
    solarVoltage: 42.0,
    status: 'online',
  });

  const [errors, setErrors] = useState({});

  const regionOptions = [
    { name: 'Austin Solar Farm, TX', region: 'Texas' },
    { name: 'Mojave Field Array, CA', region: 'California' },
    { name: 'Denver High Plains, CO', region: 'Colorado' },
    { name: 'Nevada Desert Station, NV', region: 'Nevada' },
    { name: 'Phoenix Solar Park, AZ', region: 'Arizona' },
    { name: 'Seattle Microgrid, WA', region: 'Washington' },
    { name: 'San Diego Clean Tech Park, CA', region: 'California' },
    { name: 'Chicago Substation, IL', region: 'Illinois' },
  ];

  const handleLocationChange = (locName) => {
    const match = regionOptions.find((r) => r.name === locName);
    setFormData((prev) => ({
      ...prev,
      location: locName,
      region: match ? match.region : 'Other',
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Device name is required';
    }
    if (!formData.id.trim()) {
      errs.id = 'Device ID is required';
    } else if (devices.some((d) => d.id.toLowerCase() === formData.id.trim().toLowerCase())) {
      errs.id = 'Device ID must be unique (ID already exists)';
    }
    if (!formData.location.trim()) {
      errs.location = 'Location is required';
    }
    if (formData.batteryVoltage < 0 || formData.batteryVoltage > 30) {
      errs.batteryVoltage = 'Realistic battery voltage range: 0V - 30V';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const created = addDevice(formData);
    if (onDeviceAdded) onDeviceAdded(created);

    // Reset form
    setFormData({
      id: `DEV-${String(devices.length + 2).padStart(3, '0')}`,
      name: '',
      type: 'Solar Unit',
      location: 'Austin Solar Farm, TX',
      region: 'Texas',
      batteryVoltage: 12.6,
      batteryCurrent: 12.0,
      solarVoltage: 42.0,
      status: 'online',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New IoT Device" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Notice */}
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2">
          <Zap className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            Added devices will be registered to the fleet session, stored in <code>localStorage</code>, and automatically streamed in dashboards.
          </span>
        </div>

        {/* Device ID & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Device ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
              placeholder="e.g. DEV-056"
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white font-mono ${
                errors.id ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            />
            {errors.id && <p className="text-[11px] text-rose-600 mt-1">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="online">Online (Nominal)</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Device Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Device Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Solar Unit Orion"
            className={`w-full px-3 py-2 text-sm rounded-lg border bg-white ${
              errors.name ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-blue-500'
            } focus:outline-none focus:ring-2`}
          />
          {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
        </div>

        {/* Device Type & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Device Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Solar Unit">Solar Unit</option>
              <option value="Remote Sensor">Remote Sensor</option>
              <option value="Power Monitor">Power Monitor</option>
              <option value="Weather Station">Weather Station</option>
              <option value="Battery Storage Bank">Battery Storage Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Site Location <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {regionOptions.map((opt) => (
                <option key={opt.name} value={opt.name}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Initial Telemetry Specs */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Initial Telemetry Calibration:
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Battery (V)</label>
              <input
                type="number"
                step="0.1"
                value={formData.batteryVoltage}
                onChange={(e) => setFormData({ ...formData, batteryVoltage: parseFloat(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Current (A)</label>
              <input
                type="number"
                step="0.1"
                value={formData.batteryCurrent}
                onChange={(e) => setFormData({ ...formData, batteryCurrent: parseFloat(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Solar (V)</label>
              <input
                type="number"
                step="0.1"
                value={formData.solarVoltage}
                onChange={(e) => setFormData({ ...formData, solarVoltage: parseFloat(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Register Device</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
