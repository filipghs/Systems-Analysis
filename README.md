#  Community Security Alert System (CSAS)

**Systems Analysis and Design — Workshops 1 through 4**  
Universidad Distrital Francisco José de Caldas · Semester 2026-I

---

## What is this project?

The CSAS is a collaborative technological platform designed to improve safety on the university campus and its surroundings. The core idea is simple: instead of relying solely on security personnel, the system allows students, professors, and administrative staff to report incidents in real time from their phones, and all nearby users receive verified alerts immediately.

This repository contains all four workshops of the course, covering the full systems engineering cycle: analysis, design, project management, and computational validation.

---

## Repository Structure

```
Systems-Analysis/
├── docs/
│   └── workshop1_complete.tex          # W1 main document (LaTeX, IEEE format)
├── diagrams/
│   ├── context_diagram.png             # System context diagram
│   └── relationship_map.png            # Component relationship map
├── data/
│   ├── survey_table.png                # Raw student survey data (n=20)
│   ├── survey_chart.png                # Chart: proportion of reported incidents
│   └── observation_table.png           # Direct observation record (8 sessions)
├── Workshop_3_Management/
│   ├── docs/                           # W3 PDF report + LaTeX source
│   ├── diagrams/                       # Architecture, Gantt, risk heatmap (6 PNGs)
│   ├── risk_management/                # Risk register (xlsx + csv) + contingency plan
│   ├── project_management/             # Charter, team roles, timeline, communication plan
│   ├── quality_assurance/              # Quality metrics, validation methods, release checklist
│   ├── implementation/                 # Deployment phases, infra requirements, change management
│   └── README.md
├── Workshop_4_Simulation/
│   ├── docs/                           # W4 PDF report + LaTeX source
│   ├── simulation/
│   │   ├── W4_DES.py                   # Discrete Event Simulation (SimPy)
│   │   ├── W4_behavioral.py            # Behavioral simulation (feedback loops)
│   │   └── requirements.txt
│   ├── results/
│   │   ├── figures/                    # 6 PNG charts
│   │   ├── confidence_intervals.csv
│   │   ├── sensitivity_analysis.csv
│   │   └── baseline_log.csv
│   ├── risk_management/
│   ├── validation/
│   └── README.md
├── requirements.txt                    # Python dependencies (W1)
└── README.md                           # This file
```

---

## Project Evolution

| | Workshop 1 | Workshop 2 | Workshop 3 | Workshop 4 |
|---|---|---|---|---|
| **Focus** | Systems analysis | System design | Robust design + project management | Simulation + validation |
| **Method** | Primary data collection (6 methods) | Microservices architecture | Risk register, PMBOK plan | DES + behavioral simulation |
| **Key output** | Problem identification | Event-driven architecture | 10-risk register, quality framework | 30-run statistical validation |
| **Main finding** | 35 % under-reporting, 12 % adoption | 5-layer microservices design | θ ≥ 3 required by risk analysis | θ ≥ 3 validated experimentally |

---

## Workshop No. 1 — Systems Analysis

### Contents

| Section | Topic |
|---|---|
| I | System description, boundaries, and stakeholders |
| II | Data collection plan and execution |
| III | Data quality evaluation |
| IV | Element analysis and relationship map |
| V | Sensitivity, complexity, and emergent behavior |
| VI | Discussion |
| VII | Conclusions |

### Data Collection Methods

Six methods were used simultaneously to build a complete picture of the problem:

- **Interviews** — 5 security staff and 2 administrative staff
- **Survey** — 20 students (Google Forms)
- **Direct observation** — 4 campus zones, 8 sessions
- **Document analysis** — Institutional incident reports
- **Benchmarking** — 3 security alert platforms in Bogotá
- **Weather monitoring** — Teusaquillo locality, 1 week

### Key Findings

- **35 %** of surveyed students reported having experienced or witnessed an incident on campus
- **100 %** of students who experienced an incident said they would use the alert app
- Suspicious events were concentrated in the **parking lot at night**
- There is a significant **under-reporting problem**: incidents happen but people do not report them

### How to Compile

The main file is written in LaTeX using IEEE formatting. The easiest way is through **Overleaf**:

1. Go to [overleaf.com](https://overleaf.com) → New Project → Blank Project
2. Paste the contents of `docs/workshop1_complete.tex` into `main.tex`
3. Upload all images from `/diagrams/` and `/data/` to the same project folder
4. Set compiler to **pdfLaTeX** → Recompile

---

## Workshop No. 2 — System Design

### Overview

Complete system design for the CSAS platform based on Workshop 1 findings. Microservices-based, event-driven architecture with a hybrid verification pipeline and geofenced alert dispatch, targeting a response time reduction from 11.4 min to under 5 min.

### Key Design Decisions

- Microservices-based, event-driven architecture (5 layers: Clients, Edge, Services, Messaging, Persistence)
- Adaptive verification engine with zone and time-of-day weighting
- Mobile-first reporting interface (≤ 3 taps to submit a report)
- Complementary integration with the existing SIURE UD system

### Deliverables

| Deliverable | Location |
|---|---|
| System Design Document | `docs/` |
| LaTeX Source | `docs/` |
| Architecture Diagram | `diagrams/` |
| Process Flow Diagram | `diagrams/` |

---

## Workshop No. 3 — Robust Design and Project Management

### Overview

Hardens the Workshop 2 design using ISO/IEC 25010 quality attributes and professional engineering standards. Adds a formal risk register, a PMBOK-aligned project plan, a phased deployment strategy, and a quality assurance framework.

### Key Decisions

- Verification threshold set to **θ ≥ 3** as minimum architectural requirement (validated in W4)
- 10-risk register scored by probability × impact (ISO 31000), with mitigation and contingency for each
- 12-day project schedule with 5 milestones (M1–M5) and RACI matrix
- Three-phase deployment: Pilot (4 wk) → Controlled (8 wk) → Full ops

### Standards Applied

ISO/IEC 25010 · ISO 31000 · IEEE 830 / 12207 · CMMI Level 3 · PMBOK 7th ed. · Ley 1581/2012

### Deliverables

| Deliverable | Location |
|---|---|
| System Design Document (PDF, 8 pages, IEEE format) | `Workshop_3_Management/docs/` |
| LaTeX Source | `Workshop_3_Management/docs/` |
| Risk Register (xlsx + csv, 10 risks with severity coloring) | `Workshop_3_Management/risk_management/` |
| Contingency Plan | `Workshop_3_Management/risk_management/` |
| Project Charter + Team Roles (RACI) | `Workshop_3_Management/project_management/` |
| Timeline Gantt (xlsx, 4 sheets) | `Workshop_3_Management/project_management/` |
| Quality Metrics + Release Checklist | `Workshop_3_Management/quality_assurance/` |
| Deployment Phases + Infrastructure Requirements | `Workshop_3_Management/implementation/` |

---

## Workshop No. 4 — System Simulation and Validation

### Overview

Tests the CSAS design through computational simulation using two complementary approaches: a Discrete Event Simulation (DES) that models the technical event pipeline, and a behavioral simulation that models community adoption dynamics and feedback loops. Three scenarios are evaluated — Baseline, Optimization, and Failure Mode — each run 30 independent times for statistical reliability.

### Key Results

| Scenario | Avg Latency | 95 % CI | Adoption | Alert Success |
|---|---|---|---|---|
| Baseline | 40.87 s | [38.85, 42.89] | 21.39 % | 74.10 % |
| **Optimization** | **17.94 s** | **[16.92, 18.96]** | **67.62 %** | **96.84 %** |
| Failure Mode | 71.66 s | [67.72, 75.59] | 31.34 % | 50.71 % |

The Optimization scenario meets all performance targets: latency < 30 s (NFR-01), delivery ≥ 96.84 % (NFR-02), adoption ≥ 60 % (KPI).

### Main Findings

- The **verification threshold θ** is the most influential control variable. θ = 1 drives the system into a feedback collapse; θ ≥ 3 stabilizes it.
- Below **30–35 % community adoption**, no technological configuration can sustain the system — an onboarding campaign is mandatory before Phase 1 exit.
- The Workshop 2 architecture (RabbitMQ, Kubernetes, automated verification) was validated under load by EXP-01 and EXP-02.

### How to Run the Simulations

```bash
cd Workshop_4_Simulation/simulation/
pip install -r requirements.txt

python W4_DES.py          # Discrete Event Simulation
python W4_behavioral.py   # Behavioral simulation (enter scenario and steps when prompted)
```

### Deliverables

| Deliverable | Location |
|---|---|
| Simulation Report (PDF, 8 pages, IEEE format) | `Workshop_4_Simulation/docs/` |
| LaTeX Source | `Workshop_4_Simulation/docs/` |
| DES simulation (SimPy) | `Workshop_4_Simulation/simulation/W4_DES.py` |
| Behavioral simulation | `Workshop_4_Simulation/simulation/W4_behavioral.py` |
| Statistical results (CSV) | `Workshop_4_Simulation/results/` |
| Performance charts (6 PNG) | `Workshop_4_Simulation/results/figures/` |
| Risk analysis W4 | `Workshop_4_Simulation/risk_management/` |
| Statistical validation guide | `Workshop_4_Simulation/validation/` |

---

## Team

| Name | Student Code |
|---|---|
| Gabriel Mateo Cusba Marin | 20251020128 |
| Henry Samuel Garrido Medina | 20251020125 |
| Felipe Jose Garzon Herrera | 20251020132 |
| Juan Esteban Quintero Gordillo | 20251020137 |

---

## Course Info

**Course:** Systems Analysis and Design  
**Professor:** Ing. Carlos Andrés Sierra, M.Sc.  
**University:** Universidad Distrital Francisco José de Caldas  
**Semester:** 2026-I
