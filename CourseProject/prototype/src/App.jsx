import { useState, useCallback, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend
} from "recharts";
import {
  Shield, AlertTriangle, MapPin, Bell, Users, Activity, Eye, CheckCircle,
  XCircle, Clock, TrendingUp, Database, Cpu, Wifi, Lock, Zap, ChevronRight,
  Radio, FileText, BarChart2, Settings, LogIn, Send, Navigation, AlertCircle,
  Phone, Camera, Star, ArrowRight, RefreshCw, Terminal
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const ZONES = [
  { id: "parking", name: "Parking Lot", risk: "high", x: 120, y: 280, activity: "Night peak" },
  { id: "library", name: "Library Area", risk: "medium", x: 310, y: 160, activity: "Afternoon peak" },
  { id: "entrance", name: "Main Entrance", risk: "low", x: 210, y: 80, activity: "Morning peak" },
  { id: "dormitory", name: "Dormitory", risk: "medium", x: 400, y: 280, activity: "Evening peak" },
  { id: "cafeteria", name: "Cafeteria", risk: "low", x: 300, y: 350, activity: "Lunch peak" },
  { id: "sports", name: "Sports Area", risk: "low", x: 500, y: 180, activity: "Afternoon peak" },
];

const TYPES = {
  Theft: "red", Harassment: "orange", "Suspicious Activity": "yellow",
  Vandalism: "purple", Medical: "blue", Assault: "red", Other: "gray",
};

const SEVERITY = {
  Theft: "high", Harassment: "medium", "Suspicious Activity": "medium",
  Vandalism: "medium", Medical: "critical", Assault: "critical", Other: "low",
};

const RISK_COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e", critical: "#dc2626" };
const ZONE_BG = { high: "#7f1d1d", medium: "#78350f", low: "#14532d" };

function seedIncidents() {
  const types = Object.keys(TYPES);
  const zones = ZONES.map(z => z.id);
  const statuses = ["verified", "verified", "verified", "pending", "rejected"];
  const hours = [
    "08:12","09:34","10:05","11:47","12:30","13:15","14:22","15:08",
    "16:44","17:30","18:15","19:02","20:38","21:14","22:05","23:47","01:22",
  ];
  return Array.from({ length: 25 }, (_, i) => {
    const type = types[i % types.length];
    return {
      id: i + 1,
      type,
      zone: zones[i % zones.length],
      time: hours[i % hours.length],
      severity: SEVERITY[type],
      status: statuses[i % statuses.length],
      aiScore: Math.round(Math.random() * 60 + 35),
      confirmations: Math.floor(Math.random() * 4),
      description: `Incident report #${i + 1} — ${type} observed near ${zones[i % zones.length]}.`,
      media: i % 3 === 0,
      lat: -4.6 + Math.random() * 0.01,
      lng: -74.08 + Math.random() * 0.01,
    };
  });
}

// ─── UI Primitives ────────────────────────────────────────────────────────────
const Badge = ({ children, color = "blue" }) => {
  const map = {
    red: "bg-red-900/50 text-red-300 border border-red-700",
    orange: "bg-orange-900/50 text-orange-300 border border-orange-700",
    yellow: "bg-yellow-900/50 text-yellow-300 border border-yellow-700",
    green: "bg-green-900/50 text-green-300 border border-green-700",
    blue: "bg-blue-900/50 text-blue-300 border border-blue-700",
    purple: "bg-purple-900/50 text-purple-300 border border-purple-700",
    gray: "bg-gray-700/50 text-gray-300 border border-gray-600",
    critical: "bg-red-900 text-red-200 border border-red-500 animate-pulse",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[color] || map.gray}`}>{children}</span>;
};

const Stat = ({ icon: Icon, label, value, sub, color = "blue" }) => {
  const colors = {
    blue: "text-blue-400", green: "text-green-400", red: "text-red-400",
    yellow: "text-yellow-400", purple: "text-purple-400",
  };
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
      <div className={`mt-1 ${colors[color]}`}><Icon size={20} /></div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-gray-400 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
};

const Card = ({ title, children, className = "" }) => (
  <div className={`bg-gray-800/60 border border-gray-700 rounded-xl p-4 ${className}`}>
    {title && <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">{title}</h3>}
    {children}
  </div>
);

const StatusDot = ({ status }) => {
  const map = { verified: "bg-green-500", pending: "bg-yellow-500 animate-pulse", rejected: "bg-red-500" };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] || "bg-gray-500"}`} />;
};

const SeverityBadge = ({ severity }) => {
  const map = { critical: "red", high: "orange", medium: "yellow", low: "green" };
  return <Badge color={map[severity] || "gray"}>{severity}</Badge>;
};

// ─── Campus Map Component ─────────────────────────────────────────────────────
function CampusMap({ incidents, selectedZone, onZoneSelect }) {
  return (
    <div className="relative w-full bg-gray-900/80 border border-gray-700 rounded-xl overflow-hidden" style={{ height: 420 }}>
      <svg viewBox="0 0 600 420" className="w-full h-full">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="420" fill="url(#grid)" />
        {/* Roads */}
        <line x1="0" y1="210" x2="600" y2="210" stroke="#334155" strokeWidth="8" />
        <line x1="300" y1="0" x2="300" y2="420" stroke="#334155" strokeWidth="8" />
        <line x1="0" y1="350" x2="600" y2="350" stroke="#334155" strokeWidth="4" />
        {/* Geofence ring for selected zone */}
        {selectedZone && ZONES.find(z => z.id === selectedZone) && (() => {
          const z = ZONES.find(z => z.id === selectedZone);
          return (
            <circle cx={z.x} cy={z.y} r="60" fill="none" stroke="#3b82f6" strokeWidth="1.5"
              strokeDasharray="6 3" opacity="0.6">
              <animate attributeName="r" values="55;65;55" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
          );
        })()}
        {/* Zone nodes */}
        {ZONES.map(z => (
          <g key={z.id} onClick={() => onZoneSelect(z.id === selectedZone ? null : z.id)}
            className="cursor-pointer" style={{ transition: "transform 0.1s" }}>
            <circle cx={z.x} cy={z.y} r="22"
              fill={selectedZone === z.id ? RISK_COLORS[z.risk] : ZONE_BG[z.risk]}
              stroke={RISK_COLORS[z.risk]} strokeWidth="2" opacity="0.9" />
            <text x={z.x} y={z.y + 4} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
              {z.name.split(" ")[0]}
            </text>
          </g>
        ))}
        {/* Incident dots */}
        {incidents.filter(i => i.status !== "rejected").map(inc => {
          const zone = ZONES.find(z => z.id === inc.zone);
          if (!zone) return null;
          const ox = (inc.id % 5 - 2) * 8;
          const oy = (Math.floor(inc.id / 5) % 3 - 1) * 8;
          return (
            <circle key={inc.id} cx={zone.x + ox} cy={zone.y + oy - 30} r="4"
              fill={inc.status === "pending" ? "#f59e0b" : "#22c55e"}
              stroke="white" strokeWidth="1" opacity="0.85">
              {inc.status === "pending" && (
                <animate attributeName="opacity" values="0.85;0.3;0.85" dur="1.5s" repeatCount="indefinite" />
              )}
            </circle>
          );
        })}
        {/* Legend */}
        <g transform="translate(440, 360)">
          <rect x="0" y="0" width="150" height="50" rx="6" fill="#0f172a" opacity="0.9" />
          <circle cx="15" cy="12" r="4" fill="#f59e0b" />
          <text x="25" y="16" fontSize="9" fill="#d1d5db">Pending</text>
          <circle cx="75" cy="12" r="4" fill="#22c55e" />
          <text x="85" y="16" fontSize="9" fill="#d1d5db">Verified</text>
          <circle cx="15" cy="34" r="6" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="25" y="38" fontSize="9" fill="#d1d5db">500m geofence</text>
        </g>
      </svg>
      {selectedZone && (() => {
        const z = ZONES.find(z => z.id === selectedZone);
        return (
          <div className="absolute top-3 left-3 bg-gray-900/95 border border-blue-700 rounded-lg px-3 py-2 text-xs">
            <div className="font-bold text-blue-300">{z.name}</div>
            <div className="text-gray-400">Risk: <span style={{ color: RISK_COLORS[z.risk] }}>{z.risk.toUpperCase()}</span></div>
            <div className="text-gray-400">{z.activity}</div>
            <div className="text-blue-400 mt-1">Geofence: 500m radius active</div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Pipeline View Component ──────────────────────────────────────────────────
function PipelineView({ incident, onVerify, onReject, onConfirm }) {
  if (!incident) return (
    <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
      Select an incident to inspect the pipeline
    </div>
  );
  const stages = ["Received", "AI Scored", "Human Review", "Dispatch"];
  const stageIndex = incident.status === "rejected" ? 1 : incident.status === "verified" ? 3 : 2;
  const meetsNFR08 = incident.confirmations >= 2 || incident.status === "verified";
  return (
    <div className="space-y-4">
      {/* Pipeline stages */}
      <div className="flex items-center gap-1">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`flex-1 text-center py-1.5 px-1 rounded text-xs font-medium ${
              i <= stageIndex ? "bg-blue-700 text-white" : "bg-gray-700 text-gray-400"
            }`}>{s}</div>
            {i < stages.length - 1 && <ChevronRight size={12} className="text-gray-500 flex-shrink-0" />}
          </div>
        ))}
      </div>
      {/* Incident metadata */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-500">Type</div>
          <div className="text-white font-medium">{incident.type}</div>
        </div>
        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-500">Zone</div>
          <div className="text-white font-medium capitalize">{incident.zone}</div>
        </div>
        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-500">Severity</div>
          <SeverityBadge severity={incident.severity} />
        </div>
        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-500">Time</div>
          <div className="text-white font-medium">{incident.time}</div>
        </div>
      </div>
      {/* AI Score */}
      <div className="bg-gray-900 rounded-lg p-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">AI Confidence Score (FR-03)</span>
          <span className={`font-bold ${incident.aiScore >= 75 ? "text-green-400" : incident.aiScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>
            {incident.aiScore}%
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div className="h-2 rounded-full transition-all"
            style={{
              width: `${incident.aiScore}%`,
              backgroundColor: incident.aiScore >= 75 ? "#22c55e" : incident.aiScore >= 40 ? "#f59e0b" : "#ef4444"
            }} />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {incident.aiScore >= 75 ? "Auto-verified" : incident.aiScore >= 40 ? "Human review required" : "Likely false positive"}
        </div>
      </div>
      {/* NFR-08 Gate */}
      <div className={`rounded-lg p-3 border ${meetsNFR08 ? "bg-green-900/30 border-green-700" : "bg-yellow-900/30 border-yellow-700"}`}>
        <div className="flex items-center gap-2 text-xs">
          {meetsNFR08 ? <CheckCircle size={14} className="text-green-400" /> : <Clock size={14} className="text-yellow-400" />}
          <span className={`font-bold ${meetsNFR08 ? "text-green-300" : "text-yellow-300"}`}>
            NFR-08 Gate: {meetsNFR08 ? "PASSED" : "PENDING"}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Confirmations: {incident.confirmations}/2 required · {meetsNFR08 ? "Ready to dispatch" : "Awaiting community confirmation"}
        </div>
      </div>
      {/* Action buttons */}
      {incident.status === "pending" && (
        <div className="flex gap-2">
          <button onClick={() => onVerify(incident.id)}
            className="flex-1 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
            <CheckCircle size={12} /> Verify & Dispatch
          </button>
          <button onClick={() => onConfirm(incident.id)}
            className="flex-1 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
            <Users size={12} /> Confirm (+1)
          </button>
          <button onClick={() => onReject(incident.id)}
            className="flex-1 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
            <XCircle size={12} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CSAS() {
  const [incidents, setIncidents] = useState(seedIncidents);
  const [page, setPage] = useState("dashboard");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [simLog, setSimLog] = useState([]);
  const [simRunning, setSimRunning] = useState(false);
  const [reportStep, setReportStep] = useState(1);
  const [reportData, setReportData] = useState({ type: "", zone: "", description: "" });
  const [notification, setNotification] = useState(null);

  const showNotif = (msg, color = "green") => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 3000);
  };

  const submitReport = useCallback(() => {
    if (!reportData.type || !reportData.zone) return;
    const newInc = {
      id: incidents.length + 1,
      type: reportData.type,
      zone: reportData.zone,
      time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
      severity: SEVERITY[reportData.type] || "low",
      status: reportData.type === "Assault" || reportData.type === "Medical" ? "verified" : "pending",
      aiScore: Math.round(Math.random() * 55 + 40),
      confirmations: 0,
      description: reportData.description || `New ${reportData.type} report`,
      media: false,
      lat: -4.6 + Math.random() * 0.01,
      lng: -74.08 + Math.random() * 0.01,
    };
    setIncidents(prev => [newInc, ...prev]);
    setReportData({ type: "", zone: "", description: "" });
    setReportStep(1);
    setPage("dashboard");
    showNotif("Report submitted. Entering verification pipeline.");
  }, [incidents.length, reportData]);

  const verify = useCallback((id) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: "verified" } : i));
    showNotif("Alert verified and dispatched to nearby users.");
  }, []);

  const reject = useCallback((id) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: "rejected" } : i));
    showNotif("Report rejected — flagged as false positive.", "red");
  }, []);

  const confirm = useCallback((id) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, confirmations: i.confirmations + 1 } : i));
    showNotif("Community confirmation added.", "blue");
  }, []);

  const triggerSOS = useCallback(() => {
    setSosActive(true);
    const sos = {
      id: incidents.length + 1,
      type: "Assault", zone: "parking", severity: "critical", status: "verified",
      aiScore: 100, confirmations: 0, time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
      description: "SOS EMERGENCY — Priority bypass activated", media: false, lat: -4.6, lng: -74.08,
    };
    setIncidents(prev => [sos, ...prev]);
    showNotif("🚨 SOS activated — Emergency dispatch in progress!", "red");
    setTimeout(() => setSosActive(false), 5000);
  }, [incidents.length]);

  const runSimulation = useCallback(() => {
    setSimRunning(true);
    setSimLog([]);
    const events = [
      { t: 200, type: "sys", text: "DES initialized — SimPy 4.1 | Users: 11 | Duration: 200s | Seed: 42" },
      { t: 600, type: "data", text: "Scenario: BASELINE | Staff efficiency: 50% | Failure prob: 2%" },
      { t: 1000, type: "pass", text: "[t=0.0s] User_04 → Incident: Theft @ parking_lot | GPS: (-4.6012, -74.0821)" },
      { t: 1400, type: "pass", text: "[t=2.1s] Incident_Svc → Stored | AI scorer: confidence=0.82 ✓ (≥0.75)" },
      { t: 1800, type: "warn", text: "[t=4.8s] Verification_Svc → Human review queued | Staff busy (50% eff.)" },
      { t: 2200, type: "pass", text: "[t=18.3s] Dispatcher → Geofence: 47 users within 500m | Push: OK" },
      { t: 2600, type: "data", text: "[NFR-01] Latency: 27.1s ✓ (target < 30s)" },
      { t: 3000, type: "sys", text: "Scenario: SURGE (300% load) — K8s HPA triggered | RabbitMQ priority queue active" },
      { t: 3400, type: "warn", text: "[t=102s] Queue depth: 18 incidents | Scaling: 1→3 pods" },
      { t: 3800, type: "pass", text: "[NFR-01] Surge latency: 29.8s ✓ (95th pctl. | target < 30s)" },
      { t: 4200, type: "data", text: "[NFR-02] Delivery rate: 99.94% ✓ (target > 99.9%)" },
      { t: 4600, type: "warn", text: "Scenario: FAILURE MODE | Push notification outage → SMS fallback (Twilio)" },
      { t: 5000, type: "warn", text: "[t=155s] FCM delivery failure detected → RabbitMQ DLQ → Twilio SMS (47 msgs)" },
      { t: 5400, type: "pass", text: "[NFR-02] Fallback delivery: 99.12% (degraded mode — acceptable)" },
      { t: 5800, type: "data", text: "Behavioral Sim | Steps: 12 | Pop: 200 | θ=3 | Seed: 42" },
      { t: 6200, type: "warn", text: "[Step 4] Adoption: 22% — BELOW 30-35% critical threshold!" },
      { t: 6600, type: "pass", text: "[Step 8] Optimization: adoption=67.62% ✓ | fatigue=18% ✓ | trust=84% ✓" },
      { t: 7000, type: "warn", text: "EMERGENT: Spatial clustering detected @ parking_lot (3 co-located reports)" },
      { t: 7400, type: "warn", text: "EMERGENT: Night-time bottleneck @ 22:00 | verif. latency →52s (θ escalation needed)" },
      { t: 7800, type: "data", text: "EMERGENT: Non-linear adoption jump at 30% threshold (R+ loop activated)" },
      { t: 8200, type: "pass", text: "Bifurcation: θ=3 → R+ dominant | θ=1 → B- dominant (collapse)" },
      { t: 8600, type: "pass", text: "SIMULATION COMPLETE | All NFR-01/02/05 validated ✓ | θ=3 confirmed as production default" },
    ];
    events.forEach(({ t, type, text }) => {
      setTimeout(() => {
        setSimLog(prev => [...prev, { type, text, id: t }]);
      }, t);
    });
    setTimeout(() => setSimRunning(false), 9000);
  }, []);

  // ─── Chart Data ───────────────────────────────────────────────────────────
  const incidentByTime = [
    { time: "06-09", count: 1, fill: "#22c55e" },
    { time: "09-12", count: 2, fill: "#22c55e" },
    { time: "12-15", count: 3, fill: "#f59e0b" },
    { time: "15-18", count: 5, fill: "#f59e0b" },
    { time: "18-21", count: 8, fill: "#ef4444" },
    { time: "21-24", count: 9, fill: "#ef4444" },
    { time: "00-03", count: 4, fill: "#f97316" },
  ];
  const incidentByType = [
    { name: "Theft", count: 7 }, { name: "Harassment", count: 4 },
    { name: "Suspicious", count: 6 }, { name: "Vandalism", count: 3 },
    { name: "Medical", count: 2 }, { name: "Assault", count: 2 },
  ];
  const zoneRadar = [
    { zone: "Parking", risk: 9 }, { zone: "Library", risk: 5 },
    { zone: "Entrance", risk: 3 }, { zone: "Dormitory", risk: 6 },
    { zone: "Cafeteria", risk: 2 }, { zone: "Sports", risk: 2 },
  ];
  const scenarioData = [
    { scenario: "Baseline", latency: 40.87, adoption: 21.39 },
    { scenario: "Optimization", latency: 17.94, adoption: 67.62 },
    { scenario: "Failure", latency: 71.66, adoption: 31.34 },
  ];

  const pending = incidents.filter(i => i.status === "pending");
  const verified = incidents.filter(i => i.status === "verified");

  // ─── Nav ──────────────────────────────────────────────────────────────────
  const navItems = [
    { id: "dashboard", icon: Activity, label: "Dashboard" },
    { id: "report", icon: Send, label: "Report" },
    { id: "map", icon: MapPin, label: "Map" },
    { id: "verification", icon: Eye, label: "Verify" },
    { id: "analytics", icon: BarChart2, label: "Analytics" },
    { id: "log", icon: FileText, label: "Log" },
    { id: "simulation", icon: Terminal, label: "Simulation" },
    { id: "architecture", icon: Cpu, label: "Architecture" },
  ];

  // ─── Pages ────────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={AlertTriangle} label="Total Incidents" value={incidents.length} sub="All time" color="yellow" />
        <Stat icon={CheckCircle} label="Verified Alerts" value={verified.length} sub="Dispatched" color="green" />
        <Stat icon={Clock} label="Pending Review" value={pending.length} sub="In pipeline" color="red" />
        <Stat icon={Star} label="Avg AI Score" value={`${Math.round(incidents.reduce((a, b) => a + b.aiScore, 0) / incidents.length)}%`} sub="Confidence" color="blue" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Incidents by Time of Day (W1 finding)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incidentByTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: 8 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {incidentByTime.map((e, i) => (
                  <rect key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Incidents by Type">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incidentByType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#9ca3af", fontSize: 10 }} width={70} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: 8 }} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <CampusMap incidents={incidents} selectedZone={selectedZone} onZoneSelect={setSelectedZone} />
      {/* Recent incidents */}
      <Card title="Recent Activity">
        <div className="space-y-2">
          {incidents.slice(0, 5).map(inc => (
            <div key={inc.id} onClick={() => { setSelectedIncident(inc); setPage("verification"); }}
              className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/50 hover:bg-gray-700/50 cursor-pointer transition-colors text-sm">
              <StatusDot status={inc.status} />
              <span className="flex-1 text-gray-300">{inc.type} — <span className="text-gray-500 capitalize">{inc.zone}</span></span>
              <span className="text-gray-500 text-xs">{inc.time}</span>
              <SeverityBadge severity={inc.severity} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderReport = () => (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 h-1.5 rounded-full ${reportStep >= s ? "bg-blue-500" : "bg-gray-700"}`} />
        ))}
      </div>
      <div className="text-xs text-gray-500 text-center">Step {reportStep}/3 — NFR-06: ≤3 interactions</div>
      {reportStep === 1 && (
        <Card title="Step 1 — Select Incident Type (FR-01)">
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(TYPES).map(t => (
              <button key={t} onClick={() => { setReportData(d => ({ ...d, type: t })); setReportStep(2); }}
                className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                  reportData.type === t ? "bg-blue-700 border-blue-500 text-white" : "bg-gray-800 border-gray-600 text-gray-300 hover:border-blue-600"
                }`}>
                {t === "Assault" || t === "Medical" ? "🚨 " : ""}{t}
                {(t === "Assault" || t === "Medical") && <div className="text-xs text-red-400 mt-0.5">Priority bypass</div>}
              </button>
            ))}
          </div>
        </Card>
      )}
      {reportStep === 2 && (
        <Card title="Step 2 — Select Location (FR-06)">
          <div className="grid grid-cols-2 gap-2">
            {ZONES.map(z => (
              <button key={z.id} onClick={() => { setReportData(d => ({ ...d, zone: z.id })); setReportStep(3); }}
                className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                  reportData.zone === z.id ? "bg-blue-700 border-blue-500 text-white" : "bg-gray-800 border-gray-600 text-gray-300 hover:border-blue-600"
                }`}>
                <div>{z.name}</div>
                <div style={{ color: RISK_COLORS[z.risk] }} className="text-xs">{z.risk.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </Card>
      )}
      {reportStep === 3 && (
        <Card title="Step 3 — Additional Details (optional / FR-10)">
          <textarea value={reportData.description}
            onChange={e => setReportData(d => ({ ...d, description: e.target.value }))}
            placeholder="Describe what you observed... (optional)"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm text-gray-300 h-28 resize-none focus:outline-none focus:border-blue-500"
          />
          <div className="mt-2 p-2 bg-gray-900 rounded-lg text-xs text-gray-500">
            <div className="font-medium text-gray-400 mb-1">Report summary:</div>
            <div>Type: <span className="text-white">{reportData.type}</span></div>
            <div>Zone: <span className="text-white capitalize">{reportData.zone}</span></div>
            <div>GPS: <span className="text-blue-400">Auto-captured ✓</span></div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setReportStep(2)}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors">
              ← Back
            </button>
            <button onClick={submitReport}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Send size={14} /> Submit Report
            </button>
          </div>
        </Card>
      )}
      {/* SOS Button */}
      <button onClick={triggerSOS}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
          sosActive ? "bg-red-600 animate-pulse scale-95" : "bg-red-700 hover:bg-red-600 hover:scale-[1.02]"
        } text-white border-2 border-red-500`}>
        <Phone size={24} /> {sosActive ? "EMERGENCY DISPATCHED" : "🚨 SOS EMERGENCY"}
      </button>
      <div className="text-xs text-center text-gray-600">FR-08: Priority bypass — skips AI scoring and verification</div>
    </div>
  );

  const renderVerification = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title={`Pending Queue (${pending.length})`}>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {pending.length === 0 && <div className="text-gray-500 text-sm text-center py-4">No pending incidents</div>}
          {pending.map(inc => (
            <div key={inc.id} onClick={() => setSelectedIncident(inc)}
              className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                selectedIncident?.id === inc.id ? "bg-blue-900/40 border-blue-600" : "bg-gray-900/50 border-gray-700 hover:border-gray-500"
              }`}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-gray-200">{inc.type}</span>
                <SeverityBadge severity={inc.severity} />
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="capitalize">{inc.zone}</span>
                <span>{inc.time}</span>
                <span>AI: {inc.aiScore}%</span>
                <span>👥 {inc.confirmations}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Verification Pipeline">
        <PipelineView incident={selectedIncident} onVerify={verify} onReject={reject} onConfirm={confirm} />
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4">
      {/* Gap analysis cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Response Time", current: "~11.4 min", target: "< 5 min", gap: "−6.4 min", color: "red" },
          { label: "Recording Rate", current: "~41%", target: "> 85%", gap: "+44 pp", color: "orange" },
          { label: "App Adoption", current: "~12%", target: "≥ 60%", gap: "+48 pp", color: "yellow" },
          { label: "Delivery Success", current: "~87%", target: "> 99.9%", gap: "+12.9 pp", color: "blue" },
        ].map(g => (
          <div key={g.label} className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">{g.label}</div>
            <div className="text-sm text-gray-400">Current: <span className="text-red-400 font-medium">{g.current}</span></div>
            <div className="text-sm text-gray-400">Target: <span className="text-green-400 font-medium">{g.target}</span></div>
            <div className="text-base font-bold text-blue-300 mt-1">{g.gap}</div>
          </div>
        ))}
      </div>
      {/* Scenario results */}
      <Card title="Simulation Results — 3 Scenarios × 30 Runs (95% CI)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={scenarioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="scenario" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: 8 }} />
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="latency" name="Avg Latency (s)" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="adoption" name="Adoption (%)" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {/* Zone risk radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Zone Risk Radar (FR-09 Heatmap)">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={zoneRadar}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="zone" tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fill: "#6b7280", fontSize: 9 }} />
              <Radar name="Risk" dataKey="risk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="KPI Progress vs. NFRs">
          <div className="space-y-3">
            {[
              { label: "Latency NFR-01 < 30s", pct: 60, note: "17.94s optimization" },
              { label: "Delivery NFR-02 > 99.9%", pct: 97, note: "96.84% simulation" },
              { label: "Adoption Target ≥ 60%", pct: 67, note: "67.62% optimization" },
              { label: "Availability NFR-03 ≥ 99.9%", pct: 99, note: "Architecture target" },
            ].map(k => (
              <div key={k.label}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{k.label}</span><span>{k.note}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${k.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderLog = () => (
    <Card title={`Incident Log (${incidents.length} total)`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-gray-700">
              <th className="text-left py-2 pr-3">#</th>
              <th className="text-left py-2 pr-3">Time</th>
              <th className="text-left py-2 pr-3">Type</th>
              <th className="text-left py-2 pr-3">Zone</th>
              <th className="text-left py-2 pr-3">Severity</th>
              <th className="text-left py-2 pr-3">AI Score</th>
              <th className="text-left py-2 pr-3">Conf.</th>
              <th className="text-left py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(inc => (
              <tr key={inc.id} onClick={() => { setSelectedIncident(inc); setPage("verification"); }}
                className="border-b border-gray-800 hover:bg-gray-700/30 cursor-pointer">
                <td className="py-1.5 pr-3 text-gray-500">{inc.id}</td>
                <td className="py-1.5 pr-3 text-gray-400">{inc.time}</td>
                <td className="py-1.5 pr-3 text-gray-300">{inc.type}</td>
                <td className="py-1.5 pr-3 text-gray-400 capitalize">{inc.zone}</td>
                <td className="py-1.5 pr-3"><SeverityBadge severity={inc.severity} /></td>
                <td className="py-1.5 pr-3">
                  <span className={inc.aiScore >= 75 ? "text-green-400" : inc.aiScore >= 40 ? "text-yellow-400" : "text-red-400"}>
                    {inc.aiScore}%
                  </span>
                </td>
                <td className="py-1.5 pr-3 text-gray-400">{inc.confirmations}</td>
                <td className="py-1.5 pr-3">
                  <span className="flex items-center gap-1">
                    <StatusDot status={inc.status} />
                    <span className="text-gray-400 capitalize">{inc.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderSimulation = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={runSimulation} disabled={simRunning}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
            simRunning ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600 text-white"
          }`}>
          {simRunning ? <RefreshCw size={14} className="animate-spin" /> : <Terminal size={14} />}
          {simRunning ? "Running simulation..." : "Run W4 Simulation"}
        </button>
        <span className="text-xs text-gray-500">SimPy DES + Behavioral | 30 runs | Seed=42</span>
      </div>
      {/* Simulation console */}
      <div className="bg-gray-950 border border-gray-700 rounded-xl p-4 font-mono text-xs h-72 overflow-y-auto">
        {simLog.length === 0 && (
          <div className="text-gray-600">// Press "Run W4 Simulation" to replay the Workshop 4 DES validation</div>
        )}
        {simLog.map(e => (
          <div key={e.id} className={`mb-0.5 ${
            e.type === "pass" ? "text-green-400" : e.type === "warn" ? "text-yellow-400" :
            e.type === "data" ? "text-blue-400" : "text-gray-400"
          }`}>
            {e.type === "pass" ? "✓ " : e.type === "warn" ? "⚠ " : e.type === "data" ? "→ " : "• "}{e.text}
          </div>
        ))}
      </div>
      {/* Scenario results table */}
      <Card title="Scenario Results Summary — Workshop 4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-700 text-xs">
              <th className="text-left py-2 pr-4">Scenario</th>
              <th className="text-right py-2 pr-4">Avg Latency</th>
              <th className="text-right py-2 pr-4">CI 95%</th>
              <th className="text-right py-2 pr-4">Adoption</th>
              <th className="text-right py-2">NFR-01</th>
            </tr>
          </thead>
          <tbody>
            {[
              { s: "Baseline", lat: "40.87 s", ci: "±1.02 s", adp: "21.39%", pass: false },
              { s: "Optimization", lat: "17.94 s", ci: "±1.02 s", adp: "67.62%", pass: true },
              { s: "Failure Mode", lat: "71.66 s", ci: "±3.94 s", adp: "31.34%", pass: false },
            ].map(r => (
              <tr key={r.s} className="border-b border-gray-800">
                <td className="py-2 pr-4 text-gray-300">{r.s}</td>
                <td className="py-2 pr-4 text-right text-gray-300">{r.lat}</td>
                <td className="py-2 pr-4 text-right text-gray-500">{r.ci}</td>
                <td className="py-2 pr-4 text-right text-gray-300">{r.adp}</td>
                <td className="py-2 text-right">
                  {r.pass ? <span className="text-green-400">✓ PASS</span> : <span className="text-red-400">✗ FAIL</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const renderArchitecture = () => (
    <div className="space-y-4">
      {/* 5-layer architecture */}
      <Card title="5-Layer Microservices Architecture (Workshop 2)">
        <div className="space-y-2">
          {[
            { layer: "Presentation", color: "blue", items: ["Mobile App (React Native)", "Admin Web Portal"] },
            { layer: "Application", color: "purple", items: ["API Gateway (Node.js / Nginx)", "Auth · Rate Limiting · Routing"] },
            { layer: "Service", color: "green", items: ["Incident Service", "Verification Service", "Dispatcher Service", "User Service", "Analytics Service"] },
            { layer: "Data", color: "yellow", items: ["PostgreSQL + PostGIS", "Redis Cache", "RabbitMQ Message Broker"] },
            { layer: "Integration", color: "red", items: ["SIURE UD", "Firebase FCM", "Twilio SMS", "Local Authorities API"] },
          ].map(l => (
            <div key={l.layer} className={`border rounded-lg p-3 bg-gray-900/50 border-gray-700`}>
              <div className={`text-xs font-bold mb-2 ${
                { blue: "text-blue-400", purple: "text-purple-400", green: "text-green-400", yellow: "text-yellow-400", red: "text-red-400" }[l.color]
              }`}>{l.layer} Layer</div>
              <div className="flex flex-wrap gap-2">
                {l.items.map(item => (
                  <span key={item} className="text-xs bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-gray-300">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      {/* Standards compliance */}
      <Card title="Standards Compliance Matrix (Workshop 3)">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            "ISO 9001", "CMMI L3", "IEEE 830", "IEEE 1633",
            "ISO/IEC 25010", "ISO 31000", "PMBOK", "Ley 1581",
          ].map(s => (
            <div key={s} className="bg-green-900/30 border border-green-700/50 rounded-lg p-2 text-center">
              <CheckCircle size={12} className="text-green-400 mx-auto mb-1" />
              <div className="text-xs text-green-300 font-medium">{s}</div>
            </div>
          ))}
        </div>
      </Card>
      {/* Tech stack */}
      <Card title="Technology Stack">
        <div className="space-y-2 text-sm">
          {[
            { comp: "Mobile App", tech: "React Native", why: "≤3-interaction flow (NFR-06)" },
            { comp: "Backend Services", tech: "Node.js + FastAPI", why: "Async event-driven (NFR-01)" },
            { comp: "Verification Engine", tech: "Python / scikit-learn", why: "AI plausibility scorer (FR-03)" },
            { comp: "Message Broker", tech: "RabbitMQ", why: "Priority queues, decoupled pipeline" },
            { comp: "Database", tech: "PostgreSQL + PostGIS", why: "Geospatial queries (FR-02, FR-09)" },
            { comp: "Push Notifications", tech: "Firebase FCM", why: "99.9% delivery (NFR-02)" },
            { comp: "SMS Fallback", tech: "Twilio API", why: "Guaranteed delivery backup" },
            { comp: "Infrastructure", tech: "AWS / K8s", why: "300% surge autoscaling (NFR-05)" },
          ].map(r => (
            <div key={r.comp} className="flex items-start gap-3 py-1.5 border-b border-gray-700/50 last:border-0">
              <span className="text-gray-500 w-36 flex-shrink-0">{r.comp}</span>
              <span className="text-blue-300 w-36 flex-shrink-0">{r.tech}</span>
              <span className="text-gray-500 text-xs">{r.why}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const pages = {
    dashboard: renderDashboard,
    report: renderReport,
    map: () => <div className="space-y-4">
      <CampusMap incidents={incidents} selectedZone={selectedZone} onZoneSelect={setSelectedZone} />
      {selectedZone && (
        <Card title={`${ZONES.find(z => z.id === selectedZone)?.name} — Details`}>
          <div className="text-sm space-y-1">
            <div className="text-gray-400">Risk level: <span style={{ color: RISK_COLORS[ZONES.find(z => z.id === selectedZone)?.risk] }} className="font-bold uppercase">{ZONES.find(z => z.id === selectedZone)?.risk}</span></div>
            <div className="text-gray-400">Activity: {ZONES.find(z => z.id === selectedZone)?.activity}</div>
            <div className="text-gray-400">Active incidents: {incidents.filter(i => i.zone === selectedZone && i.status !== "rejected").length}</div>
            <div className="text-blue-400 text-xs mt-2">Geofence radius: 500m (FR-02) — Click zone to activate alert ring</div>
          </div>
        </Card>
      )}
    </div>,
    verification: renderVerification,
    analytics: renderAnalytics,
    log: renderLog,
    simulation: renderSimulation,
    architecture: renderArchitecture,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Shield size={22} className="text-blue-400" />
          <div>
            <div className="font-bold text-sm text-white">CSAS</div>
            <div className="text-xs text-gray-500 hidden sm:block">Community Security Alert System</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {pending.length > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {pending.length} pending
            </span>
          )}
          <div className="text-xs text-gray-500">UD · 2026-I</div>
        </div>
      </header>

      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-14 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${
          notification.color === "red" ? "bg-red-700 text-white" :
          notification.color === "blue" ? "bg-blue-700 text-white" : "bg-green-700 text-white"
        }`}>
          {notification.msg}
        </div>
      )}

      {/* Nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-2 overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setPage(id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                page === id ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
              }`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-4 max-w-6xl mx-auto w-full">
        {pages[page] ? pages[page]() : null}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 px-4 py-2 text-center text-xs text-gray-600">
        CSAS — Felipe Garzon · Juan Quintero · Henry Garrido · Gabriel Cusba — Universidad Distrital FJdC — 2026-I
      </footer>
    </div>
  );
}
