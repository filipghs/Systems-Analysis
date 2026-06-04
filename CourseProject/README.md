# Community Security Alert System (CSAS)

> **Course Project — Systems Analysis & Design, Semester 2026-I**  
> Eng. Carlos Andrés Sierra, M.Sc.  
> Computer Engineering Program — Universidad Distrital Francisco José de Caldas  
> Bogotá D.C., Colombia

---

## Team

| Name | Student Code | Role |
|------|-------------|------|
| Felipe Jose Garzon Herrera | 20251020132 | Project Manager · GitHub |
| Juan Esteban Quintero Gordillo | 20251020137 | Architecture & Quality |
| Henry Samuel Garrido Medina | 20251020125 | Risk Management |
| Gabriel Mateo Cusba Marin | 20251020128 | Implementation & Evolution |

---

## Project Summary

CSAS is a crowd-sourced campus security platform designed to improve incident reporting and community awareness at Universidad Distrital FJdC. The project followed a structured four-workshop systems engineering lifecycle (ISO/IEC/IEEE 15288:2015):

| Workshop | Focus | Key Output |
|----------|-------|-----------|
| W1 | Systems Analysis | 6-method empirical study; 3 core problems identified |
| W2 | Architecture Design | 5-layer microservices; hybrid verification pipeline |
| W3 | Robust Engineering | ISO 25010/31000/PMBOK; 10-risk register; deployment plan |
| W4 | Simulation & Validation | SimPy DES + behavioral; 30 runs × 3 scenarios; θ=3 |
| Course Project | Prototype | React prototype; 8 modules; stakeholder validation |

---

## Repository Structure

```
CourseProject/
├── docs/
│   ├── CSAS_Technical_Report.pdf     ← Comprehensive report (W1–W4 + prototype)
│   ├── CSAS_Paper_IEEE.pdf           ← IEEE conference paper
│   ├── CSAS_Slides.pdf               ← Final presentation (W4)
│   └── CSAS_Poster.pdf               ← Academic poster
│
├── prototype/                        ← React web application
│   ├── src/
│   │   ├── App.jsx                   ← Main application (~700 lines, 8 modules)
│   │   ├── main.jsx                  ← React entry point
│   │   └── index.css                 ← Tailwind base
│   ├── package.json
│   ├── vite.config.js
│   └── README.md                     ← Setup instructions
│
├── simulation/
│   ├── W4_DES.py                     ← SimPy Discrete Event Simulation
│   ├── W4_behavioral.py              ← System dynamics behavioral model
│   └── README.md
│
├── diagrams/
│   └── README.md
│
└── README.md                         ← This file
```

---

## Key Results

### Operational Gap (W1 Baseline vs. Design Targets)

| Dimension | Current | Target | Gap |
|-----------|---------|--------|-----|
| Emergency response | ~11.4 min | < 5 min | −6.4 min |
| Incident recording | ~41% | > 85% | +44 pp |
| App adoption | ~12% | ≥ 60% | +48 pp |
| Delivery success | ~87% | > 99.9% | +12.9 pp |

### Simulation Results — 30 Runs × 3 Scenarios (95% CI)

| Scenario | Avg Latency | CI 95% | Adoption | NFR-01 |
|----------|-------------|--------|----------|--------|
| Baseline | 40.87 s | ±1.02 s | 21.39% | ✗ FAIL |
| **Optimization** | **17.94 s** | **±1.02 s** | **67.62%** | **✓ PASS** |
| Failure Mode | 71.66 s | ±3.94 s | 31.34% | ✗ FAIL |

### Critical Finding: Bifurcation at θ = 3

- `θ ≥ 3` → Reinforcing loop (R+) dominates → adoption stabilizes > 60%
- `θ = 1` → Balancing loop (B-) dominates → alert fatigue → irreversible collapse

---

## Prototype Quick Start

```bash
cd CourseProject/prototype
npm install
npm run dev
# Open http://localhost:5173
```

---

## Simulation Quick Start

```bash
pip install simpy
cd CourseProject/simulation
python W4_DES.py
python W4_behavioral.py
```

---

## Technologies

**Prototype:** React 18 · Vite · Tailwind CSS · Recharts · Lucide React  
**Simulation:** Python 3.x · SimPy 4.1  
**Production stack (proposed):** React Native · Node.js · Python/FastAPI · PostgreSQL/PostGIS · RabbitMQ · Firebase FCM · Twilio · AWS/K8s

---

## Standards Referenced

ISO/IEC/IEEE 15288 · ISO/IEC 25010 · ISO 31000 · PMBOK 7th ed. · IEEE 830 · IEEE 1633 · ISO 9001 · CMMI L3 · Ley 1581 de 2012

---

*Submitted in partial fulfillment of the requirements for Systems Analysis & Design, Semester 2026-I.*
