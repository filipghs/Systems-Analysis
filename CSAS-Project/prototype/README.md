# CSAS Prototype — Functional System Implementation

## Overview

This is the functional prototype of the Community Security Alert System (CSAS), implementing key architectural components from Workshops 1–4. The prototype demonstrates the complete incident lifecycle: reporting, AI verification, geofenced dispatch, analytics, and system simulation.

## Features Demonstrated

| Feature | Requirement | Workshop |
|---------|:-----------:|:--------:|
| GPS Incident Reporting | FR-01, FR-06 | W1, W2 |
| Geofenced Alert Dispatch (500m) | FR-02 | W2 |
| AI Plausibility Scorer | FR-03 | W2 |
| Administrative Dashboard | FR-04 | W2 |
| Crowd-Sourced Confirmation | FR-05 | W1, W2 |
| Persistent Incident Log | FR-07 | W2 |
| One-Touch SOS (Priority Bypass) | FR-08 | W2 |
| Security Heatmaps | FR-09 | W2 |
| ≤ 3 Interaction Reporting | NFR-06 | W2 |
| NFR-08 Quality Gate | NFR-08 | W2, W3 |
| System Simulation | — | W4 |
| Architecture Visualization | — | W2, W3 |

## Tech Stack

- **React 18** — Component-based UI
- **Recharts** — Data visualization (bar, pie, radar, area charts)
- **Lucide React** — Professional icon library
- **Tailwind CSS** — Utility-first styling

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/filipghs/Systems-Analysis.git
cd Systems-Analysis/prototype

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

## Application Pages

1. **Dashboard** — Real-time operations overview with KPIs, live campus map, and incident distribution charts
2. **Report Incident** — 3-step form (type → location → submit) with automatic AI scoring
3. **Campus Map** — Interactive SVG map with zone risk levels, active incidents, and geofence radius
4. **Verification Queue** — Full pipeline visualization with AI score, NFR-08 gate, and admin actions
5. **Analytics** — Gap analysis, zone risk radar, KPI progress tracking
6. **Incident Log** — Complete searchable log with all incident data
7. **Simulation (W4)** — Discrete-event simulation console validating NFR targets
8. **Architecture** — 5-layer diagram, standards compliance matrix, technology stack

## Architecture Mapping

The prototype simulates the five core microservices:

- **Incident Service** → Report submission, data persistence
- **Verification Service** → AI plausibility scoring, human review queue
- **Dispatcher Service** → Geofenced alert dispatch, zone/time-weighted priority
- **User Service** → Alert fatigue dampening (via notification management)
- **Analytics Service** → Heatmaps, KPI dashboards, pattern analysis
