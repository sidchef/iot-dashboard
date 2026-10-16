import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  Eye,
  CheckCheck,
  ExternalLink,
  Search,
  Zap,
  Info
} from 'lucide-react';
import { useIoT } from '../../context/IoTContext';

export default function AlertsTable({ alerts, searchQuery = '' }) {
  const navigate = useNavigate();
  const { acknowledgeAlert, resolveAlert } = useIoT();

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Filter logic
  const filteredAlerts = useMemo(() => {
    let result = [...alerts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.deviceId.toLowerCase().includes(q) ||
          a.deviceName.toLowerCase().includes(q) ||
          a.alertType.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    if (severityFilter !== 'ALL') {
      result = result.filter((a) => a.severity.toLowerCase() === severityFilter.toLowerCase());
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((a) => a.status.toLowerCase() === statusFilter.toLowerCase());
    }

    return result;
  }, [alerts, searchQuery, severityFilter, statusFilter]);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              Filter Incidents:
            </span>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>

            {(severityFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSeverityFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 ml-1"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredAlerts.length}</span> recorded alerts
          </div>
        </div>

        {/* Alerts Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Alert Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 hidden md:table-cell">Description</th>
                <th className="py-3 px-4 hidden lg:table-cell">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                      <p className="font-semibold text-slate-700">No alerts match criteria</p>
                      <p className="text-xs text-slate-400">All threshold conditions are operating normally.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    {/* Alert ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {alert.id}
                      </span>
                    </td>

                    {/* Device */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-slate-900 block leading-tight">{alert.deviceName}</span>
                        <span className="font-mono text-[11px] text-slate-400 leading-tight">{alert.deviceId}</span>
                      </div>
                    </td>

                    {/* Alert Type */}
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {alert.alertType}
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4">
                      <StatusBadge status={alert.severity} size="sm" />
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-slate-600 hidden md:table-cell max-w-xs truncate">
                      {alert.description}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs hidden lg:table-cell">
                      {alert.timestamp}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          alert.status === 'Active'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : alert.status === 'Acknowledged'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {alert.status === 'Active' && (
                          <button
                            type="button"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
                            title="Acknowledge alert"
                          >
                            Ack
                          </button>
                        )}

                        {alert.status !== 'Resolved' && (
                          <button
                            type="button"
                            onClick={() => resolveAlert(alert.id)}
                            className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                            title="Resolve alert"
                          >
                            Resolve
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedAlert(alert)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View incident details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <Modal
          isOpen={Boolean(selectedAlert)}
          onClose={() => setSelectedAlert(null)}
          title={`Incident Detail — ${selectedAlert.id}`}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  {selectedAlert.id} • {selectedAlert.region || 'Site Zone'}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedAlert.alertType}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Device: <strong>{selectedAlert.deviceName}</strong> ({selectedAlert.deviceId})
                </p>
              </div>
              <StatusBadge status={selectedAlert.severity} />
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-2">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Incident Narrative & Root Cause
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {selectedAlert.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Recorded Value</span>
                <span className="font-mono font-bold text-rose-600 text-sm mt-0.5 block">
                  {selectedAlert.actualValue || 'Threshold Exceeded'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Configured Threshold</span>
                <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                  {selectedAlert.threshold || 'Default Limit'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Detected: {selectedAlert.timestamp}</span>
              </span>
              <span className="font-semibold text-slate-700">
                Current Status: {selectedAlert.status}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedAlert(null);
                  navigate(`/devices/${selectedAlert.deviceId}`);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>Go to Device Telemetry</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-2">
                {selectedAlert.status === 'Active' && (
                  <button
                    type="button"
                    onClick={() => {
                      acknowledgeAlert(selectedAlert.id);
                      setSelectedAlert((prev) => ({ ...prev, status: 'Acknowledged' }));
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
                {selectedAlert.status !== 'Resolved' && (
                  <button
                    type="button"
                    onClick={() => {
                      resolveAlert(selectedAlert.id);
                      setSelectedAlert((prev) => ({ ...prev, status: 'Resolved' }));
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Resolve Incident</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
