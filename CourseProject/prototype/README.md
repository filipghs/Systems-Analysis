# CSAS Prototype — Setup & Run Instructions

> Community Security Alert System — Course Project Prototype  
> Universidad Distrital Francisco José de Caldas · 2026-I

## Quick Start

```bash
# 1. Navigate to prototype folder
cd prototype

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
#    http://localhost:5173
```

## Technology Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React 18 + Vite | Fast HMR, modern build |
| Styling | Tailwind CSS 3 | Utility-first, NFR-06 responsive layout |
| Charts | Recharts 2 | W4 scenario results, W1 incident distribution |
| Icons | Lucide React | Lightweight, consistent |

## Modules (8 views)

| Module | FR/NFR | Description |
|--------|--------|-------------|
| Dashboard | FR-07, FR-09, NFR-03 | KPI stats, incident charts, campus map |
| Report Incident | FR-01, FR-06, NFR-06 | 2-step flow (type → zone) ≤3 interactions |
| Campus Map | FR-02, FR-09 | SVG map with geofence animation (500m) |
| Verification Queue | FR-03, FR-04, FR-05, NFR-08 | AI pipeline, 4-stage view, NFR-08 gate |
| Analytics | FR-09, NFR-01..05 | Gap analysis, scenario results, radar chart |
| Incident Log | FR-07 | Paginated log with all incident metadata |
| Simulation | W4 scenarios | DES console replay with emergent behaviors |
| Architecture | W2, W3 | 5-layer diagram, standards compliance, stack |

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # serve production build locally
```

## Notes

- No backend required — all state managed in React (useState)
- Incident data is seeded in memory; reloading resets to 25 baseline incidents
- AI confidence scores use uniform random [0.25, 1.0] — production requires trained classifier
- GPS coordinates are simulated — production requires Geolocation Web API
