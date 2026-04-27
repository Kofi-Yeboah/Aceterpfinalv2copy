import { useState } from "react";
import {
  Search,
  ArrowLeft,
  Eye,
  CheckCircle,
  Flag,
  X,
  Clock,
  DollarSign,
  Package,
  User,
  AlertTriangle,
  Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PurchaseItem {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  vendor: string;
  expectedDelivery: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  justification: string;
}

interface PurchasePlanSubmission {
  id: string;
  planName: string;
  department: string;
  fiscalYear: string;
  preparedBy: string;
  submittedDate: string;
  totalBudget: number;
  totalItems: number;
  approvalStatus: "Pending Review" | "Approved" | "Flagged";
  flagReason?: string;
  items: PurchaseItem[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const planSubmissions: PurchasePlanSubmission[] = [
  {
    id: "PPA-001",
    planName: "IT Infrastructure Upgrade Plan",
    department: "IT",
    fiscalYear: "FY 2026/27",
    preparedBy: "Kwame Asante",
    submittedDate: "Feb 10, 2026",
    totalBudget: 245000,
    totalItems: 6,
    approvalStatus: "Pending Review",
    items: [
      { id: "IT-1", itemName: "Dell PowerEdge R750 Servers", category: "Hardware", quantity: 4, unitPrice: 18500, totalCost: 74000, vendor: "Dell Technologies", expectedDelivery: "Apr 15, 2026", priority: "Critical", justification: "Current servers reaching end-of-life." },
      { id: "IT-2", itemName: "Cisco Meraki Network Switches", category: "Networking", quantity: 8, unitPrice: 3200, totalCost: 25600, vendor: "Cisco Systems", expectedDelivery: "Apr 20, 2026", priority: "High", justification: "Network expansion for new office wing." },
      { id: "IT-3", itemName: "Microsoft 365 E5 Licenses", category: "Software", quantity: 120, unitPrice: 570, totalCost: 68400, vendor: "Microsoft", expectedDelivery: "Mar 01, 2026", priority: "High", justification: "Annual license renewal." },
      { id: "IT-4", itemName: "UPS Battery Systems", category: "Hardware", quantity: 6, unitPrice: 4500, totalCost: 27000, vendor: "APC by Schneider", expectedDelivery: "May 01, 2026", priority: "Medium", justification: "Power backup for server room." },
      { id: "IT-5", itemName: "Cybersecurity Suite (CrowdStrike)", category: "Software", quantity: 1, unitPrice: 35000, totalCost: 35000, vendor: "CrowdStrike", expectedDelivery: "Mar 15, 2026", priority: "Critical", justification: "Endpoint protection." },
      { id: "IT-6", itemName: "Conference Room AV Equipment", category: "Equipment", quantity: 3, unitPrice: 5000, totalCost: 15000, vendor: "Poly", expectedDelivery: "Jun 01, 2026", priority: "Low", justification: "Hybrid work meeting rooms." },
    ],
  },
  {
    id: "PPA-002",
    planName: "Communications Equipment Plan",
    department: "Comms",
    fiscalYear: "FY 2026/27",
    preparedBy: "Nana Yaw",
    submittedDate: "Feb 12, 2026",
    totalBudget: 156000,
    totalItems: 5,
    approvalStatus: "Pending Review",
    items: [
      { id: "CM-1", itemName: "Canon EOS R5 Camera Kits", category: "Media Equipment", quantity: 2, unitPrice: 8500, totalCost: 17000, vendor: "Canon Ghana", expectedDelivery: "Apr 01, 2026", priority: "High", justification: "Professional content creation." },
      { id: "CM-2", itemName: "Adobe Creative Cloud Licenses", category: "Software", quantity: 15, unitPrice: 840, totalCost: 12600, vendor: "Adobe", expectedDelivery: "Mar 01, 2026", priority: "High", justification: "Annual renewal for design team." },
      { id: "CM-3", itemName: "Social Media Management Platform", category: "Software", quantity: 1, unitPrice: 18000, totalCost: 18000, vendor: "Sprout Social", expectedDelivery: "Mar 10, 2026", priority: "Medium", justification: "Consolidated social management." },
      { id: "CM-4", itemName: "Branded Promotional Materials", category: "Print", quantity: 5000, unitPrice: 12, totalCost: 60000, vendor: "PrintMax Ghana", expectedDelivery: "May 15, 2026", priority: "Medium", justification: "Q2-Q3 outreach materials." },
      { id: "CM-5", itemName: "Event Production Equipment", category: "Equipment", quantity: 1, unitPrice: 48400, totalCost: 48400, vendor: "Events Plus", expectedDelivery: "Jun 01, 2026", priority: "Low", justification: "PA system and staging." },
    ],
  },
  {
    id: "PPA-003",
    planName: "HR Systems & Equipment Plan",
    department: "HR",
    fiscalYear: "FY 2026/27",
    preparedBy: "Ama Serwaa",
    submittedDate: "Feb 14, 2026",
    totalBudget: 132500,
    totalItems: 5,
    approvalStatus: "Pending Review",
    items: [
      { id: "HR-1", itemName: "HRIS Platform (BambooHR)", category: "Software", quantity: 1, unitPrice: 48000, totalCost: 48000, vendor: "BambooHR", expectedDelivery: "Apr 01, 2026", priority: "Critical", justification: "Centralized HR management." },
      { id: "HR-2", itemName: "Employee Onboarding Kits", category: "Supplies", quantity: 50, unitPrice: 350, totalCost: 17500, vendor: "Office Supplies Ltd", expectedDelivery: "Mar 15, 2026", priority: "Medium", justification: "Welcome kits for new hires." },
      { id: "HR-3", itemName: "Training & Development Platform", category: "Software", quantity: 1, unitPrice: 32000, totalCost: 32000, vendor: "LinkedIn Learning", expectedDelivery: "Mar 01, 2026", priority: "High", justification: "Staff development platform." },
      { id: "HR-4", itemName: "Biometric Access Control System", category: "Hardware", quantity: 4, unitPrice: 5500, totalCost: 22000, vendor: "ZKTeco", expectedDelivery: "May 01, 2026", priority: "Medium", justification: "Security and attendance." },
      { id: "HR-5", itemName: "Ergonomic Office Furniture", category: "Furniture", quantity: 20, unitPrice: 650, totalCost: 13000, vendor: "Herman Miller", expectedDelivery: "Jun 15, 2026", priority: "Low", justification: "Workspace ergonomics." },
    ],
  },
  {
    id: "PPA-004",
    planName: "PMO Tools & Resources Plan",
    department: "PMO",
    fiscalYear: "FY 2026/27",
    preparedBy: "Yaw Osei",
    submittedDate: "Feb 16, 2026",
    totalBudget: 178000,
    totalItems: 5,
    approvalStatus: "Approved",
    items: [],
  },
  {
    id: "PPA-005",
    planName: "Digital Marketing Tools Plan",
    department: "Comms",
    fiscalYear: "FY 2026/27",
    preparedBy: "Kofi Mensah",
    submittedDate: "Mar 01, 2026",
    totalBudget: 67200,
    totalItems: 3,
    approvalStatus: "Flagged",
    flagReason: "Google Ads budget allocation exceeds approved marketing spend threshold. Please provide revised budget breakdown with Q2/Q3 spend projections and ROI estimates.",
    items: [],
  },
  {
    id: "PPA-006",
    planName: "Capacity Building Program",
    department: "PMO",
    fiscalYear: "FY 2026/27",
    preparedBy: "Nana Yaw",
    submittedDate: "Mar 03, 2026",
    totalBudget: 96000,
    totalItems: 3,
    approvalStatus: "Pending Review",
    items: [],
  },
];

const tabs = ["All", "Pending Review", "Approved", "Flagged"] as const;
type TabType = (typeof tabs)[number];

const departments = ["All Departments", "IT", "Comms", "HR", "PMO"] as const;
type DeptFilter = (typeof departments)[number];

// ─── Flag Modal ───────────────────────────────────────────────────────────────

function FlagModal({ planName, onClose, onSubmit }: { planName: string; onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            <h2 className="text-[15px] font-semibold text-slate-900">Flag Purchase Plan</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-[12px] text-slate-600 mb-3">
            Provide reasons for flagging the purchase plan <span className="font-semibold text-slate-900">{planName}</span>:
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reasons for flagging this purchase plan..."
            className="w-full h-28 px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          />
        </div>
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
          <button
            onClick={() => { if (reason.trim()) onSubmit(reason.trim()); }}
            disabled={!reason.trim()}
            className="px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" />
            Flag Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const priorityStyle = (p: string) => {
  switch (p) {
    case "Critical": return "bg-red-100 text-red-700";
    case "High": return "bg-orange-100 text-orange-700";
    case "Medium": return "bg-yellow-100 text-yellow-700";
    default: return "bg-slate-100 text-slate-600";
  }
};

const statusBadge = (s: PurchasePlanSubmission["approvalStatus"]) => {
  switch (s) {
    case "Pending Review": return "bg-amber-100 text-amber-700";
    case "Approved": return "bg-green-100 text-green-700";
    case "Flagged": return "bg-red-100 text-red-700";
  }
};

const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

// ─── Main Component ───────────────────────────────────────────────────────────

export function PurchasePlanApproval() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [selectedDepartment, setSelectedDepartment] = useState<DeptFilter>("All Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [submissions, setSubmissions] = useState(planSubmissions);
  const [selectedPlan, setSelectedPlan] = useState<PurchasePlanSubmission | null>(null);
  const [flagModal, setFlagModal] = useState<PurchasePlanSubmission | null>(null);

  const filteredSubmissions = submissions.filter((s) => {
    const matchesTab = activeTab === "All" || s.approvalStatus === activeTab;
    const matchesDept = selectedDepartment === "All Departments" || s.department === selectedDepartment;
    const matchesSearch =
      s.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.preparedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesDept && matchesSearch;
  });

  // Counts respect the department filter
  const deptFiltered = submissions.filter((s) => selectedDepartment === "All Departments" || s.department === selectedDepartment);
  const tabCounts: Record<TabType, number> = {
    All: deptFiltered.length,
    "Pending Review": deptFiltered.filter((s) => s.approvalStatus === "Pending Review").length,
    Approved: deptFiltered.filter((s) => s.approvalStatus === "Approved").length,
    Flagged: deptFiltered.filter((s) => s.approvalStatus === "Flagged").length,
  };

  // Department counts respect the active status tab
  const tabFiltered = submissions.filter((s) => activeTab === "All" || s.approvalStatus === activeTab);
  const deptCounts: Record<DeptFilter, number> = {
    "All Departments": tabFiltered.length,
    IT: tabFiltered.filter((s) => s.department === "IT").length,
    Comms: tabFiltered.filter((s) => s.department === "Comms").length,
    HR: tabFiltered.filter((s) => s.department === "HR").length,
    PMO: tabFiltered.filter((s) => s.department === "PMO").length,
  };

  const handleApprove = (id: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, approvalStatus: "Approved" as const, flagReason: undefined } : s)));
    if (selectedPlan?.id === id) setSelectedPlan((prev) => prev ? { ...prev, approvalStatus: "Approved", flagReason: undefined } : null);
  };

  const handleFlag = (id: string, reason: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, approvalStatus: "Flagged" as const, flagReason: reason } : s)));
    if (selectedPlan?.id === id) setSelectedPlan((prev) => prev ? { ...prev, approvalStatus: "Flagged", flagReason: reason } : null);
    setFlagModal(null);
  };

  // ─── Detail View ────────────────────────────────────────────────────────

  if (selectedPlan) {
    return (
      <div className="flex flex-col h-full bg-slate-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedPlan(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900">{selectedPlan.planName}</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">{selectedPlan.id} • {selectedPlan.department} Department • {selectedPlan.fiscalYear}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusBadge(selectedPlan.approvalStatus)}`}>
            {selectedPlan.approvalStatus}
          </span>
        </div>

        {/* Summary strip */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-6 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-[12px] text-slate-600">Prepared By: <span className="font-semibold text-slate-900">{selectedPlan.preparedBy}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] text-slate-600">Total Budget: <span className="font-semibold text-slate-900">{formatCurrency(selectedPlan.totalBudget)}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-violet-600" />
            <span className="text-[12px] text-slate-600">Items: <span className="font-semibold text-slate-900">{selectedPlan.totalItems}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-[12px] text-slate-600">Submitted: <span className="font-semibold text-slate-900">{selectedPlan.submittedDate}</span></span>
          </div>
        </div>

        {/* Actions strip */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
          {selectedPlan.approvalStatus !== "Approved" && (
            <>
              <button onClick={() => handleApprove(selectedPlan.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Approve Plan
              </button>
              <button onClick={() => setFlagModal(selectedPlan)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">
                <Flag className="w-4 h-4" />
                Flag Plan
              </button>
            </>
          )}
          {selectedPlan.approvalStatus === "Flagged" && selectedPlan.flagReason && (
            <div className="ml-4 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-red-700">{selectedPlan.flagReason}</p>
            </div>
          )}
        </div>

        {/* Items table */}
        <div className="flex-1 overflow-auto">
          {selectedPlan.items.length === 0 ? (
            <div className="text-center py-16 text-[13px] text-slate-400">No detailed item data available for this submission.</div>
          ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
                <tr>
                  <th className="text-left px-4 py-3 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Item</th>
                  <th className="text-left px-4 py-3 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Category</th>
                  <th className="text-center px-4 py-3 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Qty</th>
                  <th className="text-right px-4 py-3 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Unit Price</th>
                  <th className="text-right px-4 py-3 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Total Cost</th>
                  <th className="text-left px-4 py-3 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Vendor</th>
                  <th className="text-left px-4 py-3 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Expected Delivery</th>
                  <th className="text-center px-4 py-3 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Priority</th>
                </tr>
              </thead>
              <tbody>
                {selectedPlan.items.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-4 py-3">
                      <div className="text-[12px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.itemName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.justification}</div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.category}</td>
                    <td className="px-4 py-3 text-center text-[11px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-[11px] text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-right text-[11px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{formatCurrency(item.totalCost)}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.vendor}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.expectedDelivery}</td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle(item.priority)}`}>{item.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedPlan.items.length > 0 && (
          <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[12px] text-slate-500" style={{ fontFamily: "Montserrat, sans-serif" }}>{selectedPlan.items.length} items in this plan</span>
            <span className="text-[13px] font-semibold text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>Total: {formatCurrency(selectedPlan.totalBudget)}</span>
          </div>
        )}

        {flagModal && (
          <FlagModal
            planName={flagModal.planName}
            onClose={() => setFlagModal(null)}
            onSubmit={(reason) => handleFlag(flagModal.id, reason)}
          />
        )}
      </div>
    );
  }

  // ─── Table View ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-slate-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-[18px] font-semibold text-slate-900">Purchase Plan Approvals</h1>
        <p className="text-[12px] text-slate-500 mt-1">Review and approve annual purchase plans submitted by departments at the beginning of each fiscal year</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[100px] flex items-center justify-center gap-1.5 ${
                activeTab === tab ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Department Filter & Search */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1 rounded-md text-[11px] transition-colors flex items-center gap-1 ${
                selectedDepartment === dept
                  ? "bg-purple-100 text-purple-700 border border-purple-300"
                  : "bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-700 hover:border-slate-300"
              }`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {dept === "All Departments" ? "All Depts" : dept}
              <span className={`px-1 py-0 rounded text-[9px] ${selectedDepartment === dept ? "bg-purple-200/60 text-purple-700" : "bg-slate-200/80 text-slate-400"}`}>
                {deptCounts[dept]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by plan name, department, prepared by, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Plan Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Department</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Fiscal Year</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Prepared By</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Submitted</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Items</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Total Budget</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-[13px] text-slate-400">No purchase plan submissions found.</td></tr>
            ) : (
              filteredSubmissions.map((sub, index) => (
                <tr
                  key={sub.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  onClick={() => setSelectedPlan(sub)}
                >
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.id}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.planName}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">{sub.department}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.fiscalYear}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.preparedBy}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.submittedDate}</td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.totalItems}</td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{formatCurrency(sub.totalBudget)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusBadge(sub.approvalStatus)}`}>{sub.approvalStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedPlan(sub); }} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700" title="View Plan">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
