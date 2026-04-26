# Workshop No. 3 — Robust System Design and Project Management

**Project:** Community Security Alert System (CSAS)
**Course:** Systems Analysis & Design
**Semester:** 2026-I
**Institution:** Universidad Distrital Francisco José de Caldas
**Instructor:** Eng. Carlos Andrés Sierra, M.Sc.

---

## Team

- Felipe Jose Garzon Herrera (20251020132)
- Juan Esteban Quintero Gordillo (20251020137)
- Henry Samuel Garrido Medina (20251020125)
- Gabriel Mateo Cusba Marin (20251020128)

---

## Workshop Goals

This workshop strengthens the Workshop 2 design by applying robust engineering principles and project management strategies. The deliverable demonstrates that the CSAS architecture is **viable, sustainable and implementable** under real-world conditions.

Workshop No. 3 covers:

1. **Robust system architecture** — refinement under ISO/IEC 25010 quality attributes (reliability, scalability, maintainability, usability, security)
2. **Quality assurance framework** — measurable metrics, validation methods, release checklist
3. **Comprehensive risk management** — 10-risk register following ISO 31000 and PMBOK
4. **Project management plan** — charter, team roles, schedule, resources, communication
5. **Implementation strategy** — phased deployment with readiness assessment
6. **Evolution and continuous improvement** — explicit traceability to Workshops 1 and 2
7. **Ethical and legal considerations** — Ley 1581 de 2012 compliance

---

## Folder Structure

```
Workshop_3_Management/
├── README.md                              ← This file
│
├── docs/
│   ├── Workshop3_CSAS.pdf                 ← Main deliverable (8 pages, IEEE format)
│   └── Workshop3_CSAS.tex                 ← LaTeX source (self-contained)
│
├── diagrams/
│   ├── architecture.png                   ← Refined CSAS architecture (Fig. 1)
│   ├── qa_pipeline.png                    ← Quality gate sequence (Fig. 2)
│   ├── risk_heatmap.png                   ← Probability–impact matrix (Fig. 3)
│   ├── team_org_chart.png                 ← CSAS team structure (Fig. 4)
│   ├── gantt_chart.png                    ← Project schedule (Fig. 5)
│   ├── deployment_phases.png              ← Phased deployment (Fig. 6)
│   └── diagrams_source.tex                ← Editable TikZ source for all diagrams
│
├── risk_management/
│   ├── risk_register.xlsx                 ← Excel risk register with severity colouring
│   ├── risk_register.csv                  ← CSV export for tooling interoperability
│   └── contingency_plan.md                ← Response actions for failure scenarios
│
├── project_management/
│   ├── project_charter.md                 ← Project objective, scope, stakeholders
│   ├── team_roles.md                      ← Role descriptions and responsibilities
│   ├── timeline_gantt.xlsx                ← Schedule, Gantt chart, milestones (M1–M5)
│   ├── communication_plan.md              ← Channels, cadence, escalation
│   └── resource_plan.md                   ← Resource allocation and monitoring
│
├── quality_assurance/
│   ├── quality_metrics.md                 ← KPIs and acceptance thresholds
│   ├── validation_methods.md              ← Testing layers and procedures
│   └── release_checklist.md               ← Release-time quality gate
│
└── implementation/
    ├── deployment_phases.md               ← Pilot → Controlled → Full ops
    ├── infrastructure_requirements.md     ← Compute, storage, networking, observability
    └── change_management.md               ← Change advisory board procedure
```

---

## How to Read This Workshop

1. **Start with the PDF**: `docs/Workshop3_CSAS.pdf` is the consolidated deliverable in IEEE conference format.
2. **Use the supporting artefacts** when you need editable, tool-accessible versions of the same content:
   - `risk_register.xlsx` for filtering, sorting and editing the risks
   - `timeline_gantt.xlsx` for the schedule and milestones
   - `diagrams/*.png` for embedding any figure elsewhere
3. **The `.md` files** in the subfolders are the operational, day-to-day version of each PDF section, ready to be referenced from issues, pull requests or future workshops.

---

## Cross-References to Previous Workshops

This workshop builds on the artefacts produced in:

- [`../Workshop_1/`](../Workshop_1/) — empirical analysis of the campus security problem
- [`../Workshop_2/`](../Workshop_2/) — initial system architecture and requirements specification

Section VII of the PDF (*Evolution and Continuous Improvement*) documents how each finding from W1 and each design decision from W2 is preserved, refined or replaced in W3.

---

## Submission Checklist

- [x] Enhanced System Design Document (PDF)
- [x] Robust Architecture Diagram
- [x] Risk Management Plan with register
- [x] Quality Assurance Framework
- [x] Project Charter
- [x] Team Structure and Roles
- [x] Project Timeline with milestones
- [x] Resource Management Plan
- [x] Communication and Control Plan
- [x] Implementation Strategy
- [x] Evolution Summary (W1 → W2 → W3)
- [x] Risk Register (xlsx + csv)
- [x] Quality Assurance Checklist
- [x] Updated repository README
