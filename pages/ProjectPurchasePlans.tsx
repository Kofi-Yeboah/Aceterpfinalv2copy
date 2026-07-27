import { useState } from "react";
import { Search, Eye, ArrowLeft, Calendar, DollarSign, Package, User } from "lucide-react";

/**
 * Purchase plans that originate from an approved project, as opposed to the
 * annual departmental plans. Each project carries exactly one plan, so the list
 * needs no tabs — one row per project.
 */

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
}

interface ProjectPlan {
  id: string;
  planName: string;
  project: string;
  projectCode: string;
  fiscalYear: string;
  preparedBy: string;
  submittedDate: string;
  totalBudget: number;
  totalItems: number;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
  items: PurchaseItem[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPlans: ProjectPlan[] = [
  {
    id: "PP-YES-001",
    planName: "Youth Employment Skills Development — Procurement Plan",
    project: "Youth Employment",
    projectCode: "PRJ-YES-2026",
    fiscalYear: "FY 2026/27",
    preparedBy: "Ama Darko",
    submittedDate: "Feb 08, 2026",
    totalBudget: 194500,
    totalItems: 6,
    status: "Approved",
    items: [
      { id: "YES-1", itemName: "Training Materials & Workbooks", category: "Goods", quantity: 500, unitPrice: 9, totalCost: 4500, vendor: "PrintWorks Ghana Ltd", expectedDelivery: "Apr 15, 2026", priority: "High" },
      { id: "YES-2", itemName: "Laptops for Field Officers", category: "Goods", quantity: 20, unitPrice: 1200, totalCost: 24000, vendor: "Tech Solutions Inc.", expectedDelivery: "Jun 01, 2026", priority: "Critical" },
      { id: "YES-3", itemName: "M&E Framework Review Consultancy", category: "Consultancy", quantity: 1, unitPrice: 15000, totalCost: 15000, vendor: "To be sourced", expectedDelivery: "Jun 30, 2026", priority: "High" },
      { id: "YES-4", itemName: "Workshop Venue & Catering (6 regions)", category: "Services", quantity: 6, unitPrice: 3500, totalCost: 21000, vendor: "To be sourced", expectedDelivery: "May 30, 2026", priority: "Medium" },
      { id: "YES-5", itemName: "Baseline Survey Design Consultancy", category: "Consultancy", quantity: 1, unitPrice: 8000, totalCost: 8000, vendor: "Dr. Kwesi Appiah", expectedDelivery: "May 15, 2026", priority: "High" },
      { id: "YES-6", itemName: "Vocational Training Sub-grants", category: "Services", quantity: 1, unitPrice: 122000, totalCost: 122000, vendor: "Multiple providers", expectedDelivery: "Sep 30, 2026", priority: "Critical" },
    ],
  },
  {
    id: "PP-DLI-001",
    planName: "Digital Literacy Initiative — Procurement Plan",
    project: "Digital Literacy",
    projectCode: "PRJ-DLI-2026",
    fiscalYear: "FY 2026/27",
    preparedBy: "Kwame Boateng",
    submittedDate: "Feb 05, 2026",
    totalBudget: 226500,
    totalItems: 5,
    status: "Approved",
    items: [
      { id: "DLI-1", itemName: "Chromebooks for Computer Labs", category: "Goods", quantity: 40, unitPrice: 350, totalCost: 14000, vendor: "Acer Distributors", expectedDelivery: "Apr 30, 2026", priority: "Critical" },
      { id: "DLI-2", itemName: "Lab Furniture & Installation", category: "Works", quantity: 4, unitPrice: 12000, totalCost: 48000, vendor: "To be sourced", expectedDelivery: "May 15, 2026", priority: "High" },
      { id: "DLI-3", itemName: "Networking & Internet Connectivity", category: "Services", quantity: 4, unitPrice: 8000, totalCost: 32000, vendor: "To be sourced", expectedDelivery: "May 30, 2026", priority: "High" },
      { id: "DLI-4", itemName: "Curriculum Development & Trainer Fees", category: "Consultancy", quantity: 1, unitPrice: 120000, totalCost: 120000, vendor: "To be sourced", expectedDelivery: "Aug 31, 2026", priority: "Critical" },
      { id: "DLI-5", itemName: "Community Outreach Media & Print", category: "Goods", quantity: 1, unitPrice: 12500, totalCost: 12500, vendor: "CreativeEdge Designs", expectedDelivery: "Apr 10, 2026", priority: "Medium" },
    ],
  },
  {
    id: "PP-CHP-001",
    planName: "Community Health Project — Procurement Plan",
    project: "Community Health",
    projectCode: "PRJ-CHP-2026",
    fiscalYear: "FY 2026/27",
    preparedBy: "Yaw Mensah",
    submittedDate: "Feb 12, 2026",
    totalBudget: 158500,
    totalItems: 5,
    status: "Under Review",
    items: [
      { id: "CHP-1", itemName: "Medical Supplies Kits", category: "Goods", quantity: 60, unitPrice: 200, totalCost: 12000, vendor: "MedSupply GH", expectedDelivery: "Apr 20, 2026", priority: "Critical" },
      { id: "CHP-2", itemName: "Cold Chain Equipment", category: "Goods", quantity: 5, unitPrice: 7500, totalCost: 37500, vendor: "To be sourced", expectedDelivery: "Jun 01, 2026", priority: "Critical" },
      { id: "CHP-3", itemName: "Health Worker Training Programme", category: "Services", quantity: 1, unitPrice: 48000, totalCost: 48000, vendor: "To be sourced", expectedDelivery: "Aug 15, 2026", priority: "High" },
      { id: "CHP-4", itemName: "M&E Data Management Platform", category: "Services", quantity: 1, unitPrice: 45000, totalCost: 45000, vendor: "DataViz Consulting", expectedDelivery: "Oct 01, 2026", priority: "High" },
      { id: "CHP-5", itemName: "Tablets for Health Volunteers", category: "Goods", quantity: 40, unitPrice: 400, totalCost: 16000, vendor: "To be sourced", expectedDelivery: "Jul 01, 2026", priority: "Medium" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyle = (s: ProjectPlan["status"]) => {
  switch (s) {
    case "Draft": return "bg-slate-100 text-slate-600";
    case "Submitted": return "bg-blue-100 text-blue-700";
    case "Under Review": return "bg-amber-100 text-amber-700";
    case "Approved": return "bg-green-100 text-green-700";
    case "Rejected": return "bg-red-100 text-red-700";
  }
};

const priorityStyle = (p: string) => {
  switch (p) {
    case "Critical": return "bg-red-100 text-red-700";
    case "High": return "bg-orange-100 text-orange-700";
    case "Medium": return "bg-yellow-100 text-yellow-700";
    default: return "bg-slate-100 text-slate-600";
  }
};

const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProjectPurchasePlans() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<ProjectPlan | null>(null);

  const filteredPlans = mockPlans.filter((p) => {
    const matchesSearch =
      p.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.preparedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // ─── Detail View ────────────────────────────────────────────────────────

  if (selectedPlan) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedPlan(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900">{selectedPlan.planName}</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">{selectedPlan.id} • {selectedPlan.project} ({selectedPlan.projectCode}) • {selectedPlan.fiscalYear}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusStyle(selectedPlan.status)}`}>
            {selectedPlan.status}
          </span>
        </div>

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

        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
              <tr>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Item</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Category</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Qty</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Unit Price</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Total Cost</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Vendor</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Expected Delivery</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody>
              {selectedPlan.items.map((item, index) => (
                <tr key={item.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">{item.itemName}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{item.category}</td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-600">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium">{formatCurrency(item.totalCost)}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{item.vendor}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{item.expectedDelivery}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle(item.priority)}`}>{item.priority}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── List View ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-[18px] font-semibold text-slate-900">Project Purchase Plans</h1>
        <p className="text-[12px] text-slate-500 mt-1">One procurement plan per approved project</p>
      </div>

      {/* Search */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by plan name, prepared by, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Plan Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Project</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Fiscal Year</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Prepared By</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Submitted</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Items</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Total Budget</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-[13px] text-slate-400">No project purchase plans found.</td></tr>
            ) : (
              filteredPlans.map((plan, index) => (
                <tr
                  key={plan.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium">{plan.id}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">{plan.planName}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">{plan.project}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{plan.fiscalYear}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{plan.preparedBy}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{plan.submittedDate}</td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-900 font-medium">{plan.totalItems}</td>
                  <td className="px-4 py-3 text-right text-[12px] text-slate-900 font-medium">{formatCurrency(plan.totalBudget)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusStyle(plan.status)}`}>{plan.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); }} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700" title="View Plan">
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

export default ProjectPurchasePlans;
