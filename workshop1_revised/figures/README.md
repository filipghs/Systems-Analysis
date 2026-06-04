# figures/

This folder holds the figures and tables reused from the original Workshop 1 submission. Place the following files here and update the corresponding `\fbox` placeholders in `CSAS_Workshop1_v2.tex` with `\includegraphics` calls.

| File expected here | Source in v1 PDF | Used in v2 as |
|---|---|---|
| `fig_context.pdf` | Fig. 1 (system context diagram) | Fig. 1 |
| `fig_architecture.pdf` | Fig. 2 (architecture node graph) | Fig. 2 |
| `tbl_survey.pdf` | Table III (raw survey data, n=20) | Table III |
| `tbl_observation.pdf` | Table IV (observation record, 8 sessions) | Table IV |
| `fig_pie.pdf` | Fig. 3 (pie chart, 35%) | Fig. 3 |

## How to wire them in

For each placeholder block in the `.tex` of the form

```latex
\fbox{\parbox{0.92\columnwidth}{\centering\vspace{2pt}
\textit{Fig.~1 from the original submission ... Source file:
\texttt{fig\_context.pdf}.}\vspace{2pt}}}
```

replace it with

```latex
\includegraphics[width=0.95\columnwidth]{figures/fig_context.pdf}
```

The same applies to the other four placeholders.

## Note on Figs. 4–7 of v2

Figures 4 (stakeholder interaction), 5 (Ishikawa), 6 (information flow), and 7 (causal loop diagram) are **drawn directly in TikZ** inside `CSAS_Workshop1_v2.tex`. They do not require any external file in this folder.
