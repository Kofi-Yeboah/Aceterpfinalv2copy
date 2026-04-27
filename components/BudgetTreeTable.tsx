import { useState } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";

interface BudgetLineItem {
  id: string;
  name: string;
  planned: number;
  actual: number;
}

interface BudgetTask {
  id: string;
  name: string;
  lineItems: BudgetLineItem[];
}

interface BudgetPhase {
  id: string;
  name: string;
  tasks: BudgetTask[];
}

const BUDGET_DATA: BudgetPhase[] = [
  {
    id: "P1",
    name: "Stage 1: Procurement & Contracting (Optional)",
    tasks: [
      {
        id: "T001",
        name: "Draft Request for Proposals (RFP)",
        lineItems: [
          { id: "L001", name: "Consultant Fees - Survey Design", planned: 8000, actual: 8000 },
          { id: "L002", name: "Printing & Materials", planned: 1200, actual: 1050 },
          { id: "L003", name: "Stakeholder Workshop", planned: 3500, actual: 3500 },
        ],
      },
      {
        id: "T002",
        name: "Evaluate Vendor Submissions",
        lineItems: [
          { id: "L004", name: "External Reviewer Honoraria", planned: 4000, actual: 4000 },
          { id: "L005", name: "Review Meeting Logistics", planned: 1500, actual: 1200 },
        ],
      },
      {
        id: "T003",
        name: "Finalize Service Agreements",
        lineItems: [
          { id: "L006", name: "Research Assistant Stipends", planned: 6000, actual: 6000 },
          { id: "L007", name: "Database Subscriptions", planned: 2000, actual: 1800 },
          { id: "L008", name: "Reference Materials", planned: 800, actual: 650 },
        ],
      },
    ],
  },
  {
    id: "P2",
    name: "Stage 2: Implementation (Mandatory)",
    tasks: [
      {
        id: "T004",
        name: "Coordinate Field Data Collection",
        lineItems: [
          { id: "L009", name: "Venue & Catering", planned: 5000, actual: 4800 },
          { id: "L010", name: "Audio-Visual Equipment Rental", planned: 2000, actual: 1950 },
          { id: "L011", name: "Facilitator Fees", planned: 3000, actual: 3000 },
        ],
      },
      {
        id: "T005",
        name: "Conduct Stakeholder Engagement Sessions",
        lineItems: [
          { id: "L012", name: "Consultant Fees - Engagement", planned: 7000, actual: 5600 },
          { id: "L013", name: "Community Outreach Materials", planned: 3000, actual: 2100 },
          { id: "L014", name: "Travel - Stakeholder Visits", planned: 4500, actual: 3200 },
        ],
      },
      {
        id: "T009",
        name: "Procure IT Equipment",
        lineItems: [
          { id: "L015", name: "Laptops (50x Dell Latitude)", planned: 47500, actual: 47500 },
          { id: "L016", name: "Networking Equipment", planned: 3500, actual: 0 },
          { id: "L017", name: "Software Licences", planned: 8000, actual: 0 },
        ],
      },
    ],
  },
  {
    id: "P3",
    name: "Stage 3: Quality Assurance (Mandatory)",
    tasks: [
      {
        id: "T006",
        name: "Conduct Internal Peer Review of Draft",
        lineItems: [
          { id: "L018", name: "QA Reviewer Wages", planned: 12000, actual: 0 },
          { id: "L019", name: "Testing Tools & Subscriptions", planned: 5000, actual: 0 },
        ],
      },
    ],
  },
  {
    id: "P4",
    name: "Stage 4: Production & Editorial (Mandatory)",
    tasks: [
      {
        id: "T007",
        name: "Design and Layout Report",
        lineItems: [
          { id: "L020", name: "Graphic Design Services", planned: 6000, actual: 0 },
          { id: "L021", name: "Editorial Review Services", planned: 4000, actual: 0 },
        ],
      },
    ],
  },
  {
    id: "P5",
    name: "Stage 5: Dissemination (Optional)",
    tasks: [
      {
        id: "T010",
        name: "Plan Distribution Channels",
        lineItems: [
          { id: "L022", name: "Distribution Platform Fees", planned: 3500, actual: 0 },
        ],
      },
    ],
  },
  {
    id: "P6",
    name: "Stage 6: Reporting (Mandatory)",
    tasks: [
      {
        id: "T008",
        name: "Submit Final Technical Report",
        lineItems: [
          { id: "L023", name: "Report Design & Layout", planned: 3000, actual: 0 },
          { id: "L024", name: "Printing & Distribution", planned: 2000, actual: 0 },
          { id: "L025", name: "Final Audit Fees", planned: 4500, actual: 0 },
        ],
      },
    ],
  },
  {
    id: "P7",
    name: "Delivery Stage Complete (Checkpoint)",
    tasks: [
      {
        id: "T015",
        name: "Sign-off and Handover",
        lineItems: [
          { id: "L026", name: "Final Review & Sign-off Meeting", planned: 1500, actual: 0 },
        ],
      },
    ],
  },
];

// Delivery stage overrides — procurement mostly done, delivery underway
const DELIVERY_ACTUAL_OVERRIDES: Record<string, number> = {
  // Delivery items - procurement completed
  L012: 7000, // Consultant Fees - Engagement (fully spent)
  L013: 2800, // Community Outreach Materials (delivered)
  L014: 4200, // Travel - Stakeholder Visits (completed)
  L016: 3200, // Networking Equipment (delivered)
  L017: 7500, // Software Licences (procured)
  // Delivery items - implementation underway
  L018: 8400, // Field Enumerator Wages (70% through)
  L019: 3200, // Transport & Fuel (64%)
  L020: 3500, // Mobile Data Collection Tools (purchased)
  L021: 2400, // Policy Expert Consultation (40% started)
  L022: 0, // Validation Workshop (not yet)
};

function getBudgetData(projectStage: string): BudgetPhase[] {
  if (projectStage === "Closure") {
    // In Closure, all budget lines are fully spent (actual = planned)
    return BUDGET_DATA.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(task => ({
        ...task,
        lineItems: task.lineItems.map(li => ({
          ...li,
          actual: li.planned,
        })),
      })),
    }));
  }
  
  if (projectStage !== "Delivery") return BUDGET_DATA;
  
  return BUDGET_DATA.map(phase => ({
    ...phase,
    tasks: phase.tasks.map(task => ({
      ...task,
      lineItems: task.lineItems.map(li => ({
        ...li,
        actual: li.id in DELIVERY_ACTUAL_OVERRIDES ? DELIVERY_ACTUAL_OVERRIDES[li.id] : li.actual,
      })),
    })),
  }));
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getVarianceColor(variance: number) {
  if (variance > 0) return "text-emerald-600";
  if (variance < 0) return "text-red-600";
  return "text-slate-600";
}

function getUsageBarColor(pct: number) {
  if (pct >= 100) return "bg-blue-500";
  if (pct >= 80) return "bg-amber-500";
  if (pct >= 50) return "bg-emerald-500";
  if (pct > 0) return "bg-emerald-400";
  return "bg-slate-300";
}

export function BudgetTreeTable({ projectStage = "Delivery" }: { projectStage?: string }) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
    projectStage === "Closure" ? new Set(["P1", "P2", "P3"]) : new Set(["P1", "P2"])
  );
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(
    projectStage === "Closure" ? new Set(["T001", "T002", "T003", "T004", "T005", "T009", "T006", "T007", "T008"]) :
    new Set(["T004", "T005", "T009", "T006", "T007"])
  );

  const budgetData = getBudgetData(projectStage);

  const togglePhase = (id: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTask = (id: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Grand totals
  const grandPlanned = budgetData.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.reduce((s3, li) => s3 + li.planned, 0), 0),
    0
  );
  const grandActual = budgetData.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.reduce((s3, li) => s3 + li.actual, 0), 0),
    0
  );
  const grandVariance = grandPlanned - grandActual;
  const grandPct = grandPlanned > 0 ? Math.round((grandActual / grandPlanned) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Budget Breakdown — Phase / Task / Line Item</h2>
        <span className="text-[12px] text-slate-500">
          {budgetData.reduce((s, p) => s + p.tasks.length, 0)} tasks across {budgetData.length} phases
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-[40%]">Item</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Planned Budget</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Actual Spent</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Variance</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-[15%]">% Used</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody>
            {budgetData.map((phase) => {
              const phasePlanned = phase.tasks.reduce(
                (s, t) => s + t.lineItems.reduce((s2, li) => s2 + li.planned, 0),
                0
              );
              const phaseActual = phase.tasks.reduce(
                (s, t) => s + t.lineItems.reduce((s2, li) => s2 + li.actual, 0),
                0
              );
              const phaseVariance = phasePlanned - phaseActual;
              const phasePct = phasePlanned > 0 ? Math.round((phaseActual / phasePlanned) * 100) : 0;
              const isPhaseExpanded = expandedPhases.has(phase.id);

              return (
                <PhaseRows
                  key={phase.id}
                  phase={phase}
                  phasePlanned={phasePlanned}
                  phaseActual={phaseActual}
                  phaseVariance={phaseVariance}
                  phasePct={phasePct}
                  isPhaseExpanded={isPhaseExpanded}
                  expandedTasks={expandedTasks}
                  onTogglePhase={() => togglePhase(phase.id)}
                  onToggleTask={toggleTask}
                />
              );
            })}

            {/* Grand Total */}
            <tr className="bg-slate-100 border-t-2 border-slate-300">
              <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">Grand Total</td>
              <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(grandPlanned)}</td>
              <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(grandActual)}</td>
              <td className={`px-4 py-3 text-right text-[12px] font-semibold ${getVarianceColor(grandVariance)}`}>
                {formatCurrency(grandVariance)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getUsageBarColor(grandPct)}`} style={{ width: `${Math.min(grandPct, 100)}%` }} />
                  </div>
                  <span className="text-[12px] font-semibold text-slate-900 min-w-[35px]">{grandPct}%</span>
                </div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PhaseRows({
  phase,
  phasePlanned,
  phaseActual,
  phaseVariance,
  phasePct,
  isPhaseExpanded,
  expandedTasks,
  onTogglePhase,
  onToggleTask,
}: {
  phase: BudgetPhase;
  phasePlanned: number;
  phaseActual: number;
  phaseVariance: number;
  phasePct: number;
  isPhaseExpanded: boolean;
  expandedTasks: Set<string>;
  onTogglePhase: () => void;
  onToggleTask: (id: string) => void;
}) {
  return (
    <>
      {/* Phase Row */}
      <tr
        className="bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onTogglePhase}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isPhaseExpanded ? (
              <ChevronDown className="size-4 text-slate-500 shrink-0" />
            ) : (
              <ChevronRight className="size-4 text-slate-500 shrink-0" />
            )}
            <span className="text-[12px] font-semibold text-slate-900">{phase.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(phasePlanned)}</td>
        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(phaseActual)}</td>
        <td className={`px-4 py-3 text-right text-[12px] font-semibold ${getVarianceColor(phaseVariance)}`}>
          {formatCurrency(phaseVariance)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getUsageBarColor(phasePct)}`} style={{ width: `${Math.min(phasePct, 100)}%` }} />
            </div>
            <span className="text-[12px] text-slate-600 min-w-[35px]">{phasePct}%</span>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <button className="text-slate-400 hover:text-slate-600" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="size-4" />
          </button>
        </td>
      </tr>

      {/* Task Rows */}
      {isPhaseExpanded &&
        phase.tasks.map((task) => {
          const taskPlanned = task.lineItems.reduce((s, li) => s + li.planned, 0);
          const taskActual = task.lineItems.reduce((s, li) => s + li.actual, 0);
          const taskVariance = taskPlanned - taskActual;
          const taskPct = taskPlanned > 0 ? Math.round((taskActual / taskPlanned) * 100) : 0;
          const isTaskExpanded = expandedTasks.has(task.id);

          return (
            <TaskRows
              key={task.id}
              task={task}
              taskPlanned={taskPlanned}
              taskActual={taskActual}
              taskVariance={taskVariance}
              taskPct={taskPct}
              isTaskExpanded={isTaskExpanded}
              onToggleTask={() => onToggleTask(task.id)}
            />
          );
        })}
    </>
  );
}

function TaskRows({
  task,
  taskPlanned,
  taskActual,
  taskVariance,
  taskPct,
  isTaskExpanded,
  onToggleTask,
}: {
  task: BudgetTask;
  taskPlanned: number;
  taskActual: number;
  taskVariance: number;
  taskPct: number;
  isTaskExpanded: boolean;
  onToggleTask: () => void;
}) {
  return (
    <>
      {/* Task Row */}
      <tr
        className="border-b border-slate-100 cursor-pointer hover:bg-blue-50/30 transition-colors"
        onClick={onToggleTask}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 pl-6">
            {isTaskExpanded ? (
              <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="size-3.5 text-slate-400 shrink-0" />
            )}
            <span className="text-[12px] font-medium text-slate-800">{task.id} — {task.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-700">{formatCurrency(taskPlanned)}</td>
        <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-700">{formatCurrency(taskActual)}</td>
        <td className={`px-4 py-3 text-right text-[12px] font-medium ${getVarianceColor(taskVariance)}`}>
          {formatCurrency(taskVariance)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getUsageBarColor(taskPct)}`} style={{ width: `${Math.min(taskPct, 100)}%` }} />
            </div>
            <span className="text-[12px] text-slate-500 min-w-[35px]">{taskPct}%</span>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <button className="text-slate-400 hover:text-slate-600" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="size-4" />
          </button>
        </td>
      </tr>

      {/* Line Item Rows */}
      {isTaskExpanded &&
        task.lineItems.map((li) => {
          const liVariance = li.planned - li.actual;
          const liPct = li.planned > 0 ? Math.round((li.actual / li.planned) * 100) : 0;

          return (
            <tr key={li.id} className="border-b border-slate-50 bg-white hover:bg-slate-50/50">
              <td className="px-4 py-2.5">
                <div className="pl-14">
                  <span className="text-[12px] text-slate-600">{li.name}</span>
                </div>
              </td>
              <td className="px-4 py-2.5 text-right text-[12px] text-slate-500">{formatCurrency(li.planned)}</td>
              <td className="px-4 py-2.5 text-right text-[12px] text-slate-500">{formatCurrency(li.actual)}</td>
              <td className={`px-4 py-2.5 text-right text-[12px] ${getVarianceColor(liVariance)}`}>
                {formatCurrency(liVariance)}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getUsageBarColor(liPct)}`} style={{ width: `${Math.min(liPct, 100)}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-400 min-w-[35px]">{liPct}%</span>
                </div>
              </td>
              <td></td>
            </tr>
          );
        })}
    </>
  );
}