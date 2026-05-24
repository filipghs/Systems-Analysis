# Workshop No. 2 — Systems Design

**System:** Community Security Alert System (CSAS)
**Course:** Systems Analysis & Design — Semester 2026-I
**Professor:** Eng. Carlos Andrés Sierra, M.Sc.
**University:** Universidad Distrital Francisco José de Caldas

---

## Team

| Student | Code |
|---|---|
| Felipe Jose Garzon Herrera | 20251020132 |
| Juan Esteban Quintero Gordillo | 20251020137 |
| Henry Samuel Garrido Medina | 20251020125 |
| Gabriel Mateo Cusba Marin | 20251020128 |

---

## Overview

This workshop presents the complete systems design for the CSAS platform,
translating the empirical findings of Workshop No. 1 into a microservices-based,
event-driven architecture. The design is organized across five layers and includes
a hybrid AI-and-human verification pipeline, geofenced alert dispatch with
zone-weighted and time-weighted priority logic, and a community engagement module
targeting a campus adoption rate of at least 60%.

Every major design decision is explicitly traceable to an empirical finding from
Workshop No. 1.

---

## Key Design Decisions

- **Microservices-based, event-driven architecture** — five independent services
  (Incident, Verification, Dispatcher, User, Analytics) communicating via RabbitMQ
- **Adaptive verification engine** — hybrid AI plausibility scorer + human moderation,
  with priority bypass for high-severity incidents
- **Zone-weighted and time-weighted alert dispatch** — automatically elevates
  priority for night-hour incidents in high-risk zones (parking lot, dormitory)
- **Mobile-first reporting interface** — maximum 3 interactions to submit a report (NFR-06)
- **Complementary integration with SIURE UD** — builds on existing institutional
  process rather than replacing it

---

## Deliverables

| Document | Description | Link |
|---|---|---|
| System Design Document | Full IEEE-format design specification (W2) | [CSAS_W2_SystemDesign.pdf](./CSAS_W2_SystemDesign.pdf) |
| Technical Report | Integrated report covering W1 analysis + W2 design | [CSAS_W2_TechnicalReport.pdf](./CSAS_W2_TechnicalReport.pdf) |
| Academic Paper | IEEE-format paper summarizing both workshops | [CSAS_W2_Paper.pdf](./CSAS_W2_Paper.pdf) |
| LaTeX Sources | Source files for all documents | [latex_sources/](./latex_sources/) |
| Diagrams | Architecture, process flow, context, and node graph | [diagrams/](./diagrams/) |

---

## Diagrams

| Diagram | File |
|---|---|
| System Architecture (5-layer) | [diagrams/architecture_diagram.png](./diagrams/architecture_diagram.png) |
| Main Process Flow | [diagrams/process_flow_diagram.png](./diagrams/process_flow_diagram.png) |
| Stakeholder Context Diagram (W1) | [diagrams/context_diagram.png](./diagrams/context_diagram.png) |
| Node Relationship Graph (W1) | [diagrams/node_graph_diagram.png](./diagrams/node_graph_diagram.png) |

---

## Operational Gap Analysis

| Dimension | Current State | Target | Gap |
|---|---|---|---|
| Emergency response time | ~11.4 min | < 5 min | −6.4 min |
| Incident recording completeness | ~41% | > 85% | +44 pp |
| Community app adoption | ~12% | ≥ 60% | +48 pp |
| Alert delivery success rate | ~87% | > 99.9% | +12.9 pp |

---

## LaTeX Compilation

To compile any `.tex` file from `latex_sources/`, place the following image files
in the same directory:

```
architecture_diagram.png   → rename to → fig1_architecture.png
process_flow_diagram.png   → rename to → fig2_processflow.png
context_diagram.png        → rename to → fig_context.png
node_graph_diagram.png     → rename to → fig_nodegraph.png
```

Then compile with:

```bash
pdflatex filename.tex
pdflatex filename.tex
```

Or upload the `.tex` file and images directly to [Overleaf](https://overleaf.com).
