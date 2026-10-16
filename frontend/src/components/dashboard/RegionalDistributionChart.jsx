import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MapPin } from 'lucide-react';
import { useIoT } from '../../context/IoTContext';
import { getRegionalTelemetry } from '../../data/mockTelemetry';

export default function RegionalDistributionChart() {
  const { devices } = useIoT();
  const regionalData = getRegionalTelemetry(devices);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1 min-w-[170px]">
          <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-emerald-400">{p.healthRate}% Online</span>
          </p>
          <div className="flex items-center justify-between text-slate-300">
            <span>Total Units:</span>
            <span className="font-bold text-white">{p.devices}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Generated:</span>
            <span className="font-mono text-emerald-300">{p.totalEnergyKwh} kWh</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Offline / Alerts:</span>
            <span className="font-mono text-rose-300">{(p.offline || 0) + (p.critical || 0)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <MapPin className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Regional Device Distribution
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          {regionalData.length} Active Regions
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Monitored asset count deployed across operational zones
      </p>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="region"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="devices" name="Devices" radius={[4, 4, 0, 0]} fill="#3b82f6">
              {regionalData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? '#3b82f6' : '#2563eb'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Highest Density: Texas & California</span>
        <span className="font-medium text-slate-700">Multi-zone telemetry synced</span>
      </div>
    </div>
  );
}
