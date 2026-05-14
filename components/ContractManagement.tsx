import { useState, useEffect } from "react";
import {
  Search, Download, ChevronDown, FileText, Eye, Plus, X,
  DollarSign, Users, Calendar, CheckCircle, Clock, AlertTriangle,
  ClipboardList, Star, Shield, Upload, Printer, BarChart3,
  ArrowRight, CircleDot, Edit2, Trash2, Send, Flag, Package,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  getContracts, subscribe, updateContract, updateContractStatus, registerContract, generateContractNumber,
  addAuditLog, addDeliverableToContract,
  type AwardedContract, type ContractDeliverable, type ContractInvoice,
  type ContractChangeRequest, type PerformanceEvaluation, type ContractCloseOut,
  type ContractCoordinator, type ContractMilestone, type AuditLogEntry,
} from "../lib/contractStore";

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const fmtDate = (s?: string) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

type TabKey = "all" | "active" | "variation" | "suspended" | "closed";
type DetailTab = "overview" | "deliverables" | "invoices" | "changes" | "performance" | "closeout" | "documents" | "audit";

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "Expiring Soon": "bg-amber-100 text-amber-700",
  Expired: "bg-slate-100 text-slate-600",
  Pending: "bg-blue-100 text-blue-700",
  Terminated: "bg-red-100 text-red-700",
  Renewed: "bg-indigo-100 text-indigo-700",
  Suspended: "bg-orange-100 text-orange-700",
  "Under Variation": "bg-purple-100 text-purple-700",
  Closed: "bg-slate-200 text-slate-600",
};

const DEL_COLORS: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-600",
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

const INV_COLORS: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "CC Reviewed": "bg-indigo-100 text-indigo-700",
  "Procurement Approved": "bg-purple-100 text-purple-700",
  "Supervisor Approved": "bg-amber-100 text-amber-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Queried: "bg-red-100 text-red-700",
};

const CR_COLORS: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-600",
  "Pending Approval": "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Implemented: "bg-blue-100 text-blue-700",
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function ContractManagement() {
  const [contracts, setContracts] = useState<AwardedContract[]>(getContracts());
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showCatDD, setShowCatDD] = useState(false);
  const [selectedContract, setSelectedContract] = useState<AwardedContract | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");

  // Modals
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);

  useEffect(() => {
    const unsub = subscribe(() => {
      const updated = getContracts();
      setContracts(updated);
      if (selectedContract) {
        const refreshed = updated.find(c => c.id === selectedContract.id);
        if (refreshed) setSelectedContract(refreshed);
      }
    });
    return unsub;
  }, [selectedContract]);

  const categories = ["All", "Goods", "Services", "Works", "Consultancy"];

  const filtered = contracts.filter(c => {
    if (activeTab === "active" && c.status !== "Active" && c.status !== "Expiring Soon") return false;
    if (activeTab === "variation" && c.status !== "Under Variation") return false;
    if (activeTab === "suspended" && c.status !== "Suspended") return false;
    if (activeTab === "closed" && c.status !== "Closed") return false;
    if (catFilter !== "All" && c.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.contractNumber.toLowerCase().includes(q) && !c.party.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All Contracts", count: contracts.length },
    { key: "active", label: "Active", count: contracts.filter(c => c.status === "Active" || c.status === "Expiring Soon").length },
    { key: "variation", label: "Under Variation", count: contracts.filter(c => c.status === "Under Variation").length },
    { key: "suspended", label: "Suspended", count: contracts.filter(c => c.status === "Suspended").length },
    { key: "closed", label: "Closed", count: contracts.filter(c => c.status === "Closed").length },
  ];

  // Dashboard metrics
  const totalValue = contracts.reduce((s, c) => s + c.value, 0);
  const activeContracts = contracts.filter(c => c.status === "Active" || c.status === "Under Variation" || c.status === "Expiring Soon").length;
  const pendingDeliverables = contracts.reduce((s, c) => s + (c.deliverables?.filter(d => d.status === "Pending" || d.status === "Submitted" || d.status === "Under Review").length || 0), 0);
  const overdueInvoices = contracts.reduce((s, c) => s + (c.invoices?.filter(i => i.status !== "Paid" && i.status !== "Queried").length || 0), 0);
  const pendingChanges = contracts.reduce((s, c) => s + (c.changeRequests?.filter(cr => cr.status === "Pending Approval" || cr.status === "Draft").length || 0), 0);
  const expiringContracts = contracts.filter(c => {
    if (c.status === "Closed" || c.status === "Terminated") return false;
    const daysLeft = Math.round((new Date(c.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= 60;
  });
  const pendingProcurement = contracts.reduce((s, c) => s + (c.invoices?.filter(i => i.status === "CC Reviewed").length || 0), 0);
  const pendingFinance = contracts.reduce((s, c) => s + (c.invoices?.filter(i => i.status === "Supervisor Approved").length || 0), 0);
  const pendingCC = contracts.reduce((s, c) => s + (c.invoices?.filter(i => i.status === "Submitted").length || 0) + (c.deliverables?.filter(d => d.status === "Pending").length || 0), 0);

  /* ═══ DETAIL VIEW ═══════════════════════════════════════════════════════════ */
  if (selectedContract) {
    const c = selectedContract;
    const deliverables = c.deliverables || [];
    const invoices = c.invoices || [];
    const changeRequests = c.changeRequests || [];
    const evaluations = c.performanceEvaluations || [];
    const closeOut = c.closeOut || { allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false, performanceFinalized: false, allDocsUploaded: false };
    const totalPaid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + (i.amountPaid || 0), 0);
    const balance = c.value - totalPaid;
    const delAccepted = deliverables.filter(d => d.status === "Accepted").length;
    const delTotal = deliverables.length;
    const perfScore = evaluations.length > 0 ? evaluations[evaluations.length - 1].overallScore : null;

    const detailTabs: { key: DetailTab; label: string; badge?: number }[] = [
      { key: "overview", label: "Overview" },
      { key: "deliverables", label: "Deliverables", badge: deliverables.filter(d => d.status !== "Accepted").length },
      { key: "invoices", label: "Invoices & Payments", badge: invoices.filter(i => i.status !== "Paid").length },
      { key: "changes", label: "Change Management", badge: changeRequests.filter(cr => cr.status === "Pending Approval").length },
      { key: "performance", label: "Performance" },
      { key: "closeout", label: "Close-Out" },
      { key: "documents", label: "Documents" },
      { key: "audit", label: "Audit Trail", badge: (c.auditLog || []).length },
    ];

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Detail header */}
        <div className="bg-white border-b border-slate-200 shrink-0">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => { setSelectedContract(null); setDetailTab("overview"); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <X size={18} />
                <span className="text-[13px] font-medium">Close</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[16px] font-semibold text-slate-900">{c.contractNumber}</h1>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STATUS_COLORS[c.status] || "bg-slate-100 text-slate-600")}>{c.status}</span>
                </div>
                <p className="text-[11px] text-slate-400">{c.title} — {c.party}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Printer size={13} /> Print</button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={13} /> Export</button>
            </div>
          </div>

          {/* Summary cards in detail */}
          <div className="px-6 pb-3 flex gap-3">
            {[
              { label: "Contract Value", value: fmt(c.value), icon: <DollarSign size={12} className="text-emerald-600" />, bg: "bg-emerald-50" },
              { label: "Paid", value: fmt(totalPaid), icon: <CheckCircle size={12} className="text-blue-600" />, bg: "bg-blue-50" },
              { label: "Balance", value: fmt(balance), icon: <DollarSign size={12} className="text-amber-600" />, bg: "bg-amber-50" },
              { label: "Deliverables", value: `${delAccepted}/${delTotal}`, icon: <Package size={12} className="text-purple-600" />, bg: "bg-purple-50" },
              { label: "Performance", value: perfScore ? `${perfScore.toFixed(1)}/10` : "—", icon: <Star size={12} className="text-amber-500" />, bg: "bg-amber-50" },
            ].map((card, i) => (
              <div key={i} className="flex-1 bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className={cn("w-5 h-5 rounded flex items-center justify-center", card.bg)}>{card.icon}</div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">{card.label}</span>
                </div>
                <p className="text-[15px] text-slate-800 font-semibold">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Detail tabs */}
          <div className="px-6 pb-0">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
              {detailTabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setDetailTab(t.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1.5 font-medium",
                    detailTab === t.key ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {t.label}
                  {t.badge !== undefined && t.badge > 0 && (
                    <span className={cn("px-1.5 py-0.5 rounded-full text-[9px]", detailTab === t.key ? "bg-white/20" : "bg-red-100 text-red-600")}>{t.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail body */}
        <div className="flex-1 overflow-auto">
          {/* ── OVERVIEW ── */}
          {detailTab === "overview" && (
            <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Contract Info */}
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><FileText size={13} className="text-[#0B01D0]" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Contract Information</h2>
                  </div>
                  <div className="p-5 divide-y divide-slate-100">
                    {[
                      ["Contract Number", c.contractNumber],
                      ["Title", c.title],
                      ["Vendor / Consultant", c.party],
                      ["Category", c.category],
                      ["Contract Type", c.contractType || "—"],
                      ["Method", c.method],
                      ["Payment Frequency", c.paymentFrequency || "—"],
                      ["Source PR", c.sourcePR],
                      ["Department", c.department],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex items-center justify-between py-2.5">
                        <span className="text-[11px] text-slate-500">{label}</span>
                        <span className="text-[11px] text-slate-800 font-medium text-right max-w-[55%] truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dates & Coordinators */}
                <div className="space-y-6">
                  <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center"><Calendar size={13} className="text-purple-600" /></div>
                      <h2 className="text-[13px] font-semibold text-slate-800">Key Dates</h2>
                    </div>
                    <div className="p-5 divide-y divide-slate-100">
                      {[
                        ["Award Date", fmtDate(c.awardDate)],
                        ["Start Date", fmtDate(c.startDate)],
                        ["End Date", fmtDate(c.endDate)],
                        ["Duration", `${Math.round((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`],
                      ].map(([label, value], i) => (
                        <div key={i} className="flex items-center justify-between py-2.5">
                          <span className="text-[11px] text-slate-500">{label}</span>
                          <span className="text-[11px] text-slate-800 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><Users size={13} className="text-emerald-600" /></div>
                      <h2 className="text-[13px] font-semibold text-slate-800">Contract Coordinators</h2>
                    </div>
                    <div className="p-5 space-y-3">
                      {(c.coordinators && c.coordinators.length > 0) ? c.coordinators.map(cc => (
                        <div key={cc.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-[#0B01D0]/10 flex items-center justify-center">
                            <span className="text-[10px] font-semibold text-[#0B01D0]">{cc.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-slate-800">{cc.name}</p>
                            <p className="text-[10px] text-slate-400">{cc.role} — {cc.email}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-[11px] text-slate-400 italic">No coordinators assigned</p>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              {/* Milestone Timeline */}
              {c.milestones.length > 0 && (
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><ClipboardList size={13} className="text-amber-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Milestones</h2>
                  </div>
                  <div className="p-5">
                    <div className="relative">
                      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200" />
                      <div className="space-y-4">
                        {c.milestones.map(ms => (
                          <div key={ms.id} className="flex items-start gap-4 relative">
                            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white", ms.completed ? "bg-emerald-500" : "bg-slate-200")}>
                              {ms.completed ? <CheckCircle size={14} className="text-white" /> : <CircleDot size={14} className="text-slate-400" />}
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className={cn("text-[12px] font-medium", ms.completed ? "text-slate-800" : "text-slate-500")}>{ms.label}</p>
                              <p className="text-[10px] text-slate-400">{fmtDate(ms.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Delivery Schedule (Goods) */}
              {c.deliverySchedule && c.deliverySchedule.length > 0 && (
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-blue-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"><Package size={13} className="text-blue-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Delivery Schedule</h2>
                  </div>
                  <div className="p-5">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {["Item", "Quantity", "Expected Date"].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {c.deliverySchedule.map((d, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="px-3 py-2 text-[11px] text-slate-700">{d.item}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-600">{d.quantity}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-600">{fmtDate(d.expectedDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Payment Schedule */}
              {c.paymentSchedule && c.paymentSchedule.length > 0 && (
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><DollarSign size={13} className="text-emerald-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Payment Schedule</h2>
                  </div>
                  <div className="p-5">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {["Description", "Amount", "Due Date", "Linked To"].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {c.paymentSchedule.map((p, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="px-3 py-2 text-[11px] text-slate-700">{p.description}</td>
                            <td className="px-3 py-2 text-[11px] text-emerald-700 font-medium">{fmt(p.amount)}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-600">{fmtDate(p.dueDate)}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-500">{p.linkedTo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── DELIVERABLES ── */}
          {detailTab === "deliverables" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">{deliverables.length} deliverable(s) — {deliverables.filter(d => d.status === "Accepted").length} accepted</p>
                <button onClick={() => setShowDeliverableModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                  <Plus size={12} /> Upload Deliverable
                </button>
              </div>
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    {["Milestone", "Description", "Due Date", "Actual Date", "Status", "Amount", "Documents", "Comments"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliverables.map((d, i) => {
                    const ms = c.milestones.find(m => m.id === d.milestoneRef);
                    return (
                      <tr key={d.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                        <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{ms?.label || d.milestoneRef}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600 max-w-[200px]">{d.description}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(d.dueDate)}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(d.actualDate)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", DEL_COLORS[d.status] || "bg-slate-100 text-slate-600")}>{d.status}</span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{d.amount ? fmt(d.amount) : "—"}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-500">{d.documents.length > 0 ? `${d.documents.length} file(s)` : "—"}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-500 max-w-[160px] truncate">{d.comments || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {deliverables.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Package size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No deliverables recorded yet</p>
                </div>
              )}
            </div>
          )}

          {/* ── INVOICES & PAYMENTS ── */}
          {detailTab === "invoices" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-[12px] text-slate-500">Total Paid: <span className="font-semibold text-emerald-600">{fmt(totalPaid)}</span></p>
                  <div className="h-4 w-px bg-slate-200" />
                  <p className="text-[12px] text-slate-500">Remaining: <span className="font-semibold text-amber-600">{fmt(balance)}</span></p>
                </div>
                <button onClick={() => setShowInvoiceModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                  <Plus size={12} /> Record Invoice
                </button>
              </div>
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    {["Invoice #", "Vendor", "Amount", "Submitted", "Via", "Status", "Reviewed By", "Approved By", "Paid Date", "Amount Paid"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv, i) => (
                    <tr key={inv.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                      <td className="px-4 py-3 text-[11px] text-[#0B01D0] font-medium">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-700">{inv.vendor}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{fmt(inv.amount)}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(inv.dateSubmitted)}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">{inv.submittedVia}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", INV_COLORS[inv.status])}>{inv.status}</span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">{inv.reviewedBy || "—"}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">{inv.approvedBy || "—"}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(inv.datePaid)}</td>
                      <td className="px-4 py-3 text-[11px] text-emerald-600 font-medium">{inv.amountPaid ? fmt(inv.amountPaid) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {invoices.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <DollarSign size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No invoices recorded yet</p>
                </div>
              )}

              {/* ── FINANCE INTEGRATION SECTION ── */}
              <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
                {/* Remaining Balance */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-amber-600 uppercase tracking-wider font-semibold mb-1">Remaining Balance</p>
                    <p className="text-[28px] font-bold text-amber-700">{fmt(balance)}</p>
                    <p className="text-[11px] text-amber-600 mt-0.5">Contract Value {fmt(c.value)} — Total Paid {fmt(totalPaid)}</p>
                  </div>
                  <DollarSign size={32} className="text-amber-300" />
                </div>

                {/* Budget & Funding Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Budget Line</p>
                    <p className="text-[13px] text-slate-800 font-semibold">{c.budgetLine || "Not assigned"}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Funding Source</p>
                    <p className="text-[13px] text-slate-800 font-semibold">{c.fundingSource || "Not assigned"}</p>
                  </div>
                </div>

                {/* Payment Processing — only Supervisor Approved invoices get the Process Payment form */}
                {invoices.filter(inv => inv.status === "Supervisor Approved").length > 0 && (
                  <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><DollarSign size={13} className="text-emerald-600" /></div>
                      <h2 className="text-[13px] font-semibold text-slate-800">Payment Processing</h2>
                      <span className="ml-auto text-[10px] text-emerald-600 font-medium">{invoices.filter(inv => inv.status === "Supervisor Approved").length} invoice(s) ready for payment</span>
                    </div>
                    <div className="p-5 space-y-4">
                      {invoices.filter(inv => inv.status === "Supervisor Approved").map(inv => (
                        <PaymentProcessingCard key={inv.id} invoice={inv} contract={c} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Invoices in pipeline (not yet Supervisor Approved, not Paid/Queried) */}
                {invoices.filter(inv => inv.status !== "Paid" && inv.status !== "Queried" && inv.status !== "Supervisor Approved").length > 0 && (
                  <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-blue-50 border-b border-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"><Clock size={13} className="text-blue-600" /></div>
                      <h2 className="text-[13px] font-semibold text-slate-800">Invoices in Approval Pipeline</h2>
                    </div>
                    <div className="p-5 space-y-2">
                      {invoices.filter(inv => inv.status !== "Paid" && inv.status !== "Queried" && inv.status !== "Supervisor Approved").map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-slate-800">{inv.invoiceNumber}</span>
                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", INV_COLORS[inv.status])}>{inv.status}</span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-700">{fmt(inv.amount)}</span>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-400 pt-1">Invoices must reach &quot;Supervisor Approved&quot; status before payment can be processed.</p>
                    </div>
                  </section>
                )}

                {/* Paid Invoices Summary */}
                {invoices.filter(inv => inv.status === "Paid").length > 0 && (
                  <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><CheckCircle size={13} className="text-emerald-600" /></div>
                      <h2 className="text-[13px] font-semibold text-slate-800">Completed Payments</h2>
                    </div>
                    <div className="p-5 space-y-2">
                      {invoices.filter(inv => inv.status === "Paid").map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-slate-800">{inv.invoiceNumber}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">Paid</span>
                            {inv.paymentMethod && <span className="text-[10px] text-slate-500">{inv.paymentMethod}</span>}
                            {inv.referenceNumber && <span className="text-[10px] text-slate-400">Ref: {inv.referenceNumber}</span>}
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-medium text-emerald-700">{fmt(inv.amountPaid || inv.amount)}</span>
                            {inv.datePaid && <p className="text-[9px] text-slate-400">{fmtDate(inv.datePaid)}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}

          {/* ── CHANGE MANAGEMENT ── */}
          {detailTab === "changes" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">{changeRequests.length} change request(s)</p>
                <button onClick={() => setShowChangeModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                  <Plus size={12} /> New Change Request
                </button>
              </div>
              {changeRequests.length > 0 ? (
                <div className="max-w-5xl mx-auto py-6 px-4 space-y-4">
                  {changeRequests.map(cr => (
                    <div key={cr.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-semibold text-slate-800">Amendment #{cr.changeNumber}</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", CR_COLORS[cr.status])}>{cr.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Requested {fmtDate(cr.requestedDate)} by {cr.requestedBy}</p>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          {cr.types.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium">{t}</span>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Reason</p>
                            <p className="text-[11px] text-slate-700">{cr.reason}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Description</p>
                            <p className="text-[11px] text-slate-700">{cr.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3 pt-2">
                          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Cost Impact</p>
                            <p className="text-[13px] font-semibold text-slate-800">{fmt(cr.estimatedCostImpact)}</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Time Impact</p>
                            <p className="text-[13px] font-semibold text-slate-800">{cr.estimatedTimeImpact}</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised Value</p>
                            <p className="text-[13px] font-semibold text-emerald-600">{cr.revisedValue ? fmt(cr.revisedValue) : "—"}</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised End Date</p>
                            <p className="text-[13px] font-semibold text-slate-800">{cr.revisedEndDate ? fmtDate(cr.revisedEndDate) : "—"}</p>
                          </div>
                        </div>
                        {cr.supportingDocs.length > 0 && (
                          <div className="pt-2">
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1.5">Supporting Documents</p>
                            <div className="flex flex-wrap gap-2">
                              {cr.supportingDocs.map((doc, i) => (
                                <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600">
                                  <FileText size={10} /> {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {cr.approvedBy && (
                          <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-600">
                            <CheckCircle size={12} /> Approved by {cr.approvedBy} on {fmtDate(cr.approvedDate)}
                          </div>
                        )}
                        {(cr.status === "Approved" || cr.status === "Implemented") && (
                          <div className="mt-3 bg-emerald-50 rounded-lg border border-emerald-200 p-4">
                            <p className="text-[11px] font-bold text-emerald-800 mb-3 flex items-center gap-1.5"><BarChart3 size={13} /> Impact Summary</p>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-white rounded-lg p-2.5 border border-emerald-100 text-center">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised Contract Value</p>
                                <p className="text-[14px] font-semibold text-emerald-700">{cr.revisedValue ? fmt(cr.revisedValue) : fmt(c.value)}</p>
                              </div>
                              <div className="bg-white rounded-lg p-2.5 border border-emerald-100 text-center">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised End Date</p>
                                <p className="text-[14px] font-semibold text-slate-800">{cr.revisedEndDate ? fmtDate(cr.revisedEndDate) : fmtDate(c.endDate)}</p>
                              </div>
                              <div className="bg-white rounded-lg p-2.5 border border-emerald-100 text-center">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Updated Deliverables Schedule</p>
                                <p className="text-[14px] font-semibold text-slate-800">{cr.estimatedTimeImpact !== "None" ? `Extended by ${cr.estimatedTimeImpact}` : "No change"}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {cr.status === "Pending Approval" && (
                          <div className="pt-2 flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-medium hover:bg-emerald-700"><CheckCircle size={12} /> Approve</button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[11px] font-medium hover:bg-red-700"><X size={12} /> Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Edit2 size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No change requests for this contract</p>
                </div>
              )}
            </div>
          )}

          {/* ── PERFORMANCE ── */}
          {detailTab === "performance" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">{evaluations.length} evaluation(s)</p>
                <button onClick={() => setShowEvalModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                  <Plus size={12} /> New Evaluation
                </button>
              </div>
              {evaluations.length > 0 ? (
                <div className="max-w-5xl mx-auto py-6 px-4 space-y-4">
                  {evaluations.map(ev => (
                    <div key={ev.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Star size={14} className="text-amber-500" />
                          <span className="text-[13px] font-semibold text-slate-800">{ev.evaluationType} Evaluation</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium",
                            ev.status === "Final" ? "bg-emerald-100 text-emerald-700" :
                            ev.status === "Supervisor Approved" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-600"
                          )}>{ev.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{fmtDate(ev.evaluationDate)}</p>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Overall Score</p>
                            <p className={cn("text-[22px] font-semibold", ev.overallScore >= 7 ? "text-emerald-600" : ev.overallScore >= 5 ? "text-amber-600" : "text-red-600")}>{ev.overallScore.toFixed(1)}<span className="text-[12px] text-slate-400">/10</span></p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Evaluator</p>
                            <p className="text-[13px] font-semibold text-slate-800">{ev.evaluator}</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Supervisor</p>
                            <p className="text-[13px] font-semibold text-slate-800">{ev.supervisorApproval || "Pending"}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Criteria Scores (1–10 Likert Scale)</p>
                          <div className="space-y-2">
                            {ev.criteria.map((cr, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-[11px] text-slate-600 w-[180px] shrink-0">{cr.name}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                                  <div className={cn("h-2.5 rounded-full", cr.score >= 8 ? "bg-emerald-500" : cr.score >= 5 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${(cr.score / cr.maxScore) * 100}%` }} />
                                </div>
                                <span className="text-[11px] font-medium text-slate-700 w-8 text-right">{cr.score}/{cr.maxScore}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {ev.comments && (
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Comments</p>
                            <p className="text-[11px] text-slate-700">{ev.comments}</p>
                          </div>
                        )}
                        {ev.overallScore < 5 && (
                          <div className="space-y-2">
                            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg">
                              <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-[12px] text-red-800 font-bold">POOR PERFORMANCE FLAGGED</p>
                                <p className="text-[11px] text-red-700 mt-0.5">This vendor scored below 5.0. Future sourcing engagement requires management approval.</p>
                              </div>
                            </div>
                            {!ev.vendorFlagged ? (
                              <button
                                onClick={() => {
                                  const updatedEvals = (c.performanceEvaluations || []).map(e =>
                                    e.id === ev.id ? { ...e, vendorFlagged: true } : e
                                  );
                                  updateContract(c.id, { performanceEvaluations: updatedEvals });
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[11px] font-medium hover:bg-red-700"
                              >
                                <Flag size={12} /> Flag Vendor
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-[11px] text-red-600 font-medium">
                                <Flag size={12} /> Vendor has been flagged for management review
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Star size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No performance evaluations yet</p>
                </div>
              )}
            </div>
          )}

          {/* ── CLOSE-OUT ── */}
          {detailTab === "closeout" && (() => {
            const checklistItems = [closeOut.allDeliverablesCompleted, closeOut.procurementCompliance, closeOut.allPaymentsCompleted, closeOut.performanceFinalized, closeOut.allDocsUploaded];
            const checkedCount = checklistItems.filter(Boolean).length;
            const allChecked = checkedCount === 5;
            const hasCertificate = !!closeOut.completionCertificate;
            const hasReport = !!closeOut.closureReport;
            const canClose = allChecked && hasCertificate && hasReport;
            return (
            <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
              {/* Progress Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-semibold text-slate-800">Close-Out Progress</p>
                  <p className="text-[12px] font-semibold text-slate-600">{checkedCount}/5 items completed</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={cn("h-3 rounded-full transition-all duration-500", checkedCount === 5 ? "bg-emerald-500" : checkedCount >= 3 ? "bg-amber-500" : "bg-red-400")}
                    style={{ width: `${(checkedCount / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">{checkedCount === 5 ? "All checklist items completed" : `${5 - checkedCount} item(s) remaining`}</p>
              </div>

              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><Shield size={13} className="text-[#0B01D0]" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Contract Close-Out Checklist</h2>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { key: "allDeliverablesCompleted" as keyof ContractCloseOut, label: "All deliverables completed & accepted", who: "Contract Coordinator" },
                    { key: "procurementCompliance" as keyof ContractCloseOut, label: "Procurement confirms compliance with terms", who: "Procurement" },
                    { key: "allPaymentsCompleted" as keyof ContractCloseOut, label: "All payments completed", who: "Finance" },
                    { key: "performanceFinalized" as keyof ContractCloseOut, label: "Vendor performance evaluation finalized", who: "CC + Supervisor" },
                    { key: "allDocsUploaded" as keyof ContractCloseOut, label: "All documents uploaded (deliverables, reports, certificates)", who: "Contract Coordinator" },
                  ].map(item => {
                    const checked = closeOut[item.key] as boolean;
                    return (
                      <div key={item.key} className={cn("flex items-center gap-3 p-3 rounded-lg border transition-colors", checked ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200")}>
                        <button
                          onClick={() => {
                            const updated = { ...closeOut, [item.key]: !checked };
                            updateContract(c.id, { closeOut: updated });
                          }}
                          className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0", checked ? "bg-emerald-500 border-emerald-500" : "border-slate-300")}
                        >
                          {checked && <CheckCircle size={12} className="text-white" />}
                        </button>
                        <div className="flex-1">
                          <p className={cn("text-[12px] font-medium", checked ? "text-emerald-800 line-through" : "text-slate-700")}>{item.label}</p>
                          <p className="text-[10px] text-slate-400">Responsible: {item.who}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Generate Documents Section */}
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><FileText size={13} className="text-emerald-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Closure Documents</h2>
                </div>
                <div className="p-5 space-y-4">
                  {/* Generate buttons */}
                  {c.status !== "Closed" && (
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => {
                          if (!closeOut.completionCertificate) {
                            updateContract(c.id, {
                              closeOut: { ...closeOut, completionCertificate: `CompletionCert_${c.contractNumber}.pdf` },
                            });
                          }
                        }}
                        disabled={!!closeOut.completionCertificate}
                        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium", closeOut.completionCertificate ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700")}
                      >
                        <CheckCircle size={12} /> {closeOut.completionCertificate ? "Certificate Generated" : "Generate Certificate"}
                      </button>
                      <button
                        onClick={() => {
                          if (!closeOut.closureReport) {
                            updateContract(c.id, {
                              closeOut: { ...closeOut, closureReport: `ClosureReport_${c.contractNumber}.pdf` },
                            });
                          }
                        }}
                        disabled={!!closeOut.closureReport}
                        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium", closeOut.closureReport ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700")}
                      >
                        <FileText size={12} /> {closeOut.closureReport ? "Report Generated" : "Generate Closure Report"}
                      </button>
                    </div>
                  )}

                  {/* ── Certificate of Completion Template Preview ── */}
                  {closeOut.completionCertificate && (
                    <div className="border-2 border-emerald-200 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 text-center">
                        <p className="text-[10px] text-emerald-200 uppercase tracking-[3px] font-semibold">Certificate of Completion</p>
                        <p className="text-[18px] text-white font-bold mt-1">ACET Procurement</p>
                      </div>
                      <div className="bg-white px-6 py-5 space-y-4">
                        <div className="text-center pb-3 border-b border-slate-100">
                          <p className="text-[11px] text-slate-500">This certifies that all obligations under the following contract have been fulfilled.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                          {[
                            ["Contract #", c.contractNumber],
                            ["Vendor / Consultant", c.party],
                            ["Contract Value", fmt(c.value)],
                            ["Category", c.category],
                            ["Start Date", fmtDate(c.startDate)],
                            ["End Date", fmtDate(c.endDate)],
                          ].map(([label, value], i) => (
                            <div key={i} className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-100">
                              <span className="text-[10px] text-slate-400 font-medium">{label}</span>
                              <span className="text-[11px] text-slate-800 font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
                          <CheckCircle size={16} className="text-emerald-600 mx-auto mb-1" />
                          <p className="text-[11px] text-emerald-800 font-semibold">All deliverables completed and accepted</p>
                          <p className="text-[10px] text-emerald-600 mt-0.5">All payments processed and settled</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-3 border-t border-slate-100">
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400 font-medium mb-1">Date of Certification</p>
                            <p className="text-[12px] text-slate-800 font-semibold">{fmtDate(closeOut.closedDate || new Date().toISOString().split("T")[0])}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400 font-medium mb-1">Signed By</p>
                            <p className="text-[12px] text-slate-800 font-semibold">{closeOut.closedBy || c.owner || "Contract Coordinator"}</p>
                            <div className="mt-2 border-t border-slate-300 w-32 mx-auto" />
                            <p className="text-[9px] text-slate-400 mt-0.5">Authorized Signatory</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 px-6 py-2 flex items-center justify-between border-t border-slate-200">
                        <p className="text-[9px] text-slate-400">{closeOut.completionCertificate}</p>
                        <button className="text-[10px] text-[#0B01D0] font-medium flex items-center gap-1"><Printer size={10} /> Print</button>
                      </div>
                    </div>
                  )}

                  {/* ── Contract Closure Report Template Preview ── */}
                  {closeOut.closureReport && (() => {
                    const reportDeliverables = deliverables;
                    const reportDelAccepted = reportDeliverables.filter(d => d.status === "Accepted").length;
                    const reportDelTotal = reportDeliverables.length;
                    const reportInvoices = invoices;
                    const reportTotalPaid = reportInvoices.filter(i => i.status === "Paid").reduce((s, i) => s + (i.amountPaid || 0), 0);
                    const reportEvaluations = evaluations;
                    const reportLatestScore = reportEvaluations.length > 0 ? reportEvaluations[reportEvaluations.length - 1].overallScore : null;
                    const reportChanges = changeRequests;
                    const reportAmendments = reportChanges.filter(cr => cr.status === "Approved" || cr.status === "Implemented").length;
                    return (
                    <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <p className="text-[10px] text-blue-200 uppercase tracking-[3px] font-semibold">Contract Closure Report</p>
                        <p className="text-[16px] text-white font-bold mt-1">{c.contractNumber} — {c.title}</p>
                        <p className="text-[11px] text-blue-200 mt-0.5">{c.party} | {c.category}</p>
                      </div>
                      <div className="bg-white px-6 py-5 space-y-5">
                        {/* Contract Summary */}
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText size={11} /> Contract Summary</p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                            {[
                              ["Contract Number", c.contractNumber],
                              ["Vendor", c.party],
                              ["Category", c.category],
                              ["Method", c.method],
                              ["Contract Value", fmt(c.value)],
                              ["Duration", `${fmtDate(c.startDate)} — ${fmtDate(c.endDate)}`],
                              ["Department", c.department],
                              ["Contract Type", c.contractType || "—"],
                            ].map(([label, value], i) => (
                              <div key={i} className="flex justify-between items-center py-1 border-b border-dashed border-slate-100">
                                <span className="text-[10px] text-slate-400">{label}</span>
                                <span className="text-[10px] text-slate-700 font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Deliverables Summary */}
                        <div className="bg-purple-50 rounded-lg p-3.5 border border-purple-100">
                          <p className="text-[10px] text-purple-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Package size={11} /> Deliverables Summary</p>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-[20px] font-bold text-purple-700">{reportDelAccepted}<span className="text-[12px] text-purple-400">/{reportDelTotal}</span></p>
                              <p className="text-[9px] text-purple-500">Completed</p>
                            </div>
                            <div className="flex-1 bg-purple-100 rounded-full h-2.5">
                              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: reportDelTotal > 0 ? `${(reportDelAccepted / reportDelTotal) * 100}%` : "0%" }} />
                            </div>
                            <p className="text-[10px] text-purple-600 font-medium">{reportDelTotal > 0 ? Math.round((reportDelAccepted / reportDelTotal) * 100) : 0}%</p>
                          </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-emerald-50 rounded-lg p-3.5 border border-emerald-100">
                          <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><DollarSign size={11} /> Payment Summary</p>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <p className="text-[14px] font-bold text-emerald-700">{fmt(reportTotalPaid)}</p>
                              <p className="text-[9px] text-emerald-500">Total Paid</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[14px] font-bold text-slate-700">{fmt(c.value)}</p>
                              <p className="text-[9px] text-slate-400">Contract Value</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[14px] font-bold text-amber-600">{fmt(c.value - reportTotalPaid)}</p>
                              <p className="text-[9px] text-amber-500">Remaining</p>
                            </div>
                          </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="bg-amber-50 rounded-lg p-3.5 border border-amber-100">
                          <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Star size={11} /> Performance Summary</p>
                          {reportLatestScore !== null ? (
                            <div className="flex items-center gap-3">
                              <p className={cn("text-[20px] font-bold", reportLatestScore >= 7 ? "text-emerald-600" : reportLatestScore >= 5 ? "text-amber-600" : "text-red-600")}>{reportLatestScore.toFixed(1)}<span className="text-[12px] text-slate-400">/10</span></p>
                              <p className="text-[10px] text-slate-500">{reportEvaluations.length} evaluation(s) on record</p>
                              {reportLatestScore < 5 && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-semibold">Poor Performer</span>}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400 italic">No evaluations recorded</p>
                          )}
                        </div>

                        {/* Change Management Summary */}
                        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Edit2 size={11} /> Change Management Summary</p>
                          <div className="flex items-center gap-4">
                            <p className="text-[20px] font-bold text-slate-700">{reportChanges.length}</p>
                            <div className="text-[10px] text-slate-500">
                              <p>Total change requests ({reportAmendments} approved/implemented)</p>
                              {reportChanges.length > 0 && <p className="text-slate-400 mt-0.5">Types: {[...new Set(reportChanges.flatMap(cr => cr.types))].join(", ")}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Key Dates */}
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar size={11} /> Key Dates</p>
                          <div className="grid grid-cols-4 gap-3">
                            {[
                              ["Award Date", fmtDate(c.awardDate)],
                              ["Start Date", fmtDate(c.startDate)],
                              ["End Date", fmtDate(c.endDate)],
                              ["Close Date", fmtDate(closeOut.closedDate || new Date().toISOString().split("T")[0])],
                            ].map(([label, value], i) => (
                              <div key={i} className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-center">
                                <p className="text-[9px] text-slate-400 font-medium">{label}</p>
                                <p className="text-[11px] text-slate-800 font-semibold">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 px-6 py-2 flex items-center justify-between border-t border-slate-200">
                        <p className="text-[9px] text-slate-400">{closeOut.closureReport}</p>
                        <button className="text-[10px] text-[#0B01D0] font-medium flex items-center gap-1"><Printer size={10} /> Print</button>
                      </div>
                    </div>
                    );
                  })()}

                  {closeOut.closedDate && (
                    <p className="text-[10px] text-slate-400 pt-2">Closed on {fmtDate(closeOut.closedDate)} by {closeOut.closedBy}</p>
                  )}
                </div>
              </section>

              {/* Close contract button — only visible when ALL conditions met */}
              {c.status !== "Closed" && canClose && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const today = new Date().toISOString().split("T")[0];
                      updateContract(c.id, {
                        status: "Closed",
                        closeOut: { ...closeOut, closedDate: today, closedBy: "Current User" },
                      });
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-medium"
                  >
                    <Shield size={13} /> Close Contract
                  </button>
                </div>
              )}
              {c.status !== "Closed" && !canClose && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                  <p className="text-[11px] text-amber-700 font-medium">To close this contract, complete all 5 checklist items and generate both the Completion Certificate and Closure Report.</p>
                </div>
              )}
            </div>
            );
          })()}

          {/* ── DOCUMENTS ── */}
          {detailTab === "documents" && (
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    {["Document", "File Name", "Uploaded By", "Date", "Type", "Size", "Version"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {c.documents.flatMap(dg => dg.versions.map(v => ({ ...v, groupLabel: dg.label }))).map((doc, i) => (
                    <tr key={doc.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                      <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{doc.groupLabel}</td>
                      <td className="px-4 py-3 text-[11px] text-[#0B01D0] font-medium">{doc.name}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{doc.uploadedBy}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(doc.date)}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">{doc.type}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">{doc.size}</td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">v{doc.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {c.documents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileText size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No documents uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {/* ── AUDIT TRAIL ── */}
          {detailTab === "audit" && (() => {
            const logs = c.auditLog || [];
            return (
              <div className="flex-1 overflow-auto">
                <div className="px-6 py-3 bg-white border-b border-slate-200">
                  <p className="text-[12px] text-slate-500">{logs.length} action(s) recorded</p>
                </div>
                {logs.length > 0 ? (
                  <table className="w-full">
                    <thead style={{ backgroundColor: "#0B01D0" }}>
                      <tr>
                        {["Date", "Action", "Performed By", "Details"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...logs].reverse().map((entry, i) => (
                        <tr key={entry.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                          <td className="px-4 py-3 text-[11px] text-slate-600 whitespace-nowrap">{fmtDate(entry.date)}</td>
                          <td className="px-4 py-3">
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                              entry.action.includes("Created") ? "bg-blue-100 text-blue-700" :
                              entry.action.includes("Payment") ? "bg-emerald-100 text-emerald-700" :
                              entry.action.includes("Submitted") ? "bg-amber-100 text-amber-700" :
                              entry.action.includes("Accepted") || entry.action.includes("Approved") ? "bg-emerald-100 text-emerald-700" :
                              entry.action.includes("Rejected") || entry.action.includes("Flagged") ? "bg-red-100 text-red-700" :
                              "bg-slate-100 text-slate-600"
                            )}>{entry.action}</span>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{entry.performedBy}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-600 max-w-[300px]">{entry.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <ClipboardList size={24} className="text-slate-300 mb-2" />
                    <p className="text-[13px] text-slate-400">No audit log entries yet</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── MODALS ── */}
        {showChangeModal && <ChangeRequestModal contract={c} onClose={() => setShowChangeModal(false)} />}
        {showEvalModal && <EvaluationModal contract={c} onClose={() => setShowEvalModal(false)} />}
        {showInvoiceModal && <InvoiceModal contract={c} onClose={() => setShowInvoiceModal(false)} />}
        {showDeliverableModal && <DeliverableUploadModal contract={c} onClose={() => setShowDeliverableModal(false)} />}
      </div>
    );
  }

  /* ═══ LIST VIEW ═════════════════════════════════════════════════════════════ */
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-slate-900">Contract Management</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={14} /> Export</button>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Contract Value", value: fmt(totalValue), sub: `${contracts.length} contracts`, icon: <DollarSign size={14} className="text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Active Contracts", value: String(activeContracts), sub: "In execution", icon: <CheckCircle size={14} className="text-[#0B01D0]" />, bg: "bg-[#0B01D0]/10" },
            { label: "Pending Deliverables", value: String(pendingDeliverables), sub: "Awaiting action", icon: <Package size={14} className="text-amber-600" />, bg: "bg-amber-50" },
            { label: "Unpaid Invoices", value: String(overdueInvoices), sub: "In pipeline", icon: <Clock size={14} className="text-purple-600" />, bg: "bg-purple-50" },
            { label: "Pending Variations", value: String(pendingChanges), sub: "Awaiting approval", icon: <AlertTriangle size={14} className="text-red-600" />, bg: "bg-red-50" },
          ].map((card, i) => (
            <div key={i} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", card.bg)}>{card.icon}</div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{card.label}</p>
              </div>
              <p className="text-[18px] text-slate-800 font-semibold">{card.value}</p>
              <p className="text-[10px] text-slate-400">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Alerts Row */}
        {(expiringContracts.length > 0 || pendingCC > 0 || pendingProcurement > 0 || pendingFinance > 0) && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {expiringContracts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-start gap-2">
                <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-red-700">Contract Expiry</p>
                  <p className="text-[10px] text-red-600">{expiringContracts.length} contract(s) expiring within 60 days</p>
                </div>
              </div>
            )}
            {pendingCC > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-start gap-2">
                <Users size={13} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-blue-700">Coordinator Actions</p>
                  <p className="text-[10px] text-blue-600">{pendingCC} item(s) pending CC review</p>
                </div>
              </div>
            )}
            {pendingProcurement > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 flex items-start gap-2">
                <Shield size={13} className="text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-purple-700">Procurement Actions</p>
                  <p className="text-[10px] text-purple-600">{pendingProcurement} invoice(s) awaiting procurement review</p>
                </div>
              </div>
            )}
            {pendingFinance > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-start gap-2">
                <DollarSign size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-emerald-700">Finance Actions</p>
                  <p className="text-[10px] text-emerald-600">{pendingFinance} invoice(s) ready for payment</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs + Search */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1.5 font-medium",
                  activeTab === tab.key ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab.label}
                <span className={cn("px-1.5 py-0.5 rounded-full text-[9px]", activeTab === tab.key ? "bg-white/20" : "bg-slate-200/80")}>{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowRegisterModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0901A0] transition-colors">
              <Plus size={13} /> Register Contract
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white w-48">
              <Search size={13} className="text-slate-400" />
              <input type="text" placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent outline-none text-[11px] text-slate-700 placeholder:text-slate-400" />
            </div>
            <div className="relative">
              <button onClick={() => setShowCatDD(!showCatDD)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {catFilter} <ChevronDown size={12} />
              </button>
              {showCatDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => { setCatFilter(cat); setShowCatDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", catFilter === cat && "bg-slate-50 font-medium text-[#0B01D0]")}>{cat}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Contract #", "Title", "Vendor / Consultant", "Category", "Value", "Start", "End", "Status", "Coordinators", "Deliverables"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c, i) => {
              const delPending = (c.deliverables || []).filter(d => d.status !== "Accepted").length;
              const delTotal = (c.deliverables || []).length;
              return (
                <tr key={c.id} onClick={() => { setSelectedContract(c); setDetailTab("overview"); }} className={cn("hover:bg-slate-50 cursor-pointer transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                  <td className="px-4 py-3 text-[11px] text-[#0B01D0] font-medium">{c.contractNumber}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-800 font-medium max-w-[180px] truncate">{c.title}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1.5">
                      {c.party}
                      {(() => {
                        const evals = c.performanceEvaluations || [];
                        const latest = evals.length > 0 ? evals[evals.length - 1] : null;
                        return latest && latest.overallScore < 5 ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 border border-red-300 text-red-700 rounded-full text-[9px] font-semibold shrink-0" title={`Latest score: ${latest.overallScore.toFixed(1)}/10`}>
                            <AlertTriangle size={10} /> Poor Performer
                          </span>
                        ) : null;
                      })()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{c.category}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{fmt(c.value)}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(c.startDate)}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(c.endDate)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", STATUS_COLORS[c.status] || "bg-slate-100 text-slate-600")}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-500">{(c.coordinators || []).length}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-500">{delTotal > 0 ? `${delTotal - delPending}/${delTotal}` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText size={24} className="text-slate-300 mb-2" />
            <p className="text-[13px] text-slate-400">No contracts found</p>
          </div>
        )}
      </div>

      {showRegisterModal && <ContractRegistrationModal onClose={() => setShowRegisterModal(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Deliverable Upload (CC)
   ═══════════════════════════════════════════════════════════════════════════════ */

function DeliverableUploadModal({ contract: c, onClose }: { contract: AwardedContract; onClose: () => void }) {
  const milestones = c.milestones || [];
  const [milestoneRef, setMilestoneRef] = useState(milestones[0]?.id || "");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [actualDate, setActualDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<ContractDeliverable["status"]>("Submitted");
  const [docNames, setDocNames] = useState("");
  const [deliverableComments, setDeliverableComments] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (!description) return;
    addDeliverableToContract(c.id, {
      milestoneRef,
      description,
      dueDate,
      actualDate: actualDate || undefined,
      status,
      documents: docNames ? docNames.split(",").map(d => d.trim()).filter(Boolean) : [],
      comments: deliverableComments,
      amount: parseFloat(amount) || undefined,
    });
    addAuditLog(c.id, "Deliverable Submitted", "Contract Coordinator", `Deliverable uploaded: ${description}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-900">Upload Deliverable</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {milestones.length > 0 && (
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Link to Milestone</label>
              <select value={milestoneRef} onChange={e => setMilestoneRef(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20">
                <option value="">— None —</option>
                {milestones.map(ms => <option key={ms.id} value={ms.id}>{ms.label} ({fmtDate(ms.date)})</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Description *</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Deliverable description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Actual Submission Date</label>
              <input type="date" value={actualDate} onChange={e => setActualDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as ContractDeliverable["status"])} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20">
                {["Submitted", "Under Review", "Accepted", "Rejected", "Pending"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Payment Amount ($)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Document Names (comma-separated)</label>
            <input type="text" value={docNames} onChange={e => setDocNames(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="e.g. Report_v1.pdf, InspectionNote.pdf" />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Comments</label>
            <textarea value={deliverableComments} onChange={e => setDeliverableComments(e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Notes about this deliverable..." />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!description} className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white", description ? "bg-[#0B01D0] hover:bg-[#0a01b8]" : "bg-slate-300 cursor-not-allowed")}>Upload Deliverable</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Contract Registration
   ═══════════════════════════════════════════════════════════════════════════════ */

const REG_CATEGORIES = ["Goods", "Services", "Works", "Consultancy"] as const;
const REG_METHODS = ["Open Competition", "Limited Competition", "Request for Quotation", "Direct Selection"] as const;
const REG_DEPARTMENTS = ["Programs", "Finance", "Admin", "IT", "HR", "M&E", "Communications", "Executive"] as const;
const REG_FUNDING = ["Core Program Funding", "Donor Grant — DFID", "Capital Expenditure Fund", "TAP", "ATTP", "Gates Foundation", "World Bank"] as const;
const F = "'Montserrat Variable', sans-serif";
const labelCls = "block text-[11px] font-medium text-slate-600 mb-1";
const inputCls = "w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B01D0] focus:border-[#0B01D0]";

function ContractRegistrationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Basic info
  const [title, setTitle] = useState("");
  const [party, setParty] = useState("");
  const [category, setCategory] = useState<string>("Goods");
  const [method, setMethod] = useState<string>("Open Competition");
  const [sourcePR, setSourcePR] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [department, setDepartment] = useState("Programs");
  const [owner, setOwner] = useState("");
  const [fundingSource, setFundingSource] = useState("");
  const [budgetLine, setBudgetLine] = useState("");
  const [comments, setComments] = useState("");

  // Step 2: Contract type, value, dates
  const [contractType, setContractType] = useState<"Lump Sum" | "Time Based">("Lump Sum");
  const [value, setValue] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState<"Daily" | "Weekly" | "Monthly" | "Quarterly" | "Milestone-Based">("Milestone-Based");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");

  // Step 3: Coordinators (up to 3)
  const [coordinators, setCoordinators] = useState<{ name: string; role: string; email: string }[]>([{ name: "", role: "", email: "" }]);

  // Step 4: Milestones/Delivery + Payment Schedule
  const [milestones, setMilestones] = useState<{ label: string; date: string }[]>([{ label: "", date: "" }]);
  const [deliverySchedule, setDeliverySchedule] = useState<{ item: string; quantity: string; expectedDate: string }[]>([{ item: "", quantity: "", expectedDate: "" }]);
  const [paymentSchedule, setPaymentSchedule] = useState<{ description: string; amount: string; dueDate: string; linkedTo: string }[]>([{ description: "", amount: "", dueDate: "", linkedTo: "" }]);

  // Step 5: Documents (simulated)
  const [docLabels, setDocLabels] = useState<string[]>(["Signed Contract"]);

  // Auto-generate contract number when PR changes
  const handlePRChange = (v: string) => {
    setSourcePR(v);
    if (v.trim()) setContractNumber(generateContractNumber(v));
  };

  const addCoordinator = () => { if (coordinators.length < 3) setCoordinators([...coordinators, { name: "", role: "", email: "" }]); };
  const removeCoordinator = (i: number) => setCoordinators(coordinators.filter((_, idx) => idx !== i));
  const updateCoordinator = (i: number, field: string, val: string) => setCoordinators(coordinators.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const addMilestone = () => setMilestones([...milestones, { label: "", date: "" }]);
  const removeMilestone = (i: number) => setMilestones(milestones.filter((_, idx) => idx !== i));
  const updateMilestone = (i: number, field: string, val: string) => setMilestones(milestones.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const addDelivery = () => setDeliverySchedule([...deliverySchedule, { item: "", quantity: "", expectedDate: "" }]);
  const removeDelivery = (i: number) => setDeliverySchedule(deliverySchedule.filter((_, idx) => idx !== i));
  const updateDelivery = (i: number, field: string, val: string) => setDeliverySchedule(deliverySchedule.map((d, idx) => idx === i ? { ...d, [field]: val } : d));

  const addPayment = () => setPaymentSchedule([...paymentSchedule, { description: "", amount: "", dueDate: "", linkedTo: "" }]);
  const removePayment = (i: number) => setPaymentSchedule(paymentSchedule.filter((_, idx) => idx !== i));
  const updatePayment = (i: number, field: string, val: string) => setPaymentSchedule(paymentSchedule.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  const canNext = () => {
    if (step === 1) return title && party && sourcePR && owner;
    if (step === 2) return value && startDate && endDate;
    if (step === 3) return coordinators.some(c => c.name && c.email);
    if (step === 4) return category === "Goods" ? deliverySchedule.some(d => d.item) : milestones.some(m => m.label && m.date);
    return true;
  };

  const handleSubmit = () => {
    const coordsClean: ContractCoordinator[] = coordinators.filter(c => c.name && c.email).map((c, i) => ({ id: `cc-reg-${Date.now()}-${i}`, ...c }));
    const msClean: ContractMilestone[] = milestones.filter(m => m.label && m.date).map((m, i) => ({ id: `ms-reg-${Date.now()}-${i}`, ...m, completed: false }));
    const delSched = category === "Goods" ? deliverySchedule.filter(d => d.item) : undefined;
    const paySched = paymentSchedule.filter(p => p.description && p.amount).map(p => ({ ...p, amount: parseFloat(p.amount) || 0 }));

    registerContract({
      title,
      party,
      sourcePR,
      category,
      method,
      value: parseFloat(value) || 0,
      startDate,
      endDate,
      renewalDate: renewalDate || undefined,
      department,
      owner,
      comments,
      contractType,
      paymentFrequency,
      maxAmount: contractType === "Time Based" ? parseFloat(maxAmount) || undefined : undefined,
      coordinators: coordsClean,
      milestones: msClean,
      deliverySchedule: delSched,
      paymentSchedule: paySched.length > 0 ? paySched : undefined,
      budgetLine: budgetLine || undefined,
      fundingSource: fundingSource || undefined,
    });
    onClose();
  };

  const stepLabels = ["Contract Details", "Type & Dates", "Coordinators", category === "Goods" ? "Delivery & Payment" : "Milestones & Payment", "Documents & Review"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{ fontFamily: F }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[720px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">Register New Contract</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Step {step} of {totalSteps}: {stepLabels[step - 1]}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-3 flex gap-1 shrink-0">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < step ? "bg-[#0B01D0]" : "bg-slate-200")} />
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex-1 overflow-y-auto space-y-4">
          {step === 1 && (
            <>
              <div><label className={labelCls}>Requisition Number (Source PR)</label><input className={inputCls} value={sourcePR} onChange={e => handlePRChange(e.target.value)} placeholder="e.g. PR-2025-021" /></div>
              <div className="flex items-center gap-2">
                <div className="flex-1"><label className={labelCls}>Contract Number (Auto-generated)</label><input className={cn(inputCls, "bg-slate-50")} value={contractNumber} readOnly /></div>
              </div>
              <div><label className={labelCls}>Contract Title</label><input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Consultant Fees — Survey Design" /></div>
              <div><label className={labelCls}>Vendor / Consultant Name</label><input className={inputCls} value={party} onChange={e => setParty(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Category</label><select className={inputCls} value={category} onChange={e => setCategory(e.target.value)}>{REG_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className={labelCls}>Procurement Method</label><select className={inputCls} value={method} onChange={e => setMethod(e.target.value)}>{REG_METHODS.map(m => <option key={m}>{m}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Department</label><select className={inputCls} value={department} onChange={e => setDepartment(e.target.value)}>{REG_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div><label className={labelCls}>Contract Owner</label><input className={inputCls} value={owner} onChange={e => setOwner(e.target.value)} placeholder="Person responsible" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Funding Source</label><select className={inputCls} value={fundingSource} onChange={e => setFundingSource(e.target.value)}><option value="">Select...</option>{REG_FUNDING.map(f => <option key={f}>{f}</option>)}</select></div>
                <div><label className={labelCls}>Budget Line</label><input className={inputCls} value={budgetLine} onChange={e => setBudgetLine(e.target.value)} placeholder="e.g. BL-2025-PROG-001" /></div>
              </div>
              <div><label className={labelCls}>Notes / Comments</label><textarea className={cn(inputCls, "h-16 resize-none")} value={comments} onChange={e => setComments(e.target.value)} /></div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className={labelCls}>Contract Type</label>
                <div className="flex gap-3 mt-1">
                  {(["Lump Sum", "Time Based"] as const).map(t => (
                    <button key={t} onClick={() => setContractType(t)} className={cn("flex-1 px-4 py-3 rounded-lg border-2 text-[12px] font-medium transition-all", contractType === t ? "border-[#0B01D0] bg-[#0B01D0]/5 text-[#0B01D0]" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
                      <div className="font-semibold">{t}</div>
                      <div className="text-[10px] mt-0.5 font-normal">{t === "Lump Sum" ? "Fixed price, paid on deliverables/milestones" : "Daily, weekly, or monthly rate up to max amount"}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Contract Value (USD)</label><input type="number" className={inputCls} value={value} onChange={e => setValue(e.target.value)} placeholder="0.00" /></div>
                {contractType === "Time Based" && (
                  <div><label className={labelCls}>Maximum Amount (USD)</label><input type="number" className={inputCls} value={maxAmount} onChange={e => setMaxAmount(e.target.value)} placeholder="Cap amount" /></div>
                )}
              </div>

              <div>
                <label className={labelCls}>Payment Frequency</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(contractType === "Time Based"
                    ? ["Daily", "Weekly", "Monthly", "Quarterly"] as const
                    : ["Milestone-Based", "Monthly", "Quarterly"] as const
                  ).map(f => (
                    <button key={f} onClick={() => setPaymentFrequency(f as typeof paymentFrequency)} className={cn("px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors", paymentFrequency === f ? "border-[#0B01D0] bg-[#0B01D0]/5 text-[#0B01D0]" : "border-slate-200 text-slate-500 hover:border-slate-300")}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelCls}>Start Date</label><input type="date" className={inputCls} value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div><label className={labelCls}>End Date</label><input type="date" className={inputCls} value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
                <div><label className={labelCls}>Renewal Date (optional)</label><input type="date" className={inputCls} value={renewalDate} onChange={e => setRenewalDate(e.target.value)} /></div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">Contract Coordinators</p>
                  <p className="text-[10px] text-slate-400">Assign up to 3 coordinators who will receive notifications on this contract</p>
                </div>
                {coordinators.length < 3 && (
                  <button onClick={addCoordinator} className="flex items-center gap-1 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add</button>
                )}
              </div>
              {coordinators.map((c, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-slate-600">Coordinator {i + 1}</p>
                    {coordinators.length > 1 && <button onClick={() => removeCoordinator(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className={labelCls}>Full Name</label><input className={inputCls} value={c.name} onChange={e => updateCoordinator(i, "name", e.target.value)} /></div>
                    <div><label className={labelCls}>Role</label><input className={inputCls} value={c.role} onChange={e => updateCoordinator(i, "role", e.target.value)} placeholder="e.g. Lead Coordinator" /></div>
                    <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={c.email} onChange={e => updateCoordinator(i, "email", e.target.value)} /></div>
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 4 && (
            <>
              {category === "Goods" ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">Delivery Schedule</p>
                      <p className="text-[10px] text-slate-400">Define items, quantities, and expected delivery dates</p>
                    </div>
                    <button onClick={addDelivery} className="flex items-center gap-1 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add Item</button>
                  </div>
                  {deliverySchedule.map((d, i) => (
                    <div key={i} className="flex items-end gap-3">
                      <div className="flex-1"><label className={labelCls}>Item Description</label><input className={inputCls} value={d.item} onChange={e => updateDelivery(i, "item", e.target.value)} /></div>
                      <div className="w-24"><label className={labelCls}>Quantity</label><input className={inputCls} value={d.quantity} onChange={e => updateDelivery(i, "quantity", e.target.value)} /></div>
                      <div className="w-36"><label className={labelCls}>Expected Date</label><input type="date" className={inputCls} value={d.expectedDate} onChange={e => updateDelivery(i, "expectedDate", e.target.value)} /></div>
                      {deliverySchedule.length > 1 && <button onClick={() => removeDelivery(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5"><X size={14} /></button>}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{contractType === "Lump Sum" ? "Project Milestones / Deliverables" : "Timeline-Based Deliverables"}</p>
                      <p className="text-[10px] text-slate-400">{contractType === "Lump Sum" ? "Define deliverables tied to payment milestones" : `Payments made ${paymentFrequency.toLowerCase()} up to ${maxAmount ? fmt(parseFloat(maxAmount)) : "max amount"}`}</p>
                    </div>
                    <button onClick={addMilestone} className="flex items-center gap-1 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add</button>
                  </div>
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-end gap-3">
                      <div className="flex-1"><label className={labelCls}>Milestone / Deliverable</label><input className={inputCls} value={m.label} onChange={e => updateMilestone(i, "label", e.target.value)} placeholder="e.g. Inception Report" /></div>
                      <div className="w-36"><label className={labelCls}>Due Date</label><input type="date" className={inputCls} value={m.date} onChange={e => updateMilestone(i, "date", e.target.value)} /></div>
                      {milestones.length > 1 && <button onClick={() => removeMilestone(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5"><X size={14} /></button>}
                    </div>
                  ))}
                </>
              )}

              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">Payment Schedule</p>
                    <p className="text-[10px] text-slate-400">Tie payments to deliverables or timelines</p>
                  </div>
                  <button onClick={addPayment} className="flex items-center gap-1 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add</button>
                </div>
                {paymentSchedule.map((p, i) => (
                  <div key={i} className="flex items-end gap-3 mb-2">
                    <div className="flex-1"><label className={labelCls}>Description</label><input className={inputCls} value={p.description} onChange={e => updatePayment(i, "description", e.target.value)} placeholder="e.g. Upon Inception Report" /></div>
                    <div className="w-28"><label className={labelCls}>Amount (USD)</label><input type="number" className={inputCls} value={p.amount} onChange={e => updatePayment(i, "amount", e.target.value)} /></div>
                    <div className="w-36"><label className={labelCls}>Due Date</label><input type="date" className={inputCls} value={p.dueDate} onChange={e => updatePayment(i, "dueDate", e.target.value)} /></div>
                    <div className="w-36"><label className={labelCls}>Linked To</label><input className={inputCls} value={p.linkedTo} onChange={e => updatePayment(i, "linkedTo", e.target.value)} placeholder="Milestone / Item" /></div>
                    {paymentSchedule.length > 1 && <button onClick={() => removePayment(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5"><X size={14} /></button>}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <p className="text-[13px] font-semibold text-slate-800">Documents to Upload</p>
              <p className="text-[10px] text-slate-400 -mt-2">The following documents should be prepared and uploaded. You can add more after registration.</p>

              <div className="space-y-2">
                {docLabels.map((lbl, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                    <Upload size={14} className="text-slate-400" />
                    <span className="text-[12px] text-slate-700 flex-1">{lbl}</span>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending Upload</span>
                  </div>
                ))}
                <button onClick={() => { const lbl = prompt("Document label:"); if (lbl) setDocLabels([...docLabels, lbl]); }} className="flex items-center gap-1.5 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add Document Slot</button>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-4">
                <p className="text-[13px] font-semibold text-slate-800 mb-3">Review Summary</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
                  {[
                    ["Contract Number", contractNumber],
                    ["Contract Title", title],
                    ["Vendor / Consultant", party],
                    ["Category", category],
                    ["Contract Type", contractType],
                    ["Value", value ? fmt(parseFloat(value)) : "—"],
                    ["Payment Frequency", paymentFrequency],
                    ["Start Date", startDate ? fmtDate(startDate) : "—"],
                    ["End Date", endDate ? fmtDate(endDate) : "—"],
                    ["Renewal Date", renewalDate ? fmtDate(renewalDate) : "N/A"],
                    ["Department", department],
                    ["Owner", owner],
                    ["Coordinators", coordinators.filter(c => c.name).map(c => c.name).join(", ") || "—"],
                    ["Funding Source", fundingSource || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">{k}</span>
                      <span className="text-slate-800 font-medium text-right max-w-[200px] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="px-4 py-2 text-[12px] font-medium text-slate-600 hover:text-slate-900">{step > 1 ? "Back" : "Cancel"}</button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">{step}/{totalSteps}</span>
            {step < totalSteps ? (
              <button disabled={!canNext()} onClick={() => setStep(step + 1)} className={cn("px-5 py-2 rounded-lg text-[12px] font-medium text-white transition-colors", canNext() ? "bg-[#0B01D0] hover:bg-[#0901A0]" : "bg-slate-300 cursor-not-allowed")}>Next</button>
            ) : (
              <button onClick={handleSubmit} className="px-5 py-2 rounded-lg text-[12px] font-medium text-white bg-[#0B01D0] hover:bg-[#0901A0]">Register Contract</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Change Request
   ═══════════════════════════════════════════════════════════════════════════════ */

function ChangeRequestModal({ contract: c, onClose }: { contract: AwardedContract; onClose: () => void }) {
  const [types, setTypes] = useState<ContractChangeRequest["types"]>([]);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [costImpact, setCostImpact] = useState("");
  const [timeImpact, setTimeImpact] = useState("");

  const toggleType = (t: ContractChangeRequest["types"][0]) => {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleSubmit = () => {
    if (types.length === 0 || !reason || !description) return;
    const existing = c.changeRequests || [];
    const newCR: ContractChangeRequest = {
      id: `cr-${Date.now()}`,
      changeNumber: existing.length + 1,
      contractRef: c.contractNumber,
      types,
      reason,
      description,
      supportingDocs: [],
      estimatedCostImpact: parseFloat(costImpact) || 0,
      estimatedTimeImpact: timeImpact || "None",
      revisedValue: (parseFloat(costImpact) || 0) > 0 ? c.value + (parseFloat(costImpact) || 0) : undefined,
      status: "Pending Approval",
      requestedBy: "Current User",
      requestedDate: new Date().toISOString().split("T")[0],
    };
    updateContract(c.id, { changeRequests: [...existing, newCR], status: "Under Variation" });
    addAuditLog(c.id, "Change Request Submitted", "Current User", `Amendment #${newCR.changeNumber}: ${types.join(", ")} — ${reason}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-900">New Change Request</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Change Type(s) *</label>
            <div className="flex flex-wrap gap-2">
              {(["Scope Change", "Time Extension", "Cost Variation", "Amendment to Terms", "Deliverable Change"] as const).map(t => (
                <button key={t} onClick={() => toggleType(t)} className={cn("px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors", types.includes(t) ? "bg-[#0B01D0] text-white border-[#0B01D0]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Reason for Change *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Why is this change needed?" />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Detailed Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Describe the change in detail..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Estimated Cost Impact ($)</label>
              <input type="number" value={costImpact} onChange={e => setCostImpact(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="0" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Estimated Time Impact</label>
              <input type="text" value={timeImpact} onChange={e => setTimeImpact(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="e.g. 2 weeks, 1 month" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Supporting Documents</label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
              <Upload size={20} className="text-slate-300 mx-auto mb-2" />
              <p className="text-[11px] text-slate-400">Drag & drop or click to upload supporting documents</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8]">Submit Change Request</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Performance Evaluation
   ═══════════════════════════════════════════════════════════════════════════════ */

function EvaluationModal({ contract: c, onClose }: { contract: AwardedContract; onClose: () => void }) {
  const [evalType, setEvalType] = useState<"Mid-Term" | "Final">("Final");
  const [criteria, setCriteria] = useState([
    { name: "Quality of deliverables", score: 5, maxScore: 10 },
    { name: "Timeliness", score: 5, maxScore: 10 },
    { name: "Cost control", score: 5, maxScore: 10 },
    { name: "Compliance with terms", score: 5, maxScore: 10 },
    { name: "Professionalism and responsiveness", score: 5, maxScore: 10 },
  ]);
  const [comments, setComments] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [newCriterionName, setNewCriterionName] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const overall = criteria.length > 0 ? criteria.reduce((s, cr) => s + cr.score, 0) / criteria.length : 0;

  const addCriterion = () => {
    if (!newCriterionName.trim()) return;
    setCriteria([...criteria, { name: newCriterionName.trim(), score: 5, maxScore: 10 }]);
    setNewCriterionName("");
  };

  const removeCriterion = (idx: number) => setCriteria(criteria.filter((_, i) => i !== idx));

  const startEdit = (idx: number) => { setEditingIdx(idx); setEditName(criteria[idx].name); };
  const saveEdit = () => {
    if (editingIdx !== null && editName.trim()) {
      const updated = [...criteria];
      updated[editingIdx] = { ...updated[editingIdx], name: editName.trim() };
      setCriteria(updated);
    }
    setEditingIdx(null);
    setEditName("");
  };

  const handleSubmit = () => {
    if (!evaluator) return;
    const existing = c.performanceEvaluations || [];
    const newEval: PerformanceEvaluation = {
      id: `pe-${Date.now()}`,
      evaluationType: evalType,
      evaluationDate: new Date().toISOString().split("T")[0],
      evaluator,
      supervisorApproval: supervisor || undefined,
      status: supervisor ? "Supervisor Approved" : "CC Approved",
      criteria,
      overallScore: parseFloat(overall.toFixed(1)),
      comments,
    };
    updateContract(c.id, { performanceEvaluations: [...existing, newEval] });
    addAuditLog(c.id, "Performance Evaluation", evaluator, `${evalType} evaluation submitted — Score: ${overall.toFixed(1)}/10`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-900">Performance Evaluation</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Evaluation Type</label>
            <div className="flex gap-2">
              {(["Mid-Term", "Final"] as const).map(t => (
                <button key={t} onClick={() => setEvalType(t)} className={cn("px-4 py-2 rounded-lg text-[12px] font-medium border transition-colors", evalType === t ? "bg-[#0B01D0] text-white border-[#0B01D0]" : "bg-white text-slate-600 border-slate-200")}>{t}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Evaluator (CC) *</label>
              <input type="text" value={evaluator} onChange={e => setEvaluator(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Contract Coordinator name" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Supervisor Approval</label>
              <input type="text" value={supervisor} onChange={e => setSupervisor(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Supervisor name" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Criteria (1–10 Likert Scale)</label>
            </div>
            <div className="space-y-2.5">
              {criteria.map((cr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {editingIdx === idx ? (
                    <div className="flex items-center gap-1.5 w-[200px] shrink-0">
                      <input value={editName} onChange={e => setEditName(e.target.value)} onBlur={saveEdit} onKeyDown={e => e.key === "Enter" && saveEdit()} autoFocus className="flex-1 px-2 py-1 border border-[#0B01D0] rounded text-[11px] text-slate-700 focus:outline-none" />
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-600 w-[200px] shrink-0 flex items-center gap-1 group cursor-pointer" onClick={() => startEdit(idx)}>
                      {cr.name}
                      <Edit2 size={9} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                    </span>
                  )}
                  <input
                    type="range" min={1} max={10} value={cr.score}
                    onChange={e => {
                      const updated = [...criteria];
                      updated[idx] = { ...cr, score: parseInt(e.target.value) };
                      setCriteria(updated);
                    }}
                    className="flex-1 h-2 accent-[#0B01D0]"
                  />
                  <span className="text-[12px] font-semibold text-slate-800 w-8 text-right">{cr.score}</span>
                  {criteria.length > 1 && (
                    <button onClick={() => removeCriterion(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={12} /></button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input value={newCriterionName} onChange={e => setNewCriterionName(e.target.value)} onKeyDown={e => e.key === "Enter" && addCriterion()} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0B01D0]" placeholder="Add new criterion..." />
              <button onClick={addCriterion} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-[#0B01D0] font-medium hover:bg-[#0B01D0]/5 rounded-lg"><Plus size={11} /> Add</button>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Overall Score</p>
            <p className={cn("text-[24px] font-semibold", overall >= 7 ? "text-emerald-600" : overall >= 5 ? "text-amber-600" : "text-red-600")}>{overall.toFixed(1)}<span className="text-[12px] text-slate-400">/10</span></p>
            {overall < 5 && <p className="text-[10px] text-red-500 mt-1">Poor performer — will be flagged</p>}
          </div>
          {!supervisor && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-[10px] text-amber-700">Minimum two approvals required: CC evaluator and supervisor. Add supervisor name for full approval.</p>
            </div>
          )}
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Comments</label>
            <textarea value={comments} onChange={e => setComments(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Additional comments..." />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!evaluator} className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white", evaluator ? "bg-[#0B01D0] hover:bg-[#0a01b8]" : "bg-slate-300 cursor-not-allowed")}>Submit Evaluation</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Record Invoice
   ═══════════════════════════════════════════════════════════════════════════════ */

function InvoiceModal({ contract: c, onClose }: { contract: AwardedContract; onClose: () => void }) {
  const [invoiceNum, setInvoiceNum] = useState("");
  const [amount, setAmount] = useState("");
  const [via, setVia] = useState<ContractInvoice["submittedVia"]>("Email");
  const [deliverableId, setDeliverableId] = useState("");

  const handleSubmit = () => {
    if (!invoiceNum || !amount) return;
    const existing = c.invoices || [];
    const newInv: ContractInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNum,
      vendor: c.party,
      amount: parseFloat(amount),
      dateSubmitted: new Date().toISOString().split("T")[0],
      deliverableId: deliverableId || undefined,
      status: "Submitted",
      submittedVia: via,
    };
    updateContract(c.id, { invoices: [...existing, newInv] });
    addAuditLog(c.id, "Invoice Submitted", c.party, `${invoiceNum} for ${fmt(parseFloat(amount))} submitted via ${via}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-900">Record Invoice</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Invoice Number *</label>
            <input type="text" value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="INV-..." />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Amount ($) *</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="0" />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Submitted Via</label>
            <div className="flex gap-2">
              {(["Vendor Portal", "Email", "Manual"] as const).map(v => (
                <button key={v} onClick={() => setVia(v)} className={cn("px-3 py-1.5 rounded-lg text-[11px] font-medium border", via === v ? "bg-[#0B01D0] text-white border-[#0B01D0]" : "bg-white text-slate-600 border-slate-200")}>{v}</button>
              ))}
            </div>
          </div>
          {(c.deliverables || []).length > 0 && (
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Link to Deliverable</label>
              <select value={deliverableId} onChange={e => setDeliverableId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20">
                <option value="">— None —</option>
                {(c.deliverables || []).map(d => (
                  <option key={d.id} value={d.id}>{d.description}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0a01b8]">Submit Invoice</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   INLINE: Payment Processing Card (Finance Integration)
   ═══════════════════════════════════════════════════════════════════════════════ */

function PaymentProcessingCard({ invoice, contract }: { invoice: ContractInvoice; contract: AwardedContract }) {
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [amountPaid, setAmountPaid] = useState(String(invoice.amount));
  const [paymentMethod, setPaymentMethod] = useState<"Wire Transfer" | "Cheque" | "Mobile Money">("Wire Transfer");
  const [refNumber, setRefNumber] = useState("");

  const handleProcessPayment = () => {
    if (!refNumber) return;
    const updatedInvoices = (contract.invoices || []).map(inv => {
      if (inv.id !== invoice.id) return inv;
      return {
        ...inv,
        status: "Paid" as const,
        datePaid: paymentDate,
        amountPaid: parseFloat(amountPaid) || invoice.amount,
        paymentMethod,
        referenceNumber: refNumber,
        paymentInfo: `${paymentMethod} — Ref: ${refNumber} — ${paymentDate}`,
      };
    });
    updateContract(contract.id, { invoices: updatedInvoices });
    addAuditLog(contract.id, "Payment Processed", "Finance", `${invoice.invoiceNumber} paid — ${fmt(parseFloat(amountPaid) || invoice.amount)} via ${paymentMethod}, Ref: ${refNumber}`);
  };

  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-slate-800">{invoice.invoiceNumber}</span>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", INV_COLORS[invoice.status])}>{invoice.status}</span>
        </div>
        <p className="text-[12px] font-semibold text-slate-700">{fmt(invoice.amount)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Payment Date</label>
          <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Amount Paid ($)</label>
          <input type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Payment Method</label>
          <div className="flex gap-1.5">
            {(["Wire Transfer", "Cheque", "Mobile Money"] as const).map(m => (
              <button key={m} onClick={() => setPaymentMethod(m)} className={cn("px-2 py-1 rounded text-[10px] font-medium border transition-colors", paymentMethod === m ? "bg-[#0B01D0] text-white border-[#0B01D0]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>{m}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Reference Number *</label>
          <input type="text" value={refNumber} onChange={e => setRefNumber(e.target.value)} placeholder="e.g. TXN-12345" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleProcessPayment} disabled={!refNumber} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium", refNumber ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
          <CheckCircle size={12} /> Process Payment
        </button>
      </div>
    </div>
  );
}
