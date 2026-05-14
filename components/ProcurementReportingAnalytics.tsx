import { useState } from "react";
import {
  Search, Download, ChevronDown, TrendingUp,
  FileText, Clock, CheckCircle2, AlertTriangle,
  Users, Package, DollarSign,
  CalendarClock, ShieldCheck,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart
} from "recharts";

/* ══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "Montserrat, sans-serif";
const BLUE = "#0B01D0";
const TIME_PERIODS = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year", "All Time"];
const PERIOD_FILTERS = ["Monthly", "Quarterly", "Annually", "Custom Range"] as const;

type TabKey = "planning" | "sourcing" | "vendors" | "contracts" | "donors" | "combined";

const TAB_LABELS: Record<TabKey, string> = {
  planning: "Planning & Orders",
  sourcing: "Sourcing & Contracts",
  vendors: "Vendors & KPIs",
  contracts: "Contract Reports",
  donors: "Donor Reports",
  combined: "Combined Analysis",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK DATA — PLANNING & ORDERS
   ══════════════════════════════════════════════════════════════════════════════ */

const pipelineData = [
  { month: "Oct", planned: 12, initiated: 10, completed: 7 },
  { month: "Nov", planned: 15, initiated: 13, completed: 10 },
  { month: "Dec", planned: 9, initiated: 8, completed: 6 },
  { month: "Jan", planned: 18, initiated: 16, completed: 12 },
  { month: "Feb", planned: 14, initiated: 12, completed: 9 },
  { month: "Mar", planned: 20, initiated: 17, completed: 11 },
];

const budgetUtilization = [
  { department: "IT", allocated: 450000, utilized: 382000, committed: 45000 },
  { department: "Operations", allocated: 320000, utilized: 275000, committed: 30000 },
  { department: "Health", allocated: 280000, utilized: 210000, committed: 55000 },
  { department: "Admin", allocated: 180000, utilized: 158000, committed: 12000 },
  { department: "Education", allocated: 220000, utilized: 195000, committed: 18000 },
  { department: "Finance", allocated: 150000, utilized: 120000, committed: 20000 },
];

const requisitionStatus = [
  { name: "Approved", value: 48, color: "#10b981" },
  { name: "Pending", value: 23, color: "#f59e0b" },
  { name: "Rejected", value: 7, color: "#ef4444" },
  { name: "Draft", value: 12, color: "#94a3b8" },
];

const requisitionTable = [
  { id: "PR-2026-001", title: "IT Equipment – Q1 Laptops", dept: "IT", value: 45000, status: "Approved", date: "2026-01-12", approver: "Kofi Asante" },
  { id: "PR-2026-002", title: "Office Furniture Replacement", dept: "Admin", value: 28500, status: "Pending", date: "2026-01-18", approver: "—" },
  { id: "PR-2026-003", title: "Medical Supplies – Korle-Bu", dept: "Health", value: 62000, status: "Approved", date: "2026-01-25", approver: "Dr. Nana Akufo-Mensah" },
  { id: "PR-2026-004", title: "Training Materials Printing", dept: "Education", value: 8500, status: "Rejected", date: "2026-02-02", approver: "Kofi Asante" },
  { id: "PR-2026-005", title: "Vehicle Maintenance – Fleet", dept: "Operations", value: 35000, status: "Approved", date: "2026-02-10", approver: "Kofi Asante" },
  { id: "PR-2026-006", title: "Consultancy – M&E Framework", dept: "Education", value: 55000, status: "Pending", date: "2026-02-15", approver: "—" },
  { id: "PR-2026-007", title: "Server Infrastructure Upgrade", dept: "IT", value: 120000, status: "Pending", date: "2026-02-20", approver: "—" },
  { id: "PR-2026-008", title: "Catering – Annual Conference", dept: "Admin", value: 18000, status: "Draft", date: "2026-03-01", approver: "—" },
];

const poTrendData = [
  { month: "Oct", orders: 42, value: 165000 },
  { month: "Nov", orders: 38, value: 142000 },
  { month: "Dec", orders: 51, value: 189000 },
  { month: "Jan", orders: 47, value: 175000 },
  { month: "Feb", orders: 55, value: 203000 },
  { month: "Mar", orders: 48, value: 181000 },
];

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK DATA — SOURCING & CONTRACTS
   ══════════════════════════════════════════════════════════════════════════════ */

const bidSubmissionData = [
  { rfq: "RFQ-001", title: "IT Equipment", invited: 8, submitted: 6, rate: 75 },
  { rfq: "RFQ-002", title: "Office Supplies", invited: 12, submitted: 9, rate: 75 },
  { rfq: "RFQ-003", title: "Consulting Services", invited: 5, submitted: 4, rate: 80 },
  { rfq: "RFQ-004", title: "Medical Supplies", invited: 10, submitted: 7, rate: 70 },
  { rfq: "RFQ-005", title: "Construction Works", invited: 6, submitted: 3, rate: 50 },
  { rfq: "RFQ-006", title: "Vehicle Leasing", invited: 4, submitted: 4, rate: 100 },
];

const rfqStatusData = [
  { name: "Awarded", value: 12, color: "#10b981" },
  { name: "In Review", value: 8, color: "#a855f7" },
  { name: "Sent", value: 15, color: "#3b82f6" },
  { name: "Closed", value: 22, color: "#6b7280" },
  { name: "Cancelled", value: 3, color: "#ef4444" },
];

const activeContracts = [
  { id: "CNT-2025-018", vendor: "Tech Solutions Inc.", value: 285000, startDate: "2025-06-15", endDate: "2026-06-14", status: "Active", deliverables: 8, completed: 6 },
  { id: "CNT-2025-022", vendor: "MedSupply GH", value: 145000, startDate: "2025-09-01", endDate: "2026-08-31", status: "Active", deliverables: 12, completed: 9 },
  { id: "CNT-2025-030", vendor: "PrintWorks Ghana Ltd", value: 52000, startDate: "2025-11-01", endDate: "2026-04-30", status: "Expiring", deliverables: 4, completed: 3 },
  { id: "CNT-2026-001", vendor: "Kwame Construction Ltd", value: 480000, startDate: "2026-01-10", endDate: "2027-01-09", status: "Active", deliverables: 6, completed: 1 },
  { id: "CNT-2026-005", vendor: "CreativeEdge Designs", value: 38000, startDate: "2026-02-01", endDate: "2026-07-31", status: "Active", deliverables: 5, completed: 2 },
];

const invoicePaymentData = [
  { month: "Oct", invoiced: 185000, paid: 165000, outstanding: 20000 },
  { month: "Nov", invoiced: 220000, paid: 195000, outstanding: 45000 },
  { month: "Dec", invoiced: 145000, paid: 130000, outstanding: 60000 },
  { month: "Jan", invoiced: 275000, paid: 240000, outstanding: 95000 },
  { month: "Feb", invoiced: 198000, paid: 175000, outstanding: 118000 },
  { month: "Mar", invoiced: 310000, paid: 250000, outstanding: 178000 },
];

const expiryAlerts = [
  { contract: "CNT-2025-030", vendor: "PrintWorks Ghana Ltd", endDate: "2026-04-30", daysLeft: 45, value: 52000, action: "Renew" },
  { contract: "CNT-2025-015", vendor: "La Palm Royal Beach Hotel", endDate: "2026-05-15", daysLeft: 60, value: 28000, action: "Review" },
  { contract: "CNT-2025-012", vendor: "Ghana Research Associates", endDate: "2026-06-14", daysLeft: 90, value: 95000, action: "Renew" },
  { contract: "CNT-2025-009", vendor: "Office Depot Ltd.", endDate: "2026-04-10", daysLeft: 25, value: 145000, action: "Urgent Renewal" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK DATA — VENDORS & KPIs
   ══════════════════════════════════════════════════════════════════════════════ */

const vendorMasterList = [
  { name: "Tech Solutions Inc.", category: "IT", status: "Prequalified", contracts: 5, totalValue: 685000, rating: 4.8, lastEngaged: "2026-03-10", onTimeDelivery: 95, avgResponseDays: 2.1 },
  { name: "MedSupply GH", category: "Medical", status: "Prequalified", contracts: 3, totalValue: 320000, rating: 4.5, lastEngaged: "2026-02-28", onTimeDelivery: 88, avgResponseDays: 3.5 },
  { name: "PrintWorks Ghana Ltd", category: "Printing", status: "Prequalified", contracts: 4, totalValue: 195000, rating: 4.2, lastEngaged: "2026-03-05", onTimeDelivery: 92, avgResponseDays: 1.8 },
  { name: "Kwame Construction Ltd", category: "Construction", status: "Prequalified", contracts: 2, totalValue: 960000, rating: 4.6, lastEngaged: "2026-01-10", onTimeDelivery: 82, avgResponseDays: 4.2 },
  { name: "CreativeEdge Designs", category: "Marketing", status: "Pending Review", contracts: 1, totalValue: 38000, rating: 4.0, lastEngaged: "2026-02-01", onTimeDelivery: 90, avgResponseDays: 2.5 },
  { name: "La Palm Royal Beach Hotel", category: "Hospitality", status: "Prequalified", contracts: 3, totalValue: 85000, rating: 4.7, lastEngaged: "2025-12-20", onTimeDelivery: 96, avgResponseDays: 1.5 },
  { name: "Ghana Research Associates", category: "Consultancy", status: "Prequalified", contracts: 2, totalValue: 190000, rating: 4.9, lastEngaged: "2026-01-15", onTimeDelivery: 97, avgResponseDays: 3.0 },
  { name: "Dell Inc. (via Telefonika)", category: "IT", status: "Prequalified", contracts: 4, totalValue: 520000, rating: 4.4, lastEngaged: "2026-03-12", onTimeDelivery: 91, avgResponseDays: 2.8 },
  { name: "Office Depot Ltd.", category: "Supplies", status: "Expired", contracts: 6, totalValue: 410000, rating: 4.1, lastEngaged: "2026-02-18", onTimeDelivery: 85, avgResponseDays: 3.2 },
];

const prequalStatus = [
  { name: "Prequalified", value: 24, color: "#10b981" },
  { name: "Pending Review", value: 8, color: "#f59e0b" },
  { name: "Expired", value: 5, color: "#ef4444" },
  { name: "Suspended", value: 2, color: "#6b7280" },
];

const donorProcurementSummary = [
  { donor: "World Bank", projects: 4, totalProcured: 850000, methods: { ICB: 2, NCB: 3, Shopping: 5 }, compliance: 98 },
  { donor: "USAID", projects: 3, totalProcured: 620000, methods: { ICB: 1, NCB: 2, Shopping: 4 }, compliance: 95 },
  { donor: "EU", projects: 2, totalProcured: 430000, methods: { ICB: 1, NCB: 2, Shopping: 3 }, compliance: 100 },
  { donor: "DFID", projects: 2, totalProcured: 280000, methods: { ICB: 0, NCB: 1, Shopping: 6 }, compliance: 92 },
  { donor: "AfDB", projects: 1, totalProcured: 190000, methods: { ICB: 1, NCB: 1, Shopping: 2 }, compliance: 97 },
];

const cycleTimeData = [
  { month: "Oct", reqToApproval: 5.2, approvalToSourcing: 8.5, sourcingToContract: 12.3, total: 26 },
  { month: "Nov", reqToApproval: 4.8, approvalToSourcing: 7.2, sourcingToContract: 11.1, total: 23.1 },
  { month: "Dec", reqToApproval: 6.1, approvalToSourcing: 9.8, sourcingToContract: 14.5, total: 30.4 },
  { month: "Jan", reqToApproval: 4.3, approvalToSourcing: 6.5, sourcingToContract: 10.2, total: 21 },
  { month: "Feb", reqToApproval: 3.9, approvalToSourcing: 5.8, sourcingToContract: 9.8, total: 19.5 },
  { month: "Mar", reqToApproval: 3.5, approvalToSourcing: 5.2, sourcingToContract: 8.9, total: 17.6 },
];

const radarKPI = [
  { metric: "Cycle Time", score: 82, target: 90 },
  { metric: "Cost Savings", score: 78, target: 85 },
  { metric: "Vendor Quality", score: 91, target: 88 },
  { metric: "On-Time Delivery", score: 88, target: 92 },
  { metric: "Compliance", score: 96, target: 95 },
  { metric: "Payment Timeliness", score: 85, target: 90 },
];

const paymentTimeliness = [
  { month: "Oct", onTime: 85, late: 12, overdue: 3 },
  { month: "Nov", onTime: 88, late: 10, overdue: 2 },
  { month: "Dec", onTime: 78, late: 18, overdue: 4 },
  { month: "Jan", onTime: 92, late: 6, overdue: 2 },
  { month: "Feb", onTime: 90, late: 8, overdue: 2 },
  { month: "Mar", onTime: 94, late: 5, overdue: 1 },
];

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK DATA — CONTRACT REPORTS (Tab 4)
   ══════════════════════════════════════════════════════════════════════════════ */

const contractDetailData = [
  { id: "CNT-2025-018", vendor: "Tech Solutions Inc.", value: 285000, startDate: "2025-06-15", endDate: "2026-06-14", status: "Active", deliverablesTotal: 8, deliverablesCompleted: 6, paymentStatus: "On Track", paidAmount: 213750 },
  { id: "CNT-2025-022", vendor: "MedSupply GH", value: 145000, startDate: "2025-09-01", endDate: "2026-08-31", status: "Active", deliverablesTotal: 12, deliverablesCompleted: 9, paymentStatus: "On Track", paidAmount: 108750 },
  { id: "CNT-2025-030", vendor: "PrintWorks Ghana Ltd", value: 52000, startDate: "2025-11-01", endDate: "2026-04-30", status: "Expiring", deliverablesTotal: 4, deliverablesCompleted: 3, paymentStatus: "Pending Final", paidAmount: 39000 },
  { id: "CNT-2026-001", vendor: "Kwame Construction Ltd", value: 480000, startDate: "2026-01-10", endDate: "2027-01-09", status: "Active", deliverablesTotal: 6, deliverablesCompleted: 1, paymentStatus: "On Track", paidAmount: 80000 },
  { id: "CNT-2026-005", vendor: "CreativeEdge Designs", value: 38000, startDate: "2026-02-01", endDate: "2026-07-31", status: "Active", deliverablesTotal: 5, deliverablesCompleted: 2, paymentStatus: "On Track", paidAmount: 15200 },
  { id: "CNT-2026-008", vendor: "Ghana Research Associates", value: 95000, startDate: "2026-01-15", endDate: "2026-12-31", status: "Active", deliverablesTotal: 10, deliverablesCompleted: 3, paymentStatus: "On Track", paidAmount: 28500 },
  { id: "CNT-2025-009", vendor: "Office Depot Ltd.", value: 145000, startDate: "2025-04-01", endDate: "2026-04-10", status: "Expiring", deliverablesTotal: 8, deliverablesCompleted: 7, paymentStatus: "Overdue", paidAmount: 126875 },
];

const deliverablesStatusData = [
  { contract: "CNT-2025-018", deliverable: "Phase 1 – Hardware Delivery", dueDate: "2025-09-30", status: "Accepted" },
  { contract: "CNT-2025-018", deliverable: "Phase 2 – Software Installation", dueDate: "2025-12-15", status: "Accepted" },
  { contract: "CNT-2025-018", deliverable: "Phase 3 – Network Configuration", dueDate: "2026-02-28", status: "Accepted" },
  { contract: "CNT-2025-018", deliverable: "Phase 4 – Testing & QA", dueDate: "2026-04-15", status: "Submitted" },
  { contract: "CNT-2025-018", deliverable: "Phase 5 – User Training", dueDate: "2026-05-30", status: "Pending" },
  { contract: "CNT-2025-022", deliverable: "Batch 1 – Surgical Supplies", dueDate: "2025-11-01", status: "Accepted" },
  { contract: "CNT-2025-022", deliverable: "Batch 2 – Pharmaceuticals", dueDate: "2025-12-15", status: "Accepted" },
  { contract: "CNT-2025-022", deliverable: "Batch 3 – Lab Equipment", dueDate: "2026-01-30", status: "Accepted" },
  { contract: "CNT-2025-022", deliverable: "Batch 4 – PPE Supplies", dueDate: "2026-03-15", status: "Overdue" },
  { contract: "CNT-2026-001", deliverable: "Foundation Works", dueDate: "2026-04-10", status: "Submitted" },
  { contract: "CNT-2026-001", deliverable: "Structural Frame", dueDate: "2026-07-15", status: "Pending" },
  { contract: "CNT-2026-001", deliverable: "MEP Installation", dueDate: "2026-10-01", status: "Pending" },
];

const contractInvoiceData = [
  { invoiceNo: "INV-2026-0041", contract: "CNT-2025-018", vendor: "Tech Solutions Inc.", amount: 71250, status: "Paid", date: "2026-01-15" },
  { invoiceNo: "INV-2026-0042", contract: "CNT-2025-018", vendor: "Tech Solutions Inc.", amount: 71250, status: "Paid", date: "2026-02-15" },
  { invoiceNo: "INV-2026-0043", contract: "CNT-2025-018", vendor: "Tech Solutions Inc.", amount: 71250, status: "Pending", date: "2026-03-15" },
  { invoiceNo: "INV-2026-0055", contract: "CNT-2025-022", vendor: "MedSupply GH", amount: 36250, status: "Paid", date: "2026-01-30" },
  { invoiceNo: "INV-2026-0056", contract: "CNT-2025-022", vendor: "MedSupply GH", amount: 36250, status: "Paid", date: "2026-03-01" },
  { invoiceNo: "INV-2026-0070", contract: "CNT-2026-001", vendor: "Kwame Construction Ltd", amount: 80000, status: "Paid", date: "2026-02-10" },
  { invoiceNo: "INV-2026-0071", contract: "CNT-2026-001", vendor: "Kwame Construction Ltd", amount: 80000, status: "Pending", date: "2026-04-10" },
  { invoiceNo: "INV-2026-0080", contract: "CNT-2025-009", vendor: "Office Depot Ltd.", amount: 18125, status: "Overdue", date: "2026-03-01" },
  { invoiceNo: "INV-2026-0090", contract: "CNT-2026-005", vendor: "CreativeEdge Designs", amount: 7600, status: "Paid", date: "2026-03-01" },
  { invoiceNo: "INV-2026-0091", contract: "CNT-2026-005", vendor: "CreativeEdge Designs", amount: 7600, status: "Pending", date: "2026-04-01" },
];

const contractVariationData = [
  { contract: "CNT-2025-018", changeNo: "VO-001", type: "Scope Extension", costImpact: 25000, status: "Approved" },
  { contract: "CNT-2025-018", changeNo: "VO-002", type: "Timeline Extension", costImpact: 0, status: "Approved" },
  { contract: "CNT-2026-001", changeNo: "VO-001", type: "Design Change", costImpact: 45000, status: "Pending" },
  { contract: "CNT-2026-001", changeNo: "VO-002", type: "Material Substitution", costImpact: -12000, status: "Approved" },
  { contract: "CNT-2025-022", changeNo: "VO-001", type: "Quantity Increase", costImpact: 18500, status: "Approved" },
  { contract: "CNT-2026-005", changeNo: "VO-001", type: "Additional Deliverable", costImpact: 5000, status: "Under Review" },
];

const contractCloseOutData = [
  { contract: "CNT-2025-005", vendor: "ABC Logistics Ltd.", deliverablesDone: true, paymentsDone: true, performanceDone: true, status: "Closed" },
  { contract: "CNT-2025-008", vendor: "Green Energy Solutions", deliverablesDone: true, paymentsDone: true, performanceDone: false, status: "Pending Review" },
  { contract: "CNT-2025-011", vendor: "Rapid Builders Co.", deliverablesDone: true, paymentsDone: false, performanceDone: false, status: "Pending Payment" },
  { contract: "CNT-2025-014", vendor: "DataTech Services", deliverablesDone: false, paymentsDone: false, performanceDone: false, status: "In Progress" },
  { contract: "CNT-2025-030", vendor: "PrintWorks Ghana Ltd", deliverablesDone: false, paymentsDone: false, performanceDone: false, status: "In Progress" },
];

const contractValueByStatus = [
  { status: "Active", goods: 320000, services: 180000, works: 480000 },
  { status: "Expiring", goods: 145000, services: 52000, works: 0 },
  { status: "Closed", goods: 95000, services: 120000, works: 350000 },
  { status: "Pending", goods: 45000, services: 38000, works: 0 },
];

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK DATA — DONOR REPORTS (Tab 5)
   ══════════════════════════════════════════════════════════════════════════════ */

const donorDetailSummary = [
  { donor: "World Bank", goods: 6, services: 3, works: 2, totalValue: 850000, approved: 9, pending: 2, rejected: 0, pendingApprovals: 1 },
  { donor: "USAID", goods: 4, services: 4, works: 1, totalValue: 620000, approved: 7, pending: 1, rejected: 1, pendingApprovals: 0 },
  { donor: "EU", goods: 3, services: 2, works: 1, totalValue: 430000, approved: 5, pending: 1, rejected: 0, pendingApprovals: 1 },
  { donor: "DFID", goods: 5, services: 1, works: 0, totalValue: 280000, approved: 4, pending: 2, rejected: 0, pendingApprovals: 2 },
  { donor: "AfDB", goods: 2, services: 1, works: 1, totalValue: 190000, approved: 3, pending: 1, rejected: 0, pendingApprovals: 1 },
];

const donorBudgetUtilization = [
  { donor: "World Bank", planned: 1000000, committed: 850000, spent: 720000 },
  { donor: "USAID", planned: 750000, committed: 620000, spent: 510000 },
  { donor: "EU", planned: 500000, committed: 430000, spent: 380000 },
  { donor: "DFID", planned: 350000, committed: 280000, spent: 215000 },
  { donor: "AfDB", planned: 250000, committed: 190000, spent: 155000 },
];

const donorSpendChart = [
  { donor: "World Bank", spend: 720000, color: "#6366f1" },
  { donor: "USAID", spend: 510000, color: "#10b981" },
  { donor: "EU", spend: 380000, color: "#f59e0b" },
  { donor: "DFID", spend: 215000, color: "#ef4444" },
  { donor: "AfDB", spend: 155000, color: "#8b5cf6" },
];

const donorCountChart = [
  { name: "World Bank", value: 11, color: "#6366f1" },
  { name: "USAID", value: 9, color: "#10b981" },
  { name: "EU", value: 6, color: "#f59e0b" },
  { name: "DFID", value: 6, color: "#ef4444" },
  { name: "AfDB", value: 4, color: "#8b5cf6" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   MOCK DATA — COMBINED ANALYSIS (Tab 6)
   ══════════════════════════════════════════════════════════════════════════════ */

const vendorDonorPerformance = [
  { vendor: "Tech Solutions Inc.", donor: "World Bank", contract: "CNT-2025-018", performanceScore: 92, status: "Active" },
  { vendor: "MedSupply GH", donor: "USAID", contract: "CNT-2025-022", performanceScore: 87, status: "Active" },
  { vendor: "Kwame Construction Ltd", donor: "World Bank", contract: "CNT-2026-001", performanceScore: 78, status: "Active" },
  { vendor: "Ghana Research Associates", donor: "EU", contract: "CNT-2026-008", performanceScore: 95, status: "Active" },
  { vendor: "PrintWorks Ghana Ltd", donor: "DFID", contract: "CNT-2025-030", performanceScore: 84, status: "Expiring" },
  { vendor: "CreativeEdge Designs", donor: "AfDB", contract: "CNT-2026-005", performanceScore: 80, status: "Active" },
  { vendor: "Dell Inc. (via Telefonika)", donor: "USAID", contract: "CNT-2025-035", performanceScore: 89, status: "Active" },
  { vendor: "Office Depot Ltd.", donor: "DFID", contract: "CNT-2025-009", performanceScore: 72, status: "Expiring" },
];

const topPerformers = [
  { vendor: "Ghana Research Associates", contractsWon: 4, totalValue: 380000, avgRating: 4.9 },
  { vendor: "Tech Solutions Inc.", contractsWon: 7, totalValue: 1250000, avgRating: 4.8 },
  { vendor: "La Palm Royal Beach Hotel", contractsWon: 5, totalValue: 175000, avgRating: 4.7 },
  { vendor: "Kwame Construction Ltd", contractsWon: 3, totalValue: 1440000, avgRating: 4.6 },
  { vendor: "MedSupply GH", contractsWon: 5, totalValue: 580000, avgRating: 4.5 },
];

const donorComplianceData = [
  { donor: "World Bank", compliancePct: 98, issues: 1 },
  { donor: "USAID", compliancePct: 95, issues: 2 },
  { donor: "EU", compliancePct: 100, issues: 0 },
  { donor: "DFID", compliancePct: 92, issues: 3 },
  { donor: "AfDB", compliancePct: 97, issues: 1 },
];

const donorComplianceRadar = [
  { metric: "Documentation", "World Bank": 98, USAID: 94, EU: 100, DFID: 90, AfDB: 96 },
  { metric: "Procurement Method", "World Bank": 100, USAID: 96, EU: 100, DFID: 88, AfDB: 98 },
  { metric: "Evaluation Process", "World Bank": 96, USAID: 92, EU: 100, DFID: 94, AfDB: 95 },
  { metric: "Reporting", "World Bank": 98, USAID: 97, EU: 100, DFID: 93, AfDB: 98 },
  { metric: "Contract Mgmt", "World Bank": 97, USAID: 95, EU: 100, DFID: 91, AfDB: 96 },
  { metric: "Audit Readiness", "World Bank": 99, USAID: 96, EU: 100, DFID: 92, AfDB: 97 },
];

/* ══════════════════════════════════════════════════════════════════════════════
   HELPER — STAT CARD
   ══════════════════════════════════════════════════════════════════════════════ */

function StatCard({ label, value, sub, trend, trendDir, icon, color }: {
  label: string; value: string; sub?: string; trend?: string; trendDir?: "up" | "down";
  icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "18" }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider" style={{ fontFamily: F }}>{label}</p>
        <p className="text-[18px] text-slate-900" style={{ fontFamily: F, fontWeight: 700 }}>{value}</p>
        {(sub || trend) && (
          <div className="flex items-center gap-1.5 mt-0.5">
            {trend && (
              <span className={`flex items-center gap-0.5 text-[10px] ${trendDir === "up" ? "text-green-600" : "text-red-500"}`} style={{ fontFamily: F, fontWeight: 600 }}>
                {trendDir === "up" ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {trend}
              </span>
            )}
            {sub && <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STATUS BADGE
   ══════════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Approved: { bg: "#dcfce7", text: "#166534" },
    Active: { bg: "#dcfce7", text: "#166534" },
    Prequalified: { bg: "#dcfce7", text: "#166534" },
    Accepted: { bg: "#dcfce7", text: "#166534" },
    Paid: { bg: "#dcfce7", text: "#166534" },
    Closed: { bg: "#f1f5f9", text: "#475569" },
    Pending: { bg: "#fef3c7", text: "#92400e" },
    "Pending Review": { bg: "#fef3c7", text: "#92400e" },
    "Pending Payment": { bg: "#fef3c7", text: "#92400e" },
    "Pending Final": { bg: "#fef3c7", text: "#92400e" },
    "Under Review": { bg: "#fef3c7", text: "#92400e" },
    Submitted: { bg: "#eff6ff", text: "#1e40af" },
    Rejected: { bg: "#fee2e2", text: "#991b1b" },
    Expired: { bg: "#fee2e2", text: "#991b1b" },
    Overdue: { bg: "#fee2e2", text: "#991b1b" },
    Expiring: { bg: "#fff7ed", text: "#9a3412" },
    Draft: { bg: "#f1f5f9", text: "#475569" },
    Suspended: { bg: "#f1f5f9", text: "#475569" },
    "In Progress": { bg: "#eff6ff", text: "#1e40af" },
    Renew: { bg: "#eff6ff", text: "#1e40af" },
    Review: { bg: "#fef3c7", text: "#92400e" },
    "Urgent Renewal": { bg: "#fee2e2", text: "#991b1b" },
    Awarded: { bg: "#dcfce7", text: "#166534" },
    "In Review": { bg: "#fef3c7", text: "#92400e" },
    Sent: { bg: "#eff6ff", text: "#1e40af" },
    Cancelled: { bg: "#fee2e2", text: "#991b1b" },
    "On Track": { bg: "#dcfce7", text: "#166534" },
    "Scope Extension": { bg: "#eff6ff", text: "#1e40af" },
    "Timeline Extension": { bg: "#fef3c7", text: "#92400e" },
    "Design Change": { bg: "#fef3c7", text: "#92400e" },
    "Material Substitution": { bg: "#dcfce7", text: "#166534" },
    "Quantity Increase": { bg: "#eff6ff", text: "#1e40af" },
    "Additional Deliverable": { bg: "#eff6ff", text: "#1e40af" },
  };
  const s = map[status] || { bg: "#f1f5f9", text: "#475569" };
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: s.bg, color: s.text, fontFamily: F, fontWeight: 600 }}>
      {status}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PERIOD FILTER & EXPORT BAR (shared across all tabs)
   ══════════════════════════════════════════════════════════════════════════════ */

function PeriodFilterBar({ periodFilter, setPeriodFilter }: {
  periodFilter: string;
  setPeriodFilter: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-500" style={{ fontFamily: F, fontWeight: 600 }}>Period:</span>
        <div className="bg-slate-100 p-0.5 rounded-lg inline-flex gap-0.5">
          {PERIOD_FILTERS.map(p => (
            <button key={p} onClick={() => setPeriodFilter(p)}
              className={`px-3 py-1 rounded-md text-[10px] transition-colors ${periodFilter === p ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              style={{ fontFamily: F, fontWeight: periodFilter === p ? 600 : 400 }}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-[11px] text-slate-700"
          style={{ fontFamily: F, fontWeight: 500 }}>
          <Download size={12} />
          Export to Excel
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-[11px] text-slate-700"
          style={{ fontFamily: F, fontWeight: 500 }}>
          <Download size={12} />
          Export to PDF
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function ProcurementReportingAnalytics({ initialTab }: { initialTab?: TabKey }) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab || "planning");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 3 Months");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reqFilter, setReqFilter] = useState<"All" | "Approved" | "Pending" | "Rejected" | "Draft">("All");
  const [periodFilter, setPeriodFilter] = useState<string>("Quarterly");

  const screenTitle: Record<TabKey, { title: string; subtitle: string }> = {
    planning: { title: "Planning & Orders Report", subtitle: "Requisition pipeline, budget utilization, and purchase order trends" },
    sourcing: { title: "Sourcing & Contracts Report", subtitle: "RFQ status, bid submissions, invoices, contracts, and renewal alerts" },
    vendors: { title: "Vendors & KPIs Report", subtitle: "Vendor performance, donor procurement, cycle times, and payment timeliness" },
    contracts: { title: "Contract Reports", subtitle: "Contract lifecycle, deliverables, invoices, variations, close-outs, and expiry alerts" },
    donors: { title: "Donor Reports", subtitle: "Donor procurement summaries, budget utilization, and spend analysis" },
    combined: { title: "Combined Analysis", subtitle: "Cross-cutting vendor-donor performance, compliance, and top performers" },
  };

  const { title, subtitle } = screenTitle[activeTab];

  /* ── Tab 1: Planning & Orders ────────────────────────────────────────────── */

  const renderPlanning = () => {
    const filteredReqs = requisitionTable.filter(r => {
      const matchFilter = reqFilter === "All" || r.status === reqFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.dept.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });

    const totalReqs = requisitionStatus.reduce((s, r) => s + r.value, 0);
    const totalBudget = budgetUtilization.reduce((s, b) => s + b.allocated, 0);
    const totalUtilized = budgetUtilization.reduce((s, b) => s + b.utilized, 0);
    const totalPOs = poTrendData.reduce((s, d) => s + d.orders, 0);
    const totalPOValue = poTrendData.reduce((s, d) => s + d.value, 0);

    return (
      <div className="space-y-6 p-6">
        <PeriodFilterBar periodFilter={periodFilter} setPeriodFilter={setPeriodFilter} />

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Requisitions" value={String(totalReqs)} sub="this period" trend="12%" trendDir="up" icon={<FileText size={18} />} color="#6366f1" />
          <StatCard label="Approved" value={String(requisitionStatus.find(r => r.name === "Approved")?.value || 0)} sub={fmtPct((requisitionStatus.find(r => r.name === "Approved")?.value || 0) / totalReqs * 100)} trend="8%" trendDir="up" icon={<CheckCircle2 size={18} />} color="#10b981" />
          <StatCard label="Purchase Orders" value={String(totalPOs)} sub={fmt(totalPOValue)} trend="12%" trendDir="up" icon={<Package size={18} />} color="#8b5cf6" />
          <StatCard label="Budget Utilization" value={fmtPct(totalUtilized / totalBudget * 100)} sub={`${fmt(totalUtilized)} of ${fmt(totalBudget)}`} trend="5%" trendDir="up" icon={<DollarSign size={18} />} color="#f59e0b" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Procurement Pipeline */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>
              Procurement Pipeline
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart id="rpt-pipeline" data={pipelineData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: F }} />
                <YAxis tick={{ fontSize: 10, fontFamily: F }} />
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Bar dataKey="planned" fill="#c7d2fe" name="Planned" radius={[2, 2, 0, 0]} />
                <Bar dataKey="initiated" fill="#818cf8" name="Initiated" radius={[2, 2, 0, 0]} />
                <Bar dataKey="completed" fill={BLUE} name="Completed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Requisition Status Pie */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>
              Requisition Status
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart id="rpt-req-status">
                <Pie data={requisitionStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {requisitionStatus.map((entry) => <Cell key={`req-cell-${entry.name}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget + PO Trend Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Budget Utilization */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>
              Budget Utilization by Department
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart id="rpt-budget-util" data={budgetUtilization} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: F }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 10, fontFamily: F }} width={80} />
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} formatter={(value: any) => fmt(value)} />
                <Bar dataKey="utilized" fill={BLUE} name="Utilized" radius={[0, 2, 2, 0]} stackId="a" />
                <Bar dataKey="committed" fill="#818cf8" name="Committed" radius={[0, 2, 2, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Purchase Order Trends */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>
              Purchase Order Trends
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart id="rpt-po-trend" data={poTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: F }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fontFamily: F }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fontFamily: F }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke={BLUE} strokeWidth={2} name="PO Count" dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="PO Value" dot={{ r: 3 }} />
                <Legend iconType="line" wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requisition Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] text-slate-900" style={{ fontFamily: F, fontWeight: 700 }}>
              Requisition Register
            </h3>
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-0.5 rounded-lg inline-flex gap-0.5">
                {(["All", "Approved", "Pending", "Rejected", "Draft"] as const).map(f => (
                  <button key={f} onClick={() => setReqFilter(f)}
                    className={`px-3 py-1 rounded-md text-[10px] transition-colors ${reqFilter === f ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    style={{ fontFamily: F, fontWeight: reqFilter === f ? 600 : 400 }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["PR Number", "Description", "Department", "Value", "Status", "Date", "Approver"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReqs.map((r, i) => (
                  <tr key={r.id} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{r.id}</td>
                    <td className="px-3 py-2 text-slate-900">{r.title}</td>
                    <td className="px-3 py-2 text-slate-600">{r.dept}</td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(r.value)}</td>
                    <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                    <td className="px-3 py-2 text-slate-500">{r.date}</td>
                    <td className="px-3 py-2 text-slate-600">{r.approver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ── Tab 2: Sourcing & Contracts ───────────────────────────────────────────── */

  const renderSourcing = () => {
    const totalInvoiced = invoicePaymentData.reduce((s, d) => s + d.invoiced, 0);
    const avgBidRate = bidSubmissionData.reduce((s, d) => s + d.rate, 0) / bidSubmissionData.length;
    const totalRFQs = rfqStatusData.reduce((s, d) => s + d.value, 0);

    return (
      <div className="space-y-6 p-6">
        <PeriodFilterBar periodFilter={periodFilter} setPeriodFilter={setPeriodFilter} />

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total RFQs" value={String(totalRFQs)} sub="this period" trend="15%" trendDir="up" icon={<FileText size={18} />} color="#6366f1" />
          <StatCard label="Avg Bid Rate" value={fmtPct(avgBidRate)} trend="5%" trendDir="up" icon={<TrendingUp size={18} />} color="#10b981" />
          <StatCard label="Total Invoiced" value={fmt(totalInvoiced)} sub="this period" icon={<DollarSign size={18} />} color="#8b5cf6" />
          <StatCard label="Expiring (90 days)" value={String(expiryAlerts.length)} sub="contracts" icon={<AlertTriangle size={18} />} color="#f59e0b" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* RFQ Status Distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>RFQ Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart id="rpt-rfq-status">
                <Pie data={rfqStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {rfqStatusData.map((entry) => <Cell key={`rfq-cell-${entry.name}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bid Submission Rates */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Bid Submission Rates</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart id="rpt-bid-sub" data={bidSubmissionData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="rfq" tick={{ fontSize: 9, fontFamily: F }} />
                <YAxis tick={{ fontSize: 10, fontFamily: F }} />
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Bar dataKey="invited" fill="#c7d2fe" name="Invited" radius={[2, 2, 0, 0]} />
                <Bar dataKey="submitted" fill={BLUE} name="Submitted" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Invoice & Payment Tracker */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Invoice & Payment</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart id="rpt-inv-pay" data={invoicePaymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: F }} />
                <YAxis tick={{ fontSize: 10, fontFamily: F }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} formatter={(value: any) => fmt(value)} />
                <Bar dataKey="invoiced" fill="#c7d2fe" name="Invoiced" radius={[2, 2, 0, 0]} />
                <Bar dataKey="paid" fill="#10b981" name="Paid" radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="outstanding" stroke="#ef4444" strokeWidth={2} name="Outstanding" dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Contracts Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Active Contracts & Deliverables</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Contract", "Vendor", "Value", "Start", "End", "Status", "Deliverables", "Progress"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeContracts.map((c, i) => (
                  <tr key={c.id} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{c.id}</td>
                    <td className="px-3 py-2 text-slate-900">{c.vendor}</td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(c.value)}</td>
                    <td className="px-3 py-2 text-slate-500">{c.startDate}</td>
                    <td className="px-3 py-2 text-slate-500">{c.endDate}</td>
                    <td className="px-3 py-2"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-2 text-slate-700">{c.completed}/{c.deliverables}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(c.completed / c.deliverables) * 100}%`, backgroundColor: c.completed === c.deliverables ? "#10b981" : BLUE }} />
                        </div>
                        <span className="text-[10px] text-slate-500" style={{ fontWeight: 600 }}>{Math.round((c.completed / c.deliverables) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiry / Renewal Alerts */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3 flex items-center gap-2" style={{ fontFamily: F, fontWeight: 700 }}>
            <CalendarClock size={14} className="text-amber-600" /> Expiry & Renewal Alerts
          </h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Contract", "Vendor", "End Date", "Days Left", "Value", "Action"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expiryAlerts.sort((a, b) => a.daysLeft - b.daysLeft).map((a, i) => (
                  <tr key={a.contract} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{a.contract}</td>
                    <td className="px-3 py-2 text-slate-900">{a.vendor}</td>
                    <td className="px-3 py-2 text-slate-500">{a.endDate}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[11px] ${a.daysLeft <= 30 ? "text-red-600" : a.daysLeft <= 60 ? "text-amber-600" : "text-green-600"}`} style={{ fontWeight: 700 }}>
                        {a.daysLeft} days
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(a.value)}</td>
                    <td className="px-3 py-2"><StatusBadge status={a.action} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ── Tab 3: Vendors & KPIs ────────────────────────────────────────────────── */

  const renderVendors = () => {
    const filteredVendors = vendorMasterList.filter(v => {
      const q = searchQuery.toLowerCase();
      return !q || v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
    });

    const latestCycleTime = cycleTimeData[cycleTimeData.length - 1];
    const prevCycleTime = cycleTimeData[cycleTimeData.length - 2];
    const avgOnTimePayment = paymentTimeliness.reduce((s, p) => s + p.onTime, 0) / paymentTimeliness.length;

    return (
      <div className="space-y-6 p-6">
        <PeriodFilterBar periodFilter={periodFilter} setPeriodFilter={setPeriodFilter} />

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Registered Vendors" value={String(vendorMasterList.length)} sub="in master list" icon={<Users size={18} />} color="#6366f1" />
          <StatCard label="Prequalified" value={String(prequalStatus.find(s => s.name === "Prequalified")?.value || 0)} sub="active vendors" trend="3" trendDir="up" icon={<ShieldCheck size={18} />} color="#10b981" />
          <StatCard
            label="Avg Cycle Time"
            value={`${latestCycleTime.total} days`}
            sub="req → contract"
            trend={`${Math.abs(latestCycleTime.total - prevCycleTime.total).toFixed(1)} days`}
            trendDir={latestCycleTime.total < prevCycleTime.total ? "up" : "down"}
            icon={<Clock size={18} />}
            color="#8b5cf6"
          />
          <StatCard
            label="On-Time Payments"
            value={fmtPct(avgOnTimePayment)}
            trend="4%" trendDir="up"
            sub="of invoices"
            icon={<CheckCircle2 size={18} />}
            color="#f59e0b"
          />
        </div>

        {/* KPI Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Prequalification Status Pie */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Prequalification Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart id="rpt-prequal">
                <Pie data={prequalStatus} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value">
                  {prequalStatus.map((entry) => <Cell key={`prequal-cell-${entry.name}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Cycle Time Trend */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Cycle Time Trend (Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart id="rpt-cycle-time" data={cycleTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: F }} />
                <YAxis tick={{ fontSize: 10, fontFamily: F }} />
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Area type="monotone" dataKey="reqToApproval" stackId="1" fill="#c7d2fe" stroke="#818cf8" name="Req → Approval" />
                <Area type="monotone" dataKey="approvalToSourcing" stackId="1" fill="#a5b4fc" stroke="#6366f1" name="Approval → Sourcing" />
                <Area type="monotone" dataKey="sourcingToContract" stackId="1" fill="#818cf8" stroke={BLUE} name="Sourcing → Contract" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* KPI Radar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>KPI Scorecard</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart id="rpt-kpi-radar" cx="50%" cy="50%" outerRadius="70%" data={radarKPI}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fontFamily: F }} />
                <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                <Radar name="Actual" dataKey="score" stroke={BLUE} fill={BLUE} fillOpacity={0.25} />
                <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeDasharray="4 4" />
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Legend iconType="line" wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Timeliness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Payment Timeliness (%)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart id="rpt-pay-timely" data={paymentTimeliness} barGap={1}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: F }} />
              <YAxis tick={{ fontSize: 10, fontFamily: F }} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
              <Bar dataKey="onTime" fill="#10b981" name="On Time" stackId="a" />
              <Bar dataKey="late" fill="#f59e0b" name="Late" stackId="a" />
              <Bar dataKey="overdue" fill="#ef4444" name="Overdue" stackId="a" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor Performance Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Vendor Performance</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Vendor", "Category", "Status", "Contracts", "Total Value", "Rating", "On-Time Delivery", "Avg Response"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((v, i) => (
                  <tr key={v.name} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{v.name}</td>
                    <td className="px-3 py-2 text-slate-600">{v.category}</td>
                    <td className="px-3 py-2"><StatusBadge status={v.status} /></td>
                    <td className="px-3 py-2 text-slate-700 text-center">{v.contracts}</td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(v.totalValue)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="text-slate-900" style={{ fontWeight: 600 }}>{v.rating}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${v.onTimeDelivery}%`, backgroundColor: v.onTimeDelivery >= 90 ? "#10b981" : v.onTimeDelivery >= 80 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                        <span className="text-slate-700" style={{ fontWeight: 600 }}>{v.onTimeDelivery}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`${v.avgResponseDays <= 2 ? "text-green-600" : v.avgResponseDays <= 3 ? "text-amber-600" : "text-red-500"}`} style={{ fontWeight: 600 }}>
                        {v.avgResponseDays}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donor Procurement Summary */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Donor Procurement Summary</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Donor", "Projects", "Total Procured", "ICB", "NCB", "Shopping", "Compliance"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donorProcurementSummary.map((d, i) => (
                  <tr key={d.donor} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{d.donor}</td>
                    <td className="px-3 py-2 text-slate-700 text-center">{d.projects}</td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(d.totalProcured)}</td>
                    <td className="px-3 py-2 text-slate-700 text-center">{d.methods.ICB}</td>
                    <td className="px-3 py-2 text-slate-700 text-center">{d.methods.NCB}</td>
                    <td className="px-3 py-2 text-slate-700 text-center">{d.methods.Shopping}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[11px] ${d.compliance >= 95 ? "text-green-600" : "text-amber-600"}`} style={{ fontWeight: 700 }}>
                        {d.compliance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ── Tab 4: Contract Reports ─────────────────────────────────────────────── */

  const renderContracts = () => {
    const totalContractValue = contractDetailData.reduce((s, c) => s + c.value, 0);
    const totalPaid = contractDetailData.reduce((s, c) => s + c.paidAmount, 0);
    const activeCount = contractDetailData.filter(c => c.status === "Active").length;
    const totalVariationImpact = contractVariationData.reduce((s, v) => s + v.costImpact, 0);

    return (
      <div className="space-y-6 p-6">
        <PeriodFilterBar periodFilter={periodFilter} setPeriodFilter={setPeriodFilter} />

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Contracts" value={String(contractDetailData.length)} sub="tracked" trend="3" trendDir="up" icon={<FileText size={18} />} color="#6366f1" />
          <StatCard label="Active Contracts" value={String(activeCount)} sub="in progress" icon={<CheckCircle2 size={18} />} color="#10b981" />
          <StatCard label="Total Value" value={fmt(totalContractValue)} sub={`${fmt(totalPaid)} paid`} icon={<DollarSign size={18} />} color="#8b5cf6" />
          <StatCard label="Variation Impact" value={fmt(totalVariationImpact)} sub={`${contractVariationData.length} changes`} trend={totalVariationImpact > 0 ? "increase" : "decrease"} trendDir={totalVariationImpact > 0 ? "up" : "down"} icon={<TrendingUp size={18} />} color="#f59e0b" />
        </div>

        {/* Contract Value by Status - Stacked Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Contract Values by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart id="rpt-cnt-val-status" data={contractValueByStatus} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="status" tick={{ fontSize: 10, fontFamily: F }} />
              <YAxis tick={{ fontSize: 10, fontFamily: F }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} formatter={(value: any) => fmt(value as number)} />
              <Bar dataKey="goods" fill="#6366f1" name="Goods" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="services" fill="#10b981" name="Services" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="works" fill="#f59e0b" name="Works" stackId="a" radius={[2, 2, 0, 0]} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Contracts Summary Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Active Contracts Summary</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Contract #", "Vendor", "Value", "Start", "End", "Status", "Deliverables Progress", "Payment Status"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contractDetailData.map((c, i) => (
                  <tr key={c.id} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{c.id}</td>
                    <td className="px-3 py-2 text-slate-900">{c.vendor}</td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(c.value)}</td>
                    <td className="px-3 py-2 text-slate-500">{c.startDate}</td>
                    <td className="px-3 py-2 text-slate-500">{c.endDate}</td>
                    <td className="px-3 py-2"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(c.deliverablesCompleted / c.deliverablesTotal) * 100}%`, backgroundColor: c.deliverablesCompleted === c.deliverablesTotal ? "#10b981" : BLUE }} />
                        </div>
                        <span className="text-[10px] text-slate-500" style={{ fontWeight: 600 }}>{c.deliverablesCompleted}/{c.deliverablesTotal}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2"><StatusBadge status={c.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deliverables Status Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Deliverables Status</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Contract", "Deliverable", "Due Date", "Status"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliverablesStatusData.map((d, i) => (
                  <tr key={`${d.contract}-${d.deliverable}`} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{d.contract}</td>
                    <td className="px-3 py-2 text-slate-900">{d.deliverable}</td>
                    <td className="px-3 py-2 text-slate-500">{d.dueDate}</td>
                    <td className="px-3 py-2"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice & Payment Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Invoice & Payment Tracker</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Invoice #", "Contract", "Vendor", "Amount", "Status", "Date"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contractInvoiceData.map((inv, i) => (
                  <tr key={inv.invoiceNo} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{inv.invoiceNo}</td>
                    <td className="px-3 py-2 text-slate-700">{inv.contract}</td>
                    <td className="px-3 py-2 text-slate-900">{inv.vendor}</td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(inv.amount)}</td>
                    <td className="px-3 py-2"><StatusBadge status={inv.status} /></td>
                    <td className="px-3 py-2 text-slate-500">{inv.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contract Variation Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Contract Variations</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Contract", "Change #", "Type", "Cost Impact", "Status"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contractVariationData.map((v, i) => (
                  <tr key={`${v.contract}-${v.changeNo}`} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{v.contract}</td>
                    <td className="px-3 py-2 text-slate-700">{v.changeNo}</td>
                    <td className="px-3 py-2 text-slate-900">{v.type}</td>
                    <td className="px-3 py-2" style={{ fontWeight: 600 }}>
                      <span className={v.costImpact > 0 ? "text-red-600" : v.costImpact < 0 ? "text-green-600" : "text-slate-500"}>
                        {v.costImpact > 0 ? "+" : ""}{fmt(v.costImpact)}
                      </span>
                    </td>
                    <td className="px-3 py-2"><StatusBadge status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contract Close-Out Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Contract Close-Out Status</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Contract", "Vendor", "Deliverables Done", "Payments Done", "Performance Done", "Status"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contractCloseOutData.map((c, i) => (
                  <tr key={c.contract} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{c.contract}</td>
                    <td className="px-3 py-2 text-slate-900">{c.vendor}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={c.deliverablesDone ? "text-green-600" : "text-amber-600"} style={{ fontWeight: 600 }}>
                        {c.deliverablesDone ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={c.paymentsDone ? "text-green-600" : "text-amber-600"} style={{ fontWeight: 600 }}>
                        {c.paymentsDone ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={c.performanceDone ? "text-green-600" : "text-amber-600"} style={{ fontWeight: 600 }}>
                        {c.performanceDone ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-3 py-2"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contract Expiry Alerts */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3 flex items-center gap-2" style={{ fontFamily: F, fontWeight: 700 }}>
            <CalendarClock size={14} className="text-amber-600" /> Contract Expiry Alerts (30/60/90 Days)
          </h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Contract", "Vendor", "End Date", "Days Left", "Value", "Action"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expiryAlerts.sort((a, b) => a.daysLeft - b.daysLeft).map((a, i) => (
                  <tr key={`cnt-exp-${a.contract}`} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{a.contract}</td>
                    <td className="px-3 py-2 text-slate-900">{a.vendor}</td>
                    <td className="px-3 py-2 text-slate-500">{a.endDate}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[11px] ${a.daysLeft <= 30 ? "text-red-600" : a.daysLeft <= 60 ? "text-amber-600" : "text-green-600"}`} style={{ fontWeight: 700 }}>
                        {a.daysLeft} days
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(a.value)}</td>
                    <td className="px-3 py-2"><StatusBadge status={a.action} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ── Tab 5: Donor Reports ────────────────────────────────────────────────── */

  const renderDonors = () => {
    const totalDonorSpend = donorBudgetUtilization.reduce((s, d) => s + d.spent, 0);
    const totalDonorPlanned = donorBudgetUtilization.reduce((s, d) => s + d.planned, 0);
    const totalProcurements = donorDetailSummary.reduce((s, d) => s + d.goods + d.services + d.works, 0);
    const totalPendingApprovals = donorDetailSummary.reduce((s, d) => s + d.pendingApprovals, 0);

    return (
      <div className="space-y-6 p-6">
        <PeriodFilterBar periodFilter={periodFilter} setPeriodFilter={setPeriodFilter} />

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Donor Partners" value={String(donorDetailSummary.length)} sub="active donors" icon={<Users size={18} />} color="#6366f1" />
          <StatCard label="Total Procurements" value={String(totalProcurements)} sub="across donors" trend="8%" trendDir="up" icon={<Package size={18} />} color="#10b981" />
          <StatCard label="Total Spend" value={fmt(totalDonorSpend)} sub={`of ${fmt(totalDonorPlanned)} planned`} icon={<DollarSign size={18} />} color="#8b5cf6" />
          <StatCard label="Pending Approvals" value={String(totalPendingApprovals)} sub="awaiting action" icon={<AlertTriangle size={18} />} color="#f59e0b" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Procurement Spend by Donor - Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Procurement Spend by Donor</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart id="rpt-donor-spend" data={donorSpendChart} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="donor" tick={{ fontSize: 10, fontFamily: F }} />
                <YAxis tick={{ fontSize: 10, fontFamily: F }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} formatter={(value: any) => fmt(value as number)} />
                <Bar dataKey="spend" name="Spend" radius={[4, 4, 0, 0]}>
                  {donorSpendChart.map((entry, index) => (
                    <Cell key={`donor-spend-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Procurement Count by Donor - Pie */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Procurement Count by Donor</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart id="rpt-donor-count">
                <Pie data={donorCountChart} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {donorCountChart.map((entry) => <Cell key={`donor-cnt-${entry.name}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donor Procurement Summary Table (expanded) */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Donor Procurement Summary</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Donor", "Goods", "Services", "Works", "Total Value", "Approved", "Pending", "Rejected", "Pending Approvals"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donorDetailSummary.map((d, i) => (
                  <tr key={d.donor} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{d.donor}</td>
                    <td className="px-3 py-2 text-slate-700 text-center">{d.goods}</td>
                    <td className="px-3 py-2 text-slate-700 text-center">{d.services}</td>
                    <td className="px-3 py-2 text-slate-700 text-center">{d.works}</td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(d.totalValue)}</td>
                    <td className="px-3 py-2 text-green-600 text-center" style={{ fontWeight: 600 }}>{d.approved}</td>
                    <td className="px-3 py-2 text-amber-600 text-center" style={{ fontWeight: 600 }}>{d.pending}</td>
                    <td className="px-3 py-2 text-red-500 text-center" style={{ fontWeight: 600 }}>{d.rejected}</td>
                    <td className="px-3 py-2 text-center">
                      {d.pendingApprovals > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700" style={{ fontWeight: 600 }}>{d.pendingApprovals}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donor Budget Utilization Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Donor Budget Utilization</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Donor", "Planned", "Committed", "Spent", "Utilization", "Progress"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donorBudgetUtilization.map((d, i) => {
                  const utilizationPct = (d.spent / d.planned) * 100;
                  return (
                    <tr key={d.donor} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                      <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{d.donor}</td>
                      <td className="px-3 py-2 text-slate-700" style={{ fontWeight: 600 }}>{fmt(d.planned)}</td>
                      <td className="px-3 py-2 text-slate-700" style={{ fontWeight: 600 }}>{fmt(d.committed)}</td>
                      <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(d.spent)}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[11px] ${utilizationPct >= 75 ? "text-green-600" : utilizationPct >= 50 ? "text-amber-600" : "text-red-500"}`} style={{ fontWeight: 700 }}>
                          {fmtPct(utilizationPct)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${utilizationPct}%`, backgroundColor: utilizationPct >= 75 ? "#10b981" : utilizationPct >= 50 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ── Tab 6: Combined Analysis ────────────────────────────────────────────── */

  const renderCombined = () => {
    const avgPerformance = vendorDonorPerformance.reduce((s, v) => s + v.performanceScore, 0) / vendorDonorPerformance.length;
    const avgCompliance = donorComplianceData.reduce((s, d) => s + d.compliancePct, 0) / donorComplianceData.length;
    const totalIssues = donorComplianceData.reduce((s, d) => s + d.issues, 0);
    const totalTopValue = topPerformers.reduce((s, t) => s + t.totalValue, 0);

    return (
      <div className="space-y-6 p-6">
        <PeriodFilterBar periodFilter={periodFilter} setPeriodFilter={setPeriodFilter} />

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Avg Performance" value={fmtPct(avgPerformance)} sub="across contracts" trend="3%" trendDir="up" icon={<TrendingUp size={18} />} color="#6366f1" />
          <StatCard label="Avg Compliance" value={fmtPct(avgCompliance)} sub="across donors" icon={<ShieldCheck size={18} />} color="#10b981" />
          <StatCard label="Compliance Issues" value={String(totalIssues)} sub="total flagged" icon={<AlertTriangle size={18} />} color="#f59e0b" />
          <StatCard label="Top Performer Value" value={fmt(totalTopValue)} sub="combined" icon={<DollarSign size={18} />} color="#8b5cf6" />
        </div>

        {/* Donor Compliance Radar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="text-[13px] text-slate-900 mb-4" style={{ fontFamily: F, fontWeight: 700 }}>Donor Compliance Metrics Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart id="rpt-donor-compliance-radar" cx="50%" cy="50%" outerRadius="70%" data={donorComplianceRadar}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fontFamily: F }} />
              <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[80, 100]} />
              <Radar name="World Bank" dataKey="World Bank" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
              <Radar name="USAID" dataKey="USAID" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              <Radar name="EU" dataKey="EU" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
              <Radar name="DFID" dataKey="DFID" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
              <Radar name="AfDB" dataKey="AfDB" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
              <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
              <Legend iconType="line" wrapperStyle={{ fontSize: 10, fontFamily: F }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor Performance on Donor-Funded Contracts */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Vendor Performance on Donor-Funded Contracts</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Vendor", "Donor", "Contract", "Performance Score", "Status"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendorDonorPerformance.map((v, i) => (
                  <tr key={`${v.vendor}-${v.contract}`} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{v.vendor}</td>
                    <td className="px-3 py-2 text-slate-700">{v.donor}</td>
                    <td className="px-3 py-2 text-indigo-700" style={{ fontWeight: 600 }}>{v.contract}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${v.performanceScore}%`, backgroundColor: v.performanceScore >= 90 ? "#10b981" : v.performanceScore >= 80 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                        <span className={`text-[11px] ${v.performanceScore >= 90 ? "text-green-600" : v.performanceScore >= 80 ? "text-amber-600" : "text-red-500"}`} style={{ fontWeight: 700 }}>
                          {v.performanceScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2"><StatusBadge status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers Table */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Top Performers</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Rank", "Vendor", "Contracts Won", "Total Value", "Avg Rating"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((t, i) => (
                  <tr key={t.vendor} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2">
                      <span className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : BLUE, fontWeight: 700 }}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{t.vendor}</td>
                    <td className="px-3 py-2 text-slate-700 text-center">{t.contractsWon}</td>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{fmt(t.totalValue)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="text-slate-900" style={{ fontWeight: 600 }}>{t.avgRating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Procurement Compliance by Donor */}
        <div>
          <h3 className="text-[13px] text-slate-900 mb-3" style={{ fontFamily: F, fontWeight: 700 }}>Procurement Compliance by Donor</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]" style={{ fontFamily: F }}>
              <thead>
                <tr style={{ backgroundColor: BLUE }}>
                  {["Donor", "Compliance %", "Issues", "Status"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-white" style={{ fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donorComplianceData.map((d, i) => (
                  <tr key={d.donor} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
                    <td className="px-3 py-2 text-slate-900" style={{ fontWeight: 600 }}>{d.donor}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${d.compliancePct}%`, backgroundColor: d.compliancePct >= 95 ? "#10b981" : d.compliancePct >= 90 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                        <span className={`text-[11px] ${d.compliancePct >= 95 ? "text-green-600" : "text-amber-600"}`} style={{ fontWeight: 700 }}>
                          {d.compliancePct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {d.issues > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700" style={{ fontWeight: 600 }}>{d.issues}</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700" style={{ fontWeight: 600 }}>None</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={d.compliancePct >= 95 ? "Approved" : "Under Review"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════════════════════════
     MAIN RENDER
     ══════════════════════════════════════════════════════════════════════════════ */

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-[20px] text-slate-900" style={{ fontFamily: F, fontWeight: 700 }}>
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-900 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              style={{ fontFamily: F }}
            />
          </div>
          {/* Period Selector */}
          <div className="relative">
            <button onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm text-[12px] text-slate-700"
              style={{ fontFamily: F }}>
              <CalendarClock size={14} className="text-slate-400" />
              {selectedPeriod}
              <ChevronDown size={14} className="text-purple-700" />
            </button>
            {showPeriodDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {TIME_PERIODS.map((p) => (
                    <button key={p} onClick={() => { setSelectedPeriod(p); setShowPeriodDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-[12px] hover:bg-slate-50 transition-colors ${p === selectedPeriod ? "bg-indigo-50 text-indigo-700" : "text-slate-700"}`}
                      style={{ fontFamily: F, fontWeight: p === selectedPeriod ? 600 : 400 }}>
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm text-[12px] text-slate-700"
            style={{ fontFamily: F }}>
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-3 pb-0 bg-white border-b border-slate-200 shrink-0">
        <div className="flex gap-1">
          {(Object.keys(TAB_LABELS) as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg text-[11px] transition-colors border-b-2 ${
                activeTab === tab
                  ? "bg-indigo-50 text-indigo-700 border-indigo-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-transparent"
              }`}
              style={{ fontFamily: F, fontWeight: activeTab === tab ? 700 : 500 }}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "planning" && renderPlanning()}
        {activeTab === "sourcing" && renderSourcing()}
        {activeTab === "vendors" && renderVendors()}
        {activeTab === "contracts" && renderContracts()}
        {activeTab === "donors" && renderDonors()}
        {activeTab === "combined" && renderCombined()}
      </div>
    </div>
  );
}
