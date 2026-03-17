import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  PlayCircle,
  UserCheck,
  Users,
  Eye,
  Bot,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  Save,
  Send,
  Clock3,
  ShieldCheck,
} from "lucide-react";

/* ------------------ MOCK DATA ------------------ */

const casesData = [
  {
    id: "EIN-001",
    company: "SimpleBiz Agent LLC",
    status: "waiting_review",
    confidence: 99,
    mismatches: [],
    responsibleParty: "Robert Hammond",
    bot: "Bot-01",
    source: { name: "SimpleBiz Agent LLC", state: "CA" },
    irs: { name: "SimpleBiz Agent LLC", state: "CA" },
  },
  {
    id: "EIN-002",
    company: "Pacific Filing LLC",
    status: "exception",
    confidence: 85,
    mismatches: ["State mismatch"],
    responsibleParty: "Melissa Tran",
    bot: "Bot-02",
    source: { name: "Pacific Filing LLC", state: "CA" },
    irs: { name: "Pacific Filing LLC", state: "NV" },
  },
];

/* ------------------ STYLES ------------------ */

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
};

const button = (primary) => ({
  padding: "10px 16px",
  borderRadius: 10,
  border: primary ? "none" : "1px solid #ccc",
  background: primary ? "#0f172a" : "#fff",
  color: primary ? "#fff" : "#000",
  cursor: "pointer",
  fontWeight: 600,
});

/* ------------------ HOME ------------------ */

function Home({ cases, setSelected, openScreen, mode, setMode }) {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      
      {/* MODE */}
      <div style={card}>
        <button onClick={() => setMode("auto")} style={button(mode==="auto")}>
          Auto Mode
        </button>
        <button onClick={() => setMode("review")} style={{...button(mode==="review"), marginLeft:10}}>
          Review Mode
        </button>
      </div>

      {/* LIST */}
      <div style={card}>
        {cases.map((c) => (
          <div
            key={c.id}
            style={{
              padding: 12,
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelected(c);
              openScreen(c.status === "exception" ? "exception" : "review");
            }}
          >
            <b>{c.company}</b> ({c.id})
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ REVIEW ------------------ */

function Review({ item, goBack, mode }) {
  const autoEligible = item.confidence > 97 && item.mismatches.length === 0;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      
      <button onClick={goBack} style={button(false)}>
        <ArrowLeft size={14}/> Back
      </button>

      <div style={card}>
        <h2>{item.company}</h2>
        <p>Confidence: {item.confidence}%</p>

        <button style={button(true)}>
          {mode === "auto" && autoEligible
            ? "Auto Submit"
            : "Approve & Submit"}
        </button>
      </div>
    </div>
  );
}

/* ------------------ EXCEPTION ------------------ */

function Exception({ item, goBack }) {
  const [state, setState] = useState(item.source.state);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      
      <button onClick={goBack} style={button(false)}>
        <ArrowLeft size={14}/> Back
      </button>

      <div style={card}>
        <h2>{item.company}</h2>

        <p><b>Issue:</b> {item.mismatches[0]}</p>

        <div>
          <label>Correct State</label>
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            style={{ display:"block", marginTop:8 }}
          />
        </div>

        <button style={{...button(true), marginTop:16}}>
          Submit Fix
        </button>
      </div>
    </div>
  );
}

/* ------------------ APP ------------------ */

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("auto");

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      
      <h1>SimpleBiz EIN Ops</h1>

      {screen === "home" && (
        <Home
          cases={casesData}
          setSelected={setSelected}
          openScreen={setScreen}
          mode={mode}
          setMode={setMode}
        />
      )}

      {screen === "review" && selected && (
        <Review item={selected} goBack={() => setScreen("home")} mode={mode} />
      )}

      {screen === "exception" && selected && (
        <Exception item={selected} goBack={() => setScreen("home")} />
      )}
    </div>
  );
}