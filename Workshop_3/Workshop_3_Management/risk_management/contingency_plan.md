# Contingency Plan

This document defines the response actions for the high-priority failure scenarios identified in `risk_register.xlsx`. For every scenario, three artefacts are specified: the **trigger** that activates the response, the **response action** that is executed, and the **owner** who is accountable for executing it.

---

## Scenario Response Matrix

| Scenario | Linked risks | Trigger | Response action | Owner |
| --- | --- | --- | --- | --- |
| **System overload** | R1 | API gateway request latency > 5 s for ≥ 3 min | Scale services manually; enable traffic shedding for non-critical endpoints; publish status-page update | On-call engineer |
| **Notification failure** | R2 | Delivery success rate < 95 % over 15-min window | Switch routing to surviving channel; replay messages from dead-letter queue; investigate root cause | On-call engineer |
| **Connectivity issue** | R6 | SMS / USSD provider returns failure on ≥ 50 % of attempts | Failover to secondary provider; notify Implementation Lead | On-call engineer |
| **Data breach** | R4 | SIEM detects anomalous access pattern OR external report received | Isolate affected service; rotate credentials; preserve forensic evidence; notify Risk Manager and legal contact within 72 h (Ley 1581) | Risk Manager |
| **Service failure** | R7 | Health check fails on a microservice for ≥ 2 min | Activate backup deployment; reroute via API gateway; conduct post-mortem within 5 working days | On-call engineer |
| **Database failure** | R10 | Replication lag > 60 s or primary unreachable | Promote standby to primary; restore latest backup if needed; reconcile events from message bus | On-call engineer |
| **Verification engine overload** | R1, R3 | Verification queue depth > 1 000 or verification latency > 60 s | Auto-scale verification pods; route high-severity events through bypass lane | On-call engineer |
| **False-report flood** | R3 | False-positive rate > 20 % over 1 hour | Hold suspicious reports for human review; tighten heuristic thresholds; investigate possible coordinated misuse | Risk Manager |
| **Authority response delay** | R8 | Authority SLA breached on ≥ 25 % of high-severity alerts in a week | Escalate via secondary contact protocol; review SLA with the authority partner | Implementation Lead |
| **Adoption regression** | R5, R9 | Active users drop by ≥ 20 % week-over-week | Review recent changes; trigger usability sprint; communicate fix plan to users | Implementation Lead |

---

## Communication During an Incident

Every contingency activation is communicated through:

1. **Internal**: project channel, with severity tag (S1, S2, S3).
2. **Affected users**: in-app notification or status page banner.
3. **External stakeholders**: only when the incident affects them (e.g. authorities, providers).

The on-call engineer is responsible for sending the initial notification within **15 minutes** of the trigger firing. The Project Manager (or designate) is responsible for ongoing updates if the incident lasts more than **1 hour**.

---

## Post-Incident Review

For every contingency activation classified as S1 or S2, a post-incident review is mandatory within **5 working days**. The review document includes:

1. Timeline of events
2. Root-cause analysis
3. What worked well
4. What did not work
5. Action items with owners and due dates
6. Whether the contingency procedure itself should be updated

Post-incident reviews are archived in the repository under `risk_management/incidents/` (folder created during deployment, not part of this workshop).

---

## Drill Schedule

To prevent contingency procedures from becoming dead documents, drills are scheduled regularly:

| Drill | Frequency | Owner |
| --- | --- | --- |
| Database failover | Quarterly | Implementation Lead |
| SMS provider failover | Quarterly | Implementation Lead |
| Backup restore | Monthly | Implementation Lead |
| Tabletop exercise (data breach) | Annual | Risk Manager |
| Tabletop exercise (overload) | Annual | Risk Manager |

Drill results are reported to the team and archived alongside the change log.

---

## Linkage to the Risk Register

This document is the operational counterpart of `risk_register.xlsx`. Every scenario in this plan corresponds to one or more risks in the register. When a new risk is added to the register at severity High or Critical, this document **must** be updated within the same change request to add a corresponding scenario.
