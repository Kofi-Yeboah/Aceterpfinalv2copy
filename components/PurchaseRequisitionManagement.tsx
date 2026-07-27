import { useState, useEffect, useMemo } from "react";
import {
  Search, Download, ChevronDown, MoreHorizontal, X, ArrowLeft, Plus, Check, Clock, User,
  AlertCircle, AlertTriangle, Paperclip, Upload, Undo2, RotateCcw, ShieldAlert, FileSpreadsheet,
  FileText, FileDown, Timer, Layers,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { ProcurementTabs, ProcurementTabBar } from "./procurement/ProcurementTabs";
import { ProcurementStatCards } from "./procurement/ProcurementStatCards";
import {
  getGeneratedPRs,
  getApprovedPlanItems,
  createDirectRequisition,
  submitPRForApproval,
  validatePRForSubmission,
  checkPlanVariance,
  recordPlanVarianceComment,
  computeDaysInStage,
  getPRStats,
  getPRsAwaiting,
  withdrawPR,
  resubmitPR,
  grantEmergencyOverride,
  subscribe,
  type GeneratedPR,
  type PROverallStatus,
  type PRValidationIssue,
} from "../lib/procurementStore";
import {
  PROCUREMENT_METHODS,
  suggestProcurementMethod,
  validateMethodAgainstThreshold,
  canonicalMethod,
  isDirect,
  getThreshold,
  formatBand,
  SENIOR_APPROVAL_THRESHOLD,
  type ProcurementMethod,
} from "../lib/procurementThresholds";
import {
  getCurrentUser,
  can,
  denialReason,
  hasRole,
  subscribe as subscribeUser,
  type ProcurementRole,
} from "../lib/currentUser";
import { pickFiles, openFile, FileValidationError, type UploadedFile } from "../lib/fileUpload";
import { exportToCSV, exportToExcel, exportToPDF, type ExportColumn } from "../lib/exportUtils";

/* ─── Reference data ─────────────────────────────────────────────────────────── */

const DEPARTMENTS = [
  "All Departments", "IT", "HR", "Finance", "Operations", "Marketing", "Facilities",
  "Programs", "Procurement", "Executive", "Internal Audit",
];
const PRIORITIES = ["All Priorities", "Low", "Medium", "High", "Urgent"];
const FUNDING_SOURCES = ["TAP", "ATTP", "Gates Foundation", "World Bank", "AfDB", "Government of Ghana", "Internal"];
const PROCUREMENT_CATEGORIES = ["Goods", "Services", "Works", "Consultancy"];
const UNITS = ["lot", "units", "sets", "engagement", "licence", "contract", "programme"];

const PR_STATUSES: PROverallStatus[] = [
  "Draft", "Submitted", "Pending Dept Approval", "Pending Procurement & Finance",
  "Pending Senior Mgmt", "Approved", "Rejected", "Withdrawn", "Converted to Sourcing",
];

const WORKFLOW_STEPS = [
  { step: 1, label: "Submission", role: "Requesting Officer" },
  { step: 2, label: "Dept Approval", role: "Department Head" },
  { step: 3, label: "Procurement Review", role: "Procurement Unit" },
  { step: 4, label: "Finance Review", role: "Finance Team" },
  { step: 5, label: "Sr. Mgmt Approval", role: "Senior Management" },
];

/** The approval stations a signed-in user can be queued work at. */
const APPROVER_ROLES: ProcurementRole[] = ["Department Head", "Procurement", "Finance", "Senior Management"];

const EDITABLE_STATUSES: PROverallStatus[] = ["Draft", "Submitted", "Pending Dept Approval", "Pending Procurement & Finance", "Pending Senior Mgmt"];

/* ─── Formatting ─────────────────────────────────────────────────────────────── */

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved": return "bg-green-50 text-green-600";
    case "Draft": return "bg-slate-100 text-slate-600";
    case "Submitted": return "bg-orange-50 text-orange-600";
    case "Converted to Sourcing": return "bg-purple-50 text-purple-600";
    case "Rejected": return "bg-red-50 text-red-600";
    case "Withdrawn": return "bg-stone-100 text-stone-600";
    case "Pending Dept Approval": return "bg-amber-50 text-amber-600";
    case "Pending Procurement & Finance": return "bg-indigo-50 text-indigo-600";
    case "Pending Senior Mgmt": return "bg-violet-50 text-violet-600";
    default: return "bg-slate-50 text-slate-600";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgent": return "bg-red-50 text-red-600";
    case "High": return "bg-orange-50 text-orange-600";
    case "Medium": return "bg-yellow-50 text-yellow-600";
    case "Low": return "bg-green-50 text-green-600";
    default: return "bg-slate-50 text-slate-600";
  }
};

const getPurchaseTypeColor = (purchaseType: string) => {
  switch (canonicalMethod(purchaseType)) {
    case "Direct Selection": return "bg-emerald-50 text-emerald-600";
    case "Open Competition": return "bg-blue-50 text-blue-600";
    case "Request for Quotation": return "bg-cyan-50 text-cyan-600";
    case "Limited Competition": return "bg-amber-50 text-amber-600";
    default: return "bg-slate-50 text-slate-600";
  }
};

/* ─── Export shape ───────────────────────────────────────────────────────────── */

type ExportRow = {
  requisitionNumber: string;
  requisitionTitle: string;
  requestedBy: string;
  department: string;
  category: string;
  purchaseType: string;
  estimatedCost: number;
  fundingSource: string;
  planItem: string;
  status: string;
  currentResponsible: string;
  daysInStage: number;
  dateRequested: string;
};

const EXPORT_COLUMNS: ExportColumn<ExportRow>[] = [
  { key: "requisitionNumber", header: "Requisition #" },
  { key: "requisitionTitle", header: "Title" },
  { key: "requestedBy", header: "Requested By" },
  { key: "department", header: "Department" },
  { key: "category", header: "Category" },
  { key: "purchaseType", header: "Procurement Method" },
  { key: "estimatedCost", header: "Estimated Cost (USD)" },
  { key: "fundingSource", header: "Funding Source" },
  { key: "planItem", header: "Plan Activity" },
  { key: "status", header: "Status" },
  { key: "currentResponsible", header: "Currently With" },
  { key: "daysInStage", header: "Days in Stage" },
  { key: "dateRequested", header: "Date Requested" },
];

const toExportRow = (pr: GeneratedPR): ExportRow => ({
  requisitionNumber: pr.requisitionNumber,
  requisitionTitle: pr.requisitionTitle || pr.itemDescription,
  requestedBy: pr.requestedBy,
  department: pr.department,
  category: pr.category,
  purchaseType: pr.purchaseType,
  estimatedCost: pr.estimatedCost,
  fundingSource: pr.fundingSource ?? "",
  planItem: pr.linkedPlanItemId ?? (pr.emergencyOverride ? "Emergency override" : "Not linked"),
  status: pr.overallApprovalStatus,
  currentResponsible: pr.currentResponsible ?? "—",
  daysInStage: computeDaysInStage(pr),
  dateRequested: pr.dateRequested,
});

/* ─── Form model ─────────────────────────────────────────────────────────────── */

interface ShortlistEntry {
  name: string;
  address: string;
  email: string;
}

interface RequisitionFormState {
  title: string;
  entityType: "Individual" | "Firm";
  description: string;
  department: string;
  estimatedCost: string;
  quantity: string;
  unit: string;
  fundingSource: string;
  category: string;
  method: ProcurementMethod;
  methodDeviationJustification: string;
  priority: string;
  linkedPlanItemId: string;
  emergencyOverride: boolean;
  emergencyOverrideJustification: string;
  deliveryTimeline: string;
  serviceStartDate: string;
  serviceEndDate: string;
  directSelectionJustification: string;
  requestedBy: string;
  planVarianceComment: string;
}

const EMERGENCY_OPTION = "__emergency__";

function blankForm(requestedBy: string, department: string): RequisitionFormState {
  return {
    title: "",
    entityType: "Firm",
    description: "",
    department,
    estimatedCost: "",
    quantity: "1",
    unit: "lot",
    fundingSource: FUNDING_SOURCES[0],
    category: "Goods",
    method: "Request for Quotation",
    methodDeviationJustification: "",
    priority: "Medium",
    linkedPlanItemId: "",
    emergencyOverride: false,
    emergencyOverrideJustification: "",
    deliveryTimeline: "",
    serviceStartDate: "",
    serviceEndDate: "",
    directSelectionJustification: "",
    requestedBy,
    planVarianceComment: "",
  };
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function PurchaseRequisitionManagement() {
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedPurchaseType, setSelectedPurchaseType] = useState("All Purchase Types");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showPurchaseTypeDropdown, setShowPurchaseTypeDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [activeScope, setActiveScope] = useState("all");
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<GeneratedPR | null>(null);
  const [withdrawReason, setWithdrawReason] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [resubmitTarget, setResubmitTarget] = useState<GeneratedPR | null>(null);
  const [resubmitComments, setResubmitComments] = useState("");
  const [resubmitCost, setResubmitCost] = useState("");
  const [resubmitFiles, setResubmitFiles] = useState<UploadedFile[]>([]);
  const [resubmitError, setResubmitError] = useState("");
  const [resubmitIssues, setResubmitIssues] = useState<PRValidationIssue[]>([]);
  const [submitFeedback, setSubmitFeedback] = useState<{ id: string; error: string; issues: PRValidationIssue[] } | null>(null);

  // Store + identity subscriptions
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubStore = subscribe(() => setTick((t) => t + 1));
    const unsubUser = subscribeUser(() => setTick((t) => t + 1));
    return () => { unsubStore(); unsubUser(); };
  }, []);

  const currentUser = getCurrentUser();
  const requisitions = getGeneratedPRs();
  const approvedPlanItems = getApprovedPlanItems();
  const stats = getPRStats();

  // New requisition form
  const [form, setForm] = useState<RequisitionFormState>(() => blankForm(currentUser.name, currentUser.department));
  const [formFiles, setFormFiles] = useState<UploadedFile[]>([]);
  const [formIssues, setFormIssues] = useState<PRValidationIssue[]>([]);
  const [formError, setFormError] = useState("");
  const [formShortlist, setFormShortlist] = useState<ShortlistEntry[]>([{ name: "", address: "", email: "" }]);
  const [formTouched, setFormTouched] = useState(false);

  const setField = <K extends keyof RequisitionFormState>(field: K, value: RequisitionFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError("");
  };

  const resetForm = () => {
    setForm(blankForm(currentUser.name, currentUser.department));
    setFormFiles([]);
    setFormIssues([]);
    setFormError("");
    setFormShortlist([{ name: "", address: "", email: "" }]);
    setFormTouched(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    resetForm();
    setShowAddModal(false);
  };

  /* ── Candidate requisition, so the store's own gate drives the form ───────── */

  const parsedCost = parseFloat(form.estimatedCost) || 0;
  const needsShortlist = isDirect(form.method) || form.method === "Limited Competition";

  const buildPayload = () => {
    const shortlist = needsShortlist
      ? formShortlist.filter((e) => e.name.trim() || e.address.trim() || e.email.trim())
      : undefined;
    return {
      requisitionTitle: form.title.trim(),
      itemDescription: form.description.trim(),
      requestedBy: form.requestedBy.trim(),
      department: form.department,
      estimatedCost: parsedCost,
      quantity: parseInt(form.quantity, 10) || 1,
      unit: form.unit,
      category: form.category,
      purchaseType: form.method,
      priority: form.priority,
      entityType: form.entityType,
      fundingSource: form.fundingSource,
      deliveryTimeline: form.category === "Goods" ? form.deliveryTimeline : undefined,
      serviceStartDate: form.category === "Goods" ? undefined : form.serviceStartDate,
      serviceEndDate: form.category === "Goods" ? undefined : form.serviceEndDate,
      directSelectionJustification: isDirect(form.method) ? form.directSelectionJustification.trim() : undefined,
      methodDeviationJustification: form.methodDeviationJustification.trim() || undefined,
      shortlistedEntities: shortlist?.length ? shortlist : undefined,
      linkedPlanItemId: form.emergencyOverride ? undefined : form.linkedPlanItemId || undefined,
      emergencyOverride: form.emergencyOverride || undefined,
      emergencyOverrideJustification: form.emergencyOverride
        ? form.emergencyOverrideJustification.trim()
        : undefined,
      attachments: formFiles.map((f) => f.name),
      attachmentFiles: formFiles.length
        ? formFiles.map((f) => ({ name: f.name, url: f.url, type: f.type, size: f.sizeLabel, label: form.category === "Goods" ? "Technical Specifications" : "Terms of Reference" }))
        : undefined,
    };
  };

  const candidate = useMemo(
    () => ({ ...buildPayload(), approvalHistory: [] } as unknown as GeneratedPR),
    // Recomputed on every render is cheap here and keeps the preview in step
    // with the form without a dependency list that has to mirror every field.
    [form, formFiles, formShortlist] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const liveIssues = formTouched ? validatePRForSubmission(candidate) : [];
  const shownIssues = formIssues.length ? formIssues : liveIssues;
  const issueFor = (field: string) => shownIssues.find((i) => i.field === field)?.message;
  const methodCheck = validateMethodAgainstThreshold(form.method, parsedCost);
  const formVariance = checkPlanVariance(candidate);

  /* ── Submission ───────────────────────────────────────────────────────────── */

  const persistDraft = (): GeneratedPR => {
    const payload = buildPayload();
    const created = createDirectRequisition({
      ...payload,
      requisitionTitle: payload.requisitionTitle,
      itemDescription: payload.itemDescription,
      requestedBy: payload.requestedBy,
      department: payload.department,
      estimatedCost: payload.estimatedCost,
      category: payload.category,
    });
    if (form.emergencyOverride) {
      grantEmergencyOverride(created.id, form.emergencyOverrideJustification.trim(), currentUser.name);
    }
    return created;
  };

  const handleSaveDraft = () => {
    setFormTouched(true);
    if (!form.title.trim() || !form.description.trim()) {
      setFormError("A title and description are needed before the draft can be saved.");
      return;
    }
    persistDraft();
    closeAddModal();
  };

  const handleSubmitNewRequisition = () => {
    setFormTouched(true);
    setFormError("");

    const issues = validatePRForSubmission(candidate);
    if (issues.length) {
      setFormIssues(issues);
      setFormError("Resolve the highlighted errors before submitting.");
      return;
    }
    if (formVariance.flagged && !form.planVarianceComment.trim()) {
      setFormError("This requisition exceeds its plan activity. Explain the variance before submitting.");
      return;
    }

    const created = persistDraft();
    if (formVariance.flagged) {
      recordPlanVarianceComment(created.id, form.planVarianceComment.trim(), currentUser.name);
    }

    const result = submitPRForApproval(created.id, currentUser.name);
    if (!result.ok) {
      // The record survives as a draft, so nothing the requester typed is lost.
      setFormIssues(result.issues ?? []);
      setFormError(result.error ?? "The requisition could not be submitted.");
      return;
    }
    closeAddModal();
  };

  const handlePickFiles = async () => {
    try {
      const files = await pickFiles({ multiple: true, uploadedBy: currentUser.name });
      if (files.length) {
        setFormFiles((prev) => [...prev, ...files]);
        setFormIssues((prev) => prev.filter((i) => i.field !== "attachments"));
      }
    } catch (err) {
      setFormError(err instanceof FileValidationError ? err.message : "The file could not be attached.");
    }
  };

  /* ── Lifecycle actions ────────────────────────────────────────────────────── */

  const canActOn = (pr: GeneratedPR) =>
    pr.requestedBy === currentUser.name || hasRole("Procurement");

  const canWithdraw = (pr: GeneratedPR) =>
    EDITABLE_STATUSES.includes(pr.overallApprovalStatus) && canActOn(pr);

  const canResubmit = (pr: GeneratedPR) =>
    (pr.overallApprovalStatus === "Rejected" || pr.overallApprovalStatus === "Withdrawn") && canActOn(pr);

  const canSubmitDraft = (pr: GeneratedPR) => pr.overallApprovalStatus === "Draft" && canActOn(pr);

  /**
   * Drafts raised here or on the ESS plan screen enter the workflow through the
   * same gate; anything it rejects is reported against the record rather than
   * silently dropped.
   */
  const handleSubmitDraft = (pr: GeneratedPR) => {
    const result = submitPRForApproval(pr.id, currentUser.name);
    if (!result.ok) {
      setSubmitFeedback({ id: pr.id, error: result.error ?? "The requisition could not be submitted.", issues: result.issues ?? [] });
      setSelectedRequisitionId(pr.id);
      return;
    }
    setSubmitFeedback(null);
  };

  const openWithdraw = (pr: GeneratedPR) => {
    setWithdrawTarget(pr);
    setWithdrawReason("");
    setWithdrawError("");
  };

  const confirmWithdraw = () => {
    if (!withdrawTarget) return;
    const result = withdrawPR(withdrawTarget.id, currentUser.name, withdrawReason);
    if (!result.ok) {
      setWithdrawError(result.error ?? "The requisition could not be withdrawn.");
      return;
    }
    setWithdrawTarget(null);
  };

  const openResubmit = (pr: GeneratedPR) => {
    setResubmitTarget(pr);
    setResubmitComments("");
    setResubmitCost(String(pr.estimatedCost));
    setResubmitFiles([]);
    setResubmitError("");
    setResubmitIssues([]);
  };

  const handleResubmitFiles = async () => {
    try {
      const files = await pickFiles({ multiple: true, uploadedBy: currentUser.name });
      if (files.length) setResubmitFiles((prev) => [...prev, ...files]);
    } catch (err) {
      setResubmitError(err instanceof FileValidationError ? err.message : "The file could not be attached.");
    }
  };

  const confirmResubmit = () => {
    if (!resubmitTarget) return;
    if (!resubmitComments.trim()) {
      setResubmitError("Describe what was corrected before resubmitting.");
      return;
    }

    const corrections: Partial<GeneratedPR> = {};
    const revisedCost = parseFloat(resubmitCost);
    if (Number.isFinite(revisedCost) && revisedCost > 0 && revisedCost !== resubmitTarget.estimatedCost) {
      corrections.estimatedCost = revisedCost;
    }
    if (resubmitFiles.length) {
      corrections.attachments = [...(resubmitTarget.attachments ?? []), ...resubmitFiles.map((f) => f.name)];
      corrections.attachmentFiles = [
        ...(resubmitTarget.attachmentFiles ?? []),
        ...resubmitFiles.map((f) => ({ name: f.name, url: f.url, type: f.type, size: f.sizeLabel, label: "Correction" })),
      ];
    }

    const result = resubmitPR(resubmitTarget.id, currentUser.name, corrections, resubmitComments.trim());
    if (!result.ok) {
      setResubmitIssues(result.issues ?? []);
      setResubmitError(result.error ?? "The requisition could not be resubmitted.");
      return;
    }
    setResubmitTarget(null);
  };

  /* ── Role-scoped views ────────────────────────────────────────────────────── */

  const complianceWarnings = (pr: GeneratedPR): string[] => {
    const warnings: string[] = [];
    if (pr.overallApprovalStatus === "Withdrawn") return warnings;
    validatePRForSubmission(pr).forEach((issue) => warnings.push(issue.message));
    if (pr.planVarianceFlag && !pr.planVarianceComment) warnings.push(pr.planVarianceFlag);
    if (pr.emergencyOverride) {
      warnings.push(`Proceeding on an emergency override approved by ${pr.emergencyOverrideApprovedBy ?? "Senior Management"}.`);
    }
    return warnings;
  };

  const myRoles = currentUser.roles.filter((r) => APPROVER_ROLES.includes(r));

  /**
   * Work that is genuinely on this person's desk: the approval queues they staff,
   * plus their own requisitions that cannot move until they act — drafts still to
   * be submitted and rejections still to be corrected.
   */
  const awaitingMe = useMemo(() => {
    const seen = new Set<string>();
    const rows: GeneratedPR[] = [];
    const add = (pr: GeneratedPR) => {
      if (seen.has(pr.id)) return;
      seen.add(pr.id);
      rows.push(pr);
    };
    myRoles.forEach((role) => {
      getPRsAwaiting(role as "Department Head" | "Procurement" | "Finance" | "Senior Management").forEach(add);
    });
    requisitions
      .filter((pr) => pr.requestedBy === currentUser.name && ["Draft", "Rejected", "Withdrawn"].includes(pr.overallApprovalStatus))
      .forEach(add);
    return rows;
  }, [requisitions, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const myDrafts = requisitions.filter((pr) => pr.requestedBy === currentUser.name && pr.overallApprovalStatus === "Draft");
  const mySubmitted = requisitions.filter(
    (pr) => pr.requestedBy === currentUser.name && pr.overallApprovalStatus !== "Draft"
  );
  const flaggedForCompliance = requisitions.filter((pr) => complianceWarnings(pr).length > 0);
  const awaitingSourcing = requisitions.filter((pr) => pr.overallApprovalStatus === "Approved");
  const awaitingBudget = getPRsAwaiting("Finance");

  interface Scope {
    key: string;
    label: string;
    rows: GeneratedPR[];
    hint: string;
  }

  const scopes: Scope[] = [
    { key: "all", label: "All Requisitions", rows: requisitions, hint: "Every requisition in the register." },
    ...(can("pr.create")
      ? [
          { key: "myDrafts", label: "My Drafts", rows: myDrafts, hint: "Saved but not yet submitted for approval." },
          { key: "mySubmitted", label: "My Submitted", rows: mySubmitted, hint: "Requisitions you have raised, at any stage." },
        ]
      : []),
    ...(myRoles.length || can("pr.create")
      ? [{
          key: "awaitingMe",
          label: "Awaiting My Action",
          rows: awaitingMe,
          hint: myRoles.length
            ? `Queued at your ${myRoles.join(" / ")} station, plus your own drafts and rejections.`
            : "Your drafts still to submit and rejections still to correct.",
        }]
      : []),
    ...(hasRole("Procurement")
      ? [
          { key: "compliance", label: "Compliance Warnings", rows: flaggedForCompliance, hint: "Requisitions breaching a policy control or exceeding their plan activity." },
          { key: "awaitingSourcing", label: "Awaiting Sourcing", rows: awaitingSourcing, hint: "Fully approved and ready for a sourcing case." },
        ]
      : []),
    ...(hasRole("Finance")
      ? [{ key: "budget", label: "Budget Validation", rows: awaitingBudget, hint: "Awaiting your confirmation of budget availability." }]
      : []),
    ...(hasRole("Senior Management")
      ? [{ key: "performance", label: "Summary & Cycle Time", rows: requisitions, hint: "Portfolio view with approval cycle-time performance." }]
      : []),
  ];

  const activeScopeDef = scopes.find((s) => s.key === activeScope) ?? scopes[0];

  // Switching identity can retire the selected view (a Finance-only queue, say).
  const scopeKeys = scopes.map((s) => s.key).join("|");
  useEffect(() => {
    if (!scopeKeys.split("|").includes(activeScope)) setActiveScope("all");
  }, [scopeKeys, activeScope]);

  /* ── Filtering, sorting, paging ───────────────────────────────────────────── */

  const purchaseTypeOptions = useMemo(() => {
    const seen = new Set<string>(PROCUREMENT_METHODS as string[]);
    requisitions.forEach((pr) => seen.add(pr.purchaseType));
    return ["All Purchase Types", ...Array.from(seen).sort()];
  }, [requisitions]);

  const filteredRequisitions = activeScopeDef.rows.filter((req) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      req.requisitionNumber.toLowerCase().includes(query) ||
      req.requestedBy.toLowerCase().includes(query) ||
      req.itemDescription.toLowerCase().includes(query) ||
      (req.requisitionTitle ?? "").toLowerCase().includes(query) ||
      (req.linkedPlanItemId ?? "").toLowerCase().includes(query);
    const matchesDepartment = selectedDepartment === "All Departments" || req.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All Statuses" || req.overallApprovalStatus === selectedStatus;
    const matchesPriority = selectedPriority === "All Priorities" || req.priority === selectedPriority;
    const matchesPurchaseType = selectedPurchaseType === "All Purchase Types" || req.purchaseType === selectedPurchaseType;
    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority && matchesPurchaseType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRequisitions.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * itemsPerPage;
  const pagedRequisitions = filteredRequisitions.slice(pageStart, pageStart + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, selectedStatus, selectedPriority, selectedPurchaseType, itemsPerPage, activeScope]);

  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const closeAllDropdowns = () => {
    setShowDepartmentDropdown(false);
    setShowStatusDropdown(false);
    setShowPriorityDropdown(false);
    setShowPurchaseTypeDropdown(false);
    setShowExportMenu(false);
  };

  /* ── Export ───────────────────────────────────────────────────────────────── */

  const exportAllowed = can("report.export");
  const exportRows = filteredRequisitions.map(toExportRow);
  const exportTitle = `Purchase Requisitions — ${activeScopeDef.label}`;
  const exportMeta = {
    subtitle: `${filteredRequisitions.length} requisition${filteredRequisitions.length === 1 ? "" : "s"} · ${activeScopeDef.hint}`,
    generatedBy: currentUser.name,
  };

  const runExport = (format: "excel" | "pdf" | "csv") => {
    setShowExportMenu(false);
    if (!exportAllowed) return;
    if (format === "excel") exportToExcel(exportTitle, EXPORT_COLUMNS, exportRows, exportMeta);
    else if (format === "pdf") exportToPDF(exportTitle, EXPORT_COLUMNS, exportRows, exportMeta);
    else exportToCSV(exportTitle, EXPORT_COLUMNS, exportRows);
  };

  const selectedRequisition = selectedRequisitionId
    ? requisitions.find((pr) => pr.id === selectedRequisitionId) ?? null
    : null;

  /* ═══ FULL-PAGE DETAIL VIEW ═══════════════════════════════════════════════ */

  if (selectedRequisition) {
    const pr = selectedRequisition;
    const daysInStage = computeDaysInStage(pr);
    const variance = checkPlanVariance(pr);
    const warnings = complianceWarnings(pr);

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4">
          <button
            onClick={() => setSelectedRequisitionId(null)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{pr.requisitionNumber}</h1>
              <Badge className={cn("text-[12px] font-medium shadow-none border-0", getPurchaseTypeColor(pr.purchaseType))}>
                {pr.purchaseType}
              </Badge>
              <Badge className={cn("text-[12px] font-medium shadow-none border-0", getStatusColor(pr.overallApprovalStatus))}>
                {pr.overallApprovalStatus}
              </Badge>
              {(pr.resubmissionCount ?? 0) > 0 && (
                <Badge className="text-[12px] font-medium shadow-none border-0 bg-sky-50 text-sky-700">
                  Resubmitted ×{pr.resubmissionCount}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">{pr.requisitionTitle || pr.itemDescription}</p>
          </div>
          <div className="flex items-center gap-2">
            {canSubmitDraft(pr) && (
              <button
                onClick={() => handleSubmitDraft(pr)}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
              >
                <Check size={14} /> Submit for Approval
              </button>
            )}
            {canWithdraw(pr) && (
              <button
                onClick={() => openWithdraw(pr)}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Undo2 size={14} /> Withdraw
              </button>
            )}
            {canResubmit(pr) && (
              <button
                onClick={() => openResubmit(pr)}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
              >
                <RotateCcw size={14} /> Correct & Resubmit
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {submitFeedback?.id === pr.id && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">{submitFeedback.error}</p>
                {submitFeedback.issues.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {submitFeedback.issues.map((issue, idx) => (
                      <li key={idx} className="text-[12px] text-red-700">• {issue.message}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button onClick={() => setSubmitFeedback(null)} className="p-1 hover:bg-red-100 rounded">
                <X size={14} className="text-red-400" />
              </button>
            </div>
          )}

          {/* Lifecycle banners */}
          {pr.overallApprovalStatus === "Rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Rejected at {pr.rejectedAtStage ?? "an approval stage"}
                </p>
                <p className="text-sm text-red-700 mt-1">{pr.rejectionReason ?? "No reason was recorded."}</p>
                <p className="text-[12px] text-red-500 mt-2">
                  Correct the issues identified and resubmit — the requisition re-enters the workflow at department approval.
                  {(pr.resubmissionCount ?? 0) > 0 && ` Previously resubmitted ${pr.resubmissionCount} time${pr.resubmissionCount === 1 ? "" : "s"}.`}
                </p>
              </div>
            </div>
          )}

          {pr.overallApprovalStatus === "Withdrawn" && (
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex items-start gap-3">
              <Undo2 size={18} className="text-stone-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-stone-800">Withdrawn by the requester</p>
                <p className="text-sm text-stone-700 mt-1">{pr.withdrawnReason ?? "No reason was recorded."}</p>
              </div>
            </div>
          )}

          {pr.convertedToSourcingCase && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
              <Layers size={18} className="text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-purple-800">Converted to sourcing</p>
                <p className="text-sm text-purple-700 mt-1">
                  Sourcing case <span className="font-mono font-medium">{pr.convertedToSourcingCase}</span> now carries this requirement.
                </p>
              </div>
            </div>
          )}

          {pr.emergencyOverride && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <ShieldAlert size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Emergency override — raised without an approved plan activity
                </p>
                <p className="text-sm text-amber-700 mt-1">{pr.emergencyOverrideJustification}</p>
                <p className="text-[12px] text-amber-600 mt-1">Approved by {pr.emergencyOverrideApprovedBy ?? "—"}</p>
              </div>
            </div>
          )}

          {variance.flagged && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Cost variance against the procurement plan</p>
                <p className="text-sm text-orange-700 mt-1">{variance.message}</p>
                {pr.planVarianceComment && (
                  <p className="text-[12px] text-orange-600 mt-2">Requester's explanation: {pr.planVarianceComment}</p>
                )}
              </div>
            </div>
          )}

          {/* Requisition Information Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Requisition Information</h2>
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Requested By</p>
                <p className="text-sm font-medium text-slate-900">{pr.requestedBy}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Department</p>
                <p className="text-sm font-medium text-slate-900">{pr.department}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Date Requested</p>
                <p className="text-sm font-medium text-slate-900">{formatDate(pr.dateRequested)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Priority</p>
                <Badge className={cn("text-xs font-medium shadow-none border-0", getPriorityColor(pr.priority))}>
                  {pr.priority}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Item Description</p>
                <p className="text-sm font-medium text-slate-900">{pr.itemDescription}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Quantity</p>
                <p className="text-sm font-medium text-slate-900">{pr.quantity} {pr.unit}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Estimated Cost</p>
                <p className="text-sm font-medium text-slate-900">{formatCurrency(pr.estimatedCost)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Procurement Method</p>
                <Badge className={cn("text-xs font-medium shadow-none border-0", getPurchaseTypeColor(pr.purchaseType))}>
                  {pr.purchaseType}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1">Funding Source</p>
                <p className="text-sm font-medium text-slate-900">{pr.fundingSource || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <p className="text-sm font-medium text-slate-900">{pr.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Entity Type</p>
                <Badge className="text-xs font-medium shadow-none border-0 bg-slate-100 text-slate-700">
                  {pr.entityType ?? "—"}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Linked Plan Activity</p>
                <p className={cn("text-sm font-medium", pr.linkedPlanItemId ? "text-indigo-600" : "text-amber-600")}>
                  {pr.linkedPlanItemId ?? (pr.emergencyOverride ? "Emergency override" : "Not linked")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mt-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Source</p>
                <Badge className={cn("text-xs font-medium shadow-none border-0", pr.sourceType === "ESS Plan" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600")}>
                  {pr.sourceType}
                </Badge>
              </div>
              {pr.deliveryTimeline && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Delivery Timeline</p>
                  <p className="text-sm font-medium text-slate-900">{pr.deliveryTimeline}</p>
                </div>
              )}
              {pr.serviceStartDate && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Service Start Date</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(pr.serviceStartDate)}</p>
                </div>
              )}
              {pr.serviceEndDate && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Service End Date</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(pr.serviceEndDate)}</p>
                </div>
              )}
            </div>

            {pr.directSelectionJustification && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Direct Selection Justification</p>
                <p className="text-sm text-slate-700 bg-amber-50 border border-amber-100 rounded-lg p-3">{pr.directSelectionJustification}</p>
              </div>
            )}

            {pr.methodDeviationJustification && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Threshold Deviation Justification</p>
                <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">{pr.methodDeviationJustification}</p>
              </div>
            )}

            {pr.shortlistedEntities && pr.shortlistedEntities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Shortlisted Entities</p>
                <div className="space-y-2">
                  {pr.shortlistedEntities.map((entity, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-50 rounded-lg px-4 py-2 text-sm">
                      <span className="font-medium text-slate-900 w-1/3">{entity.name}</span>
                      <span className="text-slate-500 w-1/3">{entity.address}</span>
                      <span className="text-indigo-600 w-1/3">{entity.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(pr.attachmentFiles?.length ?? 0) + (pr.attachments?.length ?? 0) > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Attachments</p>
                <div className="flex flex-wrap gap-2">
                  {pr.attachmentFiles?.map((file, idx) => (
                    <button
                      key={`file-${idx}`}
                      onClick={() => openFile(file)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-700 transition-colors"
                      title={`${file.label} · ${file.size}`}
                    >
                      <Paperclip size={12} className="text-purple-700" />
                      {file.name}
                    </button>
                  ))}
                  {/* Older records carry filenames only. */}
                  {pr.attachments
                    ?.filter((name) => !pr.attachmentFiles?.some((f) => f.name === name))
                    .map((name, idx) => (
                      <span key={`name-${idx}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-500">
                        <Paperclip size={12} className="text-slate-400" />
                        {name}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Compliance warnings for Procurement */}
          {hasRole("Procurement") && warnings.length > 0 && (
            <div className="bg-white border border-amber-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" /> Compliance Warnings
              </h2>
              <ul className="space-y-2">
                {warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Real-time Progress Tracker */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Approval Progress Tracker</h2>
            <div className="flex items-center gap-1 mb-4 text-sm text-slate-500">
              <Clock size={14} />
              <span>{daysInStage} day{daysInStage === 1 ? "" : "s"} in current stage</span>
              {pr.currentResponsible && (
                <>
                  <span className="mx-2">|</span>
                  <User size={14} />
                  <span>Currently with: <span className="font-medium text-slate-700">{pr.currentResponsible}</span></span>
                </>
              )}
            </div>
            <div className="flex items-center gap-0">
              {WORKFLOW_STEPS.map((ws, idx) => {
                const reqStep = pr.currentStep || 1;
                const isRejected = pr.overallApprovalStatus === "Rejected";
                const isSkipped = ws.step === 5 && !pr.requiresSeniorApproval;
                const isComplete = pr.overallApprovalStatus === "Approved" || pr.overallApprovalStatus === "Converted to Sourcing";
                let stepStatus: "complete" | "active" | "pending" | "rejected" | "skipped" = "pending";
                if (isSkipped) stepStatus = "skipped";
                else if (isRejected && ws.step === reqStep) stepStatus = "rejected";
                else if (ws.step < reqStep) stepStatus = "complete";
                else if (ws.step === reqStep) stepStatus = isComplete ? "complete" : "active";

                const colors = {
                  complete: "bg-green-500 text-white border-green-500",
                  active: "bg-blue-500 text-white border-blue-500",
                  pending: "bg-white text-slate-400 border-slate-300",
                  rejected: "bg-red-500 text-white border-red-500",
                  skipped: "bg-slate-100 text-slate-300 border-slate-200",
                };
                const lineColor = stepStatus === "complete" ? "bg-green-400" : stepStatus === "active" ? "bg-blue-300" : "bg-slate-200";

                return (
                  <div key={ws.step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-semibold", colors[stepStatus])}>
                        {stepStatus === "complete" ? <Check size={16} /> : stepStatus === "rejected" ? <X size={16} /> : ws.step}
                      </div>
                      <p className={cn("text-[10px] mt-1.5 text-center w-20 leading-tight", stepStatus === "active" ? "text-blue-700 font-semibold" : stepStatus === "complete" ? "text-green-700" : "text-slate-400")}>{ws.label}</p>
                      <p className={cn("text-[9px] text-center w-20 leading-tight", stepStatus === "active" ? "text-blue-500" : "text-slate-300")}>{isSkipped ? "N/A" : ws.role}</p>
                    </div>
                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <div className={cn("h-0.5 flex-1 mx-1 rounded", lineColor)} />
                    )}
                  </div>
                );
              })}
            </div>
            {pr.requiresSeniorApproval && (
              <p className="text-[12px] text-slate-500 mt-4">
                Value exceeds the {formatCurrency(SENIOR_APPROVAL_THRESHOLD)} threshold, so final approval rests with Senior Management.
              </p>
            )}
          </div>

          {/* Approval History */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Approval History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Step</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Role</th>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Action</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Date</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {pr.approvalHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[12px] text-slate-400">
                        No approval activity yet — this requisition has not been submitted.
                      </td>
                    </tr>
                  ) : (
                    pr.approvalHistory.map((entry, idx) => (
                      <tr key={`${entry.step}-${entry.date}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 text-center text-[12px] text-slate-500">{entry.step}</td>
                        <td className="px-4 py-3 text-[12px] font-medium text-slate-900">{entry.role}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-xl text-[12px]",
                            entry.action === "Approved" ? "bg-green-50 text-green-600"
                              : entry.action === "Rejected" ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                          )}>
                            {entry.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-500">{formatDate(entry.date)}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-700">{entry.comments}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {renderWithdrawModal()}
        {renderResubmitModal()}
      </div>
    );
  }

  /* ═══ MODALS ══════════════════════════════════════════════════════════════ */

  function renderWithdrawModal() {
    if (!withdrawTarget) return null;
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full max-w-lg mx-4">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Withdraw Requisition</h2>
              <p className="text-[12px] text-slate-500">{withdrawTarget.requisitionNumber} — {withdrawTarget.requisitionTitle || withdrawTarget.itemDescription}</p>
            </div>
            <button onClick={() => setWithdrawTarget(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={18} className="text-slate-500" />
            </button>
          </div>
          <div className="px-6 py-5 space-y-3">
            <p className="text-[12px] text-slate-500">
              Withdrawal removes the requisition from every approval queue. It stays on the register and can be corrected and resubmitted later.
            </p>
            <div>
              <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={withdrawReason}
                onChange={(e) => { setWithdrawReason(e.target.value); setWithdrawError(""); }}
                rows={3}
                placeholder="Why is this requisition being withdrawn?"
                className={cn(
                  "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none",
                  withdrawError ? "border-red-300 bg-red-50/40" : "border-slate-200"
                )}
              />
              {withdrawError && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} /> {withdrawError}</p>
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button onClick={() => setWithdrawTarget(null)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button
              onClick={confirmWithdraw}
              disabled={!withdrawReason.trim()}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw Requisition
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderResubmitModal() {
    if (!resubmitTarget) return null;
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full max-w-xl mx-4 max-h-[90vh] flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Correct &amp; Resubmit</h2>
              <p className="text-[12px] text-slate-500">{resubmitTarget.requisitionNumber} — attempt {(resubmitTarget.resubmissionCount ?? 0) + 2}</p>
            </div>
            <button onClick={() => setResubmitTarget(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={18} className="text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {resubmitTarget.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-[11px] uppercase tracking-wide font-semibold text-red-600 mb-1">
                  Rejected at {resubmitTarget.rejectedAtStage ?? "an approval stage"}
                </p>
                <p className="text-sm text-red-700">{resubmitTarget.rejectionReason}</p>
              </div>
            )}
            {resubmitTarget.withdrawnReason && (
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                <p className="text-[11px] uppercase tracking-wide font-semibold text-stone-600 mb-1">Withdrawn</p>
                <p className="text-sm text-stone-700">{resubmitTarget.withdrawnReason}</p>
              </div>
            )}

            <div>
              <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                What was corrected <span className="text-red-500">*</span>
              </label>
              <textarea
                value={resubmitComments}
                onChange={(e) => { setResubmitComments(e.target.value); setResubmitError(""); }}
                rows={3}
                placeholder="Describe the changes made in response to the rejection."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">Revised Estimated Cost (USD)</label>
              <input
                type="number"
                value={resubmitCost}
                onChange={(e) => setResubmitCost(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Leave unchanged if the cost is still accurate.</p>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">Additional Documents</label>
              <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50/60">
                {resubmitFiles.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {resubmitFiles.map((file, idx) => (
                      <div key={file.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                        <button onClick={() => openFile(file)} className="flex items-center gap-2 min-w-0 text-left">
                          <Paperclip size={12} className="text-purple-700 shrink-0" />
                          <span className="text-[12px] text-slate-700 truncate hover:underline">{file.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{file.type} · {file.sizeLabel}</span>
                        </button>
                        <button onClick={() => setResubmitFiles((prev) => prev.filter((_, i) => i !== idx))} className="p-0.5 hover:bg-slate-100 rounded shrink-0">
                          <X size={12} className="text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => void handleResubmitFiles()}
                  className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-[11px] text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Upload size={12} /> Choose file…
                </button>
              </div>
            </div>

            {resubmitIssues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-[11px] uppercase tracking-wide font-semibold text-red-600 mb-1.5">Outstanding validation errors</p>
                <ul className="space-y-1">
                  {resubmitIssues.map((issue, idx) => (
                    <li key={idx} className="text-[12px] text-red-700">• {issue.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {resubmitError && resubmitIssues.length === 0 && (
              <p className="text-[12px] text-red-600 flex items-center gap-1"><AlertCircle size={12} /> {resubmitError}</p>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
            <button onClick={() => setResubmitTarget(null)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button
              onClick={confirmResubmit}
              disabled={!resubmitComments.trim()}
              className="px-6 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resubmit for Approval
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ MAIN LIST VIEW ══════════════════════════════════════════════════════ */

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Purchase Requisition Management</h1>
          <p className="text-[12px] text-slate-500">
            Signed in as {currentUser.name} · {currentUser.roles.join(", ")}
          </p>
        </div>
        <button
          onClick={openAddModal}
          disabled={!can("pr.create")}
          title={can("pr.create") ? undefined : denialReason("pr.create")}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Add New Requisition
        </button>
      </div>

      {/* Stats strip */}
      <ProcurementStatCards
        stats={[
          { label: "Total", value: stats.total, icon: <Layers size={14} />, tone: "neutral" as const },
          { label: "Awaiting Action", value: stats.awaitingAction, icon: <Clock size={14} />, tone: "warning" as const },
          { label: "Approved", value: stats.approved, icon: <Check size={14} />, tone: "success" as const },
          { label: "Rejected", value: stats.rejected, icon: <X size={14} />, tone: "danger" as const },
          { label: "Drafts", value: stats.draft, icon: <FileText size={14} />, tone: "neutral" as const },
          { label: "Total Value", value: formatCurrency(stats.totalValue), icon: <FileSpreadsheet size={14} />, tone: "info" as const },
        ]}
      />

      {/* Role-scoped views */}
      <ProcurementTabBar>
        <ProcurementTabs
          tabs={scopes.map((scope) => ({ key: scope.key, label: scope.label, count: scope.rows.length }))}
          active={activeScope}
          onChange={setActiveScope}
        />
        <p className="text-[11px] text-slate-400 mt-2">{activeScopeDef.hint}</p>
      </ProcurementTabBar>

      {/* Management performance panel */}
      {activeScope === "performance" && (
        <ProcurementStatCards
          stats={[
            {
              label: "Average Cycle Time",
              value: `${stats.avgCycleTimeDays} days`,
              icon: <Timer size={14} />,
              tone: "accent",
              sub: `Submission to final approval, across ${stats.approved + stats.converted} completed requisitions.`,
            },
            {
              label: "In Flight",
              value: stats.pendingDept + stats.pendingProcFin + stats.pendingSenior,
              icon: <Clock size={14} />,
              tone: "warning" as const,
              sub: `${stats.pendingDept} dept · ${stats.pendingProcFin} proc & finance · ${stats.pendingSenior} senior`,
            },
            {
              label: "Converted to Sourcing",
              value: stats.converted,
              sub: `${stats.approved} approved and awaiting a sourcing case.`,
            },
            {
              label: "Rejected / Withdrawn",
              value: stats.rejected + stats.withdrawn,
              sub: `${stats.rejected} rejected · ${stats.withdrawn} withdrawn.`,
            },
          ]}
        />
      )}

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                onClick={() => { closeAllDropdowns(); setShowExportMenu(!showExportMenu); }}
                disabled={!exportAllowed}
                title={exportAllowed ? `Export the ${filteredRequisitions.length} listed requisitions` : denialReason("report.export")}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm text-slate-900">Export</span>
                <Download size={16} className="text-purple-700" />
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    <button onClick={() => runExport("excel")} className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <FileSpreadsheet size={14} className="text-emerald-600" /> Excel workbook
                    </button>
                    <button onClick={() => runExport("pdf")} className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <FileText size={14} className="text-red-600" /> PDF report
                    </button>
                    <button onClick={() => runExport("csv")} className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <FileDown size={14} className="text-slate-500" /> CSV data
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Purchase Type Filter */}
            <div className="relative">
              <button
                onClick={() => { closeAllDropdowns(); setShowPurchaseTypeDropdown(!showPurchaseTypeDropdown); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm",
                  selectedPurchaseType !== "All Purchase Types" ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
                )}
              >
                <span className="text-sm text-slate-900">{selectedPurchaseType}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showPurchaseTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPurchaseTypeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-72 overflow-y-auto">
                    {purchaseTypeOptions.map((pt) => (
                      <button
                        key={pt}
                        onClick={() => { setSelectedPurchaseType(pt); setShowPurchaseTypeDropdown(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors",
                          selectedPurchaseType === pt && "bg-emerald-50 font-medium"
                        )}
                      >
                        {pt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Department Filter */}
            <div className="relative">
              <button
                onClick={() => { closeAllDropdowns(); setShowDepartmentDropdown(!showDepartmentDropdown); }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedDepartment}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showDepartmentDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDepartmentDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => { setSelectedDepartment(dept); setShowDepartmentDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <button
                onClick={() => { closeAllDropdowns(); setShowPriorityDropdown(!showPriorityDropdown); }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedPriority}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showPriorityDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPriorityDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {PRIORITIES.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => { setSelectedPriority(priority); setShowPriorityDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => { closeAllDropdowns(); setShowStatusDropdown(!showStatusDropdown); }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["All Statuses", ...PR_STATUSES].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setSelectedStatus(status); setShowStatusDropdown(false); }}
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
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              {["Requisition #", "Requested By", "Department", "Item Description", "Purchase Type", "Plan Activity", "Quantity", "Estimated Cost"].map((header) => (
                <th key={header} className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">{header}</th>
              ))}
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Priority</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Days in Stage</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Responsible</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date Requested</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedRequisitions.length === 0 ? (
              <tr>
                <td colSpan={14} className="px-4 py-16 text-center text-sm text-slate-400">
                  No requisitions match this view.
                </td>
              </tr>
            ) : (
              pagedRequisitions.map((req) => {
                const daysInStage = computeDaysInStage(req);
                const warnings = activeScope === "compliance" ? complianceWarnings(req) : [];
                return (
                  <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-slate-900">{req.requisitionNumber}</p>
                      {warnings.length > 0 && (
                        <p className="text-[10px] text-amber-600 mt-0.5 flex items-center gap-1" title={warnings.join("\n")}>
                          <AlertTriangle size={10} /> {warnings.length} warning{warnings.length === 1 ? "" : "s"}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{req.requestedBy}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{req.department}</p></td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-900">{req.requisitionTitle || req.itemDescription}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getPurchaseTypeColor(req.purchaseType)}`}>
                        {req.purchaseType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {req.linkedPlanItemId ? (
                        <p className="text-[12px] text-indigo-600 font-medium">{req.linkedPlanItemId}</p>
                      ) : req.emergencyOverride ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600" title={req.emergencyOverrideJustification}>
                          <ShieldAlert size={11} /> Override
                        </span>
                      ) : (
                        <span className="text-[12px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{req.quantity} {req.unit}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(req.estimatedCost)}</p></td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(req.overallApprovalStatus)}`}>
                        {req.overallApprovalStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn("text-[12px]", daysInStage > 7 ? "text-red-600 font-medium" : "text-slate-600")}>
                        {daysInStage}d
                      </span>
                    </td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{req.currentResponsible ?? "—"}</p></td>
                    <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(req.dateRequested)}</p></td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionMenuId(openActionMenuId === req.id ? null : req.id)}
                          className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} className="text-blue-800" />
                        </button>
                        {openActionMenuId === req.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => { setSelectedRequisitionId(req.id); setOpenActionMenuId(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                View
                              </button>
                              {canWithdraw(req) && (
                                <button
                                  onClick={() => { openWithdraw(req); setOpenActionMenuId(null); }}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  Withdraw
                                </button>
                              )}
                              {canResubmit(req) && (
                                <button
                                  onClick={() => { openResubmit(req); setOpenActionMenuId(null); }}
                                  className="w-full px-4 py-2 text-left text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                                >
                                  Correct &amp; Resubmit
                                </button>
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
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <p className="text-[12px] text-slate-500">
            {filteredRequisitions.length === 0
              ? "No requisitions"
              : `${pageStart + 1}–${Math.min(pageStart + itemsPerPage, filteredRequisitions.length)} of ${filteredRequisitions.length}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className={cn(
                "px-3 py-2 text-sm rounded transition-colors",
                n === page ? "bg-pink-50 text-pink-600 font-medium" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {n}
            </button>
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

      {/* Add New Requisition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Add New Requisition</h2>
                <p className="text-[12px] text-slate-500">Every field marked * is enforced before the requisition can enter the workflow.</p>
              </div>
              <button onClick={closeAddModal} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body — Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {formError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-red-700">{formError}</p>
                </div>
              )}

              {/* Requisition Title */}
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                  Requisition Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="Enter requisition title"
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                    issueFor("requisitionTitle") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                  )}
                />
                {issueFor("requisitionTitle") && <FieldError message={issueFor("requisitionTitle")!} />}
              </div>

              {/* Entity Type */}
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">Entity Type</label>
                <div className="flex gap-4">
                  {(["Individual", "Firm"] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="entityType" checked={form.entityType === type} onChange={() => setField("entityType", type)} className="accent-purple-700" />
                      <span className="text-sm text-slate-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Item Description */}
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                  Item Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Describe the items or services needed"
                  rows={3}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none",
                    issueFor("itemDescription") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                  )}
                />
                {issueFor("itemDescription") && <FieldError message={issueFor("itemDescription")!} />}
              </div>

              {/* Department & Estimated Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) => setField("department", e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                      issueFor("department") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                    )}
                  >
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {issueFor("department") && <FieldError message={issueFor("department")!} />}
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                    Estimated Cost (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.estimatedCost}
                    onChange={(e) => setField("estimatedCost", e.target.value)}
                    placeholder="0.00"
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                      issueFor("estimatedCost") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                    )}
                  />
                  {issueFor("estimatedCost") && <FieldError message={issueFor("estimatedCost")!} />}
                  {parsedCost > SENIOR_APPROVAL_THRESHOLD && (
                    <p className="text-[11px] text-violet-600 mt-1">
                      Above {formatCurrency(SENIOR_APPROVAL_THRESHOLD)} — final approval will route to Senior Management.
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => setField("quantity", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">Unit</label>
                  <select value={form.unit} onChange={(e) => setField("unit", e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Funding Source & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                    Funding Source <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.fundingSource}
                    onChange={(e) => setField("fundingSource", e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                      issueFor("fundingSource") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                    )}
                  >
                    {FUNDING_SOURCES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  {issueFor("fundingSource") && <FieldError message={issueFor("fundingSource")!} />}
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                    Procurement Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {PROCUREMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Method & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                    Procurement Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.method}
                    onChange={(e) => setField("method", e.target.value as ProcurementMethod)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                      issueFor("purchaseType") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                    )}
                  >
                    {PROCUREMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}{parsedCost > 0 && m === suggestProcurementMethod(parsedCost) ? " — suggested" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {getThreshold(form.method) ? `Applies ${formatBand(getThreshold(form.method)!)}.` : ""}
                  </p>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">Priority</label>
                  <select value={form.priority} onChange={(e) => setField("priority", e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {["Low", "Medium", "High", "Urgent"].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Threshold deviation */}
              {parsedCost > 0 && !methodCheck.compliant && (
                <div className="border border-amber-200 bg-amber-50/60 rounded-lg p-4 space-y-3">
                  <p className="text-[12px] text-amber-800 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" /> {methodCheck.message}
                  </p>
                  <div>
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                      Threshold Deviation Justification <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.methodDeviationJustification}
                      onChange={(e) => setField("methodDeviationJustification", e.target.value)}
                      rows={2}
                      placeholder="Why does this procurement depart from the method its value band indicates?"
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none",
                        issueFor("purchaseType") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                      )}
                    />
                    {issueFor("purchaseType") && <FieldError message={issueFor("purchaseType")!} />}
                  </div>
                </div>
              )}

              {/* Plan linkage */}
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                  Approved Plan Activity <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.emergencyOverride ? EMERGENCY_OPTION : form.linkedPlanItemId}
                  onChange={(e) => {
                    if (e.target.value === EMERGENCY_OPTION) {
                      setForm((prev) => ({ ...prev, emergencyOverride: true, linkedPlanItemId: "" }));
                    } else {
                      setForm((prev) => ({ ...prev, emergencyOverride: false, emergencyOverrideJustification: "", linkedPlanItemId: e.target.value }));
                    }
                    setFormError("");
                  }}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                    issueFor("linkedPlanItemId") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                  )}
                >
                  <option value="">Select the approved plan activity this draws against…</option>
                  {approvedPlanItems.map((item) => (
                    <option key={item.id} value={item.ppItemId}>
                      {item.ppItemId} — {item.activityDescription} ({formatCurrency(item.estimatedValue)}, {item.fundingSource})
                    </option>
                  ))}
                  {can("plan.emergencyOverride") && (
                    <option value={EMERGENCY_OPTION}>⚠ Not on the plan — request an emergency override</option>
                  )}
                </select>
                {issueFor("linkedPlanItemId") && <FieldError message={issueFor("linkedPlanItemId")!} />}
                {!can("plan.emergencyOverride") && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Off-plan requisitions need an emergency override. {denialReason("plan.emergencyOverride")}
                  </p>
                )}
              </div>

              {form.emergencyOverride && (
                <div className="border border-amber-200 bg-amber-50/60 rounded-lg p-4 space-y-3">
                  <p className="text-[12px] text-amber-800 flex items-start gap-2">
                    <ShieldAlert size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    An override is an exception to the plan-linkage control. It is recorded in the audit trail and notified to Internal Audit.
                  </p>
                  <div>
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                      Override Justification <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.emergencyOverrideJustification}
                      onChange={(e) => setField("emergencyOverrideJustification", e.target.value)}
                      rows={3}
                      placeholder="Why must this proceed without an approved plan activity?"
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none",
                        issueFor("emergencyOverride") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                      )}
                    />
                    {issueFor("emergencyOverride") && <FieldError message={issueFor("emergencyOverride")!} />}
                  </div>
                </div>
              )}

              {/* Plan variance */}
              {formVariance.flagged && (
                <div className="border border-orange-200 bg-orange-50/60 rounded-lg p-4 space-y-3">
                  <p className="text-[12px] text-orange-800 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-orange-500 mt-0.5 shrink-0" /> {formVariance.message}
                  </p>
                  <div>
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                      Variance Explanation <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.planVarianceComment}
                      onChange={(e) => setField("planVarianceComment", e.target.value)}
                      rows={2}
                      placeholder="Explain why the cost exceeds the planned value."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Category-specific dates */}
              {form.category === "Goods" ? (
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                    Desired Delivery Timeline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.deliveryTimeline}
                    onChange={(e) => setField("deliveryTimeline", e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                      issueFor("deliveryTimeline") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                    )}
                  />
                  {issueFor("deliveryTimeline") && <FieldError message={issueFor("deliveryTimeline")!} />}
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                        Service Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.serviceStartDate}
                        onChange={(e) => setField("serviceStartDate", e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                          issueFor("serviceDates") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                        Service End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.serviceEndDate}
                        onChange={(e) => setField("serviceEndDate", e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                          issueFor("serviceDates") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                        )}
                      />
                    </div>
                  </div>
                  {issueFor("serviceDates") && <FieldError message={issueFor("serviceDates")!} />}
                </div>
              )}

              {/* Direct selection justification */}
              {isDirect(form.method) && (
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                    Direct Selection Justification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.directSelectionJustification}
                    onChange={(e) => setField("directSelectionJustification", e.target.value)}
                    placeholder="Why can this be met only by the named supplier?"
                    rows={3}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none",
                      issueFor("directSelectionJustification") ? "border-red-300 bg-red-50/40" : "border-slate-200"
                    )}
                  />
                  {issueFor("directSelectionJustification") && <FieldError message={issueFor("directSelectionJustification")!} />}
                </div>
              )}

              {/* Shortlisted entities */}
              {needsShortlist && (
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                    {isDirect(form.method) ? "Proposed Supplier" : "Shortlisted Entities"} <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {formShortlist.map((entity, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={entity.name}
                          onChange={(e) => setFormShortlist((prev) => prev.map((en, i) => (i === idx ? { ...en, name: e.target.value } : en)))}
                          placeholder="Full legal name"
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          value={entity.address}
                          onChange={(e) => setFormShortlist((prev) => prev.map((en, i) => (i === idx ? { ...en, address: e.target.value } : en)))}
                          placeholder="Registered address"
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="email"
                          value={entity.email}
                          onChange={(e) => setFormShortlist((prev) => prev.map((en, i) => (i === idx ? { ...en, email: e.target.value } : en)))}
                          placeholder="Email"
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                  {issueFor("shortlistedEntities") && <FieldError message={issueFor("shortlistedEntities")!} />}
                  <button
                    onClick={() => setFormShortlist((prev) => [...prev, { name: "", address: "", email: "" }])}
                    className="mt-2 text-xs text-purple-700 font-medium hover:underline"
                  >
                    + Add Another
                  </button>
                </div>
              )}

              {/* Mandatory documents */}
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                  {form.category === "Goods" ? "Technical Specifications" : "Terms of Reference (TOR)"} <span className="text-red-500">*</span>
                </label>
                <div className={cn(
                  "border border-dashed rounded-lg p-3",
                  issueFor("attachments") ? "border-red-300 bg-red-50/30" : "border-slate-300 bg-slate-50/60"
                )}>
                  {formFiles.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {formFiles.map((file, idx) => (
                        <div key={file.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <button onClick={() => openFile(file)} className="flex items-center gap-2 min-w-0 text-left">
                            <Paperclip size={12} className="text-purple-700 shrink-0" />
                            <span className="text-[12px] text-slate-700 truncate hover:underline">{file.name}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{file.type} · {file.sizeLabel}</span>
                          </button>
                          <button onClick={() => setFormFiles((prev) => prev.filter((_, i) => i !== idx))} className="p-0.5 hover:bg-slate-100 rounded shrink-0">
                            <X size={12} className="text-slate-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => void handlePickFiles()}
                    className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-[11px] text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Upload size={12} /> Choose file…
                  </button>
                </div>
                {issueFor("attachments") && <FieldError message={issueFor("attachments")!} />}
              </div>

              {/* Requested By */}
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5 block">
                  Requested By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.requestedBy}
                  onChange={(e) => setField("requestedBy", e.target.value)}
                  placeholder="Full name of requester"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
              <p className="text-[11px] text-slate-400">
                {shownIssues.length > 0
                  ? `${shownIssues.length} issue${shownIssues.length === 1 ? "" : "s"} to resolve before submission.`
                  : "Ready to enter the approval workflow."}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={closeAddModal} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleSaveDraft} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">Save as Draft</button>
                <button
                  onClick={handleSubmitNewRequisition}
                  className="px-6 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
                >
                  Submit Requisition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderWithdrawModal()}
      {renderResubmitModal()}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-[11px] text-red-500 mt-1 flex items-start gap-1">
      <AlertCircle size={11} className="mt-0.5 shrink-0" /> {message}
    </p>
  );
}
