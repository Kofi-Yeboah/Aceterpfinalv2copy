import { useState, useEffect } from "react";
import {
  ArrowLeft, Package, FileText, Truck, Wrench, MoreHorizontal, Clock, CheckCircle2,
  CircleDot, Loader2, Download, Eye, User, Building2,
  Calendar, DollarSign, ShieldCheck, ShieldAlert, AlertCircle, XCircle,
  ClipboardList, Handshake, Award, Globe, Paperclip, Hash, MapPin,
  Briefcase, Tag
} from "lucide-react";
import { cn } from "../lib/utils";
import { getGeneratedPRs, getGeneratedPOs, subscribe } from "../lib/procurementStore";
import { getContracts, subscribe as subscribeContracts } from "../lib/contractStore";

/* ─── Types (mirrored from ESSProcurementPlan) ───────────────────────────── */

type ItemCategory = "Goods" | "Services" | "Consultancy" | "Works" | "Other";
type ItemStatus = "Not Started" | "Requisition Pending" | "In Progress" | "Completed";

interface ProcurementItem {
  id: string;
  description: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  estimatedCost: number;
  targetDate: string;
  status: ItemStatus;
  notes: string;
  approvalStatus: "Approved" | "Pending Verification";
  addedDate?: string;
}

interface Props {
  item: ProcurementItem;
  planId: string;
  planYear: number;
  planDepartment: string;
  planCreatedBy: string;
  onBack: () => void;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const fmt = (n: number) => "GHS " + n.toLocaleString("en-GH");

const categoryMeta: Record<ItemCategory, { bg: string; icon: React.ReactNode; color: string }> = {
  Goods:       { bg: "bg-purple-50 text-purple-700 border-purple-200", icon: <Package size={11} />, color: "text-purple-600" },
  Services:    { bg: "bg-teal-50 text-teal-700 border-teal-200",     icon: <Truck size={11} />,   color: "text-teal-600" },
  Consultancy: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: <FileText size={11} />, color: "text-indigo-600" },
  Works:       { bg: "bg-orange-50 text-orange-700 border-orange-200", icon: <Wrench size={11} />, color: "text-orange-600" },
  Other:       { bg: "bg-slate-100 text-slate-600 border-slate-300",   icon: <MoreHorizontal size={11} />, color: "text-slate-500" },
};

const statusMeta: Record<ItemStatus, { bg: string; icon: React.ReactNode }> = {
  "Not Started":          { bg: "bg-slate-50 text-slate-500 border-slate-200",       icon: <CircleDot size={11} /> },
  "Requisition Pending":  { bg: "bg-amber-50 text-amber-700 border-amber-200",      icon: <Loader2 size={11} /> },
  "In Progress":          { bg: "bg-blue-50 text-blue-700 border-blue-200",          icon: <Clock size={11} /> },
  Completed:              { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={11} /> },
};

/* ─── Mock procurement data for completed items ──────────────────────────── */

interface CompletedProcData {
  vendor: string;
  poNumber: string;
  contractNumber: string;
  completedDate: string;
  method: string;
  awardDate: string;
  contractValue: number;
  sourcingCase: string;
  documents: { name: string; type: string; size: string; date: string; category: string }[];
}

const completedDataMap: Record<string, CompletedProcData> = {
  "PI-001": {
    vendor: "Tech Solutions Inc.", poNumber: "PO-2026-001", contractNumber: "CNT-2026-001",
    completedDate: "Feb 20, 2026", method: "Competitive Bidding", awardDate: "Feb 05, 2026",
    contractValue: 45000, sourcingCase: "SRC-2026-001",
    documents: [
      { name: "Technical_Specifications_Laptops.pdf", type: "PDF", size: "420 KB", date: "Jan 25, 2026", category: "Terms of Reference" },
      { name: "ITB_Dell_Latitude_5540.pdf", type: "PDF", size: "1.1 MB", date: "Jan 28, 2026", category: "Invitation to Bid" },
      { name: "Bid_Evaluation_Report_Laptops.pdf", type: "PDF", size: "680 KB", date: "Feb 03, 2026", category: "Evaluation Report" },
      { name: "Contract_TechSolutions_Laptops.pdf", type: "PDF", size: "1.4 MB", date: "Feb 05, 2026", category: "Signed Contract" },
      { name: "PO_2026_001_TechSolutions.pdf", type: "PDF", size: "340 KB", date: "Feb 06, 2026", category: "Purchase Order" },
      { name: "Delivery_Receipt_Laptops.pdf", type: "PDF", size: "180 KB", date: "Feb 18, 2026", category: "Delivery Receipt" },
      { name: "GRN_Laptops_10units.pdf", type: "PDF", size: "210 KB", date: "Feb 20, 2026", category: "Goods Received Note" },
    ],
  },
  "PI-002": {
    vendor: "Tech Solutions Inc.", poNumber: "PO-2026-002", contractNumber: "CNT-2026-002",
    completedDate: "Jan 28, 2026", method: "Direct Selection", awardDate: "Jan 15, 2026",
    contractValue: 24000, sourcingCase: "SRC-2026-002",
    documents: [
      { name: "Scope_of_Work_IT_Maintenance.pdf", type: "PDF", size: "380 KB", date: "Jan 10, 2026", category: "Terms of Reference" },
      { name: "Sole_Source_Justification_TechServe.pdf", type: "PDF", size: "120 KB", date: "Jan 12, 2026", category: "Justification Memo" },
      { name: "Contract_IT_Support_Renewal.pdf", type: "PDF", size: "1.2 MB", date: "Jan 15, 2026", category: "Signed Contract" },
      { name: "PO_2026_002_TechSolutions.pdf", type: "PDF", size: "290 KB", date: "Jan 16, 2026", category: "Purchase Order" },
      { name: "SLA_Agreement_2026.pdf", type: "PDF", size: "540 KB", date: "Jan 15, 2026", category: "Service Level Agreement" },
    ],
  },
  "PI-007": {
    vendor: "Office Depot Ltd.", poNumber: "PO-2026-007", contractNumber: "CNT-2026-007",
    completedDate: "Feb 10, 2026", method: "Request for Quotation", awardDate: "Jan 30, 2026",
    contractValue: 8500, sourcingCase: "SRC-2026-007",
    documents: [
      { name: "Specifications_Toners_Stationery.pdf", type: "PDF", size: "250 KB", date: "Jan 20, 2026", category: "Terms of Reference" },
      { name: "RFQ_Stationery_Annual.pdf", type: "PDF", size: "310 KB", date: "Jan 22, 2026", category: "Request for Quotation" },
      { name: "Quotation_Comparison_Stationery.pdf", type: "PDF", size: "180 KB", date: "Jan 28, 2026", category: "Evaluation Report" },
      { name: "PO_2026_007_OfficeDepot.pdf", type: "PDF", size: "260 KB", date: "Jan 31, 2026", category: "Purchase Order" },
      { name: "Delivery_Note_Stationery.pdf", type: "PDF", size: "140 KB", date: "Feb 08, 2026", category: "Delivery Receipt" },
      { name: "GRN_Stationery_Lot.pdf", type: "PDF", size: "170 KB", date: "Feb 10, 2026", category: "Goods Received Note" },
    ],
  },
  "PI-101": {
    vendor: "Tech Solutions Inc.", poNumber: "PO-2025-011", contractNumber: "CNT-2025-001",
    completedDate: "Feb 25, 2025", method: "Competitive Bidding", awardDate: "Feb 10, 2025",
    contractValue: 32000, sourcingCase: "SRC-2025-001",
    documents: [
      { name: "TOR_Laptops_2025.pdf", type: "PDF", size: "380 KB", date: "Jan 15, 2025", category: "Terms of Reference" },
      { name: "ITB_Dell_Latitude_5530.pdf", type: "PDF", size: "920 KB", date: "Jan 18, 2025", category: "Invitation to Bid" },
      { name: "Evaluation_Report_Laptops_2025.pdf", type: "PDF", size: "540 KB", date: "Feb 08, 2025", category: "Evaluation Report" },
      { name: "Contract_TechSolutions_2025.pdf", type: "PDF", size: "1.1 MB", date: "Feb 10, 2025", category: "Signed Contract" },
      { name: "PO_2025_011.pdf", type: "PDF", size: "280 KB", date: "Feb 12, 2025", category: "Purchase Order" },
    ],
  },
  "PI-102": {
    vendor: "Tech Solutions Inc.", poNumber: "PO-2025-012", contractNumber: "CNT-2025-002",
    completedDate: "Jan 30, 2025", method: "Direct Selection", awardDate: "Jan 20, 2025",
    contractValue: 22000, sourcingCase: "SRC-2025-002",
    documents: [
      { name: "SOW_IT_Support_2025.pdf", type: "PDF", size: "320 KB", date: "Jan 12, 2025", category: "Terms of Reference" },
      { name: "Sole_Source_Memo_TechServe_2025.pdf", type: "PDF", size: "110 KB", date: "Jan 14, 2025", category: "Justification Memo" },
      { name: "Contract_IT_SLA_2025.pdf", type: "PDF", size: "980 KB", date: "Jan 20, 2025", category: "Signed Contract" },
      { name: "PO_2025_012.pdf", type: "PDF", size: "260 KB", date: "Jan 22, 2025", category: "Purchase Order" },
    ],
  },
  "PI-103": {
    vendor: "Premier Supplies", poNumber: "PO-2025-013", contractNumber: "CNT-2025-003",
    completedDate: "Mar 12, 2025", method: "Request for Quotation", awardDate: "Feb 28, 2025",
    contractValue: 16000, sourcingCase: "SRC-2025-003",
    documents: [
      { name: "Specs_Ergonomic_Chairs.pdf", type: "PDF", size: "290 KB", date: "Feb 10, 2025", category: "Terms of Reference" },
      { name: "RFQ_Office_Chairs.pdf", type: "PDF", size: "350 KB", date: "Feb 15, 2025", category: "Request for Quotation" },
      { name: "Quote_Comparison_Chairs.pdf", type: "PDF", size: "180 KB", date: "Feb 25, 2025", category: "Evaluation Report" },
      { name: "Contract_PremierSupplies_Chairs.pdf", type: "PDF", size: "780 KB", date: "Feb 28, 2025", category: "Signed Contract" },
      { name: "PO_2025_013.pdf", type: "PDF", size: "240 KB", date: "Mar 01, 2025", category: "Purchase Order" },
      { name: "GRN_Chairs_20units.pdf", type: "PDF", size: "160 KB", date: "Mar 12, 2025", category: "Goods Received Note" },
    ],
  },
  "PI-104": {
    vendor: "Elite Partners", poNumber: "PO-2025-014", contractNumber: "CNT-2025-004",
    completedDate: "Jun 28, 2025", method: "Direct Selection", awardDate: "Mar 15, 2025",
    contractValue: 30000, sourcingCase: "SRC-2025-004",
    documents: [
      { name: "TOR_External_Audit_2025.pdf", type: "PDF", size: "520 KB", date: "Feb 20, 2025", category: "Terms of Reference" },
      { name: "Sole_Source_Justification_Audit.pdf", type: "PDF", size: "140 KB", date: "Feb 25, 2025", category: "Justification Memo" },
      { name: "Contract_ElitePartners_Audit.pdf", type: "PDF", size: "1.5 MB", date: "Mar 15, 2025", category: "Signed Contract" },
      { name: "PO_2025_014.pdf", type: "PDF", size: "300 KB", date: "Mar 18, 2025", category: "Purchase Order" },
      { name: "Audit_Final_Report.pdf", type: "PDF", size: "2.1 MB", date: "Jun 25, 2025", category: "Final Deliverable" },
    ],
  },
  "PI-105": {
    vendor: "Facilities Management Pro", poNumber: "PO-2025-015", contractNumber: "CNT-2025-005",
    completedDate: "Apr 28, 2025", method: "Request for Quotation", awardDate: "Mar 20, 2025",
    contractValue: 16000, sourcingCase: "SRC-2025-005",
    documents: [
      { name: "SOW_Vehicle_Servicing_2025.pdf", type: "PDF", size: "280 KB", date: "Mar 05, 2025", category: "Terms of Reference" },
      { name: "RFQ_Fleet_Servicing.pdf", type: "PDF", size: "310 KB", date: "Mar 10, 2025", category: "Request for Quotation" },
      { name: "Quote_Comparison_Fleet.pdf", type: "PDF", size: "190 KB", date: "Mar 18, 2025", category: "Evaluation Report" },
      { name: "Contract_FacilitiesMgmt_Fleet.pdf", type: "PDF", size: "890 KB", date: "Mar 20, 2025", category: "Signed Contract" },
      { name: "PO_2025_015.pdf", type: "PDF", size: "250 KB", date: "Mar 22, 2025", category: "Purchase Order" },
      { name: "Service_Completion_Report.pdf", type: "PDF", size: "340 KB", date: "Apr 28, 2025", category: "Completion Report" },
    ],
  },
  "PI-106": {
    vendor: "La Palm Royal Beach Hotel", poNumber: "PO-2025-016", contractNumber: "CNT-2025-006",
    completedDate: "Sep 10, 2025", method: "Request for Quotation", awardDate: "Aug 01, 2025",
    contractValue: 14000, sourcingCase: "SRC-2025-006",
    documents: [
      { name: "Event_Brief_StaffRetreat.pdf", type: "PDF", size: "310 KB", date: "Jul 15, 2025", category: "Terms of Reference" },
      { name: "RFQ_Venue_Catering.pdf", type: "PDF", size: "270 KB", date: "Jul 20, 2025", category: "Request for Quotation" },
      { name: "Quote_Comparison_Venues.pdf", type: "PDF", size: "150 KB", date: "Jul 28, 2025", category: "Evaluation Report" },
      { name: "Contract_LaPalm_Retreat.pdf", type: "PDF", size: "680 KB", date: "Aug 01, 2025", category: "Signed Contract" },
      { name: "PO_2025_016.pdf", type: "PDF", size: "230 KB", date: "Aug 03, 2025", category: "Purchase Order" },
    ],
  },
  "PI-107": {
    vendor: "Various", poNumber: "—", contractNumber: "—",
    completedDate: "Dec 20, 2025", method: "Multiple Methods", awardDate: "—",
    contractValue: 12000, sourcingCase: "—",
    documents: [
      { name: "Miscellaneous_Expenditure_Log_2025.xlsx", type: "XLSX", size: "120 KB", date: "Dec 20, 2025", category: "Expenditure Log" },
    ],
  },
  "PI-201": {
    vendor: "Tech Innovators LLC", poNumber: "PO-2024-021", contractNumber: "CNT-2024-003",
    completedDate: "Feb 28, 2024", method: "Competitive Bidding", awardDate: "Feb 15, 2024",
    contractValue: 36000, sourcingCase: "SRC-2024-010",
    documents: [
      { name: "TOR_Desktop_Computers.pdf", type: "PDF", size: "350 KB", date: "Jan 15, 2024", category: "Terms of Reference" },
      { name: "ITB_Office_Computers.pdf", type: "PDF", size: "780 KB", date: "Jan 20, 2024", category: "Invitation to Bid" },
      { name: "Evaluation_Report_Computers.pdf", type: "PDF", size: "460 KB", date: "Feb 10, 2024", category: "Evaluation Report" },
      { name: "Contract_TechInnovators.pdf", type: "PDF", size: "1.0 MB", date: "Feb 15, 2024", category: "Signed Contract" },
      { name: "PO_2024_021.pdf", type: "PDF", size: "270 KB", date: "Feb 17, 2024", category: "Purchase Order" },
      { name: "GRN_Computers_12units.pdf", type: "PDF", size: "190 KB", date: "Feb 28, 2024", category: "Goods Received Note" },
    ],
  },
  "PI-202": {
    vendor: "Tech Solutions Inc.", poNumber: "PO-2024-022", contractNumber: "CNT-2024-004",
    completedDate: "Feb 12, 2024", method: "Direct Selection", awardDate: "Jan 28, 2024",
    contractValue: 18000, sourcingCase: "SRC-2024-011",
    documents: [
      { name: "SOW_Internet_Networking.pdf", type: "PDF", size: "310 KB", date: "Jan 15, 2024", category: "Terms of Reference" },
      { name: "Contract_TechSolutions_Networking.pdf", type: "PDF", size: "920 KB", date: "Jan 28, 2024", category: "Signed Contract" },
      { name: "PO_2024_022.pdf", type: "PDF", size: "240 KB", date: "Jan 30, 2024", category: "Purchase Order" },
    ],
  },
  "PI-203": {
    vendor: "Ghana Research Associates", poNumber: "PO-2024-023", contractNumber: "CNT-2024-005",
    completedDate: "May 25, 2024", method: "Direct Selection", awardDate: "Mar 10, 2024",
    contractValue: 25000, sourcingCase: "SRC-2024-012",
    documents: [
      { name: "TOR_Process_Improvement_Consultancy.pdf", type: "PDF", size: "480 KB", date: "Feb 15, 2024", category: "Terms of Reference" },
      { name: "Consultant_CV_GhanaResearch.pdf", type: "PDF", size: "340 KB", date: "Feb 20, 2024", category: "Consultant Profile" },
      { name: "Contract_GhanaResearch_Consultancy.pdf", type: "PDF", size: "1.3 MB", date: "Mar 10, 2024", category: "Signed Contract" },
      { name: "PO_2024_023.pdf", type: "PDF", size: "280 KB", date: "Mar 12, 2024", category: "Purchase Order" },
      { name: "Final_Report_Process_Improvement.pdf", type: "PDF", size: "1.8 MB", date: "May 22, 2024", category: "Final Deliverable" },
    ],
  },
  "PI-204": {
    vendor: "Facilities Management Pro", poNumber: "PO-2024-024", contractNumber: "CNT-2024-006",
    completedDate: "Jul 28, 2024", method: "Competitive Bidding", awardDate: "Apr 15, 2024",
    contractValue: 20000, sourcingCase: "SRC-2024-013",
    documents: [
      { name: "TOR_Security_System_Installation.pdf", type: "PDF", size: "410 KB", date: "Mar 10, 2024", category: "Terms of Reference" },
      { name: "ITB_Security_System.pdf", type: "PDF", size: "650 KB", date: "Mar 15, 2024", category: "Invitation to Bid" },
      { name: "Evaluation_Report_Security.pdf", type: "PDF", size: "380 KB", date: "Apr 10, 2024", category: "Evaluation Report" },
      { name: "Contract_FacilitiesMgmt_Security.pdf", type: "PDF", size: "1.1 MB", date: "Apr 15, 2024", category: "Signed Contract" },
      { name: "PO_2024_024.pdf", type: "PDF", size: "260 KB", date: "Apr 18, 2024", category: "Purchase Order" },
      { name: "Installation_Completion_Certificate.pdf", type: "PDF", size: "220 KB", date: "Jul 28, 2024", category: "Completion Report" },
    ],
  },
  "PI-205": {
    vendor: "Various", poNumber: "—", contractNumber: "—",
    completedDate: "Dec 15, 2024", method: "Multiple Methods", awardDate: "—",
    contractValue: 19500, sourcingCase: "—",
    documents: [
      { name: "Miscellaneous_Expenditure_Log_2024.xlsx", type: "XLSX", size: "145 KB", date: "Dec 15, 2024", category: "Expenditure Log" },
    ],
  },
};

/* Vendor DB (same as ESSProcurementPlan) */
const VENDOR_DATABASE = [
  { id: "V-001", name: "Tech Solutions Inc.", contactPerson: "John Smith", email: "john@techsolutions.com", phone: "+1 (555) 123-4567", category: "IT Equipment", rating: 4.8, status: "Active", address: "12 Innovation Drive, Accra" },
  { id: "V-002", name: "Office Depot Ltd.", contactPerson: "Sarah Johnson", email: "sarah@officedepot.com", phone: "+1 (555) 234-5678", category: "Office Supplies", rating: 4.5, status: "Active", address: "45 Commerce St, Tema" },
  { id: "V-003", name: "Global Services Co.", contactPerson: "Michael Brown", email: "michael@globalservices.com", phone: "+1 (555) 345-6789", category: "Professional Services", rating: 4.9, status: "Active", address: "8 Partnership Ave, Kumasi" },
  { id: "V-004", name: "Premier Supplies", contactPerson: "Emily Davis", email: "emily@premiersupplies.com", phone: "+1 (555) 456-7890", category: "Office Supplies", rating: 4.3, status: "Active", address: "21 Supply Chain Rd, Accra" },
  { id: "V-005", name: "Elite Partners", contactPerson: "David Wilson", email: "david@elitepartners.com", phone: "+1 (555) 567-8901", category: "Professional Services", rating: 4.7, status: "Active", address: "3 Executive Blvd, Accra" },
  { id: "V-006", name: "Facilities Management Pro", contactPerson: "Lisa Martinez", email: "lisa@facilitiespro.com", phone: "+1 (555) 678-9012", category: "Facilities", rating: 4.6, status: "Active", address: "77 Maintenance Lane, Takoradi" },
  { id: "V-008", name: "Tech Innovators LLC", contactPerson: "Rachel Green", email: "rachel@techinnovators.com", phone: "+1 (555) 890-1234", category: "IT Equipment", rating: 4.2, status: "Inactive", address: "55 Tech Park, Tema" },
  { id: "V-010", name: "Ghana Research Associates", contactPerson: "Ama Serwaa", email: "info@ghanaresearch.org", phone: "+233 30 266 1100", category: "Professional Services", rating: 4.6, status: "Active", address: "University Ave, Legon" },
  { id: "V-011", name: "La Palm Royal Beach Hotel", contactPerson: "Events Desk", email: "events@lapalmhotel.com", phone: "+233 30 277 1700", category: "Facilities", rating: 4.5, status: "Active", address: "La Beach Rd, Accra" },
];

/* ─── Mock PR-attached docs for items that have a PR ─────────────────────── */

const prDocMap: Record<string, { name: string; type: string; size: string; date: string; category: string }[]> = {
  "PI-003": [
    { name: "Terms_of_Reference_Standing_Desks.pdf", type: "PDF", size: "320 KB", date: "Mar 05, 2026", category: "Terms of Reference" },
    { name: "Ergonomic_Specifications.pdf", type: "PDF", size: "180 KB", date: "Mar 05, 2026", category: "Technical Specs" },
  ],
  "PI-009": [
    { name: "Miscellaneous_Budget_Allocation.pdf", type: "PDF", size: "90 KB", date: "Feb 01, 2026", category: "Budget Allocation" },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

type DetailTab = "overview" | "requisition" | "sourcing" | "documents";

export function ProcurementItemDetailView({ item, planId, planYear, planDepartment, planCreatedBy, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [, setTick] = useState(0);

  useEffect(() => {
    const u1 = subscribe(() => setTick(t => t + 1));
    const u2 = subscribeContracts(() => setTick(t => t + 1));
    return () => { u1(); u2(); };
  }, []);

  // Pull associated data
  const allPRs = getGeneratedPRs();
  const allPOs = getGeneratedPOs();
  const allContracts = getContracts();

  const matchingPR = allPRs.find(pr => pr.sourcePlanId === planId && pr.sourcePlanItemId === item.id);
  const matchingPO = matchingPR ? allPOs.find(po => po.sourcePR === matchingPR.requisitionNumber) : null;
  const matchingContract = matchingPR ? allContracts.find(c => c.sourcePR === matchingPR.requisitionNumber) : null;
  const completedData = completedDataMap[item.id] || null;
  const vendorName = matchingPO?.vendor || matchingContract?.party || completedData?.vendor;
  const vendorRecord = vendorName ? VENDOR_DATABASE.find(v => v.name === vendorName) : null;

  const cc = categoryMeta[item.category];
  const sc = statusMeta[item.status];

  // Budget code generation (same as PR modal)
  const budgetCode = `BUD-${planYear}-${item.category.slice(0, 3).toUpperCase()}-${item.id.replace("PI-", "")}`;
  const fundingSource = "Core Funding";

  // PR approval steps
  const prSteps = matchingPR ? [
    { label: "Submitted", role: "Requesting Officer", status: "done" as const },
    { label: "Dept. Approval", role: "Department Head", status: matchingPR.deptApproval === "Approved" ? "done" as const : matchingPR.deptApproval === "Rejected" ? "rejected" as const : matchingPR.deptApproval === "Pending" ? "active" as const : "locked" as const },
    { label: "Procurement Review", role: "Procurement Unit", status: matchingPR.procurementApproval === "Approved" ? "done" as const : matchingPR.procurementApproval === "Rejected" ? "rejected" as const : matchingPR.procurementApproval === "Pending" ? "active" as const : "locked" as const },
    { label: "Finance Clearance", role: "Finance Team", status: matchingPR.financeApproval === "Approved" ? "done" as const : matchingPR.financeApproval === "Rejected" ? "rejected" as const : matchingPR.financeApproval === "Pending" ? "active" as const : "locked" as const },
    ...(matchingPR.requiresSeniorApproval ? [{
      label: "Senior Mgmt", role: "Senior Management",
      status: matchingPR.seniorMgmtApproval === "Approved" ? "done" as const : matchingPR.seniorMgmtApproval === "Rejected" ? "rejected" as const : matchingPR.seniorMgmtApproval === "Pending" ? "active" as const : "locked" as const,
    }] : []),
  ] : [];

  // Collect all documents from all sources
  const allDocuments: { name: string; type: string; size: string; date: string; category: string; source: string }[] = [];

  // From completed data
  if (completedData) {
    completedData.documents.forEach(d => allDocuments.push({ ...d, source: "Procurement" }));
  }
  // From contract store
  if (matchingContract) {
    matchingContract.documents.forEach(dg => {
      const latest = dg.versions[dg.versions.length - 1];
      if (latest) {
        allDocuments.push({ name: latest.name, type: latest.type, size: latest.size, date: latest.date, category: dg.label, source: "Contract Repository" });
      }
    });
  }
  // From PR attached docs
  const prDocs = prDocMap[item.id];
  if (prDocs) {
    prDocs.forEach(d => allDocuments.push({ ...d, source: "Purchase Requisition" }));
  }

  // Deduplicate by name
  const uniqueDocs = allDocuments.filter((d, i, arr) => arr.findIndex(x => x.name === d.name) === i);

  // Document categories for grouping
  const docCategories = [...new Set(uniqueDocs.map(d => d.category))];

  // Procurement timeline
  const timeline: { date: string; event: string; status: "done" | "active" | "pending" }[] = [];
  if (matchingPR) {
    matchingPR.approvalHistory.forEach(h => {
      timeline.push({ date: h.date, event: `${h.role}: ${h.action}${h.comments ? ` — ${h.comments}` : ""}`, status: "done" });
    });
  }
  if (completedData) {
    timeline.push({ date: completedData.awardDate, event: `Contract awarded to ${completedData.vendor}`, status: "done" });
    timeline.push({ date: completedData.completedDate, event: "Procurement completed", status: "done" });
  }

  const tabs: { key: DetailTab; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "requisition", label: "Purchase Requisition" },
    { key: "sourcing", label: "Sourcing & Contract" },
    { key: "documents", label: "Documents", count: uniqueDocs.length },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Header row 1: Back + Title ───────────────────────────────────── */}
      <div className="border-b border-slate-200 px-6 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-slate-900 truncate">{item.description}</h1>
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium shrink-0", sc.bg)}>{sc.icon} {item.status}</span>
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium shrink-0", cc.bg)}>{cc.icon} {item.category}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {item.id} &middot; FY {planYear} Procurement Plan &middot; {planDepartment}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Estimated Cost</p>
          <p className="text-[16px] font-semibold text-slate-900">{fmt(item.estimatedCost)}</p>
        </div>
      </div>

      {/* ── Header row 2: Tabs ───────────────────────────────────────────── */}
      <div className="border-b border-slate-200 px-6">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2.5 text-[12px] font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-[#0B01D0] text-[#0B01D0]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[9px]">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">

        {/* ════════════════ OVERVIEW TAB ════════════════ */}
        {activeTab === "overview" && (
          <div className="p-6 space-y-6 max-w-6xl">
            {/* Status banner */}
            {item.status === "Completed" && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-emerald-800">Procurement Completed</p>
                  <p className="text-[11px] text-emerald-600">
                    Awarded to <span className="font-medium">{vendorName || "—"}</span>
                    {completedData && <> on {completedData.awardDate} &middot; {completedData.method}</>}
                  </p>
                </div>
              </div>
            )}
            {item.status === "Requisition Pending" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <Loader2 size={20} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-amber-800">Purchase Requisition Pending Approval</p>
                  <p className="text-[11px] text-amber-600">
                    {matchingPR ? `${matchingPR.requisitionNumber} — ${matchingPR.overallApprovalStatus}` : "Awaiting PR creation"}
                  </p>
                </div>
              </div>
            )}
            {item.status === "In Progress" && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <Clock size={20} className="text-blue-600 shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-blue-800">Procurement In Progress</p>
                  <p className="text-[11px] text-blue-600">
                    {matchingPR ? `PR ${matchingPR.requisitionNumber} approved — awaiting sourcing` : "Active procurement process"}
                  </p>
                </div>
              </div>
            )}
            {item.status === "Not Started" && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <CircleDot size={20} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-slate-700">Not Yet Initiated</p>
                  <p className="text-[11px] text-slate-500">
                    {item.approvalStatus === "Approved"
                      ? "This item is approved. Use the Initiate button on the plan table to create a Purchase Requisition."
                      : "This item is pending finance verification before it can be initiated."}
                  </p>
                </div>
              </div>
            )}

            {/* Two-column details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Plan Item Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Plan Item Details</p>
                <div className="space-y-3">
                  <DetailRow icon={<FileText size={13} />} label="Description" value={item.description} />
                  <DetailRow icon={<Tag size={13} />} label="Category">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", cc.bg)}>{cc.icon} {item.category}</span>
                  </DetailRow>
                  <DetailRow icon={<Package size={13} />} label="Quantity" value={`${item.quantity} ${item.unit}`} />
                  <DetailRow icon={<DollarSign size={13} />} label="Estimated Cost" value={fmt(item.estimatedCost)} bold />
                  <DetailRow icon={<Calendar size={13} />} label="Target Date" value={item.targetDate} />
                  <DetailRow icon={<Hash size={13} />} label="Budget Code" value={budgetCode} mono />
                  <DetailRow icon={<Briefcase size={13} />} label="Funding Source" value={fundingSource} />
                  {item.addedDate && <DetailRow icon={<Calendar size={13} />} label="Added to Plan" value={item.addedDate} />}
                  {item.notes && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-[12px] text-slate-700">{item.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Reference / Summary */}
              <div className="space-y-4">
                {/* Plan Context */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Plan Context</p>
                  <div className="space-y-3">
                    <DetailRow icon={<ClipboardList size={13} />} label="Plan ID" value={planId} mono />
                    <DetailRow icon={<Calendar size={13} />} label="Fiscal Year" value={`FY ${planYear}`} />
                    <DetailRow icon={<Building2 size={13} />} label="Department" value={planDepartment} />
                    <DetailRow icon={<User size={13} />} label="Plan Created By" value={planCreatedBy} />
                  </div>
                </div>

                {/* Key references */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Key References</p>
                  <div className="space-y-3">
                    <DetailRow icon={<FileText size={13} />} label="Purchase Requisition" value={matchingPR?.requisitionNumber || "—"} mono />
                    <DetailRow icon={<ClipboardList size={13} />} label="Sourcing Case" value={completedData?.sourcingCase || (matchingPO?.sourceSourcingCase) || "—"} mono />
                    <DetailRow icon={<Handshake size={13} />} label="Contract" value={matchingContract?.contractNumber || completedData?.contractNumber || "—"} mono />
                    <DetailRow icon={<DollarSign size={13} />} label="Purchase Order" value={matchingPO?.poNumber || completedData?.poNumber || "—"} mono />
                    <DetailRow icon={<Award size={13} />} label="Vendor" value={vendorName || "—"} />
                  </div>
                </div>
              </div>
            </div>

            {/* Procurement Timeline */}
            {timeline.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Procurement Timeline</p>
                <div className="space-y-0">
                  {timeline.map((t, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 mt-1.5", t.status === "done" ? "bg-emerald-500" : t.status === "active" ? "bg-amber-400" : "bg-slate-200")} />
                        {idx < timeline.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                      </div>
                      <div className="pb-4 min-w-0">
                        <p className="text-[10px] text-slate-400">{t.date}</p>
                        <p className="text-[12px] text-slate-700">{t.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ REQUISITION TAB ════════════════ */}
        {activeTab === "requisition" && (
          <div className="p-6 space-y-6 max-w-6xl">
            {!matchingPR ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <FileText size={28} className="text-slate-300" />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">No Purchase Requisition</h3>
                <p className="text-[12px] text-slate-500 max-w-sm">
                  {item.status === "Not Started"
                    ? "A Purchase Requisition has not been created for this item yet. Use the Initiate button on the plan table to start the procurement process."
                    : item.status === "Completed"
                    ? "This item was procured through a prior process. PR records may not be linked in the current system."
                    : "No PR record found for this item."}
                </p>
              </div>
            ) : (
              <>
                {/* PR Header Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 col-span-1">
                    <p className="text-[10px] text-blue-600 uppercase tracking-widest mb-1 font-medium">PR Number</p>
                    <p className="text-[20px] font-semibold text-blue-900 font-mono">{matchingPR.requisitionNumber}</p>
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium mt-2",
                      matchingPR.overallApprovalStatus === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : matchingPR.overallApprovalStatus === "Rejected" ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                    )}>{matchingPR.overallApprovalStatus}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 col-span-2">
                    <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-3 font-medium">Requisition Details</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      <DetailRow icon={<User size={13} />} label="Requested By" value={matchingPR.requestedBy} />
                      <DetailRow icon={<Building2 size={13} />} label="Department" value={matchingPR.department} />
                      <DetailRow icon={<Calendar size={13} />} label="Date Requested" value={matchingPR.dateRequested} />
                      <DetailRow icon={<Tag size={13} />} label="Category" value={matchingPR.category} />
                      <DetailRow icon={<Globe size={13} />} label="Purchase Type" value={matchingPR.purchaseType} />
                      <DetailRow icon={<AlertCircle size={13} />} label="Priority" value={matchingPR.priority} />
                      <DetailRow icon={<DollarSign size={13} />} label="Estimated Cost" value={fmt(matchingPR.estimatedCost)} bold />
                      <DetailRow icon={<Package size={13} />} label="Quantity" value={`${matchingPR.quantity} ${matchingPR.unit}`} />
                      <DetailRow icon={<Hash size={13} />} label="Budget Code" value={budgetCode} mono />
                    </div>
                  </div>
                </div>

                {/* Item Description */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-2 font-medium">Item Description</p>
                  <p className="text-[13px] text-slate-900">{matchingPR.itemDescription}</p>
                </div>

                {/* Approval Workflow */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Approval Workflow</p>

                  {/* Step progress bar */}
                  <div className="flex items-start gap-0 mb-6">
                    {prSteps.map((step, idx) => (
                      <div key={step.label} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {idx > 0 && (
                          <div className={cn("absolute top-3 right-1/2 w-full h-0.5",
                            step.status === "done" || step.status === "active" ? "bg-emerald-400" : "bg-slate-200"
                          )} style={{ zIndex: 0 }} />
                        )}
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center relative z-10 border-2",
                          step.status === "done" ? "bg-emerald-500 border-emerald-500"
                          : step.status === "rejected" ? "bg-red-500 border-red-500"
                          : step.status === "active" ? "bg-white border-amber-400"
                          : "bg-white border-slate-200"
                        )}>
                          {step.status === "done" && <CheckCircle2 size={14} className="text-white" />}
                          {step.status === "rejected" && <XCircle size={14} className="text-white" />}
                          {step.status === "active" && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                          {step.status === "locked" && <div className="w-2 h-2 rounded-full bg-slate-200" />}
                        </div>
                        <p className={cn("text-[9px] mt-1.5 text-center leading-tight",
                          step.status === "done" ? "text-emerald-700 font-medium"
                          : step.status === "rejected" ? "text-red-600 font-medium"
                          : step.status === "active" ? "text-amber-700 font-medium"
                          : "text-slate-400"
                        )}>{step.label}</p>
                        <p className="text-[8px] text-slate-400 text-center">{step.role}</p>
                      </div>
                    ))}
                  </div>

                  {/* Approval History */}
                  {matchingPR.approvalHistory.length > 0 && (
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-3">Approval History</p>
                      <div className="space-y-3">
                        {matchingPR.approvalHistory.map((h, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                              h.action === "Approved" ? "bg-emerald-100" : h.action === "Rejected" ? "bg-red-100" : "bg-blue-100"
                            )}>
                              {h.action === "Approved" && <ShieldCheck size={12} className="text-emerald-600" />}
                              {h.action === "Rejected" && <ShieldAlert size={12} className="text-red-600" />}
                              {h.action === "Submitted" && <FileText size={12} className="text-blue-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-[12px] font-medium text-slate-900">{h.role}</p>
                                <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium",
                                  h.action === "Approved" ? "bg-emerald-50 text-emerald-700"
                                  : h.action === "Rejected" ? "bg-red-50 text-red-600"
                                  : "bg-blue-50 text-blue-600"
                                )}>{h.action}</span>
                                <span className="text-[10px] text-slate-400 ml-auto">{h.date}</span>
                              </div>
                              {h.comments && <p className="text-[11px] text-slate-500 mt-0.5">{h.comments}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════════ SOURCING & CONTRACT TAB ════════════════ */}
        {activeTab === "sourcing" && (
          <div className="p-6 space-y-6 max-w-6xl">
            {!completedData && !matchingContract && !matchingPO ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Handshake size={28} className="text-slate-300" />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">No Sourcing or Contract Data</h3>
                <p className="text-[12px] text-slate-500 max-w-sm">
                  {item.status === "Not Started" || item.status === "Requisition Pending"
                    ? "Sourcing begins after the Purchase Requisition is approved. The PR must complete the approval workflow first."
                    : item.status === "In Progress"
                    ? "The PR has been approved but sourcing has not been initiated yet. Go to the Sourcing module to create a sourcing case."
                    : "No sourcing or contract records found for this item."}
                </p>
              </div>
            ) : (
              <>
                {/* Sourcing Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Sourcing Information</p>
                    <div className="space-y-3">
                      <DetailRow icon={<ClipboardList size={13} />} label="Sourcing Case" value={completedData?.sourcingCase || matchingPO?.sourceSourcingCase || "—"} mono />
                      <DetailRow icon={<Globe size={13} />} label="Sourcing Method" value={completedData?.method || matchingContract?.method || matchingPO?.method || "—"} />
                      <DetailRow icon={<Tag size={13} />} label="Category" value={item.category} />
                      <DetailRow icon={<Award size={13} />} label="Awarded Vendor" value={vendorName || "—"} />
                      <DetailRow icon={<Calendar size={13} />} label="Award Date" value={completedData?.awardDate || matchingContract?.awardDate || "—"} />
                      <DetailRow icon={<DollarSign size={13} />} label="Contract Value" value={fmt(completedData?.contractValue || matchingContract?.value || matchingPO?.amount || item.estimatedCost)} bold />
                    </div>
                  </div>

                  {/* Vendor Details */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Vendor Details</p>
                    {vendorRecord ? (
                      <div className="space-y-3">
                        <DetailRow icon={<Building2 size={13} />} label="Company" value={vendorRecord.name} />
                        <DetailRow icon={<User size={13} />} label="Contact Person" value={vendorRecord.contactPerson} />
                        <DetailRow icon={<Globe size={13} />} label="Email" value={vendorRecord.email} />
                        <DetailRow icon={<FileText size={13} />} label="Phone" value={vendorRecord.phone} />
                        <DetailRow icon={<MapPin size={13} />} label="Address" value={vendorRecord.address} />
                        <DetailRow icon={<Tag size={13} />} label="Category" value={vendorRecord.category} />
                        <DetailRow icon={<Award size={13} />} label="Rating" value={`${vendorRecord.rating} / 5.0`} />
                      </div>
                    ) : vendorName ? (
                      <div className="space-y-3">
                        <DetailRow icon={<Building2 size={13} />} label="Vendor" value={vendorName} />
                        <p className="text-[11px] text-slate-400 italic">Detailed vendor information not available in the supplier database.</p>
                      </div>
                    ) : (
                      <p className="text-[12px] text-slate-400 italic">No vendor assigned yet.</p>
                    )}
                  </div>
                </div>

                {/* Contract Details */}
                {(matchingContract || completedData?.contractNumber !== "—") && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Contract Details</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <DetailRow icon={<Handshake size={13} />} label="Contract Number" value={matchingContract?.contractNumber || completedData?.contractNumber || "—"} mono />
                      <DetailRow icon={<FileText size={13} />} label="Title" value={matchingContract?.title || item.description} />
                      <DetailRow icon={<Tag size={13} />} label="Type" value={matchingContract?.type || item.category} />
                      <DetailRow icon={<Calendar size={13} />} label="Start Date" value={matchingContract?.startDate || completedData?.awardDate || "—"} />
                      <DetailRow icon={<Calendar size={13} />} label="End Date" value={matchingContract?.endDate || "—"} />
                      <DetailRow icon={<DollarSign size={13} />} label="Value" value={fmt(matchingContract?.value || completedData?.contractValue || 0)} bold />
                      {matchingContract && (
                        <>
                          <DetailRow icon={<AlertCircle size={13} />} label="Status" value={matchingContract.status} />
                          <DetailRow icon={<Building2 size={13} />} label="Department" value={matchingContract.department} />
                          <DetailRow icon={<User size={13} />} label="Owner" value={matchingContract.owner} />
                        </>
                      )}
                    </div>
                    {matchingContract?.comments && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Comments</p>
                        <p className="text-[12px] text-slate-700">{matchingContract.comments}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Purchase Order Details */}
                {(matchingPO || completedData?.poNumber !== "—") && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-[10px] text-[#0B01D0] uppercase tracking-widest mb-4 font-medium">Purchase Order</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <DetailRow icon={<DollarSign size={13} />} label="PO Number" value={matchingPO?.poNumber || completedData?.poNumber || "—"} mono />
                      <DetailRow icon={<Award size={13} />} label="Vendor" value={matchingPO?.vendor || vendorName || "—"} />
                      <DetailRow icon={<DollarSign size={13} />} label="Amount" value={fmt(matchingPO?.amount || completedData?.contractValue || 0)} bold />
                      <DetailRow icon={<Calendar size={13} />} label="Order Date" value={matchingPO?.orderDate || "—"} />
                      <DetailRow icon={<Calendar size={13} />} label="Delivery Date" value={matchingPO?.deliveryDate || "—"} />
                      {matchingPO?.status && <DetailRow icon={<AlertCircle size={13} />} label="Status" value={matchingPO.status} />}
                      {matchingPO?.paymentTerms && <DetailRow icon={<FileText size={13} />} label="Payment Terms" value={matchingPO.paymentTerms} />}
                      {matchingPO?.shippingMethod && <DetailRow icon={<Truck size={13} />} label="Shipping Method" value={matchingPO.shippingMethod} />}
                      {matchingPO?.deliveryInstructions && <DetailRow icon={<MapPin size={13} />} label="Delivery Instructions" value={matchingPO.deliveryInstructions} />}
                    </div>
                    {matchingPO?.lineItems && matchingPO.lineItems.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Line Items</p>
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-100">
                              <th className="text-left px-3 py-1.5 text-[10px] text-slate-500 font-medium">Description</th>
                              <th className="text-center px-3 py-1.5 text-[10px] text-slate-500 font-medium">Qty</th>
                              <th className="text-right px-3 py-1.5 text-[10px] text-slate-500 font-medium">Unit Price</th>
                              <th className="text-right px-3 py-1.5 text-[10px] text-slate-500 font-medium">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {matchingPO.lineItems.map(li => (
                              <tr key={li.id} className="border-b border-slate-100">
                                <td className="px-3 py-1.5 text-[11px] text-slate-700">{li.description}</td>
                                <td className="px-3 py-1.5 text-[11px] text-slate-600 text-center">{li.quantity} {li.unit}</td>
                                <td className="px-3 py-1.5 text-[11px] text-slate-600 text-right">{fmt(li.unitPrice)}</td>
                                <td className="px-3 py-1.5 text-[11px] text-slate-900 text-right font-medium">{fmt(li.totalPrice)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {matchingPO?.signedBy && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Signature</p>
                        <div className="grid grid-cols-2 gap-3">
                          <DetailRow icon={<User size={13} />} label="Signed By" value={matchingPO.signedBy} />
                          <DetailRow icon={<Calendar size={13} />} label="Signed At" value={matchingPO.signedAt ? new Date(matchingPO.signedAt).toLocaleDateString() : "—"} />
                          {matchingPO.signatureAuthority && <DetailRow icon={<ShieldCheck size={13} />} label="Authority Level" value={matchingPO.signatureAuthority} />}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ════════════════ DOCUMENTS TAB ════════════════ */}
        {activeTab === "documents" && (
          <div className="p-6 space-y-6 max-w-6xl">
            {uniqueDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Paperclip size={28} className="text-slate-300" />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">No Documents</h3>
                <p className="text-[12px] text-slate-500 max-w-sm">No documents have been uploaded or generated for this procurement item yet.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-slate-900">{uniqueDocs.length} Document{uniqueDocs.length !== 1 ? "s" : ""}</p>
                </div>
                {docCategories.map(cat => {
                  const docs = uniqueDocs.filter(d => d.category === cat);
                  return (
                    <div key={cat} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                      <div className="px-5 py-3 border-b border-slate-200 bg-slate-100/50">
                        <p className="text-[11px] font-semibold text-slate-700">{cat}</p>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {docs.map((doc, idx) => (
                          <div key={idx} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50/80 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                              <FileText size={14} className="text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium text-slate-900 truncate">{doc.name}</p>
                              <p className="text-[10px] text-slate-400">{doc.type} &middot; {doc.size} &middot; {doc.date}</p>
                            </div>
                            <span className="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">{doc.source}</span>
                            <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors" title="View">
                              <Eye size={13} className="text-slate-400" />
                            </button>
                            <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors" title="Download">
                              <Download size={13} className="text-slate-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Reusable detail row ─────────────────────────────────────────────────── */

function DetailRow({ icon, label, value, bold, mono, children }: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  bold?: boolean;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
        {children || (
          <p className={cn("text-[12px] text-slate-900", bold && "font-medium", mono && "font-mono")}>{value || "—"}</p>
        )}
      </div>
    </div>
  );
}
