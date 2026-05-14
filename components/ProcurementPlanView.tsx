import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, Plus, X, Edit2, CheckCircle, Clock, AlertCircle, FileText, History } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  getProcurementPlanItems,
  addProcurementPlanItem,
  updateProcurementPlanItem,
  approvePlanItem,
  subscribe,
  type ProcurementPlanItem,
  type PlanItemChange,
} from "../lib/procurementStore";

// ─── Budget-aligned procurement data (same source as BudgetTreeTable) ──────

interface ProcurementLineItem {
  budgetLineId: string;
  name: string;
  planned: number;
  actual: number;
  procurementMethod: string;
  category: string;
  vendor: string | null;
  status: string;
  expectedDelivery: string;
}

interface ProcurementTask {
  taskId: string;
  taskName: string;
  lineItems: ProcurementLineItem[];
}

interface ProcurementPhase {
  phaseId: string;
  phaseName: string;
  tasks: ProcurementTask[];
}

const PROCUREMENT_DATA: ProcurementPhase[] = [
  {
    phaseId: "P1",
    phaseName: "Stage 1: Procurement & Contracting (Optional)",
    tasks: [
      {
        taskId: "T001",
        taskName: "Draft Request for Proposals (RFP)",
        lineItems: [
          { budgetLineId: "L001", name: "Consultant Fees - Survey Design", planned: 8000, actual: 8000, procurementMethod: "Single Source", category: "Consulting", vendor: "Dr. Kwesi Appiah", status: "Completed", expectedDelivery: "2025-02-28" },
          { budgetLineId: "L002", name: "Printing & Materials", planned: 1200, actual: 1050, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: "PrintWorks Ghana Ltd", status: "Completed", expectedDelivery: "2025-01-30" },
          { budgetLineId: "L003", name: "Stakeholder Workshop", planned: 3500, actual: 3500, procurementMethod: "Request for Quotation", category: "Services", vendor: "La Palm Royal Beach Hotel", status: "Completed", expectedDelivery: "2025-02-15" },
        ],
      },
      {
        taskId: "T002",
        taskName: "Evaluate Vendor Submissions",
        lineItems: [
          { budgetLineId: "L004", name: "External Reviewer Honoraria", planned: 4000, actual: 4000, procurementMethod: "Single Source", category: "Consulting", vendor: "Prof. Ama Benyiwa", status: "Completed", expectedDelivery: "2025-03-15" },
          { budgetLineId: "L005", name: "Review Meeting Logistics", planned: 1500, actual: 1200, procurementMethod: "Direct Purchase", category: "Services", vendor: "Accra Events Hub", status: "Completed", expectedDelivery: "2025-03-10" },
        ],
      },
      {
        taskId: "T003",
        taskName: "Finalize Service Agreements",
        lineItems: [
          { budgetLineId: "L006", name: "Research Assistant Stipends", planned: 6000, actual: 6000, procurementMethod: "Direct Purchase", category: "Services", vendor: "University of Ghana", status: "Completed", expectedDelivery: "2025-04-01" },
          { budgetLineId: "L007", name: "Database Subscriptions", planned: 2000, actual: 1800, procurementMethod: "Framework Agreement", category: "Services", vendor: "JSTOR / Elsevier", status: "Completed", expectedDelivery: "2025-01-15" },
          { budgetLineId: "L008", name: "Reference Materials", planned: 800, actual: 650, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: "Bookshop Ghana Ltd", status: "Completed", expectedDelivery: "2025-02-10" },
        ],
      },
    ],
  },
  {
    phaseId: "P2",
    phaseName: "Stage 2: Implementation (Mandatory)",
    tasks: [
      {
        taskId: "T004",
        taskName: "Coordinate Field Data Collection",
        lineItems: [
          { budgetLineId: "L009", name: "Venue & Catering", planned: 5000, actual: 4800, procurementMethod: "Request for Quotation", category: "Services", vendor: "Kempinski Hotel Gold Coast", status: "Completed", expectedDelivery: "2025-05-01" },
          { budgetLineId: "L010", name: "Audio-Visual Equipment Rental", planned: 2000, actual: 1950, procurementMethod: "Direct Purchase", category: "Services", vendor: "AV Solutions Accra", status: "Completed", expectedDelivery: "2025-05-01" },
          { budgetLineId: "L011", name: "Facilitator Fees", planned: 3000, actual: 3000, procurementMethod: "Single Source", category: "Consulting", vendor: "Nana Yaw Mensah", status: "Completed", expectedDelivery: "2025-05-01" },
        ],
      },
      {
        taskId: "T005",
        taskName: "Conduct Stakeholder Engagement Sessions",
        lineItems: [
          { budgetLineId: "L012", name: "Consultant Fees - Engagement", planned: 7000, actual: 5600, procurementMethod: "Competitive Bidding", category: "Consulting", vendor: "Ghana Research Associates", status: "PO Issued", expectedDelivery: "2025-07-15" },
          { budgetLineId: "L013", name: "Community Outreach Materials", planned: 3000, actual: 2100, procurementMethod: "Request for Quotation", category: "Goods/Equipment", vendor: "CreativeEdge Designs", status: "Delivered", expectedDelivery: "2025-06-30" },
          { budgetLineId: "L014", name: "Travel - Stakeholder Visits", planned: 4500, actual: 3200, procurementMethod: "Direct Purchase", category: "Services", vendor: null, status: "Requisition Raised", expectedDelivery: "2025-08-01" },
        ],
      },
      {
        taskId: "T009",
        taskName: "Procure IT Equipment",
        lineItems: [
          { budgetLineId: "L015", name: "Laptops (50x Dell Latitude)", planned: 47500, actual: 47500, procurementMethod: "Competitive Bidding", category: "Goods/Equipment", vendor: "Dell Inc. (via Telefonika Ghana)", status: "Delivered", expectedDelivery: "2025-06-15" },
          { budgetLineId: "L016", name: "Networking Equipment", planned: 3500, actual: 0, procurementMethod: "Request for Quotation", category: "Goods/Equipment", vendor: null, status: "RFQ Issued", expectedDelivery: "2025-09-01" },
          { budgetLineId: "L017", name: "Software Licences", planned: 8000, actual: 0, procurementMethod: "Framework Agreement", category: "Services", vendor: null, status: "Evaluation", expectedDelivery: "2025-09-15" },
        ],
      },
    ],
  },
  {
    phaseId: "P3",
    phaseName: "Stage 3: Quality Assurance (Mandatory)",
    tasks: [
      {
        taskId: "T006",
        taskName: "Conduct Internal Peer Review of Draft",
        lineItems: [
          { budgetLineId: "L018", name: "QA Reviewer Wages", planned: 12000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-01-15" },
          { budgetLineId: "L019", name: "Testing Tools & Subscriptions", planned: 5000, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-01-15" },
        ],
      },
    ],
  },
  {
    phaseId: "P4",
    phaseName: "Stage 4: Production & Editorial (Mandatory)",
    tasks: [
      {
        taskId: "T007",
        taskName: "Design and Layout Report",
        lineItems: [
          { budgetLineId: "L020", name: "Graphic Design Services", planned: 6000, actual: 0, procurementMethod: "Single Source", category: "Consulting", vendor: null, status: "Not Started", expectedDelivery: "2026-03-01" },
          { budgetLineId: "L021", name: "Editorial Review Services", planned: 4000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-04-01" },
        ],
      },
    ],
  },
  {
    phaseId: "P5",
    phaseName: "Stage 5: Dissemination (Optional)",
    tasks: [
      {
        taskId: "T010",
        taskName: "Plan Distribution Channels",
        lineItems: [
          { budgetLineId: "L022", name: "Distribution Platform Fees", planned: 3500, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-05-01" },
        ],
      },
    ],
  },
  {
    phaseId: "P6",
    phaseName: "Stage 6: Reporting (Mandatory)",
    tasks: [
      {
        taskId: "T008",
        taskName: "Submit Final Technical Report",
        lineItems: [
          { budgetLineId: "L023", name: "Report Design & Layout", planned: 3000, actual: 0, procurementMethod: "Request for Quotation", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-07-01" },
          { budgetLineId: "L024", name: "Printing & Distribution", planned: 2000, actual: 0, procurementMethod: "Direct Purchase", category: "Goods/Equipment", vendor: null, status: "Not Started", expectedDelivery: "2026-08-01" },
          { budgetLineId: "L025", name: "Final Audit Fees", planned: 4500, actual: 0, procurementMethod: "Single Source", category: "Consulting", vendor: null, status: "Not Started", expectedDelivery: "2026-08-15" },
        ],
      },
    ],
  },
  {
    phaseId: "P7",
    phaseName: "Delivery Stage Complete (Checkpoint)",
    tasks: [
      {
        taskId: "T015",
        taskName: "Sign-off and Handover",
        lineItems: [
          { budgetLineId: "L026", name: "Final Review & Sign-off Meeting", planned: 1500, actual: 0, procurementMethod: "Direct Purchase", category: "Services", vendor: null, status: "Not Started", expectedDelivery: "2026-09-01" },
        ],
      },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getMethodBadge(method: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "Direct Purchase": { bg: "bg-slate-100", text: "text-slate-700" },
    "Competitive Bidding": { bg: "bg-blue-100", text: "text-blue-700" },
    "Request for Quotation": { bg: "bg-indigo-100", text: "text-indigo-700" },
    "Single Source": { bg: "bg-amber-100", text: "text-amber-700" },
    "Framework Agreement": { bg: "bg-purple-100", text: "text-purple-700" },
  };
  const style = map[method] || { bg: "bg-slate-100", text: "text-slate-600" };
  return (
    <Badge className={`${style.bg} ${style.text} hover:${style.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>
      {method}
    </Badge>
  );
}

interface ProcurementPlanViewProps {
  onBack: () => void;
}

// ─── Category / Status / Approval badge helpers for plan items ──────────────

function getCategoryBadge(cat: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Goods: { bg: "bg-cyan-100", text: "text-cyan-700" },
    Services: { bg: "bg-violet-100", text: "text-violet-700" },
    Works: { bg: "bg-orange-100", text: "text-orange-700" },
    Consultancy: { bg: "bg-rose-100", text: "text-rose-700" },
  };
  const s = map[cat] || { bg: "bg-slate-100", text: "text-slate-600" };
  return <Badge className={`${s.bg} ${s.text} hover:${s.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>{cat}</Badge>;
}

function getStatusBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "Not Started": { bg: "bg-slate-100", text: "text-slate-600" },
    "In Progress": { bg: "bg-blue-100", text: "text-blue-700" },
    "Under Evaluation": { bg: "bg-purple-100", text: "text-purple-700" },
    Awarded: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Contracted: { bg: "bg-green-100", text: "text-green-700" },
    Completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Delayed: { bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[status] || { bg: "bg-slate-100", text: "text-slate-600" };
  return <Badge className={`${s.bg} ${s.text} hover:${s.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>{status}</Badge>;
}

function getApprovalBadge(approval: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Draft: { bg: "bg-slate-100", text: "text-slate-600" },
    "Pending Review": { bg: "bg-amber-100", text: "text-amber-700" },
    Approved: { bg: "bg-emerald-100", text: "text-emerald-700" },
    Rejected: { bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[approval] || { bg: "bg-slate-100", text: "text-slate-600" };
  return <Badge className={`${s.bg} ${s.text} hover:${s.bg} text-[11px] font-medium shadow-none border-0 whitespace-nowrap`}>{approval}</Badge>;
}

// ─── Constants for form selects ─────────────────────────────────────────────

const CATEGORIES = ["Goods", "Services", "Works", "Consultancy"] as const;
const FUNDING_SOURCES = ["TAP", "ATTP", "Gates Foundation", "World Bank", "AfDB", "Government of Ghana", "Internal"] as const;
const PROCUREMENT_METHODS = ["Direct Purchase", "Competitive Bidding", "Request for Quotation", "Single Source", "Framework Agreement"];
const DEPARTMENTS = ["IT", "Programs", "Operations", "Finance", "HR", "Admin", "M&E"];

// ─── Add Plan Item Modal ────────────────────────────────────────────────────

interface AddPlanItemModalProps {
  open: boolean;
  onClose: () => void;
}

function AddPlanItemModal({ open, onClose }: AddPlanItemModalProps) {
  const [form, setForm] = useState({
    activityDescription: "",
    category: "Goods" as ProcurementPlanItem["category"],
    estimatedValue: "",
    fundingSource: "TAP",
    procurementMethod: "RFQ",
    initiationDate: "",
    awardDate: "",
    completionDate: "",
    responsiblePerson: "",
    department: "Programs",
    linkedBudgetLine: "",
    linkedWorkPlan: "",
  });

  const handleSubmit = () => {
    if (!form.activityDescription || !form.estimatedValue || !form.responsiblePerson || !form.initiationDate || !form.awardDate || !form.completionDate) return;
    addProcurementPlanItem({
      activityDescription: form.activityDescription,
      category: form.category,
      estimatedValue: parseFloat(form.estimatedValue),
      fundingSource: form.fundingSource,
      procurementMethod: form.procurementMethod,
      initiationDate: form.initiationDate,
      awardDate: form.awardDate,
      completionDate: form.completionDate,
      responsiblePerson: form.responsiblePerson,
      department: form.department,
      status: "Not Started",
      approvalStatus: "Draft",
      linkedBudgetLine: form.linkedBudgetLine || undefined,
      linkedWorkPlan: form.linkedWorkPlan || undefined,
    });
    onClose();
    setForm({
      activityDescription: "", category: "Goods", estimatedValue: "", fundingSource: "TAP",
      procurementMethod: "RFQ", initiationDate: "", awardDate: "", completionDate: "",
      responsiblePerson: "", department: "Programs", linkedBudgetLine: "", linkedWorkPlan: "",
    });
  };

  if (!open) return null;

  const labelCls = "text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1";
  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/30 focus:border-[#0B01D0]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-900">Add Plan Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        {/* Form body */}
        <div className="px-6 py-5 space-y-4">
          {/* Activity Description */}
          <div>
            <label className={labelCls}>Activity Description</label>
            <input className={inputCls} value={form.activityDescription} onChange={e => setForm(f => ({ ...f, activityDescription: e.target.value }))} placeholder="Describe the procurement activity..." />
          </div>

          {/* Row: Category + Est. Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ProcurementPlanItem["category"] }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Estimated Value (USD)</label>
              <input type="number" className={inputCls} value={form.estimatedValue} onChange={e => setForm(f => ({ ...f, estimatedValue: e.target.value }))} placeholder="0" />
            </div>
          </div>

          {/* Row: Funding Source + Method */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Funding Source</label>
              <select className={inputCls} value={form.fundingSource} onChange={e => setForm(f => ({ ...f, fundingSource: e.target.value }))}>
                {FUNDING_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Procurement Method</label>
              <select className={inputCls} value={form.procurementMethod} onChange={e => setForm(f => ({ ...f, procurementMethod: e.target.value }))}>
                {PROCUREMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Row: 3 date inputs */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Initiation Date</label>
              <input type="date" className={inputCls} value={form.initiationDate} onChange={e => setForm(f => ({ ...f, initiationDate: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Award Date</label>
              <input type="date" className={inputCls} value={form.awardDate} onChange={e => setForm(f => ({ ...f, awardDate: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Completion Date</label>
              <input type="date" className={inputCls} value={form.completionDate} onChange={e => setForm(f => ({ ...f, completionDate: e.target.value }))} />
            </div>
          </div>

          {/* Row: Responsible + Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Responsible Person</label>
              <input className={inputCls} value={form.responsiblePerson} onChange={e => setForm(f => ({ ...f, responsiblePerson: e.target.value }))} placeholder="Full name" />
            </div>
            <div>
              <label className={labelCls}>Department</label>
              <select className={inputCls} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Linked Budget Line + Linked Work Plan (optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Linked Budget Line <span className="text-slate-400 font-normal">(optional)</span></label>
              <input className={inputCls} value={form.linkedBudgetLine} onChange={e => setForm(f => ({ ...f, linkedBudgetLine: e.target.value }))} placeholder="e.g. BL-PROG-001" />
            </div>
            <div>
              <label className={labelCls}>Linked Work Plan <span className="text-slate-400 font-normal">(optional)</span></label>
              <input className={inputCls} value={form.linkedWorkPlan} onChange={e => setForm(f => ({ ...f, linkedWorkPlan: e.target.value }))} placeholder="e.g. WP-YE-2026" />
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2 rounded-lg text-sm text-white font-medium transition-colors" style={{ backgroundColor: "#0B01D0" }}>Add Plan Item</button>
        </div>
      </div>
    </div>
  );
}

// ─── Plan Item Detail / Edit Panel ──────────────────────────────────────────

interface PlanItemDetailProps {
  item: ProcurementPlanItem;
  onClose: () => void;
}

function PlanItemDetail({ item, onClose }: PlanItemDetailProps) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    activityDescription: item.activityDescription,
    category: item.category,
    estimatedValue: String(item.estimatedValue),
    fundingSource: item.fundingSource,
    procurementMethod: item.procurementMethod,
    initiationDate: item.initiationDate,
    awardDate: item.awardDate,
    completionDate: item.completionDate,
    responsiblePerson: item.responsiblePerson,
    department: item.department,
    status: item.status,
    linkedBudgetLine: item.linkedBudgetLine || "",
    linkedWorkPlan: item.linkedWorkPlan || "",
  });

  const handleSave = () => {
    updateProcurementPlanItem(
      item.id,
      {
        activityDescription: editForm.activityDescription,
        category: editForm.category as ProcurementPlanItem["category"],
        estimatedValue: parseFloat(editForm.estimatedValue),
        fundingSource: editForm.fundingSource,
        procurementMethod: editForm.procurementMethod,
        initiationDate: editForm.initiationDate,
        awardDate: editForm.awardDate,
        completionDate: editForm.completionDate,
        responsiblePerson: editForm.responsiblePerson,
        department: editForm.department,
        status: editForm.status as ProcurementPlanItem["status"],
        linkedBudgetLine: editForm.linkedBudgetLine || undefined,
        linkedWorkPlan: editForm.linkedWorkPlan || undefined,
      },
      "Current User"
    );
    setEditing(false);
  };

  const handleApprove = () => {
    approvePlanItem(item.id, "Current User");
  };

  const labelCls = "text-[11px] font-semibold text-slate-600 uppercase tracking-wide";
  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/30 focus:border-[#0B01D0]";
  const valCls = "text-sm text-slate-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{item.ppItemId}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{item.activityDescription}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Detail fields */}
          {!editing ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div><span className={labelCls}>Activity</span><p className={valCls}>{item.activityDescription}</p></div>
              <div><span className={labelCls}>Category</span><div className="mt-1">{getCategoryBadge(item.category)}</div></div>
              <div><span className={labelCls}>Estimated Value</span><p className={valCls}>{formatCurrency(item.estimatedValue)}</p></div>
              <div><span className={labelCls}>Funding Source</span><p className={valCls}>{item.fundingSource}</p></div>
              <div><span className={labelCls}>Procurement Method</span><p className={valCls}>{item.procurementMethod}</p></div>
              <div><span className={labelCls}>Status</span><div className="mt-1">{getStatusBadge(item.status)}</div></div>
              <div><span className={labelCls}>Approval</span><div className="mt-1">{getApprovalBadge(item.approvalStatus)}</div></div>
              <div><span className={labelCls}>Responsible Person</span><p className={valCls}>{item.responsiblePerson}</p></div>
              <div><span className={labelCls}>Department</span><p className={valCls}>{item.department}</p></div>
              <div><span className={labelCls}>Initiation Date</span><p className={valCls}>{item.initiationDate}</p></div>
              <div><span className={labelCls}>Award Date</span><p className={valCls}>{item.awardDate}</p></div>
              <div><span className={labelCls}>Completion Date</span><p className={valCls}>{item.completionDate}</p></div>
              {item.linkedBudgetLine && <div><span className={labelCls}>Linked Budget Line</span><p className={valCls}>{item.linkedBudgetLine}</p></div>}
              {item.linkedWorkPlan && <div><span className={labelCls}>Linked Work Plan</span><p className={valCls}>{item.linkedWorkPlan}</p></div>}
              <div><span className={labelCls}>Version</span><p className={valCls}>{item.version}</p></div>
              <div><span className={labelCls}>Last Modified</span><p className={valCls}>{item.lastModified}</p></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div><label className={labelCls}>Activity Description</label><input className={inputCls} value={editForm.activityDescription} onChange={e => setEditForm(f => ({ ...f, activityDescription: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Category</label><select className={inputCls} value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value as typeof f.category }))}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className={labelCls}>Estimated Value</label><input type="number" className={inputCls} value={editForm.estimatedValue} onChange={e => setEditForm(f => ({ ...f, estimatedValue: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Funding Source</label><select className={inputCls} value={editForm.fundingSource} onChange={e => setEditForm(f => ({ ...f, fundingSource: e.target.value }))}>{FUNDING_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className={labelCls}>Procurement Method</label><select className={inputCls} value={editForm.procurementMethod} onChange={e => setEditForm(f => ({ ...f, procurementMethod: e.target.value }))}>{PROCUREMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelCls}>Initiation Date</label><input type="date" className={inputCls} value={editForm.initiationDate} onChange={e => setEditForm(f => ({ ...f, initiationDate: e.target.value }))} /></div>
                <div><label className={labelCls}>Award Date</label><input type="date" className={inputCls} value={editForm.awardDate} onChange={e => setEditForm(f => ({ ...f, awardDate: e.target.value }))} /></div>
                <div><label className={labelCls}>Completion Date</label><input type="date" className={inputCls} value={editForm.completionDate} onChange={e => setEditForm(f => ({ ...f, completionDate: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Responsible Person</label><input className={inputCls} value={editForm.responsiblePerson} onChange={e => setEditForm(f => ({ ...f, responsiblePerson: e.target.value }))} /></div>
                <div><label className={labelCls}>Department</label><select className={inputCls} value={editForm.department} onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))}>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Status</label>
                  <select className={inputCls} value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value as typeof f.status }))}>
                    {["Not Started", "In Progress", "Under Evaluation", "Awarded", "Contracted", "Completed", "Delayed"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Linked Budget Line</label><input className={inputCls} value={editForm.linkedBudgetLine} onChange={e => setEditForm(f => ({ ...f, linkedBudgetLine: e.target.value }))} /></div>
              </div>
              <div><label className={labelCls}>Linked Work Plan</label><input className={inputCls} value={editForm.linkedWorkPlan} onChange={e => setEditForm(f => ({ ...f, linkedWorkPlan: e.target.value }))} /></div>
            </div>
          )}

          {/* Change History */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <History className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Change History</h3>
            </div>
            {item.changeHistory.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No changes recorded yet.</p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Date</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Field Changed</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Old Value</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">New Value</th>
                      <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Changed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.changeHistory.map((ch: PlanItemChange) => (
                      <tr key={ch.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-[11px] text-slate-600 whitespace-nowrap">{ch.date}</td>
                        <td className="px-3 py-2 text-[11px] text-slate-700 font-medium">{ch.field}</td>
                        <td className="px-3 py-2 text-[11px] text-red-600">{ch.oldValue}</td>
                        <td className="px-3 py-2 text-[11px] text-emerald-600">{ch.newValue}</td>
                        <td className="px-3 py-2 text-[11px] text-slate-600">{ch.changedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
          <div>
            {item.approvalStatus === "Pending Review" && (
              <button onClick={handleApprove} className="px-4 py-2 rounded-lg text-sm text-white font-medium bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                <CheckCircle className="size-4" /> Approve
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-lg text-sm text-white font-medium transition-colors" style={{ backgroundColor: "#0B01D0" }}>Save Changes</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                  <Edit2 className="size-3.5" /> Edit
                </button>
                <button onClick={onClose} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Close</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function ProcurementPlanView({ onBack }: ProcurementPlanViewProps) {
  const [activeTab, setActiveTab] = useState<"wbs" | "planItems">("planItems");
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(["P1", "P2"]));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(["T001", "T004", "T009"]));
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProcurementPlanItem | null>(null);
  const [historyItem, setHistoryItem] = useState<ProcurementPlanItem | null>(null);
  const [planItems, setPlanItems] = useState<ProcurementPlanItem[]>(getProcurementPlanItems());

  // Subscribe to store changes
  useEffect(() => {
    const unsub = subscribe(() => {
      setPlanItems(getProcurementPlanItems());
    });
    return unsub;
  }, []);

  // Keep selectedItem and historyItem in sync with store updates
  useEffect(() => {
    if (selectedItem) {
      const updated = planItems.find(i => i.id === selectedItem.id);
      if (updated) setSelectedItem(updated);
    }
    if (historyItem) {
      const updated = planItems.find(i => i.id === historyItem.id);
      if (updated) setHistoryItem(updated);
    }
  }, [planItems]);

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleTask = (id: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // WBS grand totals
  const grandPlanned = PROCUREMENT_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.reduce((s3, li) => s3 + li.planned, 0), 0), 0
  );
  const totalItems = PROCUREMENT_DATA.reduce(
    (s, p) => s + p.tasks.reduce((s2, t) => s2 + t.lineItems.length, 0), 0
  );

  // Plan items dashboard stats
  const totalPlanItems = planItems.length;
  const totalPlanValue = planItems.reduce((s, i) => s + i.estimatedValue, 0);
  const approvedCount = planItems.filter(i => i.approvalStatus === "Approved").length;
  const delayedCount = planItems.filter(i => i.status === "Delayed").length;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Procurement Plan
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {activeTab === "wbs"
                  ? <>Budget-Aligned Procurement Items | {totalItems} line items | Planned Total: <span className="font-semibold text-[#0B01D0]">{formatCurrency(grandPlanned)}</span></>
                  : <>{totalPlanItems} plan items | Total Value: <span className="font-semibold text-[#0B01D0]">{formatCurrency(totalPlanValue)}</span></>
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "planItems" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2 rounded-lg text-sm text-white font-medium transition-colors flex items-center gap-2"
                style={{ backgroundColor: "#0B01D0" }}
              >
                <Plus className="size-4" /> Add Plan Item
              </button>
            )}
            <button
              onClick={onBack}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 mt-5">
          <button
            onClick={() => setActiveTab("wbs")}
            className={`px-5 py-2.5 rounded-t-lg text-sm font-medium transition-colors border border-b-0 ${
              activeTab === "wbs"
                ? "bg-white text-[#0B01D0] border-slate-200"
                : "bg-slate-100 text-slate-500 border-transparent hover:text-slate-700"
            }`}
          >
            Budget WBS View
          </button>
          <button
            onClick={() => setActiveTab("planItems")}
            className={`px-5 py-2.5 rounded-t-lg text-sm font-medium transition-colors border border-b-0 ${
              activeTab === "planItems"
                ? "bg-white text-[#0B01D0] border-slate-200"
                : "bg-slate-100 text-slate-500 border-transparent hover:text-slate-700"
            }`}
          >
            Procurement Plan Items
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6">

        {/* ════════════ TAB: Procurement Plan Items ════════════ */}
        {activeTab === "planItems" && (
          <>
            {/* Dashboard stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Plan Items", value: totalPlanItems, icon: <FileText className="size-4" /> },
                { label: "Total Value", value: formatCurrency(totalPlanValue), icon: <FileText className="size-4" /> },
                { label: "Approved Items", value: approvedCount, icon: <CheckCircle className="size-4" /> },
                { label: "Delayed Items", value: delayedCount, icon: <AlertCircle className="size-4" /> },
              ].map((card, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#0B01D0" }}>
                    {card.icon}
                    {card.label}
                  </div>
                  <span className="text-xl font-bold text-slate-900">{card.value}</span>
                </div>
              ))}
            </div>

            {/* Plan Items Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-slate-900">Procurement Plan Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">PP Item ID</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold w-[16%]">Activity</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Category</th>
                      <th className="text-right px-3 py-3 text-white text-[11px] font-semibold">Est. Value</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Funding</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Method</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Dept</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Responsible</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Status</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Approval</th>
                      <th className="text-left px-3 py-3 text-white text-[11px] font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planItems.map(item => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-3 py-2.5 text-[11px] font-mono text-slate-500">{item.ppItemId}</td>
                        <td className="px-3 py-2.5 text-[12px] text-slate-700">{item.activityDescription}</td>
                        <td className="px-3 py-2.5">{getCategoryBadge(item.category)}</td>
                        <td className="px-3 py-2.5 text-right text-[12px] text-slate-700">{formatCurrency(item.estimatedValue)}</td>
                        <td className="px-3 py-2.5 text-[11px] text-slate-600">{item.fundingSource}</td>
                        <td className="px-3 py-2.5 text-[11px] text-slate-600">{item.procurementMethod}</td>
                        <td className="px-3 py-2.5 text-[11px] text-slate-600">{item.department}</td>
                        <td className="px-3 py-2.5 text-[11px] text-slate-600">{item.responsiblePerson}</td>
                        <td className="px-3 py-2.5">{getStatusBadge(item.status)}</td>
                        <td className="px-3 py-2.5">{getApprovalBadge(item.approvalStatus)}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-[#0B01D0] transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="size-3.5" />
                            </button>
                            <button
                              onClick={() => setHistoryItem(item)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-[#0B01D0] transition-colors"
                              title="History"
                            >
                              <History className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {planItems.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-sm text-slate-400">No plan items yet. Click &quot;Add Plan Item&quot; to create one.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ════════════ TAB: Budget WBS View ════════════ */}
        {activeTab === "wbs" && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold w-[28%]">Item</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Category</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Planned Amount</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Method</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Vendor</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Expected Date</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCUREMENT_DATA.map(phase => {
                    const phasePlanned = phase.tasks.reduce((s, t) => s + t.lineItems.reduce((s2, li) => s2 + li.planned, 0), 0);
                    const isPhaseExpanded = expandedPhases.has(phase.phaseId);

                    return (
                      <PhaseRows
                        key={phase.phaseId}
                        phase={phase}
                        phasePlanned={phasePlanned}
                        isExpanded={isPhaseExpanded}
                        expandedTasks={expandedTasks}
                        onTogglePhase={() => togglePhase(phase.phaseId)}
                        onToggleTask={toggleTask}
                      />
                    );
                  })}

                  {/* Grand Total */}
                  <tr className="bg-slate-100 border-t-2 border-slate-300">
                    <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">Grand Total</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(grandPlanned)}</td>
                    <td className="px-4 py-3" colSpan={3}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPlanItemModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      {selectedItem && <PlanItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}

      {/* History Panel Modal */}
      {historyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Change History</h2>
                <p className="text-sm text-slate-500 mt-0.5">{historyItem.ppItemId} — {historyItem.activityDescription}</p>
              </div>
              <button onClick={() => setHistoryItem(null)} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Version {historyItem.version}</span>
                <span className="text-[11px] text-slate-400">|</span>
                <span className="text-[11px] text-slate-500">Last modified: {historyItem.lastModified}</span>
              </div>
              {historyItem.changeHistory.length === 0 ? (
                <p className="text-sm text-slate-400 italic py-6 text-center">No changes recorded yet.</p>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Date</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Field Changed</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Old Value</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">New Value</th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold text-slate-600">Changed By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyItem.changeHistory.map((ch: PlanItemChange) => (
                        <tr key={ch.id} className="border-t border-slate-100">
                          <td className="px-3 py-2 text-[11px] text-slate-600 whitespace-nowrap">{ch.date}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-700 font-medium">{ch.field}</td>
                          <td className="px-3 py-2 text-[11px] text-red-600">{ch.oldValue}</td>
                          <td className="px-3 py-2 text-[11px] text-emerald-600">{ch.newValue}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-600">{ch.changedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
              <button onClick={() => setHistoryItem(null)} className="px-5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Phase rows ─────────────────────────────────────────────────────────────

function PhaseRows({
  phase,
  phasePlanned,
  isExpanded,
  expandedTasks,
  onTogglePhase,
  onToggleTask,
}: {
  phase: ProcurementPhase;
  phasePlanned: number;
  isExpanded: boolean;
  expandedTasks: Set<string>;
  onTogglePhase: () => void;
  onToggleTask: (id: string) => void;
}) {
  return (
    <>
      <tr className="bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={onTogglePhase}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown className="size-4 text-slate-500 shrink-0" /> : <ChevronRight className="size-4 text-slate-500 shrink-0" />}
            <span className="text-[12px] font-semibold text-slate-900">{phase.phaseName}</span>
          </div>
        </td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-900">{formatCurrency(phasePlanned)}</td>
        <td className="px-4 py-3" colSpan={3}></td>
      </tr>

      {isExpanded && phase.tasks.map(task => {
        const taskPlanned = task.lineItems.reduce((s, li) => s + li.planned, 0);
        const isTaskExpanded = expandedTasks.has(task.taskId);

        return (
          <TaskRows
            key={task.taskId}
            task={task}
            taskPlanned={taskPlanned}
            isExpanded={isTaskExpanded}
            onToggle={() => onToggleTask(task.taskId)}
          />
        );
      })}
    </>
  );
}

// ─── Task rows ──────────────────────────────────────────────────────────────

function TaskRows({
  task,
  taskPlanned,
  isExpanded,
  onToggle,
}: {
  task: ProcurementTask;
  taskPlanned: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-slate-100 cursor-pointer hover:bg-blue-50/30 transition-colors" onClick={onToggle}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 pl-6">
            {isExpanded ? <ChevronDown className="size-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="size-3.5 text-slate-400 shrink-0" />}
            <span className="text-[12px] font-medium text-slate-800">{task.taskId} — {task.taskName}</span>
          </div>
        </td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-700">{formatCurrency(taskPlanned)}</td>
        <td className="px-4 py-3" colSpan={3}></td>
      </tr>

      {isExpanded && task.lineItems.map(li => {
        return (
          <tr key={li.budgetLineId} className="border-b border-slate-50 bg-white hover:bg-slate-50/50">
            <td className="px-4 py-2.5">
              <div className="pl-14 flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">{li.budgetLineId}</span>
                <span className="text-[12px] text-slate-700">{li.name}</span>
              </div>
            </td>
            <td className="px-4 py-2.5">
              <Badge className={`text-[11px] font-medium shadow-none border-0 whitespace-nowrap ${
                li.category === "Goods/Equipment" ? "bg-cyan-100 text-cyan-700 hover:bg-cyan-100" :
                li.category === "Services" ? "bg-violet-100 text-violet-700 hover:bg-violet-100" :
                li.category === "Consulting" ? "bg-rose-100 text-rose-700 hover:bg-rose-100" :
                "bg-orange-100 text-orange-700 hover:bg-orange-100"
              }`}>
                {li.category}
              </Badge>
            </td>
            <td className="px-4 py-2.5 text-right text-[12px] text-slate-500">{formatCurrency(li.planned)}</td>
            <td className="px-4 py-2.5">{getMethodBadge(li.procurementMethod)}</td>
            <td className="px-4 py-2.5 text-[12px] text-slate-600">{li.vendor || "—"}</td>
            <td className="px-4 py-2.5 text-[12px] text-slate-600 whitespace-nowrap">{li.expectedDelivery}</td>
          </tr>
        );
      })}
    </>
  );
}