# Workshop 2 — Revised Submission

**Course:** Systems Analysis and Design
**Professor:** Carlos Andrés Sierra, M.Sc.
**Semester:** 2026-I

## Team

| Member | Code | Role |
|---|---|---|
| Felipe José Garzón Herrera | 20251020132 | Persona 4 — Conclusions, ethics, repo management |
| Juan Esteban Quintero Gordillo | 20251020137 | — |
| Henry Samuel Garrido Medina | 20251020125 | — |
| Gabriel Mateo Cusba Marín | 20251020128 | — |

## What changed from v1 (grade: 4.0 / 5.0)

| Professor's feedback | Change in v2 |
|---|---|
| "Software architecture ≠ system architecture" | Added **Section 4 (System Architecture)**: system context diagram, stakeholder-technology interface, information flows org↔tech (Table 4), inputs/outputs/constraints (Table 5). |
| "No operational workflows or human-process view" | Added **Section 3 (CONOPS)**: swim-lane diagram, operational roles (Table 3), emergency SOS workflow, operational constraints. |
| "Design decisions lack engineering justification" | Added **Section 6 (DDRs)**: DDR-01 (verification pipeline — 4 alternatives evaluated on 5 criteria), DDR-02 (zone/time dispatch model — formal weights, alternatives, failure modes), DDR-03 (microservices vs monolith / serverless / SOA). |
| "Zone/time dispatch remains conceptual" | DDR-02 formalises the model: P = S_base × W_z × W_t, with explicit weight tables, priority tiers, and calibration policy. |
| "No concrete usage scenarios" | Added **Section 7 (Operational Scenarios)**: 3 fully worked scenarios with priority calculations, expected latencies, and failure modes. |
| "Academic paper format, not SysE report" | Converted to Technical Report format: title page, ToC, article class, traceable section numbering, no abstract/index-terms. |
| "Evidence & Data: 6.5/10" | Every functional requirement (Table 2) is explicitly traced to the W1 empirical finding that motivates it. |

## Structure

```
workshop2_revised/
├── README.md
├── CSAS_Workshop2_v2.tex     ← LaTeX source (single-column technical report)
├── CSAS_Workshop2_v2.pdf     ← compiled output (24 pages)
├── .gitignore
└── figures/
    └── README.md             ← legacy figures from v1 (Figs 1-2 of original)
```

## How to compile

```bash
pdflatex CSAS_Workshop2_v2.tex
pdflatex CSAS_Workshop2_v2.tex   # second pass for cross-refs
pdflatex CSAS_Workshop2_v2.tex   # third pass for ToC
```

Requires: texlive-publishers, texlive-pictures, texlive-latex-extra, lmodern.
