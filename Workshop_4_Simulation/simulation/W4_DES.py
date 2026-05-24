import simpy
import random
import math
import statistics

#===========================================
#BEFORE USING INSTALL SIMPY LIBRARY (python -m pip install simpy)
#===========================================

# ==========================================
# CONFIGURATION
# ==========================================

SIMULATION_TIME = 200

NUM_USERS = 11

GEOFENCE_RADIUS = 500

INCIDENT_INTERVAL = (20, 30)

VERIFICATION_TIME = (1, 2)

DISPATCH_TIME = (1, 5)

FAILURE_PROBABILITY = 0.02

# ==========================================
# METRICS
# ==========================================

response_times = []

verification_times = []

processed_incidents = 0

verified_incidents = 0

failed_alerts = 0

broadcasted_alerts = 0

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def random_location():

    x = random.randint(-1000, 1000)

    y = random.randint(-1000, 1000)

    return (x, y)


def distance(p1, p2):

    return math.sqrt(
        (p1[0] - p2[0])**2 +
        (p1[1] - p2[1])**2
    )

# ==========================================
# INCIDENT SERVICE
# ==========================================

class IncidentService:

    def __init__(self, env):

        self.env = env

        self.queue = simpy.Store(env)

    def receive_incident(self, incident):

        yield self.queue.put(incident)

# ==========================================
# VERIFICATION SERVICE
# ==========================================

class VerificationService:

    def __init__(self, env):

        self.env = env

    def verify(self, incident):

        global verified_incidents

        delay = random.randint(
            VERIFICATION_TIME[0],
            VERIFICATION_TIME[1]
        )

        verification_times.append(delay)

        yield self.env.timeout(delay)

        # AI confidence simulation
        confidence = random.uniform(0.5, 1.0)

        confirmations = random.randint(0, 3)

        admin_approval = random.choice(
            [True, False]
        )

        if (
            confidence >= 0.75 and
            (
                confirmations >= 2 or
                admin_approval
            )
        ):

            verified_incidents += 1

            return True

        return False

# ==========================================
# DISPATCHER SERVICE
# ==========================================

class DispatcherService:

    def __init__(self, env):

        self.env = env

    def dispatch(self, incident, users):

        global failed_alerts
        global broadcasted_alerts

        delay = random.randint(
            DISPATCH_TIME[0],
            DISPATCH_TIME[1]
        )

        yield self.env.timeout(delay)

        # Reliability simulation
        if random.random() < FAILURE_PROBABILITY:

            failed_alerts += 1

            return False

        nearby_users = 0

        for user in users:

            d = distance(
                incident["location"],
                user["location"]
            )

            # FR-02 Geofence
            if d <= GEOFENCE_RADIUS:

                nearby_users += 1

        broadcasted_alerts += nearby_users

        return True

# ==========================================
# USER PROCESS
# ==========================================

def user_process(env, user, incident_service):

    incident_id = 0

    while True:

        yield env.timeout(
            random.randint(
                INCIDENT_INTERVAL[0],
                INCIDENT_INTERVAL[1]
            )
        )

        incident = {

            "id": incident_id,

            "user": user["id"],

            "location": random_location(),

            "timestamp": env.now,

            "sos": random.choice(
                [True, False]
            ),

            "media": random.choice(
                [True, False]
            )
        }

        print(
            f"[{env.now}] "
            f"User {user['id']} "
            f"generated incident {incident_id}"
        )

        yield env.process(
            incident_service.receive_incident(
                incident
            )
        )

        incident_id += 1

# ==========================================
# SYSTEM PROCESS
# ==========================================

def system_process(
    env,
    incident_service,
    verification_service,
    dispatcher_service,
    users
):

    global processed_incidents

    while True:

        incident = yield incident_service.queue.get()

        start_time = env.now

        # Verification
        verified = yield env.process(
            verification_service.verify(
                incident
            )
        )

        if verified:

            # Dispatch
            success = yield env.process(
                dispatcher_service.dispatch(
                    incident,
                    users
                )
            )

            response_time = (
                env.now -
                incident["timestamp"]
            )

            response_times.append(
                response_time
            )

            processed_incidents += 1

            print(
                f"[{env.now}] "
                f"VERIFIED INCIDENT | "
                f"Response: {response_time}s | "
                f"Success: {success}"
            )

        else:

            print(
                f"[{env.now}] "
                f"Incident rejected"
            )

# ==========================================
# MAIN SIMULATION
# ==========================================

def run_simulation():

    env = simpy.Environment()

    # Services
    incident_service = IncidentService(env)

    verification_service = VerificationService(env)

    dispatcher_service = DispatcherService(env)

    # Users
    users = []

    for i in range(NUM_USERS):

        users.append({

            "id": i,

            "location": random_location()
        })

    # Start users
    for user in users:

        env.process(
            user_process(
                env,
                user,
                incident_service
            )
        )

    # Start system
    env.process(
        system_process(
            env,
            incident_service,
            verification_service,
            dispatcher_service,
            users
        )
    )

    # Run simulation
    env.run(until=SIMULATION_TIME)

    # ==========================================
    # RESULTS
    # ==========================================

    print("\n==============================")
    print("CSAS SIMULATION RESULTS")
    print("==============================")

    print(
        f"Processed Incidents: "
        f"{processed_incidents}"
    )

    print(
        f"Verified Incidents: "
        f"{verified_incidents}"
    )

    print(
        f"Failed Alerts: "
        f"{failed_alerts}"
    )

    print(
        f"Broadcasted Alerts: "
        f"{broadcasted_alerts}"
    )

    if response_times:

        avg_response = statistics.mean(
            response_times
        )

        print(
            f"Average Response Time: "
            f"{avg_response:.2f} sec"
        )

        under_30 = len([
            t for t in response_times
            if t <= 30
        ])

        latency_rate = (
            under_30 /
            len(response_times)
        ) * 100

        print(
            f"Under 30 seconds: "
            f"{latency_rate:.2f}%"
        )

# ==========================================
# EXECUTE
# ==========================================

run_simulation()