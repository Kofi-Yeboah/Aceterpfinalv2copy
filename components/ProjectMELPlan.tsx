import { useState, useMemo } from "react";
import {
  Plus, Search, MoreHorizontal, CheckCircle2, TrendingUp, Target,
  BarChart3, ChevronDown, X, Activity, Layers, ClipboardList,
  Upload, Filter, Eye, Edit2, Trash2, FileText, Calendar
} from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

type IndicatorLevel = "Output" | "Outcome" | "Impact" | "Cross-cutting";
type IndicatorStatus = "Baseline Set" | "On Track" | "Off Track" | "Pending" | "Achieved";
type AssignmentLevel = "Project" | "Phase" | "Deliverable" | "Task";

interface Phase {
  number: number;
  name: string;
  tasks: { id: string; name: string; assignedTo: string; startDate: string; endDate: string; hours: number; status: string }[];
}

interface Deliverable {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isPrimary: boolean;
}

interface MELIndicator {
  id: string;
  name: string;
  level: IndicatorLevel;
  baseline: number;
  target: number;
  current: number;
  source: string;
  freq: string;
  status: IndicatorStatus;
  assignmentLevel: AssignmentLevel;
  assignedTo: string; // name of the project/phase/deliverable/task
  responsible: string;
}

interface ProjectMELPlanProps {
  projectName: string;
  projectStage: string;
  isClosure: boolean;
  phases: Phase[];
  deliverables: Deliverable[];
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SEED DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const SEED_INDICATORS: MELIndicator[] = [
  { id: "IND-001", name: "Youth enrolled in skills training programs", level: "Output", baseline: 0, target: 2000, current: 0, source: "Registration Database", freq: "Monthly", status: "Baseline Set", assignmentLevel: "Phase", assignedTo: "Implementation", responsible: "Ama Darko" },
  { id: "IND-002", name: "Youth who complete vocational certification", level: "Outcome", baseline: 0, target: 1500, current: 0, source: "Certification Records", freq: "Quarterly", status: "Baseline Set", assignmentLevel: "Phase", assignedTo: "Quality Assurance", responsible: "Kofi Mensah" },
  { id: "IND-003", name: "Youth trained in digital skills", level: "Output", baseline: 0, target: 800, current: 125, source: "Results Framework", freq: "Monthly", status: "On Track", assignmentLevel: "Task", assignedTo: "Conduct Stakeholder Engagement Sessions", responsible: "Kwaku Anane" },
  { id: "IND-004", name: "Youth placed in employment / internships", level: "Outcome", baseline: 0, target: 600, current: 0, source: "Employer Reports", freq: "Quarterly", status: "Baseline Set", assignmentLevel: "Phase", assignedTo: "Dissemination", responsible: "Yaw Osei" },
  { id: "IND-005", name: "Training centres operational", level: "Output", baseline: 2, target: 8, current: 4, source: "Site Inspections", freq: "Quarterly", status: "On Track", assignmentLevel: "Deliverable", assignedTo: "Baseline Study Report", responsible: "Yaw Osei" },
  { id: "IND-006", name: "Female participation rate", level: "Cross-cutting", baseline: 30, target: 50, current: 42, source: "Registration Database", freq: "Monthly", status: "On Track", assignmentLevel: "Project", assignedTo: "", responsible: "Ama Darko" },
  { id: "IND-007", name: "Employer satisfaction with graduates", level: "Impact", baseline: 0, target: 80, current: 0, source: "Employer Surveys", freq: "Bi-annual", status: "Pending", assignmentLevel: "Phase", assignedTo: "Reporting", responsible: "Nana Yaw" },
  { id: "IND-008", name: "Community awareness of program", level: "Output", baseline: 15, target: 70, current: 35, source: "Community Surveys", freq: "Quarterly", status: "On Track", assignmentLevel: "Task", assignedTo: "Plan Distribution Channels", responsible: "Yaw Osei" },
  { id: "IND-009", name: "Partnerships established with private sector", level: "Output", baseline: 3, target: 15, current: 0, source: "MOU Tracker", freq: "Quarterly", status: "Baseline Set", assignmentLevel: "Deliverable", assignedTo: "Stakeholder Consultation Summary", responsible: "Kwaku Anane" },
  { id: "IND-010", name: "Post-training income increase (%)", level: "Impact", baseline: 0, target: 25, current: 0, source: "Household Surveys", freq: "Annual", status: "Baseline Set", assignmentLevel: "Project", assignedTo: "", responsible: "Kofi Mensah" },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */

const levelColors: Record<IndicatorLevel, { bg: string; text: string; border: string }> = {
  Output: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Outcome: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Impact: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "Cross-cutting": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
};

const statusColors: Record<IndicatorStatus, { bg: string; text: string }> = {
  "On Track": { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Baseline Set": { bg: "bg-blue-50", text: "text-blue-700" },
  "Off Track": { bg: "bg-red-50", text: "text-red-600" },
  Pending: { bg: "bg-slate-100", text: "text-slate-600" },
  Achieved: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

const assignmentLevelColors: Record<AssignmentLevel, { bg: string; text: string }> = {
  Project: { bg: "bg-indigo-50", text: "text-indigo-700" },
  Phase: { bg: "bg-cyan-50", text: "text-cyan-700" },
  Deliverable: { bg: "bg-amber-50", text: "text-amber-700" },
  Task: { bg: "bg-violet-50", text: "text-violet-700" },
};

const isPercentage = (ind: MELIndicator) => ind.level === "Cross-cutting" || ind.id === "IND-007" || ind.id === "IND-010";

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function ProjectMELPlan({ projectName, projectStage, isClosure, phases, deliverables }: ProjectMELPlanProps) {
  const [indicators, setIndicators] = useState<MELIndicator[]>(
    () => SEED_INDICATORS.map(ind => isClosure ? { ...ind, current: ind.target, status: "Achieved" as IndicatorStatus } : ind)
  );
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<"All" | IndicatorLevel>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | IndicatorStatus>("All");
  const [filterAssignment, setFilterAssignment] = useState<"All" | AssignmentLevel>("All");
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<MELIndicator | null>(null);

  // Add indicator form state
  const [formData, setFormData] = useState({
    name: "",
    level: "Output" as IndicatorLevel,
    baseline: 0,
    target: 0,
    source: "",
    freq: "Monthly",
    assignmentLevel: "Project" as AssignmentLevel,
    assignedTo: "",
    responsible: "",
  });

  // Build assignment options based on selected level
  const allTasks = useMemo(() => phases.flatMap(p => p.tasks.map(t => ({ id: t.id, name: t.name }))), [phases]);
  const phaseNames = useMemo(() => phases.map(p => p.name), [phases]);
  const deliverableNames = useMemo(() => deliverables.map(d => d.title), [deliverables]);

  const getAssignmentOptions = (level: AssignmentLevel): string[] => {
    switch (level) {
      case "Project": return [projectName];
      case "Phase": return phaseNames;
      case "Deliverable": return deliverableNames;
      case "Task": return allTasks.map(t => t.name);
    }
  };

  const getAssignmentLabel = (level: AssignmentLevel): string => {
    switch (level) {
      case "Project": return "Assigned Project";
      case "Phase": return "Assigned Phase";
      case "Deliverable": return "Assigned Deliverable";
      case "Task": return "Assigned Task";
    }
  };

  // Reset assignedTo when assignment level changes
  const handleAssignmentLevelChange = (level: AssignmentLevel) => {
    setFormData(prev => ({
      ...prev,
      assignmentLevel: level,
      assignedTo: level === "Project" ? projectName : "",
    }));
  };

  // Filtered indicators
  const filtered = useMemo(() => {
    return indicators.filter(ind => {
      if (search && !ind.name.toLowerCase().includes(search.toLowerCase()) && !ind.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterLevel !== "All" && ind.level !== filterLevel) return false;
      if (filterStatus !== "All" && ind.status !== filterStatus) return false;
      if (filterAssignment !== "All" && ind.assignmentLevel !== filterAssignment) return false;
      return true;
    });
  }, [indicators, search, filterLevel, filterStatus, filterAssignment]);

  // Summary stats
  const stats = useMemo(() => {
    const total = indicators.length;
    const onTrack = indicators.filter(i => i.status === "On Track" || i.status === "Achieved").length;
    const baselineSet = indicators.filter(i => i.status === "Baseline Set").length;
    const offTrack = indicators.filter(i => i.status === "Off Track").length;
    const pending = indicators.filter(i => i.status === "Pending").length;
    const uniqueSources = new Set(indicators.map(i => i.source)).size;
    const avgProgress = indicators.length > 0
      ? Math.round(indicators.reduce((sum, i) => sum + (i.target > 0 ? (i.current / i.target) * 100 : 0), 0) / indicators.length)
      : 0;
    return { total, onTrack, baselineSet, offTrack, pending, uniqueSources, avgProgress };
  }, [indicators]);

  const handleAddIndicator = () => {
    if (!formData.name.trim() || formData.target <= 0) return;
    const newInd: MELIndicator = {
      id: `IND-${String(indicators.length + 1).padStart(3, "0")}`,
      name: formData.name,
      level: formData.level,
      baseline: formData.baseline,
      target: formData.target,
      current: 0,
      source: formData.source,
      freq: formData.freq,
      status: "Baseline Set",
      assignmentLevel: formData.assignmentLevel,
      assignedTo: formData.assignmentLevel === "Project" ? "" : formData.assignedTo,
      responsible: formData.responsible,
    };
    setIndicators(prev => [...prev, newInd]);
    setShowAddModal(false);
    setFormData({ name: "", level: "Output", baseline: 0, target: 0, source: "", freq: "Monthly", assignmentLevel: "Project", assignedTo: "", responsible: "" });
  };

  return (
    <div className="space-y-0">
      {/* Closure banner */}
      {isClosure && (
        <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 mb-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-[12px] text-emerald-800 font-medium">Project Closed — All indicator targets achieved and final evaluation completed</span>
        </div>
      )}

      {/* ── Summary Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Target size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Indicators</p>
            <p className="text-[22px] font-semibold text-slate-900 leading-tight">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{isClosure ? "Achieved" : "On Track"}</p>
            <p className="text-[22px] font-semibold text-emerald-700 leading-tight">{stats.onTrack}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <BarChart3 size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{isClosure ? "Off Track" : "Baseline Set"}</p>
            <p className="text-[22px] font-semibold text-amber-700 leading-tight">{isClosure ? 0 : stats.baselineSet}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <Activity size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Avg. Progress</p>
            <p className="text-[22px] font-semibold text-purple-700 leading-tight">{isClosure ? 100 : stats.avgProgress}%</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-slate-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Data Sources</p>
            <p className="text-[22px] font-semibold text-slate-700 leading-tight">{stats.uniqueSources}</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white flex-1 max-w-xs">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search indicators..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400 bg-transparent"
          />
        </div>

        <select
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value as any)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white outline-none cursor-pointer"
        >
          <option value="All">All Levels</option>
          <option value="Output">Output</option>
          <option value="Outcome">Outcome</option>
          <option value="Impact">Impact</option>
          <option value="Cross-cutting">Cross-cutting</option>
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white outline-none cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="On Track">On Track</option>
          <option value="Baseline Set">Baseline Set</option>
          <option value="Off Track">Off Track</option>
          <option value="Pending">Pending</option>
          {isClosure && <option value="Achieved">Achieved</option>}
        </select>

        <select
          value={filterAssignment}
          onChange={e => setFilterAssignment(e.target.value as any)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white outline-none cursor-pointer"
        >
          <option value="All">All Assignment Levels</option>
          <option value="Project">Project</option>
          <option value="Phase">Phase</option>
          <option value="Deliverable">Deliverable</option>
          <option value="Task">Task</option>
        </select>

        <div className="flex-1" />

        <button
          onClick={() => {
            setFormData({ name: "", level: "Output", baseline: 0, target: 0, source: "", freq: "Monthly", assignmentLevel: "Project", assignedTo: projectName, responsible: "" });
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8] transition-colors"
        >
          <Plus size={14} /> Add Indicator
        </button>
      </div>

      {/* ── Indicators Table ───────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">ID</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Indicator</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Level</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Assigned To</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Baseline</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Target</th>
                {projectStage !== "Procurement" && (
                  <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Progress</th>
                )}
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Data Source</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Frequency</th>
                {projectStage !== "Procurement" && (
                  <>
                    <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Status</th>
                    <th className="text-center px-4 py-3 text-white text-[11px] font-semibold w-10"></th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Target size={28} className="text-slate-300 mb-2" />
                      <p className="text-[13px] text-slate-500 font-medium">No indicators match your filters</p>
                      <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((ind, idx) => {
                  const progressPct = ind.target > 0 ? Math.round((ind.current / ind.target) * 100) : 0;
                  const lc = levelColors[ind.level];
                  const sc = statusColors[ind.status];
                  const ac = assignmentLevelColors[ind.assignmentLevel];
                  const isPct = isPercentage(ind);
                  return (
                    <tr
                      key={ind.id}
                      className={cn(
                        "border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer",
                        idx % 2 === 1 ? "bg-slate-50/50" : ""
                      )}
                      onClick={() => setSelectedIndicator(ind)}
                    >
                      <td className="px-4 py-3 text-[11px] font-mono font-medium text-slate-900">{ind.id}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-700 max-w-[220px]">
                        <p className="truncate">{ind.name}</p>
                        {ind.responsible && (
                          <p className="text-[10px] text-slate-400 mt-0.5">Responsible: {ind.responsible}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border", lc.bg, lc.text, lc.border)}>{ind.level}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium w-fit", ac.bg, ac.text)}>{ind.assignmentLevel}</span>
                          <span className="text-[11px] text-slate-600 truncate max-w-[160px]">
                            {ind.assignmentLevel === "Project" ? projectName : ind.assignedTo}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[12px] text-slate-600">{isPct ? `${ind.baseline}%` : ind.baseline.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-900">{isPct ? `${ind.target}%` : ind.target.toLocaleString()}</td>
                      {projectStage !== "Procurement" && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[12px] font-medium text-slate-900">{isPct ? `${ind.current}%` : ind.current.toLocaleString()}</span>
                            <div className="flex items-center gap-1.5 w-full justify-end">
                              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    progressPct >= 75 ? "bg-emerald-500"
                                    : progressPct >= 50 ? "bg-blue-500"
                                    : progressPct >= 25 ? "bg-amber-500"
                                    : "bg-slate-300"
                                  )}
                                  style={{ width: `${Math.min(progressPct, 100)}%` }}
                                />
                              </div>
                              <span className="text-[9px] text-slate-400 w-7 text-right">{progressPct}%</span>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-[11px] text-slate-600">{ind.source}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">{ind.freq}</td>
                      {projectStage !== "Procurement" && (
                        <>
                          <td className="px-4 py-3">
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", sc.bg, sc.text)}>{ind.status}</span>
                          </td>
                          <td className="px-4 py-3 relative">
                            <button
                              className="text-slate-400 hover:text-slate-600"
                              onClick={e => { e.stopPropagation(); setOpenActionMenu(openActionMenu === ind.id ? null : ind.id); }}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openActionMenu === ind.id && (
                              <div className="absolute right-4 top-10 z-50 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                                <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenActionMenu(null)}><Edit2 size={12} /> Update Current Value</button>
                                <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenActionMenu(null)}><ClipboardList size={12} /> Edit Indicator Details</button>
                                <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenActionMenu(null)}><FileText size={12} /> Change Data Source</button>
                                <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenActionMenu(null)}><Upload size={12} /> Upload Evidence</button>
                                <div className="border-t border-slate-100 my-1" />
                                <button className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenActionMenu(null)}><Eye size={12} /> View Data History</button>
                                <button className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => setOpenActionMenu(null)}><Trash2 size={12} /> Deactivate Indicator</button>
                              </div>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Indicator Detail Slide-over ─────────────────────────────────── */}
      {selectedIndicator && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedIndicator(null)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl overflow-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#0B01D0] font-medium uppercase tracking-wider mb-0.5">{selectedIndicator.id}</p>
                <h3 className="text-[14px] font-semibold text-slate-900">{selectedIndicator.name}</h3>
              </div>
              <button onClick={() => setSelectedIndicator(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Progress ring */}
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke={selectedIndicator.status === "On Track" || selectedIndicator.status === "Achieved" ? "#10b981" : selectedIndicator.status === "Off Track" ? "#ef4444" : "#6366f1"}
                      strokeWidth="3"
                      strokeDasharray={`${(selectedIndicator.target > 0 ? Math.min((selectedIndicator.current / selectedIndicator.target) * 97.4, 97.4) : 0)} 97.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[14px] font-semibold text-slate-900">
                      {selectedIndicator.target > 0 ? Math.round((selectedIndicator.current / selectedIndicator.target) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Baseline</p>
                    <p className="text-[14px] font-semibold text-slate-900">{isPercentage(selectedIndicator) ? `${selectedIndicator.baseline}%` : selectedIndicator.baseline.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Current</p>
                    <p className="text-[14px] font-semibold text-blue-700">{isPercentage(selectedIndicator) ? `${selectedIndicator.current}%` : selectedIndicator.current.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Target</p>
                    <p className="text-[14px] font-semibold text-emerald-700">{isPercentage(selectedIndicator) ? `${selectedIndicator.target}%` : selectedIndicator.target.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="space-y-3">
                <DetailRow label="Indicator Level">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border", levelColors[selectedIndicator.level].bg, levelColors[selectedIndicator.level].text, levelColors[selectedIndicator.level].border)}>{selectedIndicator.level}</span>
                </DetailRow>
                <DetailRow label="Status">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", statusColors[selectedIndicator.status].bg, statusColors[selectedIndicator.status].text)}>{selectedIndicator.status}</span>
                </DetailRow>
                <DetailRow label="Assignment Level">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium", assignmentLevelColors[selectedIndicator.assignmentLevel].bg, assignmentLevelColors[selectedIndicator.assignmentLevel].text)}>{selectedIndicator.assignmentLevel}</span>
                </DetailRow>
                <DetailRow label={getAssignmentLabel(selectedIndicator.assignmentLevel)}>
                  <span className="text-[12px] text-slate-700">{selectedIndicator.assignmentLevel === "Project" ? projectName : selectedIndicator.assignedTo}</span>
                </DetailRow>
                <DetailRow label="Data Source">
                  <span className="text-[12px] text-slate-700">{selectedIndicator.source}</span>
                </DetailRow>
                <DetailRow label="Collection Frequency">
                  <span className="text-[12px] text-slate-700">{selectedIndicator.freq}</span>
                </DetailRow>
                <DetailRow label="Responsible">
                  <span className="text-[12px] text-slate-700">{selectedIndicator.responsible}</span>
                </DetailRow>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                  <Edit2 size={12} /> Update Value
                </button>
                <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[11px] text-slate-700 hover:bg-slate-50">
                  <Upload size={12} /> Upload Evidence
                </button>
                <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[11px] text-slate-700 hover:bg-slate-50">
                  <Eye size={12} /> Data History
                </button>
                <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[11px] text-slate-700 hover:bg-slate-50">
                  <FileText size={12} /> Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Indicator Modal ────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900">Add Indicator</h2>
                <p className="text-[11px] text-slate-400">Create a new MEL indicator for this project</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-400" /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Indicator Name */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Indicator Name <span className="text-red-400">*</span></label>
                <input
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Number of beneficiaries trained"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0] transition-colors"
                />
              </div>

              {/* Level + Frequency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Indicator Level <span className="text-red-400">*</span></label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData(p => ({ ...p, level: e.target.value as IndicatorLevel }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0] bg-white cursor-pointer"
                  >
                    <option value="Output">Output</option>
                    <option value="Outcome">Outcome</option>
                    <option value="Impact">Impact</option>
                    <option value="Cross-cutting">Cross-cutting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Collection Frequency</label>
                  <select
                    value={formData.freq}
                    onChange={e => setFormData(p => ({ ...p, freq: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0] bg-white cursor-pointer"
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Bi-annual</option>
                    <option>Annual</option>
                  </select>
                </div>
              </div>

              {/* Baseline + Target */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Baseline Value</label>
                  <input
                    type="number"
                    value={formData.baseline || ""}
                    onChange={e => setFormData(p => ({ ...p, baseline: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Target Value <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={formData.target || ""}
                    onChange={e => setFormData(p => ({ ...p, target: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0]"
                  />
                </div>
              </div>

              {/* Data Source */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Data Source</label>
                <input
                  value={formData.source}
                  onChange={e => setFormData(p => ({ ...p, source: e.target.value }))}
                  placeholder="e.g. Registration Database, Survey Results"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0]"
                />
              </div>

              {/* ── Assignment Level + Assigned To (cascading dropdowns) ──── */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest font-medium">Assignment</p>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Level <span className="text-red-400">*</span></label>
                  <select
                    value={formData.assignmentLevel}
                    onChange={e => handleAssignmentLevelChange(e.target.value as AssignmentLevel)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0] bg-white cursor-pointer"
                  >
                    <option value="Project">Project</option>
                    <option value="Phase">Phase</option>
                    <option value="Deliverable">Deliverable</option>
                    <option value="Task">Task</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    {getAssignmentLabel(formData.assignmentLevel)} <span className="text-red-400">*</span>
                  </label>
                  {formData.assignmentLevel === "Project" ? (
                    <input
                      value={projectName}
                      readOnly
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-slate-100 text-slate-700 cursor-not-allowed outline-none"
                    />
                  ) : (
                    <select
                      value={formData.assignedTo}
                      onChange={e => setFormData(p => ({ ...p, assignedTo: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0] bg-white cursor-pointer"
                    >
                      <option value="">Select {formData.assignmentLevel.toLowerCase()}...</option>
                      {getAssignmentOptions(formData.assignmentLevel).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Responsible Person */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Responsible Person</label>
                <input
                  value={formData.responsible}
                  onChange={e => setFormData(p => ({ ...p, responsible: e.target.value }))}
                  placeholder="e.g. Ama Darko"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-[#0B01D0]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={handleAddIndicator}
                disabled={!formData.name.trim() || formData.target <= 0}
                className={cn(
                  "px-4 py-2 rounded-lg text-[12px] font-medium transition-colors",
                  formData.name.trim() && formData.target > 0
                    ? "bg-[#0B01D0] text-white hover:bg-[#0a01b8]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                Add Indicator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Reusable detail row ─────────────────────────────────────────────────── */

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0 pt-0.5">{label}</p>
      {children}
    </div>
  );
}
