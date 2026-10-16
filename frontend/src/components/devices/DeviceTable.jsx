import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
  Activity,
  Layers,
  BatteryCharging,
  Sun
} from 'lucide-react';
import { formatVoltage, formatCurrent } from '../../utils/calculations';

export default function DeviceTable({
  devices,
  searchQuery = '',
  onSelectDevice,
  onQuickView,
}) {
  const navigate = useNavigate();

  // Filters & sorting state
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Extract distinct device types and regions for filters
  const deviceTypes = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.type))).filter(Boolean);
  }, [devices]);

  const regions = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.region))).filter(Boolean);
  }, [devices]);

  // Handle header sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Filter & sort logic
  const filteredDevices = useMemo(() => {
    let result = [...devices];

    // Search query (Device Name, ID, or Location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((d) => d.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      result = result.filter((d) => d.type === typeFilter);
    }

    // Region filter
    if (regionFilter !== 'ALL') {
      result = result.filter((d) => d.region === regionFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [devices, searchQuery, statusFilter, typeFilter, regionFilter, sortField, sortOrder]);

  // Pagination calculation
  const totalItems = filteredDevices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedDevices = filteredDevices.slice(startIndex, startIndex + pageSize);

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-blue-600" />
    ) : (
      <ArrowDown className="h-3 w-3 text-blue-600" />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Table Filter Controls Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            Filters:
          </span>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="online">Online</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="offline">Offline</option>
          </select>

          {/* Device Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          >
            <option value="ALL">All Device Types</option>
            {deviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          >
            <option value="ALL">All Regions</option>
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>

          {(statusFilter !== 'ALL' || typeFilter !== 'ALL' || regionFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setRegionFilter('ALL');
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 ml-1"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Total match counter */}
        <div className="text-slate-500">
          Showing <span className="font-bold text-slate-800">{totalItems}</span> matching devices
        </div>
      </div>

      {/* Table Canvas with Horizontal Scroll */}
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 cursor-pointer group" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1.5">
                  <span>Device ID</span>
                  <SortIcon field="id" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer group" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1.5">
                  <span>Device Name</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer group hidden md:table-cell" onClick={() => handleSort('location')}>
                <div className="flex items-center gap-1.5">
                  <span>Location</span>
                  <SortIcon field="location" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer group hidden lg:table-cell" onClick={() => handleSort('type')}>
                <div className="flex items-center gap-1.5">
                  <span>Device Type</span>
                  <SortIcon field="type" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer group" onClick={() => handleSort('batteryVoltage')}>
                <div className="flex items-center gap-1.5">
                  <BatteryCharging className="h-3.5 w-3.5 text-blue-500" />
                  <span>Battery (V)</span>
                  <SortIcon field="batteryVoltage" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer group hidden sm:table-cell" onClick={() => handleSort('batteryCurrent')}>
                <div className="flex items-center gap-1.5">
                  <span>Current (A)</span>
                  <SortIcon field="batteryCurrent" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer group hidden sm:table-cell" onClick={() => handleSort('solarVoltage')}>
                <div className="flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span>Solar (V)</span>
                  <SortIcon field="solarVoltage" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer group hidden xl:table-cell" onClick={() => handleSort('lastUpdated')}>
                <div className="flex items-center gap-1.5">
                  <span>Last Updated</span>
                  <SortIcon field="lastUpdated" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer group" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedDevices.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <Activity className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="font-semibold text-slate-700">No IoT devices match current criteria</p>
                    <p className="text-xs text-slate-400">Try adjusting your search terms or filter selections.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedDevices.map((device) => (
                <tr
                  key={device.id}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  {/* ID */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {device.id}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <button
                      type="button"
                      onClick={() => navigate(`/devices/${device.id}`)}
                      className="hover:text-blue-600 transition-colors text-left"
                    >
                      {device.name}
                    </button>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-slate-600 hidden md:table-cell">
                    {device.location}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4 text-slate-600 hidden lg:table-cell">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {device.type}
                    </span>
                  </td>

                  {/* Battery Voltage */}
                  <td className="py-3 px-4 font-mono font-semibold">
                    <span className={device.batteryVoltage < 11.5 && device.batteryVoltage > 0 ? 'text-amber-600 font-bold' : device.batteryVoltage === 0 ? 'text-slate-400' : 'text-slate-900'}>
                      {formatVoltage(device.batteryVoltage)}
                    </span>
                  </td>

                  {/* Battery Current */}
                  <td className="py-3 px-4 font-mono text-slate-600 hidden sm:table-cell">
                    {formatCurrent(device.batteryCurrent)}
                  </td>

                  {/* Solar Voltage */}
                  <td className="py-3 px-4 font-mono text-slate-600 hidden sm:table-cell">
                    {formatVoltage(device.solarVoltage)}
                  </td>

                  {/* Last Updated */}
                  <td className="py-3 px-4 text-slate-500 text-xs hidden xl:table-cell">
                    {device.lastUpdated}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <StatusBadge status={device.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      {/* Quick Inspect Button */}
                      <button
                        type="button"
                        onClick={() => onQuickView && onQuickView(device)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Quick telemetry preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Full Details Page Link */}
                      <button
                        type="button"
                        onClick={() => navigate(`/devices/${device.id}`)}
                        className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                        title="Open device telemetry details page"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-400">|</span>
          <span>
            Showing <span className="font-semibold text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="font-semibold text-slate-800">{Math.min(startIndex + pageSize, totalItems)}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalItems}</span>
          </span>
        </div>

        {/* Page Navigators */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="px-2.5 py-1 rounded-md font-semibold text-slate-800">
            Page {validCurrentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={validCurrentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
