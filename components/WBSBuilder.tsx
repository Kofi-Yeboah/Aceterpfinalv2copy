import { useState, useMemo } from "react";
import {
  Plus, Trash2, ChevronDown, ChevronRight, X, ArrowLeft, GripVertical,
  Calendar, Users, Layers, CheckCircle2, Clock, AlertTriangle,
  MoreHorizontal, Edit3, Copy, Target, Hash, FileText, Package, ListChecks,
  MessageSquare, Plane, Link2, Check, ChevronLeft, Lock, Settings2, Shield
} from "lucide-react";
import { cn } from "../lib/utils";
import { addLinkedCommsTask, addLinkedTravelTask, updateLinkedCommsTask, updateLinkedTravelTask, removeLinkedCommsTask, removeLinkedTravelTask } from "../lib/linkedTasksStore";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  name: string;
  assignedStaff: string[];
  staffHours: Record<string, number>;
  startDate: string;
  endDate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: string;
  description: string;
  linkedToComms?: boolean;
  linkedToTravelPlan?: boolean;
}

interface Deliverable {
  id: string;
  name: string;
  assignedStaff: string;
  description: string;
  tasks: Task[];
  expanded: boolean;
}

interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  deliverables: Deliverable[];
  expanded: boolean;
  color: string;
  isMandatory: boolean;
  isEnabled: boolean;
  isConfigured: boolean;
}

interface WBSBuilderProps {
  onBack: () => void;
  hideStatus?: boolean;
}

// ── Standard Phase Definitions ──────────────────────────────────────────────

interface StandardPhaseDefinition {
  id: string;
  name: string;
  isMandatory: boolean;
  description: string;
  color: string;
}

const STANDARD_PHASES: StandardPhaseDefinition[] = [
  {
    id: "procurement-contracting",
    name: "Procurement & Contracting",
    isMandatory: false,
    description: "Manage procurement processes, vendor selection, and contract management for the project.",
    color: "bg-amber-500",
  },
  {
    id: "implementation",
    name: "Implementation",
    isMandatory: true,
    description: "Execute core project activities, coordinate field operations, and manage deliverables.",
    color: "bg-blue-500",
  },
  {
    id: "quality-assurance",
    name: "Quality Assurance",
    isMandatory: true,
    description: "Ensure project outputs meet defined quality standards through reviews, testing, and validation.",
    color: "bg-emerald-500",
  },
  {
    id: "production-editorial",
    name: "Production & Editorial",
    isMandatory: true,
    description: "Manage content creation, design, editing, and production of project materials and outputs.",
    color: "bg-violet-500",
  },
  {
    id: "dissemination",
    name: "Dissemination",
    isMandatory: false,
    description: "Plan and execute the distribution and sharing of project outputs and findings.",
    color: "bg-cyan-500",
  },
  {
    id: "reporting",
    name: "Reporting",
    isMandatory: true,
    description: "Compile progress reports, financial reports, and donor reporting requirements.",
    color: "bg-indigo-500",
  },
  {
    id: "delivery-checkpoint",
    name: "Delivery Stage Complete (Checkpoint)",
    isMandatory: true,
    description: "Final review checkpoint to verify all deliverables are complete and project stage is ready for closure.",
    color: "bg-rose-500",
  },
];

const PHASE_COLOR_LIGHT: Record<string, string> = {
  "bg-blue-500": "bg-blue-50 border-blue-200 text-blue-700",
  "bg-violet-500": "bg-violet-50 border-violet-200 text-violet-700",
  "bg-emerald-500": "bg-emerald-50 border-emerald-200 text-emerald-700",
  "bg-amber-500": "bg-amber-50 border-amber-200 text-amber-700",
  "bg-rose-500": "bg-rose-50 border-rose-200 text-rose-700",
  "bg-cyan-500": "bg-cyan-50 border-cyan-200 text-cyan-700",
  "bg-indigo-500": "bg-indigo-50 border-indigo-200 text-indigo-700",
  "bg-teal-500": "bg-teal-50 border-teal-200 text-teal-700",
};

const STAFF_OPTIONS = [
  "Yaw Osei", "Kofi Mensah", "Kwesi Appiah", "Nana Yaw", "Kwaku Anane",
  "Ama Serwaa", "Kwame Asante", "Akosua Mensah", "Esi Baiden", "Kojo Owusu",
  "Abena Adjei", "Fiifi Yankey",
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getTaskStatusStyle(status: string) {
  switch (status) {
    case "Completed": return "bg-emerald-100 text-emerald-700";
    case "In Progress": return "bg-blue-100 text-blue-700";
    case "On Hold": return "bg-amber-100 text-amber-700";
    default: return "bg-slate-100 text-slate-600";
  }
}

function getTaskStatusIcon(status: string) {
  switch (status) {
    case "Completed": return <CheckCircle2 className="w-3.5 h-3.5" />;
    case "In Progress": return <Clock className="w-3.5 h-3.5" />;
    case "On Hold": return <AlertTriangle className="w-3.5 h-3.5" />;
    default: return <Hash className="w-3.5 h-3.5" />;
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Critical": return "bg-red-100 text-red-700 ring-1 ring-red-200";
    case "High": return "bg-orange-100 text-orange-700 ring-1 ring-orange-200";
    case "Medium": return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
    default: return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

function createPhaseFromDef(def: StandardPhaseDefinition): Phase {
  return {
    id: def.id,
    name: def.name,
    startDate: "",
    endDate: "",
    description: def.description,
    deliverables: [],
    expanded: true,
    color: def.color,
    isMandatory: def.isMandatory,
    isEnabled: def.isMandatory,
    isConfigured: false,
  };
}

// ── Main Component ─────────────────────────────────────────────────────────────

type WizardStep = "select-phases" | "configure-phase";

export function WBSBuilder({ onBack, hideStatus }: WBSBuilderProps) {
  const [phases, setPhases] = useState<Phase[]>(
    STANDARD_PHASES.map(createPhaseFromDef)
  );
  const [currentStep, setCurrentStep] = useState<WizardStep>("select-phases");
  const [activePhaseId, setActivePhaseId] = useState<string>("");
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // Modal state
  const [deliverableModal, setDeliverableModal] = useState<{
    open: boolean;
    phaseId: string;
    existing: Deliverable | null;
  }>({ open: false, phaseId: "", existing: null });

  const [taskModal, setTaskModal] = useState<{
    open: boolean;
    phaseId: string;
    deliverableId: string;
    existing: Task | null;
  }>({ open: false, phaseId: "", deliverableId: "", existing: null });

  const enabledPhases = useMemo(() => phases.filter(p => p.isEnabled), [phases]);

  const activePhase = useMemo(
    () => phases.find(p => p.id === activePhaseId) || null,
    [phases, activePhaseId]
  );

  const activePhaseIndex = useMemo(
    () => enabledPhases.findIndex(p => p.id === activePhaseId),
    [enabledPhases, activePhaseId]
  );

  const stats = useMemo(() => {
    const enabled = phases.filter(p => p.isEnabled);
    return {
      totalPhases: enabled.length,
      totalDeliverables: enabled.reduce((sum, p) => sum + p.deliverables.length, 0),
      totalTasks: enabled.reduce((sum, p) => sum + p.deliverables.reduce((s2, d) => s2 + d.tasks.length, 0), 0),
      configuredPhases: enabled.filter(p => p.isConfigured).length,
    };
  }, [phases]);

  // ── Phase toggle ──
  const togglePhaseEnabled = (phaseId: string) => {
    setPhases(phases.map(p => {
      if (p.id !== phaseId || p.isMandatory) return p;
      return { ...p, isEnabled: !p.isEnabled };
    }));
  };

  // ── Navigate to configure phase ──
  const startConfiguringPhase = (phaseId: string) => {
    setActivePhaseId(phaseId);
    setCurrentStep("configure-phase");
  };

  const goToNextPhase = () => {
    if (activePhaseIndex < enabledPhases.length - 1) {
      // Mark current as configured
      setPhases(prev => prev.map(p => p.id === activePhaseId ? { ...p, isConfigured: true } : p));
      setActivePhaseId(enabledPhases[activePhaseIndex + 1].id);
    }
  };

  const goToPrevPhase = () => {
    if (activePhaseIndex > 0) {
      setActivePhaseId(enabledPhases[activePhaseIndex - 1].id);
    }
  };

  const markPhaseConfigured = () => {
    setPhases(prev => prev.map(p => p.id === activePhaseId ? { ...p, isConfigured: true } : p));
  };

  const goBackToSelection = () => {
    markPhaseConfigured();
    setCurrentStep("select-phases");
  };

  // ── Phase CRUD ──
  const updatePhase = (phaseId: string, field: keyof Phase, value: any) => {
    setPhases(phases.map((p) => (p.id === phaseId ? { ...p, [field]: value } : p)));
  };

  const togglePhaseExpanded = (phaseId: string) => {
    setPhases(phases.map((p) => (p.id === phaseId ? { ...p, expanded: !p.expanded } : p)));
  };

  // ── Deliverable CRUD ──
  const openAddDeliverable = (phaseId: string) => {
    setDeliverableModal({ open: true, phaseId, existing: null });
  };

  const openEditDeliverable = (phaseId: string, deliverable: Deliverable) => {
    setDeliverableModal({ open: true, phaseId, existing: deliverable });
  };

  const saveDeliverable = (phaseId: string, deliverable: Deliverable) => {
    setPhases(phases.map((p) => {
      if (p.id !== phaseId) return p;
      if (deliverableModal.existing) {
        return { ...p, deliverables: p.deliverables.map((d) => (d.id === deliverableModal.existing!.id ? { ...deliverable, tasks: d.tasks, expanded: d.expanded } : d)) };
      }
      return { ...p, deliverables: [...p.deliverables, deliverable] };
    }));
    setDeliverableModal({ open: false, phaseId: "", existing: null });
  };

  const removeDeliverable = (phaseId: string, deliverableId: string) => {
    setPhases(phases.map((p) =>
      p.id === phaseId ? { ...p, deliverables: p.deliverables.filter((d) => d.id !== deliverableId) } : p
    ));
  };

  const toggleDeliverableExpanded = (phaseId: string, deliverableId: string) => {
    setPhases(phases.map((p) =>
      p.id === phaseId
        ? { ...p, deliverables: p.deliverables.map((d) => d.id === deliverableId ? { ...d, expanded: !d.expanded } : d) }
        : p
    ));
  };

  // ── Task CRUD ──
  const openAddTask = (phaseId: string, deliverableId: string) => {
    setTaskModal({ open: true, phaseId, deliverableId, existing: null });
  };

  const openEditTask = (phaseId: string, deliverableId: string, task: Task) => {
    setTaskModal({ open: true, phaseId, deliverableId, existing: task });
  };

  const saveTask = (phaseId: string, deliverableId: string, task: Task) => {
    setPhases(phases.map((p) => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        deliverables: p.deliverables.map((d) => {
          if (d.id !== deliverableId) return d;
          if (taskModal.existing) {
            return { ...d, tasks: d.tasks.map((t) => (t.id === taskModal.existing!.id ? task : t)) };
          }
          return { ...d, tasks: [...d.tasks, task] };
        }),
      };
    }));
    setTaskModal({ open: false, phaseId: "", deliverableId: "", existing: null });
  };

  const removeTask = (phaseId: string, deliverableId: string, taskId: string) => {
    // Find the task to check its linked flags before removing
    const phase = phases.find((p) => p.id === phaseId);
    const deliverable = phase?.deliverables.find((d) => d.id === deliverableId);
    const task = deliverable?.tasks.find((t) => t.id === taskId);
    if (task?.linkedToComms) {
      removeLinkedCommsTask(taskId);
    }
    if (task?.linkedToTravelPlan) {
      removeLinkedTravelTask(taskId);
    }

    setPhases(phases.map((p) =>
      p.id === phaseId
        ? {
          ...p,
          deliverables: p.deliverables.map((d) =>
            d.id === deliverableId ? { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) } : d
          ),
        }
        : p
    ));
  };

  const handleSave = () => {
    console.log("Saving WBS:", phases.filter(p => p.isEnabled));
    onBack();
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Work Breakdown Structure</h1>
              <p className="text-[12px] text-slate-500 mt-0.5">Youth Employment Skills Development &middot; Step-by-step phase configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-sm bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors font-medium">
              Save WBS
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-6">
          <StatPill icon={<Layers className="w-3.5 h-3.5 text-violet-600" />} label="Phases" value={stats.totalPhases} />
          <StatPill icon={<Package className="w-3.5 h-3.5 text-cyan-600" />} label="Deliverables" value={stats.totalDeliverables} />
          <StatPill icon={<ListChecks className="w-3.5 h-3.5 text-blue-600" />} label="Tasks" value={stats.totalTasks} />
          <div className="w-px h-4 bg-slate-200" />
          <StatPill icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />} label="Configured" value={stats.configuredPhases} suffix={`/ ${stats.totalPhases}`} />
        </div>
      </div>

      {/* ── Wizard Tabs (Document Vault style) ─────────────────────────── */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => goBackToSelection()}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
              currentStep === "select-phases"
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Select Phases
          </button>
          <button
            onClick={() => {
              if (enabledPhases.length > 0) {
                if (!activePhaseId || !enabledPhases.find(p => p.id === activePhaseId)) {
                  setActivePhaseId(enabledPhases[0].id);
                }
                setCurrentStep("configure-phase");
              }
            }}
            disabled={enabledPhases.length === 0}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
              currentStep === "configure-phase"
                ? "bg-purple-700 text-white shadow-sm"
                : enabledPhases.length === 0
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Configure Phase
          </button>
        </div>
      </div>

      {/* ── Step Content ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {currentStep === "select-phases" ? (
          <PhaseSelectionStep
            phases={phases}
            onToggle={togglePhaseEnabled}
            onStartConfiguring={startConfiguringPhase}
            enabledPhases={enabledPhases}
          />
        ) : (
          <PhaseConfigurationStep
            phases={phases}
            enabledPhases={enabledPhases}
            activePhase={activePhase}
            activePhaseIndex={activePhaseIndex}
            onSelectPhase={(id) => {
              // Mark current as configured before switching
              if (activePhaseId) markPhaseConfigured();
              setActivePhaseId(id);
            }}
            onUpdatePhase={updatePhase}
            onToggleExpanded={togglePhaseExpanded}
            onAddDeliverable={openAddDeliverable}
            onEditDeliverable={openEditDeliverable}
            onRemoveDeliverable={removeDeliverable}
            onToggleDeliverableExpanded={toggleDeliverableExpanded}
            onAddTask={openAddTask}
            onEditTask={openEditTask}
            onRemoveTask={removeTask}
            onNext={goToNextPhase}
            onPrev={goToPrevPhase}
            openActionMenu={openActionMenu}
            setOpenActionMenu={setOpenActionMenu}
          />
        )}
      </div>

      {/* ── Deliverable Form Modal ─────────────────────────────────────── */}
      {deliverableModal.open && (
        <DeliverableFormModal
          phaseId={deliverableModal.phaseId}
          existingDeliverable={deliverableModal.existing}
          onSave={saveDeliverable}
          onCancel={() => setDeliverableModal({ open: false, phaseId: "", existing: null })}
        />
      )}

      {/* ── Task Form Modal ───────────────────────────────────────────── */}
      {taskModal.open && (
        <TaskFormModal
          phaseId={taskModal.phaseId}
          deliverableId={taskModal.deliverableId}
          existingTask={taskModal.existing}
          onSave={saveTask}
          onCancel={() => setTaskModal({ open: false, phaseId: "", deliverableId: "", existing: null })}
        />
      )}
    </div>
  );
}

// ── Stat Pill ──────────────────────────────────────────────────────────────────

function StatPill({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[12px] text-slate-500">{label}</span>
      <span className="text-[12px] font-semibold text-slate-800">{value}{suffix ? <span className="text-slate-400 font-normal"> {suffix}</span> : null}</span>
    </div>
  );
}

// ── Step 1: Phase Selection ────────────────────────────────────────────────────

function PhaseSelectionStep({
  phases,
  onToggle,
  onStartConfiguring,
  enabledPhases,
}: {
  phases: Phase[];
  onToggle: (id: string) => void;
  onStartConfiguring: (id: string) => void;
  enabledPhases: Phase[];
}) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Step header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-sm font-semibold">1</div>
            <h2 className="text-lg font-semibold text-slate-900">Select Project Phases</h2>
          </div>
          <p className="text-[13px] text-slate-500 ml-9">
            Choose which phases to include in this project's WBS. Mandatory phases are required and cannot be removed.
            Optional phases can be toggled on or off based on project needs.
          </p>
        </div>

        {/* Phase cards */}
        <div className="space-y-3">
          {phases.map((phase, idx) => (
            <div
              key={phase.id}
              className={cn(
                "bg-white rounded-xl border overflow-hidden transition-all",
                phase.isEnabled
                  ? "border-slate-200 shadow-sm"
                  : "border-slate-100 opacity-60"
              )}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Color bar */}
                <div className={cn("w-1.5 h-12 rounded-full flex-shrink-0", phase.color)} />

                {/* Toggle / Lock */}
                <div className="flex-shrink-0">
                  {phase.isMandatory ? (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center" title="Mandatory phase">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  ) : (
                    <button
                      onClick={() => onToggle(phase.id)}
                      className={cn(
                        "w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all",
                        phase.isEnabled
                          ? "bg-purple-700 border-purple-700 text-white"
                          : "border-slate-300 bg-white hover:border-purple-400"
                      )}
                    >
                      {phase.isEnabled && <Check className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-slate-900">{phase.name}</span>
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                      phase.isMandatory
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                    )}>
                      {phase.isMandatory ? "Mandatory" : "Optional"}
                    </span>
                    {phase.isConfigured && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Configured
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-500 line-clamp-1">{phase.description}</p>
                  {phase.isEnabled && (phase.deliverables.length > 0) && (
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {phase.deliverables.length} deliverable{phase.deliverables.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <ListChecks className="w-3 h-3" />
                        {phase.deliverables.reduce((s, d) => s + d.tasks.length, 0)} tasks
                      </span>
                    </div>
                  )}
                </div>

                {/* Configure button */}
                {phase.isEnabled && (
                  <button
                    onClick={() => onStartConfiguring(phase.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex-shrink-0"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    {phase.isConfigured ? "Edit" : "Configure"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary footer */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-slate-900">
                {enabledPhases.length} phase{enabledPhases.length !== 1 ? "s" : ""} selected
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                {enabledPhases.filter(p => p.isMandatory).length} mandatory, {enabledPhases.filter(p => !p.isMandatory).length} optional
              </p>
            </div>
            <button
              onClick={() => {
                if (enabledPhases.length > 0) {
                  onStartConfiguring(enabledPhases[0].id);
                }
              }}
              disabled={enabledPhases.length === 0}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg transition-colors font-medium",
                enabledPhases.length > 0
                  ? "bg-[#0B01D0] text-white hover:bg-[#0a01b8]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              Start Configuring
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Phase Configuration ────────────────────────────────────────────────

function PhaseConfigurationStep({
  phases,
  enabledPhases,
  activePhase,
  activePhaseIndex,
  onSelectPhase,
  onUpdatePhase,
  onToggleExpanded,
  onAddDeliverable,
  onEditDeliverable,
  onRemoveDeliverable,
  onToggleDeliverableExpanded,
  onAddTask,
  onEditTask,
  onRemoveTask,
  onNext,
  onPrev,
  openActionMenu,
  setOpenActionMenu,
}: {
  phases: Phase[];
  enabledPhases: Phase[];
  activePhase: Phase | null;
  activePhaseIndex: number;
  onSelectPhase: (id: string) => void;
  onUpdatePhase: (phaseId: string, field: keyof Phase, value: any) => void;
  onToggleExpanded: (phaseId: string) => void;
  onAddDeliverable: (phaseId: string) => void;
  onEditDeliverable: (phaseId: string, deliverable: Deliverable) => void;
  onRemoveDeliverable: (phaseId: string, deliverableId: string) => void;
  onToggleDeliverableExpanded: (phaseId: string, deliverableId: string) => void;
  onAddTask: (phaseId: string, deliverableId: string) => void;
  onEditTask: (phaseId: string, deliverableId: string, task: Task) => void;
  onRemoveTask: (phaseId: string, deliverableId: string, taskId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  openActionMenu: string | null;
  setOpenActionMenu: (id: string | null) => void;
}) {
  if (!activePhase) return null;

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Phase stepper sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] font-semibold">2</div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Phase Setup</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {enabledPhases.map((phase, idx) => {
            const isActive = phase.id === activePhase.id;
            const isCompleted = phase.isConfigured && !isActive;

            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group",
                  isActive
                    ? "bg-purple-50 border-r-2 border-purple-700"
                    : "hover:bg-slate-50"
                )}
              >
                {/* Step indicator */}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold transition-colors",
                  isActive
                    ? "bg-purple-700 text-white"
                    : isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                )}>
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", phase.color)} />
                    <p className={cn(
                      "text-[12px] truncate",
                      isActive ? "text-purple-700 font-semibold" : "text-slate-700"
                    )}>
                      {phase.name}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 ml-3.5">
                    {phase.deliverables.length} deliverable{phase.deliverables.length !== 1 ? "s" : ""}
                    {phase.isMandatory ? "" : " · Optional"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase navigation */}
        <div className="p-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={activePhaseIndex <= 0}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-3 py-2 text-[12px] rounded-lg transition-colors font-medium",
              activePhaseIndex > 0
                ? "text-slate-600 border border-slate-200 hover:bg-slate-50"
                : "text-slate-300 border border-slate-100 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={activePhaseIndex >= enabledPhases.length - 1}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-3 py-2 text-[12px] rounded-lg transition-colors font-medium",
              activePhaseIndex < enabledPhases.length - 1
                ? "bg-purple-700 text-white hover:bg-purple-800"
                : "text-slate-300 bg-slate-100 cursor-not-allowed"
            )}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Phase configuration content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-[1000px] mx-auto">
          {/* Phase header info */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-5">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className={cn("w-1.5 h-10 rounded-full flex-shrink-0", activePhase.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    PHASE_COLOR_LIGHT[activePhase.color] || "bg-slate-50 border-slate-200 text-slate-700"
                  )}>
                    Phase {activePhaseIndex + 1} of {enabledPhases.length}
                  </span>
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    activePhase.isMandatory
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  )}>
                    {activePhase.isMandatory ? "Mandatory" : "Optional"}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{activePhase.name}</h2>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {activePhase.deliverables.length} deliverable{activePhase.deliverables.length !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <ListChecks className="w-3 h-3" />
                  {activePhase.deliverables.reduce((s, d) => s + d.tasks.length, 0)} tasks
                </span>
              </div>
            </div>

            {/* Phase metadata */}
            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <FieldInline icon={<Calendar className="w-3.5 h-3.5 text-slate-400" />} label="Start">
                  <input
                    type="date"
                    value={activePhase.startDate}
                    onChange={(e) => onUpdatePhase(activePhase.id, "startDate", e.target.value)}
                    className="w-full text-[12px] text-slate-700 bg-transparent border-none outline-none"
                  />
                </FieldInline>
                <FieldInline icon={<Calendar className="w-3.5 h-3.5 text-slate-400" />} label="End">
                  <input
                    type="date"
                    value={activePhase.endDate}
                    onChange={(e) => onUpdatePhase(activePhase.id, "endDate", e.target.value)}
                    className="w-full text-[12px] text-slate-700 bg-transparent border-none outline-none"
                  />
                </FieldInline>
              </div>
              <FieldInline icon={<FileText className="w-3.5 h-3.5 text-slate-400" />} label="Description">
                <textarea
                  value={activePhase.description}
                  onChange={(e) => onUpdatePhase(activePhase.id, "description", e.target.value)}
                  placeholder="Describe the objectives and key activities for this phase..."
                  rows={2}
                  className="w-full text-[12px] text-slate-700 bg-transparent border-none outline-none resize-none placeholder:text-slate-300"
                />
              </FieldInline>
            </div>
          </div>

          {/* Deliverables section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-600" />
                Deliverables & Tasks
              </h3>
              <button
                onClick={() => onAddDeliverable(activePhase.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Deliverable
              </button>
            </div>

            {activePhase.deliverables.length > 0 ? (
              <div className="space-y-3">
                {activePhase.deliverables.map((deliverable, dIdx) => (
                  <DeliverableSection
                    key={deliverable.id}
                    deliverable={deliverable}
                    index={dIdx}
                    phaseId={activePhase.id}
                    phaseColor={activePhase.color}
                    onToggleExpanded={() => onToggleDeliverableExpanded(activePhase.id, deliverable.id)}
                    onEdit={() => onEditDeliverable(activePhase.id, deliverable)}
                    onRemove={() => onRemoveDeliverable(activePhase.id, deliverable.id)}
                    onAddTask={() => onAddTask(activePhase.id, deliverable.id)}
                    onEditTask={(task) => onEditTask(activePhase.id, deliverable.id, task)}
                    onRemoveTask={(taskId) => onRemoveTask(activePhase.id, deliverable.id, taskId)}
                    openActionMenu={openActionMenu}
                    setOpenActionMenu={setOpenActionMenu}
                  />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl py-10 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-[13px] text-slate-500 font-medium">No deliverables yet</p>
                <p className="text-[11px] text-slate-400">Add deliverables to define what this phase will produce</p>
                <button
                  onClick={() => onAddDeliverable(activePhase.id)}
                  className="mt-2 flex items-center gap-1.5 px-4 py-2 text-[12px] text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Deliverable
                </button>
              </div>
            )}
          </div>

          {/* Phase navigation footer */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between mt-6">
            <button
              onClick={onPrev}
              disabled={activePhaseIndex <= 0}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors font-medium",
                activePhaseIndex > 0
                  ? "text-slate-600 border border-slate-200 hover:bg-slate-50"
                  : "text-slate-300 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              {activePhaseIndex > 0 ? enabledPhases[activePhaseIndex - 1].name : "Previous Phase"}
            </button>

            <span className="text-[12px] text-slate-400">
              {activePhaseIndex + 1} of {enabledPhases.length}
            </span>

            <button
              onClick={onNext}
              disabled={activePhaseIndex >= enabledPhases.length - 1}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors font-medium",
                activePhaseIndex < enabledPhases.length - 1
                  ? "bg-purple-700 text-white hover:bg-purple-800"
                  : "text-slate-300 bg-slate-100 cursor-not-allowed"
              )}
            >
              {activePhaseIndex < enabledPhases.length - 1 ? enabledPhases[activePhaseIndex + 1].name : "Next Phase"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Deliverable Section ────────────────────────────────────────────────────────

interface DeliverableSectionProps {
  deliverable: Deliverable;
  index: number;
  phaseId: string;
  phaseColor: string;
  onToggleExpanded: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onRemoveTask: (taskId: string) => void;
  openActionMenu: string | null;
  setOpenActionMenu: (id: string | null) => void;
  hideStatus?: boolean;
}

function DeliverableSection({
  deliverable, index, phaseId, phaseColor,
  onToggleExpanded, onEdit, onRemove, onAddTask, onEditTask, onRemoveTask,
  openActionMenu, setOpenActionMenu, hideStatus,
}: DeliverableSectionProps) {
  const menuId = `del-menu-${deliverable.id}`;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/30">
      {/* Deliverable header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100">
        <button onClick={onToggleExpanded} className="text-slate-400 hover:text-slate-600 transition-colors">
          {deliverable.expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        <Package className="w-4 h-4 text-cyan-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-slate-900 truncate">{deliverable.name || "Untitled Deliverable"}</span>
            <span className="text-[10px] text-slate-400 font-medium">D{index + 1}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {deliverable.assignedStaff && (
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {deliverable.assignedStaff}
              </span>
            )}
            <span className="text-[11px] text-slate-400">
              {deliverable.tasks.length} task{deliverable.tasks.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Edit Deliverable">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === menuId ? null : menuId); }}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {openActionMenu === menuId && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setOpenActionMenu(null)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 overflow-hidden">
                  <button onClick={() => { onAddTask(); setOpenActionMenu(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" /> Add Task
                  </button>
                  <button onClick={() => { onEdit(); setOpenActionMenu(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Edit3 className="w-3.5 h-3.5" /> Edit Deliverable
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button onClick={() => { onRemove(); setOpenActionMenu(null); }} className="w-full px-3 py-2 text-left text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Deliverable
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Deliverable body — tasks */}
      {deliverable.expanded && (
        <div className="px-4 py-3">
          {deliverable.tasks.length > 0 ? (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0B01D0]">
                    <th className="text-left py-2.5 px-4 text-[12px] font-semibold text-white">Task / Activity</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-semibold text-white">Assigned To</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-semibold text-white">Timeline</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-semibold text-white">Priority</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-semibold text-white">Status</th>
                    <th className="text-center py-2.5 px-3 text-[12px] font-semibold text-white w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {deliverable.tasks.map((task, tIdx) => (
                    <tr key={task.id} className={cn("border-b border-slate-100 hover:bg-slate-50/80 group transition-colors", tIdx % 2 === 1 ? "bg-slate-50/40" : "")}>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3 h-3 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                          <span className="text-[12px] text-slate-800">{task.name}</span>
                          {task.linkedToComms && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[9px] font-medium flex-shrink-0" title="Communications Plan">
                              <MessageSquare className="w-2.5 h-2.5" />
                              Comms
                            </span>
                          )}
                          {task.linkedToTravelPlan && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 text-[9px] font-medium flex-shrink-0" title="Travel Plan">
                              <Plane className="w-2.5 h-2.5" />
                              Travel
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {task.assignedStaff.length > 0 ? (
                            task.assignedStaff.map((staff) => (
                              <span key={staff} className="text-[11px] text-slate-700 inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                {staff}
                                {task.staffHours?.[staff] ? (
                                  <span className="text-[10px] text-blue-600 font-medium">({task.staffHours[staff]}h)</span>
                                ) : null}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-300 italic">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-[12px] text-slate-500">{formatDate(task.startDate)} — {formatDate(task.endDate)}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", getPriorityStyle(task.priority))}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md inline-flex items-center gap-1", getTaskStatusStyle(task.status))}>
                          {getTaskStatusIcon(task.status)}
                          {task.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => onEditTask(task)} className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors" title="Edit">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onRemoveTask(task.id)} className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-lg py-5 flex flex-col items-center justify-center gap-1.5">
              <ListChecks className="w-4 h-4 text-slate-300" />
              <p className="text-[11px] text-slate-400">No tasks yet for this deliverable</p>
            </div>
          )}

          {/* Add task button */}
          <button
            onClick={onAddTask}
            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task / Activity
          </button>
        </div>
      )}
    </div>
  );
}

// ── Inline Field ───────────────────────────────────────────────────────────────

function FieldInline({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon}
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{label}</span>
      </div>
      {children}
    </div>
  );
}

// ── Deliverable Form Modal ─────────────────────────────────────────────────────

interface DeliverableFormModalProps {
  phaseId: string;
  existingDeliverable: Deliverable | null;
  onSave: (phaseId: string, deliverable: Deliverable) => void;
  onCancel: () => void;
}

function DeliverableFormModal({ phaseId, existingDeliverable, onSave, onCancel }: DeliverableFormModalProps) {
  const [name, setName] = useState(existingDeliverable?.name || "");
  const [assignedStaff, setAssignedStaff] = useState(existingDeliverable?.assignedStaff || "");
  const [description, setDescription] = useState(existingDeliverable?.description || "");

  const handleSave = () => {
    if (!name.trim()) return;
    const deliverable: Deliverable = {
      id: existingDeliverable?.id || `del-${Date.now()}`,
      name,
      assignedStaff,
      description,
      tasks: existingDeliverable?.tasks || [],
      expanded: true,
    };
    onSave(phaseId, deliverable);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Package className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{existingDeliverable ? "Edit Deliverable" : "Add New Deliverable"}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Define what this phase will produce</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Deliverable Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Training Curriculum Package"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Assigned Staff</label>
            <select
              value={assignedStaff}
              onChange={(e) => setAssignedStaff(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] bg-white transition-colors"
            >
              <option value="">Select staff...</option>
              {STAFF_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the deliverable and its acceptance criteria..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] resize-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={cn(
              "px-5 py-2 text-sm rounded-lg transition-colors font-medium",
              name.trim()
                ? "bg-[#0B01D0] text-white hover:bg-[#0a01b8]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {existingDeliverable ? "Save Changes" : "Add Deliverable"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Task Form Modal ───────────────────────────────────────────────────────────

interface TaskFormModalProps {
  phaseId: string;
  deliverableId: string;
  existingTask: Task | null;
  onSave: (phaseId: string, deliverableId: string, task: Task) => void;
  onCancel: () => void;
}

function TaskFormModal({ phaseId, deliverableId, existingTask, onSave, onCancel }: TaskFormModalProps) {
  const [taskName, setTaskName] = useState(existingTask?.name || "");
  const [assignedStaff, setAssignedStaff] = useState<string[]>(existingTask?.assignedStaff || []);
  const [staffHours, setStaffHours] = useState<Record<string, number>>(existingTask?.staffHours || {});
  const [staffInput, setStaffInput] = useState("");
  const [startDate, setStartDate] = useState(existingTask?.startDate || "");
  const [endDate, setEndDate] = useState(existingTask?.endDate || "");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">(existingTask?.priority || "Medium");
  const [status, setStatus] = useState(existingTask?.status || "Not Started");
  const [description, setDescription] = useState(existingTask?.description || "");
  const [linkedToComms, setLinkedToComms] = useState(existingTask?.linkedToComms || false);
  const [linkedToTravelPlan, setLinkedToTravelPlan] = useState(existingTask?.linkedToTravelPlan || false);

  // Comms-specific fields
  const AUDIENCE_OPTIONS = [
    "Donors", "Internal Staff", "Board Members", "Beneficiaries",
    "Partners", "Government", "Media", "General Public"
  ];
  const CHANNEL_OPTIONS = [
    "Physical Event", "Social Media", "Email", "Website",
    "Press Release", "Newsletter", "Video Conference", "Print Media"
  ];
  const [commsAudiences, setCommsAudiences] = useState<string[]>([]);
  const [commsChannels, setCommsChannels] = useState<string[]>([]);

  // Travel-specific fields
  const TRAVEL_PURPOSE_OPTIONS = [
    "Field Visit", "Stakeholder Meeting", "Conference/Workshop", "Training",
    "Data Collection", "Monitoring & Evaluation", "Project Launch", "Partner Coordination", "Donor Meeting", "Other"
  ];
  const TRANSPORT_TYPE_OPTIONS = [
    "Flight - Economy", "Flight - Business", "Train", "Bus",
    "Vehicle (Project)", "Vehicle (Rental)", "Personal Vehicle"
  ];
  const ACCOMMODATION_TYPE_OPTIONS = [
    "Hotel - Standard", "Hotel - Business", "Guest House",
    "Serviced Apartment", "Per Diem Only", "No Accommodation Needed"
  ];
  const [travelDestination, setTravelDestination] = useState("");
  const [travelDepartureLocation, setTravelDepartureLocation] = useState("");
  const [travelPurpose, setTravelPurpose] = useState("");
  const [travelDepartureDate, setTravelDepartureDate] = useState("");
  const [travelReturnDate, setTravelReturnDate] = useState("");
  const [travelTransportType, setTravelTransportType] = useState("");
  const [travelAccommodationType, setTravelAccommodationType] = useState("");
  const [travelEstimatedCost, setTravelEstimatedCost] = useState("");
  const [travelNotes, setTravelNotes] = useState("");

  const toggleAudience = (a: string) =>
    setCommsAudiences(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const toggleChannel = (c: string) =>
    setCommsChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const addStaff = () => {
    if (staffInput.trim() && !assignedStaff.includes(staffInput.trim())) {
      setAssignedStaff([...assignedStaff, staffInput.trim()]);
      setStaffInput("");
    }
  };

  const removeStaff = (staff: string) => {
    setAssignedStaff(assignedStaff.filter((s) => s !== staff));
    setStaffHours((prev) => {
      const next = { ...prev };
      delete next[staff];
      return next;
    });
  };

  const handleSave = () => {
    if (!taskName.trim()) return;
    const task: Task = {
      id: existingTask?.id || `task-${Date.now()}`,
      name: taskName,
      assignedStaff,
      staffHours,
      startDate,
      endDate,
      priority,
      status,
      description,
      linkedToComms,
      linkedToTravelPlan,
    };

    // Sync linked plans (create, update, or remove)
    const commsPayload = {
      taskId: task.id,
      taskName: task.name,
      assignedTo: assignedStaff.join(", "),
      project: "Youth Employment Skills Development",
      phase: phaseId,
      dueDate: endDate,
      priority,
      status: "Planned" as const,
      audiences: commsAudiences,
      channels: commsChannels,
      description,
    };

    const travelPayload = {
      taskId: task.id,
      taskName: task.name,
      assignedTo: assignedStaff[0] || "",
      project: "Youth Employment Skills Development",
      phase: phaseId,
      dueDate: endDate,
      priority,
      status: "Planned" as const,
      destination: travelDestination,
      departureLocation: travelDepartureLocation,
      travelPurpose,
      departureDate: travelDepartureDate,
      returnDate: travelReturnDate,
      transportType: travelTransportType,
      accommodationType: travelAccommodationType,
      estimatedCost: parseFloat(travelEstimatedCost || "0"),
      notes: travelNotes,
    };

    if (linkedToComms) {
      if (existingTask) {
        // Update existing or add if newly linked
        updateLinkedCommsTask(commsPayload);
      } else {
        addLinkedCommsTask(commsPayload);
      }
    } else if (existingTask?.linkedToComms) {
      // Was linked before but user unchecked — remove from plan
      removeLinkedCommsTask(task.id);
    }

    if (linkedToTravelPlan) {
      if (existingTask) {
        updateLinkedTravelTask(travelPayload);
      } else {
        addLinkedTravelTask(travelPayload);
      }
    } else if (existingTask?.linkedToTravelPlan) {
      // Was linked before but user unchecked — remove from plan
      removeLinkedTravelTask(task.id);
    }

    onSave(phaseId, deliverableId, task);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <ListChecks className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{existingTask ? "Edit Task / Activity" : "Add New Task / Activity"}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Define the work required for this deliverable</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Task / Activity Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Conduct needs assessment survey"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors"
              autoFocus
            />
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Assigned Staff</label>
            <div className="flex gap-2 mb-2">
              <select
                value={staffInput}
                onChange={(e) => setStaffInput(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] bg-white transition-colors"
              >
                <option value="">Select staff member...</option>
                {STAFF_OPTIONS.filter((s) => !assignedStaff.includes(s)).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={addStaff}
                disabled={!staffInput}
                className={cn(
                  "px-3 py-2 text-sm rounded-lg transition-colors font-medium",
                  staffInput ? "bg-[#0B01D0] text-white hover:bg-[#0a01b8]" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                Add
              </button>
            </div>
            {assignedStaff.length > 0 && (
              <div className="space-y-2">
                {assignedStaff.map((staff) => (
                  <div key={staff} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-[12px] text-blue-700 font-medium flex-1">{staff}</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Hrs"
                        value={staffHours[staff] || ""}
                        onChange={(e) => setStaffHours((prev) => ({ ...prev, [staff]: parseFloat(e.target.value) || 0 }))}
                        className="w-16 px-2 py-1 text-[11px] border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0B01D0]/30 focus:border-[#0B01D0] bg-white text-slate-700 text-center"
                      />
                      <span className="text-[10px] text-slate-400">hrs</span>
                    </div>
                    <button onClick={() => removeStaff(staff)} className="text-blue-400 hover:text-blue-600 transition-colors ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] transition-colors" />
            </div>
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] bg-white transition-colors">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] bg-white transition-colors">
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task activities and expected output..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0] resize-none transition-colors"
            />
          </div>

          {/* ── Plan Connections ───────────────────────────────────── */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="w-3.5 h-3.5 text-slate-600" />
              <h4 className="text-[12px] font-semibold text-slate-900">Plan Connections</h4>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">
              Link this task to project plans. Connected tasks will automatically populate the corresponding plan tables.
            </p>

            <div className="space-y-2.5">
              {/* Communications Plan Toggle */}
              <label
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  linkedToComms
                    ? "border-violet-300 bg-violet-50/50 ring-1 ring-violet-200"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className="pt-0.5">
                  <div
                    className={cn(
                      "w-4 h-4 rounded flex items-center justify-center border-2 transition-colors",
                      linkedToComms
                        ? "bg-violet-600 border-violet-600"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {linkedToComms && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={linkedToComms}
                    onChange={(e) => setLinkedToComms(e.target.checked)}
                    className="sr-only"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
                    <span className="text-[12px] font-medium text-slate-900">Communications Plan</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Auto-populates in Comms Plan Builder with audience and channel details.
                  </p>
                </div>
              </label>

              {/* Comms sub-fields */}
              {linkedToComms && (
                <div className="ml-7 space-y-3 p-3 bg-violet-50/30 rounded-lg border border-violet-100">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1.5">Target Audiences</label>
                    <div className="flex flex-wrap gap-1.5">
                      {AUDIENCE_OPTIONS.map(a => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleAudience(a)}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors",
                            commsAudiences.includes(a)
                              ? "bg-violet-600 text-white border-violet-600"
                              : "bg-white text-slate-500 border-slate-200 hover:border-violet-300"
                          )}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1.5">Channels</label>
                    <div className="flex flex-wrap gap-1.5">
                      {CHANNEL_OPTIONS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleChannel(c)}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors",
                            commsChannels.includes(c)
                              ? "bg-violet-600 text-white border-violet-600"
                              : "bg-white text-slate-500 border-slate-200 hover:border-violet-300"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Travel Plan Toggle */}
              <label
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  linkedToTravelPlan
                    ? "border-sky-300 bg-sky-50/50 ring-1 ring-sky-200"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className="pt-0.5">
                  <div
                    className={cn(
                      "w-4 h-4 rounded flex items-center justify-center border-2 transition-colors",
                      linkedToTravelPlan
                        ? "bg-sky-600 border-sky-600"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {linkedToTravelPlan && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={linkedToTravelPlan}
                    onChange={(e) => setLinkedToTravelPlan(e.target.checked)}
                    className="sr-only"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Plane className="w-3.5 h-3.5 text-sky-600" />
                    <span className="text-[12px] font-medium text-slate-900">Travel Plan Request</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Generates a travel request entry in the Travel Plan Builder with trip details.
                  </p>
                </div>
              </label>

              {/* Travel sub-fields */}
              {linkedToTravelPlan && (
                <div className="ml-7 space-y-3 p-3 bg-sky-50/30 rounded-lg border border-sky-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Departure Location</label>
                      <input type="text" value={travelDepartureLocation} onChange={(e) => setTravelDepartureLocation(e.target.value)} placeholder="e.g. Accra" className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Destination</label>
                      <input type="text" value={travelDestination} onChange={(e) => setTravelDestination(e.target.value)} placeholder="e.g. Tamale" className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Travel Purpose</label>
                    <select value={travelPurpose} onChange={(e) => setTravelPurpose(e.target.value)} className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white">
                      <option value="">Select purpose</option>
                      {TRAVEL_PURPOSE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Departure Date</label>
                      <input type="date" value={travelDepartureDate} onChange={(e) => setTravelDepartureDate(e.target.value)} className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Return Date</label>
                      <input type="date" value={travelReturnDate} onChange={(e) => setTravelReturnDate(e.target.value)} className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Transport Type</label>
                      <select value={travelTransportType} onChange={(e) => setTravelTransportType(e.target.value)} className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white">
                        <option value="">Select transport</option>
                        {TRANSPORT_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Accommodation</label>
                      <select value={travelAccommodationType} onChange={(e) => setTravelAccommodationType(e.target.value)} className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white">
                        <option value="">Select accommodation</option>
                        {ACCOMMODATION_TYPE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Estimated Cost ($)</label>
                      <input type="number" value={travelEstimatedCost} onChange={(e) => setTravelEstimatedCost(e.target.value)} placeholder="0" min="0" className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Travel Notes</label>
                      <input type="text" value={travelNotes} onChange={(e) => setTravelNotes(e.target.value)} placeholder="Additional notes..." className="w-full px-2.5 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          {/* Plan connection indicators */}
          <div className="flex items-center gap-1.5">
            {linkedToComms && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-medium">
                <MessageSquare className="w-3 h-3" />
                Comms
              </span>
            )}
            {linkedToTravelPlan && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-medium">
                <Plane className="w-3 h-3" />
                Travel
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!taskName.trim()}
            className={cn(
              "px-5 py-2 text-sm rounded-lg transition-colors font-medium",
              taskName.trim()
                ? "bg-[#0B01D0] text-white hover:bg-[#0a01b8]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {existingTask ? "Save Changes" : "Add Task"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}