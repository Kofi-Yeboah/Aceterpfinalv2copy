import { Fragment, useState, useEffect, useMemo } from "react";
import {
  ArrowLeft, ChevronDown, ChevronRight, Plus, X, Edit2, CheckCircle, Clock, AlertCircle,
  AlertTriangle, FileText, History, Download, Send, XCircle, ShieldCheck, CalendarDays,
  Info, FileSpreadsheet, Printer, GitBranch, Wallet,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  getProcurementPlanItems,
  addProcurementPlanItem,
  updateProcurementPlanItem,
  submitPlanItemForReview,
  reviewPlanItemProcurement,
  reviewPlanItemFinance,
  rejectPlanItem,
  requestPlanItemChange,
  approvePlanItemChange,
  rejectPlanItemChange,
  detectOverduePlanItems,
  subscribe,
  type ProcurementPlanItem,
  type PlanItemChange,
} from "../lib/procurementStore";
import {
  PROCUREMENT_METHODS,
  METHOD_THRESHOLDS,
  formatBand,
  suggestProcurementMethod,
  validateMethodAgainstThreshold,
  canonicalMethod,
} from "../lib/procurementThresholds";
import {
  can,
  denialReason,
  getCurrentUser,
  subscribe as subscribeCurrentUser,
  type AppUser,
} from "../lib/currentUser";
import { exportToExcel, exportToPDF, exportToCSV, type ExportColumn } from "../lib/exportUtils";

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

// The plan-item form links back into this same dataset rather than accepting free
// text, so the WBS tab and the plan items describe one budget, not two.
interface SelectOption {
  value: string;
  label: string;
  group: string;
}

const BUDGET_LINE_OPTIONS: SelectOption[] = PROCUREMENT_DATA.flatMap((phase) =>
  phase.tasks.flatMap((task) =>
    task.lineItems.map((li) => ({
      value: li.budgetLineId,
      label: `${li.budgetLineId} — ${li.name} (${formatCurrency(li.planned)})`,
      group: `${task.taskId} — ${task.taskName}`,
    }))
  )
);

const WORK_PLAN_OPTIONS: SelectOption[] = PROCUREMENT_DATA.flatMap((phase) =>
  phase.tasks.map((task) => ({
    value: task.taskId,
    label: `${task.taskId} — ${task.taskName}`,
    group: phase.phaseName,
  }))
);

function groupOptions(options: SelectOption[]): { group: string; items: SelectOption[] }[] {
  const groups: { group: string; items: SelectOption[] }[] = [];
  options.forEach((opt) => {
    const existing = groups.find((g) => g.group === opt.group);
    if (existing) existing.items.push(opt);
    else groups.push({ group: opt.group, items: [opt] });
  });
  return groups;
}

const BUDGET_LINE_PLANNED = new Map(
  PROCUREMENT_DATA.flatMap((p) => p.tasks.flatMap((t) => t.lineItems.map((li) => [li.budgetLineId, li.planned] as const)))
);

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const todayISO = () => new Date().toISOString().split("T")[0];

const TERMINAL_STATUSES: ProcurementPlanItem["status"][] = ["Completed", "Contracted", "Awarded"];

function isOverdue(item: ProcurementPlanItem): boolean {
  if (item.approvalStatus !== "Approved") return false;
  if (TERMINAL_STATUSES.includes(item.status)) return false;
  return item.completionDate < todayISO();
}

function daysLate(item: ProcurementPlanItem): number {
  return Math.max(
    0,
    Math.round((new Date(todayISO()).getTime() - new Date(item.completionDate).getTime()) / 86_400_000)
  );
}

function getMethodBadge(method: string) {
  const map: Record<string, { bg: string; text: string }> = {
    // Canonical four
    "Direct Selection": { bg: "bg-amber-100", text: "text-amber-700" },
    "Request for Quotation": { bg: "bg-indigo-100", text: "text-indigo-700" },
    "Limited Competition": { bg: "bg-purple-100", text: "text-purple-700" },
    "Open Competition": { bg: "bg-blue-100", text: "text-blue-700" },
    // Legacy vocabulary still present in the budget dataset
    "Direct Purchase": { bg: "bg-slate-100", text: "text-slate-700" },
    "Competitive Bidding": { bg: "bg-blue-100", text: "text-blue-700" },
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

// ─── Category / Status / Approval badge helpers for plan items ──────────────

function getCategoryBadge(cat: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Goods: { bg: "bg-cyan-100", text: "text-cyan-700" },
    Services: { bg: "bg-violet-100", text: "text-violet-700" },
    Works: { bg: "bg-orange-100", text: "text-orange-700" },
    Consultancy: { bg: "bg-rose-100", text: "text-rose-700" },
  };
  const s = map[cat] || { bg: "bg-slate-100", text: "text-slate-600" };
  return <Badge className={`${s.bg} ${s.text} hover:${s.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>{cat}</Badge>;
}

function getStatusBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "Not Started": { bg: "bg-slate-100", text: "text-slate-600" },
    "In Progress": { bg: "bg-blue-100", text: "text-blue-700" },
    "Under Evaluation": { bg: "bg-purple-100", text: "text-purple-700" },
    Awarded: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Contracted: { bg: "bg-green-100", text: "text-green-700" },
    Completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Delayed: { bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[status] || { bg: "bg-slate-100", text: "text-slate-600" };
  return <Badge className={`${s.bg} ${s.text} hover:${s.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>{status}</Badge>;
}

function getApprovalBadge(approval: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Draft: { bg: "bg-slate-100", text: "text-slate-600" },
    "Pending Procurement Review": { bg: "bg-amber-100", text: "text-amber-700" },
    "Pending Finance Review": { bg: "bg-orange-100", text: "text-orange-700" },
    Approved: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Rejected: { bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[approval] || { bg: "bg-slate-100", text: "text-slate-600" };
  return <Badge className={`${s.bg} ${s.text} hover:${s.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>{approval}</Badge>;
}

// ─── Constants for form selects ─────────────────────────────────────────────

const CATEGORIES = ["Goods", "Services", "Works", "Consultancy"] as const;
const FUNDING_SOURCES = ["TAP", "ATTP", "Gates Foundation", "World Bank", "AfDB", "Government of Ghana", "Internal"] as const;
const PLAN_STATUSES: ProcurementPlanItem["status"][] = [
  "Not Started", "In Progress", "Under Evaluation", "Awarded", "Contracted", "Completed", "Delayed",
];
const DEPARTMENTS = ["IT", "Programs", "Operations", "Finance", "HR", "Admin", "M&E"];

const FIELD_LABELS: Record<string, string> = {
  activityDescription: "Activity description",
  category: "Category",
  estimatedValue: "Estimated value",
  fundingSource: "Funding source",
  procurementMethod: "Procurement method",
  methodDeviationJustification: "Method deviation justification",
  initiationDate: "Initiation date",
  awardDate: "Award date",
  completionDate: "Completion date",
  responsiblePerson: "Responsible person",
  department: "Department",
  status: "Status",
  linkedBudgetLine: "Linked budget line",
  linkedWorkPlan: "Linked work plan",
};

// ─── Shared plan form model, validation and threshold guidance ──────────────

interface PlanFormState {
  activityDescription: string;
  category: ProcurementPlanItem["category"];
  estimatedValue: string;
  fundingSource: string;
  procurementMethod: string;
  methodDeviationJustification: string;
  initiationDate: string;
  awardDate: string;
  completionDate: string;
  responsiblePerson: string;
  department: string;
  status: ProcurementPlanItem["status"];
  linkedBudgetLine: string;
  linkedWorkPlan: string;
}

type PlanUpdatable = Pick<
  ProcurementPlanItem,
  | "activityDescription" | "category" | "estimatedValue" | "fundingSource" | "procurementMethod"
  | "initiationDate" | "awardDate" | "completionDate" | "responsiblePerson" | "department" | "status"
> & {
  linkedBudgetLine?: string;
  linkedWorkPlan?: string;
  methodDeviationJustification?: string;
};

const emptyPlanForm = (): PlanFormState => ({
  activityDescription: "",
  category: "Goods",
  estimatedValue: "",
  fundingSource: "TAP",
  // A canonical method, so the select never renders blank on first paint.
  procurementMethod: "Request for Quotation",
  methodDeviationJustification: "",
  initiationDate: "",
  awardDate: "",
  completionDate: "",
  responsiblePerson: "",
  department: "Programs",
  status: "Not Started",
  linkedBudgetLine: "",
  linkedWorkPlan: "",
});

const formFromItem = (item: ProcurementPlanItem): PlanFormState => ({
  activityDescription: item.activityDescription,
  category: item.category,
  estimatedValue: String(item.estimatedValue),
  fundingSource: item.fundingSource,
  procurementMethod: canonicalMethod(item.procurementMethod),
  methodDeviationJustification: item.methodDeviationJustification || "",
  initiationDate: item.initiationDate,
  awardDate: item.awardDate,
  completionDate: item.completionDate,
  responsiblePerson: item.responsiblePerson,
  department: item.department,
  status: item.status,
  linkedBudgetLine: item.linkedBudgetLine || "",
  linkedWorkPlan: item.linkedWorkPlan || "",
});

function parsedValue(form: PlanFormState): number {
  const n = Number(form.estimatedValue);
  return Number.isFinite(n) ? n : 0;
}

function methodCheckFor(form: PlanFormState) {
  const value = parsedValue(form);
  if (value <= 0) return null;
  return validateMethodAgainstThreshold(form.procurementMethod, value);
}

function validatePlanForm(form: PlanFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.activityDescription.trim()) {
    errors.activityDescription = "An activity description is required.";
  } else if (form.activityDescription.trim().length < 8) {
    errors.activityDescription = "Describe the activity in at least 8 characters so it is identifiable on the plan.";
  }

  const value = Number(form.estimatedValue);
  if (!form.estimatedValue.trim()) {
    errors.estimatedValue = "An estimated value is required — it determines the procurement method.";
  } else if (!Number.isFinite(value) || value <= 0) {
    errors.estimatedValue = "Enter a positive amount in USD.";
  }

  if (!form.responsiblePerson.trim()) errors.responsiblePerson = "Name the person accountable for this activity.";
  if (!form.initiationDate) errors.initiationDate = "An initiation date is required.";
  if (!form.awardDate) errors.awardDate = "An award date is required.";
  if (!form.completionDate) errors.completionDate = "A completion date is required.";

  if (form.initiationDate && form.awardDate && form.awardDate < form.initiationDate) {
    errors.awardDate = "The award date cannot fall before initiation.";
  }
  if (form.awardDate && form.completionDate && form.completionDate < form.awardDate) {
    errors.completionDate = "The completion date cannot fall before award.";
  }

  const check = methodCheckFor(form);
  if (check && !check.compliant && !form.methodDeviationJustification.trim()) {
    errors.methodDeviationJustification =
      "The chosen method departs from its value threshold — record why before saving.";
  }

  return errors;
}

function toUpdatable(form: PlanFormState): PlanUpdatable {
  return {
    activityDescription: form.activityDescription.trim(),
    category: form.category,
    estimatedValue: Number(form.estimatedValue),
    fundingSource: form.fundingSource,
    procurementMethod: form.procurementMethod,
    initiationDate: form.initiationDate,
    awardDate: form.awardDate,
    completionDate: form.completionDate,
    responsiblePerson: form.responsiblePerson.trim(),
    department: form.department,
    status: form.status,
    linkedBudgetLine: form.linkedBudgetLine || undefined,
    linkedWorkPlan: form.linkedWorkPlan || undefined,
    methodDeviationJustification: form.methodDeviationJustification.trim() || undefined,
  };
}

const labelCls = "block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1";
const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/30 focus:border-[#0B01D0]";
const inputErrCls = "w-full border border-red-400 bg-red-50/40 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-start gap-1 mt-1 text-[11px] text-red-600">
      <AlertCircle className="size-3 mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

/** Threshold bands, shown as the reference the requirement asks for. */
function ThresholdReference({ activeMethod }: { activeMethod?: string }) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5">
        <Info className="size-3.5 text-slate-500" />
        <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Threshold reference</span>
      </div>
      <table className="w-full">
        <tbody>
          {METHOD_THRESHOLDS.map((t) => (
            <tr
              key={t.method}
              className={`border-t border-slate-100 first:border-t-0 ${
                activeMethod && canonicalMethod(activeMethod) === t.method ? "bg-indigo-50/70" : ""
              }`}
            >
              <td className="px-3 py-1.5 text-[11px] font-medium text-slate-800 whitespace-nowrap">{t.method}</td>
              <td className="px-3 py-1.5 text-[11px] text-slate-600 whitespace-nowrap">{formatBand(t)}</td>
              <td className="px-3 py-1.5 text-[11px] text-slate-500">{t.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * The estimated value drives a suggestion; the method stays editable so
 * Procurement can override, and any override is surfaced and justified.
 */
function MethodGuidance({
  form,
  error,
  onJustificationChange,
}: {
  form: PlanFormState;
  error?: string;
  onJustificationChange: (value: string) => void;
}) {
  const check = methodCheckFor(form);
  if (!check) {
    return (
      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <Info className="size-3.5" /> Enter an estimated value and the system will suggest a procurement method.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {check.compliant ? (
        <p className="text-[11px] text-emerald-700 flex items-start gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle className="size-3.5 mt-0.5 shrink-0" />
          <span>
            <span className="font-semibold">{check.suggested}</span> matches the threshold for{" "}
            {formatCurrency(parsedValue(form))}.
            {check.requiresJustification && " Policy expects a written justification for this method — record it below."}
          </span>
        </p>
      ) : (
        <p className="text-[11px] text-amber-800 flex items-start gap-1.5 bg-amber-50 border border-amber-300 rounded-lg px-3 py-2">
          <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
          <span>{check.message}</span>
        </p>
      )}
      <div>
        <label className={labelCls}>
          Method Deviation Justification{" "}
          {check.compliant ? (
            <span className="text-slate-400 font-normal normal-case">(optional)</span>
          ) : (
            <span className="text-red-500">*</span>
          )}
        </label>
        <textarea
          rows={2}
          className={error ? inputErrCls : inputCls}
          value={form.methodDeviationJustification}
          onChange={(e) => onJustificationChange(e.target.value)}
          placeholder={`Why ${canonicalMethod(form.procurementMethod)} rather than ${check.suggested}?`}
        />
        <FieldError message={error} />
      </div>
    </div>
  );
}

// ─── Linked budget line / work plan selects ─────────────────────────────────

function LinkedSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder: string;
}) {
  const known = options.some((o) => o.value === value);
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {value && !known && <option value={value}>{value} (existing link)</option>}
      {groupOptions(options).map((g) => (
        <optgroup key={g.group} label={g.group}>
          {g.items.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

// ─── Plan form fields, shared by add and edit ───────────────────────────────

function PlanFormFields({
  form,
  setForm,
  errors,
  showStatus,
  methodAlreadyOverridden,
}: {
  form: PlanFormState;
  setForm: (updater: (f: PlanFormState) => PlanFormState) => void;
  errors: Record<string, string>;
  showStatus?: boolean;
  /** An existing deliberate override must not be silently re-suggested away. */
  methodAlreadyOverridden?: boolean;
}) {
  // Follow the suggestion while the user has not deliberately picked a method.
  const [methodTouched, setMethodTouched] = useState(Boolean(methodAlreadyOverridden));

  const onValueChange = (raw: string) => {
    setForm((f) => {
      const numeric = Number(raw);
      const next = { ...f, estimatedValue: raw };
      if (!methodTouched && raw.trim() && Number.isFinite(numeric) && numeric > 0) {
        next.procurementMethod = suggestProcurementMethod(numeric);
      }
      return next;
    });
  };

  return (
    <>
      <div>
        <label className={labelCls}>Activity Description <span className="text-red-500">*</span></label>
        <input
          className={errors.activityDescription ? inputErrCls : inputCls}
          value={form.activityDescription}
          onChange={(e) => setForm((f) => ({ ...f, activityDescription: e.target.value }))}
          placeholder="Describe the procurement activity..."
        />
        <FieldError message={errors.activityDescription} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category <span className="text-red-500">*</span></label>
          <select
            className={inputCls}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProcurementPlanItem["category"] }))}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Estimated Value (USD) <span className="text-red-500">*</span></label>
          <input
            type="number"
            min={0}
            className={errors.estimatedValue ? inputErrCls : inputCls}
            value={form.estimatedValue}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="0"
          />
          <FieldError message={errors.estimatedValue} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Funding Source <span className="text-red-500">*</span></label>
          <select
            className={inputCls}
            value={form.fundingSource}
            onChange={(e) => setForm((f) => ({ ...f, fundingSource: e.target.value }))}
          >
            {FUNDING_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>
            Procurement Method <span className="text-red-500">*</span>
            <span className="ml-1 text-slate-400 font-normal normal-case">suggested from value, override allowed</span>
          </label>
          <select
            className={inputCls}
            value={form.procurementMethod}
            onChange={(e) => {
              setMethodTouched(true);
              setForm((f) => ({ ...f, procurementMethod: e.target.value }));
            }}
          >
            {PROCUREMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <MethodGuidance
        form={form}
        error={errors.methodDeviationJustification}
        onJustificationChange={(v) => setForm((f) => ({ ...f, methodDeviationJustification: v }))}
      />

      <ThresholdReference activeMethod={form.procurementMethod} />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Initiation Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className={errors.initiationDate ? inputErrCls : inputCls}
            value={form.initiationDate}
            onChange={(e) => setForm((f) => ({ ...f, initiationDate: e.target.value }))}
          />
          <FieldError message={errors.initiationDate} />
        </div>
        <div>
          <label className={labelCls}>Award Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className={errors.awardDate ? inputErrCls : inputCls}
            value={form.awardDate}
            onChange={(e) => setForm((f) => ({ ...f, awardDate: e.target.value }))}
          />
          <FieldError message={errors.awardDate} />
        </div>
        <div>
          <label className={labelCls}>Completion Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className={errors.completionDate ? inputErrCls : inputCls}
            value={form.completionDate}
            onChange={(e) => setForm((f) => ({ ...f, completionDate: e.target.value }))}
          />
          <FieldError message={errors.completionDate} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Responsible Person <span className="text-red-500">*</span></label>
          <input
            className={errors.responsiblePerson ? inputErrCls : inputCls}
            value={form.responsiblePerson}
            onChange={(e) => setForm((f) => ({ ...f, responsiblePerson: e.target.value }))}
            placeholder="Full name"
          />
          <FieldError message={errors.responsiblePerson} />
        </div>
        <div>
          <label className={labelCls}>Department <span className="text-red-500">*</span></label>
          <select
            className={inputCls}
            value={form.department}
            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
          >
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Linked Budget Line</label>
          <LinkedSelect
            value={form.linkedBudgetLine}
            onChange={(v) => setForm((f) => ({ ...f, linkedBudgetLine: v }))}
            options={BUDGET_LINE_OPTIONS}
            placeholder="Not linked to a budget line"
          />
        </div>
        <div>
          <label className={labelCls}>Linked Work Plan</label>
          <LinkedSelect
            value={form.linkedWorkPlan}
            onChange={(v) => setForm((f) => ({ ...f, linkedWorkPlan: v }))}
            options={WORK_PLAN_OPTIONS}
            placeholder="Not linked to a work plan task"
          />
        </div>
      </div>

      {showStatus && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Execution Status</label>
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProcurementPlanItem["status"] }))}
            >
              {PLAN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Add Plan Item Modal ────────────────────────────────────────────────────

interface AddPlanItemModalProps {
  open: boolean;
  onClose: () => void;
  user: AppUser;
}

function AddPlanItemModal({ open, onClose, user }: AddPlanItemModalProps) {
  const [form, setForm] = useState<PlanFormState>(emptyPlanForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setForm(emptyPlanForm());
    setErrors({});
  };

  const submit = (thenSubmitForReview: boolean) => {
    const found = validatePlanForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = toUpdatable(form);
    const created = addProcurementPlanItem({
      activityDescription: payload.activityDescription,
      category: payload.category,
      estimatedValue: payload.estimatedValue,
      fundingSource: payload.fundingSource,
      procurementMethod: payload.procurementMethod,
      initiationDate: payload.initiationDate,
      awardDate: payload.awardDate,
      completionDate: payload.completionDate,
      responsiblePerson: payload.responsiblePerson,
      department: payload.department,
      status: "Not Started",
      approvalStatus: "Draft",
      linkedBudgetLine: payload.linkedBudgetLine,
      linkedWorkPlan: payload.linkedWorkPlan,
      methodDeviationJustification: payload.methodDeviationJustification,
    });

    if (thenSubmitForReview) submitPlanItemForReview(created.id, user.name);

    reset();
    onClose();
  };

  if (!open) return null;

  const canSubmitForReview = can("plan.submitForReview");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add Plan Item</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Saved as a draft. Procurement and Finance must both clear it before it appears on the approved plan.
            </p>
          </div>
          <button onClick={() => { reset(); onClose(); }} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        {/* Form body */}
        <div className="px-6 py-5 space-y-4">
          {Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[12px] text-red-700">
                {Object.keys(errors).length} field{Object.keys(errors).length === 1 ? "" : "s"} need attention before this
                item can be saved.
              </p>
            </div>
          )}
          <PlanFormFields form={form} setForm={setForm} errors={errors} />
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
          <button onClick={() => { reset(); onClose(); }} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
          <button onClick={() => submit(false)} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Save as Draft</button>
          <button
            onClick={() => submit(true)}
            disabled={!canSubmitForReview}
            title={canSubmitForReview ? "Save and route to Procurement review" : denialReason("plan.submitForReview")}
            className="px-5 py-2 rounded-lg text-sm text-white font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0B01D0" }}
          >
            <Send className="size-3.5" /> Save &amp; Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review trail ───────────────────────────────────────────────────────────

function stepTone(status: string) {
  if (status === "Approved") return { dot: "bg-emerald-500", text: "text-emerald-700", chip: "bg-emerald-50 border-emerald-200" };
  if (status === "Rejected") return { dot: "bg-red-500", text: "text-red-700", chip: "bg-red-50 border-red-200" };
  if (status === "Pending") return { dot: "bg-amber-500", text: "text-amber-700", chip: "bg-amber-50 border-amber-200" };
  return { dot: "bg-slate-300", text: "text-slate-500", chip: "bg-slate-50 border-slate-200" };
}

function ReviewTrail({ item }: { item: ProcurementPlanItem }) {
  const wasApproved = item.approvalStatus === "Approved";
  const submitted = item.submittedBy ? "Approved" : wasApproved ? "Approved" : "Pending";
  const procurement = item.procurementReview ?? (wasApproved ? "Approved" : item.approvalStatus === "Draft" ? "N/A" : "Pending");
  const finance = item.financeReview ?? (wasApproved ? "Approved" : "N/A");

  const steps = [
    { label: "Submitted for review", status: submitted, by: item.submittedBy, date: item.submittedDate },
    { label: "Procurement compliance review", status: procurement, by: item.procurementReviewedBy, date: undefined as string | undefined },
    { label: "Finance budget verification", status: finance, by: item.financeReviewedBy, date: undefined as string | undefined },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="size-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900">Compliance Review Trail</h3>
      </div>
      <div className="space-y-2">
        {steps.map((s) => {
          const tone = stepTone(s.status);
          return (
            <div key={s.label} className={`flex items-center gap-3 border rounded-lg px-3 py-2 ${tone.chip}`}>
              <span className={`size-2 rounded-full shrink-0 ${tone.dot}`} />
              <span className="text-[12px] font-medium text-slate-800 flex-1">{s.label}</span>
              <span className="text-[11px] text-slate-500">
                {s.by ? `${s.by}${s.date ? ` · ${s.date}` : ""}` : "—"}
              </span>
              <span className={`text-[11px] font-semibold ${tone.text}`}>{s.status}</span>
            </div>
          );
        })}
      </div>
      {item.rejectionReason && item.approvalStatus === "Rejected" && (
        <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <XCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-red-700 uppercase tracking-wide">Rejection reason</p>
            <p className="text-[12px] text-red-800 mt-0.5">{item.rejectionReason}</p>
          </div>
        </div>
      )}
      {item.methodDeviationJustification && (
        <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">Method deviation justification</p>
            <p className="text-[12px] text-amber-800 mt-0.5">{item.methodDeviationJustification}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pending amendment panel ────────────────────────────────────────────────

function PendingAmendmentPanel({
  item,
  user,
  onError,
}: {
  item: ProcurementPlanItem;
  user: AppUser;
  onError: (msg: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const change = item.pendingChange;
  if (!change) return null;

  const stage: "Procurement" | "Finance" = change.status === "Pending Procurement Review" ? "Procurement" : "Finance";
  const capability = stage === "Procurement" ? "plan.reviewProcurement" : "plan.reviewFinance";
  const allowed = can(capability);

  const approve = () => {
    const res = approvePlanItemChange(item.id, user.name, stage);
    if (!res.ok) onError(res.error ?? "The amendment could not be approved.");
  };

  const reject = () => {
    if (!rejectReason.trim()) {
      onError("A reason is required when rejecting an amendment.");
      return;
    }
    const res = rejectPlanItemChange(item.id, user.name, rejectReason);
    if (!res.ok) onError(res.error ?? "The amendment could not be rejected.");
    else {
      setRejectReason("");
      setRejecting(false);
    }
  };

  return (
    <div className="border border-amber-300 bg-amber-50/60 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-amber-100/70 border-b border-amber-200 flex items-center gap-2">
        <GitBranch className="size-4 text-amber-700" />
        <h3 className="text-sm font-semibold text-amber-900 flex-1">Amendment awaiting approval</h3>
        <Badge className="bg-amber-200 text-amber-900 hover:bg-amber-200 text-[11px] font-medium shadow-none border-0">
          {change.status}
        </Badge>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <p className="text-[11px] text-slate-600">Requested by <span className="font-medium text-slate-800">{change.requestedBy}</span></p>
          <p className="text-[11px] text-slate-600">Requested on <span className="font-medium text-slate-800">{change.requestedDate}</span></p>
          {change.procurementApprovedBy && (
            <p className="text-[11px] text-slate-600 col-span-2">
              Procurement approved by <span className="font-medium text-slate-800">{change.procurementApprovedBy}</span>
            </p>
          )}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Reason</p>
          <p className="text-[12px] text-slate-800">{change.reason}</p>
        </div>
        <div className="border border-amber-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 py-1.5 text-[11px] font-semibold text-slate-600">Field</th>
                <th className="text-left px-3 py-1.5 text-[11px] font-semibold text-slate-600">Current</th>
                <th className="text-left px-3 py-1.5 text-[11px] font-semibold text-slate-600">Proposed</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(change.updates).map(([field, value]) => (
                <tr key={field} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 text-[11px] font-medium text-slate-700">{FIELD_LABELS[field] ?? field}</td>
                  <td className="px-3 py-1.5 text-[11px] text-red-600">
                    {String((item as unknown as Record<string, unknown>)[field] ?? "—")}
                  </td>
                  <td className="px-3 py-1.5 text-[11px] text-emerald-700">{String(value ?? "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rejecting && (
          <div>
            <label className={labelCls}>Reason for rejecting this amendment <span className="text-red-500">*</span></label>
            <textarea
              rows={2}
              className={inputCls}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain what must change before this amendment can be accepted..."
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={approve}
            disabled={!allowed}
            title={allowed ? `Approve as ${stage}` : denialReason(capability)}
            className="px-3 py-1.5 rounded-lg text-[12px] text-white font-medium bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="size-3.5" /> Approve as {stage}
          </button>
          {rejecting ? (
            <>
              <button
                onClick={reject}
                className="px-3 py-1.5 rounded-lg text-[12px] text-white font-medium bg-red-600 hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => { setRejecting(false); setRejectReason(""); }}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setRejecting(true)}
              disabled={!allowed}
              title={allowed ? "Reject this amendment" : denialReason(capability)}
              className="px-3 py-1.5 border border-red-300 rounded-lg text-[12px] text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="size-3.5" /> Reject Amendment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Plan Item Detail / Edit Panel ──────────────────────────────────────────

interface PlanItemDetailProps {
  item: ProcurementPlanItem;
  user: AppUser;
  onClose: () => void;
}

function PlanItemDetail({ item, user, onClose }: PlanItemDetailProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PlanFormState>(() => formFromItem(item));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amendmentReason, setAmendmentReason] = useState("");
  const [banner, setBanner] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [rejectStage, setRejectStage] = useState<"Procurement" | "Finance" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [reviewComments, setReviewComments] = useState("");

  const isApproved = item.approvalStatus === "Approved";
  const canEdit = can("plan.edit");
  const canSubmit = can("plan.submitForReview");
  const canReviewProc = can("plan.reviewProcurement");
  const canReviewFin = can("plan.reviewFinance");

  const startEditing = () => {
    setForm(formFromItem(item));
    setErrors({});
    setAmendmentReason("");
    setBanner(null);
    setEditing(true);
  };

  const handleSave = () => {
    const found = validatePlanForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setBanner({ tone: "error", text: "Correct the highlighted fields before saving." });
      return;
    }

    const next = toUpdatable(form);

    if (!isApproved) {
      // Not yet live on the plan, so the edit applies directly.
      updateProcurementPlanItem(item.id, next, user.name);
      setEditing(false);
      setBanner({ tone: "success", text: "Changes saved." });
      return;
    }

    // Live plan item — route through the amendment workflow.
    const changed: Partial<PlanUpdatable> = {};
    (Object.keys(next) as (keyof PlanUpdatable)[]).forEach((key) => {
      const current = item[key];
      if (String(current ?? "") !== String(next[key] ?? "")) {
        (changed as Record<string, unknown>)[key] = next[key];
      }
    });

    if (Object.keys(changed).length === 0) {
      setBanner({ tone: "error", text: "Nothing has changed — there is no amendment to submit." });
      return;
    }
    if (!amendmentReason.trim()) {
      setBanner({ tone: "error", text: "A reason is required for an amendment to an approved plan item." });
      return;
    }

    const res = requestPlanItemChange(item.id, changed, amendmentReason, user.name);
    if (!res.ok) {
      setBanner({ tone: "error", text: res.error ?? "The amendment could not be raised." });
      return;
    }
    setEditing(false);
    setAmendmentReason("");
    setBanner({ tone: "success", text: "Amendment submitted — it applies once Procurement and Finance approve." });
  };

  const handleSubmitForReview = () => {
    const result = submitPlanItemForReview(item.id, user.name);
    setBanner(
      result
        ? { tone: "success", text: "Submitted to Procurement for compliance review." }
        : { tone: "error", text: "Only draft or rejected items can be submitted for review." }
    );
  };

  const handleProcurementReview = () => {
    const result = reviewPlanItemProcurement(item.id, user.name, reviewComments);
    setBanner(
      result
        ? { tone: "success", text: "Procurement compliance cleared — passed to Finance for budget verification." }
        : { tone: "error", text: "This item is not awaiting Procurement review." }
    );
    setReviewComments("");
  };

  const handleFinanceReview = () => {
    const result = reviewPlanItemFinance(item.id, user.name, reviewComments);
    setBanner(
      result
        ? { tone: "success", text: "Finance verification recorded — the item is now live on the approved plan." }
        : { tone: "error", text: "This item is not awaiting Finance review." }
    );
    setReviewComments("");
  };

  const handleReject = () => {
    if (!rejectStage) return;
    if (!rejectReason.trim()) {
      setBanner({ tone: "error", text: "A rejection reason is mandatory." });
      return;
    }
    const result = rejectPlanItem(item.id, user.name, rejectReason, rejectStage);
    setBanner(
      result
        ? { tone: "success", text: `Rejected at ${rejectStage} review — the requester has been notified.` }
        : { tone: "error", text: "The item could not be rejected." }
    );
    setRejectStage(null);
    setRejectReason("");
  };

  const detailLabelCls = "text-[11px] font-semibold text-slate-600 uppercase tracking-wide";
  const valCls = "text-sm text-slate-800";
  const overdue = isOverdue(item);

  const awaitingProcurement = item.approvalStatus === "Pending Procurement Review";
  const awaitingFinance = item.approvalStatus === "Pending Finance Review";
  const canSubmitState = item.approvalStatus === "Draft" || item.approvalStatus === "Rejected";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{item.ppItemId}</h2>
              {getApprovalBadge(item.approvalStatus)}
              {item.pendingChange && (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[11px] font-medium shadow-none border-0">
                  Amendment pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{item.activityDescription}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {banner && (
            <div
              className={`flex items-start gap-2 rounded-lg px-3 py-2 border ${
                banner.tone === "error" ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"
              }`}
            >
              {banner.tone === "error" ? (
                <AlertCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
              ) : (
                <CheckCircle className="size-4 text-emerald-600 mt-0.5 shrink-0" />
              )}
              <p className={`text-[12px] ${banner.tone === "error" ? "text-red-700" : "text-emerald-800"}`}>{banner.text}</p>
            </div>
          )}

          {overdue && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertTriangle className="size-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[12px] text-red-700">
                Completion was due {item.completionDate} — {daysLate(item)} day{daysLate(item) === 1 ? "" : "s"} ago — and the
                item is still {item.status}.
              </p>
            </div>
          )}

          {item.pendingChange && (
            <PendingAmendmentPanel item={item} user={user} onError={(msg) => setBanner({ tone: "error", text: msg })} />
          )}

          {/* Detail fields */}
          {!editing ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div><span className={detailLabelCls}>Activity</span><p className={valCls}>{item.activityDescription}</p></div>
              <div><span className={detailLabelCls}>Category</span><div className="mt-1">{getCategoryBadge(item.category)}</div></div>
              <div><span className={detailLabelCls}>Estimated Value</span><p className={valCls}>{formatCurrency(item.estimatedValue)}</p></div>
              <div><span className={detailLabelCls}>Funding Source</span><p className={valCls}>{item.fundingSource}</p></div>
              <div>
                <span className={detailLabelCls}>Procurement Method</span>
                <div className="mt-1 flex items-center gap-2">
                  {getMethodBadge(item.procurementMethod)}
                  {!validateMethodAgainstThreshold(item.procurementMethod, item.estimatedValue).compliant && (
                    <span className="text-[11px] text-amber-700 font-medium">threshold deviation</span>
                  )}
                </div>
              </div>
              <div><span className={detailLabelCls}>Status</span><div className="mt-1">{getStatusBadge(item.status)}</div></div>
              <div><span className={detailLabelCls}>Responsible Person</span><p className={valCls}>{item.responsiblePerson}</p></div>
              <div><span className={detailLabelCls}>Department</span><p className={valCls}>{item.department}</p></div>
              <div><span className={detailLabelCls}>Initiation Date</span><p className={valCls}>{item.initiationDate}</p></div>
              <div><span className={detailLabelCls}>Award Date</span><p className={valCls}>{item.awardDate}</p></div>
              <div><span className={detailLabelCls}>Completion Date</span><p className={valCls}>{item.completionDate}</p></div>
              <div><span className={detailLabelCls}>Linked Budget Line</span><p className={valCls}>{item.linkedBudgetLine || "—"}</p></div>
              <div><span className={detailLabelCls}>Linked Work Plan</span><p className={valCls}>{item.linkedWorkPlan || "—"}</p></div>
              <div><span className={detailLabelCls}>Version</span><p className={valCls}>{item.version}</p></div>
              <div><span className={detailLabelCls}>Last Modified</span><p className={valCls}>{item.lastModified}</p></div>
            </div>
          ) : (
            <div className="space-y-4">
              {isApproved && (
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <Info className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-blue-800">
                    This item is live on the approved plan. Changes are held as an amendment until Procurement and Finance
                    both approve them.
                  </p>
                </div>
              )}
              <PlanFormFields
                form={form}
                setForm={setForm}
                errors={errors}
                showStatus
                methodAlreadyOverridden={Boolean(item.methodDeviationJustification)}
              />
              {isApproved && (
                <div>
                  <label className={labelCls}>Reason for Amendment <span className="text-red-500">*</span></label>
                  <textarea
                    rows={2}
                    className={inputCls}
                    value={amendmentReason}
                    onChange={(e) => setAmendmentReason(e.target.value)}
                    placeholder="Explain why the approved plan entry must change..."
                  />
                </div>
              )}
            </div>
          )}

          {!editing && <ReviewTrail item={item} />}

          {/* Reviewer comment box, shown only at a live review station */}
          {!editing && ((awaitingProcurement && canReviewProc) || (awaitingFinance && canReviewFin)) && (
            <div>
              <label className={labelCls}>Review Comments <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
              <textarea
                rows={2}
                className={inputCls}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder={awaitingProcurement ? "Note any compliance observations..." : "Note the budget line verification..."}
              />
            </div>
          )}

          {/* Rejection reason, mandatory */}
          {!editing && rejectStage && (
            <div className="border border-red-200 bg-red-50/60 rounded-lg px-3 py-3">
              <label className={labelCls}>Rejection Reason — {rejectStage} review <span className="text-red-500">*</span></label>
              <textarea
                rows={2}
                className={inputCls}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State what is non-compliant so the requester can correct and resubmit..."
              />
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handleReject} className="px-3 py-1.5 rounded-lg text-[12px] text-white font-medium bg-red-600 hover:bg-red-700 transition-colors">
                  Confirm Rejection
                </button>
                <button
                  onClick={() => { setRejectStage(null); setRejectReason(""); }}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Change History */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <History className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Change History</h3>
            </div>
            {item.changeHistory.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No changes recorded yet.</p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Date</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Field Changed</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Old Value</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">New Value</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Changed By</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.changeHistory.map((ch: PlanItemChange) => (
                      <tr key={ch.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-[11px] text-slate-600 whitespace-nowrap">{ch.date}</td>
                        <td className="px-3 py-2 text-[11px] text-slate-700 font-medium">{FIELD_LABELS[ch.field] ?? ch.field}</td>
                        <td className="px-3 py-2 text-[11px] text-red-600">{ch.oldValue || "—"}</td>
                        <td className="px-3 py-2 text-[11px] text-emerald-600">{ch.newValue || "—"}</td>
                        <td className="px-3 py-2 text-[11px] text-slate-600">{ch.changedBy}</td>
                        <td className="px-3 py-2 text-[11px] text-slate-600">{ch.approvedBy || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer — the two-stage review flow */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            {!editing && canSubmitState && (
              <button
                onClick={handleSubmitForReview}
                disabled={!canSubmit}
                title={canSubmit ? "Route to Procurement for compliance review" : denialReason("plan.submitForReview")}
                className="px-4 py-2 rounded-lg text-sm text-white font-medium bg-[#0B01D0] hover:bg-[#0a01b8] transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-4" /> Submit for Review
              </button>
            )}

            {!editing && awaitingProcurement && (
              <>
                <button
                  onClick={handleProcurementReview}
                  disabled={!canReviewProc}
                  title={canReviewProc ? "Clear for policy compliance" : denialReason("plan.reviewProcurement")}
                  className="px-4 py-2 rounded-lg text-sm text-white font-medium bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="size-4" /> Procurement Review
                </button>
                <button
                  onClick={() => setRejectStage("Procurement")}
                  disabled={!canReviewProc}
                  title={canReviewProc ? "Reject with a documented reason" : denialReason("plan.reviewProcurement")}
                  className="px-4 py-2 border border-red-300 rounded-lg text-sm text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="size-4" /> Reject
                </button>
              </>
            )}

            {!editing && awaitingFinance && (
              <>
                <button
                  onClick={handleFinanceReview}
                  disabled={!canReviewFin}
                  title={canReviewFin ? "Confirm the budget line and approve" : denialReason("plan.reviewFinance")}
                  className="px-4 py-2 rounded-lg text-sm text-white font-medium bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="size-4" /> Finance Review
                </button>
                <button
                  onClick={() => setRejectStage("Finance")}
                  disabled={!canReviewFin}
                  title={canReviewFin ? "Reject with a documented reason" : denialReason("plan.reviewFinance")}
                  className="px-4 py-2 border border-red-300 rounded-lg text-sm text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="size-4" /> Reject
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); setErrors({}); }} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-lg text-sm text-white font-medium transition-colors" style={{ backgroundColor: "#0B01D0" }}>
                  {isApproved ? "Submit Amendment" : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startEditing}
                  disabled={!canEdit || !!item.pendingChange}
                  title={
                    !canEdit
                      ? denialReason("plan.edit")
                      : item.pendingChange
                        ? "An amendment is already awaiting review on this item."
                        : isApproved
                          ? "Raise an amendment to this approved plan item"
                          : "Edit this draft"
                  }
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit2 className="size-3.5" /> {isApproved ? "Amend" : "Edit"}
                </button>
                <button onClick={onClose} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Close</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline (Gantt-style) view ────────────────────────────────────────────

function PlanTimeline({ items, onSelect }: { items: ProcurementPlanItem[]; onSelect: (i: ProcurementPlanItem) => void }) {
  const today = todayISO();
  const rows = items.filter((i) => i.initiationDate && i.completionDate);

  if (rows.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
        <CalendarDays className="size-6 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No plan items with scheduled dates yet.</p>
      </div>
    );
  }

  const stamps = rows.flatMap((i) => [new Date(i.initiationDate).getTime(), new Date(i.completionDate).getTime()]);
  stamps.push(new Date(today).getTime());
  const rawMin = Math.min(...stamps);
  const rawMax = Math.max(...stamps);
  const pad = Math.max((rawMax - rawMin) * 0.04, 5 * 86_400_000);
  const start = rawMin - pad;
  const end = rawMax + pad;
  const span = end - start || 1;
  const pct = (value: string | number) => ((new Date(value).getTime() - start) / span) * 100;

  const ticks: { label: string; left: number }[] = [];
  const cursor = new Date(start);
  cursor.setDate(1);
  cursor.setHours(0, 0, 0, 0);
  while (cursor.getTime() <= end && ticks.length < 60) {
    const t = cursor.getTime();
    if (t >= start) {
      ticks.push({
        label: cursor.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        left: ((t - start) / span) * 100,
      });
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const todayLeft = pct(today);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Plan Timeline — Initiation to Completion</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-4 h-2 rounded-sm bg-indigo-400 inline-block" /> Initiation → Award
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-4 h-2 rounded-sm bg-[#0B01D0] inline-block" /> Award → Completion
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-4 h-2 rounded-sm bg-red-500 inline-block" /> Overdue
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-0.5 h-3 bg-red-500 inline-block" /> Today
          </span>
        </div>
      </div>

      {/* Month scale */}
      <div className="flex items-end border-b border-slate-200 bg-slate-50">
        <div className="w-[280px] shrink-0 px-4 py-2 text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
          Plan Item
        </div>
        <div className="relative flex-1 h-8">
          {ticks.map((t) => (
            <div key={t.label + t.left} className="absolute top-0 h-full" style={{ left: `${t.left}%` }}>
              <div className="h-full w-px bg-slate-200" />
              <span className="absolute top-1 left-1 text-[10px] text-slate-500 whitespace-nowrap">{t.label}</span>
            </div>
          ))}
          <div className="absolute top-0 h-full w-px bg-red-500" style={{ left: `${todayLeft}%` }} />
        </div>
        <div className="w-[110px] shrink-0 px-3 py-2 text-[11px] font-semibold text-slate-600 uppercase tracking-wide text-right">
          Value
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {rows.map((item) => {
          const overdue = isOverdue(item);
          const initLeft = pct(item.initiationDate);
          const awardLeft = pct(item.awardDate || item.completionDate);
          const doneLeft = pct(item.completionDate);
          const seg1 = Math.max(awardLeft - initLeft, 0.4);
          const seg2 = Math.max(doneLeft - Math.max(awardLeft, initLeft), 0.4);

          return (
            <div
              key={item.id}
              className="flex items-center hover:bg-blue-50/40 transition-colors cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="w-[280px] shrink-0 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{item.ppItemId}</span>
                  {overdue && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] font-medium shadow-none border-0">
                      {daysLate(item)}d late
                    </Badge>
                  )}
                </div>
                <p className="text-[12px] text-slate-700 truncate" title={item.activityDescription}>
                  {item.activityDescription}
                </p>
              </div>

              <div className="relative flex-1 h-12">
                {ticks.map((t) => (
                  <div key={`g-${item.id}-${t.left}`} className="absolute top-0 h-full w-px bg-slate-100" style={{ left: `${t.left}%` }} />
                ))}
                <div className="absolute top-0 h-full w-px bg-red-500/70" style={{ left: `${todayLeft}%` }} />

                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-l-sm bg-indigo-400"
                  style={{ left: `${initLeft}%`, width: `${seg1}%` }}
                  title={`${item.initiationDate} → ${item.awardDate}`}
                />
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-2.5 rounded-r-sm ${overdue ? "bg-red-500" : "bg-[#0B01D0]"}`}
                  style={{ left: `${Math.max(awardLeft, initLeft)}%`, width: `${seg2}%` }}
                  title={`${item.awardDate} → ${item.completionDate}`}
                />
                <span
                  className="absolute top-1/2 translate-y-2 text-[10px] text-slate-400 whitespace-nowrap"
                  style={{ left: `${initLeft}%` }}
                >
                  {item.initiationDate} → {item.completionDate}
                </span>
              </div>

              <div className="w-[110px] shrink-0 px-3 py-2.5 text-right">
                <p className="text-[12px] font-medium text-slate-800">{formatCurrency(item.estimatedValue)}</p>
                <p className="text-[10px] text-slate-400">{item.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Export configuration ───────────────────────────────────────────────────

type ExportRow = Record<string, unknown>;

const PLAN_EXPORT_COLUMNS: ExportColumn<ExportRow>[] = [
  { key: "ppItemId", header: "PP Item ID" },
  { key: "activityDescription", header: "Activity" },
  { key: "category", header: "Category" },
  { key: "estimatedValue", header: "Estimated Value (USD)" },
  { key: "fundingSource", header: "Funding Source" },
  { key: "procurementMethod", header: "Procurement Method" },
  { key: "department", header: "Department" },
  { key: "responsiblePerson", header: "Responsible" },
  { key: "initiationDate", header: "Initiation" },
  { key: "awardDate", header: "Award" },
  { key: "completionDate", header: "Completion" },
  { key: "status", header: "Status" },
  { key: "approvalStatus", header: "Approval" },
  { key: "procurementReviewedBy", header: "Procurement Reviewer" },
  { key: "financeReviewedBy", header: "Finance Reviewer" },
  { key: "linkedBudgetLine", header: "Budget Line" },
  { key: "linkedWorkPlan", header: "Work Plan" },
  { key: "version", header: "Version" },
];

function buildExportRows(items: ProcurementPlanItem[]): ExportRow[] {
  return items.map((i) => ({
    ppItemId: i.ppItemId,
    activityDescription: i.activityDescription,
    category: i.category,
    estimatedValue: i.estimatedValue,
    fundingSource: i.fundingSource,
    procurementMethod: i.procurementMethod,
    department: i.department,
    responsiblePerson: i.responsiblePerson,
    initiationDate: i.initiationDate,
    awardDate: i.awardDate,
    completionDate: i.completionDate,
    status: i.status,
    approvalStatus: i.approvalStatus,
    procurementReviewedBy: i.procurementReviewedBy ?? "",
    financeReviewedBy: i.financeReviewedBy ?? "",
    linkedBudgetLine: i.linkedBudgetLine ?? "",
    linkedWorkPlan: i.linkedWorkPlan ?? "",
    version: i.version,
  }));
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function ProcurementPlanView({ onBack }: ProcurementPlanViewProps) {
  const [activeTab, setActiveTab] = useState<"wbs" | "planItems" | "timeline">("planItems");
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(["P1", "P2"]));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(["T001", "T004", "T009"]));
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProcurementPlanItem | null>(null);
  const [historyItem, setHistoryItem] = useState<ProcurementPlanItem | null>(null);
  const [planItems, setPlanItems] = useState<ProcurementPlanItem[]>(getProcurementPlanItems());
  const [user, setUser] = useState<AppUser>(getCurrentUser());
  const [newlyOverdue, setNewlyOverdue] = useState<ProcurementPlanItem[]>([]);
  const [overdueDismissed, setOverdueDismissed] = useState(false);

  // Subscribe to store changes
  useEffect(() => {
    const unsub = subscribe(() => {
      setPlanItems(getProcurementPlanItems());
    });
    return unsub;
  }, []);

  // Subscribe to role/identity changes so capability gating stays live
  useEffect(() => {
    const unsub = subscribeCurrentUser(() => setUser(getCurrentUser()));
    return unsub;
  }, []);

  // Compare plan dates to the calendar on mount — nothing else marks items late
  useEffect(() => {
    const flagged = detectOverduePlanItems();
    setNewlyOverdue(flagged);
    setPlanItems(getProcurementPlanItems());
  }, []);

  // Keep selectedItem and historyItem in sync with store updates
  useEffect(() => {
    if (selectedItem) {
      const updated = planItems.find((i) => i.id === selectedItem.id);
      if (updated && updated !== selectedItem) setSelectedItem(updated);
    }
    if (historyItem) {
      const updated = planItems.find((i) => i.id === historyItem.id);
      if (updated && updated !== historyItem) setHistoryItem(updated);
    }
  }, [planItems, selectedItem, historyItem]);

  const togglePhase = (id: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleTask = (id: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // WBS grand totals
  const grandPlanned = PROCUREMENT_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.reduce((s3, li) => s3 + li.planned, 0), 0), 0
  );
  const totalItems = PROCUREMENT_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.length, 0), 0
  );

  // Plan items indexed by the budget line they are linked to
  const planItemsByBudgetLine = useMemo(() => {
    const map = new Map<string, ProcurementPlanItem[]>();
    planItems.forEach((item) => {
      if (!item.linkedBudgetLine) return;
      const list = map.get(item.linkedBudgetLine) ?? [];
      list.push(item);
      map.set(item.linkedBudgetLine, list);
    });
    return map;
  }, [planItems]);

  const unlinkedPlanItems = useMemo(
    () => planItems.filter((i) => !i.linkedBudgetLine || !BUDGET_LINE_PLANNED.has(i.linkedBudgetLine)),
    [planItems]
  );

  const linkedPlanValue = useMemo(
    () => planItems.filter((i) => i.linkedBudgetLine && BUDGET_LINE_PLANNED.has(i.linkedBudgetLine))
      .reduce((s, i) => s + i.estimatedValue, 0),
    [planItems]
  );

  // Plan items dashboard stats
  const totalPlanItems = planItems.length;
  const totalPlanValue = planItems.reduce((s, i) => s + i.estimatedValue, 0);
  const approvedCount = planItems.filter((i) => i.approvalStatus === "Approved").length;
  const pendingReviewCount = planItems.filter(
    (i) => i.approvalStatus === "Pending Procurement Review" || i.approvalStatus === "Pending Finance Review"
  ).length;
  const overdueItems = useMemo(() => planItems.filter(isOverdue), [planItems]);
  const delayedCount = planItems.filter((i) => i.status === "Delayed").length;

  const canCreate = can("plan.create");
  const canExport = can("report.export");

  const runExport = (kind: "excel" | "pdf" | "csv") => {
    const rows = buildExportRows(planItems);
    const title = "Procurement Plan Items";
    const meta = {
      subtitle: `${rows.length} plan items · total estimated value ${formatCurrency(totalPlanValue)} · ${approvedCount} approved`,
      generatedBy: user.name,
    };
    if (kind === "excel") exportToExcel(title, PLAN_EXPORT_COLUMNS, rows, meta);
    else if (kind === "pdf") exportToPDF(title, PLAN_EXPORT_COLUMNS, rows, { ...meta, orientation: "landscape" });
    else exportToCSV(title, PLAN_EXPORT_COLUMNS, rows);
  };

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
                {activeTab === "wbs"
                  ? <>Budget-Aligned Procurement Items | {totalItems} budget lines | Planned Total: <span className="font-semibold text-[#0B01D0]">{formatCurrency(grandPlanned)}</span> | Linked plan value: <span className="font-semibold text-[#0B01D0]">{formatCurrency(linkedPlanValue)}</span></>
                  : activeTab === "timeline"
                    ? <>Schedule view | {planItems.length} items | <span className="font-semibold text-red-600">{overdueItems.length} overdue</span></>
                    : <>{totalPlanItems} plan items | Total Value: <span className="font-semibold text-[#0B01D0]">{formatCurrency(totalPlanValue)}</span></>
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 hidden lg:inline">
              Signed in as <span className="font-medium text-slate-700">{user.name}</span> ({user.roles.join(", ")})
            </span>
            {activeTab !== "wbs" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => runExport("excel")}
                  disabled={!canExport}
                  title={canExport ? "Export to Excel" : denialReason("report.export")}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileSpreadsheet className="size-3.5" /> Excel
                </button>
                <button
                  onClick={() => runExport("pdf")}
                  disabled={!canExport}
                  title={canExport ? "Export to PDF" : denialReason("report.export")}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer className="size-3.5" /> PDF
                </button>
                <button
                  onClick={() => runExport("csv")}
                  disabled={!canExport}
                  title={canExport ? "Export to CSV" : denialReason("report.export")}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="size-3.5" /> CSV
                </button>
              </div>
            )}
            {activeTab === "planItems" && (
              <button
                onClick={() => setShowAddModal(true)}
                disabled={!canCreate}
                title={canCreate ? "Add a plan item" : denialReason("plan.create")}
                className="px-5 py-2 rounded-lg text-sm text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0B01D0" }}
              >
                <Plus className="size-4" /> Add Plan Item
              </button>
            )}
            <button
              onClick={onBack}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 mt-5">
          {([
            { id: "wbs", label: "Budget WBS View" },
            { id: "planItems", label: "Procurement Plan Items" },
            { id: "timeline", label: "Timeline" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-t-lg text-sm font-medium transition-colors border border-b-0 ${
                activeTab === tab.id
                  ? "bg-white text-[#0B01D0] border-slate-200"
                  : "bg-slate-100 text-slate-500 border-transparent hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6">

        {/* Overdue alerts — raised by detectOverduePlanItems on mount */}
        {overdueItems.length > 0 && !overdueDismissed && activeTab !== "wbs" && (
          <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-600" />
              <h2 className="text-sm font-semibold text-red-800 flex-1">
                {overdueItems.length} plan item{overdueItems.length === 1 ? " is" : "s are"} past the planned completion date
                {newlyOverdue.length > 0 && (
                  <span className="font-normal text-red-600"> — {newlyOverdue.length} newly flagged and marked Delayed</span>
                )}
              </h2>
              <button onClick={() => setOverdueDismissed(true)} className="text-red-400 hover:text-red-700">
                <X className="size-4" />
              </button>
            </div>
            <div className="divide-y divide-red-100">
              {overdueItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50/50 transition-colors"
                >
                  <span className="text-[11px] font-mono text-slate-400 w-24 shrink-0">{item.ppItemId}</span>
                  <span className="text-[12px] text-slate-700 flex-1 truncate">{item.activityDescription}</span>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">due {item.completionDate}</span>
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[11px] font-medium shadow-none border-0">
                    {daysLate(item)} days late
                  </Badge>
                  <span className="text-[11px] text-slate-500 w-32 truncate text-right">{item.responsiblePerson}</span>
                </button>
              ))}
              {overdueItems.length > 5 && (
                <p className="px-4 py-2 text-[11px] text-slate-500">and {overdueItems.length - 5} more…</p>
              )}
            </div>
          </div>
        )}

        {/* ════════════ TAB: Procurement Plan Items ════════════ */}
        {activeTab === "planItems" && (
          <>
            {/* Dashboard stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Total Plan Items", value: totalPlanItems, icon: <FileText className="size-4" /> },
                { label: "Total Value", value: formatCurrency(totalPlanValue), icon: <Wallet className="size-4" /> },
                { label: "Approved Items", value: approvedCount, icon: <CheckCircle className="size-4" /> },
                { label: "Awaiting Review", value: pendingReviewCount, icon: <Clock className="size-4" /> },
                { label: "Overdue / Delayed", value: `${overdueItems.length} / ${delayedCount}`, icon: <AlertCircle className="size-4" /> },
              ].map((card, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#0B01D0" }}>
                    {card.icon}
                    {card.label}
                  </div>
                  <span className="text-xl font-bold text-slate-900">{card.value}</span>
                </div>
              ))}
            </div>

            {/* Plan Items Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Procurement Plan Items</h2>
                <p className="text-[11px] text-slate-500">
                  Only items that clear Procurement and Finance review appear on the portal for requisition.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">PP Item ID</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold w-[16%]">Activity</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Category</th>
                      <th className="text-right px-3 py-3 text-white text-[11px] font-semibold">Est. Value</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Funding</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Method</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Dept</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Responsible</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Status</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Approval</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planItems.map((item) => {
                      const overdue = isOverdue(item);
                      const deviation = !validateMethodAgainstThreshold(item.procurementMethod, item.estimatedValue).compliant;
                      return (
                        <tr
                          key={item.id}
                          className={`border-b border-slate-100 hover:bg-blue-50/40 transition-colors ${overdue ? "bg-red-50/40" : ""}`}
                        >
                          <td className="px-3 py-2.5 text-[11px] font-mono text-slate-500">{item.ppItemId}</td>
                          <td className="px-3 py-2.5 text-[12px] text-slate-700">
                            {item.activityDescription}
                            {item.pendingChange && (
                              <span className="ml-1.5 text-[10px] font-medium text-amber-700">· amendment pending</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">{getCategoryBadge(item.category)}</td>
                          <td className="px-3 py-2.5 text-right text-[12px] text-slate-700">{formatCurrency(item.estimatedValue)}</td>
                          <td className="px-3 py-2.5 text-[11px] text-slate-600">{item.fundingSource}</td>
                          <td className="px-3 py-2.5 text-[11px] text-slate-600">
                            <div className="flex items-center gap-1">
                              <span>{item.procurementMethod}</span>
                              {deviation && (
                                <AlertTriangle className="size-3 text-amber-500 shrink-0" aria-label="Method departs from its value threshold" />
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-[11px] text-slate-600">{item.department}</td>
                          <td className="px-3 py-2.5 text-[11px] text-slate-600">{item.responsiblePerson}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1">
                              {getStatusBadge(item.status)}
                              {overdue && <span className="text-[10px] font-medium text-red-600">{daysLate(item)}d</span>}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">{getApprovalBadge(item.approvalStatus)}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-[#0B01D0] transition-colors"
                                title="Open"
                              >
                                <Edit2 className="size-3.5" />
                              </button>
                              <button
                                onClick={() => setHistoryItem(item)}
                                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-[#0B01D0] transition-colors"
                                title="History"
                              >
                                <History className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {planItems.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-sm text-slate-400">No plan items yet. Click &quot;Add Plan Item&quot; to create one.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ════════════ TAB: Timeline ════════════ */}
        {activeTab === "timeline" && (
          <PlanTimeline items={planItems} onSelect={setSelectedItem} />
        )}

        {/* ════════════ TAB: Budget WBS View ════════════ */}
        {activeTab === "wbs" && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <Wallet className="size-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900">Budget Work Breakdown with Linked Plan Items</h2>
              <span className="text-[11px] text-slate-500 ml-auto">
                {planItems.length - unlinkedPlanItems.length} of {planItems.length} plan items map to a WBS budget line
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-[28%]">Item</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Planned Amount</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Plan Items</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Method</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Vendor / Responsible</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Expected Date</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCUREMENT_DATA.map((phase) => {
                    const phasePlanned = phase.tasks.reduce((s, t) => s + t.lineItems.reduce((s2, li) => s2 + li.planned, 0), 0);
                    const phasePlanValue = phase.tasks.reduce(
                      (s, t) => s + t.lineItems.reduce(
                        (s2, li) => s2 + (planItemsByBudgetLine.get(li.budgetLineId) ?? []).reduce((s3, pi) => s3 + pi.estimatedValue, 0), 0
                      ), 0
                    );
                    const isPhaseExpanded = expandedPhases.has(phase.phaseId);

                    return (
                      <PhaseRows
                        key={phase.phaseId}
                        phase={phase}
                        phasePlanned={phasePlanned}
                        phasePlanValue={phasePlanValue}
                        isExpanded={isPhaseExpanded}
                        expandedTasks={expandedTasks}
                        planItemsByBudgetLine={planItemsByBudgetLine}
                        onTogglePhase={() => togglePhase(phase.phaseId)}
                        onToggleTask={toggleTask}
                        onSelectPlanItem={setSelectedItem}
                      />
                    );
                  })}

                  {/* Plan items that carry no budget line from this dataset */}
                  {unlinkedPlanItems.length > 0 && (
                    <>
                      <tr className="bg-amber-50 border-y border-amber-200">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="size-4 text-amber-600 shrink-0" />
                            <span className="text-[12px] font-semibold text-amber-900">
                              Plan items not mapped to a WBS budget line ({unlinkedPlanItems.length})
                            </span>
                            <span className="text-[11px] font-normal text-amber-700">
                              — re-select the budget line on each item to fold it into the tree above
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-right text-[12px] text-amber-800">—</td>
                        <td className="px-4 py-3 text-right text-[12px] font-semibold text-amber-900">
                          {formatCurrency(unlinkedPlanItems.reduce((s, i) => s + i.estimatedValue, 0))}
                        </td>
                        <td className="px-4 py-3" colSpan={3}></td>
                      </tr>
                      {unlinkedPlanItems.map((pi) => (
                        <PlanItemRow key={`unlinked-${pi.id}`} item={pi} indent={6} onSelect={setSelectedItem} />
                      ))}
                    </>
                  )}

                  {/* Grand Total */}
                  <tr className="bg-slate-100 border-t-2 border-slate-300">
                    <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">Grand Total</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(grandPlanned)}</td>
                    <td className="px-4 py-3 text-right text-[12px] font-semibold text-[#0B01D0]">{formatCurrency(totalPlanValue)}</td>
                    <td className="px-4 py-3" colSpan={3}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPlanItemModal open={showAddModal} onClose={() => setShowAddModal(false)} user={user} />
      {selectedItem && <PlanItemDetail item={selectedItem} user={user} onClose={() => setSelectedItem(null)} />}

      {/* History Panel Modal */}
      {historyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Change History</h2>
                <p className="text-sm text-slate-500 mt-0.5">{historyItem.ppItemId} — {historyItem.activityDescription}</p>
              </div>
              <button onClick={() => setHistoryItem(null)} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Version {historyItem.version}</span>
                <span className="text-[11px] text-slate-400">|</span>
                <span className="text-[11px] text-slate-500">Last modified: {historyItem.lastModified}</span>
                <span className="text-[11px] text-slate-400">|</span>
                {getApprovalBadge(historyItem.approvalStatus)}
              </div>
              <ReviewTrail item={historyItem} />
              {historyItem.changeHistory.length === 0 ? (
                <p className="text-sm text-slate-400 italic py-6 text-center">No changes recorded yet.</p>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Date</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Field Changed</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Old Value</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">New Value</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Changed By</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Approved By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyItem.changeHistory.map((ch: PlanItemChange) => (
                        <tr key={ch.id} className="border-t border-slate-100">
                          <td className="px-3 py-2 text-[11px] text-slate-600 whitespace-nowrap">{ch.date}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-700 font-medium">{FIELD_LABELS[ch.field] ?? ch.field}</td>
                          <td className="px-3 py-2 text-[11px] text-red-600">{ch.oldValue || "—"}</td>
                          <td className="px-3 py-2 text-[11px] text-emerald-600">{ch.newValue || "—"}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-600">{ch.changedBy}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-600">{ch.approvedBy || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
              <button onClick={() => setHistoryItem(null)} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Plan item row inside the WBS tree ──────────────────────────────────────

function PlanItemRow({
  item,
  indent,
  onSelect,
}: {
  item: ProcurementPlanItem;
  indent: number;
  onSelect: (i: ProcurementPlanItem) => void;
}) {
  const overdue = isOverdue(item);
  return (
    <tr
      className={`border-b border-slate-50 cursor-pointer hover:bg-blue-50/40 transition-colors ${overdue ? "bg-red-50/40" : "bg-indigo-50/20"}`}
      onClick={() => onSelect(item)}
    >
      <td className="px-4 py-2">
        <div className="flex items-center gap-2" style={{ paddingLeft: `${indent * 0.25}rem` }}>
          <GitBranch className="size-3 text-indigo-400 shrink-0" />
          <span className="text-[11px] text-indigo-500 font-mono">{item.ppItemId}</span>
          <span className="text-[12px] text-slate-700">{item.activityDescription}</span>
        </div>
      </td>
      <td className="px-4 py-2">{getCategoryBadge(item.category)}</td>
      <td className="px-4 py-2 text-right text-[11px] text-slate-400 font-mono">{item.linkedBudgetLine || "—"}</td>
      <td className="px-4 py-2 text-right text-[12px] font-medium text-slate-700">{formatCurrency(item.estimatedValue)}</td>
      <td className="px-4 py-2">{getMethodBadge(item.procurementMethod)}</td>
      <td className="px-4 py-2 text-[12px] text-slate-600">{item.responsiblePerson}</td>
      <td className="px-4 py-2 text-[12px] text-slate-600 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span>{item.completionDate}</span>
          {getApprovalBadge(item.approvalStatus)}
        </div>
      </td>
    </tr>
  );
}

// ─── Phase rows ─────────────────────────────────────────────────────────────

function PhaseRows({
  phase,
  phasePlanned,
  phasePlanValue,
  isExpanded,
  expandedTasks,
  planItemsByBudgetLine,
  onTogglePhase,
  onToggleTask,
  onSelectPlanItem,
}: {
  phase: ProcurementPhase;
  phasePlanned: number;
  phasePlanValue: number;
  isExpanded: boolean;
  expandedTasks: Set<string>;
  planItemsByBudgetLine: Map<string, ProcurementPlanItem[]>;
  onTogglePhase: () => void;
  onToggleTask: (id: string) => void;
  onSelectPlanItem: (i: ProcurementPlanItem) => void;
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
        <td className="px-4 py-3 text-right text-[12px] font-semibold text-[#0B01D0]">
          {phasePlanValue > 0 ? formatCurrency(phasePlanValue) : "—"}
        </td>
        <td className="px-4 py-3" colSpan={3}></td>
      </tr>

      {isExpanded && phase.tasks.map((task) => {
        const taskPlanned = task.lineItems.reduce((s, li) => s + li.planned, 0);
        const taskPlanValue = task.lineItems.reduce(
          (s, li) => s + (planItemsByBudgetLine.get(li.budgetLineId) ?? []).reduce((s2, pi) => s2 + pi.estimatedValue, 0), 0
        );
        const isTaskExpanded = expandedTasks.has(task.taskId);

        return (
          <TaskRows
            key={task.taskId}
            task={task}
            taskPlanned={taskPlanned}
            taskPlanValue={taskPlanValue}
            isExpanded={isTaskExpanded}
            planItemsByBudgetLine={planItemsByBudgetLine}
            onToggle={() => onToggleTask(task.taskId)}
            onSelectPlanItem={onSelectPlanItem}
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
  taskPlanValue,
  isExpanded,
  planItemsByBudgetLine,
  onToggle,
  onSelectPlanItem,
}: {
  task: ProcurementTask;
  taskPlanned: number;
  taskPlanValue: number;
  isExpanded: boolean;
  planItemsByBudgetLine: Map<string, ProcurementPlanItem[]>;
  onToggle: () => void;
  onSelectPlanItem: (i: ProcurementPlanItem) => void;
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
        <td className="px-4 py-3 text-right text-[12px] font-medium text-[#0B01D0]">
          {taskPlanValue > 0 ? formatCurrency(taskPlanValue) : "—"}
        </td>
        <td className="px-4 py-3" colSpan={3}></td>
      </tr>

      {isExpanded && task.lineItems.map((li) => {
        const linked = planItemsByBudgetLine.get(li.budgetLineId) ?? [];
        const linkedValue = linked.reduce((s, pi) => s + pi.estimatedValue, 0);

        return (
          <Fragment key={li.budgetLineId}>
            <tr className="border-b border-slate-50 bg-white hover:bg-slate-50/50">
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
              <td className="px-4 py-2.5 text-right text-[12px]">
                {linked.length === 0 ? (
                  <span className="text-slate-300">—</span>
                ) : (
                  <span className={linkedValue > li.planned ? "text-red-600 font-medium" : "text-slate-700"}>
                    {linked.length} · {formatCurrency(linkedValue)}
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5">{getMethodBadge(li.procurementMethod)}</td>
              <td className="px-4 py-2.5 text-[12px] text-slate-600">{li.vendor || "—"}</td>
              <td className="px-4 py-2.5 text-[12px] text-slate-600 whitespace-nowrap">{li.expectedDelivery}</td>
            </tr>
            {linked.map((pi) => (
              <PlanItemRow key={`${li.budgetLineId}-${pi.id}`} item={pi} indent={18} onSelect={onSelectPlanItem} />
            ))}
          </Fragment>
        );
      })}
    </>
  );
}
