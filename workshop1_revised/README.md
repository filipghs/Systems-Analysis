# Workshop 1 — Revised Submission

**Course:** Systems Analysis and Design
**Professor:** Carlos Andrés Sierra, M.Sc.
**Program:** Computer Engineering
**Institution:** Universidad Distrital Francisco José de Caldas
**Semester:** 2026-I

## Team

| Member | Student code | Role |
|---|---|---|
| Felipe José Garzón Herrera | 20251020132 | Persona 4 — Executive summary, ethics, repository management, conclusions |
| Juan Esteban Quintero Gordillo | 20251020137 | — |
| Henry Samuel Garrido Medina | 20251020125 | — |
| Gabriel Mateo Cusba Marín | 20251020128 | — |

## Project

This repository hosts the systems analysis of the **Community Security Alert System (CSAS)**, a crowd-sourced platform proposed as an intervention on the campus safety system of Universidad Distrital. The work follows the soft-systems methodology of Checkland and the leverage-point framework of Meadows.

## About this revision (v2)

The first submission of Workshop 1 received a grade of **4.0 / 5.0** with detailed feedback. This revised version (`CSAS_Workshop1_v2.tex` / `.pdf`) addresses every point raised by the professor. The changes are structural, not cosmetic.

### What changed, mapped to professor's feedback

| Feedback point | Where addressed in v2 |
|---|---|
| *"the platform appears to become the central focus"* | Section I-A rewritten **system-first**: campus safety is characterized as a socio-technical system with three coupled subsystems (incident generation, awareness, response) **before** CSAS is introduced as a candidate intervention. |
| Section IV-A listed CSAS components as "system elements" | Rewritten as **seven pre-intervention elements** of the campus safety system. No CSAS component is listed as a system element. |
| System purpose described as platform features | Reformulated as **four measurable changes in system state variables** (latency, record completeness, adoption, alert delivery), tied to the gap analysis (Table VIII). |
| Operational environment opened with technology stack | Reordered: physical → social → institutional → infrastructural. |
| Missing behavioral diagrams (cause-effect, feedback, stakeholder interaction, information flow) | **Four new TikZ diagrams**: Fig. 4 stakeholder interaction · Fig. 5 Ishikawa of under-reporting · Fig. 6 information flow (current vs. target) · Fig. 7 causal loop diagram with reinforcing (R1, R2) and balancing (B1) loops. |
| Missing alternatives, trade-offs, unintended consequences, evaluation criteria | **New Section VI** with four candidate interventions (A1–A4) compared on six criteria (Table IX). **New Section VII** with explicit assumptions and validation status (Table X), risk register (Table XI), four classes of unintended consequences, and six evaluation criteria. |
| Assumptions stated without supporting evidence | Table X makes each assumption explicit: evidence base, validation status (plausible / untested / unvalidated / partially supported), and validation action for next phase. |
| Conclusions restated the solution instead of system insights | Section VIII rewritten around **four systems insights**: the system is information-bound; it sits in a self-reinforcing under-reporting trap (R2); user participation and verification latency are the dominant parameters; verification is a structural requirement, not a feature. |
| Theoretical references not connected to body text | Meadows invoked explicitly for the leverage-point framing; Sterman and Senge added for system-dynamics modeling; Ishikawa added for the fishbone diagram. |

## Repository structure

```
workshop1_revised/
├── README.md                   ← this file
├── CSAS_Workshop1_v2.tex       ← LaTeX source
├── CSAS_Workshop1_v2.pdf       ← compiled output (11 pages)
├── .gitignore                  ← ignores LaTeX aux files
└── figures/
    └── README.md               ← list of legacy figures to add
```

## How to compile

The document uses the standard IEEE conference class and TikZ for all new diagrams. From a clean TeX Live installation (with `texlive-publishers` and `texlive-pictures`):

```bash
pdflatex CSAS_Workshop1_v2.tex
pdflatex CSAS_Workshop1_v2.tex     # second pass for cross-references
pdflatex CSAS_Workshop1_v2.tex     # third pass to stabilize the ToC of figures
```

No `bibtex` is needed — the bibliography is embedded with `thebibliography`.

## Status of legacy figures

Figures 1, 2, 3 and Tables III, IV from the original submission are referenced in `v2` via placeholder `\fbox` blocks. Before final submission, these placeholders should be replaced with `\includegraphics` calls pointing to the figures stored in `figures/`. See `figures/README.md` for details.
