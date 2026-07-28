import { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft, Upload, FileText, Check, Clock, ChevronDown, Lock,
  Globe, Users, Send, ClipboardList, Handshake, Award, Eye,
  AlertTriangle, CheckCircle2, X, Paperclip, CalendarDays,
  Bell, ExternalLink, ShieldCheck, RotateCcw, History, Trash2, Download,
  PenLine, AlertCircle, UserPlus, Unlock, Star, UserCheck, Ban, Plus, FileSpreadsheet,
} from "lucide-react";
import { getSignature, subscribe as subscribeSignature, getCurrentUserId, canUseSignature } from "../lib/signatureStore";
import {
  getSuppliers, getEligibleSuppliers, checkSourcingEligibility, supplierDisplayName, supplierEmail,
  avgScore, registerSupplier, subscribe as subscribeSuppliers,
  SUPPLIER_CATEGORIES, SUB_CATEGORIES,
  type Supplier, type SupplierType, type NewFirmInput, type NewIndividualInput,
} from "../lib/supplierStore";
import {
  PROCUREMENT_METHODS, canonicalMethod, validateMethodAgainstThreshold, getThreshold, formatBand,
  isDirect, isRFQ, requiresAdvertisement, type ProcurementMethod,
} from "../lib/procurementThresholds";
import { notify, notifyAll } from "../lib/notificationStore";
import { can, denialReason, getCurrentUser, subscribe as subscribeUser, type AppUser } from "../lib/currentUser";
import { exportToExcel, exportToPDF, type ExportColumn } from "../lib/exportUtils";
import {
  publishTender, getTenderByRef, isTenderOpen, updateTenderStatus, openEnvelope,
  getSubmissions, getOpenedSubmissions, getSubmissionTimestampReport,
  subscribe as subscribeTenders,
  type PublishedTender, type TenderSubmission, type TenderDocument,
} from "../lib/tenderPortalStore";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════════ */

/** The canonical four methods — Sourcing shares the vocabulary with the rest of the suite. */
export type SourcingMethod = ProcurementMethod;

export type CategoryType = "Goods" | "Services" | "Works" | "Consultancy";

export type StepStatus = "completed" | "active" | "locked";

export interface DocVersion {
  versionNumber: number;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  type: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  uploadedBy: string;
  date: string;
  type: string;
  size: string;
  version: number;
  versions: DocVersion[];
  label: string; // category label e.g. "ITB Document", "Evaluation Report"
}

export interface SourcingStep {
  key: string;
  label: string;
  icon: React.ReactNode;
  status: StepStatus;
  description: string;
  optional?: boolean;
  documents: UploadedDoc[];
}

export interface SupplierBid {
  id: string;
  supplierName: string;
  dateReceived: string;
  bidReference?: string;
  notes?: string;
  technicalProposal?: string;
  financialProposal?: string;
  proposalType?: "Combined" | "Separate";
}

/** A supplier formally invited to bid, with the eligibility decision recorded. */
export interface InvitedSupplier {
  supplierId: string;
  supplierRef: string;
  name: string;
  email: string;
  category: string;
  performanceScore: number;
  invitedAt: string;
  invitedBy: string;
  /** Present when the supplier could only be invited with management sign-off. */
  managementApproval?: { approvedBy: string; justification: string; warnings: string[] };
}

/** Where and when the solicitation was advertised. */
export interface AdvertisementRecord {
  reference: string;
  channels: string[];
  publicationDate: string;
  closingDate: string;
  closingTime: string;
  postedAt: string;
  postedBy: string;
}

/** One EoI respondent, scored and either shortlisted or not. */
export interface ShortlistEntry {
  id: string;
  supplierId?: string;
  name: string;
  category?: string;
  performanceScore?: number;
  eoiScore?: number;
  notes?: string;
  shortlisted: boolean;
  /** Optional daily/monthly rate captured at EoI for individual consultants. */
  proposedRate?: number;
  rateType?: "Daily" | "Monthly";
  interviewDate?: string;
  interviewScore?: number;
  interviewNotes?: string;
  interviewPanel?: string;
}

export interface MethodChangeRecord {
  from: SourcingMethod;
  to: SourcingMethod;
  at: string;
  by: string;
  justification: string;
  compliant: boolean;
}

export interface SourcingCase {
  id: string;
  caseNumber: string;
  sourcePR: string;
  description: string;
  category: CategoryType;
  method: SourcingMethod;
  budget: number;
  requestedBy: string;
  department: string;
  projectName: string;
  dateCreated: string;
  currentStepKey: string;
  overallStatus: "In Progress" | "Completed" | "Cancelled";
  steps: SourcingStep[];
  awardedSupplier?: string;
  contractNumber?: string;
  suppliersBidding?: SupplierBid[];
  fundingSource?: string;
  separateProposals?: boolean;
  bidOpeningMinutes?: string;
  bidOpeningAttendance?: string;
  /** Persisted selections — previously these were thrown away on modal close. */
  invitedSuppliers?: InvitedSupplier[];
  advertisement?: AdvertisementRecord;
  shortlist?: ShortlistEntry[];
  proposalRequirement?: "Technical" | "Financial" | "Both";
  /** Individual consultants route from shortlisting straight to interview. */
  individualConsultantRoute?: boolean;
  methodHistory?: MethodChangeRecord[];
  /** Date the case reached Completed, so processing time is measurable. */
  completedDate?: string;
}

export interface ContractAwardPayload {
  caseId: string;
  contractNumber: string;
  supplier: string;
  supplierRef?: string;
  comments: string;
  awardedBy: string;
  managementApproval?: { approvedBy: string; justification: string };
  consultantRate?: { rate: number; rateType: "Daily" | "Monthly" };
}

export interface DocUploadPayload {
  caseId: string;
  stepKey: string;
  doc: UploadedDoc;
}

export interface SupplierBidUpdatePayload {
  caseId: string;
  suppliersBidding: SupplierBid[];
}

interface SourcingCaseDetailProps {
  sourcingCase: SourcingCase;
  onBack: () => void;
  onMethodChange: (caseId: string, newMethod: SourcingMethod, justification: string) => void;
  onStepAdvance: (caseId: string, stepKey: string) => void;
  onContractAward: (payload: ContractAwardPayload) => void;
  onDocUpload: (payload: DocUploadPayload) => void;
  onSupplierBidUpdate: (payload: SupplierBidUpdatePayload) => void;
  /** Generic persistence channel for the state the case now carries. */
  onCaseUpdate: (caseId: string, patch: Partial<SourcingCase>) => void;
  onNavigateToContract?: () => void;
  onGeneratePO?: () => void;
  poGenerated?: boolean;
  poNumber?: string;
}

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "'Montserrat Variable', sans-serif";
const DEFAULT_CONTACT_EMAIL = "procurement@acet.org";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatDateTime = (s: string) =>
  new Date(s).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = { pdf: "PDF", docx: "DOCX", doc: "DOC", xlsx: "XLSX", xls: "XLS", png: "PNG", jpg: "JPEG", jpeg: "JPEG", csv: "CSV", zip: "ZIP" };
  return map[ext] || ext.toUpperCase() || "FILE";
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/**
 * Sourcing speaks in procurement categories (Goods/Services/Works/Consultancy);
 * the supplier register uses the supplier taxonomy. This is the join between them.
 */
export function supplierCategoryFor(category: CategoryType): string {
  switch (category) {
    case "Consultancy": return "Consulting";
    case "Services": return "Non-Consulting Services";
    case "Works": return "Works";
    default: return "Goods";
  }
}

function getStepIcon(key: string, size: number = 16) {
  switch (key) {
    case "solicitation": return <FileText size={size} />;
    case "advertisement": return <Globe size={size} />;
    case "eoi_shortlisting": return <ClipboardList size={size} />;
    case "invitation": return <Send size={size} />;
    case "submission_portal": return <Lock size={size} />;
    case "interview": return <UserCheck size={size} />;
    case "bid_opening": return <Eye size={size} />;
    case "evaluation": return <ClipboardList size={size} />;
    case "negotiations": return <Handshake size={size} />;
    case "contract_award": return <Award size={size} />;
    default: return <FileText size={size} />;
  }
}

function getDocLabelsForStep(key: string, category: CategoryType): string[] {
  switch (key) {
    case "solicitation":
      return category === "Services" || category === "Consultancy"
        ? ["RFP Document", "Evaluation Criteria Matrix", "Terms of Reference", "Draft Contract Template"]
        : ["ITB Document", "Evaluation Criteria Matrix", "Specifications", "Draft Contract Template"];
    case "advertisement":
      return ["Portal Posting Confirmation", "External Ad Proof"];
    case "eoi_shortlisting":
      return ["EoI Evaluation Report", "Shortlist Matrix"];
    case "invitation":
      return ["Invitation Letters", "Bidder Instructions"];
    case "submission_portal":
      return ["Submission Log", "Encryption Certificates", "Technical Proposal", "Financial Proposal"];
    case "interview":
      return ["Interview Schedule", "Interview Score Sheets", "Panel Report"];
    case "bid_opening":
      return ["Bid Opening Minutes", "Attendance Sheet", "Bid Summary Table", "Supporting Notes", "Opening Minutes", "Attendance Record", "Technical Proposal", "Financial Proposal"];
    case "evaluation":
      return category === "Services" || category === "Consultancy"
        ? ["Combined Evaluation Report", "Score Matrix", "Interview Scores", "Approval Recommendation"]
        : ["Standard Evaluation Report", "Score Matrix", "Approval Recommendation"];
    case "negotiations":
      return ["Negotiation Report", "Meeting Minutes", "Revised Terms / Pricing"];
    case "contract_award":
      return ["Signed Contract / Award Letter", "Performance Bond / Guarantee"];
    default: return [];
  }
}

/**
 * A step is finished when it has produced its artefact. For most steps that is a
 * document; for the steps that now carry real state it is that state.
 */
function isStepSatisfied(step: SourcingStep, sc: SourcingCase, openedCount: number): boolean {
  if (step.documents.length > 0) return true;
  switch (step.key) {
    case "invitation": return (sc.invitedSuppliers?.length ?? 0) > 0;
    case "advertisement": return !!sc.advertisement;
    case "eoi_shortlisting": return (sc.shortlist ?? []).some(s => s.shortlisted);
    case "interview": return (sc.shortlist ?? []).some(s => s.interviewScore !== undefined);
    case "submission_portal": return openedCount > 0;
    case "bid_opening": return (sc.suppliersBidding?.length ?? 0) > 0 || openedCount > 0;
    default: return false;
  }
}

/** One row in the merged bid list — electronic submissions and manual entries together. */
interface MergedBid {
  key: string;
  supplierName: string;
  dateReceived: string;
  reference: string;
  notes: string;
  origin: "Electronic" | "Manual";
  envelope?: string;
  rate?: string;
  bidId?: string;
}

const SUBMISSION_REPORT_COLUMNS: ExportColumn<Record<string, unknown>>[] = [
  { key: "submissionId", header: "Submission ID" },
  { key: "supplier", header: "Supplier" },
  { key: "envelope", header: "Envelope" },
  { key: "submittedAt", header: "Received (timestamp)" },
  { key: "onTime", header: "On Time", format: v => (v ? "Yes" : "No — late") },
  { key: "documents", header: "Docs" },
  { key: "acknowledgement", header: "Acknowledgement" },
  { key: "sourceIp", header: "Source IP" },
  { key: "status", header: "Envelope Status" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function SourcingCaseDetail({
  sourcingCase, onBack, onMethodChange, onStepAdvance, onContractAward, onDocUpload,
  onSupplierBidUpdate, onCaseUpdate, onNavigateToContract,
  onGeneratePO, poGenerated, poNumber: generatedPONumber,
}: SourcingCaseDetailProps) {
  const sc = sourcingCase;

  const [selectedStepKey, setSelectedStepKey] = useState<string>(sourcingCase.currentStepKey);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);

  // ── Identity & permissions ──
  const [user, setUser] = useState<AppUser>(getCurrentUser());
  useEffect(() => subscribeUser(() => setUser(getCurrentUser())), []);
  const canManage = can("sourcing.manage", user);
  const canAward = can("sourcing.award", user);
  const manageDenial = denialReason("sourcing.manage");
  const awardDenial = denialReason("sourcing.award");

  // ── Store subscriptions (suppliers + tender portal) ──
  const [storeTick, setStoreTick] = useState(0);
  useEffect(() => {
    const bump = () => setStoreTick(t => t + 1);
    const unsubV = subscribeSuppliers(bump);
    const unsubT = subscribeTenders(bump);
    return () => { unsubV(); unsubT(); };
  }, []);

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStepKey, setUploadStepKey] = useState("");
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLabelDropdown, setUploadLabelDropdown] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Version history modal
  const [showVersionHistory, setShowVersionHistory] = useState<UploadedDoc | null>(null);

  // Supplier bid recording modal
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidSupplierName, setBidSupplierName] = useState("");
  const [bidReference, setBidReference] = useState("");
  const [bidNotes, setBidNotes] = useState("");
  const [bidDate, setBidDate] = useState(todayStr());
  const [bidError, setBidError] = useState("");

  // Method change
  const [pendingMethod, setPendingMethod] = useState<SourcingMethod | null>(null);
  const [methodJustification, setMethodJustification] = useState("");
  const [methodError, setMethodError] = useState("");

  // Advertisement / tender publication
  const [showAdvertiseModal, setShowAdvertiseModal] = useState(false);
  const [adChannels, setAdChannels] = useState<string[]>(["ACET Procurement Portal"]);
  const [adPublicationDate, setAdPublicationDate] = useState(todayStr());
  const [adClosingDate, setAdClosingDate] = useState(addDays(21));
  const [adClosingTime, setAdClosingTime] = useState("17:00");
  const [adContactEmail, setAdContactEmail] = useState(DEFAULT_CONTACT_EMAIL);
  const [adError, setAdError] = useState("");

  // Invitation
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [proposalType, setProposalType] = useState<"Technical" | "Financial" | "Both">(sc.proposalRequirement ?? "Both");
  const [showIneligible, setShowIneligible] = useState(false);
  const [scopeAllCategories, setScopeAllCategories] = useState(false);
  const [mgmtAck, setMgmtAck] = useState(false);
  const [mgmtJustification, setMgmtJustification] = useState("");
  const [inviteClosingDate, setInviteClosingDate] = useState(addDays(14));
  const [inviteError, setInviteError] = useState("");

  // Register supplier
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regType, setRegType] = useState<SupplierType>("Firm");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCategory, setRegCategory] = useState<string>(supplierCategoryFor(sc.category));
  const [regSubCategory, setRegSubCategory] = useState<string>("");
  const [regAddress, setRegAddress] = useState("");
  const [regRegNumber, setRegRegNumber] = useState("");
  const [regTaxId, setRegTaxId] = useState("");
  const [regContactPerson, setRegContactPerson] = useState("");
  const [regIdType, setRegIdType] = useState<"Passport" | "National ID" | "Driver's License">("National ID");
  const [regIdNumber, setRegIdNumber] = useState("");
  const [regExpertAreas, setRegExpertAreas] = useState("");
  const [regError, setRegError] = useState("");
  const [regResult, setRegResult] = useState<{ supplierId: string; name: string; warnings: string[] } | null>(null);

  // Envelope opening / tender ops
  const [envelopeError, setEnvelopeError] = useState("");
  const [envelopeNotice, setEnvelopeNotice] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Shortlist
  const [newRespondent, setNewRespondent] = useState("");

  // Award
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardSupplierId, setAwardSupplierId] = useState("");
  const [contractComment, setContractComment] = useState("");
  const [awardMgmtAck, setAwardMgmtAck] = useState(false);
  const [awardMgmtJustification, setAwardMgmtJustification] = useState("");
  const [awardRate, setAwardRate] = useState("");
  const [awardRateType, setAwardRateType] = useState<"Daily" | "Monthly">("Daily");
  const [awardError, setAwardError] = useState("");

  // Signature
  const [signatureData, setSignatureData] = useState(getSignature());
  const [showSignModal, setShowSignModal] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeSignature(() => setSignatureData(getSignature()));
    return unsub;
  }, []);

  const handleApplySignature = () => {
    if (!canUseSignature(getCurrentUserId())) return;
    setSigned(true);
    setSignedAt(new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
    setShowSignModal(false);
  };

  // Changing the method or the consultant route rebuilds the step list; if the
  // step being viewed no longer exists, fall back to the current one.
  useEffect(() => {
    if (!sc.steps.some(s => s.key === selectedStepKey)) {
      setSelectedStepKey(sc.currentStepKey);
    }
  }, [sc.steps, sc.currentStepKey, selectedStepKey]);

  const selectedStep = sc.steps.find(s => s.key === selectedStepKey);

  /* ── Notification helper: requester + internal stakeholders, every stage ── */
  const announce = (
    subject: string,
    body: string,
    opts?: { category?: "Info" | "Alert" | "Approval" | "Reminder"; priority?: "Low" | "Normal" | "High" | "Urgent"; sms?: boolean }
  ) => {
    notifyAll(
      [{ name: sc.requestedBy }, { role: "Procurement" }, { role: "Department Head" }],
      {
        category: opts?.category ?? "Info",
        module: "Sourcing",
        subject,
        body,
        entityRef: sc.caseNumber,
        priority: opts?.priority ?? "Normal",
        channels: opts?.sms ? ["In-App", "Email", "SMS"] : ["In-App", "Email"],
      }
    );
  };

  /* ── Tender portal state for this case ── */
  const tender: PublishedTender | undefined = useMemo(
    () => getTenderByRef(sc.caseNumber),
    [sc.caseNumber, storeTick]
  );
  const submissions: TenderSubmission[] = useMemo(
    () => (tender ? getSubmissions(sc.caseNumber) : []),
    [tender, sc.caseNumber, storeTick]
  );
  const openedSubmissions: TenderSubmission[] = useMemo(
    () => (tender ? getOpenedSubmissions(sc.caseNumber) : []),
    [tender, sc.caseNumber, storeTick]
  );
  const tenderOpen = tender ? isTenderOpen(tender) : false;
  const sealedCount = submissions.filter(s => s.locked).length;

  /* ── Merged bid list: electronic (once opened) + manual entries ── */
  const mergedBids: MergedBid[] = useMemo(() => {
    const electronic: MergedBid[] = openedSubmissions.map(s => ({
      key: `sub-${s.id}`,
      supplierName: s.supplierName,
      dateReceived: s.submittedAt,
      reference: s.submissionId,
      notes: s.coverNote || `${s.envelope} envelope · ${s.documents.length} document(s) · opened by ${s.openedBy ?? "—"}`,
      origin: "Electronic" as const,
      envelope: s.envelope,
      rate: s.proposedRate ? `${formatCurrency(s.proposedRate.amount)} ${s.proposedRate.rateType.toLowerCase()}` : undefined,
    }));
    const manual: MergedBid[] = (sc.suppliersBidding ?? []).map(b => ({
      key: `bid-${b.id}`,
      supplierName: b.supplierName,
      dateReceived: b.dateReceived,
      reference: b.bidReference || "—",
      notes: b.notes || "—",
      origin: "Manual" as const,
      bidId: b.id,
    }));
    return [...electronic, ...manual].sort((a, b) => a.dateReceived.localeCompare(b.dateReceived));
  }, [openedSubmissions, sc.suppliersBidding]);

  /* ── Supplier pool for the pickers ── */
  const supplierPool = useMemo(() => {
    const scopeCategory = scopeAllCategories ? undefined : supplierCategoryFor(sc.category);
    const eligible = getEligibleSuppliers(scopeCategory);
    const pool: Supplier[] = showIneligible
      ? getSuppliers().filter(v => !scopeCategory || v.category === scopeCategory)
      : eligible;
    return pool
      .map(v => ({
        supplier: v,
        name: supplierDisplayName(v),
        email: supplierEmail(v),
        score: avgScore(v.performance),
        eligibility: checkSourcingEligibility(v.id),
      }))
      .sort(
        (a, b) =>
          Number(b.eligibility.eligible) - Number(a.eligibility.eligible) ||
          Number(a.eligibility.requiresManagementApproval) - Number(b.eligibility.requiresManagementApproval) ||
          b.score - a.score
      );
  }, [sc.category, showIneligible, scopeAllCategories, storeTick]);

  const shortlistedNames = useMemo(
    () => new Set((sc.shortlist ?? []).filter(s => s.shortlisted).map(s => s.name.toLowerCase())),
    [sc.shortlist]
  );

  const selectedSupplierEntries = supplierPool.filter(v => selectedSupplierIds.includes(v.supplier.id));
  const blockedSelections = selectedSupplierEntries.filter(v => !v.eligibility.eligible);
  const approvalSelections = selectedSupplierEntries.filter(v => v.eligibility.eligible && v.eligibility.requiresManagementApproval);

  /* ── Award candidates: whoever actually engaged, else the eligible register ── */
  const awardCandidates = useMemo(() => {
    const names = new Set<string>();
    (sc.invitedSuppliers ?? []).forEach(v => names.add(v.name.toLowerCase()));
    mergedBids.forEach(b => names.add(b.supplierName.toLowerCase()));
    (sc.shortlist ?? []).filter(s => s.shortlisted).forEach(s => names.add(s.name.toLowerCase()));

    const all = getSuppliers().map(v => ({
      supplier: v,
      name: supplierDisplayName(v),
      score: avgScore(v.performance),
      eligibility: checkSourcingEligibility(v.id),
    }));
    const engaged = all.filter(v => names.has(v.name.toLowerCase()));
    if (engaged.length > 0) return engaged.sort((a, b) => b.score - a.score);
    return all
      .filter(v => v.eligibility.eligible && v.supplier.category === supplierCategoryFor(sc.category))
      .sort((a, b) => b.score - a.score);
  }, [sc.invitedSuppliers, sc.shortlist, mergedBids, sc.category, storeTick]);

  const awardCandidate = awardCandidates.find(c => c.supplier.id === awardSupplierId);
  const awardEligibility = awardCandidate?.eligibility;
  const awardShortlistEntry = (sc.shortlist ?? []).find(
    s => awardCandidate && s.name.toLowerCase() === awardCandidate.name.toLowerCase()
  );
  const awardSubmissionRate = openedSubmissions.find(
    s => awardCandidate && s.supplierName.toLowerCase() === awardCandidate.name.toLowerCase() && s.proposedRate
  )?.proposedRate;

  const getMethodColor = (m: SourcingMethod) => {
    switch (canonicalMethod(m)) {
      case "Open Competition": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Limited Competition": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Direct Selection": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-green-50 text-green-700 border-green-200";
    }
  };

  /* ── Upload handlers ── */

  const openUploadModal = (stepKey: string, presetLabel?: string) => {
    if (!canManage) return;
    setUploadStepKey(stepKey);
    setUploadLabel(presetLabel || "");
    setUploadFile(null);
    setUploadError("");
    setUploadSuccess(false);
    setShowUploadModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File exceeds 25MB limit.");
      return;
    }

    const allowed = [
      "application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/png", "image/jpeg", "text/csv", "application/zip",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx?|xlsx?|png|jpe?g|csv|zip)$/i)) {
      setUploadError("Unsupported file type. Allowed: PDF, DOCX, XLSX, PNG, JPG, CSV, ZIP.");
      return;
    }

    setUploadFile(file);
    setUploadError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleUploadConfirm = () => {
    if (!uploadFile) { setUploadError("Please select a file."); return; }
    if (!uploadLabel.trim()) { setUploadError("Please select a document category."); return; }

    const step = sc.steps.find(s => s.key === uploadStepKey);
    const existingDoc = step?.documents.find(d => d.label === uploadLabel);

    const versionNum = existingDoc ? existingDoc.version + 1 : 1;
    const newVersion: DocVersion = {
      versionNumber: versionNum,
      name: uploadFile.name,
      size: formatFileSize(uploadFile.size),
      uploadedBy: user.name,
      date: todayStr(),
      type: getFileType(uploadFile.name),
    };

    const doc: UploadedDoc = existingDoc
      ? {
          ...existingDoc,
          name: uploadFile.name,
          size: formatFileSize(uploadFile.size),
          date: newVersion.date,
          type: newVersion.type,
          version: versionNum,
          versions: [...existingDoc.versions, newVersion],
        }
      : {
          id: `doc-${Date.now()}`,
          name: uploadFile.name,
          uploadedBy: user.name,
          date: newVersion.date,
          type: newVersion.type,
          size: formatFileSize(uploadFile.size),
          version: 1,
          versions: [newVersion],
          label: uploadLabel,
        };

    onDocUpload({ caseId: sc.id, stepKey: uploadStepKey, doc });
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
    }, 1200);
  };

  const handleCompleteStep = (stepKey: string) => {
    if (!canManage) return;
    onStepAdvance(sc.id, stepKey);
  };

  /* ── Method change with threshold guidance ── */

  const methodCheck = pendingMethod ? validateMethodAgainstThreshold(pendingMethod, sc.budget) : null;
  const methodBand = pendingMethod ? getThreshold(canonicalMethod(pendingMethod)) : undefined;
  const methodNeedsJustification = !!methodCheck && (!methodCheck.compliant || methodCheck.requiresJustification);

  const confirmMethodChange = () => {
    if (!pendingMethod || !methodCheck) return;
    if (methodNeedsJustification && !methodJustification.trim()) {
      setMethodError("Record a justification before changing the method.");
      return;
    }
    onMethodChange(sc.id, pendingMethod, methodJustification.trim());
    announce(
      `${sc.caseNumber} — procurement method changed to ${pendingMethod}`,
      [
        `${user.name} changed the procurement method for "${sc.description}" from ${sc.method} to ${pendingMethod}.`,
        `Case value ${formatCurrency(sc.budget)} — the thresholds indicate ${methodCheck.suggested}.`,
        methodCheck.compliant ? "The choice sits inside its value band." : `Deviation recorded: ${methodCheck.message}`,
        methodJustification.trim() ? `Justification: ${methodJustification.trim()}` : "",
        "The workflow steps have been rebuilt for the new method.",
      ].filter(Boolean).join("\n"),
      { category: methodCheck.compliant ? "Info" : "Alert", priority: methodCheck.compliant ? "Normal" : "High" }
    );
    setPendingMethod(null);
    setMethodJustification("");
    setMethodError("");
  };

  /* ── Advertisement / tender publication ── */

  const solicitationDocs = (): TenderDocument[] => {
    const step = sc.steps.find(s => s.key === "solicitation");
    return (step?.documents ?? []).map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
      size: d.size,
      uploadedAt: d.date,
    }));
  };

  const envelopeRequirements = () => {
    // Only services and consultancy solicitations split the requirement; goods and
    // works always ask for both a technical response and a price.
    const isService = sc.category === "Services" || sc.category === "Consultancy";
    const requirement = isService ? proposalType : "Both";
    return {
      requiresTechnical: requirement !== "Financial",
      requiresFinancial: requirement !== "Technical",
      requestRateQuote: sc.category === "Consultancy",
    };
  };

  const openAdvertiseModal = () => {
    if (!canManage) return;
    const existing = sc.advertisement;
    setAdChannels(existing?.channels ?? ["ACET Procurement Portal"]);
    setAdPublicationDate(existing?.publicationDate ?? todayStr());
    setAdClosingDate(existing?.closingDate ?? addDays(21));
    setAdClosingTime(existing?.closingTime ?? "17:00");
    setAdContactEmail(tender?.contactEmail ?? DEFAULT_CONTACT_EMAIL);
    setAdError("");
    setShowAdvertiseModal(true);
  };

  const toggleAdChannel = (channel: string) => {
    setAdChannels(prev => (prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]));
  };

  const handlePostAdvertisement = () => {
    if (adChannels.length === 0) { setAdError("Select at least one publication channel."); return; }
    if (!adClosingDate) { setAdError("A closing date is required."); return; }
    if (adClosingDate <= adPublicationDate) { setAdError("The closing date must fall after the publication date."); return; }

    const env = envelopeRequirements();
    const reference = sc.advertisement?.reference ?? `ADV-${sc.caseNumber}-${String(Date.now()).slice(-4)}`;

    publishTender({
      tenderRef: sc.caseNumber,
      title: sc.description,
      description: `${sc.description} — ${sc.category} procurement for ${sc.projectName}, ${sc.department}. Solicitation issued under ${sc.method}.`,
      category: sc.category,
      method: sc.method,
      department: sc.department,
      estimatedValue: sc.budget,
      closingDate: adClosingDate,
      closingTime: adClosingTime,
      documents: solicitationDocs(),
      requiresTechnical: env.requiresTechnical,
      requiresFinancial: env.requiresFinancial,
      requestRateQuote: env.requestRateQuote,
      invitedSupplierIds: [],
      channels: adChannels,
      contactEmail: adContactEmail,
    });

    const record: AdvertisementRecord = {
      reference,
      channels: adChannels,
      publicationDate: adPublicationDate,
      closingDate: adClosingDate,
      closingTime: adClosingTime,
      postedAt: new Date().toISOString(),
      postedBy: user.name,
    };
    onCaseUpdate(sc.id, { advertisement: record });

    announce(
      `${sc.caseNumber} — tender advertised (${reference})`,
      [
        `"${sc.description}" has been published for open competition by ${user.name}.`,
        `Channels: ${adChannels.join(", ")}.`,
        `Published ${formatDate(adPublicationDate)}; bids close ${formatDate(adClosingDate)} at ${adClosingTime}.`,
        `The tender is live on the supplier portal — every eligible supplier can download the documents and submit electronically.`,
      ].join("\n")
    );

    setAdError("");
    setShowAdvertiseModal(false);
  };

  /* ── Invitation ── */

  const openInviteModal = () => {
    if (!canManage) return;
    setSelectedSupplierIds((sc.invitedSuppliers ?? []).map(v => v.supplierId));
    setProposalType(sc.proposalRequirement ?? "Both");
    setMgmtAck(false);
    setMgmtJustification("");
    setInviteError("");
    setShowInviteModal(true);
  };

  const toggleSupplier = (id: string) => {
    const entry = supplierPool.find(v => v.supplier.id === id);
    if (entry && !entry.eligibility.eligible) return; // blocked outright
    setInviteError("");
    if (isDirect(sc.method)) {
      setSelectedSupplierIds([id]);
      return;
    }
    setSelectedSupplierIds(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

  const selectAllShortlisted = () => {
    const ids = supplierPool
      .filter(v => v.eligibility.eligible && shortlistedNames.has(v.name.toLowerCase()))
      .map(v => v.supplier.id);
    setSelectedSupplierIds(isDirect(sc.method) ? ids.slice(0, 1) : ids);
  };

  const handleSendInvitations = () => {
    if (selectedSupplierIds.length === 0) { setInviteError("Select at least one supplier."); return; }
    if (blockedSelections.length > 0) {
      setInviteError(`${blockedSelections.map(v => v.name).join(", ")} cannot be engaged. Remove them from the selection.`);
      return;
    }
    if (approvalSelections.length > 0 && (!mgmtAck || !mgmtJustification.trim())) {
      setInviteError("Confirm Senior Management approval and record a justification for the flagged suppliers.");
      return;
    }

    const at = new Date().toISOString();
    const invited: InvitedSupplier[] = selectedSupplierEntries.map(v => ({
      supplierId: v.supplier.id,
      supplierRef: v.supplier.supplierId,
      name: v.name,
      email: v.email,
      category: `${v.supplier.category} · ${v.supplier.subCategory}`,
      performanceScore: v.score,
      invitedAt: at,
      invitedBy: user.name,
      managementApproval: v.eligibility.requiresManagementApproval
        ? { approvedBy: user.name, justification: mgmtJustification.trim(), warnings: v.eligibility.warnings }
        : undefined,
    }));

    onCaseUpdate(sc.id, { invitedSuppliers: invited, proposalRequirement: proposalType });

    // A restricted tender so the invited suppliers — and only they — can submit
    // electronically through the portal.
    if (!requiresAdvertisement(sc.method)) {
      const env = envelopeRequirements();
      publishTender({
        tenderRef: sc.caseNumber,
        title: sc.description,
        description: `${sc.description} — restricted solicitation issued under ${sc.method} for ${sc.projectName} (${sc.department}).`,
        category: sc.category,
        method: sc.method,
        department: sc.department,
        estimatedValue: sc.budget,
        closingDate: inviteClosingDate,
        closingTime: "17:00",
        documents: solicitationDocs(),
        requiresTechnical: env.requiresTechnical,
        requiresFinancial: env.requiresFinancial,
        requestRateQuote: env.requestRateQuote,
        invitedSupplierIds: invited.map(v => v.supplierId),
        channels: ["ACET Supplier Portal — Restricted"],
        contactEmail: DEFAULT_CONTACT_EMAIL,
      });
    }

    announce(
      `${sc.caseNumber} — ${isDirect(sc.method) ? "supplier selected" : `${invited.length} bidder(s) invited`}`,
      [
        `${user.name} ${isDirect(sc.method) ? "selected" : "invited"} the following for "${sc.description}" (${sc.method}):`,
        ...invited.map(v => `• ${v.name} (${v.supplierRef}) — rating ${v.performanceScore || "n/a"}/10 — ${v.email}`),
        sc.category === "Services" || sc.category === "Consultancy" ? `\nProposal requirement: ${proposalType === "Both" ? "Technical + Financial" : `${proposalType} only`}.` : "",
        approvalSelections.length > 0
          ? `\n⚠ Management approval recorded for ${approvalSelections.map(v => v.name).join(", ")}.\nJustification: ${mgmtJustification.trim()}`
          : "",
        !requiresAdvertisement(sc.method)
          ? `\nA restricted tender is now open on the supplier portal; submissions close ${formatDate(inviteClosingDate)} at 17:00.`
          : "",
      ].filter(Boolean).join("\n"),
      { category: approvalSelections.length > 0 ? "Alert" : "Info", priority: approvalSelections.length > 0 ? "High" : "Normal" }
    );

    setShowInviteModal(false);
    setInviteError("");
  };

  /* ── Register a new supplier without leaving Sourcing ── */

  const resetRegisterForm = () => {
    setRegType("Firm"); setRegName(""); setRegEmail(""); setRegPhone("");
    setRegCategory(supplierCategoryFor(sc.category)); setRegSubCategory("");
    setRegAddress(""); setRegRegNumber(""); setRegTaxId(""); setRegContactPerson("");
    setRegIdType("National ID"); setRegIdNumber(""); setRegExpertAreas("");
    setRegError(""); setRegResult(null);
  };

  const handleRegisterSupplier = () => {
    if (!regName.trim()) { setRegError("A legal name is required."); return; }
    if (!regEmail.trim()) { setRegError("An email address is required."); return; }
    if (!regSubCategory) { setRegError("Select a sub-category."); return; }

    const shared = {
      category: regCategory,
      subCategory: regSubCategory,
      documents: [] as string[],
      documentExpiry: {} as Record<string, string>,
      bankName: "",
      bankAccountNumber: "",
    };

    const input: NewFirmInput | NewIndividualInput =
      regType === "Firm"
        ? {
            ...shared,
            legalBusinessName: regName.trim(),
            registrationNumber: regRegNumber.trim(),
            taxId: regTaxId.trim(),
            registeredAddress: regAddress.trim(),
            contactPerson: regContactPerson.trim() || regName.trim(),
            email: regEmail.trim(),
            phone: regPhone.trim(),
          }
        : {
            ...shared,
            legalName: regName.trim(),
            contactEmail: regEmail.trim(),
            contactPhone: regPhone.trim(),
            idType: regIdType,
            idNumber: regIdNumber.trim(),
            residentialAddress: regAddress.trim(),
            expertAreas: regExpertAreas.split(",").map(s => s.trim()).filter(Boolean),
            historicalRates: [],
          };

    const { supplier, flags } = registerSupplier(regType, input, { registeredBy: user.name, source: "Internal" });

    const warnings: string[] = [];
    if (flags.sanctioned) warnings.push("This name matches a donor/statutory sanctions entry — escalate before approving.");
    if (flags.duplicates.length > 0) warnings.push(`Possible duplicate of ${flags.duplicates.map(d => supplierDisplayName(d)).join(", ")}.`);
    if (flags.missingDocs.length > 0) warnings.push(`Outstanding documents: ${flags.missingDocs.join(", ")}.`);

    setRegResult({ supplierId: supplier.supplierId, name: supplierDisplayName(supplier), warnings });
    setRegError("");
  };

  /* ── Electronic submissions: closing, opening, reporting ── */

  const handleCloseTender = () => {
    if (!tender) return;
    updateTenderStatus(sc.caseNumber, "Closed");
    setEnvelopeError("");
    setEnvelopeNotice(`Tender ${sc.caseNumber} closed for submission. ${sealedCount} sealed submission(s) are ready for opening.`);
    announce(
      `${sc.caseNumber} — tender closed for submission`,
      `${user.name} closed "${tender.title}" at ${formatDateTime(new Date().toISOString())}. ${sealedCount} sealed submission(s) are held for the official opening.`
    );
  };

  const handleOpenEnvelope = (envelope: "Technical" | "Financial" | "All") => {
    if (!tender) return;
    const result = openEnvelope(sc.caseNumber, envelope, user.name);
    if (!result.ok) {
      setEnvelopeNotice("");
      setEnvelopeError(result.error ?? "The envelope could not be opened.");
      return;
    }
    setEnvelopeError("");
    setEnvelopeNotice(`${envelope} envelope opened — ${result.opened} submission(s) unsealed and carried into Bid Opening.`);
    announce(
      `${sc.caseNumber} — ${envelope.toLowerCase()} envelope opened`,
      [
        `${user.name} opened the ${envelope.toLowerCase()} envelope for "${tender.title}" at ${formatDateTime(new Date().toISOString())}.`,
        `${result.opened} submission(s) were unsealed and are now visible in Bid Opening and Evaluation.`,
        envelope === "Technical"
          ? "Financial envelopes remain sealed until the technical evaluation is settled."
          : "",
      ].filter(Boolean).join("\n"),
      { sms: true }
    );
  };

  const exportSubmissionReport = (format: "excel" | "pdf") => {
    const rows = getSubmissionTimestampReport(sc.caseNumber) as unknown as Record<string, unknown>[];
    const title = `Submission Timestamps ${sc.caseNumber}`;
    const meta = {
      subtitle: `${sc.description} · ${sc.method} · closing ${tender ? `${tender.closingDate} ${tender.closingTime}` : "—"}`,
      generatedBy: user.name,
    };
    if (format === "excel") exportToExcel(title, SUBMISSION_REPORT_COLUMNS, rows, meta);
    else exportToPDF(title, SUBMISSION_REPORT_COLUMNS, rows, { ...meta, orientation: "landscape" });
    setShowExportMenu(false);
  };

  /* ── Shortlisting & interviews ── */

  const updateShortlist = (next: ShortlistEntry[]) => onCaseUpdate(sc.id, { shortlist: next });

  const patchShortlistEntry = (id: string, patch: Partial<ShortlistEntry>) => {
    updateShortlist((sc.shortlist ?? []).map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addShortlistEntry = (name: string, supplier?: Supplier) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const existing = sc.shortlist ?? [];
    if (existing.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    const entry: ShortlistEntry = {
      id: `sl-${Date.now()}-${existing.length}`,
      name: trimmed,
      supplierId: supplier?.id,
      category: supplier ? `${supplier.category} · ${supplier.subCategory}` : undefined,
      performanceScore: supplier ? avgScore(supplier.performance) : undefined,
      shortlisted: false,
    };
    updateShortlist([...existing, entry]);
    setNewRespondent("");
  };

  const importRespondentsFromPortal = () => {
    const existing = sc.shortlist ?? [];
    const known = new Set(existing.map(s => s.name.toLowerCase()));
    const additions: ShortlistEntry[] = [];
    openedSubmissions.forEach((s, i) => {
      if (known.has(s.supplierName.toLowerCase())) return;
      known.add(s.supplierName.toLowerCase());
      const supplier = getSuppliers().find(v => v.id === s.supplierId);
      additions.push({
        id: `sl-${Date.now()}-p${i}`,
        name: s.supplierName,
        supplierId: s.supplierId,
        category: supplier ? `${supplier.category} · ${supplier.subCategory}` : undefined,
        performanceScore: supplier ? avgScore(supplier.performance) : undefined,
        shortlisted: false,
        proposedRate: s.proposedRate?.amount,
        rateType: s.proposedRate?.rateType,
      });
    });
    (sc.invitedSuppliers ?? []).forEach((v, i) => {
      if (known.has(v.name.toLowerCase())) return;
      known.add(v.name.toLowerCase());
      additions.push({
        id: `sl-${Date.now()}-i${i}`,
        name: v.name,
        supplierId: v.supplierId,
        category: v.category,
        performanceScore: v.performanceScore,
        shortlisted: false,
      });
    });
    if (additions.length > 0) updateShortlist([...existing, ...additions]);
  };

  const recordShortlist = () => {
    const shortlisted = (sc.shortlist ?? []).filter(s => s.shortlisted);
    if (shortlisted.length === 0) return;
    announce(
      `${sc.caseNumber} — shortlist recorded (${shortlisted.length})`,
      [
        `${user.name} recorded the EoI shortlist for "${sc.description}".`,
        ...shortlisted
          .sort((a, b) => (b.eoiScore ?? 0) - (a.eoiScore ?? 0))
          .map(s => `• ${s.name} — EoI score ${s.eoiScore ?? "—"}/100${s.proposedRate ? ` — rate ${formatCurrency(s.proposedRate)} ${(s.rateType ?? "Daily").toLowerCase()}` : ""}`),
        sc.individualConsultantRoute
          ? "\nIndividual-consultant route: shortlisted candidates go straight to interview."
          : "\nShortlisted bidders carry into the invitation step.",
      ].join("\n")
    );
  };

  const recordInterviewOutcome = () => {
    const interviewed = (sc.shortlist ?? []).filter(s => s.interviewScore !== undefined);
    if (interviewed.length === 0) return;
    announce(
      `${sc.caseNumber} — interview panel scores recorded`,
      [
        `${user.name} recorded interview outcomes for "${sc.description}".`,
        ...interviewed
          .sort((a, b) => (b.interviewScore ?? 0) - (a.interviewScore ?? 0))
          .map(s => `• ${s.name} — ${s.interviewScore}/100${s.interviewDate ? ` (interviewed ${formatDate(s.interviewDate)})` : ""}${s.interviewPanel ? ` — panel: ${s.interviewPanel}` : ""}`),
      ].join("\n")
    );
  };

  /* ── Manual bid recording ── */

  const openBidModal = () => {
    if (!canManage) return;
    setBidSupplierName("");
    setBidReference("");
    setBidNotes("");
    setBidDate(todayStr());
    setBidError("");
    setShowBidModal(true);
  };

  const handleAddBid = () => {
    if (!bidSupplierName.trim()) { setBidError("Supplier name is required."); return; }
    const newBid: SupplierBid = {
      id: `bid-${Date.now()}`,
      supplierName: bidSupplierName.trim(),
      dateReceived: bidDate,
      bidReference: bidReference.trim() || undefined,
      notes: bidNotes.trim() || undefined,
    };
    const current = sc.suppliersBidding || [];
    onSupplierBidUpdate({ caseId: sc.id, suppliersBidding: [...current, newBid] });
    announce(
      `${sc.caseNumber} — bid received from ${newBid.supplierName}`,
      `A bid was logged manually by ${user.name} on ${formatDate(bidDate)}${newBid.bidReference ? ` under reference ${newBid.bidReference}` : ""}.${newBid.notes ? `\nNotes: ${newBid.notes}` : ""}`
    );
    setShowBidModal(false);
  };

  const handleRemoveBid = (bidId: string) => {
    const current = sc.suppliersBidding || [];
    onSupplierBidUpdate({ caseId: sc.id, suppliersBidding: current.filter(b => b.id !== bidId) });
  };

  const notifyBidOpening = () => {
    announce(
      `${sc.caseNumber} — bid opening session`,
      [
        `${user.name} has convened the bid opening for "${sc.description}".`,
        `${mergedBids.length} bid(s) are on the register: ${openedSubmissions.length} electronic, ${(sc.suppliersBidding ?? []).length} received manually.`,
        "Attend the session or review the minutes and attendance record once uploaded.",
      ].join("\n"),
      { sms: true }
    );
    setEnvelopeNotice("Bid opening notification dispatched to the requester and internal stakeholders.");
  };

  /* ── Award ── */

  const openAwardModal = () => {
    if (!canAward) return;
    setAwardSupplierId("");
    setContractComment("");
    setAwardMgmtAck(false);
    setAwardMgmtJustification("");
    setAwardRate("");
    setAwardRateType("Daily");
    setAwardError("");
    setShowAwardModal(true);
  };

  useEffect(() => {
    if (!awardCandidate) return;
    const prefill = awardShortlistEntry?.proposedRate ?? awardSubmissionRate?.amount;
    setAwardRate(prefill !== undefined ? String(prefill) : "");
    setAwardRateType(awardShortlistEntry?.rateType ?? awardSubmissionRate?.rateType ?? "Daily");
  }, [awardSupplierId]);

  const handleConfirmAward = () => {
    if (!awardCandidate || !awardEligibility) { setAwardError("Select a supplier."); return; }
    if (!awardEligibility.eligible) {
      setAwardError(`${awardCandidate.name} cannot be awarded: ${awardEligibility.blockingReasons.join(" ")}`);
      return;
    }
    if (awardEligibility.requiresManagementApproval && (!awardMgmtAck || !awardMgmtJustification.trim())) {
      setAwardError("Confirm Senior Management approval and record a justification before awarding to this supplier.");
      return;
    }

    const contractNumber = `CNT-${sc.sourcePR.replace("PR-", "")}`;
    const rateValue = Number(awardRate);
    const isIndividual = awardCandidate.supplier.type === "Individual";

    onContractAward({
      caseId: sc.id,
      contractNumber,
      supplier: awardCandidate.name,
      supplierRef: awardCandidate.supplier.id,
      comments: contractComment,
      awardedBy: user.name,
      managementApproval: awardEligibility.requiresManagementApproval
        ? { approvedBy: user.name, justification: awardMgmtJustification.trim() }
        : undefined,
      consultantRate:
        isIndividual && Number.isFinite(rateValue) && rateValue > 0
          ? { rate: rateValue, rateType: awardRateType }
          : undefined,
    });

    setShowAwardModal(false);
    setAwardError("");
  };

  const getAvailableLabels = () => getDocLabelsForStep(uploadStepKey, sc.category);

  /* ── Derived per-step state ── */
  const bidOpeningMinutesDoc = sc.steps.find(s => s.key === "bid_opening")?.documents.find(d => d.label === "Opening Minutes");
  const bidOpeningAttendanceDoc = sc.steps.find(s => s.key === "bid_opening")?.documents.find(d => d.label === "Attendance Record");
  const separateProposals = sc.separateProposals ?? false;
  const stepSatisfied = selectedStep ? isStepSatisfied(selectedStep, sc, openedSubmissions.length) : false;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[16px] font-semibold text-slate-900 truncate" style={{ fontFamily: F }}>
              {sc.caseNumber}
            </h1>
            <span className="text-[11px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded shrink-0">
              {sc.sourcePR}
            </span>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded border ${getMethodColor(sc.method)}`}>
              {sc.method}
            </span>
            {tender && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                tenderOpen ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}>
                Portal: {tenderOpen ? "Open for bids" : tender.status}
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5 truncate" style={{ fontFamily: F }}>
            {sc.description} &middot; {sc.category} &middot; {formatCurrency(sc.budget)} &middot; Requested by {sc.requestedBy}
          </p>
        </div>
        <div className="text-right shrink-0 mr-1">
          <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Signed in as</p>
          <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>{user.name}</p>
        </div>
        {/* Method Change */}
        <div className="relative shrink-0">
          <button onClick={() => canManage && setShowMethodDropdown(!showMethodDropdown)}
            disabled={!canManage || sc.overallStatus === "Completed"}
            title={!canManage ? manageDenial : undefined}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white hover:bg-slate-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: F }}>
            Change Method <ChevronDown size={13} className="text-purple-700" />
          </button>
          {showMethodDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMethodDropdown(false)} />
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                {PROCUREMENT_METHODS.map(m => {
                  const band = getThreshold(m);
                  return (
                    <button key={m} onClick={() => {
                        setShowMethodDropdown(false);
                        if (m === sc.method) return;
                        setPendingMethod(m);
                        setMethodJustification("");
                        setMethodError("");
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between ${
                        m === sc.method ? "bg-purple-50" : ""
                      }`} style={{ fontFamily: F }}>
                      <span>
                        <span className={`block text-[12px] ${m === sc.method ? "text-purple-700 font-medium" : "text-slate-700"}`}>{m}</span>
                        {band && <span className="block text-[9px] text-slate-400">{formatBand(band)}</span>}
                      </span>
                      {m === sc.method && <Check size={14} className="text-purple-700" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Main Content: Stepper + Detail Panel ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Stepper Rail */}
        <div className="w-[260px] bg-white border-r border-slate-200 p-4 overflow-y-auto shrink-0">
          <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-wider" style={{ fontFamily: F }}>Workflow Steps</p>
          <div className="space-y-1">
            {sc.steps.map((step) => {
              const isActive = step.key === selectedStepKey;
              const isCompleted = step.status === "completed";
              const isCurrent = step.key === sc.currentStepKey;
              const docCount = step.documents.length;

              return (
                <button key={step.key} onClick={() => setSelectedStepKey(step.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                    isActive ? "bg-purple-50 border border-purple-200" :
                    step.status === "locked" ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"
                  }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted ? "bg-green-100 text-green-600" :
                    isCurrent ? "bg-purple-100 text-purple-700" :
                    "bg-slate-100 text-slate-400"
                  }`}>
                    {isCompleted ? <Check size={14} /> : getStepIcon(step.key, 14)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] truncate ${
                      isCompleted ? "text-green-700 font-medium" :
                      isCurrent ? "text-purple-700 font-medium" :
                      "text-slate-400"
                    }`} style={{ fontFamily: F }}>
                      {step.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {step.optional && <span className="text-[9px] text-slate-400" style={{ fontFamily: F }}>Optional</span>}
                      {docCount > 0 && (
                        <span className="text-[9px] text-purple-500 flex items-center gap-0.5" style={{ fontFamily: F }}>
                          <Paperclip size={8} /> {docCount}
                        </span>
                      )}
                    </div>
                  </div>
                  {isCompleted && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                  {isCurrent && !isCompleted && <Clock size={14} className="text-purple-500 shrink-0" />}
                  {step.status === "locked" && <Lock size={12} className="text-slate-300 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Progress</span>
              <span className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>
                {sc.steps.filter(s => s.status === "completed").length}/{sc.steps.length}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${(sc.steps.filter(s => s.status === "completed").length / sc.steps.length) * 100}%` }} />
            </div>
          </div>

          {/* Invited suppliers */}
          {(sc.invitedSuppliers ?? []).length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Invited</span>
                <span className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>{sc.invitedSuppliers!.length}</span>
              </div>
              <div className="space-y-1.5">
                {sc.invitedSuppliers!.map(v => (
                  <div key={v.supplierId} className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded text-[10px] text-slate-700" style={{ fontFamily: F }}>
                    <Send size={10} className="text-purple-500 shrink-0" />
                    <span className="flex-1 truncate">{v.name}</span>
                    {v.managementApproval && <ShieldCheck size={10} className="text-amber-500 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bids on the register */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Bids Received</span>
              <span className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>{mergedBids.length}</span>
            </div>
            {mergedBids.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {mergedBids.map(bid => (
                  <div key={bid.key} className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded text-[10px] text-slate-700" style={{ fontFamily: F }}>
                    {bid.origin === "Electronic"
                      ? <ShieldCheck size={10} className="text-emerald-500 shrink-0" />
                      : <Users size={10} className="text-purple-500 shrink-0" />}
                    <span className="flex-1 truncate">{bid.supplierName}</span>
                    {bid.bidId && sc.overallStatus !== "Completed" && canManage && (
                      <button onClick={() => handleRemoveBid(bid.bidId!)} className="text-slate-400 hover:text-red-500 shrink-0">
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {sealedCount > 0 && (
              <div className="mb-2 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded text-[9px] text-amber-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                <Lock size={9} /> {sealedCount} sealed submission(s) awaiting opening
              </div>
            )}
            {sc.overallStatus !== "Completed" && (
              <button onClick={openBidModal} disabled={!canManage} title={!canManage ? manageDenial : undefined}
                className="w-full px-2 py-1.5 border border-dashed border-purple-300 rounded-lg text-[10px] text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: F }}>
                <Users size={10} /> Record Bid Received
              </button>
            )}
          </div>
        </div>

        {/* Right: Step Detail Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedStep ? (
            <>
              {/* Step Header Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedStep.status === "completed" ? "bg-green-100 text-green-600" :
                      selectedStep.status === "active" ? "bg-purple-100 text-purple-700" :
                      "bg-slate-100 text-slate-400"
                    }`}>
                      {selectedStep.status === "completed" ? <Check size={20} /> : getStepIcon(selectedStep.key, 20)}
                    </div>
                    <div>
                      <h2 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>{selectedStep.label}</h2>
                      <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>{selectedStep.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                    selectedStep.status === "completed" ? "bg-green-50 text-green-700" :
                    selectedStep.status === "active" ? "bg-purple-50 text-purple-700" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {selectedStep.status === "completed" ? "Completed" : selectedStep.status === "active" ? "In Progress" : "Locked"}
                  </span>
                </div>

                {!canManage && selectedStep.status === "active" && (
                  <div className="mt-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                    <Lock size={12} className="text-slate-400" />
                    <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>{manageDenial}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedStep.status === "active" && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                    <button onClick={() => openUploadModal(selectedStep.key)}
                      disabled={!canManage} title={!canManage ? manageDenial : undefined}
                      className="px-3.5 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                      <Upload size={13} /> Upload Document
                    </button>
                    {selectedStep.key === "advertisement" && (
                      <button onClick={openAdvertiseModal}
                        disabled={!canManage} title={!canManage ? manageDenial : undefined}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-blue-300 bg-blue-50 text-blue-700 flex items-center gap-1.5 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                        <Globe size={13} /> {sc.advertisement ? "Update Advertisement" : "Publish & Advertise"}
                      </button>
                    )}
                    {selectedStep.key === "invitation" && (
                      <>
                        <button onClick={openInviteModal}
                          disabled={!canManage} title={!canManage ? manageDenial : undefined}
                          className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-purple-300 bg-purple-50 text-purple-700 flex items-center gap-1.5 hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                          <Users size={13} /> {isDirect(sc.method) ? "Select Supplier" : "Select & Invite Bidders"}
                        </button>
                        <button onClick={() => { resetRegisterForm(); setShowRegisterModal(true); }}
                          disabled={!canManage} title={!canManage ? manageDenial : undefined}
                          className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-slate-300 bg-white text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                          <UserPlus size={13} /> Register New Supplier
                        </button>
                      </>
                    )}
                    {selectedStep.key === "bid_opening" && (
                      <>
                        <button onClick={notifyBidOpening}
                          disabled={!canManage} title={!canManage ? manageDenial : undefined}
                          className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-amber-300 bg-amber-50 text-amber-700 flex items-center gap-1.5 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: F }}>
                          <Bell size={13} /> Notify Stakeholders
                        </button>
                        <button onClick={openBidModal}
                          disabled={!canManage} title={!canManage ? manageDenial : undefined}
                          className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-purple-300 bg-purple-50 text-purple-700 flex items-center gap-1.5 hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: F }}>
                          <Users size={13} /> Record Bid Received
                        </button>
                      </>
                    )}
                    {selectedStep.key === "contract_award" && (
                      <button onClick={openAwardModal}
                        disabled={!canAward} title={!canAward ? awardDenial : undefined}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-green-300 bg-green-50 text-green-700 flex items-center gap-1.5 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                        <Award size={13} /> Award Contract
                      </button>
                    )}
                    {stepSatisfied && selectedStep.key !== "contract_award" && (
                      <button onClick={() => handleCompleteStep(selectedStep.key)}
                        disabled={!canManage} title={!canManage ? manageDenial : undefined}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-green-300 bg-green-50 text-green-700 flex items-center gap-1.5 hover:bg-green-100 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                        <CheckCircle2 size={13} /> Complete Step
                      </button>
                    )}
                    {selectedStep.optional && !stepSatisfied && (
                      <button onClick={() => handleCompleteStep(selectedStep.key)}
                        disabled={!canManage} title={!canManage ? manageDenial : undefined}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-slate-300 bg-slate-50 text-slate-600 flex items-center gap-1.5 hover:bg-slate-100 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                        Skip Step
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Step-specific Guidance & Document Slots */}
              {selectedStep.status !== "locked" && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 mb-3" style={{ fontFamily: F }}>
                    {selectedStep.key === "contract_award" ? "Contract Award" : "Required Documents"}
                  </h3>

                  {selectedStep.key === "contract_award" && (
                    <p className="text-[12px] text-slate-600 mb-4" style={{ fontFamily: F }}>
                      Upload the signed contract. The PR number ({sc.sourcePR}) will convert to a Contract Number, push to the Contract Management Module, register against the supplier profile, and mark the requisition as Converted to Sourcing.
                    </p>
                  )}

                  {/* ── ADVERTISEMENT ── */}
                  {selectedStep.key === "advertisement" && (
                    <div className="mb-4">
                      {sc.advertisement ? (
                        <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-4 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[12px] font-semibold text-blue-800 flex items-center gap-1.5" style={{ fontFamily: F }}>
                              <Globe size={14} /> Advertisement {sc.advertisement.reference}
                            </p>
                            <span className="text-[10px] text-blue-600" style={{ fontFamily: F }}>
                              Posted {formatDateTime(sc.advertisement.postedAt)} by {sc.advertisement.postedBy}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mb-2">
                            <div>
                              <p className="text-[10px] text-blue-500" style={{ fontFamily: F }}>Publication Date</p>
                              <p className="text-[11px] text-blue-800 font-medium" style={{ fontFamily: F }}>{formatDate(sc.advertisement.publicationDate)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-blue-500" style={{ fontFamily: F }}>Closing</p>
                              <p className="text-[11px] text-blue-800 font-medium" style={{ fontFamily: F }}>
                                {formatDate(sc.advertisement.closingDate)} · {sc.advertisement.closingTime}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-blue-500" style={{ fontFamily: F }}>Portal Status</p>
                              <p className="text-[11px] text-blue-800 font-medium" style={{ fontFamily: F }}>
                                {tender ? (tenderOpen ? "Open for bids" : tender.status) : "Not published"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {sc.advertisement.channels.map(c => (
                              <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-blue-200 text-blue-700" style={{ fontFamily: F }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="border border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50 text-center">
                            <Globe size={20} className="text-blue-500 mx-auto mb-2" />
                            <p className="text-[12px] font-medium text-blue-700" style={{ fontFamily: F }}>ACET Portal</p>
                            <p className="text-[10px] text-blue-500" style={{ fontFamily: F }}>Publish directly from the system</p>
                          </div>
                          <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 text-center">
                            <ExternalLink size={20} className="text-slate-400 mx-auto mb-2" />
                            <p className="text-[12px] font-medium text-slate-600" style={{ fontFamily: F }}>External Ad</p>
                            <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Upload proof of the newspaper/website ad</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── INVITATION ── */}
                  {selectedStep.key === "invitation" && (
                    <div className="mb-4">
                      {(sc.invitedSuppliers ?? []).length > 0 ? (
                        <>
                          <p className="text-[12px] font-medium text-slate-700 mb-2 flex items-center gap-1.5" style={{ fontFamily: F }}>
                            <Send size={13} className="text-purple-600" />
                            Invited Bidders ({sc.invitedSuppliers!.length})
                            {sc.proposalRequirement && (
                              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                                {sc.proposalRequirement === "Both" ? "Technical + Financial" : `${sc.proposalRequirement} only`}
                              </span>
                            )}
                          </p>
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead style={{ backgroundColor: "#0B01D0" }}>
                                <tr>
                                  <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Supplier</th>
                                  <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Supplier ID</th>
                                  <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Category</th>
                                  <th className="text-center px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Rating</th>
                                  <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Invited</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sc.invitedSuppliers!.map((v, idx) => (
                                  <tr key={v.supplierId} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                    <td className="px-3 py-2" style={{ fontFamily: F }}>
                                      <p className="text-[11px] text-slate-900 font-medium">{v.name}</p>
                                      <p className="text-[9px] text-slate-400">{v.email}</p>
                                      {v.managementApproval && (
                                        <p className="text-[9px] text-amber-600 mt-0.5 flex items-center gap-1">
                                          <ShieldCheck size={9} /> Management approval: {v.managementApproval.justification}
                                        </p>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-[11px] text-slate-600" style={{ fontFamily: F }}>{v.supplierRef}</td>
                                    <td className="px-3 py-2 text-[10px] text-slate-500" style={{ fontFamily: F }}>{v.category}</td>
                                    <td className="px-3 py-2 text-center" style={{ fontFamily: F }}>
                                      <span className={`text-[11px] font-medium ${
                                        v.performanceScore >= 8 ? "text-green-600" : v.performanceScore >= 5 ? "text-amber-600" : v.performanceScore > 0 ? "text-red-600" : "text-slate-400"
                                      }`}>
                                        {v.performanceScore > 0 ? `${v.performanceScore}/10` : "New"}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-[10px] text-slate-500" style={{ fontFamily: F }}>
                                      {formatDateTime(v.invitedAt)}<br />by {v.invitedBy}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <div className="border border-dashed border-purple-300 rounded-lg p-5 bg-purple-50/30 text-center">
                          <Users size={22} className="text-purple-400 mx-auto mb-2" />
                          <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>
                            No bidders invited yet. Suppliers are drawn from the approved supplier register and screened for eligibility.
                          </p>
                          {shortlistedNames.size > 0 && (
                            <p className="text-[11px] text-purple-600 mt-1" style={{ fontFamily: F }}>
                              {shortlistedNames.size} shortlisted candidate(s) are ready to carry over from the EoI step.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── ELECTRONIC SUBMISSION PORTAL ── */}
                  {selectedStep.key === "submission_portal" && (
                    <div className="mb-4">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="border border-slate-200 rounded-lg p-4 bg-white text-center">
                          <Lock size={18} className={sealedCount > 0 ? "text-amber-600 mx-auto mb-2" : "text-purple-600 mx-auto mb-2"} />
                          <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>Sealed</p>
                          <p className="text-[16px] font-bold text-slate-900" style={{ fontFamily: F }}>{sealedCount}</p>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4 bg-white text-center">
                          <CalendarDays size={18} className="text-purple-600 mx-auto mb-2" />
                          <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>Timestamped</p>
                          <p className="text-[16px] font-bold text-slate-900" style={{ fontFamily: F }}>{submissions.length}</p>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4 bg-white text-center">
                          <ShieldCheck size={18} className="text-green-600 mx-auto mb-2" />
                          <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>Opened</p>
                          <p className="text-[16px] font-bold text-slate-900" style={{ fontFamily: F }}>{openedSubmissions.length}</p>
                        </div>
                      </div>

                      {!tender ? (
                        <div className="border border-dashed border-amber-300 rounded-lg p-5 bg-amber-50/40 text-center">
                          <Globe size={22} className="text-amber-500 mx-auto mb-2" />
                          <p className="text-[12px] text-amber-800" style={{ fontFamily: F }}>
                            This case has not been published to the supplier portal yet.
                          </p>
                          <p className="text-[11px] text-amber-600 mt-1" style={{ fontFamily: F }}>
                            {requiresAdvertisement(sc.method)
                              ? "Publish it from the Advertisement step to open electronic submissions."
                              : "Send invitations from the Invitation step to open a restricted tender."}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 mb-3 flex items-center gap-4 flex-wrap">
                            <div className="flex-1 min-w-[180px]">
                              <p className="text-[11px] font-semibold text-slate-800" style={{ fontFamily: F }}>{tender.title}</p>
                              <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>
                                Closes {formatDate(tender.closingDate)} at {tender.closingTime} &middot; {tender.invitedSupplierIds.length > 0 ? `Restricted to ${tender.invitedSupplierIds.length} supplier(s)` : "Open to all eligible suppliers"} &middot; Envelopes: {[tender.requiresTechnical && "Technical", tender.requiresFinancial && "Financial", tender.requestRateQuote && "Rate quote"].filter(Boolean).join(" + ") || "Single"}
                              </p>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                              tenderOpen ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-700"
                            }`}>{tenderOpen ? "Open for submission" : tender.status}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {tenderOpen && (
                              <button onClick={handleCloseTender} disabled={!canManage} title={!canManage ? manageDenial : undefined}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                                <Lock size={12} /> Close Tender for Submission
                              </button>
                            )}
                            <button onClick={() => handleOpenEnvelope("Technical")}
                              disabled={!canManage || !!tender.technicalOpenedAt}
                              title={!canManage ? manageDenial : tender.technicalOpenedAt ? `Opened ${formatDateTime(tender.technicalOpenedAt)} by ${tender.technicalOpenedBy}` : undefined}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                              <Unlock size={12} /> {tender.technicalOpenedAt ? "Technical Envelope Opened" : "Open Technical Envelope"}
                            </button>
                            <button onClick={() => handleOpenEnvelope("Financial")}
                              disabled={!canManage || !!tender.financialOpenedAt}
                              title={!canManage ? manageDenial : tender.financialOpenedAt ? `Opened ${formatDateTime(tender.financialOpenedAt)} by ${tender.financialOpenedBy}` : undefined}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                              <Unlock size={12} /> {tender.financialOpenedAt ? "Financial Envelope Opened" : "Open Financial Envelope"}
                            </button>
                            <div className="relative ml-auto">
                              <button onClick={() => setShowExportMenu(!showExportMenu)}
                                disabled={submissions.length === 0}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                                <Download size={12} /> Submission Timestamps Report <ChevronDown size={11} />
                              </button>
                              {showExportMenu && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                    <button onClick={() => exportSubmissionReport("excel")} className="w-full px-3 py-2 text-left text-[11px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                                      <FileSpreadsheet size={12} className="text-green-600" /> Export to Excel
                                    </button>
                                    <button onClick={() => exportSubmissionReport("pdf")} className="w-full px-3 py-2 text-left text-[11px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                                      <FileText size={12} className="text-red-500" /> Export to PDF
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {envelopeError && (
                            <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                              <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
                              <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{envelopeError}</p>
                            </div>
                          )}
                          {envelopeNotice && !envelopeError && (
                            <div className="mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                              <CheckCircle2 size={13} className="text-green-600 mt-0.5 shrink-0" />
                              <p className="text-[11px] text-green-700" style={{ fontFamily: F }}>{envelopeNotice}</p>
                            </div>
                          )}

                          {submissions.length === 0 ? (
                            <div className="border border-dashed border-slate-300 rounded-lg p-5 bg-slate-50/50 text-center">
                              <Clock size={20} className="text-slate-400 mx-auto mb-2" />
                              <p className="text-[12px] text-slate-500" style={{ fontFamily: F }}>
                                No electronic submissions received yet. Each submission is stamped with a unique ID, timestamp and source IP on arrival, and stays sealed until the official opening.
                              </p>
                            </div>
                          ) : (
                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                              <table className="w-full">
                                <thead style={{ backgroundColor: "#0B01D0" }}>
                                  <tr>
                                    <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Submission ID</th>
                                    <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Supplier</th>
                                    <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Envelope</th>
                                    <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Received</th>
                                    <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Contents</th>
                                    <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>State</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {submissions.map((s, idx) => (
                                    <tr key={s.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                      <td className="px-3 py-2" style={{ fontFamily: F }}>
                                        <p className="text-[11px] text-slate-900 font-medium">{s.submissionId}</p>
                                        <p className="text-[9px] text-slate-400">{s.acknowledgementRef} · {s.sourceIp}</p>
                                      </td>
                                      <td className="px-3 py-2 text-[11px] text-slate-800" style={{ fontFamily: F }}>{s.supplierName}</td>
                                      <td className="px-3 py-2" style={{ fontFamily: F }}>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                          s.envelope === "Financial" ? "bg-green-50 text-green-700" :
                                          s.envelope === "Technical" ? "bg-blue-50 text-blue-700" :
                                          "bg-slate-100 text-slate-600"
                                        }`}>{s.envelope}</span>
                                      </td>
                                      <td className="px-3 py-2 text-[10px] text-slate-600" style={{ fontFamily: F }}>{formatDateTime(s.submittedAt)}</td>
                                      <td className="px-3 py-2 text-[10px] text-slate-600" style={{ fontFamily: F }}>
                                        {s.locked ? (
                                          <span className="text-slate-400 italic">Sealed — {s.documents.length} document(s)</span>
                                        ) : (
                                          <>
                                            {s.documents.map(d => <span key={d.id} className="block text-slate-700">{d.name} <span className="text-slate-400">({d.size})</span></span>)}
                                            {s.proposedRate && (
                                              <span className="block text-purple-700 font-medium mt-0.5">
                                                Rate: {formatCurrency(s.proposedRate.amount)} {s.proposedRate.rateType.toLowerCase()}
                                              </span>
                                            )}
                                          </>
                                        )}
                                      </td>
                                      <td className="px-3 py-2" style={{ fontFamily: F }}>
                                        {s.locked ? (
                                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium flex items-center gap-1 w-fit">
                                            <Lock size={9} /> Locked
                                          </span>
                                        ) : (
                                          <>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium flex items-center gap-1 w-fit">
                                              <Unlock size={9} /> Opened
                                            </span>
                                            <span className="block text-[9px] text-slate-400 mt-0.5">
                                              {s.openedAt ? formatDateTime(s.openedAt) : ""} · {s.openedBy}
                                            </span>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Separate Technical & Financial Proposals Toggle */}
                  {(selectedStep.key === "submission_portal" || selectedStep.key === "bid_opening") && (
                    <div className="mb-4">
                      <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={separateProposals}
                          disabled={!canManage}
                          onChange={e => onCaseUpdate(sc.id, { separateProposals: e.target.checked })}
                          className="accent-purple-700 w-4 h-4"
                        />
                        <div>
                          <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>Separate Technical &amp; Financial Proposals</p>
                          <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>
                            When enabled, suppliers must submit technical and financial proposals in separate envelopes that are opened at different times.
                          </p>
                        </div>
                      </label>

                      {separateProposals && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="border border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={16} className="text-blue-600" />
                              <p className="text-[12px] font-semibold text-blue-800" style={{ fontFamily: F }}>Technical Proposals</p>
                            </div>
                            <p className="text-[10px] text-blue-600 mb-2" style={{ fontFamily: F }}>
                              Methodology, team composition, qualifications, and approach.
                              {tender?.technicalOpenedAt ? ` Opened ${formatDateTime(tender.technicalOpenedAt)}.` : " Sealed until the official opening."}
                            </p>
                            {selectedStep.status === "active" && (
                              <button
                                onClick={() => openUploadModal(selectedStep.key, "Technical Proposal")}
                                disabled={!canManage}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: "#0B01D0", fontFamily: F }}
                              >
                                <span className="flex items-center gap-1"><Upload size={11} /> Upload Technical</span>
                              </button>
                            )}
                          </div>
                          <div className="border border-dashed border-green-300 rounded-lg p-4 bg-green-50/50">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={16} className="text-green-600" />
                              <p className="text-[12px] font-semibold text-green-800" style={{ fontFamily: F }}>Financial Proposals</p>
                            </div>
                            <p className="text-[10px] text-green-600 mb-2" style={{ fontFamily: F }}>
                              Cost breakdown, pricing schedule, and financial terms.
                              {tender?.financialOpenedAt ? ` Opened ${formatDateTime(tender.financialOpenedAt)}.` : " Sealed until the technical evaluation is settled."}
                            </p>
                            {selectedStep.status === "active" && (
                              <button
                                onClick={() => openUploadModal(selectedStep.key, "Financial Proposal")}
                                disabled={!canManage}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: "#0B01D0", fontFamily: F }}
                              >
                                <span className="flex items-center gap-1"><Upload size={11} /> Upload Financial</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── EOI SHORTLISTING ── */}
                  {selectedStep.key === "eoi_shortlisting" && (
                    <div className="mb-4">
                      {sc.category === "Consultancy" && (
                        <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors mb-3">
                          <input type="checkbox" checked={sc.individualConsultantRoute ?? false} disabled={!canManage}
                            onChange={e => onCaseUpdate(sc.id, { individualConsultantRoute: e.target.checked })}
                            className="accent-purple-700 w-4 h-4" />
                          <div>
                            <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>Individual consultants — route straight to interview</p>
                            <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>
                              Shortlisted individuals skip the invitation, submission and bid-opening steps and go directly to interview and evaluation.
                            </p>
                          </div>
                        </label>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                          <ClipboardList size={13} className="text-purple-600" />
                          EoI Respondents &amp; Scoring ({(sc.shortlist ?? []).length})
                        </p>
                        <div className="flex items-center gap-2">
                          <button onClick={importRespondentsFromPortal} disabled={!canManage}
                            className="text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                            <RotateCcw size={10} /> Pull from portal &amp; invitations
                          </button>
                          <button onClick={recordShortlist} disabled={!canManage || !(sc.shortlist ?? []).some(s => s.shortlisted)}
                            className="text-[10px] px-2.5 py-1.5 rounded-lg text-white hover:opacity-90 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                            <CheckCircle2 size={10} /> Record Shortlist
                          </button>
                        </div>
                      </div>

                      {(sc.shortlist ?? []).length > 0 ? (
                        <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
                          <table className="w-full">
                            <thead style={{ backgroundColor: "#0B01D0" }}>
                              <tr>
                                <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Respondent</th>
                                <th className="text-center px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Past Rating</th>
                                <th className="text-center px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>EoI Score /100</th>
                                {sc.category === "Consultancy" && (
                                  <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Proposed Rate</th>
                                )}
                                <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Notes</th>
                                <th className="text-center px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Shortlist</th>
                                <th className="px-2 py-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {(sc.shortlist ?? []).map((entry, idx) => (
                                <tr key={entry.id} className={entry.shortlisted ? "bg-green-50/50" : idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                  <td className="px-3 py-2" style={{ fontFamily: F }}>
                                    <p className="text-[11px] text-slate-900 font-medium">{entry.name}</p>
                                    {entry.category && <p className="text-[9px] text-slate-400">{entry.category}</p>}
                                  </td>
                                  <td className="px-3 py-2 text-center text-[11px]" style={{ fontFamily: F }}>
                                    {entry.performanceScore ? (
                                      <span className={entry.performanceScore >= 8 ? "text-green-600" : entry.performanceScore >= 5 ? "text-amber-600" : "text-red-600"}>
                                        {entry.performanceScore}/10
                                      </span>
                                    ) : <span className="text-slate-400">—</span>}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <input type="number" min={0} max={100} value={entry.eoiScore ?? ""} disabled={!canManage}
                                      onChange={e => patchShortlistEntry(entry.id, { eoiScore: e.target.value === "" ? undefined : Number(e.target.value) })}
                                      className="w-16 border border-slate-200 rounded px-2 py-1 text-[11px] text-center focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-slate-50"
                                      style={{ fontFamily: F }} />
                                  </td>
                                  {sc.category === "Consultancy" && (
                                    <td className="px-3 py-2">
                                      <div className="flex items-center gap-1">
                                        <input type="number" min={0} placeholder="0" value={entry.proposedRate ?? ""} disabled={!canManage}
                                          onChange={e => patchShortlistEntry(entry.id, { proposedRate: e.target.value === "" ? undefined : Number(e.target.value) })}
                                          className="w-20 border border-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-slate-50"
                                          style={{ fontFamily: F }} />
                                        <select value={entry.rateType ?? "Daily"} disabled={!canManage}
                                          onChange={e => patchShortlistEntry(entry.id, { rateType: e.target.value as "Daily" | "Monthly" })}
                                          className="border border-slate-200 rounded px-1 py-1 text-[10px] focus:outline-none disabled:bg-slate-50" style={{ fontFamily: F }}>
                                          <option value="Daily">Daily</option>
                                          <option value="Monthly">Monthly</option>
                                        </select>
                                      </div>
                                    </td>
                                  )}
                                  <td className="px-3 py-2">
                                    <input type="text" value={entry.notes ?? ""} disabled={!canManage} placeholder="Evaluation note..."
                                      onChange={e => patchShortlistEntry(entry.id, { notes: e.target.value })}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-slate-50"
                                      style={{ fontFamily: F }} />
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <input type="checkbox" checked={entry.shortlisted} disabled={!canManage}
                                      onChange={e => patchShortlistEntry(entry.id, { shortlisted: e.target.checked })}
                                      className="accent-green-600 w-4 h-4" />
                                  </td>
                                  <td className="px-2 py-2 text-center">
                                    {canManage && (
                                      <button onClick={() => updateShortlist((sc.shortlist ?? []).filter(s => s.id !== entry.id))}
                                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500" title="Remove respondent">
                                        <X size={11} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="border border-dashed border-slate-300 rounded-lg p-5 bg-slate-50/50 text-center mb-3">
                          <ClipboardList size={20} className="text-slate-400 mx-auto mb-2" />
                          <p className="text-[12px] text-slate-500" style={{ fontFamily: F }}>
                            No respondents recorded yet. Pull them from the portal submissions and invitation list, or add them by name.
                          </p>
                        </div>
                      )}

                      {canManage && (
                        <div className="flex items-center gap-2">
                          <select value="" onChange={e => {
                              const v = getSuppliers().find(x => x.id === e.target.value);
                              if (v) addShortlistEntry(supplierDisplayName(v), v);
                            }}
                            className="border border-slate-200 rounded-lg h-[32px] px-2 text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }}>
                            <option value="">Add from the supplier register...</option>
                            {getEligibleSuppliers(scopeAllCategories ? undefined : supplierCategoryFor(sc.category)).map(v => (
                              <option key={v.id} value={v.id}>{supplierDisplayName(v)} — {avgScore(v.performance) || "new"}/10</option>
                            ))}
                          </select>
                          <input type="text" value={newRespondent} onChange={e => setNewRespondent(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") addShortlistEntry(newRespondent); }}
                            placeholder="…or type a respondent name"
                            className="flex-1 border border-slate-200 rounded-lg h-[32px] px-3 text-[11px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                          <button onClick={() => addShortlistEntry(newRespondent)} disabled={!newRespondent.trim()}
                            className="px-3 h-[32px] rounded-lg text-[11px] font-medium border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                            <Plus size={11} /> Add
                          </button>
                        </div>
                      )}

                      {(sc.shortlist ?? []).some(s => s.shortlisted) && (
                        <p className="mt-2 text-[11px] text-green-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                          <CheckCircle2 size={12} />
                          {(sc.shortlist ?? []).filter(s => s.shortlisted).length} of {(sc.shortlist ?? []).length} shortlisted —
                          {sc.individualConsultantRoute ? " they proceed to interview." : " they carry into the invitation step."}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── INTERVIEWS ── */}
                  {selectedStep.key === "interview" && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                          <UserCheck size={13} className="text-purple-600" /> Interview Panel Scores
                        </p>
                        <button onClick={recordInterviewOutcome}
                          disabled={!canManage || !(sc.shortlist ?? []).some(s => s.interviewScore !== undefined)}
                          className="text-[10px] px-2.5 py-1.5 rounded-lg text-white hover:opacity-90 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                          <Bell size={10} /> Record &amp; Notify Outcome
                        </button>
                      </div>

                      {(sc.shortlist ?? []).filter(s => s.shortlisted).length === 0 ? (
                        <div className="border border-dashed border-amber-300 rounded-lg p-5 bg-amber-50/40 text-center">
                          <AlertCircle size={20} className="text-amber-500 mx-auto mb-2" />
                          <p className="text-[12px] text-amber-800" style={{ fontFamily: F }}>
                            No candidates have been shortlisted yet. Complete the EoI &amp; Shortlisting step first.
                          </p>
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead style={{ backgroundColor: "#0B01D0" }}>
                              <tr>
                                <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Candidate</th>
                                <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Interview Date</th>
                                <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Panel</th>
                                <th className="text-center px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Score /100</th>
                                <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Panel Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(sc.shortlist ?? []).filter(s => s.shortlisted).map((entry, idx) => (
                                <tr key={entry.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                  <td className="px-3 py-2" style={{ fontFamily: F }}>
                                    <p className="text-[11px] text-slate-900 font-medium">{entry.name}</p>
                                    <p className="text-[9px] text-slate-400">
                                      EoI {entry.eoiScore ?? "—"}/100
                                      {entry.proposedRate ? ` · ${formatCurrency(entry.proposedRate)} ${(entry.rateType ?? "Daily").toLowerCase()}` : ""}
                                    </p>
                                  </td>
                                  <td className="px-3 py-2">
                                    <input type="date" value={entry.interviewDate ?? ""} disabled={!canManage}
                                      onChange={e => patchShortlistEntry(entry.id, { interviewDate: e.target.value })}
                                      className="border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-slate-50" style={{ fontFamily: F }} />
                                  </td>
                                  <td className="px-3 py-2">
                                    <input type="text" value={entry.interviewPanel ?? ""} disabled={!canManage} placeholder="Panel members"
                                      onChange={e => patchShortlistEntry(entry.id, { interviewPanel: e.target.value })}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-slate-50" style={{ fontFamily: F }} />
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <input type="number" min={0} max={100} value={entry.interviewScore ?? ""} disabled={!canManage}
                                      onChange={e => patchShortlistEntry(entry.id, { interviewScore: e.target.value === "" ? undefined : Number(e.target.value) })}
                                      className="w-16 border border-slate-200 rounded px-2 py-1 text-[11px] text-center focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-slate-50" style={{ fontFamily: F }} />
                                  </td>
                                  <td className="px-3 py-2">
                                    <input type="text" value={entry.interviewNotes ?? ""} disabled={!canManage} placeholder="Observations..."
                                      onChange={e => patchShortlistEntry(entry.id, { interviewNotes: e.target.value })}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-slate-50" style={{ fontFamily: F }} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── MERGED BIDS TABLE ── */}
                  {(selectedStep.key === "bid_opening" || selectedStep.key === "evaluation") && mergedBids.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[12px] font-medium text-slate-700 mb-2 flex items-center gap-1.5" style={{ fontFamily: F }}>
                        <Users size={13} className="text-purple-600" />
                        Bids Received ({mergedBids.length})
                        <span className="text-[10px] text-slate-400 font-normal">
                          {openedSubmissions.length} electronic &middot; {(sc.suppliersBidding ?? []).length} manual
                        </span>
                      </p>
                      {sealedCount > 0 && (
                        <div className="mb-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                          <Lock size={12} className="text-amber-600" />
                          <p className="text-[11px] text-amber-800" style={{ fontFamily: F }}>
                            {sealedCount} electronic submission(s) are still sealed. Open the envelopes on the Online Submissions step to bring them onto this register.
                          </p>
                        </div>
                      )}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead style={{ backgroundColor: "#0B01D0" }}>
                            <tr>
                              <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Supplier</th>
                              <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Origin</th>
                              <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Received</th>
                              <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Ref #</th>
                              <th className="text-left px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}>Notes</th>
                              {sc.overallStatus !== "Completed" && (
                                <th className="text-center px-3 py-2 text-[10px] text-white font-medium" style={{ fontFamily: F }}></th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {mergedBids.map((bid, idx) => (
                              <tr key={bid.key} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                <td className="px-3 py-2 text-[11px] text-slate-900 font-medium" style={{ fontFamily: F }}>
                                  {bid.supplierName}
                                  {bid.rate && <span className="block text-[9px] text-purple-600">{bid.rate}</span>}
                                </td>
                                <td className="px-3 py-2" style={{ fontFamily: F }}>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    bid.origin === "Electronic" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                                  }`}>
                                    {bid.origin === "Electronic" ? `Portal · ${bid.envelope}` : "Manual"}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-[11px] text-slate-600" style={{ fontFamily: F }}>
                                  {bid.origin === "Electronic" ? formatDateTime(bid.dateReceived) : formatDate(bid.dateReceived)}
                                </td>
                                <td className="px-3 py-2 text-[11px] text-slate-600" style={{ fontFamily: F }}>{bid.reference}</td>
                                <td className="px-3 py-2 text-[10px] text-slate-500 max-w-[220px] truncate" style={{ fontFamily: F }} title={bid.notes}>{bid.notes}</td>
                                {sc.overallStatus !== "Completed" && (
                                  <td className="px-3 py-2 text-center">
                                    {bid.bidId && canManage ? (
                                      <button onClick={() => handleRemoveBid(bid.bidId!)} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Remove manual entry">
                                        <X size={11} />
                                      </button>
                                    ) : (
                                      <span title="Electronic submissions are part of the audit trail and cannot be removed">
                                        <ShieldCheck size={11} className="text-slate-300 mx-auto" />
                                      </span>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Structured Bid Opening Documents */}
                  {selectedStep.key === "bid_opening" && (
                    <div className="mb-4">
                      <p className="text-[12px] font-semibold text-slate-800 mb-3 flex items-center gap-1.5" style={{ fontFamily: F }}>
                        <ClipboardList size={14} className="text-purple-600" /> Bid Opening Records
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {([
                          { doc: bidOpeningMinutesDoc, label: "Opening Minutes", blurb: "Record of proceedings during the bid opening session.", icon: <FileText size={16} className={bidOpeningMinutesDoc ? "text-green-600" : "text-amber-600"} /> },
                          { doc: bidOpeningAttendanceDoc, label: "Attendance Record", blurb: "List of attendees present at the bid opening session.", icon: <Users size={16} className={bidOpeningAttendanceDoc ? "text-green-600" : "text-amber-600"} /> },
                        ]).map(slot => (
                          <div key={slot.label} className={`border rounded-lg p-4 transition-colors ${
                            slot.doc ? "border-green-200 bg-green-50/50" : "border-dashed border-amber-300 bg-amber-50/30"
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {slot.icon}
                              <p className="text-[12px] font-medium text-slate-800" style={{ fontFamily: F }}>{slot.label}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 mb-2" style={{ fontFamily: F }}>{slot.blurb}</p>
                            {slot.doc ? (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-green-600" />
                                <span className="text-[10px] text-green-700" style={{ fontFamily: F }}>
                                  {slot.doc.name} (v{slot.doc.version}) — {slot.doc.uploadedBy}
                                </span>
                              </div>
                            ) : selectedStep.status === "active" ? (
                              <button onClick={() => openUploadModal(selectedStep.key, slot.label)} disabled={!canManage}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                                <span className="flex items-center gap-1"><Upload size={11} /> Upload {slot.label === "Opening Minutes" ? "Minutes" : "Attendance"}</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Required</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sc.contractNumber && selectedStep.key === "contract_award" && (
                    <>
                      <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[12px] font-medium text-green-800" style={{ fontFamily: F }}>
                            Contract Awarded: {sc.contractNumber}
                          </p>
                          <p className="text-[11px] text-green-600" style={{ fontFamily: F }}>
                            Awarded to {sc.awardedSupplier} &middot; Pushed to Contract Management &middot; Registered against the supplier profile &middot; {sc.sourcePR} marked Converted to Sourcing
                          </p>
                        </div>
                        {onNavigateToContract && (
                          <button onClick={onNavigateToContract}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5 hover:opacity-90 shrink-0 transition-colors"
                            style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                            <ExternalLink size={12} /> View in Contract Repository
                          </button>
                        )}
                      </div>

                      {/* Signature Section */}
                      <div className="mb-4 px-4 py-3 bg-white border border-slate-200 rounded-lg">
                        <p className="text-[12px] font-semibold text-slate-900 mb-3 flex items-center gap-1.5" style={{ fontFamily: F }}>
                          <PenLine size={13} className="text-purple-600" /> Digital Signature
                        </p>
                        {signed && signatureData ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                              <CheckCircle2 size={13} className="text-emerald-600" />
                              <span className="text-[11px] text-emerald-700" style={{ fontFamily: F }}>
                                Signed by {signatureData.employeeName} on {signedAt}
                              </span>
                            </div>
                            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 inline-flex items-center justify-center">
                              <img src={signatureData.dataUrl} alt="Signature" className="max-w-[180px] max-h-[70px] object-contain" />
                            </div>
                          </div>
                        ) : signatureData ? (
                          <button
                            onClick={() => setShowSignModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium text-white hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#0B01D0", fontFamily: F }}
                          >
                            <PenLine size={13} />
                            Apply My Signature
                          </button>
                        ) : (
                          <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <AlertCircle size={13} className="text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-amber-700" style={{ fontFamily: F }}>
                              No signature uploaded. Go to My Personal Information &rarr; My Signature tab.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Generate PO Button */}
                      <div className="mb-4 px-4 py-3 bg-white border border-slate-200 rounded-lg">
                        <p className="text-[12px] font-semibold text-slate-900 mb-3 flex items-center gap-1.5" style={{ fontFamily: F }}>
                          <FileText size={13} className="text-blue-600" /> Purchase Order
                        </p>
                        {poGenerated ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle2 size={13} className="text-green-600" />
                            <span className="text-[11px] text-green-700" style={{ fontFamily: F }}>
                              PO Generated: <span className="font-semibold">{generatedPONumber}</span> — Signed &amp; dispatched to supplier.
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={onGeneratePO}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium text-white hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#0B01D0", fontFamily: F }}
                          >
                            <FileText size={13} />
                            Generate Purchase Order
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {/* Evaluation Type Label */}
                  {selectedStep.key === "evaluation" && (
                    <div className="mb-4 px-4 py-3 rounded-lg border flex items-center gap-2" style={{ backgroundColor: "#0B01D010", borderColor: "#0B01D040" }}>
                      <ClipboardList size={15} style={{ color: "#0B01D0" }} />
                      <p className="text-[12px] font-medium text-slate-800" style={{ fontFamily: F }}>
                        {sc.category === "Consultancy"
                          ? "Upload interview scores and the combined technical/financial evaluation"
                          : sc.category === "Services"
                          ? "Upload Combined Evaluation Report"
                          : "Upload Evaluation Report"}
                      </p>
                      {isDirect(sc.method) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                          Optional for Direct Selection
                        </span>
                      )}
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                        backgroundColor: sc.category === "Consultancy" ? "#f0e6ff" : sc.category === "Services" ? "#e6f0ff" : "#e6ffe6",
                        color: sc.category === "Consultancy" ? "#7c3aed" : sc.category === "Services" ? "#1d4ed8" : "#16a34a"
                      }}>
                        {sc.category}
                      </span>
                    </div>
                  )}

                  {/* Document Slots — clickable to upload */}
                  <div className="grid grid-cols-2 gap-3">
                    {getDocLabelsForStep(selectedStep.key, sc.category).map(label => {
                      const uploaded = selectedStep.documents.find(d => d.label === label);
                      return (
                        <div key={label}
                          className={`border rounded-lg p-3 flex items-center gap-3 transition-colors ${
                            uploaded
                              ? "border-green-200 bg-green-50/50 cursor-default"
                              : selectedStep.status === "active" && canManage
                              ? "border-dashed border-slate-300 bg-slate-50/50 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30"
                              : "border-dashed border-slate-200 bg-slate-50/30"
                          }`}
                          onClick={() => {
                            if (selectedStep.status === "active") openUploadModal(selectedStep.key, label);
                          }}
                        >
                          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                            uploaded ? "bg-green-100" : "bg-slate-100"
                          }`}>
                            {uploaded ? <CheckCircle2 size={14} className="text-green-600" /> : <FileText size={14} className="text-slate-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] truncate ${uploaded ? "text-green-800 font-medium" : "text-slate-600"}`} style={{ fontFamily: F }}>
                              {label}
                            </p>
                            {uploaded ? (
                              <p className="text-[9px] text-green-600" style={{ fontFamily: F }}>
                                v{uploaded.version} &middot; {uploaded.size} &middot; {formatDate(uploaded.date)}
                              </p>
                            ) : (
                              <p className="text-[9px] text-slate-400" style={{ fontFamily: F }}>
                                {selectedStep.status === "active" && canManage ? "Click to upload" : "Required"}
                              </p>
                            )}
                          </div>
                          {uploaded && (
                            <div className="flex items-center gap-1 shrink-0">
                              {uploaded.versions.length > 1 && (
                                <button
                                  onClick={e => { e.stopPropagation(); setShowVersionHistory(uploaded); }}
                                  className="p-1 rounded hover:bg-green-100 transition-colors"
                                  title="Version History"
                                >
                                  <History size={12} className="text-green-600" />
                                </button>
                              )}
                              {selectedStep.status === "active" && canManage && (
                                <button
                                  onClick={e => { e.stopPropagation(); openUploadModal(selectedStep.key, label); }}
                                  className="p-1 rounded hover:bg-green-100 transition-colors"
                                  title="Upload New Version"
                                >
                                  <RotateCcw size={12} className="text-green-600" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Uploaded Documents for this Step */}
              {selectedStep.documents.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 mb-3 flex items-center gap-2" style={{ fontFamily: F }}>
                    <Paperclip size={14} className="text-purple-700" /> Uploaded Documents ({selectedStep.documents.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedStep.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                            <FileText size={15} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{doc.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{doc.label}</span>
                              <span className="text-[10px] text-slate-300">&middot;</span>
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>v{doc.version}</span>
                              <span className="text-[10px] text-slate-300">&middot;</span>
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{doc.size}</span>
                              <span className="text-[10px] text-slate-300">&middot;</span>
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{doc.uploadedBy}</span>
                              <span className="text-[10px] text-slate-300">&middot;</span>
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{formatDate(doc.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {doc.versions.length > 1 && (
                            <button onClick={() => setShowVersionHistory(doc)}
                              className="px-2 py-1 rounded text-[10px] text-purple-600 bg-purple-50 hover:bg-purple-100 flex items-center gap-1 transition-colors"
                              style={{ fontFamily: F }}>
                              <History size={10} /> {doc.versions.length} versions
                            </button>
                          )}
                          <button className="p-1.5 rounded hover:bg-slate-100 transition-colors" title="Download">
                            <Download size={13} className="text-slate-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked State */}
              {selectedStep.status === "locked" && (
                <div className="bg-slate-100 rounded-xl border border-slate-200 p-8 text-center">
                  <Lock size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-[13px] text-slate-500" style={{ fontFamily: F }}>
                    This step is locked. Complete the preceding steps to unlock.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-[13px] text-slate-400" style={{ fontFamily: F }}>Select a step from the left panel.</p>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         UPLOAD MODAL — real file handling + versioning
         ══════════════════════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Upload Document</h3>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  {sc.steps.find(s => s.key === uploadStepKey)?.label} &middot; {sc.caseNumber}
                </p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5">
              {uploadSuccess ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <CheckCircle2 size={28} className="text-green-600" />
                  </div>
                  <p className="text-[14px] font-semibold text-green-800" style={{ fontFamily: F }}>Document Uploaded</p>
                  <p className="text-[11px] text-green-600 mt-1" style={{ fontFamily: F }}>
                    {uploadFile?.name} — {uploadLabel}
                  </p>
                </div>
              ) : (
                <>
                  {/* Document Category */}
                  <div className="mb-4">
                    <label className="text-[12px] font-medium text-slate-700 mb-1.5 block" style={{ fontFamily: F }}>
                      Document Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button onClick={() => setUploadLabelDropdown(!uploadLabelDropdown)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-left text-[12px] text-slate-900 bg-white hover:bg-slate-50 flex items-center justify-between"
                        style={{ fontFamily: F }}>
                        {uploadLabel || "Select document type..."}
                        <ChevronDown size={14} className="text-slate-400" />
                      </button>
                      {uploadLabelDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setUploadLabelDropdown(false)} />
                          <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                            {getAvailableLabels().map(l => {
                              const step = sc.steps.find(s => s.key === uploadStepKey);
                              const existing = step?.documents.find(d => d.label === l);
                              return (
                                <button key={l} onClick={() => { setUploadLabel(l); setUploadLabelDropdown(false); }}
                                  className="w-full px-4 py-2.5 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                                  style={{ fontFamily: F }}>
                                  <span>{l}</span>
                                  {existing && (
                                    <span className="text-[10px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded">v{existing.version} — replace</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                    {uploadLabel && (() => {
                      const step = sc.steps.find(s => s.key === uploadStepKey);
                      const existing = step?.documents.find(d => d.label === uploadLabel);
                      if (!existing) return null;
                      return (
                        <div className="mt-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2">
                          <RotateCcw size={12} className="text-purple-600" />
                          <p className="text-[11px] text-purple-700" style={{ fontFamily: F }}>
                            Existing: <span className="font-medium">{existing.name}</span> (v{existing.version}) — uploading will create v{existing.version + 1}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* File Drop Zone */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      uploadFile ? "border-green-300 bg-green-50/50" : "border-slate-300 bg-slate-50"
                    }`}
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {uploadFile ? (
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <FileText size={18} className="text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{uploadFile.name}</p>
                          <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>
                            {formatFileSize(uploadFile.size)} &middot; {getFileType(uploadFile.name)}
                          </p>
                        </div>
                        <button onClick={() => setUploadFile(null)} className="p-1 hover:bg-red-50 rounded" title="Remove">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} className="text-slate-400 mx-auto mb-2" />
                        <p className="text-[13px] text-slate-600" style={{ fontFamily: F }}>Drag &amp; drop file here</p>
                        <p className="text-[11px] text-slate-400 mt-1" style={{ fontFamily: F }}>PDF, DOCX, XLSX, PNG, JPG, CSV, ZIP — Max 25MB</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden"
                      accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg,.csv,.zip"
                      onChange={handleFileSelect} />
                    {!uploadFile && (
                      <button onClick={() => fileInputRef.current?.click()}
                        className="mt-3 px-4 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                        Browse Files
                      </button>
                    )}
                  </div>

                  {uploadError && (
                    <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertTriangle size={12} className="text-red-500" />
                      <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{uploadError}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            {!uploadSuccess && (
              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>
                  Cancel
                </button>
                <button onClick={handleUploadConfirm}
                  disabled={!uploadFile || !uploadLabel}
                  className="px-5 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  Upload
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         VERSION HISTORY MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showVersionHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Version History</h3>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>{showVersionHistory.label}</p>
              </div>
              <button onClick={() => setShowVersionHistory(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {[...showVersionHistory.versions].reverse().map((v, i) => (
                  <div key={v.versionNumber} className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${
                    i === 0 ? "border-green-200 bg-green-50/50" : "border-slate-100 bg-slate-50"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      i === 0 ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-500"
                    }`}>
                      <span className="text-[11px] font-semibold" style={{ fontFamily: F }}>v{v.versionNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-slate-900 truncate" style={{ fontFamily: F }}>{v.name}</p>
                      <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                        {v.uploadedBy} &middot; {formatDate(v.date)} &middot; {v.size}
                      </p>
                    </div>
                    {i === 0 && (
                      <span className="text-[9px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded font-medium" style={{ fontFamily: F }}>Current</span>
                    )}
                    <button className="p-1 rounded hover:bg-slate-100" title="Download">
                      <Download size={13} className="text-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowVersionHistory(null)}
                className="px-4 py-2 text-[12px] text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50" style={{ fontFamily: F }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         CHANGE METHOD MODAL — threshold guidance + justification
         ══════════════════════════════════════════════════════════════════════ */}
      {pendingMethod && methodCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Change Procurement Method</h3>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  {sc.caseNumber} &middot; {formatCurrency(sc.budget)}
                </p>
              </div>
              <button onClick={() => setPendingMethod(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded border ${getMethodColor(sc.method)}`}>{sc.method}</span>
                <ArrowLeft size={14} className="text-slate-400 rotate-180" />
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded border ${getMethodColor(pendingMethod)}`}>{pendingMethod}</span>
              </div>

              <div className={`px-4 py-3 rounded-lg border mb-4 ${
                methodCheck.compliant ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
              }`}>
                <div className="flex items-start gap-2">
                  {methodCheck.compliant
                    ? <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" />
                    : <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />}
                  <div>
                    <p className={`text-[12px] font-medium ${methodCheck.compliant ? "text-green-800" : "text-amber-800"}`} style={{ fontFamily: F }}>
                      {methodCheck.compliant
                        ? `${pendingMethod} matches the threshold band for ${formatCurrency(sc.budget)}.`
                        : `Deviation from the threshold guidance.`}
                    </p>
                    {methodBand && (
                      <p className={`text-[11px] mt-1 ${methodCheck.compliant ? "text-green-700" : "text-amber-700"}`} style={{ fontFamily: F }}>
                        {pendingMethod} normally applies {formatBand(methodBand)}. {methodBand.note}
                      </p>
                    )}
                    {!methodCheck.compliant && methodCheck.message && (
                      <p className="text-[11px] text-amber-700 mt-1" style={{ fontFamily: F }}>{methodCheck.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <label className="text-[12px] font-medium text-slate-700 mb-1.5 block" style={{ fontFamily: F }}>
                  Justification {methodNeedsJustification && <span className="text-red-500">*</span>}
                </label>
                <textarea rows={3} value={methodJustification}
                  onChange={e => { setMethodJustification(e.target.value); setMethodError(""); }}
                  placeholder={methodNeedsJustification
                    ? "Explain why this method is appropriate despite the threshold guidance..."
                    : "Optional note for the audit trail..."}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:ring-2 focus:ring-purple-400"
                  style={{ fontFamily: F }} />
              </div>

              <p className="text-[10px] text-slate-400 mb-3" style={{ fontFamily: F }}>
                Changing the method rebuilds the workflow steps. Completed steps and their documents are preserved.
              </p>

              {(sc.methodHistory ?? []).length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-medium text-slate-600 mb-2" style={{ fontFamily: F }}>Previous changes</p>
                  <div className="space-y-1.5">
                    {sc.methodHistory!.map((h, i) => (
                      <div key={i} className="text-[10px] text-slate-500 px-3 py-2 bg-slate-50 rounded" style={{ fontFamily: F }}>
                        <span className="font-medium text-slate-700">{h.from} → {h.to}</span> &middot; {formatDateTime(h.at)} by {h.by}
                        {h.justification && <span className="block text-slate-400 mt-0.5">{h.justification}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {methodError && (
                <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={12} className="text-red-500" />
                  <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{methodError}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setPendingMethod(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
              <button onClick={confirmMethodChange}
                className="px-5 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                Confirm Method Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         ADVERTISE / PUBLISH TENDER MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showAdvertiseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] max-h-[88vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Publish &amp; Advertise Tender</h3>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>{sc.caseNumber} &middot; {sc.description}</p>
              </div>
              <button onClick={() => setShowAdvertiseModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto">
              <p className="text-[12px] text-slate-600 mb-3" style={{ fontFamily: F }}>Select where this solicitation is published:</p>
              <div className="space-y-2.5 mb-4">
                {[
                  { id: "ACET Procurement Portal", title: "ACET Procurement Portal", blurb: "Opens the tender on the supplier portal for electronic submission" },
                  { id: "ACET Website", title: "ACET Website", blurb: "Post to the public-facing website" },
                  { id: "National Newspaper", title: "National Newspaper", blurb: "Print advertisement — upload the ad proof afterwards" },
                  { id: "Donor / Development Portal", title: "Donor / Development Portal", blurb: "Where the funding agreement requires wider publication" },
                ].map(ch => (
                  <label key={ch.id} className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                    adChannels.includes(ch.id) ? "border-purple-300 bg-purple-50" : "border-slate-200 hover:bg-slate-50"
                  }`}>
                    <input type="checkbox" checked={adChannels.includes(ch.id)} onChange={() => toggleAdChannel(ch.id)}
                      className="accent-purple-700 w-4 h-4" />
                    <div>
                      <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{ch.title}</p>
                      <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{ch.blurb}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Publication Date</label>
                  <input type="date" value={adPublicationDate} onChange={e => { setAdPublicationDate(e.target.value); setAdError(""); }}
                    className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Closing Date <span className="text-red-500">*</span></label>
                  <input type="date" value={adClosingDate} onChange={e => { setAdClosingDate(e.target.value); setAdError(""); }}
                    className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Closing Time</label>
                  <input type="time" value={adClosingTime} onChange={e => setAdClosingTime(e.target.value)}
                    className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contact for Enquiries</label>
                <input type="email" value={adContactEmail} onChange={e => setAdContactEmail(e.target.value)}
                  className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
              </div>

              <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[11px] text-slate-600" style={{ fontFamily: F }}>
                  <span className="font-medium text-slate-800">{solicitationDocs().length} solicitation document(s)</span> from the Solicitation step will be attached for bidders to download.
                  {solicitationDocs().length === 0 && " Upload the ITB/RFP first so bidders have something to respond to."}
                </p>
              </div>

              {adError && (
                <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={12} className="text-red-500" />
                  <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{adError}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowAdvertiseModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
              <button onClick={handlePostAdvertisement}
                className="px-4 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                {sc.advertisement ? "Update Publication" : "Publish Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         INVITE BIDDERS MODAL — sourced from the supplier register
         ══════════════════════════════════════════════════════════════════════ */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[680px] max-h-[88vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                  {isDirect(sc.method) ? "Select Supplier" : "Select & Invite Bidders"}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  Drawn live from the approved supplier register &middot; screened for eligibility
                </p>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {(sc.category === "Services" || sc.category === "Consultancy") && (
                <div className="mb-4">
                  <p className="text-[12px] font-medium text-slate-700 mb-2" style={{ fontFamily: F }}>Proposal Requirement</p>
                  <div className="flex gap-2">
                    {(["Technical", "Financial", "Both"] as const).map(t => (
                      <button key={t} onClick={() => setProposalType(t)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${
                          proposalType === t ? "bg-purple-700 text-white border-purple-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`} style={{ fontFamily: F }}>
                        {t === "Both" ? "Technical + Financial" : `${t} Only`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer" style={{ fontFamily: F }}>
                    <input type="checkbox" checked={scopeAllCategories} onChange={e => setScopeAllCategories(e.target.checked)} className="accent-purple-700 w-3.5 h-3.5" />
                    All categories
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer" style={{ fontFamily: F }}>
                    <input type="checkbox" checked={showIneligible} onChange={e => setShowIneligible(e.target.checked)} className="accent-purple-700 w-3.5 h-3.5" />
                    Show blocked suppliers
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {shortlistedNames.size > 0 && (
                    <button onClick={selectAllShortlisted}
                      className="text-[10px] px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1" style={{ fontFamily: F }}>
                      <Star size={10} /> Select shortlisted ({shortlistedNames.size})
                    </button>
                  )}
                  <button onClick={() => { resetRegisterForm(); setShowRegisterModal(true); }}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1" style={{ fontFamily: F }}>
                    <UserPlus size={10} /> Register new supplier
                  </button>
                </div>
              </div>

              {!isDirect(sc.method) && (
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-[11px] text-slate-600 shrink-0" style={{ fontFamily: F }}>Submissions close</label>
                  <input type="date" value={inviteClosingDate} onChange={e => setInviteClosingDate(e.target.value)}
                    className="border border-slate-200 rounded-lg h-[30px] px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                  <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                    A restricted tender opens on the supplier portal for the invited bidders only.
                  </span>
                </div>
              )}

              <div className="space-y-2">
                {supplierPool.length === 0 && (
                  <div className="border border-dashed border-slate-300 rounded-lg p-5 text-center">
                    <p className="text-[12px] text-slate-500" style={{ fontFamily: F }}>
                      No eligible suppliers in this category. Widen the scope, or register a new supplier.
                    </p>
                  </div>
                )}
                {supplierPool.map(v => {
                  const blocked = !v.eligibility.eligible;
                  const needsApproval = !blocked && v.eligibility.requiresManagementApproval;
                  const selected = selectedSupplierIds.includes(v.supplier.id);
                  return (
                    <label key={v.supplier.id}
                      className={`flex items-start gap-3 px-4 py-3 border rounded-lg transition-colors ${
                        blocked ? "border-red-200 bg-red-50/40 cursor-not-allowed" :
                        selected ? "border-purple-300 bg-purple-50 cursor-pointer" :
                        needsApproval ? "border-amber-200 bg-amber-50/40 cursor-pointer hover:bg-amber-50" :
                        "border-slate-200 hover:bg-slate-50 cursor-pointer"
                      }`}>
                      <input type={isDirect(sc.method) ? "radio" : "checkbox"} name="supplier"
                        checked={selected} disabled={blocked}
                        onChange={() => toggleSupplier(v.supplier.id)}
                        className="accent-purple-700 w-4 h-4 mt-0.5 disabled:cursor-not-allowed" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{v.name}</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500" style={{ fontFamily: F }}>{v.supplier.supplierId}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            v.supplier.status === "Active" ? "bg-green-50 text-green-700" :
                            v.supplier.status === "Flagged" ? "bg-amber-50 text-amber-700" :
                            "bg-red-50 text-red-700"
                          }`}>{v.supplier.status}</span>
                          {shortlistedNames.has(v.name.toLowerCase()) && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-medium flex items-center gap-0.5">
                              <Star size={8} /> Shortlisted
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: F }}>
                          {v.supplier.type} &middot; {v.supplier.category} · {v.supplier.subCategory} &middot; {v.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-medium flex items-center gap-1 ${
                            v.score >= 8 ? "text-green-600" : v.score >= 5 ? "text-amber-600" : v.score > 0 ? "text-red-600" : "text-slate-400"
                          }`} style={{ fontFamily: F }}>
                            <Star size={9} /> {v.score > 0 ? `${v.score}/10 past performance` : "No performance history"}
                          </span>
                          <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                            &middot; {v.supplier.totalOrders} order(s), {formatCurrency(v.supplier.totalSpend)} to date
                          </span>
                        </div>

                        {blocked && (
                          <div className="mt-1.5 flex items-start gap-1.5">
                            <Ban size={11} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-red-600" style={{ fontFamily: F }}>
                              Blocked from solicitation: {v.eligibility.blockingReasons.join(" ")}
                            </p>
                          </div>
                        )}
                        {needsApproval && (
                          <div className="mt-1.5 flex items-start gap-1.5">
                            <AlertTriangle size={11} className="text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-amber-700" style={{ fontFamily: F }}>
                              {v.eligibility.warnings.join(" ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {approvalSelections.length > 0 && (
                <div className="mt-4 px-4 py-3 border border-amber-300 bg-amber-50 rounded-lg">
                  <p className="text-[12px] font-semibold text-amber-900 mb-2 flex items-center gap-1.5" style={{ fontFamily: F }}>
                    <ShieldCheck size={13} /> Senior Management approval required
                  </p>
                  <ul className="mb-3 space-y-1">
                    {approvalSelections.map(v => (
                      <li key={v.supplier.id} className="text-[11px] text-amber-800" style={{ fontFamily: F }}>
                        <span className="font-medium">{v.name}</span> — {v.eligibility.warnings.join(" ")}
                      </li>
                    ))}
                  </ul>
                  <textarea rows={2} value={mgmtJustification}
                    onChange={e => { setMgmtJustification(e.target.value); setInviteError(""); }}
                    placeholder="Record why these suppliers are being invited despite the warnings, and who approved it..."
                    className="w-full border border-amber-300 rounded-lg px-3 py-2 text-[11px] text-slate-900 placeholder:text-amber-400 outline-none resize-none focus:ring-2 focus:ring-amber-400 bg-white"
                    style={{ fontFamily: F }} />
                  <label className="flex items-start gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={mgmtAck} onChange={e => { setMgmtAck(e.target.checked); setInviteError(""); }}
                      className="accent-amber-600 w-4 h-4 mt-0.5" />
                    <span className="text-[11px] text-amber-800" style={{ fontFamily: F }}>
                      I confirm Senior Management approval has been obtained for the suppliers listed above. This is recorded against the case with my name ({user.name}).
                    </span>
                  </label>
                </div>
              )}

              {inviteError && (
                <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={12} className="text-red-500 mt-0.5" />
                  <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{inviteError}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>
                {selectedSupplierIds.length} selected
                {approvalSelections.length > 0 && ` · ${approvalSelections.length} requiring management approval`}
              </span>
              <div className="flex gap-3">
                <button onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
                <button onClick={handleSendInvitations}
                  disabled={selectedSupplierIds.length === 0}
                  className="px-4 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  {isDirect(sc.method) ? "Confirm Selection" : "Send Invitations"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         REGISTER NEW SUPPLIER MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] max-h-[88vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-purple-600" />
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Register New Supplier</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                    Added to the supplier register — Procurement must approve onboarding before they can be invited.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto">
              {regResult ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <CheckCircle2 size={28} className="text-green-600" />
                  </div>
                  <p className="text-[14px] font-semibold text-green-800" style={{ fontFamily: F }}>{regResult.name} registered</p>
                  <p className="text-[11px] text-slate-500 mt-1" style={{ fontFamily: F }}>
                    Supplier ID <span className="font-medium text-slate-700">{regResult.supplierId}</span> &middot; status Pending Onboarding
                  </p>
                  <div className="mt-4 w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-[11px] text-amber-800" style={{ fontFamily: F }}>
                      The supplier cannot be invited or awarded until Procurement approves the registration in Supplier Management and the mandatory documents are on file.
                    </p>
                  </div>
                  {regResult.warnings.length > 0 && (
                    <ul className="mt-3 w-full space-y-1.5">
                      {regResult.warnings.map((w, i) => (
                        <li key={i} className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-700 flex items-start gap-2" style={{ fontFamily: F }}>
                          <AlertTriangle size={12} className="mt-0.5 shrink-0" /> {w}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-4">
                    {(["Firm", "Individual"] as SupplierType[]).map(t => (
                      <button key={t} onClick={() => { setRegType(t); setRegError(""); }}
                        className={`px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${
                          regType === t ? "bg-purple-700 text-white border-purple-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`} style={{ fontFamily: F }}>
                        {t === "Firm" ? "Firm / Company" : "Individual Consultant"}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>
                        {regType === "Firm" ? "Legal Business Name" : "Full Legal Name"} <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={regName} onChange={e => { setRegName(e.target.value); setRegError(""); }}
                        className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Email <span className="text-red-500">*</span></label>
                      <input type="email" value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegError(""); }}
                        className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Phone</label>
                      <input type="text" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                        className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Category</label>
                      <select value={regCategory} onChange={e => { setRegCategory(e.target.value); setRegSubCategory(""); }}
                        className="border border-slate-200 rounded-lg h-[36px] px-2 text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }}>
                        {SUPPLIER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Sub-category <span className="text-red-500">*</span></label>
                      <select value={regSubCategory} onChange={e => { setRegSubCategory(e.target.value); setRegError(""); }}
                        className="border border-slate-200 rounded-lg h-[36px] px-2 text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }}>
                        <option value="">Select...</option>
                        {(SUB_CATEGORIES[regCategory] ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>
                        {regType === "Firm" ? "Registered Address" : "Residential Address"}
                      </label>
                      <input type="text" value={regAddress} onChange={e => setRegAddress(e.target.value)}
                        className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                    </div>

                    {regType === "Firm" ? (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Registration Number</label>
                          <input type="text" value={regRegNumber} onChange={e => setRegRegNumber(e.target.value)}
                            className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Tax ID</label>
                          <input type="text" value={regTaxId} onChange={e => setRegTaxId(e.target.value)}
                            className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                        </div>
                        <div className="col-span-2 flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contact Person</label>
                          <input type="text" value={regContactPerson} onChange={e => setRegContactPerson(e.target.value)}
                            className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>ID Type</label>
                          <select value={regIdType} onChange={e => setRegIdType(e.target.value as typeof regIdType)}
                            className="border border-slate-200 rounded-lg h-[36px] px-2 text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }}>
                            <option value="National ID">National ID</option>
                            <option value="Passport">Passport</option>
                            <option value="Driver's License">Driver's License</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>ID Number</label>
                          <input type="text" value={regIdNumber} onChange={e => setRegIdNumber(e.target.value)}
                            className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                        </div>
                        <div className="col-span-2 flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Areas of Expertise (comma separated)</label>
                          <input type="text" value={regExpertAreas} onChange={e => setRegExpertAreas(e.target.value)}
                            placeholder="e.g. M&E, Public Health, Statistics"
                            className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-400" style={{ fontFamily: F }} />
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 mt-3" style={{ fontFamily: F }}>
                    Compliance documents and banking validation are captured in Supplier Management as part of onboarding.
                  </p>

                  {regError && (
                    <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertTriangle size={12} className="text-red-500" />
                      <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{regError}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>
                {regResult ? "Close" : "Cancel"}
              </button>
              {!regResult && (
                <button onClick={handleRegisterSupplier}
                  className="px-5 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  Register Supplier
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         CONTRACT AWARD MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showAwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] max-h-[88vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-green-200 bg-green-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-green-600" />
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Award Contract</h3>
              </div>
              <button onClick={() => setShowAwardModal(false)} className="p-1.5 hover:bg-green-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto">
              <p className="text-[12px] text-slate-600 mb-4" style={{ fontFamily: F }}>
                The PR number <span className="font-medium text-indigo-700">{sc.sourcePR}</span> converts to a Contract Number, pushes to Contract Management, registers against the supplier's profile, and marks the requisition Converted to Sourcing.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Awarded Supplier <span className="text-red-500">*</span></label>
                  <select value={awardSupplierId} onChange={e => { setAwardSupplierId(e.target.value); setAwardError(""); setAwardMgmtAck(false); }}
                    className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                    style={{ fontFamily: F }}>
                    <option value="">Select supplier...</option>
                    {awardCandidates.map(c => (
                      <option key={c.supplier.id} value={c.supplier.id}>
                        {c.name} — {c.score > 0 ? `${c.score}/10` : "no history"}{!c.eligibility.eligible ? " (blocked)" : c.eligibility.requiresManagementApproval ? " (approval required)" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                    Candidates are the suppliers invited, shortlisted or who submitted a bid on this case.
                  </p>
                </div>

                {awardCandidate && awardEligibility && !awardEligibility.eligible && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-[12px] font-semibold text-red-800 flex items-center gap-1.5 mb-1" style={{ fontFamily: F }}>
                      <Ban size={13} /> {awardCandidate.name} cannot be awarded
                    </p>
                    {awardEligibility.blockingReasons.map((r, i) => (
                      <p key={i} className="text-[11px] text-red-700" style={{ fontFamily: F }}>&bull; {r}</p>
                    ))}
                  </div>
                )}

                {awardCandidate && awardEligibility?.eligible && awardEligibility.requiresManagementApproval && (
                  <div className="px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg">
                    <p className="text-[12px] font-semibold text-amber-900 flex items-center gap-1.5 mb-1" style={{ fontFamily: F }}>
                      <ShieldCheck size={13} /> Senior Management approval required
                    </p>
                    {awardEligibility.warnings.map((w, i) => (
                      <p key={i} className="text-[11px] text-amber-800" style={{ fontFamily: F }}>&bull; {w}</p>
                    ))}
                    <textarea rows={2} value={awardMgmtJustification}
                      onChange={e => { setAwardMgmtJustification(e.target.value); setAwardError(""); }}
                      placeholder="Record the approval and the reason for proceeding..."
                      className="w-full mt-2 border border-amber-300 rounded-lg px-3 py-2 text-[11px] outline-none resize-none focus:ring-2 focus:ring-amber-400 bg-white"
                      style={{ fontFamily: F }} />
                    <label className="flex items-start gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" checked={awardMgmtAck} onChange={e => { setAwardMgmtAck(e.target.checked); setAwardError(""); }}
                        className="accent-amber-600 w-4 h-4 mt-0.5" />
                      <span className="text-[11px] text-amber-800" style={{ fontFamily: F }}>
                        I confirm Senior Management approval has been obtained for this award.
                      </span>
                    </label>
                  </div>
                )}

                {awardCandidate?.supplier.type === "Individual" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Agreed Consultant Rate</label>
                    <div className="flex items-center gap-2">
                      <input type="number" min={0} value={awardRate} onChange={e => setAwardRate(e.target.value)}
                        placeholder="e.g. 800"
                        className="flex-1 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-400" style={{ fontFamily: F }} />
                      <select value={awardRateType} onChange={e => setAwardRateType(e.target.value as "Daily" | "Monthly")}
                        className="border border-slate-200 rounded-lg h-[36px] px-2 text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-green-400" style={{ fontFamily: F }}>
                        <option value="Daily">Daily</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                      Recorded against the consultant's rate history so past rates stay visible at the next engagement.
                      {awardSubmissionRate && ` Portal quote: ${formatCurrency(awardSubmissionRate.amount)} ${awardSubmissionRate.rateType.toLowerCase()}.`}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contract Number (auto-generated)</label>
                  <input type="text" readOnly value={`CNT-${sc.sourcePR.replace("PR-", "")}`}
                    className="bg-slate-100 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-700 font-medium"
                    style={{ fontFamily: F }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Comments</label>
                  <textarea value={contractComment} onChange={e => setContractComment(e.target.value)} rows={2}
                    placeholder="Any remarks..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:border-green-400"
                    style={{ fontFamily: F }} />
                </div>
              </div>

              {awardError && (
                <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={12} className="text-red-500 mt-0.5" />
                  <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{awardError}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowAwardModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
              <button onClick={handleConfirmAward}
                disabled={!awardCandidate || !awardEligibility?.eligible}
                className="px-5 py-2 text-[12px] font-medium text-white rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: F }}>
                Award &amp; Push to Contracts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         RECORD SUPPLIER BID MODAL — bids received physically or by email
         ══════════════════════════════════════════════════════════════════════ */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-6 py-4 border-b border-purple-200 bg-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-purple-600" />
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Record Supplier Bid</h3>
                  <p className="text-[10px] text-purple-600 mt-0.5" style={{ fontFamily: F }}>Manual entry — bids received physically or via email</p>
                </div>
              </div>
              <button onClick={() => setShowBidModal(false)} className="p-1.5 hover:bg-purple-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800" style={{ fontFamily: F }}>
                  Electronic submissions arrive through the supplier portal automatically. Use this form only for bids delivered physically, by courier or by email.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Supplier / Bidder Name <span className="text-red-500">*</span></label>
                  <input type="text" value={bidSupplierName} onChange={e => { setBidSupplierName(e.target.value); setBidError(""); }}
                    list="sourcing-invited-suppliers"
                    placeholder="Enter supplier or bidder name..."
                    className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    style={{ fontFamily: F }} />
                  <datalist id="sourcing-invited-suppliers">
                    {(sc.invitedSuppliers ?? []).map(v => <option key={v.supplierId} value={v.name} />)}
                  </datalist>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Date Received</label>
                    <input type="date" value={bidDate} onChange={e => setBidDate(e.target.value)}
                      className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      style={{ fontFamily: F }} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Bid / Reference Number</label>
                    <input type="text" value={bidReference} onChange={e => setBidReference(e.target.value)}
                      placeholder="e.g. BID-001"
                      className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      style={{ fontFamily: F }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Notes (delivery method, condition, etc.)</label>
                  <textarea value={bidNotes} onChange={e => setBidNotes(e.target.value)} rows={2}
                    placeholder="e.g. Received via courier, sealed envelope, 2 copies..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:ring-2 focus:ring-purple-400"
                    style={{ fontFamily: F }} />
                </div>
              </div>
              {bidError && (
                <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={12} className="text-red-500" />
                  <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{bidError}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>
                On the register: {mergedBids.length} ({openedSubmissions.length} electronic)
              </span>
              <div className="flex gap-3">
                <button onClick={() => setShowBidModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
                <button onClick={handleAddBid}
                  disabled={!bidSupplierName.trim()}
                  className="px-5 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  Record Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Contract Modal */}
      {showSignModal && signatureData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSignModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Apply Signature</h3>
              <button onClick={() => setShowSignModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>You are about to sign this contract with your personal signature:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Contract</span>
                  <span className="text-[11px] text-slate-900 font-medium" style={{ fontFamily: F }}>{sc.contractNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Supplier</span>
                  <span className="text-[11px] text-slate-900" style={{ fontFamily: F }}>{sc.awardedSupplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Signed By</span>
                  <span className="text-[11px] text-slate-900" style={{ fontFamily: F }}>{signatureData.employeeName}</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center">
                <img src={signatureData.dataUrl} alt="My Signature" className="max-w-[220px] max-h-[90px] object-contain" />
              </div>
              <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>By clicking "Confirm &amp; Sign", you confirm this is your personal signature.</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setShowSignModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-[12px] hover:bg-slate-50" style={{ fontFamily: F }}>
                Cancel
              </button>
              <button onClick={handleApplySignature}
                className="px-4 py-2 text-white rounded-lg text-[12px] hover:opacity-90 flex items-center gap-1.5"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                <PenLine size={13} />
                Confirm &amp; Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
