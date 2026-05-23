import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";

// ─── Budget-aligned resource data (internal procurement items from BudgetBuilder) ──

interface ResourceLineItem {
  budgetLineId: string;
  name: string;
  planned: number;
  procurementCategory: string;
  resourceName: string;
  unitType: string;
  quantity: number;
  unitCost: number;
  expectedDate: string;
  fundSource: string;
}

interface ResourceTask {
  taskId: string;
  taskName: string;
  lineItems: ResourceLineItem[];
}

interface ResourcePhase {
  phaseId: string;
  phaseName: string;
  tasks: ResourceTask[];
}

const RESOURCE_DATA: ResourcePhase[] = [
  {
    phaseId: "P1",
    phaseName: "Stage 1: Procurement & Contracting (Optional)",
    tasks: [
      {
        taskId: "T001",
        taskName: "Draft Request for Proposals (RFP)",
        lineItems: [
          { budgetLineId: "RL001", name: "Project Manager - Full Time", planned: 8000, procurementCategory: "Staff Labour", resourceName: "Senior Project Manager", unitType: "Month", quantity: 1, unitCost: 8000, expectedDate: "2025-02-01", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL002", name: "Office Space Rental", planned: 2500, procurementCategory: "Operational Overhead", resourceName: "Regional Office - Accra", unitType: "Month", quantity: 1, unitCost: 2500, expectedDate: "2025-01-15", fundSource: "FUND-YOU-004" },
        ],
      },
      {
        taskId: "T002",
        taskName: "Evaluate Vendor Submissions",
        lineItems: [
          { budgetLineId: "RL003", name: "Data Analyst", planned: 6500, procurementCategory: "Staff Labour", resourceName: "Senior Data Analyst", unitType: "Month", quantity: 1, unitCost: 6500, expectedDate: "2025-03-01", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL004", name: "IT Equipment - Laptops", planned: 3600, procurementCategory: "Internal Asset", resourceName: "Dell Latitude 5520", unitType: "Unit", quantity: 3, unitCost: 1200, expectedDate: "2025-02-15", fundSource: "FUND-TEC-006" },
        ],
      },
      {
        taskId: "T003",
        taskName: "Finalize Service Agreements",
        lineItems: [
          { budgetLineId: "RL005", name: "Field Research Assistants", planned: 9000, procurementCategory: "Staff Labour", resourceName: "Research Assistant (2 persons)", unitType: "Month", quantity: 2, unitCost: 4500, expectedDate: "2025-04-01", fundSource: "FUND-HLT-002" },
          { budgetLineId: "RL006", name: "Utilities and Internet", planned: 800, procurementCategory: "Operational Overhead", resourceName: "Office Utilities Package", unitType: "Month", quantity: 1, unitCost: 800, expectedDate: "2025-01-10", fundSource: "FUND-YOU-004" },
        ],
      },
    ],
  },
  {
    phaseId: "P2",
    phaseName: "Stage 2: Implementation (Mandatory)",
    tasks: [
      {
        taskId: "T004",
        taskName: "Coordinate Field Data Collection",
        lineItems: [
          { budgetLineId: "RL007", name: "Project Manager - Full Time", planned: 8000, procurementCategory: "Staff Labour", resourceName: "Senior Project Manager", unitType: "Month", quantity: 1, unitCost: 8000, expectedDate: "2025-05-01", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL008", name: "Projector & AV Equipment", planned: 3500, procurementCategory: "Internal Asset", resourceName: "Epson Projector EB-X51", unitType: "Unit", quantity: 1, unitCost: 3500, expectedDate: "2025-05-01", fundSource: "FUND-TEC-006" },
        ],
      },
      {
        taskId: "T005",
        taskName: "Conduct Stakeholder Engagement Sessions",
        lineItems: [
          { budgetLineId: "RL009", name: "Communications Officer", planned: 5500, procurementCategory: "Staff Labour", resourceName: "Comms & Outreach Lead", unitType: "Month", quantity: 1, unitCost: 5500, expectedDate: "2025-06-01", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL010", name: "Office Space Rental", planned: 2500, procurementCategory: "Operational Overhead", resourceName: "Regional Office - Accra", unitType: "Month", quantity: 1, unitCost: 2500, expectedDate: "2025-06-01", fundSource: "FUND-YOU-004" },
          { budgetLineId: "RL011", name: "Utilities and Internet", planned: 800, procurementCategory: "Operational Overhead", resourceName: "Office Utilities Package", unitType: "Month", quantity: 1, unitCost: 800, expectedDate: "2025-06-01", fundSource: "FUND-YOU-004" },
        ],
      },
    ],
  },
  {
    phaseId: "P3",
    phaseName: "Stage 3: Quality Assurance (Mandatory)",
    tasks: [
      {
        taskId: "T007",
        taskName: "Conduct Internal Peer Review of Draft",
        lineItems: [
          { budgetLineId: "RL012", name: "QA Lead", planned: 6500, procurementCategory: "Staff Labour", resourceName: "Senior QA Analyst", unitType: "Month", quantity: 1, unitCost: 6500, expectedDate: "2025-08-01", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL013", name: "IT Equipment - Laptops", planned: 2400, procurementCategory: "Internal Asset", resourceName: "Dell Latitude 5520", unitType: "Unit", quantity: 2, unitCost: 1200, expectedDate: "2025-07-01", fundSource: "FUND-TEC-006" },
        ],
      },
    ],
  },
  {
    phaseId: "P4",
    phaseName: "Stage 4: Production & Editorial (Mandatory)",
    tasks: [
      {
        taskId: "T009",
        taskName: "Design and Layout Report",
        lineItems: [
          { budgetLineId: "RL014", name: "Project Manager - Full Time", planned: 16000, procurementCategory: "Staff Labour", resourceName: "Senior Project Manager", unitType: "Month", quantity: 2, unitCost: 8000, expectedDate: "2026-01-15", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL015", name: "Editorial Staff", planned: 18000, procurementCategory: "Staff Labour", resourceName: "Editor (3 persons)", unitType: "Month", quantity: 4, unitCost: 4500, expectedDate: "2026-01-15", fundSource: "FUND-HLT-002" },
          { budgetLineId: "RL016", name: "Project Vehicle - 4x4 SUV", planned: 45000, procurementCategory: "Internal Asset", resourceName: "Toyota Land Cruiser", unitType: "Unit", quantity: 1, unitCost: 45000, expectedDate: "2025-12-01", fundSource: "FUND-ENV-005" },
          { budgetLineId: "RL017", name: "Utilities and Internet", planned: 1600, procurementCategory: "Operational Overhead", resourceName: "Office Utilities Package", unitType: "Month", quantity: 2, unitCost: 800, expectedDate: "2026-01-10", fundSource: "FUND-YOU-004" },
        ],
      },
    ],
  },
  {
    phaseId: "P5",
    phaseName: "Stage 5: Dissemination (Optional)",
    tasks: [
      {
        taskId: "T011",
        taskName: "Plan Distribution Channels",
        lineItems: [
          { budgetLineId: "RL018", name: "Data Analyst", planned: 13000, procurementCategory: "Staff Labour", resourceName: "Senior Data Analyst", unitType: "Month", quantity: 2, unitCost: 6500, expectedDate: "2026-03-01", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL019", name: "Office Space Rental", planned: 5000, procurementCategory: "Operational Overhead", resourceName: "Regional Office - Accra", unitType: "Month", quantity: 2, unitCost: 2500, expectedDate: "2026-03-01", fundSource: "FUND-YOU-004" },
        ],
      },
    ],
  },
  {
    phaseId: "P6",
    phaseName: "Stage 6: Reporting (Mandatory)",
    tasks: [
      {
        taskId: "T013",
        taskName: "Submit Final Technical Report",
        lineItems: [
          { budgetLineId: "RL020", name: "Project Manager - Full Time", planned: 8000, procurementCategory: "Staff Labour", resourceName: "Senior Project Manager", unitType: "Month", quantity: 1, unitCost: 8000, expectedDate: "2026-07-01", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL021", name: "Data Analyst", planned: 6500, procurementCategory: "Staff Labour", resourceName: "Senior Data Analyst", unitType: "Month", quantity: 1, unitCost: 6500, expectedDate: "2026-07-01", fundSource: "FUND-EDU-001" },
          { budgetLineId: "RL022", name: "Office Space Rental", planned: 2500, procurementCategory: "Operational Overhead", resourceName: "Regional Office - Accra", unitType: "Month", quantity: 1, unitCost: 2500, expectedDate: "2026-07-01", fundSource: "FUND-YOU-004" },
        ],
      },
    ],
  },
  {
    phaseId: "P7",
    phaseName: "Delivery Stage Complete (Checkpoint)",
    tasks: [
      {
        taskId: "T015",
        taskName: "Sign-off and Handover",
        lineItems: [
          { budgetLineId: "RL023", name: "Project Manager - Handover", planned: 4000, procurementCategory: "Staff Labour", resourceName: "Senior Project Manager", unitType: "Month", quantity: 0.5, unitCost: 8000, expectedDate: "2026-08-01", fundSource: "FUND-EDU-001" },
        ],
      },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCategoryBadge(category: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "Staff Labour": { bg: "bg-blue-100", text: "text-blue-700" },
    "Internal Asset": { bg: "bg-cyan-100", text: "text-cyan-700" },
    "Operational Overhead": { bg: "bg-violet-100", text: "text-violet-700" },
  };
  const style = map[category] || { bg: "bg-slate-100", text: "text-slate-600" };
  return (
    <Badge className={`${style.bg} ${style.text} hover:${style.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>
      {category}
    </Badge>
  );
}

interface ResourcePlanViewProps {
  onBack: () => void;
}

export function ResourcePlanView({ onBack }: ResourcePlanViewProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(["P1", "P2"]));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(["T001", "T004"]));

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleTask = (id: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Grand totals
  const grandPlanned = RESOURCE_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.reduce((s3, li) => s3 + li.planned, 0), 0), 0
  );

  const totalItems = RESOURCE_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.length, 0), 0
  );

  // Category summaries
  const staffTotal = RESOURCE_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.filter(li => li.procurementCategory === "Staff Labour").reduce((s3, li) => s3 + li.planned, 0), 0), 0
  );
  const assetTotal = RESOURCE_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.filter(li => li.procurementCategory === "Internal Asset").reduce((s3, li) => s3 + li.planned, 0), 0), 0
  );
  const overheadTotal = RESOURCE_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.filter(li => li.procurementCategory === "Operational Overhead").reduce((s3, li) => s3 + li.planned, 0), 0), 0
  );
  const staffCount = RESOURCE_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.filter(li => li.procurementCategory === "Staff Labour").length, 0), 0
  );
  const assetCount = RESOURCE_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.filter(li => li.procurementCategory === "Internal Asset").length, 0), 0
  );
  const overheadCount = RESOURCE_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.filter(li => li.procurementCategory === "Operational Overhead").length, 0), 0
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Resource Plan
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Internal Procurement Items (Staff, Assets & Overhead) | {totalItems} line items | Planned Total: <span className="font-semibold text-[#0B01D0]">{formatCurrency(grandPlanned)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-8 py-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-[12px] text-slate-600 mb-1">Staff Labour</p>
            <p className="text-xl font-semibold text-slate-900">{formatCurrency(staffTotal)}</p>
            <p className="text-[12px] text-slate-500 mt-1">{staffCount} positions</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-[12px] text-slate-600 mb-1">Internal Assets</p>
            <p className="text-xl font-semibold text-slate-900">{formatCurrency(assetTotal)}</p>
            <p className="text-[12px] text-slate-500 mt-1">{assetCount} assets</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-[12px] text-slate-600 mb-1">Operational Overhead</p>
            <p className="text-xl font-semibold text-slate-900">{formatCurrency(overheadTotal)}</p>
            <p className="text-[12px] text-slate-500 mt-1">{overheadCount} items</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-[24%]">Item</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Resource Name</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Unit Type</th>
                  <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Qty</th>
                  <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Unit Cost</th>
                  <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Planned Amount</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Expected Date</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Fund Source</th>
                </tr>
              </thead>
              <tbody>
                {RESOURCE_DATA.map(phase => {
                  const phasePlanned = phase.tasks.reduce((s, t) => s + t.lineItems.reduce((s2, li) => s2 + li.planned, 0), 0);
                  const isPhaseExpanded = expandedPhases.has(phase.phaseId);

                  return (
                    <PhaseRows
                      key={phase.phaseId}
                      phase={phase}
                      phasePlanned={phasePlanned}
                      isExpanded={isPhaseExpanded}
                      expandedTasks={expandedTasks}
                      onTogglePhase={() => togglePhase(phase.phaseId)}
                      onToggleTask={toggleTask}
                    />
                  );
                })}

                {/* Grand Total */}
                <tr className="bg-slate-100 border-t-2 border-slate-300">
                  <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">Grand Total</td>
                  <td className="px-4 py-3" colSpan={5}></td>
                  <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(grandPlanned)}</td>
                  <td className="px-4 py-3" colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Phase rows ─────────────────────────────────────────────────────────────

function PhaseRows({
  phase,
  phasePlanned,
  isExpanded,
  expandedTasks,
  onTogglePhase,
  onToggleTask,
}: {
  phase: ResourcePhase;
  phasePlanned: number;
  isExpanded: boolean;
  expandedTasks: Set<string>;
  onTogglePhase: () => void;
  onToggleTask: (id: string) => void;
}) {
  return (
    <>
      <tr className="bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={onTogglePhase}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown className="size-4 text-slate-500 shrink-0" /> : <ChevronRight className="size-4 text-slate-500 shrink-0" />}
            <span className="text-[12px] font-semibold text-slate-900">{phase.phaseName}</span>
          </div>
        </td>
        <td className="px-4 py-3" colSpan={5}></td>
        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(phasePlanned)}</td>
        <td className="px-4 py-3" colSpan={2}></td>
      </tr>

      {isExpanded && phase.tasks.map(task => {
        const taskPlanned = task.lineItems.reduce((s, li) => s + li.planned, 0);
        const isTaskExpanded = expandedTasks.has(task.taskId);

        return (
          <TaskRows
            key={task.taskId}
            task={task}
            taskPlanned={taskPlanned}
            isExpanded={isTaskExpanded}
            onToggle={() => onToggleTask(task.taskId)}
          />
        );
      })}
    </>
  );
}

// ─── Task rows ──────────────────────────────────────────────────────────────

function TaskRows({
  task,
  taskPlanned,
  isExpanded,
  onToggle,
}: {
  task: ResourceTask;
  taskPlanned: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-slate-100 cursor-pointer hover:bg-blue-50/30 transition-colors" onClick={onToggle}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 pl-6">
            {isExpanded ? <ChevronDown className="size-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="size-3.5 text-slate-400 shrink-0" />}
            <span className="text-[12px] font-medium text-slate-800">{task.taskId} — {task.taskName}</span>
          </div>
        </td>
        <td className="px-4 py-3" colSpan={5}></td>
        <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-700">{formatCurrency(taskPlanned)}</td>
        <td className="px-4 py-3" colSpan={2}></td>
      </tr>

      {isExpanded && task.lineItems.map(li => (
        <tr key={li.budgetLineId} className="border-b border-slate-50 bg-white hover:bg-slate-50/50">
          <td className="px-4 py-2.5">
            <div className="pl-14 flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">{li.budgetLineId}</span>
              <span className="text-[12px] text-slate-700">{li.name}</span>
            </div>
          </td>
          <td className="px-4 py-2.5">{getCategoryBadge(li.procurementCategory)}</td>
          <td className="px-4 py-2.5 text-[12px] text-slate-600">{li.resourceName}</td>
          <td className="px-4 py-2.5 text-[12px] text-slate-600">{li.unitType}</td>
          <td className="px-4 py-2.5 text-right text-[12px] text-slate-600">{li.quantity}</td>
          <td className="px-4 py-2.5 text-right text-[12px] text-slate-500">{formatCurrency(li.unitCost)}</td>
          <td className="px-4 py-2.5 text-right text-[12px] text-slate-500">{formatCurrency(li.planned)}</td>
          <td className="px-4 py-2.5 text-[12px] text-slate-600 whitespace-nowrap">{li.expectedDate}</td>
          <td className="px-4 py-2.5 text-[12px] text-slate-500">{li.fundSource}</td>
        </tr>
      ))}
    </>
  );
}