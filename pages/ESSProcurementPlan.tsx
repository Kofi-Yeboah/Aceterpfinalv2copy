import { useState, useEffect } from "react";
import {
  Plus, Search, Eye, X, ChevronDown, ChevronRight, Trash2, Check,
  Package, FileText, Truck, Wrench, Calendar, Clock, CheckCircle2,
  CircleDot, AlertCircle, Send, ArrowLeft, MoreHorizontal, Play,
  History, ShieldCheck, ShieldAlert, XCircle, ChevronUp, Upload, Paperclip,
  Loader2, Save
} from "lucide-react";
import { cn } from "../lib/utils";
import { createRequisitionFromPlan, getGeneratedPRs, subscribe } from "../lib/procurementStore";
import { subscribe as subscribeContracts } from "../lib/contractStore";
import { ProcurementItemDetailView } from "../components/ProcurementItemDetailView";

/* ─── Vendor Database (shared mock data) ─────────────────────────────────────── */
const VENDOR_DATABASE = [
  { id: "V-001", name: "Tech Solutions Inc.", contactPerson: "John Smith", email: "john@techsolutions.com", phone: "+1 (555) 123-4567", category: "IT Equipment", rating: 4.8, status: "Active", address: "12 Innovation Drive, Accra" },
  { id: "V-002", name: "Office Depot Ltd.", contactPerson: "Sarah Johnson", email: "sarah@officedepot.com", phone: "+1 (555) 234-5678", category: "Office Supplies", rating: 4.5, status: "Active", address: "45 Commerce St, Tema" },
  { id: "V-003", name: "Global Services Co.", contactPerson: "Michael Brown", email: "michael@globalservices.com", phone: "+1 (555) 345-6789", category: "Professional Services", rating: 4.9, status: "Active", address: "8 Partnership Ave, Kumasi" },
  { id: "V-004", name: "Premier Supplies", contactPerson: "Emily Davis", email: "emily@premiersupplies.com", phone: "+1 (555) 456-7890", category: "Office Supplies", rating: 4.3, status: "Active", address: "21 Supply Chain Rd, Accra" },
  { id: "V-005", name: "Elite Partners", contactPerson: "David Wilson", email: "david@elitepartners.com", phone: "+1 (555) 567-8901", category: "Professional Services", rating: 4.7, status: "Active", address: "3 Executive Blvd, Accra" },
  { id: "V-006", name: "Facilities Management Pro", contactPerson: "Lisa Martinez", email: "lisa@facilitiespro.com", phone: "+1 (555) 678-9012", category: "Facilities", rating: 4.6, status: "Active", address: "77 Maintenance Lane, Takoradi" },
  { id: "V-007", name: "Creative Marketing Solutions", contactPerson: "Tom Anderson", email: "tom@creativemarketingsolutions.com", phone: "+1 (555) 789-0123", category: "Marketing", rating: 4.4, status: "Pending", address: "9 Brand Ave, Accra" },
  { id: "V-008", name: "Tech Innovators LLC", contactPerson: "Rachel Green", email: "rachel@techinnovators.com", phone: "+1 (555) 890-1234", category: "IT Equipment", rating: 4.2, status: "Inactive", address: "55 Tech Park, Tema" },
  { id: "V-009", name: "PrintWorks Ghana Ltd", contactPerson: "Kofi Mensah", email: "kofi@printworks.gh", phone: "+233 30 277 5500", category: "Office Supplies", rating: 4.1, status: "Active", address: "16 Industrial Area, Accra" },
  { id: "V-010", name: "Ghana Research Associates", contactPerson: "Ama Serwaa", email: "info@ghanaresearch.org", phone: "+233 30 266 1100", category: "Professional Services", rating: 4.6, status: "Active", address: "University Ave, Legon" },
  { id: "V-011", name: "La Palm Royal Beach Hotel", contactPerson: "Events Desk", email: "events@lapalmhotel.com", phone: "+233 30 277 1700", category: "Facilities", rating: 4.5, status: "Active", address: "La Beach Rd, Accra" },
  { id: "V-012", name: "MedSupply GH", contactPerson: "Kwaku Frimpong", email: "sales@medsupplygh.com", phone: "+233 24 411 2233", category: "Office Supplies", rating: 4.0, status: "Active", address: "22 Health Lane, Kumasi" },
];

/* ─── Types ──────────────────────────────────────────────────────────────────── */

type ItemCategory = "Goods" | "Services" | "Consultancy" | "Works" | "Other";
type PlanStatus = "Draft" | "Pending Approval" | "Approved" | "Rejected";
type ItemStatus = "Not Started" | "Requisition Pending" | "In Progress" | "Completed";
type ItemApproval = "Approved" | "Pending Verification";

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
  approvalStatus: ItemApproval;
  addedDate?: string;
}

interface PlanVersion {
  version: number;
  date: string;
  action: "Submitted" | "Approved" | "Flagged - Out of Budget" | "Flagged - Items Rejected" | "Revised & Resubmitted" | "Amendment Approved" | "Amendment Rejected";
  performedBy: string;
  notes: string;
  totalBudget: number;
  itemCount: number;
  snapshot?: { approved: number; rejected: number; amended: number };
}

interface ProcurementPlan {
  id: string;
  year: number;
  department: string;
  createdBy: string;
  createdDate: string;
  planStatus: PlanStatus;
  totalBudget: number;
  items: ProcurementItem[];
  approvedBy: string | null;
  approvedDate: string | null;
  rejectionReason: string | null;
  versionHistory: PlanVersion[];
}

/* ─── Mock Data ──────────────────────────────────────────────────────────────── */

const mockPlans: ProcurementPlan[] = [
  {
    id: "PROC-2026",
    year: 2026,
    department: "Operations",
    createdBy: "Kwame Asante",
    createdDate: "Jan 05, 2026",
    planStatus: "Approved",
    totalBudget: 187500,
    approvedBy: "Dr. Akua Mensah",
    approvedDate: "Jan 20, 2026",
    rejectionReason: null,
    versionHistory: [
      { version: 1, date: "Jan 05, 2026", action: "Submitted", performedBy: "Kwame Asante", notes: "Initial procurement plan submission for FY2026", totalBudget: 210000, itemCount: 10 },
      { version: 2, date: "Jan 10, 2026", action: "Flagged - Out of Budget", performedBy: "Ama Boateng (Finance)", notes: "Total budget exceeds departmental allocation by GHS 22,500. Vehicle fleet servicing cost too high — please obtain competitive quotes. Conference room renovation deferred to Q3.", totalBudget: 210000, itemCount: 10, snapshot: { approved: 7, rejected: 2, amended: 1 } },
      { version: 3, date: "Jan 14, 2026", action: "Revised & Resubmitted", performedBy: "Kwame Asante", notes: "Reduced vehicle servicing estimate to GHS 18,000 (3 new quotes attached). Removed duplicate stationery line. Adjusted miscellaneous allocation.", totalBudget: 187500, itemCount: 9 },
      { version: 4, date: "Jan 20, 2026", action: "Approved", performedBy: "Dr. Akua Mensah (Finance Director)", notes: "Plan approved. Budget within departmental ceiling. Quarterly review scheduled.", totalBudget: 187500, itemCount: 9 },
    ],
    items: [
      { id: "PI-001", description: "Office Laptops (Dell Latitude 5540)", category: "Goods", quantity: 10, unit: "Units", estimatedCost: 45000, targetDate: "Feb 28, 2026", status: "Completed", notes: "For new hires in Q1", approvalStatus: "Approved" },
      { id: "PI-002", description: "Annual IT Support & Maintenance Contract", category: "Services", quantity: 1, unit: "Contract", estimatedCost: 24000, targetDate: "Jan 31, 2026", status: "Completed", notes: "Renewal of existing SLA with TechServe Ltd", approvalStatus: "Approved" },
      { id: "PI-003", description: "Office Furniture — Standing Desks", category: "Goods", quantity: 15, unit: "Units", estimatedCost: 22500, targetDate: "Mar 31, 2026", status: "In Progress", notes: "Ergonomic desks for Accra HQ", approvalStatus: "Approved" },
      { id: "PI-004", description: "External Audit Services — Q2", category: "Consultancy", quantity: 1, unit: "Engagement", estimatedCost: 35000, targetDate: "Jun 30, 2026", status: "Not Started", notes: "Statutory audit engagement", approvalStatus: "Approved" },
      { id: "PI-005", description: "Vehicle Fleet Servicing (6 vehicles)", category: "Works", quantity: 6, unit: "Vehicles", estimatedCost: 18000, targetDate: "Apr 15, 2026", status: "Not Started", notes: "Bi-annual servicing", approvalStatus: "Approved" },
      { id: "PI-006", description: "Staff Training — Data Analytics Workshop", category: "Services", quantity: 1, unit: "Program", estimatedCost: 12000, targetDate: "May 20, 2026", status: "Not Started", notes: "20 staff members, 3-day program", approvalStatus: "Approved" },
      { id: "PI-007", description: "Printer Toners & Stationery (Annual Supply)", category: "Goods", quantity: 1, unit: "Lot", estimatedCost: 8500, targetDate: "Feb 15, 2026", status: "Completed", notes: "Annual bulk order", approvalStatus: "Approved" },
      { id: "PI-008", description: "Office Renovation — Conference Room B", category: "Works", quantity: 1, unit: "Project", estimatedCost: 15000, targetDate: "Aug 30, 2026", status: "Not Started", notes: "Soundproofing and AV upgrade", approvalStatus: "Approved" },
      { id: "PI-009", description: "Miscellaneous / Unforeseen Purchases", category: "Other", quantity: 1, unit: "Allocation", estimatedCost: 7500, targetDate: "Dec 31, 2026", status: "In Progress", notes: "Reserve for ad-hoc procurement needs throughout the year", approvalStatus: "Approved" },
      // Pending additions (not yet verified by Finance)
      { id: "PI-010", description: "Projector for Training Room A", category: "Goods", quantity: 2, unit: "Units", estimatedCost: 6800, targetDate: "Apr 30, 2026", status: "Not Started", notes: "Epson EB-FH52 Full HD", approvalStatus: "Pending Verification", addedDate: "Mar 03, 2026" },
      { id: "PI-011", description: "Employee Wellness Program — Q2", category: "Services", quantity: 1, unit: "Program", estimatedCost: 9500, targetDate: "Jun 15, 2026", status: "Not Started", notes: "Mental health and fitness initiative", approvalStatus: "Pending Verification", addedDate: "Mar 07, 2026" },
    ],
  },
  {
    id: "PROC-2025",
    year: 2025,
    department: "Operations",
    createdBy: "Kwame Asante",
    createdDate: "Jan 08, 2025",
    planStatus: "Approved",
    totalBudget: 142000,
    approvedBy: "Dr. Akua Mensah",
    approvedDate: "Jan 22, 2025",
    rejectionReason: null,
    versionHistory: [
      { version: 1, date: "Jan 08, 2025", action: "Submitted", performedBy: "Kwame Asante", notes: "Initial procurement plan for FY2025", totalBudget: 158000, itemCount: 8 },
      { version: 2, date: "Jan 13, 2025", action: "Flagged - Items Rejected", performedBy: "Ama Boateng (Finance)", notes: "Office renovation rejected — building lease expires Dec 2025, renovation not cost-effective. Reduce miscellaneous allocation to GHS 12,000.", totalBudget: 158000, itemCount: 8, snapshot: { approved: 6, rejected: 1, amended: 1 } },
      { version: 3, date: "Jan 17, 2025", action: "Revised & Resubmitted", performedBy: "Kwame Asante", notes: "Removed office renovation. Adjusted miscellaneous to GHS 12,000.", totalBudget: 142000, itemCount: 7 },
      { version: 4, date: "Jan 22, 2025", action: "Approved", performedBy: "Dr. Akua Mensah (Finance Director)", notes: "Approved within budget.", totalBudget: 142000, itemCount: 7 },
    ],
    items: [
      { id: "PI-101", description: "Office Laptops (Dell Latitude 5530)", category: "Goods", quantity: 8, unit: "Units", estimatedCost: 32000, targetDate: "Feb 28, 2025", status: "Completed", notes: "Replacement cycle", approvalStatus: "Approved" },
      { id: "PI-102", description: "IT Support Contract Renewal", category: "Services", quantity: 1, unit: "Contract", estimatedCost: 22000, targetDate: "Jan 31, 2025", status: "Completed", notes: "TechServe Ltd annual SLA", approvalStatus: "Approved" },
      { id: "PI-103", description: "Office Chairs — Ergonomic", category: "Goods", quantity: 20, unit: "Units", estimatedCost: 16000, targetDate: "Mar 15, 2025", status: "Completed", notes: "", approvalStatus: "Approved" },
      { id: "PI-104", description: "External Audit Services — Annual", category: "Consultancy", quantity: 1, unit: "Engagement", estimatedCost: 30000, targetDate: "Jun 30, 2025", status: "Completed", notes: "", approvalStatus: "Approved" },
      { id: "PI-105", description: "Vehicle Fleet Servicing", category: "Works", quantity: 6, unit: "Vehicles", estimatedCost: 16000, targetDate: "Apr 30, 2025", status: "Completed", notes: "", approvalStatus: "Approved" },
      { id: "PI-106", description: "Staff Retreat & Team Building", category: "Services", quantity: 1, unit: "Event", estimatedCost: 14000, targetDate: "Sep 15, 2025", status: "Completed", notes: "", approvalStatus: "Approved" },
      { id: "PI-107", description: "Miscellaneous / Unforeseen", category: "Other", quantity: 1, unit: "Allocation", estimatedCost: 12000, targetDate: "Dec 31, 2025", status: "Completed", notes: "Fully utilized", approvalStatus: "Approved" },
    ],
  },
  {
    id: "PROC-2024",
    year: 2024,
    department: "Operations",
    createdBy: "Abena Owusu",
    createdDate: "Jan 10, 2024",
    planStatus: "Approved",
    totalBudget: 118500,
    approvedBy: "Dr. Akua Mensah",
    approvedDate: "Jan 18, 2024",
    rejectionReason: null,
    versionHistory: [
      { version: 1, date: "Jan 10, 2024", action: "Submitted", performedBy: "Abena Owusu", notes: "Initial submission", totalBudget: 118500, itemCount: 5 },
      { version: 2, date: "Jan 18, 2024", action: "Approved", performedBy: "Dr. Akua Mensah (Finance Director)", notes: "Approved as submitted — within budget.", totalBudget: 118500, itemCount: 5 },
    ],
    items: [
      { id: "PI-201", description: "Office Computers — Desktop", category: "Goods", quantity: 12, unit: "Units", estimatedCost: 36000, targetDate: "Mar 01, 2024", status: "Completed", notes: "", approvalStatus: "Approved" },
      { id: "PI-202", description: "Internet Upgrade & Networking", category: "Services", quantity: 1, unit: "Contract", estimatedCost: 18000, targetDate: "Feb 15, 2024", status: "Completed", notes: "", approvalStatus: "Approved" },
      { id: "PI-203", description: "Consultancy — Process Improvement", category: "Consultancy", quantity: 1, unit: "Engagement", estimatedCost: 25000, targetDate: "May 30, 2024", status: "Completed", notes: "", approvalStatus: "Approved" },
      { id: "PI-204", description: "Office Security System Installation", category: "Works", quantity: 1, unit: "Project", estimatedCost: 20000, targetDate: "Jul 30, 2024", status: "Completed", notes: "", approvalStatus: "Approved" },
      { id: "PI-205", description: "Miscellaneous / Unforeseen", category: "Other", quantity: 1, unit: "Allocation", estimatedCost: 19500, targetDate: "Dec 31, 2024", status: "Completed", notes: "", approvalStatus: "Approved" },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

const categoryMeta: Record<ItemCategory, { bg: string; icon: React.ReactNode }> = {
  Goods:       { bg: "bg-purple-50 text-purple-700 border-purple-200", icon: <Package size={11} /> },
  Services:    { bg: "bg-teal-50 text-teal-700 border-teal-200",     icon: <Truck size={11} /> },
  Consultancy: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: <FileText size={11} /> },
  Works:       { bg: "bg-orange-50 text-orange-700 border-orange-200", icon: <Wrench size={11} /> },
  Other:       { bg: "bg-slate-100 text-slate-600 border-slate-300",   icon: <MoreHorizontal size={11} /> },
};

const statusMeta: Record<ItemStatus, { bg: string; icon: React.ReactNode }> = {
  "Not Started":          { bg: "bg-slate-50 text-slate-500 border-slate-200",       icon: <CircleDot size={11} /> },
  "Requisition Pending":  { bg: "bg-amber-50 text-amber-700 border-amber-200",      icon: <Loader2 size={11} /> },
  "In Progress":          { bg: "bg-blue-50 text-blue-700 border-blue-200",          icon: <Clock size={11} /> },
  Completed:              { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={11} /> },
};

const planStatusMeta: Record<PlanStatus, string> = {
  Draft:              "bg-slate-100 text-slate-600 border-slate-300",
  "Pending Approval": "bg-amber-50 text-amber-700 border-amber-200",
  Approved:           "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected:           "bg-red-50 text-red-600 border-red-200",
};

const versionActionMeta: Record<string, { bg: string; icon: React.ReactNode }> = {
  Submitted:                   { bg: "bg-blue-50 text-blue-700 border-blue-200",       icon: <Send size={12} /> },
  Approved:                    { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <ShieldCheck size={12} /> },
  "Flagged - Out of Budget":   { bg: "bg-red-50 text-red-600 border-red-200",           icon: <ShieldAlert size={12} /> },
  "Flagged - Items Rejected":  { bg: "bg-amber-50 text-amber-700 border-amber-200",    icon: <XCircle size={12} /> },
  "Revised & Resubmitted":    { bg: "bg-indigo-50 text-indigo-700 border-indigo-200",  icon: <History size={12} /> },
  "Amendment Approved":        { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <ShieldCheck size={12} /> },
  "Amendment Rejected":        { bg: "bg-red-50 text-red-600 border-red-200",           icon: <XCircle size={12} /> },
};

const fmt = (n: number) => "GHS " + n.toLocaleString("en-GH");

const CATEGORIES: ItemCategory[] = ["Goods", "Services", "Consultancy", "Works", "Other"];
const UNITS = ["Units", "Lot", "Contract", "Engagement", "Project", "Program", "Vehicles", "Event", "Allocation"];

function blankItem(): ProcurementItem {
  return { id: "", description: "", category: "Goods", quantity: 1, unit: "Units", estimatedCost: 0, targetDate: "", status: "Not Started", notes: "", approvalStatus: "Pending Verification" };
}

/* ═════════════════════��═════════════════════════════════════════════════════════
   COMPONENT
   ═════════════════════════════���═════════════════════════════════════════════════ */

export function ESSProcurementPlan() {
  const [plans, setPlans] = useState<ProcurementPlan[]>(mockPlans);
  const [expandedPrevious, setExpandedPrevious] = useState<Set<string>>(new Set());
  const [viewItem, setViewItem] = useState<{ item: ProcurementItem; planId: string } | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"current" | "previous">("current");

  // Subscribe to procurementStore and sync item statuses with PR approval stages
  const [, setStoreTick] = useState(0);
  useEffect(() => {
    const unsub1 = subscribe(() => setStoreTick((t) => t + 1));
    const unsub2 = subscribeContracts(() => setStoreTick((t) => t + 1));
    return () => { unsub1(); unsub2(); };
  }, []);

  const generatedPRs = getGeneratedPRs();
  useEffect(() => {
    if (generatedPRs.length === 0) return;
    setPlans(prev => prev.map(plan => ({
      ...plan,
      items: plan.items.map(item => {
        const matchingPR = generatedPRs.find(
          pr => pr.sourcePlanId === plan.id && pr.sourcePlanItemId === item.id
        );
        if (!matchingPR) return item;
        let newStatus: ItemStatus;
        if (matchingPR.overallApprovalStatus === "Approved") {
          newStatus = "In Progress";
        } else if (matchingPR.overallApprovalStatus === "Rejected") {
          newStatus = "Not Started";
        } else {
          newStatus = "Requisition Pending";
        }
        if (item.status === newStatus) return item;
        return { ...item, status: newStatus };
      }),
    })));
  }, [generatedPRs]);

  // Creation flow
  const [creating, setCreating] = useState(false);
  const [newItems, setNewItems] = useState<ProcurementItem[]>([]);
  const [editingItem, setEditingItem] = useState<ProcurementItem>(blankItem());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newDepartment, setNewDepartment] = useState("Operations");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Add item to existing plan
  const [addingToExistingPlan, setAddingToExistingPlan] = useState(false);
  const [existingPlanEditItem, setExistingPlanEditItem] = useState<ProcurementItem>(blankItem());
  const [existingPlanFormErrors, setExistingPlanFormErrors] = useState<Record<string, string>>({});

  // Initiate procurement — PR form
  const [prFormOpen, setPrFormOpen] = useState<{ planId: string; itemId: string } | null>(null);
  const [prFormData, setPrFormData] = useState({
    detailedDescription: "",
    // Goods fields
    desiredDeliveryDate: "",
    deliveryLocation: "HQ - Accra" as string,
    // Services / Consultancy fields
    consultancyType: "Firm" as "Firm" | "Individual",
    estimatedStartDate: "",
    estimatedEndDate: "",
    // Sourcing
    sourcingMethod: "Standard Competitive" as "Standard Competitive" | "Direct Selection",
    directSelectionJustification: "",
    vendorLegalName: "",
    vendorAddress: "",
    vendorContact: "",
    // Funding
    fundingSource: "Core Funding",
  });
  const [prSpecsAttachments, setPrSpecsAttachments] = useState<string[]>([]);
  const [prSupportingDocs, setPrSupportingDocs] = useState<string[]>([]);
  const [prFormErrors, setPrFormErrors] = useState<Record<string, string>>({});
  const [vendorSearchOpen, setVendorSearchOpen] = useState(false);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");

  // Version history
  const [showVersionHistory, setShowVersionHistory] = useState<string | null>(null);

  const currentYear = 2026;
  const currentPlan = plans.find(p => p.year === currentYear);
  const previousPlans = plans.filter(p => p.year < currentYear).sort((a, b) => b.year - a.year);

  // Split items
  const approvedItems = currentPlan?.items.filter(i => i.approvalStatus === "Approved") ?? [];
  const pendingItems = currentPlan?.items.filter(i => i.approvalStatus === "Pending Verification") ?? [];

  const togglePrevious = (id: string) => {
    setExpandedPrevious(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Creation helpers ─────────────────────────────────────────────────────── */

  const validateItemForm = (item: ProcurementItem): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!item.description.trim()) errs.description = "Required";
    if (item.estimatedCost <= 0) errs.estimatedCost = "Must be > 0";
    if (!item.targetDate) errs.targetDate = "Required";
    if (item.category !== "Other" && item.quantity <= 0) errs.quantity = "Must be > 0";
    return errs;
  };

  const handleAddItem = () => {
    const errs = validateItemForm(editingItem);
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    const item: ProcurementItem = { ...editingItem, id: `PI-NEW-${Date.now()}`, approvalStatus: "Approved" };
    if (editingIndex !== null) {
      setNewItems(prev => prev.map((it, i) => i === editingIndex ? item : it));
      setEditingIndex(null);
    } else {
      setNewItems(prev => [...prev, item]);
    }
    setEditingItem(blankItem());
    setShowAddForm(false);
  };

  const handleRemoveItem = (idx: number) => setNewItems(prev => prev.filter((_, i) => i !== idx));

  const handleEditExistingItem = (idx: number) => {
    setEditingItem({ ...newItems[idx] });
    setEditingIndex(idx);
    setShowAddForm(true);
    setFormErrors({});
  };

  const handleSubmitPlan = () => {
    if (newItems.length === 0) return;
    const plan: ProcurementPlan = {
      id: `PROC-${currentYear}`,
      year: currentYear,
      department: newDepartment,
      createdBy: "Kwame Asante",
      createdDate: "Mar 09, 2026",
      planStatus: "Pending Approval",
      totalBudget: newItems.reduce((s, i) => s + i.estimatedCost, 0),
      items: newItems.map((item, idx) => ({ ...item, id: `PI-${String(idx + 1).padStart(3, "0")}`, approvalStatus: "Approved" as ItemApproval })),
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
      versionHistory: [
        { version: 1, date: "Mar 09, 2026", action: "Submitted", performedBy: "Kwame Asante", notes: `Initial procurement plan submission for FY${currentYear}`, totalBudget: newItems.reduce((s, i) => s + i.estimatedCost, 0), itemCount: newItems.length },
      ],
    };
    setPlans(prev => [plan, ...prev.filter(p => p.year !== currentYear)]);
    setCreating(false);
    setNewItems([]);
    setEditingItem(blankItem());
    setShowAddForm(false);
  };

  const handleCancelCreation = () => {
    setCreating(false);
    setNewItems([]);
    setEditingItem(blankItem());
    setShowAddForm(false);
    setEditingIndex(null);
    setFormErrors({});
  };

  const newTotal = newItems.reduce((s, i) => s + i.estimatedCost, 0);

  /* ── Add item to existing plan (goes to pending) ──────────────────────────── */

  const handleAddToExistingPlan = () => {
    const errs = validateItemForm(existingPlanEditItem);
    if (Object.keys(errs).length > 0) { setExistingPlanFormErrors(errs); return; }
    setExistingPlanFormErrors({});
    if (!currentPlan) return;
    const newItem: ProcurementItem = {
      ...existingPlanEditItem,
      id: `PI-${String(currentPlan.items.length + 1).padStart(3, "0")}`,
      approvalStatus: "Pending Verification",
      addedDate: "Mar 09, 2026",
    };
    setPlans(prev => prev.map(p =>
      p.id === currentPlan.id
        ? { ...p, items: [...p.items, newItem] }
        : p
    ));
    setExistingPlanEditItem(blankItem());
    setAddingToExistingPlan(false);
  };

  /* ── Simulate Finance approval of pending item ────────────────────────────── */

  const handleFinanceApproveItem = (itemId: string) => {
    if (!currentPlan) return;
    setPlans(prev => prev.map(p =>
      p.id === currentPlan.id
        ? {
            ...p,
            items: p.items.map(i => i.id === itemId ? { ...i, approvalStatus: "Approved" as ItemApproval } : i),
            totalBudget: p.totalBudget + (p.items.find(i => i.id === itemId)?.estimatedCost ?? 0),
            versionHistory: [
              ...p.versionHistory,
              {
                version: p.versionHistory.length + 1,
                date: "Mar 09, 2026",
                action: "Amendment Approved" as const,
                performedBy: "Ama Boateng (Finance)",
                notes: `Item "${p.items.find(i => i.id === itemId)?.description}" verified and added to approved plan.`,
                totalBudget: p.totalBudget + (p.items.find(i => i.id === itemId)?.estimatedCost ?? 0),
                itemCount: p.items.filter(i => i.approvalStatus === "Approved").length + 1,
              },
            ],
          }
        : p
    ));
  };

  const handleFinanceRejectItem = (itemId: string) => {
    if (!currentPlan) return;
    const item = currentPlan.items.find(i => i.id === itemId);
    setPlans(prev => prev.map(p =>
      p.id === currentPlan.id
        ? {
            ...p,
            items: p.items.filter(i => i.id !== itemId),
            versionHistory: [
              ...p.versionHistory,
              {
                version: p.versionHistory.length + 1,
                date: "Mar 09, 2026",
                action: "Amendment Rejected" as const,
                performedBy: "Ama Boateng (Finance)",
                notes: `Item "${item?.description}" rejected — does not fall within approved budget ceiling.`,
                totalBudget: p.totalBudget,
                itemCount: p.items.filter(i => i.approvalStatus === "Approved").length,
              },
            ],
          }
        : p
    ));
  };

  /* ── Initiate procurement — open PR form ──────────────────────────────────── */

  const openPRForm = (planId: string, itemId: string) => {
    setPrFormOpen({ planId, itemId });
    setPrFormData({
      detailedDescription: "",
      desiredDeliveryDate: "",
      deliveryLocation: "HQ - Accra",
      consultancyType: "Firm",
      estimatedStartDate: "",
      estimatedEndDate: "",
      sourcingMethod: "Standard Competitive",
      directSelectionJustification: "",
      vendorLegalName: "",
      vendorAddress: "",
      vendorContact: "",
      fundingSource: "Core Funding",
    });
    setPrSpecsAttachments([]);
    setPrSupportingDocs([]);
    setPrFormErrors({});
  };

  const handlePRFormSubmit = () => {
    if (!prFormOpen) return;
    const { planId, itemId } = prFormOpen;
    const plan = plans.find(p => p.id === planId);
    const item = plan?.items.find(i => i.id === itemId);
    if (!plan || !item) return;

    const errors: Record<string, string> = {};
    if (!prFormData.detailedDescription.trim()) errors.detailedDescription = "Detailed description is required";
    if (item.category === "Goods" && !prFormData.desiredDeliveryDate) errors.desiredDeliveryDate = "Delivery date is required";
    if ((item.category === "Services" || item.category === "Consultancy") && !prFormData.estimatedStartDate) errors.estimatedStartDate = "Start date is required";
    if ((item.category === "Services" || item.category === "Consultancy") && !prFormData.estimatedEndDate) errors.estimatedEndDate = "End date is required";
    if (prFormData.sourcingMethod === "Direct Selection" && !prFormData.directSelectionJustification.trim()) errors.directSelectionJustification = "Direct selection justification is required";
    if (prSpecsAttachments.length === 0) errors.specsAttachment = "At least one Specs / Terms of Reference document is required";
    if (Object.keys(errors).length) { setPrFormErrors(errors); return; }

    createRequisitionFromPlan({
      planId: plan.id,
      itemId: item.id,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      estimatedCost: item.estimatedCost,
      targetDate: item.targetDate,
      requestedBy: plan.createdBy,
      department: plan.department,
    });

    setPlans(prev => prev.map(p =>
      p.id === planId
        ? { ...p, items: p.items.map(i => i.id === itemId ? { ...i, status: "Requisition Pending" as ItemStatus } : i) }
        : p
    ));
    setPrFormOpen(null);
  };

  const handlePRSaveAsDraft = () => {
    // In a real app this would persist to the backend
    setPrFormOpen(null);
  };

  const handleUploadSpecsFile = () => {
    const fakeNames = ["Terms_of_Reference.pdf", "Technical_Specifications.docx", "Scope_of_Work.pdf", "Requirements_Document.pdf"];
    const nextFile = fakeNames.find(f => !prSpecsAttachments.includes(f)) || `TOR_${prSpecsAttachments.length + 1}.pdf`;
    setPrSpecsAttachments(prev => [...prev, nextFile]);
    setPrFormErrors(prev => { const n = { ...prev }; delete n.specsAttachment; return n; });
  };

  const handleUploadSupportingDoc = () => {
    const fakeNames = ["Email_Approval.pdf", "Vendor_Quote_A.pdf", "Budget_Clearance.pdf", "Sole_Source_Memo.docx"];
    const nextFile = fakeNames.find(f => !prSupportingDocs.includes(f)) || `Supporting_${prSupportingDocs.length + 1}.pdf`;
    setPrSupportingDocs(prev => [...prev, nextFile]);
  };

  const updatePrField = (field: string, value: string) => {
    setPrFormData(prev => ({ ...prev, [field]: value }));
    setPrFormErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const DELIVERY_LOCATIONS = ["HQ - Accra", "Regional Office - Kumasi", "Regional Office - Tamale", "Regional Office - Takoradi", "Field Office - Cape Coast", "Warehouse - Tema"];

  /* ── Render helpers ───────────────────────────────────────────────────────── */

  const renderItemFormFields = (
    item: ProcurementItem,
    setItem: (fn: (p: ProcurementItem) => ProcurementItem) => void,
    errors: Record<string, string>,
  ) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      <div className="col-span-2">
        <label className="block text-[11px] text-slate-500 mb-1">{item.category === "Other" ? "Item" : "Item Description"} <span className="text-red-400">*</span></label>
        <input value={item.description} onChange={e => setItem(p => ({ ...p, description: e.target.value }))} placeholder={item.category === "Other" ? "e.g. Miscellaneous office supplies" : "e.g. Office Laptops (Dell Latitude 5540)"} className={cn("w-full px-3 py-2 border rounded-lg text-[12px] outline-none", errors.description ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-purple-400")} />
        {errors.description && <p className="text-[10px] text-red-500 mt-0.5">{errors.description}</p>}
      </div>
      <div>
        <label className="block text-[11px] text-slate-500 mb-1">Category <span className="text-red-400">*</span></label>
        <select value={item.category} onChange={e => { const cat = e.target.value as ItemCategory; setItem(p => ({ ...p, category: cat, unit: cat === "Other" ? "Allocation" : p.unit, quantity: cat === "Other" ? 1 : p.quantity })); }} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-purple-400 bg-white">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}{c === "Other" ? " (Miscellaneous)" : ""}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-slate-500 mb-1">Quantity</label>
        <div className="flex gap-2">
          <input type="number" min={1} value={item.quantity} onChange={e => setItem(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))} disabled={item.category === "Other"} className={cn("w-20 px-3 py-2 border rounded-lg text-[12px] outline-none focus:border-purple-400", item.category === "Other" ? "bg-slate-100 text-slate-400 border-slate-200" : "border-slate-200", errors.quantity ? "border-red-300 bg-red-50" : "")} />
          <select value={item.unit} onChange={e => setItem(p => ({ ...p, unit: e.target.value }))} disabled={item.category === "Other"} className={cn("flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-purple-400 bg-white", item.category === "Other" ? "bg-slate-100 text-slate-400" : "")}>
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-slate-500 mb-1">Estimated Cost (GHS) <span className="text-red-400">*</span></label>
        <input type="number" min={0} value={item.estimatedCost || ""} onChange={e => setItem(p => ({ ...p, estimatedCost: parseFloat(e.target.value) || 0 }))} placeholder="0.00" className={cn("w-full px-3 py-2 border rounded-lg text-[12px] outline-none focus:border-purple-400", errors.estimatedCost ? "border-red-300 bg-red-50" : "border-slate-200")} />
        {errors.estimatedCost && <p className="text-[10px] text-red-500 mt-0.5">{errors.estimatedCost}</p>}
      </div>
      <div>
        <label className="block text-[11px] text-slate-500 mb-1">Target Date <span className="text-red-400">*</span></label>
        <input type="date" value={item.targetDate} onChange={e => setItem(p => ({ ...p, targetDate: e.target.value }))} min="2026-01-01" max="2026-12-31" className={cn("w-full px-3 py-2 border rounded-lg text-[12px] outline-none focus:border-purple-400", errors.targetDate ? "border-red-300 bg-red-50" : "border-slate-200")} />
        {errors.targetDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.targetDate}</p>}
      </div>
      <div className="col-span-2">
        <label className="block text-[11px] text-slate-500 mb-1">Notes</label>
        <textarea value={item.notes} onChange={e => setItem(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes..." rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-purple-400 resize-none" />
      </div>
      {item.category === "Other" && (
        <div className="col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-700">The "Other" category is reserved for miscellaneous and unforeseen purchases. Set the total annual allocation amount you'd like to reserve.</p>
        </div>
      )}
    </div>
  );

  /* ── Version history modal ────────────────────────────────────────────────── */

  const renderVersionHistoryModal = () => {
    if (!showVersionHistory) return null;
    const plan = plans.find(p => p.id === showVersionHistory);
    if (!plan) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowVersionHistory(null)} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-auto">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">{plan.year} Plan — Version History</h2>
              <p className="text-[11px] text-slate-400">{plan.department} · {plan.versionHistory.length} entries</p>
            </div>
            <button onClick={() => setShowVersionHistory(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
          </div>
          <div className="p-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" />

              <div className="space-y-0">
                {plan.versionHistory.map((entry, idx) => {
                  const meta = versionActionMeta[entry.action] ?? { bg: "bg-slate-100 text-slate-600 border-slate-300", icon: <History size={12} /> };
                  const isLast = idx === plan.versionHistory.length - 1;
                  const isFlagged = entry.action.startsWith("Flagged");
                  return (
                    <div key={entry.version} className="relative flex gap-4 pb-6">
                      {/* Timeline dot */}
                      <div className={cn(
                        "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2",
                        isFlagged ? "bg-red-50 border-red-200" :
                        entry.action === "Approved" || entry.action === "Amendment Approved" ? "bg-emerald-50 border-emerald-200" :
                        "bg-white border-slate-200"
                      )}>
                        {meta.icon}
                      </div>
                      {/* Content */}
                      <div className={cn("flex-1 rounded-xl border p-4", isFlagged ? "bg-red-50/50 border-red-200" : "bg-white border-slate-200")}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", meta.bg)}>
                                {entry.action}
                              </span>
                              <span className="text-[10px] text-slate-400">v{entry.version}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">{entry.performedBy}</p>
                          </div>
                          <p className="text-[10px] text-slate-400">{entry.date}</p>
                        </div>
                        <p className="text-[12px] text-slate-700 mb-3">{entry.notes}</p>
                        <div className="flex items-center gap-4 text-[11px]">
                          <span className="text-slate-500">Budget: <span className="font-medium text-slate-700">{fmt(entry.totalBudget)}</span></span>
                          <span className="text-slate-500">Items: <span className="font-medium text-slate-700">{entry.itemCount}</span></span>
                          {entry.snapshot && (
                            <span className="text-slate-500">
                              <span className="text-emerald-600">{entry.snapshot.approved} approved</span>
                              {entry.snapshot.rejected > 0 && <>, <span className="text-red-500">{entry.snapshot.rejected} rejected</span></>}
                              {entry.snapshot.amended > 0 && <>, <span className="text-amber-600">{entry.snapshot.amended} amended</span></>}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── Items table ──────────────────────────────────────────────────────────── */

  const renderItemsTable = (items: ProcurementItem[], filterable = false, planId?: string) => {
    const displayed = filterable && search
      ? items.filter(i => i.description.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
      : items;
    const isCurrentYearPlan = planId === `PROC-${currentYear}`;
    return (
      <table className="w-full">
        <thead style={{ backgroundColor: "#0B01D0" }}>
          <tr style={{ backgroundColor: "#0B01D0" }}>
            <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">#</th>
            <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Item Description</th>
            <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Category</th>
            <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Qty</th>
            <th className="text-right px-5 py-2.5 text-white text-[11px] font-semibold">Est. Cost</th>
            <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Target Date</th>
            <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Status</th>
            <th className="text-center px-5 py-2.5 text-white text-[11px] font-semibold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.length === 0 ? (
            <tr><td colSpan={8} className="text-center py-10 text-[12px] text-slate-400">No items found</td></tr>
          ) : (
            displayed.map((item, idx) => {
              const cc = categoryMeta[item.category];
              const sc = statusMeta[item.status];
              return (
                <tr key={item.id} className={cn("border-b border-slate-100 hover:bg-slate-50/80 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-slate-50/40")}>
                  <td className="px-5 py-2.5 text-[11px] text-slate-400">{idx + 1}</td>
                  <td className="px-5 py-2.5 text-[12px] text-slate-900 font-medium max-w-[260px]">{item.description}</td>
                  <td className="px-5 py-2.5">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", cc.bg)}>{cc.icon} {item.category}</span>
                  </td>
                  <td className="px-5 py-2.5 text-[12px] text-slate-600">{item.quantity} {item.unit}</td>
                  <td className="px-5 py-2.5 text-[12px] text-slate-900 text-right font-medium">{fmt(item.estimatedCost)}</td>
                  <td className="px-5 py-2.5 text-[12px] text-slate-500">{item.targetDate}</td>
                  <td className="px-5 py-2.5">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", sc.bg)}>{sc.icon} {item.status}</span>
                  </td>
                  <td className="px-5 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewItem({ item, planId: planId || "" })} className="p-1 hover:bg-slate-100 rounded" title="View Details"><Eye size={14} className="text-slate-400" /></button>
                      {isCurrentYearPlan && item.status === "Not Started" && item.approvalStatus === "Approved" && (
                        <button onClick={() => planId && openPRForm(planId, item.id)} className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[11px] font-medium hover:bg-emerald-700 transition-colors">
                          <Play size={12} /> Initiate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        {displayed.length > 0 && (
          <tfoot>
            <tr className="bg-slate-100 border-t-2 border-slate-200">
              <td colSpan={4} className="px-5 py-2.5 text-[12px] text-slate-900 font-semibold text-right">Total</td>
              <td className="px-5 py-2.5 text-[12px] text-slate-900 text-right font-semibold">{fmt(displayed.reduce((s, i) => s + i.estimatedCost, 0))}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        )}
      </table>
    );
  };

  /* ── Pending items table ──────────────────────────────────────────────────── */

  const renderPendingTable = (items: ProcurementItem[], planId: string) => {
    if (items.length === 0) return null;
    return (
      <div className="bg-white border-2 border-dashed border-amber-300 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-600" />
            <div>
              <h3 className="text-[13px] font-semibold text-amber-800">Pending Line Manager Approval</h3>
              <p className="text-[10px] text-amber-600">{items.length} item{items.length !== 1 ? "s" : ""} awaiting approval before being added to the plan</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-amber-600 uppercase tracking-wider">Pending Total</p>
            <p className="text-[14px] font-semibold text-amber-800">{fmt(items.reduce((s, i) => s + i.estimatedCost, 0))}</p>
          </div>
        </div>
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr className="bg-amber-100/60">
              <th className="text-left px-5 py-2 text-white text-[11px] font-semibold">#</th>
              <th className="text-left px-5 py-2 text-white text-[11px] font-semibold">Item Description</th>
              <th className="text-left px-5 py-2 text-white text-[11px] font-semibold">Category</th>
              <th className="text-left px-5 py-2 text-white text-[11px] font-semibold">Qty</th>
              <th className="text-right px-5 py-2 text-white text-[11px] font-semibold">Est. Cost</th>
              <th className="text-left px-5 py-2 text-white text-[11px] font-semibold">Target Date</th>
              <th className="text-left px-5 py-2 text-white text-[11px] font-semibold">Added</th>
              <th className="text-center px-5 py-2 text-white text-[11px] font-semibold w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const cc = categoryMeta[item.category];
              return (
                <tr key={item.id} className={cn("border-b border-amber-100 hover:bg-amber-50/40 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-amber-50/20")}>
                  <td className="px-5 py-2.5 text-[11px] text-slate-400">{idx + 1}</td>
                  <td className="px-5 py-2.5 text-[12px] text-slate-900 font-medium">{item.description}</td>
                  <td className="px-5 py-2.5">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", cc.bg)}>{cc.icon} {item.category}</span>
                  </td>
                  <td className="px-5 py-2.5 text-[12px] text-slate-600">{item.quantity} {item.unit}</td>
                  <td className="px-5 py-2.5 text-[12px] text-slate-900 text-right font-medium">{fmt(item.estimatedCost)}</td>
                  <td className="px-5 py-2.5 text-[12px] text-slate-500">{item.targetDate}</td>
                  <td className="px-5 py-2.5 text-[11px] text-slate-400">{item.addedDate ?? "—"}</td>
                  <td className="px-5 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewItem({ item, planId })} className="p-1 hover:bg-slate-100 rounded" title="View"><Eye size={13} className="text-slate-400" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  /* ═══ CREATE PLAN SCREEN ═══════════════════════════════════════════════════ */

  if (creating) {
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={handleCancelCreation} className="p-1.5 hover:bg-slate-100 rounded-lg">
              <ArrowLeft size={18} className="text-slate-500" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-slate-900">Create {currentYear} Procurement Plan</h1>
              <p className="text-[11px] text-slate-500">Add procurement items one by one, then submit for approval</p>
            </div>
            <div className="flex items-center gap-3 mr-2">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Budget</p>
                <p className="text-[16px] font-semibold text-slate-900">{fmt(newTotal)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Items</p>
                <p className="text-[16px] font-semibold text-slate-900">{newItems.length}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[12px] text-slate-500">Department:</label>
            <select value={newDepartment} onChange={e => setNewDepartment(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white outline-none">
              {["Operations", "Finance", "Administration", "Programs", "IT", "Human Resources"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {newItems.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5">
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr style={{ backgroundColor: "#0B01D0" }}>
                    <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">#</th>
                    <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Item Description</th>
                    <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Category</th>
                    <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Qty</th>
                    <th className="text-right px-5 py-2.5 text-white text-[11px] font-semibold">Est. Cost</th>
                    <th className="text-left px-5 py-2.5 text-white text-[11px] font-semibold">Target Date</th>
                    <th className="text-center px-5 py-2.5 text-white text-[11px] font-semibold w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newItems.map((item, idx) => {
                    const cc = categoryMeta[item.category];
                    return (
                      <tr key={idx} className={cn("border-b border-slate-100", idx % 2 === 0 ? "bg-white" : "bg-slate-50/40")}>
                        <td className="px-5 py-2.5 text-[11px] text-slate-400">{idx + 1}</td>
                        <td className="px-5 py-2.5 text-[12px] text-slate-900 font-medium">{item.description}</td>
                        <td className="px-5 py-2.5">
                          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", cc.bg)}>{cc.icon} {item.category}</span>
                        </td>
                        <td className="px-5 py-2.5 text-[12px] text-slate-600">{item.quantity} {item.unit}</td>
                        <td className="px-5 py-2.5 text-[12px] text-slate-900 text-right font-medium">{fmt(item.estimatedCost)}</td>
                        <td className="px-5 py-2.5 text-[12px] text-slate-500">{item.targetDate}</td>
                        <td className="px-5 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleEditExistingItem(idx)} className="p-1 hover:bg-slate-100 rounded" title="Edit"><Eye size={13} className="text-slate-400" /></button>
                            <button onClick={() => handleRemoveItem(idx)} className="p-1 hover:bg-red-50 rounded" title="Remove"><Trash2 size={13} className="text-red-400" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 border-t-2 border-slate-200">
                    <td colSpan={4} className="px-5 py-2.5 text-[12px] text-slate-900 font-semibold text-right">Total</td>
                    <td className="px-5 py-2.5 text-[12px] text-slate-900 text-right font-semibold">{fmt(newTotal)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {showAddForm ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-slate-900">{editingIndex !== null ? "Edit" : "Add"} Procurement Item</h3>
                <button onClick={() => { setShowAddForm(false); setEditingItem(blankItem()); setEditingIndex(null); setFormErrors({}); }} className="p-1 hover:bg-slate-100 rounded"><X size={16} className="text-slate-400" /></button>
              </div>
              {renderItemFormFields(editingItem, setEditingItem, formErrors)}
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => { setShowAddForm(false); setEditingItem(blankItem()); setEditingIndex(null); setFormErrors({}); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={handleAddItem} className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0900a5]">
                  <Check size={14} /> {editingIndex !== null ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => { setShowAddForm(true); setFormErrors({}); }} className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-[12px] text-slate-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/30 transition-all w-full max-w-2xl justify-center">
              <Plus size={16} /> Add Procurement Item
            </button>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">{newItems.length} item{newItems.length !== 1 ? "s" : ""} · {fmt(newTotal)}</p>
          <div className="flex items-center gap-2">
            <button onClick={handleCancelCreation} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmitPlan} disabled={newItems.length === 0} className={cn("flex items-center gap-1.5 px-5 py-2 rounded-lg text-[12px] font-medium transition-colors", newItems.length > 0 ? "bg-[#0B01D0] text-white hover:bg-[#0900a5]" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
              <Send size={13} /> Submit for Approval
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ MAIN VIEW ════════════════════════════════════════════════════════════ */

  const currentPlanItemCount = currentPlan ? currentPlan.items.length : 0;
  const previousPlansTotalItems = previousPlans.reduce((s, p) => s + p.items.length, 0);

  // ── Full-screen item detail view ──
  if (viewItem) {
    const viPlan = plans.find(p => p.id === viewItem.planId);
    return (
      <div className="h-full flex flex-col bg-white overflow-hidden">
        <ProcurementItemDetailView
          item={viewItem.item}
          planId={viewItem.planId}
          planYear={viPlan?.year ?? currentYear}
          planDepartment={viPlan?.department ?? "Operations"}
          planCreatedBy={viPlan?.createdBy ?? "—"}
          onBack={() => setViewItem(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Procurement Plan</h1>
          <p className="text-[12px] text-slate-500">Annual departmental procurement plans</p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0900a5] transition-colors">
          <Plus size={14} /> Create Procurement Plan
        </button>
      </div>

      {/* Toolbar — search bar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
          />
          {search && <button onClick={() => setSearch("")}><X size={13} className="text-slate-400 hover:text-slate-600" /></button>}
        </div>
      </div>

      {/* Tabs — Document Vault style */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
              activeTab === "current"
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Current Plan
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === "current" ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>
              {currentPlanItemCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] flex items-center justify-center gap-1.5 ${
              activeTab === "previous"
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Previous Plans
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === "previous" ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>
              {previousPlans.length}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* ═══ CURRENT PLAN TAB ═══ */}
        {activeTab === "current" && (
          <>
            {currentPlan ? (
              <div className="p-6 space-y-5">
                {/* ── Current Year Plan — Approved Items ───────────────────────── */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0B01D0]/10 flex items-center justify-center">
                        <Calendar size={18} className="text-[#0B01D0]" />
                      </div>
                      <div>
                        <h2 className="text-[14px] font-semibold text-slate-900">{currentPlan.year} Procurement Plan</h2>
                        <p className="text-[11px] text-slate-400">{currentPlan.department} · Created by {currentPlan.createdBy} on {currentPlan.createdDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border font-medium", planStatusMeta[currentPlan.planStatus])}>
                        {currentPlan.planStatus}
                      </span>
                      <div className="text-right">
                        <p className="text-[15px] font-semibold text-slate-900">{fmt(currentPlan.totalBudget)}</p>
                      </div>
                      <button onClick={() => setShowVersionHistory(currentPlan.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-600 hover:bg-slate-50 transition-colors" title="Version History">
                        <History size={13} /> History
                      </button>
                      <button onClick={() => { setAddingToExistingPlan(true); setExistingPlanEditItem(blankItem()); setExistingPlanFormErrors({}); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0900a5] transition-colors">
                        <Plus size={13} /> Add Item
                      </button>
                    </div>
                  </div>
                  {renderItemsTable(approvedItems, true, currentPlan.id)}
                </div>

                {/* ── Pending Verification Section ────────────────────────────── */}
                {renderPendingTable(pendingItems, currentPlan.id)}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Package size={28} className="text-slate-300" />
                  </div>
                  <h2 className="text-[16px] font-semibold text-slate-900 mb-2">No {currentYear} Procurement Plan</h2>
                  <p className="text-[12px] text-slate-500 mb-5">Create your department's annual procurement plan to outline all expected purchases for the year.</p>
                  <button onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0900a5] transition-colors">
                    <Plus size={14} /> Create {currentYear} Plan
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══ PREVIOUS PLANS TAB ═══ */}
        {activeTab === "previous" && (
          <>
            {previousPlans.length > 0 ? (
              <div className="p-6 space-y-3">
                {previousPlans.map(plan => {
                  const isExpanded = expandedPrevious.has(plan.id);
                  const completedCount = plan.items.filter(i => i.status === "Completed").length;
                  const matchingItems = search
                    ? plan.items.filter(i => i.description.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
                    : plan.items;
                  if (search && matchingItems.length === 0) return null;
                  return (
                    <div key={plan.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="flex items-center">
                        <button onClick={() => togglePrevious(plan.id)} className="flex-1 px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                            <div className="text-left">
                              <h4 className="text-[13px] font-semibold text-slate-900">FY {plan.year} Procurement Plan</h4>
                              <p className="text-[11px] text-slate-400">{plan.department} · {plan.items.length} items · {completedCount}/{plan.items.length} completed</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border font-medium", planStatusMeta[plan.planStatus])}>
                              {plan.planStatus}
                            </span>
                            <p className="text-[13px] font-semibold text-slate-700">{fmt(plan.totalBudget)}</p>
                          </div>
                        </button>
                        <button onClick={() => setShowVersionHistory(plan.id)} className="px-3 py-1.5 mr-4 border border-slate-200 rounded-lg text-[10px] text-slate-500 hover:bg-slate-50 flex items-center gap-1" title="Version History">
                          <History size={12} /> History
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-slate-200">
                          {renderItemsTable(plan.items, true, plan.id)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <History size={28} className="text-slate-300" />
                  </div>
                  <h2 className="text-[16px] font-semibold text-slate-900 mb-2">No Previous Plans</h2>
                  <p className="text-[12px] text-slate-500">No procurement plans from previous fiscal years are available.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {renderVersionHistoryModal()}

      {/* ── Add Item to Existing Plan Modal ───────────────────────────────── */}
      {addingToExistingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setAddingToExistingPlan(false); setExistingPlanFormErrors({}); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900">Add Procurement Item</h2>
                <p className="text-[11px] text-amber-600">This item will require Finance verification before being added to the approved plan</p>
              </div>
              <button onClick={() => { setAddingToExistingPlan(false); setExistingPlanFormErrors({}); }} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
            </div>
            <div className="p-6">
              {renderItemFormFields(existingPlanEditItem, setExistingPlanEditItem, existingPlanFormErrors)}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-700">New items added to an approved plan are placed in a <span className="font-medium">"Pending Verification"</span> queue. Finance will review and either approve or reject the addition.</p>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button onClick={() => { setAddingToExistingPlan(false); setExistingPlanFormErrors({}); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={handleAddToExistingPlan} className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0900a5]"><Check size={14} /> Submit for Verification</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Purchase Requisition Modal ────────────────────��─────────── */}
      {prFormOpen && (() => {
        const plan = plans.find(p => p.id === prFormOpen.planId);
        const item = plan?.items.find(i => i.id === prFormOpen.itemId);
        if (!plan || !item) return null;
        const budgetCode = `BUD-${plan.year}-${item.category.substring(0, 3).toUpperCase()}-${item.id.replace("PI-", "")}`;
        const isGoods = item.category === "Goods" || item.category === "Works";
        const isServiceOrConsultancy = item.category === "Services" || item.category === "Consultancy";
        const isDirectSelection = prFormData.sourcingMethod === "Direct Selection";
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setPrFormOpen(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[92vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
                <div>
                  <h3 className="text-[16px] font-semibold text-slate-900">Create Purchase Requisition</h3>
                  <p className="text-[12px] text-slate-400 mt-0.5">Initiating from {plan.year} Procurement Plan</p>
                </div>
                <button onClick={() => setPrFormOpen(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                {/* ── Section 1: The Golden Thread (Locked) ─────────────────────── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-[#0B01D0] rounded-full" />
                    <p className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">Linked Plan Details</p>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium uppercase">Auto-filled · Read Only</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Linked Plan Item</label>
                        <p className="text-[13px] text-slate-900 mt-0.5">{item.description}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Procurement Category</label>
                        <p className="text-[13px] text-slate-900 mt-0.5 flex items-center gap-1.5">
                          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium", categoryMeta[item.category].bg)}>
                            {categoryMeta[item.category].icon} {item.category}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Requesting Department</label>
                        <p className="text-[13px] text-slate-900 mt-0.5">{plan.department}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Estimated Cost</label>
                        <p className="text-[13px] text-slate-900 font-medium mt-0.5">{fmt(item.estimatedCost)}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Funding Source</label>
                        <p className="text-[13px] text-slate-900 mt-0.5">{prFormData.fundingSource}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Budget Code</label>
                        <p className="text-[13px] text-slate-900 font-mono mt-0.5">{budgetCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Requisition Details (Dynamic) ──────────────────── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-purple-600 rounded-full" />
                    <p className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">Requisition Details</p>
                  </div>
                  <div className="space-y-4">
                    {/* Detailed Description — always shown */}
                    <div>
                      <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">
                        Detailed Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={prFormData.detailedDescription}
                        onChange={e => updatePrField("detailedDescription", e.target.value)}
                        rows={3}
                        className={cn(
                          "w-full border rounded-lg px-3 py-2.5 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors resize-none",
                          prFormErrors.detailedDescription ? "border-red-300 bg-red-50/50" : "border-slate-200 focus:border-[#0B01D0]"
                        )}
                        placeholder={isGoods
                          ? "e.g., Need 10 units of i7, 16GB RAM for new hires in Q1. Must include 3-year warranty."
                          : "e.g., Scope of engagement includes full financial statement audit for FY2026..."
                        }
                      />
                      {prFormErrors.detailedDescription && (
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {prFormErrors.detailedDescription}</p>
                      )}
                    </div>

                    {/* Goods / Works specific */}
                    {isGoods && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">
                            Desired Delivery Date <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={prFormData.desiredDeliveryDate}
                              onChange={e => updatePrField("desiredDeliveryDate", e.target.value)}
                              className={cn(
                                "w-full border rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors",
                                prFormErrors.desiredDeliveryDate ? "border-red-300 bg-red-50/50" : "border-slate-200 focus:border-[#0B01D0]"
                              )}
                            />
                          </div>
                          {prFormErrors.desiredDeliveryDate && (
                            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {prFormErrors.desiredDeliveryDate}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">
                            Delivery Location
                          </label>
                          <select
                            value={prFormData.deliveryLocation}
                            onChange={e => updatePrField("deliveryLocation", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none focus:border-[#0B01D0] bg-white"
                          >
                            {DELIVERY_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Services / Consultancy specific */}
                    {isServiceOrConsultancy && (
                      <>
                        {item.category === "Consultancy" && (
                          <div>
                            <label className="text-[12px] font-medium text-slate-700 mb-2 block">Consultancy Type</label>
                            <div className="flex items-center gap-4">
                              {(["Firm", "Individual"] as const).map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                  <div className={cn(
                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                                    prFormData.consultancyType === type ? "border-[#0B01D0]" : "border-slate-300 group-hover:border-slate-400"
                                  )}>
                                    {prFormData.consultancyType === type && <div className="w-2 h-2 rounded-full bg-[#0B01D0]" />}
                                  </div>
                                  <span className="text-[12px] text-slate-700">{type}</span>
                                  <span className="text-[10px] text-slate-400">
                                    {type === "Firm" ? "(Company / Organization)" : "(Independent Consultant)"}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">
                              Estimated Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={prFormData.estimatedStartDate}
                              onChange={e => updatePrField("estimatedStartDate", e.target.value)}
                              className={cn(
                                "w-full border rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors",
                                prFormErrors.estimatedStartDate ? "border-red-300 bg-red-50/50" : "border-slate-200 focus:border-[#0B01D0]"
                              )}
                            />
                            {prFormErrors.estimatedStartDate && (
                              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {prFormErrors.estimatedStartDate}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">
                              Estimated End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={prFormData.estimatedEndDate}
                              onChange={e => updatePrField("estimatedEndDate", e.target.value)}
                              className={cn(
                                "w-full border rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none transition-colors",
                                prFormErrors.estimatedEndDate ? "border-red-300 bg-red-50/50" : "border-slate-200 focus:border-[#0B01D0]"
                              )}
                            />
                            {prFormErrors.estimatedEndDate && (
                              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {prFormErrors.estimatedEndDate}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Section 3: Sourcing Preference ────────────────────────────── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-teal-500 rounded-full" />
                    <p className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">Sourcing Preference</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">Proposed Sourcing Method</label>
                      <select
                        value={prFormData.sourcingMethod}
                        onChange={e => updatePrField("sourcingMethod", e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none focus:border-[#0B01D0] bg-white"
                      >
                        <option value="Standard Competitive">Standard Competitive Bidding</option>
                        <option value="Direct Selection">Direct Selection (Sole Source)</option>
                      </select>
                    </div>

                    {isDirectSelection && (
                      <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4 space-y-4">
                        <div className="flex items-start gap-2 mb-1">
                          <AlertCircle size={13} className="text-amber-600 mt-0.5 shrink-0" />
                          <p className="text-[11px] text-amber-700">Direct Selection requires additional justification and vendor details. This will be subject to enhanced review during the approval process.</p>
                        </div>
                        <div>
                          <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">
                            Direct Selection Justification <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={prFormData.directSelectionJustification}
                            onChange={e => updatePrField("directSelectionJustification", e.target.value)}
                            rows={3}
                            className={cn(
                              "w-full border rounded-lg px-3 py-2.5 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors resize-none",
                              prFormErrors.directSelectionJustification ? "border-red-300 bg-red-50/50" : "border-slate-200 focus:border-[#0B01D0]"
                            )}
                            placeholder="Why are we requesting procurement from only this vendor? (e.g., sole distributor, proprietary technology, continuation of existing engagement...)"
                          />
                          {prFormErrors.directSelectionJustification && (
                            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {prFormErrors.directSelectionJustification}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[12px] font-medium text-slate-700 mb-2 block">Vendor Source</label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => { setVendorSearchOpen(!vendorSearchOpen); setVendorSearchQuery(""); }}
                              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-[11px] text-[#0B01D0] hover:bg-slate-50 transition-colors font-medium mb-1"
                            >
                              <Search size={12} /> Search Vendor Database
                            </button>
                            {vendorSearchOpen && (
                              <div className="absolute z-50 left-0 top-full mt-0 w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-xl">
                                <div className="p-2 border-b border-slate-100">
                                  <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md">
                                    <Search size={12} className="text-slate-400 shrink-0" />
                                    <input
                                      autoFocus
                                      value={vendorSearchQuery}
                                      onChange={e => setVendorSearchQuery(e.target.value)}
                                      placeholder="Search by name, category, or contact..."
                                      className="flex-1 bg-transparent text-[11px] text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                    <button type="button" onClick={() => setVendorSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                                      <X size={12} />
                                    </button>
                                  </div>
                                </div>
                                <div className="max-h-52 overflow-y-auto">
                                  {VENDOR_DATABASE
                                    .filter(v => v.status === "Active")
                                    .filter(v => {
                                      if (!vendorSearchQuery.trim()) return true;
                                      const q = vendorSearchQuery.toLowerCase();
                                      return v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q) || v.contactPerson.toLowerCase().includes(q);
                                    })
                                    .map(v => (
                                      <button
                                        key={v.id}
                                        type="button"
                                        className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0"
                                        onClick={() => {
                                          updatePrField("vendorLegalName", v.name);
                                          updatePrField("vendorAddress", v.address);
                                          updatePrField("vendorContact", `${v.phone} · ${v.email}`);
                                          setVendorSearchOpen(false);
                                          setVendorSearchQuery("");
                                        }}
                                      >
                                        <div className="flex items-center justify-between">
                                          <p className="text-[11px] font-medium text-slate-900">{v.name}</p>
                                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">{v.category}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{v.contactPerson} · {v.phone}</p>
                                      </button>
                                    ))
                                  }
                                  {VENDOR_DATABASE.filter(v => v.status === "Active").filter(v => {
                                    if (!vendorSearchQuery.trim()) return true;
                                    const q = vendorSearchQuery.toLowerCase();
                                    return v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q) || v.contactPerson.toLowerCase().includes(q);
                                  }).length === 0 && (
                                    <p className="text-[11px] text-slate-400 text-center py-4">No vendors found matching "{vendorSearchQuery}"</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mb-3 mt-2">Or enter new vendor details manually:</p>
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="text-[11px] text-slate-500 mb-1 block">Full Legal Name</label>
                              <input
                                value={prFormData.vendorLegalName}
                                onChange={e => updatePrField("vendorLegalName", e.target.value)}
                                placeholder="e.g., TechServe Ghana Ltd"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none focus:border-[#0B01D0] placeholder:text-slate-400"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] text-slate-500 mb-1 block">Registered Address</label>
                                <input
                                  value={prFormData.vendorAddress}
                                  onChange={e => updatePrField("vendorAddress", e.target.value)}
                                  placeholder="e.g., 14 Independence Ave, Accra"
                                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none focus:border-[#0B01D0] placeholder:text-slate-400"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] text-slate-500 mb-1 block">Contact Information</label>
                                <input
                                  value={prFormData.vendorContact}
                                  onChange={e => updatePrField("vendorContact", e.target.value)}
                                  placeholder="e.g., +233 30 222 1234"
                                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 outline-none focus:border-[#0B01D0] placeholder:text-slate-400"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Section 4: Supporting Documentation ───────────────────────── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-orange-500 rounded-full" />
                    <p className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">Supporting Documentation</p>
                  </div>
                  <div className="space-y-4">
                    {/* Specs / ToR — Required */}
                    <div>
                      <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">
                        Upload Specs / Terms of Reference <span className="text-red-500">*</span>
                      </label>
                      <div className={cn(
                        "border border-dashed rounded-lg p-4",
                        prFormErrors.specsAttachment ? "border-red-300 bg-red-50/30" : "border-slate-300 bg-slate-50/50"
                      )}>
                        {prSpecsAttachments.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {prSpecsAttachments.map((file, i) => (
                              <div key={`spec-${i}`} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <Paperclip size={12} className="text-[#0B01D0]" />
                                  <span className="text-[12px] text-slate-700">{file}</span>
                                </div>
                                <button onClick={() => { setPrSpecsAttachments(prev => prev.filter((_, idx) => idx !== i)); if (prSpecsAttachments.length <= 1) setPrFormErrors(prev => ({ ...prev, specsAttachment: "At least one Specs / Terms of Reference document is required" })); }} className="p-0.5 hover:bg-slate-100 rounded">
                                  <X size={12} className="text-slate-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={handleUploadSpecsFile}
                          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-[11px] text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Upload size={12} /> Upload Specs / ToR
                        </button>
                      </div>
                      {prFormErrors.specsAttachment && (
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {prFormErrors.specsAttachment}</p>
                      )}
                    </div>

                    {/* Supporting Docs — Optional */}
                    <div>
                      <label className="text-[12px] font-medium text-slate-700 mb-1.5 block">
                        Supporting Documents <span className="text-[10px] text-slate-400 font-normal">(Optional — e.g., email approvals, vendor quotes)</span>
                      </label>
                      <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/50">
                        {prSupportingDocs.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {prSupportingDocs.map((file, i) => (
                              <div key={`sup-${i}`} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <Paperclip size={12} className="text-slate-400" />
                                  <span className="text-[12px] text-slate-700">{file}</span>
                                </div>
                                <button onClick={() => setPrSupportingDocs(prev => prev.filter((_, idx) => idx !== i))} className="p-0.5 hover:bg-slate-100 rounded">
                                  <X size={12} className="text-slate-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={handleUploadSupportingDoc}
                          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-[11px] text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Upload size={12} /> Upload Supporting Document
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl shrink-0">
                <p className="text-[10px] text-slate-400">PR will be routed to Department Head for Level 1 approval</p>
                <div className="flex items-center gap-2">
                  <button onClick={handlePRSaveAsDraft} className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-white transition-colors">
                    <Save size={13} /> Save as Draft
                  </button>
                  <button onClick={handlePRFormSubmit} className="flex items-center gap-1.5 px-5 py-2 bg-[#0B01D0] text-white rounded-lg text-[12px] font-medium hover:bg-[#0900a5] transition-colors">
                    <Send size={13} /> Submit Requisition
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default ESSProcurementPlan;
