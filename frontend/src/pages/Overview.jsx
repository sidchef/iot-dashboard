import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  BatteryCharging,
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  MapPin
} from 'lucide-react';
import { useIoT } from '../context/IoTContext';
import MetricCard from '../components/dashboard/MetricCard';
import EnergyChart from '../components/dashboard/EnergyChart';
import DeviceStatusChart from '../components/dashboard/DeviceStatusChart';
import BatteryVoltageChart from '../components/dashboard/BatteryVoltageChart';
import RegionalDistributionChart from '../components/dashboard/RegionalDistributionChart';
import StatusBadge from '../components/common/StatusBadge';
import { formatEnergy } from '../utils/calculations';

export default function Overview() {
  const navigate = useNavigate();
  const { metrics, devices, alerts } = useIoT();

  // Top 5 critical or warning devices for quick intervention
  const attentionDevices = devices
    .filter((d) => d.status === 'critical' || d.status === 'warning')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Title & System Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Fleet Telemetry Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status, renewable energy generation, and battery storage diagnostics across all monitoring zones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => navigate('/devices')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <span>Manage All Devices</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/alerts')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <span>Review Incidents</span>
            {metrics.activeAlerts > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] text-white">
                {metrics.activeAlerts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid (6 Cards per prompt requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Devices */}
        <MetricCard
          title="Total Devices"
          value={metrics.total || 250}
          subtitle="Monitored IoT units"
          icon={Cpu}
          trend="+4 added this mo"
          trendDirection="up"
          variant="default"
          onClick={() => navigate('/devices')}
        />

        {/* Online Devices */}
        <MetricCard
          title="Online Devices"
          value={metrics.online || 224}
          subtitle="Transmitting telemetry"
          icon={CheckCircle2}
          trend="89.6% fleet uptime"
          trendDirection="up"
          variant="success"
          onClick={() => navigate('/devices')}
        />

        {/* Offline Devices */}
        <MetricCard
          title="Offline Devices"
          value={metrics.offline || 26}
          subtitle="Communication timeout"
          icon={AlertOctagon}
          trend="Needs field check"
          trendDirection="down"
          variant="danger"
          onClick={() => navigate('/devices')}
        />

        {/* Active Alerts */}
        <MetricCard
          title="Active Alerts"
          value={metrics.activeAlerts || 8}
          subtitle="Open threshold incidents"
          icon={AlertTriangle}
          trend={metrics.critical > 0 ? `${metrics.critical} critical severity` : 'Low severity'}
          trendDirection={metrics.critical > 0 ? 'down' : 'neutral'}
          variant="warning"
          onClick={() => navigate('/alerts')}
        />

        {/* Average Battery Voltage */}
        <MetricCard
          title="Avg Battery Voltage"
          value={metrics.avgVoltage || 12.6}
          unit="V"
          subtitle="Nominal float range"
          icon={BatteryCharging}
          trend="Safe charge state"
          trendDirection="neutral"
          variant="info"
        />

        {/* Total Energy Generated */}
        <MetricCard
          title="Energy Generated"
          value={(metrics.totalEnergy || 1245).toLocaleString()}
          unit="kWh"
          subtitle="Current session yield"
          icon={Zap}
          trend="+12.4% vs target"
          trendDirection="up"
          variant="success"
          onClick={() => navigate('/analytics')}
        />
      </div>

      {/* Charts Section 1: Energy Generation & Device Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnergyChart />
        </div>
        <div>
          <DeviceStatusChart />
        </div>
      </div>

      {/* Charts Section 2: Battery Voltage Trends & Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <BatteryVoltageChart />
        </div>
        <div>
          <RegionalDistributionChart />
        </div>
      </div>

      {/* Bottom Priority Section: Attention Required Devices + Latest Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention Units */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Units Requiring Attention
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/devices')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View All ({devices.length}) &rarr;
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Devices displaying low battery levels or elevated operating temperatures
          </p>

          <div className="space-y-2.5">
            {attentionDevices.map((dev) => (
              <div
                key={dev.id}
                onClick={() => navigate(`/devices/${dev.id}`)}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    {dev.id}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{dev.name}</p>
                    <p className="text-slate-500 text-[11px]">{dev.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="block font-bold text-slate-800">{dev.batteryVoltage} V</span>
                    <span className="text-[10px] text-slate-400">{dev.temperature}°C</span>
                  </div>
                  <StatusBadge status={dev.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest High-Priority Incidents */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertOctagon className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Incident Alerts
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Manage Alerts ({alerts.length}) &rarr;
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Automated threshold anomalies registered by system watchers
          </p>

          <div className="space-y-2.5">
            {alerts.slice(0, 4).map((alt) => (
              <div
                key={alt.id}
                onClick={() => navigate('/alerts')}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{alt.alertType}</span>
                    <span className="text-[10px] font-mono text-slate-400">• {alt.deviceId}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-1 mt-0.5">{alt.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <StatusBadge status={alt.severity} size="sm" />
                  <span className="block text-[10px] text-slate-400 font-mono mt-1">
                    {alt.timestamp.split(' ')[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
