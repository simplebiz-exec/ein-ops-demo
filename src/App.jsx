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
} from "lucide-react";

const queueStats = [
  { label: "Ready", value: 42 },
  { label: "In Progress", value: 11 },
  { label: "Review", value: 18 },
  { label: "Exceptions", value: 7 },
  { label: "Completed", value: 126 },
];

const cases = [
  {
    id: "EIN-001",
    company: "SimpleBiz Agent LLC",
    status: "review",
    state: "CA",
    responsibleParty: "Robert Hammond",
    issues: 0,
  },
  {
    id: "EIN-002",
    company: "Pacific Filing Services",
    status: "exception",
    state: "CA",
    responsibleParty: "Melissa Tran",
    issues: 2,
  },
  {
    id: "EIN-003",
    company: "Desert Agent Co",
    status: "in_progress",
    state: "AZ",
    responsibleParty: "Daniel Perez",
    issues: 0,
  },
];

function badge(status) {
  const colors = {
    review: "#f59e0b",
    in_progress: "#2563eb",
    exception: "#dc2626",
  };
  return {
    background: "#f1f5f9",
    color: colors[status] || "#334155",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  };
}

export default function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(cases[0]);

  const filtered = useMemo(() => {
    return cases.filter((c) =>
      c.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1 style={{ fontSize: 32 }}>EIN Operations Dashboard</h1>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {queueStats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 10,
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 12 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: "bold" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 30, gap: 20 }}>
        {/* Left Panel */}
        <div style={{ width: 300 }}>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />

          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                marginBottom: 10,
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{c.company}</div>
              <div style={{ fontSize: 12 }}>{c.id}</div>
              <div style={badge(c.status)}>{c.status}</div>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1 }}>
          <h2>{selected.company}</h2>

          <div style={{ marginTop: 10 }}>
            <strong>Responsible Party:</strong>{" "}
            {selected.responsibleParty}
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>State:</strong> {selected.state}
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Issues:</strong> {selected.issues}
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button style={{ padding: 10 }}>Approve</button>
            <button style={{ padding: 10 }}>Send to Exception</button>
            <button style={{ padding: 10 }}>Retry</button>
          </div>

          <div style={{ marginTop: 30 }}>
            <h3>Review Panel</h3>
            <div style={{ border: "1px dashed #ccc", padding: 20 }}>
              IRS Review snapshot will display here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}