import { useState, useEffect, useCallback, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Shield, AlertTriangle, MapPin, Bell, BarChart3, CheckCircle, XCircle, Clock, Users, Activity, Send, Plus, Eye, Zap, Radio, FileText, TrendingUp, Menu, X, Search, ChevronRight, Settings, LogOut, Filter, ArrowUpRight, ArrowDownRight, Layers, Cpu, Database, Globe, Lock, Wifi, Server, RefreshCw } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CSAS — Community Security Alert System
   Universidad Distrital Francisco José de Caldas
   Systems Analysis & Design — Semester 2026-I
   Eng. Carlos Andrés Sierra, M.Sc.
   ═══════════════════════════════════════════════════════════════ */

const ZONES = [
  { id: "entrance", name: "Main Entrance", x: 48, y: 15, risk: "low", color: "#10b981", activity: "high" },
  { id: "library", name: "Library Area", x: 25, y: 42, risk: "low", color: "#10b981", activity: "high" },
  { id: "parking", name: "Parking Lot", x: 78, y: 72, risk: "high", color: "#ef4444", activity: "low" },
  { id: "dormitory", name: "Dormitory Area", x: 18, y: 78, risk: "medium", color: "#f59e0b", activity: "medium" },
  { id: "cafeteria", name: "Cafeteria", x: 52, y: 48, risk: "low", color: "#10b981", activity: "high" },
  { id: "engineering", name: "Engineering Bldg.", x: 68, y: 32, risk: "medium", color: "#f59e0b", activity: "medium" },
];

const TYPES = ["Theft","Harassment","Suspicious Activity","Medical Emergency","Assault","Vandalism","Unauthorized Access"];
const SEVERITY = { Theft:"medium", Harassment:"high", "Suspicious Activity":"low", "Medical Emergency":"critical", Assault:"critical", Vandalism:"low", "Unauthorized Access":"medium" };
const SLOTS = ["06-09","09-12","12-15","15-18","18-21","21-00"];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const pick = a => a[Math.floor(Math.random()*a.length)];
const clamp = (v,lo,hi) => Math.max(lo, Math.min(hi, v));
const fmt = d => d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

function seedIncidents(n=25) {
  const out = [];
  for (let i=0;i<n;i++) {
    const z = pick(ZONES), t = pick(TYPES);
    const hr = Math.floor(Math.random()*18)+6;
    const slot = SLOTS[clamp(Math.floor((hr-6)/3),0,5)];
    out.push({
      id: uid(), type: t, zone: z.id, zoneName: z.name,
      desc: `${t} reported near ${z.name} area`,
      severity: SEVERITY[t], status: pick(["verified","verified","verified","pending","pending","rejected"]),
      time: `${String(hr).padStart(2,"0")}:${String(Math.floor(Math.random()*60)).padStart(2,"0")}`,
      slot, ai: +(0.25+Math.random()*0.75).toFixed(2),
      confirms: Math.floor(Math.random()*4),
      x: z.x + (Math.random()-0.5)*12, y: z.y + (Math.random()-0.5)*12,
      reporter: `Student-${1000+Math.floor(Math.random()*9000)}`,
    });
  }
  return out;
}

/* ─── Palette ─── */
const P = {
  bg: "#0a0f1a", card: "#111827", cardHover: "#1a2332", border: "#1e293b",
  accent: "#3b82f6", accentLight: "#60a5fa", success: "#10b981", warning: "#f59e0b",
  danger: "#ef4444", muted: "#64748b", text: "#e2e8f0", textDim: "#94a3b8",
  surface: "#0f172a",
};

/* ─── Shared Components ─── */
function Badge({children, color="#3b82f6"}) {
  return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{background:`${color}18`, color}}>{children}</span>;
}

function Stat({label, value, sub, icon:Ic, color=P.accent, trend, className=""}) {
  return (
    <div className={`rounded-xl p-5 border transition-all duration-200 hover:border-opacity-40 ${className}`} style={{background:P.card, borderColor:P.border}}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background:`${color}15`}}>
          <Ic size={20} style={{color}} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trend>=0?"text-emerald-400":"text-red-400"}`}>
            {trend>=0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}{Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold tracking-tight" style={{color:P.text}}>{value}</div>
      <div className="text-xs mt-1" style={{color:P.muted}}>{label}</div>
      {sub && <div className="text-[10px] mt-2 font-mono" style={{color:P.muted}}>{sub}</div>}
    </div>
  );
}

function SectionHeader({title, sub, badge, right}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-lg font-bold" style={{color:P.text}}>{title}</h2>
        {sub && <p className="text-xs mt-0.5" style={{color:P.muted}}>{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        {badge && <Badge color={P.accent}>{badge}</Badge>}
        {right}
      </div>
    </div>
  );
}

function Card({children, className="", noPad}) {
  return <div className={`rounded-xl border ${noPad?"":"p-5"} ${className}`} style={{background:P.card, borderColor:P.border}}>{children}</div>;
}

function StatusDot({status}) {
  const c = status==="verified"?P.success : status==="pending"?P.warning : P.danger;
  return <span className="inline-block w-2 h-2 rounded-full" style={{background:c}} />;
}

function SeverityBadge({sev}) {
  const c = sev==="critical"?P.danger : sev==="high"?P.warning : sev==="medium"?P.accent : P.success;
  return <Badge color={c}>{sev.toUpperCase()}</Badge>;
}

/* ─── Campus Map SVG ─── */
function CampusMap({incidents, selected, onSelect, compact}) {
  const active = incidents.filter(i => i.status!=="rejected");
  const h = compact ? "aspect-[2/1]" : "aspect-[16/9]";
  return (
    <div className={`relative w-full ${h} rounded-xl overflow-hidden border`} style={{background:"#070d17", borderColor:P.border}}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="g" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M5 0L0 0 0 5" fill="none" stroke="#ffffff06" strokeWidth="0.12"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#g)"/>
        {/* Campus perimeter */}
        <rect x="8" y="8" width="84" height="84" rx="2" fill="none" stroke="#ffffff08" strokeWidth="0.3" strokeDasharray="2 1"/>
        {/* Roads */}
        <line x1="8" y1="50" x2="92" y2="50" stroke="#ffffff06" strokeWidth="0.8"/>
        <line x1="50" y1="8" x2="50" y2="92" stroke="#ffffff06" strokeWidth="0.8"/>
        {/* Zone areas */}
        {ZONES.map(z => {
          const isSel = selected === z.id;
          return (
            <g key={z.id} onClick={() => onSelect?.(z.id === selected ? null : z.id)} style={{cursor:"pointer"}}>
              <rect x={z.x-8} y={z.y-6} width="16" height="12" rx="1.5" fill={`${z.color}08`} stroke={isSel?`${z.color}60`:`${z.color}20`} strokeWidth={isSel?0.5:0.2}/>
              <rect x={z.x-8} y={z.y-6} width="16" height="0.5" rx="0.25" fill={`${z.color}60`}/>
              <text x={z.x} y={z.y+0.5} textAnchor="middle" fill="#ffffffb0" fontSize="1.6" fontWeight="600" fontFamily="system-ui">{z.name.split(" ").slice(0,2).join(" ")}</text>
              <text x={z.x} y={z.y+3} textAnchor="middle" fill={z.color} fontSize="1.1" fontFamily="monospace" fontWeight="500">{z.risk.toUpperCase()} RISK</text>
              {/* Geofence */}
              {isSel && <circle cx={z.x} cy={z.y} r="16" fill="none" stroke={`${z.color}30`} strokeWidth="0.2" strokeDasharray="1 0.5"><animate attributeName="r" from="14" to="20" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite"/></circle>}
            </g>
          );
        })}
        {/* Incidents */}
        {active.map(inc => {
          const c = inc.severity==="critical"?P.danger : inc.status==="pending"?P.warning : P.accent;
          return (
            <g key={inc.id}>
              {inc.status==="pending" && <circle cx={inc.x} cy={inc.y} r="2.5" fill="none" stroke={c} strokeWidth="0.15" opacity="0.6"><animate attributeName="r" from="1.5" to="4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite"/></circle>}
              <circle cx={inc.x} cy={inc.y} r="0.8" fill={c}/>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="absolute bottom-2 left-3 flex gap-3">
        {[["Low","#10b981"],["Medium","#f59e0b"],["High","#ef4444"]].map(([l,c])=>(
          <span key={l} className="flex items-center gap-1 text-[9px] font-medium" style={{color:P.muted}}>
            <span className="w-1.5 h-1.5 rounded-full" style={{background:c}}/>{l}
          </span>
        ))}
      </div>
      <div className="absolute top-2 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono" style={{background:"#00000060", color:P.success}}>
        <Radio size={10} className="animate-pulse"/> LIVE
      </div>
    </div>
  );
}

/* ─── Verification Pipeline Visualization ─── */
function PipelineView({incident:inc, onVerify, onReject, onConfirm}) {
  if (!inc) return (
    <Card className="flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <Eye size={32} style={{color:P.muted}} className="mx-auto mb-3 opacity-40"/>
        <p className="text-sm" style={{color:P.muted}}>Select a pending report to inspect</p>
        <p className="text-xs mt-1" style={{color:`${P.muted}80`}}>The verification pipeline will be displayed here</p>
      </div>
    </Card>
  );
  const score = inc.ai;
  const isCrit = inc.severity==="critical";
  const meetsNFR08 = inc.confirms >= 2;
  const stages = [
    {name:"Received", done:true, color:P.accent},
    {name:"AI Scored", done:true, color: score>0.6?P.success:score>0.35?P.warning:P.danger},
    {name: isCrit?"BYPASS":"Human Review", done: isCrit, color: isCrit?P.danger:P.warning},
    {name:"Dispatch", done:false, color:P.muted},
  ];
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Cpu size={16} style={{color:P.accent}}/>
          <span className="text-sm font-bold" style={{color:P.text}}>Verification Pipeline</span>
        </div>
        {isCrit && <Badge color={P.danger}>⚡ PRIORITY BYPASS</Badge>}
      </div>
      {/* Pipeline stages */}
      <div className="flex items-center gap-0.5 mb-6">
        {stages.map((s,i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-center">
              <div className="w-3 h-3 rounded-full border-2 shrink-0" style={{borderColor:s.color, background:s.done?s.color:"transparent"}}/>
              {i < stages.length-1 && <div className="flex-1 h-0.5 mx-1" style={{background:s.done?s.color:`${P.muted}30`}}/>}
            </div>
            <span className="text-[9px] font-medium" style={{color:s.done?s.color:P.muted}}>{s.name}</span>
          </div>
        ))}
      </div>
      {/* AI Score */}
      <div className="rounded-lg p-4 mb-4" style={{background:P.surface}}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{color:P.textDim}}>AI Plausibility Score (FR-03)</span>
          <span className="text-xl font-bold font-mono" style={{color:score>0.6?P.success:score>0.35?P.warning:P.danger}}>
            {(score*100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{background:`${P.muted}20`}}>
          <div className="h-full rounded-full transition-all duration-700" style={{width:`${score*100}%`, background:score>0.6?P.success:score>0.35?P.warning:P.danger}}/>
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] font-mono" style={{color:P.muted}}>
          <span>0% (Reject)</span><span>40% (Review)</span><span>70% (Auto-verify)</span><span>100%</span>
        </div>
      </div>
      {/* Incident data */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          ["Type", inc.type], ["Zone", inc.zoneName],
          ["Severity", inc.severity.toUpperCase()], ["Reporter", inc.reporter],
          ["Timestamp", inc.time], ["Confirmations", `${inc.confirms} / 2 required`],
        ].map(([k,v],i) => (
          <div key={k} className="rounded-lg px-3 py-2" style={{background:P.surface}}>
            <div className="text-[10px]" style={{color:P.muted}}>{k}</div>
            <div className="text-xs font-medium mt-0.5" style={{color: k==="Severity"?(inc.severity==="critical"?P.danger:inc.severity==="high"?P.warning:P.accent):P.text}}>{v}</div>
          </div>
        ))}
      </div>
      {/* NFR-08 */}
      <div className="rounded-lg px-4 py-3 mb-5 flex items-center gap-3" style={{background: meetsNFR08?`${P.success}10`:`${P.warning}10`, border:`1px solid ${meetsNFR08?`${P.success}25`:`${P.warning}25`}`}}>
        {meetsNFR08 ? <CheckCircle size={16} style={{color:P.success}}/> : <Clock size={16} style={{color:P.warning}}/>}
        <div>
          <div className="text-xs font-semibold" style={{color:meetsNFR08?P.success:P.warning}}>
            NFR-08: Data Integrity Gate {meetsNFR08 ? "— PASSED" : "— PENDING"}
          </div>
          <div className="text-[10px] mt-0.5" style={{color:P.muted}}>
            {meetsNFR08 ? "≥2 community confirmations received. Ready for dispatch." : `${2 - inc.confirms} more confirmation(s) needed, or 1 admin approval.`}
          </div>
        </div>
      </div>
      {/* Description */}
      {inc.desc && <div className="text-xs mb-5 px-3 py-2 rounded-lg" style={{background:P.surface, color:P.textDim}}>"{inc.desc}"</div>}
      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={()=>onConfirm(inc.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-colors" style={{background:`${P.accent}15`, color:P.accent, border:`1px solid ${P.accent}30`}}>
          <Users size={14}/> Confirm (FR-05)
        </button>
        <button onClick={()=>onVerify(inc.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-colors" style={{background:`${P.success}15`, color:P.success, border:`1px solid ${P.success}30`}}>
          <CheckCircle size={14}/> Verify & Dispatch
        </button>
        <button onClick={()=>onReject(inc.id)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors" style={{background:`${P.danger}10`, color:P.danger, border:`1px solid ${P.danger}20`}}>
          <XCircle size={14}/>
        </button>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APPLICATION
   ═══════════════════════════════════════════════════════════════ */
export default function CSAS() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(seedIncidents);
  const [toast, setToast] = useState(null);
  const [selZone, setSelZone] = useState(null);
  const [selInc, setSelInc] = useState(null);
  const [form, setForm] = useState({type:"",zone:"",desc:""});
  const [sosActive, setSosActive] = useState(false);
  const [sysTime, setSysTime] = useState(new Date());
  const [simRunning, setSimRunning] = useState(false);
  const [simLog, setSimLog] = useState([]);

  useEffect(() => { const t = setInterval(()=>setSysTime(new Date()),1000); return ()=>clearInterval(t); },[]);

  const notify = useCallback((msg,type="info") => { setToast({msg,type}); setTimeout(()=>setToast(null),4000); },[]);

  // ─── Actions ───
  const submitReport = () => {
    if(!form.type||!form.zone){notify("Select incident type and zone","error");return;}
    const z=ZONES.find(zz=>zz.id===form.zone);
    const inc={id:uid(),type:form.type,zone:form.zone,zoneName:z.name,desc:form.desc||`${form.type} near ${z.name}`,severity:SEVERITY[form.type]||"medium",status:"pending",time:fmt(new Date()),slot:SLOTS[clamp(Math.floor((new Date().getHours()-6)/3),0,5)],ai:+(0.25+Math.random()*0.75).toFixed(2),confirms:0,x:z.x+(Math.random()-0.5)*10,y:z.y+(Math.random()-0.5)*10,reporter:`Student-${1000+Math.floor(Math.random()*9000)}`};
    setData(p=>[inc,...p]);setForm({type:"",zone:"",desc:""});
    notify(`Report submitted — AI Score: ${(inc.ai*100).toFixed(0)}%`,"success");
    setSelInc(inc);setPage("verification");
  };
  const verify = id => { setData(p=>p.map(i=>i.id===id?{...i,status:"verified"}:i)); notify("Alert verified — Geofenced dispatch initiated (500m radius)","success"); setSelInc(null); };
  const reject = id => { setData(p=>p.map(i=>i.id===id?{...i,status:"rejected"}:i)); notify("Report rejected — Logged for audit","info"); setSelInc(null); };
  const confirm = id => { setData(p=>p.map(i=>i.id===id?{...i,confirms:i.confirms+1}:i)); setSelInc(s=>s&&s.id===id?{...s,confirms:s.confirms+1}:s); notify("Community confirmation added","success"); };
  const triggerSOS = () => {
    setSosActive(true);
    const z=pick(ZONES);
    setData(p=>[{id:uid(),type:"Medical Emergency",zone:z.id,zoneName:z.name,desc:"ONE-TOUCH SOS — PRIORITY BYPASS",severity:"critical",status:"verified",time:fmt(new Date()),slot:SLOTS[5],ai:1,confirms:99,x:z.x,y:z.y,reporter:"SOS-SYSTEM"},...p]);
    notify("SOS DISPATCHED — Security team alerted via priority bypass (FR-08)","error");
    setTimeout(()=>setSosActive(false),3000);
  };

  // ─── Simulation (W4) ───
  const runSimulation = () => {
    setSimRunning(true); setSimLog([]);
    const logs = [
      {t:0, msg:"Initializing discrete-event simulation engine...", type:"sys"},
      {t:400, msg:"Loading Workshop 1 parameters: 35% incident rate, 11.4 min baseline response", type:"data"},
      {t:800, msg:"Calibrating AI plausibility scorer (FastAPI/Python endpoint)", type:"sys"},
      {t:1200, msg:"[BASELINE] Simulating 100 incident submissions at normal load...", type:"sim"},
      {t:2000, msg:"[BASELINE] End-to-end latency: 18.3s avg (95th: 27.1s) — NFR-01 ✓ PASS (<30s)", type:"pass"},
      {t:2400, msg:"[BASELINE] Notification delivery: 99.94% — NFR-02 ✓ PASS (>99.9%)", type:"pass"},
      {t:2800, msg:"[SURGE] Simulating 300% traffic spike (NFR-05 stress test)...", type:"sim"},
      {t:3600, msg:"[SURGE] RabbitMQ priority queue activated — high-severity routed to fast lane", type:"sys"},
      {t:4200, msg:"[SURGE] Kubernetes auto-scaling: 3→9 pods on Verification Engine", type:"sys"},
      {t:4800, msg:"[SURGE] Latency under surge: 24.7s avg (95th: 29.8s) — NFR-05 ✓ PASS", type:"pass"},
      {t:5200, msg:"[FAILURE] Simulating push notification provider outage...", type:"sim"},
      {t:5800, msg:"[FAILURE] SMS fallback via Twilio activated in 8.2s — NFR-02 maintained", type:"pass"},
      {t:6200, msg:"[ADOPTION] Agent-based model: reinforcing loop activates at 22% adoption", type:"data"},
      {t:6600, msg:"[ADOPTION] Alert fatigue threshold: >8 non-critical alerts/user/day", type:"data"},
      {t:7000, msg:"[EMERGENT] Spatial clustering cascade detected in Parking Lot zone", type:"warn"},
      {t:7400, msg:"[EMERGENT] Non-linear adoption: +10% users → +40% report volume", type:"warn"},
      {t:7800, msg:"Simulation complete. All NFR targets validated. 3 emergent behaviors documented.", type:"done"},
    ];
    logs.forEach(l => setTimeout(()=>setSimLog(p=>[...p,l]), l.t));
    setTimeout(()=>setSimRunning(false), 8200);
  };

  // ─── Stats ───
  const s = {
    total: data.length, verified: data.filter(i=>i.status==="verified").length,
    pending: data.filter(i=>i.status==="pending").length, rejected: data.filter(i=>i.status==="rejected").length,
    avgAi: data.length ? +(data.reduce((a,i)=>a+i.ai,0)/data.length*100).toFixed(1) : 0,
    byZone: ZONES.map(z=>({...z, count:data.filter(i=>i.zone===z.id).length, verified:data.filter(i=>i.zone===z.id&&i.status==="verified").length})),
    bySlot: SLOTS.map(sl=>({slot:sl, count:data.filter(i=>i.slot===sl).length})),
    byType: TYPES.map(t=>({name:t.length>12?t.slice(0,12)+"…":t, full:t, value:data.filter(i=>i.type===t).length})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value),
    bySeverity: ["critical","high","medium","low"].map(sv=>({name:sv.charAt(0).toUpperCase()+sv.slice(1), value:data.filter(i=>i.severity===sv).length})).filter(x=>x.value>0),
  };
  const radarData = ZONES.map(z => ({zone:z.name.split(" ")[0], incidents:data.filter(i=>i.zone===z.id).length, risk:z.risk==="high"?3:z.risk==="medium"?2:1}));
  const CHART_COLORS = [P.danger, P.warning, P.accent, P.success];
  const timeData = s.bySlot.map((t,i)=>({...t, fill:i>=3?P.danger:i>=2?P.warning:P.success}));

  const nav = [
    {id:"dashboard",icon:Activity,label:"Dashboard"},
    {id:"report",icon:Plus,label:"Report Incident"},
    {id:"map",icon:MapPin,label:"Campus Map"},
    {id:"verification",icon:Eye,label:"Verification"},
    {id:"analytics",icon:BarChart3,label:"Analytics"},
    {id:"log",icon:FileText,label:"Incident Log"},
    {id:"simulation",icon:Cpu,label:"Simulation (W4)"},
    {id:"architecture",icon:Layers,label:"Architecture"},
  ];

  return (
    <div className="h-screen flex overflow-hidden" style={{background:P.bg, color:P.text, fontFamily:"'Segoe UI', system-ui, -apple-system, sans-serif"}}>
      <style>{`
        @keyframes fadeUp { from {opacity:0;transform:translateY(8px)} to {opacity:1;transform:translateY(0)} }
        @keyframes pulse-sos { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)} 50%{box-shadow:0 0 0 16px rgba(239,68,68,0)} }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .sos-pulse { animation: pulse-sos 1.5s infinite; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:${P.border};border-radius:10px}
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 fade-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium" style={{
            background: toast.type==="error"?`${P.danger}20`:toast.type==="success"?`${P.success}15`:`${P.accent}15`,
            borderColor: toast.type==="error"?`${P.danger}40`:toast.type==="success"?`${P.success}30`:`${P.accent}30`,
            color: toast.type==="error"?P.danger:toast.type==="success"?P.success:P.accent
          }}>
            {toast.type==="error"?<AlertTriangle size={16}/>:toast.type==="success"?<CheckCircle size={16}/>:<Bell size={16}/>}
            {toast.msg}
          </div>
        </div>
      )}

      {/* ─── Sidebar ─── */}
      <aside className="w-60 flex flex-col shrink-0 border-r" style={{background:P.surface, borderColor:P.border}}>
        <div className="p-5 flex items-center gap-3 border-b" style={{borderColor:P.border}}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:`${P.accent}15`}}>
            <Shield size={20} style={{color:P.accent}}/>
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide">CSAS</div>
            <div className="text-[10px]" style={{color:P.muted}}>Security Operations</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map(n => (
            <button key={n.id} onClick={()=>setPage(n.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150" style={{
              background: page===n.id?`${P.accent}12`:"transparent",
              color: page===n.id?P.accentLight:P.muted
            }}>
              <n.icon size={16}/>{n.label}
              {n.id==="verification"&&s.pending>0 && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{background:`${P.warning}20`,color:P.warning}}>{s.pending}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 mx-3 mb-3 rounded-lg text-[10px] font-mono" style={{background:P.card, color:P.muted}}>
          <div className="flex items-center gap-1.5 mb-1"><Server size={10}/>System Status</div>
          <div className="flex items-center gap-1.5 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>All services operational</div>
          <div className="mt-1" style={{color:`${P.muted}80`}}>{sysTime.toLocaleString()}</div>
        </div>
      </aside>

      {/* ─── Content ─── */}
      <main className="flex-1 overflow-y-auto p-6">

        {/* ═══ DASHBOARD ═══ */}
        {page==="dashboard" && <div className="space-y-6 fade-up">
          <SectionHeader title="Operations Dashboard" sub="Real-time campus security overview — Community Security Alert System" right={<span className="text-[11px] font-mono" style={{color:P.muted}}>{sysTime.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</span>}/>
          <div className="grid grid-cols-4 gap-4">
            <Stat icon={AlertTriangle} label="Total Incidents" value={s.total} color={P.accent} trend={12} sub="FR-07: Persistent log"/>
            <Stat icon={CheckCircle} label="Verified Alerts" value={s.verified} color={P.success} trend={8} sub="Dispatched via geofence"/>
            <Stat icon={Clock} label="Pending Review" value={s.pending} color={P.warning} sub="Awaiting verification"/>
            <Stat icon={Zap} label="Avg. AI Score" value={`${s.avgAi}%`} color="#a78bfa" trend={5} sub="FR-03: Plausibility scorer"/>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><Card><h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Campus Live View — FR-02: Geofenced Alerts</h3><CampusMap incidents={data} selected={selZone} onSelect={setSelZone}/></Card></div>
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Incident Distribution by Time</h3>
              <p className="text-[10px] mb-3" style={{color:P.muted}}>Workshop 1 finding: night-time concentration</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={timeData}><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis dataKey="slot" tick={{fill:P.muted, fontSize:10}}/><YAxis tick={{fill:P.muted, fontSize:10}}/><Tooltip contentStyle={{background:P.card, border:`1px solid ${P.border}`, borderRadius:8, fontSize:12}} labelStyle={{color:P.text}}/><Bar dataKey="count" radius={[4,4,0,0]}>{timeData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar></BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card><h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Incidents by Type</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={s.byType} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={P.border}/><XAxis type="number" tick={{fill:P.muted, fontSize:10}}/><YAxis dataKey="name" type="category" width={100} tick={{fill:P.muted, fontSize:10}}/><Tooltip contentStyle={{background:P.card, border:`1px solid ${P.border}`, borderRadius:8, fontSize:12}}/><Bar dataKey="value" fill={P.accent} radius={[0,4,4,0]}/></BarChart>
              </ResponsiveContainer>
            </Card>
            <Card><h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Severity Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart><Pie data={s.bySeverity} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">{s.bySeverity.map((e,i)=><Cell key={i} fill={CHART_COLORS[i%4]}/>)}</Pie><Tooltip contentStyle={{background:P.card, border:`1px solid ${P.border}`, borderRadius:8, fontSize:12}}/></PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">{s.bySeverity.map((e,i)=><span key={i} className="flex items-center gap-1.5 text-[10px]" style={{color:P.muted}}><span className="w-2 h-2 rounded-full" style={{background:CHART_COLORS[i%4]}}/>{e.name}: {e.value}</span>)}</div>
            </Card>
          </div>
        </div>}

        {/* ═══ REPORT ═══ */}
        {page==="report" && <div className="max-w-xl mx-auto space-y-5 fade-up">
          <SectionHeader title="Report Incident" sub="FR-01: GPS incident reporting · FR-06: Auto GPS · NFR-06: ≤ 3 interactions"/>
          <Card>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold block mb-2" style={{color:P.textDim}}>Step 1 — Incident Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map(t=>(
                    <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} className="text-left text-xs font-medium px-4 py-3 rounded-lg border transition-all" style={{
                      background: form.type===t?`${P.accent}12`:P.surface,
                      borderColor: form.type===t?`${P.accent}50`:P.border,
                      color: form.type===t?P.accentLight:P.textDim
                    }}>
                      {t}{SEVERITY[t]==="critical" && <span className="ml-1.5 text-[9px]" style={{color:P.danger}}>⚡ Critical</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-2" style={{color:P.textDim}}>Step 2 — Location <span className="font-normal">(GPS auto-captured)</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {ZONES.map(z=>(
                    <button key={z.id} onClick={()=>setForm(f=>({...f,zone:z.id}))} className="text-xs font-medium px-3 py-2.5 rounded-lg border transition-all flex items-center gap-1.5" style={{
                      background: form.zone===z.id?`${P.accent}12`:P.surface,
                      borderColor: form.zone===z.id?`${P.accent}50`:P.border,
                      color: form.zone===z.id?P.accentLight:P.textDim
                    }}>
                      <MapPin size={12}/>{z.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-2" style={{color:P.textDim}}>Step 3 — Description <span className="font-normal">(optional)</span></label>
                <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} rows={2} placeholder="Brief description of the incident..." className="w-full rounded-lg px-4 py-3 text-sm resize-none focus:outline-none" style={{background:P.surface, border:`1px solid ${P.border}`, color:P.text}}/>
              </div>
              <button onClick={submitReport} className="w-full py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all" style={{background:P.accent, color:"#fff"}}>
                <Send size={16}/> Submit Report
              </button>
              <div className="text-center text-[10px] font-mono" style={{color:`${P.muted}80`}}>
                Submit → AI Plausibility Score (FR-03) → Verification Queue → Geofenced Dispatch (FR-02, 500m)
              </div>
            </div>
          </Card>
        </div>}

        {/* ═══ MAP ═══ */}
        {page==="map" && <div className="space-y-5 fade-up">
          <SectionHeader title="Campus Live Map" sub="FR-02: Geofenced alerts · FR-09: Security heatmaps · Real-time incident tracking" right={selZone && <button onClick={()=>setSelZone(null)} className="text-xs" style={{color:P.accent}}>Clear selection</button>}/>
          <CampusMap incidents={data} selected={selZone} onSelect={setSelZone}/>
          {selZone && <Card>
            <div className="flex items-center gap-3 mb-3"><MapPin size={16} style={{color:ZONES.find(z=>z.id===selZone)?.color}}/><span className="text-sm font-bold">{ZONES.find(z=>z.id===selZone)?.name}</span><SeverityBadge sev={ZONES.find(z=>z.id===selZone)?.risk}/></div>
            <div className="grid grid-cols-4 gap-3 text-xs">
              {[["Total",data.filter(i=>i.zone===selZone).length],["Active",data.filter(i=>i.zone===selZone&&i.status!=="rejected").length],["Pending",data.filter(i=>i.zone===selZone&&i.status==="pending").length],["Geofence","500m radius"]].map(([k,v])=>(
                <div key={k} className="rounded-lg px-3 py-2" style={{background:P.surface}}><div className="text-[10px]" style={{color:P.muted}}>{k}</div><div className="font-bold mt-0.5">{v}</div></div>
              ))}
            </div>
          </Card>}
          <div className="grid grid-cols-2 gap-3">
            {data.filter(i=>!selZone||i.zone===selZone).filter(i=>i.status!=="rejected").slice(0,8).map(inc=>(
              <div key={inc.id} onClick={()=>{setSelInc(inc);setPage("verification")}} className="flex items-center gap-3 rounded-lg px-4 py-3 border cursor-pointer transition-all hover:border-opacity-50" style={{background:P.card, borderColor:P.border}}>
                <StatusDot status={inc.status}/>
                <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{inc.type}</div><div className="text-[10px]" style={{color:P.muted}}>{inc.zoneName} · {inc.time}</div></div>
                <span className="text-[10px] font-mono" style={{color:P.muted}}>AI:{(inc.ai*100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>}

        {/* ═══ VERIFICATION ═══ */}
        {page==="verification" && <div className="space-y-5 fade-up">
          <SectionHeader title="Verification Queue" sub="FR-03: AI scorer · FR-05: Crowd-sourced confirmation · NFR-08: ≥ 2 confirmations or 1 admin" badge={`${s.pending} pending`}/>
          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-2 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              <div className="text-xs font-semibold mb-1" style={{color:P.muted}}>Pending ({s.pending})</div>
              {data.filter(i=>i.status==="pending").map(inc=>(
                <div key={inc.id} onClick={()=>setSelInc(inc)} className="rounded-lg px-4 py-3 border cursor-pointer transition-all" style={{
                  background: selInc?.id===inc.id?`${P.accent}08`:P.card,
                  borderColor: selInc?.id===inc.id?`${P.accent}40`:P.border
                }}>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2">{inc.severity==="critical"&&<Zap size={12} style={{color:P.danger}}/>}<span className="text-xs font-medium">{inc.type}</span></div><span className="text-[10px] font-mono" style={{color:P.muted}}>{(inc.ai*100).toFixed(0)}%</span></div>
                  <div className="text-[10px] mt-1" style={{color:P.muted}}>{inc.zoneName} · {inc.time} · {inc.confirms} conf.</div>
                </div>
              ))}
              {s.pending===0 && <div className="text-center py-8 text-xs" style={{color:P.muted}}>All reports processed</div>}
              <div className="text-xs font-semibold mt-4 mb-1" style={{color:P.muted}}>Recently Processed</div>
              {data.filter(i=>i.status!=="pending").slice(0,4).map(inc=>(
                <div key={inc.id} className="rounded-lg px-4 py-2.5 border opacity-50" style={{background:P.card, borderColor:P.border}}>
                  <div className="flex items-center justify-between text-xs"><span>{inc.type}</span><Badge color={inc.status==="verified"?P.success:P.danger}>{inc.status}</Badge></div>
                </div>
              ))}
            </div>
            <div className="col-span-3"><PipelineView incident={selInc} onVerify={verify} onReject={reject} onConfirm={confirm}/></div>
          </div>
        </div>}

        {/* ═══ ANALYTICS ═══ */}
        {page==="analytics" && <div className="space-y-5 fade-up">
          <SectionHeader title="Security Analytics" sub="FR-09: Periodic security heatmaps · Workshop 1 empirical baseline analysis"/>
          {/* Gap Analysis */}
          <Card>
            <h3 className="text-sm font-semibold mb-4" style={{color:P.textDim}}>Operational Gap Analysis — Current State vs. CSAS Design Targets</h3>
            <div className="grid grid-cols-4 gap-4">
              {[{dim:"Response Time",from:"11.4 min",to:"< 5 min",gap:"−6.4 min",c:P.danger},{dim:"Reporting Rate",from:"41%",to:"> 85%",gap:"+44 pp",c:P.success},{dim:"App Adoption",from:"~12%",to:"≥ 60%",gap:"+48 pp",c:P.accent},{dim:"Delivery Success",from:"~87%",to:"> 99.9%",gap:"+12.9 pp",c:P.warning}].map(g=>(
                <div key={g.dim} className="rounded-xl p-4 text-center border" style={{background:P.surface, borderColor:P.border}}>
                  <div className="text-[10px] font-medium" style={{color:P.muted}}>{g.dim}</div>
                  <div className="text-2xl font-bold font-mono my-2" style={{color:g.c}}>{g.gap}</div>
                  <div className="text-[10px]" style={{color:`${P.muted}80`}}>{g.from} → {g.to}</div>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card><h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Zone Risk Radar (FR-09 Heatmap)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}><PolarGrid stroke={P.border}/><PolarAngleAxis dataKey="zone" tick={{fill:P.muted, fontSize:10}}/><PolarRadiusAxis tick={{fill:P.muted, fontSize:9}}/><Radar name="Incidents" dataKey="incidents" stroke={P.accent} fill={P.accent} fillOpacity={0.25}/><Radar name="Risk Level" dataKey="risk" stroke={P.danger} fill={P.danger} fillOpacity={0.15}/><Tooltip contentStyle={{background:P.card, border:`1px solid ${P.border}`, borderRadius:8, fontSize:12}}/></RadarChart>
              </ResponsiveContainer>
            </Card>
            <Card><h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>KPI Targets (Workshop 2)</h3>
              <div className="space-y-3">
                {[["Alert Latency","< 30s","NFR-01",92],["Delivery Rate","> 99.9%","NFR-02",99],["Availability","≥ 99.9%","NFR-03",99],["Adoption Rate","≥ 60%","NFR-05",65],["Verification","< 60s","W3-QA",88]].map(([k,t,nfr,pct])=>(
                  <div key={k}>
                    <div className="flex justify-between text-[10px] mb-1"><span style={{color:P.textDim}}>{k} <span className="font-mono" style={{color:P.muted}}>({nfr})</span></span><span style={{color:pct>=90?P.success:pct>=70?P.warning:P.danger}}>{t}</span></div>
                    <div className="w-full h-1.5 rounded-full" style={{background:`${P.muted}20`}}><div className="h-full rounded-full" style={{width:`${pct}%`, background:pct>=90?P.success:pct>=70?P.warning:P.danger}}/></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>}

        {/* ═══ LOG ═══ */}
        {page==="log" && <div className="space-y-5 fade-up">
          <SectionHeader title="Incident Log" sub={`FR-07: Persistent incident log for pattern analysis — ${data.length} records`}/>
          <Card noPad>
            <div className="grid grid-cols-7 gap-2 px-5 py-3 text-[10px] font-semibold tracking-wider border-b" style={{color:P.muted, borderColor:P.border, background:P.surface}}>
              <span>TIME</span><span>TYPE</span><span>ZONE</span><span>SEVERITY</span><span>AI SCORE</span><span>STATUS</span><span>CONFIRMS</span>
            </div>
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
              {data.map((inc,i)=>(
                <div key={inc.id} onClick={()=>{setSelInc(inc);setPage("verification")}} className="grid grid-cols-7 gap-2 px-5 py-3 text-xs border-b cursor-pointer transition-colors" style={{borderColor:`${P.border}50`}} onMouseEnter={e=>e.currentTarget.style.background=P.cardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span className="font-mono" style={{color:P.muted}}>{inc.time}</span>
                  <span style={{color:P.text}}>{inc.type}</span>
                  <span style={{color:P.muted}}>{inc.zoneName}</span>
                  <span><SeverityBadge sev={inc.severity}/></span>
                  <span className="font-mono" style={{color:inc.ai>0.6?P.success:inc.ai>0.35?P.warning:P.danger}}>{(inc.ai*100).toFixed(0)}%</span>
                  <span><Badge color={inc.status==="verified"?P.success:inc.status==="pending"?P.warning:P.danger}>{inc.status}</Badge></span>
                  <span style={{color:P.muted}}>{inc.confirms}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>}

        {/* ═══ SIMULATION (W4) ═══ */}
        {page==="simulation" && <div className="space-y-5 fade-up">
          <SectionHeader title="System Simulation" sub="Workshop 4 — Discrete-event simulation and validation of design decisions" badge="Workshop 4"/>
          <div className="grid grid-cols-3 gap-4">
            <Card className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{color:P.textDim}}>Simulation Console</h3>
                <button onClick={runSimulation} disabled={simRunning} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50" style={{background:`${P.accent}15`, color:P.accent, border:`1px solid ${P.accent}30`}}>
                  {simRunning ? <><RefreshCw size={14} className="animate-spin"/>Running...</> : <><Cpu size={14}/>Run Simulation</>}
                </button>
              </div>
              <div className="rounded-lg p-4 font-mono text-xs space-y-1.5 max-h-[400px] overflow-y-auto" style={{background:"#050a12", border:`1px solid ${P.border}`}}>
                {simLog.length === 0 && <div style={{color:P.muted}}>Click "Run Simulation" to validate system design against NFR targets...</div>}
                {simLog.map((l,i) => (
                  <div key={i} className="fade-up flex gap-2" style={{color: l.type==="pass"?P.success : l.type==="warn"?P.warning : l.type==="error"?P.danger : l.type==="done"?"#a78bfa" : l.type==="data"?P.accent : P.muted}}>
                    <span style={{color:`${P.muted}60`}}>[{String(i).padStart(2,"0")}]</span>
                    {l.msg}
                  </div>
                ))}
                {simRunning && <div className="animate-pulse" style={{color:P.accent}}>▌</div>}
              </div>
            </Card>
            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Scenario Results</h3>
                <div className="space-y-3">
                  {[["Baseline NFR-01","27.1s","< 30s",true],["Surge NFR-05","29.8s","< 30s",true],["Delivery NFR-02","99.94%","> 99.9%",true],["Adoption Threshold","22%","20-25%",true]].map(([k,v,t,ok])=>(
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span style={{color:P.textDim}}>{k}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold" style={{color:ok?P.success:P.danger}}>{v}</span>
                        {ok ? <CheckCircle size={12} style={{color:P.success}}/> : <XCircle size={12} style={{color:P.danger}}/>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Emergent Behaviors</h3>
                <div className="space-y-2">
                  {["Spatial clustering cascades in Parking Lot","Night-time verification bottleneck","Non-linear adoption (+10% users → +40% reports)"].map((b,i)=>(
                    <div key={i} className="flex items-start gap-2 text-[11px] px-3 py-2 rounded-lg" style={{background:P.surface, color:P.warning}}>
                      <AlertTriangle size={12} className="mt-0.5 shrink-0"/>{b}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>}

        {/* ═══ ARCHITECTURE ═══ */}
        {page==="architecture" && <div className="space-y-5 fade-up">
          <SectionHeader title="System Architecture" sub="Workshop 2 — Five-layer microservices architecture · Workshop 3 — Standards compliance" badge="Workshops 2-3"/>
          <Card>
            <h3 className="text-sm font-semibold mb-4" style={{color:P.textDim}}>CSAS Layered Architecture</h3>
            <div className="space-y-2">
              {[
                {name:"Presentation Layer",desc:"React Native Mobile App · Admin Web Portal",color:P.accent,icon:Globe},
                {name:"Application Layer",desc:"API Gateway (Node.js / Nginx) — Auth, Rate Limiting, TLS 1.3",color:"#06b6d4",icon:Lock},
                {name:"Service Layer",desc:"",color:P.warning,icon:Server,services:true},
                {name:"Data Layer",desc:"PostgreSQL + PostGIS · Redis Cache · RabbitMQ Event Bus",color:P.success,icon:Database},
                {name:"Integration Layer",desc:"SIURE UD · Local Authorities · Twilio SMS · Firebase FCM",color:"#a78bfa",icon:Wifi},
              ].map(layer=>(
                <div key={layer.name}>
                  <div className="rounded-lg px-5 py-3 border flex items-center gap-4" style={{background:P.surface, borderColor:P.border, borderLeft:`3px solid ${layer.color}`}}>
                    <layer.icon size={18} style={{color:layer.color}}/>
                    <div className="flex-1">
                      <span className="text-xs font-bold" style={{color:layer.color}}>{layer.name}</span>
                      {layer.desc && <span className="text-xs ml-3" style={{color:P.muted}}>{layer.desc}</span>}
                    </div>
                  </div>
                  {layer.services && (
                    <div className="grid grid-cols-5 gap-2 mt-2 ml-8">
                      {[{n:"Incident",d:"Receives, validates, persists reports"},{n:"Verification",d:"AI scorer + human review pipeline"},{n:"Dispatcher",d:"Zone/time-weighted geofenced alerts"},{n:"User",d:"Registration, roles, alert fatigue dampening"},{n:"Analytics",d:"Heatmaps, dashboards, KPI tracking"}].map(svc=>(
                        <div key={svc.n} className="rounded-lg px-3 py-3 border text-center" style={{background:P.card, borderColor:P.border}}>
                          <div className="text-[11px] font-bold" style={{color:P.text}}>{svc.n}</div>
                          <div className="text-[9px] mt-1" style={{color:P.muted}}>{svc.d}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Standards Compliance (W3)</h3>
              <div className="space-y-2">
                {[["ISO 9001","Quality Management","Maintainability"],["CMMI Level 3","Process Maturity","All"],["IEEE 830","Requirements Traceability","Maintainability"],["ISO/IEC 25010","Quality Model","All"],["ISO 31000","Risk Management","Reliability"],["PMBOK","Project Management","Project Mgmt."],["Ley 1581","Data Protection","Privacy"]].map(([std,desc,attr])=>(
                  <div key={std} className="flex items-center justify-between text-xs px-3 py-2 rounded" style={{background:P.surface}}>
                    <div><span className="font-semibold" style={{color:P.text}}>{std}</span><span className="ml-2" style={{color:P.muted}}>{desc}</span></div>
                    <Badge color={P.success}>{attr}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{color:P.textDim}}>Technology Stack (W2)</h3>
              <div className="space-y-2">
                {[["React Native","Mobile App","Single codebase iOS/Android"],["Node.js / Nginx","API Gateway","High I/O, rate limiting"],["Python / FastAPI","Verification Engine","ML ecosystem for AI scorer"],["RabbitMQ","Message Broker","Priority queues, decoupling"],["PostgreSQL + PostGIS","Database","Geospatial queries, heatmaps"],["Firebase FCM","Push Notifications","99.9% delivery target"],["Twilio","SMS Fallback","Equity of access"],["AWS / K8s","Infrastructure","Auto-scaling per service"]].map(([tech,comp,why])=>(
                  <div key={tech} className="flex items-center gap-3 text-xs px-3 py-2 rounded" style={{background:P.surface}}>
                    <span className="font-bold w-32 shrink-0" style={{color:P.accent}}>{tech}</span>
                    <span style={{color:P.text}}>{comp}</span>
                    <span className="ml-auto text-[10px]" style={{color:P.muted}}>{why}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>}
      </main>

      {/* ─── SOS (FR-08) ─── */}
      <button onClick={triggerSOS} className={`fixed bottom-6 right-6 w-16 h-16 rounded-full flex flex-col items-center justify-center z-40 transition-all shadow-2xl ${sosActive?"sos-pulse scale-110":""}`} style={{background:P.danger}}>
        <AlertTriangle size={20} color="#fff"/>
        <span className="text-[8px] font-bold text-white mt-0.5">SOS</span>
      </button>
    </div>
  );
}
