# IoTCloud — Enterprise IoT Monitoring Dashboard

**IoTCloud** is a modern, responsive, high-fidelity IoT Monitoring & Telemetry Dashboard platform built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## 🚀 Quick Start Guide

### 1. Installation
Install dependencies in the frontend project:

```bash
cd frontend
npm install
```

### 2. Start the Development Server
Launch the local Vite server:

```bash
npm run dev
```

Or from the root directory:

```bash
npm run dev
```

Open your browser at: **[http://localhost:5173/](http://localhost:5173/)**

### 3. Production Build
Validate production bundling:

```bash
cd frontend
npm run build
```

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 19 (JavaScript ES Modules)
* **Build Tool:** Vite 8
* **Styling & Design System:** Tailwind CSS v3 with custom navy SaaS palette
* **Routing:** React Router v7 (`BrowserRouter`, nested layouts, dynamic routes)
* **Data Visualization:** Recharts (Area charts, Line charts, Donut/Pie charts, Bar charts)
* **Icons:** Lucide React
* **Client-Side Export:** Dynamic HTML5 Blob CSV export (100% backend-free)
* **State & Persistence:** React Context API + `localStorage` persistence

---

## 🌟 Key Application Pages & Capabilities

### 1. Overview Dashboard (`/`)
* **Fleet KPI Summary Cards:**
  * Total Monitored Devices
  * Online Active Units (with pulsing green indicators)
  * Offline Units (amber/slate alerts)
  * Active System Incidents
  * Fleet Average Battery Voltage (V)
  * Total Renewable Energy Generated (kWh)
* **Interactive Charts:**
  * **Energy Generation Over Time:** Area chart with toggles for Daily (24h), Weekly (7d), and Monthly (30d) views.
  * **Device Status Donut:** Distribution of Online, Warning, Critical, and Offline units with a center summary.
  * **Battery Voltage Trends:** 24h battery curve with warning cutoff threshold line (11.8V).
  * **Regional Device Distribution:** Bar chart categorized by operational region.
* **Quick Intervention Feed:** Highlighting units that require maintenance and real-time alert tickers.

### 2. Device Management (`/devices`)
* **Searchable & Sortable Table:**
  * Columns: Device ID, Name, Location, Device Type, Battery Voltage (V), Battery Current (A), Solar Voltage (V), Last Updated, Status, and Actions.
  * Multi-column sorting (ascending / descending).
  * Multi-parameter filters (by Status, Device Type, and Region).
  * Pagination with selectable page sizes (10, 20, 50 rows per page).
* **"Add Device" Modal:**
  * Validated modal form allowing immediate registration of new units to the session and `localStorage`.
* **Quick Telemetry Inspection:**
  * Modal with instant electrical gauges and 24h sparkline without leaving the list.
* **CSV Export:** Client-side CSV download of all current device records.

### 3. Dedicated Device Details (`/devices/:id`)
* Individual telemetry dashboard for any selected unit.
* Key electrical metrics: Battery Voltage (V), Battery Current (A), Solar Panel Voltage (V), Instantaneous Power (W), and Energy Yield (kWh).
* Interactive time-range switcher (**Last 24 Hours**, **Last 7 Days**, **Last 30 Days**).
* Dual-axis electrical charts (Solar input vs Battery float; Power vs Integrated Energy).
* Live gateway ping test simulator and device activity/heartbeat log.

### 4. Telemetry Analytics (`/analytics`)
* Multi-dimensional filtering by time interval, specific device, device type, location, and measurement.
* **Scientific Electrical Differentiation:** Clearly distinguishes instantaneous power ($P = V \times I$ in Watts) from accumulated energy ($E = \int P \, dt$ in kWh), accounting for sample intervals.
* Comparative scatter/bar charts and regional yield breakdowns.

### 5. System Alerts & Incidents (`/alerts`)
* Incident table with severity indicators: **Critical**, **High**, **Medium**, and **Low**.
* Real-time triage actions: **Acknowledge** and **Resolve** alerts.
* Incident detail modal with root cause description, recorded anomaly value, and configured threshold.
* Filter by severity and resolution status.
* CSV export of all recorded incident logs.

### 6. Reports & Audits (`/reports`)
* Fleet performance summaries categorized by operational region.
* Total devices, fleet uptime SLA percentage, period energy yield, and carbon offset ($0.385 \text{ kg CO}_2 / \text{kWh}$).
* Period filter: **7 Days**, **30 Days**, **Quarter**, and **Full Year**.
* Client-side CSV export of executive reports and raw device inventories.

### 7. Platform Settings (`/settings`)
* User profile editing (Name, Role, Organization, Email).
* Interactive alert threshold sliders (Low battery cutoff, High temperature ceiling, Minimum daylight solar voltage).
* Telemetry refresh rate preferences and live simulation toggle.
* Notification policy switches.
* Persisted automatically in browser `localStorage` with a factory default restore option.

---

## 📁 Project Structure

```
c:/PaaS Website/
├── package.json                      # Root workspace scripts
├── README.md                         # Documentation
└── frontend/
    ├── index.html                    # HTML entry with Inter font & metadata
    ├── package.json                  # Dependencies & scripts
    ├── vite.config.js                # Vite build configuration
    ├── tailwind.config.js            # Tailwind theme & color definitions
    ├── postcss.config.js             # PostCSS Tailwind processor
    └── src/
        ├── App.jsx                   # React Router route definitions
        ├── main.jsx                  # React DOM root render
        ├── index.css                 # Tailwind directives & custom scrollbars
        ├── context/
        │   └── IoTContext.jsx        # Centralized state, telemetry simulation, & localStorage sync
        ├── data/
        │   ├── mockDevices.js        # 55+ realistic IoT assets across 8 locations
        │   ├── mockTelemetry.js      # 24h, 7d, 30d electrical curves & numerical integration
        │   └── mockAlerts.js         # Correlated incident records & thresholds
        ├── utils/
        │   ├── calculations.js       # Power (P=VI), Energy (kWh = ∫ P dt), & CO2 offset formulas
        │   └── exportCSV.js          # In-browser Blob CSV file generator
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.jsx       # Dark navy persistent sidebar with active indicators
        │   │   ├── Header.jsx        # Breadcrumbs, search, notification popover, & profile
        │   │   └── DashboardLayout.jsx
        │   ├── dashboard/
        │   │   ├── MetricCard.jsx    # KPI summary card with trend chips
        │   │   ├── EnergyChart.jsx   # Multi-view energy area chart (Recharts)
        │   │   ├── DeviceStatusChart.jsx # Donut status breakdown with center summary
        │   │   ├── BatteryVoltageChart.jsx # Voltage trend with cutoff threshold reference
        │   │   └── RegionalDistributionChart.jsx # Regional bar chart
        │   ├── devices/
        │   │   ├── DeviceTable.jsx   # Searchable, filterable, sortable, paginated table
        │   │   ├── DeviceFormModal.jsx # Validated modal to register new IoT units
        │   │   └── DeviceQuickViewModal.jsx # Instant telemetry preview modal
        │   ├── alerts/
        │   │   └── AlertsTable.jsx   # Incident triage & modal inspector
        │   └── common/
        │       ├── StatusBadge.jsx   # Online/Warning/Critical/Offline badges
        │       ├── SearchBar.jsx     # Reusable search input with clear trigger
        │       ├── DateRangeFilter.jsx
        │       └── Modal.jsx         # Accessible backdrop modal dialog
        └── pages/
            ├── Overview.jsx          # Executive dashboard
            ├── Devices.jsx           # Device inventory & management
            ├── DeviceDetailsPage.jsx # Individual device telemetry view
            ├── Analytics.jsx         # Deep-dive electrical exploration
            ├── Alerts.jsx            # Alert monitoring & acknowledgment
            ├── Reports.jsx           # Performance reports & audit exports
            └── Settings.jsx          # Safety thresholds & preferences
```

---

## ⚡ Mock Data Details & Disclosures

* **Fleet Scale:** Over 55 detailed mock IoT devices (Solar Units, Remote Sensors, Power Monitors, Weather Stations, and Battery Storage Banks) distributed across 8 geographical regions (Texas, California, Nevada, Colorado, Arizona, Washington, Illinois).
* **Live Telemetry Feed (Simulated):** Subtle micro-variations (e.g. $\pm 0.05\text{V}$, $\pm 0.2\text{A}$) are simulated every 5 seconds to provide a dynamic live experience. This can be toggled on or paused at any time from the top header or in Settings.
* **Hardware Disclosure:** All values are realistic mock simulations. No physical IoT hardware is connected.
