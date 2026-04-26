# Validation Methods

This document describes the layered validation strategy applied to CSAS during development and deployment. Each layer targets a different defect class and runs at a different cost / latency. The goal is to detect defects at the **earliest** layer where they can be reliably caught.

---

## Validation Layers

```
   Cheaper, faster
        ↑
   Unit / integration tests       ← every commit
   Static analysis                 ← every commit
   Security scans                  ← every PR
   Load / performance tests        ← weekly + before each release
   User acceptance tests (UAT)     ← before each phase exit
        ↓
   More expensive, slower
```

---

## 1. Unit and Integration Testing

| Aspect | Specification |
| --- | --- |
| Scope | Every microservice, every cross-service event chain |
| Tools | Service-native test frameworks |
| Coverage target | ≥ 80 % statement coverage per service (NFR-07) |
| Trigger | Every commit |
| Runtime budget | < 5 min per service |
| Failure policy | Block merge to `main` |

Integration tests use seeded campus zone data and a containerised RabbitMQ instance to reproduce the full event pipeline.

## 2. Static Analysis and Code Review

| Aspect | Specification |
| --- | --- |
| Scope | All source code, all configuration files |
| Tools | Service-native linters, static analysers, dependency scanners |
| Trigger | Every pull request |
| Failure policy | Block merge to `main` until findings resolved or formally waived |

Two human reviewers are required for any change that modifies a security-sensitive component (authentication, encryption, role-based access control).

## 3. Security Testing

| Aspect | Specification |
| --- | --- |
| Scope | Authentication, authorisation, data protection, OWASP API Top 10 |
| Tools | Static and dynamic security scanners; periodic third-party penetration tests |
| Trigger | Pre-release for static; quarterly for penetration tests |
| Compliance | NFR-04, Ley 1581 de 2012 |
| Failure policy | Critical findings block release |

Penetration test reports are archived for regulatory traceability.

## 4. Load and Performance Testing

| Aspect | Specification |
| --- | --- |
| Scope | API gateway, Verification Engine, Dispatcher |
| Tools | Load generation against staging environment |
| Targets | Sustain 300 % of projected peak traffic (NFR-05); 95th percentile latency < 30 s (NFR-01) |
| Trigger | Weekly; mandatory before each release |
| Failure policy | Block release until target met |

Load tests use synthetic traffic patterns derived from Workshop No. 1 observations (zone and time-of-day distribution).

## 5. User Acceptance Testing (UAT)

| Aspect | Specification |
| --- | --- |
| Scope | End-to-end usability of report submission, alert reception, administrator workflows |
| Participants | Pilot group of students and security staff (~20 users) |
| Targets | ≥ 85 % of participants complete a report submission in < 2 minutes (NFR-06) |
| Trigger | Before exit of each deployment phase |
| Failure policy | Block phase exit; iterate on usability issues |

UAT findings are tracked as defect tickets with severity ratings and assigned owners.

## 6. Regression Testing

| Aspect | Specification |
| --- | --- |
| Scope | All previously fixed defects |
| Tools | Test cases archived per defect, integrated into CI/CD |
| Trigger | Every release |
| Failure policy | Block release |

A defect is considered **closed** only when its corresponding regression test is added and passes.

---

## Defect Lifecycle

```
discovered → triaged (severity 1–4) → assigned → in progress → resolved → verified → closed
                                              ↑                              ↓
                                              └──────── reopened ────────────┘
```

Severity definitions:

- **S1 — Critical**: production outage or data loss. Resolve within 4 hours.
- **S2 — High**: major feature broken with no workaround. Resolve within 24 hours.
- **S3 — Medium**: minor feature broken or workaround available. Resolve within one sprint.
- **S4 — Low**: cosmetic or low-impact issue. Resolve when convenient.

---

## Validation Schedule (Workshop 3 Cycle)

For the academic deliverable itself (not the running system), validation focuses on document quality:

1. Section authors run a self-review checklist before requesting integration.
2. Cross-section consistency check by the Project Manager during integration.
3. Final 24-hour review by the full team before submission.
