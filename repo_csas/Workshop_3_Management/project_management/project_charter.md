# Project Charter — CSAS Workshop No. 3

| Field | Value |
| --- | --- |
| Project name | Community Security Alert System (CSAS) — Workshop No. 3 |
| Project code | CSAS-W3-2026I |
| Sponsor | Computer Engineering Program, Universidad Distrital Francisco José de Caldas |
| Course instructor | Eng. Carlos Andrés Sierra, M.Sc. |
| Estimated duration | 12 working days |

---

## Objective

Design a structured, robust and maintainable system that allows users to report, verify, and disseminate security incidents in real time, supporting decision-making by users and authorities and complying with academic, ethical and legal standards.

The Workshop 3 deliverable specifically translates the Workshop 2 design into an **implementation-ready** specification by adding robust-engineering rationale, quality assurance, risk management, and a project management plan.

## Scope

**In scope**

- Refinement of the Workshop 2 architecture under ISO/IEC 25010 quality attributes
- Quality assurance framework: metrics, validation, release checklist
- Risk register following ISO 31000 and PMBOK
- Project management plan: charter, roles, schedule, resources, communication
- Phased implementation strategy with readiness indicators
- Evolution summary across W1 → W2 → W3
- Ethical and legal considerations (Ley 1581 de 2012)

**Out of scope**

- Software development. The deliverable is a complete and well-structured *design*; no executable artefacts are produced in this workshop.
- Procurement of cloud or third-party services.

## Stakeholders

| Stakeholder | Role |
| --- | --- |
| Development team (4 members) | Producer |
| Course instructor | Reviewer |
| Simulated end users (students and staff) | Beneficiary |
| External integrators (notification providers, authorities) | Future partners |

## Main Deliverables

1. Enhanced System Design Document (`docs/Workshop3_CSAS.pdf`)
2. Risk Management Plan (`risk_management/`)
3. Project Management Plan (`project_management/`)
4. Quality Assurance Framework (`quality_assurance/`)
5. Implementation Strategy (`implementation/`)
6. Updated GitHub repository with README and folder navigation

## Success Criteria

- All deliverables submitted on time
- Documentation clear, coherent and integrated across sections
- Explicit traceability to Workshops 1 and 2
- Quantitative KPIs achievable in design analysis
- Risk register reviewed and accepted by the team
- Repository structure consistent with W1 and W2 conventions

## Constraints

- 12 working days from kick-off to submission
- Team of four members with overlapping coursework commitments
- Workshop 2 architecture is the inherited baseline; deviations must be justified

## Assumptions

- Workshop 2 deliverable is approved as the baseline for refinement
- Cloud infrastructure references in the design (Kubernetes, RabbitMQ, PostgreSQL) are illustrative and do not commit the project to a specific provider
- Standards referenced (ISO, IEEE, CMMI, PMBOK) are accepted as the authoritative quality baseline

## Authorisation

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Project Manager | Felipe Jose Garzon Herrera | _______________ | __________ |
| Architecture Lead | _______________ | _______________ | __________ |
| Risk Manager | _______________ | _______________ | __________ |
| Implementation Lead | _______________ | _______________ | __________ |
