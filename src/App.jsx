import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
  PlayCircle,
  UserCheck,
  Users,
  PauseCircle,
  Eye,
  Bot,
  Timer,
  Download,
  ChevronRight,
  FastForward,
  RefreshCw,
  ArrowLeft,
  Save,
  Send,
  Clock3,
  Bell,
} from "lucide-react";

const queueStats = [
  { label: "Ready for Bot", value: 42, icon: PlayCircle },
  { label: "Waiting Review", value: 18, icon: UserCheck },
  { label: "Exceptions", value: 7, icon: AlertTriangle },
  { label: "Completed Today", value: 126, icon: CheckCircle2 },
  { label: "Auto Submitted", value: 88, icon: CheckCircle2 },
  { label: "Timed Out", value: 2, icon: PauseCircle },
];

const baseCases = [
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
      "Business activity description too generic for submission guard rails.",
      "County from source record differs from county on state filing extract.",
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
    mismatches: ["ZIP code mismatch between source and IRS review values."],
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
];

const timeline = [
  { time: "09:14:02", label: "Case created from intake payload" },
  { time: "09:14:09", label: "Validation checks passed" },
  { time: "09:14:15", label: "Assigned to Bot-04" },
  { time: "09:15:34", label: "Identity step completed" },
  { time: "09:16:22", label: "IRS Step 4 completed" },
  { time: "09:16:49", label: "Review page captured" },
  { time: "09:16:55", label: "Queued for live agent" },
];

function statusMeta(status) {
  switch (status) {
    case "waiting_review":
      return { label: "Waiting Review", color: "#a16207", bg: "#fef3c7", dot: "#d97706" };
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
    boxSizing: "border-box",
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

function formatFieldLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div style={{ ...cardStyle(), padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{stat.label}</div>
          <div style={{ marginTop: 10, fontSize: 32, fontWeight: 800, color: "#0f172a" }}>{stat.value}</div>
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

function QueueTile({ title, subtitle, count, selected, onClick, icon: Icon, tone = "default" }) {
  const tones = {
    default: { bg: "#fff", border: "#e2e8f0", color: "#0f172a" },
    review: { bg: "#fffbeb", border: "#fde68a", color: "#92400e" },
    exception: { bg: "#fef2f2", border: "#fecaca", color: "#991b1b" },
  };
  const toneStyle = tones[tone] || tones.default;
  return (
    <button
      onClick={onClick}
      style={{
        ...cardStyle(),
        background: selected ? toneStyle.bg : "#fff",
        border: `1px solid ${selected ? toneStyle.border : "#e2e8f0"}`,
        padding: 18,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: toneStyle.color }}>{title}</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>{subtitle}</div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
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
      <div style={{ marginTop: 14, fontSize: 28, fontWeight: 800 }}>{count}</div>
    </button>
  );
}

function CaseListItem({ item, isSelected, onClick, systemMode, autoThreshold }) {
  const itemMeta = statusMeta(item.status);
  const isAutoEligible = item.mismatches.length === 0 && item.confidence >= autoThreshold;

  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        width: "100%",
        borderRadius: 20,
        border: isSelected ? "1px solid #0f172a" : "1px solid #e2e8f0",
        background: isSelected ? "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" : "#fff",
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
        <div style={badgeStyle(itemMeta.bg, itemMeta.color)}>{itemMeta.label}</div>
        <div style={badgeStyle(item.priority === "high" ? "#fee2e2" : "#fff", item.priority === "high" ? "#b91c1c" : "#334155")}>
          {item.priority === "high" ? "High Priority" : "Normal"}
        </div>
        {systemMode === "auto" && isAutoEligible && (
          <div style={badgeStyle("#dcfce7", "#166534")}>Auto Eligible</div>
        )}
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
        <span style={badgeStyle(mismatch ? "#fee2e2" : "#dcfce7", mismatch ? "#b91c1c" : "#166534")}>
          {mismatch ? "Mismatch" : "Match"}
        </span>
      </div>
    </div>
  );
}

function HomeScreen({
  systemMode,
  setSystemMode,
  stats,
  activeQueue,
  setActiveQueue,
  queueCounts,
  cases,
  selectedId,
  setSelectedId,
  openReview,
  autoThreshold,
}) {
  const selected = cases.find((c) => c.id === selectedId) || cases[0];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          ...cardStyle(),
          padding: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => setSystemMode("review")} style={buttonStyle(systemMode === "review")}>
            🔵 Review Mode
          </button>
          <button onClick={() => setSystemMode("auto")} style={buttonStyle(systemMode === "auto")}>
            🟢 Auto Mode
          </button>
        </div>
        <div style={{ color: "#475569", fontSize: 14 }}>
          {systemMode === "auto"
            ? `Clean EIN cases auto-submit at ${autoThreshold}% confidence or higher.`
            : "All review-stage EIN cases require human approval before submit."}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 16 }}>
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <QueueTile
          title="Submission Review Queue"
          subtitle="Human approval queue for cases awaiting submit"
          count={queueCounts.submission}
          selected={activeQueue === "submission"}
          onClick={() => setActiveQueue("submission")}
          icon={UserCheck}
          tone="review"
        />
        <QueueTile
          title="Exception Queue"
          subtitle="Specialist queue for fixes and resubmission"
          count={queueCounts.exception}
          selected={activeQueue === "exception"}
          onClick={() => setActiveQueue("exception")}
          icon={AlertTriangle}
          tone="exception"
        />
        <QueueTile
          title="Completed Queue"
          subtitle="Reference only; completed and archived items"
          count={queueCounts.completed}
          selected={activeQueue === "completed"}
          onClick={() => setActiveQueue("completed")}
          icon={CheckCircle2}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 24 }}>
        <div style={{ ...cardStyle(), padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>
              {activeQueue === "submission"
                ? "Submission Queue"
                : activeQueue === "exception"
                ? "Exception Queue"
                : "Completed Queue"}
            </h2>
            <div style={badgeStyle("#fff", "#334155")}>{cases.length} visible</div>
          </div>

          <div style={{ display: "grid", gap: 12, maxHeight: 760, overflow: "auto", paddingRight: 4 }}>
            {cases.map((item) => (
              <CaseListItem
                key={item.id}
                item={item}
                isSelected={selected?.id === item.id}
                onClick={() => setSelectedId(item.id)}
                systemMode={systemMode}
                autoThreshold={autoThreshold}
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
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      gap: 18,
                      flexWrap: "wrap",
                      color: "#475569",
                      fontSize: 14,
                    }}
                  >
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
                <button style={buttonStyle(true)} onClick={() => openReview(selected)}>
                  <Eye size={16} style={{ marginRight: 8 }} />
                  Open {selected.reviewType === "exception" ? "Exception" : "Review"} Screen
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
                  <SectionLabel>Queue Action</SectionLabel>
                  <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800 }}>
                    {selected.reviewType === "exception" ? "Fix + Submit" : "Review + Submit"}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 22, ...softPanelStyle() }}>
                <SectionLabel>Home Screen Purpose</SectionLabel>
                <div style={{ marginTop: 12, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                  This screen is for queue management only. Agents choose a queue, open a single company,
                  and then move into a dedicated full-screen review or exception workspace.
                </div>
              </div>
            </>
          ) : (
            <div>No cases visible.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewScreen({ item, onBack, systemMode, autoThreshold }) {
  const isAutoEligible = item.mismatches.length === 0 && item.confidence >= autoThreshold;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <button style={buttonStyle(false)} onClick={onBack}>
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back to Home
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={buttonStyle(false)}>
            <RefreshCw size={16} style={{ marginRight: 8 }} /> Refresh Review
          </button>
          <button style={buttonStyle(true)}>
            <Send size={16} style={{ marginRight: 8 }} />
            {systemMode === "auto" && isAutoEligible ? "Auto Submit" : "Approve and Submit"}
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
              {systemMode === "auto" && isAutoEligible && (
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
          <div style={{ minWidth: 280, ...softPanelStyle() }}>
            <SectionLabel>Submission Decision</SectionLabel>
            <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800 }}>
              {systemMode === "auto" && isAutoEligible ? "Auto submit allowed" : "Human approval required"}
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>
              {systemMode === "auto"
                ? `Auto Mode uses ${autoThreshold}% confidence threshold with no mismatches.`
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
                <span style={{ color: "#64748b", textTransform: "capitalize" }}>{key}</span>
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
                <span style={{ color: "#64748b", textTransform: "capitalize" }}>{key}</span>
                <strong style={{ textAlign: "right" }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle(), padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h3 style={{ marginTop: 0, fontSize: 22 }}>Comparison</h3>
          <button style={buttonStyle(false)}>
            <Download size={16} style={{ marginRight: 8 }} /> Export Comparison
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
        <CompareRow label="Responsible Party" source={item.sourceValues.responsibleParty} irs={item.irsValues.responsibleParty} />
        <CompareRow label="Business Activity" source={item.sourceValues.businessActivity} irs={item.irsValues.businessActivity} />
        <CompareRow label="Address" source={item.sourceValues.address} irs={item.irsValues.address} />
      </div>
    </div>
  );
}

function ExceptionScreen({ item, onBack }) {
  const [form, setForm] = useState({ ...item.sourceValues });
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);
  const syncingRef = useRef(false);

  const mismatchFields = useMemo(() => {
    return Object.keys(item.irsValues).filter((key) => item.irsValues[key] !== form[key]);
  }, [item.irsValues, form]);

  const syncScroll = (source, target) => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    if (target.current && source.current) {
      target.current.scrollTop = source.current.scrollTop;
    }
    requestAnimationFrame(() => {
      syncingRef.current = false;
    });
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <button style={buttonStyle(false)} onClick={onBack}>
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back to Home
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={buttonStyle(false)}>
            <Save size={16} style={{ marginRight: 8 }} /> Save Changes
          </button>
          <button style={buttonStyle(true)}>
            <Send size={16} style={{ marginRight: 8 }} /> Submit Corrected EIN
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
          <div style={{ minWidth: 300, ...softPanelStyle() }}>
            <SectionLabel>Issues Requiring Fix</SectionLabel>
            <div style={{ marginTop: 10, display: "grid", gap: 10, fontSize: 14, color: "#475569" }}>
              {item.mismatches.map((issue) => (
                <div key={issue}>• {issue}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div style={{ ...cardStyle(), padding: 24 }}>
          <h3 style={{ marginTop: 0, fontSize: 22, textAlign: "center" }}>IRS / Current Values</h3>
          <div
            ref={leftScrollRef}
            onScroll={() => syncScroll(leftScrollRef, rightScrollRef)}
            style={{
              display: "grid",
              gap: 14,
              marginTop: 16,
              maxHeight: 900,
              overflowY: "auto",
              paddingRight: 6,
            }}
          >
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
                  <div
                    style={{
                      marginBottom: 8,
                      fontSize: 12,
                      color: "#64748b",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {formatFieldLabel(key)}
                  </div>

                  <div
                    style={{
                      ...inputStyle(),
                      display: "flex",
                      alignItems: "center",
                      color: "#0f172a",
                      fontWeight: 500,
                      background: "#fff",
                    }}
                  >
                    {value}
                  </div>

                  <div style={{ marginTop: 12, textAlign: "center", minHeight: 32 }}>
                    {isMismatch ? (
                      <span style={badgeStyle("#fee2e2", "#b91c1c")}>Highlighted mismatch</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardStyle(), padding: 24 }}>
          <h3 style={{ marginTop: 0, fontSize: 22, textAlign: "center" }}>Corrected Values</h3>
          <div
            ref={rightScrollRef}
            onScroll={() => syncScroll(rightScrollRef, leftScrollRef)}
            style={{
              display: "grid",
              gap: 14,
              marginTop: 16,
              maxHeight: 900,
              overflowY: "auto",
              paddingRight: 6,
            }}
          >
            {Object.entries(form).map(([key, value]) => {
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
                  <div
                    style={{
                      marginBottom: 8,
                      fontSize: 12,
                      color: "#64748b",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {formatFieldLabel(key)}
                  </div>

                  <input
                    value={value}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    style={inputStyle()}
                  />

                  <div style={{ marginTop: 12, textAlign: "center", minHeight: 32 }}>
                    {isMismatch ? (
                      <span style={badgeStyle("#fef3c7", "#92400e")}>Needs correction</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle(), padding: 24 }}>
        <h3 style={{ marginTop: 0, fontSize: 22 }}>Bot Timeline</h3>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {timeline.map((item) => (
            <div key={`${item.time}-${item.label}`} style={{ ...softPanelStyle(), padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b" }}>{item.time}</div>
              <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [activeQueue, setActiveQueue] = useState("submission");
  const [selectedId, setSelectedId] = useState("EIN-240318-001");
  const [screen, setScreen] = useState("home");
  const [systemMode, setSystemMode] = useState("auto");
  const AUTO_CONFIDENCE_THRESHOLD = 97;

  const visibleCases = useMemo(() => {
    const q = search.toLowerCase();
    return baseCases.filter((item) => {
      const matchesSearch =
        item.company.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.responsibleParty.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeQueue === "submission") {
        if (systemMode === "auto") {
          return (
            item.reviewType === "submission" &&
            (item.mismatches.length > 0 ||
              item.confidence < AUTO_CONFIDENCE_THRESHOLD ||
              item.status === "waiting_review")
          );
        }
        return item.reviewType === "submission" && item.status === "waiting_review";
      }

      if (activeQueue === "exception") {
        return item.reviewType === "exception" || item.status === "exception";
      }

      if (activeQueue === "completed") {
        return item.status === "completed";
      }

      return true;
    });
  }, [search, activeQueue, systemMode]);

  const queueCounts = {
    submission: baseCases.filter((item) => item.reviewType === "submission" && item.status === "waiting_review").length,
    exception: baseCases.filter((item) => item.reviewType === "exception" || item.status === "exception").length,
    completed: baseCases.filter((item) => item.status === "completed").length,
  };

  const selectedItem =
    visibleCases.find((c) => c.id === selectedId) || visibleCases[0] || baseCases[0];

  const openReview = (item) => {
    setSelectedId(item.id);
    setScreen(item.reviewType === "exception" ? "exception" : "review");
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
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Live Agent Operations</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: 260 }}>
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
                <Bell size={16} />
              </button>
              <button style={{ ...buttonStyle(false), width: 42, padding: 0 }}>
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>

        {screen === "home" && (
          <HomeScreen
            systemMode={systemMode}
            setSystemMode={setSystemMode}
            stats={queueStats}
            activeQueue={activeQueue}
            setActiveQueue={setActiveQueue}
            queueCounts={queueCounts}
            cases={visibleCases}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            openReview={openReview}
            autoThreshold={AUTO_CONFIDENCE_THRESHOLD}
          />
        )}

        {screen === "review" && selectedItem && (
          <ReviewScreen
            item={selectedItem}
            onBack={() => setScreen("home")}
            systemMode={systemMode}
            autoThreshold={AUTO_CONFIDENCE_THRESHOLD}
          />
        )}

        {screen === "exception" && selectedItem && (
          <ExceptionScreen item={selectedItem} onBack={() => setScreen("home")} />
        )}
      </div>
    </div>
  );
}