import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Plus, Filter, ChevronDown, X, CheckCircle2, Clock,
  XCircle, Eye, FileText, Timer, ArrowLeft, AlertTriangle,
  Send, Lock, Calendar, Briefcase, Coffee, Users, Info, Trash2,
  ChevronRight, Layers
} from "lucide-react";
import { cn } from "../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface TimesheetEntryRecord {
  task: string;
  project: string;
  phase: string;
  week: string;
  hours: number;
  type: "paid" | "unpaid";
}

interface TimesheetRecord {
  id: string;
  month: string;
  year: number;
  entries: TimesheetEntryRecord[];
  totalHours: number;
  paidHours: number;
  unpaidHours: number;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected";
  submittedOn: string;
  approvedBy: string | null;
}

interface AssignedTask {
  id: string;
  label: string;
  project: string;
  phase: string;
  type: "paid" | "unpaid";
  pm: string;
  assignedHours: number;
}

interface TimesheetEntry {
  uid: string;
  taskId: string;
  monthIdx: number;
  week: number;
  hours: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ANNUAL_TOTAL_CAP = 1920;
const ANNUAL_PAID_CAP = 1824;
const ANNUAL_UNPAID_CAP = 96;
const YTD_PAID = 312;
const YTD_UNPAID = 16;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const EMPLOYEE = {
  name: "Kwame Asante",
  position: "Senior Project Officer",
  lineManager: "Dr. Akua Mensah",
};

const ASSIGNED_TASKS: AssignedTask[] = [
  { id: "t1", label: "Coordinate Field Data Collection", project: "Youth Employment Skills Training", phase: "Implementation", type: "paid", pm: "Yaw Osei", assignedHours: 120 },
  { id: "t2", label: "Conduct Stakeholder Engagement Sessions", project: "Youth Employment Skills Training", phase: "Implementation", type: "paid", pm: "Yaw Osei", assignedHours: 200 },
  { id: "t3", label: "Internal Peer Review of Draft", project: "Youth Employment Skills Training", phase: "Quality Assurance", type: "paid", pm: "Yaw Osei", assignedHours: 150 },
  { id: "t4", label: "Submit Final Technical Report", project: "Girls Education Empowerment", phase: "Reporting", type: "paid", pm: "Kofi Mensah", assignedHours: 80 },
  { id: "t5", label: "Design and Layout Report", project: "Girls Education Empowerment", phase: "Production & Editorial", type: "paid", pm: "Kofi Mensah", assignedHours: 60 },
  { id: "t6", label: "Annual Leave", project: "Non-Project Allocation", phase: "—", type: "unpaid", pm: "", assignedHours: 160 },
  { id: "t7", label: "Meetings (Non-Direct project related)", project: "Non-Project Allocation", phase: "—", type: "unpaid", pm: "", assignedHours: 96 },
  { id: "t8", label: "Public Holidays", project: "Non-Project Allocation", phase: "—", type: "unpaid", pm: "", assignedHours: 80 },
  { id: "t9", label: "Partnership Development", project: "Non-Project Allocation", phase: "—", type: "unpaid", pm: "", assignedHours: 96 },
  { id: "t10", label: "Personal Development Research", project: "Non-Project Allocation", phase: "—", type: "unpaid", pm: "", assignedHours: 96 },
];

const mockTimesheets: TimesheetRecord[] = [
  {
    id: "TS-001",
    month: "February",
    year: 2026,
    entries: [
      { task: "Coordinate Field Data Collection", project: "Youth Employment Skills Training", phase: "Implementation", week: "Week 1", hours: 20, type: "paid" },
      { task: "Conduct Stakeholder Engagement Sessions", project: "Youth Employment Skills Training", phase: "Implementation", week: "Week 1", hours: 12, type: "paid" },
      { task: "Annual Leave", project: "Non-Project Allocation", phase: "—", week: "Week 1", hours: 8, type: "unpaid" },
    ],
    totalHours: 40,
    paidHours: 32,
    unpaidHours: 8,
    status: "Approved",
    submittedOn: "Mar 01, 2026",
    approvedBy: "Yaw Osei",
  },
  {
    id: "TS-002",
    month: "February",
    year: 2026,
    entries: [
      { task: "Conduct Stakeholder Engagement Sessions", project: "Youth Employment Skills Training", phase: "Implementation", week: "Week 2", hours: 24, type: "paid" },
      { task: "Internal Peer Review of Draft", project: "Youth Employment Skills Training", phase: "Quality Assurance", week: "Week 2", hours: 14, type: "paid" },
    ],
    totalHours: 38,
    paidHours: 38,
    unpaidHours: 0,
    status: "Approved",
    submittedOn: "Mar 01, 2026",
    approvedBy: "Yaw Osei",
  },
  {
    id: "TS-003",
    month: "February",
    year: 2026,
    entries: [
      { task: "Submit Final Technical Report", project: "Girls Education Empowerment", phase: "Reporting", week: "Week 3", hours: 20, type: "paid" },
      { task: "Design and Layout Report", project: "Girls Education Empowerment", phase: "Production & Editorial", week: "Week 3", hours: 16, type: "paid" },
    ],
    totalHours: 36,
    paidHours: 36,
    unpaidHours: 0,
    status: "Approved",
    submittedOn: "Mar 01, 2026",
    approvedBy: "Kofi Mensah",
  },
  {
    id: "TS-004",
    month: "February",
    year: 2026,
    entries: [
      { task: "Annual Leave", project: "Non-Project Allocation", phase: "—", week: "Week 4", hours: 8, type: "unpaid" },
    ],
    totalHours: 8,
    paidHours: 0,
    unpaidHours: 8,
    status: "Approved",
    submittedOn: "Mar 01, 2026",
    approvedBy: "Dr. Akua Mensah",
  },
  {
    id: "TS-005",
    month: "March",
    year: 2026,
    entries: [
      { task: "Coordinate Field Data Collection", project: "Youth Employment Skills Training", phase: "Implementation", week: "Week 1", hours: 22, type: "paid" },
      { task: "Conduct Stakeholder Engagement Sessions", project: "Youth Employment Skills Training", phase: "Implementation", week: "Week 1", hours: 12, type: "paid" },
      { task: "Meetings (Non-Direct project related)", project: "Non-Project Allocation", phase: "—", week: "Week 1", hours: 4, type: "unpaid" },
      { task: "Annual Leave", project: "Non-Project Allocation", phase: "—", week: "Week 1", hours: 4, type: "unpaid" },
    ],
    totalHours: 42,
    paidHours: 34,
    unpaidHours: 8,
    status: "Pending Approval",
    submittedOn: "Mar 08, 2026",
    approvedBy: null,
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────────

function getWeekRanges(year: number, monthIdx: number): { weekNum: number; label: string }[] {
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const weeks: number[][] = [];
  let cur: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, monthIdx, d).getDay();
    if (dow === 1 && cur.length > 0) { weeks.push(cur); cur = []; }
    cur.push(d);
  }
  if (cur.length > 0) weeks.push(cur);

  return weeks.map((w, i) => ({
    weekNum: i,
    label: `Week ${i + 1} (${MONTHS[monthIdx].slice(0, 3)} ${w[0]} – ${w[w.length - 1]})`,
  }));
}

function isSubmissionWindowOpen(year: number, monthIdx: number): boolean {
  const today = new Date(2026, 2, 30); // Simulated: March 30, 2026
  const windowStart = new Date(year, monthIdx, 28);
  const nextMonth = monthIdx + 1;
  const windowEnd = new Date(nextMonth > 11 ? year + 1 : year, nextMonth > 11 ? 0 : nextMonth, 4, 23, 59, 59);
  return today >= windowStart && today <= windowEnd;
}

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", icon: <FileText size={12} /> },
  "Pending Approval": { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Clock size={12} /> },
  Approved: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <CheckCircle2 size={12} /> },
  Rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <XCircle size={12} /> },
};

// ── Component ───────────────────────────────────────────────────────────────────

export function EmployeeTimesheet() {
  const [view, setView] = useState<"list" | "submit">("list");

  // List state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDd, setShowStatusDd] = useState(false);
  const [viewDetail, setViewDetail] = useState<TimesheetRecord | null>(null);

  // Batch entries
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Batch totals
  const batchPaid = useMemo(() =>
    entries.reduce((s, e) => {
      const t = ASSIGNED_TASKS.find(a => a.id === e.taskId);
      return s + (t?.type === "paid" ? e.hours : 0);
    }, 0), [entries]);

  const batchUnpaid = useMemo(() =>
    entries.reduce((s, e) => {
      const t = ASSIGNED_TASKS.find(a => a.id === e.taskId);
      return s + (t?.type === "unpaid" ? e.hours : 0);
    }, 0), [entries]);

  const batchTotal = batchPaid + batchUnpaid;

  const newYtdPaid = YTD_PAID + batchPaid;
  const newYtdUnpaid = YTD_UNPAID + batchUnpaid;
  const newYtdTotal = newYtdPaid + newYtdUnpaid;

  const complianceItems = [
    { label: "Total Hours", logged: newYtdTotal, cap: ANNUAL_TOTAL_CAP, color: "bg-blue-500", textColor: "text-blue-700" },
    { label: "Paid Project", logged: newYtdPaid, cap: ANNUAL_PAID_CAP, color: "bg-purple-500", textColor: "text-purple-700" },
    { label: "Unpaid / Personal", logged: newYtdUnpaid, cap: ANNUAL_UNPAID_CAP, color: "bg-amber-500", textColor: "text-amber-700" },
  ];

  // Add a blank entry card
  const addEntry = () => {
    setEntries(prev => [...prev, { uid: `e-${Date.now()}`, taskId: "", monthIdx: 2, week: 0, hours: 0 }]);
  };

  const updateEntry = (uid: string, patch: Partial<TimesheetEntry>) => {
    setEntries(prev => prev.map(e => e.uid === uid ? { ...e, ...patch } : e));
    setErrors([]);
  };

  const removeEntry = (uid: string) => {
    setEntries(prev => prev.filter(e => e.uid !== uid));
    setErrors([]);
  };

  const resetSubmit = () => {
    setEntries([]);
    setErrors([]);
  };

  const handleSubmitAll = () => {
    const errs: string[] = [];
    if (entries.length === 0) { errs.push("Add at least one timesheet entry."); }

    entries.forEach((e, i) => {
      if (!e.taskId) errs.push(`Entry ${i + 1}: Please select a task.`);
      if (e.hours <= 0) errs.push(`Entry ${i + 1}: Please enter hours greater than 0.`);
      if (!isSubmissionWindowOpen(2026, e.monthIdx)) errs.push(`Entry ${i + 1}: Submission window is closed for ${MONTHS[e.monthIdx]}.`);
      const task = ASSIGNED_TASKS.find(a => a.id === e.taskId);
      if (task && e.hours > task.assignedHours) errs.push(`Entry ${i + 1}: Hours (${e.hours}) exceed assigned time for "${task.label}" (${task.assignedHours} hrs).`);
    });

    if (newYtdPaid > ANNUAL_PAID_CAP) errs.push(`Paid hours would exceed annual cap (${newYtdPaid}/${ANNUAL_PAID_CAP} hrs).`);
    if (newYtdUnpaid > ANNUAL_UNPAID_CAP) errs.push(`Unpaid hours would exceed annual cap (${newYtdUnpaid}/${ANNUAL_UNPAID_CAP} hrs).`);

    if (errs.length) { setErrors(errs); return; }

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      resetSubmit();
      setView("list");
    }, 2500);
  };

  // Filter list
  const filtered = mockTimesheets.filter(t => {
    const q = search.toLowerCase();
    const entryTexts = t.entries.map(e => `${e.task} ${e.project}`).join(" ").toLowerCase();
    const matchSearch = !q || entryTexts.includes(q) || t.id.toLowerCase().includes(q) || t.month.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Submit View ────────────────────────────────────────────────────────────

  if (view === "submit") {
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => { resetSubmit(); setView("list"); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
              <ArrowLeft size={18} className="text-slate-500" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Submit Timesheet</h1>
              <p className="text-[12px] text-slate-500">{EMPLOYEE.name} — {EMPLOYEE.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {entries.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-[12px] text-slate-600">
                <Briefcase size={13} />
                {entries.length} {entries.length === 1 ? "entry" : "entries"} · {batchTotal} hrs
              </div>
            )}
            <button
              onClick={handleSubmitAll}
              disabled={entries.length === 0}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors",
                entries.length > 0 ? "bg-purple-700 text-white hover:bg-purple-800" : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              <Send size={14} />
              Submit All ({entries.length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* YTD Compliance Meters */}
          <div className="grid grid-cols-3 gap-4">
            {complianceItems.map(m => {
              const pct = Math.min((m.logged / m.cap) * 100, 100);
              const over = m.logged > m.cap;
              return (
                <div key={m.label} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-slate-600">{m.label}</span>
                    <span className={cn("text-[12px] font-semibold", over ? "text-red-600" : m.textColor)}>
                      {m.logged} / {m.cap} hrs
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", over ? "bg-red-500" : m.color)} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 text-right">{Math.max(0, m.cap - m.logged)} hrs remaining</p>
                </div>
              );
            })}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-[13px] font-semibold text-red-800">Submission Blocked</span>
              </div>
              {errors.map((e, i) => (
                <p key={i} className="text-[12px] text-red-700 ml-6">• {e}</p>
              ))}
            </div>
          )}

          {/* Entry Cards */}
          {entries.map((entry, idx) => (
            <EntryCard
              key={entry.uid}
              entry={entry}
              index={idx}
              allEntries={entries}
              onUpdate={(patch) => updateEntry(entry.uid, patch)}
              onRemove={() => removeEntry(entry.uid)}
            />
          ))}

          {/* Empty state / Add button */}
          {entries.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-lg p-10 text-center">
              <FileText size={36} className="text-slate-200 mx-auto mb-3" />
              <p className="text-[14px] text-slate-500 mb-1">No entries yet</p>
              <p className="text-[12px] text-slate-400 mb-4">Add timesheet entries for the tasks you worked on this month.</p>
              <button
                onClick={addEntry}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-700 text-white rounded-lg text-[13px] font-medium hover:bg-purple-800 transition-colors"
              >
                <Plus size={14} />
                Add Entry
              </button>
            </div>
          ) : (
            <button
              onClick={addEntry}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-[13px] text-slate-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/30 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Add Another Entry
            </button>
          )}

          {/* Batch Summary */}
          {entries.length > 0 && entries.some(e => e.hours > 0) && (
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-purple-600" />
                <span className="text-[13px] font-semibold text-slate-900">Approval Routing</span>
              </div>
              <div className="space-y-2">
                {(() => {
                  const approverMap = new Map<string, { role: string; tasks: string[] }>();
                  entries.forEach(e => {
                    const t = ASSIGNED_TASKS.find(a => a.id === e.taskId);
                    if (!t || e.hours <= 0) return;
                    const approver = t.type === "paid" ? t.pm : EMPLOYEE.lineManager;
                    const role = t.type === "paid" ? "Project Manager" : "Line Manager";
                    if (!approverMap.has(approver)) approverMap.set(approver, { role, tasks: [] });
                    approverMap.get(approver)!.tasks.push(t.label);
                  });
                  return Array.from(approverMap.entries()).map(([name, info]) => (
                    <div key={name} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                          <Users size={11} className="text-purple-700" />
                        </div>
                        <span className="text-[12px] font-medium text-slate-900">{name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">{info.role}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5 ml-8">
                        {info.tasks.map((tk, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">{tk}</span>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Success Toast */}
        {submitSuccess && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle2 size={18} />
            <div>
              <p className="text-[13px] font-medium">All {entries.length} entries submitted!</p>
              <p className="text-[11px] text-emerald-200">Status: Pending Approval</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── List View ──────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Employee Timesheet</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200">
            <Clock size={12} />
            {mockTimesheets.filter(r => r.status === "Pending Approval").length} Pending
          </span>
        </div>
        <button
          onClick={() => setView("submit")}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors font-medium"
        >
          <Plus size={14} />
          Submit Timesheet
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by task, project, month..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
          />
          {search && <button onClick={() => setSearch("")}><X size={13} className="text-slate-400 hover:text-slate-600" /></button>}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStatusDd(!showStatusDd)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[12px] transition-colors",
              statusFilter !== "All" ? "border-purple-300 bg-purple-50 text-purple-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            <Filter size={13} />
            {statusFilter === "All" ? "All Status" : statusFilter}
            <ChevronDown size={11} />
          </button>
          {showStatusDd && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusDd(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2">
                {["All", "Draft", "Pending Approval", "Approved", "Rejected"].map(s => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setShowStatusDd(false); }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-between",
                      statusFilter === s ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {s === "All" ? "All Status" : s}
                    {statusFilter === s && <CheckCircle2 size={13} className="text-purple-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* YTD Compliance Strip */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center gap-6 shrink-0">
        <span className="text-[11px] text-slate-500 font-medium">YTD Compliance:</span>
        {[
          { label: "Total", logged: YTD_PAID + YTD_UNPAID, cap: ANNUAL_TOTAL_CAP, color: "bg-blue-500" },
          { label: "Paid", logged: YTD_PAID, cap: ANNUAL_PAID_CAP, color: "bg-purple-500" },
          { label: "Unpaid", logged: YTD_UNPAID, cap: ANNUAL_UNPAID_CAP, color: "bg-amber-500" },
        ].map(m => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600">{m.label}:</span>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", m.color)} style={{ width: `${Math.min((m.logged / m.cap) * 100, 100)}%` }} />
            </div>
            <span className="text-[11px] text-slate-500">{m.logged}/{m.cap}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-[5]">
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">ID</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Period</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Entries</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Total Hours</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Paid</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Unpaid</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Submitted</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Approved By</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-16">
                  <FileText size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No timesheets found</p>
                </td>
              </tr>
            ) : (
              filtered.map((t, idx) => {
                const sc = statusConfig[t.status];
                return (
                  <tr key={t.id} className={cn("border-b border-slate-100 hover:bg-slate-50 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-slate-50/50")}>
                    <td className="px-6 py-3 text-[12px] font-medium text-[#0B01D0]">{t.id}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 font-medium">{t.month} {t.year}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full text-[11px] text-slate-600 font-medium">
                        <Layers size={11} />
                        {t.entries.length} {t.entries.length === 1 ? "entry" : "entries"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 text-center font-medium">{t.totalHours} hrs</td>
                    <td className="px-6 py-3 text-[12px] text-purple-700 text-center font-medium">{t.paidHours} hrs</td>
                    <td className="px-6 py-3 text-[12px] text-amber-700 text-center font-medium">{t.unpaidHours} hrs</td>
                    <td className="px-6 py-3">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", sc.bg, sc.text)}>
                        {sc.icon}{t.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{t.submittedOn}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-600">{t.approvedBy || "—"}</td>
                    <td className="px-6 py-3 text-center">
                      <button onClick={() => setViewDetail(t)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Eye size={14} className="text-slate-400" /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {viewDetail && (() => {
        const sc = statusConfig[viewDetail.status];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setViewDetail(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[85vh] overflow-auto">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><ArrowLeft size={16} className="text-slate-500" /></button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] font-semibold text-slate-900">{viewDetail.id}</h2>
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", sc.bg, sc.text)}>{sc.icon}{viewDetail.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{viewDetail.month} {viewDetail.year} · {viewDetail.entries.length} {viewDetail.entries.length === 1 ? "entry" : "entries"}</p>
                  </div>
                </div>
                <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>

              <div className="p-6 space-y-5">
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Hours</p>
                    <p className="text-[18px] font-semibold text-slate-900">{viewDetail.totalHours}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-purple-500 uppercase tracking-wider mb-1">Paid Hours</p>
                    <p className="text-[18px] font-semibold text-purple-700">{viewDetail.paidHours}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-amber-500 uppercase tracking-wider mb-1">Unpaid Hours</p>
                    <p className="text-[18px] font-semibold text-amber-700">{viewDetail.unpaidHours}</p>
                  </div>
                </div>

                {/* Timesheet info */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4 font-medium">Timesheet Info</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Period</p><p className="text-[13px] text-slate-900">{viewDetail.month} {viewDetail.year}</p></div>
                    <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Submitted</p><p className="text-[13px] text-slate-900">{viewDetail.submittedOn}</p></div>
                    <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Approved By</p><p className="text-[13px] text-slate-900">{viewDetail.approvedBy || "—"}</p></div>
                  </div>
                </div>

                {/* Entries table */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers size={14} className="text-[#0B01D0]" />
                    <span className="text-[13px] font-semibold text-slate-900">Timesheet Entries ({viewDetail.entries.length})</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: "#0B01D0" }}>
                          <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">#</th>
                          <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">Task</th>
                          <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">Project</th>
                          <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">Phase</th>
                          <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">Week</th>
                          <th className="text-center px-4 py-2.5 text-white text-[11px] font-semibold">Hours</th>
                          <th className="text-center px-4 py-2.5 text-white text-[11px] font-semibold">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewDetail.entries.map((entry, i) => (
                          <tr key={i} className={cn("border-b border-slate-100", i % 2 === 0 ? "bg-white" : "bg-slate-50/50")}>
                            <td className="px-4 py-2.5 text-[11px] text-slate-400">{i + 1}</td>
                            <td className="px-4 py-2.5 text-[12px] text-slate-900 font-medium">{entry.task}</td>
                            <td className="px-4 py-2.5 text-[12px] text-slate-600">{entry.project}</td>
                            <td className="px-4 py-2.5 text-[12px] text-slate-500">{entry.phase}</td>
                            <td className="px-4 py-2.5 text-[12px] text-slate-600">{entry.week}</td>
                            <td className="px-4 py-2.5 text-[12px] text-slate-900 text-center font-medium">{entry.hours} hrs</td>
                            <td className="px-4 py-2.5 text-center">
                              <span className={cn(
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border font-medium",
                                entry.type === "paid" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"
                              )}>
                                {entry.type === "paid" ? <Briefcase size={9} /> : <Coffee size={9} />}
                                {entry.type === "paid" ? "Paid" : "Unpaid"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* Totals row */}
                        <tr className="bg-slate-100 border-t-2 border-slate-300">
                          <td colSpan={5} className="px-4 py-2.5 text-[12px] font-semibold text-slate-700 text-right">Total</td>
                          <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-900 text-center">{viewDetail.totalHours} hrs</td>
                          <td className="px-4 py-2.5"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Entry Card ──────────────────────────────────────────────────────────────────

function EntryCard({
  entry,
  index,
  allEntries,
  onUpdate,
  onRemove,
}: {
  entry: TimesheetEntry;
  index: number;
  allEntries: TimesheetEntry[];
  onUpdate: (patch: Partial<TimesheetEntry>) => void;
  onRemove: () => void;
}) {
  const [showTaskDd, setShowTaskDd] = useState(false);
  const [showMonthDd, setShowMonthDd] = useState(false);
  const [showWeekDd, setShowWeekDd] = useState(false);
  const taskBtnRef = useRef<HTMLButtonElement>(null);
  const [ddPos, setDdPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const selectedTask = ASSIGNED_TASKS.find(t => t.id === entry.taskId);
  const weekRanges = useMemo(() => getWeekRanges(2026, entry.monthIdx), [entry.monthIdx]);
  const windowOpen = isSubmissionWindowOpen(2026, entry.monthIdx);

  const isPaid = selectedTask?.type === "paid";
  
  // Calculate hours used by OTHER entry cards for the same task
  const hoursUsedByOthers = useMemo(() => {
    if (!entry.taskId) return 0;
    return allEntries
      .filter(e => e.uid !== entry.uid && e.taskId === entry.taskId)
      .reduce((sum, e) => sum + e.hours, 0);
  }, [allEntries, entry.uid, entry.taskId]);

  const effectiveAssigned = selectedTask ? Math.max(0, selectedTask.assignedHours - hoursUsedByOthers) : 0;
  const hoursExceeded = selectedTask && entry.hours > effectiveAssigned;

  const openTaskDd = () => {
    if (taskBtnRef.current) {
      const rect = taskBtnRef.current.getBoundingClientRect();
      setDdPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setShowTaskDd(!showTaskDd);
    setShowMonthDd(false);
    setShowWeekDd(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      {/* Card header */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[11px] font-semibold text-purple-700">
            {index + 1}
          </div>
          <span className="text-[13px] font-semibold text-slate-900">
            {selectedTask ? selectedTask.label : "New Entry"}
          </span>
          {selectedTask && (
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full border font-medium",
              isPaid ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"
            )}>
              {isPaid ? "Paid" : "Unpaid"}
            </span>
          )}
          {!windowOpen && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full border bg-red-50 text-red-600 border-red-200 font-medium flex items-center gap-1">
              <Lock size={9} /> Window Closed
            </span>
          )}
        </div>
        <button onClick={onRemove} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="grid grid-cols-4 gap-4">
          {/* Task dropdown */}
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Assigned Task</label>
            <button
              ref={taskBtnRef}
              onClick={openTaskDd}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[13px] hover:border-slate-400 transition-colors"
            >
              {selectedTask ? (
                <div className="flex items-center gap-2 text-left min-w-0">
                  {isPaid
                    ? <Briefcase size={13} className="text-purple-600 flex-shrink-0" />
                    : <Coffee size={13} className="text-amber-600 flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-[12px] text-slate-900 truncate">{selectedTask.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{selectedTask.project}{selectedTask.phase !== "—" ? ` · ${selectedTask.phase}` : ""}</p>
                  </div>
                </div>
              ) : (
                <span className="text-slate-400 text-[12px]">Select task...</span>
              )}
              <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
            </button>

            {showTaskDd && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setShowTaskDd(false)} />
                <div
                  className="fixed bg-white border border-slate-200 rounded-lg shadow-xl z-[101] max-h-80 overflow-y-auto"
                  style={{ top: ddPos.top, left: ddPos.left, width: ddPos.width }}
                >
                  <div className="px-3 py-2 bg-purple-50 border-b border-purple-200 sticky top-0 z-[1]">
                    <span className="text-[10px] font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase size={10} /> Paid — Project Tasks
                    </span>
                  </div>
                  {ASSIGNED_TASKS.filter(t => t.type === "paid").map(t => {
                    const othersHrs = allEntries
                      .filter(e => e.uid !== entry.uid && e.taskId === t.id)
                      .reduce((sum, e) => sum + e.hours, 0);
                    const remaining = Math.max(0, t.assignedHours - othersHrs);
                    return (
                    <button
                      key={t.id}
                      onClick={() => { onUpdate({ taskId: t.id, hours: 0 }); setShowTaskDd(false); }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 transition-colors",
                        entry.taskId === t.id && "bg-purple-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-[12px] text-slate-900">{t.label}</p>
                          <p className="text-[10px] text-slate-400">{t.project} · {t.phase}</p>
                        </div>
                        <span className={cn("text-[10px] font-medium shrink-0 ml-2", remaining < t.assignedHours ? "text-amber-600" : "text-purple-600")}>
                          {remaining} / {t.assignedHours} hrs
                        </span>
                      </div>
                    </button>
                    );
                  })}
                  <div className="px-3 py-2 bg-amber-50 border-b border-amber-200 sticky top-0 z-[1]">
                    <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Coffee size={10} /> Non-Project Allocation (Unpaid Project & Personal Development)
                    </span>
                  </div>
                  {ASSIGNED_TASKS.filter(t => t.type === "unpaid").map(t => (
                    <button
                      key={t.id}
                      onClick={() => { onUpdate({ taskId: t.id, hours: 0 }); setShowTaskDd(false); }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 transition-colors",
                        entry.taskId === t.id && "bg-amber-50"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-[12px] text-slate-900">{t.label}</p>
                        <p className="text-[10px] text-slate-400">Non-Project Allocation</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Month dropdown */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Month</label>
            <button
              onClick={() => { setShowMonthDd(!showMonthDd); setShowTaskDd(false); setShowWeekDd(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[12px] hover:border-slate-400 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span className="text-slate-900">{MONTHS[entry.monthIdx]}</span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {showMonthDd && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMonthDd(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                  {MONTHS.map((m, idx) => (
                    <button
                      key={m}
                      onClick={() => { onUpdate({ monthIdx: idx, week: 0 }); setShowMonthDd(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-[12px] hover:bg-slate-50 transition-colors",
                        entry.monthIdx === idx ? "bg-purple-50 text-purple-700 font-medium" : "text-slate-700"
                      )}
                    >
                      {m} 2026
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Week dropdown */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Week</label>
            <button
              onClick={() => { setShowWeekDd(!showWeekDd); setShowTaskDd(false); setShowMonthDd(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[12px] hover:border-slate-400 transition-colors"
            >
              <span className="text-slate-900">Week {entry.week + 1}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {showWeekDd && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowWeekDd(false)} />
                <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                  {weekRanges.map(w => (
                    <button
                      key={w.weekNum}
                      onClick={() => { onUpdate({ week: w.weekNum }); setShowWeekDd(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-[12px] hover:bg-slate-50 transition-colors",
                        entry.week === w.weekNum ? "bg-purple-50 text-purple-700 font-medium" : "text-slate-700"
                      )}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hours input + assigned hours info */}
        <div className="mt-4 flex items-start gap-4">
          <div className="w-48">
            <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">Hours</label>
            <div className={cn(
              "flex items-center border rounded-lg overflow-hidden focus-within:ring-2",
              hoursExceeded
                ? "border-red-400 focus-within:ring-red-400/30 focus-within:border-red-400"
                : "border-slate-300 focus-within:ring-purple-400/30 focus-within:border-purple-400"
            )}>
              <input
                type="number"
                min={0}
                max={effectiveAssigned || 168}
                step={0.5}
                value={entry.hours || ""}
                onChange={e => {
                  const val = Math.max(0, parseFloat(e.target.value) || 0);
                  if (selectedTask && val > effectiveAssigned) return;
                  onUpdate({ hours: val });
                }}
                className="w-full px-3 py-2.5 text-[13px] text-slate-900 outline-none"
                placeholder="0"
              />
              <span className="px-3 text-[11px] text-slate-400 bg-slate-50 py-2.5 border-l border-slate-300">hrs</span>
            </div>
            {selectedTask && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <Timer size={11} className={cn(hoursExceeded ? "text-red-500" : "text-slate-400")} />
                <span className={cn("text-[10px]", hoursExceeded ? "text-red-600 font-medium" : "text-slate-500")}>
                  Available: {effectiveAssigned} hrs
                  {hoursUsedByOthers > 0 && (
                    <> (Total: {selectedTask.assignedHours} hrs − {hoursUsedByOthers} hrs used in other entries)</>
                  )}
                  {entry.hours > 0 && (
                    <> · Remaining: {Math.max(0, effectiveAssigned - entry.hours)} hrs</>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}