import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  PlayCircle,
  ShieldCheck,
  UserCheck,
  Users,
  PauseCircle,
  Eye,
  Bot,
  Timer,
  Download,
  ChevronRight,
  FileText,
  FastForward,
  SlidersHorizontal,
  SplitSquareHorizontal,
  Settings2,
  Bell,
  PanelLeftClose,
  Activity,
  RefreshCw,
  Presentation,
  Layers3,
  Workflow,
  Database,
  MonitorSmartphone,
  Wrench,
} from "lucide-react";

const queueStats = [
  { label: "Ready for Bot", value: 42, icon: PlayCircle },
  { label: "In Progress", value: 11, icon: Bot },
  { label: "Waiting Review", value: 18, icon: UserCheck },
  { label: "Exceptions", value: 7, icon: AlertTriangle },
  { label: "Completed Today", value: 126, icon: CheckCircle2 },
  { label: "Timed Out", value: 2, icon: PauseCircle },
];

const cases = [
  {
    id: "EIN-240318-001",
    company: "SimpleBiz Agent LLC",
    legalName: "SimpleBiz Agent LLC",
    status: "waiting_review",
    priority: "normal",
    state: "CA",
    county: "Los Angeles",
    responsibleParty: "Robert Hammond",
    botWorker: "Bot-04",
    age: "2m ago",
    stage: "Review & Submit",
    confidence: 99,
    issueCount: 0,
    agentAction: "Approve Submit",
    reviewerType: "reviewer",
    sourceValues: {
      legalName: "SimpleBiz Agent LLC",
      state: "CA",
      county: "Los Angeles",
      responsibleParty: "Robert Hammond",
      businessActivity: "Other > Service > Reg Agent Services",
      reason: "Started a new business",
      address: "23224 Crenshaw Blvd, Torrance, CA 90505",
      phone: "888-298-8845",
    },
    irsValues: {
      legalName: "SimpleBiz Agent LLC",
      state: "CA",
      county: "Los Angeles",
      responsibleParty: "Robert Hammond",
      businessActivity: "Other > Service > Reg Agent Services",
      reason: "Started a new business",
      address: "23224 Crenshaw Blvd, Torrance, CA 90505",
      phone: "888-298-8845",
    },
    mismatches: [],
  },
  {
    id: "EIN-240318-002",
    company: "Pacific Filing Services LLC",
    legalName: "Pacific Filing Services LLC",
    status: "exception",
    priority: "high",
    state: "CA",
    county: "Orange",
    responsibleParty: "Melissa Tran",
    botWorker: "Bot-02",
    age: "6m ago",
    stage: "Additional Details",
    confidence: 82,
    issueCount: 2,
    agentAction: "Resolve Exception",
    reviewerType: "specialist",
    sourceValues: {
      legalName: "Pacific Filing Services LLC",
      state: "CA",
      county: "Los Angeles",
      responsibleParty: "Melissa Tran",
      businessActivity: "Other > Service",
      reason: "Started a new business",
      address: "4100 Birch St, Newport Beach, CA 92660",
      phone: "949-555-0134",
    },
    irsValues: {
      legalName: "Pacific Filing Services LLC",
      state: "CA",
      county: "Orange",
      responsibleParty: "Melissa Tran",
      businessActivity: "Other > Service",
      reason: "Started a new business",
      address: "4100 Birch St, Newport Beach, CA 92660",
      phone: "949-555-0134",
    },
    mismatches: [
      "Business activity description too generic for submission guard rails.",
      "County from source record differs from county on state filing extract.",
    ],
  },
  {
    id: "EIN-240318-003",
    company: "Desert Registered Agent Co",
    legalName: "Desert Registered Agent Co",
    status: "in_progress",
    priority: "normal",
    state: "AZ",
    county: "Maricopa",
    responsibleParty: "Daniel Perez",
    botWorker: "Bot-01",
    age: "1m ago",
    stage: "Addresses",
    confidence: 96,
    issueCount: 0,
    agentAction: "Monitor",
    reviewerType: "reviewer",
    sourceValues: {
      legalName: "Desert Registered Agent Co",
      state: "AZ",
      county: "Maricopa",
      responsibleParty: "Daniel Perez",
      businessActivity: "Other > Service > Registered Agent Services",
      reason: "Started a new business",
      address: "7420 E Pinnacle Peak Rd, Scottsdale, AZ 85255",
      phone: "602-555-0182",
    },
    irsValues: {
      legalName: "Desert Registered Agent Co",
      state: "AZ",
      county: "Maricopa",
      responsibleParty: "Daniel Perez",
      businessActivity: "Other > Service > Registered Agent Services",
      reason: "Started a new business",
      address: "7420 E Pinnacle Peak Rd, Scottsdale, AZ 85255",
      phone: "602-555-0182",
    },
    mismatches: [],
  },
  {
    id: "EIN-240318-004",
    company: "Northwest Business Support LLC",
    legalName: "Northwest Business Support LLC",
    status: "completed",
    priority: "normal",
    state: "WA",
    county: "King",
    responsibleParty: "Amber Cole",
    botWorker: "Bot-03",
    age: "14m ago",
    stage: "EIN Assigned",
    confidence: 100,
    issueCount: 0,
    agentAction: "View Completion",
    reviewerType: "reviewer",
    sourceValues: {
      legalName: "Northwest Business Support LLC",
      state: "WA",
      county: "King",
      responsibleParty: "Amber Cole",
      businessActivity: "Other > Service > Registered Agent Services",
      reason: "Started a new business",
      address: "1201 3rd Ave, Seattle, WA 98101",
      phone: "206-555-0121",
    },
    irsValues: {
      legalName: "Northwest Business Support LLC",
      state: "WA",
      county: "King",
      responsibleParty: "Amber Cole",
      businessActivity: "Other > Service > Registered Agent Services",
      reason: "Started a new business",
      address: "1201 3rd Ave, Seattle, WA 98101",
      phone: "206-555-0121",
    },
    mismatches: [],
  },
  {
    id: "EIN-240318-005",
    company: "Mountain State Filings LLC",
    legalName: "Mountain State Filings LLC",
    status: "waiting_review",
    priority: "normal",
    state: "UT",
    county: "Salt Lake",
    responsibleParty: "Erin Blake",
    botWorker: "Bot-06",
    age: "4m ago",
    stage: "Review & Submit",
    confidence: 97,
    issueCount: 0,
    agentAction: "Approve Submit",
    reviewerType: "reviewer",
    sourceValues: {
      legalName: "Mountain State Filings LLC",
      state: "UT",
      county: "Salt Lake",
      responsibleParty: "Erin Blake",
      businessActivity: "Other > Service > Registered Agent Services",
      reason: "Started a new business",
      address: "210 Main St, Salt Lake City, UT 84101",
      phone: "801-555-0191",
    },
    irsValues: {
      legalName: "Mountain State Filings LLC",
      state: "UT",
      county: "Salt Lake",
      responsibleParty: "Erin Blake",
      businessActivity: "Other > Service > Registered Agent Services",
      reason: "Started a new business",
      address: "210 Main St, Salt Lake City, UT 84101",
      phone: "801-555-0191",
    },
    mismatches: [],
  },
  {
    id: "EIN-240318-006",
    company: "Sunbelt Entity Services LLC",
    legalName: "Sunbelt Entity Services LLC",
    status: "ready",
    priority: "normal",
    state: "TX",
    county: "Dallas",
    responsibleParty: "Chris Morgan",
    botWorker: "Unassigned",
    age: "just now",
    stage: "Ready for Bot",
    confidence: 95,
    issueCount: 0,
    agentAction: "Queue for Bot",
    reviewerType: "reviewer",
    sourceValues: {
      legalName: "Sunbelt Entity Services LLC",
      state: "TX",
      county: "Dallas",
      responsibleParty: "Chris Morgan",
      businessActivity: "Other > Service > Registered Agent Services",
      reason: "Started a new business",
      address: "500 Elm St, Dallas, TX 75202",
      phone: "972-555-0122",
    },
    irsValues: {
      legalName: "Sunbelt Entity Services LLC",
      state: "TX",
      county: "Dallas",
      responsibleParty: "Chris Morgan",
      businessActivity: "Other > Service > Registered Agent Services",
      reason: "Started a new business",
      address: "500 Elm St, Dallas, TX 75202",
      phone: "972-555-0122",
    },
    mismatches: [],
  },
];

const timeline = [
  { time: "09:14:02", label: "Case created from intake payload" },
  { time: "09:14:09", label: "Validation checks passed" },
  { time: "09:14:15", label: "Assigned to Bot-04" },
  { time: "09:15:34", label: "Identity step completed" },
  { time: "09:16:22", label: "IRS Step 4 completed" },
  { time: "09:16:49", label: "Review page captured and hashed" },
  { time: "09:16:55", label: "Queued for live agent approval" },
];

const artifacts = [
  "IRS Review Screenshot",
  "Step 1 Screenshot",
  "Step 2 Screenshot",
  "Step 3 Screenshot",
  "Browser Trace",
  "Normalized Payload JSON",
  "Validation Report",
];

const architectureCards = [
  {
    title: "Intake + Validation",
    subtitle: "Structured source-of-truth payload",
    icon: Database,
    text: "Normalize formation data into a strict EIN case payload before any browser automation starts.",
  },
  {
    title: "Queue + Orchestration",
    subtitle: "Controls workers and routing",
    icon: Workflow,
    text: "Manage ready, in-progress, review, exception, and completed states while enforcing throttles and retries.",
  },
  {
    title: "Playwright Workers",
    subtitle: "Deterministic browser execution",
    icon: MonitorSmartphone,
    text: "Bots fill IRS steps, capture screenshots, pause for review, and resume only after approval.",
  },
  {
    title: "Agent Console",
    subtitle: "Single-screen live review",
    icon: Users,
    text: "Reviewers approve clean cases quickly while specialists resolve mismatches and source-data exceptions.",
  },
  {
    title: "Artifacts + Audit",
    subtitle: "Evidence and replay trail",
    icon: Layers3,
    text: "Store review screenshots, traces, payload hashes, validation reports, and completion evidence for every run.",
  },
  {
    title: "Admin + Settings",
    subtitle: "Operational controls",
    icon: Wrench,
    text: "Workflow options, permissions, thresholds, and queue rules should be configurable outside code where practical.",
  },
];

function statusMeta(status) {
  switch (status) {
    case "waiting_review":
      return { label: "Waiting Review", color: "#a16207", bg: "#fef3c7", dot: "#d97706" };
    case "in_progress":
      return { label: "In Progress", color: "#1d4ed8", bg: "#dbeafe", dot: "#2563eb" };
    case "exception":
      return { label: "Exception", color: "#b91c1c", bg: "#fee2e2", dot: "#dc2626" };
    case "completed":
      return { label: "Completed", color: "#047857", bg: "#d1fae5", dot: "#10b981" };
    case "ready":
      return { label: "Ready", color: "#334155", bg: "#e2e8f0", dot: "#64748b" };
    default:
      return { label: status, color: "#475569", bg: "#f1f5f9", dot: "#94a3b8" };
  }
}

function badgeStyle(bg, color) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    background: bg,
    color,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid rgba(15,23,42,0.08)",
    whiteSpace: "nowrap",
  };
}

function cardStyle() {
  return {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
  };
}

function buttonStyle(primary = false) {
  return {
    height: 42,
    padding: "0 16px",
    borderRadius: 14,
    border: primary ? "none" : "1px solid #cbd5e1",
    background: primary
      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      : "#fff",
    color: primary ? "#fff" : "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function softPanelStyle() {
  return {
    background: "#f8fafc",
    borderRadius: 18,
    padding: 16,
    border: "1px solid #e2e8f0",
  };
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div style={{ ...cardStyle(), padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{stat.label}</div>
          <div style={{ marginTop: 10, fontSize: 34, fontWeight: 800, color: "#0f172a" }}>{stat.value}</div>
        </div>
        <div
          style={{
            background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: 16,
            padding: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e2e8f0",
          }}
        >
          <Icon size={20} color="#334155" />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#64748b",
      }}
    >
      {children}
    </div>
  );
}

function TabButton({ label, value, tab, setTab }) {
  const active = tab === value;
  return (
    <button
      onClick={() => setTab(value)}
      style={{
        ...buttonStyle(active),
        textTransform: "capitalize",
      }}
    >
      {label}
    </button>
  );
}

function CompareRow({ label, source, irs }) {
  const mismatch = source !== irs;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr 1fr 100px",
        gap: 12,
        alignItems: "start",
        padding: "12px 0",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div style={{ color: "#64748b", fontWeight: 700, fontSize: 13 }}>{label}</div>
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 10,
          fontSize: 13,
        }}
      >
        {source}
      </div>
      <div
        style={{
          background: mismatch ? "#fef2f2" : "#f8fafc",
          border: `1px solid ${mismatch ? "#fecaca" : "#e2e8f0"}`,
          borderRadius: 12,
          padding: 10,
          fontSize: 13,
        }}
      >
        {irs}
      </div>
      <div>
        <span
          style={badgeStyle(
            mismatch ? "#fee2e2" : "#dcfce7",
            mismatch ? "#b91c1c" : "#166534"
          )}
        >
          {mismatch ? "Mismatch" : "Match"}
        </span>
      </div>
    </div>
  );
}

function NavButton({ icon: Icon, label }) {
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "#fff",
        color: "#0f172a",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function ArchitectureCard({ item }) {
  const Icon = item.icon;
  return (
    <div style={{ ...cardStyle(), padding: 18 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          background: "#f1f5f9",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={18} color="#334155" />
      </div>
      <div style={{ marginTop: 14, fontWeight: 800, fontSize: 16 }}>{item.title}</div>
      <div style={{ marginTop: 4, fontSize: 13, color: "#64748b", fontWeight: 700 }}>
        {item.subtitle}
      </div>
      <div style={{ marginTop: 10, fontSize: 14, color: "#475569", lineHeight: 1.5 }}>
        {item.text}
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("EIN-240318-001");
  const [tab, setTab] = useState("review");
  const [queueFilter, setQueueFilter] = useState("all");
  const [mode, setMode] = useState("reviewer");
  const [showSettings, setShowSettings] = useState(true);
  const [presentationMode, setPresentationMode] = useState(true);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cases.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.responsibleParty.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.county.toLowerCase().includes(q);

      const matchesQueue =
        queueFilter === "all" ? true : item.status === queueFilter;

      const matchesMode =
        mode === "reviewer"
          ? item.reviewerType === "reviewer" || item.status !== "exception"
          : true;

      return matchesSearch && matchesQueue && matchesMode;
    });
  }, [search, queueFilter, mode]);

  const selected =
    filtered.find((item) => item.id === selectedId) || filtered[0] || cases[0];
  const meta = statusMeta(selected.status);

  const reviewQueue = filtered.filter((c) => c.status === "waiting_review");
  const nextCase = reviewQueue[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: presentationMode
          ? "radial-gradient(circle at top left, #eef2ff 0%, #f8fafc 35%, #f8fafc 100%)"
          : "#f8fafc",
        color: "#0f172a",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: 1680, margin: "0 auto", padding: 24 }}>
        <div
          style={{
            ...cardStyle(),
            padding: 18,
            marginBottom: 20,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#64748b",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  SimpleBiz EIN Automation
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>
                  Live Agent Ops Console
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button style={{ ...buttonStyle(false), width: 42, padding: 0 }}>
                <Bell size={16} />
              </button>
              <button style={{ ...buttonStyle(false), width: 42, padding: 0 }}>
                <RefreshCw size={16} />
              </button>
              <button
                onClick={() => setPresentationMode((v) => !v)}
                style={buttonStyle(false)}
              >
                <Presentation size={16} style={{ marginRight: 8 }} />
                {presentationMode ? "Ops View" : "Presentation View"}
              </button>
              <button style={buttonStyle(false)}>
                <Settings2 size={16} style={{ marginRight: 8 }} />
                Workflow Settings
              </button>
              <button style={buttonStyle(true)}>
                <FastForward size={16} style={{ marginRight: 8 }} />
                Open Next Review
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 24 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#64748b",
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                <Activity size={16} />
                Final demo build for UI review, workflow validation, and developer handoff
              </div>
              <h1 style={{ fontSize: 40, margin: "0 0 8px", lineHeight: 1.06 }}>
                Version 5 · Demo + Developer Handoff Workspace
              </h1>
              <p style={{ maxWidth: 980, color: "#475569", fontSize: 16 }}>
                Final polished demo with presentation-grade layout, clearer fake data labeling,
                embedded architecture summary, and a stronger handoff story for engineering.
              </p>
            </div>

            <div
              style={{
                ...cardStyle(),
                padding: 16,
                minWidth: 340,
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
              }}
            >
              <SectionLabel>Handoff Summary</SectionLabel>
              <div style={{ display: "grid", gap: 10, marginTop: 14, fontSize: 14, color: "#475569" }}>
                <div>• Single-screen review is the default operator pattern.</div>
                <div>• Source vs IRS comparison supports exception resolution.</div>
                <div>• Reviewer and specialist modes should separate permissions.</div>
                <div>• Queue controls and workflow settings should become configurable admin options.</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gap: 16,
            marginBottom: 22,
          }}
        >
          {queueStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div
          style={{
            ...cardStyle(),
            padding: 18,
            marginBottom: 22,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["all", "All"],
              ["ready", "Ready"],
              ["in_progress", "In Progress"],
              ["waiting_review", "Waiting Review"],
              ["exception", "Exceptions"],
              ["completed", "Completed"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setQueueFilter(value)}
                style={{
                  ...buttonStyle(queueFilter === value),
                  height: 38,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Mode</span>
            <button
              onClick={() => setMode("reviewer")}
              style={{ ...buttonStyle(mode === "reviewer"), height: 38 }}
            >
              Reviewer
            </button>
            <button
              onClick={() => setMode("specialist")}
              style={{ ...buttonStyle(mode === "specialist"), height: 38 }}
            >
              Specialist
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: showSettings ? "220px 390px 1fr" : "390px 1fr",
            gap: 24,
          }}
        >
          {showSettings && (
            <div style={{ display: "grid", gap: 16, alignSelf: "start", position: "sticky", top: 24 }}>
              <div style={{ ...cardStyle(), padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <SectionLabel>Quick Nav</SectionLabel>
                  <button
                    onClick={() => setShowSettings(false)}
                    style={{ ...buttonStyle(false), width: 34, height: 34, padding: 0 }}
                  >
                    <PanelLeftClose size={14} />
                  </button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <NavButton icon={FastForward} label="Next Review Case" />
                  <NavButton icon={SplitSquareHorizontal} label="Source Compare" />
                  <NavButton icon={SlidersHorizontal} label="Queue Rules" />
                  <NavButton icon={FileText} label="Export Report" />
                </div>
              </div>

              <div style={{ ...cardStyle(), padding: 16 }}>
                <SectionLabel>Workflow Options</SectionLabel>
                <div style={{ display: "grid", gap: 14, marginTop: 14, fontSize: 14, color: "#475569" }}>
                  <label style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>Auto-open next clean case</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>Require approval note</span>
                    <input type="checkbox" />
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>Always show comparison tab</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>Escalate mismatches to specialist</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                </div>
              </div>

              <div style={{ ...cardStyle(), padding: 16 }}>
                <SectionLabel>Demo Notes</SectionLabel>
                <div style={{ display: "grid", gap: 10, marginTop: 14, fontSize: 13, color: "#475569" }}>
                  <div>All company names, IDs, and values here are demo placeholders for UI review.</div>
                  <div>The live build should source this from structured EIN case records.</div>
                </div>
              </div>
            </div>
          )}

          {!showSettings && (
            <button
              onClick={() => setShowSettings(true)}
              style={{
                position: "fixed",
                left: 18,
                bottom: 18,
                ...buttonStyle(true),
                zIndex: 20,
              }}
            >
              <Settings2 size={16} style={{ marginRight: 8 }} />
              Open Settings
            </button>
          )}

          <div style={{ display: "grid", gap: 16, alignSelf: "start" }}>
            <div
              style={{
                ...cardStyle(),
                padding: 18,
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
              }}
            >
              <SectionLabel>Fast Review Queue</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                <div style={softPanelStyle()}>
                  <div style={{ fontSize: 30, fontWeight: 800 }}>{reviewQueue.length}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    Cases waiting for human approval
                  </div>
                </div>
                <div style={softPanelStyle()}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>
                    {nextCase ? nextCase.company : "No review cases"}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    {nextCase ? `${nextCase.id} · ${nextCase.age}` : "Queue is clear"}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...cardStyle(), padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <h2 style={{ margin: 0, fontSize: 22 }}>Agent Queue</h2>
                <div style={badgeStyle("#fff", "#334155")}>{filtered.length} visible</div>
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search
                    size={16}
                    color="#94a3b8"
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search case, party, state..."
                    style={{
                      width: "100%",
                      height: 42,
                      borderRadius: 14,
                      border: "1px solid #cbd5e1",
                      padding: "0 14px 0 36px",
                      outline: "none",
                      fontSize: 14,
                    }}
                  />
                </div>
                <button style={{ ...buttonStyle(false), width: 42, padding: 0 }}>
                  <Filter size={16} />
                </button>
              </div>

              <div style={{ display: "grid", gap: 12, maxHeight: 980, overflow: "auto", paddingRight: 4 }}>
                {filtered.map((item) => {
                  const itemMeta = statusMeta(item.status);
                  const isSelected = selected.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      style={{
                        textAlign: "left",
                        width: "100%",
                        borderRadius: 20,
                        border: isSelected ? "1px solid #0f172a" : "1px solid #e2e8f0",
                        background: isSelected
                          ? "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
                          : "#fff",
                        padding: 16,
                        cursor: "pointer",
                        boxShadow: isSelected ? "0 10px 18px rgba(15,23,42,0.06)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14 }}>{item.company}</div>
                          <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>
                            {item.id} · {item.state} · {item.county}
                          </div>
                        </div>
                        <ChevronRight size={16} color="#94a3b8" />
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                        <div style={badgeStyle(itemMeta.bg, itemMeta.color)}>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 999,
                              background: itemMeta.dot,
                              display: "inline-block",
                            }}
                          />
                          {itemMeta.label}
                        </div>
                        <div
                          style={badgeStyle(
                            item.priority === "high" ? "#fee2e2" : "#fff",
                            item.priority === "high" ? "#b91c1c" : "#334155"
                          )}
                        >
                          {item.priority === "high" ? "High Priority" : "Normal"}
                        </div>
                        <div style={badgeStyle("#fff", "#334155")}>{item.stage}</div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                        <div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>Responsible Party</div>
                          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700 }}>
                            {item.responsibleParty}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>Bot Worker</div>
                          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700 }}>{item.botWorker}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 12 }}>
                        <div style={{ color: "#64748b" }}>Age: {item.age}</div>
                        <div style={{ fontWeight: 700 }}>{item.issueCount} issues</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <div
              style={{
                ...cardStyle(),
                padding: 24,
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 30 }}>{selected.company}</h2>
                    <div style={badgeStyle(meta.bg, meta.color)}>{meta.label}</div>
                    <div style={badgeStyle("#fff", "#334155")}>{selected.id}</div>
                    <div style={badgeStyle("#eef2ff", "#4338ca")}>Demo Data</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 24,
                      flexWrap: "wrap",
                      marginTop: 14,
                      fontSize: 14,
                      color: "#475569",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Bot size={16} /> {selected.botWorker}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Users size={16} /> {selected.responsibleParty}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Timer size={16} /> Age {selected.age}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: 10 }}>
                  <button style={buttonStyle(true)}>Approve Submit</button>
                  <button style={buttonStyle(false)}>Send to Exception</button>
                  <button style={buttonStyle(false)}>Retry Bot</button>
                  <button style={buttonStyle(false)}>Hold Case</button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 14,
                  marginTop: 22,
                }}
              >
                <div style={{ background: "#f1f5f9", borderRadius: 18, padding: 16 }}>
                  <SectionLabel>Confidence</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800 }}>{selected.confidence}%</div>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 18, padding: 16 }}>
                  <SectionLabel>Current Stage</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>{selected.stage}</div>
                  <div style={{ marginTop: 8, color: "#64748b", fontSize: 14 }}>
                    Guard rails passed through current step.
                  </div>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 18, padding: 16 }}>
                  <SectionLabel>Issues</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800 }}>{selected.issueCount}</div>
                  <div style={{ marginTop: 8, color: "#64748b", fontSize: 14 }}>
                    Exceptions or mismatches requiring attention.
                  </div>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 18, padding: 16 }}>
                  <SectionLabel>Recommended Action</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>{selected.agentAction}</div>
                  <div style={{ marginTop: 8, color: "#64748b", fontSize: 14 }}>
                    Based on current validation and bot status.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <TabButton label="review" value="review" tab={tab} setTab={setTab} />
              <TabButton label="comparison" value="comparison" tab={tab} setTab={setTab} />
              <TabButton label="exceptions" value="exceptions" tab={tab} setTab={setTab} />
              <TabButton label="timeline" value="timeline" tab={tab} setTab={setTab} />
              <TabButton label="artifacts" value="artifacts" tab={tab} setTab={setTab} />
              <TabButton label="architecture" value="architecture" tab={tab} setTab={setTab} />
            </div>

            {tab === "review" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
                <div style={{ ...cardStyle(), padding: 24 }}>
                  <h3 style={{ marginTop: 0, fontSize: 24 }}>Live Agent Review Screen</h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                      marginTop: 18,
                    }}
                  >
                    <div style={softPanelStyle()}>
                      <SectionLabel>Entity Details</SectionLabel>
                      <div style={{ marginTop: 16, display: "grid", gap: 12, fontSize: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Legal name</span>
                          <strong>{selected.legalName}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>State</span>
                          <strong>{selected.state}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>County</span>
                          <strong>{selected.county}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Reason</span>
                          <strong>{selected.sourceValues.reason}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={softPanelStyle()}>
                      <SectionLabel>Responsible Party</SectionLabel>
                      <div style={{ marginTop: 16, display: "grid", gap: 12, fontSize: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Name</span>
                          <strong>{selected.responsibleParty}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Role</span>
                          <strong>Owner / Managing Member</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Identity status</span>
                          <strong>Validated pre-run</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>One-per-day check</span>
                          <strong>Passed</strong>
                        </div>
                      </div>
                    </div>

                    <div style={softPanelStyle()}>
                      <SectionLabel>Address + Contact</SectionLabel>
                      <div style={{ marginTop: 16, display: "grid", gap: 12, fontSize: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Physical address</span>
                          <strong style={{ textAlign: "right" }}>{selected.sourceValues.address}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Phone</span>
                          <strong>{selected.sourceValues.phone}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Mailing</span>
                          <strong>Same as physical</strong>
                        </div>
                      </div>
                    </div>

                    <div style={softPanelStyle()}>
                      <SectionLabel>Business Activity</SectionLabel>
                      <div style={{ marginTop: 16, display: "grid", gap: 12, fontSize: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Category</span>
                          <strong style={{ textAlign: "right" }}>
                            {selected.sourceValues.businessActivity}
                          </strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Employees</span>
                          <strong>No</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ color: "#64748b" }}>Excise / ATF / Gambling</span>
                          <strong>No / No / No</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      border: "1px dashed #cbd5e1",
                      borderRadius: 22,
                      background: "#f8fafc",
                      padding: 18,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div>
                        <SectionLabel>IRS Review Page Preview</SectionLabel>
                        <div style={{ marginTop: 8, color: "#475569", fontSize: 14 }}>
                          This is where the live agent confirms the bot-captured review page without
                          working directly inside the IRS site.
                        </div>
                      </div>
                      <button style={buttonStyle(false)}>
                        <Eye size={16} style={{ marginRight: 8 }} />
                        Open Full Screenshot
                      </button>
                    </div>

                    <div
                      style={{
                        marginTop: 18,
                        border: "1px solid #e2e8f0",
                        borderRadius: 20,
                        background: "#fff",
                        padding: 20,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 800 }}>Review & Submit Snapshot</div>
                          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                            Captured by bot at 09:16:49 · hash verified
                          </div>
                        </div>
                        <div style={badgeStyle("#fff", "#334155")}>Read Only</div>
                      </div>

                      <div style={{ display: "grid", gap: 14, fontSize: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #e2e8f0",
                            paddingBottom: 10,
                          }}
                        >
                          <span style={{ color: "#64748b" }}>Organization type</span>
                          <strong>Single Member Limited Liability Company (LLC)</strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #e2e8f0",
                            paddingBottom: 10,
                          }}
                        >
                          <span style={{ color: "#64748b" }}>Legal name</span>
                          <strong>{selected.irsValues.legalName}</strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #e2e8f0",
                            paddingBottom: 10,
                          }}
                        >
                          <span style={{ color: "#64748b" }}>Responsible party</span>
                          <strong>{selected.irsValues.responsibleParty}</strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #e2e8f0",
                            paddingBottom: 10,
                          }}
                        >
                          <span style={{ color: "#64748b" }}>Business activity</span>
                          <strong>{selected.irsValues.businessActivity}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#64748b" }}>Reason for applying</span>
                          <strong>{selected.irsValues.reason}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ ...cardStyle(), padding: 24 }}>
                  <h3 style={{ marginTop: 0, fontSize: 24 }}>Approval Panel</h3>

                  <div
                    style={{
                      border: `1px solid ${selected.mismatches.length ? "#fecaca" : "#bbf7d0"}`,
                      background: selected.mismatches.length ? "#fef2f2" : "#f0fdf4",
                      borderRadius: 18,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      {selected.mismatches.length ? (
                        <AlertTriangle size={18} color="#dc2626" style={{ marginTop: 2 }} />
                      ) : (
                        <CheckCircle2 size={18} color="#16a34a" style={{ marginTop: 2 }} />
                      )}
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            color: selected.mismatches.length ? "#991b1b" : "#166534",
                          }}
                        >
                          {selected.mismatches.length
                            ? "Mismatch attention required"
                            : "Guard rails currently passed"}
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 14,
                            color: selected.mismatches.length ? "#991b1b" : "#166534",
                          }}
                        >
                          {selected.mismatches.length
                            ? "Source and IRS values differ. Specialist review is recommended before submit."
                            : "No source-to-review mismatches detected for this case."}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ ...softPanelStyle(), marginTop: 16 }}>
                    <SectionLabel>Fast Actions</SectionLabel>
                    <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                      <button style={buttonStyle(true)}>Approve and Resume Bot Submission</button>
                      <button style={buttonStyle(false)}>Approve and Open Next Case</button>
                      <button style={buttonStyle(false)}>Reject to Exception Queue</button>
                      <button style={buttonStyle(false)}>Request Source Data Edit</button>
                    </div>
                  </div>

                  <div style={{ ...softPanelStyle(), marginTop: 16 }}>
                    <SectionLabel>Agent Checklist</SectionLabel>
                    <div style={{ display: "grid", gap: 12, marginTop: 14, fontSize: 14 }}>
                      {[
                        "Legal name matches source-of-truth record",
                        "Responsible party matches validated intake",
                        "Address and state fields look correct",
                        "Business activity is specific enough",
                        "Reason for applying is correct",
                      ].map((item) => (
                        <div key={item} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <CheckCircle2 size={16} color="#16a34a" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ ...softPanelStyle(), marginTop: 16 }}>
                    <SectionLabel>Routing</SectionLabel>
                    <div style={{ marginTop: 12, display: "grid", gap: 10, fontSize: 14, color: "#475569" }}>
                      <div>Reviewer Mode: clean approvals and quick triage</div>
                      <div>Specialist Mode: mismatches, edits, escalations</div>
                      <div>Queue filter controls what work is shown on left</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "comparison" && (
              <div style={{ ...cardStyle(), padding: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: 24 }}>Source vs IRS Comparison</h3>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={buttonStyle(false)}>
                      <FileText size={16} style={{ marginRight: 8 }} />
                      Export Comparison
                    </button>
                    <button style={buttonStyle(false)}>
                      <Eye size={16} style={{ marginRight: 8 }} />
                      Open Source Record
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr 1fr 100px",
                    gap: 12,
                    padding: "0 0 12px",
                    borderBottom: "2px solid #e2e8f0",
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  <div>Field</div>
                  <div>Source Record</div>
                  <div>IRS Review</div>
                  <div>Status</div>
                </div>

                <CompareRow label="Legal Name" source={selected.sourceValues.legalName} irs={selected.irsValues.legalName} />
                <CompareRow label="State" source={selected.sourceValues.state} irs={selected.irsValues.state} />
                <CompareRow label="County" source={selected.sourceValues.county} irs={selected.irsValues.county} />
                <CompareRow label="Responsible Party" source={selected.sourceValues.responsibleParty} irs={selected.irsValues.responsibleParty} />
                <CompareRow label="Business Activity" source={selected.sourceValues.businessActivity} irs={selected.irsValues.businessActivity} />
                <CompareRow label="Reason" source={selected.sourceValues.reason} irs={selected.irsValues.reason} />
                <CompareRow label="Address" source={selected.sourceValues.address} irs={selected.irsValues.address} />
                <CompareRow label="Phone" source={selected.sourceValues.phone} irs={selected.irsValues.phone} />
              </div>
            )}

            {tab === "exceptions" && (
              <div style={{ ...cardStyle(), padding: 24 }}>
                <h3 style={{ marginTop: 0, fontSize: 24 }}>Exception Handling Workspace</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
                  <div style={{ display: "grid", gap: 14 }}>
                    {(selected.mismatches.length
                      ? selected.mismatches
                      : ["No active exceptions for this case."]
                    ).map((issue, index) => (
                      <div
                        key={index}
                        style={{
                          border: `1px solid ${selected.mismatches.length ? "#fecaca" : "#bbf7d0"}`,
                          background: selected.mismatches.length ? "#fef2f2" : "#f0fdf4",
                          borderRadius: 18,
                          padding: 16,
                        }}
                      >
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          {selected.mismatches.length ? (
                            <AlertTriangle size={18} color="#dc2626" style={{ marginTop: 2 }} />
                          ) : (
                            <CheckCircle2 size={18} color="#16a34a" style={{ marginTop: 2 }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 800 }}>
                              {selected.mismatches.length ? `Issue ${index + 1}` : "Clean case"}
                            </div>
                            <div style={{ marginTop: 6, fontSize: 14, color: "#334155" }}>{issue}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gap: 14 }}>
                    <div style={softPanelStyle()}>
                      <SectionLabel>Suggested Resolution</SectionLabel>
                      <div style={{ marginTop: 10, fontSize: 14, color: "#334155" }}>
                        Route county mismatch to source-data editor and require agent confirmation
                        before requeue.
                      </div>
                    </div>

                    <div style={softPanelStyle()}>
                      <SectionLabel>Specialist Actions</SectionLabel>
                      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                        <button style={buttonStyle(true)}>Assign to Specialist</button>
                        <button style={buttonStyle(false)}>Edit Source Data</button>
                        <button style={buttonStyle(false)}>Requeue Case</button>
                        <button style={buttonStyle(false)}>Cancel Filing</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "timeline" && (
              <div style={{ ...cardStyle(), padding: 24 }}>
                <h3 style={{ marginTop: 0, fontSize: 24 }}>Bot Timeline + Session State</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
                  <div style={{ display: "grid", gap: 12 }}>
                    {timeline.map((item) => (
                      <div
                        key={`${item.time}-${item.label}`}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 18,
                          padding: 16,
                          display: "flex",
                          gap: 16,
                        }}
                      >
                        <div style={{ minWidth: 72, fontSize: 14, fontWeight: 700, color: "#64748b" }}>
                          {item.time}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{item.label}</div>
                          <div style={{ marginTop: 4, fontSize: 14, color: "#64748b" }}>
                            {selected.botWorker} · IRS EIN application session
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gap: 14 }}>
                    <div style={softPanelStyle()}>
                      <SectionLabel>Session Health</SectionLabel>
                      <div style={{ marginTop: 10, fontSize: 28, fontWeight: 800 }}>Healthy</div>
                      <div style={{ marginTop: 8, fontSize: 14, color: "#64748b" }}>
                        9m 12s remaining before inactivity timeout.
                      </div>
                    </div>

                    <div style={softPanelStyle()}>
                      <SectionLabel>Worker Controls</SectionLabel>
                      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                        <button style={buttonStyle(false)}>Pause Session</button>
                        <button style={buttonStyle(false)}>Refresh Heartbeat</button>
                        <button style={buttonStyle(false)}>Move to Safe Hold</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "artifacts" && (
              <div style={{ ...cardStyle(), padding: 24 }}>
                <h3 style={{ marginTop: 0, fontSize: 24 }}>Artifacts + Audit Trail</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  {artifacts.map((item) => (
                    <div
                      key={item}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 18,
                        padding: 16,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{item}</div>
                          <div style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                            Stored for audit and replay review.
                          </div>
                        </div>
                        <button style={{ ...buttonStyle(false), width: 42, padding: 0 }}>
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "architecture" && (
              <div style={{ ...cardStyle(), padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <div>
                    <h3 style={{ marginTop: 0, fontSize: 24 }}>System Architecture Summary</h3>
                    <div style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                      Embedded handoff summary for the engineering team implementing the real system.
                    </div>
                  </div>
                  <button style={buttonStyle(false)}>
                    <Layers3 size={16} style={{ marginRight: 8 }} />
                    Export Handoff Notes
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 16,
                    marginTop: 18,
                  }}
                >
                  {architectureCards.map((item) => (
                    <ArchitectureCard key={item.title} item={item} />
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ ...cardStyle(), padding: 24 }}>
                <h3 style={{ marginTop: 0, fontSize: 22 }}>Operational Notes</h3>
                <div style={{ display: "grid", gap: 14, fontSize: 14, color: "#475569" }}>
                  <div>
                    This mock is designed around a single-screen agent workflow rather than
                    having reviewers work directly in the IRS browser.
                  </div>
                  <div>
                    Clean cases should take under one minute of human review. Exception cases are
                    routed into a specialist workflow with explicit actions.
                  </div>
                  <div>
                    Bot control actions are surfaced in the same console so operations teams can
                    approve, retry, pause, and audit without switching tools.
                  </div>
                </div>
              </div>

              <div style={{ ...cardStyle(), padding: 24 }}>
                <h3 style={{ marginTop: 0, fontSize: 22 }}>Developer Handoff Notes</h3>
                <div style={{ display: "grid", gap: 10, fontSize: 14, color: "#475569" }}>
                  <div>1. Preserve the single-screen review pattern as the default workflow.</div>
                  <div>2. Keep source comparison highly visible for exception and mismatch cases.</div>
                  <div>3. Separate reviewer and specialist permission sets at the action layer.</div>
                  <div>4. Keep queue filters, quick actions, and workflow settings configurable.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}