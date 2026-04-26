# Quality Metrics and Acceptance Criteria

This document defines the seven primary metrics used to evaluate CSAS quality. Each metric is bound to a specific non-functional requirement (NFR) from Workshop 2 and to a quality attribute defined in ISO/IEC 25010.

---

## Metrics Summary

| ID | Metric | Description | Target | NFR | Quality attribute |
| --- | --- | --- | --- | --- | --- |
| QM-01 | Alert latency | End-to-end time from report submission to alert broadcast | < 30 s | NFR-01 | Performance efficiency |
| QM-02 | Delivery success | Notifications delivered to subscribers | ≥ 99.9 % | NFR-02 | Reliability |
| QM-03 | System uptime | Annual availability | ≥ 99.9 % | NFR-03 | Reliability |
| QM-04 | Verification latency | Time to corroborate an incident | < 60 s | — | Performance efficiency |
| QM-05 | Incident reporting rate | Real incidents reported via CSAS | ≥ 85 % | — | Functional suitability |
| QM-06 | User adoption rate | Active users / target population | ≥ 60 % | — | Usability |
| QM-07 | Submission usability | Reports submitted in < 2 minutes | ≥ 85 % | NFR-06 | Usability |

---

## Measurement Method

| Metric | Measurement source | Frequency |
| --- | --- | --- |
| QM-01 | Application traces (Jaeger spans from `incident.created` to `notification.dispatched`) | Continuous |
| QM-02 | Notification provider delivery receipts | Hourly aggregation |
| QM-03 | Synthetic uptime monitor (Prometheus blackbox exporter) | Continuous |
| QM-04 | Application logs (`incident.verified` event timestamp) | Continuous |
| QM-05 | Cross-reference with authority records | Weekly |
| QM-06 | App analytics (DAU / MAU vs. registered population) | Daily |
| QM-07 | App analytics (time-on-task on submission flow) | Daily |

---

## Acceptance Criteria

A change is **accepted** for production deployment when **all** of the following hold:

1. QM-01 ≤ 30 s in the latest load test at 300 % of projected peak traffic.
2. QM-02 ≥ 99.9 % over the past 30 days.
3. QM-03 ≥ 99.9 % over the past 30 days.
4. QM-04 ≤ 60 s in the latest staging integration test.
5. UAT scenarios green for the pilot user group (relevant to QM-05, QM-06, QM-07).

A change is **rejected** if any of the above fails. Rejection generates a defect ticket with:

- Affected metric and observed value
- Suspected root cause
- Owner (one of the four team roles)
- Target date for re-test

---

## Threshold Calibration

Initial thresholds are derived from the headline KPIs declared in Workshop No. 2. They are **re-evaluated** at the end of each phase of the deployment plan:

- **End of Phase 1 (Pilot)**: thresholds may be tightened based on observed best-case behaviour.
- **End of Phase 2 (Controlled)**: thresholds become contractual for Phase 3.
- **Phase 3 (Full ops)**: thresholds change only through the formal change management procedure.

---

## Reporting

The Architecture & Quality Lead publishes a **monthly KPI report** containing:

- Latest value per metric vs. its target
- Trend (last 3 months)
- Open quality defects
- Recommended actions

The report is delivered to the team and archived in the repository under `quality_assurance/reports/` (folder created during deployment, not part of this workshop).
