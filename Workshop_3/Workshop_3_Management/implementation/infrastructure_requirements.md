# Technical Infrastructure Requirements

This document specifies the infrastructure that must be available before Phase 1 of the deployment plan begins. The specifications are illustrative for the academic deliverable; concrete provider choices will be made during procurement.

---

## Compute

| Aspect | Specification |
| --- | --- |
| Orchestrator | Kubernetes (any conformant distribution: EKS, AKS, GKE or self-managed) |
| Worker nodes | At least 3 nodes |
| Availability zones | At least 2 AZs in the same region |
| Auto-scaling range | 3–12 nodes |
| Node type | General-purpose with at least 4 vCPU / 8 GB RAM |
| Container runtime | Standard OCI-compliant runtime |

### Per-microservice scaling targets

| Service | Min replicas | Max replicas | Auto-scale signal |
| --- | :---: | :---: | --- |
| API Gateway | 2 | 6 | CPU, request rate |
| Incident Service | 2 | 8 | CPU, queue depth |
| Verification Engine | 2 | 10 | Queue depth, CPU |
| Dispatcher | 2 | 8 | Queue depth |
| User Service | 2 | 4 | CPU |
| Analytics Service | 1 | 3 | CPU |

---

## Storage

| Aspect | Specification |
| --- | --- |
| Primary database | PostgreSQL with PostGIS extension |
| Replication | Synchronous primary–standby across AZs |
| Backup | Daily logical backups, 30-day retention |
| Cache | Redis (for session and hot-read caching) |
| Object storage | S3-compatible bucket for media attachments |
| Encryption at rest | AES-256 for all data stores |

### Backup verification

- Restore drills are executed monthly into a sandbox environment.
- A backup is considered valid only after a successful restore test.

---

## Networking

| Aspect | Specification |
| --- | --- |
| Public load balancer | TLS 1.3 termination (NFR-04) |
| Inter-service traffic | Private VPC, no public IPs on backend services |
| Egress filtering | Allow-list of approved external endpoints |
| Rate limiting | At the API gateway, per IP and per authenticated user |

---

## Observability

| Aspect | Tool | Purpose |
| --- | --- | --- |
| Metrics | Prometheus | Collection and storage |
| Dashboards | Grafana | Visualisation, alerting integration |
| Logs | ELK or equivalent | Centralised log aggregation |
| Traces | Jaeger or equivalent | Distributed tracing |
| Synthetic monitoring | Blackbox exporter | Uptime checks (NFR-03) |
| SIEM | Vendor TBD | Anomaly detection for security events |

### Golden signals

The on-call rotation receives alerts on the four golden signals:

1. **Latency** — request and queue processing time
2. **Traffic** — requests per second, messages per second
3. **Errors** — HTTP 5xx, dead-letter queue depth
4. **Saturation** — CPU, memory, queue depth, replication lag

---

## External Integrations

| Integration | Purpose | Redundancy |
| --- | --- | --- |
| SMS providers | Notification fallback (NFR-02) | Two providers, active–active |
| FCM (Firebase Cloud Messaging) | Push notifications, Android | Single provider |
| APNs (Apple Push Notification service) | Push notifications, iOS | Single provider |
| Local police communications unit | High-severity escalation | Formal SLA required |
| SIURE UD (existing university platform) | Bidirectional incident bridge | Single integration |

### Integration testing

Synthetic transactions are executed every 5 minutes against each external integration to detect outages early. Failures trigger automatic failover (where redundant) or page the on-call engineer (where not).

---

## Compliance and Security Controls

- All data stores comply with **Ley 1581 de 2012** (Colombia) personal data protection regime.
- Access to production environments is restricted via SSO and multi-factor authentication.
- All actions on production data are logged in a tamper-resistant audit trail.
- Periodic third-party penetration tests are conducted at least annually.

---

## Capacity Planning

The infrastructure is sized for **3× the projected peak traffic** (NFR-05). Capacity reviews are conducted:

- **Monthly** during Phase 2.
- **Quarterly** during Phase 3.
- **Ad hoc** after any sustained 50 % traffic increase or scaling event.

Capacity changes go through the change management procedure (`change_management.md`).
