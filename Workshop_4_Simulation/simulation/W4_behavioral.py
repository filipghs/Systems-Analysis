"""
CSAS Behavioral Simulation — Workshop 4, Persona 2
Community Security Alert System
Universidad Distrital Francisco José de Caldas

Hybrid deterministic-stochastic model capturing:
  - Non-linear feedback loops (reinforcing + balancing)
  - Community adoption dynamics and alert fatigue propagation
  - Environmental multipliers (time-of-day, weather, campus zone)
  - Three operational scenarios: Baseline / Optimization / Failure Mode

INSTALL: python -m pip install -r requirements.txt
RUN:     python W4_behavioral.py
"""

import random

# --- SCENARIO CONFIGURATION ---
SCENARIOS = {
    "baseline":     {"adoption": 0.12, "verification_threshold": 1, "staff_efficiency": 0.4},
    "optimization": {"adoption": 0.65, "verification_threshold": 3, "staff_efficiency": 0.9},
    "failure_mode": {"adoption": 0.70, "verification_threshold": 1, "staff_efficiency": 0.3},
}


def environmental_multipliers(hour, scenario):
    """Calculates risk factors based on hour, weather, and zone."""
    time_mult  = 2.5 if (hour >= 18 or hour <= 4) else 1.0
    zone_mult  = 2.0 if hour >= 18 else 1.0
    zone       = "Parking lot" if hour >= 18 else "Main entrance"
    raining    = (hour in range(19, 23) and scenario == "failure_mode") \
                 or (hour in [20, 21] and random.random() > 0.4)
    weather_mult = 1.8 if raining else 1.0
    weather      = "Rain" if raining else "Clear"
    return time_mult, weather_mult, zone_mult, weather, zone


class CSASSimulation:
    def __init__(self, scenario="baseline"):
        config = SCENARIOS[scenario]
        self.scenario   = scenario
        self.adoption   = config["adoption"]
        self.threshold  = config["verification_threshold"]
        self.efficiency = config["staff_efficiency"]
        self.vigilance       = self.adoption * 0.5
        self.fatigue         = 0.0
        self.trust           = 1.0
        self.total_incidents = 0
        self.total_reports   = 0
        self.total_alerts    = 0
        self.step_count      = 0

    def _clamp(self, value, min_v=0.0, max_v=1.0):
        return max(min_v, min(max_v, value))

    def run_step(self):
        hour = self.step_count % 24
        time_m, weather_m, zone_m, weather, zone = environmental_multipliers(hour, self.scenario)
        incident_prob = 0.05 * time_m * weather_m * zone_m
        real_incident = random.random() < incident_prob
        if real_incident:
            self.total_incidents += 1
        friction       = 0.7 if self.scenario == "baseline" else 0.1
        reporting_prob = self._clamp(
            self.vigilance * (1 - self.fatigue) * self.trust - friction, 0.01, 0.99
        )
        reports = 0
        if real_incident and random.random() < reporting_prob:
            reports = max(1, int(random.randint(1, 5) * self.adoption * 2))
            self.total_reports += reports
        if random.random() < 0.15 * (1 + self.fatigue):
            reports += random.randint(1, 2)
        alert_sent = 0
        if reports >= self.threshold:
            latency = (reports * 15) / self.efficiency
            if latency < 60:
                alert_sent = 1
                self.total_alerts += 1
        if alert_sent:
            if self.scenario == "failure_mode" or self.threshold == 1:
                self.fatigue = self._clamp(self.fatigue + 0.25)
                self.trust   = self._clamp(self.trust   - 0.15, 0.05)
            else:
                self.vigilance = self._clamp(self.vigilance + 0.12)
                self.fatigue   = self._clamp(self.fatigue   - 0.05)
        else:
            self.fatigue = self._clamp(self.fatigue - 0.02)
        if self.fatigue > 0.60:
            self.adoption = self._clamp(self.adoption - 0.04, 0.05)
        elif self.scenario == "optimization" and self.trust > 0.8:
            self.adoption = self._clamp(self.adoption + 0.01, 0.0, 0.95)
        self.step_count += 1
        return {"hour": hour, "zone": zone, "weather": weather,
                "incident": real_incident, "reports": reports, "alert": alert_sent,
                "adoption": round(self.adoption * 100, 1),
                "fatigue":  round(self.fatigue  * 100, 1),
                "trust":    round(self.trust     * 100, 1)}


# --- EXECUTION ---
if __name__ == "__main__":
    print("=== Experiment Setup ===")
    scenario = input("Scenario (baseline / optimization / failure_mode): ").strip()
    steps    = int(input("Number of steps to simulate (e.g. 12): "))
    custom_adoption  = input("Initial adoption % (Enter for default): ").strip()
    custom_threshold = input("Verification threshold (Enter for default): ").strip()
    sim = CSASSimulation(scenario=scenario)
    if custom_adoption:  sim.adoption  = float(custom_adoption) / 100
    if custom_threshold: sim.threshold = int(custom_threshold)
    header = f"{'Hour':<6} {'Zone':<16} {'Weather':<10} {'Inc':<5} {'Rep':<5} {'Alert':<6} {'Adopt%':<8} {'Fatigue%'}"
    print(f"\n>>> SCENARIO: {scenario.upper()} <<<")
    print("-" * 70)
    print(header)
    print("-" * 70)
    for i in range(steps):
        r = sim.run_step()
        hour_display = (15 + i) % 24
        print(f"{hour_display:<6} {r['zone']:<16} {r['weather']:<10} "
              f"{str(r['incident']):<5} {r['reports']:<5} {r['alert']:<6} "
              f"{r['adoption']:<8} {r['fatigue']}")
    print("\n--- Summary ---")
    print(f"Real incidents   : {sim.total_incidents}")
    print(f"Total reports    : {sim.total_reports}")
    print(f"Alerts broadcast : {sim.total_alerts}")
    print(f"Final adoption   : {round(sim.adoption*100,1)}%")
    print(f"Final fatigue    : {round(sim.fatigue*100,1)}%")
    print(f"Final trust      : {round(sim.trust*100,1)}%")
