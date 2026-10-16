import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useIoT } from '../context/IoTContext';
import StatusBadge from '../components/common/StatusBadge';
import {
  ArrowLeft,
  BatteryCharging,
  Sun,
  Zap,
  Thermometer,
  Clock,
  MapPin,
  Radio,
  RefreshCw,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Send,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  getDeviceTelemetryHistory,
  getDeviceActivityLogs
} from '../data/mockTelemetry';
import {
  calculatePower,
  calculateEnergyKwh,
  formatVoltage,
  formatCurrent,
  formatPower,
  formatEnergy
} from '../utils/calculations';

export default function DeviceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices, alerts, updateDevice } = useIoT();

  const [timeRange, setTimeRange] = useState('24h'); // '24h' | '7d' | '30d'
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(null);

  // Find target device
  const device = devices.find((d) => d.id === id);

  // Telemetry history for current time range
  const telemetryData = useMemo(() => {
    return getDeviceTelemetryHistory(device, timeRange);
  }, [device, timeRange]);

  // Activity logs
  const activityLogs = useMemo(() => {
    return getDeviceActivityLogs(device);
  }, [device]);

  // Correlated device alerts
  const deviceAlerts = useMemo(() => {
    return alerts.filter((a) => a.deviceId === id);
  }, [alerts, id]);

  if (!device) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Device Not Found</h3>
        <p className="text-xs text-slate-500">
          The requested device ID <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{id}</code> was not found in the current fleet inventory.
        </p>
        <button
          type="button"
          onClick={() => navigate('/devices')}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Devices Table
        </button>
      </div>
    );
  }

  const currentPowerW = calculatePower(device.batteryVoltage, device.batteryCurrent);

  // Simulate pinging device
  const handleTestPing = () => {
    setIsPinging(true);
    setPingSuccess(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(`Ping acknowledged in 38ms. Telemetry channel active.`);
      updateDevice(device.id, { lastUpdated: 'Just now' });
      setTimeout(() => setPingSuccess(null), 3500);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/devices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Devices</span>
        </Link>

        {/* Time Range Selector */}
        <div className="inline-flex items-center bg-white border border-slate-200 p-1 rounded-lg text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setTimeRange('24h')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              timeRange === '24h'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 24 Hours
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              timeRange === '7d'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              timeRange === '30d'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Ping Feedback Toast */}
      {pingSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>{pingSuccess}</span>
        </div>
      )}

      {/* Main Device Identity Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/20 shrink-0">
            {device.id.replace('DEV-', '#')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {device.name}
              </h2>
              <StatusBadge status={device.status} size="md" />
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {device.id}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {device.location} ({device.region})
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Updated: <span className="font-semibold text-slate-700">{device.lastUpdated}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-slate-400" />
                Firmware: {device.firmware || 'v2.4.1'}
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            disabled={isPinging}
            onClick={handleTestPing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{isPinging ? 'Pinging Gateway...' : 'Ping Device'}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Battery Voltage */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <BatteryCharging className="h-4 w-4 text-blue-500" />
            Battery Voltage
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-2 font-mono">
            {formatVoltage(device.batteryVoltage)}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Float: 12.6V - 13.8V</span>
        </div>

        {/* Battery Current */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-indigo-500" />
            Battery Current
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-2 font-mono">
            {formatCurrent(device.batteryCurrent)}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Discharge / Charge</span>
        </div>

        {/* Solar Panel Voltage */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Sun className="h-4 w-4 text-amber-500" />
            Solar Voltage
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-2 font-mono">
            {formatVoltage(device.solarVoltage)}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">MPPT Voc: 48.0V max</span>
        </div>

        {/* Instantaneous Power */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-emerald-500" />
            Power (P = V×I)
          </span>
          <p className="text-xl font-extrabold text-emerald-600 mt-2 font-mono">
            {formatPower(currentPowerW)}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Instantaneous Watts</span>
        </div>

        {/* Energy Generated */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-teal-500" />
            Energy Yield
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-2 font-mono">
            {formatEnergy(device.energyGenerated)}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Accumulated ∫ P dt</span>
        </div>

        {/* Internal Temperature */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Thermometer className="h-4 w-4 text-rose-500" />
            Internal Temp
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-2 font-mono">
            {device.temperature || 28.5} °C
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Ceiling: 45.0 °C</span>
        </div>
      </div>

      {/* Main Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Battery & Solar Voltage Over Time */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              Voltage Profiles (Solar vs Battery)
            </h3>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              Unit: Volts (V)
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Comparison between solar photovoltaic input and electrochemical battery float voltage
          </p>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} unit="V" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1">
                          <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1">{label}</p>
                          <p className="text-amber-400">Solar Input: {payload[0]?.value} V</p>
                          <p className="text-blue-400">Battery Level: {payload[1]?.value} V</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line
                  type="monotone"
                  dataKey="solarVoltage"
                  name="Solar Array (V)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="batteryVoltage"
                  name="Battery Storage (V)"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Instantaneous Power & Accumulated Energy */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Power (Watts) & Energy (kWh)
            </h3>
            <span className="text-xs font-semibold text-emerald-600 font-mono">
              Sample-Integrated
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Instantaneous power production vs integral energy accumulation over interval
          </p>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} unit="W" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1">
                          <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1">{label}</p>
                          <p className="text-emerald-400 font-bold">Inst. Power: {p.powerWatts} W</p>
                          <p className="text-teal-300">Interval Energy: {p.energyKwh} kWh</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="powerWatts"
                  name="Instantaneous Power (W)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#powerGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Logs & Correlated Incident History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Device Activity Section */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Recent Device Activity & Heartbeats
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Telemetry Log</span>
          </div>

          <div className="space-y-3 mt-4">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60 text-xs"
              >
                <div className="p-1.5 rounded-md bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.event}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Incidents Section */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Incidents & Threshold Alerts ({deviceAlerts.length})
            </h3>
            <Link to="/alerts" className="text-xs text-blue-600 font-semibold hover:underline">
              View All Alerts &rarr;
            </Link>
          </div>

          {deviceAlerts.length === 0 ? (
            <div className="py-10 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700">No active incidents for this device</p>
              <p className="text-xs text-slate-400">All threshold diagnostics are within normal parameters.</p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {deviceAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{alt.alertType}</span>
                      <StatusBadge status={alt.severity} size="sm" />
                    </div>
                    <p className="text-slate-600 mt-1">{alt.description}</p>
                    <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                      Detected: {alt.timestamp}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    alt.status === 'Active' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {alt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
