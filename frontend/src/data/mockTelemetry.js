/**
 * mockTelemetry.js
 * Centralized telemetry data generator and aggregations for IoTCloud.
 * Accurately models electrical parameters:
 * Voltage (V), Current (A), Power (W = V * A), and Energy (kWh = ∫ P dt).
 */

import { calculatePower, calculateEnergyKwh } from '../utils/calculations';

// Realistic 24-hour baseline curve for solar energy generation & battery performance
export const get24HourTelemetry = () => {
  const points = [];
  let cumulativeKwh = 0;

  for (let hour = 0; hour < 24; hour++) {
    const timeLabel = `${String(hour).padStart(2, '0')}:00`;
    
    // Solar irradiance curve (peaks between 11:00 and 14:00)
    let solarIrradiance = 0;
    if (hour >= 6 && hour <= 19) {
      const peakDist = Math.abs(hour - 12.5);
      solarIrradiance = Math.max(0, Math.sin(((hour - 5.5) / 14) * Math.PI));
    }

    // Solar array voltage (V)
    const solarVoltage = solarIrradiance > 0 
      ? Number((34.0 + (solarIrradiance * 11.5) + (Math.sin(hour) * 1.2)).toFixed(1))
      : Number((0.2 + (Math.random() * 0.4)).toFixed(1));

    // Solar array current across all combined monitored arrays (A)
    const solarCurrent = solarIrradiance > 0 
      ? Number((solarIrradiance * 28.5 + (Math.cos(hour) * 1.5)).toFixed(1))
      : 0.0;

    // Instantaneous power in Watts
    const powerWatts = calculatePower(solarVoltage, solarCurrent);

    // Battery voltage fluctuates with charging cycle
    const batteryVoltage = solarIrradiance > 0.4 
      ? Number((12.8 + (solarIrradiance * 0.9)).toFixed(2))
      : Number((12.4 - ((hour < 6 ? 6 - hour : 0) * 0.05)).toFixed(2));

    // Hourly energy contribution in kWh (interval = 60 mins)
    // Scale up for the entire facility fleet
    const fleetMultiplier = 18.5; // Represents aggregated fleet scale
    const intervalEnergyKwh = Number((calculateEnergyKwh(powerWatts, 60) * fleetMultiplier).toFixed(2));
    cumulativeKwh = Number((cumulativeKwh + intervalEnergyKwh).toFixed(2));

    points.push({
      time: timeLabel,
      solarVoltage,
      solarCurrent,
      powerWatts,
      instantPowerKw: Number((powerWatts * fleetMultiplier / 1000).toFixed(2)),
      batteryVoltage,
      energyKwh: intervalEnergyKwh,
      cumulativeEnergyKwh: cumulativeKwh,
      temperature: Number((22 + (solarIrradiance * 14) + (Math.sin(hour) * 2)).toFixed(1))
    });
  }

  return points;
};

// 7-Day fleet energy generation & battery metrics
export const get7DayTelemetry = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseKwh = [1210, 1340, 1285, 1190, 1420, 1380, 1245];
  const avgVoltages = [12.65, 12.72, 12.60, 12.58, 12.78, 12.74, 12.62];
  
  return days.map((day, idx) => ({
    time: day,
    energyKwh: baseKwh[idx],
    targetKwh: 1250,
    avgBatteryVoltage: avgVoltages[idx],
    peakPowerKw: Number((baseKwh[idx] / 5.2).toFixed(1)),
    onlinePercentage: Number((96.5 + (idx % 3) * 1.1).toFixed(1))
  }));
};

// 30-Day fleet energy generation
export const get30DayTelemetry = () => {
  const points = [];
  for (let day = 1; day <= 30; day++) {
    const variance = Math.sin(day * 0.4) * 160 + Math.cos(day * 0.9) * 80;
    const energy = Number((1250 + variance).toFixed(1));
    points.push({
      time: `Day ${day}`,
      energyKwh: energy,
      targetKwh: 1250,
      avgBatteryVoltage: Number((12.55 + Math.sin(day * 0.2) * 0.18).toFixed(2)),
      peakPowerKw: Number((energy / 5.1).toFixed(1)),
      efficiency: Number((94.5 + Math.sin(day * 0.5) * 3.5).toFixed(1))
    });
  }
  return points;
};

// Regional breakdown derived from devices
export const getRegionalTelemetry = (devices) => {
  const regionMap = {};

  devices.forEach((dev) => {
    const reg = dev.region || 'Other';
    if (!regionMap[reg]) {
      regionMap[reg] = {
        region: reg,
        devices: 0,
        online: 0,
        warning: 0,
        critical: 0,
        offline: 0,
        totalEnergyKwh: 0,
      };
    }
    regionMap[reg].devices += 1;
    regionMap[reg][dev.status] = (regionMap[reg][dev.status] || 0) + 1;
    regionMap[reg].totalEnergyKwh += (dev.energyGenerated || 0);
  });

  return Object.values(regionMap).map((item) => ({
    ...item,
    totalEnergyKwh: Number(item.totalEnergyKwh.toFixed(1)),
    healthRate: Number(((item.online / item.devices) * 100).toFixed(1))
  }));
};

// Device-specific telemetry for Device Details Page
export const getDeviceTelemetryHistory = (device, range = '24h') => {
  const baseBattery = device?.batteryVoltage || 12.6;
  const baseSolar = device?.solarVoltage || 38.0;
  const baseCurrent = device?.batteryCurrent || 12.0;

  if (range === '24h') {
    const points = [];
    let runningEnergy = 0;
    for (let h = 0; h < 24; h++) {
      const isSun = h >= 6 && h <= 18;
      const sunFactor = isSun ? Math.sin(((h - 5) / 14) * Math.PI) : 0;
      
      const vSolar = isSun ? Math.max(0, baseSolar * (0.8 + (sunFactor * 0.4))) : 0.4;
      const vBatt = Number((baseBattery + (sunFactor * 0.7) - (isSun ? 0 : 0.3) + (Math.sin(h) * 0.08)).toFixed(2));
      const iBatt = isSun 
        ? Number((baseCurrent * (0.4 + (sunFactor * 0.8))).toFixed(1))
        : Number((Math.max(0.2, (baseCurrent * 0.15))).toFixed(1));
      
      const pWatts = calculatePower(vBatt, iBatt);
      const kwh = calculateEnergyKwh(pWatts, 60);
      runningEnergy += kwh;

      points.push({
        time: `${String(h).padStart(2, '0')}:00`,
        batteryVoltage: vBatt,
        solarVoltage: Number(vSolar.toFixed(1)),
        batteryCurrent: iBatt,
        powerWatts: pWatts,
        energyKwh: Number(kwh.toFixed(3)),
        cumulativeEnergyKwh: Number(runningEnergy.toFixed(2)),
        temperature: Number((24 + (sunFactor * 16) + (Math.sin(h * 2) * 1.5)).toFixed(1))
      });
    }
    return points;
  }

  if (range === '7d') {
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
    return days.map((day, i) => {
      const factor = 0.9 + (Math.sin(i) * 0.2);
      const dailyKwh = Number((14.5 * factor).toFixed(2));
      return {
        time: day,
        batteryVoltage: Number((baseBattery + (Math.sin(i * 1.5) * 0.2)).toFixed(2)),
        solarVoltage: Number((baseSolar * factor).toFixed(1)),
        batteryCurrent: Number((baseCurrent * factor).toFixed(1)),
        powerWatts: Number((baseBattery * baseCurrent * factor).toFixed(1)),
        energyKwh: dailyKwh,
        uptime: Number((98.5 + (i % 2) * 1.2).toFixed(1))
      };
    });
  }

  // 30 days
  const points = [];
  for (let d = 1; d <= 30; d++) {
    const factor = 0.85 + (Math.sin(d * 0.3) * 0.25);
    points.push({
      time: `D${d}`,
      batteryVoltage: Number((baseBattery + (Math.sin(d * 0.5) * 0.15)).toFixed(2)),
      solarVoltage: Number((baseSolar * factor).toFixed(1)),
      batteryCurrent: Number((baseCurrent * factor).toFixed(1)),
      powerWatts: Number((baseBattery * baseCurrent * factor).toFixed(1)),
      energyKwh: Number((13.8 * factor).toFixed(2)),
      uptime: Number((99.0 + (Math.cos(d) * 0.8)).toFixed(1))
    });
  }
  return points;
};

// Activity logs for device details
export const getDeviceActivityLogs = (device) => {
  return [
    {
      id: "act-1",
      event: "Telemetry Ingestion",
      detail: `Reported Battery ${device?.batteryVoltage || 12.6}V, Solar ${device?.solarVoltage || 38.0}V`,
      type: "telemetry",
      timestamp: "2 mins ago"
    },
    {
      id: "act-2",
      event: "MPPT Charge Controller Sync",
      detail: "Maximum Power Point Tracking recalibrated at 98.4% efficiency",
      type: "system",
      timestamp: "18 mins ago"
    },
    {
      id: "act-3",
      event: "Health Check Passed",
      detail: "Heartbeat ping latency 42ms; zero dropped packets",
      type: "heartbeat",
      timestamp: "1 hour ago"
    },
    {
      id: "act-4",
      event: "Cellular Gateway Handshake",
      detail: "Renewed dynamic IP on primary APN (LTE Band 12)",
      type: "network",
      timestamp: "3 hours ago"
    },
    {
      id: "act-5",
      event: "Thermal Regulation Trigger",
      detail: "Internal temperature stable at nominal ambient operating range",
      type: "thermal",
      timestamp: "6 hours ago"
    }
  ];
};
