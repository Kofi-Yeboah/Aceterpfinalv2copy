import { useState, useEffect } from "react";
import { Search, Download, Upload, ChevronDown, MoreHorizontal, X, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { getGeneratedPRs, subscribe } from "../lib/procurementStore";

interface Requisition {
  id: string;
  requisitionNumber: string;
  requestedBy: string;
  department: string;
  itemDescription: string;
  quantity: number;
  estimatedCost: number;
  priority: string;
  status: string;
  dateRequested: string;
  projectName?: string;
  purchaseType: string;
}

interface ProjectPurchase {
  id: string;
  requisitionNumber: string;
  itemDescription: string;
  category: string;
  wbsTask: string;
  wbsTaskId: string;
  phase: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  vendor: string;
  procurementMethod: string;
  requestedBy: string;
  status: string;
  dateRequested: string;
  deliveryDate: string;
}

const DEPARTMENTS = ["All Departments", "IT", "HR", "Finance", "Operations", "Marketing", "Facilities", "Programs"];
const STATUSES = ["All Statuses", "Pending", "Approved", "Rejected", "In Progress", "Completed", "Pending Dept Approval", "Pending Proc & Finance", "Pending Sr. Mgmt"];
const PRIORITIES = ["All Priorities", "Low", "Medium", "High", "Urgent"];
const PURCHASE_TYPES = ["All Purchase Types", "Direct Purchase", "Competitive Bidding", "Request for Quotation", "Single Source", "Framework Agreement"];

// Mock data: procurement entries from WBS / procurement plan, each linked to a task
const PROJECT_PURCHASES: Record<string, ProjectPurchase[]> = {
  "Youth Employment Skills Development": [
    { id: "PP-1", requisitionNumber: "PR-2024-001", itemDescription: "Consultant Fees - Survey Design", category: "Consulting", wbsTask: "Finalize Survey Instrument Design", wbsTaskId: "T001", phase: "Inception & Planning", quantity: 1, unitCost: 8000, totalCost: 8000, vendor: "Dr. Kwesi Appiah", procurementMethod: "Single Source", requestedBy: "John Smith", status: "Completed", dateRequested: "2024-11-25", deliveryDate: "2025-02-28" },
    { id: "PP-2", requisitionNumber: "PR-2024-001", itemDescription: "Printing & Materials", category: "Goods/Equipment", wbsTask: "Finalize Survey Instrument Design", wbsTaskId: "T001", phase: "Inception & Planning", quantity: 200, unitCost: 5.25, totalCost: 1050, vendor: "PrintWorks Ghana Ltd", procurementMethod: "Direct Purchase", requestedBy: "John Smith", status: "Completed", dateRequested: "2024-11-25", deliveryDate: "2025-01-30" },
    { id: "PP-3", requisitionNumber: "PR-2024-001", itemDescription: "Stakeholder Workshop", category: "Services", wbsTask: "Finalize Survey Instrument Design", wbsTaskId: "T001", phase: "Inception & Planning", quantity: 1, unitCost: 3500, totalCost: 3500, vendor: "La Palm Royal Beach Hotel", procurementMethod: "Request for Quotation", requestedBy: "John Smith", status: "Completed", dateRequested: "2024-11-25", deliveryDate: "2025-02-15" },
    { id: "PP-4", requisitionNumber: "PR-2024-003", itemDescription: "External Reviewer Honoraria", category: "Consulting", wbsTask: "Conduct Internal Peer Review", wbsTaskId: "T002", phase: "Inception & Planning", quantity: 1, unitCost: 4000, totalCost: 4000, vendor: "Prof. Ama Benyiwa", procurementMethod: "Single Source", requestedBy: "Michael Brown", status: "Completed", dateRequested: "2024-11-27", deliveryDate: "2025-03-15" },
    { id: "PP-5", requisitionNumber: "PR-2024-003", itemDescription: "Review Meeting Logistics", category: "Services", wbsTask: "Conduct Internal Peer Review", wbsTaskId: "T002", phase: "Inception & Planning", quantity: 1, unitCost: 1200, totalCost: 1200, vendor: "Accra Events Hub", procurementMethod: "Direct Purchase", requestedBy: "Michael Brown", status: "Completed", dateRequested: "2024-11-27", deliveryDate: "2025-03-10" },
    { id: "PP-6", requisitionNumber: "PR-2024-004", itemDescription: "Research Assistant Stipends", category: "Services", wbsTask: "Complete Literature Review", wbsTaskId: "T003", phase: "Inception & Planning", quantity: 3, unitCost: 2000, totalCost: 6000, vendor: "University of Ghana", procurementMethod: "Direct Purchase", requestedBy: "Emily Davis", status: "Completed", dateRequested: "2024-11-28", deliveryDate: "2025-04-01" },
    { id: "PP-7", requisitionNumber: "PR-2024-004", itemDescription: "Database Subscriptions", category: "Services", wbsTask: "Complete Literature Review", wbsTaskId: "T003", phase: "Inception & Planning", quantity: 1, unitCost: 1800, totalCost: 1800, vendor: "JSTOR / Elsevier", procurementMethod: "Framework Agreement", requestedBy: "Emily Davis", status: "Completed", dateRequested: "2024-11-28", deliveryDate: "2025-01-15" },
    { id: "PP-8", requisitionNumber: "PR-2024-004", itemDescription: "Reference Materials", category: "Goods/Equipment", wbsTask: "Complete Literature Review", wbsTaskId: "T003", phase: "Inception & Planning", quantity: 1, unitCost: 650, totalCost: 650, vendor: "Bookshop Ghana Ltd", procurementMethod: "Direct Purchase", requestedBy: "Emily Davis", status: "Completed", dateRequested: "2024-11-28", deliveryDate: "2025-02-10" },
    { id: "PP-9", requisitionNumber: "PR-2024-009", itemDescription: "Venue & Catering", category: "Services", wbsTask: "Schedule Project Kick-off Meeting", wbsTaskId: "T004", phase: "Delivery", quantity: 1, unitCost: 4800, totalCost: 4800, vendor: "Kempinski Hotel Gold Coast", procurementMethod: "Request for Quotation", requestedBy: "Kwaku Anane", status: "Completed", dateRequested: "2025-01-10", deliveryDate: "2025-05-01" },
    { id: "PP-10", requisitionNumber: "PR-2024-009", itemDescription: "Audio-Visual Equipment Rental", category: "Services", wbsTask: "Schedule Project Kick-off Meeting", wbsTaskId: "T004", phase: "Delivery", quantity: 1, unitCost: 1950, totalCost: 1950, vendor: "AV Solutions Accra", procurementMethod: "Direct Purchase", requestedBy: "Kwaku Anane", status: "Completed", dateRequested: "2025-01-10", deliveryDate: "2025-05-01" },
    { id: "PP-11", requisitionNumber: "PR-2024-009", itemDescription: "Facilitator Fees", category: "Consulting", wbsTask: "Schedule Project Kick-off Meeting", wbsTaskId: "T004", phase: "Delivery", quantity: 1, unitCost: 3000, totalCost: 3000, vendor: "Nana Yaw Mensah", procurementMethod: "Single Source", requestedBy: "Kwaku Anane", status: "Completed", dateRequested: "2025-01-10", deliveryDate: "2025-05-01" },
    { id: "PP-12", requisitionNumber: "PR-2024-010", itemDescription: "Consultant Fees - Engagement", category: "Consulting", wbsTask: "Draft Stakeholder Engagement Plan", wbsTaskId: "T005", phase: "Delivery", quantity: 1, unitCost: 5600, totalCost: 5600, vendor: "Ghana Research Associates", procurementMethod: "Competitive Bidding", requestedBy: "Ama Darko", status: "PO Issued", dateRequested: "2025-01-12", deliveryDate: "2025-07-15" },
    { id: "PP-13", requisitionNumber: "PR-2024-010", itemDescription: "Community Outreach Materials", category: "Goods/Equipment", wbsTask: "Draft Stakeholder Engagement Plan", wbsTaskId: "T005", phase: "Delivery", quantity: 500, unitCost: 4.20, totalCost: 2100, vendor: "CreativeEdge Designs", procurementMethod: "Request for Quotation", requestedBy: "Ama Darko", status: "Delivered", dateRequested: "2025-01-12", deliveryDate: "2025-06-30" },
    { id: "PP-14", requisitionNumber: "PR-2024-010", itemDescription: "Travel - Stakeholder Visits", category: "Services", wbsTask: "Draft Stakeholder Engagement Plan", wbsTaskId: "T005", phase: "Delivery", quantity: 1, unitCost: 4500, totalCost: 4500, vendor: "—", procurementMethod: "Direct Purchase", requestedBy: "Ama Darko", status: "Requisition Raised", dateRequested: "2025-01-12", deliveryDate: "2025-08-01" },
    { id: "PP-15", requisitionNumber: "PR-2024-012", itemDescription: "Laptops (50x Dell Latitude)", category: "Goods/Equipment", wbsTask: "Procure IT Equipment", wbsTaskId: "T009", phase: "Delivery", quantity: 50, unitCost: 950, totalCost: 47500, vendor: "Dell Inc. (via Telefonika Ghana)", procurementMethod: "Competitive Bidding", requestedBy: "Kwame Boateng", status: "Delivered", dateRequested: "2025-01-18", deliveryDate: "2025-06-15" },
    { id: "PP-16", requisitionNumber: "PR-2024-012", itemDescription: "Networking Equipment", category: "Goods/Equipment", wbsTask: "Procure IT Equipment", wbsTaskId: "T009", phase: "Delivery", quantity: 8, unitCost: 437.50, totalCost: 3500, vendor: "—", procurementMethod: "Request for Quotation", requestedBy: "Kwame Boateng", status: "RFQ Issued", dateRequested: "2025-01-18", deliveryDate: "2025-09-01" },
    { id: "PP-17", requisitionNumber: "PR-2024-012", itemDescription: "Software Licences", category: "Services", wbsTask: "Procure IT Equipment", wbsTaskId: "T009", phase: "Delivery", quantity: 50, unitCost: 160, totalCost: 8000, vendor: "—", procurementMethod: "Framework Agreement", requestedBy: "Kwame Boateng", status: "Evaluation", dateRequested: "2025-01-18", deliveryDate: "2025-09-15" },
  ],
  "Digital Literacy Initiative": [
    { id: "PP-18", requisitionNumber: "PR-2024-005", itemDescription: "Marketing Campaign Materials", category: "Materials", wbsTask: "Develop Outreach Strategy", wbsTaskId: "T010", phase: "Inception & Planning", quantity: 1, unitCost: 5000, totalCost: 5000, vendor: "CreativeEdge Accra", procurementMethod: "Request for Quotation", requestedBy: "David Wilson", status: "Pending", dateRequested: "2024-11-29", deliveryDate: "—" },
    { id: "PP-19", requisitionNumber: "PR-2024-014", itemDescription: "Chromebooks for Computer Labs", category: "IT Hardware", wbsTask: "Set Up Digital Labs", wbsTaskId: "T011", phase: "Delivery", quantity: 40, unitCost: 350, totalCost: 14000, vendor: "Acer Distributors", procurementMethod: "Competitive Bidding", requestedBy: "Sarah Johnson", status: "Approved", dateRequested: "2025-01-05", deliveryDate: "2025-02-20" },
  ],
  "Community Health Project": [
    { id: "PP-20", requisitionNumber: "PR-2024-015", itemDescription: "Medical Supplies Kit", category: "Medical", wbsTask: "Procure Health Supplies", wbsTaskId: "T012", phase: "Delivery", quantity: 100, unitCost: 120, totalCost: 12000, vendor: "MedSupply GH", procurementMethod: "Competitive Bidding", requestedBy: "Grace Owusu", status: "In Progress", dateRequested: "2025-01-08", deliveryDate: "2025-02-10" },
  ],
};

export function PurchaseRequisitionManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedPurchaseType, setSelectedPurchaseType] = useState("All Purchase Types");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showPurchaseTypeDropdown, setShowPurchaseTypeDropdown] = useState(false);
  // Add Office PR modal removed
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Subscribe to store for auto-generated PRs from ESS Procurement Plan
  const [, setTick] = useState(0);
  useEffect(() => {
    return subscribe(() => setTick((t) => t + 1));
  }, []);

  const generatedPRs = getGeneratedPRs();

  // Form state removed — Add Office PR button was removed

  const staticRequisitions: Requisition[] = [
    {
      id: "1",
      requisitionNumber: "PR-2024-001",
      requestedBy: "John Smith",
      department: "IT",
      itemDescription: "Dell Laptops (10 units)",
      quantity: 10,
      estimatedCost: 15000,
      priority: "High",
      status: "Pending",
      dateRequested: "2024-11-25",
      projectName: "Youth Employment Skills Development",
      purchaseType: "Competitive Bidding",
    },
    {
      id: "2",
      requisitionNumber: "PR-2024-002",
      requestedBy: "Sarah Johnson",
      department: "HR",
      itemDescription: "Office Furniture Set",
      quantity: 5,
      estimatedCost: 8500,
      priority: "Medium",
      status: "Approved",
      dateRequested: "2024-11-26",
      purchaseType: "Direct Purchase",
    },
    {
      id: "3",
      requisitionNumber: "PR-2024-003",
      requestedBy: "Michael Brown",
      department: "Finance",
      itemDescription: "Accounting Software License",
      quantity: 1,
      estimatedCost: 12000,
      priority: "Urgent",
      status: "In Progress",
      dateRequested: "2024-11-27",
      projectName: "Youth Employment Skills Development",
      purchaseType: "Single Source",
    },
    {
      id: "4",
      requisitionNumber: "PR-2024-004",
      requestedBy: "Emily Davis",
      department: "Operations",
      itemDescription: "Warehouse Equipment",
      quantity: 3,
      estimatedCost: 25000,
      priority: "High",
      status: "Approved",
      dateRequested: "2024-11-28",
      projectName: "Youth Employment Skills Development",
      purchaseType: "Competitive Bidding",
    },
    {
      id: "5",
      requisitionNumber: "PR-2024-005",
      requestedBy: "David Wilson",
      department: "Marketing",
      itemDescription: "Marketing Campaign Materials",
      quantity: 1,
      estimatedCost: 5000,
      priority: "Medium",
      status: "Pending",
      dateRequested: "2024-11-29",
      projectName: "Digital Literacy Initiative",
      purchaseType: "Request for Quotation",
    },
    {
      id: "6",
      requisitionNumber: "PR-2024-006",
      requestedBy: "Lisa Martinez",
      department: "Facilities",
      itemDescription: "HVAC System Maintenance",
      quantity: 1,
      estimatedCost: 18000,
      priority: "Urgent",
      status: "Approved",
      dateRequested: "2024-11-30",
      purchaseType: "Framework Agreement",
    },
    {
      id: "7",
      requisitionNumber: "PR-2024-007",
      requestedBy: "Tom Anderson",
      department: "IT",
      itemDescription: "Network Switches",
      quantity: 8,
      estimatedCost: 6400,
      priority: "High",
      status: "Completed",
      dateRequested: "2024-11-20",
      purchaseType: "Direct Purchase",
    },
    {
      id: "8",
      requisitionNumber: "PR-2024-008",
      requestedBy: "Rachel Green",
      department: "HR",
      itemDescription: "Training Materials",
      quantity: 50,
      estimatedCost: 2500,
      priority: "Low",
      status: "Rejected",
      dateRequested: "2024-11-22",
      purchaseType: "Direct Purchase",
    },
    {
      id: "9",
      requisitionNumber: "PR-2024-009",
      requestedBy: "Kwaku Anane",
      department: "Programs",
      itemDescription: "Survey Tablets (30 units)",
      quantity: 30,
      estimatedCost: 8400,
      priority: "High",
      status: "Pending",
      dateRequested: "2025-01-10",
      projectName: "Youth Employment Skills Development",
      purchaseType: "Request for Quotation",
    },
    {
      id: "10",
      requisitionNumber: "PR-2024-010",
      requestedBy: "Ama Darko",
      department: "Programs",
      itemDescription: "Field Data Collection Software",
      quantity: 1,
      estimatedCost: 4500,
      priority: "Medium",
      status: "Approved",
      dateRequested: "2025-01-12",
      projectName: "Youth Employment Skills Development",
      purchaseType: "Direct Purchase",
    },
    {
      id: "11",
      requisitionNumber: "PR-2024-015",
      requestedBy: "Grace Owusu",
      department: "Programs",
      itemDescription: "Medical Supplies Kit (100 units)",
      quantity: 100,
      estimatedCost: 12000,
      priority: "High",
      status: "In Progress",
      dateRequested: "2025-01-08",
      projectName: "Community Health Project",
      purchaseType: "Competitive Bidding",
    },
  ];

  // Merge static requisitions with auto-generated ones from ESS Procurement Plan
  const requisitions: Requisition[] = [
    ...staticRequisitions,
    ...generatedPRs.map((pr) => ({
      id: pr.id,
      requisitionNumber: pr.requisitionNumber,
      requestedBy: pr.requestedBy,
      department: pr.department,
      itemDescription: pr.itemDescription,
      quantity: pr.quantity,
      estimatedCost: pr.estimatedCost,
      priority: pr.priority,
      status: pr.overallApprovalStatus === "Approved" ? "Approved"
        : pr.overallApprovalStatus === "Rejected" ? "Rejected"
        : pr.overallApprovalStatus === "Pending Dept Approval" ? "Pending Dept Approval"
        : pr.overallApprovalStatus === "Pending Procurement & Finance" ? "Pending Proc & Finance"
        : pr.overallApprovalStatus === "Pending Senior Mgmt" ? "Pending Sr. Mgmt"
        : pr.status,
      dateRequested: pr.dateRequested,
      purchaseType: pr.purchaseType,
    })),
  ];

  const closeAllDropdowns = () => {
    setShowDepartmentDropdown(false);
    setShowStatusDropdown(false);
    setShowPriorityDropdown(false);
    setShowPurchaseTypeDropdown(false);
  };

  const filteredRequisitions = requisitions.filter((req) => {
    const matchesSearch =
      req.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.projectName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || req.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All Statuses" || req.status === selectedStatus;
    const matchesPriority = selectedPriority === "All Priorities" || req.priority === selectedPriority;
    const matchesPurchaseType = selectedPurchaseType === "All Purchase Types" || req.purchaseType === selectedPurchaseType;
    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority && matchesPurchaseType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-600";
      case "Pending":
        return "bg-orange-50 text-orange-600";
      case "In Progress":
        return "bg-blue-50 text-blue-600";
      case "Completed":
        return "bg-purple-50 text-purple-600";
      case "Rejected":
        return "bg-red-50 text-red-600";
      case "Pending Dept Approval":
        return "bg-amber-50 text-amber-600";
      case "Pending Proc & Finance":
        return "bg-indigo-50 text-indigo-600";
      case "Pending Sr. Mgmt":
        return "bg-violet-50 text-violet-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-50 text-red-600";
      case "High":
        return "bg-orange-50 text-orange-600";
      case "Medium":
        return "bg-yellow-50 text-yellow-600";
      case "Low":
        return "bg-green-50 text-green-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getPurchaseTypeColor = (purchaseType: string) => {
    switch (purchaseType) {
      case "Direct Purchase":
        return "bg-emerald-50 text-emerald-600";
      case "Competitive Bidding":
        return "bg-blue-50 text-blue-600";
      case "Request for Quotation":
        return "bg-cyan-50 text-cyan-600";
      case "Single Source":
        return "bg-amber-50 text-amber-600";
      case "Framework Agreement":
        return "bg-violet-50 text-violet-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  // handleAddRequisition removed — Add Office PR button was removed

  // ─── FULL-PAGE DETAIL VIEW ─────────────────────────────────
  if (selectedRequisition) {
    const projectPurchases =
      selectedRequisition.projectName
        ? PROJECT_PURCHASES[selectedRequisition.projectName] || []
        : [];

    const totalProjectCost = projectPurchases.reduce((sum, p) => sum + p.totalCost, 0);
    const approvedCost = projectPurchases
      .filter((p) => p.status === "Approved" || p.status === "Completed")
      .reduce((sum, p) => sum + p.totalCost, 0);
    const pendingCost = projectPurchases
      .filter((p) => p.status === "Pending" || p.status === "In Progress")
      .reduce((sum, p) => sum + p.totalCost, 0);

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4">
          <button
            onClick={() => setSelectedRequisition(null)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{selectedRequisition.requisitionNumber}</h1>
              <Badge className={cn("text-[12px] font-medium shadow-none border-0", getPurchaseTypeColor(selectedRequisition.purchaseType))}>
                {selectedRequisition.purchaseType}
              </Badge>
              <Badge className={cn("text-[12px] font-medium shadow-none border-0", getStatusColor(selectedRequisition.status))}>
                {selectedRequisition.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {selectedRequisition.projectName
                ? `Project: ${selectedRequisition.projectName}`
                : "Office / Administrative Requisition"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Requisition Information Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Requisition Information</h2>
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Requested By</p>
                <p className="text-sm font-medium text-slate-900">{selectedRequisition.requestedBy}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Department</p>
                <p className="text-sm font-medium text-slate-900">{selectedRequisition.department}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Date Requested</p>
                <p className="text-sm font-medium text-slate-900">{formatDate(selectedRequisition.dateRequested)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Priority</p>
                <Badge className={cn("text-xs font-medium shadow-none border-0", getPriorityColor(selectedRequisition.priority))}>
                  {selectedRequisition.priority}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Item Description</p>
                <p className="text-sm font-medium text-slate-900">{selectedRequisition.itemDescription}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Quantity</p>
                <p className="text-sm font-medium text-slate-900">{selectedRequisition.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Estimated Cost</p>
                <p className="text-sm font-medium text-slate-900">{formatCurrency(selectedRequisition.estimatedCost)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Purchase Type</p>
                <Badge className={cn("text-xs font-medium shadow-none border-0", getPurchaseTypeColor(selectedRequisition.purchaseType))}>
                  {selectedRequisition.purchaseType}
                </Badge>
              </div>
            </div>
            {selectedRequisition.projectName && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Linked Project</p>
                <p className="text-sm font-medium text-indigo-700">{selectedRequisition.projectName}</p>
              </div>
            )}
          </div>

          {/* Project Purchases Section — only for Project PRs */}
          {selectedRequisition.projectName && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-[12px] text-blue-600 font-medium mb-1">Total Purchases</p>
                  <p className="text-2xl font-semibold text-blue-900">{projectPurchases.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <p className="text-[12px] text-emerald-600 font-medium mb-1">Total Cost</p>
                  <p className="text-2xl font-semibold text-emerald-900">{formatCurrency(totalProjectCost)}</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                  <p className="text-[12px] text-purple-600 font-medium mb-1">Approved / Delivered</p>
                  <p className="text-2xl font-semibold text-purple-900">{formatCurrency(approvedCost)}</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <p className="text-[12px] text-amber-600 font-medium mb-1">Pending / In Progress</p>
                  <p className="text-2xl font-semibold text-amber-900">{formatCurrency(pendingCost)}</p>
                </div>
              </div>

              {/* Procurement Plan Entries — Flat Table (from WBS) */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Procurement Plan — {selectedRequisition.projectName}
                  </h2>
                  <p className="text-[12px] text-slate-500 mt-1">
                    All procurement entries from the WBS, each linked to a task
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "#0B01D0" }}>
                      <tr>
                        <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Entry</th>
                        <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
                        <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">WBS Task</th>
                        <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Phase</th>
                        <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Method</th>
                        <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Qty</th>
                        <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Unit Cost</th>
                        <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Total Cost</th>
                        <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Vendor</th>
                        <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Expected Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectPurchases.map((purchase, idx) => {
                        const isCurrentReq = purchase.requisitionNumber === selectedRequisition.requisitionNumber;
                        return (
                          <tr
                            key={purchase.id}
                            className={cn(
                              "border-b border-slate-100 hover:bg-slate-50",
                              isCurrentReq && "bg-indigo-50/60 ring-1 ring-inset ring-indigo-200",
                              idx % 2 === 1 && !isCurrentReq && "bg-slate-50/40"
                            )}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-medium text-slate-900">{purchase.itemDescription}</span>
                                {isCurrentReq && (
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" title="Current requisition" />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                                purchase.category === "Consulting" ? "bg-rose-100 text-rose-700" :
                                purchase.category === "Goods/Equipment" || purchase.category === "IT Hardware" ? "bg-cyan-100 text-cyan-700" :
                                purchase.category === "Services" ? "bg-violet-100 text-violet-700" :
                                "bg-slate-100 text-slate-600"
                              }`}>
                                {purchase.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="text-[12px] text-slate-900 font-medium">{purchase.wbsTask}</span>
                                <span className="text-[11px] text-slate-400 font-mono">{purchase.wbsTaskId}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                                purchase.phase === "Inception & Planning" ? "bg-blue-50 text-blue-700" :
                                purchase.phase === "Delivery" ? "bg-emerald-50 text-emerald-700" :
                                "bg-amber-50 text-amber-700"
                              }`}>
                                {purchase.phase}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                                purchase.procurementMethod === "Direct Purchase" ? "bg-slate-100 text-slate-700" :
                                purchase.procurementMethod === "Competitive Bidding" ? "bg-blue-100 text-blue-700" :
                                purchase.procurementMethod === "Request for Quotation" ? "bg-indigo-100 text-indigo-700" :
                                purchase.procurementMethod === "Single Source" ? "bg-amber-100 text-amber-700" :
                                "bg-purple-100 text-purple-700"
                              }`}>
                                {purchase.procurementMethod}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-[12px] text-slate-900">{purchase.quantity}</td>
                            <td className="px-4 py-3 text-right text-[12px] text-slate-600">{formatCurrency(purchase.unitCost)}</td>
                            <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-900">{formatCurrency(purchase.totalCost)}</td>
                            <td className="px-4 py-3 text-[12px] text-slate-600">{purchase.vendor}</td>
                            <td className="px-4 py-3 text-[12px] text-slate-500">{purchase.deliveryDate !== "—" ? formatDate(purchase.deliveryDate) : "—"}</td>
                          </tr>
                        );
                      })}
                      {/* Totals Row */}
                      <tr className="bg-slate-100 border-t-2 border-slate-300">
                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-900" colSpan={7}>Grand Total</td>
                        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(totalProjectCost)}</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Approval History */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Approval History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Approver</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Role</th>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Action</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Date & Time</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "1", approver: "John Smith", role: "Department Head", action: "Approved", date: "Nov 26, 2024, 10:30 AM", comments: "Approved for procurement" },
                    { id: "2", approver: "Sarah Johnson", role: "Finance Manager", action: "Approved", date: "Nov 26, 2024, 02:15 PM", comments: "Budget allocation confirmed" },
                    { id: "3", approver: "Michael Brown", role: "Procurement Manager", action: "Pending Review", date: "Nov 27, 2024, 09:00 AM", comments: "Reviewing supplier options" },
                  ].map((approval) => (
                    <tr key={approval.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-[12px] font-medium text-slate-900">{approval.approver}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-500">{approval.role}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${approval.action === "Approved" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                          {approval.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-500">{approval.date}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-700">{approval.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN LIST VIEW ────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Purchase Requisition Management</h1>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span>
              <Download size={16} className="text-purple-700" />
            </button>

            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Upload CSV</span>
              <Upload size={16} className="text-purple-700" />
            </button>

            {/* Purchase Type Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowPurchaseTypeDropdown(!showPurchaseTypeDropdown);
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm",
                  selectedPurchaseType !== "All Purchase Types"
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                )}
              >
                <span className="text-sm text-slate-900">{selectedPurchaseType}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showPurchaseTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPurchaseTypeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {PURCHASE_TYPES.map((pt) => (
                      <button
                        key={pt}
                        onClick={() => {
                          setSelectedPurchaseType(pt);
                          setShowPurchaseTypeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors",
                          selectedPurchaseType === pt && "bg-emerald-50 font-medium"
                        )}
                      >
                        {pt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Department Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowDepartmentDropdown(!showDepartmentDropdown);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedDepartment}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showDepartmentDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDepartmentDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setShowDepartmentDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowPriorityDropdown(!showPriorityDropdown);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedPriority}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showPriorityDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPriorityDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {PRIORITIES.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => {
                          setSelectedPriority(priority);
                          setShowPriorityDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowStatusDropdown(!showStatusDropdown);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {status}
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
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Requisition #
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Requested By
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Department
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Item Description
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Purchase Type
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Project
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Quantity
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Estimated Cost
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Priority
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Status
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Date Requested
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequisitions.map((req) => (
              <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{req.requisitionNumber}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{req.requestedBy}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{req.department}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{req.itemDescription}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getPurchaseTypeColor(req.purchaseType)}`}>
                    {req.purchaseType}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">
                    {req.projectName || <span className="text-slate-300">—</span>}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{req.quantity}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{formatCurrency(req.estimatedCost)}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getPriorityColor(req.priority)}`}>
                    {req.priority}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{formatDate(req.dateRequested)}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="relative">
                    <button
                      onClick={() => setOpenActionMenuId(openActionMenuId === req.id ? null : req.id)}
                      className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                    >
                      <MoreHorizontal size={20} className="text-blue-800" />
                    </button>
                    {openActionMenuId === req.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <button
                            onClick={() => {
                              setSelectedRequisition(req);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              console.log("Edit requisition:", req);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              console.log("Delete requisition:", req);
                              setOpenActionMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
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
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>
          
          <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">
            1
          </button>
          
          <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
            2
          </button>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <ChevronDown size={16} className="-rotate-90 text-pink-600" />
          </button>
        </div>
      </div>

      {/* Add Office PR modal removed */}
    </div>
  );
}