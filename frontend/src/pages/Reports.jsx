import React, { useState, useMemo } from 'react';
import { useIoT } from '../context/IoTContext';
import { exportToCSV } from '../utils/exportCSV';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  Zap,
  Cpu,
  AlertTriangle,
  Leaf,
  Layers,
  MapPin,
  TrendingUp,
  Clock
} from 'lucide-react';
import { getRegionalTelemetry } from '../data/mockTelemetry';
import { calculateCarbonOffset, formatEnergy } from '../utils/calculations';

export default function Reports() {
  const { devices, alerts, metrics } = useIoT();

  const [reportPeriod, setReportPeriod] = useState('30d'); // '7d' | '30d' | 'quarter' | 'year'

  // Multiplier based on period
  const periodMultiplier = reportPeriod === '7d' ? 0.25 : reportPeriod === 'quarter' ? 3.0 : reportPeriod === 'year' ? 12.0 : 1.0;

  const totalPeriodEnergyKwh = Number((metrics.totalEnergy * periodMultiplier).toFixed(1));
  const estimatedCarbonOffsetKg = calculateCarbonOffset(totalPeriodEnergyKwh);
  const regionalData = useMemo(() => getRegionalTelemetry(devices), [devices]);

  // Overall system uptime average
  const avgUptime = useMemo(() => {
    const onlineDevs = devices.filter((d) => d.uptime > 0);
    if (!onlineDevs.length) return 98.5;
    return Number((onlineDevs.reduce((acc, d) => acc + d.uptime, 0) / onlineDevs.length).toFixed(1));
  }, [devices]);

  // Export Regional & Fleet Summary as CSV
  const handleExportReportCSV = () => {
    const reportRows = regionalData.map((reg) => ({
      Region: reg.region,
      TotalUnits: reg.devices,
      OnlineUnits: reg.online,
      WarningUnits: reg.warning,
      CriticalUnits: reg.critical,
      OfflineUnits: reg.offline,
      FleetHealthPct: `${reg.healthRate}%`,
      PeriodEnergyYieldKwh: (reg.totalEnergyKwh * periodMultiplier).toFixed(1),
      EstimatedCO2OffsetKg: calculateCarbonOffset(reg.totalEnergyKwh * periodMultiplier),
      SamplingInterval: '60 minutes',
      ReportPeriod: reportPeriod.toUpperCase(),
      GeneratedDate: new Date().toISOString()
    }));

    exportToCSV(
      reportRows,
      `IoTCloud_Fleet_Summary_Report_${reportPeriod}_${new Date().toISOString().split('T')[0]}`
    );
  };

  // Export All Individual Device Telemetry Records as CSV
  const handleExportFullDeviceCSV = () => {
    const columns = [
      { key: 'id', label: 'Device ID' },
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
      { key: 'region', label: 'Region' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
      { key: 'batteryVoltage', label: 'Battery (V)' },
      { key: 'batteryCurrent', label: 'Current (A)' },
      { key: 'solarVoltage', label: 'Solar (V)' },
      { key: 'energyGenerated', label: 'Energy (kWh)' },
      { key: 'uptime', label: 'Uptime (%)' },
      { key: 'temperature', label: 'Temperature (°C)' },
      { key: 'firmware', label: 'Firmware' },
      { key: 'lastUpdated', label: 'Last Updated' },
    ];
    exportToCSV(devices, `IoTCloud_Telemetry_Fleet_${new Date().toISOString().split('T')[0]}`, columns);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Fleet Telemetry & Operational Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit-ready energy generation statistics, asset uptime reliability, and regional sustainability yields.
          </p>
        </div>

        {/* Period Selector & Export */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Period Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-lg text-xs shadow-2xs">
            <span className="text-slate-400 pl-2 pr-1">Period:</span>
            {['7d', '30d', 'quarter', 'year'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setReportPeriod(p)}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-colors ${
                  reportPeriod === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === 'quarter' ? 'Quarter' : 'Full Year'}
              </button>
            ))}
          </div>

          {/* Export Report CSV */}
          <button
            type="button"
            onClick={handleExportReportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards for Selected Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Registered */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium uppercase tracking-wider">Registered Assets</span>
            <Cpu className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{devices.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Active fleet deployments</span>
        </div>

        {/* Fleet Uptime */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium uppercase tracking-wider">Mean Fleet Uptime</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{avgUptime}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Target SLA &gt; 98.0%</span>
        </div>

        {/* Period Energy Generated */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium uppercase tracking-wider">Energy Generated</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{formatEnergy(totalPeriodEnergyKwh)}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">For {reportPeriod} duration</span>
        </div>

        {/* Incidents Recorded */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium uppercase tracking-wider">Total Alerts</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{alerts.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {alerts.filter((a) => a.status === 'Resolved').length} resolved incidents
          </span>
        </div>

        {/* Carbon Offset */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium uppercase tracking-wider">CO₂ Offset Avoided</span>
            <Leaf className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">
            {estimatedCarbonOffsetKg.toLocaleString()} <span className="text-sm font-semibold">kg</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">0.385 kg CO₂ / kWh benchmark</span>
        </div>
      </div>

      {/* Regional Performance Summaries Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Regional Performance Summaries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregated generation yields and hardware reliability categorized by deployment territory.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportFullDeviceCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors self-start sm:self-auto"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Raw Device Inventory (CSV)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Online / Health</th>
                <th className="py-3 px-4">Warning / Critical</th>
                <th className="py-3 px-4">Offline</th>
                <th className="py-3 px-4">Period Yield (kWh)</th>
                <th className="py-3 px-4">Estimated Carbon Offset</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {regionalData.map((reg) => {
                const regEnergy = Number((reg.totalEnergyKwh * periodMultiplier).toFixed(1));
                const regCarbon = calculateCarbonOffset(regEnergy);

                return (
                  <tr key={reg.region} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {reg.region}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      {reg.devices} units
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-600">{reg.online}</span>
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${reg.healthRate}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{reg.healthRate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={reg.warning > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                        {reg.warning} warn
                      </span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span className={reg.critical > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                        {reg.critical} crit
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={reg.offline > 0 ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                        {reg.offline} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {regEnergy.toLocaleString()} kWh
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                      {regCarbon.toLocaleString()} kg CO₂
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          reg.healthRate >= 90
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {reg.healthRate >= 90 ? 'Optimal' : 'Intervention Needed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Client-side CSV generated dynamically via Blob & HTML5 download API</span>
          <span className="font-mono text-slate-400">Total {devices.length} Monitored Endpoints</span>
        </div>
      </div>
    </div>
  );
}
