# Community Security Alert System (CSAS)

> **A Smart Solution for Real-Time Incident Reporting at Universidad Distrital Francisco José de Caldas**

[![Course](https://img.shields.io/badge/Course-Systems%20Analysis%20%26%20Design-blue)]()
[![Semester](https://img.shields.io/badge/Semester-2026--I-green)]()
[![University](https://img.shields.io/badge/UDFJC-Computer%20Engineering-red)]()
[![License](https://img.shields.io/badge/License-Academic-lightgrey)]()

---

## 📋 Project Overview

The **Community Security Alert System (CSAS)** is a crowd-sourced mobile and web platform designed to address three critical gaps in campus security at Universidad Distrital Francisco José de Caldas:

| Problem | Baseline (W1) | Target | Gap |
|---------|:---:|:---:|:---:|
| Emergency response time | ~11.4 min | < 5 min | −6.4 min |
| Incident recording rate | ~41% | > 85% | +44 pp |
| Community app adoption | ~12% | ≥ 60% | +48 pp |
| Alert delivery success | ~87% | > 99.9% | +12.9 pp |

The system was developed through a complete **systems engineering lifecycle** across four workshops, progressing from empirical analysis to validated architectural design.

---

## 👥 Team

| Name | Student Code | Role |
|------|:---:|------|
| Felipe Jose Garzon Herrera | 20251020132 | Project Manager |
| Juan Esteban Quintero Gordillo | 20251020137 | Architecture & Quality Lead |
| Henry Samuel Garrido Medina | 20251020125 | Risk Management Lead |
| Gabriel Mateo Cusba Marin | 20251020128 | Implementation & Evolution Lead |

**Instructor:** Eng. Carlos Andrés Sierra, M.Sc.  
**Program:** Computer Engineering — School of Engineering  
**University:** Universidad Distrital Francisco José de Caldas, Bogotá D.C., Colombia

---

## 📁 Repository Structure

```
CSAS-Project/
│
├── README.md                          ← You are here
│
├── docs/
│   ├── reports/
│   │   ├── CSAS_Comprehensive_Report.pdf    ← Final integrated report (W1–W4)
│   │   ├── CSAS_Comprehensive_Report.tex    ← LaTeX source (editable)
│   │   ├── CSAS_Technical_Report_W1_W2.pdf  ← Technical report (Workshops 1 & 2)
│   │   ├── CSAS_IEEE_Paper.pdf              ← IEEE-format paper
│   │   └── CSAS_Poster.pdf                  ← Project poster
│   │
│   └── workshops/
│       ├── Workshop_1_Systems_Analysis.pdf   ← Systems Analysis (6 methods)
│       ├── Workshop_2_Systems_Design.pdf     ← Architecture & Design
│       └── Workshop_3_Robust_Design.pdf      ← Robust Engineering & PMBOK
│
├── presentation/
│   └── CSAS_Final_Presentation.pptx         ← 18-slide stakeholder presentation
│
├── prototype/
│   ├── README.md                            ← Setup instructions
│   ├── package.json                         ← Dependencies
│   └── src/
│       └── App.jsx                          ← CSAS functional prototype (React)
│
├── simulation/
│   └── README.md                            ← Simulation documentation (W4)
│
└── diagrams/
    └── README.md                            ← Architecture diagrams reference
```

---

## 🏗️ Systems Engineering Journey

### Workshop 1 — Systems Analysis
Comprehensive analysis through **six independent data collection methods**: structured interviews (5 security + 2 admin staff), student surveys (n=20), direct observation (4 zones, 8 sessions), document analysis, benchmarking (3 platforms in Bogotá), and weather monitoring. Findings converged on three core problems: under-reporting culture, night-time incident concentration, and absence of a centralized tool.

### Workshop 2 — Systems Design
Five-layer **microservices architecture** (Presentation, Application, Service, Data, Integration) with five core services: Incident, Verification, Dispatcher, User, and Analytics. Key design features include a **hybrid AI-and-human verification pipeline**, **geofenced alert dispatch** with zone-weighted and time-weighted priority logic, and **multi-channel notification** (Push + SMS fallback).

### Workshop 3 — Robust Design & Project Management
Architecture hardened under **ISO/IEC 25010**, **ISO 9001**, **CMMI Level 3**, **IEEE 830/1633/12207**, **PMBOK**, and **ISO 31000** frameworks. Ten risks registered with quantitative probability–impact scoring. Project management plan with four roles, six-phase critical path, and three-phase deployment strategy (Pilot → Controlled → Full Operation).

### Workshop 4 — Simulation & Validation
**Discrete-event simulation** and **agent-based modeling** validated design decisions across baseline, surge (300%), and failure scenarios. All NFR targets were met. Three emergent behaviors documented: spatial clustering cascades, night-time verification bottlenecks, and non-linear adoption sensitivity.

---

## 🖥️ Prototype

The functional prototype demonstrates all key architectural components:

- **Dashboard** — Real-time KPIs, live campus map, time/type/severity charts
- **Incident Reporting** — 3-step submission (NFR-06), auto GPS capture (FR-06)
- **Verification Pipeline** — AI plausibility scorer (FR-03), NFR-08 quality gate, priority bypass
- **Campus Map** — Interactive zones, geofence visualization (FR-02), risk indicators
- **Analytics** — Gap analysis, radar heatmap (FR-09), KPI progress bars
- **Simulation Console** — Workshop 4 validation scenarios with terminal output
- **Architecture View** — 5-layer diagram, standards matrix, technology stack
- **SOS Button** — One-touch emergency dispatch (FR-08)

### Quick Start

```bash
cd prototype
npm install
npm run dev
```

See [`prototype/README.md`](prototype/README.md) for detailed setup instructions.

---

## 📊 Key Performance Indicators

| KPI | Target | NFR | Method | Frequency |
|-----|:---:|:---:|--------|:---------:|
| Alert latency (end-to-end) | < 30 s | NFR-01 | System event logs | Daily |
| Notification delivery rate | > 99.9% | NFR-02 | FCM/Twilio receipts | Daily |
| System availability | 99.9% | NFR-03 | Uptime monitoring | Continuous |
| Incident recording rate | > 85% | — | Cross-ref staff records | Monthly |
| Community adoption rate | > 60% | — | MAU analytics | Monthly |
| Verification latency | < 60 s | — | Broker timestamps | Daily |
| Alert accuracy rate | ≤ 5% false | — | Post-incident review | Weekly |

---

## 🔧 Technology Stack

| Component | Technology | Justification |
|-----------|-----------|---------------|
| Mobile App | React Native | Single codebase iOS/Android; ≤3-interaction reporting |
| API Gateway | Node.js / Nginx | High I/O throughput; auth and rate limiting |
| Backend Services | Node.js | Async event-driven runtime; <30s latency target |
| Verification Engine | Python / FastAPI | ML ecosystem for AI plausibility scorer |
| Message Broker | RabbitMQ | Priority queues; decouples ingestion from verification |
| Database | PostgreSQL + PostGIS | Geospatial queries for zone-weighted routing |
| Push Notifications | Firebase FCM | Cross-platform delivery; 99.9% target |
| SMS Fallback | Twilio API | Equity of access guarantee |
| Infrastructure | AWS/Azure (K8s) | Per-service auto-scaling |

---

## 📚 References

1. C. A. Sierra, *TeamWork as Computer Engineers — CS Collaboration Guidelines*, UDFJC, 2026.
2. P. Checkland, *Systems Thinking, Systems Practice*, Wiley, 1981.
3. D. H. Meadows, *Thinking in Systems: A Primer*, Chelsea Green, 2008.
4. ISO/IEC/IEEE 15288:2015 — Systems and Software Engineering.
5. J. W. Creswell and J. D. Creswell, *Research Design*, 5th ed., SAGE, 2018.
6. Ley 1581 de 2012 — Régimen General de Protección de Datos Personales.
7. L. Bass et al., *Software Architecture in Practice*, 3rd ed., Addison-Wesley, 2013.
8. N. Dragoni et al., "Microservices: Yesterday, Today, and Tomorrow," 2017.
9. ISO/IEC 25010:2011 — Quality Models.
10. ISO 31000:2018 — Risk Management.
11. PMBOK Guide, 7th ed., PMI, 2021.

---

## 📄 License

This project was developed for academic purposes as part of the Systems Analysis & Design course (Semester 2026-I) at Universidad Distrital Francisco José de Caldas. All rights reserved by the authors.

---

<p align="center">
  <strong>Universidad Distrital Francisco José de Caldas</strong><br>
  Computer Engineering Program — School of Engineering<br>
  Bogotá D.C., Colombia — 2026
</p>
