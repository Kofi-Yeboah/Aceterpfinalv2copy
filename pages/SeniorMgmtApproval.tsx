import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Gauge,
  Lock,
  Printer,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  Timer,
  X as XIcon,
} from "lucide-react";
import {
  approvePRSeniorMgmt,
  checkPlanVariance,
  computeDaysInStage,
  getGeneratedPRs,
  getPRStats,
  getPRsAwaiting,
  grantEmergencyOverride,
  rejectPRSeniorMgmt,
  subscribe,
  type GeneratedPR,
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
} from "../components/procurement/ProcurementTabs";
import { ProcurementStatCards } from "../components/procurement/ProcurementStatCards";

// Senior Management station (step 5). Only requisitions above the $10,000
// threshold reach it, and it is also where an off-plan requisition can be
// authorised by emergency override.
const APPROVE_CAPABILITY: Capability = "pr.approveSenior";
const OVERRIDE_CAPABILITY: Capability = "plan.emergencyOverride";
const QUEUE_ROLE = "Senior Management" as const;
const REQUIRED_ROLES = requiredRolesFor(APPROVE_CAPABILITY).join(" or ");
const OVERRIDE_ROLES = requiredRolesFor(OVERRIDE_CAPABILITY).join(" or ");

const tabs = ["All", "Pending", "Approved", "Rejected"] as const;
type TabType = (typeof tabs)[number];
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

function ComplianceCell({ signals }: { signals: ComplianceSignal[] }) {
  if (!signals.length) {
    return <span className="text-[11px] text-slate-300">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1 max-w-[170px]">
      {signals.map((signal) => (
        <span
          key={signal.key}
          title={signal.detail}
          className={`px-1.5 py-0.5 rounded border text-[9px] font-medium whitespace-nowrap ${TONE_BADGE[signal.tone]}`}
        >
          {signal.label}
        </span>
      ))}
    </div>
  );
}

function CompliancePanel({ signals }: { signals: ComplianceSignal[] }) {
  return (
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
                  <p className={`text-[11px] mt-0.5 leading-relaxed ${TONE_TEXT[signal.tone]}`}>{signal.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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

function AccessBanner() {
  const user = getCurrentUser();
  return (
    <div className="px-6 pt-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-[12px] font-semibold text-amber-900">
            You are signed in as {user.name} ({user.roles.join(", ")}) and cannot action the Senior Management queue.
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5">
            Only the {REQUIRED_ROLES} role can grant or refuse final approval here. You may still review requisitions
            and export the queue.
          </p>
        </div>
      </div>
    </div>
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
        className="px-4 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "#0B01D0" }}
      >
        <Download className="w-4 h-4" /> Export <ChevronDown className="w-3.5 h-3.5" />
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

function ReasonDialog({
  title,
  prompt,
  placeholder,
  hint,
  confirmLabel,
  tone,
  value,
  onChange,
  error,
  onCancel,
  onConfirm,
}: {
  title: string;
  prompt: string;
  placeholder: string;
  hint: string;
  confirmLabel: string;
  tone: "danger" | "warning";
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const empty = !value.trim();
  const enabledClass = tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700";
  const disabledClass = tone === "danger" ? "bg-red-300" : "bg-amber-300";
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-[15px] font-semibold text-slate-900 mb-3">{title}</h3>
        <p className="text-[12px] text-slate-500 mb-4">{prompt}</p>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`w-full border rounded-lg px-3 py-2.5 text-[12px] text-slate-900 outline-none resize-none ${
            error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-red-400"
          }`}
          placeholder={placeholder}
        />
        <p className={`text-[11px] mt-2 ${error ? "text-red-600" : "text-slate-400"}`}>{error ?? hint}</p>
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
            title={empty ? "Enter a written justification to continue." : undefined}
            className={`px-4 py-2 text-[12px] text-white rounded-lg transition-colors font-medium ${
              empty ? `${disabledClass} cursor-not-allowed` : enabledClass
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Export shape ────────────────────────────────────────────────────────────

function toExportRow(pr: GeneratedPR, stationStatus: StationStatus | null) {
  return {
    requisitionNumber: pr.requisitionNumber,
    title: pr.requisitionTitle || pr.itemDescription,
    requestedBy: pr.requestedBy,
    department: pr.department,
    category: pr.category,
    estimatedCost: pr.estimatedCost,
    fundingSource: pr.fundingSource ?? "",
    dateRequested: pr.dateRequested,
    daysInStage: computeDaysInStage(pr),
    deptDecision: pr.deptApproval,
    procurementDecision: pr.procurementApproval,
    financeDecision: pr.financeApproval,
    seniorDecision: stationStatus ?? "Not in queue",
    emergencyOverride: pr.emergencyOverride ? `Yes — ${pr.emergencyOverrideApprovedBy ?? "unattributed"}` : "No",
    overallStatus: pr.overallApprovalStatus,
    complianceFlags: complianceSignals(pr)
      .map((s) => s.label)
      .join("; "),
  };
}

type ExportRow = ReturnType<typeof toExportRow>;

const EXPORT_COLUMNS: ExportColumn<ExportRow>[] = [
  { key: "requisitionNumber", header: "Requisition #" },
  { key: "title", header: "Title" },
  { key: "requestedBy", header: "Requested By" },
  { key: "department", header: "Department" },
  { key: "category", header: "Category" },
  { key: "estimatedCost", header: "Estimated Cost (USD)" },
  { key: "fundingSource", header: "Funding Source" },
  { key: "dateRequested", header: "Date Requested" },
  { key: "daysInStage", header: "Days in Stage" },
  { key: "deptDecision", header: "Dept Head" },
  { key: "procurementDecision", header: "Procurement" },
  { key: "financeDecision", header: "Finance" },
  { key: "seniorDecision", header: "Senior Mgmt Decision" },
  { key: "emergencyOverride", header: "Emergency Override" },
  { key: "overallStatus", header: "Overall Status" },
  { key: "complianceFlags", header: "Compliance Flags" },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export function SeniorMgmtApproval() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<GeneratedPR | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [overrideModalOpen, setOverrideModalOpen] = useState<string | null>(null);
  const [overrideJustification, setOverrideJustification] = useState("");
  const [overrideError, setOverrideError] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Re-render on store writes and on a role switch, so the gates below always
  // reflect who is actually signed in.
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
  const canOverride = can(OVERRIDE_CAPABILITY);
  const overrideLockedReason = denialReason(OVERRIDE_CAPABILITY);

  const allPRs = getGeneratedPRs();
  // Single source of truth for "what is waiting on this station", shared by all
  // four approval screens so their filters cannot drift apart.
  const awaiting = getPRsAwaiting(QUEUE_ROLE);
  const awaitingIds = new Set(awaiting.map((pr) => pr.id));

  const stationStatusOf = (pr: GeneratedPR): StationStatus | null => {
    if (awaitingIds.has(pr.id)) return "Pending";
    if (pr.seniorMgmtApproval === "Approved") return "Approved";
    if (pr.seniorMgmtApproval === "Rejected") return "Rejected";
    return null;
  };

  // Only high-value requisitions reach this station; withdrawn ones are no
  // longer actionable by anyone.
  const seniorPRs = allPRs.filter(
    (pr) => stationStatusOf(pr) !== null && pr.overallApprovalStatus !== "Withdrawn"
  );

  const filteredRequests = seniorPRs.filter((pr) => {
    const matchesTab = activeTab === "All" || stationStatusOf(pr) === activeTab;
    const needle = searchQuery.toLowerCase();
    const matchesSearch =
      pr.requisitionNumber.toLowerCase().includes(needle) ||
      pr.itemDescription.toLowerCase().includes(needle) ||
      (pr.requisitionTitle ?? "").toLowerCase().includes(needle) ||
      pr.requestedBy.toLowerCase().includes(needle);
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<TabType, number> = {
    All: seniorPRs.length,
    Pending: seniorPRs.filter((pr) => stationStatusOf(pr) === "Pending").length,
    Approved: seniorPRs.filter((pr) => stationStatusOf(pr) === "Approved").length,
    Rejected: seniorPRs.filter((pr) => stationStatusOf(pr) === "Rejected").length,
  };

  const queueTabs: ProcurementTab<TabType>[] = tabs.map((tab) => ({
    key: tab,
    label: tab,
    count: tabCounts[tab],
  }));

  const stats = getPRStats();
  const oldest = awaiting.reduce<GeneratedPR | null>(
    (worst, pr) => (!worst || computeDaysInStage(pr) > computeDaysInStage(worst) ? pr : worst),
    null
  );

  const closeRejectModal = () => {
    setRejectModalOpen(null);
    setRejectComment("");
    setRejectError(null);
  };

  const closeOverrideModal = () => {
    setOverrideModalOpen(null);
    setOverrideJustification("");
    setOverrideError(null);
  };

  const handleApprove = (id: string) => {
    if (!canApprove) return;
    approvePRSeniorMgmt(id, "", currentUser.name);
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    if (!canApprove) {
      setRejectError(lockedReason);
      return;
    }
    const reason = rejectComment.trim();
    if (!reason) {
      setRejectError("A documented reason is required when rejecting a requisition.");
      return;
    }
    const result = rejectPRSeniorMgmt(id, reason, currentUser.name);
    if (!result.ok) {
      setRejectError(result.error ?? "The rejection could not be recorded.");
      return;
    }
    closeRejectModal();
    setSelectedRequest(null);
  };

  const handleGrantOverride = (id: string) => {
    if (!canOverride) {
      setOverrideError(overrideLockedReason);
      return;
    }
    const justification = overrideJustification.trim();
    if (!justification) {
      setOverrideError("An emergency override requires a written justification.");
      return;
    }
    const result = grantEmergencyOverride(id, justification, currentUser.name);
    if (!result.ok) {
      setOverrideError(result.error ?? "The emergency override could not be recorded.");
      return;
    }
    closeOverrideModal();
  };

  const handleExport = (format: "excel" | "pdf" | "csv") => {
    const rows = filteredRequests.map((pr) => toExportRow(pr, stationStatusOf(pr)));
    const title = "Senior Management Requisition Approvals";
    const meta = {
      subtitle: `${activeTab} view — ${rows.length} requisition${rows.length === 1 ? "" : "s"}${
        searchQuery ? ` matching "${searchQuery}"` : ""
      }`,
      generatedBy: currentUser.name,
    };
    if (format === "excel") exportToExcel(title, EXPORT_COLUMNS, rows, meta);
    else if (format === "pdf") exportToPDF(title, EXPORT_COLUMNS, rows, meta);
    else exportToCSV(title, EXPORT_COLUMNS, rows);
  };

  if (selectedRequest) {
    // Always render from the store so the panel reflects concurrent decisions.
    const freshPR = allPRs.find((pr) => pr.id === selectedRequest.id) || selectedRequest;
    const actionable = stationStatusOf(freshPR) === "Pending";
    const signals = complianceSignals(freshPR);
    const daysInStage = computeDaysInStage(freshPR);
    const offPlan = !freshPR.linkedPlanItemId;

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSelectedRequest(null)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-semibold text-slate-900">
                Senior Management Review — {freshPR.requisitionNumber}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-100 text-amber-700">
                &gt; $10,000 Threshold
              </span>
              {freshPR.emergencyOverride && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-700 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Emergency Override
                </span>
              )}
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">Final approval for high-value procurement requests</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-medium ${
              freshPR.seniorMgmtApproval === "Pending"
                ? "bg-amber-100 text-amber-700"
                : freshPR.seniorMgmtApproval === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {freshPR.overallApprovalStatus}
          </span>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Workflow */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <h3 className="text-[13px] font-semibold text-slate-900 mb-4">Approval Workflow — Final Step</h3>
            <div className="flex items-center gap-3">
              {[
                { label: "Submitted", step: 1, status: "Approved" as const },
                { label: "Dept Head", step: 2, status: freshPR.deptApproval },
                { label: "Procurement", step: 3, status: freshPR.procurementApproval },
                { label: "Finance", step: 4, status: freshPR.financeApproval },
                { label: "Senior Mgmt", step: 5, status: freshPR.seniorMgmtApproval },
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
                        <XIcon className="w-4 h-4" />
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

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-[11px] text-slate-500">Estimated Cost</span>
              </div>
              <p className="text-[20px] font-semibold text-slate-900">${freshPR.estimatedCost.toLocaleString()}</p>
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Exceeds $10,000 threshold
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-[11px] text-slate-500">Prior Approvals</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    freshPR.deptApproval === "Approved" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Dept: {freshPR.deptApproval}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    freshPR.procurementApproval === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Proc: {freshPR.procurementApproval}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    freshPR.financeApproval === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Fin: {freshPR.financeApproval}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Procurement and Finance reviewed in parallel</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] text-slate-500">Days in Stage</span>
              </div>
              <p className="text-[20px] font-semibold text-slate-900">{daysInStage}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                With {freshPR.currentResponsible ?? "Senior Management"}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] text-slate-500">Priority</span>
              </div>
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
              <p className="text-[11px] text-slate-500 mt-2">
                {freshPR.category} — {freshPR.purchaseType}
              </p>
            </div>
          </div>

          {/* Compliance & Audit Signals */}
          <CompliancePanel signals={signals} />

          {/* Emergency override authorisation */}
          <div
            className={`rounded-xl border p-6 mb-6 ${
              freshPR.emergencyOverride ? "bg-red-50 border-red-200" : "bg-white border-slate-200"
            }`}
          >
            <h3 className="text-[14px] font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${freshPR.emergencyOverride ? "text-red-600" : "text-amber-600"}`} />
              Emergency Override
            </h3>
            {freshPR.emergencyOverride ? (
              <div className="text-[12px] text-red-800 space-y-1">
                <p className="font-semibold">
                  Granted by {freshPR.emergencyOverrideApprovedBy ?? "an unrecorded approver"}.
                </p>
                <p className="text-[11px] leading-relaxed">
                  Justification: {freshPR.emergencyOverrideJustification ?? "Not recorded."}
                </p>
                <p className="text-[11px] leading-relaxed">
                  This requisition proceeds without an approved procurement plan item. The exception is recorded in the
                  audit trail and reported to Internal Audit.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[12px] text-slate-500 mb-4">
                  {offPlan
                    ? "This requisition is not linked to an approved procurement plan activity. Senior Management may authorise it to proceed off-plan against a written justification — an audit exception."
                    : `This requisition is linked to plan item ${freshPR.linkedPlanItemId}. An override is only needed where a requisition must proceed without an approved plan activity.`}
                </p>
                {!canOverride && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-3 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[12px] text-amber-800">
                      You are signed in as {currentUser.name} ({currentUser.roles.join(", ")}) and cannot grant an
                      emergency override — that authority rests with the {OVERRIDE_ROLES} role.
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setOverrideError(null);
                    setOverrideModalOpen(freshPR.id);
                  }}
                  disabled={!canOverride}
                  title={canOverride ? undefined : overrideLockedReason}
                  className={`px-5 py-2.5 rounded-lg text-[13px] font-medium text-white transition-colors flex items-center gap-2 ${
                    canOverride ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" /> Grant Emergency Override
                </button>
              </>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Request Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Requested By</p>
                <p className="text-[13px] text-slate-900">
                  {freshPR.requestedBy} — {freshPR.department}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Date Requested</p>
                <p className="text-[13px] text-slate-900">{freshPR.dateRequested}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Quantity</p>
                <p className="text-[13px] text-slate-900">
                  {freshPR.quantity} {freshPR.unit}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Source</p>
                <p className="text-[13px] text-slate-900">{freshPR.sourceType}</p>
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
              <div className="col-span-2">
                <p className="text-[11px] text-slate-500 mb-1">Description</p>
                <p className="text-[13px] text-slate-900">{freshPR.itemDescription}</p>
              </div>
            </div>
          </div>

          {/* Approval History */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Full Approval Chain</h3>
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
                      <XIcon className="w-3 h-3" />
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

          {actionable && (
            <div>
              {!canApprove && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-3 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-amber-800">
                    You are signed in as {currentUser.name} ({currentUser.roles.join(", ")}) and cannot action this
                    queue — only the {REQUIRED_ROLES} role can grant or refuse final approval.
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApprove(freshPR.id)}
                  disabled={!canApprove}
                  title={canApprove ? undefined : lockedReason}
                  className={`px-6 py-2.5 rounded-lg text-[13px] font-medium text-white transition-colors flex items-center gap-2 ${
                    canApprove ? "bg-green-600 hover:bg-green-700" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-4 h-4" /> Grant Final Approval
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
                  <XIcon className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {rejectModalOpen && (
          <ReasonDialog
            title="Reject — Senior Management"
            prompt="Provide reason for rejection:"
            placeholder="e.g., Exceeds budget ceiling, requires board approval..."
            hint="A documented reason is mandatory — it is sent to the requester and stored in the approval history."
            confirmLabel="Confirm Rejection"
            tone="danger"
            value={rejectComment}
            onChange={(value) => {
              setRejectComment(value);
              if (rejectError) setRejectError(null);
            }}
            error={rejectError}
            onCancel={closeRejectModal}
            onConfirm={() => handleReject(rejectModalOpen)}
          />
        )}

        {overrideModalOpen && (
          <ReasonDialog
            title="Grant Emergency Override"
            prompt="Authorise this requisition to proceed without an approved procurement plan item:"
            placeholder="e.g., Emergency medical supplies required for flood response; plan revision under way..."
            hint="This is an audit exception. The justification is recorded in the approval history and reported to Internal Audit."
            confirmLabel="Authorise Override"
            tone="warning"
            value={overrideJustification}
            onChange={(value) => {
              setOverrideJustification(value);
              if (overrideError) setOverrideError(null);
            }}
            error={overrideError}
            onCancel={closeOverrideModal}
            onConfirm={() => handleGrantOverride(overrideModalOpen)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">Senior Management Approval</h1>
            <p className="text-[12px] text-slate-500 mt-1">
              Final approval for procurement requests exceeding $10,000 (Step 5)
            </p>
          </div>
          <ExportMenu onExport={handleExport} />
        </div>
      </div>

      {/* Role gate */}
      {!canApprove && <AccessBanner />}

      {/* Queue KPIs */}
      <ProcurementStatCards
        stats={[
          {
            label: "Awaiting your decision",
            value: String(awaiting.length),
            sub: "High-value requisitions held at Senior Mgmt",
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

      <ProcurementTabBar>
        <ProcurementTabs tabs={queueTabs} active={activeTab} onChange={setActiveTab} minWidth={100} />
      </ProcurementTabBar>

      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by PR number, description, requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">PR Number</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Description</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Requester</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Est. Cost</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Aging</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Compliance</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Priority</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-[13px] text-slate-400">
                  No high-value procurement requests pending senior approval.
                </td>
              </tr>
            ) : (
              filteredRequests.map((pr, index) => {
                const stationStatus = stationStatusOf(pr);
                const actionable = stationStatus === "Pending";
                const canOfferOverride = !pr.emergencyOverride && !pr.linkedPlanItemId;
                return (
                  <tr
                    key={pr.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                    onClick={() => setSelectedRequest(pr)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-purple-700 font-medium">{pr.requisitionNumber}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-900 max-w-[220px] truncate">
                      {pr.itemDescription}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] text-slate-900">{pr.requestedBy}</p>
                        <p className="text-[11px] text-slate-400">{pr.department}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-900 text-right font-medium">
                      ${pr.estimatedCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">{pr.category}</td>
                    <td className="px-4 py-3">
                      <AgingBadge days={computeDaysInStage(pr)} />
                    </td>
                    <td className="px-4 py-3">
                      <ComplianceCell signals={complianceSignals(pr)} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          pr.priority === "Urgent"
                            ? "bg-red-100 text-red-700"
                            : pr.priority === "High"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {pr.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          stationStatus === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : stationStatus === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedRequest(pr)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {actionable && (
                          <>
                            <button
                              onClick={() => handleApprove(pr.id)}
                              disabled={!canApprove}
                              className={`p-1.5 rounded-lg transition-colors ${
                                canApprove
                                  ? "hover:bg-green-50 text-slate-500 hover:text-green-600"
                                  : "text-slate-300 cursor-not-allowed"
                              }`}
                              title={canApprove ? "Approve" : lockedReason}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setRejectError(null);
                                setRejectModalOpen(pr.id);
                              }}
                              disabled={!canApprove}
                              className={`p-1.5 rounded-lg transition-colors ${
                                canApprove
                                  ? "hover:bg-red-50 text-slate-500 hover:text-red-600"
                                  : "text-slate-300 cursor-not-allowed"
                              }`}
                              title={canApprove ? "Reject" : lockedReason}
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {canOfferOverride && (
                          <button
                            onClick={() => {
                              setOverrideError(null);
                              setOverrideModalOpen(pr.id);
                            }}
                            disabled={!canOverride}
                            className={`p-1.5 rounded-lg transition-colors ${
                              canOverride
                                ? "hover:bg-amber-50 text-slate-500 hover:text-amber-600"
                                : "text-slate-300 cursor-not-allowed"
                            }`}
                            title={
                              canOverride
                                ? "Grant emergency override — authorise this off-plan requisition"
                                : overrideLockedReason
                            }
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {rejectModalOpen && !selectedRequest && (
        <ReasonDialog
          title="Reject — Senior Management"
          prompt="Provide reason for rejection:"
          placeholder="e.g., Exceeds budget ceiling, requires board approval..."
          hint="A documented reason is mandatory — it is sent to the requester and stored in the approval history."
          confirmLabel="Confirm Rejection"
          tone="danger"
          value={rejectComment}
          onChange={(value) => {
            setRejectComment(value);
            if (rejectError) setRejectError(null);
          }}
          error={rejectError}
          onCancel={closeRejectModal}
          onConfirm={() => handleReject(rejectModalOpen)}
        />
      )}

      {overrideModalOpen && !selectedRequest && (
        <ReasonDialog
          title="Grant Emergency Override"
          prompt="Authorise this requisition to proceed without an approved procurement plan item:"
          placeholder="e.g., Emergency medical supplies required for flood response; plan revision under way..."
          hint="This is an audit exception. The justification is recorded in the approval history and reported to Internal Audit."
          confirmLabel="Authorise Override"
          tone="warning"
          value={overrideJustification}
          onChange={(value) => {
            setOverrideJustification(value);
            if (overrideError) setOverrideError(null);
          }}
          error={overrideError}
          onCancel={closeOverrideModal}
          onConfirm={() => handleGrantOverride(overrideModalOpen)}
        />
      )}
    </div>
  );
}
