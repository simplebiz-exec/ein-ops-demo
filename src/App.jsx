import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FastForward,
  Filter,
  PlayCircle,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Timer,
  UserCheck,
  Users,
  PauseCircle,
} from "lucide-react";

/* -------------------- CONFIG -------------------- */

const AUTO_CONFIDENCE_THRESHOLD = 97;

/* -------------------- MOCK DATA -------------------- */

const queueStats = [
  { label: "Ready for Bot", value: 42, icon: PlayCircle },
  { label: "Waiting Review", value: 18, icon: UserCheck },
  { label: "Exceptions", value: 7, icon: AlertTriangle },
  { label: "Completed Today", value: 126, icon: CheckCircle2 },
  { label: "Auto Submitted", value: 88, icon: CheckCircle2 },
  { label: "Timed Out", value: 2, icon: PauseCircle },
];

const initialCases = [
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
    reviewType: "submission",
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
    reviewType: "exception",
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
      "County from source record differs from county on IRS review.",
      "Business activity description is too generic for auto approval.",
    ],
  },
  {
    id: "EIN-240318-003",
    company: "Desert Registered Agent Co",
    legalName: "Desert Registered Agent Co",
    status: "exception",
    priority: "normal",
    state: "AZ",
    county: "Maricopa",
    responsibleParty: "Daniel Perez",
    botWorker: "Bot-01",
    age: "8m ago",
    stage: "Address Review",
    confidence: 91,
    issueCount: 1,
    reviewType: "exception",
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
      address: "7420 E Pinnacle Peak Rd, Scottsdale, AZ 85256",
      phone: "602-555-0182",
    },
    mismatches: ["Address mismatch between source and IRS review."],
  },
  {
    id: "EIN-240318-004",
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
    reviewType: "submission",
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
    id: "EIN-240318-005",
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
    reviewType: "submission",
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
  {
    id: "EIN-240318-006",
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
    reviewType: "completed",
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
];

/* -------------------- HELPERS -------------------- */

function statusMeta(status) {
  switch (status) {
    case "waiting_review":
      return { label: "Waiting Review", color: "#a16207", bg: "#fef3c7" };
    case "exception":
      return { label: "Exception", color: "#b91c1c", bg: "#fee2e2" };
    case "completed":
      return { label: "Completed", color: "#047857", bg: "#d1fae5" };
    case "ready":
      return { label: "Ready", color: "#334155", bg: "#e2e8f0" };
    default:
      return { label: status, color: "#475569", bg: "#f1f5f9" };
  }
}

function queueLabel(queue) {
  switch (queue) {
    case "submission":
      return "Submission Review Queue";
    case "exception":
      return "Exception Queue";
    case "completed":
      return "Completed Queue";
    default:
      return "Queue";
  }
}

function autoEligible(item) {
  return item.mismatches.length === 0 && item.confidence >= AUTO_CONFIDENCE_THRESHOLD;
}

function cardStyle() {
  return {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
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

function buttonStyle(primary = false) {
  return {
    height: 42,
    padding: "0 16px",
    borderRadius: 14,
    border: primary ? "none" : "1px solid #cbd5e1",
    background: primary ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "#fff",
    color: primary ? "#fff" : "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function inputStyle() {
  return {
    width: "100%",
    height: 42,
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    padding: "0 12px",
    outline: "none",
    fontSize: 14,
    background: "#fff",
  };
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

function fieldLabel(label) {
  return label.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

/* -------------------- REUSABLE UI -------------------- */

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div style={{ ...cardStyle(), padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{stat.label}</div>
          <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800 }}>{stat.value}</div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
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

function QueueCard({ title, subtitle, count, selected, onClick, tone = "default", icon: Icon }) {
  const tones = {
    default: { bg: "#fff", border: "#e2e8f0", color: "#0f172a" },
    review: { bg: "#fffbeb", border: "#fde68a", color: "#92400e" },
    exception: { bg: "#fef2f2", border: "#fecaca", color: "#991b1b" },
    completed: { bg: "#ecfdf5", border: "#bbf7d0", color: "#166534" },
  };
  const t = tones[tone] || tones.default;

  return (
    <button
      onClick={onClick}
      style={{
        ...cardStyle(),
        background: selected ? t.bg : "#fff",
        border: `1px solid ${selected ? t.border : "#e2e8f0"}`,
        padding: 18,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: t.color }}>{title}</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>{subtitle}</div>
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <Icon size={18} />
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 30, fontWeight: 800 }}>{count}</div>
    </button>
  );
}

function EntityListItem({ item, selected, onClick, systemMode }) {
  const meta = statusMeta(item.status);
  const canAuto = autoEligible(item);

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 16,
        borderRadius: 18,
        border: selected ? "1px solid #0f172a" : "1px solid #e2e8f0",
        background: selected ? "#f8fafc" : "#fff",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{item.company}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>
            {item.id} · {item.state} · {item.county}
          </div>
        </div>
        <ChevronRight size={16} color="#94a3b8" />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        <div style={badgeStyle(meta.bg, meta.color)}>{meta.label}</div>
        <div style={badgeStyle(item.priority === "high" ? "#fee2e2" : "#fff", item.priority === "high" ? "#b91c1c" : "#334155")}>
          {item.priority === "high" ? "High Priority" : "Normal"}
        </div>
        {systemMode === "auto" && canAuto && <div style={badgeStyle("#dcfce7", "#166534")}>Auto Eligible</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>Responsible Party</div>
          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700 }}>{item.responsibleParty}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>Bot Worker</div>
          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700 }}>{item.botWorker}</div>
        </div>
      </div>
    </button>
  );
}

/* -------------------- SCREENS -------------------- */

function HomeScreen({
  cases,
  selectedQueue,
  setSelectedQueue,
  selectedId,
  setSelectedId,
  systemMode,
  setSystemMode,
  search,
  setSearch,
  openSelectedCase,
}) {
  const queueCounts = {
    submission: cases.filter((c) => c.reviewType === "submission" && c.status === "waiting_review").length,
    exception: cases.filter((c) => c.reviewType === "exception" || c.status === "exception").length,
    completed: cases.filter((c) => c.status === "completed").length,
  };

  const queueCases = useMemo(() => {
    let filtered = cases;

    if (selectedQueue === "submission") {
      filtered = filtered.filter((c) => c.reviewType === "submission" && c.status === "waiting_review");
      if (systemMode === "auto") {
        filtered = filtered.filter((c) => !autoEligible(c));
      }
    } else if (selectedQueue === "exception") {
      filtered = filtered.filter((c) => c.reviewType === "exception" || c.status === "exception");
    } else if (selectedQueue === "completed") {
      filtered = filtered.filter((c) => c.status === "completed");
    }

    const q = search.toLowerCase().trim();
    if (!q) return filtered;

    return filtered.filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.responsibleParty.toLowerCase().includes(q)
    );
  }, [cases, selectedQueue, systemMode, search]);

  const selected = queueCases.find((c) => c.id === selectedId) || queueCases[0] || null;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ ...cardStyle(), padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setSystemMode("auto")} style={buttonStyle(systemMode === "auto")}>
            🟢 Auto Mode
          </button>
          <button onClick={() => setSystemMode("review")} style={buttonStyle(systemMode === "review")}>
            🔵 Review Mode
          </button>
        </div>
        <div style={{ color: "#475569", fontSize: 14 }}>
          {systemMode === "auto"
            ? `Only non-clean cases appear for human work. Clean cases auto-submit at ${AUTO_CONFIDENCE_THRESHOLD}% confidence or higher.`
            : "All review-stage cases require human approval before submission."}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 16 }}>
        {queueStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <QueueCard
          title="Submission Review Queue"
          subtitle="Cases awaiting submission review"
          count={queueCounts.submission}
          selected={selectedQueue === "submission"}
          onClick={() => setSelectedQueue("submission")}
          tone="review"
          icon={UserCheck}
        />
        <QueueCard
          title="Exception Queue"
          subtitle="Specialist fixes and resubmission"
          count={queueCounts.exception}
          selected={selectedQueue === "exception"}
          onClick={() => setSelectedQueue("exception")}
          tone="exception"
          icon={AlertTriangle}
        />
        <QueueCard
          title="Completed Queue"
          subtitle="Reference and historical items"
          count={queueCounts.completed}
          selected={selectedQueue === "completed"}
          onClick={() => setSelectedQueue("completed")}
          tone="completed"
          icon={CheckCircle2}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 24 }}>
        <div style={{ ...cardStyle(), padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>{queueLabel(selectedQueue)}</h2>
            <div style={badgeStyle("#fff", "#334155")}>{queueCases.length} visible</div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={16}
                color="#94a3b8"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company or EIN..."
                style={{ ...inputStyle(), paddingLeft: 36 }}
              />
            </div>
            <button style={{ ...buttonStyle(false), width: 42, padding: 0 }}>
              <Filter size={16} />
            </button>
          </div>

          <div style={{ display: "grid", gap: 12, maxHeight: 760, overflow: "auto", paddingRight: 4 }}>
            {queueCases.map((item) => (
              <EntityListItem
                key={item.id}
                item={item}
                selected={selected?.id === item.id}
                onClick={() => setSelectedId(item.id)}
                systemMode={systemMode}
              />
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle(), padding: 24 }}>
          {selected ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 28 }}>{selected.company}</h2>
                    <div style={badgeStyle(statusMeta(selected.status).bg, statusMeta(selected.status).color)}>
                      {statusMeta(selected.status).label}
                    </div>
                    {systemMode === "auto" && autoEligible(selected) && (
                      <div style={badgeStyle("#dcfce7", "#166534")}>Auto Eligible</div>
                    )}
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 18, flexWrap: "wrap", color: "#475569", fontSize: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Bot size={16} /> {selected.botWorker}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Users size={16} /> {selected.responsibleParty}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Clock3 size={16} /> {selected.age}
                    </div>
                  </div>
                </div>

                <button style={buttonStyle(true)} onClick={() => openSelectedCase(selected)}>
                  <Eye size={16} style={{ marginRight: 8 }} />
                  Open Full Screen
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 22 }}>
                <div style={softPanelStyle()}>
                  <SectionLabel>Stage</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800 }}>{selected.stage}</div>
                </div>
                <div style={softPanelStyle()}>
                  <SectionLabel>Confidence</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800 }}>{selected.confidence}%</div>
                </div>
                <div style={softPanelStyle()}>
                  <SectionLabel>Issues</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800 }}>{selected.issueCount}</div>
                </div>
                <div style={softPanelStyle()}>
                  <SectionLabel>Work Type</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800 }}>
                    {selected.reviewType === "exception" ? "Fix + Submit" : "Review + Submit"}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: "#64748b" }}>No entities in this queue.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewScreen({ item, systemMode, onBack }) {
  const canAuto = autoEligible(item);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <button style={buttonStyle(false)} onClick={onBack}>
          <ArrowLeft size={16} style={{ marginRight: 8 }} />
          Back to Home
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={buttonStyle(false)}>
            <RefreshCw size={16} style={{ marginRight: 8 }} />
            Refresh Review
          </button>
          <button style={buttonStyle(true)}>
            <Send size={16} style={{ marginRight: 8 }} />
            {systemMode === "auto" && canAuto ? "Auto Submit" : "Approve and Submit"}
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle(), padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontSize: 32 }}>{item.company}</h1>
              <div style={badgeStyle(statusMeta(item.status).bg, statusMeta(item.status).color)}>
                {statusMeta(item.status).label}
              </div>
              {systemMode === "auto" && canAuto && (
                <div style={badgeStyle("#dcfce7", "#166534")}>Auto Eligible</div>
              )}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 18, flexWrap: "wrap", color: "#475569", fontSize: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bot size={16} /> {item.botWorker}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={16} /> {item.responsibleParty}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Timer size={16} /> {item.age}
              </div>
            </div>
          </div>

          <div style={{ minWidth: 300, ...softPanelStyle() }}>
            <SectionLabel>Decision</SectionLabel>
            <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800 }}>
              {systemMode === "auto" && canAuto ? "Auto submission allowed" : "Human approval required"}
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>
              {systemMode === "auto"
                ? `Auto Mode requires ${AUTO_CONFIDENCE_THRESHOLD}% confidence and zero mismatches.`
                : "Review Mode requires a human to approve before submit."}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ ...cardStyle(), padding: 24 }}>
          <h3 style={{ marginTop: 0, fontSize: 22 }}>Source Record</h3>
          <div style={{ display: "grid", gap: 14, marginTop: 16, fontSize: 14 }}>
            {Object.entries(item.sourceValues).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  paddingBottom: 10,
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <span style={{ color: "#64748b" }}>{fieldLabel(key)}</span>
                <strong style={{ textAlign: "right" }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle(), padding: 24 }}>
          <h3 style={{ marginTop: 0, fontSize: 22 }}>IRS Review Snapshot</h3>
          <div style={{ display: "grid", gap: 14, marginTop: 16, fontSize: 14 }}>
            {Object.entries(item.irsValues).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  paddingBottom: 10,
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <span style={{ color: "#64748b" }}>{fieldLabel(key)}</span>
                <strong style={{ textAlign: "right" }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle(), padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h3 style={{ marginTop: 0, fontSize: 22 }}>Source vs IRS Comparison</h3>
          <button style={buttonStyle(false)}>
            <Download size={16} style={{ marginRight: 8 }} />
            Export Comparison
          </button>
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
          <div>Source</div>
          <div>IRS</div>
          <div>Status</div>
        </div>

        <CompareRow label="Legal Name" source={item.sourceValues.legalName} irs={item.irsValues.legalName} />
        <CompareRow label="State" source={item.sourceValues.state} irs={item.irsValues.state} />
        <CompareRow label="County" source={item.sourceValues.county} irs={item.irsValues.county} />
        <CompareRow
          label="Responsible Party"
          source={item.sourceValues.responsibleParty}
          irs={item.irsValues.responsibleParty}
        />
        <CompareRow
          label="Business Activity"
          source={item.sourceValues.businessActivity}
          irs={item.irsValues.businessActivity}
        />
        <CompareRow label="Address" source={item.sourceValues.address} irs={item.irsValues.address} />
      </div>
    </div>
  );
}

function ExceptionScreen({ item, onBack, onSaveAndSubmit }) {
  const [editedValues, setEditedValues] = useState({ ...item.sourceValues });

  const mismatchFields = useMemo(() => {
    return Object.keys(item.sourceValues).filter(
      (key) => item.sourceValues[key] !== item.irsValues[key]
    );
  }, [item]);

  const updateField = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <button style={buttonStyle(false)} onClick={onBack}>
          <ArrowLeft size={16} style={{ marginRight: 8 }} />
          Back to Home
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={buttonStyle(false)}>
            <Save size={16} style={{ marginRight: 8 }} />
            Save Changes
          </button>
          <button
            style={buttonStyle(true)}
            onClick={() => onSaveAndSubmit(editedValues)}
          >
            <Send size={16} style={{ marginRight: 8 }} />
            Submit Corrected EIN
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle(), padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontSize: 32 }}>{item.company}</h1>
              <div style={badgeStyle("#fee2e2", "#991b1b")}>Exception</div>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 18, flexWrap: "wrap", color: "#475569", fontSize: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bot size={16} /> {item.botWorker}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={16} /> {item.responsibleParty}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={16} /> {item.issueCount} issue(s)
              </div>
            </div>
          </div>

          <div style={{ minWidth: 340, ...softPanelStyle() }}>
            <SectionLabel>Issues Requiring Fix</SectionLabel>
            <div style={{ display: "grid", gap: 10, marginTop: 12, fontSize: 14, color: "#475569" }}>
              {item.mismatches.map((issue) => (
                <div key={issue}>• {issue}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ ...cardStyle(), padding: 24 }}>
          <h3 style={{ marginTop: 0, fontSize: 22 }}>IRS / Current Values</h3>
          <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
            {Object.entries(item.irsValues).map(([key, value]) => {
              const isMismatch = mismatchFields.includes(key);
              return (
                <div
                  key={key}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    border: `1px solid ${isMismatch ? "#fecaca" : "#e2e8f0"}`,
                    background: isMismatch ? "#fef2f2" : "#fff",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{fieldLabel(key)}</div>
                  <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700 }}>{value}</div>
                  {isMismatch && (
                    <div style={{ marginTop: 8 }}>
                      <span style={badgeStyle("#fee2e2", "#b91c1c")}>Highlighted mismatch</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardStyle(), padding: 24 }}>
          <h3 style={{ marginTop: 0, fontSize: 22 }}>Corrected Values</h3>
          <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
            {Object.entries(editedValues).map(([key, value]) => {
              const isMismatch = mismatchFields.includes(key);
              return (
                <div
                  key={key}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    border: `1px solid ${isMismatch ? "#fecaca" : "#e2e8f0"}`,
                    background: isMismatch ? "#fff7f7" : "#fff",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{fieldLabel(key)}</div>
                  <input
                    value={value}
                    onChange={(e) => updateField(key, e.target.value)}
                    style={{ ...inputStyle(), marginTop: 8 }}
                  />
                  {isMismatch && (
                    <div style={{ marginTop: 8 }}>
                      <span style={badgeStyle("#fef3c7", "#92400e")}>Needs correction</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- APP -------------------- */

export default function App() {
  const [cases, setCases] = useState(initialCases);
  const [systemMode, setSystemMode] = useState("auto");
  const [selectedQueue, setSelectedQueue] = useState("submission");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(initialCases[0].id);
  const [screen, setScreen] = useState("home");

  const selectedItem = cases.find((c) => c.id === selectedId) || null;

  const openSelectedCase = (item) => {
    setSelectedId(item.id);
    setScreen(item.reviewType === "exception" ? "exception" : "review");
  };

  const handleSaveAndSubmitException = (editedValues) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              sourceValues: { ...editedValues },
              irsValues: { ...editedValues },
              mismatches: [],
              issueCount: 0,
              status: "waiting_review",
              reviewType: "submission",
              confidence: 98,
              stage: "Review & Submit",
            }
          : c
      )
    );
    setSelectedQueue("submission");
    setScreen("home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: 1680, margin: "0 auto", padding: 24 }}>
        <div style={{ ...cardStyle(), padding: 18, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
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
                  Live Agent Operations
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button style={{ ...buttonStyle(false), width: 42, padding: 0 }}>
                <RefreshCw size={16} />
              </button>
              <button style={buttonStyle(false)}>
                <Settings2 size={16} style={{ marginRight: 8 }} />
                Settings
              </button>
              <button
                style={buttonStyle(true)}
                onClick={() => {
                  if (selectedItem) openSelectedCase(selectedItem);
                }}
              >
                <FastForward size={16} style={{ marginRight: 8 }} />
                Open Selected
              </button>
            </div>
          </div>
        </div>

        {screen === "home" && (
          <HomeScreen
            cases={cases}
            selectedQueue={selectedQueue}
            setSelectedQueue={setSelectedQueue}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            systemMode={systemMode}
            setSystemMode={setSystemMode}
            search={search}
            setSearch={setSearch}
            openSelectedCase={openSelectedCase}
          />
        )}

        {screen === "review" && selectedItem && (
          <ReviewScreen
            item={selectedItem}
            systemMode={systemMode}
            onBack={() => setScreen("home")}
          />
        )}

        {screen === "exception" && selectedItem && (
          <ExceptionScreen
            item={selectedItem}
            onBack={() => setScreen("home")}
            onSaveAndSubmit={handleSaveAndSubmitException}
          />
        )}
      </div>
    </div>
  );
}