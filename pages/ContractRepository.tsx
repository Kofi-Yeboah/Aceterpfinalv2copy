import { useState, useEffect, useRef } from "react";
import {
  Search, Download, Eye, MoreHorizontal, ChevronLeft, ChevronRight, FileText,
  ArrowLeft, Calendar, Building2, DollarSign, Shield,
  Paperclip, History, Upload, X, CheckCircle2, AlertTriangle,
  Edit3, RotateCcw, Link2, Trash2, Plus, PenLine, AlertCircle
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  getContracts, subscribe as subscribeContracts,
  addDocumentToContract, addAmendment, updateContractStatus,
  getLastAwardedContractNumber, clearLastAwardedContractNumber,
  type AwardedContract, type ContractDocumentGroup, type ContractAmendment
} from "../lib/contractStore";
import { getSignature, subscribe as subscribeSignature, getCurrentUserId, canUseSignature } from "../lib/signatureStore";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "Montserrat, sans-serif";

type ContractStatus = "Active" | "Expiring Soon" | "Expired" | "Pending" | "Terminated" | "Renewed";

interface UnifiedContract {
  id: string; // store id or static id
  contractNumber: string;
  title: string;
  type: string;
  party: string;
  startDate: string;
  endDate: string;
  value: number;
  status: ContractStatus;
  department: string;
  owner: string;
  // Sourcing linkage
  sourcePR?: string;
  sourceSourcingCase?: string;
  method?: string;
  category?: string;
  awardDate?: string;
  comments?: string;
  // Documents & history
  documents: ContractDocumentGroup[];
  amendments: ContractAmendment[];
  // Rich data
  description?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  // Track if from store
  storeId?: string;
}

const TAB_STATUSES = [
  { key: "all", label: "All Contracts" },
  { key: "Active", label: "Active" },
  { key: "Expiring Soon", label: "Expiring Soon" },
  { key: "Expired", label: "Expired" },
  { key: "Pending", label: "Pending" },
  { key: "procurement", label: "Procurement-Sourced" },
] as const;

type TabKey = typeof TAB_STATUSES[number]["key"];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (s: string) => {
  try { return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return s; }
};

const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/* ── Static contracts (non-procurement, enriched with mock data) ── */
const staticContracts: UnifiedContract[] = [
  {
    id: "S-003", contractNumber: "CNT-2024-003", title: "Employment Contract - Sarah Johnson", type: "Employment", party: "Sarah Johnson",
    startDate: "2024-01-15", endDate: "2027-01-14", value: 95000, status: "Active", department: "HR", owner: "Emily Davis",
    description: "Full-time employment agreement for Senior Program Officer.",
    paymentTerms: "Monthly salary disbursement, 25th of each month.", deliveryTerms: "N/A",
    documents: [
      { docId: "sd-1", label: "Signed Employment Contract", currentVersion: 1, versions: [
        { id: "sd-1-v1", name: "EmploymentContract_SJohnson_Signed.pdf", uploadedBy: "Emily Davis", date: "2024-01-12", type: "PDF", size: "2.1 MB", version: 1 },
      ]},
      { docId: "sd-2", label: "Offer Letter", currentVersion: 1, versions: [
        { id: "sd-2-v1", name: "OfferLetter_SJohnson.pdf", uploadedBy: "HR Unit", date: "2023-12-20", type: "PDF", size: "450 KB", version: 1 },
      ]},
    ], amendments: [
      { id: "am-s1", amendmentNumber: "AMD-001", date: "2024-07-01", description: "Salary revision per annual review", type: "Value Change", oldValue: "$85,000", newValue: "$95,000", approvedBy: "CEO" },
    ],
  },
  {
    id: "S-004", contractNumber: "CNT-2024-004", title: "IT Support Services Agreement", type: "Service", party: "TechSupport Inc",
    startDate: "2024-04-01", endDate: "2026-03-31", value: 28000, status: "Active", department: "IT", owner: "Michael Chen",
    description: "Managed IT support covering helpdesk, network maintenance, and cybersecurity monitoring.",
    paymentTerms: "Quarterly invoicing, Net-30.", deliveryTerms: "Response within 4 hours for critical issues.",
    documents: [
      { docId: "sd-3", label: "Signed Service Agreement", currentVersion: 2, versions: [
        { id: "sd-3-v1", name: "ITSupport_Agreement_v1.pdf", uploadedBy: "Michael Chen", date: "2024-03-28", type: "PDF", size: "1.8 MB", version: 1 },
        { id: "sd-3-v2", name: "ITSupport_Agreement_v2_Amended.pdf", uploadedBy: "Michael Chen", date: "2024-09-15", type: "PDF", size: "1.9 MB", version: 2 },
      ]},
      { docId: "sd-4", label: "SLA Document", currentVersion: 1, versions: [
        { id: "sd-4-v1", name: "SLA_TechSupport.pdf", uploadedBy: "IT Unit", date: "2024-03-28", type: "PDF", size: "680 KB", version: 1 },
      ]},
    ], amendments: [
      { id: "am-s2", amendmentNumber: "AMD-001", date: "2024-09-15", description: "Added cybersecurity monitoring to scope", type: "Scope Change", oldValue: "Helpdesk + Network", newValue: "Helpdesk + Network + Cyber", approvedBy: "IT Director" },
    ],
  },
  {
    id: "S-005", contractNumber: "CNT-2024-005", title: "NDA - Strategic Partnership", type: "NDA", party: "Global Solutions Ltd",
    startDate: "2024-05-10", endDate: "2027-05-10", value: 0, status: "Active", department: "Legal", owner: "David Wilson",
    description: "Mutual non-disclosure agreement for strategic partnership evaluation.",
    documents: [
      { docId: "sd-5", label: "Signed NDA", currentVersion: 1, versions: [
        { id: "sd-5-v1", name: "NDA_GlobalSolutions_Signed.pdf", uploadedBy: "David Wilson", date: "2024-05-08", type: "PDF", size: "340 KB", version: 1 },
      ]},
    ], amendments: [],
  },
  {
    id: "S-098", contractNumber: "CNT-2023-098", title: "Cleaning Services Contract", type: "Service", party: "CleanCo Services",
    startDate: "2024-01-01", endDate: "2025-12-31", value: 15000, status: "Expiring Soon", department: "Admin", owner: "John Smith",
    description: "Office cleaning services — daily cleaning, weekly deep clean, quarterly window cleaning.",
    paymentTerms: "Monthly invoicing, Net-15.", deliveryTerms: "Daily service, 6AM-9AM.",
    documents: [
      { docId: "sd-6", label: "Signed Contract", currentVersion: 1, versions: [
        { id: "sd-6-v1", name: "CleaningContract_CleanCo.pdf", uploadedBy: "John Smith", date: "2023-12-18", type: "PDF", size: "1.1 MB", version: 1 },
      ]},
    ], amendments: [],
  },
  {
    id: "S-006", contractNumber: "CNT-2024-006", title: "Consultant Agreement - Project Management", type: "Consultant", party: "ProjectPro Consulting",
    startDate: "2024-06-01", endDate: "2025-11-30", value: 75000, status: "Active", department: "Projects", owner: "Sarah Johnson",
    description: "External project management consultancy for ACET institutional reform initiative.",
    paymentTerms: "Milestone-based: 30% inception, 40% mid-term, 30% final report.", deliveryTerms: "Monthly progress reports.",
    documents: [
      { docId: "sd-7", label: "Signed Agreement", currentVersion: 1, versions: [
        { id: "sd-7-v1", name: "ConsultantAgreement_ProjectPro.pdf", uploadedBy: "Sarah Johnson", date: "2024-05-28", type: "PDF", size: "2.4 MB", version: 1 },
      ]},
      { docId: "sd-8", label: "Terms of Reference", currentVersion: 1, versions: [
        { id: "sd-8-v1", name: "ToR_ProjectManagement.pdf", uploadedBy: "Projects Unit", date: "2024-05-20", type: "PDF", size: "520 KB", version: 1 },
      ]},
    ], amendments: [],
  },
  {
    id: "S-045", contractNumber: "CNT-2023-045", title: "Internet Service Provider Agreement", type: "Service", party: "FastNet Communications",
    startDate: "2023-01-15", endDate: "2025-01-14", value: 12000, status: "Expired", department: "IT", owner: "Michael Chen",
    description: "Dedicated internet line — 100Mbps symmetric fiber.", documents: [
      { docId: "sd-9", label: "Signed Agreement", currentVersion: 1, versions: [
        { id: "sd-9-v1", name: "ISP_FastNet_Contract.pdf", uploadedBy: "Michael Chen", date: "2023-01-10", type: "PDF", size: "900 KB", version: 1 },
      ]},
    ], amendments: [],
  },
  {
    id: "S-007", contractNumber: "CNT-2024-007", title: "Employment Contract - David Wilson", type: "Employment", party: "David Wilson",
    startDate: "2024-03-20", endDate: "2027-03-19", value: 110000, status: "Active", department: "HR", owner: "Emily Davis",
    description: "Full-time employment agreement for Legal Counsel.",
    documents: [
      { docId: "sd-10", label: "Signed Employment Contract", currentVersion: 1, versions: [
        { id: "sd-10-v1", name: "EmploymentContract_DWilson.pdf", uploadedBy: "Emily Davis", date: "2024-03-18", type: "PDF", size: "2.0 MB", version: 1 },
      ]},
    ], amendments: [],
  },
  {
    id: "S-008", contractNumber: "CNT-2024-008", title: "Vehicle Lease Agreement", type: "Lease", party: "AutoLease Ltd",
    startDate: "2024-04-15", endDate: "2027-04-14", value: 36000, status: "Active", department: "Admin", owner: "John Smith",
    description: "3-year lease for 2 Toyota Land Cruisers for field operations.",
    paymentTerms: "Monthly lease payment of $1,000/vehicle.",
    documents: [
      { docId: "sd-11", label: "Lease Agreement", currentVersion: 1, versions: [
        { id: "sd-11-v1", name: "VehicleLease_AutoLease.pdf", uploadedBy: "John Smith", date: "2024-04-10", type: "PDF", size: "1.5 MB", version: 1 },
      ]},
    ], amendments: [],
  },
  {
    id: "S-009", contractNumber: "CNT-2024-009", title: "Security Services Contract", type: "Service", party: "SecureGuard Inc",
    startDate: "2024-05-01", endDate: "2026-04-30", value: 42000, status: "Active", department: "Admin", owner: "John Smith",
    description: "24/7 security guard services — 2 guards per shift (day/night), plus CCTV monitoring.",
    documents: [
      { docId: "sd-12", label: "Signed Contract", currentVersion: 1, versions: [
        { id: "sd-12-v1", name: "SecurityContract_SecureGuard.pdf", uploadedBy: "John Smith", date: "2024-04-28", type: "PDF", size: "1.3 MB", version: 1 },
      ]},
    ], amendments: [],
  },
  {
    id: "S-010", contractNumber: "CNT-2024-010", title: "Supplier Agreement - Office Supplies", type: "Vendor", party: "OfficeMax Solutions",
    startDate: "2024-01-01", endDate: "2026-12-31", value: 25000, status: "Active", department: "Procurement", owner: "Lisa Anderson",
    description: "Framework agreement for office consumables — stationery, toner, paper.",
    paymentTerms: "Order-based invoicing, Net-30.",
    documents: [
      { docId: "sd-13", label: "Framework Agreement", currentVersion: 1, versions: [
        { id: "sd-13-v1", name: "FrameworkAgreement_OfficeMax.pdf", uploadedBy: "Lisa Anderson", date: "2023-12-22", type: "PDF", size: "1.8 MB", version: 1 },
      ]},
    ], amendments: [],
  },
];

/* ── Merge helper ── */
function buildMergedContracts(storeContracts: AwardedContract[]): UnifiedContract[] {
  const fromStore: UnifiedContract[] = storeContracts.map(ac => ({
    id: ac.id,
    contractNumber: ac.contractNumber,
    title: ac.title,
    type: ac.type,
    party: ac.party,
    startDate: ac.startDate,
    endDate: ac.endDate,
    value: ac.value,
    status: ac.status as ContractStatus,
    department: ac.department,
    owner: ac.owner,
    sourcePR: ac.sourcePR,
    sourceSourcingCase: ac.sourceSourcingCase,
    method: ac.method,
    category: ac.category,
    awardDate: ac.awardDate,
    comments: ac.comments,
    documents: ac.documents,
    amendments: ac.amendments,
    description: ac.description,
    paymentTerms: ac.paymentTerms,
    deliveryTerms: ac.deliveryTerms,
    storeId: ac.id,
  }));

  const storeNumbers = new Set(fromStore.map(c => c.contractNumber));
  return [
    ...fromStore,
    ...staticContracts.filter(c => !storeNumbers.has(c.contractNumber)),
  ];
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function ContractRepository() {
  const [, setTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Detail view
  const [selectedContract, setSelectedContract] = useState<UnifiedContract | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "documents" | "amendments" | "timeline">("overview");

  // Amend modal
  const [showAmendModal, setShowAmendModal] = useState(false);
  const [amendType, setAmendType] = useState<ContractAmendment["type"]>("Extension");
  const [amendDesc, setAmendDesc] = useState("");
  const [amendOldVal, setAmendOldVal] = useState("");
  const [amendNewVal, setAmendNewVal] = useState("");

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status change modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ContractStatus>("Active");

  // Version history modal
  const [versionHistoryDoc, setVersionHistoryDoc] = useState<ContractDocumentGroup | null>(null);

  // Signature state
  const [signatureData, setSignatureData] = useState(getSignature());
  const [showSignModal, setShowSignModal] = useState(false);
  const [signedContracts, setSignedContracts] = useState<Record<string, string>>({}); // contractNumber -> signedAt

  useEffect(() => {
    const unsub = subscribeContracts(() => setTick(t => t + 1));
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeSignature(() => setSignatureData(getSignature()));
    return unsub;
  }, []);

  const handleApplySignature = (contractNumber: string) => {
    if (!canUseSignature(getCurrentUserId())) return;
    const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    setSignedContracts(prev => ({ ...prev, [contractNumber]: now }));
    setShowSignModal(false);
  };

  const allContracts = buildMergedContracts(getContracts());

  // Auto-open the last awarded contract when navigating from Sourcing
  useEffect(() => {
    const lastAwarded = getLastAwardedContractNumber();
    if (lastAwarded) {
      const target = allContracts.find(c => c.contractNumber === lastAwarded);
      if (target) {
        setSelectedContract(target);
        setActiveTab("procurement");
      }
      clearLastAwardedContractNumber();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync selected contract from store when tick changes
  useEffect(() => {
    if (selectedContract) {
      const updated = allContracts.find(c => c.contractNumber === selectedContract.contractNumber);
      if (updated) setSelectedContract(updated);
    }
  });

  // Tab counts
  const tabCounts: Record<string, number> = {
    all: allContracts.length,
    Active: allContracts.filter(c => c.status === "Active").length,
    "Expiring Soon": allContracts.filter(c => c.status === "Expiring Soon").length,
    Expired: allContracts.filter(c => c.status === "Expired").length,
    Pending: allContracts.filter(c => c.status === "Pending").length,
    procurement: allContracts.filter(c => !!c.sourcePR).length,
  };

  // Filtering
  const filtered = allContracts.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.contractNumber.toLowerCase().includes(q) || c.party.toLowerCase().includes(q) || (c.sourcePR || "").toLowerCase().includes(q);
    const matchTab =
      activeTab === "all" ? true :
      activeTab === "procurement" ? !!c.sourcePR :
      c.status === activeTab;
    const matchType = typeFilter === "All Types" || c.type === typeFilter;
    const matchDept = deptFilter === "All Departments" || c.department === deptFilter;
    return matchSearch && matchTab && matchType && matchDept;
  });

  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentContracts = filtered.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-700";
      case "Expiring Soon": return "bg-amber-100 text-amber-700";
      case "Expired": return "bg-red-100 text-red-700";
      case "Pending": return "bg-blue-100 text-blue-700";
      case "Terminated": return "bg-red-200 text-red-800";
      case "Renewed": return "bg-purple-100 text-purple-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Employment": return "bg-blue-50 text-blue-700";
      case "Vendor": return "bg-purple-50 text-purple-700";
      case "Service": return "bg-cyan-50 text-cyan-700";
      case "Consultant": return "bg-amber-50 text-amber-700";
      case "NDA": return "bg-slate-100 text-slate-700";
      case "Lease": return "bg-green-50 text-green-700";
      case "Works": return "bg-orange-50 text-orange-700";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  // ── Upload handlers ──
  const handleUploadConfirm = () => {
    if (!uploadFile) { setUploadError("Please select a file."); return; }
    if (!uploadLabel.trim()) { setUploadError("Please enter a document label."); return; }
    if (!selectedContract?.storeId) { setUploadError("Document upload only available for procurement-sourced contracts."); return; }

    addDocumentToContract(selectedContract.storeId, {
      label: uploadLabel,
      name: uploadFile.name,
      uploadedBy: "Current User",
      type: uploadFile.name.split(".").pop()?.toUpperCase() || "FILE",
      size: uploadFile.size < 1024 * 1024 ? `${(uploadFile.size / 1024).toFixed(0)} KB` : `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
    });
    setUploadSuccess(true);
    setTimeout(() => { setShowUploadModal(false); setUploadSuccess(false); setUploadFile(null); setUploadLabel(""); }, 1200);
  };

  // ── Amendment handler ──
  const handleAmendSubmit = () => {
    if (!selectedContract?.storeId) return;
    if (!amendDesc.trim()) return;
    const nextNum = (selectedContract.amendments?.length || 0) + 1;
    addAmendment(selectedContract.storeId, {
      amendmentNumber: `AMD-${String(nextNum).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      description: amendDesc,
      type: amendType,
      oldValue: amendOldVal || undefined,
      newValue: amendNewVal || undefined,
      approvedBy: "Current User",
    });
    setShowAmendModal(false);
    setAmendDesc(""); setAmendOldVal(""); setAmendNewVal("");
  };

  // ── Status change handler ──
  const handleStatusChange = () => {
    if (!selectedContract?.storeId) return;
    updateContractStatus(selectedContract.storeId, newStatus);
    setShowStatusModal(false);
  };

  /* ════════════════════════════════════════════════════════════════════════════
     DETAIL VIEW
     ════════════════════════════════════════════════════════════════════════════ */
  if (selectedContract) {
    const c = selectedContract;
    const isProcurement = !!c.sourcePR;
    const totalDocs = c.documents.reduce((sum, dg) => sum + dg.versions.length, 0);
    const daysLeft = daysUntil(c.endDate);
    const duration = Math.ceil((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const elapsed = Math.ceil((Date.now() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const progress = Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)));

    const DETAIL_TABS = [
      { key: "overview" as const, label: "Overview" },
      { key: "documents" as const, label: `Documents (${c.documents.length})` },
      { key: "amendments" as const, label: `Amendments (${c.amendments?.length || 0})` },
      { key: "timeline" as const, label: "Timeline" },
    ];

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => { setSelectedContract(null); setDetailTab("overview"); }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[16px] font-semibold text-slate-900 truncate" style={{ fontFamily: F }}>{c.contractNumber}</h1>
                <span className={cn("text-[11px] font-medium px-2.5 py-0.5 rounded", getStatusColor(c.status))}>{c.status}</span>
                <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded", getTypeBadge(c.type))}>{c.type}</span>
                {isProcurement && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                    <Link2 size={10} /> Procurement-Sourced
                  </span>
                )}
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5 truncate" style={{ fontFamily: F }}>
                {c.title} &middot; {c.party}
              </p>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {c.storeId && (
                <>
                  <button onClick={() => setShowUploadModal(true)}
                    className="px-3 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-1.5 hover:opacity-90"
                    style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                    <Upload size={13} /> Upload Document
                  </button>
                  <button onClick={() => setShowAmendModal(true)}
                    className="px-3 py-2 rounded-lg text-[12px] font-medium border border-purple-300 bg-purple-50 text-purple-700 flex items-center gap-1.5 hover:bg-purple-100"
                    style={{ fontFamily: F }}>
                    <Edit3 size={13} /> Amend
                  </button>
                  <button onClick={() => { setNewStatus(c.status as ContractStatus); setShowStatusModal(true); }}
                    className="px-3 py-2 rounded-lg text-[12px] font-medium border border-slate-200 text-slate-700 flex items-center gap-1.5 hover:bg-slate-50"
                    style={{ fontFamily: F }}>
                    <Shield size={13} /> Status
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Detail Tabs */}
          <div className="mt-4">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
              {DETAIL_TABS.map(t => (
                <button key={t.key} onClick={() => setDetailTab(t.key)}
                  className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors ${
                    detailTab === t.key ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`} style={{ fontFamily: F }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── OVERVIEW TAB ── */}
          {detailTab === "overview" && (
            <div className="space-y-5">
              {/* KPI Row */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"><DollarSign size={15} className="text-green-600" /></div>
                    <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Contract Value</p>
                  </div>
                  <p className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: F }}>{c.value > 0 ? formatCurrency(c.value) : "N/A"}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Calendar size={15} className="text-blue-600" /></div>
                    <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Days Remaining</p>
                  </div>
                  <p className={`text-[18px] font-semibold ${daysLeft < 30 ? "text-red-600" : daysLeft < 90 ? "text-amber-600" : "text-slate-900"}`} style={{ fontFamily: F }}>
                    {daysLeft > 0 ? daysLeft : "Expired"}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center"><Paperclip size={15} className="text-purple-600" /></div>
                    <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Documents</p>
                  </div>
                  <p className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: F }}>{totalDocs}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Edit3 size={15} className="text-amber-600" /></div>
                    <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Amendments</p>
                  </div>
                  <p className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: F }}>{c.amendments?.length || 0}</p>
                </div>
              </div>

              {/* Contract Progress Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-slate-900" style={{ fontFamily: F }}>Contract Progress</h3>
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>{progress}% elapsed</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${progress >= 90 ? "bg-red-500" : progress >= 75 ? "bg-amber-500" : "bg-green-500"}`}
                    style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{formatDate(c.startDate)}</span>
                  <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{formatDate(c.endDate)}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-5">
                {/* Contract Details */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: F }}>
                    <FileText size={14} className="text-purple-700" /> Contract Details
                  </h3>
                  <div className="space-y-3">
                    {[
                      ["Contract Number", c.contractNumber],
                      ["Title", c.title],
                      ["Type", c.type],
                      ["Department", c.department],
                      ["Owner", c.owner],
                      ["Start Date", formatDate(c.startDate)],
                      ["End Date", formatDate(c.endDate)],
                      ["Value", c.value > 0 ? formatCurrency(c.value) : "N/A"],
                    ].map(([label, val]) => (
                      <div key={label} className="flex items-start justify-between">
                        <span className="text-[11px] text-slate-500 shrink-0 w-32" style={{ fontFamily: F }}>{label}</span>
                        <span className="text-[12px] text-slate-900 text-right" style={{ fontFamily: F }}>{val}</span>
                      </div>
                    ))}
                    {c.paymentTerms && (
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] text-slate-500 shrink-0 w-32" style={{ fontFamily: F }}>Payment Terms</span>
                        <span className="text-[12px] text-slate-900 text-right" style={{ fontFamily: F }}>{c.paymentTerms}</span>
                      </div>
                    )}
                    {c.deliveryTerms && (
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] text-slate-500 shrink-0 w-32" style={{ fontFamily: F }}>Delivery Terms</span>
                        <span className="text-[12px] text-slate-900 text-right" style={{ fontFamily: F }}>{c.deliveryTerms}</span>
                      </div>
                    )}
                  </div>
                  {c.description && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Description</p>
                      <p className="text-[12px] text-slate-700" style={{ fontFamily: F }}>{c.description}</p>
                    </div>
                  )}
                </div>

                {/* Party / Vendor + Sourcing Trail */}
                <div className="space-y-5">
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-[13px] font-semibold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: F }}>
                      <Building2 size={14} className="text-purple-700" /> Counterparty
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] text-slate-500 w-32" style={{ fontFamily: F }}>Name</span>
                        <span className="text-[12px] text-slate-900 font-medium text-right" style={{ fontFamily: F }}>{c.party}</span>
                      </div>
                      {c.category && (
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] text-slate-500 w-32" style={{ fontFamily: F }}>Category</span>
                          <span className="text-[12px] text-slate-900 text-right" style={{ fontFamily: F }}>{c.category}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isProcurement && (
                    <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5">
                      <h3 className="text-[13px] font-semibold text-indigo-900 mb-4 flex items-center gap-2" style={{ fontFamily: F }}>
                        <Link2 size={14} className="text-indigo-600" /> Procurement Traceability
                      </h3>
                      <div className="space-y-3">
                        {[
                          ["Source PR", c.sourcePR],
                          ["Sourcing Case", c.sourceSourcingCase],
                          ["Method", c.method],
                          ["Award Date", c.awardDate ? formatDate(c.awardDate) : "—"],
                        ].map(([label, val]) => (
                          <div key={label} className="flex items-start justify-between">
                            <span className="text-[11px] text-indigo-500 w-32" style={{ fontFamily: F }}>{label}</span>
                            <span className="text-[12px] text-indigo-900 font-medium text-right" style={{ fontFamily: F }}>{val}</span>
                          </div>
                        ))}
                      </div>
                      {c.comments && (
                        <div className="mt-3 pt-3 border-t border-indigo-200">
                          <p className="text-[11px] text-indigo-500 mb-1" style={{ fontFamily: F }}>Award Comments</p>
                          <p className="text-[12px] text-indigo-800" style={{ fontFamily: F }}>{c.comments}</p>
                        </div>
                      )}
                      {/* Visual trail */}
                      <div className="mt-4 flex items-center gap-0">
                        {[
                          { label: c.sourcePR || "", sub: "Purchase Req" },
                          { label: c.sourceSourcingCase || "", sub: "Sourcing" },
                          { label: c.contractNumber, sub: "Contract" },
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-0">
                            <div className="text-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold ${i === 2 ? "bg-indigo-600 text-white" : "bg-indigo-200 text-indigo-700"}`}>{i + 1}</div>
                              <p className="text-[9px] text-indigo-700 mt-1 font-medium" style={{ fontFamily: F }}>{step.label}</p>
                              <p className="text-[8px] text-indigo-400" style={{ fontFamily: F }}>{step.sub}</p>
                            </div>
                            {i < 2 && <div className="w-8 h-0.5 bg-indigo-300 mx-1 mt-[-16px]" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Digital Signature */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-[13px] font-semibold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: F }}>
                  <PenLine size={14} className="text-purple-700" /> Digital Signature
                </h3>
                {signedContracts[c.contractNumber] && signatureData ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span className="text-[12px] text-emerald-700" style={{ fontFamily: F }}>
                        Signed by {signatureData.employeeName} on {signedContracts[c.contractNumber]}
                      </span>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 inline-flex items-center justify-center">
                      <img src={signatureData.dataUrl} alt="Applied Signature" className="max-w-[200px] max-h-[80px] object-contain" />
                    </div>
                  </div>
                ) : signatureData ? (
                  <button
                    onClick={() => setShowSignModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-colors"
                    style={{ backgroundColor: "#0B01D0", fontFamily: F }}
                  >
                    <PenLine size={14} />
                    Apply My Signature
                  </button>
                ) : (
                  <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[12px] text-amber-800" style={{ fontFamily: F }}>No signature uploaded</p>
                      <p className="text-[11px] text-amber-600 mt-0.5" style={{ fontFamily: F }}>
                        Go to My Personal Information &rarr; My Signature tab to upload your signature.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DOCUMENTS TAB ── */}
          {detailTab === "documents" && (
            <div className="space-y-4">
              {c.storeId && (
                <div className="flex justify-end">
                  <button onClick={() => setShowUploadModal(true)}
                    className="px-3.5 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-1.5 hover:opacity-90"
                    style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                    <Upload size={13} /> Upload Document
                  </button>
                </div>
              )}

              {c.documents.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <Paperclip size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-[13px] text-slate-500" style={{ fontFamily: F }}>No documents attached.</p>
                  {c.storeId && <p className="text-[11px] text-slate-400 mt-1" style={{ fontFamily: F }}>Click "Upload Document" to attach files.</p>}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200">
                  <div className="px-5 py-3 border-b border-slate-100">
                    <h3 className="text-[13px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                      All Documents ({c.documents.length} groups, {totalDocs} versions)
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {c.documents.map(dg => {
                      const current = dg.versions[dg.versions.length - 1];
                      return (
                        <div key={dg.docId} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <FileText size={16} className="text-purple-600" />
                            </div>
                            <div>
                              <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{dg.label}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: F }}>
                                {current.name} &middot; v{current.version} &middot; {current.size} &middot; {current.uploadedBy} &middot; {formatDate(current.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {dg.versions.length > 1 && (
                              <button onClick={() => setVersionHistoryDoc(dg)}
                                className="px-2.5 py-1 rounded text-[10px] text-purple-600 bg-purple-50 hover:bg-purple-100 flex items-center gap-1 transition-colors"
                                style={{ fontFamily: F }}>
                                <History size={10} /> {dg.versions.length} versions
                              </button>
                            )}
                            <button className="p-1.5 rounded hover:bg-slate-100" title="Download"><Download size={14} className="text-slate-500" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AMENDMENTS TAB ── */}
          {detailTab === "amendments" && (
            <div className="space-y-4">
              {c.storeId && (
                <div className="flex justify-end">
                  <button onClick={() => setShowAmendModal(true)}
                    className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-purple-300 bg-purple-50 text-purple-700 flex items-center gap-1.5 hover:bg-purple-100"
                    style={{ fontFamily: F }}>
                    <Plus size={13} /> New Amendment
                  </button>
                </div>
              )}

              {(!c.amendments || c.amendments.length === 0) ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <Edit3 size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-[13px] text-slate-500" style={{ fontFamily: F }}>No amendments recorded.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {c.amendments.map(amd => (
                    <div key={amd.id} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-slate-900" style={{ fontFamily: F }}>{amd.amendmentNumber}</span>
                          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded",
                            amd.type === "Extension" ? "bg-blue-50 text-blue-700" :
                            amd.type === "Value Change" ? "bg-green-50 text-green-700" :
                            amd.type === "Scope Change" ? "bg-purple-50 text-purple-700" :
                            amd.type === "Termination" ? "bg-red-50 text-red-700" :
                            "bg-amber-50 text-amber-700"
                          )}>{amd.type}</span>
                        </div>
                        <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>{formatDate(amd.date)}</span>
                      </div>
                      <p className="text-[12px] text-slate-700 mb-2" style={{ fontFamily: F }}>{amd.description}</p>
                      {(amd.oldValue || amd.newValue) && (
                        <div className="flex items-center gap-3 text-[11px]">
                          {amd.oldValue && <span className="text-red-500 line-through" style={{ fontFamily: F }}>{amd.oldValue}</span>}
                          {amd.oldValue && amd.newValue && <ChevronRight size={12} className="text-slate-400" />}
                          {amd.newValue && <span className="text-green-600 font-medium" style={{ fontFamily: F }}>{amd.newValue}</span>}
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 mt-2" style={{ fontFamily: F }}>Approved by {amd.approvedBy}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TIMELINE TAB ── */}
          {detailTab === "timeline" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-[13px] font-semibold text-slate-900 mb-5" style={{ fontFamily: F }}>Contract Lifecycle</h3>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200" />
                {/* Award / Creation */}
                <TimelineItem date={c.awardDate || c.startDate} label={isProcurement ? "Contract Awarded" : "Contract Signed"}
                  desc={isProcurement ? `Awarded to ${c.party} via ${c.method}. Source: ${c.sourcePR} → ${c.sourceSourcingCase}` : `Signed with ${c.party}`}
                  color="bg-green-500" />
                {/* Start */}
                <TimelineItem date={c.startDate} label="Effective Date" desc="Contract term begins." color="bg-blue-500" />
                {/* Amendments */}
                {(c.amendments || []).map(amd => (
                  <TimelineItem key={amd.id} date={amd.date} label={`${amd.type}: ${amd.amendmentNumber}`}
                    desc={amd.description} color="bg-purple-500" />
                ))}
                {/* Documents */}
                {c.documents.map(dg => (
                  <TimelineItem key={dg.docId} date={dg.versions[0].date} label={`Document: ${dg.label}`}
                    desc={`${dg.versions[0].name} uploaded by ${dg.versions[0].uploadedBy}${dg.versions.length > 1 ? ` (${dg.versions.length} versions)` : ""}`}
                    color="bg-indigo-400" />
                ))}
                {/* End */}
                <TimelineItem date={c.endDate} label="Contract End Date"
                  desc={daysLeft > 0 ? `${daysLeft} days remaining` : "Contract has expired"}
                  color={daysLeft > 0 ? "bg-slate-400" : "bg-red-500"} />
              </div>
            </div>
          )}
        </div>

        {/* ── UPLOAD MODAL ── */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Upload Document</h3>
                <button onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadError(""); setUploadSuccess(false); }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="px-6 py-5">
                {uploadSuccess ? (
                  <div className="flex flex-col items-center py-6">
                    <CheckCircle2 size={36} className="text-green-600 mb-3" />
                    <p className="text-[14px] font-semibold text-green-800" style={{ fontFamily: F }}>Uploaded Successfully</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="text-[12px] font-medium text-slate-700 mb-1.5 block" style={{ fontFamily: F }}>Document Label *</label>
                      <input type="text" value={uploadLabel} onChange={e => setUploadLabel(e.target.value)}
                        placeholder="e.g. Signed Contract, Amendment, Invoice..."
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 outline-none focus:border-purple-400"
                        style={{ fontFamily: F }} />
                    </div>
                    <div className="border-2 border-dashed rounded-xl p-6 text-center bg-slate-50"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) setUploadFile(f); }}>
                      {uploadFile ? (
                        <div className="flex items-center gap-3 justify-center">
                          <FileText size={18} className="text-green-600" />
                          <span className="text-[12px] text-slate-900" style={{ fontFamily: F }}>{uploadFile.name}</span>
                          <button onClick={() => setUploadFile(null)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-400" /></button>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                          <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>Drag & drop or click Browse</p>
                          <input ref={fileInputRef} type="file" className="hidden" onChange={e => { if (e.target.files?.[0]) setUploadFile(e.target.files[0]); }} />
                          <button onClick={() => fileInputRef.current?.click()}
                            className="mt-2 px-4 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90"
                            style={{ backgroundColor: "#0B01D0", fontFamily: F }}>Browse Files</button>
                        </>
                      )}
                    </div>
                    {uploadError && <p className="mt-2 text-[11px] text-red-600 flex items-center gap-1" style={{ fontFamily: F }}><AlertTriangle size={11} /> {uploadError}</p>}
                  </>
                )}
              </div>
              {!uploadSuccess && (
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                  <button onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadError(""); }}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
                  <button onClick={handleUploadConfirm} disabled={!uploadFile || !uploadLabel}
                    className="px-5 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#0B01D0", fontFamily: F }}>Upload</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AMEND MODAL ── */}
        {showAmendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
              <div className="px-6 py-4 border-b border-purple-200 bg-purple-50 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Record Amendment</h3>
                <button onClick={() => setShowAmendModal(false)} className="p-1.5 hover:bg-purple-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="px-6 py-5 flex flex-col gap-4">
                <div>
                  <label className="text-[11px] text-slate-600 mb-1 block" style={{ fontFamily: F }}>Amendment Type *</label>
                  <select value={amendType} onChange={e => setAmendType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 bg-white focus:outline-none focus:border-purple-400" style={{ fontFamily: F }}>
                    <option>Extension</option><option>Value Change</option><option>Scope Change</option><option>Termination</option><option>Renewal</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 mb-1 block" style={{ fontFamily: F }}>Description *</label>
                  <textarea value={amendDesc} onChange={e => setAmendDesc(e.target.value)} rows={2}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none resize-none focus:border-purple-400"
                    style={{ fontFamily: F }} placeholder="Describe the amendment..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 mb-1 block" style={{ fontFamily: F }}>Previous Value</label>
                    <input type="text" value={amendOldVal} onChange={e => setAmendOldVal(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none focus:border-purple-400"
                      style={{ fontFamily: F }} placeholder="Optional" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 mb-1 block" style={{ fontFamily: F }}>New Value</label>
                    <input type="text" value={amendNewVal} onChange={e => setAmendNewVal(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none focus:border-purple-400"
                      style={{ fontFamily: F }} placeholder="Optional" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setShowAmendModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
                <button onClick={handleAmendSubmit} disabled={!amendDesc.trim()}
                  className="px-5 py-2 text-[12px] font-medium text-white rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: F }}>Record Amendment</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STATUS MODAL ── */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Change Status</h3>
                <button onClick={() => setShowStatusModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="px-6 py-5">
                <div className="space-y-2">
                  {(["Active", "Expiring Soon", "Expired", "Pending", "Terminated", "Renewed"] as ContractStatus[]).map(s => (
                    <label key={s} className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                      newStatus === s ? "border-purple-300 bg-purple-50" : "border-slate-200 hover:bg-slate-50"
                    }`}>
                      <input type="radio" name="status" checked={newStatus === s} onChange={() => setNewStatus(s)} className="accent-purple-700 w-4 h-4" />
                      <span className={cn("text-[12px] font-medium px-2 py-0.5 rounded", getStatusColor(s))}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
                <button onClick={handleStatusChange}
                  className="px-5 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>Update Status</button>
              </div>
            </div>
          </div>
        )}

        {/* ── VERSION HISTORY MODAL ── */}
        {versionHistoryDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Version History</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>{versionHistoryDoc.label}</p>
                </div>
                <button onClick={() => setVersionHistoryDoc(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="px-6 py-4 max-h-[400px] overflow-y-auto space-y-3">
                {[...versionHistoryDoc.versions].reverse().map((v, i) => (
                  <div key={v.id} className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${
                    i === 0 ? "border-green-200 bg-green-50/50" : "border-slate-100 bg-slate-50"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      i === 0 ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-500"
                    }`}><span className="text-[11px] font-semibold" style={{ fontFamily: F }}>v{v.version}</span></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-slate-900 truncate" style={{ fontFamily: F }}>{v.name}</p>
                      <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{v.uploadedBy} &middot; {formatDate(v.date)} &middot; {v.size}</p>
                    </div>
                    {i === 0 && <span className="text-[9px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded font-medium">Current</span>}
                    <button className="p-1 rounded hover:bg-slate-100"><Download size={13} className="text-slate-500" /></button>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-slate-200 flex justify-end">
                <button onClick={() => setVersionHistoryDoc(null)}
                  className="px-4 py-2 text-[12px] text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50" style={{ fontFamily: F }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════════════════
     LIST VIEW
     ════════════════════════════════════════════════════════════════════════════ */

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden" style={{ fontFamily: F }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: F }}>Contract Repository</h1>
            <p className="text-[12px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
              Manage all contracts across the organization. Procurement-sourced contracts are automatically linked from the Sourcing workflow.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90"
            style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
            <Download size={14} /> Export All
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {TAB_STATUSES.map(t => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors flex items-center gap-1.5 ${
                activeTab === t.key ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`} style={{ fontFamily: F }}>
              {t.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === t.key ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
              }`}>{tabCounts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input type="text" placeholder="Search by title, ID, party, PR..."
            value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ fontFamily: F }} />
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }}>
          <option>All Types</option>
          <option>Employment</option><option>Vendor</option><option>Service</option><option>NDA</option><option>Lease</option><option>Consultant</option><option>Works</option>
        </select>
        <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ fontFamily: F }}>
          <option>All Departments</option>
          <option>HR</option><option>IT</option><option>Admin</option><option>Legal</option><option>Projects</option><option>Procurement</option><option>Programs</option><option>Operations</option><option>Finance</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10" style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="px-4 py-3 text-left text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Contract ID</th>
              <th className="px-4 py-3 text-left text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Title</th>
              <th className="px-4 py-3 text-left text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Type</th>
              <th className="px-4 py-3 text-left text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Party/Vendor</th>
              <th className="px-4 py-3 text-left text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Start</th>
              <th className="px-4 py-3 text-left text-[11px] text-white font-semibold" style={{ fontFamily: F }}>End</th>
              <th className="px-4 py-3 text-right text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Value</th>
              <th className="px-4 py-3 text-center text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Status</th>
              <th className="px-4 py-3 text-left text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Dept</th>
              <th className="px-4 py-3 text-center text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Docs</th>
              <th className="px-4 py-3 text-center text-[11px] text-white font-semibold" style={{ fontFamily: F }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentContracts.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-12 text-[13px] text-slate-400" style={{ fontFamily: F }}>
                  No contracts match your filters.
                </td>
              </tr>
            ) : currentContracts.map((c, i) => (
              <tr key={c.contractNumber}
                className={cn("border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer",
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/50")}
                onClick={() => setSelectedContract(c)}>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-semibold text-[#0B01D0]" style={{ fontFamily: F }}>{c.contractNumber}</span>
                  {c.sourcePR && (
                    <span className="ml-1.5 text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
                      {c.sourcePR}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-[12px] text-slate-900 truncate max-w-[200px]" style={{ fontFamily: F }}>{c.title}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded", getTypeBadge(c.type))}>{c.type}</span>
                </td>
                <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{c.party}</td>
                <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{formatDate(c.startDate)}</td>
                <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{formatDate(c.endDate)}</td>
                <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium" style={{ fontFamily: F }}>
                  {c.value > 0 ? formatCurrency(c.value) : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn("inline-block px-2.5 py-0.5 rounded text-[10px] font-medium", getStatusColor(c.status))}>{c.status}</span>
                </td>
                <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{c.department}</td>
                <td className="px-4 py-3 text-center">
                  {c.documents.length > 0 ? (
                    <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded flex items-center justify-center gap-0.5 w-fit mx-auto">
                      <Paperclip size={9} /> {c.documents.length}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                  <div className="relative">
                    <button onClick={() => setActiveDropdown(activeDropdown === c.contractNumber ? null : c.contractNumber)}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors">
                      <MoreHorizontal size={15} className="text-slate-600" />
                    </button>
                    {activeDropdown === c.contractNumber && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <button onClick={() => { setSelectedContract(c); setActiveDropdown(null); }}
                            className="w-full text-left px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                            <Eye size={13} /> View Details
                          </button>
                          <button onClick={() => setActiveDropdown(null)}
                            className="w-full text-left px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                            <Download size={13} /> Download
                          </button>
                          <button onClick={() => setActiveDropdown(null)}
                            className="w-full text-left px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" style={{ fontFamily: F }}>
                            <RotateCcw size={13} /> Renew
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
        <span className="text-[12px] text-slate-500" style={{ fontFamily: F }}>
          {totalResults > 0 ? `${startIndex + 1}–${endIndex}` : "0"} of {totalResults} contracts
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            let pageNum: number;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;
            if (pageNum < 1 || pageNum > totalPages) return null;
            return (
              <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                className={cn("w-7 h-7 rounded-lg transition-colors text-[12px]",
                  currentPage === pageNum ? "text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50")}
                style={currentPage === pageNum ? { backgroundColor: "#0B01D0" } : undefined}>
                {pageNum}
              </button>
            );
          })}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </div>
      </div>
      {/* Sign Contract Modal */}
      {showSignModal && signatureData && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSignModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Apply Signature</h3>
              <button onClick={() => setShowSignModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>You are about to sign this contract with your personal signature:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Contract</span>
                  <span className="text-[11px] text-slate-900 font-medium" style={{ fontFamily: F }}>{selectedContract.contractNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Title</span>
                  <span className="text-[11px] text-slate-900" style={{ fontFamily: F }}>{selectedContract.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Value</span>
                  <span className="text-[11px] text-slate-900" style={{ fontFamily: F }}>{selectedContract.value > 0 ? formatCurrency(selectedContract.value) : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Signed By</span>
                  <span className="text-[11px] text-slate-900" style={{ fontFamily: F }}>{signatureData.employeeName}</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center">
                <img src={signatureData.dataUrl} alt="My Signature" className="max-w-[220px] max-h-[90px] object-contain" />
              </div>
              <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>By clicking "Confirm & Sign", you confirm this is your personal signature.</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setShowSignModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[12px] hover:bg-slate-200 transition-colors" style={{ fontFamily: F }}>
                Cancel
              </button>
              <button onClick={() => handleApplySignature(selectedContract.contractNumber)}
                className="px-4 py-2 text-white rounded-lg text-[12px] hover:opacity-90 transition-colors flex items-center gap-1.5"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                <PenLine size={13} />
                Confirm & Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractRepository;

/* ── Timeline helper component ── */
function TimelineItem({ date, label, desc, color }: { date: string; label: string; desc: string; color: string }) {
  return (
    <div className="relative flex items-start gap-4">
      <div className={`w-[9px] h-[9px] rounded-full ${color} ring-2 ring-white shrink-0 mt-1 -ml-[10px]`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{label}</p>
          <span className="text-[10px] text-slate-400 shrink-0" style={{ fontFamily: "Montserrat, sans-serif" }}>{formatDate(date)}</span>
        </div>
        <p className="text-[11px] text-slate-500" style={{ fontFamily: "Montserrat, sans-serif" }}>{desc}</p>
      </div>
    </div>
  );
}
