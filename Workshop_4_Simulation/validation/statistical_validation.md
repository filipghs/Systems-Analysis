# Statistical Validation

## Methodology

Each scenario was executed **30 independent times** using controlled pseudo-random seeds
(`seed = 42 + i`, `i ∈ [0, 29]`). This sample size satisfies the Central Limit Theorem
and allows the use of Student's t-distribution for confidence interval estimation.

## Confidence Interval Formula

$$\bar{x} \pm t_{29,\,0.025} \cdot \frac{s}{\sqrt{n}}$$

where `t_{29, 0.025} = 2.045` (two-tailed, 95% confidence, 29 degrees of freedom).

## Results

| Scenario | Avg Latency (s) | CI Lower | CI Upper | Avg Adoption (%) | Alert Success (%) |
|----------|----------------|----------|----------|------------------|-------------------|
| Baseline | 40.87 | 38.85 | 42.89 | 21.39 | 74.10 |
| Optimization | 17.94 | 16.92 | 18.96 | 67.62 | 96.84 |
| Failure Mode | 71.66 | 67.72 | 75.59 | 31.34 | 50.71 |

## Interpretation

- **Baseline**: Stable but does not meet NFR-01 (latency > 30 s on average).
  Adoption below critical mass (21.39% < 30%).
- **Optimization**: All NFR targets satisfied. Confidence intervals are narrow
  (±1.02 s), indicating stable behaviour across runs.
- **Failure Mode**: Severe latency increase (71.66 s) and adoption regression.
  Wide confidence interval (±3.94 s) reflects high variance during collapse.

## Sensitivity Analysis

The two most influential variables are:

1. **Verification threshold** — controls whether the reinforcing or balancing loop
   dominates. Increasing from 1 to 3 reduces false-positive propagation by ~78%.
2. **Staff efficiency** — proxy for the automated verification engine. Increasing
   from 50% (baseline) to 90% (optimization) halves average latency.

All other parameters (geofence radius, dispatch time) have second-order effects
that become significant only at extreme values (radius < 200 m or > 1000 m).

## Reproducibility

To reproduce the full statistical analysis:

```bash
cd simulation/
pip install -r requirements.txt
python W4_behavioral.py
```

Output files are written to `results/`:
- `confidence_intervals.csv` — per-scenario statistics
- `sensitivity_analysis.csv` — threshold sweep results
- `baseline_log.csv`         — step-by-step baseline trace
