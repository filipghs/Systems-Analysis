# Team Structure and Roles

The team adopts a flat structure of four specialised roles, each owning a section of the deliverable and acting as the accountability point for its quality. The Project Manager coordinates the integration of all sections into the final deliverable.

```
                    Project Manager
                          |
        +-----------------+-----------------+
        |                 |                 |
  Architecture &    Risk Management    Implementation &
  Quality Lead          Lead           Evolution Lead
```

---

## Role Descriptions

### Project Manager (PM)

**Owner:** integration, planning, control
**Main responsibilities**

- Define the schedule, milestones and dependencies (`timeline_gantt.xlsx`)
- Coordinate weekly progress reviews and synchronous meetings
- Integrate all section deliverables into the final PDF
- Maintain the project charter and ensure scope discipline
- Escalate blockers to the course instructor when unresolved within 24 h
- Sign off on the final submission

**Owns**: project charter, schedule, communication plan, integrated PDF

### Architecture & Quality Lead

**Owner:** technical design and quality framework
**Main responsibilities**

- Refine the Workshop 2 architecture under ISO/IEC 25010 quality attributes
- Map every architectural component to a recognised standard (ISO, IEEE, CMMI)
- Define quality metrics, acceptance criteria and validation methods
- Maintain the standards compliance matrix
- Author the architecture and quality assurance sections of the PDF
- Validate that the design satisfies the headline KPIs

**Owns**: architecture diagram, standards matrix, quality metrics, validation plan, release checklist

### Risk Management Lead

**Owner:** risk identification, scoring, mitigation
**Main responsibilities**

- Conduct systematic risk identification across technical, operational, security and project categories
- Score every risk on the probability–impact matrix following ISO 31000
- Define mitigation, contingency and monitoring artefacts for every registered risk
- Maintain the risk register (`risk_register.xlsx`)
- Trigger quarterly risk re-assessment cycles after deployment
- Author the risk management section of the PDF

**Owns**: risk register, heat map, contingency plan

### Implementation & Evolution Lead

**Owner:** deployment readiness and continuous improvement
**Main responsibilities**

- Design the phased deployment strategy (Pilot → Controlled → Full ops)
- Define infrastructure requirements and observability stack
- Establish the change management procedure
- Document evolution from Workshop 1 and Workshop 2 (continuity narrative)
- Manage the GitHub repository: structure, README updates, branch protection
- Author the implementation strategy and evolution sections of the PDF

**Owns**: deployment plan, infrastructure spec, change management procedure, repository hygiene

---

## Responsibility Assignment Matrix (RACI)

Legend: **R** Responsible, **A** Accountable, **C** Consulted, **I** Informed.

| Activity | PM | Arch. Lead | Risk Lead | Impl. Lead |
| --- | :---: | :---: | :---: | :---: |
| Project charter | A/R | C | C | C |
| Architecture refinement | I | A/R | C | C |
| Quality framework | I | A/R | C | I |
| Risk register | I | C | A/R | C |
| Schedule and milestones | A/R | C | C | C |
| Communication plan | A/R | I | I | I |
| Implementation strategy | C | C | C | A/R |
| Evolution summary | C | C | C | A/R |
| Repository management | C | I | I | A/R |
| Document integration | A/R | C | C | C |
| Final submission | A/R | I | I | I |

---

## Escalation Path

1. Blocker identified by any team member.
2. Posted in the project channel within 4 h of detection.
3. If unresolved within 24 h, escalated to the **Project Manager**.
4. If still unresolved within 48 h, escalated to the course instructor.
