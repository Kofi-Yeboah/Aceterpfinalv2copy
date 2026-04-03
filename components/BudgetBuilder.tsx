import { useState, useMemo } from "react";
import {
  Plus, Trash2, ChevronDown, ChevronRight, X, ArrowLeft,
  DollarSign, Layers, Target, Edit3, Receipt, Package, ListChecks, CheckCircle2
} from "lucide-react";
import { cn } from "../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface BudgetLineItem {
  id: string;
  procurementType: "internal" | "external" | "";
  procurementCategory: string;
  resourceName: string;
  description: string;
  unitType: string;
  quantity: number;
  unitCost: number;
  expectedDate: string;
  procurementMethod: string;
  fundSource: string;
}

interface TaskBudget {
  taskId: string;
  taskName: string;
  lineItems: BudgetLineItem[];
  expanded: boolean;
}

interface DeliverableBudget {
  id: string;
  name: string;
  tasks: TaskBudget[];
  expanded: boolean;
}

interface PhaseBudget {
  id: string;
  name: string;
  color: string;
  deliverables: DeliverableBudget[];
  expanded: boolean;
}

interface BudgetBuilderProps {
  onBack: () => void;
}

// ── Constants ────────────────────────────────────��─────────────────────────────

const PHASE_COLORS = [
  "bg-amber-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-slate-500",
];

const PHASE_COLOR_LIGHT: Record<string, string> = {
  "bg-amber-500": "bg-amber-50 border-amber-200 text-amber-700",
  "bg-blue-500": "bg-blue-50 border-blue-200 text-blue-700",
  "bg-violet-500": "bg-violet-50 border-violet-200 text-violet-700",
  "bg-emerald-500": "bg-emerald-50 border-emerald-200 text-emerald-700",
  "bg-cyan-500": "bg-cyan-50 border-cyan-200 text-cyan-700",
  "bg-rose-500": "bg-rose-50 border-rose-200 text-rose-700",
  "bg-slate-500": "bg-slate-100 border-slate-300 text-slate-700",
};

// Phase requirement types: mandatory, optional, or checkpoint
const PHASE_REQUIREMENT: Record<string, "mandatory" | "optional" | "checkpoint"> = {
  "phase-1": "optional",       // Procurement and Contracting
  "phase-2": "mandatory",      // Implementation
  "phase-3": "mandatory",      // Quality Assurance
  "phase-4": "mandatory",      // Production and Editorial
  "phase-5": "optional",       // Dissemination
  "phase-6": "mandatory",      // Reporting
  "phase-7": "checkpoint",     // Delivery Stage Complete
};

const AVAILABLE_FUNDS = [
  { id: 1, accountCode: "1001-001", accountName: "Main Operating Account", type: "Asset", subType: "Bank", balance: "$785,550", currency: "USD" },
  { id: 2, accountCode: "1001-002", accountName: "Payroll Account", type: "Asset", subType: "Bank", balance: "$342,000", currency: "USD" },
  { id: 3, accountCode: "1002-001", accountName: "Office Petty Cash", type: "Asset", subType: "Petty Cash", balance: "GHS 2,500", currency: "GHS" },
  { id: 4, accountCode: "1100-001", accountName: "Grants Receivable - USAID", type: "Asset", subType: "Receivable", balance: "$450,000", currency: "USD" },
  { id: 5, accountCode: "1100-002", accountName: "Grants Receivable - EU", type: "Asset", subType: "Receivable", balance: "$280,000", currency: "USD" },
  { id: 6, accountCode: "4001-001", accountName: "Grant Revenue - USAID", type: "Revenue", subType: "Grant", balance: "$1,200,000", currency: "USD" },
  { id: 7, accountCode: "4001-002", accountName: "Grant Revenue - EU", type: "Revenue", subType: "Donor Fund", balance: "$850,000", currency: "USD" },
  { id: 8, accountCode: "3001-001", accountName: "Retained Surplus", type: "Equity", subType: "Retained Earnings", balance: "$1,250,000", currency: "USD" },
  { id: 9, accountCode: "3002-001", accountName: "Capital Fund", type: "Equity", subType: "Capital", balance: "$500,000", currency: "USD" },
];

// Standard pre-set delivery stages: Phase → Deliverable → Task (budget lines to be created here)
const INITIAL_PHASES: PhaseBudget[] = [
  {
    id: "phase-1",
    name: "Procurement and Contracting",
    color: PHASE_COLORS[0],
    expanded: true,
    deliverables: [
      {
        id: "del-1-1",
        name: "Vendor Engagement Package",
        expanded: true,
        tasks: [
          { taskId: "T001", taskName: "Draft Request for Proposals (RFP)", lineItems: [], expanded: false },
          { taskId: "T002", taskName: "Evaluate Vendor Submissions", lineItems: [], expanded: false },
        ],
      },
      {
        id: "del-1-2",
        name: "Contract Documentation",
        expanded: false,
        tasks: [
          { taskId: "T003", taskName: "Finalize Service Agreements", lineItems: [], expanded: false },
        ],
      },
    ],
  },
  {
    id: "phase-2",
    name: "Implementation",
    color: PHASE_COLORS[1],
    expanded: true,
    deliverables: [
      {
        id: "del-2-1",
        name: "Field Research Data Package",
        expanded: true,
        tasks: [
          { taskId: "T004", taskName: "Coordinate Field Data Collection", lineItems: [], expanded: false },
          { taskId: "T005", taskName: "Conduct Stakeholder Engagement Sessions", lineItems: [], expanded: false },
        ],
      },
      {
        id: "del-2-2",
        name: "Policy Review Report",
        expanded: false,
        tasks: [
          { taskId: "T006", taskName: "Review Policy Recommendations", lineItems: [], expanded: false },
        ],
      },
    ],
  },
  {
    id: "phase-3",
    name: "Quality Assurance",
    color: PHASE_COLORS[2],
    expanded: false,
    deliverables: [
      {
        id: "del-3-1",
        name: "Quality Assurance Package",
        expanded: false,
        tasks: [
          { taskId: "T007", taskName: "Conduct Internal Peer Review of Draft", lineItems: [], expanded: false },
          { taskId: "T008", taskName: "Run Data Validation Checks", lineItems: [], expanded: false },
        ],
      },
    ],
  },
  {
    id: "phase-4",
    name: "Production and Editorial",
    color: PHASE_COLORS[3],
    expanded: false,
    deliverables: [
      {
        id: "del-4-1",
        name: "Final Publication Package",
        expanded: false,
        tasks: [
          { taskId: "T009", taskName: "Design and Layout Report", lineItems: [], expanded: false },
          { taskId: "T010", taskName: "Complete Editorial Review", lineItems: [], expanded: false },
        ],
      },
    ],
  },
  {
    id: "phase-5",
    name: "Dissemination",
    color: PHASE_COLORS[4],
    expanded: false,
    deliverables: [
      {
        id: "del-5-1",
        name: "Dissemination Strategy Package",
        expanded: false,
        tasks: [
          { taskId: "T011", taskName: "Plan Distribution Channels", lineItems: [], expanded: false },
          { taskId: "T012", taskName: "Conduct Stakeholder Workshops", lineItems: [], expanded: false },
        ],
      },
    ],
  },
  {
    id: "phase-6",
    name: "Reporting",
    color: PHASE_COLORS[5],
    expanded: false,
    deliverables: [
      {
        id: "del-6-1",
        name: "Final Project Documentation",
        expanded: false,
        tasks: [
          { taskId: "T013", taskName: "Submit Final Technical Report", lineItems: [], expanded: false },
          { taskId: "T014", taskName: "Compile Lessons Learned", lineItems: [], expanded: false },
        ],
      },
    ],
  },
  {
    id: "phase-7",
    name: "Delivery Stage Complete",
    color: PHASE_COLORS[6],
    expanded: false,
    deliverables: [
      {
        id: "del-7-1",
        name: "Completion Checkpoint",
        expanded: false,
        tasks: [
          { taskId: "T015", taskName: "Sign-off and Handover", lineItems: [], expanded: false },
        ],
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getTaskTotal(task: TaskBudget): number {
  return task.lineItems.reduce((sum, li) => sum + (li.quantity || 0) * (li.unitCost || 0), 0);
}

function getDeliverableTotal(del: DeliverableBudget): number {
  return del.tasks.reduce((sum, t) => sum + getTaskTotal(t), 0);
}

function getPhaseTotal(phase: PhaseBudget): number {
  return phase.deliverables.reduce((sum, d) => sum + getDeliverableTotal(d), 0);
}

function countPhaseTasks(phase: PhaseBudget): number {
  return phase.deliverables.reduce((sum, d) => sum + d.tasks.length, 0);
}

function countPhaseLineItems(phase: PhaseBudget): number {
  return phase.deliverables.reduce((sum, d) => sum + d.tasks.reduce((s2, t) => s2 + t.lineItems.length, 0), 0);
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function BudgetBuilder({ onBack }: BudgetBuilderProps) {
  const [phases, setPhases] = useState<PhaseBudget[]>(INITIAL_PHASES);
  const [activePhaseInSidebar, setActivePhaseInSidebar] = useState<string>("phase-1");
  const [sidebarExpandedDeliverables, setSidebarExpandedDeliverables] = useState<Set<string>>(new Set(["del-1-1"]));

  // Modal state
  const [modalState, setModalState] = useState<{
    open: boolean;
    phaseId: string;
    deliverableId: string;
    taskId: string;
    existingItem: BudgetLineItem | null;
  }>({ open: false, phaseId: "", deliverableId: "", taskId: "", existingItem: null });

  // ── Computed stats ──
  const stats = useMemo(() => {
    const allDeliverables = phases.flatMap((p) => p.deliverables);
    const allTasks = allDeliverables.flatMap((d) => d.tasks);
    const allLineItems = allTasks.flatMap((t) => t.lineItems);
    const totalBudget = allLineItems.reduce((sum, li) => sum + (li.quantity || 0) * (li.unitCost || 0), 0);
    return {
      totalPhases: phases.length,
      totalDeliverables: allDeliverables.length,
      totalTasks: allTasks.length,
      totalLineItems: allLineItems.length,
      totalBudget,
    };
  }, [phases]);

  // ── Phase operations ──
  const togglePhaseExpanded = (phaseId: string) => {
    setPhases(phases.map((p) => (p.id === phaseId ? { ...p, expanded: !p.expanded } : p)));
  };

  // ── Deliverable operations ──
  const toggleDeliverableExpanded = (phaseId: string, deliverableId: string) => {
    setPhases(phases.map((p) =>
      p.id === phaseId
        ? { ...p, deliverables: p.deliverables.map((d) => (d.id === deliverableId ? { ...d, expanded: !d.expanded } : d)) }
        : p
    ));
  };

  // ── Task operations ──
  const toggleTaskExpanded = (phaseId: string, deliverableId: string, taskId: string) => {
    setPhases(phases.map((p) =>
      p.id === phaseId
        ? {
            ...p,
            deliverables: p.deliverables.map((d) =>
              d.id === deliverableId
                ? { ...d, tasks: d.tasks.map((t) => (t.taskId === taskId ? { ...t, expanded: !t.expanded } : t)) }
                : d
            ),
          }
        : p
    ));
  };

  const openAddLineItem = (phaseId: string, deliverableId: string, taskId: string) => {
    setModalState({ open: true, phaseId, deliverableId, taskId, existingItem: null });
  };

  const openEditLineItem = (phaseId: string, deliverableId: string, taskId: string, item: BudgetLineItem) => {
    setModalState({ open: true, phaseId, deliverableId, taskId, existingItem: item });
  };

  const saveLineItem = (phaseId: string, deliverableId: string, taskId: string, item: BudgetLineItem) => {
    setPhases(phases.map((p) =>
      p.id === phaseId
        ? {
            ...p,
            deliverables: p.deliverables.map((d) =>
              d.id === deliverableId
                ? {
                    ...d,
                    tasks: d.tasks.map((t) => {
                      if (t.taskId !== taskId) return t;
                      const existing = t.lineItems.find((li) => li.id === item.id);
                      return {
                        ...t,
                        expanded: true,
                        lineItems: existing
                          ? t.lineItems.map((li) => (li.id === item.id ? item : li))
                          : [...t.lineItems, item],
                      };
                    }),
                  }
                : d
            ),
          }
        : p
    ));
    setModalState({ open: false, phaseId: "", deliverableId: "", taskId: "", existingItem: null });
  };

  const removeLineItem = (phaseId: string, deliverableId: string, taskId: string, itemId: string) => {
    setPhases(phases.map((p) =>
      p.id === phaseId
        ? {
            ...p,
            deliverables: p.deliverables.map((d) =>
              d.id === deliverableId
                ? { ...d, tasks: d.tasks.map((t) => (t.taskId === taskId ? { ...t, lineItems: t.lineItems.filter((li) => li.id !== itemId) } : t)) }
                : d
            ),
          }
        : p
    ));
  };

  const handleSave = () => {
    console.log("Saving Budget:", phases);
    onBack();
  };

  const toggleSidebarDeliverable = (delId: string) => {
    setSidebarExpandedDeliverables((prev) => {
      const next = new Set(prev);
      if (next.has(delId)) next.delete(delId);
      else next.add(delId);
      return next;
    });
  };

  // Find the task name for the modal subtitle
  const modalTaskName = useMemo(() => {
    if (!modalState.open) return "";
    for (const p of phases) {
      for (const d of p.deliverables) {
        const task = d.tasks.find((t) => t.taskId === modalState.taskId);
        if (task) return task.taskName;
      }
    }
    return "";
  }, [modalState, phases]);

  // Find the deliverable name for the modal subtitle
  const modalDeliverableName = useMemo(() => {
    if (!modalState.open) return "";
    for (const p of phases) {
      const del = p.deliverables.find((d) => d.id === modalState.deliverableId);
      if (del) return del.name;
    }
    return "";
  }, [modalState, phases]);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Budget Builder</h1>
              <p className="text-[12px] text-slate-500 mt-0.5">Youth Employment Skills Development &middot; Define budget line items per WBS task</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-sm bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors font-medium">
              Save Budget
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-6">
          <StatPill icon={<Layers className="w-3.5 h-3.5 text-violet-600" />} label="Phases" value={String(stats.totalPhases)} />
          <StatPill icon={<Package className="w-3.5 h-3.5 text-cyan-600" />} label="Deliverables" value={String(stats.totalDeliverables)} />
          <StatPill icon={<ListChecks className="w-3.5 h-3.5 text-blue-600" />} label="Tasks" value={String(stats.totalTasks)} />
          <StatPill icon={<Receipt className="w-3.5 h-3.5 text-emerald-600" />} label="Budget Lines" value={String(stats.totalLineItems)} />
          <div className="ml-auto flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#0B01D0]" />
            <span className="text-[12px] text-slate-500">Total Budget</span>
            <span className="text-sm font-semibold text-[#0B01D0]">{formatCurrency(stats.totalBudget)}</span>
          </div>
        </div>
      </div>

      {/* ── Two-Panel Layout ──────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar outline */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">WBS Structure</p>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {phases.map((phase) => (
              <div key={phase.id}>
                {/* Phase row */}
                <button
                  onClick={() => {
                    setActivePhaseInSidebar(phase.id);
                    document.getElementById(`budget-phase-${phase.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors",
                    activePhaseInSidebar === phase.id
                      ? "bg-blue-50 border-r-2 border-[#0B01D0]"
                      : "hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0", phase.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={cn(
                        "text-[12px] truncate",
                        activePhaseInSidebar === phase.id ? "text-[#0B01D0] font-medium" : "text-slate-700"
                      )}>
                        {phase.name}
                      </p>
                      {PHASE_REQUIREMENT[phase.id] === "optional" && (
                        <span className="text-[8px] font-semibold px-1 py-0 rounded bg-slate-100 text-slate-400 border border-slate-200 uppercase flex-shrink-0">Opt</span>
                      )}
                      {PHASE_REQUIREMENT[phase.id] === "checkpoint" && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {phase.deliverables.length} deliverable{phase.deliverables.length !== 1 ? "s" : ""}
                      {getPhaseTotal(phase) > 0 && <span className="ml-1">&middot; {formatCurrency(getPhaseTotal(phase))}</span>}
                    </p>
                  </div>
                </button>

                {/* Deliverables under phase in sidebar */}
                {activePhaseInSidebar === phase.id && phase.deliverables.length > 0 && (
                  <div className="pl-6 pb-1">
                    {phase.deliverables.map((del) => (
                      <div key={del.id}>
                        <button
                          onClick={() => toggleSidebarDeliverable(del.id)}
                          className="w-full flex items-center gap-2 py-1.5 px-3 hover:bg-slate-50 transition-colors group"
                        >
                          {del.tasks.length > 0 ? (
                            sidebarExpandedDeliverables.has(del.id)
                              ? <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              : <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          ) : (
                            <div className="w-3 h-3 flex-shrink-0" />
                          )}
                          <Package className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                          <span className="text-[11px] text-slate-600 truncate flex-1 text-left">{del.name}</span>
                          {getDeliverableTotal(del) > 0 && (
                            <span className="text-[9px] text-slate-400">{formatCurrency(getDeliverableTotal(del))}</span>
                          )}
                        </button>
                        {/* Tasks under deliverable */}
                        {sidebarExpandedDeliverables.has(del.id) && del.tasks.length > 0 && (
                          <div className="pl-7 pb-0.5">
                            {del.tasks.map((task) => (
                              <div key={task.taskId} className="flex items-center gap-2 py-1 px-2">
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                  task.lineItems.length > 0 ? "bg-emerald-400" : "bg-slate-300"
                                )} />
                                <p className="text-[10px] text-slate-500 truncate flex-1">{task.taskName}</p>
                                {getTaskTotal(task) > 0 && (
                                  <span className="text-[9px] text-slate-400">{formatCurrency(getTaskTotal(task))}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-[1100px] mx-auto space-y-5">
            {phases.map((phase, phaseIdx) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                index={phaseIdx}
                onTogglePhase={togglePhaseExpanded}
                onToggleDeliverable={toggleDeliverableExpanded}
                onToggleTask={toggleTaskExpanded}
                onAddLineItem={openAddLineItem}
                onEditLineItem={openEditLineItem}
                onRemoveLineItem={removeLineItem}
                onFocus={() => setActivePhaseInSidebar(phase.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Line Item Modal ─���─────────────────────────────────────── */}
      {modalState.open && (
        <LineItemModal
          phaseId={modalState.phaseId}
          deliverableId={modalState.deliverableId}
          taskId={modalState.taskId}
          taskName={modalTaskName}
          deliverableName={modalDeliverableName}
          existingItem={modalState.existingItem}
          onSave={saveLineItem}
          onCancel={() => setModalState({ open: false, phaseId: "", deliverableId: "", taskId: "", existingItem: null })}
        />
      )}
    </div>
  );
}

// ── Stat Pill ──────────────────────────────────────────────────────────────────

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[12px] text-slate-500">{label}</span>
      <span className="text-[12px] font-semibold text-slate-800">{value}</span>
    </div>
  );
}

// ── Phase Card ─────────────────────────────────────────────────────────────────

interface PhaseCardProps {
  phase: PhaseBudget;
  index: number;
  onTogglePhase: (phaseId: string) => void;
  onToggleDeliverable: (phaseId: string, deliverableId: string) => void;
  onToggleTask: (phaseId: string, deliverableId: string, taskId: string) => void;
  onAddLineItem: (phaseId: string, deliverableId: string, taskId: string) => void;
  onEditLineItem: (phaseId: string, deliverableId: string, taskId: string, item: BudgetLineItem) => void;
  onRemoveLineItem: (phaseId: string, deliverableId: string, taskId: string, itemId: string) => void;
  onFocus: () => void;
}

function PhaseCard({
  phase, index, onTogglePhase, onToggleDeliverable, onToggleTask,
  onAddLineItem, onEditLineItem, onRemoveLineItem, onFocus,
}: PhaseCardProps) {
  const lightStyle = PHASE_COLOR_LIGHT[phase.color] || "bg-slate-50 border-slate-200 text-slate-700";
  const phaseTotal = getPhaseTotal(phase);
  const totalTasks = countPhaseTasks(phase);
  const totalLineItems = countPhaseLineItems(phase);
  const requirement = PHASE_REQUIREMENT[phase.id] || "mandatory";

  return (
    <div
      id={`budget-phase-${phase.id}`}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onClick={onFocus}
    >
      {/* Phase header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className={cn("w-1 h-10 rounded-full flex-shrink-0", phase.color)} />
        <button onClick={() => onTogglePhase(phase.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
          {phase.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", lightStyle)}>
              {requirement === "checkpoint" ? "Checkpoint" : `Stage ${index + 1}`}
            </span>
            {requirement === "mandatory" && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 uppercase tracking-wider">
                Mandatory
              </span>
            )}
            {requirement === "optional" && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-wider">
                Optional
              </span>
            )}
            {requirement === "checkpoint" && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Checkpoint
              </span>
            )}
            <span className="text-sm font-semibold text-slate-900">{phase.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Package className="w-3 h-3" />
            <span>{phase.deliverables.length} deliverable{phase.deliverables.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ListChecks className="w-3 h-3" />
            <span>{totalTasks} task{totalTasks !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Receipt className="w-3 h-3" />
            <span>{totalLineItems} line{totalLineItems !== 1 ? "s" : ""}</span>
          </div>
          {phaseTotal > 0 && (
            <div className="flex items-center gap-1 bg-blue-50 rounded-md px-2 py-0.5">
              <DollarSign className="w-3 h-3 text-[#0B01D0]" />
              <span className="text-[11px] font-semibold text-[#0B01D0]">{formatCurrency(phaseTotal)}</span>
            </div>
          )}
        </div>
      </div>

      {phase.expanded && (
        <div className="px-5 py-4 space-y-3">
          {phase.deliverables.map((del, dIdx) => (
            <DeliverableSection
              key={del.id}
              deliverable={del}
              index={dIdx}
              phaseId={phase.id}
              onToggleDeliverable={onToggleDeliverable}
              onToggleTask={onToggleTask}
              onAddLineItem={onAddLineItem}
              onEditLineItem={onEditLineItem}
              onRemoveLineItem={onRemoveLineItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Deliverable Section ────────────────────────────────────────────────────────

interface DeliverableSectionProps {
  deliverable: DeliverableBudget;
  index: number;
  phaseId: string;
  onToggleDeliverable: (phaseId: string, deliverableId: string) => void;
  onToggleTask: (phaseId: string, deliverableId: string, taskId: string) => void;
  onAddLineItem: (phaseId: string, deliverableId: string, taskId: string) => void;
  onEditLineItem: (phaseId: string, deliverableId: string, taskId: string, item: BudgetLineItem) => void;
  onRemoveLineItem: (phaseId: string, deliverableId: string, taskId: string, itemId: string) => void;
}

function DeliverableSection({
  deliverable, index, phaseId,
  onToggleDeliverable, onToggleTask, onAddLineItem, onEditLineItem, onRemoveLineItem,
}: DeliverableSectionProps) {
  const delTotal = getDeliverableTotal(deliverable);
  const totalLineItems = deliverable.tasks.reduce((sum, t) => sum + t.lineItems.length, 0);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/30">
      {/* Deliverable header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100">
        <button onClick={() => onToggleDeliverable(phaseId, deliverable.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
          {deliverable.expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        <Package className="w-4 h-4 text-cyan-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-slate-900 truncate">{deliverable.name}</span>
            <span className="text-[10px] text-slate-400 font-medium">D{index + 1}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] text-slate-400">
              {deliverable.tasks.length} task{deliverable.tasks.length !== 1 ? "s" : ""}
            </span>
            {totalLineItems > 0 && (
              <span className="text-[11px] text-slate-400">
                {totalLineItems} budget line{totalLineItems !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        {delTotal > 0 && (
          <div className="flex items-center gap-1 bg-cyan-50 rounded-md px-2 py-0.5 flex-shrink-0">
            <DollarSign className="w-3 h-3 text-cyan-600" />
            <span className="text-[11px] font-semibold text-cyan-700">{formatCurrency(delTotal)}</span>
          </div>
        )}
      </div>

      {/* Deliverable body — tasks */}
      {deliverable.expanded && (
        <div className="divide-y divide-slate-100">
          {deliverable.tasks.map((task) => (
            <TaskRow
              key={task.taskId}
              task={task}
              phaseId={phaseId}
              deliverableId={deliverable.id}
              onToggle={onToggleTask}
              onAddLineItem={onAddLineItem}
              onEditLineItem={onEditLineItem}
              onRemoveLineItem={onRemoveLineItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Task Row ───────────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: TaskBudget;
  phaseId: string;
  deliverableId: string;
  onToggle: (phaseId: string, deliverableId: string, taskId: string) => void;
  onAddLineItem: (phaseId: string, deliverableId: string, taskId: string) => void;
  onEditLineItem: (phaseId: string, deliverableId: string, taskId: string, item: BudgetLineItem) => void;
  onRemoveLineItem: (phaseId: string, deliverableId: string, taskId: string, itemId: string) => void;
}

function TaskRow({ task, phaseId, deliverableId, onToggle, onAddLineItem, onEditLineItem, onRemoveLineItem }: TaskRowProps) {
  const taskTotal = getTaskTotal(task);
  const hasLineItems = task.lineItems.length > 0;

  return (
    <div>
      {/* Task header */}
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors">
        <button
          onClick={() => onToggle(phaseId, deliverableId, task.taskId)}
          className="text-slate-400 hover:text-slate-600 transition-colors ml-3"
        >
          {task.expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">{task.taskId}</span>
          <span className="text-[12px] text-slate-800 truncate">{task.taskName}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {hasLineItems && (
            <span className="text-[11px] text-slate-400">{task.lineItems.length} line{task.lineItems.length !== 1 ? "s" : ""}</span>
          )}
          {taskTotal > 0 ? (
            <span className="text-[12px] font-semibold text-slate-700">{formatCurrency(taskTotal)}</span>
          ) : (
            <span className="text-[11px] text-slate-300 italic">No budget</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onAddLineItem(phaseId, deliverableId, task.taskId); }}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors font-medium"
          >
            <Plus className="w-3 h-3" />
            Add Line
          </button>
        </div>
      </div>

      {/* Line items table */}
      {task.expanded && hasLineItems && (
        <div className="mx-4 ml-12 mb-4 rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B01D0]">
                <th className="text-left py-2 px-3 text-[12px] font-semibold text-white">Description</th>
                <th className="text-left py-2 px-3 text-[12px] font-semibold text-white">Resource</th>
                <th className="text-left py-2 px-3 text-[12px] font-semibold text-white">Type</th>
                <th className="text-left py-2 px-3 text-[12px] font-semibold text-white">Unit</th>
                <th className="text-right py-2 px-3 text-[12px] font-semibold text-white">Qty</th>
                <th className="text-right py-2 px-3 text-[12px] font-semibold text-white">Unit Cost</th>
                <th className="text-right py-2 px-3 text-[12px] font-semibold text-white">Total</th>
                <th className="text-center py-2 px-3 text-[12px] font-semibold text-white w-16"></th>
              </tr>
            </thead>
            <tbody>
              {task.lineItems.map((item, idx) => {
                const lineTotal = (item.quantity || 0) * (item.unitCost || 0);
                return (
                  <tr key={item.id} className={cn("border-b border-slate-100 hover:bg-slate-50/80 group transition-colors", idx % 2 === 1 ? "bg-slate-50/40" : "")}>
                    <td className="py-2 px-3 text-[12px] text-slate-800">{item.description || "—"}</td>
                    <td className="py-2 px-3 text-[12px] text-slate-600">{item.resourceName || "—"}</td>
                    <td className="py-2 px-3">
                      {item.procurementType && (
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize",
                          item.procurementType === "internal"
                            ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                            : "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
                        )}>
                          {item.procurementType}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-[12px] text-slate-600">{item.unitType || "—"}</td>
                    <td className="py-2 px-3 text-[12px] text-slate-700 text-right">{item.quantity || 0}</td>
                    <td className="py-2 px-3 text-[12px] text-slate-700 text-right">{formatCurrency(item.unitCost || 0)}</td>
                    <td className="py-2 px-3 text-[12px] font-semibold text-slate-900 text-right">{formatCurrency(lineTotal)}</td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEditLineItem(phaseId, deliverableId, task.taskId, item)} className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onRemoveLineItem(phaseId, deliverableId, task.taskId, item.id)} className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* Task total row */}
              <tr className="bg-slate-50 border-t border-slate-200">
                <td colSpan={6} className="py-2 px-3 text-[11px] font-medium text-slate-500 text-right">Task Total</td>
                <td className="py-2 px-3 text-[12px] font-semibold text-[#0B01D0] text-right">{formatCurrency(taskTotal)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state when expanded with no items */}
      {task.expanded && !hasLineItems && (
        <div className="mx-4 ml-12 mb-4">
          <div className="border-2 border-dashed border-slate-200 rounded-lg py-6 flex flex-col items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-[12px] text-slate-400">No budget lines yet</p>
            <button
              onClick={() => onAddLineItem(phaseId, deliverableId, task.taskId)}
              className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Budget Line
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Line Item Modal ────────────────────────────────────────────────────────────

interface LineItemModalProps {
  phaseId: string;
  deliverableId: string;
  taskId: string;
  taskName: string;
  deliverableName: string;
  existingItem: BudgetLineItem | null;
  onSave: (phaseId: string, deliverableId: string, taskId: string, item: BudgetLineItem) => void;
  onCancel: () => void;
}

function LineItemModal({ phaseId, deliverableId, taskId, taskName, deliverableName, existingItem, onSave, onCancel }: LineItemModalProps) {
  const [form, setForm] = useState<BudgetLineItem>(
    existingItem || {
      id: `li-${Date.now()}`,
      procurementType: "",
      procurementCategory: "",
      resourceName: "",
      description: "",
      unitType: "",
      quantity: 0,
      unitCost: 0,
      expectedDate: "",
      procurementMethod: "",
      fundSource: "",
    }
  );

  const update = (field: keyof BudgetLineItem, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const lineTotal = (form.quantity || 0) * (form.unitCost || 0);

  const isValid = form.description.trim() && form.quantity > 0 && form.unitCost > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave(phaseId, deliverableId, taskId, form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{existingItem ? "Edit Budget Line" : "Add Budget Line"}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="text-slate-500 font-medium">{taskId}</span> &middot; {taskName}
            </p>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Deliverable context */}
          <div className="bg-cyan-50/60 rounded-lg px-3 py-2.5 border border-cyan-100 flex items-center gap-2.5">
            <Package className="w-4 h-4 text-cyan-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-cyan-500 uppercase tracking-wider font-medium">Deliverable</p>
              <p className="text-[12px] text-cyan-800 font-medium truncate">{deliverableName}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Description <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="e.g., Personnel costs, Equipment rental, Travel expenses"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
              autoFocus
            />
          </div>

          {/* Resource Name */}
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Resource Name</label>
            <input
              type="text"
              value={form.resourceName}
              onChange={(e) => update("resourceName", e.target.value)}
              placeholder="e.g., John Doe, Equipment XYZ"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
            />
          </div>

          {/* Procurement Type & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Procurement Type</label>
              <select
                value={form.procurementType}
                onChange={(e) => {
                  update("procurementType", e.target.value);
                  update("procurementCategory", "");
                }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] bg-white transition-colors"
              >
                <option value="">Select Type</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Procurement Category</label>
              <select
                value={form.procurementCategory}
                onChange={(e) => update("procurementCategory", e.target.value)}
                disabled={!form.procurementType}
                className={cn(
                  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] bg-white transition-colors",
                  !form.procurementType && "opacity-50 cursor-not-allowed"
                )}
              >
                <option value="">Select Category</option>
                {form.procurementType === "internal" ? (
                  <>
                    <option value="internal-asset">Internal Asset</option>
                    <option value="operational-overhead">Operational Overhead</option>
                  </>
                ) : form.procurementType === "external" ? (
                  <>
                    <option value="goods-equipment">Goods/Equipment</option>
                    <option value="services">Services</option>
                    <option value="consulting">Consulting</option>
                  </>
                ) : null}
              </select>
            </div>
          </div>

          {/* Unit Type, Quantity, Unit Cost */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Unit Type <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.unitType}
                onChange={(e) => update("unitType", e.target.value)}
                placeholder="e.g., Hour, Day, Unit"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Quantity <span className="text-red-400">*</span></label>
              <input
                type="number"
                value={form.quantity || ""}
                onChange={(e) => update("quantity", parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Unit Cost ($) <span className="text-red-400">*</span></label>
              <input
                type="number"
                value={form.unitCost || ""}
                onChange={(e) => update("unitCost", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
              />
            </div>
          </div>

          {/* Expected Date & Procurement Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Expected Date</label>
              <input
                type="date"
                value={form.expectedDate}
                onChange={(e) => update("expectedDate", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Procurement Method</label>
              <input
                type="text"
                value={form.procurementMethod}
                onChange={(e) => update("procurementMethod", e.target.value)}
                placeholder="e.g., Bid, Quotation, Direct"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
              />
            </div>
          </div>

          {/* Fund Source */}
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Select Account</label>
            <select
              value={form.fundSource}
              onChange={(e) => update("fundSource", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] bg-white transition-colors"
            >
              <option value="">Select Account</option>
              {AVAILABLE_FUNDS.map((fund) => (
                <option key={fund.id} value={fund.accountCode}>
                  {fund.accountCode} - {fund.accountName} ({fund.subType}) - Bal: {fund.balance}
                </option>
              ))}
            </select>
          </div>

          {/* Live total */}
          {lineTotal > 0 && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-between">
              <span className="text-[12px] text-slate-500">Line Total ({form.quantity} × {formatCurrency(form.unitCost)})</span>
              <span className="text-sm font-semibold text-[#0B01D0]">{formatCurrency(lineTotal)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={cn(
              "px-5 py-2 text-sm rounded-lg transition-colors font-medium",
              isValid
                ? "bg-[#0B01D0] text-white hover:bg-[#0a01b8]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {existingItem ? "Save Changes" : "Add Line Item"}
          </button>
        </div>
      </div>
    </div>
  );
}