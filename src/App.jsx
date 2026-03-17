import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  PlayCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
  PauseCircle,
  Eye,
  Bot,
  Timer,
  Download,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const queueStats = [
  { label: "Ready for Bot", value: 42, icon: PlayCircle },
  { label: "In Progress", value: 11, icon: Bot },
  { label: "Waiting for Review", value: 18, icon: UserCheck },
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
    reviewSummary: {
      reason: "Started a new business",
      businessActivity: "Other > Service > Reg Agent Services",
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
    reviewSummary: {
      reason: "Started a new business",
      businessActivity: "Other > Service",
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
    reviewSummary: {
      reason: "Started a new business",
      businessActivity: "Other > Service > Registered Agent Services",
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
    reviewSummary: {
      reason: "Started a new business",
      businessActivity: "Other > Service > Registered Agent Services",
      address: "1201 3rd Ave, Seattle, WA 98101",
      phone: "206-555-0121",
    },
    mismatches: [],
  },
];

const timeline = [
  { time: "09:14:02", label: "Case created from intake payload", type: "info" },
  { time: "09:14:09", label: "Validation checks passed", type: "success" },
  { time: "09:14:15", label: "Assigned to Bot-04", type: "info" },
  { time: "09:16:22", label: "IRS Step 4 completed", type: "success" },
  { time: "09:16:49", label: "Review page captured and hashed", type: "success" },
  { time: "09:16:55", label: "Queued for live agent approval", type: "warning" },
];

const artifacts = [
  "IRS Review Screenshot",
  "Step 1 Screenshot",
  "Step 2 Screenshot",
  "Browser Trace",
  "Normalized Payload JSON",
  "Validation Report",
];

function statusMeta(status) {
  switch (status) {
    case "waiting_review":
      return { label: "Waiting Review", className: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock3 };
    case "in_progress":
      return { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200", icon: RefreshCw };
    case "exception":
      return { label: "Exception", className: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle };
    case "completed":
      return { label: "Completed", className: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 };
    default:
      return { label: status, className: "bg-slate-100 text-slate-800 border-slate-200", icon: FileText };
  }
}

function priorityMeta(priority) {
  return priority === "high"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-slate-50 text-slate-700 border-slate-200";
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{stat.label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</div>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionLabel({ children }) {
  return <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{children}</div>;
}

export default function EinOpsDemoApp() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("EIN-240318-001");
  const [tab, setTab] = useState("review");

  const filtered = useMemo(() => {
    return cases.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.responsibleParty.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const selected = filtered.find((c) => c.id === selectedId) || filtered[0] || cases[0];
  const meta = statusMeta(selected.status);
  const StatusIcon = meta.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              EIN Operations Demo · Live Agent Review Console
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">EIN Review + Exception Handling Workspace</h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600">
              Demo UI for bot coordination, live review, exception routing, and completion tracking before handing the project to developers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button className="rounded-2xl h-11">Start Queue</Button>
            <Button variant="outline" className="rounded-2xl h-11">Pause New Starts</Button>
            <Button variant="outline" className="rounded-2xl h-11">Export Queue</Button>
            <Button variant="outline" className="rounded-2xl h-11">Open Runbook</Button>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {queueStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <Card className="rounded-[24px] shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">Agent Queue</CardTitle>
                <Badge variant="outline" className="rounded-full">{filtered.length} visible</Badge>
              </div>
              <div className="flex gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search case, party, state..."
                    className="pl-9 rounded-2xl"
                  />
                </div>
                <Button variant="outline" size="icon" className="rounded-2xl">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[920px] pr-3">
                <div className="space-y-3">
                  {filtered.map((item) => {
                    const itemMeta = statusMeta(item.status);
                    const ItemIcon = itemMeta.icon;
                    const isSelected = selected.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          isSelected ? "border-slate-900 bg-white shadow-sm" : "border-slate-200 bg-slate-50 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{item.company}</div>
                            <div className="mt-1 text-xs text-slate-500">{item.id} · {item.state} · {item.county}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge className={`rounded-full border ${itemMeta.className}`}>
                            <ItemIcon className="mr-1 h-3.5 w-3.5" /> {itemMeta.label}
                          </Badge>
                          <Badge variant="outline" className={`rounded-full border ${priorityMeta(item.priority)}`}>
                            {item.priority === "high" ? "High Priority" : "Normal"}
                          </Badge>
                          <Badge variant="outline" className="rounded-full">{item.stage}</Badge>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                          <div>
                            <div className="text-slate-400">Responsible Party</div>
                            <div className="mt-1 font-medium text-slate-800">{item.responsibleParty}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Bot Worker</div>
                            <div className="mt-1 font-medium text-slate-800">{item.botWorker}</div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs">
                          <div className="text-slate-500">Age: {item.age}</div>
                          <div className="font-medium text-slate-800">{item.issueCount} issues</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[24px] shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold tracking-tight">{selected.company}</h2>
                      <Badge className={`rounded-full border ${meta.className}`}>
                        <StatusIcon className="mr-1 h-3.5 w-3.5" /> {meta.label}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">{selected.id}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><Bot className="h-4 w-4" /> {selected.botWorker}</div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {selected.responsibleParty}</div>
                      <div className="flex items-center gap-2"><Timer className="h-4 w-4" /> Age {selected.age}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Button className="rounded-2xl h-11">Approve Submit</Button>
                    <Button variant="outline" className="rounded-2xl h-11">Send to Exception</Button>
                    <Button variant="outline" className="rounded-2xl h-11">Retry Bot</Button>
                    <Button variant="outline" className="rounded-2xl h-11">Hold Case</Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <SectionLabel>Confidence</SectionLabel>
                    <div className="mt-2 text-2xl font-semibold">{selected.confidence}%</div>
                    <Progress className="mt-3" value={selected.confidence} />
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <SectionLabel>Current Stage</SectionLabel>
                    <div className="mt-2 text-base font-semibold">{selected.stage}</div>
                    <div className="mt-2 text-sm text-slate-500">Guard rails passed through current step.</div>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <SectionLabel>Issues</SectionLabel>
                    <div className="mt-2 text-2xl font-semibold">{selected.issueCount}</div>
                    <div className="mt-2 text-sm text-slate-500">Exceptions or mismatches requiring agent attention.</div>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <SectionLabel>Recommended Action</SectionLabel>
                    <div className="mt-2 text-base font-semibold">{selected.agentAction}</div>
                    <div className="mt-2 text-sm text-slate-500">Based on current validation + bot state.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={tab} onValueChange={setTab} className="space-y-6">
              <TabsList className="grid h-auto grid-cols-4 rounded-2xl p-1">
                <TabsTrigger value="review" className="rounded-2xl">Review</TabsTrigger>
                <TabsTrigger value="exceptions" className="rounded-2xl">Exceptions</TabsTrigger>
                <TabsTrigger value="timeline" className="rounded-2xl">Bot Timeline</TabsTrigger>
                <TabsTrigger value="artifacts" className="rounded-2xl">Artifacts</TabsTrigger>
              </TabsList>

              <TabsContent value="review" className="m-0">
                <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
                  <Card className="rounded-[24px] shadow-sm">
                    <CardHeader>
                      <CardTitle>Live Agent Review Screen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <SectionLabel>Entity Details</SectionLabel>
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Legal name</span><span className="font-medium">{selected.legalName}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">State</span><span className="font-medium">{selected.state}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">County</span><span className="font-medium">{selected.county}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Reason</span><span className="font-medium">{selected.reviewSummary.reason}</span></div>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <SectionLabel>Responsible Party</SectionLabel>
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Name</span><span className="font-medium">{selected.responsibleParty}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Role</span><span className="font-medium">Owner / Managing Member</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Identity status</span><span className="font-medium">Validated pre-run</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">One-per-day check</span><span className="font-medium">Passed</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <SectionLabel>Address + Contact</SectionLabel>
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Physical address</span><span className="font-medium text-right">{selected.reviewSummary.address}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Phone</span><span className="font-medium">{selected.reviewSummary.phone}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Mailing</span><span className="font-medium">Same as physical</span></div>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <SectionLabel>Business Activity</SectionLabel>
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Category</span><span className="font-medium text-right">{selected.reviewSummary.businessActivity}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Employees</span><span className="font-medium">No</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Excise / ATF / Gambling</span><span className="font-medium">No / No / No</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <SectionLabel>IRS Review Page Preview</SectionLabel>
                            <div className="mt-2 text-sm text-slate-600">This is where the live agent would confirm the bot-captured review page without working directly inside the IRS site.</div>
                          </div>
                          <Button variant="outline" className="rounded-2xl"><Eye className="mr-2 h-4 w-4" /> Open Full Screenshot</Button>
                        </div>
                        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                          <div className="mb-5 flex items-center justify-between">
                            <div>
                              <div className="text-lg font-semibold">Review & Submit Snapshot</div>
                              <div className="text-sm text-slate-500">Captured by bot at 09:16:49 · hash verified</div>
                            </div>
                            <Badge variant="outline" className="rounded-full">Read Only</Badge>
                          </div>
                          <div className="space-y-4 text-sm">
                            <div className="flex justify-between gap-4 border-b pb-3"><span className="text-slate-500">Organization type</span><span className="font-medium">Single Member Limited Liability Company (LLC)</span></div>
                            <div className="flex justify-between gap-4 border-b pb-3"><span className="text-slate-500">Legal name</span><span className="font-medium">{selected.legalName}</span></div>
                            <div className="flex justify-between gap-4 border-b pb-3"><span className="text-slate-500">Responsible party</span><span className="font-medium">{selected.responsibleParty}</span></div>
                            <div className="flex justify-between gap-4 border-b pb-3"><span className="text-slate-500">Business activity</span><span className="font-medium">{selected.reviewSummary.businessActivity}</span></div>
                            <div className="flex justify-between gap-4"><span className="text-slate-500">Reason for applying</span><span className="font-medium">{selected.reviewSummary.reason}</span></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[24px] shadow-sm">
                    <CardHeader>
                      <CardTitle>Approval Panel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                          <div>
                            <div className="font-semibold text-emerald-900">Guard rails currently passed</div>
                            <div className="mt-1 text-sm text-emerald-800">No source-to-review mismatches detected for this case.</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
                        <SectionLabel>Agent Checklist</SectionLabel>
                        {[
                          "Legal name matches source-of-truth record",
                          "Responsible party matches validated intake",
                          "Address and state fields look correct",
                          "Business activity is specific enough",
                          "Reason for applying is correct",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-3 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
                        <SectionLabel>Decision Actions</SectionLabel>
                        <Button className="w-full rounded-2xl h-11">Approve and Resume Bot Submission</Button>
                        <Button variant="outline" className="w-full rounded-2xl h-11">Reject to Exception Queue</Button>
                        <Button variant="outline" className="w-full rounded-2xl h-11">Request Source Data Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="exceptions" className="m-0">
                <Card className="rounded-[24px] shadow-sm">
                  <CardHeader>
                    <CardTitle>Exception Handling Workspace</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                      <div className="space-y-4">
                        {(selected.mismatches.length ? selected.mismatches : ["No active exceptions for this case."]).map((issue, index) => (
                          <div key={index} className={`rounded-2xl border p-4 ${selected.mismatches.length ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
                            <div className="flex items-start gap-3">
                              {selected.mismatches.length ? (
                                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
                              ) : (
                                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                              )}
                              <div>
                                <div className="font-semibold">{selected.mismatches.length ? `Issue ${index + 1}` : "Clean case"}</div>
                                <div className="mt-1 text-sm text-slate-700">{issue}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <SectionLabel>Suggested Resolution</SectionLabel>
                          <div className="mt-3 text-sm text-slate-700">
                            Route county mismatch to source-data editor and require agent confirmation before requeue.
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <SectionLabel>Exception Actions</SectionLabel>
                          <div className="mt-4 grid gap-3">
                            <Button className="rounded-2xl">Assign to Specialist</Button>
                            <Button variant="outline" className="rounded-2xl">Edit Source Data</Button>
                            <Button variant="outline" className="rounded-2xl">Requeue Case</Button>
                            <Button variant="outline" className="rounded-2xl">Cancel Filing</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="m-0">
                <Card className="rounded-[24px] shadow-sm">
                  <CardHeader>
                    <CardTitle>Bot Timeline + Session State</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="space-y-4">
                        {timeline.map((item) => (
                          <div key={`${item.time}-${item.label}`} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                            <div className="min-w-[72px] text-sm font-medium text-slate-500">{item.time}</div>
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="mt-1 text-sm text-slate-500">Bot-04 · IRS EIN application session</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <SectionLabel>Session Health</SectionLabel>
                          <div className="mt-3 text-2xl font-semibold">Healthy</div>
                          <div className="mt-2 text-sm text-slate-500">9m 12s remaining before inactivity timeout.</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <SectionLabel>Worker Controls</SectionLabel>
                          <div className="mt-4 grid gap-3">
                            <Button variant="outline" className="rounded-2xl">Pause Session</Button>
                            <Button variant="outline" className="rounded-2xl">Refresh Heartbeat</Button>
                            <Button variant="outline" className="rounded-2xl">Move to Safe Hold</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="artifacts" className="m-0">
                <Card className="rounded-[24px] shadow-sm">
                  <CardHeader>
                    <CardTitle>Artifacts + Audit Trail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {artifacts.map((item) => (
                        <div key={item} className="rounded-2xl border border-slate-200 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-medium">{item}</div>
                              <div className="mt-1 text-sm text-slate-500">Stored for audit and replay review.</div>
                            </div>
                            <Button variant="outline" size="icon" className="rounded-2xl">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid gap-6 2xl:grid-cols-2">
              <Card className="rounded-[24px] shadow-sm">
                <CardHeader>
                  <CardTitle>Operational Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div>This mock is designed around a single-screen agent workflow rather than having reviewers work directly in the IRS browser.</div>
                  <Separator />
                  <div>Clean cases should take under one minute of human review. Exception cases are routed into a specialist workflow with explicit actions.</div>
                  <Separator />
                  <div>Bot control actions are surfaced in the same console so operations teams can approve, retry, pause, and audit without switching tools.</div>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] shadow-sm">
                <CardHeader>
                  <CardTitle>Next UI Decisions to Finalize</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div>1. Whether review and exception handling should live on one page or separate pages.</div>
                  <div>2. Whether agents should see source values side-by-side with bot-entered values.</div>
                  <div>3. Whether approvals should require a reason code or only exceptions should.</div>
                  <div>4. Which actions are available to standard reviewers vs specialist leads.</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
