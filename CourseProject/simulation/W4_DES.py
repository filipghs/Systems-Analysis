"""
CSAS — Workshop 4: Discrete Event Simulation (DES)
Community Security Alert System
Universidad Distrital Francisco José de Caldas — 2026-I

Authors:
  Felipe Jose Garzon Herrera    (20251020132)
  Juan Esteban Quintero Gordillo (20251020137)
  Henry Samuel Garrido Medina   (20251020125)
  Gabriel Mateo Cusba Marin     (20251020128)

Description:
  Process-oriented DES using SimPy.
  Models the end-to-end CSAS pipeline:
    User → Incident Service → Verification Service → Dispatcher Service → Analytics

Usage:
  pip install simpy
  python W4_DES.py
"""

import simpy
import random
import csv
import statistics
from dataclasses import dataclass, field
from typing import List

# ─── Configuration ────────────────────────────────────────────────────────────
RANDOM_SEED      = 42
SIM_TIME         = 200          # seconds
NUM_USERS        = 11
INCIDENT_INTERVAL_MIN = 20      # seconds between incidents (uniform range)
INCIDENT_INTERVAL_MAX = 30
VERIF_TIME_MIN   = 1.0          # AI verification time (uniform range)
VERIF_TIME_MAX   = 2.0
DISPATCH_TIME_MIN = 1.0
DISPATCH_TIME_MAX = 5.0
FAILURE_PROB     = 0.02         # 2% dispatcher failure probability
AI_THRESHOLD     = 0.75         # confidence >= 0.75 to auto-verify
MIN_CONFIRMATIONS = 2           # NFR-08: minimum community confirmations
LATENCY_TARGET   = 30.0         # NFR-01 target in seconds

@dataclass
class Incident:
    id: int
    submit_time: float
    zone: str
    incident_type: str
    severity: str
    confidence: float = 0.0
    confirmations: int = 0
    verified: bool = False
    dispatched: bool = False
    failed: bool = False
    end_time: float = 0.0

    @property
    def latency(self):
        return self.end_time - self.submit_time if self.end_time > 0 else None

@dataclass
class SimMetrics:
    incidents: List[Incident] = field(default_factory=list)

    @property
    def processed(self):
        return len([i for i in self.incidents if i.end_time > 0])

    @property
    def verified_count(self):
        return len([i for i in self.incidents if i.verified])

    @property
    def failed_count(self):
        return len([i for i in self.incidents if i.failed])

    @property
    def latencies(self):
        return [i.latency for i in self.incidents if i.latency is not None]

    @property
    def avg_latency(self):
        lats = self.latencies
        return statistics.mean(lats) if lats else 0.0

    @property
    def pct_under_target(self):
        lats = self.latencies
        if not lats:
            return 0.0
        return len([l for l in lats if l <= LATENCY_TARGET]) / len(lats) * 100

# ─── CSAS Simulation Model ────────────────────────────────────────────────────
class CSASSimulation:
    def __init__(self, env: simpy.Environment, seed: int = RANDOM_SEED):
        self.env = env
        self.rng = random.Random(seed)
        self.metrics = SimMetrics()
        self.incident_counter = 0
        self.verif_resource = simpy.Resource(env, capacity=3)
        self.dispatch_resource = simpy.Resource(env, capacity=5)

        ZONES = ["parking_lot", "library", "main_entrance", "dormitory", "cafeteria", "sports"]
        TYPES = ["Theft", "Harassment", "Suspicious Activity", "Vandalism", "Medical", "Assault"]
        SEVERITIES = {"Theft": "high", "Harassment": "medium", "Suspicious Activity": "medium",
                      "Vandalism": "medium", "Medical": "critical", "Assault": "critical"}

        self.zones = ZONES
        self.types = TYPES
        self.severities = SEVERITIES

    def incident_source(self):
        """Generate incidents from NUM_USERS users over SIM_TIME."""
        for _ in range(NUM_USERS):
            self.env.process(self.user_process())
            yield self.env.timeout(self.rng.uniform(1, 5))

    def user_process(self):
        """Each user generates incidents at random intervals."""
        while True:
            interval = self.rng.uniform(INCIDENT_INTERVAL_MIN, INCIDENT_INTERVAL_MAX)
            yield self.env.timeout(interval)
            if self.env.now > SIM_TIME:
                break
            self.incident_counter += 1
            inc_type = self.rng.choice(self.types)
            inc = Incident(
                id=self.incident_counter,
                submit_time=self.env.now,
                zone=self.rng.choice(self.zones),
                incident_type=inc_type,
                severity=self.severities.get(inc_type, "low"),
            )
            self.metrics.incidents.append(inc)
            self.env.process(self.incident_pipeline(inc))

    def incident_pipeline(self, inc: Incident):
        """Full pipeline: Incident Svc → Verification Svc → Dispatcher."""
        # ── Incident Service (FR-01, FR-06) ──────────────────────────────────
        yield self.env.timeout(0.1)   # GPS capture + store

        # ── Priority bypass for critical incidents (FR-08) ───────────────────
        if inc.severity == "critical":
            inc.verified = True
            inc.confidence = 1.0
            inc.confirmations = MIN_CONFIRMATIONS
        else:
            # ── Verification Service (FR-03, NFR-08) ─────────────────────────
            with self.verif_resource.request() as req:
                yield req
                verif_time = self.rng.uniform(VERIF_TIME_MIN, VERIF_TIME_MAX)
                yield self.env.timeout(verif_time)
                inc.confidence = self.rng.uniform(0.25, 1.0)
                inc.confirmations = self.rng.randint(0, 4)

                verified_by_ai = inc.confidence >= AI_THRESHOLD
                verified_by_community = inc.confirmations >= MIN_CONFIRMATIONS
                inc.verified = verified_by_ai or verified_by_community

        if not inc.verified:
            inc.end_time = self.env.now
            return

        # ── Dispatcher Service (FR-02, FR-08) ────────────────────────────────
        with self.dispatch_resource.request() as req:
            yield req
            dispatch_time = self.rng.uniform(DISPATCH_TIME_MIN, DISPATCH_TIME_MAX)
            yield self.env.timeout(dispatch_time)

            if self.rng.random() < FAILURE_PROB:
                inc.failed = True
                # SMS fallback (NFR-02)
                yield self.env.timeout(2.0)

            inc.dispatched = True
            inc.end_time = self.env.now

    def run(self):
        self.env.process(self.incident_source())
        self.env.run(until=SIM_TIME)
        return self.metrics


def run_single(seed: int = RANDOM_SEED, verbose: bool = True) -> SimMetrics:
    env = simpy.Environment()
    sim = CSASSimulation(env, seed=seed)
    metrics = sim.run()

    if verbose:
        print(f"\n{'='*55}")
        print(f"  CSAS DES Results — Seed {seed}")
        print(f"{'='*55}")
        print(f"  Incidents processed : {metrics.processed}")
        print(f"  Verified alerts     : {metrics.verified_count}")
        print(f"  Failed deliveries   : {metrics.failed_count}")
        print(f"  Avg latency         : {metrics.avg_latency:.2f} s")
        print(f"  % under {LATENCY_TARGET}s (NFR-01): {metrics.pct_under_target:.1f}%")
        print(f"{'='*55}")

    return metrics


def run_30_independent(output_csv: str = "des_30_runs.csv", verbose: bool = True):
    """Run 30 independent simulations with seeds 42–71 and compute 95% CI."""
    import math

    all_latencies = []
    all_pcts = []
    all_verified = []
    all_failed = []

    rows = []
    for run_id in range(30):
        seed = RANDOM_SEED + run_id
        metrics = run_single(seed=seed, verbose=False)
        all_latencies.append(metrics.avg_latency)
        all_pcts.append(metrics.pct_under_target)
        all_verified.append(metrics.verified_count)
        all_failed.append(metrics.failed_count)
        rows.append({
            "run": run_id + 1, "seed": seed,
            "avg_latency_s": round(metrics.avg_latency, 4),
            "pct_under_30s": round(metrics.pct_under_target, 2),
            "verified": metrics.verified_count,
            "failed": metrics.failed_count,
        })

    # Student t CI (t_29, 0.025 = 2.045)
    t = 2.045
    n = 30

    def ci(data):
        m = statistics.mean(data)
        s = statistics.stdev(data)
        margin = t * s / math.sqrt(n)
        return m, m - margin, m + margin

    lat_mean, lat_lo, lat_hi = ci(all_latencies)
    pct_mean, pct_lo, pct_hi = ci(all_pcts)

    with open(output_csv, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    if verbose:
        print(f"\n{'='*55}")
        print(f"  CSAS DES — 30 Runs Statistical Summary")
        print(f"{'='*55}")
        print(f"  Avg latency  : {lat_mean:.2f}s  [95% CI: {lat_lo:.2f}s – {lat_hi:.2f}s]")
        print(f"  % under 30s  : {pct_mean:.1f}%  [95% CI: {pct_lo:.1f}% – {pct_hi:.1f}%]")
        print(f"  Avg verified : {statistics.mean(all_verified):.1f}")
        print(f"  Avg failed   : {statistics.mean(all_failed):.2f}")
        print(f"\n  Results saved to: {output_csv}")
        print(f"{'='*55}")


if __name__ == "__main__":
    print("Running single simulation (baseline)...")
    run_single(seed=RANDOM_SEED, verbose=True)

    print("\nRunning 30 independent simulations...")
    run_30_independent(output_csv="des_30_runs.csv", verbose=True)
