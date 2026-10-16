import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { IoTProvider } from './context/IoTContext';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Overview from './pages/Overview';
import Devices from './pages/Devices';
import DeviceDetailsPage from './pages/DeviceDetailsPage';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <IoTProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="devices" element={<Devices />} />
            <Route path="devices/:id" element={<DeviceDetailsPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </IoTProvider>
  );
}
