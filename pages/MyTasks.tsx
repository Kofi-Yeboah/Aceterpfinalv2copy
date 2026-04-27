import { useState, useRef, useMemo } from "react";
import {
  MoreHorizontal,
  Eye,
  Clock,
  ArrowLeft,
  Play,
  CheckCircle2,
  Upload,
  FileText,
  BarChart3,
  ClipboardCheck,
  ChevronRight,
  AlertCircle,
  Paperclip,
  Trash2,
  Target,
  Calendar,
  FolderOpen,
  Layers,
  Timer,
  CircleDot,
  Flag,
  CalendarClock,
  Search,
  ListFilter,
  CircleAlert,
  Loader2,
  CircleCheck,
  CircleDashed,
  ListTodo,
  Filter,
  ChevronDown,
  X,
  Hourglass,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface MELIndicator {
  id: string;
  name: string;
  type: "Output" | "Outcome" | "Impact";
  unit: string;
  target: number;
  baseline: number;
}

interface ImpactRecord {
  indicatorId: string;
  actualValue: number;
  notes: string;
}

interface EvidenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: string;
}

interface Task {
  id: string;
  taskName: string;
  project: string;
  phase: string;
  assignedDate: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
  description: string;
  timeAllotted: string;
  startedAt: string | null;
  completedAt: string | null;
  melIndicators: MELIndicator[];
}

// ─── Mock data ──────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  {
    id: "T001",
    taskName: "Complete Financial Report",
    project: "Annual Audit 2024",
    phase: "Implementation",
    assignedDate: "2026-02-01",
    dueDate: "2026-03-15",
    priority: "High",
    status: "In Progress",
    description: "Prepare comprehensive financial report for Q4 2023 including all transactions and reconciliations.",
    timeAllotted: "40 hours",
    startedAt: "2026-02-02T09:15:00",
    completedAt: null,
    melIndicators: [
      { id: "IND-001", name: "Financial reports submitted on time", type: "Output", unit: "Reports", target: 4, baseline: 0 },
      { id: "IND-002", name: "Audit compliance score improvement", type: "Outcome", unit: "Percentage", target: 95, baseline: 0 },
    ],
  },
  {
    id: "T002",
    taskName: "Review Budget Proposal",
    project: "Community Health Initiative",
    phase: "Inception & Planning",
    assignedDate: "2026-02-15",
    dueDate: "2026-03-20",
    priority: "High",
    status: "Not Started",
    description: "Review and approve the proposed budget for the community health program.",
    timeAllotted: "8 hours",
    startedAt: null,
    completedAt: null,
    melIndicators: [
      { id: "IND-003", name: "Budget proposals reviewed within SLA", type: "Output", unit: "Proposals", target: 10, baseline: 0 },
      { id: "IND-004", name: "Budget accuracy rate", type: "Outcome", unit: "Percentage", target: 98, baseline: 0 },
    ],
  },
  {
    id: "T003",
    taskName: "Conduct Staff Training",
    project: "HR Development Program",
    phase: "Implementation",
    assignedDate: "2026-02-10",
    dueDate: "2026-03-10",
    priority: "Medium",
    status: "In Progress",
    description: "Organize and conduct training session for new staff members on company policies.",
    timeAllotted: "16 hours",
    startedAt: "2026-02-12T08:30:00",
    completedAt: null,
    melIndicators: [
      { id: "IND-005", name: "Staff members trained", type: "Output", unit: "People", target: 20, baseline: 0 },
      { id: "IND-006", name: "Training satisfaction score", type: "Outcome", unit: "Score (1-5)", target: 4.5, baseline: 0 },
      { id: "IND-007", name: "Staff competency improvement", type: "Impact", unit: "Percentage", target: 30, baseline: 0 },
    ],
  },
  {
    id: "T004",
    taskName: "Update Project Timeline",
    project: "Education Access Project",
    phase: "Procurement",
    assignedDate: "2026-01-15",
    dueDate: "2026-02-20",
    priority: "Low",
    status: "Overdue",
    description: "Update the project timeline to reflect recent changes in procurement schedule.",
    timeAllotted: "3 hours",
    startedAt: "2026-01-18T10:00:00",
    completedAt: null,
    melIndicators: [
      { id: "IND-008", name: "Timeline updates completed", type: "Output", unit: "Updates", target: 3, baseline: 0 },
    ],
  },
  {
    id: "T005",
    taskName: "Prepare Donor Report",
    project: "Water & Sanitation Project",
    phase: "Implementation",
    assignedDate: "2026-01-10",
    dueDate: "2026-02-15",
    priority: "High",
    status: "Completed",
    description: "Compile quarterly progress report for project donors including achievements and challenges.",
    timeAllotted: "24 hours",
    startedAt: "2026-01-11T10:00:00",
    completedAt: "2026-02-10T16:45:00",
    melIndicators: [
      { id: "IND-009", name: "Donor reports submitted", type: "Output", unit: "Reports", target: 4, baseline: 0 },
      { id: "IND-010", name: "Donor satisfaction rating", type: "Outcome", unit: "Score (1-10)", target: 9, baseline: 7 },
    ],
  },
  {
    id: "T006",
    taskName: "Risk Assessment Review",
    project: "Agricultural Development",
    phase: "Inception & Planning",
    assignedDate: "2026-02-20",
    dueDate: "2026-03-25",
    priority: "Medium",
    status: "Not Started",
    description: "Review and update risk management plan for the agricultural development initiative.",
    timeAllotted: "12 hours",
    startedAt: null,
    completedAt: null,
    melIndicators: [
      { id: "IND-011", name: "Risk assessments completed", type: "Output", unit: "Assessments", target: 5, baseline: 0 },
      { id: "IND-012", name: "Risk mitigation effectiveness", type: "Outcome", unit: "Percentage", target: 80, baseline: 0 },
    ],
  },
  {
    id: "T007",
    taskName: "Stakeholder Meeting Preparation",
    project: "Youth Empowerment Program",
    phase: "Implementation",
    assignedDate: "2026-02-18",
    dueDate: "2026-03-12",
    priority: "Medium",
    status: "In Progress",
    description: "Prepare presentation materials and agenda for upcoming stakeholder engagement meeting.",
    timeAllotted: "6 hours",
    startedAt: "2026-02-20T14:00:00",
    completedAt: null,
    melIndicators: [
      { id: "IND-013", name: "Stakeholder meetings held", type: "Output", unit: "Meetings", target: 6, baseline: 0 },
      { id: "IND-014", name: "Stakeholder engagement score", type: "Outcome", unit: "Score (1-10)", target: 8, baseline: 5 },
    ],
  },
  {
    id: "T008",
    taskName: "Compliance Documentation",
    project: "Annual Audit 2024",
    phase: "Closure",
    assignedDate: "2026-02-05",
    dueDate: "2026-03-07",
    priority: "High",
    status: "In Progress",
    description: "Complete all compliance documentation required for annual audit submission.",
    timeAllotted: "20 hours",
    startedAt: "2026-02-08T11:00:00",
    completedAt: null,
    melIndicators: [
      { id: "IND-015", name: "Compliance documents completed", type: "Output", unit: "Documents", target: 12, baseline: 0 },
      { id: "IND-016", name: "Audit pass rate", type: "Impact", unit: "Percentage", target: 100, baseline: 92 },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High": return "text-red-700 bg-red-50 border-red-200";
    case "Medium": return "text-amber-700 bg-amber-50 border-amber-200";
    case "Low": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Completed": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "In Progress": return "text-blue-700 bg-blue-50 border-blue-200";
    case "Not Started": return "text-slate-600 bg-slate-50 border-slate-200";
    case "Overdue": return "text-red-700 bg-red-50 border-red-200";
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

function getIndicatorTypeColor(type: string) {
  switch (type) {
    case "Output": return "bg-blue-100 text-blue-700";
    case "Outcome": return "bg-purple-100 text-purple-700";
    case "Impact": return "bg-emerald-100 text-emerald-700";
    default: return "bg-slate-100 text-slate-600";
  }
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ─── Main component ────────────────────────────────────────────────────────

export function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);
  const [completionTaskId, setCompletionTaskId] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStartTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: "In Progress" as const, startedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const handleCompleteTask = (taskId: string) => {
    setCompletionTaskId(taskId);
  };

  const handleCompletionDone = (taskId: string, completionData: {
    completionTime: string;
    impactRecords: ImpactRecord[];
    evidenceFiles: EvidenceFile[];
  }) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: "Completed" as const, completedAt: completionData.completionTime }
          : t
      )
    );
    setCompletionTaskId(null);
    setViewTaskId(null);
  };

  const viewedTask = tasks.find(t => t.id === viewTaskId);
  const completionTask = tasks.find(t => t.id === completionTaskId);

  // ── Stats (must be before early returns to respect Rules of Hooks) ────

  const stats = useMemo(() => {
    const all = tasks.length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const notStarted = tasks.filter(t => t.status === "Not Started").length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const overdue = tasks.filter(t => t.status === "Overdue").length;
    return { all, inProgress, notStarted, completed, overdue };
  }, [tasks]);

  // Days until due helper for the table
  const getDueDaysDiff = (dueDate: string) => {
    const due = new Date(dueDate).getTime();
    return Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CircleCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case "In Progress": return <Loader2 className="w-3.5 h-3.5 text-blue-500" />;
      case "Not Started": return <CircleDashed className="w-3.5 h-3.5 text-slate-400" />;
      case "Overdue": return <CircleAlert className="w-3.5 h-3.5 text-red-500" />;
      default: return <CircleDashed className="w-3.5 h-3.5 text-slate-400" />;
    }
  };



  // ── Full-page: Completion wizard ──────────────────────────────────────

  if (completionTask) {
    return (
      <TaskCompletionWizard
        task={completionTask}
        onBack={() => setCompletionTaskId(null)}
        onComplete={(data) => handleCompletionDone(completionTask.id, data)}
      />
    );
  }

  // ── Full-page: Task details ───────────────────────────────────────────

  if (viewedTask) {
    return (
      <TaskDetailsView
        task={viewedTask}
        onBack={() => setViewTaskId(null)}
        onStartTask={() => handleStartTask(viewedTask.id)}
        onMarkDone={() => handleCompleteTask(viewedTask.id)}
      />
    );
  }

  // ── Task list ─────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-slate-900">My Tasks</h1>
      </div>

      {/* ── Summary Stat Cards ───────────────────────────────────���─── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "All Tasks", count: stats.all, icon: <ListTodo className="w-4 h-4" />, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
            { label: "In Progress", count: stats.inProgress, icon: <Loader2 className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
            { label: "Not Started", count: stats.notStarted, icon: <CircleDashed className="w-4 h-4" />, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
            { label: "Overdue", count: stats.overdue, icon: <CircleAlert className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
            { label: "Completed", count: stats.completed, icon: <CircleCheck className="w-4 h-4" />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border p-3.5 ${stat.bg} ${stat.border}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={stat.color}>{stat.icon}</span>
                <span className={`text-lg font-semibold ${stat.color}`}>{stat.count}</span>
              </div>
              <p className={`text-[11px] font-medium ${stat.color}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by task name, project, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowPriorityDropdown(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[12px] transition-colors ${
                statusFilter !== "All"
                  ? "border-purple-300 bg-purple-50 text-purple-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {statusFilter === "All" ? "All Status" : statusFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showStatusDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2">
                  {["All", "In Progress", "Not Started", "Overdue", "Completed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-between ${
                        statusFilter === s ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {s === "All" ? "All Status" : s}
                      {statusFilter === s && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Priority Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowPriorityDropdown(!showPriorityDropdown); setShowStatusDropdown(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[12px] transition-colors ${
                priorityFilter !== "All"
                  ? "border-purple-300 bg-purple-50 text-purple-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {priorityFilter === "All" ? "All Priority" : priorityFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showPriorityDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPriorityDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2">
                  {["All", "High", "Medium", "Low"].map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPriorityFilter(p); setShowPriorityDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-between ${
                        priorityFilter === p ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p === "All" ? "All Priority" : p}
                      {priorityFilter === p && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-[5]">
            <tr className="bg-blue-600 text-white">
              <th className="text-left px-6 py-3 text-[12px]">Task ID</th>
              <th className="text-left px-6 py-3 text-[12px]">Task</th>
              <th className="text-left px-6 py-3 text-[12px]">Phase</th>
              <th className="text-left px-6 py-3 text-[12px]">Due Date</th>
              <th className="text-left px-6 py-3 text-[12px]">Time Allotted</th>
              <th className="text-left px-6 py-3 text-[12px]">Priority</th>
              <th className="text-left px-6 py-3 text-[12px]">Status</th>
              <th className="text-center px-6 py-3 text-[12px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16">
                  <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No tasks found</p>
                </td>
              </tr>
            ) : (
              filteredTasks.map((task, idx) => {
                const dueDiff = getDueDaysDiff(task.dueDate);
                const isOverdue = task.status === "Overdue" || (dueDiff < 0 && task.status !== "Completed");
                const isDueSoon = !isOverdue && dueDiff <= 3 && dueDiff >= 0 && task.status !== "Completed";

                return (
                  <tr
                    key={task.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  >
                    <td className="px-6 py-3 text-[12px] text-blue-700 font-mono">{task.id}</td>
                    <td className="px-6 py-3">
                      <div className="min-w-0">
                        <p className="text-[12px] text-slate-900 truncate">{task.taskName}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{task.project}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-slate-600">{task.phase}</td>
                    <td className="px-6 py-3">
                      <div>
                        <p className={`text-[12px] ${
                          isOverdue ? "text-red-600" :
                          isDueSoon ? "text-amber-600" :
                          "text-slate-500"
                        }`}>
                          {task.dueDate}
                        </p>
                        {task.status !== "Completed" && (
                          <p className={`text-[10px] mt-0.5 ${
                            isOverdue ? "text-red-500" :
                            isDueSoon ? "text-amber-500" :
                            "text-slate-400"
                          }`}>
                            {dueDiff < 0 ? `${Math.abs(dueDiff)}d overdue` :
                             dueDiff === 0 ? "Due today" :
                             `${dueDiff}d left`}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <Hourglass className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-[12px] text-slate-600">{task.timeAllotted}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button onClick={() => setViewTaskId(task.id)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Full-page Task Details View ────────────────────────────────────────────

function TaskDetailsView({
  task,
  onBack,
  onStartTask,
  onMarkDone,
}: {
  task: Task;
  onBack: () => void;
  onStartTask: () => void;
  onMarkDone: () => void;
}) {
  // Compute elapsed time
  const elapsed = (() => {
    if (!task.startedAt) return null;
    const start = new Date(task.startedAt).getTime();
    const end = task.completedAt ? new Date(task.completedAt).getTime() : Date.now();
    const totalHours = Math.floor((end - start) / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const rem = totalHours % 24;
    return days > 0 ? `${days}d ${rem}h` : `${totalHours}h`;
  })();

  // Compute days until due (or overdue)
  const daysUntilDue = (() => {
    const due = new Date(task.dueDate).getTime();
    const now = Date.now();
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
  })();

  // Status-based accent config
  const statusAccent: Record<string, { bg: string; border: string; text: string; icon: string; dot: string }> = {
    "Not Started": { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", icon: "text-slate-400", dot: "bg-slate-400" },
    "In Progress": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-500", dot: "bg-blue-500" },
    "Completed": { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "text-emerald-500", dot: "bg-emerald-500" },
    "Overdue": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-500", dot: "bg-red-500" },
  };
  const accent = statusAccent[task.status] || statusAccent["Not Started"];

  const priorityAccent: Record<string, { bg: string; border: string; text: string }> = {
    "High": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
    "Medium": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    "Low": { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  };
  const pAccent = priorityAccent[task.priority] || priorityAccent["Medium"];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* ── Header ────────────���───────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">{task.taskName}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${accent.bg} ${accent.border} ${accent.text} border`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mt-1">
                <span className="text-slate-400 font-mono">{task.id}</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span>{task.project}</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span>{task.phase}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {task.status === "Not Started" && (
              <button
                onClick={onStartTask}
                className="px-5 py-2 bg-[#0B01D0] text-white rounded-lg text-sm font-medium hover:bg-[#0901A0] transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Task
              </button>
            )}
            {(task.status === "In Progress" || task.status === "Overdue") && (
              <button
                onClick={onMarkDone}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Done
              </button>
            )}
            <button
              onClick={onBack}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────���─────────── */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-6">
          {/* ── All cards full-width, single column ─────────────── */}
          <div className="space-y-5">
            {/* Status / Priority / Due / Elapsed Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className={`rounded-xl border p-4 ${accent.bg} ${accent.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <CircleDot className={`w-4 h-4 ${accent.icon}`} />
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Status</span>
                </div>
                <p className={`text-sm font-semibold ${accent.text}`}>{task.status}</p>
              </div>
              <div className={`rounded-xl border p-4 ${pAccent.bg} ${pAccent.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Flag className={`w-4 h-4 ${pAccent.text}`} />
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Priority</span>
                </div>
                <p className={`text-sm font-semibold ${pAccent.text}`}>{task.priority}</p>
              </div>
              <div className={`rounded-xl border p-4 ${
                task.status === "Overdue" ? "bg-red-50 border-red-200" :
                daysUntilDue <= 3 && daysUntilDue >= 0 ? "bg-amber-50 border-amber-200" :
                "bg-white border-slate-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarClock className={`w-4 h-4 ${
                    task.status === "Overdue" ? "text-red-500" :
                    daysUntilDue <= 3 && daysUntilDue >= 0 ? "text-amber-500" :
                    "text-slate-400"
                  }`} />
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Due</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{task.dueDate}</p>
                {task.status !== "Completed" && (
                  <p className={`text-[11px] mt-0.5 ${
                    daysUntilDue < 0 ? "text-red-600" :
                    daysUntilDue <= 3 ? "text-amber-600" :
                    "text-slate-500"
                  }`}>
                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                     daysUntilDue === 0 ? "Due today" :
                     `${daysUntilDue} days remaining`}
                  </p>
                )}
              </div>
              <div className="rounded-xl border p-4 bg-white border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className={`w-4 h-4 ${task.startedAt ? "text-[#0B01D0]" : "text-slate-400"}`} />
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Elapsed</span>
                </div>
                <p className={`text-sm font-semibold ${task.startedAt ? "text-[#0B01D0]" : "text-slate-400"}`}>{elapsed || "Not started"}</p>
                {task.startedAt && !task.completedAt && (
                  <p className="text-[11px] text-slate-500 mt-0.5">In progress</p>
                )}
                {task.completedAt && (
                  <p className="text-[11px] text-emerald-600 mt-0.5">Completed</p>
                )}
              </div>
            </div>

            {/* Task Information (includes description) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-[13px] font-semibold text-slate-900">Task Information</h3>
              </div>
              <div className="px-5 py-5 space-y-5">
                {/* Description */}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1.5">Description</p>
                  <p className="text-[12px] text-slate-700 leading-relaxed">{task.description}</p>
                </div>
                <div className="h-px bg-slate-100" />
                {/* Info Grid */}
                <div className="grid grid-cols-5 gap-6">
                  <div className="flex items-start gap-3">
                    <FolderOpen className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5">Project</p>
                      <p className="text-[12px] text-slate-900 font-medium">{task.project}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Layers className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5">Phase</p>
                      <p className="text-[12px] text-slate-900 font-medium">{task.phase}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5">Assigned Date</p>
                      <p className="text-[12px] text-slate-900 font-medium">{task.assignedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarClock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5">Due Date</p>
                      <p className="text-[12px] text-slate-900 font-medium">{task.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Hourglass className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5">Time Allotted</p>
                      <p className="text-[12px] text-slate-900 font-medium">{task.timeAllotted}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MEL Indicators */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#0B01D0]" />
                  <h3 className="text-[13px] font-semibold text-slate-900">MEL Indicators</h3>
                </div>
                <span className="text-[11px] text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                  {task.melIndicators.length} indicator{task.melIndicators.length !== 1 ? "s" : ""}
                </span>
              </div>
              {task.melIndicators.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-[12px] text-slate-500">No MEL indicators assigned to this task.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {task.melIndicators.map((ind) => {
                    const progress = ind.target > 0 ? Math.min(100, Math.round((ind.baseline / ind.target) * 100)) : 0;
                    return (
                      <div key={ind.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start justify-between mb-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getIndicatorTypeColor(ind.type)}`}>
                                {ind.type}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{ind.id}</span>
                            </div>
                            <p className="text-[12px] font-medium text-slate-900">{ind.name}</p>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-[12px] font-semibold text-slate-900">{ind.baseline} <span className="text-slate-400 font-normal">/</span> {ind.target}</p>
                            <p className="text-[10px] text-slate-500">{ind.unit}</p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                progress >= 80 ? "bg-emerald-500" : progress >= 40 ? "bg-amber-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 w-8 text-right">{progress}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Task Completion Wizard ─────────────────────────────────────────────────

const COMPLETION_STEPS = [
  { id: 1, label: "Completion Time", icon: Clock },
  { id: 2, label: "MEL Impact Records", icon: BarChart3 },
  { id: 3, label: "Evidence & Files", icon: Paperclip },
  { id: 4, label: "Review & Submit", icon: ClipboardCheck },
];

function TaskCompletionWizard({
  task,
  onBack,
  onComplete,
}: {
  task: Task;
  onBack: () => void;
  onComplete: (data: { completionTime: string; impactRecords: ImpactRecord[]; evidenceFiles: EvidenceFile[] }) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completionTime, setCompletionTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [impactRecords, setImpactRecords] = useState<ImpactRecord[]>(
    task.melIndicators.map((ind) => ({ indicatorId: ind.id, actualValue: 0, notes: "" }))
  );
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateImpactRecord = (indicatorId: string, field: "actualValue" | "notes", value: number | string) => {
    setImpactRecords((prev) =>
      prev.map((r) => (r.indicatorId === indicatorId ? { ...r, [field]: value } : r))
    );
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: EvidenceFile[] = Array.from(files).map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      addedAt: new Date().toISOString(),
    }));
    setEvidenceFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (fileId: string) => {
    setEvidenceFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const canProceed = () => {
    if (currentStep === 1) return !!completionTime;
    return true;
  };

  const handleSubmit = () => {
    onComplete({
      completionTime: new Date(completionTime).toISOString(),
      impactRecords: impactRecords.filter((r) => r.actualValue > 0 || r.notes),
      evidenceFiles,
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Mark Task as Done</h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {task.id} — {task.taskName}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {COMPLETION_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#0B01D0] text-white"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </div>
                  <span
                    className={`text-[12px] font-medium whitespace-nowrap ${
                      isActive ? "text-[#0B01D0]" : isCompleted ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < COMPLETION_STEPS.length - 1 && (
                  <ChevronRight className="size-4 text-slate-300 mx-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto">
          {currentStep === 1 && (
            <StepCompletionTime
              task={task}
              completionTime={completionTime}
              onChangeTime={setCompletionTime}
            />
          )}
          {currentStep === 2 && (
            <StepMELImpact
              task={task}
              impactRecords={impactRecords}
              onUpdate={updateImpactRecord}
            />
          )}
          {currentStep === 3 && (
            <StepEvidence
              evidenceFiles={evidenceFiles}
              fileInputRef={fileInputRef}
              onFileAdd={handleFileAdd}
              onRemoveFile={removeFile}
            />
          )}
          {currentStep === 4 && (
            <StepReview
              task={task}
              completionTime={completionTime}
              impactRecords={impactRecords}
              evidenceFiles={evidenceFiles}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="text-[12px] text-slate-500">
            Step {currentStep} of {COMPLETION_STEPS.length}
          </div>
          {currentStep < COMPLETION_STEPS.length ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(COMPLETION_STEPS.length, s + 1))}
              disabled={!canProceed()}
              className="px-5 py-2.5 bg-[#0B01D0] text-white rounded-lg text-sm font-medium hover:bg-[#0901A0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="size-4" />
              Complete Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Completion Time ────────────────────────────────────────────────

function StepCompletionTime({
  task,
  completionTime,
  onChangeTime,
}: {
  task: Task;
  completionTime: string;
  onChangeTime: (v: string) => void;
}) {
  const startDate = task.startedAt ? new Date(task.startedAt) : null;
  const endDate = completionTime ? new Date(completionTime) : null;

  let durationStr = "—";
  if (startDate && endDate) {
    const diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs > 0) {
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      durationStr = days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Completion Time</h3>
        <p className="text-[12px] text-slate-500 mb-6">
          Both the start time and completion time are automatically recorded by the system.
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Start Time (auto-captured)</label>
            <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              {formatDateTime(task.startedAt)}
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Completion Time (auto-captured)</label>
            <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              {formatDateTime(completionTime)}
            </div>
          </div>
        </div>

        {/* Duration summary */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="size-4 text-blue-600" />
            <span className="text-[12px] font-medium text-blue-900">Total Duration</span>
          </div>
          <p className="text-lg font-semibold text-blue-800 ml-6">{durationStr}</p>
        </div>
      </div>

      {/* Task context info */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Task Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[12px] text-slate-500">Project</p>
            <p className="text-[12px] text-slate-900 font-medium">{task.project}</p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500">Phase</p>
            <p className="text-[12px] text-slate-900 font-medium">{task.phase}</p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500">Assigned</p>
            <p className="text-[12px] text-slate-900 font-medium">{task.assignedDate}</p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500">Due Date</p>
            <p className="text-[12px] text-slate-900 font-medium">{task.dueDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: MEL Impact Records ───────────────────────────────────────���─────

function StepMELImpact({
  task,
  impactRecords,
  onUpdate,
}: {
  task: Task;
  impactRecords: ImpactRecord[];
  onUpdate: (indicatorId: string, field: "actualValue" | "notes", value: number | string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">MEL Impact Records</h3>
        <p className="text-[12px] text-slate-500 mb-6">
          Record actual values achieved against the MEL indicators assigned to this task. This data feeds into project-level MEL tracking.
        </p>

        {task.melIndicators.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <AlertCircle className="size-8 text-slate-400 mx-auto mb-2" />
            <p className="text-[12px] text-slate-500">No MEL indicators assigned to this task.</p>
            <p className="text-[12px] text-slate-400">You can skip this step.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {task.melIndicators.map((ind) => {
              const record = impactRecords.find((r) => r.indicatorId === ind.id);
              return (
                <div key={ind.id} className="border border-slate-200 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono text-slate-400">{ind.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getIndicatorTypeColor(ind.type)}`}>
                          {ind.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900">{ind.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[11px] text-slate-500 mb-0.5">Baseline</p>
                      <p className="text-sm font-semibold text-slate-700">{ind.baseline} <span className="text-[11px] font-normal text-slate-400">{ind.unit}</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[11px] text-slate-500 mb-0.5">Target</p>
                      <p className="text-sm font-semibold text-slate-700">{ind.target} <span className="text-[11px] font-normal text-slate-400">{ind.unit}</span></p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-[11px] text-blue-600 mb-0.5">Progress</p>
                      <p className="text-sm font-semibold text-blue-800">
                        {record && ind.target > 0
                          ? `${Math.round((record.actualValue / ind.target) * 100)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                        Actual Value Achieved ({ind.unit})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={record?.actualValue || 0}
                        onChange={(e) => onUpdate(ind.id, "actualValue", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Notes / Comments</label>
                      <textarea
                        rows={4}
                        placeholder="Describe how this was achieved, methodology used, challenges encountered..."
                        value={record?.notes || ""}
                        onChange={(e) => onUpdate(ind.id, "notes", e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] resize-vertical"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 3: Evidence & Files ───────────────────────────────────────────────

function StepEvidence({
  evidenceFiles,
  fileInputRef,
  onFileAdd,
  onRemoveFile,
}: {
  evidenceFiles: EvidenceFile[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Evidence & Supporting Files</h3>
        <p className="text-[12px] text-slate-500 mb-6">
          Upload reports, photos, signed documents, or any other evidence that supports task completion and MEL data.
        </p>

        {/* Upload area */}
        <div
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#0B01D0] hover:bg-blue-50/30 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-[12px] text-slate-400">
            PDF, DOC, XLSX, JPG, PNG up to 50MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.csv"
            onChange={onFileAdd}
          />
        </div>

        {/* File list */}
        {evidenceFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-[12px] font-medium text-slate-600 mb-2">
              Uploaded Files ({evidenceFiles.length})
            </p>
            {evidenceFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-[12px] font-medium text-slate-900">{file.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {formatFileSize(file.size)} · Added {formatDateTime(file.addedAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {evidenceFiles.length === 0 && (
          <div className="mt-4 flex items-center gap-2 text-[12px] text-slate-400">
            <AlertCircle className="size-3.5" />
            No files uploaded yet. This step is optional but recommended for audit trail.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Review & Submit ──���─────────────────────────────────────────────

function StepReview({
  task,
  completionTime,
  impactRecords,
  evidenceFiles,
}: {
  task: Task;
  completionTime: string;
  impactRecords: ImpactRecord[];
  evidenceFiles: EvidenceFile[];
}) {
  const startDate = task.startedAt ? new Date(task.startedAt) : null;
  const endDate = completionTime ? new Date(completionTime) : null;
  let durationStr = "—";
  if (startDate && endDate) {
    const diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs > 0) {
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      durationStr = days > 0 ? `${days}d ${hours}h` : `${totalHours}h`;
    }
  }

  const filledRecords = impactRecords.filter((r) => r.actualValue > 0 || r.notes);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="size-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Ready to Submit</p>
            <p className="text-[12px] text-emerald-700 mt-0.5">
              Review your completion details below. Once submitted, the task status will be updated to "Completed."
            </p>
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="size-4 text-slate-500" />
          Time Summary
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-[12px] text-slate-500">Started</p>
            <p className="text-[12px] text-slate-900 font-medium">{formatDateTime(task.startedAt)}</p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500">Completed</p>
            <p className="text-[12px] text-slate-900 font-medium">{formatDateTime(completionTime)}</p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500">Duration</p>
            <p className="text-[12px] text-slate-900 font-semibold">{durationStr}</p>
          </div>
          <div>
            <p className="text-[12px] text-slate-500">Time Allotted</p>
            <p className="text-[12px] text-slate-900 font-medium">{task.timeAllotted}</p>
          </div>
        </div>
      </div>

      {/* Impact records */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="size-4 text-slate-500" />
          MEL Impact Records ({filledRecords.length} of {task.melIndicators.length})
        </h3>
        {filledRecords.length === 0 ? (
          <p className="text-[12px] text-slate-500">No impact records submitted.</p>
        ) : (
          <div className="space-y-3">
            {filledRecords.map((record) => {
              const ind = task.melIndicators.find((i) => i.id === record.indicatorId);
              if (!ind) return null;
              const pct = ind.target > 0 ? Math.round((record.actualValue / ind.target) * 100) : 0;
              return (
                <div key={record.indicatorId} className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getIndicatorTypeColor(ind.type)}`}>
                        {ind.type}
                      </span>
                      <span className="text-[12px] font-medium text-slate-900">{ind.name}</span>
                    </div>
                    {record.notes && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{record.notes}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {record.actualValue} <span className="text-[11px] font-normal text-slate-400">/ {ind.target} {ind.unit}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">{pct}% achieved</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Evidence */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Paperclip className="size-4 text-slate-500" />
          Evidence Files ({evidenceFiles.length})
        </h3>
        {evidenceFiles.length === 0 ? (
          <p className="text-[12px] text-slate-500">No evidence files uploaded.</p>
        ) : (
          <div className="space-y-2">
            {evidenceFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-lg">
                <FileText className="size-4 text-blue-500 shrink-0" />
                <span className="text-[12px] text-slate-900">{file.name}</span>
                <span className="text-[11px] text-slate-400">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}