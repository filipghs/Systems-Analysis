# Workshop 4 — Simulation Scripts

## Files

| File | Description |
|------|-------------|
| `W4_DES.py` | Discrete Event Simulation (SimPy) — models the technical pipeline |
| `W4_behavioral.py` | Behavioral simulation (System Dynamics) — models adoption/fatigue feedback loops |

## Requirements

```bash
pip install simpy
```

## Running

```bash
# Single DES run
python W4_DES.py

# Full 30-run statistical study
python W4_DES.py          # produces des_30_runs.csv
python W4_behavioral.py   # produces behavioral_*.csv per scenario
```

## Key Results (Workshop 4)

| Scenario | Avg Latency | CI 95% | Adoption |
|----------|-------------|--------|----------|
| Baseline | 40.87 s | ±1.02 s | 21.39% |
| Optimization | 17.94 s | ±1.02 s | 67.62% |
| Failure Mode | 71.66 s | ±3.94 s | 31.34% |

## Bifurcation Point

- `θ ≥ 3` → Reinforcing loop (R+) dominates → stable system → adoption > 60%
- `θ = 1` → Balancing loop (B-) dominates → alert fatigue → irreversible collapse

## Parameters

| Parameter | Value | NFR |
|-----------|-------|-----|
| Sim time | 200 s | — |
| Users | 11 | — |
| AI threshold | 0.75 | NFR-08 |
| Latency target | < 30 s | NFR-01 |
| Failure prob | 2% | NFR-02 |
| Geofence | 500 m | FR-02 |
| Seed | 42 | — |
