import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Zap, Info } from 'lucide-react';
import { get24HourTelemetry, get7DayTelemetry, get30DayTelemetry } from '../../data/mockTelemetry';

export default function EnergyChart() {
  const [view, setView] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  const data = view === 'daily' 
    ? get24HourTelemetry() 
    : view === 'weekly' 
    ? get7DayTelemetry() 
    : get30DayTelemetry();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[170px]">
          <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>{view === 'daily' ? `Time: ${label}` : label}</span>
            <span className="text-emerald-400 font-mono">
              {view === 'daily' ? `${p.instantPowerKw || 0} kW` : `${p.peakPowerKw || 0} kW pk`}
            </span>
          </p>
          <div className="flex items-center justify-between text-slate-300">
            <span>Generated:</span>
            <span className="font-bold text-white">{p.energyKwh} kWh</span>
          </div>
          {view === 'daily' && p.cumulativeEnergyKwh !== undefined && (
            <div className="flex items-center justify-between text-slate-400">
              <span>Cumulative:</span>
              <span className="font-semibold text-emerald-300">{p.cumulativeEnergyKwh} kWh</span>
            </div>
          )}
          {p.avgBatteryVoltage && (
            <div className="flex items-center justify-between text-slate-400">
              <span>Avg Battery:</span>
              <span className="font-mono text-blue-300">{p.avgBatteryVoltage} V</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Zap className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Energy Generation Over Time
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet energy production measured in kilowatt-hours (kWh)
          </p>
        </div>

        {/* View Switcher */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setView('daily')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              view === 'daily'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily (24h)
          </button>
          <button
            type="button"
            onClick={() => setView('weekly')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              view === 'weekly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setView('monthly')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              view === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly (30d)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              unit=" kWh"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="energyKwh"
              name="Generated Energy (kWh)"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#energyGradient)"
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info Callout */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Accounting for sample intervals (Hourly numerical integration)</span>
        </span>
        <span className="font-semibold text-emerald-600">
          Peak Window: 11:00 — 14:00
        </span>
      </div>
    </div>
  );
}
