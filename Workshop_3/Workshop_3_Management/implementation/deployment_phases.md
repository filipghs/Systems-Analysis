# Phased Deployment Strategy

CSAS deployment is organised in three phases with **explicit exit gates**. A phase is exited only when its acceptance criteria are met for the required observation window.

```
Phase 1 ──► Phase 2 ──► Phase 3
 Pilot     Controlled    Full ops
 (4 wk)     (8 wk)       (continuous)
```

---

## Phase 1 — Pilot (4 weeks)

**Goal**: validate the design under real conditions with a controlled blast radius.

| Aspect | Specification |
| --- | --- |
| Scope | A single faculty building |
| User population | ~200 closed-group users |
| Channels | Mobile app + SMS fallback |
| Observability | Full stack: metrics, logs, traces |

### Exit criteria

To exit Phase 1, **all** of the following must hold for **two consecutive weeks**:

- All KPIs in `quality_assurance/quality_metrics.md` met
- Zero S1 or S2 defects open
- UAT sign-off from at least one student representative and one security-staff representative
- No security incident attributable to the system

If exit criteria are not met after **6 weeks**, the team triggers a re-design review rather than extending Phase 1 indefinitely.

---

## Phase 2 — Controlled Rollout (8 weeks)

**Goal**: extend coverage to the full campus while maintaining safety controls.

| Aspect | Specification |
| --- | --- |
| Scope | Full campus, all faculties |
| User population | Open registration |
| Channels | All (mobile, web portal, SMS, USSD) |
| Feature flags | Enabled for gradual exposure of high-risk features |

### Exit criteria

- User adoption rate ≥ 30 % of the target population
- Notification delivery success ≥ 99.5 % in real conditions
- Authority response SLA met for at least 90 % of high-severity alerts
- All Phase 1 exit criteria continue to hold

---

## Phase 3 — Full Operation (continuous)

**Goal**: declare the system production-grade and operate under the change management procedure.

| Aspect | Specification |
| --- | --- |
| Scope | Full campus, all features |
| Operational mode | Steady-state with continuous improvement |
| Governance | Change advisory board (CAB) controls all changes |

### Operating commitments

- Quality KPIs remain at the targets defined in `quality_assurance/quality_metrics.md`
- Quarterly risk re-assessment cycle (Risk Manager owns)
- Annual architecture review aligned with ISO 9001 management-review requirements

A regression below KPI targets that lasts more than two weeks triggers a formal **incident review** with a root-cause analysis report and corrective actions.

---

## Rollback Strategy

Each phase has a documented rollback procedure:

- **Phase 1 → 0** (decommission): pilot group is informed; data is exported and retained per the data-retention policy; system is taken down.
- **Phase 2 → 1**: feature flags are turned off; new registrations are paused; system reverts to pilot scope.
- **Phase 3 → 2**: subset of features (typically the most recent ones) is disabled via feature flags; user communication is published; system continues to operate in a reduced mode while the issue is resolved.

Rollback decisions are taken by the **Project Manager** in consultation with the Architecture & Quality Lead and the Risk Manager.

---

## Communication During Deployment

| Event | Audience | Channel | Owner |
| --- | --- | --- | --- |
| Phase 1 start | Pilot users | App banner + on-site signage | Implementation Lead |
| Phase 1 → 2 transition | Full campus | Email, app notification | Implementation Lead |
| Phase 2 → 3 transition | Full campus + authorities | Email, press release on university site | Project Manager |
| Any incident | All affected users | App notification, status page | On-call engineer |

---

## Readiness Checklist (Phase 1 entry)

- [ ] Architecture sign-off by the Architecture & Quality Lead
- [ ] Risk register reviewed and accepted by the Risk Manager (no open critical risks)
- [ ] Security scan clean
- [ ] Load test passed at 300 % projected traffic
- [ ] Backup / restore drill executed within the past 30 days
- [ ] UAT scenarios green for the pilot user group
- [ ] On-call rotation defined and documented
- [ ] Status page operational
- [ ] Rollback procedure rehearsed
