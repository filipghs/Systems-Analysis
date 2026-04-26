# Change Management Procedure

Once CSAS reaches Phase 3 (Full Operation), every change to production goes through this procedure. The procedure follows ITIL change management principles and CMMI Level 3 process discipline.

---

## Change Categories

| Category | Definition | Approval | Lead time |
| --- | --- | --- | --- |
| **Standard** | Pre-approved, low-risk, repeatable (e.g. routine patches, scaling adjustments) | None (template) | Immediate |
| **Normal** | Non-routine; requires CAB review | CAB (3 of 3 votes) | ≥ 3 working days |
| **Emergency** | Required to restore service or fix a critical vulnerability | On-call PM or designate | Expedited |

---

## Change Advisory Board (CAB)

| Role | Member |
| --- | --- |
| Chair | Project Manager |
| Member | Architecture & Quality Lead |
| Member | Risk Management Lead |
| Member (advisory) | Implementation & Evolution Lead |

The CAB meets weekly to review pending normal changes. Meetings are held synchronously (Google Meet) and minutes are archived in the repository.

---

## Standard Procedure (Normal Changes)

### 1. Request

Any team member can request a change by opening an issue using the **Change Request** template. The template captures:

- Description and motivation
- Affected components
- Expected impact (users, KPIs, SLAs)
- Rollback plan
- Test evidence
- Risk assessment

### 2. Impact Analysis

The Architecture & Quality Lead and the Risk Manager conduct an impact analysis covering:

- Architectural impact (does the change affect the standards compliance matrix?)
- Risk impact (does the change require a risk register update?)
- Quality impact (does the change affect any KPI?)

### 3. Approval

The CAB votes during the next weekly meeting. A change is **approved** with a unanimous decision. A change is **rejected** with reasoning that the requester must address before resubmitting.

### 4. Scheduled Deployment

Approved changes are scheduled for deployment in a maintenance window. The deployment plan includes:

- Pre-deployment checks
- Deployment steps (preferably automated)
- Validation steps
- Rollback procedure with explicit triggers

### 5. Post-Deployment Review

Within **5 working days** after deployment, the change owner publishes a brief review covering:

- Did the change achieve its goal?
- Were the expected impacts realised?
- Were any unexpected impacts observed?
- Should the standard procedure be updated based on what was learned?

---

## Emergency Procedure

When a change is required to restore service or fix a critical vulnerability:

1. The on-call engineer raises the incident and proposes the emergency change.
2. The Project Manager (or designate) approves verbally and confirms by a message in the project channel.
3. The change is deployed with the highest priority.
4. A **mandatory retrospective** is conducted within 48 hours, with:
   - Root-cause analysis
   - Validation that the emergency was real
   - Whether the change should be retroactively normalised through the CAB
   - Lessons learned

---

## Rollback Triggers

A change is rolled back when **any** of the following holds during or after deployment:

- A KPI in `quality_assurance/quality_metrics.md` regresses by more than 10 % within 24 hours
- An S1 or S2 defect is introduced
- A security vulnerability is detected that cannot be patched within the deployment window
- Manual judgement of the on-call engineer with concurrence of the Project Manager

Rollback decisions are documented in the change request issue.

---

## Change Logging and Audit

- Every change is recorded as an issue in the repository, regardless of category.
- Standard changes are tagged `change/standard`.
- Normal changes are tagged `change/normal` and require CAB minutes.
- Emergency changes are tagged `change/emergency` and require a retrospective document.

The change log is reviewed during the **annual architecture review** (mandated by `quality_assurance/quality_metrics.md`) to identify trends, recurrent issues and process improvements.

---

## Metrics

The Implementation & Evolution Lead reports the following monthly:

- Number of changes per category
- Change success rate (changes deployed without rollback)
- Mean time between deployments
- Mean time to deploy (request → production)

These metrics feed the continuous-improvement cycle described in Section VII of the Workshop No. 3 PDF.
