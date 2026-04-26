# Resource Management Plan

This plan documents the resources required to complete Workshop No. 3 and how the team monitors and reallocates them during the 12-working-day cycle.

---

## Resource Inventory

| Resource type | Description | Quantity | Owner |
| --- | --- | --- | --- |
| Human | Project team members | 4 | All |
| Software | LaTeX (Overleaf or local TeX Live) | 1 license each | Team |
| Software | Microsoft Word | As needed | Team |
| Software | draw.io / Lucidchart | Free tier | Team |
| Software | GitHub | Free educational tier | Team |
| Software | Google Workspace (Meet, Drive) | Institutional license | Team |
| Software | Microsoft Excel | As needed | Team |
| Communication | WhatsApp | Free | Team |
| Time | 12 working days | — | Project Manager |

---

## Effort Allocation

The total effort budget is approximately **180–200 person-hours** across 12 working days, distributed as follows.

| Phase | Duration (days) | Approx. effort per member (h) | Notes |
| --- | :---: | :---: | --- |
| Planning | 2 | 4 | Mostly PM-led |
| Design | 3 | 12 | Architecture-heavy |
| Analysis | 2 | 10 | Risk-heavy |
| Project planning | 2 | 8 | PM-led |
| Integration | 2 | 8 | All hands |
| Delivery | 1 | 4 | Final review |
| **Total** | **12** | **~46** | per member |

---

## Resource Monitoring

The Project Manager reviews resource utilisation at the **weekly progress review** by checking:

1. Time logged per role against the planned allocation.
2. Number of open vs. completed tasks per section.
3. Schedule slippage on the critical path.

If utilisation deviates by more than **20 %** from the plan, the team triggers a re-planning session in the next sync to either re-allocate effort or adjust scope.

---

## Risk-Adjusted Reserves

| Reserve | Purpose | Allocation |
| --- | --- | --- |
| Schedule reserve | 24 h buffer before final submission | Day 12 morning |
| Effort reserve | Cross-coverage if a member is unavailable | 10 % of total |
| Quality reserve | Time for additional review cycles | Built into integration phase |

---

## Tool Configuration Notes

- **GitHub**: `main` branch is protected. Pull requests require at least one approval from a team member other than the author.
- **LaTeX**: the source `Workshop3_CSAS.tex` is self-contained and compiles with a standard TeX Live installation (`pdflatex` × 2 to resolve cross-references).
- **Excel files**: open with Microsoft Excel, LibreOffice Calc or Google Sheets. All sheets contain formatting and minimal formulas.
- **Communication**: WhatsApp messages older than 7 days are not authoritative; all decisions are mirrored to the GitHub repository.

---

## Out-of-Band Resources

The following resources are NOT required for Workshop 3 but are noted for future workshops:

- Cloud accounts (AWS, Azure) — required only for actual implementation
- API keys for SMS providers, FCM, APNs — required only for actual implementation
- Sandbox PostgreSQL instance — required for Phase 2 onwards
- Pen-testing environment — required before production rollout

These are out of scope for the current workshop and will be procured if and when the project moves into implementation.
