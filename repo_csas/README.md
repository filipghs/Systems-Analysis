# Systems Analysis & Design — CSAS Project

**Course:** Systems Analysis & Design
**Semester:** 2026-I
**Institution:** Universidad Distrital Francisco José de Caldas
**Program:** Computer Engineering
**Instructor:** Eng. Carlos Andrés Sierra, M.Sc.

---

## Team

| Name | Student Code |
| --- | --- |
| Felipe Jose Garzon Herrera | 20251020132 |
| Juan Esteban Quintero Gordillo | 20251020137 |
| Henry Samuel Garrido Medina | 20251020125 |
| Gabriel Mateo Cusba Marin | 20251020128 |

---

## Project Overview

The **Community Security Alert System (CSAS)** is a crowd-sourced mobile and web platform engineered to improve security at Universidad Distrital Francisco José de Caldas. Building on empirical findings from a comprehensive systems analysis, the project addresses three documented gaps in the current campus security posture:

1. A persistent under-reporting culture due to high friction in existing reporting channels.
2. A spatial and temporal concentration of incidents in specific zones and hours.
3. The absence of a centralized real-time incident management tool.

CSAS targets a reduction in average emergency response time from 11.4 minutes to under 5 minutes, with a delivery-success rate above 99.9 % and a user adoption rate above 60 %.

---

## Repository Structure

```
Repositorio_Curso/
├── Workshop_1/                    Systems analysis (W1)
├── Workshop_2/                    System design (W2)
├── Workshop_3_Management/         Robust design + project management (W3)
└── README.md                      This file
```

Each workshop folder contains its own README, the corresponding PDF deliverable, supporting diagrams and any auxiliary artefacts.

---

## Workshops

### Workshop 1 — Systems Analysis
Empirical analysis of the campus security problem using six independent data-collection methods. Identifies the under-reporting gap, the spatial-temporal concentration of incidents, and the absence of a centralized reporting tool.

→ [`Workshop_1/`](./Workshop_1/)

### Workshop 2 — System Design
Translates the empirical findings into a microservices-based, event-driven architecture organized in five layers (Presentation, Application, Service, Data, Integration). Defines functional and non-functional requirements, technology stack, and risk and complexity management.

→ [`Workshop_2/`](./Workshop_2/)

### Workshop 3 — Robust Design and Project Management
Hardens the Workshop 2 design under the lens of ISO/IEC 25010 quality attributes and IEEE/CMMI/ISO standards. Adds a formal risk register (10 risks scored on a probability–impact matrix), a project management plan aligned with PMBOK, a phased deployment strategy with explicit readiness indicators, and a continuous-improvement mechanism.

→ [`Workshop_3_Management/`](./Workshop_3_Management/)

---

## Project Evolution

The three workshops form a single analysis–design–refinement cycle. The table below summarises how the project matured at each stage.

| Dimension          | Workshop 1     | Workshop 2          | Workshop 3                     |
| ------------------ | -------------- | ------------------- | ------------------------------ |
| Focus              | Analysis       | Design              | Robustness & management        |
| Quality attributes | Implicit       | Stated              | Measured & mapped to standards |
| Risks              | Identified     | Partially addressed | Registered, scored & mitigated |
| Standards          | Mentioned      | Referenced          | Mapped to components           |
| Project management | —              | Lightweight         | PMBOK-aligned plan             |
| Implementation     | —              | Phase plan          | Deployment + readiness gates   |

---

## How to Navigate

For a complete view of the project, read the workshops in order:

1. **W1** establishes *what* the problem is.
2. **W2** establishes *how* the system addresses it.
3. **W3** establishes *under what conditions* the design is robust, executable and ready for deployment.

Each workshop's PDF is self-contained, but explicit cross-references make the progression traceable across all three documents.

---

## Standards and Frameworks Applied

- **ISO 9001:2015** — Quality management systems
- **ISO/IEC 25010:2011** — Software quality model
- **ISO 31000:2018** — Risk management
- **IEEE 830-1998** — Software requirements specifications
- **IEEE 1633-2016** — Software reliability
- **ISO/IEC/IEEE 12207:2017** — Software life-cycle processes
- **CMMI Level 3** — Process maturity
- **PMBOK 7th ed.** — Project management
- **Ley 1581 de 2012** (Colombia) — Personal data protection
