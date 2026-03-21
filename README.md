#  Community Security Alert System (CSAS)

**Systems Analysis and Design — Workshop No. 1**  
Universidad Distrital Francisco José de Caldas · Semester 2026-I

---

## What is this project?

The CSAS is a collaborative technological platform designed to improve safety on the university campus and its surroundings. The core idea is simple: instead of relying solely on security personnel, the system allows students, professors, and administrative staff to report incidents in real time from their phones, and all nearby users receive verified alerts immediately.

This repository contains **Workshop No. 1** of the course, covering the full system analysis: scope definition, stakeholder identification, primary data collection and evaluation, element and relationship analysis, and a sensitivity study of system behavior.

---

## Repository Structure

```
sasc-taller01/
├── docs/
│   └── workshop1_complete.tex     # Main document (LaTeX, IEEE format)
├── diagrams/
│   ├── context_diagram.png        # System context diagram
│   └── relationship_map.png       # Component relationship map
├── data/
│   ├── survey_table.png           # Raw student survey data (n=20)
│   ├── survey_chart.png           # Chart: proportion of reported incidents
│   └── observation_table.png      # Direct observation record (8 sessions)
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

---

## Workshop No. 1 — Contents

| Section | Topic |
|---|---|
| I | System description, boundaries, and stakeholders |
| II | Data collection plan and execution |
| III | Data quality evaluation |
| IV | Element analysis and relationship map |
| V | Sensitivity, complexity, and emergent behavior |
| VI | Discussion |
| VII | Conclusions |

---

## Data Collection Methods

Six methods were used simultaneously to build a complete picture of the problem:

- **Interviews** — 5 security staff and 2 administrative staff
- **Survey** — 20 students (Google Forms)
- **Direct observation** — 4 campus zones, 8 sessions
- **Document analysis** — Institutional incident reports
- **Benchmarking** — 3 security alert platforms in Bogotá
- **Weather monitoring** — Teusaquillo locality, 1 week

---

## Key Findings

- **35%** of surveyed students reported having experienced or witnessed an incident on campus
- **100%** of students who experienced an incident said they would use the alert app
- Suspicious events observed were concentrated in the **parking lot at night**
- There is a significant **under-reporting problem**: incidents happen but people do not report them

---

## How to Compile the Document

The main file is written in LaTeX using IEEE formatting. The easiest way is through **Overleaf**:

1. Go to [overleaf.com](https://overleaf.com) → New Project → Blank Project
2. Paste the contents of `workshop1_complete.tex` into `main.tex`
3. Upload all images from `/diagrams/` and `/data/` to the same project folder
4. Set compiler to **pdfLaTeX** → Recompile

---

## Team

| Name |
|---|---|
| [Gabriela Mateo Cusba Marin - 20251020128] |
| [Henry Samuel Garrido Medina -20251020125] |
| [Felipe Jose Garzon Herrera -20251020132] |
| [Quintero Gordillo Juan Esteban –20251020137 ] |

---
---

## Workshop No. 2 — Systems Design

**System:** Community Security Alert System (CSAS)  
**Semester:** 2026-I

### Overview
Complete systems design for the CSAS platform based on Workshop No. 1 findings.
Microservices-based, event-driven architecture with hybrid verification pipeline
and geofenced alert dispatch targeting a response time reduction from 11.4 min to under 5 min.

### Key Design Decisions
- Microservices-based, event-driven architecture
- Adaptive verification engine with zone and time weighting
- Mobile-first reporting interface (≤ 3 taps to submit)
- Complementary integration with existing SIURE UD system

### Deliverables
| Deliverable | Link |
|---|---|
| System Design Document | [PDF](./Workshop_2_Design/CSAS_W2_final.pdf) |
| LaTeX Source | [.tex](./Workshop_2_Design/CSAS_W2_final.tex) |
| Architecture Diagram | [PNG](./Workshop_2_Design/diagrams/fig1_architecture.png) |
| Process Flow Diagram | [PNG](./Workshop_2_Design/diagrams/fig2_processflow.png) |
```

4. Mensaje de commit:
```
Update README with Workshop 2 section and deliverable links

## Course Info

**Course:** Systems Analysis and Design  
**Professor:** Ing. Carlos Andrés Sierra, M.Sc.  
**University:** Universidad Distrital Francisco José de Caldas  
**Semester:** 2026-I
