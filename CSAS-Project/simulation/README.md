# Workshop 4 — System Simulation and Validation

## Overview

This folder contains the simulation models and validation results for the CSAS system, as documented in Workshop No. 4.

## Simulation Approaches

### 1. Process-Oriented Simulation (Discrete-Event)
- Models the end-to-end workflow: incident submission → verification → dispatch
- Parameters calibrated from Workshop 1 empirical data
- Validates NFR-01 (latency < 30s) and NFR-02 (delivery > 99.9%)

### 2. Behavior-Oriented Simulation (Agent-Based)
- Models reinforcing and balancing feedback loops (Meadows, 2008)
- Agents: students, security staff, verification engine
- Validates adoption threshold (20–25%) and alert fatigue dynamics

## Scenarios Tested

| Scenario | Description | NFR Validated | Result |
|----------|-------------|:---:|:---:|
| Baseline | Normal campus operation | NFR-01, NFR-02 | ✅ PASS |
| Surge (300%) | Traffic spike simulation | NFR-05 | ✅ PASS |
| Push Failure | FCM provider outage | NFR-02 | ✅ PASS (SMS fallback) |
| Night Surge | Concentrated night events | NFR-01, NFR-03 | ✅ PASS |
| Low Adoption | Below critical threshold | — | Documented |

## Emergent Behaviors Documented

1. **Spatial clustering cascades** — Multiple simultaneous reports from one zone trigger duplicate alerts
2. **Night-time verification bottleneck** — Reduced moderator availability under incident spikes
3. **Non-linear adoption sensitivity** — +10% users above threshold → +40% report volume

## Key Results

- End-to-end latency: **27.1s avg** (95th percentile: 29.8s) — NFR-01 ✓
- Delivery rate: **99.94%** — NFR-02 ✓
- Adoption threshold activation: **~22%** of campus population
- Alert fatigue onset: **>8 non-critical alerts/user/day**

## Integration with Prototype

The simulation results are integrated into the prototype's **Simulation Console** page, which provides an interactive demonstration of the validation scenarios for stakeholder presentations.
