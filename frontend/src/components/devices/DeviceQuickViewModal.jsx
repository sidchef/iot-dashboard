import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import {
  ExternalLink,
  BatteryCharging,
  Sun,
  Activity,
  Thermometer,
  Zap,
  MapPin,
  Clock,
  Radio
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { getDeviceTelemetryHistory } from '../../data/mockTelemetry';
import { calculatePower } from '../../utils/calculations';

export default function DeviceQuickViewModal({ device, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!device) return null;

  const history = getDeviceTelemetryHistory(device, '24h');
  const powerW = calculatePower(device.batteryVoltage, device.batteryCurrent);

  const handleFullView = () => {
    onClose();
    navigate(`/devices/${device.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Device Telemetry — ${device.name}`} maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Top Info Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white font-mono text-sm font-bold shadow-xs">
              {device.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">{device.name}</h4>
                <StatusBadge status={device.status} />
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>{device.location}</span>
                <span className="text-slate-300">•</span>
                <span>{device.type}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFullView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <span>Full Telemetry Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Current Telemetry Readings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <BatteryCharging className="h-3.5 w-3.5 text-blue-500" />
              Battery Voltage
            </span>
            <p className="text-lg font-bold text-slate-900 mt-1 font-mono">
              {device.batteryVoltage} V
            </p>
            <span className="text-[10px] text-slate-400">Current: {device.batteryCurrent} A</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              Solar Voltage
            </span>
            <p className="text-lg font-bold text-slate-900 mt-1 font-mono">
              {device.solarVoltage} V
            </p>
            <span className="text-[10px] text-slate-400">Peak today: 46.2 V</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              Inst. Power (P=VI)
            </span>
            <p className="text-lg font-bold text-slate-900 mt-1 font-mono">
              {powerW} W
            </p>
            <span className="text-[10px] text-slate-400">Gen: {device.energyGenerated} kWh</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Thermometer className="h-3.5 w-3.5 text-rose-500" />
              Internal Temp
            </span>
            <p className="text-lg font-bold text-slate-900 mt-1 font-mono">
              {device.temperature || 28.4} °C
            </p>
            <span className="text-[10px] text-slate-400">Uptime: {device.uptime}%</span>
          </div>
        </div>

        {/* 24-Hour Telemetry Sparkline Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-blue-600" />
              24-Hour Voltage & Power Curve
            </h5>
            <span className="text-[11px] text-slate-400 font-mono">Hourly Intervals</span>
          </div>

          <div className="h-44 w-full bg-slate-50/50 rounded-lg p-2 border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded shadow-md text-xs space-y-0.5">
                          <p className="font-semibold text-slate-300">{label}</p>
                          <p className="text-blue-300">Battery: {payload[0]?.value} V</p>
                          <p className="text-amber-300">Solar: {payload[1]?.value} V</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="batteryVoltage"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="solarVoltage"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Communication and Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Firmware</span>
            <span className="font-semibold text-slate-800">{device.firmware || 'v2.4.1'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Signal Strength</span>
            <span className="font-semibold text-slate-800">{device.signalStrength || -64} dBm (Good)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Last Communication</span>
            <span className="font-semibold text-slate-800">{device.lastUpdated}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleFullView}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Open Dedicated Details Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
