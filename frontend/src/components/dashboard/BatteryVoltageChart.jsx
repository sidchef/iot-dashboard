import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { BatteryCharging, ShieldAlert } from 'lucide-react';
import { get24HourTelemetry } from '../../data/mockTelemetry';
import { useIoT } from '../../context/IoTContext';

export default function BatteryVoltageChart() {
  const { metrics, settings } = useIoT();
  const data = get24HourTelemetry();
  const lowThreshold = settings?.thresholds?.lowBatteryVoltage || 11.8;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1 min-w-[150px]">
          <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1">
            Time: {label}
          </p>
          <div className="flex items-center justify-between text-slate-300">
            <span>Battery:</span>
            <span className="font-bold text-blue-400 font-mono">{p.batteryVoltage} V</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Solar V:</span>
            <span className="font-mono text-emerald-300">{p.solarVoltage} V</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Charge Current:</span>
            <span className="font-mono text-amber-300">{p.solarCurrent} A</span>
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
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <BatteryCharging className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Battery Voltage Trends
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Fleet Avg:</span>
          <span className="text-xs font-bold text-blue-600 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
            {metrics.avgVoltage} V
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        24-hour fleet battery storage cycle relative to minimum discharge threshold
      </p>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              domain={[10.5, 14.5]}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              unit=" V"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={lowThreshold}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              label={{
                value: `Cutoff (${lowThreshold}V)`,
                fill: '#f43f5e',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />
            <Line
              type="monotone"
              dataKey="batteryVoltage"
              name="Battery Voltage"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-rose-600">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Cutoff Threshold: {lowThreshold}V</span>
        </span>
        <span className="text-slate-400">Nominal Float: 12.6V – 13.8V</span>
      </div>
    </div>
  );
}
