# Risk Analysis — Workshop 4 Perspective

This document extends the Workshop 3 risk register with experimental evidence from the
Workshop 4 simulations. Each risk is linked to the experiment that validated or
challenged its mitigation strategy.

---

## Risk–Experiment Mapping

| Risk | Level | Experiment | Simulation Result |
|------|-------|------------|-------------------|
| R1 System overload | Critical | EXP-01 | Optimization scenario: latency 17.94 s at 300% load — NFR-01 satisfied |
| R2 Notification failure | High | EXP-01 | Failure probability 2% nominal; SMS fallback keeps delivery ≥ 96.8% |
| R3 False reports | High | EXP-02 | threshold=3 eliminates cascade; false-positive rate drops 78% vs threshold=1 |
| R4 Data breach | High | Structural | TLS 1.3 + AES-256 are architectural invariants — not modelled stochastically |
| R5 Low adoption | High | EXP-03 | Critical mass at 30–35%; below it organic growth is impossible |
| R6 Connectivity issues | High | EXP-01 | failure_prob=20% in Failure Mode: latency 71.66 s — SMS fallback required |
| R7 Integration failure | High | EXP-01 | Circuit breaker prevents cascade; modelled as failure_prob parameter |
| R8 Slow authority response | High | EXP-02 | Automated escalation maintains end-to-end < 60 s (staff_eff=0.9) |
| R9 Poor UX | Medium | EXP-03 | ≤3-interaction flow is minimum to cross adoption threshold |
| R10 Database failure | High | Structural | Primary–standby replication; backup drill not modelled in DES |

---

## Key Finding: Verification Threshold Bifurcation

The behavioral simulation reveals a bifurcation at the verification threshold:

- **threshold = 1** → chaotic attractor: any noisy report cascades into a broadcast,
  trust degrades 15 pp per cycle, fatigue grows linearly, adoption collapses after step 7.
- **threshold ≥ 3** → stable attractor: reinforcing loop dominates, adoption grows
  monotonically, fatigue stays below 30%, system reaches KPI targets.

The saddle point lies near **threshold = 2**, where the system is sensitive to initial
conditions (sensitive dependence on initial adoption level).

---

## Sensitivity Analysis Results

| Threshold | Avg Latency (s) | Avg Adoption (%) | Alert Success (%) |
|-----------|----------------|------------------|-------------------|
| 1 | 40.87 | 21.39 | 74.10 |
| 2 | ~28.00 | ~40.00 | ~85.00 |
| 3 | 17.94 | 67.62 | 96.84 |
| 4 | ~15.00 | ~70.00 | ~97.50 |

Increasing threshold beyond 3 yields diminishing returns while reducing the number
of true positives that reach broadcast.

---

## Recommendations

1. **Deploy with threshold = 3** as the production default.
2. **Monitor fatigue weekly**. If fatigue > 40%, investigate false positive sources
   before it crosses the irreversible 60% threshold.
3. **Run an onboarding campaign** before Phase 1 exit to push adoption past 35%.
4. **Implement runtime threshold tuning** (via feature flag) to allow the Operations
   team to respond to emerging trends without a full redeployment.
