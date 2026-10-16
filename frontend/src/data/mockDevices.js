/**
 * mockDevices.js
 * Comprehensive mock dataset with 55 realistic IoT devices across multiple renewable & sensor sites.
 */

export const INITIAL_DEVICES = [
  {
    id: "DEV-001",
    name: "Solar Unit Alpha",
    type: "Solar Unit",
    location: "Austin Solar Farm, TX",
    region: "Texas",
    lat: 30.2672,
    lng: -97.7431,
    batteryVoltage: 13.2,
    batteryCurrent: 14.8,
    solarVoltage: 42.6,
    energyGenerated: 148.5,
    temperature: 34.2,
    status: "online",
    uptime: 99.8,
    firmware: "v2.4.1",
    signalStrength: -62,
    installedAt: "2024-03-15",
    lastUpdated: "2 mins ago"
  },
  {
    id: "DEV-002",
    name: "Solar Unit Beta",
    type: "Solar Unit",
    location: "Austin Solar Farm, TX",
    region: "Texas",
    lat: 30.2685,
    lng: -97.7445,
    batteryVoltage: 12.8,
    batteryCurrent: 12.4,
    solarVoltage: 41.2,
    energyGenerated: 139.2,
    temperature: 36.1,
    status: "online",
    uptime: 99.4,
    firmware: "v2.4.1",
    signalStrength: -65,
    installedAt: "2024-03-15",
    lastUpdated: "4 mins ago"
  },
  {
    id: "DEV-003",
    name: "Remote Sensor Gamma",
    type: "Remote Sensor",
    location: "Mojave Field Array, CA",
    region: "California",
    lat: 35.0110,
    lng: -115.4734,
    batteryVoltage: 11.4,
    batteryCurrent: 2.1,
    solarVoltage: 18.5,
    energyGenerated: 24.8,
    temperature: 42.5,
    status: "warning",
    uptime: 96.2,
    firmware: "v1.9.0",
    signalStrength: -82,
    installedAt: "2023-11-10",
    lastUpdated: "8 mins ago"
  },
  {
    id: "DEV-004",
    name: "Power Monitor Delta",
    type: "Power Monitor",
    location: "Denver High Plains, CO",
    region: "Colorado",
    lat: 39.7392,
    lng: -104.9903,
    batteryVoltage: 12.6,
    batteryCurrent: 8.5,
    solarVoltage: 38.0,
    energyGenerated: 89.4,
    temperature: 24.1,
    status: "online",
    uptime: 99.9,
    firmware: "v3.0.2",
    signalStrength: -58,
    installedAt: "2024-01-20",
    lastUpdated: "1 min ago"
  },
  {
    id: "DEV-005",
    name: "Solar Unit Epsilon",
    type: "Solar Unit",
    location: "Nevada Desert Station, NV",
    region: "Nevada",
    lat: 36.1699,
    lng: -115.1398,
    batteryVoltage: 10.8,
    batteryCurrent: 0.2,
    solarVoltage: 4.2,
    energyGenerated: 62.1,
    temperature: 48.0,
    status: "critical",
    uptime: 88.5,
    firmware: "v2.3.0",
    signalStrength: -94,
    installedAt: "2023-09-05",
    lastUpdated: "45 mins ago"
  },
  {
    id: "DEV-006",
    name: "Weather Station Zeta",
    type: "Weather Station",
    location: "Phoenix Solar Park, AZ",
    region: "Arizona",
    lat: 33.4484,
    lng: -112.0740,
    batteryVoltage: 12.7,
    batteryCurrent: 3.4,
    solarVoltage: 24.5,
    energyGenerated: 32.6,
    temperature: 39.4,
    status: "online",
    uptime: 99.5,
    firmware: "v2.1.0",
    signalStrength: -68,
    installedAt: "2024-02-12",
    lastUpdated: "3 mins ago"
  },
  {
    id: "DEV-007",
    name: "Battery Storage Bank 1",
    type: "Battery Storage Bank",
    location: "Austin Solar Farm, TX",
    region: "Texas",
    lat: 30.2701,
    lng: -97.7410,
    batteryVoltage: 13.6,
    batteryCurrent: 26.5,
    solarVoltage: 44.1,
    energyGenerated: 215.0,
    temperature: 28.5,
    status: "online",
    uptime: 99.9,
    firmware: "v3.1.0",
    signalStrength: -54,
    installedAt: "2024-04-01",
    lastUpdated: "Just now"
  },
  {
    id: "DEV-008",
    name: "Solar Unit Theta",
    type: "Solar Unit",
    location: "Mojave Field Array, CA",
    region: "California",
    lat: 35.0135,
    lng: -115.4710,
    batteryVoltage: 0.0,
    batteryCurrent: 0.0,
    solarVoltage: 0.0,
    energyGenerated: 110.2,
    temperature: 22.0,
    status: "offline",
    uptime: 91.0,
    firmware: "v2.2.0",
    signalStrength: -115,
    installedAt: "2023-10-18",
    lastUpdated: "4 hours ago"
  },
  {
    id: "DEV-009",
    name: "Remote Sensor Iota",
    type: "Remote Sensor",
    location: "Seattle Microgrid, WA",
    region: "Washington",
    lat: 47.6062,
    lng: -122.3321,
    batteryVoltage: 12.4,
    batteryCurrent: 1.8,
    solarVoltage: 16.8,
    energyGenerated: 18.4,
    temperature: 18.2,
    status: "online",
    uptime: 99.2,
    firmware: "v1.9.5",
    signalStrength: -72,
    installedAt: "2024-05-19",
    lastUpdated: "5 mins ago"
  },
  {
    id: "DEV-010",
    name: "Power Monitor Kappa",
    type: "Power Monitor",
    location: "Chicago Substation, IL",
    region: "Illinois",
    lat: 41.8781,
    lng: -87.6298,
    batteryVoltage: 12.5,
    batteryCurrent: 9.1,
    solarVoltage: 35.4,
    energyGenerated: 94.8,
    temperature: 21.6,
    status: "online",
    uptime: 99.7,
    firmware: "v3.0.2",
    signalStrength: -60,
    installedAt: "2024-01-14",
    lastUpdated: "Just now"
  },
  {
    id: "DEV-011",
    name: "Solar Unit Lambda",
    type: "Solar Unit",
    location: "San Diego Clean Tech Park, CA",
    region: "California",
    lat: 32.7157,
    lng: -117.1611,
    batteryVoltage: 13.1,
    batteryCurrent: 15.2,
    solarVoltage: 43.5,
    energyGenerated: 162.4,
    temperature: 26.8,
    status: "online",
    uptime: 99.9,
    firmware: "v2.4.1",
    signalStrength: -59,
    installedAt: "2024-02-28",
    lastUpdated: "2 mins ago"
  },
  {
    id: "DEV-012",
    name: "Solar Unit Mu",
    type: "Solar Unit",
    location: "Phoenix Solar Park, AZ",
    region: "Arizona",
    lat: 33.4510,
    lng: -112.0712,
    batteryVoltage: 11.5,
    batteryCurrent: 16.8,
    solarVoltage: 14.2,
    energyGenerated: 88.0,
    temperature: 44.8,
    status: "warning",
    uptime: 95.8,
    firmware: "v2.3.4",
    signalStrength: -80,
    installedAt: "2023-12-04",
    lastUpdated: "12 mins ago"
  },
  {
    id: "DEV-013",
    name: "Battery Storage Bank 2",
    type: "Battery Storage Bank",
    location: "Nevada Desert Station, NV",
    region: "Nevada",
    lat: 36.1720,
    lng: -115.1370,
    batteryVoltage: 12.9,
    batteryCurrent: 22.4,
    solarVoltage: 40.5,
    energyGenerated: 198.3,
    temperature: 31.0,
    status: "online",
    uptime: 99.4,
    firmware: "v3.1.0",
    signalStrength: -64,
    installedAt: "2024-04-10",
    lastUpdated: "3 mins ago"
  },
  {
    id: "DEV-014",
    name: "Remote Sensor Nu",
    type: "Remote Sensor",
    location: "Denver High Plains, CO",
    region: "Colorado",
    lat: 39.7420,
    lng: -104.9880,
    batteryVoltage: 12.3,
    batteryCurrent: 1.5,
    solarVoltage: 20.1,
    energyGenerated: 21.0,
    temperature: 20.4,
    status: "online",
    uptime: 98.9,
    firmware: "v1.9.2",
    signalStrength: -75,
    installedAt: "2024-03-22",
    lastUpdated: "6 mins ago"
  },
  {
    id: "DEV-015",
    name: "Solar Unit Xi",
    type: "Solar Unit",
    location: "Austin Solar Farm, TX",
    region: "Texas",
    lat: 30.2720,
    lng: -97.7400,
    batteryVoltage: 13.0,
    batteryCurrent: 13.9,
    solarVoltage: 42.0,
    energyGenerated: 141.7,
    temperature: 33.5,
    status: "online",
    uptime: 99.6,
    firmware: "v2.4.1",
    signalStrength: -61,
    installedAt: "2024-03-15",
    lastUpdated: "Just now"
  },
  {
    id: "DEV-016",
    name: "Power Monitor Omicron",
    type: "Power Monitor",
    location: "Seattle Microgrid, WA",
    region: "Washington",
    lat: 47.6090,
    lng: -122.3300,
    batteryVoltage: 0.0,
    batteryCurrent: 0.0,
    solarVoltage: 0.0,
    energyGenerated: 74.2,
    temperature: 15.0,
    status: "offline",
    uptime: 92.4,
    firmware: "v3.0.0",
    signalStrength: -120,
    installedAt: "2023-11-28",
    lastUpdated: "18 hours ago"
  },
  {
    id: "DEV-017",
    name: "Solar Unit Pi",
    type: "Solar Unit",
    location: "Mojave Field Array, CA",
    region: "California",
    lat: 35.0160,
    lng: -115.4690,
    batteryVoltage: 12.9,
    batteryCurrent: 14.1,
    solarVoltage: 43.0,
    energyGenerated: 155.0,
    temperature: 37.0,
    status: "online",
    uptime: 99.5,
    firmware: "v2.4.1",
    signalStrength: -67,
    installedAt: "2024-02-18",
    lastUpdated: "1 min ago"
  },
  {
    id: "DEV-018",
    name: "Weather Station Rho",
    type: "Weather Station",
    location: "Denver High Plains, CO",
    region: "Colorado",
    lat: 39.7360,
    lng: -104.9930,
    batteryVoltage: 12.6,
    batteryCurrent: 3.1,
    solarVoltage: 22.8,
    energyGenerated: 29.5,
    temperature: 23.0,
    status: "online",
    uptime: 99.7,
    firmware: "v2.1.2",
    signalStrength: -63,
    installedAt: "2024-01-08",
    lastUpdated: "4 mins ago"
  },
  {
    id: "DEV-019",
    name: "Solar Unit Sigma",
    type: "Solar Unit",
    location: "Phoenix Solar Park, AZ",
    region: "Arizona",
    lat: 33.4540,
    lng: -112.0680,
    batteryVoltage: 10.9,
    batteryCurrent: 18.9,
    solarVoltage: 8.5,
    energyGenerated: 54.0,
    temperature: 46.2,
    status: "critical",
    uptime: 89.2,
    firmware: "v2.3.0",
    signalStrength: -90,
    installedAt: "2023-10-14",
    lastUpdated: "35 mins ago"
  },
  {
    id: "DEV-020",
    name: "Solar Unit Tau",
    type: "Solar Unit",
    location: "San Diego Clean Tech Park, CA",
    region: "California",
    lat: 32.7180,
    lng: -117.1590,
    batteryVoltage: 13.3,
    batteryCurrent: 15.0,
    solarVoltage: 44.0,
    energyGenerated: 168.0,
    temperature: 25.4,
    status: "online",
    uptime: 99.8,
    firmware: "v2.4.1",
    signalStrength: -57,
    installedAt: "2024-03-01",
    lastUpdated: "Just now"
  }
];

// Dynamically generate remaining 35 devices to satisfy >= 50 IoT devices across locations
const locations = [
  { name: "Austin Solar Farm, TX", region: "Texas", lat: 30.2672, lng: -97.7431 },
  { name: "Mojave Field Array, CA", region: "California", lat: 35.0110, lng: -115.4734 },
  { name: "Denver High Plains, CO", region: "Colorado", lat: 39.7392, lng: -104.9903 },
  { name: "Nevada Desert Station, NV", region: "Nevada", lat: 36.1699, lng: -115.1398 },
  { name: "Phoenix Solar Park, AZ", region: "Arizona", lat: 33.4484, lng: -112.0740 },
  { name: "Seattle Microgrid, WA", region: "Washington", lat: 47.6062, lng: -122.3321 },
  { name: "San Diego Clean Tech Park, CA", region: "California", lat: 32.7157, lng: -117.1611 },
  { name: "Chicago Substation, IL", region: "Illinois", lat: 41.8781, lng: -87.6298 }
];

const greekAlphabet = [
  "Upsilon", "Phi", "Chi", "Psi", "Omega", "Proxima", "Sirius", "Vega", "Altair", 
  "Rigel", "Betelgeuse", "Polaris", "Antares", "Deneb", "Castor", "Pollux", "Aldebaran",
  "Capella", "Spica", "Arcturus", "Achernar", "Canopus", "Bellatrix", "Regulus", "Mizar",
  "Alcor", "Alkaid", "Alioth", "Dubhe", "Merak", "Phecda", "Megrez", "Alpheratz", "Markab", "Scheat"
];

for (let i = 21; i <= 55; i++) {
  const index = i - 21;
  const nameSuffix = greekAlphabet[index % greekAlphabet.length];
  const locObj = locations[index % locations.length];
  
  let type = "Solar Unit";
  if (i % 6 === 0) type = "Battery Storage Bank";
  else if (i % 5 === 0) type = "Power Monitor";
  else if (i % 4 === 0) type = "Remote Sensor";
  else if (i % 7 === 0) type = "Weather Station";

  // Distribute statuses: mostly online, few offline, warning, critical
  let status = "online";
  let batteryV = Number((12.2 + (Math.sin(i) * 1.1)).toFixed(1));
  let batteryA = Number((10 + (Math.cos(i) * 6)).toFixed(1));
  let solarV = Number((38 + (Math.sin(i * 2) * 8)).toFixed(1));
  let uptime = Number((98.5 + (Math.abs(Math.sin(i)) * 1.4)).toFixed(1));

  if (i === 24 || i === 41) {
    status = "offline";
    batteryV = 0.0;
    batteryA = 0.0;
    solarV = 0.0;
    uptime = 89.4;
  } else if (i === 29 || i === 46) {
    status = "warning";
    batteryV = 11.5;
    batteryA = 18.2;
    uptime = 95.1;
  } else if (i === 35) {
    status = "critical";
    batteryV = 10.7;
    batteryA = 24.5;
    solarV = 6.0;
    uptime = 87.2;
  }

  INITIAL_DEVICES.push({
    id: `DEV-${String(i).padStart(3, '0')}`,
    name: `${type.split(' ')[0]} ${nameSuffix}`,
    type,
    location: locObj.name,
    region: locObj.region,
    lat: Number((locObj.lat + (Math.sin(i) * 0.04)).toFixed(4)),
    lng: Number((locObj.lng + (Math.cos(i) * 0.04)).toFixed(4)),
    batteryVoltage: batteryV,
    batteryCurrent: batteryA,
    solarVoltage: solarV,
    energyGenerated: Number((80 + (i * 2.8)).toFixed(1)),
    temperature: Number((22 + Math.abs(Math.sin(i * 3) * 18)).toFixed(1)),
    status,
    uptime,
    firmware: i % 2 === 0 ? "v2.4.1" : "v3.0.2",
    signalStrength: -(55 + (i % 35)),
    installedAt: `2024-0${1 + (i % 5)}-15`,
    lastUpdated: `${(i % 15) + 1} mins ago`
  });
}
