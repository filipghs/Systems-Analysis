# Workshop 3 — Revised Submission

**Course:** Systems Analysis and Design  
**Professor:** Eng. Carlos Andrés Sierra, M.Sc.  
**Semester:** 2026-I  
**Grade received (v1):** 3.2 / 5.0

## Team

| Member | Code | Role |
|---|---|---|
| Felipe José Garzón Herrera | 20251020132 | Persona 4 — Ethics, implementation, repository, conclusions |
| Juan Esteban Quintero Gordillo | 20251020137 | — |
| Henry Samuel Garrido Medina | 20251020125 | — |
| Gabriel Mateo Cusba Marín | 20251020128 | — |

## What changed from v1

| Professor's feedback | Change in v2 |
|---|---|
| "Focus on software, not the complete system" | **Section 2** distinguishes three robustness layers: technical, **organisational**, and **environmental** — the last two were absent from v1 |
| "No stakeholder/boundary/operational process view" | Organisational robustness (Sec. 2.3) defines workflow integration, moderation capacity, and adoption floor as system-level requirements |
| "Agile Gantt = contradiction" | Replaced with a genuine **hybrid agile plan**: 4 sprints, each with a system-level goal, a product backlog of user stories, and observable exit criteria |
| "Missing traceability between sections" | **Table 7** provides end-to-end traceability: W1 empirical finding → W2 requirement → W3 robustness/risk/sprint decision |
| "Generic risk register, no behavioural/org risks" | Risk register expanded to 12 risks; 4 new behavioural/organisational risks added (R-04, R-05, R-08, R-12); each risk cites its W1/W2 source |
| "Quality attributes not traced to stakeholders" | **Table 2** maps each quality attribute to the affected stakeholder and the observable consequence of failure |
| "No operational/field validation" | Quality gate sequence adds **Level 4 — Field Exercise**: real campus drill measuring end-to-end socio-technical performance |
| "Sections lack coherence and transitions" | Document rewritten with explicit paragraph transitions and a consistent systems-engineering voice throughout |

## Structure

```
workshop3_revised/
├── README.md
├── CSAS_Workshop3_v2.tex     ← LaTeX source (single-column Technical Report)
├── CSAS_Workshop3_v2.pdf     ← compiled output (24 pages)
├── .gitignore
└── figures/
    └── README.md
```

## How to compile

```bash
pdflatex CSAS_Workshop3_v2.tex
pdflatex CSAS_Workshop3_v2.tex
pdflatex CSAS_Workshop3_v2.tex
```

Requires: `lmodern`, `texlive-latex-extra`, `texlive-pictures`.
