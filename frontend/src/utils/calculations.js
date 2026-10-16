/**
 * calculations.js
 * Scientific & electrical engineering calculation helpers for IoTCloud.
 * Accurately models instantaneous power vs accumulated energy.
 */

/**
 * Calculate instantaneous electrical power in Watts (W)
 * P = V * I
 * @param {number} voltage - Voltage in Volts (V)
 * @param {number} current - Current in Amperes (A)
 * @returns {number} Power in Watts (W)
 */
export function calculatePower(voltage, current) {
  if (voltage == null || current == null) return 0;
  return Number((voltage * current).toFixed(2));
}

/**
 * Calculate energy in kilowatt-hours (kWh) from power (W) over a sample interval in minutes.
 * E (kWh) = (Power (W) * (IntervalMinutes / 60)) / 1000
 * @param {number} powerWatts - Average power during interval in Watts
 * @param {number} intervalMinutes - Duration in minutes (e.g. 60 min for hourly sample)
 * @returns {number} Energy in kWh
 */
export function calculateEnergyKwh(powerWatts, intervalMinutes = 60) {
  if (!powerWatts || powerWatts <= 0) return 0;
  const hours = intervalMinutes / 60;
  const energyKwh = (powerWatts * hours) / 1000;
  return Number(energyKwh.toFixed(4));
}

/**
 * Numerically integrate a series of telemetry power points into total accumulated kWh
 * @param {Array<{powerWatts?: number, voltage?: number, current?: number}>} points
 * @param {number} sampleIntervalMinutes - Minutes between consecutive points
 * @returns {number} Total accumulated kWh
 */
export function integrateEnergy(points, sampleIntervalMinutes = 60) {
  if (!Array.isArray(points) || points.length === 0) return 0;
  
  let totalKwh = 0;
  for (const point of points) {
    const power = point.powerWatts !== undefined 
      ? point.powerWatts 
      : calculatePower(point.voltage || 0, point.current || 0);
    totalKwh += calculateEnergyKwh(power, sampleIntervalMinutes);
  }
  
  return Number(totalKwh.toFixed(2));
}

/**
 * Calculate estimated CO2 offset in kg from renewable energy generated in kWh
 * EPA benchmark factor: ~0.385 kg CO2 per kWh
 */
export function calculateCarbonOffset(energyKwh) {
  if (!energyKwh || energyKwh < 0) return 0;
  return Number((energyKwh * 0.385).toFixed(1));
}

/**
 * Format voltage with units
 */
export function formatVoltage(v) {
  return v != null ? `${Number(v).toFixed(1)} V` : '-- V';
}

/**
 * Format current with units
 */
export function formatCurrent(i) {
  return i != null ? `${Number(i).toFixed(1)} A` : '-- A';
}

/**
 * Format power with units (W or kW)
 */
export function formatPower(w) {
  if (w == null) return '-- W';
  if (w >= 1000) {
    return `${(w / 1000).toFixed(2)} kW`;
  }
  return `${Number(w).toFixed(1)} W`;
}

/**
 * Format energy with units (kWh or MWh)
 */
export function formatEnergy(kwh) {
  if (kwh == null) return '-- kWh';
  if (kwh >= 1000) {
    return `${(kwh / 1000).toFixed(2)} MWh`;
  }
  return `${Number(kwh).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh`;
}
