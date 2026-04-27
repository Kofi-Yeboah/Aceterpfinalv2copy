import { useState } from "react";
import {
  Search, ChevronDown, Plus, ArrowLeft, X, CheckCircle, AlertTriangle, Clock,
  FileText, Shield, Calendar, Eye, MoreHorizontal, Download, Upload,
  XCircle, AlertCircle, ChevronRight, Filter
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════════ */

type ComplianceStatus = "Compliant" | "Non-Compliant" | "At Risk" | "Pending Review" | "Waived";
type RequirementCategory = "Financial Reporting" | "Programmatic Reporting" | "Audit" | "Procurement" | "Staffing" | "Environmental & Social" | "Anti-Terrorism" | "Data Protection" | "Insurance" | "Other";
type Frequency = "Monthly" | "Quarterly" | "Semi-Annual" | "Annual" | "One-Time" | "As Needed";

interface ComplianceRequirement {
  id: string;
  agreementId: number;
  agreementTitle: string;
  donorName: string;
  category: RequirementCategory;
  requirement: string;
  description: string;
  frequency: Frequency;
  dueDate: string;
  status: ComplianceStatus;
  responsiblePerson: string;
  lastSubmitted: string | null;
  nextDue: string;
  evidence: { name: string; date: string }[];
  notes: string;
  riskLevel: "High" | "Medium" | "Low";
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Seed Data
   ═══════════════════════════════════════════════════════════════════════════════ */

const REQUIREMENTS: ComplianceRequirement[] = [
  { id: "CMP-001", agreementId: 1, agreementTitle: "Youth Empowerment Grant Agreement", donorName: "Bill & Melinda Gates Foundation", category: "Financial Reporting", requirement: "Quarterly Financial Report", description: "Submit detailed quarterly financial reports showing expenditure against approved budget lines, including variance analysis and explanations.", frequency: "Quarterly", dueDate: "2026-03-31", status: "Compliant", responsiblePerson: "Ama Darko", lastSubmitted: "2025-12-28", nextDue: "2026-03-31", evidence: [{ name: "Q4_2025_Financial_Report.pdf", date: "2025-12-28" }, { name: "Q3_2025_Financial_Report.pdf", date: "2025-09-30" }], notes: "All quarterly reports submitted on time to date.", riskLevel: "Low" },
  { id: "CMP-002", agreementId: 1, agreementTitle: "Youth Empowerment Grant Agreement", donorName: "Bill & Melinda Gates Foundation", category: "Audit", requirement: "Annual External Audit", description: "Engage an independent audit firm to conduct annual project audit. Submit audit report within 90 days of fiscal year end.", frequency: "Annual", dueDate: "2026-03-31", status: "Pending Review", responsiblePerson: "James Owusu", lastSubmitted: null, nextDue: "2026-03-31", evidence: [], notes: "Audit firm engaged — Ernst & Young. Fieldwork begins Feb 2026.", riskLevel: "Medium" },
  { id: "CMP-003", agreementId: 1, agreementTitle: "Youth Empowerment Grant Agreement", donorName: "Bill & Melinda Gates Foundation", category: "Procurement", requirement: "Procurement Compliance Check", description: "All procurements above $10,000 must follow donor-approved procurement procedures including competitive bidding.", frequency: "As Needed", dueDate: "2026-06-30", status: "Compliant", responsiblePerson: "Grace Tetteh", lastSubmitted: "2026-01-15", nextDue: "2026-06-30", evidence: [{ name: "Procurement_Compliance_Checklist_Q1.pdf", date: "2026-01-15" }], notes: "All 7 procurements in period followed approved procedures.", riskLevel: "Low" },
  { id: "CMP-004", agreementId: 2, agreementTitle: "Climate Resilience Partnership MOU", donorName: "USAID", category: "Programmatic Reporting", requirement: "Semi-Annual Performance Report", description: "Submit narrative performance report detailing progress against log-frame indicators, challenges, and lessons learned.", frequency: "Semi-Annual", dueDate: "2026-01-31", status: "Non-Compliant", responsiblePerson: "Kwame Asante", lastSubmitted: "2025-06-30", nextDue: "2026-01-31", evidence: [{ name: "H1_2025_Performance_Report.pdf", date: "2025-06-30" }], notes: "H2 2025 report overdue. Draft being finalized.", riskLevel: "High" },
  { id: "CMP-005", agreementId: 2, agreementTitle: "Climate Resilience Partnership MOU", donorName: "USAID", category: "Anti-Terrorism", requirement: "OFAC Screening", description: "Screen all vendors, partners, and beneficiaries against OFAC sanctions list. Submit screening certification quarterly.", frequency: "Quarterly", dueDate: "2026-03-31", status: "Compliant", responsiblePerson: "Grace Tetteh", lastSubmitted: "2025-12-31", nextDue: "2026-03-31", evidence: [{ name: "OFAC_Screening_Q4_2025.pdf", date: "2025-12-31" }, { name: "OFAC_Screening_Q3_2025.pdf", date: "2025-09-30" }], notes: "All screenings completed with no matches.", riskLevel: "Low" },
  { id: "CMP-006", agreementId: 2, agreementTitle: "Climate Resilience Partnership MOU", donorName: "USAID", category: "Environmental & Social", requirement: "Environmental Impact Assessment", description: "Conduct environmental and social impact assessment for all field activities and submit report to donor.", frequency: "Annual", dueDate: "2026-06-30", status: "At Risk", responsiblePerson: "Ama Darko", lastSubmitted: "2025-06-15", nextDue: "2026-06-30", evidence: [{ name: "ESIA_Report_2025.pdf", date: "2025-06-15" }], notes: "Consultant engagement delayed. Need to initiate by April to meet deadline.", riskLevel: "High" },
  { id: "CMP-007", agreementId: 3, agreementTitle: "Digital Economy Research Contract", donorName: "World Bank", category: "Financial Reporting", requirement: "Monthly Expenditure Report", description: "Submit monthly expenditure statement within 15 days of month end.", frequency: "Monthly", dueDate: "2026-04-15", status: "Compliant", responsiblePerson: "James Owusu", lastSubmitted: "2026-02-14", nextDue: "2026-04-15", evidence: [{ name: "Feb_2026_Expenditure.xlsx", date: "2026-02-14" }, { name: "Jan_2026_Expenditure.xlsx", date: "2026-01-14" }], notes: "Submitted consistently on time.", riskLevel: "Low" },
  { id: "CMP-008", agreementId: 3, agreementTitle: "Digital Economy Research Contract", donorName: "World Bank", category: "Staffing", requirement: "Key Personnel Approval", description: "Any changes to key project personnel must be pre-approved by the World Bank. Submit updated personnel plan.", frequency: "As Needed", dueDate: "2026-12-31", status: "Compliant", responsiblePerson: "Kwame Asante", lastSubmitted: "2025-11-01", nextDue: "2026-12-31", evidence: [{ name: "Personnel_Change_Approval_Nov2025.pdf", date: "2025-11-01" }], notes: "One change approved — new M&E specialist onboarded.", riskLevel: "Low" },
  { id: "CMP-009", agreementId: 3, agreementTitle: "Digital Economy Research Contract", donorName: "World Bank", category: "Data Protection", requirement: "Data Privacy Compliance Certification", description: "Annual certification that all project data handling complies with GDPR and local data protection regulations.", frequency: "Annual", dueDate: "2026-06-30", status: "Pending Review", responsiblePerson: "Ama Darko", lastSubmitted: null, nextDue: "2026-06-30", evidence: [], notes: "Internal data audit scheduled for May 2026.", riskLevel: "Medium" },
  { id: "CMP-010", agreementId: 4, agreementTitle: "Health Systems Strengthening Grant", donorName: "Global Fund", category: "Programmatic Reporting", requirement: "Quarterly Progress Update", description: "Submit progress update against agreed milestones and KPIs using standard Global Fund PUDR template.", frequency: "Quarterly", dueDate: "2026-04-15", status: "At Risk", responsiblePerson: "Kwame Asante", lastSubmitted: "2025-12-20", nextDue: "2026-04-15", evidence: [{ name: "PUDR_Q4_2025.pdf", date: "2025-12-20" }], notes: "Data collection for Q1 indicators behind schedule.", riskLevel: "High" },
  { id: "CMP-011", agreementId: 4, agreementTitle: "Health Systems Strengthening Grant", donorName: "Global Fund", category: "Insurance", requirement: "Professional Indemnity Insurance", description: "Maintain valid professional indemnity insurance covering the full grant period. Submit renewal certificates.", frequency: "Annual", dueDate: "2026-07-01", status: "Compliant", responsiblePerson: "Grace Tetteh", lastSubmitted: "2025-07-01", nextDue: "2026-07-01", evidence: [{ name: "Insurance_Certificate_2025-26.pdf", date: "2025-07-01" }], notes: "Current policy valid through June 2026.", riskLevel: "Low" },
  { id: "CMP-012", agreementId: 4, agreementTitle: "Health Systems Strengthening Grant", donorName: "Global Fund", category: "Audit", requirement: "Spot Check / Micro-Assessment", description: "Facilitate donor-commissioned spot checks and micro-assessments. Provide requested documentation within 5 business days.", frequency: "As Needed", dueDate: "2026-12-31", status: "Waived", responsiblePerson: "James Owusu", lastSubmitted: null, nextDue: "2026-12-31", evidence: [], notes: "Waived for 2025-26 based on satisfactory prior audit results.", riskLevel: "Low" },
];

const CATEGORIES: RequirementCategory[] = ["Financial Reporting", "Programmatic Reporting", "Audit", "Procurement", "Staffing", "Environmental & Social", "Anti-Terrorism", "Data Protection", "Insurance", "Other"];

/* ═══════════════════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════════════════ */

export function GrantCompliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | ComplianceStatus>("All");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [donorFilter, setDonorFilter] = useState("all");
  const [showDonorDropdown, setShowDonorDropdown] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ComplianceRequirement | null>(null);
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>(REQUIREMENTS);
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs: ("All" | ComplianceStatus)[] = ["All", "Compliant", "Non-Compliant", "At Risk", "Pending Review", "Waived"];
  const donors = Array.from(new Set(requirements.map(r => r.donorName)));

  const filtered = requirements.filter(r => {
    const matchTab = activeTab === "All" || r.status === activeTab;
    const matchSearch = searchQuery === "" ||
      r.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.agreementTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "all" || r.category === categoryFilter;
    const matchDonor = donorFilter === "all" || r.donorName === donorFilter;
    return matchTab && matchSearch && matchCategory && matchDonor;
  });

  const statusCounts = {
    All: requirements.length,
    Compliant: requirements.filter(r => r.status === "Compliant").length,
    "Non-Compliant": requirements.filter(r => r.status === "Non-Compliant").length,
    "At Risk": requirements.filter(r => r.status === "At Risk").length,
    "Pending Review": requirements.filter(r => r.status === "Pending Review").length,
    Waived: requirements.filter(r => r.status === "Waived").length,
  };

  const getStatusStyle = (s: ComplianceStatus) => {
    switch (s) {
      case "Compliant": return "bg-green-100 text-green-700";
      case "Non-Compliant": return "bg-red-100 text-red-700";
      case "At Risk": return "bg-amber-100 text-amber-700";
      case "Pending Review": return "bg-blue-100 text-blue-700";
      case "Waived": return "bg-slate-100 text-slate-500";
    }
  };

  const getStatusIcon = (s: ComplianceStatus) => {
    switch (s) {
      case "Compliant": return <CheckCircle size={12} />;
      case "Non-Compliant": return <XCircle size={12} />;
      case "At Risk": return <AlertTriangle size={12} />;
      case "Pending Review": return <Clock size={12} />;
      case "Waived": return <AlertCircle size={12} />;
    }
  };

  const getRiskStyle = (r: string) => {
    switch (r) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-amber-100 text-amber-700";
      case "Low": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  // Summary cards
  const highRiskCount = requirements.filter(r => r.riskLevel === "High").length;
  const overdue = requirements.filter(r => r.status === "Non-Compliant").length;
  const upcoming = requirements.filter(r => {
    const due = new Date(r.nextDue);
    const now = new Date("2026-03-19");
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  }).length;

  /* ═══ DETAIL VIEW ═══ */
  if (selectedRequirement) {
    const r = selectedRequirement;
    return (
      <div className="h-full flex flex-col bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedRequirement(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
            <ArrowLeft size={18} /><span className="text-[13px] font-medium">Back</span>
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-lg bg-[#0B01D0]/10 flex items-center justify-center">
              <Shield size={16} className="text-[#0B01D0]" />
            </div>
            <div>
              <h1 className="text-[16px] font-semibold text-slate-900">{r.requirement}</h1>
              <p className="text-[11px] text-slate-400">{r.id} · {r.agreementTitle}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${getStatusStyle(r.status)}`}>
            {getStatusIcon(r.status)} {r.status}
          </span>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Info Grid */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
              <Shield size={14} className="text-[#0B01D0]" />
              <h2 className="text-[13px] font-semibold text-slate-800">Requirement Details</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-4">
              {([
                ["Category", r.category],
                ["Frequency", r.frequency],
                ["Donor", r.donorName],
                ["Agreement", r.agreementTitle],
                ["Responsible Person", r.responsiblePerson],
                ["Risk Level", r.riskLevel],
                ["Due Date", new Date(r.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
                ["Next Due", new Date(r.nextDue).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
                ["Last Submitted", r.lastSubmitted ? new Date(r.lastSubmitted).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"],
              ] as [string, string][]).map(([l, v]) => (
                <div key={l} className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{l}</span>
                  {l === "Risk Level" ? (
                    <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-[11px] font-medium ${getRiskStyle(v)}`}>{v}</span>
                  ) : (
                    <span className="text-[12px] text-slate-800 font-medium">{v}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
              <FileText size={14} className="text-purple-600" />
              <h2 className="text-[13px] font-semibold text-slate-800">Description</h2>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-slate-700 leading-relaxed">{r.description}</p>
            </div>
          </section>

          {/* Evidence */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-emerald-600" />
                <h2 className="text-[13px] font-semibold text-slate-800">Evidence / Documents</h2>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{r.evidence.length}</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]">
                <Upload size={12} /> Upload Evidence
              </button>
            </div>
            <div className="p-5">
              {r.evidence.length > 0 ? (
                <div className="space-y-2">
                  {r.evidence.map((e, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><FileText size={14} className="text-blue-500" /></div>
                        <div>
                          <p className="text-[11px] font-medium text-slate-800">{e.name}</p>
                          <p className="text-[10px] text-slate-400">Submitted {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600"><Download size={14} /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-slate-400 text-center py-6">No evidence uploaded yet</p>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-600" />
              <h2 className="text-[13px] font-semibold text-slate-800">Notes & Comments</h2>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-slate-700 leading-relaxed">{r.notes || "No notes."}</p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-green-600 text-white rounded-lg text-[12px] font-semibold hover:bg-green-700 flex items-center gap-2">
              <CheckCircle size={14} /> Mark as Compliant
            </button>
            <button className="px-4 py-2.5 bg-red-600 text-white rounded-lg text-[12px] font-semibold hover:bg-red-700 flex items-center gap-2">
              <XCircle size={14} /> Flag Non-Compliant
            </button>
            <button className="px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <Clock size={14} /> Set Reminder
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ LIST VIEW ═══ */
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900">Grant Compliance Tracker</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Track and manage contract compliance requirements across all agreements</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] shadow-sm">
          <Plus size={16} /><span className="text-[12px] font-semibold">Add Requirement</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Requirements", value: requirements.length, color: "bg-indigo-50 border-indigo-200", textColor: "text-indigo-700", icon: <Shield size={16} className="text-indigo-500" /> },
            { label: "Compliant", value: statusCounts.Compliant, color: "bg-green-50 border-green-200", textColor: "text-green-700", icon: <CheckCircle size={16} className="text-green-500" /> },
            { label: "Non-Compliant", value: overdue, color: "bg-red-50 border-red-200", textColor: "text-red-700", icon: <XCircle size={16} className="text-red-500" /> },
            { label: "At Risk", value: statusCounts["At Risk"], color: "bg-amber-50 border-amber-200", textColor: "text-amber-700", icon: <AlertTriangle size={16} className="text-amber-500" /> },
            { label: "Due in 30 Days", value: upcoming, color: "bg-blue-50 border-blue-200", textColor: "text-blue-700", icon: <Calendar size={16} className="text-blue-500" /> },
          ].map(c => (
            <div key={c.label} className={`${c.color} border rounded-xl px-4 py-3 flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center shrink-0">{c.icon}</div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">{c.label}</p>
                <p className={`text-[20px] font-semibold ${c.textColor} leading-tight`}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="px-6 py-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          {/* Document Vault–style pill tabs */}
          <div className="flex items-center gap-1">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                  activeTab === tab ? "bg-[#0B01D0] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}>
                {tab} <span className="ml-1 opacity-70">({statusCounts[tab]})</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white w-52">
              <Search size={14} className="text-slate-400" />
              <input type="text" placeholder="Search requirements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-[11px] text-slate-900 placeholder:text-slate-400" />
            </div>
            {/* Category Filter */}
            <div className="relative">
              <button onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowDonorDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 min-w-[140px]">
                <span className="text-[11px] text-slate-700 truncate">{categoryFilter === "all" ? "All Categories" : categoryFilter}</span>
                <ChevronDown size={12} className="text-slate-400 shrink-0" />
              </button>
              {showCategoryDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[300px] overflow-auto">
                    <button onClick={() => { setCategoryFilter("all"); setShowCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[11px] hover:bg-slate-50 text-slate-700">All Categories</button>
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => { setCategoryFilter(c); setShowCategoryDropdown(false); }} className="w-full px-3 py-2 text-left text-[11px] hover:bg-slate-50 text-slate-700">{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Donor Filter */}
            <div className="relative">
              <button onClick={() => { setShowDonorDropdown(!showDonorDropdown); setShowCategoryDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 min-w-[140px]">
                <span className="text-[11px] text-slate-700 truncate">{donorFilter === "all" ? "All Donors" : donorFilter}</span>
                <ChevronDown size={12} className="text-slate-400 shrink-0" />
              </button>
              {showDonorDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDonorDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-[300px] overflow-auto">
                    <button onClick={() => { setDonorFilter("all"); setShowDonorDropdown(false); }} className="w-full px-3 py-2 text-left text-[11px] hover:bg-slate-50 text-slate-700">All Donors</button>
                    {donors.map(d => (
                      <button key={d} onClick={() => { setDonorFilter(d); setShowDonorDropdown(false); }} className="w-full px-3 py-2 text-left text-[11px] hover:bg-slate-50 text-slate-700">{d}</button>
                    ))}
                  </div>
                </>
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
              {["ID", "Requirement", "Agreement / Donor", "Category", "Frequency", "Next Due", "Risk", "Status", "Responsible"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? filtered.map((r, idx) => (
              <tr key={r.id} onClick={() => setSelectedRequirement(r)}
                className={`cursor-pointer hover:bg-indigo-50/40 transition-colors ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">{r.id}</td>
                <td className="px-4 py-3">
                  <p className="text-[11px] text-slate-900 font-medium">{r.requirement}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[11px] text-slate-800 font-medium">{r.donorName}</p>
                  <p className="text-[10px] text-slate-400">{r.agreementTitle}</p>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.category}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.frequency}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{new Date(r.nextDue).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRiskStyle(r.riskLevel)}`}>{r.riskLevel}</span></td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusStyle(r.status)}`}>
                    {getStatusIcon(r.status)} {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.responsiblePerson}</td>
              </tr>
            )) : (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-[12px] text-slate-400">No compliance requirements match your filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white shrink-0">
        <span className="text-[11px] text-slate-400">{filtered.length} of {requirements.length} requirement(s)</span>
      </div>

      {/* ═══ ADD REQUIREMENT MODAL ═══ */}
      {showAddModal && <AddRequirementModal onClose={() => setShowAddModal(false)} onSave={(req) => {
        const nextId = `CMP-${String(requirements.length + 1).padStart(3, "0")}`;
        setRequirements(prev => [...prev, { ...req, id: nextId }]);
        setShowAddModal(false);
      }} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Add Requirement Modal
   ═══════════════════════════════════════════════════════════════════════════════ */

function AddRequirementModal({ onClose, onSave }: { onClose: () => void; onSave: (r: Omit<ComplianceRequirement, "id">) => void }) {
  const [form, setForm] = useState({
    requirement: "",
    agreementTitle: "",
    donorName: "",
    agreementId: 0,
    category: "" as RequirementCategory | "",
    description: "",
    frequency: "" as Frequency | "",
    dueDate: "",
    nextDue: "",
    responsiblePerson: "",
    riskLevel: "Medium" as "High" | "Medium" | "Low",
    notes: "",
  });

  const u = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));
  const canSave = form.requirement && form.agreementTitle && form.donorName && form.category && form.frequency && form.dueDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center"><Shield size={18} className="text-[#0B01D0]" /></div>
            <div>
              <h2 className="text-[16px] font-semibold text-slate-900">Add Compliance Requirement</h2>
              <p className="text-[11px] text-slate-400">Create a new compliance tracking item</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Requirement Name <span className="text-red-500">*</span></label>
              <input type="text" value={form.requirement} onChange={e => u("requirement", e.target.value)}
                placeholder="e.g. Quarterly Financial Report" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Agreement <span className="text-red-500">*</span></label>
              <input type="text" value={form.agreementTitle} onChange={e => u("agreementTitle", e.target.value)}
                placeholder="e.g. Youth Empowerment Grant" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Donor <span className="text-red-500">*</span></label>
              <input type="text" value={form.donorName} onChange={e => u("donorName", e.target.value)}
                placeholder="e.g. Bill & Melinda Gates Foundation" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => u("category", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]">
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Frequency <span className="text-red-500">*</span></label>
              <select value={form.frequency} onChange={e => u("frequency", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]">
                <option value="">Select...</option>
                {(["Monthly", "Quarterly", "Semi-Annual", "Annual", "One-Time", "As Needed"] as Frequency[]).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Due Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.dueDate} onChange={e => { u("dueDate", e.target.value); u("nextDue", e.target.value); }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0]" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Responsible Person</label>
              <input type="text" value={form.responsiblePerson} onChange={e => u("responsiblePerson", e.target.value)}
                placeholder="e.g. James Owusu" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Risk Level</label>
              <div className="flex gap-2 mt-1">
                {(["Low", "Medium", "High"] as const).map(r => (
                  <button key={r} onClick={() => setForm(p => ({ ...p, riskLevel: r }))}
                    className={`flex-1 py-2 rounded-lg border text-[11px] font-medium ${form.riskLevel === r
                      ? r === "High" ? "border-red-400 bg-red-50 text-red-700" : r === "Medium" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-green-400 bg-green-50 text-green-700"
                      : "border-slate-200 text-slate-500"}`}>{r}</button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={e => u("description", e.target.value)}
                placeholder="Describe the compliance requirement in detail..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] resize-none placeholder:text-slate-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] text-slate-500 font-medium mb-1.5">Notes</label>
              <textarea rows={2} value={form.notes} onChange={e => u("notes", e.target.value)}
                placeholder="Additional notes..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-700 outline-none focus:border-[#0B01D0] resize-none placeholder:text-slate-400" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
          <button disabled={!canSave} onClick={() => {
            onSave({
              agreementId: form.agreementId,
              agreementTitle: form.agreementTitle,
              donorName: form.donorName,
              category: form.category as RequirementCategory,
              requirement: form.requirement,
              description: form.description,
              frequency: form.frequency as Frequency,
              dueDate: form.dueDate,
              status: "Pending Review",
              responsiblePerson: form.responsiblePerson,
              lastSubmitted: null,
              nextDue: form.nextDue || form.dueDate,
              evidence: [],
              notes: form.notes,
              riskLevel: form.riskLevel,
            });
          }} className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0a01b8] disabled:opacity-40 shadow-sm">
            Add Requirement
          </button>
        </div>
      </div>
    </div>
  );
}
