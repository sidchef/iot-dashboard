import React, { useState, useMemo } from 'react';
import { useIoT } from '../context/IoTContext';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import {
  LineChart as AnalyticsIcon,
  Filter,
  Zap,
  BatteryCharging,
  Activity,
  Layers,
  MapPin,
  Clock,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  get24HourTelemetry,
  get7DayTelemetry,
  get30DayTelemetry,
  getRegionalTelemetry
} from '../data/mockTelemetry';
import {
  calculatePower,
  calculateEnergyKwh,
  formatPower,
  formatEnergy,
  formatVoltage,
  formatCurrent
} from '../utils/calculations';

export default function Analytics() {
  const { devices, dateRange, setDateRange } = useIoT();

  // Filter state
  const [selectedDevice, setSelectedDevice] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [measurementType, setMeasurementType] = useState('all');

  // Locations list
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.location))).filter(Boolean);
  }, [devices]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.type))).filter(Boolean);
  }, [devices]);

  // Telemetry series based on dateRange
  const telemetrySeries = useMemo(() => {
    let base = dateRange === '7d' 
      ? get7DayTelemetry() 
      : dateRange === '30d' || dateRange === '90d'
      ? get30DayTelemetry()
      : get24HourTelemetry();

    // If specific device or type or location is selected, apply realistic scaling factor
    let scale = 1.0;
    if (selectedDevice !== 'ALL') {
      const dev = devices.find((d) => d.id === selectedDevice);
      scale = dev ? (dev.energyGenerated / 140) : 0.4;
    } else if (selectedType !== 'ALL') {
      scale = selectedType === 'Solar Unit' ? 1.2 : 0.6;
    } else if (selectedLocation !== 'ALL') {
      scale = 0.85;
    }

    return base.map((p) => ({
      ...p,
      energyKwh: Number((p.energyKwh * scale).toFixed(1)),
      powerWatts: p.powerWatts ? Number((p.powerWatts * scale).toFixed(1)) : undefined,
    }));
  }, [dateRange, selectedDevice, selectedType, selectedLocation, devices]);

  // Regional breakdown filtered
  const regionalData = useMemo(() => {
    let activeDevs = devices;
    if (selectedType !== 'ALL') activeDevs = activeDevs.filter((d) => d.type === selectedType);
    if (selectedLocation !== 'ALL') activeDevs = activeDevs.filter((d) => d.location === selectedLocation);
    return getRegionalTelemetry(activeDevs);
  }, [devices, selectedType, selectedLocation]);

  // Device comparison data
  const comparisonData = useMemo(() => {
    let list = [...devices];
    if (selectedType !== 'ALL') list = list.filter((d) => d.type === selectedType);
    if (selectedLocation !== 'ALL') list = list.filter((d) => d.location === selectedLocation);
    
    return list.slice(0, 10).map((d) => ({
      name: d.name.replace('Solar Unit ', '').replace('Remote Sensor ', '').replace('Power Monitor ', ''),
      id: d.id,
      energy: d.energyGenerated,
      voltage: d.batteryVoltage,
      uptime: d.uptime,
      power: calculatePower(d.batteryVoltage, d.batteryCurrent)
    }));
  }, [devices, selectedType, selectedLocation]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Telemetry & Energy Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Deep-dive telemetry exploration, energy conversion efficiency, and device performance metrics.
        </p>
      </div>

      {/* Physics / Measurement Distinction Notice Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-blue-800/50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-600/40 text-blue-200 border border-blue-400/30 shrink-0 mt-0.5">
            <Zap className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white tracking-wide">
                Electrical Measurement Standards & Numerical Integration
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-800 text-blue-200">
                Scientific Basis
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              Instantaneous power is strictly differentiated from accumulated energy yield:
              <strong className="text-white ml-1">Power (W) = Voltage (V) × Current (A)</strong>, whereas
              <strong className="text-emerald-300 ml-1">Energy (kWh) = ∫ Power dt / 1000</strong>. Energy is never computed by merely summing instantaneous power values without discrete sample interval weighting (Δt = 60 min).
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Parameter Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-blue-600" />
          Telemetry Exploration Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Time Range */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Date Interval</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="today">Today (24 Hours)</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {/* Specific Device */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Specific Device</label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">All Devices (Fleet Aggregation)</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} — {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Device Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">All Device Types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Site Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">All Locations & Regions</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Measurement Highlight */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Focus Metric</label>
            <select
              value={measurementType}
              onChange={(e) => setMeasurementType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Telemetry Charts</option>
              <option value="energy">Energy Yield (kWh)</option>
              <option value="voltage">Battery Float Voltage (V)</option>
              <option value="uptime">Fleet Availability (%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Energy Generated Over Time (kWh) */}
        {(measurementType === 'all' || measurementType === 'energy') && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-600" />
                Energy Generated Over Time
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                kWh
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Discrete integration of power across sample intervals
            </p>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetrySeries} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="anaEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} unit=" kWh" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded shadow-lg text-xs space-y-1">
                            <p className="font-semibold text-slate-200">{label}</p>
                            <p className="text-emerald-400 font-bold">{payload[0]?.value} kWh</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="energyKwh"
                    name="Energy (kWh)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#anaEnergy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: Average Battery Voltage Trends (V) */}
        {(measurementType === 'all' || measurementType === 'voltage') && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BatteryCharging className="h-4 w-4 text-blue-600" />
                Average Battery Voltage Trend
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Volts (V)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Mean battery storage state with upper float and lower reserve boundaries
            </p>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetrySeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[11.0, 14.0]} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} unit="V" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded shadow-lg text-xs space-y-1">
                            <p className="font-semibold text-slate-200">{label}</p>
                            <p className="text-blue-400 font-mono font-bold">
                              {payload[0]?.value || payload[0]?.payload?.avgBatteryVoltage} V
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={telemetrySeries[0]?.batteryVoltage !== undefined ? 'batteryVoltage' : 'avgBatteryVoltage'}
                    name="Battery Voltage (V)"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 3: Energy Generation by Region */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              Regional Energy Yield Distribution
            </h3>
            <span className="text-xs text-slate-500 font-mono">Total kWh</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Aggregated renewable kilowatt-hours generated per regional deployment
          </p>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} unit=" kWh" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded shadow-lg text-xs space-y-1">
                          <p className="font-semibold text-slate-200">{label}</p>
                          <p className="text-indigo-400 font-bold">{payload[0]?.value} kWh</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="totalEnergyKwh" name="Energy (kWh)" radius={[4, 4, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Device Performance & Yield Comparison */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-600" />
              Device Performance Comparison
            </h3>
            <span className="text-xs text-slate-500 font-mono">Top 10 Units</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Comparative cumulative energy yield across individual monitored units
          </p>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} unit=" kWh" />
                <YAxis dataKey="name" type="category" tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded shadow-lg text-xs space-y-1">
                          <p className="font-semibold text-slate-200">{d.id} — {d.name}</p>
                          <p className="text-purple-300 font-bold">Total: {d.energy} kWh</p>
                          <p className="text-slate-400 font-mono">Battery: {d.voltage}V | Uptime: {d.uptime}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="energy" name="Energy (kWh)" radius={[0, 4, 4, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
