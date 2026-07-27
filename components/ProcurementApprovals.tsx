import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Gauge,
  Lock,
  MoreHorizontal,
  Package,
  Printer,
  RotateCcw,
  Search,
  ShieldAlert,
  Timer,
  X,
} from "lucide-react";
import {
  approvePRProcurement,
  approveSourcing,
  checkPlanVariance,
  computeDaysInStage,
  getGeneratedPRs,
  getPRStats,
  getPRsAwaiting,
  getSourcingApprovals,
  rejectPRProcurement,
  rejectSourcing,
  subscribe,
  validatePRForSubmission,
  type GeneratedPR,
  type SourcingApprovalItem,
} from "../lib/procurementStore";
import {
  can,
  denialReason,
  getCurrentUser,
  requiredRolesFor,
  subscribe as subscribeCurrentUser,
  type Capability,
} from "../lib/currentUser";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  type ExportColumn,
} from "../lib/exportUtils";
import {
  ProcurementTabs,
  ProcurementTabBar,
  type ProcurementTab,
} from "./procurement/ProcurementTabs";
import { ProcurementStatCards } from "./procurement/ProcurementStatCards";

// Procurement Unit station (step 3). Runs concurrently with the Finance review
// at step 4 — neither station blocks the other, and the requisition only
// advances once both have approved.
const APPROVE_CAPABILITY: Capability = "pr.approveProcurement";
const SOURCING_CAPABILITY: Capability = "sourcing.award";
const QUEUE_ROLE = "Procurement" as const;
const REQUIRED_ROLES = requiredRolesFor(APPROVE_CAPABILITY).join(" or ");
const SOURCING_ROLES = requiredRolesFor(SOURCING_CAPABILITY).join(" or ");

const PR_STATUSES = ["All Statuses", "Pending", "Approved", "Rejected"];
const SOURCING_STATUSES = ["All Statuses", "Pending", "Approved", "Rejected"];

type StationStatus = "Pending" | "Approved" | "Rejected";

// ─── Compliance signals ──────────────────────────────────────────────────────

type SignalTone = "critical" | "warning" | "info";

interface ComplianceSignal {
  key: string;
  label: string;
  tone: SignalTone;
  detail: string;
}

const TONE_BADGE: Record<SignalTone, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  info: "bg-slate-100 text-slate-600 border-slate-200",
};

const TONE_PANEL: Record<SignalTone, string> = {
  critical: "bg-red-50 border-red-200",
  warning: "bg-amber-50 border-amber-200",
  info: "bg-slate-50 border-slate-200",
};

const TONE_TEXT: Record<SignalTone, string> = {
  critical: "text-red-800",
  warning: "text-amber-800",
  info: "text-slate-700",
};

function planVarianceMessage(pr: GeneratedPR): string | undefined {
  if (pr.planVarianceFlag) return pr.planVarianceFlag;
  const variance = checkPlanVariance(pr);
  return variance.flagged ? variance.message : undefined;
}

function complianceSignals(pr: GeneratedPR): ComplianceSignal[] {
  const signals: ComplianceSignal[] = [];

  if (pr.emergencyOverride) {
    signals.push({
      key: "override",
      label: "Emergency override",
      tone: "critical",
      detail: [
        "This requisition proceeds without an approved procurement plan item — an exception to the standard control that is recorded in the audit trail.",
        pr.emergencyOverrideApprovedBy ? `Authorised by ${pr.emergencyOverrideApprovedBy}.` : "",
        pr.emergencyOverrideJustification ? `Justification: ${pr.emergencyOverrideJustification}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  const variance = planVarianceMessage(pr);
  if (variance) {
    signals.push({
      key: "variance",
      label: "Plan variance",
      tone: "warning",
      detail: pr.planVarianceComment
        ? `${variance} Requester's explanation: ${pr.planVarianceComment}`
        : `${variance} No explanation has been recorded by the requester.`,
    });
  }

  if (pr.methodDeviationJustification?.trim()) {
    signals.push({
      key: "method",
      label: "Method deviation",
      tone: "warning",
      detail: `The chosen method (${pr.purchaseType}) departs from the threshold for this value. Justification: ${pr.methodDeviationJustification}`,
    });
  }

  if ((pr.resubmissionCount ?? 0) > 0) {
    signals.push({
      key: "resubmission",
      label: `Resubmitted ×${pr.resubmissionCount}`,
      tone: "info",
      detail: `This requisition has re-entered the workflow ${pr.resubmissionCount} time(s) after an earlier rejection.`,
    });
  }

  if (pr.rejectionReason?.trim()) {
    const isCurrentlyRejected = pr.overallApprovalStatus === "Rejected";
    signals.push({
      key: "rejection",
      label: isCurrentlyRejected ? "Rejected" : "Prior rejection",
      tone: isCurrentlyRejected ? "critical" : "info",
      detail: `Rejected at ${pr.rejectedAtStage ?? "an earlier stage"}: ${pr.rejectionReason}`,
    });
  }

  return signals;
}

function ComplianceCell({ signals, issueCount }: { signals: ComplianceSignal[]; issueCount: number }) {
  if (!signals.length && issueCount === 0) {
    return <span className="text-[11px] text-slate-300">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1 justify-center max-w-[170px] mx-auto">
      {signals.map((signal) => (
        <span
          key={signal.key}
          title={signal.detail}
          className={`px-1.5 py-0.5 rounded border text-[9px] font-medium whitespace-nowrap ${TONE_BADGE[signal.tone]}`}
        >
          {signal.label}
        </span>
      ))}
      {issueCount > 0 && (
        <span
          title={`${issueCount} outstanding compliance issue(s) against the pre-submission checklist. Open the requisition for the full list.`}
          className="px-1.5 py-0.5 rounded border text-[9px] font-medium whitespace-nowrap bg-orange-100 text-orange-700 border-orange-200"
        >
          {issueCount} checklist issue{issueCount === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
}

// ─── Small presentational helpers ────────────────────────────────────────────

function AgingBadge({ days }: { days: number }) {
  const tone =
    days >= 5 ? "bg-red-100 text-red-700" : days >= 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tone}`}>
      <Clock className="w-3 h-3" />
      {days}d
    </span>
  );
}

function ExportMenu({ onExport }: { onExport: (format: "excel" | "pdf" | "csv") => void }) {
  const [open, setOpen] = useState(false);
  const choose = (format: "excel" | "pdf" | "csv") => {
    onExport(format);
    setOpen(false);
  };
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
      >
        <span className="text-sm text-slate-900">Export</span>
        <Download size={16} className="text-purple-700" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => choose("excel")}
              className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" /> Excel workbook
            </button>
            <button
              onClick={() => choose("pdf")}
              className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5 text-red-600" /> PDF report
            </button>
            <button
              onClick={() => choose("csv")}
              className="w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" /> CSV data
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function RejectDialog({
  value,
  onChange,
  error,
  onCancel,
  onConfirm,
}: {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const empty = !value.trim();
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-[15px] font-semibold text-slate-900 mb-3">Reject — Procurement Unit Review</h3>
        <p className="text-[12px] text-slate-500 mb-4">Please specify the policy or plan alignment issue:</p>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`w-full border rounded-lg px-3 py-2.5 text-[12px] text-slate-900 outline-none resize-none ${
            error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-red-400"
          }`}
          placeholder="e.g., Not in annual procurement plan, non-compliant procurement method..."
        />
        <p className={`text-[11px] mt-2 ${error ? "text-red-600" : "text-slate-400"}`}>
          {error ??
            "A documented reason is mandatory — it is sent to the requester and stored in the approval history."}
        </p>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={empty}
            title={empty ? "Enter a reason for rejection to continue." : undefined}
            className={`px-4 py-2 text-[12px] text-white rounded-lg transition-colors font-medium ${
              empty ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Export shapes ───────────────────────────────────────────────────────────

function toPRExportRow(pr: GeneratedPR, stationStatus: string | null) {
  return {
    requisitionNumber: pr.requisitionNumber,
    title: pr.requisitionTitle || pr.itemDescription,
    requestedBy: pr.requestedBy,
    department: pr.department,
    category: pr.category,
    purchaseType: pr.purchaseType,
    estimatedCost: pr.estimatedCost,
    fundingSource: pr.fundingSource ?? "",
    dateRequested: pr.dateRequested,
    daysInStage: computeDaysInStage(pr),
    procurementDecision: stationStatus ?? "Not in queue",
    financeDecision: pr.financeApproval,
    overallStatus: pr.overallApprovalStatus,
    complianceFlags: complianceSignals(pr)
      .map((s) => s.label)
      .join("; "),
    checklistIssues: validatePRForSubmission(pr)
      .map((issue) => issue.message)
      .join(" | "),
  };
}

type PRExportRow = ReturnType<typeof toPRExportRow>;

const PR_EXPORT_COLUMNS: ExportColumn<PRExportRow>[] = [
  { key: "requisitionNumber", header: "Requisition #" },
  { key: "title", header: "Title" },
  { key: "requestedBy", header: "Requested By" },
  { key: "department", header: "Department" },
  { key: "category", header: "Category" },
  { key: "purchaseType", header: "Method" },
  { key: "estimatedCost", header: "Estimated Cost (USD)" },
  { key: "fundingSource", header: "Funding Source" },
  { key: "dateRequested", header: "Date Requested" },
  { key: "daysInStage", header: "Days in Stage" },
  { key: "procurementDecision", header: "Procurement Decision" },
  { key: "financeDecision", header: "Finance (Parallel)" },
  { key: "overallStatus", header: "Overall Status" },
  { key: "complianceFlags", header: "Compliance Flags" },
  { key: "checklistIssues", header: "Outstanding Checklist Issues" },
];

function toSourcingExportRow(item: SourcingApprovalItem) {
  return {
    rfqNumber: item.rfqNumber,
    title: item.title,
    sourcePR: item.sourcePR,
    projectName: item.projectName,
    vendor: item.vendor,
    estimatedValue: item.estimatedValue,
    dateSubmitted: item.dateSubmitted,
    approvalStatus: item.approvalStatus,
  };
}

type SourcingExportRow = ReturnType<typeof toSourcingExportRow>;

const SOURCING_EXPORT_COLUMNS: ExportColumn<SourcingExportRow>[] = [
  { key: "rfqNumber", header: "RFQ Number" },
  { key: "title", header: "Title" },
  { key: "sourcePR", header: "Source PR" },
  { key: "projectName", header: "Project" },
  { key: "vendor", header: "Vendor" },
  { key: "estimatedValue", header: "Estimated Value (USD)" },
  { key: "dateSubmitted", header: "Date Submitted" },
  { key: "approvalStatus", header: "Status" },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export function ProcurementApprovals() {
  const [activeTab, setActiveTab] = useState<"pr" | "sourcing">("pr");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPR, setSelectedPR] = useState<GeneratedPR | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);

  // Force re-render when the store changes or the signed-in role is switched.
  const [, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    const unsubscribeStore = subscribe(bump);
    const unsubscribeUser = subscribeCurrentUser(bump);
    return () => {
      unsubscribeStore();
      unsubscribeUser();
    };
  }, []);

  const currentUser = getCurrentUser();
  const canApprove = can(APPROVE_CAPABILITY);
  const lockedReason = denialReason(APPROVE_CAPABILITY);
  const canAwardSourcing = can(SOURCING_CAPABILITY);
  const sourcingLockedReason = denialReason(SOURCING_CAPABILITY);

  const sourcingApprovals = getSourcingApprovals();
  const allGeneratedPRs = getGeneratedPRs();

  // Single source of truth for "what is waiting on this station", shared by all
  // four approval screens so their filters cannot drift apart.
  const awaiting = getPRsAwaiting(QUEUE_ROLE);
  const awaitingIds = new Set(awaiting.map((pr) => pr.id));

  const stationStatusOf = (pr: GeneratedPR): StationStatus | null => {
    if (awaitingIds.has(pr.id)) return "Pending";
    if (pr.procurementApproval === "Approved") return "Approved";
    if (pr.procurementApproval === "Rejected") return "Rejected";
    // The parallel Finance station rejected while this one was still reviewing.
    // No decision was recorded here, but the requisition must stay visible with
    // its outcome rather than silently vanishing from the queue.
    if (pr.procurementApproval === "Pending" && pr.overallApprovalStatus === "Rejected") return "Rejected";
    return null;
  };

  /** True when the requisition left this queue without a Procurement decision. */
  const closedElsewhere = (pr: GeneratedPR) =>
    pr.procurementApproval === "Pending" && stationStatusOf(pr) === "Rejected";

  // Requisitions that never reached this station, and withdrawn ones, are not
  // part of the Procurement queue.
  const procurementPRs = allGeneratedPRs.filter(
    (pr) => stationStatusOf(pr) !== null && pr.overallApprovalStatus !== "Withdrawn"
  );

  const filteredPRItems = procurementPRs.filter((pr) => {
    const needle = searchQuery.toLowerCase();
    const matchesSearch =
      pr.requisitionNumber.toLowerCase().includes(needle) ||
      pr.itemDescription.toLowerCase().includes(needle) ||
      (pr.requisitionTitle ?? "").toLowerCase().includes(needle) ||
      pr.requestedBy.toLowerCase().includes(needle);
    const matchesStatus = selectedStatus === "All Statuses" || stationStatusOf(pr) === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredSourcingItems = sourcingApprovals.filter((item) => {
    const needle = searchQuery.toLowerCase();
    const matchesSearch =
      item.rfqNumber.toLowerCase().includes(needle) ||
      item.title.toLowerCase().includes(needle) ||
      item.projectName.toLowerCase().includes(needle) ||
      item.vendor.toLowerCase().includes(needle);
    const matchesStatus = selectedStatus === "All Statuses" || item.approvalStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = activeTab === "pr" ? filteredPRItems.length : filteredSourcingItems.length;
  const totalPages = Math.max(1, Math.ceil(activeCount / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * itemsPerPage;
  const pagedPRItems = filteredPRItems.slice(pageStart, pageStart + itemsPerPage);
  const pagedSourcingItems = filteredSourcingItems.slice(pageStart, pageStart + itemsPerPage);

  const stats = getPRStats();
  const oldest = awaiting.reduce<GeneratedPR | null>(
    (worst, pr) => (!worst || computeDaysInStage(pr) > computeDaysInStage(worst) ? pr : worst),
    null
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-600";
      case "Pending":
        return "bg-orange-50 text-orange-600";
      case "Rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const closeRejectModal = () => {
    setRejectModalOpen(null);
    setRejectComment("");
    setRejectError(null);
  };

  const handleApprovePR = (id: string) => {
    if (!canApprove) return;
    approvePRProcurement(id, "", currentUser.name);
    setOpenActionMenuId(null);
    setSelectedPR(null);
  };

  const handleRejectPR = (id: string) => {
    if (!canApprove) {
      setRejectError(lockedReason);
      return;
    }
    const reason = rejectComment.trim();
    if (!reason) {
      setRejectError("A documented reason is required when rejecting a requisition.");
      return;
    }
    const result = rejectPRProcurement(id, reason, currentUser.name);
    if (!result.ok) {
      setRejectError(result.error ?? "The rejection could not be recorded.");
      return;
    }
    closeRejectModal();
    setOpenActionMenuId(null);
    setSelectedPR(null);
  };

  const handleApproveSourcing = (id: string) => {
    if (!canAwardSourcing) return;
    approveSourcing(id);
    setOpenActionMenuId(null);
  };

  const handleRejectSourcing = (id: string) => {
    if (!canAwardSourcing) return;
    rejectSourcing(id);
    setOpenActionMenuId(null);
  };

  const handleExport = (format: "excel" | "pdf" | "csv") => {
    const generatedBy = currentUser.name;
    if (activeTab === "pr") {
      const rows = filteredPRItems.map((pr) =>
        toPRExportRow(pr, closedElsewhere(pr) ? "Closed — rejected at another station" : stationStatusOf(pr))
      );
      const title = "Procurement Unit Requisition Approvals";
      const meta = {
        subtitle: `${selectedStatus} — ${rows.length} requisition${rows.length === 1 ? "" : "s"}${
          searchQuery ? ` matching "${searchQuery}"` : ""
        }`,
        generatedBy,
      };
      if (format === "excel") exportToExcel(title, PR_EXPORT_COLUMNS, rows, meta);
      else if (format === "pdf") exportToPDF(title, PR_EXPORT_COLUMNS, rows, meta);
      else exportToCSV(title, PR_EXPORT_COLUMNS, rows);
      return;
    }

    const rows = filteredSourcingItems.map(toSourcingExportRow);
    const title = "Sourcing (RFQ) Approvals";
    const meta = {
      subtitle: `${selectedStatus} — ${rows.length} case${rows.length === 1 ? "" : "s"}${
        searchQuery ? ` matching "${searchQuery}"` : ""
      }`,
      generatedBy,
    };
    if (format === "excel") exportToExcel(title, SOURCING_EXPORT_COLUMNS, rows, meta);
    else if (format === "pdf") exportToPDF(title, SOURCING_EXPORT_COLUMNS, rows, meta);
    else exportToCSV(title, SOURCING_EXPORT_COLUMNS, rows);
  };

  const tabs: ProcurementTab<"pr" | "sourcing">[] = [
    {
      key: "pr",
      label: "Purchase Requisitions",
      count: awaiting.length,
    },
    {
      key: "sourcing",
      label: "Sourcing (RFQ)",
      count: sourcingApprovals.filter((i) => i.approvalStatus === "Pending").length,
    },
  ];

  // ── Requisition detail ────────────────────────────────────────────────────
  if (selectedPR) {
    // Always render from the store so the panel reflects the parallel Finance
    // decision as soon as it lands.
    const freshPR = allGeneratedPRs.find((pr) => pr.id === selectedPR.id) || selectedPR;
    const actionable = stationStatusOf(freshPR) === "Pending";
    const signals = complianceSignals(freshPR);
    const issues = validatePRForSubmission(freshPR);
    const daysInStage = computeDaysInStage(freshPR);
    const financeCleared = freshPR.financeApproval === "Approved";

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSelectedPR(null)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-semibold text-slate-900">
                Procurement Unit Review — {freshPR.requisitionNumber}
              </h1>
              {freshPR.sourceType === "ESS Plan" && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-indigo-100 text-indigo-700">
                  Source: ESS Plan
                </span>
              )}
              {freshPR.emergencyOverride && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Emergency Override
                </span>
              )}
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Policy, plan alignment and method compliance check
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-medium ${
              freshPR.procurementApproval === "Pending"
                ? "bg-amber-100 text-amber-700"
                : freshPR.procurementApproval === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            Procurement: {freshPR.procurementApproval}
          </span>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Parallel review status */}
          <div
            className={`rounded-xl border px-4 py-3 mb-6 flex items-start gap-3 ${
              financeCleared ? "bg-green-50 border-green-200" : "bg-purple-50 border-purple-200"
            }`}
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold mt-0.5 ${
                financeCleared ? "bg-green-600 text-white" : "bg-purple-600 text-white"
              }`}
            >
              PARALLEL
            </span>
            <div>
              <p className={`text-[12px] font-semibold ${financeCleared ? "text-green-900" : "text-purple-900"}`}>
                {financeCleared
                  ? "Finance has already approved — your decision completes this stage."
                  : `Finance review is ${freshPR.financeApproval.toLowerCase()} and runs concurrently with yours.`}
              </p>
              <p className={`text-[11px] mt-0.5 ${financeCleared ? "text-green-700" : "text-purple-700"}`}>
                {financeCleared
                  ? freshPR.requiresSeniorApproval
                    ? "Approving now routes the requisition straight to Senior Management."
                    : "Approving now completes the approval workflow."
                  : "Neither station blocks the other; the requisition only advances once both Procurement and Finance have approved."}
              </p>
            </div>
          </div>

          {/* Workflow progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <h3 className="text-[13px] font-semibold text-slate-900 mb-4">Approval Workflow Progress</h3>
            <div className="flex items-center gap-3">
              {[
                { label: "Submitted", step: 1, status: "Approved" as const },
                { label: "Dept Head", step: 2, status: freshPR.deptApproval },
                { label: "Procurement", step: 3, status: freshPR.procurementApproval },
                { label: "Finance", step: 4, status: freshPR.financeApproval },
                ...(freshPR.requiresSeniorApproval
                  ? [{ label: "Senior Mgmt", step: 5, status: freshPR.seniorMgmtApproval }]
                  : []),
              ].map((s, i, arr) => (
                <div key={s.step} className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                        s.status === "Approved"
                          ? "bg-green-500 text-white"
                          : s.status === "Rejected"
                          ? "bg-red-500 text-white"
                          : s.status === "Pending"
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {s.status === "Approved" ? (
                        <Check className="w-4 h-4" />
                      ) : s.status === "Rejected" ? (
                        <X className="w-4 h-4" />
                      ) : (
                        s.step
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 text-center">{s.label}</span>
                    {(s.step === 3 || s.step === 4) && (
                      <span className="text-[8px] text-purple-600 font-medium">PARALLEL</span>
                    )}
                  </div>
                  {i < arr.length - 1 && <div className="h-0.5 flex-1 bg-slate-200 -mt-5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-[11px] text-slate-500">Estimated Cost</span>
              </div>
              <p className="text-[18px] font-semibold text-slate-900">{formatCurrency(freshPR.estimatedCost)}</p>
              {freshPR.requiresSeniorApproval && (
                <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Above $10K threshold
                </p>
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] text-slate-500">Method & Category</span>
              </div>
              <p className="text-[13px] font-semibold text-slate-900">{freshPR.purchaseType}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {freshPR.category} · {freshPR.quantity} {freshPR.unit}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] text-slate-500">Days in Stage</span>
              </div>
              <p className="text-[18px] font-semibold text-slate-900">{daysInStage}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                With {freshPR.currentResponsible ?? "Procurement Unit"}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck className="w-4 h-4 text-orange-600" />
                <span className="text-[11px] text-slate-500">Checklist Issues</span>
              </div>
              <p className="text-[18px] font-semibold text-slate-900">{issues.length}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {issues.length === 0 ? "Fully compliant" : "Outstanding against policy"}
              </p>
            </div>
          </div>

          {/* Compliance warnings — the Procurement Unit owns policy compliance */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Compliance Warnings</h3>
            {issues.length === 0 ? (
              <p className="text-[12px] text-slate-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                This requisition satisfies every pre-submission compliance rule.
              </p>
            ) : (
              <>
                <p className="text-[11px] text-slate-500 mb-3">
                  {issues.length} rule{issues.length === 1 ? "" : "s"} from the procurement policy checklist are not
                  satisfied. Resolve or document these before approving.
                </p>
                <div className="space-y-2">
                  {issues.map((issue, i) => (
                    <div
                      key={`${issue.field}-${i}`}
                      className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-orange-900">{issue.field}</p>
                        <p className="text-[11px] text-orange-800 mt-0.5">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Compliance & audit signals */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Compliance & Audit Signals</h3>
            {signals.length === 0 ? (
              <p className="text-[12px] text-slate-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                No exceptions recorded against this requisition.
              </p>
            ) : (
              <div className="space-y-3">
                {signals.map((signal) => (
                  <div key={signal.key} className={`rounded-lg border px-4 py-3 ${TONE_PANEL[signal.tone]}`}>
                    <div className="flex items-start gap-2.5">
                      {signal.tone === "critical" ? (
                        <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      ) : signal.tone === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      ) : (
                        <RotateCcw className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className={`text-[12px] font-semibold ${TONE_TEXT[signal.tone]}`}>{signal.label}</p>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${TONE_TEXT[signal.tone]}`}>
                          {signal.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Request details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Request Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Requisition Title</p>
                <p className="text-[13px] text-slate-900">{freshPR.requisitionTitle || freshPR.itemDescription}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Requested By</p>
                <p className="text-[13px] text-slate-900">
                  {freshPR.requestedBy} — {freshPR.department}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Date Requested</p>
                <p className="text-[13px] text-slate-900">{formatDate(freshPR.dateRequested)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Funding Source</p>
                <p className="text-[13px] text-slate-900">{freshPR.fundingSource ?? "Not specified"}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Linked Plan Item</p>
                <p className="text-[13px] text-slate-900">
                  {freshPR.linkedPlanItemId ?? (freshPR.emergencyOverride ? "None — emergency override" : "Not linked")}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Priority</p>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    freshPR.priority === "Urgent"
                      ? "bg-red-100 text-red-700"
                      : freshPR.priority === "High"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {freshPR.priority}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] text-slate-500 mb-1">Item Description</p>
                <p className="text-[13px] text-slate-900">{freshPR.itemDescription}</p>
              </div>
              {freshPR.directSelectionJustification && (
                <div className="col-span-2">
                  <p className="text-[11px] text-slate-500 mb-1">Direct Selection Justification</p>
                  <p className="text-[13px] text-slate-900">{freshPR.directSelectionJustification}</p>
                </div>
              )}
            </div>
          </div>

          {/* Approval history */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Approval History</h3>
            <div className="space-y-3">
              {freshPR.approvalHistory.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 bg-slate-50 rounded-lg">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      entry.action === "Approved"
                        ? "bg-green-100 text-green-600"
                        : entry.action === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {entry.action === "Approved" ? (
                      <Check className="w-3 h-3" />
                    ) : entry.action === "Rejected" ? (
                      <X className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-medium text-slate-900">
                        Step {entry.step} — {entry.role}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          entry.action === "Approved"
                            ? "bg-green-100 text-green-700"
                            : entry.action === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {entry.action}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{entry.comments}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {actionable && (
            <div>
              {!canApprove && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-3 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-amber-800">
                    You are signed in as {currentUser.name} ({currentUser.roles.join(", ")}) and cannot action this
                    queue — only the {REQUIRED_ROLES} role can approve or reject at this station.
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApprovePR(freshPR.id)}
                  disabled={!canApprove}
                  title={canApprove ? undefined : lockedReason}
                  className={`px-6 py-2.5 rounded-lg text-[13px] font-medium text-white transition-colors flex items-center gap-2 ${
                    canApprove ? "bg-green-600 hover:bg-green-700" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-4 h-4" /> Approve — Policy & Plan Verified
                </button>
                <button
                  onClick={() => {
                    setRejectError(null);
                    setRejectModalOpen(freshPR.id);
                  }}
                  disabled={!canApprove}
                  title={canApprove ? undefined : lockedReason}
                  className={`px-6 py-2.5 rounded-lg text-[13px] font-medium text-white transition-colors flex items-center gap-2 ${
                    canApprove ? "bg-red-600 hover:bg-red-700" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  <X className="w-4 h-4" /> Reject — Compliance Issue
                </button>
              </div>
            </div>
          )}
        </div>

        {rejectModalOpen && (
          <RejectDialog
            value={rejectComment}
            onChange={(value) => {
              setRejectComment(value);
              if (rejectError) setRejectError(null);
            }}
            error={rejectError}
            onCancel={closeRejectModal}
            onConfirm={() => handleRejectPR(rejectModalOpen)}
          />
        )}
      </div>
    );
  }

  // ── Queue ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Procurement Approvals</h1>
          <p className="text-[12px] text-slate-500 mt-1">
            Policy and plan alignment review (Step 3 — parallel with the Finance Team)
          </p>
        </div>
      </div>

      {/* Role gate */}
      {activeTab === "pr" && !canApprove && (
        <div className="px-6 pt-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
            <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-amber-900">
                You are signed in as {currentUser.name} ({currentUser.roles.join(", ")}) and cannot action the
                Procurement Unit queue.
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Only the {REQUIRED_ROLES} role can approve or reject here. You may still review requisitions and export
                the queue.
              </p>
            </div>
          </div>
        </div>
      )}
      {activeTab === "sourcing" && !canAwardSourcing && (
        <div className="px-6 pt-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
            <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-amber-900">
                You are signed in as {currentUser.name} ({currentUser.roles.join(", ")}) and cannot action the sourcing
                queue.
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Only the {SOURCING_ROLES} role can award or reject a sourcing case. You may still review the queue and
                export it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Queue KPIs */}
      <ProcurementStatCards
        stats={[
          {
            label: "Awaiting your decision",
            value: String(awaiting.length),
            sub: "Requisitions held at Procurement",
            icon: <Clock className="w-4 h-4" />,
            tone: "warning",
          },
          {
            label: "Oldest in queue",
            value: oldest ? `${computeDaysInStage(oldest)}d` : "—",
            sub: oldest ? oldest.requisitionNumber : "Nothing waiting",
            icon: <Timer className="w-4 h-4" />,
            tone: "danger",
          },
          {
            label: "Avg cycle time",
            value: `${stats.avgCycleTimeDays}d`,
            sub: "Submission to final approval",
            icon: <Gauge className="w-4 h-4" />,
            tone: "info",
          },
          {
            label: "Awaiting action (all stations)",
            value: String(stats.awaitingAction),
            sub: `${stats.total} requisitions on file`,
            icon: <CheckCircle className="w-4 h-4" />,
            tone: "accent",
          },
        ]}
      />

      {/* Tabs */}
      <ProcurementTabBar>
        <ProcurementTabs
          tabs={tabs}
          active={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setSearchQuery("");
            setSelectedStatus("All Statuses");
            setCurrentPage(1);
          }}
          minWidth={80}
        />
      </ProcurementTabBar>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <ExportMenu onExport={handleExport} />

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {(activeTab === "pr" ? PR_STATUSES : SOURCING_STATUSES).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                          setCurrentPage(1);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        {activeTab === "pr" ? (
          /* ── PR Approvals Table (Step 3 — Procurement Unit) ── */
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Requisition #</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Requested By</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Category</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Est. Cost</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Aging</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Compliance</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Finance (Parallel)</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Procurement</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedPRItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-[13px] text-slate-400">
                    No procurement requests found.
                  </td>
                </tr>
              ) : (
                pagedPRItems.map((pr) => {
                  const stationStatus = stationStatusOf(pr);
                  const actionable = stationStatus === "Pending";
                  const issueCount = validatePRForSubmission(pr).length;
                  return (
                    <tr
                      key={pr.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedPR(pr)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] font-medium text-slate-900">{pr.requisitionNumber}</p>
                          {pr.sourceType === "ESS Plan" && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-indigo-50 text-indigo-600">
                              ESS
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-900 max-w-[200px] truncate">{pr.itemDescription}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-500">{pr.requestedBy}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-500">{pr.department}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-500">{pr.category}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-[12px] text-slate-900">{formatCurrency(pr.estimatedCost)}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <AgingBadge days={computeDaysInStage(pr)} />
                      </td>
                      <td className="px-4 py-4">
                        <ComplianceCell signals={complianceSignals(pr)} issueCount={issueCount} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getApprovalStatusColor(
                            pr.financeApproval
                          )}`}
                          title={
                            pr.financeApproval === "Approved"
                              ? "The parallel Finance review has already cleared this requisition."
                              : "The parallel Finance review has not yet cleared this requisition."
                          }
                        >
                          {pr.financeApproval}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getApprovalStatusColor(
                            stationStatus ?? "N/A"
                          )}`}
                          title={
                            closedElsewhere(pr)
                              ? `Closed without a Procurement decision — rejected at ${
                                  pr.rejectedAtStage ?? "another station"
                                }.`
                              : undefined
                          }
                        >
                          {closedElsewhere(pr) ? "Closed" : stationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setOpenActionMenuId(openActionMenuId === pr.id ? null : pr.id)}
                            className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                          >
                            <MoreHorizontal size={20} className="text-blue-800" />
                          </button>
                          {openActionMenuId === pr.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                <button
                                  onClick={() => {
                                    setSelectedPR(pr);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                  <Eye size={14} /> View Details
                                </button>
                                {actionable && (
                                  <>
                                    <button
                                      onClick={() => handleApprovePR(pr.id)}
                                      disabled={!canApprove}
                                      title={canApprove ? undefined : lockedReason}
                                      className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                                        canApprove
                                          ? "text-green-700 hover:bg-green-50"
                                          : "text-slate-300 cursor-not-allowed"
                                      }`}
                                    >
                                      <Check size={14} /> Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRejectError(null);
                                        setRejectModalOpen(pr.id);
                                        setOpenActionMenuId(null);
                                      }}
                                      disabled={!canApprove}
                                      title={canApprove ? undefined : lockedReason}
                                      className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                                        canApprove ? "text-red-600 hover:bg-red-50" : "text-slate-300 cursor-not-allowed"
                                      }`}
                                    >
                                      <X size={14} /> Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : (
          /* ── Sourcing Approvals Table ── */
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">RFQ Number</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Title</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Source PR</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Project</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Vendor</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Est. Value</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date Submitted</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedSourcingItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[13px] text-slate-400">
                    No sourcing cases found.
                  </td>
                </tr>
              ) : (
                pagedSourcingItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-slate-900">{item.rfqNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-900">{item.title}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-xl text-[12px] bg-indigo-50 text-indigo-700">
                        {item.sourcePR}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-600">{item.projectName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{item.vendor}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-900">{formatCurrency(item.estimatedValue)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-500">{formatDate(item.dateSubmitted)}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getApprovalStatusColor(
                          item.approvalStatus
                        )}`}
                      >
                        {item.approvalStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionMenuId(openActionMenuId === item.id ? null : item.id)}
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} className="text-blue-800" />
                        </button>
                        {openActionMenuId === item.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              {item.approvalStatus === "Pending" ? (
                                <>
                                  <button
                                    onClick={() => handleApproveSourcing(item.id)}
                                    disabled={!canAwardSourcing}
                                    title={canAwardSourcing ? undefined : sourcingLockedReason}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                                      canAwardSourcing
                                        ? "text-green-700 hover:bg-green-50"
                                        : "text-slate-300 cursor-not-allowed"
                                    }`}
                                  >
                                    <Check size={14} /> Approve & Create PO
                                  </button>
                                  <button
                                    onClick={() => handleRejectSourcing(item.id)}
                                    disabled={!canAwardSourcing}
                                    title={canAwardSourcing ? undefined : sourcingLockedReason}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                                      canAwardSourcing
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-slate-300 cursor-not-allowed"
                                    }`}
                                  >
                                    <X size={14} /> Reject
                                  </button>
                                </>
                              ) : (
                                <p className="px-4 py-2 text-sm text-slate-400">
                                  Already {item.approvalStatus.toLowerCase()}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <span className="text-sm text-slate-500">
            {activeCount === 0
              ? "No records"
              : `${pageStart + 1}–${Math.min(pageStart + itemsPerPage, activeCount)} of ${activeCount}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => Math.abs(n - page) <= 2 || n === 1 || n === totalPages)
            .map((n, i, shown) => (
              <span key={n} className="flex items-center gap-2">
                {i > 0 && shown[i - 1] !== n - 1 && <span className="text-sm text-slate-400">…</span>}
                <button
                  onClick={() => setCurrentPage(n)}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    n === page ? "bg-pink-50 text-pink-600" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {n}
                </button>
              </span>
            ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronDown size={16} className="-rotate-90 text-pink-600" />
          </button>
        </div>
      </div>

      {/* Reject Modal for PR */}
      {rejectModalOpen && (
        <RejectDialog
          value={rejectComment}
          onChange={(value) => {
            setRejectComment(value);
            if (rejectError) setRejectError(null);
          }}
          error={rejectError}
          onCancel={closeRejectModal}
          onConfirm={() => handleRejectPR(rejectModalOpen)}
        />
      )}
    </div>
  );
}
