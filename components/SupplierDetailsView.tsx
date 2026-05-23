import { useState } from "react";
import {
  ArrowLeft, Star, ShieldCheck, ShieldAlert, ShieldBan, AlertTriangle,
  ClipboardCheck, X, ChevronRight, FileText, History, TrendingUp,
  CheckCircle2, XCircle, Clock, Building2, User
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════════ */

interface PerformanceScore {
  quality: number;
  timeliness: number;
  responsiveness: number;
  costManagement: number;
  compliance: number;
}

interface EvaluationRecord {
  id: string;
  date: string;
  evaluator: string;
  type: "Contract Close-out" | "Mid-Term Review";
  scores: PerformanceScore;
  avgScore: number;
  comments: string;
}

interface HistoricalRate {
  assignment: string;
  rate: number;
  rateType: "Daily" | "Monthly";
  period: string;
}

export interface SupplierDetailData {
  id: string;
  vendorId: string;
  type: "Firm" | "Individual";
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  subCategory: string;
  riskLevel: "Low" | "Medium" | "High";
  status: string;
  performance: PerformanceScore;
  totalOrders: number;
  totalSpend: number;
  documents: string[];
  documentExpiry?: Record<string, string>;
  dateOnboarded: string;
  registrationNumber?: string;
  taxId?: string;
  registeredAddress?: string;
  idType?: string;
  idNumber?: string;
  residentialAddress?: string;
  bankName?: string;
  expertAreas?: string[];
  historicalRates?: HistoricalRate[];
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  status: string;
}

// Legacy compat
interface LegacySupplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalSpend: number;
  status: string;
}

interface SupplierDetailsViewProps {
  supplier: LegacySupplier | SupplierDetailData;
  onBack: () => void;
  onStatusChange?: (vendorId: string, newStatus: string, reason: string) => void;
}

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "'Montserrat Variable', sans-serif";

function isRichData(s: any): s is SupplierDetailData {
  return "vendorId" in s && "performance" in s;
}

function avgScore(p: PerformanceScore) {
  const vals = [p.quality, p.timeliness, p.responsiveness, p.costManagement, p.compliance];
  const nonZero = vals.filter(v => v > 0);
  if (nonZero.length === 0) return 0;
  return +(nonZero.reduce((a, b) => a + b, 0) / nonZero.length).toFixed(1);
}

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

const CRITERIA = [
  { key: "quality" as const, label: "Quality of Deliverables", desc: "Accuracy, completeness, and standard of goods/services delivered" },
  { key: "timeliness" as const, label: "Timeliness", desc: "Adherence to agreed delivery schedules and milestones" },
  { key: "responsiveness" as const, label: "Responsiveness", desc: "Speed and quality of communication and issue resolution" },
  { key: "costManagement" as const, label: "Cost Management", desc: "Adherence to budget, fair pricing, and cost-effectiveness" },
  { key: "compliance" as const, label: "Compliance", desc: "Conformity with contract terms, regulations, and organizational policies" },
];

// Mock evaluation history
const MOCK_EVALUATIONS: EvaluationRecord[] = [
  {
    id: "ev-1", date: "2025-12-15", evaluator: "Ama Darko", type: "Contract Close-out",
    scores: { quality: 9.2, timeliness: 8.8, responsiveness: 9.0, costManagement: 8.5, compliance: 9.4 },
    avgScore: 9.0, comments: "Excellent performance across all deliverables. Vendor exceeded expectations on quality and compliance. Recommended for future contracts.",
  },
  {
    id: "ev-2", date: "2025-06-20", evaluator: "Kwame Boateng", type: "Mid-Term Review",
    scores: { quality: 8.5, timeliness: 7.0, responsiveness: 8.2, costManagement: 8.0, compliance: 8.8 },
    avgScore: 8.1, comments: "Good overall performance. Minor delays on some deliverables noted. Vendor was responsive in addressing concerns.",
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function SupplierDetailsView({ supplier, onBack, onStatusChange }: SupplierDetailsViewProps) {
  const rich = isRichData(supplier);

  const performance: PerformanceScore = rich
    ? supplier.performance
    : { quality: 0, timeliness: 0, responsiveness: 0, costManagement: 0, compliance: 0 };
  const avg = rich ? avgScore(performance) : (supplier as LegacySupplier).rating;
  const vendorId = rich ? supplier.vendorId : `VND-${supplier.id}`;
  const vendorType = rich ? supplier.type : "Firm";
  const subCategory = rich ? supplier.subCategory : "";
  const riskLevel = rich ? supplier.riskLevel : "Low";
  const dateOnboarded = rich ? supplier.dateOnboarded : "2022-01-01";
  const documents = rich ? supplier.documents : [];

  // State
  const [activeSection, setActiveSection] = useState<"overview" | "performance" | "orders" | "documents">("overview");
  const [showEvalForm, setShowEvalForm] = useState(false);
  const [showActionModal, setShowActionModal] = useState<"Flag" | "Suspend" | "Blacklist" | "Reactivate" | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionReasonError, setActionReasonError] = useState(false);

  // Evaluation form state
  const [evalType, setEvalType] = useState<"Contract Close-out" | "Mid-Term Review">("Contract Close-out");
  const [evalScores, setEvalScores] = useState<PerformanceScore>({
    quality: 5, timeliness: 5, responsiveness: 5, costManagement: 5, compliance: 5,
  });
  const [evalComments, setEvalComments] = useState<Record<string, string>>({
    quality: "", timeliness: "", responsiveness: "", costManagement: "", compliance: "",
  });
  const [evalGeneralComment, setEvalGeneralComment] = useState("");
  const [evalErrors, setEvalErrors] = useState<Record<string, boolean>>({});
  const [evalSubmitted, setEvalSubmitted] = useState(false);

  const statusBadge = getStatusBadge(supplier.status);

  // Mock PO data
  const purchaseOrders: PurchaseOrder[] = [
    { id: "1", poNumber: "PO-2024-156", orderDate: "2024-11-28", deliveryDate: "2024-12-15", amount: 45600, status: "Approved" },
    { id: "2", poNumber: "PO-2024-145", orderDate: "2024-11-15", deliveryDate: "2024-12-05", amount: 32400, status: "Received" },
    { id: "3", poNumber: "PO-2024-132", orderDate: "2024-10-20", deliveryDate: "2024-11-10", amount: 28900, status: "Received" },
    { id: "4", poNumber: "PO-2024-118", orderDate: "2024-09-25", deliveryDate: "2024-10-15", amount: 51200, status: "Received" },
    { id: "5", poNumber: "PO-2024-098", orderDate: "2024-08-12", deliveryDate: "2024-09-05", amount: 38700, status: "Received" },
  ];

  const getPOStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-50 text-green-600";
      case "Pending Approval": return "bg-orange-50 text-orange-600";
      case "Sent": return "bg-blue-50 text-blue-600";
      case "Received": return "bg-purple-50 text-purple-600";
      case "Cancelled": return "bg-red-50 text-red-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  // ── Handlers ──

  const handleActionConfirm = () => {
    if (!actionReason.trim()) {
      setActionReasonError(true);
      return;
    }
    if (onStatusChange && showActionModal) {
      const statusMap: Record<string, string> = {
        Flag: "Flagged", Suspend: "Suspended", Blacklist: "Blacklisted", Reactivate: "Pending Reactivation",
      };
      onStatusChange(vendorId, statusMap[showActionModal], actionReason);
    }
    console.log(`Action: ${showActionModal} — Vendor: ${vendorId} — Reason: ${actionReason}`);
    setShowActionModal(null);
    setActionReason("");
    setActionReasonError(false);
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
    setEvalSubmitted(true);
    console.log("Evaluation submitted:", { type: evalType, scores: evalScores, comments: evalComments, general: evalGeneralComment });
    setTimeout(() => {
      setShowEvalForm(false);
      setEvalSubmitted(false);
      setEvalScores({ quality: 5, timeliness: 5, responsiveness: 5, costManagement: 5, compliance: 5 });
      setEvalComments({ quality: "", timeliness: "", responsiveness: "", costManagement: "", compliance: "" });
      setEvalGeneralComment("");
    }, 1500);
  };

  const setScore = (key: keyof PerformanceScore, val: number) => {
    setEvalScores(prev => ({ ...prev, [key]: val }));
    if (val >= 4) setEvalErrors(prev => ({ ...prev, [key]: false }));
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
            {vendorType === "Firm" ? <Building2 size={18} /> : <User size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-[16px] font-semibold text-slate-900 truncate" style={{ fontFamily: F }}>
                {supplier.name || (supplier as any).legalBusinessName || (supplier as any).legalName}
              </h1>
              <span className="text-[11px] text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded shrink-0">{vendorId}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
              {supplier.category}{subCategory ? ` — ${subCategory}` : ""} &middot; Onboarded {formatDate(dateOnboarded)}
            </p>
          </div>
        </div>

        {/* ── Prominent Status Badge ── */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusBadge.bg}`}>
          <span className="text-[14px]">{statusBadge.emoji}</span>
          <span className="text-[12px] font-semibold" style={{ fontFamily: F }}>{statusBadge.label}</span>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
        {/* Section tabs - Document Vault style */}
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

        {/* Action Buttons — Procurement Mgmt / COO only */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEvalForm(true)}
            className="px-3.5 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#0B01D0", fontFamily: F }}
          >
            <ClipboardCheck size={14} /> Evaluate Performance
          </button>
          {supplier.status === "Active" && (
            <button onClick={() => setShowActionModal("Flag")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              style={{ fontFamily: F }}>
              <AlertTriangle size={13} /> Flag
            </button>
          )}
          {(supplier.status === "Active" || supplier.status === "Flagged") && (
            <button onClick={() => setShowActionModal("Suspend")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5"
              style={{ fontFamily: F }}>
              <ShieldAlert size={13} /> Suspend
            </button>
          )}
          {(supplier.status === "Active" || supplier.status === "Flagged" || supplier.status === "Suspended") && (
            <button onClick={() => setShowActionModal("Blacklist")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-slate-400 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              style={{ fontFamily: F }}>
              <ShieldBan size={13} /> Blacklist
            </button>
          )}
          {(supplier.status === "Flagged" || supplier.status === "Suspended" || supplier.status === "Blacklisted") && (
            <button onClick={() => setShowActionModal("Reactivate")}
              className="px-3 py-2 rounded-lg text-[12px] font-medium border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1.5"
              style={{ fontFamily: F }}>
              <ShieldCheck size={13} /> Reactivate
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-6">
        {/* ────────────── OVERVIEW TAB ────────────── */}
        {activeSection === "overview" && (
          <>
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
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Total Orders</p>
                <p className="text-[22px] font-semibold text-slate-900" style={{ fontFamily: F }}>{supplier.totalOrders}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Total Spend</p>
                <p className="text-[22px] font-semibold text-slate-900" style={{ fontFamily: F }}>{formatCurrency(supplier.totalSpend)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Risk Level</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium border ${getRiskColor(riskLevel)}`}>
                  {riskLevel}
                </span>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-[14px] font-semibold text-slate-900 mb-4" style={{ fontFamily: F }}>Vendor Information</h2>
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Contact Person</p>
                  <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.contactPerson}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Email</p>
                  <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.email}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Phone</p>
                  <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.phone}</p>
                </div>
                {rich && supplier.registrationNumber && (
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Registration #</p>
                    <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.registrationNumber}</p>
                  </div>
                )}
                {rich && supplier.taxId && (
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Tax ID</p>
                    <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.taxId}</p>
                  </div>
                )}
                {rich && supplier.registeredAddress && (
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Registered Address</p>
                    <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.registeredAddress}</p>
                  </div>
                )}
                {rich && supplier.idType && (
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>ID ({supplier.idType})</p>
                    <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.idNumber}</p>
                  </div>
                )}
                {rich && supplier.residentialAddress && (
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Residential Address</p>
                    <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.residentialAddress}</p>
                  </div>
                )}
                {rich && supplier.bankName && (
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: F }}>Bank</p>
                    <p className="text-[13px] text-slate-900" style={{ fontFamily: F }}>{supplier.bankName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Expert Areas (Individual only) */}
            {rich && supplier.expertAreas && supplier.expertAreas.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-[14px] font-semibold text-slate-900 mb-3" style={{ fontFamily: F }}>Expert Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {supplier.expertAreas.map(area => (
                    <span key={area} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px] font-medium" style={{ fontFamily: F }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Rates (Individual only) */}
            {rich && supplier.historicalRates && supplier.historicalRates.length > 0 && (
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
                    {supplier.historicalRates.map((hr, i) => (
                      <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                        <td className="py-2 px-3 text-[12px] text-slate-900" style={{ fontFamily: F }}>{hr.assignment}</td>
                        <td className="py-2 px-3 text-[12px] text-slate-900 text-right font-medium" style={{ fontFamily: F }}>
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(hr.rate)}
                        </td>
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
              <div className="bg-white rounded-xl border border-slate-200 p-6">
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
              </div>
              {avg > 0 ? (
                <div className="space-y-4">
                  {MOCK_EVALUATIONS.map(ev => (
                    <div key={ev.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                            ev.type === "Contract Close-out" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                          }`}>{ev.type}</span>
                          <span className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{formatDate(ev.date)}</span>
                          <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>by {ev.evaluator}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={13} className="text-amber-500 fill-amber-500" />
                          <span className={`text-[13px] font-semibold ${scoreColor(ev.avgScore)}`} style={{ fontFamily: F }}>{ev.avgScore.toFixed(1)}/10</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {CRITERIA.map(c => (
                          <div key={c.key} className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 w-[60px] truncate" style={{ fontFamily: F }}>{c.label.split(" ")[0]}</span>
                            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${scoreBg(ev.scores[c.key])}`} style={{ width: `${ev.scores[c.key] * 10}%` }} />
                            </div>
                            <span className="text-[10px] font-medium text-slate-600" style={{ fontFamily: F }}>{ev.scores[c.key]}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>{ev.comments}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[13px] text-slate-400" style={{ fontFamily: F }}>No evaluation history available.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ────────────── ORDERS TAB ────────────── */}
        {activeSection === "orders" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-[14px] font-semibold text-slate-900" style={{ fontFamily: F }}>Purchase Order History</h2>
            </div>
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>PO Number</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Order Date</th>
                  <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Delivery Date</th>
                  <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Amount</th>
                  <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: F }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po, i) => (
                  <tr key={po.id} className={`border-b border-slate-100 hover:bg-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-4 py-3 text-[12px] font-medium text-purple-700" style={{ fontFamily: F }}>{po.poNumber}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{formatDate(po.orderDate)}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: F }}>{formatDate(po.deliveryDate)}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-900 text-right font-medium" style={{ fontFamily: F }}>{formatCurrency(po.amount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getPOStatusColor(po.status)}`}>{po.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ────────────── DOCUMENTS TAB ────────────── */}
        {activeSection === "documents" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-[14px] font-semibold text-slate-900 mb-4" style={{ fontFamily: F }}>Onboarding & Compliance Documents</h2>
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc, i) => {
                  const expiry = rich && supplier.documentExpiry ? supplier.documentExpiry[doc] : undefined;
                  const isExpired = expiry ? new Date(expiry) < new Date() : false;
                  const isExpiringSoon = expiry ? (() => {
                    const exp = new Date(expiry);
                    const now = new Date();
                    const in30 = new Date();
                    in30.setDate(in30.getDate() + 30);
                    return exp >= now && exp <= in30;
                  })() : false;
                  return (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                      isExpired ? "bg-red-50 border-red-200" : isExpiringSoon ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isExpired ? "bg-red-100" : isExpiringSoon ? "bg-amber-100" : "bg-green-100"
                        }`}>
                          {isExpired ? <XCircle size={14} className="text-red-600" /> :
                           isExpiringSoon ? <Clock size={14} className="text-amber-600" /> :
                           <CheckCircle2 size={14} className="text-green-600" />}
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{doc}</p>
                          <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                            {isExpired ? <span className="text-red-500 font-medium">Expired {expiry}</span> :
                             isExpiringSoon ? <span className="text-amber-600 font-medium">Expiring {expiry}</span> :
                             expiry ? `Expires ${expiry}` : "Verified · Uploaded on file"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(isExpired || isExpiringSoon) && (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${isExpired ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                            {isExpired ? "EXPIRED" : "EXPIRING SOON"}
                          </span>
                        )}
                        <button className="text-[11px] text-purple-700 hover:underline" style={{ fontFamily: F }}>View</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400 text-center py-8" style={{ fontFamily: F }}>No documents on record.</p>
            )}
          </div>
        )}
      </div>

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
                  {supplier.name || (supplier as any).legalBusinessName} &middot; {vendorId}
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
                <h3 className="text-[16px] font-semibold text-slate-900 mb-1" style={{ fontFamily: F }}>Evaluation Submitted</h3>
                <p className="text-[12px] text-slate-500" style={{ fontFamily: F }}>
                  Performance scores have been recorded for {supplier.name || (supplier as any).legalBusinessName}.
                </p>
              </div>
            ) : (
              <>
                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {/* Evaluation Type */}
                  <div className="mb-6">
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
                    <p className="text-[12px] font-semibold text-slate-700 mb-2" style={{ fontFamily: F }}>General Comments & Recommendations</p>
                    <textarea
                      value={evalGeneralComment}
                      onChange={e => setEvalGeneralComment(e.target.value)}
                      rows={3}
                      placeholder="Overall assessment, recommended follow-up actions, suitability for future contracts..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:border-purple-400"
                      style={{ fontFamily: F }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Calculated Average:</span>
                    <span className={`text-[14px] font-semibold ${scoreColor(avgScore(evalScores))}`} style={{ fontFamily: F }}>
                      {avgScore(evalScores)}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowEvalForm(false)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 transition-colors"
                      style={{ fontFamily: F }}>
                      Cancel
                    </button>
                    <button onClick={handleEvalSubmit}
                      className="px-5 py-2 text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-opacity"
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
              showActionModal === "Reactivate" ? "border-green-200 bg-green-50" :
              showActionModal === "Flag" ? "border-amber-200 bg-amber-50" :
              showActionModal === "Suspend" ? "border-red-200 bg-red-50" :
              "border-slate-300 bg-slate-100"
            }`}>
              <div className="flex items-center gap-3">
                {showActionModal === "Flag" && <AlertTriangle size={20} className="text-amber-600" />}
                {showActionModal === "Suspend" && <ShieldAlert size={20} className="text-red-600" />}
                {showActionModal === "Blacklist" && <ShieldBan size={20} className="text-slate-700" />}
                {showActionModal === "Reactivate" && <ShieldCheck size={20} className="text-green-600" />}
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                    {showActionModal} Vendor
                  </h3>
                  <p className="text-[11px] text-slate-500" style={{ fontFamily: F }}>
                    {supplier.name || (supplier as any).legalBusinessName} ({vendorId})
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-[12px] text-slate-600 mb-1" style={{ fontFamily: F }}>
                {showActionModal === "Flag" && "Flagging this vendor will mark them for review. They will remain eligible for active sourcing but will be highlighted for monitoring."}
                {showActionModal === "Suspend" && "Suspending this vendor will immediately restrict them from participating in any active sourcing. This action can be reversed."}
                {showActionModal === "Blacklist" && "Blacklisting permanently restricts this vendor from all procurement activities. This is a severe action typically reserved for fraud or gross misconduct."}
                {showActionModal === "Reactivate" && "Reactivation requires management approval. Submitting will set the vendor status to Pending Reactivation. The vendor will not be eligible for sourcing until management approves."}
              </p>

              <div className="mt-4">
                <label className="text-[12px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1" style={{ fontFamily: F }}>
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={actionReason}
                  onChange={e => { setActionReason(e.target.value); if (e.target.value.trim()) setActionReasonError(false); }}
                  rows={3}
                  placeholder={
                    showActionModal === "Flag" ? "e.g., Repeated late deliveries on PO-2024-145..." :
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
                  showActionModal === "Reactivate" ? "bg-green-600" :
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
