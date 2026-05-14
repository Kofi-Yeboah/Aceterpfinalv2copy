import { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Package,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit3,
  Trash2,
  Download,
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

interface PurchasePlan {
  id: string;
  planName: string;
  department: "IT" | "Comms" | "HR" | "PMO";
  fiscalYear: string;
  preparedBy: string;
  submittedDate: string;
  totalBudget: number;
  totalItems: number;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
  items: PurchaseItem[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPlans: PurchasePlan[] = [
  {
    id: "PP-IT-001",
    planName: "IT Infrastructure Upgrade Plan",
    department: "IT",
    fiscalYear: "FY 2026/27",
    preparedBy: "Kwame Asante",
    submittedDate: "Feb 10, 2026",
    totalBudget: 245000,
    totalItems: 6,
    status: "Submitted",
    items: [
      { id: "IT-1", itemName: "Dell PowerEdge R750 Servers", category: "Hardware", quantity: 4, unitPrice: 18500, totalCost: 74000, vendor: "Dell Technologies", expectedDelivery: "Apr 15, 2026", priority: "Critical", justification: "Current servers reaching end-of-life, critical for system uptime." },
      { id: "IT-2", itemName: "Cisco Meraki Network Switches", category: "Networking", quantity: 8, unitPrice: 3200, totalCost: 25600, vendor: "Cisco Systems", expectedDelivery: "Apr 20, 2026", priority: "High", justification: "Network expansion for new office wing." },
      { id: "IT-3", itemName: "Microsoft 365 E5 Licenses", category: "Software", quantity: 120, unitPrice: 570, totalCost: 68400, vendor: "Microsoft", expectedDelivery: "Mar 01, 2026", priority: "High", justification: "Annual license renewal for all staff." },
      { id: "IT-4", itemName: "UPS Battery Systems", category: "Hardware", quantity: 6, unitPrice: 4500, totalCost: 27000, vendor: "APC by Schneider", expectedDelivery: "May 01, 2026", priority: "Medium", justification: "Power backup for server room." },
      { id: "IT-5", itemName: "Cybersecurity Suite (CrowdStrike)", category: "Software", quantity: 1, unitPrice: 35000, totalCost: 35000, vendor: "CrowdStrike", expectedDelivery: "Mar 15, 2026", priority: "Critical", justification: "Endpoint protection and threat detection." },
      { id: "IT-6", itemName: "Conference Room AV Equipment", category: "Equipment", quantity: 3, unitPrice: 5000, totalCost: 15000, vendor: "Poly", expectedDelivery: "Jun 01, 2026", priority: "Low", justification: "Upgrade meeting rooms for hybrid work." },
    ],
  },
  {
    id: "PP-IT-002",
    planName: "Software Development Tools Plan",
    department: "IT",
    fiscalYear: "FY 2026/27",
    preparedBy: "Ama Darko",
    submittedDate: "Feb 18, 2026",
    totalBudget: 89500,
    totalItems: 4,
    status: "Draft",
    items: [
      { id: "IT-7", itemName: "GitHub Enterprise Licenses", category: "Software", quantity: 50, unitPrice: 252, totalCost: 12600, vendor: "GitHub", expectedDelivery: "Mar 10, 2026", priority: "High", justification: "Development team collaboration platform." },
      { id: "IT-8", itemName: "JetBrains IDE Licenses", category: "Software", quantity: 30, unitPrice: 649, totalCost: 19470, vendor: "JetBrains", expectedDelivery: "Mar 10, 2026", priority: "Medium", justification: "Developer productivity tools." },
      { id: "IT-9", itemName: "AWS Cloud Credits", category: "Cloud Services", quantity: 1, unitPrice: 42000, totalCost: 42000, vendor: "Amazon Web Services", expectedDelivery: "Mar 01, 2026", priority: "Critical", justification: "Annual cloud infrastructure hosting." },
      { id: "IT-10", itemName: "Jira & Confluence Licenses", category: "Software", quantity: 80, unitPrice: 193, totalCost: 15430, vendor: "Atlassian", expectedDelivery: "Mar 15, 2026", priority: "Medium", justification: "Project management & documentation." },
    ],
  },
  {
    id: "PP-COM-001",
    planName: "Communications Equipment Plan",
    department: "Comms",
    fiscalYear: "FY 2026/27",
    preparedBy: "Nana Yaw",
    submittedDate: "Feb 12, 2026",
    totalBudget: 156000,
    totalItems: 5,
    status: "Submitted",
    items: [
      { id: "CM-1", itemName: "Canon EOS R5 Camera Kits", category: "Media Equipment", quantity: 2, unitPrice: 8500, totalCost: 17000, vendor: "Canon Ghana", expectedDelivery: "Apr 01, 2026", priority: "High", justification: "Professional content creation for campaigns." },
      { id: "CM-2", itemName: "Adobe Creative Cloud Licenses", category: "Software", quantity: 15, unitPrice: 840, totalCost: 12600, vendor: "Adobe", expectedDelivery: "Mar 01, 2026", priority: "High", justification: "Annual renewal for design & video team." },
      { id: "CM-3", itemName: "Social Media Management Platform", category: "Software", quantity: 1, unitPrice: 18000, totalCost: 18000, vendor: "Sprout Social", expectedDelivery: "Mar 10, 2026", priority: "Medium", justification: "Consolidated social media management." },
      { id: "CM-4", itemName: "Branded Promotional Materials", category: "Print", quantity: 5000, unitPrice: 12, totalCost: 60000, vendor: "PrintMax Ghana", expectedDelivery: "May 15, 2026", priority: "Medium", justification: "Outreach and visibility materials for Q2-Q3." },
      { id: "CM-5", itemName: "Event Production Equipment", category: "Equipment", quantity: 1, unitPrice: 48400, totalCost: 48400, vendor: "Events Plus", expectedDelivery: "Jun 01, 2026", priority: "Low", justification: "PA system, lighting, and staging for events." },
    ],
  },
  {
    id: "PP-COM-002",
    planName: "Digital Marketing Tools Plan",
    department: "Comms",
    fiscalYear: "FY 2026/27",
    preparedBy: "Kofi Mensah",
    submittedDate: "Mar 01, 2026",
    totalBudget: 67200,
    totalItems: 3,
    status: "Approved",
    items: [
      { id: "CM-6", itemName: "Google Ads Budget Allocation", category: "Digital Advertising", quantity: 1, unitPrice: 36000, totalCost: 36000, vendor: "Google", expectedDelivery: "Mar 01, 2026", priority: "High", justification: "Annual digital advertising campaign budget." },
      { id: "CM-7", itemName: "Email Marketing Platform (Mailchimp)", category: "Software", quantity: 1, unitPrice: 15600, totalCost: 15600, vendor: "Mailchimp", expectedDelivery: "Mar 01, 2026", priority: "Medium", justification: "Stakeholder and donor communications." },
      { id: "CM-8", itemName: "Analytics & SEO Tools Bundle", category: "Software", quantity: 1, unitPrice: 15600, totalCost: 15600, vendor: "SEMrush", expectedDelivery: "Mar 05, 2026", priority: "Medium", justification: "Website analytics and search optimization." },
    ],
  },
  {
    id: "PP-HR-001",
    planName: "HR Systems & Equipment Plan",
    department: "HR",
    fiscalYear: "FY 2026/27",
    preparedBy: "Ama Serwaa",
    submittedDate: "Feb 14, 2026",
    totalBudget: 132500,
    totalItems: 5,
    status: "Under Review",
    items: [
      { id: "HR-1", itemName: "HRIS Platform (BambooHR)", category: "Software", quantity: 1, unitPrice: 48000, totalCost: 48000, vendor: "BambooHR", expectedDelivery: "Apr 01, 2026", priority: "Critical", justification: "Centralized HR management system." },
      { id: "HR-2", itemName: "Employee Onboarding Kits", category: "Supplies", quantity: 50, unitPrice: 350, totalCost: 17500, vendor: "Office Supplies Ltd", expectedDelivery: "Mar 15, 2026", priority: "Medium", justification: "Welcome kits for new hires in Q2-Q4." },
      { id: "HR-3", itemName: "Training & Development Platform", category: "Software", quantity: 1, unitPrice: 32000, totalCost: 32000, vendor: "LinkedIn Learning", expectedDelivery: "Mar 01, 2026", priority: "High", justification: "Staff professional development platform." },
      { id: "HR-4", itemName: "Biometric Access Control System", category: "Hardware", quantity: 4, unitPrice: 5500, totalCost: 22000, vendor: "ZKTeco", expectedDelivery: "May 01, 2026", priority: "Medium", justification: "Office security and attendance tracking." },
      { id: "HR-5", itemName: "Ergonomic Office Furniture", category: "Furniture", quantity: 20, unitPrice: 650, totalCost: 13000, vendor: "Herman Miller", expectedDelivery: "Jun 15, 2026", priority: "Low", justification: "Workspace ergonomics improvement initiative." },
    ],
  },
  {
    id: "PP-HR-002",
    planName: "Recruitment & Compliance Tools",
    department: "HR",
    fiscalYear: "FY 2026/27",
    preparedBy: "Kwesi Appiah",
    submittedDate: "Feb 20, 2026",
    totalBudget: 54800,
    totalItems: 3,
    status: "Draft",
    items: [
      { id: "HR-6", itemName: "Applicant Tracking System (Greenhouse)", category: "Software", quantity: 1, unitPrice: 28000, totalCost: 28000, vendor: "Greenhouse", expectedDelivery: "Apr 01, 2026", priority: "High", justification: "Streamline recruitment workflow." },
      { id: "HR-7", itemName: "Background Check Service Credits", category: "Services", quantity: 200, unitPrice: 85, totalCost: 17000, vendor: "Sterling Check", expectedDelivery: "Mar 15, 2026", priority: "Medium", justification: "Pre-employment screening for new hires." },
      { id: "HR-8", itemName: "Compliance Training Modules", category: "Software", quantity: 1, unitPrice: 9800, totalCost: 9800, vendor: "SAI360", expectedDelivery: "Mar 20, 2026", priority: "Medium", justification: "Mandatory compliance training for all staff." },
    ],
  },
  {
    id: "PP-PMO-001",
    planName: "PMO Tools & Resources Plan",
    department: "PMO",
    fiscalYear: "FY 2026/27",
    preparedBy: "Yaw Osei",
    submittedDate: "Feb 16, 2026",
    totalBudget: 178000,
    totalItems: 5,
    status: "Submitted",
    items: [
      { id: "PMO-1", itemName: "Microsoft Project Online Licenses", category: "Software", quantity: 40, unitPrice: 660, totalCost: 26400, vendor: "Microsoft", expectedDelivery: "Mar 01, 2026", priority: "High", justification: "Project planning and scheduling tool for PMs." },
      { id: "PMO-2", itemName: "Risk Management Platform (ARM)", category: "Software", quantity: 1, unitPrice: 45000, totalCost: 45000, vendor: "Resolver Inc", expectedDelivery: "Apr 01, 2026", priority: "Critical", justification: "Enterprise risk assessment and tracking." },
      { id: "PMO-3", itemName: "Data Analytics & BI Licenses (Power BI)", category: "Software", quantity: 25, unitPrice: 1200, totalCost: 30000, vendor: "Microsoft", expectedDelivery: "Mar 10, 2026", priority: "High", justification: "Data visualization for project reporting." },
      { id: "PMO-4", itemName: "External Consultant Engagement", category: "Services", quantity: 3, unitPrice: 18000, totalCost: 54000, vendor: "Deloitte Ghana", expectedDelivery: "Apr 15, 2026", priority: "Medium", justification: "Specialized consultancy for methodology refinement." },
      { id: "PMO-5", itemName: "Project Audit & Quality Tools", category: "Software", quantity: 1, unitPrice: 22600, totalCost: 22600, vendor: "Planview", expectedDelivery: "May 01, 2026", priority: "Medium", justification: "Project portfolio audit & quality management." },
    ],
  },
  {
    id: "PP-PMO-002",
    planName: "Capacity Building Program",
    department: "PMO",
    fiscalYear: "FY 2026/27",
    preparedBy: "Nana Yaw",
    submittedDate: "Mar 03, 2026",
    totalBudget: 96000,
    totalItems: 3,
    status: "Approved",
    items: [
      { id: "PMO-6", itemName: "PMP Certification Training", category: "Training", quantity: 15, unitPrice: 3200, totalCost: 48000, vendor: "PMI Ghana Chapter", expectedDelivery: "Apr 01, 2026", priority: "High", justification: "Staff certification program for project managers." },
      { id: "PMO-7", itemName: "Agile/Scrum Master Training", category: "Training", quantity: 10, unitPrice: 2800, totalCost: 28000, vendor: "Scrum Alliance", expectedDelivery: "May 01, 2026", priority: "Medium", justification: "Agile methodology adoption training." },
      { id: "PMO-8", itemName: "Knowledge Management Platform", category: "Software", quantity: 1, unitPrice: 20000, totalCost: 20000, vendor: "Confluence", expectedDelivery: "Mar 15, 2026", priority: "Medium", justification: "Centralized lessons learned repository." },
    ],
  },
];

const departments = ["All", "IT", "Comms", "HR", "PMO"] as const;
type DeptTab = (typeof departments)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyle = (s: PurchasePlan["status"]) => {
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

export function PurchasePlan() {
  const [activeTab, setActiveTab] = useState<DeptTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PurchasePlan | null>(null);

  const filteredPlans = mockPlans.filter((p) => {
    const matchesTab = activeTab === "All" || p.department === activeTab;
    const matchesSearch =
      p.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.preparedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<DeptTab, number> = {
    All: mockPlans.length,
    IT: mockPlans.filter((p) => p.department === "IT").length,
    Comms: mockPlans.filter((p) => p.department === "Comms").length,
    HR: mockPlans.filter((p) => p.department === "HR").length,
    PMO: mockPlans.filter((p) => p.department === "PMO").length,
  };

  // ─── Detail View ────────────────────────────────────────────────────────

  if (selectedPlan) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedPlan(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900">{selectedPlan.planName}</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">{selectedPlan.id} • {selectedPlan.department} Department • {selectedPlan.fiscalYear}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusStyle(selectedPlan.status)}`}>
            {selectedPlan.status}
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

        {/* Items table */}
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
              {selectedPlan.items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-4 py-3">
                    <div className="text-[12px] text-slate-900 font-medium">{item.itemName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.justification}</div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{item.category}</td>
                  <td className="px-4 py-3 text-center text-[11px] text-slate-900 font-medium">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-[11px] text-slate-900">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right text-[11px] text-slate-900 font-medium">{formatCurrency(item.totalCost)}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{item.vendor}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{item.expectedDelivery}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle(item.priority)}`}>{item.priority}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[12px] text-slate-500">{selectedPlan.items.length} items in this plan</span>
          <span className="text-[13px] font-semibold text-slate-900">Total: {formatCurrency(selectedPlan.totalBudget)}</span>
        </div>
      </div>
    );
  }

  // ─── Table View ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-[18px] font-semibold text-slate-900">Purchase Plans</h1>
        <p className="text-[12px] text-slate-500 mt-1">Annual purchase plans submitted by departments at the beginning of each fiscal year</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {departments.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[80px] flex items-center justify-center gap-1.5 ${
                activeTab === tab ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
             
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Department</th>
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
              <tr><td colSpan={10} className="text-center py-12 text-[13px] text-slate-400">No purchase plans found.</td></tr>
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
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">{plan.department}</span>
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
