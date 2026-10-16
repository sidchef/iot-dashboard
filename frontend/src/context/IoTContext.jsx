import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_DEVICES } from '../data/mockDevices';
import { INITIAL_ALERTS } from '../data/mockAlerts';

const IoTContext = createContext(null);

const DEFAULT_SETTINGS = {
  profile: {
    name: "Alex Morgan",
    email: "alex.morgan@iotcloud.io",
    role: "Senior Operations Director",
    organization: "Apex Grid Telemetry Corp",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
  },
  thresholds: {
    lowBatteryVoltage: 11.8,
    highTemperature: 45.0,
    minSolarVoltage: 15.0,
  },
  preferences: {
    telemetryRefreshInterval: 5, // seconds
    defaultTimeRange: 'today',
    enableLiveSimulation: true,
    notifications: {
      criticalAlertEmail: true,
      pushAlerts: true,
      weeklySummary: false,
    }
  }
};

export const IoTProvider = ({ children }) => {
  // Load initial devices from localStorage or fallback to INITIAL_DEVICES
  const [devices, setDevices] = useState(() => {
    try {
      const saved = localStorage.getItem('iotcloud_devices_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed reading devices from localStorage", e);
    }
    return INITIAL_DEVICES;
  });

  // Load alerts from localStorage or fallback to INITIAL_ALERTS
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('iotcloud_alerts_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed reading alerts from localStorage", e);
    }
    return INITIAL_ALERTS;
  });

  // Load settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('iotcloud_settings_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed reading settings from localStorage", e);
    }
    return DEFAULT_SETTINGS;
  });

  // Global filters
  const [dateRange, setDateRange] = useState('today');
  const [globalSearch, setGlobalSearch] = useState('');
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Sync devices to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iotcloud_devices_v1', JSON.stringify(devices));
    } catch (e) {
      console.error(e);
    }
  }, [devices]);

  // Sync alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iotcloud_alerts_v1', JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iotcloud_settings_v1', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Periodic simulated telemetry updates (small realistic jitter to demonstrate live feel)
  useEffect(() => {
    if (!isLiveActive || !settings?.preferences?.enableLiveSimulation) return;

    const intervalMs = (settings?.preferences?.telemetryRefreshInterval || 5) * 1000;
    const timer = setInterval(() => {
      setDevices((prevDevices) => {
        // Pick 3 to 5 random online devices to update slightly
        const updated = [...prevDevices];
        const countToUpdate = Math.min(4, updated.length);

        for (let i = 0; i < countToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const dev = updated[randomIndex];

          if (dev.status === 'online' || dev.status === 'warning') {
            const vDelta = (Math.random() - 0.48) * 0.12;
            const aDelta = (Math.random() - 0.48) * 0.3;
            const newBattV = Math.max(10.5, Math.min(14.4, Number((dev.batteryVoltage + vDelta).toFixed(2))));
            const newBattA = Math.max(0.1, Number((dev.batteryCurrent + aDelta).toFixed(1)));
            const newSolarV = dev.solarVoltage > 0 ? Math.max(10.0, Number((dev.solarVoltage + (Math.random() - 0.49) * 0.4).toFixed(1))) : 0;
            const newEnergy = Number((dev.energyGenerated + 0.05).toFixed(2));

            updated[randomIndex] = {
              ...dev,
              batteryVoltage: newBattV,
              batteryCurrent: newBattA,
              solarVoltage: newSolarV,
              energyGenerated: newEnergy,
              lastUpdated: "Just now"
            };
          }
        }
        return updated;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isLiveActive, settings?.preferences?.enableLiveSimulation, settings?.preferences?.telemetryRefreshInterval]);

  // Add new device
  const addDevice = (newDev) => {
    const id = newDev.id || `DEV-${String(devices.length + 1).padStart(3, '0')}`;
    const formatted = {
      ...newDev,
      id,
      batteryVoltage: Number(newDev.batteryVoltage || 12.6),
      batteryCurrent: Number(newDev.batteryCurrent || 12.0),
      solarVoltage: Number(newDev.solarVoltage || 38.0),
      energyGenerated: Number(newDev.energyGenerated || 0),
      temperature: Number(newDev.temperature || 28.0),
      uptime: 100.0,
      firmware: newDev.firmware || "v3.1.0",
      signalStrength: -60,
      installedAt: new Date().toISOString().split('T')[0],
      lastUpdated: "Just now",
      status: newDev.status || "online"
    };

    setDevices((prev) => [formatted, ...prev]);
    return formatted;
  };

  // Update existing device
  const updateDevice = (id, updates) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  // Delete device
  const deleteDevice = (id) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  // Acknowledge alert
  const acknowledgeAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Acknowledged' } : a))
    );
  };

  // Resolve alert
  const resolveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' } : a))
    );
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      profile: { ...prev.profile, ...(newSettings.profile || {}) },
      thresholds: { ...prev.thresholds, ...(newSettings.thresholds || {}) },
      preferences: { ...prev.preferences, ...(newSettings.preferences || {}) },
    }));
  };

  // Reset to default factory mock state
  const resetToFactoryDefaults = () => {
    localStorage.removeItem('iotcloud_devices_v1');
    localStorage.removeItem('iotcloud_alerts_v1');
    localStorage.removeItem('iotcloud_settings_v1');
    setDevices(INITIAL_DEVICES);
    setAlerts(INITIAL_ALERTS);
    setSettings(DEFAULT_SETTINGS);
  };

  // Aggregated fleet statistics
  const metrics = useMemo(() => {
    const total = devices.length;
    const online = devices.filter((d) => d.status === 'online').length;
    const offline = devices.filter((d) => d.status === 'offline').length;
    const warning = devices.filter((d) => d.status === 'warning').length;
    const critical = devices.filter((d) => d.status === 'critical').length;
    const activeAlerts = alerts.filter((a) => a.status === 'Active').length;

    // Filter out 0V readings (offline devices) for realistic average battery calculation
    const activeBatteryDevices = devices.filter((d) => d.batteryVoltage > 0);
    const avgVoltage = activeBatteryDevices.length > 0
      ? Number((activeBatteryDevices.reduce((acc, d) => acc + d.batteryVoltage, 0) / activeBatteryDevices.length).toFixed(1))
      : 12.6;

    const totalEnergy = Number(devices.reduce((acc, d) => acc + (d.energyGenerated || 0), 0).toFixed(1));

    return {
      total,
      online,
      offline,
      warning,
      critical,
      activeAlerts,
      avgVoltage,
      totalEnergy
    };
  }, [devices, alerts]);

  return (
    <IoTContext.Provider
      value={{
        devices,
        alerts,
        settings,
        metrics,
        dateRange,
        setDateRange,
        globalSearch,
        setGlobalSearch,
        isLiveActive,
        setIsLiveActive,
        addDevice,
        updateDevice,
        deleteDevice,
        acknowledgeAlert,
        resolveAlert,
        updateSettings,
        resetToFactoryDefaults
      }}
    >
      {children}
    </IoTContext.Provider>
  );
};

export const useIoT = () => {
  const context = useContext(IoTContext);
  if (!context) {
    throw new Error('useIoT must be used within an IoTProvider');
  }
  return context;
};
