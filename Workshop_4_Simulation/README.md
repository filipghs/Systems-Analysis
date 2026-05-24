# Workshop No. 4 — System Simulation and Validation

**Project:** Community Security Alert System (CSAS)
**Course:** Systems Analysis & Design — Semester 2026-I
**Institution:** Universidad Distrital Francisco José de Caldas
**Instructor:** Eng. Carlos Andrés Sierra, M.Sc.

---

## Team

| Name | Student Code |
|------|-------------|
| Felipe Jose Garzon Herrera | 20251020132 |
| Juan Esteban Quintero Gordillo | 20251020137 |
| Henry Samuel Garrido Medina | 20251020125 |
| Gabriel Mateo Cusba Marin | 20251020128 |

---

## Workshop Overview

This workshop validates the CSAS design through **computational simulation** using two
complementary approaches:

1. **Discrete Event Simulation (DES)** — models the asynchronous event pipeline
   (incident → verification → dispatch) using the SimPy library.
2. **Behavioral Simulation** — models feedback loops and adoption dynamics using a
   hybrid deterministic-stochastic model.

Three operational scenarios are evaluated across 30 independent executions each:
Baseline, Optimization, and Failure Mode.

---

## Key Results

| Scenario | Avg Latency | 95% CI | Adoption | Alert Success |
|----------|-------------|--------|----------|---------------|
| Baseline | 40.87 s | [38.85, 42.89] | 21.39 % | 74.10 % |
| Optimization | 17.94 s | [16.92, 18.96] | 67.62 % | 96.84 % |
| Failure Mode | 71.66 s | [67.72, 75.59] | 31.34 % | 50.71 % |

**Central finding:** The verification threshold (`θ`) is the critical control variable.
`θ = 3` stabilizes the system in the optimized attractor, satisfying NFR-01 (< 30 s),
NFR-02 (≥ 99.9 % delivery), and the adoption KPI (≥ 60 %).

---

## Folder Structure

```
Workshop_4_Simulation/
├── README.md                         ← This file
│
├── docs/
│   └── Workshop4_CSAS.pdf            ← Integrated report (5 pages, IEEE format)
│
├── simulation/
│   ├── W4_DES.py                     ← Discrete Event Simulation (SimPy)
│   ├── W4_behavioral.py              ← Behavioral Simulation (feedback loops)
│   └── requirements.txt              ← Python dependencies
│
├── results/
│   ├── figures/
│   │   ├── latency_by_scenario.png   ← Fig 1: Average latency with CI bars
│   │   ├── adoption_evolution.png    ← Fig 2: Community adoption over time
│   │   ├── fatigue_behavior.png      ← Fig 3: Alert fatigue dynamics
│   │   └── scenario_comparison.png  ← Fig 4: Adoption vs alert success
│   ├── confidence_intervals.csv      ← Statistical summary per scenario
│   ├── sensitivity_analysis.csv      ← Threshold sweep (θ = 1..4)
│   └── baseline_log.csv              ← Step-by-step baseline trace
│
├── risk_management/
│   └── risk_analysis_W4.md           ← Risk-experiment mapping + recommendations
│
└── validation/
    └── statistical_validation.md     ← CI methodology + reproducibility guide
```

---

## How to Run the Simulations

### 1. Install dependencies

```bash
cd simulation/
pip install -r requirements.txt
```

### 2. Run the Discrete Event Simulation (DES)

```bash
python W4_DES.py
```

Prints a step-by-step incident log and a final results summary.

### 3. Run the Behavioral Simulation

```bash
python W4_behavioral.py
```

Runs 30 independent executions per scenario, prints a statistical summary, and exports
results to `results/`.

---

## Design Decisions Validated

| Decision (Workshop 2) | Experiment | Validated? |
|-----------------------|------------|-----------|
| RabbitMQ + Kubernetes auto-scaling | EXP-01 | ✅ Latency < 30 s at 300% load |
| Automated Verification Engine | EXP-02 | ✅ End-to-end < 60 s (staff_eff = 0.9) |
| ≤ 3-interaction mobile flow (NFR-06) | EXP-03 | ✅ Adoption > 60% achievable |
| SMS / USSD fallback | EXP-01 | ✅ Covers connectivity failures |
| Verification threshold ≥ 3 | EXP-02 | ✅ Eliminates false-positive cascade |

**Challenged assumption:** Initial adoption of 12% (Workshop 1) is below the critical
mass threshold of 30–35% required for organic growth. A structured onboarding campaign
is required before Phase 1 exit.

---

## Cross-References

- [Workshop 1](../Workshop_1/) — Empirical analysis, W1 data used to calibrate parameters
- [Workshop 2](../Workshop_2/) — Architecture validated by EXP-01/02/03
- [Workshop 3](../Workshop_3_Management/) — Risk register extended in `risk_management/risk_analysis_W4.md`

---

## Standards Applied

- ISO/IEC 25010 — Quality attributes (NFR-01/02/03/05/06/07)
- ISO 31000 — Risk management (risk-experiment mapping)
- PMBOK 7th ed. — Project continuity from Workshop 3
- Ley 1581 de 2012 — Data privacy (all simulation data is synthetic)
