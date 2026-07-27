import { useEffect, useState } from "react";
import {
  ArrowLeft, Star, ShieldCheck, ShieldAlert, ShieldBan, AlertTriangle,
  ClipboardCheck, X, FileText, History, CheckCircle2, XCircle, Clock,
  Building2, User, Landmark, BadgeCheck, Paperclip, Info, Layers,
} from "lucide-react";
import {
  subscribe as subscribeVendors,
  getVendorById, vendorDisplayName, vendorEmail, vendorAddress, avgScore,
  getVendorFlags, checkSourcingEligibility,
  changeVendorStatus, requestReactivation, approveReactivation, approveVendorRegistration,
  validateBankingDetails, addVendorDocument, recordVendorEvaluation,
  FIRM_DOC_CHECKLIST, INDIVIDUAL_DOC_CHECKLIST,
  type Vendor, type PerformanceScore, type VendorStatus, type VendorFlags,
} from "../lib/vendorStore";
import {
  can, denialReason, getCurrentUser, hasRole, subscribe as subscribeUser,
} from "../lib/currentUser";
import { pickFiles, FileValidationError } from "../lib/fileUpload";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════════ */

interface SupplierDetailsViewProps {
  /** Store id or vendor number (VND-xxxx) of the vendor to display. */
  vendorId: string;
  onBack: () => void;
}

type StatusAction = "Flag" | "Suspend" | "Blacklist" | "Reactivate" | "Approve Reactivation";

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "'Montserrat Variable', sans-serif";

function getStatusBadge(status: string) {
  switch (status) {
    case "Active":
      return { emoji: "🟢", bg: "bg-green-100 text-green-800 border-green-300", label: "Active" };
    case "Pending Onboarding":
      return { emoji: "🔵", bg: "bg-blue-100 text-blue-800 border-blue-300", label: "Pending Onboarding" };
    case "Flagged":
      return { emoji: "🟡", bg: "bg-amber-100 text-amber-800 border-amber-300", label: "Flagged" };
    case "Suspended":
      return { emoji: "🔴", bg: "bg-red-100 text-red-800 border-red-300", label: "Suspended" };
    case "Blacklisted":
      return { emoji: "⚫", bg: "bg-slate-200 text-slate-800 border-slate-400", label: "Blacklisted" };
    case "Pending Reactivation":
      return { emoji: "🔵", bg: "bg-blue-100 text-blue-800 border-blue-300", label: "Pending Reactivation" };
    default:
      return { emoji: "⚪", bg: "bg-slate-100 text-slate-600 border-slate-300", label: status };
  }
}

function getRiskColor(r: string) {
  switch (r) {
    case "Low": return "bg-green-50 text-green-700 border-green-200";
    case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
    case "High": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function scoreColor(v: number) {
  if (v === 0) return "text-slate-400";
  if (v >= 8) return "text-green-600";
  if (v >= 6) return "text-amber-600";
  if (v >= 4) return "text-orange-600";
  return "text-red-600";
}

function scoreBg(v: number) {
  if (v === 0) return "bg-slate-200";
  if (v >= 8) return "bg-green-500";
  if (v >= 6) return "bg-amber-500";
  if (v >= 4) return "bg-orange-500";
  return "bg-red-500";
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

function maskAccount(account: string) {
  const value = (account ?? "").trim();
  if (!value) return "—";
  if (value.startsWith("*") || value.startsWith("•")) return value;
  return `••••${value.slice(-4)}`;
}

const CRITERIA = [
  { key: "quality" as const, label: "Quality of Deliverables", desc: "Accuracy, completeness, and standard of goods/services delivered" },
  { key: "timeliness" as const, label: "Timeliness", desc: "Adherence to agreed delivery schedules and milestones" },
  { key: "responsiveness" as const, label: "Responsiveness", desc: "Speed and quality of communication and issue resolution" },
  { key: "costManagement" as const, label: "Cost Management", desc: "Adherence to budget, fair pricing, and cost-effectiveness" },
  { key: "compliance" as const, label: "Compliance", desc: "Conformity with contract terms, regulations, and organizational policies" },
];

function localAvg(p: PerformanceScore) {
  const vals = [p.quality, p.timeliness, p.responsiveness, p.costManagement, p.compliance];
  const nonZero = vals.filter(v => v > 0);
  if (nonZero.length === 0) return 0;
  return +(nonZero.reduce((a, b) => a + b, 0) / nonZero.length).toFixed(1);
}

/**
 * Mirrors the weighting the store applies in `computeRiskLevel`, so the derived
 * risk rating can be explained rather than just asserted.
 */
function riskDrivers(v: Vendor, flags: VendorFlags): { label: string; weight: number }[] {
  const drivers: { label: string; weight: number }[] = [];
  const avg = avgScore(v.performance);
  if (avg > 0 && avg < 5) drivers.push({ label: `Average performance ${avg}/10 — below the acceptable threshold of 5`, weight: 3 });
  else if (avg > 0 && avg < 7) drivers.push({ label: `Average performance ${avg}/10 — below 7`, weight: 1 });
  if (flags.expiredDocs.length > 0) drivers.push({ label: `Expired compliance documents: ${flags.expiredDocs.join(", ")}`, weight: 2 });
  if (flags.missingDocs.length > 0) drivers.push({ label: `Documents not yet on file: ${flags.missingDocs.join(", ")}`, weight: 1 });
  if (v.status === "Flagged") drivers.push({ label: "Vendor is flagged for monitoring", weight: 2 });
  if (v.status === "Suspended") drivers.push({ label: "Vendor is suspended", weight: 3 });
  if (v.status === "Blacklisted") drivers.push({ label: "Vendor is blacklisted", weight: 4 });
  if (flags.sanctioned) drivers.push({ label: "Name appears on a donor/statutory sanctions list", weight: 4 });
  return drivers;
}

/** Re-render whenever the vendor register or the signed-in user changes. */
function useStoreSubscription() {
  const [, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    const unsubVendors = subscribeVendors(bump);
    const unsubUser = subscribeUser(bump);
    return () => { unsubVendors(); unsubUser(); };
  }, []);
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function SupplierDetailsView({ vendorId, onBack }: SupplierDetailsViewProps) {
  useStoreSubscription();
  const user = getCurrentUser();
  const vendor = getVendorById(vendorId);

  // State
  const [activeSection, setActiveSection] = useState<"overview" | "performance" | "orders" | "documents">("overview");
  const [showEvalForm, setShowEvalForm] = useState(false);
  const [showActionModal, setShowActionModal] = useState<StatusAction | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionReasonError, setActionReasonError] = useState(false);
  const [notice, setNotice] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [revealAccount, setRevealAccount] = useState(false);

  // Document upload
  const [docUpload, setDocUpload] = useState<{ label: string; customLabel: string; expiry: string } | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);

  // Evaluation form state
  const [evalType, setEvalType] = useState<"Contract Close-out" | "Mid-Term Review">("Contract Close-out");
  const [evalContractNumber, setEvalContractNumber] = useState("");
  const [evalContractTitle, setEvalContractTitle] = useState("");
  const [evalScores, setEvalScores] = useState<PerformanceScore>({
    quality: 5, timeliness: 5, responsiveness: 5, costManagement: 5, compliance: 5,
  });
  const [evalComments, setEvalComments] = useState<Record<string, string>>({
    quality: "", timeliness: "", responsiveness: "", costManagement: "", compliance: "",
  });
  const [evalGeneralComment, setEvalGeneralComment] = useState("");
  const [evalErrors, setEvalErrors] = useState<Record<string, boolean>>({});
  const [evalSubmitted, setEvalSubmitted] = useState(false);

  if (!vendor) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 gap-3" style={{ fontFamily: F }}>
        <p className="text-[13px] text-slate-500">This vendor record is no longer available.</p>
        <button onClick={onBack} className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-[12px] text-slate-700 hover:bg-slate-50">
          Back to Supplier Management
        </button>
      </div>
    );
  }

  const canSuspend = can("vendor.suspend");
  const canApproveReactivation = can("vendor.approveReactivation");
  const canRequestReactivation = hasRole("Procurement") || canApproveReactivation;
  const canApproveRegistration = can("vendor.approveRegistration");
  const canValidateBanking = can("vendor.validateBanking");
  const canEvaluate = can("contract.evaluatePerformance");
  const canUploadDocs = can("vendor.create");

  const performance = vendor.performance;
  const avg = avgScore(performance);
  const flags = getVendorFlags(vendor);
  const drivers = riskDrivers(vendor, flags);
  const riskScore = drivers.reduce((sum, d) => sum + d.weight, 0);
  const eligibility = checkSourcingEligibility(vendor.id);
  const statusBadge = getStatusBadge(vendor.status);
  const checklist = vendor.type === "Firm" ? FIRM_DOC_CHECKLIST : INDIVIDUAL_DOC_CHECKLIST;
  const evaluations = vendor.evaluations ?? [];
  const contracts = vendor.contractHistory ?? [];
  const contractCount = contracts.length;
  const contractValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const name = vendorDisplayName(vendor);

  // ── Handlers ──

  const handleActionConfirm = () => {
    if (!showActionModal) return;
    const actor = getCurrentUser();

    if (showActionModal === "Approve Reactivation") {
      approveReactivation(vendor.id, actor.name);
      setNotice({ tone: "success", text: `${name} has been reactivated and is eligible for sourcing again.` });
      setShowActionModal(null);
      return;
    }

    if (!actionReason.trim()) {
      setActionReasonError(true);
      return;
    }

    if (showActionModal === "Reactivate") {
      requestReactivation(vendor.id, actionReason.trim(), actor.name);
      setNotice({ tone: "success", text: "Reactivation requested — Senior Management has been notified for approval." });
    } else {
      const target: VendorStatus =
        showActionModal === "Flag" ? "Flagged" : showActionModal === "Suspend" ? "Suspended" : "Blacklisted";
      const approver = canApproveReactivation ? actor.name : undefined;
      changeVendorStatus(vendor.id, target, actionReason.trim(), actor.name, approver);
      setNotice({ tone: "success", text: `Status updated to ${target}.` });
    }

    setShowActionModal(null);
    setActionReason("");
    setActionReasonError(false);
  };

  const handleApproveRegistration = () => {
    const approved = approveVendorRegistration(vendor.id, getCurrentUser().name);
    if (!approved) {
      setNotice({
        tone: "error",
        text: `Registration cannot be approved — outstanding documents: ${flags.missingDocs.join(", ")}.`,
      });
      return;
    }
    setNotice({ tone: "success", text: `${name} approved and added to the active vendor list.` });
  };

  const handleValidateBanking = () => {
    validateBankingDetails(vendor.id, getCurrentUser().name);
    setNotice({ tone: "success", text: "Banking details confirmed and recorded against the vendor profile." });
  };

  const handleDocumentUpload = async () => {
    if (!docUpload) return;
    const label = (docUpload.label === "__other" ? docUpload.customLabel : docUpload.label).trim();
    if (!label) {
      setNotice({ tone: "error", text: "Give the document a label before uploading." });
      return;
    }
    setUploadBusy(true);
    try {
      const files = await pickFiles({ multiple: false, uploadedBy: getCurrentUser().name });
      if (files.length === 0) {
        setUploadBusy(false);
        return;
      }
      addVendorDocument(vendor.id, { label, expiry: docUpload.expiry || undefined }, getCurrentUser().name);
      setNotice({
        tone: "success",
        text: `${label} uploaded (${files[0].name})${docUpload.expiry ? `, valid until ${docUpload.expiry}` : ""}.`,
      });
      setDocUpload(null);
    } catch (err) {
      setNotice({
        tone: "error",
        text: err instanceof FileValidationError ? err.message : "The file could not be attached. Try again.",
      });
    } finally {
      setUploadBusy(false);
    }
  };

  const handleEvalSubmit = () => {
    // Validate: mandatory comments for any score < 4
    const errors: Record<string, boolean> = {};
    let hasError = false;
    for (const c of CRITERIA) {
      if (evalScores[c.key] < 4 && !evalComments[c.key].trim()) {
        errors[c.key] = true;
        hasError = true;
      }
    }
    if (hasError) {
      setEvalErrors(errors);
      return;
    }
    setEvalErrors({});

    const actor = getCurrentUser();
    const narrative = [
      evalGeneralComment.trim(),
      ...CRITERIA
        .filter(c => evalComments[c.key].trim())
        .map(c => `${c.label}: ${evalComments[c.key].trim()}`),
    ].filter(Boolean).join(" — ");

    recordVendorEvaluation(vendor.id, {
      contractNumber: evalContractNumber.trim() || "Ad-hoc",
      contractTitle: evalContractTitle.trim() || "Manual performance assessment",
      evaluationType: evalType === "Contract Close-out" ? "Final" : "Mid-Term",
      evaluationDate: new Date().toISOString().split("T")[0],
      evaluator: actor.name,
      supervisorApproval: actor.supervisorName,
      criteria: CRITERIA.map(c => ({ name: c.label, score: evalScores[c.key], maxScore: 10 })),
      overallScore: localAvg(evalScores),
      comments: narrative || "No additional comments recorded.",
    });

    setEvalSubmitted(true);
    setTimeout(() => {
      setShowEvalForm(false);
      setEvalSubmitted(false);
      setEvalScores({ quality: 5, timeliness: 5, responsiveness: 5, costManagement: 5, compliance: 5 });
      setEvalComments({ quality: "", timeliness: "", responsiveness: "", costManagement: "", compliance: "" });
      setEvalGeneralComment("");
      setEvalContractNumber("");
      setEvalContractTitle("");
    }, 1500);
  };

  const setScore = (key: keyof PerformanceScore, val: number) => {
    setEvalScores(prev => ({ ...prev, [key]: val }));
    if (val >= 4) setEvalErrors(prev => ({ ...prev, [key]: false }));
  };

  const openAction = (action: StatusAction) => {
    setActionReason("");
    setActionReasonError(false);
    setShowActionModal(action);
  };

  // ── Section tabs ──
  const sectionTabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "performance" as const, label: "Performance" },
    { key: "orders" as const, label: "Order History" },
    { key: "documents" as const, label: "Documents" },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 shrink-0">
            {vendor.type === "Firm" ? <Building2 size={18} /> : <User size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-[16px] font-semibold text-slate-900 truncate" style={{ fontFamily: F }}>{name}</h1>
              <span className="text-[11px] text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded shrink-0">{vendor.vendorId}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
              {vendor.category}{vendor.subCategory ? ` — ${vendor.subCategory}` : ""} &middot; Onboarded {formatDate(vendor.dateOnboarded)}
              {vendor.registrationSource ? ` · ${vendor.registrationSource}` : ""}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium ${getRiskColor(vendor.riskLevel)}`} style={{ fontFamily: F }}>
          {vendor.riskLevel} risk
        </div>

        {/* ── Prominent Status Badge ── */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusBadge.bg}`}>
          <span className="text-[14px]">{statusBadge.emoji}</span>
          <span className="text-[12px] font-semibold" style={{ fontFamily: F }}>{statusBadge.label}</span>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between gap-4">
        {/* Section tabs */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {sectionTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[90px] ${
                activeSection === tab.key ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
              style={{ fontFamily: F }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons — gated by the signed-in user's role */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={() => setShowEvalForm(true)}
            disabled={!canEvaluate}
            title={canEvaluate ? undefined : denialReason("contract.evaluatePerformance")}
            className="px-3.5 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0B01D0", fontFamily: F }}
          >
            <ClipboardCheck size={14} /> Evaluate Performance
          </button>

          {(vendor.status === "Pending Onboarding" || vendor.pendingReview) && (
            <button onClick={handleApproveRegistration}
              disabled={!canApproveRegistration}
              title={canApproveRegistration ? undefined : denialReason("vendor.approveRegistration")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: F }}>
              <BadgeCheck size={13} /> Approve Registration
            </button>
          )}

          {vendor.status === "Active" && (
            <button onClick={() => openAction("Flag")}
              disabled={!canSuspend}
              title={canSuspend ? undefined : denialReason("vendor.suspend")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: F }}>
              <AlertTriangle size={13} /> Flag
            </button>
          )}
          {(vendor.status === "Active" || vendor.status === "Flagged") && (
            <button onClick={() => openAction("Suspend")}
              disabled={!canSuspend}
              title={canSuspend ? undefined : denialReason("vendor.suspend")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: F }}>
              <ShieldAlert size={13} /> Suspend
            </button>
          )}
          {(vendor.status === "Active" || vendor.status === "Flagged" || vendor.status === "Suspended") && (
            <button onClick={() => openAction("Blacklist")}
              disabled={!canSuspend}
              title={canSuspend ? undefined : denialReason("vendor.suspend")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-slate-400 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: F }}>
              <ShieldBan size={13} /> Blacklist
            </button>
          )}
          {(vendor.status === "Flagged" || vendor.status === "Suspended" || vendor.status === "Blacklisted") && (
            <button onClick={() => openAction("Reactivate")}
              disabled={!canRequestReactivation}
              title={canRequestReactivation ? undefined : "Requires Procurement or Senior Management role."}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: F }}>
              <ShieldCheck size={13} /> Request Reactivation
            </button>
          )}
          {vendor.status === "Pending Reactivation" && (
            <button onClick={() => openAction("Approve Reactivation")}
              disabled={!canApproveReactivation}
              title={canApproveReactivation ? undefined : denialReason("vendor.approveReactivation")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: F }}>
              <ShieldCheck size={13} /> Approve Reactivation
            </button>
          )}
        </div>
      </div>

      {/* Notice strip */}
      {notice && (
        <div className={`px-6 py-2.5 border-b shrink-0 flex items-center justify-between ${notice.tone === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-[11px] flex items-center gap-1.5 ${notice.tone === "error" ? "text-red-700" : "text-green-700"}`} style={{ fontFamily: F }}>
            {notice.tone === "error" ? <XCircle size={13} /> : <CheckCircle2 size={13} />} {notice.text}
          </p>
          <button onClick={() => setNotice(null)} className="p-1 hover:bg-white/60 rounded"><X size={13} className={notice.tone === "error" ? "text-red-500" : "text-green-600"} /></button>
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-6">
        {/* ────────────── OVERVIEW TAB ────────────── */}
        {activeSection === "overview" && (
          <>
            {/* Sourcing eligibility */}
            <div className={`rounded-xl border p-4 mb-6 ${
              !eligibility.eligible ? "bg-red-50 border-red-200"
                : eligibility.requiresManagementApproval ? "bg-amber-50 border-amber-200"
                  : "bg-green-50 border-green-200"
            }`}>
              <div className="flex items-start gap-2.5">
                {!eligibility.eligible ? <ShieldBan size={16} className="text-red-600 mt-px" />
                  : eligibility.requiresManagementApproval ? <AlertTriangle size={16} className="text-amber-600 mt-px" />
                    : <ShieldCheck size={16} className="text-green-600 mt-px" />}
                <div className="flex-1">
                  <p className={`text-[12px] font-semibold ${!eligibility.eligible ? "text-red-700" : eligibility.requiresManagementApproval ? "text-amber-700" : "text-green-700"}`} style={{ fontFamily: F }}>
                    {!eligibility.eligible
                      ? "Blocked from solicitation and award"
                      : eligibility.requiresManagementApproval
                        ? "Eligible with Senior Management approval"
                        : "Eligible for solicitation and award"}
                  </p>
                  {(eligibility.blockingReasons.length > 0 || eligibility.warnings.length > 0) && (
                    <ul className="mt-1 space-y-0.5">
                      {eligibility.blockingReasons.map((r, i) => (
                        <li key={`b-${i}`} className="text-[11px] text-red-700" style={{ fontFamily: F }}>· {r}</li>
                      ))}
                      {eligibility.warnings.map((w, i) => (
                        <li key={`w-${i}`} className="text-[11px] text-amber-700" style={{ fontFamily: F }}>· {w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Average Rating</p>
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-500 fill-amber-500" />
                  <span className={`text-[22px] font-semibold ${scoreColor(avg)}`} style={{ fontFamily: F }}>
                    {avg > 0 ? `${avg}/10` : "N/A"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: F }}>
                  {evaluations.length} evaluation{evaluations.length === 1 ? "" : "s"} on record
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Total Orders</p>
                <p className="text-[22px] font-semibold text-slate-900" style={{ fontFamily: F }}>{vendor.totalOrders}</p>
                <p className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: F }}>{contractCount} contract{contractCount === 1 ? "" : "s"} recorded</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Total Spend</p>
                <p className="text-[22px] font-semibold text-slate-900" style={{ fontFamily: F }}>{formatCurrency(vendor.totalSpend)}</p>
                <p className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: F }}>{formatCurrency(contractValue)} awarded on file</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Risk Level (derived)</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium border ${getRiskColor(vendor.riskLevel)}`}>
                  {vendor.riskLevel}
                </span>
                <p className="text-[10px] text-slate-400 mt-1.5" style={{ fontFamily: F }}>Score {riskScore} · High ≥ 4, Medium ≥ 2</p>
              </div>
            </div>

            {/* Risk drivers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: F }}>Risk Assessment</h2>
                <span className="text-[10px] text-slate-400 flex items-center gap-1" style={{ fontFamily: F }}>
                  <Info size={11} /> Computed automatically on every change — not manually editable
                </span>
              </div>
              {drivers.length === 0 ? (
                <p className="text-[12px] text-green-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                  <CheckCircle2 size={13} /> No risk drivers — performance, compliance documents and status are all clear.
                </p>
              ) : (
                <div className="space-y-2">
                  {drivers.map((d, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg">
                      <p className="text-[12px] text-slate-700" style={{ fontFamily: F }}>{d.label}</p>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${d.weight >= 3 ? "bg-red-50 text-red-700" : d.weight === 2 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                        +{d.weight}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {flags.expiringDocs.length > 0 && (
                <p className="text-[11px] text-amber-600 mt-3 flex items-center gap-1.5" style={{ fontFamily: F }}>
                  <Clock size={12} /> Expiring within 30 days: {flags.expiringDocs.map(d => `${d.doc} (${d.daysLeft}d)`).join(", ")}
                </p>
              )}
            </div>

            {/* Vendor Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-[14px] font-semibold text-slate-900 mb-4" style={{ fontFamily: F }}>Vendor Information</h2>
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Contact Person</p>
                  <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{vendor.type === "Firm" ? vendor.contactPerson : vendor.legalName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Email</p>
                  <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{vendorEmail(vendor)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Phone</p>
                  <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{vendor.type === "Firm" ? vendor.phone : vendor.contactPhone}</p>
                </div>
                {vendor.type === "Firm" ? (
                  <>
                    <div>
                      <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Registration #</p>
                      <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{vendor.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Tax ID</p>
                      <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{vendor.taxId}</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>ID ({vendor.idType})</p>
                    <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{vendor.idNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>{vendor.type === "Firm" ? "Registered Address" : "Residential Address"}</p>
                  <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{vendorAddress(vendor)}</p>
                </div>
              </div>

              {vendor.type === "Firm" && (vendor.ownershipDetails || (vendor.specialization && vendor.specialization.length > 0)) && (
                <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-x-8 gap-y-4">
                  {vendor.ownershipDetails && (
                    <div>
                      <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Ownership &amp; Beneficial Ownership</p>
                      <p className="text-[12px] text-slate-700 leading-relaxed" style={{ fontFamily: F }}>{vendor.ownershipDetails}</p>
                    </div>
                  )}
                  {vendor.specialization && vendor.specialization.length > 0 && (
                    <div>
                      <p className="text-[11px] text-slate-500 mb-1.5" style={{ fontFamily: F }}>Specialization</p>
                      <div className="flex flex-wrap gap-1.5">
                        {vendor.specialization.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px] font-medium" style={{ fontFamily: F }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Banking */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Landmark size={16} className="text-purple-700" />
                  <h2 className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: F }}>Banking Details</h2>
                </div>
                {vendor.bankValidated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200" style={{ fontFamily: F }}>
                    <BadgeCheck size={12} /> Validated{vendor.bankValidatedBy ? ` by ${vendor.bankValidatedBy}` : ""}
                  </span>
                ) : (
                  <button
                    onClick={handleValidateBanking}
                    disabled={!canValidateBanking}
                    title={canValidateBanking ? undefined : denialReason("vendor.validateBanking")}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontFamily: F }}>
                    <BadgeCheck size={12} /> Validate Banking Details
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Bank</p>
                  <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{vendor.bankName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Account Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>
                      {revealAccount && canValidateBanking ? vendor.bankAccountNumber : maskAccount(vendor.bankAccountNumber)}
                    </p>
                    {canValidateBanking ? (
                      <button onClick={() => setRevealAccount(!revealAccount)} className="text-[10px] text-purple-700 hover:underline" style={{ fontFamily: F }}>
                        {revealAccount ? "Hide" : "Reveal"}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400" style={{ fontFamily: F }} title={denialReason("vendor.validateBanking")}>Masked</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Validation Status</p>
                  <p className={`text-[13px] ${vendor.bankValidated ? "text-green-700" : "text-amber-700"}`} style={{ fontFamily: F }}>
                    {vendor.bankValidated ? "Confirmed by Finance" : "Awaiting Finance validation"}
                  </p>
                </div>
              </div>
            </div>

            {/* Expert Areas (Individual only) */}
            {vendor.type === "Individual" && vendor.expertAreas.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-[14px] font-semibold text-slate-900 mb-3" style={{ fontFamily: F }}>Expert Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.expertAreas.map(area => (
                    <span key={area} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px] font-medium" style={{ fontFamily: F }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Rates (Individual only) */}
            {vendor.type === "Individual" && vendor.historicalRates.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-[14px] font-semibold text-slate-900 mb-3" style={{ fontFamily: F }}>Historical Rates</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 text-[11px] font-semibold text-slate-500" style={{ fontFamily: F }}>Assignment</th>
                      <th className="text-right py-2 px-3 text-[11px] font-semibold text-slate-500" style={{ fontFamily: F }}>Rate (USD)</th>
                      <th className="text-center py-2 px-3 text-[11px] font-semibold text-slate-500" style={{ fontFamily: F }}>Type</th>
                      <th className="text-left py-2 px-3 text-[11px] font-semibold text-slate-500" style={{ fontFamily: F }}>Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendor.historicalRates.map((hr, i) => (
                      <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                        <td className="py-2 px-3 text-[12px] text-slate-900" style={{ fontFamily: F }}>{hr.assignment}</td>
                        <td className="py-2 px-3 text-[12px] text-slate-900 text-right font-medium" style={{ fontFamily: F }}>{formatCurrency(hr.rate)}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${hr.rateType === "Daily" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
                            {hr.rateType}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{hr.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Performance at a Glance */}
            {avg > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-[14px] font-semibold text-slate-900 mb-4" style={{ fontFamily: F }}>Performance at a Glance</h2>
                <div className="space-y-3">
                  {CRITERIA.map(c => {
                    const val = performance[c.key];
                    return (
                      <div key={c.key} className="flex items-center gap-4">
                        <p className="text-[12px] text-slate-700 w-[180px] shrink-0" style={{ fontFamily: F }}>{c.label}</p>
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${scoreBg(val)}`} style={{ width: `${val * 10}%` }} />
                        </div>
                        <span className={`text-[13px] font-semibold w-[40px] text-right ${scoreColor(val)}`} style={{ fontFamily: F }}>
                          {val > 0 ? val.toFixed(1) : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status History */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <History size={16} className="text-purple-700" />
                <h2 className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: F }}>Status History</h2>
              </div>
              {(vendor.statusHistory ?? []).length === 0 ? (
                <p className="text-[13px] text-slate-400 text-center py-6" style={{ fontFamily: F }}>No status changes recorded — the vendor has held its original status since onboarding.</p>
              ) : (
                <div className="space-y-3">
                  {[...(vendor.statusHistory ?? [])].reverse().map(change => (
                    <div key={change.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>{formatDate(change.date)}</span>
                          <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>{change.from}</span>
                          <span className="text-[11px] text-slate-300">→</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(change.to).bg}`}>{change.to}</span>
                        </div>
                        <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                          by {change.performedBy}{change.approvedBy ? ` · approved by ${change.approvedBy}` : ""}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{change.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ────────────── PERFORMANCE TAB ────────────── */}
        {activeSection === "performance" && (
          <>
            {/* Current Scores */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: F }}>Current Performance Scores</h2>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className={`text-[18px] font-semibold ${scoreColor(avg)}`} style={{ fontFamily: F }}>
                    {avg > 0 ? `${avg}/10` : "N/A"}
                  </span>
                  <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>Overall Average</span>
                </div>
              </div>
              {avg > 0 ? (
                <div className="grid grid-cols-5 gap-4">
                  {CRITERIA.map(c => {
                    const val = performance[c.key];
                    return (
                      <div key={c.key} className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                        <p className="text-[11px] text-slate-500 mb-2" style={{ fontFamily: F }}>{c.label}</p>
                        <div className={`text-[24px] font-semibold ${scoreColor(val)}`} style={{ fontFamily: F }}>
                          {val.toFixed(1)}
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full rounded-full ${scoreBg(val)}`} style={{ width: `${val * 10}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[13px] text-slate-400" style={{ fontFamily: F }}>No evaluations recorded yet. Click "Evaluate Performance" to begin.</p>
                </div>
              )}
            </div>

            {/* Evaluation History */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <History size={16} className="text-purple-700" />
                <h2 className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: F }}>Evaluation History</h2>
                <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                  Mid-term and close-out evaluations recorded against this vendor's contracts
                </span>
              </div>
              {evaluations.length > 0 ? (
                <div className="space-y-4">
                  {[...evaluations].reverse().map(ev => (
                    <div key={ev.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                            ev.evaluationType === "Final" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                          }`}>{ev.evaluationType === "Final" ? "Contract Close-out" : "Mid-Term Review"}</span>
                          <span className="text-[11px] text-purple-600 font-medium" style={{ fontFamily: F }}>{ev.contractNumber}</span>
                          <span className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{ev.contractTitle}</span>
                          <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>{formatDate(ev.evaluationDate)} · by {ev.evaluator}</span>
                          {ev.supervisorApproval && (
                            <span className="text-[10px] text-green-600 flex items-center gap-1" style={{ fontFamily: F }}>
                              <CheckCircle2 size={10} /> approved {ev.supervisorApproval}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star size={13} className="text-amber-500 fill-amber-500" />
                          <span className={`text-[13px] font-semibold ${scoreColor(ev.overallScore)}`} style={{ fontFamily: F }}>{ev.overallScore.toFixed(1)}/10</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {ev.criteria.map(c => {
                          const normalised = (c.score / (c.maxScore || 10)) * 10;
                          return (
                            <div key={c.name} className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400 w-[60px] truncate" style={{ fontFamily: F }} title={c.name}>{c.name.split(" ")[0]}</span>
                              <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${scoreBg(normalised)}`} style={{ width: `${normalised * 10}%` }} />
                              </div>
                              <span className="text-[10px] font-medium text-slate-600" style={{ fontFamily: F }}>{c.score}</span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{ev.comments}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[13px] text-slate-400" style={{ fontFamily: F }}>
                    No evaluation history. Evaluations arrive automatically from contract close-out, or can be recorded manually here.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ────────────── ORDER / CONTRACT HISTORY TAB ────────────── */}
        {activeSection === "orders" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: F }}>Contract &amp; Award History</h2>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>Every award registered against this vendor in Contract Management.</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: F }}>{contractCount}</p>
                  <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>Total orders</p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: F }}>{formatCurrency(contractValue)}</p>
                  <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>Total spend</p>
                </div>
              </div>
            </div>
            {contractCount === 0 ? (
              <p className="text-center py-12 text-[13px] text-slate-400" style={{ fontFamily: F }}>No contracts have been awarded to this vendor yet.</p>
            ) : (
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Contract #</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Title</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Award Date</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Funding Source</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Value</th>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c, i) => (
                    <tr key={c.contractNumber} className={`border-b border-slate-100 hover:bg-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-4 py-3 text-[12px] font-medium text-purple-700" style={{ fontFamily: F }}>{c.contractNumber}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900" style={{ fontFamily: F }}>{c.title}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{formatDate(c.awardDate)}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{c.fundingSource ?? "—"}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900 text-right font-medium" style={{ fontFamily: F }}>{formatCurrency(c.value)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          c.status === "Active" ? "bg-green-50 text-green-600" :
                          c.status === "Closed" ? "bg-slate-100 text-slate-600" :
                          c.status === "Terminated" ? "bg-red-50 text-red-600" :
                          "bg-blue-50 text-blue-600"
                        }`}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td colSpan={4} className="px-4 py-3 text-[12px] font-semibold text-slate-700" style={{ fontFamily: F }}>Total</td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-slate-900 text-right" style={{ fontFamily: F }}>{formatCurrency(contractValue)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        )}

        {/* ────────────── DOCUMENTS TAB ────────────── */}
        {activeSection === "documents" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: F }}>Onboarding &amp; Compliance Documents</h2>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  {vendor.documents.length} of {checklist.length} checklist items on file · renewal reminders are raised automatically
                </p>
              </div>
              <button
                onClick={() => setDocUpload({ label: flags.missingDocs[0] ?? checklist[0], customLabel: "", expiry: "" })}
                disabled={!canUploadDocs}
                title={canUploadDocs ? undefined : denialReason("vendor.create")}
                className="px-3.5 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                <Paperclip size={14} /> Upload / Renew Document
              </button>
            </div>

            {vendor.documents.length > 0 ? (
              <div className="space-y-2">
                {vendor.documents.map((doc, i) => {
                  const expiry = vendor.documentExpiry[doc];
                  const isExpired = flags.expiredDocs.includes(doc);
                  const expiringEntry = flags.expiringDocs.find(d => d.doc === doc);
                  return (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                      isExpired ? "bg-red-50 border-red-200" : expiringEntry ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isExpired ? "bg-red-100" : expiringEntry ? "bg-amber-100" : "bg-green-100"
                        }`}>
                          {isExpired ? <XCircle size={14} className="text-red-600" /> :
                           expiringEntry ? <Clock size={14} className="text-amber-600" /> :
                           <CheckCircle2 size={14} className="text-green-600" />}
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{doc}</p>
                          <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                            {isExpired ? <span className="text-red-500 font-medium">Expired {expiry}</span> :
                             expiringEntry ? <span className="text-amber-600 font-medium">Expiring {expiry} · {expiringEntry.daysLeft} days left</span> :
                             expiry ? `Expires ${expiry}` : "On file"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(isExpired || expiringEntry) && (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${isExpired ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                            {isExpired ? "EXPIRED" : "EXPIRING SOON"}
                          </span>
                        )}
                        <button
                          onClick={() => setDocUpload({ label: doc, customLabel: "", expiry: expiry ?? "" })}
                          disabled={!canUploadDocs}
                          title={canUploadDocs ? undefined : denialReason("vendor.create")}
                          className="text-[11px] text-purple-700 hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                          style={{ fontFamily: F }}>
                          Replace
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400 text-center py-8" style={{ fontFamily: F }}>No documents on record.</p>
            )}

            {flags.missingDocs.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} className="text-orange-500" />
                  <h3 className="text-[12px] font-semibold text-slate-800" style={{ fontFamily: F }}>Outstanding Checklist Items</h3>
                </div>
                <div className="space-y-2">
                  {flags.missingDocs.map(doc => (
                    <div key={doc} className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-orange-200 bg-orange-50">
                      <div className="flex items-center gap-2.5">
                        <FileText size={14} className="text-orange-500" />
                        <span className="text-[12px] text-slate-700" style={{ fontFamily: F }}>{doc}</span>
                      </div>
                      <button
                        onClick={() => setDocUpload({ label: doc, customLabel: "", expiry: "" })}
                        disabled={!canUploadDocs}
                        title={canUploadDocs ? undefined : denialReason("vendor.create")}
                        className="text-[11px] text-purple-700 hover:underline flex items-center gap-1 disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                        style={{ fontFamily: F }}>
                        <Paperclip size={12} /> Upload
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-orange-700 mt-3 flex items-center gap-1.5" style={{ fontFamily: F }}>
                  <Info size={12} /> Registration cannot be approved until every checklist item is on file.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         DOCUMENT UPLOAD MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {docUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Upload Document</h3>
                <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>{name} ({vendor.vendorId})</p>
              </div>
              <button onClick={() => setDocUpload(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Document *</label>
                <select
                  value={docUpload.label}
                  onChange={e => setDocUpload({ ...docUpload, label: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ fontFamily: F }}>
                  {Array.from(new Set([...checklist, ...vendor.documents])).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                  <option value="__other">Other (specify)</option>
                </select>
              </div>
              {docUpload.label === "__other" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Document Label *</label>
                  <input type="text" value={docUpload.customLabel} onChange={e => setDocUpload({ ...docUpload, customLabel: e.target.value })}
                    placeholder="e.g., Insurance Certificate"
                    className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ fontFamily: F }} />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Expiry Date</label>
                <input type="date" value={docUpload.expiry} onChange={e => setDocUpload({ ...docUpload, expiry: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ fontFamily: F }} />
                <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                  Renewal reminders are queued automatically 60 days before a statutory document lapses.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={() => setDocUpload(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 transition-colors" style={{ fontFamily: F }}>
                Cancel
              </button>
              <button onClick={handleDocumentUpload} disabled={uploadBusy}
                className="px-5 py-2 rounded-lg text-[12px] font-medium text-white transition-opacity hover:opacity-90 flex items-center gap-1.5 disabled:opacity-60"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                <Paperclip size={13} /> {uploadBusy ? "Waiting for file..." : "Choose File & Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         EVALUATION FORM MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showEvalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[720px] max-h-[92vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                  Vendor Performance Evaluation
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  {name} &middot; {vendor.vendorId} &middot; evaluator {user.name}
                </p>
              </div>
              <button onClick={() => { setShowEvalForm(false); setEvalSubmitted(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            {evalSubmitted ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900 mb-1" style={{ fontFamily: F }}>Evaluation Recorded</h3>
                <p className="text-[12px] text-slate-500" style={{ fontFamily: F }}>
                  Performance scores have been written to {name}'s profile and are now visible in Sourcing.
                </p>
              </div>
            ) : (
              <>
                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {/* Evaluation Type */}
                  <div className="mb-5">
                    <p className="text-[12px] font-semibold text-slate-700 mb-2" style={{ fontFamily: F }}>Evaluation Type</p>
                    <div className="flex gap-3">
                      {(["Contract Close-out", "Mid-Term Review"] as const).map(t => (
                        <button key={t} onClick={() => setEvalType(t)}
                          className={`px-4 py-2 rounded-lg text-[12px] border transition-colors ${
                            evalType === t ? "bg-purple-700 text-white border-purple-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`} style={{ fontFamily: F }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contract reference */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contract Number</label>
                      <input list="vendor-contract-numbers" type="text" value={evalContractNumber} onChange={e => {
                        const value = e.target.value;
                        setEvalContractNumber(value);
                        const match = contracts.find(c => c.contractNumber === value);
                        if (match) setEvalContractTitle(match.title);
                      }}
                        placeholder="e.g., CNT-2025-003"
                        className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ fontFamily: F }} />
                      <datalist id="vendor-contract-numbers">
                        {contracts.map(c => <option key={c.contractNumber} value={c.contractNumber} />)}
                      </datalist>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contract Title</label>
                      <input type="text" value={evalContractTitle} onChange={e => setEvalContractTitle(e.target.value)}
                        placeholder="Assignment or contract title"
                        className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ fontFamily: F }} />
                    </div>
                  </div>

                  {/* Criteria Sections */}
                  <div className="space-y-5">
                    {CRITERIA.map((c, ci) => {
                      const val = evalScores[c.key];
                      const needsComment = val < 4;
                      const hasError = evalErrors[c.key];
                      return (
                        <div key={c.key} className={`rounded-xl border p-5 ${hasError ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-white"}`}>
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <p className="text-[13px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                                {ci + 1}. {c.label}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>{c.desc}</p>
                            </div>
                            <div className={`text-[20px] font-semibold px-3 py-0.5 rounded-lg ${
                              val >= 8 ? "bg-green-100 text-green-700" :
                              val >= 6 ? "bg-amber-100 text-amber-700" :
                              val >= 4 ? "bg-orange-100 text-orange-700" :
                              "bg-red-100 text-red-700"
                            }`} style={{ fontFamily: F }}>
                              {val}
                            </div>
                          </div>

                          {/* Slider */}
                          <div className="mt-3 mb-1">
                            <input
                              type="range"
                              min={1} max={10} step={1}
                              value={val}
                              onChange={e => setScore(c.key, parseInt(e.target.value))}
                              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-700"
                              style={{
                                background: `linear-gradient(to right, ${val >= 8 ? '#22c55e' : val >= 6 ? '#f59e0b' : val >= 4 ? '#f97316' : '#ef4444'} 0%, ${val >= 8 ? '#22c55e' : val >= 6 ? '#f59e0b' : val >= 4 ? '#f97316' : '#ef4444'} ${(val - 1) * 11.11}%, #e2e8f0 ${(val - 1) * 11.11}%, #e2e8f0 100%)`,
                              }}
                            />
                            <div className="flex justify-between mt-1 px-0.5">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <button
                                  key={n}
                                  onClick={() => setScore(c.key, n)}
                                  className={`w-6 h-5 rounded text-[9px] font-medium transition-colors ${
                                    n === val
                                      ? "bg-purple-700 text-white"
                                      : n < 4 ? "text-red-400 hover:bg-red-50" : n < 6 ? "text-orange-400 hover:bg-orange-50" : n < 8 ? "text-amber-400 hover:bg-amber-50" : "text-green-400 hover:bg-green-50"
                                  }`}
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Mandatory comment if score < 4 */}
                          {needsComment && (
                            <div className="mt-3">
                              <div className="flex items-center gap-1 mb-1.5">
                                <AlertTriangle size={12} className="text-red-500" />
                                <span className="text-[11px] text-red-600 font-medium" style={{ fontFamily: F }}>
                                  Score below 4 — comments are mandatory
                                </span>
                              </div>
                              <textarea
                                value={evalComments[c.key]}
                                onChange={e => setEvalComments(prev => ({ ...prev, [c.key]: e.target.value }))}
                                rows={2}
                                placeholder={`Explain the reason for the low ${c.label.toLowerCase()} score...`}
                                className={`w-full border rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none ${
                                  hasError ? "border-red-400 focus:border-red-500 bg-red-50" : "border-slate-200 focus:border-purple-400"
                                }`}
                                style={{ fontFamily: F }}
                              />
                              {hasError && (
                                <p className="text-[10px] text-red-500 mt-1" style={{ fontFamily: F }}>
                                  Comments are required for scores below 4.
                                </p>
                              )}
                            </div>
                          )}

                          {/* Optional comment for score >= 4 */}
                          {!needsComment && (
                            <div className="mt-3">
                              <textarea
                                value={evalComments[c.key]}
                                onChange={e => setEvalComments(prev => ({ ...prev, [c.key]: e.target.value }))}
                                rows={1}
                                placeholder="Additional comments (optional)..."
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:border-purple-400"
                                style={{ fontFamily: F }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* General Comments */}
                  <div className="mt-5">
                    <p className="text-[12px] font-semibold text-slate-700 mb-2" style={{ fontFamily: F }}>General Comments &amp; Recommendations</p>
                    <textarea
                      value={evalGeneralComment}
                      onChange={e => setEvalGeneralComment(e.target.value)}
                      rows={3}
                      placeholder="Overall assessment, recommended follow-up actions, suitability for future contracts..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:border-purple-400"
                      style={{ fontFamily: F }}
                    />
                  </div>

                  {localAvg(evalScores) < 5 && (
                    <div className="mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-[11px] text-amber-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                        <AlertTriangle size={12} /> An overall score below 5 automatically flags this vendor — future shortlisting will require Senior Management approval.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Calculated Average:</span>
                    <span className={`text-[14px] font-semibold ${scoreColor(localAvg(evalScores))}`} style={{ fontFamily: F }}>
                      {localAvg(evalScores)}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowEvalForm(false)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 transition-colors"
                      style={{ fontFamily: F }}>
                      Cancel
                    </button>
                    <button onClick={handleEvalSubmit}
                      disabled={!canEvaluate}
                      title={canEvaluate ? undefined : denialReason("contract.evaluatePerformance")}
                      className="px-5 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                      Submit Evaluation
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         STATUS ACTION MODAL (Flag / Suspend / Blacklist / Reactivate)
         ══════════════════════════════════════════════════════════════════════ */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden">
            {/* Header */}
            <div className={`px-6 py-4 border-b ${
              showActionModal === "Reactivate" || showActionModal === "Approve Reactivation" ? "border-green-200 bg-green-50" :
              showActionModal === "Flag" ? "border-amber-200 bg-amber-50" :
              showActionModal === "Suspend" ? "border-red-200 bg-red-50" :
              "border-slate-300 bg-slate-100"
            }`}>
              <div className="flex items-center gap-3">
                {showActionModal === "Flag" && <AlertTriangle size={20} className="text-amber-600" />}
                {showActionModal === "Suspend" && <ShieldAlert size={20} className="text-red-600" />}
                {showActionModal === "Blacklist" && <ShieldBan size={20} className="text-slate-700" />}
                {(showActionModal === "Reactivate" || showActionModal === "Approve Reactivation") && <ShieldCheck size={20} className="text-green-600" />}
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                    {showActionModal} Vendor
                  </h3>
                  <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>
                    {name} ({vendor.vendorId})
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-[12px] text-slate-600 mb-1" style={{ fontFamily: F }}>
                {showActionModal === "Flag" && "Flagging this vendor will mark them for review. They will remain in the register but shortlisting will require Senior Management approval."}
                {showActionModal === "Suspend" && "Suspending this vendor will immediately restrict them from participating in any active sourcing. This action can be reversed."}
                {showActionModal === "Blacklist" && "Blacklisting permanently restricts this vendor from all procurement activities. This is a severe action typically reserved for fraud or gross misconduct."}
                {showActionModal === "Reactivate" && "Reactivation requires management approval. Submitting will set the vendor status to Pending Reactivation. The vendor will not be eligible for sourcing until management approves."}
                {showActionModal === "Approve Reactivation" && "Approving returns this vendor to Active status and restores their eligibility for solicitation and award."}
              </p>

              {showActionModal !== "Approve Reactivation" && (
                <div className="mt-4">
                  <label className="text-[12px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1" style={{ fontFamily: F }}>
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={e => { setActionReason(e.target.value); if (e.target.value.trim()) setActionReasonError(false); }}
                    rows={3}
                    placeholder={
                      showActionModal === "Flag" ? "e.g., Repeated late deliveries on CNT-2025-014..." :
                      showActionModal === "Suspend" ? "e.g., Under investigation for invoice irregularities..." :
                      showActionModal === "Blacklist" ? "e.g., Confirmed fraudulent documentation submitted..." :
                      "e.g., Investigation concluded, vendor cleared of allegations..."
                    }
                    className={`w-full border rounded-lg px-3 py-2.5 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none ${
                      actionReasonError ? "border-red-400 bg-red-50 focus:border-red-500" : "border-slate-200 focus:border-purple-400"
                    }`}
                    style={{ fontFamily: F }}
                  />
                  {actionReasonError && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1" style={{ fontFamily: F }}>
                      <XCircle size={10} /> A reason is mandatory before updating vendor status.
                    </p>
                  )}
                </div>
              )}

              {showActionModal === "Blacklist" && (
                <div className="mt-3 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-[11px] text-red-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                    <AlertTriangle size={12} /> This action is difficult to reverse and will be audited. Ensure compliance review is complete.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowActionModal(null); setActionReason(""); setActionReasonError(false); }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ fontFamily: F }}>
                Cancel
              </button>
              <button
                onClick={handleActionConfirm}
                className={`px-5 py-2 rounded-lg text-[12px] font-medium text-white transition-opacity hover:opacity-90 ${
                  showActionModal === "Reactivate" || showActionModal === "Approve Reactivation" ? "bg-green-600" :
                  showActionModal === "Flag" ? "bg-amber-600" :
                  showActionModal === "Suspend" ? "bg-red-600" :
                  "bg-slate-700"
                }`}
                style={{ fontFamily: F }}>
                Confirm {showActionModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
