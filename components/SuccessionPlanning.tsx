import { useState } from "react";
import {
  Search, Download, ChevronDown, Plus, X, ArrowLeft,
  Users, ShieldAlert, CheckCircle2, AlertTriangle, GitBranch, TrendingUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Successor {
  name: string;
  currentRole: string;
  department: string;
  readiness: "Ready Now" | "1–2 Years" | "3–5 Years";
  performance: "Exceptional" | "Strong" | "Solid";
  developmentActions: string;
}

interface SuccessionPlan {
  id: number;
  keyPosition: string;
  department: string;
  incumbent: string;
  incumbentTenure: string;
  criticality: "Critical" | "High" | "Medium";
  vacancyRisk: "High" | "Medium" | "Low";
  status: "On Track" | "At Risk" | "No Successor";
  lastReviewed: string;
  successors: Successor[];
}

// ─── Seed Data ───────────────────────────────────────────────────────────────
const successionData: SuccessionPlan[] = [
  {
    id: 1,
    keyPosition: "Executive Director",
    department: "Executive Office",
    incumbent: "David Bannerman",
    incumbentTenure: "9 years",
    criticality: "Critical",
    vacancyRisk: "High",
    status: "On Track",
    lastReviewed: "Mar 12, 2026",
    successors: [
      { name: "Joyce Blessing", currentRole: "Director of Programs", department: "Programs", readiness: "Ready Now", performance: "Exceptional", developmentActions: "Board exposure, external leadership programme" },
      { name: "Kwame Asante", currentRole: "Head of M&E", department: "M&E", readiness: "1–2 Years", performance: "Strong", developmentActions: "Strategy rotation, financial management training" },
    ],
  },
  {
    id: 2,
    keyPosition: "Director of Finance",
    department: "Finance",
    incumbent: "Yaw Osei",
    incumbentTenure: "6 years",
    criticality: "Critical",
    vacancyRisk: "Medium",
    status: "On Track",
    lastReviewed: "Feb 28, 2026",
    successors: [
      { name: "Kofi Mensah", currentRole: "Finance Manager", department: "Finance", readiness: "Ready Now", performance: "Strong", developmentActions: "Acting cover during leave, donor reporting lead" },
      { name: "Adwoa Mensah", currentRole: "Senior Accountant", department: "Finance", readiness: "3–5 Years", performance: "Solid", developmentActions: "CIMA completion, team lead assignment" },
    ],
  },
  {
    id: 3,
    keyPosition: "Head of Programs",
    department: "Programs",
    incumbent: "Joyce Blessing",
    incumbentTenure: "5 years",
    criticality: "High",
    vacancyRisk: "Medium",
    status: "At Risk",
    lastReviewed: "Mar 01, 2026",
    successors: [
      { name: "Nana Yaw", currentRole: "Senior Program Officer", department: "Programs", readiness: "1–2 Years", performance: "Strong", developmentActions: "Lead a flagship project, stakeholder management coaching" },
    ],
  },
  {
    id: 4,
    keyPosition: "Head of Procurement",
    department: "Procurement",
    incumbent: "Ama Darko",
    incumbentTenure: "7 years",
    criticality: "High",
    vacancyRisk: "Low",
    status: "On Track",
    lastReviewed: "Jan 22, 2026",
    successors: [
      { name: "Kojo Williams", currentRole: "Procurement Officer", department: "Procurement", readiness: "1–2 Years", performance: "Solid", developmentActions: "Contract negotiation training, compliance certification" },
      { name: "Maame Serwaa", currentRole: "Procurement Analyst", department: "Procurement", readiness: "3–5 Years", performance: "Solid", developmentActions: "Category management exposure" },
    ],
  },
  {
    id: 5,
    keyPosition: "Head of IT",
    department: "IT",
    incumbent: "Kwesi Appiah",
    incumbentTenure: "4 years",
    criticality: "Medium",
    vacancyRisk: "High",
    status: "No Successor",
    lastReviewed: "Feb 10, 2026",
    successors: [],
  },
  {
    id: 6,
    keyPosition: "HR Manager",
    department: "HR Management",
    incumbent: "Abena Owusu",
    incumbentTenure: "8 years",
    criticality: "High",
    vacancyRisk: "Medium",
    status: "On Track",
    lastReviewed: "Mar 05, 2026",
    successors: [
      { name: "Esi Barimah", currentRole: "HR Officer", department: "HR Management", readiness: "Ready Now", performance: "Strong", developmentActions: "Lead recruitment cycle, employee relations casework" },
    ],
  },
  {
    id: 7,
    keyPosition: "Head of M&E",
    department: "M&E",
    incumbent: "Kwame Asante",
    incumbentTenure: "6 years",
    criticality: "High",
    vacancyRisk: "Low",
    status: "On Track",
    lastReviewed: "Feb 18, 2026",
    successors: [
      { name: "Kwabena Boateng", currentRole: "M&E Specialist", department: "M&E", readiness: "1–2 Years", performance: "Strong", developmentActions: "Evaluation design lead, data systems training" },
    ],
  },
  {
    id: 8,
    keyPosition: "Communications Lead",
    department: "Communications",
    incumbent: "Yaa Frimpong",
    incumbentTenure: "3 years",
    criticality: "Medium",
    vacancyRisk: "High",
    status: "No Successor",
    lastReviewed: "Jan 30, 2026",
    successors: [],
  },
];

const allDepartments = ["All Departments", "Executive Office", "Finance", "Programs", "Procurement", "IT", "HR Management", "M&E", "Communications"];
const allCriticalities = ["All Criticality", "Critical", "High", "Medium"];
const allStatuses = ["All Statuses", "On Track", "At Risk", "No Successor"];

// ─── Style helpers ───────────────────────────────────────────────────────────
function getStatusColor(status: SuccessionPlan["status"]) {
  switch (status) {
    case "On Track": return "bg-green-50 text-green-700";
    case "At Risk": return "bg-amber-50 text-amber-700";
    case "No Successor": return "bg-red-50 text-red-600";
    default: return "bg-slate-50 text-slate-600";
  }
}

function getCriticalityStyle(c: SuccessionPlan["criticality"]) {
  switch (c) {
    case "Critical": return "bg-red-50 text-red-700";
    case "High": return "bg-orange-50 text-orange-700";
    case "Medium": return "bg-blue-50 text-blue-700";
  }
}

function getRiskStyle(r: SuccessionPlan["vacancyRisk"]) {
  switch (r) {
    case "High": return "bg-red-50 text-red-600";
    case "Medium": return "bg-amber-50 text-amber-700";
    case "Low": return "bg-green-50 text-green-700";
  }
}

function getReadinessStyle(r: Successor["readiness"]) {
  switch (r) {
    case "Ready Now": return "bg-green-50 text-green-700";
    case "1–2 Years": return "bg-blue-50 text-blue-700";
    case "3–5 Years": return "bg-slate-100 text-slate-600";
  }
}

// ─── Detail View ───────────────────────────────────────────────────────────────
function SuccessionDetailView({ plan, onBack }: { plan: SuccessionPlan; onBack: () => void }) {
  const readyNow = plan.successors.filter((s) => s.readiness === "Ready Now").length;
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <h1 className="text-xl font-semibold text-slate-900 truncate">{plan.keyPosition}</h1>
        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(plan.status)}`}>
          {plan.status}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-5">
          {/* Position Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
            <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Position Details</p>
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Key Position</p>
                <p className="text-[13px] text-slate-900">{plan.keyPosition}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p>
                <p className="text-[13px] text-slate-900">{plan.department}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Current Incumbent</p>
                <p className="text-[13px] text-slate-900">{plan.incumbent}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Tenure</p>
                <p className="text-[13px] text-slate-900">{plan.incumbentTenure}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Criticality</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getCriticalityStyle(plan.criticality)}`}>
                  {plan.criticality}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Vacancy Risk</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getRiskStyle(plan.vacancyRisk)}`}>
                  {plan.vacancyRisk}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Last Reviewed</p>
                <p className="text-[13px] text-slate-900">{plan.lastReviewed}</p>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Users size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Identified Successors</p>
                <p className="text-[22px] text-slate-900">{plan.successors.length}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Ready Now</p>
                <p className="text-[22px] text-green-600">{readyNow}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <ShieldAlert size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">In Development</p>
                <p className="text-[22px] text-amber-600">{plan.successors.length - readyNow}</p>
              </div>
            </div>
          </div>

          {/* Successors heading */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <p className="text-[13px] font-semibold text-slate-900">Successor Pipeline</p>
            </div>
          </div>

          {/* Successors table */}
          <div className="flex-1 overflow-auto">
            {plan.successors.length > 0 ? (
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Candidate</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Current Role</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Department</th>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Readiness</th>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Performance</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Development Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.successors.map((s, idx) => (
                    <tr key={idx} className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                      <td className="px-4 py-3"><p className="text-[12px] font-medium text-slate-900">{s.name}</p></td>
                      <td className="px-4 py-3"><p className="text-[12px] text-slate-500">{s.currentRole}</p></td>
                      <td className="px-4 py-3"><p className="text-[12px] text-slate-500">{s.department}</p></td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getReadinessStyle(s.readiness)}`}>
                          {s.readiness}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center"><p className="text-[12px] text-slate-700">{s.performance}</p></td>
                      <td className="px-4 py-3"><p className="text-[12px] text-slate-500">{s.developmentActions}</p></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white">
                <AlertTriangle size={28} className="text-red-400 mb-2" />
                <p className="text-slate-700 text-sm font-medium">No successor identified for this position</p>
                <p className="text-slate-400 text-[12px] mt-1">This is a high-risk gap — add a successor candidate to mitigate vacancy risk.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Plan Modal ───────────────────────────────────────────────────────────
function AddPlanModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    keyPosition: "",
    department: "",
    incumbent: "",
    criticality: "",
    vacancyRisk: "",
  });

  const isValid = form.keyPosition.trim() && form.department && form.incumbent.trim() && form.criticality && form.vacancyRisk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Add Succession Plan</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-700">Key Position <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.keyPosition}
                onChange={(e) => setForm({ ...form, keyPosition: e.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Director of Finance"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">Department <span className="text-red-500">*</span></label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Department</option>
                  {allDepartments.slice(1).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">Current Incumbent <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.incumbent}
                  onChange={(e) => setForm({ ...form, incumbent: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Yaw Osei"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">Criticality <span className="text-red-500">*</span></label>
                <select
                  value={form.criticality}
                  onChange={(e) => setForm({ ...form, criticality: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Criticality</option>
                  {allCriticalities.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-700">Vacancy Risk <span className="text-red-500">*</span></label>
                <select
                  value={form.vacancyRisk}
                  onChange={(e) => setForm({ ...form, vacancyRisk: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Risk</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            disabled={!isValid}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function SuccessionPlanning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedCriticality, setSelectedCriticality] = useState("All Criticality");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showDeptDrop, setShowDeptDrop] = useState(false);
  const [showCritDrop, setShowCritDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SuccessionPlan | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (selectedPlan) {
    return <SuccessionDetailView plan={selectedPlan} onBack={() => setSelectedPlan(null)} />;
  }

  const filtered = successionData.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.keyPosition.toLowerCase().includes(q) ||
      p.incumbent.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q);
    const matchDept = selectedDept === "All Departments" || p.department === selectedDept;
    const matchCrit = selectedCriticality === "All Criticality" || p.criticality === selectedCriticality;
    const matchStatus = selectedStatus === "All Statuses" || p.status === selectedStatus;
    return matchSearch && matchDept && matchCrit && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // KPI stats
  const totalPositions = successionData.length;
  const noSuccessor = successionData.filter((p) => p.status === "No Successor").length;
  const readyNowCount = successionData.filter((p) => p.successors.some((s) => s.readiness === "Ready Now")).length;
  const criticalCount = successionData.filter((p) => p.criticality === "Critical").length;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Succession Planning</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Download size={16} className="text-purple-700" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Add Plan
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-6 pt-4 grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <GitBranch size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Key Positions</p>
            <p className="text-[22px] text-slate-900">{totalPositions}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <ShieldAlert size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Critical Roles</p>
            <p className="text-[22px] text-red-600">{criticalCount}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Ready-Now Cover</p>
            <p className="text-[22px] text-green-600">{readyNowCount}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">No Successor</p>
            <p className="text-[22px] text-amber-600">{noSuccessor}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 mt-4">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-64">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}><X size={14} className="text-slate-400" /></button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Department Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowDeptDrop(!showDeptDrop); setShowCritDrop(false); setShowStatusDrop(false); }}
                className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedDept}</span>
                <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showDeptDrop && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDeptDrop(false)} />
                  <div className="absolute top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {allDepartments.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setSelectedDept(d); setShowDeptDrop(false); setCurrentPage(1); }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Criticality Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowCritDrop(!showCritDrop); setShowDeptDrop(false); setShowStatusDrop(false); }}
                className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedCriticality}</span>
                <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showCritDrop && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCritDrop(false)} />
                  <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {allCriticalities.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setSelectedCriticality(c); setShowCritDrop(false); setCurrentPage(1); }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowStatusDrop(!showStatusDrop); setShowDeptDrop(false); setShowCritDrop(false); }}
                className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={14} className="text-purple-700" />
              </button>
              {showStatusDrop && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDrop(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {allStatuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSelectedStatus(s); setShowStatusDrop(false); setCurrentPage(1); }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                      >
                        {s}
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
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Key Position</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Department</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Current Incumbent</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Criticality</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Vacancy Risk</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Successors</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((plan, idx) => (
              <tr
                key={plan.id}
                className={`border-b border-slate-100 hover:bg-blue-50 transition-colors cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                onClick={() => setSelectedPlan(plan)}
              >
                <td className="px-4 py-3"><p className="text-[12px] font-medium text-slate-900">{plan.keyPosition}</p></td>
                <td className="px-4 py-3"><p className="text-[12px] text-slate-500">{plan.department}</p></td>
                <td className="px-4 py-3"><p className="text-[12px] text-slate-500">{plan.incumbent}</p></td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getCriticalityStyle(plan.criticality)}`}>
                    {plan.criticality}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getRiskStyle(plan.vacancyRisk)}`}>
                    {plan.vacancyRisk}
                  </span>
                </td>
                <td className="px-4 py-3 text-center"><p className="text-[12px] font-medium text-slate-900">{plan.successors.length}</p></td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(plan.status)}`}>
                    {plan.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="px-3 py-1.5 text-[12px] text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    View Plan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-500 text-sm">No succession plans found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm rounded transition-colors ${page === currentPage ? "bg-pink-50 text-pink-600" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ChevronDown size={16} className="-rotate-90 text-pink-600" />
          </button>
        </div>
      </div>

      {showAddModal && <AddPlanModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
