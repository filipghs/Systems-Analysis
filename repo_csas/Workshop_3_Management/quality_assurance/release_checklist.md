# Release-Time Quality Checklist

Compliance with **all** items below is mandatory before any deployment to production. The checklist is reviewed and signed off by the Architecture & Quality Lead.

---

## Performance and Reliability

- [ ] Alert latency < 30 s in the latest load test (NFR-01)
- [ ] System availability ≥ 99.9 % over the past 30 days (NFR-03)
- [ ] Notification delivery success ≥ 99.9 % over the past 30 days (NFR-02)
- [ ] Auto-scaling validated at 300 % of projected peak traffic (NFR-05)

## Security

- [ ] TLS 1.3 enforced on all public endpoints (NFR-04)
- [ ] AES-256 encryption at rest verified for all sensitive data
- [ ] OWASP API Top 10 scan clean (no critical or high findings)
- [ ] Dependencies scanned for known vulnerabilities; none above severity 7.0 unpatched
- [ ] Audit logging operational and tamper-resistant
- [ ] Authentication and authorisation flows tested with role-based scenarios

## Data Integrity

- [ ] Backup and restore drill executed within the past 30 days
- [ ] Replication lag < 5 s on the standby database
- [ ] No alert broadcast as verified without ≥ 2 community confirmations or 1 administrative approval (NFR-08)

## Quality Assurance

- [ ] All microservices ≥ 80 % unit test coverage
- [ ] Integration tests pass for the full event chain (Incident → Verification → Dispatcher)
- [ ] Regression tests pass for all previously closed defects
- [ ] No open S1 or S2 defects

## Usability

- [ ] UAT scenarios green for the relevant pilot user group
- [ ] ≥ 85 % of UAT participants complete a report submission in < 2 minutes (NFR-06)
- [ ] Spanish localisation reviewed by a native-speaking team member
- [ ] SMS / USSD fallback validated end-to-end

## Documentation

- [ ] Release notes drafted and reviewed
- [ ] User-facing documentation updated (if relevant changes)
- [ ] Operations runbook updated (if relevant changes)
- [ ] Risk register reviewed; any newly identified risks added

## Operations

- [ ] Monitoring dashboards green on all golden signals (latency, traffic, errors, saturation)
- [ ] Alerting rules verified (no flapping or silent failures)
- [ ] On-call rotation confirmed for the release window
- [ ] Rollback plan documented and rehearsed (or rehearsable on demand)

---

## Sign-off

| Role | Name | Signed | Date |
| --- | --- | :---: | :---: |
| Architecture & Quality Lead | _______________ | ☐ | __________ |
| Risk Manager | _______________ | ☐ | __________ |
| Implementation Lead | _______________ | ☐ | __________ |
| Project Manager | _______________ | ☐ | __________ |

The release proceeds only when all four roles have signed off. A release without unanimous sign-off is treated as an emergency change and follows the expedited path defined in `implementation/change_management.md`.
