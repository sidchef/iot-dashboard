import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import {
  User,
  Sliders,
  Bell,
  ShieldAlert,
  Save,
  RotateCcw,
  Sparkles,
  Zap,
  BatteryCharging,
  Thermometer,
  Moon,
  Sun,
  Radio,
  CheckCircle2
} from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, resetToFactoryDefaults } = useIoT();

  const [formData, setFormData] = useState({
    profile: {
      name: settings?.profile?.name || 'Alex Morgan',
      email: settings?.profile?.email || 'alex.morgan@iotcloud.io',
      role: settings?.profile?.role || 'Senior Operations Director',
      organization: settings?.profile?.organization || 'Apex Grid Telemetry Corp',
    },
    thresholds: {
      lowBatteryVoltage: settings?.thresholds?.lowBatteryVoltage || 11.8,
      highTemperature: settings?.thresholds?.highTemperature || 45.0,
      minSolarVoltage: settings?.thresholds?.minSolarVoltage || 15.0,
    },
    preferences: {
      telemetryRefreshInterval: settings?.preferences?.telemetryRefreshInterval || 5,
      defaultTimeRange: settings?.preferences?.defaultTimeRange || 'today',
      enableLiveSimulation: settings?.preferences?.enableLiveSimulation !== false,
      notifications: {
        criticalAlertEmail: settings?.preferences?.notifications?.criticalAlertEmail !== false,
        pushAlerts: settings?.preferences?.notifications?.pushAlerts !== false,
        weeklySummary: settings?.preferences?.notifications?.weeklySummary || false,
      }
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setToastMessage('Settings successfully saved to local storage!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all devices, alerts, and settings back to factory mock state?')) {
      resetToFactoryDefaults();
      setToastMessage('System restored to default factory mock dataset.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Settings & Thresholds
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure telemetry safety thresholds, alert notification policies, and personal profile information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Factory Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: User Profile */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Profile Information</h3>
              <p className="text-xs text-slate-500">Your session identity across the platform</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.profile.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.profile.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role / Job Title</label>
              <input
                type="text"
                value={formData.profile.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, role: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization</label>
              <input
                type="text"
                value={formData.profile.organization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, organization: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Alert Thresholds */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Alert Trigger Thresholds</h3>
              <p className="text-xs text-slate-500">
                Configure parameter safety bands that trigger warning and critical status indicators
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Low Battery Cutoff */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BatteryCharging className="h-4 w-4 text-blue-600" />
                  Low Battery Voltage Warning Threshold
                </span>
                <p className="text-slate-500">
                  Devices with battery voltage lower than this value will be flagged as Warning or Critical.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="range"
                  min="10.0"
                  max="12.5"
                  step="0.1"
                  value={formData.thresholds.lowBatteryVoltage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholds: {
                        ...formData.thresholds,
                        lowBatteryVoltage: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-32 accent-blue-600 cursor-pointer"
                />
                <span className="font-mono font-bold text-sm text-slate-800 w-16 text-right">
                  {formData.thresholds.lowBatteryVoltage} V
                </span>
              </div>
            </div>

            {/* High Temperature Ceiling */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-rose-600" />
                  High Temperature Ceiling Threshold
                </span>
                <p className="text-slate-500">
                  Enclosure temperatures above this threshold initiate thermal alert logging and cooling flags.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="range"
                  min="35.0"
                  max="60.0"
                  step="0.5"
                  value={formData.thresholds.highTemperature}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholds: {
                        ...formData.thresholds,
                        highTemperature: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-32 accent-rose-600 cursor-pointer"
                />
                <span className="font-mono font-bold text-sm text-slate-800 w-16 text-right">
                  {formData.thresholds.highTemperature} °C
                </span>
              </div>
            </div>

            {/* Min Daylight Solar Voltage */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Minimum Daylight Solar Voltage
                </span>
                <p className="text-slate-500">
                  Expected photovoltaic open circuit voltage during peak daylight hours before flagging inverter fault.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="range"
                  min="5.0"
                  max="30.0"
                  step="1.0"
                  value={formData.thresholds.minSolarVoltage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholds: {
                        ...formData.thresholds,
                        minSolarVoltage: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-32 accent-amber-500 cursor-pointer"
                />
                <span className="font-mono font-bold text-sm text-slate-800 w-16 text-right">
                  {formData.thresholds.minSolarVoltage} V
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Telemetry Preferences & Live Simulation */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dashboard & Simulation Preferences</h3>
              <p className="text-xs text-slate-500">Tune real-time updates and display cadence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Telemetry Simulated Refresh Cadence
              </label>
              <select
                value={formData.preferences.telemetryRefreshInterval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      telemetryRefreshInterval: parseInt(e.target.value, 10),
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white"
              >
                <option value={3}>Every 3 seconds (High frequency)</option>
                <option value={5}>Every 5 seconds (Recommended)</option>
                <option value={10}>Every 10 seconds</option>
                <option value={30}>Every 30 seconds</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Historical Range View
              </label>
              <select
                value={formData.preferences.defaultTimeRange}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      defaultTimeRange: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white"
              >
                <option value="today">Today (24h)</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Toggle Live Simulation */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-xs block">
                  Enable Periodic Telemetry Live Simulation
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Simulates subtle sensory fluctuations on connected devices to demonstrate live state.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.preferences.enableLiveSimulation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      enableLiveSimulation: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Notification Policies */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Notification Channels</h3>
              <p className="text-xs text-slate-500">Configure alert delivery rules</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <span className="text-slate-700 font-medium">
                Dispatch immediate email notifications for Critical & High severity incidents
              </span>
              <input
                type="checkbox"
                checked={formData.preferences.notifications.criticalAlertEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      notifications: {
                        ...formData.preferences.notifications,
                        criticalAlertEmail: e.target.checked,
                      },
                    },
                  })
                }
                className="h-4 w-4 rounded accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <span className="text-slate-700 font-medium">
                Enable In-App toast alerts when telemetry anomalies are detected
              </span>
              <input
                type="checkbox"
                checked={formData.preferences.notifications.pushAlerts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      notifications: {
                        ...formData.preferences.notifications,
                        pushAlerts: e.target.checked,
                      },
                    },
                  })
                }
                className="h-4 w-4 rounded accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <span className="text-slate-700 font-medium">
                Send weekly consolidated energy yield and uptime reliability digest
              </span>
              <input
                type="checkbox"
                checked={formData.preferences.notifications.weeklySummary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      notifications: {
                        ...formData.preferences.notifications,
                        weeklySummary: e.target.checked,
                      },
                    },
                  })
                }
                className="h-4 w-4 rounded accent-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save All Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
