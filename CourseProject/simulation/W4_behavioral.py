"""
CSAS — Workshop 4: Behavioral Simulation (System Dynamics)
Community Security Alert System
Universidad Distrital Francisco José de Caldas — 2026-I

Authors:
  Felipe Jose Garzon Herrera    (20251020132)
  Juan Esteban Quintero Gordillo (20251020137)
  Henry Samuel Garrido Medina   (20251020125)
  Gabriel Mateo Cusba Marin     (20251020128)

Description:
  Behavioral simulation modeling community adoption dynamics.
  Implements two feedback loops from Meadows (2008):

    R+ (Reinforcing): Verified alert → trust↑ → vigilance↑ → reports↑
    B- (Balancing):   False alerts → fatigue↑ → adoption↓ → collapse

  The verification threshold θ determines which loop dominates.
  θ ≥ 3 → R+ stable system
  θ = 1 → B- collapse

Operational window: 15:00 – 02:00 (12 steps of 1 hour each)
Population: 200 pilot users

Usage:
  python W4_behavioral.py
"""

import random
import statistics
import csv
import math
from dataclasses import dataclass, field
from typing import List

# ─── Parameters ───────────────────────────────────────────────────────────────
RANDOM_SEED    = 42
N_STEPS        = 12            # 15:00 – 02:00
POPULATION     = 200
GEOFENCE_M     = 500           # meters
FATIGUE_THRESHOLD = 0.60       # alert fatigue collapse threshold
ADOPTION_DROP_RATE = 0.04      # adoption drops 4%/step when fatigue > 60%
MIN_VIABLE_ADOPTION = 0.30     # 30% adoption threshold for R+ activation

# Environmental multipliers by hour (15h = index 0, 02h = index 11)
HOUR_MULTIPLIERS = [1.0, 1.1, 1.3, 1.5, 1.8, 2.0, 2.2, 1.9, 1.6, 1.3, 1.0, 0.8]
HOURS            = ["15:00","16:00","17:00","18:00","19:00","20:00",
                     "21:00","22:00","23:00","00:00","01:00","02:00"]

@dataclass
class BehavioralState:
    step: int
    hour: str
    adoption_rate: float
    alert_fatigue: float
    trust: float
    vigilance: float
    reports_generated: int
    verified_alerts: int
    false_positives: int
    r_plus_active: bool
    b_minus_active: bool


@dataclass
class BehavioralScenario:
    name: str
    theta: int               # verification threshold
    staff_efficiency: float  # 0.0 – 1.0
    dispatcher_failure: float  # failure probability
    initial_adoption: float

    def run(self, seed: int = RANDOM_SEED) -> List[BehavioralState]:
        rng = random.Random(seed)
        states = []

        adoption  = self.initial_adoption
        fatigue   = 0.05
        trust     = 0.5 if self.initial_adoption > 0.20 else 0.3
        vigilance = adoption * 0.8

        for step in range(N_STEPS):
            mult = HOUR_MULTIPLIERS[step]

            # ── Report generation ──────────────────────────────────────────
            active_users = int(POPULATION * adoption)
            base_reports = max(1, int(active_users * vigilance * mult * rng.uniform(0.8, 1.2)))

            # ── Verification pipeline ──────────────────────────────────────
            confidence_scores = [rng.uniform(0.25, 1.0) for _ in range(base_reports)]
            confirmations_list = [rng.randint(0, 4) for _ in range(base_reports)]

            verified = sum(
                1 for c, conf in zip(confirmations_list, confidence_scores)
                if (conf >= 0.75) and (c >= self.theta or rng.random() < 0.1)
            )
            false_pos = base_reports - verified

            # ── Dispatch ───────────────────────────────────────────────────
            dispatched = int(verified * (1 - self.dispatcher_failure))

            # ── Latency estimate (simplified) ─────────────────────────────
            efficiency = self.staff_efficiency
            latency = (base_reports * 15) / max(efficiency, 0.01)

            # ── Feedback loops (Meadows, 2008) ────────────────────────────
            false_alarm_rate = false_pos / max(base_reports, 1)
            fatigue_delta = false_alarm_rate * 0.15 * mult - 0.02
            fatigue = min(1.0, max(0.0, fatigue + fatigue_delta))

            trust_delta = (dispatched / max(base_reports, 1) - 0.5) * 0.1
            trust = min(1.0, max(0.0, trust + trust_delta))

            # R+ loop: trust ↑ → vigilance ↑
            vigilance_delta = trust * 0.05 - 0.02
            vigilance = min(1.0, max(0.0, vigilance + vigilance_delta))

            # B- loop: fatigue > 60% → adoption drop
            r_plus = adoption >= MIN_VIABLE_ADOPTION and fatigue < FATIGUE_THRESHOLD
            b_minus = fatigue >= FATIGUE_THRESHOLD

            if b_minus:
                adoption = max(0.05, adoption - ADOPTION_DROP_RATE)
            elif r_plus:
                adoption = min(1.0, adoption + trust * 0.03)

            states.append(BehavioralState(
                step=step, hour=HOURS[step],
                adoption_rate=round(adoption, 4),
                alert_fatigue=round(fatigue, 4),
                trust=round(trust, 4),
                vigilance=round(vigilance, 4),
                reports_generated=base_reports,
                verified_alerts=verified,
                false_positives=false_pos,
                r_plus_active=r_plus,
                b_minus_active=b_minus,
            ))

        return states


SCENARIOS = {
    "Baseline": BehavioralScenario(
        name="Baseline", theta=1, staff_efficiency=0.50,
        dispatcher_failure=0.02, initial_adoption=0.12
    ),
    "Optimization": BehavioralScenario(
        name="Optimization", theta=3, staff_efficiency=0.90,
        dispatcher_failure=0.02, initial_adoption=0.12
    ),
    "Failure Mode": BehavioralScenario(
        name="Failure Mode", theta=1, staff_efficiency=0.40,
        dispatcher_failure=0.20, initial_adoption=0.12
    ),
}


def run_30_independent(scenario_name: str, output_csv: str = None):
    """Run 30 independent replications for a scenario, return CI summary."""
    scenario = SCENARIOS[scenario_name]
    final_adoptions = []
    final_fatigues  = []

    rows = []
    for run_id in range(30):
        seed = RANDOM_SEED + run_id
        states = scenario.run(seed=seed)
        final = states[-1]
        final_adoptions.append(final.adoption_rate)
        final_fatigues.append(final.alert_fatigue)
        rows.append({
            "run": run_id + 1, "seed": seed, "scenario": scenario_name,
            "final_adoption": round(final.adoption_rate * 100, 2),
            "final_fatigue": round(final.alert_fatigue * 100, 2),
            "final_trust": round(final.trust * 100, 2),
        })

    t, n = 2.045, 30

    def ci(data):
        m = statistics.mean(data)
        s = statistics.stdev(data)
        margin = t * s / math.sqrt(n)
        return m * 100, (m - margin) * 100, (m + margin) * 100

    adp_mean, adp_lo, adp_hi = ci(final_adoptions)
    fat_mean, fat_lo, fat_hi = ci(final_fatigues)

    if output_csv:
        with open(output_csv, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)

    return {
        "scenario": scenario_name,
        "adoption_mean": adp_mean, "adoption_ci_lo": adp_lo, "adoption_ci_hi": adp_hi,
        "fatigue_mean": fat_mean, "fatigue_ci_lo": fat_lo, "fatigue_ci_hi": fat_hi,
    }


def print_scenario_trace(scenario_name: str, seed: int = RANDOM_SEED):
    scenario = SCENARIOS[scenario_name]
    states = scenario.run(seed=seed)
    print(f"\n{'='*75}")
    print(f"  Scenario: {scenario_name} | θ={scenario.theta} | eff={scenario.staff_efficiency} | seed={seed}")
    print(f"{'='*75}")
    print(f"  {'Hour':<8} {'Adoption':>9} {'Fatigue':>8} {'Trust':>7} {'Reports':>8} {'Verified':>9} {'R+':>5} {'B-':>5}")
    print(f"  {'-'*70}")
    for s in states:
        r = "✓" if s.r_plus_active else " "
        b = "✓" if s.b_minus_active else " "
        print(f"  {s.hour:<8} {s.adoption_rate*100:>8.1f}% {s.alert_fatigue*100:>7.1f}% "
              f"{s.trust*100:>6.1f}% {s.reports_generated:>8} {s.verified_alerts:>9} {r:>5} {b:>5}")


if __name__ == "__main__":
    # Print trace for each scenario
    for name in SCENARIOS:
        print_scenario_trace(name)

    # Run 30 independent replications per scenario
    print(f"\n\n{'='*60}")
    print("  30-Run Statistical Summary (95% CI, t=2.045)")
    print(f"{'='*60}")
    print(f"  {'Scenario':<16} {'Adoption Mean':>14} {'Adoption CI':>22} {'Fatigue Mean':>13}")
    print(f"  {'-'*68}")
    for name in SCENARIOS:
        res = run_30_independent(name, output_csv=f"behavioral_{name.replace(' ','_')}.csv")
        print(f"  {name:<16} {res['adoption_mean']:>13.2f}%  "
              f"[{res['adoption_ci_lo']:.2f}% – {res['adoption_ci_hi']:.2f}%]  "
              f"{res['fatigue_mean']:>12.2f}%")

    print(f"\n  Bifurcation point: θ ≥ 3 → R+ dominant (stable)")
    print(f"  θ = 1 → B- dominant (collapse below 30% adoption)")
