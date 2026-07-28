import { useEffect, useState } from "react";
import {
  Search, Download, ChevronDown, MoreHorizontal, Plus, X, Eye, Building2, User, Star,
  AlertTriangle, ShieldAlert, ShieldBan, ShieldCheck, FileText, Check, Paperclip,
  Users, Loader, Flag, TrendingUp, CalendarClock, Clock, Layers, CheckCircle2, XCircle,
  FileSpreadsheet, FileDown, Printer, Info, BadgeCheck, Trophy, Edit2,
} from "lucide-react";
import { SupplierDetailsView } from "./SupplierDetailsView";
import { ProcurementTabs, ProcurementTabBar, type ProcurementTab } from "./procurement/ProcurementTabs";
import { ProcurementStatCards } from "./procurement/ProcurementStatCards";
import {
  subscribe as subscribeSuppliers,
  getSuppliers, getSupplierStats, getPerformanceRanking, getSuppliersByCategory,
  getBlockedSuppliers, getSuppliersWithDocumentIssues, getSupplierFlags, hasSupplierWarning,
  avgScore, supplierDisplayName, supplierEmail, supplierAddress, peekNextSupplierId,
  registerSupplier, updateSupplier, approveSupplierRegistration, changeSupplierStatus,
  requestReactivation, approveReactivation,
  findPotentialDuplicates, isSanctioned,
  SUPPLIER_CATEGORIES, SUB_CATEGORIES, SUPPLIER_STATUSES,
  FIRM_DOC_CHECKLIST, INDIVIDUAL_DOC_CHECKLIST, EXPERT_AREAS_OPTIONS,
  type Supplier, type FirmSupplier, type IndividualSupplier,
  type SupplierType, type SupplierStatus, type RiskLevel, type SupplierFlags,
} from "../lib/supplierStore";
import {
  can, denialReason, getCurrentUser, hasRole, subscribe as subscribeUser,
} from "../lib/currentUser";
import { pickFiles, FileValidationError, type UploadedFile } from "../lib/fileUpload";
import { exportToCSV, exportToExcel, exportToPDF, type ExportColumn } from "../lib/exportUtils";

/* ══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "'Montserrat Variable', sans-serif";

const CATEGORY_FILTERS = ["All Categories", ...SUPPLIER_CATEGORIES];
const STATUS_FILTERS: string[] = ["All Statuses", ...SUPPLIER_STATUSES];

type TabKey = "firms" | "individuals" | "pending" | "performance" | "blocked" | "expiring";
type StatusAction = "Flag" | "Suspend" | "Blacklist" | "Reactivate" | "Approve Reactivation";

/** Row shape handed to the export helpers — a type alias so it satisfies Record<string, unknown>. */
type SupplierExportRow = {
  supplierId: string;
  name: string;
  type: string;
  category: string;
  subCategory: string;
  contact: string;
  email: string;
  status: string;
  riskLevel: string;
  rating: string;
  totalOrders: number;
  totalSpend: number;
  bankValidated: string;
  outstandingDocuments: string;
  dateOnboarded: string;
};

const EXPORT_COLUMNS: ExportColumn<SupplierExportRow>[] = [
  { key: "supplierId", header: "Supplier ID" },
  { key: "name", header: "Name" },
  { key: "type", header: "Type" },
  { key: "category", header: "Category" },
  { key: "subCategory", header: "Sub-category" },
  { key: "contact", header: "Contact" },
  { key: "email", header: "Email" },
  { key: "status", header: "Status" },
  { key: "riskLevel", header: "Risk" },
  { key: "rating", header: "Rating" },
  { key: "totalOrders", header: "Orders" },
  { key: "totalSpend", header: "Total Spend (USD)" },
  { key: "bankValidated", header: "Banking Validated" },
  { key: "outstandingDocuments", header: "Outstanding Documents" },
  { key: "dateOnboarded", header: "Date Onboarded" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

function getStatusColor(s: SupplierStatus) {
  switch (s) {
    case "Active": return "bg-green-50 text-green-600";
    case "Pending Onboarding": return "bg-amber-50 text-amber-600";
    case "Flagged": return "bg-orange-50 text-orange-700";
    case "Blacklisted": return "bg-red-50 text-red-700";
    case "Suspended": return "bg-slate-100 text-slate-600";
    case "Pending Reactivation": return "bg-blue-50 text-blue-600";
  }
}

function getRiskColor(r: RiskLevel) {
  switch (r) {
    case "Low": return "bg-green-50 text-green-700";
    case "Medium": return "bg-amber-50 text-amber-700";
    case "High": return "bg-red-50 text-red-700";
  }
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

function ratingStars(score: number) {
  if (score === 0) return "—";
  return `${score}/10`;
}

/** Account numbers are never shown in full on a list view. */
function maskAccount(account: string) {
  const value = (account ?? "").trim();
  if (!value) return "—";
  if (value.startsWith("*") || value.startsWith("•")) return value;
  return `••••${value.slice(-4)}`;
}

/** Re-render whenever the supplier register or the signed-in user changes. */
function useStoreSubscription() {
  const [, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    const unsubSuppliers = subscribeSuppliers(bump);
    const unsubUser = subscribeUser(bump);
    return () => { unsubSuppliers(); unsubUser(); };
  }, []);
}

function toExportRow(v: Supplier): SupplierExportRow {
  const flags = getSupplierFlags(v);
  return {
    supplierId: v.supplierId,
    name: supplierDisplayName(v),
    type: v.type,
    category: v.category,
    subCategory: v.subCategory,
    contact: v.type === "Firm" ? v.contactPerson : v.legalName,
    email: supplierEmail(v),
    status: v.status,
    riskLevel: v.riskLevel,
    rating: avgScore(v.performance) > 0 ? `${avgScore(v.performance)}/10` : "Not rated",
    totalOrders: v.totalOrders,
    totalSpend: v.totalSpend,
    bankValidated: v.bankValidated ? `Yes${v.bankValidatedBy ? ` (${v.bankValidatedBy})` : ""}` : "No",
    outstandingDocuments: [...flags.missingDocs, ...flags.expiredDocs.map((d) => `${d} (expired)`)].join("; ") || "None",
    dateOnboarded: v.dateOnboarded,
  };
}

/** Inline duplicate / sanctions screening shown while a name is being typed. */
function NameScreening({ name, excludeId }: { name: string; excludeId?: string }) {
  const trimmed = name.trim();
  if (trimmed.length < 3) return null;
  const duplicates = findPotentialDuplicates(trimmed, excludeId);
  const sanctioned = isSanctioned(trimmed);
  if (!sanctioned && duplicates.length === 0) {
    return (
      <p className="text-[10px] text-green-600 flex items-center gap-1" style={{ fontFamily: F }}>
        <CheckCircle2 size={11} /> No duplicate record or sanctions match found.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      {sanctioned && (
        <p className="text-[10px] text-red-600 flex items-start gap-1" style={{ fontFamily: F }}>
          <ShieldBan size={11} className="mt-px shrink-0" />
          Sanctions match — this name appears on a donor/statutory debarment list. Registration will be escalated.
        </p>
      )}
      {duplicates.length > 0 && (
        <p className="text-[10px] text-amber-600 flex items-start gap-1" style={{ fontFamily: F }}>
          <AlertTriangle size={11} className="mt-px shrink-0" />
          Possible duplicate of {duplicates.map((d) => `${supplierDisplayName(d)} (${d.supplierId})`).join(", ")}.
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function Suppliers() {
  useStoreSubscription();
  const user = getCurrentUser();

  const canCreate = can("supplier.create");
  const canApproveRegistration = can("supplier.approveRegistration");
  const canSuspend = can("supplier.suspend");
  const canApproveReactivation = can("supplier.approveReactivation");
  const canRequestReactivation = hasRole("Procurement") || canApproveReactivation;
  const canExport = can("report.export");

  const [activeTab, setActiveTab] = useState<TabKey>("firms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState<SupplierType | null>(null);
  const [notice, setNotice] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  // Detail view
  const [detailSupplierId, setDetailSupplierId] = useState<string | null>(null);

  // Onboard form states — Firm
  const [firmForm, setFirmForm] = useState({
    legalBusinessName: "", registrationNumber: "", taxId: "", registeredAddress: "",
    contactPerson: "", email: "", phone: "",
    bankName: "", bankAccountNumber: "",
    category: "", subCategory: "", ownershipDetails: "",
  });
  const [firmSpecializations, setFirmSpecializations] = useState<string[]>([]);
  const [specializationDraft, setSpecializationDraft] = useState("");
  const [firmDocFiles, setFirmDocFiles] = useState<Record<string, UploadedFile>>({});
  const [firmDocExpiry, setFirmDocExpiry] = useState<Record<string, string>>({});

  // Onboard form states — Individual
  const [indForm, setIndForm] = useState({
    legalName: "", contactEmail: "", contactPhone: "",
    idType: "Passport" as "Passport" | "National ID" | "Driver's License",
    idNumber: "", residentialAddress: "",
    bankName: "", bankAccountNumber: "",
    category: "", subCategory: "",
  });
  const [indExpertAreas, setIndExpertAreas] = useState<string[]>([]);
  const [showExpertDropdown, setShowExpertDropdown] = useState(false);
  const [indDocFiles, setIndDocFiles] = useState<Record<string, UploadedFile>>({});
  const [indDocExpiry, setIndDocExpiry] = useState<Record<string, string>>({});

  const [formError, setFormError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [onboardResult, setOnboardResult] = useState<{ supplier: Supplier; flags: SupplierFlags } | null>(null);

  const [formCategoryDropdown, setFormCategoryDropdown] = useState(false);
  const [formSubCategoryDropdown, setFormSubCategoryDropdown] = useState(false);

  // Status action modal (Flag / Suspend / Blacklist / Reactivate)
  const [statusAction, setStatusAction] = useState<{ supplier: Supplier; action: StatusAction } | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionReasonError, setActionReasonError] = useState(false);

  // Edit modal
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [editForm, setEditForm] = useState({
    contactPerson: "", email: "", phone: "", address: "",
    bankName: "", bankAccountNumber: "", category: "", subCategory: "", ownershipDetails: "",
  });
  const [editSpecializations, setEditSpecializations] = useState<string[]>([]);
  const [editSpecDraft, setEditSpecDraft] = useState("");
  const [editExpertAreas, setEditExpertAreas] = useState<string[]>([]);
  const [editExpertDropdown, setEditExpertDropdown] = useState(false);
  const [editCategoryDropdown, setEditCategoryDropdown] = useState(false);
  const [editSubCategoryDropdown, setEditSubCategoryDropdown] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // ── Store reads ────────────────────────────────────────────────────────────
  const suppliers = getSuppliers();
  const stats = getSupplierStats();
  const ranking = getPerformanceRanking();
  const categoryBreakdown = getSuppliersByCategory();
  const blockedSuppliers = getBlockedSuppliers();
  const documentIssues = getSuppliersWithDocumentIssues();
  const pendingQueue = suppliers.filter((v) => v.pendingReview === true || v.status === "Pending Onboarding");

  // ── Filtering ──────────────────────────────────────────────────────────────
  const matchesFilters = (v: Supplier) => {
    const q = searchQuery.trim().toLowerCase();
    const haystack = [
      supplierDisplayName(v), v.supplierId, supplierEmail(v),
      v.type === "Firm" ? v.contactPerson : v.idNumber,
    ].join(" ").toLowerCase();
    const matchesSearch = !q || haystack.includes(q);
    const matchesCat = selectedCategory === "All Categories" || v.category === selectedCategory;
    const matchesStat = selectedStatus === "All Statuses" || v.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStat;
  };

  const firms = suppliers.filter((v): v is FirmSupplier => v.type === "Firm");
  const individuals = suppliers.filter((v): v is IndividualSupplier => v.type === "Individual");
  const filteredFirms = firms.filter(matchesFilters);
  const filteredIndividuals = individuals.filter(matchesFilters);

  /** The list the export buttons act on — always what the current tab is showing. */
  const visibleSuppliers: Supplier[] =
    activeTab === "firms" ? filteredFirms
      : activeTab === "individuals" ? filteredIndividuals
        : activeTab === "pending" ? pendingQueue
          : activeTab === "blocked" ? blockedSuppliers
            : activeTab === "expiring" ? documentIssues.map((d) => d.supplier)
              : ranking.map((r) => r.supplier);

  const exportTitle =
    activeTab === "firms" ? "Supplier Register — Firms"
      : activeTab === "individuals" ? "Supplier Register — Individual Consultants"
        : activeTab === "pending" ? "Supplier Registrations Pending Review"
          : activeTab === "blocked" ? "Blocked & Restricted Suppliers"
            : activeTab === "expiring" ? "Suppliers with Document Issues"
              : "Supplier Performance Ranking";

  const exportSubtitle = [
    selectedCategory !== "All Categories" ? `Category: ${selectedCategory}` : null,
    selectedStatus !== "All Statuses" ? `Status: ${selectedStatus}` : null,
    searchQuery.trim() ? `Search: "${searchQuery.trim()}"` : null,
  ].filter(Boolean).join(" · ") || "All records";

  const runExport = (format: "excel" | "pdf" | "csv") => {
    setShowExportDropdown(false);
    const rows = visibleSuppliers.map(toExportRow);
    const meta = { subtitle: exportSubtitle, generatedBy: user.name };
    if (format === "excel") exportToExcel(exportTitle, EXPORT_COLUMNS, rows, meta);
    else if (format === "pdf") exportToPDF(exportTitle, EXPORT_COLUMNS, rows, { ...meta, orientation: "landscape" });
    else exportToCSV(exportTitle, EXPORT_COLUMNS, rows);
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  const openStatusAction = (supplier: Supplier, action: StatusAction) => {
    setOpenActionMenuId(null);
    setActionReason("");
    setActionReasonError(false);
    setStatusAction({ supplier, action });
  };

  const confirmStatusAction = () => {
    if (!statusAction) return;
    const { supplier, action } = statusAction;
    const actor = getCurrentUser();

    if (action === "Approve Reactivation") {
      approveReactivation(supplier.id, actor.name);
      setNotice({ tone: "success", text: `${supplierDisplayName(supplier)} reactivated and returned to the approved supplier list.` });
      setStatusAction(null);
      return;
    }

    if (!actionReason.trim()) {
      setActionReasonError(true);
      return;
    }

    if (action === "Reactivate") {
      requestReactivation(supplier.id, actionReason.trim(), actor.name);
      setNotice({ tone: "success", text: `Reactivation requested for ${supplierDisplayName(supplier)} — awaiting Senior Management approval.` });
    } else {
      const target: SupplierStatus = action === "Flag" ? "Flagged" : action === "Suspend" ? "Suspended" : "Blacklisted";
      // A Senior Management actor is both the performer and the approver of record.
      const approver = canApproveReactivation ? actor.name : undefined;
      changeSupplierStatus(supplier.id, target, actionReason.trim(), actor.name, approver);
      setNotice({ tone: "success", text: `${supplierDisplayName(supplier)} is now ${target}.` });
    }

    setStatusAction(null);
    setActionReason("");
    setActionReasonError(false);
  };

  const handleApproveRegistration = (supplier: Supplier) => {
    setOpenActionMenuId(null);
    const approved = approveSupplierRegistration(supplier.id, getCurrentUser().name);
    if (!approved) {
      const missing = getSupplierFlags(supplier).missingDocs;
      setNotice({
        tone: "error",
        text: `${supplierDisplayName(supplier)} cannot be approved yet — outstanding documents: ${missing.join(", ")}.`,
      });
      return;
    }
    setNotice({ tone: "success", text: `${supplierDisplayName(approved)} approved and added to the active supplier list.` });
  };

  const openEdit = (v: Supplier) => {
    setOpenActionMenuId(null);
    setEditError(null);
    setEditSupplier(v);
    setEditForm({
      contactPerson: v.type === "Firm" ? v.contactPerson : v.legalName,
      email: supplierEmail(v),
      phone: v.type === "Firm" ? v.phone : v.contactPhone,
      address: supplierAddress(v),
      bankName: v.bankName,
      bankAccountNumber: v.bankAccountNumber,
      category: v.category,
      subCategory: v.subCategory,
      ownershipDetails: v.type === "Firm" ? v.ownershipDetails ?? "" : "",
    });
    setEditSpecializations(v.type === "Firm" ? v.specialization ?? [] : []);
    setEditExpertAreas(v.type === "Individual" ? v.expertAreas : []);
    setEditSpecDraft("");
    setEditCategoryDropdown(false);
    setEditSubCategoryDropdown(false);
    setEditExpertDropdown(false);
  };

  const saveEdit = () => {
    if (!editSupplier) return;
    const required: [string, string][] = [
      ["Email", editForm.email],
      ["Phone", editForm.phone],
      ["Address", editForm.address],
      ["Bank name", editForm.bankName],
      ["Account number", editForm.bankAccountNumber],
      ["Category", editForm.category],
    ];
    if (editSupplier.type === "Firm") required.unshift(["Contact person", editForm.contactPerson]);
    const missing = required.filter(([, value]) => !value.trim()).map(([label]) => label);
    if (missing.length > 0) {
      setEditError(`Complete the required fields: ${missing.join(", ")}.`);
      return;
    }

    // A changed account number invalidates the Finance confirmation on file.
    const accountChanged = editForm.bankAccountNumber.trim() !== editSupplier.bankAccountNumber;
    const bankingReset = accountChanged ? { bankValidated: false, bankValidatedBy: undefined } : {};

    if (editSupplier.type === "Firm") {
      updateSupplier(editSupplier.id, {
        contactPerson: editForm.contactPerson.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        registeredAddress: editForm.address.trim(),
        bankName: editForm.bankName.trim(),
        bankAccountNumber: editForm.bankAccountNumber.trim(),
        category: editForm.category,
        subCategory: editForm.subCategory,
        ownershipDetails: editForm.ownershipDetails.trim() || undefined,
        specialization: editSpecializations,
        ...bankingReset,
      }, getCurrentUser().name);
    } else {
      updateSupplier(editSupplier.id, {
        contactEmail: editForm.email.trim(),
        contactPhone: editForm.phone.trim(),
        residentialAddress: editForm.address.trim(),
        bankName: editForm.bankName.trim(),
        bankAccountNumber: editForm.bankAccountNumber.trim(),
        category: editForm.category,
        subCategory: editForm.subCategory,
        expertAreas: editExpertAreas,
        ...bankingReset,
      }, getCurrentUser().name);
    }

    setNotice({
      tone: "success",
      text: `${supplierDisplayName(editSupplier)} updated.${accountChanged ? " Banking details must be re-validated by Finance." : ""}`,
    });
    setEditSupplier(null);
    setEditError(null);
  };

  const handlePickDoc = async (kind: "firm" | "individual", doc: string) => {
    setUploadError(null);
    try {
      const files = await pickFiles({ multiple: false, uploadedBy: getCurrentUser().name });
      if (files.length === 0) return;
      if (kind === "firm") setFirmDocFiles((prev) => ({ ...prev, [doc]: files[0] }));
      else setIndDocFiles((prev) => ({ ...prev, [doc]: files[0] }));
    } catch (err) {
      setUploadError(err instanceof FileValidationError ? err.message : "The file could not be attached. Try again.");
    }
  };

  const removeDoc = (kind: "firm" | "individual", doc: string) => {
    const drop = (prev: Record<string, UploadedFile>) => {
      const next = { ...prev };
      delete next[doc];
      return next;
    };
    if (kind === "firm") setFirmDocFiles(drop);
    else setIndDocFiles(drop);
  };

  const collectDocs = (files: Record<string, UploadedFile>, expiry: Record<string, string>) => {
    const documents = Object.keys(files);
    const documentExpiry: Record<string, string> = {};
    documents.forEach((d) => { if (expiry[d]) documentExpiry[d] = expiry[d]; });
    return { documents, documentExpiry };
  };

  const handleCompleteOnboarding = () => {
    const actor = getCurrentUser();
    setFormError(null);

    if (showOnboardModal === "Firm") {
      const required: [string, string][] = [
        ["Legal business name", firmForm.legalBusinessName],
        ["Registration number", firmForm.registrationNumber],
        ["Tax ID", firmForm.taxId],
        ["Registered address", firmForm.registeredAddress],
        ["Contact person", firmForm.contactPerson],
        ["Email", firmForm.email],
        ["Phone", firmForm.phone],
        ["Bank name", firmForm.bankName],
        ["Account number", firmForm.bankAccountNumber],
        ["Category", firmForm.category],
      ];
      const missing = required.filter(([, value]) => !value.trim()).map(([label]) => label);
      if (missing.length > 0) {
        setFormError(`Complete the required fields: ${missing.join(", ")}.`);
        return;
      }
      const { documents, documentExpiry } = collectDocs(firmDocFiles, firmDocExpiry);
      const result = registerSupplier("Firm", {
        legalBusinessName: firmForm.legalBusinessName.trim(),
        registrationNumber: firmForm.registrationNumber.trim(),
        taxId: firmForm.taxId.trim(),
        registeredAddress: firmForm.registeredAddress.trim(),
        contactPerson: firmForm.contactPerson.trim(),
        email: firmForm.email.trim(),
        phone: firmForm.phone.trim(),
        bankName: firmForm.bankName.trim(),
        bankAccountNumber: firmForm.bankAccountNumber.trim(),
        category: firmForm.category,
        subCategory: firmForm.subCategory,
        ownershipDetails: firmForm.ownershipDetails.trim() || undefined,
        specialization: firmSpecializations.length > 0 ? firmSpecializations : undefined,
        documents,
        documentExpiry,
      }, { registeredBy: actor.name, source: "Internal" });
      setOnboardResult(result);
      return;
    }

    const required: [string, string][] = [
      ["Legal name", indForm.legalName],
      ["Email", indForm.contactEmail],
      ["Phone", indForm.contactPhone],
      ["ID number", indForm.idNumber],
      ["Residential address", indForm.residentialAddress],
      ["Bank name", indForm.bankName],
      ["Account number", indForm.bankAccountNumber],
      ["Category", indForm.category],
    ];
    const missing = required.filter(([, value]) => !value.trim()).map(([label]) => label);
    if (missing.length > 0) {
      setFormError(`Complete the required fields: ${missing.join(", ")}.`);
      return;
    }
    if (indExpertAreas.length === 0) {
      setFormError("Select at least one expert area for an individual consultant.");
      return;
    }
    const { documents, documentExpiry } = collectDocs(indDocFiles, indDocExpiry);
    const result = registerSupplier("Individual", {
      legalName: indForm.legalName.trim(),
      contactEmail: indForm.contactEmail.trim(),
      contactPhone: indForm.contactPhone.trim(),
      idType: indForm.idType,
      idNumber: indForm.idNumber.trim(),
      residentialAddress: indForm.residentialAddress.trim(),
      bankName: indForm.bankName.trim(),
      bankAccountNumber: indForm.bankAccountNumber.trim(),
      category: indForm.category,
      subCategory: indForm.subCategory,
      expertAreas: indExpertAreas,
      historicalRates: [],
      documents,
      documentExpiry,
    }, { registeredBy: actor.name, source: "Internal" });
    setOnboardResult(result);
  };

  const resetForms = () => {
    setFirmForm({
      legalBusinessName: "", registrationNumber: "", taxId: "", registeredAddress: "",
      contactPerson: "", email: "", phone: "", bankName: "", bankAccountNumber: "",
      category: "", subCategory: "", ownershipDetails: "",
    });
    setIndForm({
      legalName: "", contactEmail: "", contactPhone: "", idType: "Passport",
      idNumber: "", residentialAddress: "", bankName: "", bankAccountNumber: "",
      category: "", subCategory: "",
    });
    setFirmSpecializations([]);
    setSpecializationDraft("");
    setFirmDocFiles({});
    setIndDocFiles({});
    setIndExpertAreas([]);
    setFirmDocExpiry({});
    setIndDocExpiry({});
    setFormCategoryDropdown(false);
    setFormSubCategoryDropdown(false);
    setFormError(null);
    setUploadError(null);
    setOnboardResult(null);
  };

  const closeOnboarding = () => { setShowOnboardModal(null); resetForms(); };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (detailSupplierId) {
    return <SupplierDetailsView supplierId={detailSupplierId} onBack={() => setDetailSupplierId(null)} />;
  }

  const tabs: ProcurementTab<TabKey>[] = [
    { key: "firms", label: "Firms", count: firms.length },
    { key: "individuals", label: "Individual Consultants", count: individuals.length },
  ];

  const showFilters = activeTab === "firms" || activeTab === "individuals";

  /** Row action menu shared by the firms and individuals tables. */
  const renderActionMenu = (v: Supplier) => (
    <div className="relative">
      <button onClick={() => setOpenActionMenuId(openActionMenuId === v.id ? null : v.id)} className="inline-flex items-center justify-center w-8 h-8 hover:bg-slate-100 rounded transition-colors">
        <MoreHorizontal size={16} className="text-slate-600" />
      </button>
      {openActionMenuId === v.id && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
          <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
            <button onClick={() => { setDetailSupplierId(v.id); setOpenActionMenuId(null); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><Eye size={13} /> View Details</button>

            <button
              disabled={!canCreate}
              title={canCreate ? undefined : denialReason("supplier.create")}
              onClick={() => openEdit(v)}
              className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              style={{ fontFamily: F }}><Edit2 size={13} /> Edit Supplier</button>

            {(v.status === "Pending Onboarding" || v.pendingReview) && (
              <button
                disabled={!canApproveRegistration}
                title={canApproveRegistration ? undefined : denialReason("supplier.approveRegistration")}
                onClick={() => handleApproveRegistration(v)}
                className="w-full px-3 py-2 text-left text-[12px] text-green-700 hover:bg-green-50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{ fontFamily: F }}><BadgeCheck size={13} /> Approve Registration</button>
            )}

            {v.status === "Active" && (
              <button
                disabled={!canSuspend}
                title={canSuspend ? undefined : denialReason("supplier.suspend")}
                onClick={() => openStatusAction(v, "Flag")}
                className="w-full px-3 py-2 text-left text-[12px] text-amber-700 hover:bg-amber-50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{ fontFamily: F }}><AlertTriangle size={13} /> Flag Supplier</button>
            )}

            {(v.status === "Active" || v.status === "Flagged") && (
              <button
                disabled={!canSuspend}
                title={canSuspend ? undefined : denialReason("supplier.suspend")}
                onClick={() => openStatusAction(v, "Suspend")}
                className="w-full px-3 py-2 text-left text-[12px] text-slate-600 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{ fontFamily: F }}><ShieldAlert size={13} /> Suspend</button>
            )}

            {(v.status === "Active" || v.status === "Flagged" || v.status === "Suspended") && (
              <button
                disabled={!canSuspend}
                title={canSuspend ? undefined : denialReason("supplier.suspend")}
                onClick={() => openStatusAction(v, "Blacklist")}
                className="w-full px-3 py-2 text-left text-[12px] text-red-700 hover:bg-red-50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{ fontFamily: F }}><ShieldBan size={13} /> Blacklist</button>
            )}

            {(v.status === "Suspended" || v.status === "Flagged" || v.status === "Blacklisted") && (
              <button
                disabled={!canRequestReactivation}
                title={canRequestReactivation ? undefined : "Requires Procurement or Senior Management role."}
                onClick={() => openStatusAction(v, "Reactivate")}
                className="w-full px-3 py-2 text-left text-[12px] text-green-700 hover:bg-green-50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{ fontFamily: F }}><ShieldCheck size={13} /> Request Reactivation</button>
            )}

            {v.status === "Pending Reactivation" && (
              <button
                disabled={!canApproveReactivation}
                title={canApproveReactivation ? undefined : denialReason("supplier.approveReactivation")}
                onClick={() => openStatusAction(v, "Approve Reactivation")}
                className="w-full px-3 py-2 text-left text-[12px] text-green-700 hover:bg-green-50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{ fontFamily: F }}><ShieldCheck size={13} /> Approve Reactivation</button>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: F }}>Supplier Management</h1>
          <p className="text-[12px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
            Supplier registration, onboarding, categorization &amp; performance
            <span className="text-slate-400"> &middot; signed in as {user.name} ({user.roles.join(", ")})</span>
          </p>
        </div>
        <button
          onClick={() => { resetForms(); setShowOnboardModal(activeTab === "individuals" ? "Individual" : "Firm"); }}
          disabled={!canCreate}
          title={canCreate ? undefined : denialReason("supplier.create")}
          className="px-4 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#0B01D0", fontFamily: F }}
        >
          <Plus size={14} />
          Onboard {activeTab === "individuals" ? "Individual" : "Firm"}
        </button>
      </div>

      {/* ── Dashboard Summary Cards ── */}
      <ProcurementStatCards
        stats={[
          { label: "Active Suppliers", value: stats.active, icon: <Users size={14} />, tone: "success" },
          { label: "Pending Onboarding", value: stats.pending, icon: <Loader size={14} />, tone: "warning" },
          { label: "Flagged / Suspended", value: stats.flagged, icon: <Flag size={14} />, tone: "danger" },
          { label: "Expiring Documents", value: stats.expiring, icon: <CalendarClock size={14} />, tone: "warning" },
          {
            label: "Avg Performance",
            value: stats.avgPerformance > 0 ? `${stats.avgPerformance}/10` : "N/A",
            icon: <TrendingUp size={14} />,
            tone: "accent",
          },
        ]}
      />

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-[280px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by name, ID, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!showFilters}
              className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              style={{ fontFamily: F }}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Export */}
            <div className="relative">
              <button
                onClick={() => { setShowExportDropdown(!showExportDropdown); setShowCategoryDropdown(false); setShowStatusDropdown(false); }}
                disabled={!canExport}
                title={canExport ? undefined : denialReason("report.export")}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm text-[12px] text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: F }}>
                Export <Download size={14} className="text-purple-700" />
              </button>
              {showExportDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    <p className="px-3 py-2 text-[10px] text-slate-400 border-b border-slate-100" style={{ fontFamily: F }}>
                      {visibleSuppliers.length} record{visibleSuppliers.length === 1 ? "" : "s"} · {exportTitle}
                    </p>
                    <button onClick={() => runExport("excel")} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><FileSpreadsheet size={13} className="text-green-600" /> Export to Excel</button>
                    <button onClick={() => runExport("pdf")} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><Printer size={13} className="text-red-600" /> Export to PDF</button>
                    <button onClick={() => runExport("csv")} className="w-full px-3 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}><FileDown size={13} className="text-blue-600" /> Export to CSV</button>
                  </div>
                </>
              )}
            </div>
            {/* Category Filter */}
            <div className="relative">
              <button onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowStatusDropdown(false); setShowExportDropdown(false); }}
                disabled={!showFilters}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm text-[12px] text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                {selectedCategory} <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showCategoryDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {CATEGORY_FILTERS.map(c => (
                      <button key={c} onClick={() => { setSelectedCategory(c); setShowCategoryDropdown(false); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Status Filter */}
            <div className="relative">
              <button onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowCategoryDropdown(false); setShowExportDropdown(false); }}
                disabled={!showFilters}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm text-[12px] text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed" style={{ fontFamily: F }}>
                {selectedStatus} <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {STATUS_FILTERS.map(s => (
                      <button key={s} onClick={() => { setSelectedStatus(s); setShowStatusDropdown(false); }} className="w-full px-4 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{s}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
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

      {/* Tabs */}
      <ProcurementTabBar>
        <ProcurementTabs
          tabs={tabs}
          active={activeTab}
          onChange={(key) => { setActiveTab(key); setOpenActionMenuId(null); }}
        />
      </ProcurementTabBar>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto">
        {/* ───────── FIRMS ───────── */}
        {activeTab === "firms" && (
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Supplier ID</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Legal Business Name</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Registration #</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Tax ID</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Category</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Bank Account</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Risk</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Rating</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Total Spend</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Status</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFirms.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12 text-[13px] text-slate-400" style={{ fontFamily: F }}>No firms found.</td></tr>
              ) : filteredFirms.map((v, i) => (
                <tr key={v.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`} onClick={() => setDetailSupplierId(v.id)}>
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium" style={{ fontFamily: F }}>
                    <div className="flex items-center gap-1.5">
                      {v.supplierId}
                      {hasSupplierWarning(v) && <AlertTriangle size={12} className="text-amber-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>{v.legalBusinessName}</p>
                    <p className="text-[11px] text-slate-400" style={{ fontFamily: F }}>{v.contactPerson}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{v.registrationNumber}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{v.taxId}</td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{v.category}</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{v.subCategory}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{maskAccount(v.bankAccountNumber)}</p>
                    <p className={`text-[10px] ${v.bankValidated ? "text-green-600" : "text-amber-600"}`} style={{ fontFamily: F }}>
                      {v.bankValidated ? "Validated" : "Not validated"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRiskColor(v.riskLevel)}`}>{v.riskLevel}</span>
                  </td>
                  <td className="px-4 py-3">
                    {avgScore(v.performance) > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{ratingStars(avgScore(v.performance))}</span>
                      </div>
                    ) : <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>N/A</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>{formatCurrency(v.totalSpend)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(v.status)}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>{renderActionMenu(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ───────── INDIVIDUALS ───────── */}
        {activeTab === "individuals" && (
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Supplier ID</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Legal Name</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Contact</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>ID Type</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Expert Areas</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Bank Account</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Risk</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Rating</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Total Spend</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Status</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndividuals.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12 text-[13px] text-slate-400" style={{ fontFamily: F }}>No individual consultants found.</td></tr>
              ) : filteredIndividuals.map((v, i) => (
                <tr key={v.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`} onClick={() => setDetailSupplierId(v.id)}>
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium" style={{ fontFamily: F }}>
                    <div className="flex items-center gap-1.5">
                      {v.supplierId}
                      {hasSupplierWarning(v) && <AlertTriangle size={12} className="text-amber-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>{v.legalName}</td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{v.contactEmail}</p>
                    <p className="text-[11px] text-slate-400" style={{ fontFamily: F }}>{v.contactPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{v.idType}</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{v.idNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[190px]">
                      {v.expertAreas.slice(0, 2).map(area => (
                        <span key={area} className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px]" style={{ fontFamily: F }}>{area}</span>
                      ))}
                      {v.expertAreas.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]" style={{ fontFamily: F }}>+{v.expertAreas.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{maskAccount(v.bankAccountNumber)}</p>
                    <p className={`text-[10px] ${v.bankValidated ? "text-green-600" : "text-amber-600"}`} style={{ fontFamily: F }}>
                      {v.bankValidated ? "Validated" : "Not validated"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRiskColor(v.riskLevel)}`}>{v.riskLevel}</span>
                  </td>
                  <td className="px-4 py-3">
                    {avgScore(v.performance) > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{ratingStars(avgScore(v.performance))}</span>
                      </div>
                    ) : <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>N/A</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>{formatCurrency(v.totalSpend)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(v.status)}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>{renderActionMenu(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         ONBOARDING MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                  {onboardResult ? "Registration Recorded" : `Onboard ${showOnboardModal === "Firm" ? "Firm" : "Individual Consultant"}`}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  {onboardResult
                    ? <>Supplier ID <span className="font-medium text-purple-700">{onboardResult.supplier.supplierId}</span> · registered by {user.name}</>
                    : <>Generated Supplier ID: <span className="font-medium text-purple-700">{peekNextSupplierId(showOnboardModal)}</span></>}
                </p>
              </div>
              <button onClick={closeOnboarding} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {onboardResult ? (
                /* ── Screening result panel ── */
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      {onboardResult.supplier.type === "Firm" ? <Building2 size={18} /> : <User size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-slate-900" style={{ fontFamily: F }}>{supplierDisplayName(onboardResult.supplier)}</p>
                      <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>
                        {onboardResult.supplier.category}{onboardResult.supplier.subCategory ? ` — ${onboardResult.supplier.subCategory}` : ""} · {onboardResult.supplier.status}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRiskColor(onboardResult.supplier.riskLevel)}`}>
                      {onboardResult.supplier.riskLevel} risk
                    </span>
                  </div>

                  <p className="text-[12px] font-semibold text-slate-800" style={{ fontFamily: F }}>Screening Results</p>

                  {onboardResult.flags.sanctioned && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-[12px] font-semibold text-red-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                        <ShieldBan size={13} /> Sanctions list match
                      </p>
                      <p className="text-[11px] text-red-600 mt-1" style={{ fontFamily: F }}>
                        This name appears on a donor/statutory debarment list. The record has been created but must be escalated before approval.
                      </p>
                    </div>
                  )}

                  {onboardResult.flags.duplicates.length > 0 && (
                    <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-[12px] font-semibold text-amber-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                        <AlertTriangle size={13} /> Possible duplicate record
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {onboardResult.flags.duplicates.map(d => (
                          <li key={d.id} className="text-[11px] text-amber-700" style={{ fontFamily: F }}>
                            · {supplierDisplayName(d)} ({d.supplierId}) — {d.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {onboardResult.flags.missingDocs.length > 0 && (
                    <div className="px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-[12px] font-semibold text-orange-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                        <FileText size={13} /> Outstanding documents
                      </p>
                      <p className="text-[11px] text-orange-700 mt-1" style={{ fontFamily: F }}>
                        {onboardResult.flags.missingDocs.join(", ")} — the registration cannot be approved until these are on file.
                      </p>
                    </div>
                  )}

                  {!onboardResult.flags.sanctioned && onboardResult.flags.duplicates.length === 0 && onboardResult.flags.missingDocs.length === 0 && (
                    <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-[12px] font-semibold text-green-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                        <CheckCircle2 size={13} /> No screening exceptions
                      </p>
                      <p className="text-[11px] text-green-700 mt-1" style={{ fontFamily: F }}>
                        Duplicate and sanctions checks passed and the document checklist is complete.
                      </p>
                    </div>
                  )}

                  <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-[11px] text-slate-600 flex items-start gap-1.5" style={{ fontFamily: F }}>
                      <Info size={12} className="mt-px shrink-0" />
                      The supplier is recorded as <span className="font-medium">Pending Onboarding</span> and will not appear in sourcing until Procurement approves the registration. Banking details still require Finance validation.
                    </p>
                  </div>
                </div>
              ) : showOnboardModal === "Firm" ? (
                /* ── Firm Form ── */
                <div className="flex flex-col gap-5">
                  <p className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: F }}>Business Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Legal Business Name *</label>
                      <input type="text" value={firmForm.legalBusinessName} onChange={e => setFirmForm({ ...firmForm, legalBusinessName: e.target.value })} placeholder="e.g., PrintWorks Ghana Ltd" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                      <NameScreening name={firmForm.legalBusinessName} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Business Registration Number *</label>
                      <input type="text" value={firmForm.registrationNumber} onChange={e => setFirmForm({ ...firmForm, registrationNumber: e.target.value })} placeholder="e.g., CS-2021-12345" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Tax ID (TIN) *</label>
                      <input type="text" value={firmForm.taxId} onChange={e => setFirmForm({ ...firmForm, taxId: e.target.value })} placeholder="e.g., TIN-GH-1234567" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Registered Address *</label>
                      <input type="text" value={firmForm.registeredAddress} onChange={e => setFirmForm({ ...firmForm, registeredAddress: e.target.value })} placeholder="e.g., 14 Independence Ave, Accra" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Ownership &amp; Beneficial Ownership</label>
                      <textarea value={firmForm.ownershipDetails} onChange={e => setFirmForm({ ...firmForm, ownershipDetails: e.target.value })} rows={2}
                        placeholder="Directors, shareholders holding 25%+ and any politically exposed persons..."
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" style={{ fontFamily: F }} />
                      <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Required for conflict-of-interest and donor due-diligence checks.</p>
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Contact Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contact Person *</label>
                      <input type="text" value={firmForm.contactPerson} onChange={e => setFirmForm({ ...firmForm, contactPerson: e.target.value })} placeholder="Full name" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Email *</label>
                      <input type="email" value={firmForm.email} onChange={e => setFirmForm({ ...firmForm, email: e.target.value })} placeholder="email@company.com" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Phone *</label>
                      <input type="tel" value={firmForm.phone} onChange={e => setFirmForm({ ...firmForm, phone: e.target.value })} placeholder="+233 XX XXX XXXX" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Bank Account Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Bank Name *</label>
                      <input type="text" value={firmForm.bankName} onChange={e => setFirmForm({ ...firmForm, bankName: e.target.value })} placeholder="e.g., GCB Bank" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Account Number *</label>
                      <input type="text" value={firmForm.bankAccountNumber} onChange={e => setFirmForm({ ...firmForm, bankAccountNumber: e.target.value })} placeholder="Account number" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                      <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Masked in all list views; Finance must validate before payment.</p>
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Categorization</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Category *</label>
                      <div className="relative">
                        <button onClick={() => { setFormCategoryDropdown(!formCategoryDropdown); setFormSubCategoryDropdown(false); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                          <span className={firmForm.category ? "text-slate-900" : "text-slate-400"}>{firmForm.category || "Select category"}</span>
                          <ChevronDown size={14} className="text-purple-700" />
                        </button>
                        {formCategoryDropdown && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setFormCategoryDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                              {SUPPLIER_CATEGORIES.map(c => (
                                <button key={c} onClick={() => { setFirmForm({ ...firmForm, category: c, subCategory: "" }); setFormCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{c}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Sub-category</label>
                      <div className="relative">
                        <button onClick={() => { if (firmForm.category) { setFormSubCategoryDropdown(!formSubCategoryDropdown); setFormCategoryDropdown(false); } }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                          <span className={firmForm.subCategory ? "text-slate-900" : "text-slate-400"}>{firmForm.subCategory || "Select sub-category"}</span>
                          <ChevronDown size={14} className="text-purple-700" />
                        </button>
                        {formSubCategoryDropdown && firmForm.category && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setFormSubCategoryDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[160px] overflow-y-auto">
                              {(SUB_CATEGORIES[firmForm.category] || []).map(sc => (
                                <button key={sc} onClick={() => { setFirmForm({ ...firmForm, subCategory: sc }); setFormSubCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{sc}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Specialization / Service Lines</label>
                    {firmSpecializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {firmSpecializations.map(s => (
                          <span key={s} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px]" style={{ fontFamily: F }}>
                            {s}
                            <button onClick={() => setFirmSpecializations(prev => prev.filter(x => x !== s))} className="hover:text-red-500"><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={specializationDraft}
                        onChange={e => setSpecializationDraft(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = specializationDraft.trim();
                            if (value && !firmSpecializations.includes(value)) setFirmSpecializations(prev => [...prev, value]);
                            setSpecializationDraft("");
                          }
                        }}
                        placeholder="e.g., Networking, Civil Works — press Enter to add"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ fontFamily: F }}
                      />
                      <button
                        onClick={() => {
                          const value = specializationDraft.trim();
                          if (value && !firmSpecializations.includes(value)) setFirmSpecializations(prev => [...prev, value]);
                          setSpecializationDraft("");
                        }}
                        className="px-3 h-[36px] border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50" style={{ fontFamily: F }}>
                        Add
                      </button>
                    </div>
                    {firmForm.category && (SUB_CATEGORIES[firmForm.category] || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(SUB_CATEGORIES[firmForm.category] || []).filter(s => !firmSpecializations.includes(s)).map(s => (
                          <button key={s} onClick={() => setFirmSpecializations(prev => [...prev, s])}
                            className="px-2 py-0.5 border border-slate-200 rounded-full text-[10px] text-slate-500 hover:bg-slate-50" style={{ fontFamily: F }}>
                            + {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Required Documents</p>
                  {uploadError && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1.5" style={{ fontFamily: F }}><XCircle size={12} /> {uploadError}</p>
                  )}
                  <div className="space-y-2">
                    {FIRM_DOC_CHECKLIST.map(doc => {
                      const file = firmDocFiles[doc];
                      return (
                        <div key={doc} className="space-y-1.5">
                          <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${file ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                            <div className="flex items-center gap-2 min-w-0">
                              {file ? <Check size={14} className="text-green-600 shrink-0" /> : <FileText size={14} className="text-slate-400 shrink-0" />}
                              <div className="min-w-0">
                                <span className="text-[12px] text-slate-700 block truncate" style={{ fontFamily: F }}>{doc}</span>
                                {file && <span className="text-[10px] text-slate-400 block truncate" style={{ fontFamily: F }}>{file.name} · {file.sizeLabel}</span>}
                              </div>
                            </div>
                            {file ? (
                              <button onClick={() => removeDoc("firm", doc)} className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 shrink-0" style={{ fontFamily: F }}>
                                <X size={12} /> Remove
                              </button>
                            ) : (
                              <button onClick={() => handlePickDoc("firm", doc)} className="text-[11px] text-purple-700 hover:underline flex items-center gap-1 shrink-0" style={{ fontFamily: F }}>
                                <Paperclip size={12} /> Upload
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 pl-6">
                            <label className="text-[10px] text-slate-500" style={{ fontFamily: F }}>Expiry Date:</label>
                            <input type="date" value={firmDocExpiry[doc] || ""} onChange={e => setFirmDocExpiry(prev => ({ ...prev, [doc]: e.target.value }))}
                              className="bg-slate-50 border border-slate-200 rounded h-[28px] px-2 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500" style={{ fontFamily: F }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ── Individual Form ── */
                <div className="flex flex-col gap-5">
                  <p className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: F }}>Personal Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Legal Name *</label>
                      <input type="text" value={indForm.legalName} onChange={e => setIndForm({ ...indForm, legalName: e.target.value })} placeholder="Full legal name" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                      <NameScreening name={indForm.legalName} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Email *</label>
                      <input type="email" value={indForm.contactEmail} onChange={e => setIndForm({ ...indForm, contactEmail: e.target.value })} placeholder="email@example.com" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Phone *</label>
                      <input type="tel" value={indForm.contactPhone} onChange={e => setIndForm({ ...indForm, contactPhone: e.target.value })} placeholder="+233 XX XXX XXXX" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Identification</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>ID Type *</label>
                      <select value={indForm.idType} onChange={e => setIndForm({ ...indForm, idType: e.target.value as typeof indForm.idType })} className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }}>
                        <option value="Passport">Passport</option>
                        <option value="National ID">National ID</option>
                        <option value="Driver's License">Driver's License</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>ID Number *</label>
                      <input type="text" value={indForm.idNumber} onChange={e => setIndForm({ ...indForm, idNumber: e.target.value })} placeholder="ID number" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Residential Address *</label>
                      <input type="text" value={indForm.residentialAddress} onChange={e => setIndForm({ ...indForm, residentialAddress: e.target.value })} placeholder="Full residential address" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Bank Account Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Bank Name *</label>
                      <input type="text" value={indForm.bankName} onChange={e => setIndForm({ ...indForm, bankName: e.target.value })} placeholder="e.g., GCB Bank" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Account Number *</label>
                      <input type="text" value={indForm.bankAccountNumber} onChange={e => setIndForm({ ...indForm, bankAccountNumber: e.target.value })} placeholder="Account number" className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                      <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Masked in all list views; Finance must validate before payment.</p>
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Categorization</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Category *</label>
                      <div className="relative">
                        <button onClick={() => { setFormCategoryDropdown(!formCategoryDropdown); setFormSubCategoryDropdown(false); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                          <span className={indForm.category ? "text-slate-900" : "text-slate-400"}>{indForm.category || "Select"}</span>
                          <ChevronDown size={14} className="text-purple-700" />
                        </button>
                        {formCategoryDropdown && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setFormCategoryDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                              {SUPPLIER_CATEGORIES.map(c => (
                                <button key={c} onClick={() => { setIndForm({ ...indForm, category: c, subCategory: "" }); setFormCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{c}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Sub-category</label>
                      <div className="relative">
                        <button onClick={() => { if (indForm.category) { setFormSubCategoryDropdown(!formSubCategoryDropdown); setFormCategoryDropdown(false); } }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                          <span className={indForm.subCategory ? "text-slate-900" : "text-slate-400"}>{indForm.subCategory || "Select"}</span>
                          <ChevronDown size={14} className="text-purple-700" />
                        </button>
                        {formSubCategoryDropdown && indForm.category && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setFormSubCategoryDropdown(false)} />
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[160px] overflow-y-auto">
                              {(SUB_CATEGORIES[indForm.category] || []).map(sc => (
                                <button key={sc} onClick={() => { setIndForm({ ...indForm, subCategory: sc }); setFormSubCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{sc}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-2" style={{ fontFamily: F }}>Expert Areas *</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {indExpertAreas.map(area => (
                      <span key={area} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px]" style={{ fontFamily: F }}>
                        {area}
                        <button onClick={() => setIndExpertAreas(prev => prev.filter(a => a !== area))} className="hover:text-red-500"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <button onClick={() => setShowExpertDropdown(!showExpertDropdown)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                      <span className="text-slate-400">Add expert areas...</span>
                      <ChevronDown size={14} className="text-purple-700" />
                    </button>
                    {showExpertDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowExpertDropdown(false)} />
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[180px] overflow-y-auto">
                          {EXPERT_AREAS_OPTIONS.filter(a => !indExpertAreas.includes(a)).map(area => (
                            <button key={area} onClick={() => { setIndExpertAreas(prev => [...prev, area]); }}
                              className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{area}</button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-[13px] font-semibold text-slate-800 mt-4" style={{ fontFamily: F }}>Required Documents</p>
                  {uploadError && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1.5" style={{ fontFamily: F }}><XCircle size={12} /> {uploadError}</p>
                  )}
                  <div className="space-y-2">
                    {INDIVIDUAL_DOC_CHECKLIST.map(doc => {
                      const file = indDocFiles[doc];
                      return (
                        <div key={doc} className="space-y-1.5">
                          <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${file ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                            <div className="flex items-center gap-2 min-w-0">
                              {file ? <Check size={14} className="text-green-600 shrink-0" /> : <FileText size={14} className="text-slate-400 shrink-0" />}
                              <div className="min-w-0">
                                <span className="text-[12px] text-slate-700 block truncate" style={{ fontFamily: F }}>{doc}</span>
                                {file && <span className="text-[10px] text-slate-400 block truncate" style={{ fontFamily: F }}>{file.name} · {file.sizeLabel}</span>}
                              </div>
                            </div>
                            {file ? (
                              <button onClick={() => removeDoc("individual", doc)} className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 shrink-0" style={{ fontFamily: F }}>
                                <X size={12} /> Remove
                              </button>
                            ) : (
                              <button onClick={() => handlePickDoc("individual", doc)} className="text-[11px] text-purple-700 hover:underline flex items-center gap-1 shrink-0" style={{ fontFamily: F }}>
                                <Paperclip size={12} /> Upload
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 pl-6">
                            <label className="text-[10px] text-slate-500" style={{ fontFamily: F }}>Expiry Date:</label>
                            <input type="date" value={indDocExpiry[doc] || ""} onChange={e => setIndDocExpiry(prev => ({ ...prev, [doc]: e.target.value }))}
                              className="bg-slate-50 border border-slate-200 rounded h-[28px] px-2 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500" style={{ fontFamily: F }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <p className="text-[11px] text-red-600 flex-1" style={{ fontFamily: F }}>{formError}</p>
              {onboardResult ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => { const id = onboardResult.supplier.id; closeOnboarding(); setDetailSupplierId(id); }}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors" style={{ fontFamily: F }}>
                    Open Supplier Profile
                  </button>
                  <button onClick={closeOnboarding}
                    className="px-4 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                    Done
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={closeOnboarding} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors" style={{ fontFamily: F }}>Cancel</button>
                  <button
                    onClick={handleCompleteOnboarding}
                    disabled={!canCreate}
                    title={canCreate ? undefined : denialReason("supplier.create")}
                    className="px-4 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#0B01D0", fontFamily: F }}
                  >
                    Complete Onboarding
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         EDIT SUPPLIER MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {editSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: F }}>Edit Supplier Record</h2>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  {supplierDisplayName(editSupplier)} · <span className="font-medium text-purple-700">{editSupplier.supplierId}</span> · legal name and identifiers are fixed after registration
                </p>
              </div>
              <button onClick={() => { setEditSupplier(null); setEditError(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              <p className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: F }}>Contact Information</p>
              <div className="grid grid-cols-3 gap-4">
                {editSupplier.type === "Firm" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contact Person *</label>
                    <input type="text" value={editForm.contactPerson} onChange={e => setEditForm({ ...editForm, contactPerson: e.target.value })} className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Email *</label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Phone *</label>
                  <input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                </div>
                <div className={`flex flex-col gap-1.5 ${editSupplier.type === "Firm" ? "col-span-3" : "col-span-1"}`}>
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>{editSupplier.type === "Firm" ? "Registered Address *" : "Residential Address *"}</label>
                  <input type="text" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                </div>
              </div>

              <p className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: F }}>Bank Account Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Bank Name *</label>
                  <input type="text" value={editForm.bankName} onChange={e => setEditForm({ ...editForm, bankName: e.target.value })} className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Account Number *</label>
                  <input type="text" value={editForm.bankAccountNumber} onChange={e => setEditForm({ ...editForm, bankAccountNumber: e.target.value })} className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                  {editForm.bankAccountNumber.trim() !== editSupplier.bankAccountNumber && (
                    <p className="text-[10px] text-amber-600 flex items-center gap-1" style={{ fontFamily: F }}>
                      <AlertTriangle size={11} /> Changing the account clears the Finance validation on file.
                    </p>
                  )}
                </div>
              </div>

              <p className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: F }}>Categorization</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Category *</label>
                  <div className="relative">
                    <button onClick={() => { setEditCategoryDropdown(!editCategoryDropdown); setEditSubCategoryDropdown(false); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                      <span className={editForm.category ? "text-slate-900" : "text-slate-400"}>{editForm.category || "Select category"}</span>
                      <ChevronDown size={14} className="text-purple-700" />
                    </button>
                    {editCategoryDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setEditCategoryDropdown(false)} />
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                          {SUPPLIER_CATEGORIES.map(c => (
                            <button key={c} onClick={() => { setEditForm({ ...editForm, category: c, subCategory: "" }); setEditCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{c}</button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Sub-category</label>
                  <div className="relative">
                    <button onClick={() => { if (editForm.category) { setEditSubCategoryDropdown(!editSubCategoryDropdown); setEditCategoryDropdown(false); } }} className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                      <span className={editForm.subCategory ? "text-slate-900" : "text-slate-400"}>{editForm.subCategory || "Select sub-category"}</span>
                      <ChevronDown size={14} className="text-purple-700" />
                    </button>
                    {editSubCategoryDropdown && editForm.category && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setEditSubCategoryDropdown(false)} />
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[160px] overflow-y-auto">
                          {(SUB_CATEGORIES[editForm.category] || []).map(sc => (
                            <button key={sc} onClick={() => { setEditForm({ ...editForm, subCategory: sc }); setEditSubCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{sc}</button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {editSupplier.type === "Firm" ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Ownership &amp; Beneficial Ownership</label>
                    <textarea value={editForm.ownershipDetails} onChange={e => setEditForm({ ...editForm, ownershipDetails: e.target.value })} rows={2}
                      placeholder="Directors, shareholders holding 25%+ and any politically exposed persons..."
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" style={{ fontFamily: F }} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Specialization / Service Lines</label>
                    {editSpecializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {editSpecializations.map(s => (
                          <span key={s} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px]" style={{ fontFamily: F }}>
                            {s}
                            <button onClick={() => setEditSpecializations(prev => prev.filter(x => x !== s))} className="hover:text-red-500"><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input type="text" value={editSpecDraft} onChange={e => setEditSpecDraft(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = editSpecDraft.trim();
                            if (value && !editSpecializations.includes(value)) setEditSpecializations(prev => [...prev, value]);
                            setEditSpecDraft("");
                          }
                        }}
                        placeholder="Add a service line — press Enter"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }} />
                      <button onClick={() => {
                        const value = editSpecDraft.trim();
                        if (value && !editSpecializations.includes(value)) setEditSpecializations(prev => [...prev, value]);
                        setEditSpecDraft("");
                      }} className="px-3 h-[36px] border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50" style={{ fontFamily: F }}>Add</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Expert Areas</label>
                  {editExpertAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {editExpertAreas.map(area => (
                        <span key={area} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px]" style={{ fontFamily: F }}>
                          {area}
                          <button onClick={() => setEditExpertAreas(prev => prev.filter(a => a !== area))} className="hover:text-red-500"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <button onClick={() => setEditExpertDropdown(!editExpertDropdown)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 flex items-center justify-between text-[12px]" style={{ fontFamily: F }}>
                      <span className="text-slate-400">Add expert areas...</span>
                      <ChevronDown size={14} className="text-purple-700" />
                    </button>
                    {editExpertDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setEditExpertDropdown(false)} />
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[180px] overflow-y-auto">
                          {EXPERT_AREAS_OPTIONS.filter(a => !editExpertAreas.includes(a)).map(area => (
                            <button key={area} onClick={() => setEditExpertAreas(prev => [...prev, area])}
                              className="w-full px-3 py-2 text-left text-[12px] text-slate-900 hover:bg-slate-50" style={{ fontFamily: F }}>{area}</button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <p className="text-[11px] text-red-600 flex-1" style={{ fontFamily: F }}>{editError}</p>
              <div className="flex items-center gap-3">
                <button onClick={() => { setEditSupplier(null); setEditError(null); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors" style={{ fontFamily: F }}>Cancel</button>
                <button onClick={saveEdit}
                  disabled={!canCreate}
                  title={canCreate ? undefined : denialReason("supplier.create")}
                  className="px-4 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         STATUS ACTION MODAL (Flag / Suspend / Blacklist / Reactivate)
         ══════════════════════════════════════════════════════════════════════ */}
      {statusAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden">
            <div className={`px-6 py-4 border-b ${
              statusAction.action === "Reactivate" || statusAction.action === "Approve Reactivation" ? "border-blue-200 bg-blue-50" :
              statusAction.action === "Flag" ? "border-amber-200 bg-amber-50" :
              statusAction.action === "Suspend" ? "border-red-200 bg-red-50" :
              "border-slate-300 bg-slate-100"
            }`}>
              <div className="flex items-center gap-3">
                {statusAction.action === "Flag" && <AlertTriangle size={20} className="text-amber-600" />}
                {statusAction.action === "Suspend" && <ShieldAlert size={20} className="text-red-600" />}
                {statusAction.action === "Blacklist" && <ShieldBan size={20} className="text-slate-700" />}
                {(statusAction.action === "Reactivate" || statusAction.action === "Approve Reactivation") && <ShieldCheck size={20} className="text-blue-600" />}
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                    {statusAction.action === "Reactivate" ? "Reactivation Requires Approval" : `${statusAction.action} Supplier`}
                  </h3>
                  <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>
                    {supplierDisplayName(statusAction.supplier)} ({statusAction.supplier.supplierId})
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>
                {statusAction.action === "Flag" && "Flagging this supplier marks them for monitoring. They remain in the register but shortlisting will require Senior Management approval."}
                {statusAction.action === "Suspend" && "Suspending this supplier immediately blocks them from all solicitations and awards. This action can be reversed through reactivation."}
                {statusAction.action === "Blacklist" && "Blacklisting permanently restricts this supplier from all procurement activity. Reserved for fraud, gross misconduct or debarment."}
                {statusAction.action === "Reactivate" && "Reactivation of blacklisted or suspended suppliers requires management approval. Submitting sets the status to Pending Reactivation and notifies Senior Management."}
                {statusAction.action === "Approve Reactivation" && "Approving returns this supplier to Active status and restores their eligibility for solicitation and award."}
              </p>

              {statusAction.action !== "Approve Reactivation" && (
                <div className="mt-4">
                  <label className="text-[12px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1" style={{ fontFamily: F }}>
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={e => { setActionReason(e.target.value); if (e.target.value.trim()) setActionReasonError(false); }}
                    rows={3}
                    placeholder={
                      statusAction.action === "Flag" ? "e.g., Repeated late deliveries on CNT-2025-014..." :
                      statusAction.action === "Suspend" ? "e.g., Under investigation for invoice irregularities..." :
                      statusAction.action === "Blacklist" ? "e.g., Confirmed fraudulent documentation submitted..." :
                      "e.g., Investigation concluded, supplier cleared of allegations..."
                    }
                    className={`w-full border rounded-lg px-3 py-2.5 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none ${
                      actionReasonError ? "border-red-400 bg-red-50 focus:border-red-500" : "border-slate-200 focus:border-purple-400"
                    }`}
                    style={{ fontFamily: F }}
                  />
                  {actionReasonError && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1" style={{ fontFamily: F }}>
                      <XCircle size={10} /> A reason is mandatory before updating supplier status.
                    </p>
                  )}
                </div>
              )}

              {statusAction.action === "Blacklist" && (
                <div className="mt-3 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-[11px] text-red-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                    <AlertTriangle size={12} /> This action is difficult to reverse and will be audited. Ensure compliance review is complete.
                  </p>
                </div>
              )}
              {statusAction.action === "Reactivate" && (
                <div className="mt-3 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-[11px] text-amber-700 flex items-center gap-1.5" style={{ fontFamily: F }}>
                    <AlertTriangle size={12} /> The supplier will not be eligible for sourcing until Senior Management approves the reactivation.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => { setStatusAction(null); setActionReason(""); setActionReasonError(false); }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ fontFamily: F }}>
                Cancel
              </button>
              <button
                onClick={confirmStatusAction}
                className={`px-5 py-2 rounded-lg text-[12px] font-medium text-white transition-opacity hover:opacity-90 ${
                  statusAction.action === "Reactivate" || statusAction.action === "Approve Reactivation" ? "bg-blue-600" :
                  statusAction.action === "Flag" ? "bg-amber-600" :
                  statusAction.action === "Suspend" ? "bg-red-600" :
                  "bg-slate-700"
                }`}
                style={{ fontFamily: F }}>
                {statusAction.action === "Reactivate" ? "Request Reactivation" : `Confirm ${statusAction.action}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
