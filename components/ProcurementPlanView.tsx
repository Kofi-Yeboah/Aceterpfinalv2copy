import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";

// ─── Budget-aligned procurement data (same source as BudgetTreeTable) ──────

interface ProcurementLineItem {
  budgetLineId: string;
  name: string;
  planned: number;
  actual: number;
  procurementMethod: string;
  category: string;
  vendor: string | null;
  status: string;
  expectedDelivery: string;
}

interface ProcurementTask {
  taskId: string;
  taskName: string;
  lineItems: ProcurementLineItem[];
}

interface ProcurementPhase {
  phaseId: string;
  phaseName: string;
  tasks: ProcurementTask[];
}

const PROCUREMENT_DATA: ProcurementPhase[] = [
  {
    phaseId: "P1",
    phaseName: "Stage 1: Procurement & Contracting (Optional)",
    tasks: [
      {
        taskId: "T001",
        taskName: "Draft Request for Proposals (RFP)",
        lineItems: [
          { budgetLineId: "L001", name: "Consultant Fees - Survey Design", planned: 8000, actual: 8000, procurementMethod: "Single Source", category: "Consulting", vendor: "Dr. Kwesi Appiah", status: "Completed", expectedDelivery: "2025-02-28" },
          { budgetLineId: "L002", name: "Printing & Materials", planned: 1200, actual: 1050, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: "PrintWorks Ghana Ltd", status: "Completed", expectedDelivery: "2025-01-30" },
          { budgetLineId: "L003", name: "Stakeholder Workshop", planned: 3500, actual: 3500, procurementMethod: "Request for Quotation", category: "Services", vendor: "La Palm Royal Beach Hotel", status: "Completed", expectedDelivery: "2025-02-15" },
        ],
      },
      {
        taskId: "T002",
        taskName: "Evaluate Vendor Submissions",
        lineItems: [
          { budgetLineId: "L004", name: "External Reviewer Honoraria", planned: 4000, actual: 4000, procurementMethod: "Single Source", category: "Consulting", vendor: "Prof. Ama Benyiwa", status: "Completed", expectedDelivery: "2025-03-15" },
          { budgetLineId: "L005", name: "Review Meeting Logistics", planned: 1500, actual: 1200, procurementMethod: "Direct Purchase", category: "Services", vendor: "Accra Events Hub", status: "Completed", expectedDelivery: "2025-03-10" },
        ],
      },
      {
        taskId: "T003",
        taskName: "Finalize Service Agreements",
        lineItems: [
          { budgetLineId: "L006", name: "Research Assistant Stipends", planned: 6000, actual: 6000, procurementMethod: "Direct Purchase", category: "Services", vendor: "University of Ghana", status: "Completed", expectedDelivery: "2025-04-01" },
          { budgetLineId: "L007", name: "Database Subscriptions", planned: 2000, actual: 1800, procurementMethod: "Framework Agreement", category: "Services", vendor: "JSTOR / Elsevier", status: "Completed", expectedDelivery: "2025-01-15" },
          { budgetLineId: "L008", name: "Reference Materials", planned: 800, actual: 650, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: "Bookshop Ghana Ltd", status: "Completed", expectedDelivery: "2025-02-10" },
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
          { budgetLineId: "L009", name: "Venue & Catering", planned: 5000, actual: 4800, procurementMethod: "Request for Quotation", category: "Services", vendor: "Kempinski Hotel Gold Coast", status: "Completed", expectedDelivery: "2025-05-01" },
          { budgetLineId: "L010", name: "Audio-Visual Equipment Rental", planned: 2000, actual: 1950, procurementMethod: "Direct Purchase", category: "Services", vendor: "AV Solutions Accra", status: "Completed", expectedDelivery: "2025-05-01" },
          { budgetLineId: "L011", name: "Facilitator Fees", planned: 3000, actual: 3000, procurementMethod: "Single Source", category: "Consulting", vendor: "Nana Yaw Mensah", status: "Completed", expectedDelivery: "2025-05-01" },
        ],
      },
      {
        taskId: "T005",
        taskName: "Conduct Stakeholder Engagement Sessions",
        lineItems: [
          { budgetLineId: "L012", name: "Consultant Fees - Engagement", planned: 7000, actual: 5600, procurementMethod: "Competitive Bidding", category: "Consulting", vendor: "Ghana Research Associates", status: "PO Issued", expectedDelivery: "2025-07-15" },
          { budgetLineId: "L013", name: "Community Outreach Materials", planned: 3000, actual: 2100, procurementMethod: "Request for Quotation", category: "Goods/Equipment", vendor: "CreativeEdge Designs", status: "Delivered", expectedDelivery: "2025-06-30" },
          { budgetLineId: "L014", name: "Travel - Stakeholder Visits", planned: 4500, actual: 3200, procurementMethod: "Direct Purchase", category: "Services", vendor: null, status: "Requisition Raised", expectedDelivery: "2025-08-01" },
        ],
      },
      {
        taskId: "T009",
        taskName: "Procure IT Equipment",
        lineItems: [
          { budgetLineId: "L015", name: "Laptops (50x Dell Latitude)", planned: 47500, actual: 47500, procurementMethod: "Competitive Bidding", category: "Goods/Equipment", vendor: "Dell Inc. (via Telefonika Ghana)", status: "Delivered", expectedDelivery: "2025-06-15" },
          { budgetLineId: "L016", name: "Networking Equipment", planned: 3500, actual: 0, procurementMethod: "Request for Quotation", category: "Goods/Equipment", vendor: null, status: "RFQ Issued", expectedDelivery: "2025-09-01" },
          { budgetLineId: "L017", name: "Software Licences", planned: 8000, actual: 0, procurementMethod: "Framework Agreement", category: "Services", vendor: null, status: "Evaluation", expectedDelivery: "2025-09-15" },
        ],
      },
    ],
  },
  {
    phaseId: "P3",
    phaseName: "Stage 3: Quality Assurance (Mandatory)",
    tasks: [
      {
        taskId: "T006",
        taskName: "Conduct Internal Peer Review of Draft",
        lineItems: [
          { budgetLineId: "L018", name: "QA Reviewer Wages", planned: 12000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-01-15" },
          { budgetLineId: "L019", name: "Testing Tools & Subscriptions", planned: 5000, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-01-15" },
        ],
      },
    ],
  },
  {
    phaseId: "P4",
    phaseName: "Stage 4: Production & Editorial (Mandatory)",
    tasks: [
      {
        taskId: "T007",
        taskName: "Design and Layout Report",
        lineItems: [
          { budgetLineId: "L020", name: "Graphic Design Services", planned: 6000, actual: 0, procurementMethod: "Single Source", category: "Consulting", vendor: null, status: "Not Started", expectedDelivery: "2026-03-01" },
          { budgetLineId: "L021", name: "Editorial Review Services", planned: 4000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-04-01" },
        ],
      },
    ],
  },
  {
    phaseId: "P5",
    phaseName: "Stage 5: Dissemination (Optional)",
    tasks: [
      {
        taskId: "T010",
        taskName: "Plan Distribution Channels",
        lineItems: [
          { budgetLineId: "L022", name: "Distribution Platform Fees", planned: 3500, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-05-01" },
        ],
      },
    ],
  },
  {
    phaseId: "P6",
    phaseName: "Stage 6: Reporting (Mandatory)",
    tasks: [
      {
        taskId: "T008",
        taskName: "Submit Final Technical Report",
        lineItems: [
          { budgetLineId: "L023", name: "Report Design & Layout", planned: 3000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-07-01" },
          { budgetLineId: "L024", name: "Printing & Distribution", planned: 2000, actual: 0, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: null, status: "Not Started", expectedDelivery: "2026-08-01" },
          { budgetLineId: "L025", name: "Final Audit Fees", planned: 4500, actual: 0, procurementMethod: "Single Source", category: "Consulting", vendor: null, status: "Not Started", expectedDelivery: "2026-08-15" },
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
          { budgetLineId: "L026", name: "Final Review & Sign-off Meeting", planned: 1500, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-09-01" },
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

function getMethodBadge(method: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "Direct Purchase": { bg: "bg-slate-100", text: "text-slate-700" },
    "Competitive Bidding": { bg: "bg-blue-100", text: "text-blue-700" },
    "Request for Quotation": { bg: "bg-indigo-100", text: "text-indigo-700" },
    "Single Source": { bg: "bg-amber-100", text: "text-amber-700" },
    "Framework Agreement": { bg: "bg-purple-100", text: "text-purple-700" },
  };
  const style = map[method] || { bg: "bg-slate-100", text: "text-slate-600" };
  return (
    <Badge className={`${style.bg} ${style.text} hover:${style.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>
      {method}
    </Badge>
  );
}

interface ProcurementPlanViewProps {
  onBack: () => void;
}

export function ProcurementPlanView({ onBack }: ProcurementPlanViewProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(["P1", "P2"]));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(["T001", "T004", "T009"]));

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
  const grandPlanned = PROCUREMENT_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.reduce((s3, li) => s3 + li.planned, 0), 0), 0
  );

  const totalItems = PROCUREMENT_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.length, 0), 0
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
                Procurement Plan
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Budget-Aligned Procurement Items | {totalItems} line items | Planned Total: <span className="font-semibold text-[#0B01D0]">{formatCurrency(grandPlanned)}</span>
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

      {/* Content */}
      <div className="px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-[28%]">Item</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
                  <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Planned Amount</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Method</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Vendor</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Expected Date</th>
                </tr>
              </thead>
              <tbody>
                {PROCUREMENT_DATA.map(phase => {
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
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(grandPlanned)}</td>
                  <td className="px-4 py-3" colSpan={3}></td>
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
  phase: ProcurementPhase;
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
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(phasePlanned)}</td>
        <td className="px-4 py-3" colSpan={3}></td>
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
  task: ProcurementTask;
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
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-700">{formatCurrency(taskPlanned)}</td>
        <td className="px-4 py-3" colSpan={3}></td>
      </tr>

      {isExpanded && task.lineItems.map(li => {
        return (
          <tr key={li.budgetLineId} className="border-b border-slate-50 bg-white hover:bg-slate-50/50">
            <td className="px-4 py-2.5">
              <div className="pl-14 flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">{li.budgetLineId}</span>
                <span className="text-[12px] text-slate-700">{li.name}</span>
              </div>
            </td>
            <td className="px-4 py-2.5">
              <Badge className={`text-[11px] font-medium shadow-none border-0 whitespace-nowrap ${
                li.category === "Goods/Equipment" ? "bg-cyan-100 text-cyan-700 hover:bg-cyan-100" :
                li.category === "Services" ? "bg-violet-100 text-violet-700 hover:bg-violet-100" :
                li.category === "Consulting" ? "bg-rose-100 text-rose-700 hover:bg-rose-100" :
                "bg-orange-100 text-orange-700 hover:bg-orange-100"
              }`}>
                {li.category}
              </Badge>
            </td>
            <td className="px-4 py-2.5 text-right text-[12px] text-slate-500">{formatCurrency(li.planned)}</td>
            <td className="px-4 py-2.5">{getMethodBadge(li.procurementMethod)}</td>
            <td className="px-4 py-2.5 text-[12px] text-slate-600">{li.vendor || "—"}</td>
            <td className="px-4 py-2.5 text-[12px] text-slate-600 whitespace-nowrap">{li.expectedDelivery}</td>
          </tr>
        );
      })}
    </>
  );
}