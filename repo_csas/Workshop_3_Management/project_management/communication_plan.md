# Communication and Control Plan

This plan defines how the team communicates, makes decisions and tracks progress during the 12-day Workshop No. 3 cycle.

---

## Communication Channels

| Channel | Use case | Cadence | Owner |
| --- | --- | --- | --- |
| WhatsApp group | Asynchronous coordination, quick questions, daily status | Continuous | All |
| Google Meet | Synchronous reviews, decision-making, problem-solving | 2 ×/week | Project Manager |
| GitHub | Source-of-truth for documents, issues, pull requests | Continuous | Implementation Lead |
| Email | Formal communication with the course instructor | As needed | Project Manager |

---

## Meeting Cadence

### Weekly progress review (Mondays, 30 min)

- Status per role (PM, Architecture Lead, Risk Manager, Implementation Lead)
- Pending items and blockers
- Schedule re-baseline if any milestone is at risk

### Mid-week sync (Thursdays, 20 min)

- Validation of partial deliverables
- Integration check
- Risk register review

Agendas are posted to WhatsApp at least **24 h in advance**. Minutes are recorded by the PM in a shared document.

---

## Decision-Making Protocol

1. Decisions inside a single role: owner decides and informs the team.
2. Cross-role decisions: discussed in the next sync; if urgent, asynchronous vote in WhatsApp with a 4-hour quorum window.
3. Strategic decisions affecting scope or schedule: require unanimous team approval and PM sign-off.
4. Disputes: escalated to the course instructor as a last resort.

---

## Status Reporting

| Item | Frequency | Format | Audience |
| --- | --- | --- | --- |
| Section completeness | Daily | WhatsApp message | Team |
| Risk register changes | On change | GitHub commit message | Team |
| Schedule update | Weekly | Updated `timeline_gantt.xlsx` | Team + instructor (on request) |
| Final integration check | 24 h before submission | PR review on GitHub | Team |

---

## Stakeholder Communication

| Stakeholder | What we communicate | When | Channel |
| --- | --- | --- | --- |
| Course instructor | Submission link, repo URL | At submission | Email + course platform |
| Course instructor | Questions on requirements | As needed | Email |
| Team members | All operational matters | Continuous | WhatsApp / GitHub |

---

## Control Mechanisms

- **Definition of Done**: every section is reviewed by at least one team member other than the author before it is integrated into the final PDF.
- **Single source of truth**: the `main` branch of the repository. No section is considered "delivered" until it is merged to `main`.
- **Version control**: all changes to documents go through pull requests. Direct commits to `main` are not allowed.
- **Final review**: a 24-hour buffer is reserved before the submission deadline for end-to-end review and any final corrections.

---

## Escalation Path

1. Issue raised in WhatsApp.
2. If not addressed within 24 h, ping the relevant role owner directly.
3. If still open after 48 h, the Project Manager intervenes.
4. If the issue threatens the submission deadline, the course instructor is informed.
