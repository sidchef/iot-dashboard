/**
 * mockAlerts.js
 * Realistic IoT system alerts correlated with mock devices.
 */

export const INITIAL_ALERTS = [
  {
    id: "ALT-1042",
    deviceId: "DEV-005",
    deviceName: "Solar Unit Epsilon",
    alertType: "Low Battery Voltage",
    severity: "Critical",
    description: "Battery voltage dropped to 10.8V (below critical threshold 11.0V). Deep discharge risk.",
    timestamp: "2026-10-16 11:42:15",
    status: "Active",
    region: "Nevada",
    threshold: "11.0 V",
    actualValue: "10.8 V"
  },
  {
    id: "ALT-1041",
    deviceId: "DEV-019",
    deviceName: "Solar Unit Sigma",
    alertType: "Solar Voltage Below Threshold",
    severity: "Critical",
    description: "Solar array voltage measured at 8.5V during peak irradiance hours. Inverter junction failure suspected.",
    timestamp: "2026-10-16 11:30:00",
    status: "Active",
    region: "Arizona",
    threshold: "30.0 V",
    actualValue: "8.5 V"
  },
  {
    id: "ALT-1040",
    deviceId: "DEV-008",
    deviceName: "Solar Unit Theta",
    alertType: "Device Offline",
    severity: "High",
    description: "Heartbeat ping lost for more than 4 consecutive intervals (> 4 hours). Cellular gateway timeout.",
    timestamp: "2026-10-16 08:15:22",
    status: "Active",
    region: "California",
    threshold: "15 mins",
    actualValue: "240 mins"
  },
  {
    id: "ALT-1039",
    deviceId: "DEV-003",
    deviceName: "Remote Sensor Gamma",
    alertType: "Low Battery Voltage",
    severity: "Medium",
    description: "Battery voltage at 11.4V approaching warning cutoff level (11.5V). Recommend battery cycle inspection.",
    timestamp: "2026-10-16 11:15:08",
    status: "Active",
    region: "California",
    threshold: "11.5 V",
    actualValue: "11.4 V"
  },
  {
    id: "ALT-1038",
    deviceId: "DEV-012",
    deviceName: "Solar Unit Mu",
    alertType: "Thermal Threshold Exceeded",
    severity: "High",
    description: "Internal enclosure temperature reached 44.8°C (operational ceiling 42.0°C). Active fan cooling engaged.",
    timestamp: "2026-10-16 10:48:30",
    status: "Active",
    region: "Arizona",
    threshold: "42.0 °C",
    actualValue: "44.8 °C"
  },
  {
    id: "ALT-1037",
    deviceId: "DEV-016",
    deviceName: "Power Monitor Omicron",
    alertType: "Device Offline",
    severity: "High",
    description: "Substation power telemetry stream interrupted. Last transmission received at 18:00 yesterday.",
    timestamp: "2026-10-15 18:20:00",
    status: "Active",
    region: "Washington",
    threshold: "10 mins",
    actualValue: "18 hrs"
  },
  {
    id: "ALT-1036",
    deviceId: "DEV-035",
    deviceName: "Solar Unit Markab",
    alertType: "Unusually High Battery Current",
    severity: "Critical",
    description: "Discharge current spiked to 24.5A (rated nominal maximum 20.0A). Overcurrent protection active.",
    timestamp: "2026-10-16 09:35:10",
    status: "Active",
    region: "Nevada",
    threshold: "20.0 A",
    actualValue: "24.5 A"
  },
  {
    id: "ALT-1035",
    deviceId: "DEV-029",
    deviceName: "Weather Station Polaris",
    alertType: "Signal Degradation",
    severity: "Low",
    description: "LoRaWAN link margin reduced to -108 dBm. Packet retransmission rate elevated to 14%.",
    timestamp: "2026-10-16 09:05:44",
    status: "Active",
    region: "California",
    threshold: "-95 dBm",
    actualValue: "-108 dBm"
  },
  {
    id: "ALT-1034",
    deviceId: "DEV-007",
    deviceName: "Battery Storage Bank 1",
    alertType: "Cell Imbalance Detected",
    severity: "Medium",
    description: "String delta between module #3 and module #7 exceeded 85mV. Auto-balancing cycle started.",
    timestamp: "2026-10-16 07:12:00",
    status: "Acknowledged",
    region: "Texas",
    threshold: "50 mV",
    actualValue: "88 mV"
  },
  {
    id: "ALT-1033",
    deviceId: "DEV-001",
    deviceName: "Solar Unit Alpha",
    alertType: "Grid Frequency Deviation",
    severity: "Low",
    description: "Grid interconnection frequency transient measured at 59.82 Hz (nominal 60.00 Hz). Synchronized.",
    timestamp: "2026-10-16 06:40:19",
    status: "Resolved",
    region: "Texas",
    threshold: "±0.15 Hz",
    actualValue: "-0.18 Hz"
  },
  {
    id: "ALT-1032",
    deviceId: "DEV-004",
    deviceName: "Power Monitor Delta",
    alertType: "Firmware OTA Handshake",
    severity: "Low",
    description: "Automatic firmware validation verified checksum for patch build v3.0.2.",
    timestamp: "2026-10-15 22:15:00",
    status: "Resolved",
    region: "Colorado",
    threshold: "N/A",
    actualValue: "Success"
  },
  {
    id: "ALT-1031",
    deviceId: "DEV-011",
    deviceName: "Solar Unit Lambda",
    alertType: "Solar Voltage Below Threshold",
    severity: "Medium",
    description: "Temporary dust obscuration caused 25% drop in open circuit voltage. Recovered after self-cleaning wiper.",
    timestamp: "2026-10-15 14:10:00",
    status: "Resolved",
    region: "California",
    threshold: "35.0 V",
    actualValue: "28.4 V"
  }
];
