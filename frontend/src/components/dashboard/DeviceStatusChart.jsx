import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { useIoT } from '../../context/IoTContext';

export default function DeviceStatusChart() {
  const { metrics } = useIoT();

  const data = [
    { name: 'Online', value: metrics.online, color: '#10b981' },
    { name: 'Warning', value: metrics.warning, color: '#f59e0b' },
    { name: 'Critical', value: metrics.critical, color: '#f43f5e' },
    { name: 'Offline', value: metrics.offline, color: '#94a3b8' },
  ].filter((item) => item.value > 0);

  const total = metrics.total || 1;
  const healthPercent = Math.round((metrics.online / total) * 100);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      const pct = Math.round((p.value / total) * 100);
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.payload.color }} />
            <span className="font-semibold text-slate-200">{p.name}:</span>
            <span className="font-bold text-white">{p.value} units</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-4">{pct}% of total fleet</p>
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
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Activity className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Device Status</h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {healthPercent}% Healthy
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-2">
        Real-time telemetry connection & operational state breakdown
      </p>

      {/* Chart Canvas with Donut center */}
      <div className="relative w-full h-56 sm:h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={92}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} strokeWidth={1} stroke="#fff" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
            {metrics.total}
          </span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1">
            Total Devices
          </span>
        </div>
      </div>

      {/* Custom Legend Grid */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Online
          </span>
          <span className="font-bold text-slate-900">{metrics.online}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Warning
          </span>
          <span className="font-bold text-slate-900">{metrics.warning}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            Critical
          </span>
          <span className="font-bold text-slate-900">{metrics.critical}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            Offline
          </span>
          <span className="font-bold text-slate-900">{metrics.offline}</span>
        </div>
      </div>
    </div>
  );
}
