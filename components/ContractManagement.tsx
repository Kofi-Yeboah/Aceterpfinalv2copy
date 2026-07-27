import { useState, useEffect } from "react";
import {
  Search, Download, ChevronDown, ChevronRight, FileText, Plus, X,
  DollarSign, Users, Calendar, CheckCircle, Clock, AlertTriangle,
  ClipboardList, Star, Shield, Upload, Printer, BarChart3,
  CircleDot, Edit2, Flag, Package, Paperclip, RotateCcw, Lock,
  Link2, UserCheck, Settings2, ExternalLink, AlertCircle,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  getContracts, subscribe, updateContract, registerContract, generateContractNumber,
  addDocumentToContract,
  submitDeliverable, reviewDeliverable, updateDeliverable,
  addInvoice, ccReviewInvoice, procurementApproveInvoice, supervisorApproveInvoice,
  queryInvoice, resubmitInvoice, recordInvoicePayment, getContractFinancials,
  submitChangeRequest, approveChangeRequestStep, rejectChangeRequest, computeRevisedEndDate,
  CHANGE_APPROVAL_CHAIN,
  addPerformanceEvaluation,
  verifyCloseOutReadiness, updateCloseOut, closeContract,
  enrichContract, syncContractReminders,
  getOverdueDeliverables, daysUntil,
  type AwardedContract, type ContractDeliverable, type ContractInvoice, type InvoiceStatus,
  type InvoiceApprovalEntry, type ContractChangeRequest, type ContractCloseOut,
  type ContractCoordinator, type ContractMilestone,
} from "../lib/contractStore";
import {
  getCurrentUser, can, denialReason, requiredRolesFor, hasRole,
  subscribe as subscribeCurrentUser,
  type AppUser, type Capability, type ProcurementRole,
} from "../lib/currentUser";
import { pickFiles, openFile, FileValidationError, type UploadedFile } from "../lib/fileUpload";
import { exportToCSV, exportToExcel, exportToPDF, printDocument, type ExportColumn } from "../lib/exportUtils";
import { ProcurementTabs, ProcurementTabBar, type ProcurementTab } from "./procurement/ProcurementTabs";
import { ProcurementStatCards, type ProcurementStat } from "./procurement/ProcurementStatCards";

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const fmtDate = (s?: string) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const todayISO = () => new Date().toISOString().split("T")[0];

/** Re-renders the subtree whenever the signed-in user is switched. */
function useCurrentUser(): AppUser {
  const [user, setUser] = useState<AppUser>(getCurrentUser());
  useEffect(() => subscribeCurrentUser(() => setUser(getCurrentUser())), []);
  return user;
}

/** True when the user holds any one of the capabilities. */
function anyCan(caps: Capability[]): boolean {
  return caps.some(c => can(c));
}

/** Tooltip explaining why a control is locked for the current user. */
function anyDenial(caps: Capability[]): string {
  if (caps.length === 1) return denialReason(caps[0]);
  const roles = Array.from(new Set(caps.flatMap(c => requiredRolesFor(c))));
  const u = getCurrentUser();
  return `Requires ${roles.join(" or ")} role — you are signed in as ${u.name} (${u.roles.join(", ")}).`;
}

/** Tooltip for the change-request chain, which is gated on the station's role. */
function stationDenial(role: string): string {
  const u = getCurrentUser();
  return `${role} must sign at this point in the chain — you are signed in as ${u.name} (${u.roles.join(", ")}).`;
}

/** The station this user speaks for when querying an invoice. */
function reviewRoleOf(user: AppUser): string {
  const order: ProcurementRole[] = ["Contract Coordinator", "Procurement", "Supervisor", "Finance"];
  return order.find(r => user.roles.includes(r)) ?? user.roles[0] ?? "Reviewer";
}

const INVOICE_REVIEW_CAPS: Capability[] = [
  "contract.invoiceCCReview", "contract.invoiceProcurementReview",
  "contract.invoiceSupervisorApprove", "contract.processPayment",
];
const DOC_UPLOAD_CAPS: Capability[] = ["contract.uploadDeliverable", "contract.register"];
const INVOICE_RECORD_CAPS: Capability[] = ["contract.invoiceCCReview", "contract.register"];

/**
 * Object URLs from the file picker, keyed by file name.
 *
 * Deliverable and change-request evidence is stored as bare file names, so this
 * keeps the handle that makes those attachments openable for the session.
 */
const uploadedFileIndex = new Map<string, UploadedFile>();
function rememberFiles(files: UploadedFile[]) {
  files.forEach(f => uploadedFileIndex.set(f.name, f));
}
function fileFor(name: string): UploadedFile | undefined {
  return uploadedFileIndex.get(name);
}

/** Opens the picker, converting a rejected file into a message for the caller. */
async function choose(
  setError: (m: string | null) => void,
  opts?: { multiple?: boolean; uploadedBy?: string }
): Promise<UploadedFile[]> {
  try {
    setError(null);
    const files = await pickFiles({ multiple: opts?.multiple ?? true, uploadedBy: opts?.uploadedBy });
    rememberFiles(files);
    return files;
  } catch (err) {
    setError(err instanceof FileValidationError ? err.message : "That file could not be attached.");
    return [];
  }
}

/**
 * Attaches a picked file to the contract's document register.
 *
 * `addDocumentToContract` does not carry the object URL, so the version it just
 * created is stamped with it here — without that the document could be listed
 * but never reopened.
 */
function attachContractDocument(contractId: string, file: UploadedFile, label: string, uploadedBy: string) {
  addDocumentToContract(contractId, {
    label, name: file.name, uploadedBy, type: file.type, size: file.sizeLabel,
  });
  const c = getContracts().find(x => x.id === contractId);
  const group = c?.documents.find(g => g.label === label);
  const version = group?.versions[group.versions.length - 1];
  if (!c || !group || !version) return;
  updateContract(contractId, {
    documents: c.documents.map(g =>
      g.docId === group.docId
        ? { ...g, versions: g.versions.map(v => (v.id === version.id ? { ...v, url: file.url } : v)) }
        : g
    ),
  });
}

/** A contract awarded from Sourcing arrives as a shell with nothing scheduled. */
function needsSetup(c: AwardedContract): boolean {
  return (c.coordinators ?? []).length === 0 && (c.deliverables ?? []).length === 0;
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ── Export plumbing ──────────────────────────────────────────────────────── */

type ExportRow = Record<string, unknown>;
interface ExportSet {
  title: string;
  columns: ExportColumn<ExportRow>[];
  rows: ExportRow[];
}

function runExport(format: "excel" | "pdf" | "csv", set: ExportSet, generatedBy: string) {
  if (format === "excel") exportToExcel(set.title, set.columns, set.rows, { generatedBy });
  else if (format === "pdf") exportToPDF(set.title, set.columns, set.rows, { generatedBy });
  else exportToCSV(set.title, set.columns, set.rows);
}

function ExportMenu({ build, label = "Export", compact = false }: {
  build: () => ExportSet;
  label?: string;
  compact?: boolean;
}) {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const allowed = can("report.export");

  return (
    <div className="relative">
      <button
        onClick={() => allowed && setOpen(o => !o)}
        disabled={!allowed}
        title={allowed ? "Export the current view" : denialReason("report.export")}
        className={cn(
          "flex items-center gap-1.5 border border-slate-200 rounded-lg text-slate-600 font-medium",
          compact ? "px-3 py-2 text-[12px]" : "px-4 py-2 text-[12px]",
          allowed ? "hover:bg-slate-50" : "opacity-50 cursor-not-allowed"
        )}
      >
        <Download size={compact ? 13 : 14} /> {label} <ChevronDown size={11} />
      </button>
      {open && allowed && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-30 min-w-[150px] overflow-hidden">
            {([
              ["excel", "Excel workbook"],
              ["pdf", "PDF (print)"],
              ["csv", "CSV"],
            ] as const).map(([format, text]) => (
              <button
                key={format}
                onClick={() => { runExport(format, build(), user.name); setOpen(false); }}
                className="block w-full text-left px-3 py-2 text-[11px] text-slate-600 hover:bg-slate-50"
              >
                {text}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Shared feedback / gated controls ─────────────────────────────────────── */

function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle size={13} className="text-red-500 mt-0.5 shrink-0" />
      <p className="text-[11px] text-red-700 leading-relaxed">{message}</p>
    </div>
  );
}

function GatedButton({ allowed, reason, onClick, className, children, title }: {
  allowed: boolean;
  reason: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={() => allowed && onClick()}
      disabled={!allowed}
      title={allowed ? title : reason}
      className={cn(className, !allowed && "opacity-50 cursor-not-allowed")}
    >
      {children}
    </button>
  );
}

/** Renders an attachment name, clickable when its object URL is still held. */
function AttachmentChip({ name }: { name: string }) {
  const file = fileFor(name);
  if (!file) {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600">
        <FileText size={10} /> {name}
      </span>
    );
  }
  return (
    <button
      onClick={() => openFile(file)}
      title={`Open ${file.name} (${file.sizeLabel})`}
      className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#0B01D0]/30 rounded text-[10px] text-[#0B01D0] font-medium hover:bg-[#0B01D0]/5"
    >
      <FileText size={10} /> {name} <ExternalLink size={9} />
    </button>
  );
}

type TabKey = "all" | "active" | "variation" | "suspended" | "closed";
type DetailTab = "overview" | "deliverables" | "invoices" | "changes" | "performance" | "closeout" | "documents" | "audit";

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "Expiring Soon": "bg-amber-100 text-amber-700",
  Expired: "bg-slate-100 text-slate-600",
  Pending: "bg-blue-100 text-blue-700",
  Terminated: "bg-red-100 text-red-700",
  Renewed: "bg-indigo-100 text-indigo-700",
  Suspended: "bg-orange-100 text-orange-700",
  "Under Variation": "bg-purple-100 text-purple-700",
  Closed: "bg-slate-200 text-slate-600",
};

const DEL_COLORS: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-600",
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

const INV_COLORS: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "CC Reviewed": "bg-indigo-100 text-indigo-700",
  "Procurement Approved": "bg-purple-100 text-purple-700",
  "Supervisor Approved": "bg-amber-100 text-amber-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Queried: "bg-red-100 text-red-700",
};

const CR_COLORS: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-600",
  "Pending Approval": "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Implemented: "bg-blue-100 text-blue-700",
};

/** The stations an invoice passes on the way to payment. */
const INVOICE_STAGES: InvoiceStatus[] = [
  "Submitted", "CC Reviewed", "Procurement Approved", "Supervisor Approved", "Paid",
];

const CLOSEOUT_OWNERS: Partial<Record<keyof ContractCloseOut, string>> = {
  allDeliverablesCompleted: "Contract Coordinator",
  procurementCompliance: "Procurement",
  allPaymentsCompleted: "Finance",
  performanceFinalized: "CC + Supervisor",
  allDocsUploaded: "Contract Coordinator",
};

/* ── Export datasets ──────────────────────────────────────────────────────── */

function contractsExportSet(list: AwardedContract[]): ExportSet {
  return {
    title: "Contract Register",
    columns: [
      { key: "contractNumber", header: "Contract #" },
      { key: "title", header: "Title" },
      { key: "party", header: "Vendor / Consultant" },
      { key: "category", header: "Category" },
      { key: "method", header: "Method" },
      { key: "value", header: "Value (USD)" },
      { key: "paid", header: "Paid (USD)" },
      { key: "balance", header: "Balance (USD)" },
      { key: "startDate", header: "Start" },
      { key: "endDate", header: "End" },
      { key: "status", header: "Status" },
      { key: "department", header: "Department" },
      { key: "owner", header: "Owner" },
      { key: "deliverables", header: "Deliverables Accepted" },
      { key: "openInvoices", header: "Open Invoices" },
    ],
    rows: list.map(c => {
      const fin = getContractFinancials(c);
      const dels = c.deliverables ?? [];
      return {
        contractNumber: c.contractNumber, title: c.title, party: c.party, category: c.category,
        method: c.method, value: c.value, paid: fin.totalPaid, balance: fin.balance,
        startDate: c.startDate, endDate: c.endDate, status: c.status,
        department: c.department, owner: c.owner,
        deliverables: `${dels.filter(d => d.status === "Accepted").length}/${dels.length}`,
        openInvoices: (c.invoices ?? []).filter(i => i.status !== "Paid").length,
      };
    }),
  };
}

function detailExportSet(c: AwardedContract, tab: DetailTab): ExportSet {
  const prefix = `${c.contractNumber} — `;
  if (tab === "deliverables") {
    return {
      title: `${prefix}Deliverables`,
      columns: [
        { key: "milestone", header: "Milestone" }, { key: "description", header: "Description" },
        { key: "dueDate", header: "Due Date" }, { key: "actualDate", header: "Actual Date" },
        { key: "status", header: "Status" }, { key: "amount", header: "Amount (USD)" },
        { key: "submittedBy", header: "Submitted By" }, { key: "reviewedBy", header: "Reviewed By" },
        { key: "documents", header: "Documents" }, { key: "comments", header: "Comments" },
      ],
      rows: (c.deliverables ?? []).map(d => ({
        milestone: c.milestones.find(m => m.id === d.milestoneRef)?.label ?? d.milestoneRef,
        description: d.description, dueDate: d.dueDate, actualDate: d.actualDate ?? "",
        status: d.status, amount: d.amount ?? 0, submittedBy: d.submittedBy ?? "",
        reviewedBy: d.reviewedBy ?? "", documents: d.documents,
        comments: d.reviewComments || d.comments,
      })),
    };
  }
  if (tab === "invoices") {
    return {
      title: `${prefix}Invoices & Payments`,
      columns: [
        { key: "invoiceNumber", header: "Invoice #" }, { key: "vendor", header: "Vendor" },
        { key: "amount", header: "Amount (USD)" }, { key: "dateSubmitted", header: "Submitted" },
        { key: "submittedVia", header: "Via" }, { key: "status", header: "Status" },
        { key: "reviewedBy", header: "CC Review" }, { key: "procurementApprovedBy", header: "Procurement" },
        { key: "supervisorApprovedBy", header: "Supervisor" }, { key: "datePaid", header: "Paid Date" },
        { key: "amountPaid", header: "Amount Paid (USD)" }, { key: "referenceNumber", header: "Reference" },
      ],
      rows: (c.invoices ?? []).map(i => ({
        invoiceNumber: i.invoiceNumber, vendor: i.vendor, amount: i.amount,
        dateSubmitted: i.dateSubmitted, submittedVia: i.submittedVia, status: i.status,
        reviewedBy: i.reviewedBy ?? "", procurementApprovedBy: i.procurementApprovedBy ?? "",
        supervisorApprovedBy: i.supervisorApprovedBy ?? "", datePaid: i.datePaid ?? "",
        amountPaid: i.amountPaid ?? 0, referenceNumber: i.referenceNumber ?? "",
      })),
    };
  }
  if (tab === "changes") {
    return {
      title: `${prefix}Change Requests`,
      columns: [
        { key: "changeNumber", header: "Amendment #" }, { key: "types", header: "Types" },
        { key: "reason", header: "Reason" }, { key: "costImpact", header: "Cost Impact (USD)" },
        { key: "timeImpact", header: "Time Impact" }, { key: "revisedValue", header: "Revised Value (USD)" },
        { key: "revisedEndDate", header: "Revised End Date" }, { key: "status", header: "Status" },
        { key: "requestedBy", header: "Requested By" }, { key: "approvals", header: "Approvals" },
      ],
      rows: (c.changeRequests ?? []).map(cr => ({
        changeNumber: cr.changeNumber, types: cr.types, reason: cr.reason,
        costImpact: cr.estimatedCostImpact, timeImpact: cr.estimatedTimeImpact,
        revisedValue: cr.revisedValue ?? 0, revisedEndDate: cr.revisedEndDate ?? "",
        status: cr.status, requestedBy: cr.requestedBy,
        approvals: (cr.approvalTrail ?? []).map(t => `${t.role}: ${t.action} by ${t.by}`),
      })),
    };
  }
  if (tab === "audit") {
    return {
      title: `${prefix}Audit Trail`,
      columns: [
        { key: "date", header: "Date" }, { key: "action", header: "Action" },
        { key: "performedBy", header: "Performed By" }, { key: "details", header: "Details" },
      ],
      rows: (c.auditLog ?? []).map(a => ({
        date: a.date, action: a.action, performedBy: a.performedBy, details: a.details,
      })),
    };
  }
  if (tab === "documents") {
    return {
      title: `${prefix}Documents`,
      columns: [
        { key: "label", header: "Document" }, { key: "name", header: "File Name" },
        { key: "uploadedBy", header: "Uploaded By" }, { key: "date", header: "Date" },
        { key: "type", header: "Type" }, { key: "size", header: "Size" },
        { key: "version", header: "Version" },
      ],
      rows: c.documents.flatMap(g =>
        g.versions.map(v => ({
          label: g.label, name: v.name, uploadedBy: v.uploadedBy, date: v.date,
          type: v.type, size: v.size, version: v.version,
        }))
      ),
    };
  }
  return contractsExportSet([c]);
}

/* ── Printable close-out artefacts ────────────────────────────────────────── */

function certificateHtml(c: AwardedContract): string {
  const closeOut = c.closeOut;
  const rows: [string, string][] = [
    ["Contract Number", c.contractNumber],
    ["Contract Title", c.title],
    ["Vendor / Consultant", c.party],
    ["Category", c.category],
    ["Contract Value", fmt(c.value)],
    ["Start Date", fmtDate(c.startDate)],
    ["End Date", fmtDate(c.endDate)],
  ];
  return `
    <h1 style="text-align:center">Certificate of Completion</h1>
    <p class="muted" style="text-align:center;letter-spacing:2px;text-transform:uppercase;font-size:10px">ACET Procurement</p>
    <p style="text-align:center">This certifies that all obligations under the following contract have been fulfilled.</p>
    <table>${rows.map(([k, v]) => `<tr><th style="width:38%">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>
    <h2>Confirmation</h2>
    <ul>
      <li>All deliverables completed and accepted.</li>
      <li>All payments processed and settled.</li>
      <li>Vendor performance evaluation finalised.</li>
    </ul>
    <table style="margin-top:28px">
      <tr>
        <td style="border:0"><strong>Date of Certification</strong><br>${esc(fmtDate(closeOut?.closedDate ?? todayISO()))}</td>
        <td style="border:0"><strong>Signed By</strong><br>${esc(closeOut?.closedBy ?? c.owner)}<br>
          <span style="display:inline-block;border-top:1px solid #333;width:180px;margin-top:26px"></span><br>
          <span class="muted" style="font-size:10px">Authorised Signatory</span>
        </td>
      </tr>
    </table>`;
}

function closureReportHtml(c: AwardedContract): string {
  const dels = c.deliverables ?? [];
  const accepted = dels.filter(d => d.status === "Accepted").length;
  const fin = getContractFinancials(c);
  const evals = c.performanceEvaluations ?? [];
  const latest = evals.length ? evals[evals.length - 1] : null;
  const changes = c.changeRequests ?? [];
  const summary: [string, string][] = [
    ["Contract Number", c.contractNumber], ["Vendor", c.party],
    ["Category", c.category], ["Method", c.method],
    ["Contract Value", fmt(c.value)], ["Total Paid", fmt(fin.totalPaid)],
    ["Balance", fmt(fin.balance)], ["Duration", `${fmtDate(c.startDate)} — ${fmtDate(c.endDate)}`],
    ["Department", c.department], ["Contract Type", c.contractType ?? "—"],
    ["Budget Line", c.budgetLine ?? "—"], ["Funding Source", c.fundingSource ?? "—"],
  ];
  return `
    <h1>Contract Closure Report</h1>
    <p class="muted">${esc(c.contractNumber)} — ${esc(c.title)} &middot; ${esc(c.party)}</p>
    <h2>Contract Summary</h2>
    <table>${summary.map(([k, v]) => `<tr><th style="width:38%">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>
    <h2>Deliverables (${accepted}/${dels.length} accepted)</h2>
    <table>
      <thead><tr><th>Description</th><th>Due</th><th>Actual</th><th>Status</th><th>Reviewed By</th></tr></thead>
      <tbody>${dels.map(d => `<tr><td>${esc(d.description)}</td><td>${esc(fmtDate(d.dueDate))}</td><td>${esc(fmtDate(d.actualDate))}</td><td>${esc(d.status)}</td><td>${esc(d.reviewedBy ?? "—")}</td></tr>`).join("") || `<tr><td colspan="5" class="muted">None recorded.</td></tr>`}</tbody>
    </table>
    <h2>Payments</h2>
    <table>
      <thead><tr><th>Invoice</th><th>Amount</th><th>Status</th><th>Paid</th><th>Reference</th></tr></thead>
      <tbody>${(c.invoices ?? []).map(i => `<tr><td>${esc(i.invoiceNumber)}</td><td>${esc(fmt(i.amount))}</td><td>${esc(i.status)}</td><td>${esc(fmtDate(i.datePaid))}</td><td>${esc(i.referenceNumber ?? "—")}</td></tr>`).join("") || `<tr><td colspan="5" class="muted">None recorded.</td></tr>`}</tbody>
    </table>
    <h2>Vendor Performance</h2>
    <p>${latest ? `Latest score ${esc(latest.overallScore.toFixed(1))}/10 (${esc(latest.evaluationType)}, ${esc(fmtDate(latest.evaluationDate))}) across ${evals.length} evaluation(s).${latest.overallScore < 5 ? " <strong>Flagged as a poor performer.</strong>" : ""}` : `<span class="muted">No evaluations recorded.</span>`}</p>
    <h2>Change Management</h2>
    <p>${changes.length} change request(s); ${changes.filter(cr => cr.status === "Approved" || cr.status === "Implemented").length} approved or implemented.</p>
    <h2>Key Dates</h2>
    <table>
      <tr><th>Award</th><td>${esc(fmtDate(c.awardDate))}</td><th>Start</th><td>${esc(fmtDate(c.startDate))}</td></tr>
      <tr><th>End</th><td>${esc(fmtDate(c.endDate))}</td><th>Closed</th><td>${esc(fmtDate(c.closeOut?.closedDate ?? todayISO()))}</td></tr>
    </table>`;
}

function contractSummaryHtml(c: AwardedContract): string {
  const fin = getContractFinancials(c);
  const rows: [string, string][] = [
    ["Contract Number", c.contractNumber], ["Title", c.title], ["Vendor / Consultant", c.party],
    ["Category", c.category], ["Method", c.method], ["Contract Type", c.contractType ?? "—"],
    ["Status", c.status], ["Value", fmt(c.value)], ["Total Paid", fmt(fin.totalPaid)],
    ["Balance", fmt(fin.balance)], ["Award Date", fmtDate(c.awardDate)],
    ["Start Date", fmtDate(c.startDate)], ["End Date", fmtDate(c.endDate)],
    ["Renewal Date", c.renewalDate ? fmtDate(c.renewalDate) : "Not applicable"],
    ["Department", c.department], ["Owner", c.owner],
    ["Coordinators", (c.coordinators ?? []).map(cc => `${cc.name} (${cc.role})`).join(", ") || "—"],
    ["Budget Line", c.budgetLine ?? "—"], ["Funding Source", c.fundingSource ?? "—"],
  ];
  return `
    <h1>${esc(c.contractNumber)} — ${esc(c.title)}</h1>
    <p class="muted">Contract record as at ${esc(fmtDate(todayISO()))}</p>
    <table>${rows.map(([k, v]) => `<tr><th style="width:34%">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>
    <h2>Milestones</h2>
    <table>
      <thead><tr><th>Milestone</th><th>Date</th><th>Complete</th></tr></thead>
      <tbody>${c.milestones.map(m => `<tr><td>${esc(m.label)}</td><td>${esc(fmtDate(m.date))}</td><td>${m.completed ? "Yes" : "No"}</td></tr>`).join("") || `<tr><td colspan="3" class="muted">None recorded.</td></tr>`}</tbody>
    </table>`;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function ContractManagement() {
  const user = useCurrentUser();
  const [contracts, setContracts] = useState<AwardedContract[]>(getContracts());
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showCatDD, setShowCatDD] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");

  // Modals
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => subscribe(() => setContracts(getContracts())), []);

  // Queue the deliverable-due and expiry reminders for everything on file.
  useEffect(() => { getContracts().forEach(syncContractReminders); }, []);

  // Derived from the live list so a store update is never read from a stale copy.
  const selectedContract = selectedId ? contracts.find(c => c.id === selectedId) ?? null : null;
  const openContract = (c: AwardedContract) => { setSelectedId(c.id); setDetailTab("overview"); };

  const categories = ["All", "Goods", "Services", "Works", "Consultancy"];

  const filtered = contracts.filter(c => {
    if (activeTab === "active" && c.status !== "Active" && c.status !== "Expiring Soon") return false;
    if (activeTab === "variation" && c.status !== "Under Variation") return false;
    if (activeTab === "suspended" && c.status !== "Suspended") return false;
    if (activeTab === "closed" && c.status !== "Closed") return false;
    if (catFilter !== "All" && c.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.contractNumber.toLowerCase().includes(q) && !c.party.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const tabs: ProcurementTab<TabKey>[] = [
    { key: "all", label: "All Contracts", count: contracts.length },
    { key: "active", label: "Active", count: contracts.filter(c => c.status === "Active" || c.status === "Expiring Soon").length },
    { key: "variation", label: "Under Variation", count: contracts.filter(c => c.status === "Under Variation").length },
    { key: "suspended", label: "Suspended", count: contracts.filter(c => c.status === "Suspended").length },
    { key: "closed", label: "Closed", count: contracts.filter(c => c.status === "Closed").length },
  ];

  // Dashboard metrics
  const totalValue = contracts.reduce((s, c) => s + c.value, 0);
  const activeContracts = contracts.filter(c => c.status === "Active" || c.status === "Under Variation" || c.status === "Expiring Soon").length;
  const pendingDeliverables = contracts.reduce((s, c) => s + (c.deliverables?.filter(d => d.status === "Pending" || d.status === "Submitted" || d.status === "Under Review").length || 0), 0);
  const overdueInvoices = contracts.reduce((s, c) => s + (c.invoices?.filter(i => i.status !== "Paid" && i.status !== "Queried").length || 0), 0);
  const pendingChanges = contracts.reduce((s, c) => s + (c.changeRequests?.filter(cr => cr.status === "Pending Approval" || cr.status === "Draft").length || 0), 0);
  const expiringContracts = contracts.filter(c => {
    if (c.status === "Closed" || c.status === "Terminated") return false;
    const daysLeft = Math.round((new Date(c.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= 60;
  });
  const pendingProcurement = contracts.reduce((s, c) => s + (c.invoices?.filter(i => i.status === "CC Reviewed").length || 0), 0);
  const pendingFinance = contracts.reduce((s, c) => s + (c.invoices?.filter(i => i.status === "Supervisor Approved").length || 0), 0);
  const pendingCC = contracts.reduce((s, c) => s + (c.invoices?.filter(i => i.status === "Submitted").length || 0) + (c.deliverables?.filter(d => d.status === "Pending").length || 0), 0);
  const overdueDeliverables = getOverdueDeliverables();
  const shellContracts = contracts.filter(needsSetup);

  /* ═══ DETAIL VIEW ═══════════════════════════════════════════════════════════ */
  if (selectedContract) {
    const c = selectedContract;
    const deliverables = c.deliverables || [];
    const invoices = c.invoices || [];
    const changeRequests = c.changeRequests || [];
    const evaluations = c.performanceEvaluations || [];
    const closeOut = c.closeOut || { allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false, performanceFinalized: false, allDocsUploaded: false };
    const financials = getContractFinancials(c);
    const totalPaid = financials.totalPaid;
    const balance = financials.balance;
    const delAccepted = deliverables.filter(d => d.status === "Accepted").length;
    const delTotal = deliverables.length;
    const perfScore = evaluations.length > 0 ? evaluations[evaluations.length - 1].overallScore : null;
    const setupRequired = needsSetup(c);

    const detailTabs: ProcurementTab<DetailTab>[] = [
      { key: "overview", label: "Overview" },
      { key: "deliverables", label: "Deliverables", count: deliverables.length },
      { key: "invoices", label: "Invoices & Payments", count: invoices.length },
      { key: "changes", label: "Change Management", count: changeRequests.length },
      { key: "performance", label: "Performance" },
      { key: "closeout", label: "Close-Out" },
      { key: "documents", label: "Documents" },
      { key: "audit", label: "Audit Trail", count: (c.auditLog || []).length },
    ];

    const summaryStats: ProcurementStat[] = [
      { label: "Contract Value", value: fmt(c.value), icon: <DollarSign size={14} />, tone: "success" },
      { label: "Paid", value: fmt(totalPaid), icon: <CheckCircle size={14} />, tone: "info" },
      { label: "Balance", value: fmt(balance), icon: <DollarSign size={14} />, tone: "warning" },
      { label: "Deliverables", value: `${delAccepted}/${delTotal}`, icon: <Package size={14} />, tone: "accent" },
      { label: "Performance", value: perfScore ? `${perfScore.toFixed(1)}/10` : "—", icon: <Star size={14} />, tone: "warning" },
    ];

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Detail header */}
        <div className="bg-white border-b border-slate-200 shrink-0">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => { setSelectedId(null); setDetailTab("overview"); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <X size={18} />
                <span className="text-[13px] font-medium">Close</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[16px] font-semibold text-slate-900">{c.contractNumber}</h1>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", STATUS_COLORS[c.status] || "bg-slate-100 text-slate-600")}>{c.status}</span>
                </div>
                <p className="text-[11px] text-slate-400">{c.title} — {c.party}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => printDocument(`${c.contractNumber} — Contract Record`, contractSummaryHtml(c))}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"
              >
                <Printer size={13} /> Print
              </button>
              <ExportMenu compact build={() => detailExportSet(c, detailTab)} />
            </div>
          </div>
        </div>

        {/* Summary strip */}
        <ProcurementStatCards stats={summaryStats} />

        {/* Detail tabs */}
        <ProcurementTabBar>
          <ProcurementTabs tabs={detailTabs} active={detailTab} onChange={setDetailTab} minWidth={72} />
        </ProcurementTabBar>

        {/* Detail body */}
        <div className="flex-1 overflow-auto">
          {/* ── OVERVIEW ── */}
          {detailTab === "overview" && (
            <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
              {/* Awarded from Sourcing but never set up — nothing can be tracked yet */}
              {setupRequired && (
                <section className="bg-amber-50 rounded-xl border-2 border-amber-300 p-5 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Settings2 size={17} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-amber-800">Complete contract setup</p>
                    <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                      This contract came across from a sourcing award with no coordinators, milestones, delivery or payment
                      schedule. Until those are captured, deliverables cannot be tracked, invoices cannot be matched, and no
                      reminders will be raised.
                    </p>
                    <GatedButton
                      allowed={can("contract.register")}
                      reason={denialReason("contract.register")}
                      onClick={() => setShowSetupModal(true)}
                      className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-[11px] font-medium hover:bg-amber-700"
                    >
                      <Settings2 size={12} /> Complete contract setup
                    </GatedButton>
                  </div>
                </section>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* Contract Info */}
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><FileText size={13} className="text-[#0B01D0]" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Contract Information</h2>
                  </div>
                  <div className="p-5 divide-y divide-slate-100">
                    {[
                      ["Contract Number", c.contractNumber],
                      ["Title", c.title],
                      ["Vendor / Consultant", c.party],
                      ["Category", c.category],
                      ["Contract Type", c.contractType || "—"],
                      ["Method", c.method],
                      ["Payment Frequency", c.paymentFrequency || "—"],
                      ["Source PR", c.sourcePR],
                      ["Department", c.department],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex items-center justify-between py-2.5">
                        <span className="text-[11px] text-slate-500">{label}</span>
                        <span className="text-[11px] text-slate-800 font-medium text-right max-w-[55%] truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dates & Coordinators */}
                <div className="space-y-6">
                  <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center"><Calendar size={13} className="text-purple-600" /></div>
                      <h2 className="text-[13px] font-semibold text-slate-800">Key Dates</h2>
                    </div>
                    <div className="p-5 divide-y divide-slate-100">
                      {[
                        ["Award Date", fmtDate(c.awardDate)],
                        ["Start Date", fmtDate(c.startDate)],
                        ["End Date", fmtDate(c.endDate)],
                        ["Renewal Date", c.renewalDate ? fmtDate(c.renewalDate) : "Not applicable"],
                        ["Duration", `${Math.round((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`],
                      ].map(([label, value], i) => (
                        <div key={i} className="flex items-center justify-between py-2.5">
                          <span className="text-[11px] text-slate-500">{label}</span>
                          <span className="text-[11px] text-slate-800 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><Users size={13} className="text-emerald-600" /></div>
                      <h2 className="text-[13px] font-semibold text-slate-800">Contract Coordinators</h2>
                    </div>
                    <div className="p-5 space-y-3">
                      {(c.coordinators && c.coordinators.length > 0) ? c.coordinators.map(cc => (
                        <div key={cc.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-[#0B01D0]/10 flex items-center justify-center">
                            <span className="text-[10px] font-semibold text-[#0B01D0]">{cc.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-slate-800">{cc.name}</p>
                            <p className="text-[10px] text-slate-400">{cc.role} — {cc.email}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-[11px] text-slate-400 italic">No coordinators assigned</p>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              {/* Milestone Timeline */}
              {c.milestones.length > 0 && (
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center"><ClipboardList size={13} className="text-amber-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Milestones</h2>
                  </div>
                  <div className="p-5">
                    <div className="relative">
                      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200" />
                      <div className="space-y-4">
                        {c.milestones.map(ms => (
                          <div key={ms.id} className="flex items-start gap-4 relative">
                            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white", ms.completed ? "bg-emerald-500" : "bg-slate-200")}>
                              {ms.completed ? <CheckCircle size={14} className="text-white" /> : <CircleDot size={14} className="text-slate-400" />}
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className={cn("text-[12px] font-medium", ms.completed ? "text-slate-800" : "text-slate-500")}>{ms.label}</p>
                              <p className="text-[10px] text-slate-400">{fmtDate(ms.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Delivery Schedule (Goods) */}
              {c.deliverySchedule && c.deliverySchedule.length > 0 && (
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-blue-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"><Package size={13} className="text-blue-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Delivery Schedule</h2>
                  </div>
                  <div className="p-5">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {["Item", "Quantity", "Expected Date"].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {c.deliverySchedule.map((d, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="px-3 py-2 text-[11px] text-slate-700">{d.item}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-600">{d.quantity}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-600">{fmtDate(d.expectedDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Payment Schedule */}
              {c.paymentSchedule && c.paymentSchedule.length > 0 && (
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><DollarSign size={13} className="text-emerald-600" /></div>
                    <h2 className="text-[13px] font-semibold text-slate-800">Payment Schedule</h2>
                  </div>
                  <div className="p-5">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {["Description", "Amount", "Due Date", "Linked To"].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {c.paymentSchedule.map((p, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="px-3 py-2 text-[11px] text-slate-700">{p.description}</td>
                            <td className="px-3 py-2 text-[11px] text-emerald-700 font-medium">{fmt(p.amount)}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-600">{fmtDate(p.dueDate)}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-500">{p.linkedTo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── DELIVERABLES ── */}
          {detailTab === "deliverables" && (
            <DeliverablesTab contract={c} onUpload={() => setShowDeliverableModal(true)} />
          )}

          {/* ── INVOICES & PAYMENTS ── */}
          {detailTab === "invoices" && (
            <InvoicesTab contract={c} onRecordInvoice={() => setShowInvoiceModal(true)} />
          )}

          {/* ── CHANGE MANAGEMENT ── */}
          {detailTab === "changes" && (
            <ChangesTab contract={c} onNewChange={() => setShowChangeModal(true)} />
          )}

          {/* ── PERFORMANCE ── */}
          {detailTab === "performance" && (
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <p className="text-[12px] text-slate-500">{evaluations.length} evaluation(s)</p>
                <GatedButton
                  allowed={can("contract.evaluatePerformance")}
                  reason={denialReason("contract.evaluatePerformance")}
                  onClick={() => setShowEvalModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"
                >
                  <Plus size={12} /> New Evaluation
                </GatedButton>
              </div>
              {evaluations.length > 0 ? (
                <div className="max-w-5xl mx-auto py-6 px-4 space-y-4">
                  {evaluations.map(ev => (
                    <div key={ev.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-5 py-3 bg-amber-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Star size={14} className="text-amber-500" />
                          <span className="text-[13px] font-semibold text-slate-800">{ev.evaluationType} Evaluation</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium",
                            ev.status === "Final" ? "bg-emerald-100 text-emerald-700" :
                            ev.status === "Supervisor Approved" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-600"
                          )}>{ev.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{fmtDate(ev.evaluationDate)}</p>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Overall Score</p>
                            <p className={cn("text-[22px] font-semibold", ev.overallScore >= 7 ? "text-emerald-600" : ev.overallScore >= 5 ? "text-amber-600" : "text-red-600")}>{ev.overallScore.toFixed(1)}<span className="text-[12px] text-slate-400">/10</span></p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Evaluator</p>
                            <p className="text-[13px] font-semibold text-slate-800">{ev.evaluator}</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Supervisor</p>
                            <p className="text-[13px] font-semibold text-slate-800">{ev.supervisorApproval || "Pending"}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Criteria Scores (1–10 Likert Scale)</p>
                          <div className="space-y-2">
                            {ev.criteria.map((cr, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-[11px] text-slate-600 w-[180px] shrink-0">{cr.name}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                                  <div className={cn("h-2.5 rounded-full", cr.score >= 8 ? "bg-emerald-500" : cr.score >= 5 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${(cr.score / cr.maxScore) * 100}%` }} />
                                </div>
                                <span className="text-[11px] font-medium text-slate-700 w-8 text-right">{cr.score}/{cr.maxScore}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {ev.comments && (
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Comments</p>
                            <p className="text-[11px] text-slate-700">{ev.comments}</p>
                          </div>
                        )}
                        {ev.overallScore < 5 && (
                          <div className="space-y-2">
                            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg">
                              <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-[12px] text-red-800 font-bold">POOR PERFORMANCE FLAGGED</p>
                                <p className="text-[11px] text-red-700 mt-0.5">This vendor scored below 5.0. Future sourcing engagement requires management approval.</p>
                              </div>
                            </div>
                            {!ev.vendorFlagged ? (
                              <GatedButton
                                allowed={can("contract.approveEvaluation")}
                                reason={denialReason("contract.approveEvaluation")}
                                onClick={() => {
                                  const updatedEvals = (c.performanceEvaluations || []).map(e =>
                                    e.id === ev.id ? { ...e, vendorFlagged: true } : e
                                  );
                                  updateContract(c.id, { performanceEvaluations: updatedEvals });
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[11px] font-medium hover:bg-red-700"
                              >
                                <Flag size={12} /> Flag Vendor
                              </GatedButton>
                            ) : (
                              <div className="flex items-center gap-2 text-[11px] text-red-600 font-medium">
                                <Flag size={12} /> Vendor has been flagged for management review
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Star size={24} className="text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400">No performance evaluations yet</p>
                </div>
              )}
            </div>
          )}

          {/* ── CLOSE-OUT ── */}
          {detailTab === "closeout" && <CloseOutTab contract={c} />}

          {/* ── DOCUMENTS ── */}
          {detailTab === "documents" && <DocumentsTab contract={c} />}

          {/* ── AUDIT TRAIL ── */}
          {detailTab === "audit" && (() => {
            const logs = c.auditLog || [];
            return (
              <div className="flex-1 overflow-auto">
                <div className="px-6 py-3 bg-white border-b border-slate-200">
                  <p className="text-[12px] text-slate-500">{logs.length} action(s) recorded</p>
                </div>
                {logs.length > 0 ? (
                  <table className="w-full">
                    <thead style={{ backgroundColor: "#0B01D0" }}>
                      <tr>
                        {["Date", "Action", "Performed By", "Details"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...logs].reverse().map((entry, i) => (
                        <tr key={entry.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                          <td className="px-4 py-3 text-[11px] text-slate-600 whitespace-nowrap">{fmtDate(entry.date)}</td>
                          <td className="px-4 py-3">
                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                              entry.action.includes("Created") ? "bg-blue-100 text-blue-700" :
                              entry.action.includes("Payment") ? "bg-emerald-100 text-emerald-700" :
                              entry.action.includes("Submitted") ? "bg-amber-100 text-amber-700" :
                              entry.action.includes("Accepted") || entry.action.includes("Approved") ? "bg-emerald-100 text-emerald-700" :
                              entry.action.includes("Rejected") || entry.action.includes("Flagged") ? "bg-red-100 text-red-700" :
                              "bg-slate-100 text-slate-600"
                            )}>{entry.action}</span>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{entry.performedBy}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-600 max-w-[300px]">{entry.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <ClipboardList size={24} className="text-slate-300 mb-2" />
                    <p className="text-[13px] text-slate-400">No audit log entries yet</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── MODALS ── */}
        {showChangeModal && <ChangeRequestModal contract={c} onClose={() => setShowChangeModal(false)} />}
        {showEvalModal && <EvaluationModal contract={c} onClose={() => setShowEvalModal(false)} />}
        {showInvoiceModal && <InvoiceModal contract={c} onClose={() => setShowInvoiceModal(false)} />}
        {showDeliverableModal && <DeliverableUploadModal contract={c} onClose={() => setShowDeliverableModal(false)} />}
        {showSetupModal && <ContractRegistrationModal existing={c} onClose={() => setShowSetupModal(false)} />}
      </div>
    );
  }

  /* ═══ LIST VIEW ═════════════════════════════════════════════════════════════ */

  const dashboardStats: ProcurementStat[] = [
    { label: "Total Contract Value", value: fmt(totalValue), sub: `${contracts.length} contracts`, icon: <DollarSign size={14} />, tone: "success" },
    { label: "Active Contracts", value: String(activeContracts), sub: "In execution", icon: <CheckCircle size={14} />, tone: "info" },
    { label: "Pending Deliverables", value: String(pendingDeliverables), sub: "Awaiting action", icon: <Package size={14} />, tone: "warning" },
    { label: "Unpaid Invoices", value: String(overdueInvoices), sub: "In pipeline", icon: <Clock size={14} />, tone: "accent" },
    { label: "Pending Variations", value: String(pendingChanges), sub: "Awaiting approval", icon: <AlertTriangle size={14} />, tone: "danger" },
  ];

  // Only the conditions that are actually live get a card, so a quiet register
  // shows no alert row at all.
  const alertStats: ProcurementStat[] = [];
  if (overdueDeliverables.length > 0) {
    alertStats.push({
      label: "Overdue Deliverables",
      value: overdueDeliverables.length,
      sub: `Worst ${overdueDeliverables[0].daysOverdue} day(s) on ${overdueDeliverables[0].contract.contractNumber}`,
      icon: <Clock size={14} />,
      tone: "danger",
    });
  }
  if (shellContracts.length > 0) {
    alertStats.push({
      label: "Setup Incomplete",
      value: shellContracts.length,
      sub: "Need coordinators and a schedule",
      icon: <Settings2 size={14} />,
      tone: "warning",
    });
  }
  if (expiringContracts.length > 0) {
    alertStats.push({
      label: "Contract Expiry",
      value: expiringContracts.length,
      sub: "Expiring within 60 days",
      icon: <AlertTriangle size={14} />,
      tone: "danger",
    });
  }
  if (pendingCC > 0) {
    alertStats.push({
      label: "Coordinator Actions",
      value: pendingCC,
      sub: "Pending CC review",
      icon: <Users size={14} />,
      tone: "info",
    });
  }
  if (pendingProcurement > 0) {
    alertStats.push({
      label: "Procurement Actions",
      value: pendingProcurement,
      sub: "Invoice(s) awaiting procurement review",
      icon: <Shield size={14} />,
      tone: "accent",
    });
  }
  if (pendingFinance > 0) {
    alertStats.push({
      label: "Finance Actions",
      value: pendingFinance,
      sub: "Invoice(s) ready for payment",
      icon: <DollarSign size={14} />,
      tone: "success",
    });
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-slate-900">Contract Management</h1>
            <p className="text-[11px] text-slate-400">Signed in as {user.name} — {user.roles.join(", ")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => printDocument("Contract Register", `
                <h1>Contract Register</h1>
                <p class="muted">${esc(filtered.length)} contract(s) matching the current filters.</p>
                <table>
                  <thead><tr><th>Contract #</th><th>Title</th><th>Vendor</th><th>Value</th><th>End Date</th><th>Status</th></tr></thead>
                  <tbody>${filtered.map(row => `<tr><td>${esc(row.contractNumber)}</td><td>${esc(row.title)}</td><td>${esc(row.party)}</td><td>${esc(fmt(row.value))}</td><td>${esc(fmtDate(row.endDate))}</td><td>${esc(row.status)}</td></tr>`).join("")}</tbody>
                </table>`)}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"
            >
              <Printer size={14} /> Print
            </button>
            <ExportMenu build={() => contractsExportSet(filtered)} />
          </div>
        </div>
      </div>

      {/* Dashboard KPIs */}
      <ProcurementStatCards stats={dashboardStats} />

      {/* Alerts */}
      <ProcurementStatCards stats={alertStats} />

      {/* Tabs + Search */}
      <ProcurementTabBar>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <ProcurementTabs tabs={tabs} active={activeTab} onChange={setActiveTab} minWidth={100} />
          <div className="flex items-center gap-2">
            <GatedButton
              allowed={can("contract.register")}
              reason={denialReason("contract.register")}
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0901A0] transition-colors"
            >
              <Plus size={13} /> Register Contract
            </GatedButton>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white w-48">
              <Search size={13} className="text-slate-400" />
              <input type="text" placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent outline-none text-[11px] text-slate-700 placeholder:text-slate-400" />
            </div>
            <div className="relative">
              <button onClick={() => setShowCatDD(!showCatDD)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {catFilter} <ChevronDown size={12} />
              </button>
              {showCatDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => { setCatFilter(cat); setShowCatDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", catFilter === cat && "bg-slate-50 font-medium text-[#0B01D0]")}>{cat}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ProcurementTabBar>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Contract #", "Title", "Vendor / Consultant", "Category", "Value", "Start", "End", "Status", "Coordinators", "Deliverables"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c, i) => {
              const delPending = (c.deliverables || []).filter(d => d.status !== "Accepted").length;
              const delTotal = (c.deliverables || []).length;
              return (
                <tr key={c.id} onClick={() => openContract(c)} className={cn("border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium">
                    <span className="flex items-center gap-1.5">
                      {c.contractNumber}
                      {needsSetup(c) && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-700 rounded-full text-[9px] font-semibold" title="Awarded from Sourcing — coordinators and schedule not yet captured">
                          <Settings2 size={9} /> Setup
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium max-w-[180px] truncate">{c.title}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">
                    <span className="flex items-center gap-1.5">
                      {c.party}
                      {(() => {
                        const evals = c.performanceEvaluations || [];
                        const latest = evals.length > 0 ? evals[evals.length - 1] : null;
                        return latest && latest.overallScore < 5 ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 border border-red-300 text-red-700 rounded-full text-[9px] font-semibold shrink-0" title={`Latest score: ${latest.overallScore.toFixed(1)}/10`}>
                            <AlertTriangle size={10} /> Poor Performer
                          </span>
                        ) : null;
                      })()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{c.category}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">{fmt(c.value)}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{fmtDate(c.startDate)}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{fmtDate(c.endDate)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium", STATUS_COLORS[c.status] || "bg-slate-100 text-slate-600")}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-500">{(c.coordinators || []).length}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-500">{delTotal > 0 ? `${delTotal - delPending}/${delTotal}` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText size={24} className="text-slate-300 mb-2" />
            <p className="text-[13px] text-slate-400">No contracts found</p>
          </div>
        )}
      </div>

      {showRegisterModal && <ContractRegistrationModal onClose={() => setShowRegisterModal(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TAB: Deliverables
   ═══════════════════════════════════════════════════════════════════════════════ */

function DeliverablesTab({ contract: c, onUpload }: { contract: AwardedContract; onUpload: () => void }) {
  useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<{ deliverable: ContractDeliverable; decision: "Accepted" | "Rejected" } | null>(null);
  const deliverables = c.deliverables ?? [];

  const canReview = can("contract.reviewDeliverable");
  const canUpload = can("contract.uploadDeliverable");
  const physical = c.category === "Goods" || c.category === "Works";

  const markUnderReview = (d: ContractDeliverable) => {
    const res = reviewDeliverable(c.id, d.id, "Under Review", getCurrentUser().name, "");
    setError(res.ok ? null : res.error ?? "The deliverable could not be moved to review.");
  };

  const attachMore = async (d: ContractDeliverable) => {
    const files = await choose(setError, { uploadedBy: getCurrentUser().name });
    if (!files.length) return;
    updateDeliverable(c.id, d.id, { documents: [...d.documents, ...files.map(f => f.name)] }, getCurrentUser().name);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <p className="text-[12px] text-slate-500">
          {deliverables.length} deliverable(s) — {deliverables.filter(d => d.status === "Accepted").length} accepted,{" "}
          {deliverables.filter(d => d.status === "Submitted" || d.status === "Under Review").length} awaiting review
        </p>
        <GatedButton
          allowed={canUpload}
          reason={denialReason("contract.uploadDeliverable")}
          onClick={onUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"
        >
          <Plus size={12} /> Upload Deliverable
        </GatedButton>
      </div>

      {error && <div className="px-6 pt-3"><ErrorNote message={error} /></div>}

      <table className="w-full">
        <thead style={{ backgroundColor: "#0B01D0" }}>
          <tr>
            {["Milestone", "Description", "Due Date", "Actual Date", "Status", "Amount", "Documents", "Submitted / Reviewed", "Actions"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {deliverables.map((d, i) => {
            const ms = c.milestones.find(m => m.id === d.milestoneRef);
            const overdue = d.status !== "Accepted" && daysUntil(d.dueDate) < 0;
            const actionable = d.status !== "Accepted" && c.status !== "Closed";
            return (
              <tr key={d.id} className={cn("hover:bg-slate-50 transition-colors align-top", i % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{ms?.label || d.milestoneRef}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600 max-w-[200px]">
                  {d.description}
                  {physical && (d.goodsReceived || d.inspectionPassed) && (
                    <span className="flex flex-wrap gap-1 mt-1">
                      {d.goodsReceived && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-medium">Goods received</span>}
                      {d.inspectionPassed && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-medium">Inspection passed</span>}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600 whitespace-nowrap">
                  {fmtDate(d.dueDate)}
                  {overdue && <span className="block text-[9px] text-red-600 font-semibold">{-daysUntil(d.dueDate)}d overdue</span>}
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(d.actualDate)}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", DEL_COLORS[d.status] || "bg-slate-100 text-slate-600")}>{d.status}</span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-700 font-medium whitespace-nowrap">{d.amount ? fmt(d.amount) : "—"}</td>
                <td className="px-4 py-3">
                  {d.documents.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {d.documents.map((doc, n) => <AttachmentChip key={n} name={doc} />)}
                    </div>
                  ) : <span className="text-[11px] text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3 text-[10px] text-slate-500 max-w-[150px]">
                  {d.submittedBy && <p>Submitted by <span className="text-slate-700 font-medium">{d.submittedBy}</span></p>}
                  {d.reviewedBy && <p>{d.status} by <span className="text-slate-700 font-medium">{d.reviewedBy}</span> {fmtDate(d.reviewDate)}</p>}
                  {(d.reviewComments || d.comments) && <p className="mt-0.5 text-slate-500 italic">{d.reviewComments || d.comments}</p>}
                  {!d.submittedBy && !d.reviewedBy && !d.comments && "—"}
                </td>
                <td className="px-4 py-3">
                  {actionable ? (
                    <div className="flex flex-wrap gap-1.5">
                      {d.status !== "Under Review" && (
                        <GatedButton
                          allowed={canReview}
                          reason={denialReason("contract.reviewDeliverable")}
                          onClick={() => markUnderReview(d)}
                          className="px-2 py-1 rounded border border-amber-300 bg-amber-50 text-amber-700 text-[10px] font-medium hover:bg-amber-100"
                        >
                          Under Review
                        </GatedButton>
                      )}
                      <GatedButton
                        allowed={canReview}
                        reason={denialReason("contract.reviewDeliverable")}
                        onClick={() => { setError(null); setReview({ deliverable: d, decision: "Accepted" }); }}
                        className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-medium hover:bg-emerald-700"
                      >
                        Accept
                      </GatedButton>
                      <GatedButton
                        allowed={canReview}
                        reason={denialReason("contract.reviewDeliverable")}
                        onClick={() => { setError(null); setReview({ deliverable: d, decision: "Rejected" }); }}
                        className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-medium hover:bg-red-700"
                      >
                        Reject
                      </GatedButton>
                      <GatedButton
                        allowed={canUpload}
                        reason={denialReason("contract.uploadDeliverable")}
                        onClick={() => { void attachMore(d); }}
                        className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 text-slate-600 text-[10px] font-medium hover:bg-slate-50"
                      >
                        <Paperclip size={9} /> Attach
                      </GatedButton>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400"><Lock size={9} /> Closed</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {deliverables.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Package size={24} className="text-slate-300 mb-2" />
          <p className="text-[13px] text-slate-400">No deliverables recorded yet</p>
        </div>
      )}

      {review && (
        <DeliverableReviewModal
          contract={c}
          deliverable={review.deliverable}
          decision={review.decision}
          onClose={() => setReview(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Deliverable Review (second-person sign-off)
   ═══════════════════════════════════════════════════════════════════════════════ */

function DeliverableReviewModal({ contract: c, deliverable: d, decision, onClose }: {
  contract: AwardedContract;
  deliverable: ContractDeliverable;
  decision: "Accepted" | "Rejected";
  onClose: () => void;
}) {
  const user = useCurrentUser();
  const [comments, setComments] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rejecting = decision === "Rejected";

  const submit = () => {
    const res = reviewDeliverable(c.id, d.id, decision, user.name, comments);
    if (!res.ok) { setError(res.error ?? "The review could not be recorded."); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-900">{rejecting ? "Reject" : "Accept"} Deliverable</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 space-y-1">
            <p className="text-[12px] font-medium text-slate-800">{d.description}</p>
            <p className="text-[10px] text-slate-500">Due {fmtDate(d.dueDate)} · Current status {d.status}{d.amount ? ` · ${fmt(d.amount)}` : ""}</p>
            {d.submittedBy && <p className="text-[10px] text-slate-500">Submitted by {d.submittedBy}</p>}
            {d.documents.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {d.documents.map((doc, i) => <AttachmentChip key={i} name={doc} />)}
              </div>
            )}
          </div>

          {(c.category === "Goods" || c.category === "Works") && (
            <div className="grid grid-cols-2 gap-3">
              {([["Goods received note", d.goodsReceived], ["Inspection passed", d.inspectionPassed]] as const).map(([label, flag]) => (
                <div key={label} className={cn("px-3 py-2 rounded-lg border text-[11px] font-medium", flag ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700")}>
                  {flag ? "✓ " : "! "}{label}{flag ? " confirmed" : " not confirmed"}
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">
              {rejecting ? "Reason for rejection *" : "Review comments"}
            </label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20"
              placeholder={rejecting ? "Explain what must be corrected before resubmission..." : "Optional notes on the acceptance..."}
            />
          </div>

          <p className="text-[10px] text-slate-400">
            Recorded against {user.name} ({user.roles.join(", ")}). A deliverable cannot be approved by the person who submitted it.
          </p>
          <ErrorNote message={error} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button
            onClick={submit}
            disabled={rejecting && !comments.trim()}
            className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white",
              rejecting
                ? comments.trim() ? "bg-red-600 hover:bg-red-700" : "bg-slate-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700")}
          >
            {rejecting ? "Reject Deliverable" : "Accept Deliverable"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Deliverable Upload (CC)
   ═══════════════════════════════════════════════════════════════════════════════ */

function DeliverableUploadModal({ contract: c, onClose }: { contract: AwardedContract; onClose: () => void }) {
  const user = useCurrentUser();
  const milestones = c.milestones || [];
  const [milestoneRef, setMilestoneRef] = useState(milestones[0]?.id || "");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(milestones[0]?.date || "");
  const [actualDate, setActualDate] = useState(todayISO());
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [deliverableComments, setDeliverableComments] = useState("");
  const [amount, setAmount] = useState("");
  const [goodsReceived, setGoodsReceived] = useState(false);
  const [inspectionPassed, setInspectionPassed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const physical = c.category === "Goods" || c.category === "Works";
  const ready = !!description.trim() && files.length > 0;

  const pick = async () => {
    const picked = await choose(setError, { uploadedBy: user.name });
    if (picked.length) setFiles(prev => [...prev, ...picked]);
  };

  const handleSubmit = () => {
    if (!description.trim()) { setError("A description is required."); return; }
    if (files.length === 0) { setError("Attach at least one file as evidence for this deliverable."); return; }
    const created = submitDeliverable(
      c.id,
      {
        milestoneRef,
        description: description.trim(),
        dueDate: dueDate || actualDate,
        actualDate: actualDate || undefined,
        documents: files.map(f => f.name),
        comments: deliverableComments,
        amount: parseFloat(amount) || undefined,
        ...(physical ? { goodsReceived, inspectionPassed } : {}),
      },
      user.name
    );
    if (!created) { setError("The deliverable could not be recorded against this contract."); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Upload Deliverable</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          {milestones.length > 0 && (
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Link to Milestone</label>
              <select
                value={milestoneRef}
                onChange={e => {
                  setMilestoneRef(e.target.value);
                  const ms = milestones.find(m => m.id === e.target.value);
                  if (ms) { setDueDate(ms.date); if (!description) setDescription(ms.label); }
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20"
              >
                <option value="">— None —</option>
                {milestones.map(ms => <option key={ms.id} value={ms.id}>{ms.label} ({fmtDate(ms.date)})</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Description *</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Deliverable description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Actual Submission Date</label>
              <input type="date" value={actualDate} onChange={e => setActualDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Payment Amount ($)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="0" />
          </div>

          {physical && (
            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Receipt & Inspection</label>
              {([
                ["Goods received note signed", goodsReceived, setGoodsReceived] as const,
                ["Inspection passed", inspectionPassed, setInspectionPassed] as const,
              ]).map(([label, checked, set]) => (
                <button
                  key={label}
                  onClick={() => set(!checked)}
                  className={cn("w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors", checked ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200 hover:bg-slate-50")}
                >
                  <span className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0", checked ? "bg-emerald-500 border-emerald-500" : "border-slate-300")}>
                    {checked && <CheckCircle size={10} className="text-white" />}
                  </span>
                  <span className={cn("text-[11px] font-medium", checked ? "text-emerald-800" : "text-slate-600")}>{label}</span>
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Evidence Documents *</label>
            <button
              onClick={() => { void pick(); }}
              className="w-full border-2 border-dashed border-slate-200 rounded-lg p-5 text-center hover:border-[#0B01D0]/40 hover:bg-[#0B01D0]/[0.02] transition-colors"
            >
              <Upload size={18} className="text-slate-300 mx-auto mb-1.5" />
              <p className="text-[11px] text-slate-500 font-medium">Choose files to attach</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PDF, Office, images or ZIP up to 25 MB each</p>
            </button>
            {files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <FileText size={11} className="text-slate-400 shrink-0" />
                    <button onClick={() => openFile(f)} className="text-[11px] text-[#0B01D0] font-medium truncate hover:underline flex-1 text-left">{f.name}</button>
                    <span className="text-[10px] text-slate-400 shrink-0">{f.sizeLabel}</span>
                    <button onClick={() => setFiles(files.filter(x => x.id !== f.id))} className="text-slate-300 hover:text-red-500 shrink-0"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Comments</label>
            <textarea value={deliverableComments} onChange={e => setDeliverableComments(e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Notes about this deliverable..." />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <p className="text-[10px] text-blue-700">
              Submitted as <span className="font-semibold">{user.name}</span>. The deliverable is recorded as <span className="font-semibold">Submitted</span> and
              must be accepted by a second reviewer before it can support an invoice.
            </p>
          </div>
          <ErrorNote message={error} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!ready} className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white", ready ? "bg-[#0B01D0] hover:bg-[#0a01b8]" : "bg-slate-300 cursor-not-allowed")}>Submit Deliverable</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Contract Registration
   ═══════════════════════════════════════════════════════════════════════════════ */

const REG_CATEGORIES = ["Goods", "Services", "Works", "Consultancy"] as const;
const REG_METHODS = ["Open Competition", "Limited Competition", "Request for Quotation", "Direct Selection"] as const;
const REG_DEPARTMENTS = ["Programs", "Finance", "Admin", "IT", "HR", "M&E", "Communications", "Executive"] as const;
const REG_FUNDING = ["Core Program Funding", "Donor Grant — DFID", "Capital Expenditure Fund", "TAP", "ATTP", "Gates Foundation", "World Bank"] as const;
const F = "'Montserrat Variable', sans-serif";
const labelCls = "block text-[11px] font-medium text-slate-600 mb-1";
const inputCls = "w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B01D0] focus:border-[#0B01D0]";

interface DocSlot { label: string; file: UploadedFile | null }

/**
 * Registers a new contract, or — when `existing` is supplied — completes a
 * contract that arrived from a sourcing award as an empty shell.
 */
function ContractRegistrationModal({ existing, onClose }: { existing?: AwardedContract; onClose: () => void }) {
  const user = useCurrentUser();
  const enriching = !!existing;
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [error, setError] = useState<string | null>(null);

  // Step 1: Basic info
  const [title, setTitle] = useState(existing?.title ?? "");
  const [party, setParty] = useState(existing?.party ?? "");
  const [category, setCategory] = useState<string>(existing?.category ?? "Goods");
  const [method, setMethod] = useState<string>(existing?.method ?? "Open Competition");
  const [sourcePR, setSourcePR] = useState(existing?.sourcePR ?? "");
  const [contractNumber, setContractNumber] = useState(existing?.contractNumber ?? "");
  const [department, setDepartment] = useState(existing?.department ?? "Programs");
  const [owner, setOwner] = useState(existing?.owner ?? "");
  const [fundingSource, setFundingSource] = useState(existing?.fundingSource ?? "");
  const [budgetLine, setBudgetLine] = useState(existing?.budgetLine ?? "");
  const [comments, setComments] = useState(existing?.comments ?? "");

  // Step 2: Contract type, value, dates
  const [contractType, setContractType] = useState<"Lump Sum" | "Time Based">(existing?.contractType ?? "Lump Sum");
  const [value, setValue] = useState(existing ? String(existing.value) : "");
  const [maxAmount, setMaxAmount] = useState(existing?.maxAmount ? String(existing.maxAmount) : "");
  const [paymentFrequency, setPaymentFrequency] = useState<"Daily" | "Weekly" | "Monthly" | "Quarterly" | "Milestone-Based">(existing?.paymentFrequency ?? "Milestone-Based");
  const [startDate, setStartDate] = useState(existing?.startDate ?? "");
  const [endDate, setEndDate] = useState(existing?.endDate ?? "");
  const [renewalDate, setRenewalDate] = useState(existing?.renewalDate ?? "");

  // Step 3: Coordinators (up to 3)
  const [coordinators, setCoordinators] = useState<{ name: string; role: string; email: string }[]>(
    existing?.coordinators?.length
      ? existing.coordinators.map(cc => ({ name: cc.name, role: cc.role, email: cc.email }))
      : [{ name: "", role: "", email: "" }]
  );

  // Step 4: Milestones/Delivery + Payment Schedule
  const [milestones, setMilestones] = useState<{ label: string; date: string }[]>(
    existing?.milestones?.length
      ? existing.milestones.map(m => ({ label: m.label, date: m.date }))
      : [{ label: "", date: "" }]
  );
  const [deliverySchedule, setDeliverySchedule] = useState<{ item: string; quantity: string; expectedDate: string }[]>(
    existing?.deliverySchedule?.length ? existing.deliverySchedule.map(d => ({ ...d })) : [{ item: "", quantity: "", expectedDate: "" }]
  );
  const [paymentSchedule, setPaymentSchedule] = useState<{ description: string; amount: string; dueDate: string; linkedTo: string }[]>(
    existing?.paymentSchedule?.length
      ? existing.paymentSchedule.map(p => ({ ...p, amount: String(p.amount) }))
      : [{ description: "", amount: "", dueDate: "", linkedTo: "" }]
  );

  // Step 5: Documents — real files, attached to the contract on submit
  const [docSlots, setDocSlots] = useState<DocSlot[]>([
    { label: "Signed Contract", file: null },
    { label: "Purchase Order", file: null },
  ]);
  const [newSlotLabel, setNewSlotLabel] = useState("");

  // Auto-generate contract number when PR changes
  const handlePRChange = (v: string) => {
    setSourcePR(v);
    if (v.trim()) setContractNumber(generateContractNumber(v));
  };

  const pickForSlot = async (index: number) => {
    const picked = await choose(setError, { multiple: false, uploadedBy: user.name });
    if (!picked.length) return;
    setDocSlots(slots => slots.map((s, i) => (i === index ? { ...s, file: picked[0] } : s)));
  };

  const addDocSlot = () => {
    const label = newSlotLabel.trim();
    if (!label) return;
    setDocSlots(slots => [...slots, { label, file: null }]);
    setNewSlotLabel("");
  };

  // The signed contract or purchase order is what proves the award exists.
  const attachedSlots = docSlots.filter(s => s.file);
  const hasExecutedDoc =
    attachedSlots.some(s => /signed contract|purchase order/i.test(s.label)) ||
    (existing?.documents ?? []).some(g => /signed contract|purchase order/i.test(g.label));

  // Payments cannot promise more than the contract is worth.
  const parsedValue = parseFloat(value) || 0;
  const parsedMax = parseFloat(maxAmount) || 0;
  const paymentCeiling = contractType === "Time Based" && parsedMax > 0 ? parsedMax : parsedValue;
  const paymentTotal = paymentSchedule.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
  const paymentOverrun = paymentCeiling > 0 && paymentTotal > paymentCeiling;

  const addCoordinator = () => { if (coordinators.length < 3) setCoordinators([...coordinators, { name: "", role: "", email: "" }]); };
  const removeCoordinator = (i: number) => setCoordinators(coordinators.filter((_, idx) => idx !== i));
  const updateCoordinator = (i: number, field: string, val: string) => setCoordinators(coordinators.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const addMilestone = () => setMilestones([...milestones, { label: "", date: "" }]);
  const removeMilestone = (i: number) => setMilestones(milestones.filter((_, idx) => idx !== i));
  const updateMilestone = (i: number, field: string, val: string) => setMilestones(milestones.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const addDelivery = () => setDeliverySchedule([...deliverySchedule, { item: "", quantity: "", expectedDate: "" }]);
  const removeDelivery = (i: number) => setDeliverySchedule(deliverySchedule.filter((_, idx) => idx !== i));
  const updateDelivery = (i: number, field: string, val: string) => setDeliverySchedule(deliverySchedule.map((d, idx) => idx === i ? { ...d, [field]: val } : d));

  const addPayment = () => setPaymentSchedule([...paymentSchedule, { description: "", amount: "", dueDate: "", linkedTo: "" }]);
  const removePayment = (i: number) => setPaymentSchedule(paymentSchedule.filter((_, idx) => idx !== i));
  const updatePayment = (i: number, field: string, val: string) => setPaymentSchedule(paymentSchedule.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  const canNext = () => {
    if (step === 1) return !!(title && party && sourcePR && owner);
    if (step === 2) return !!(value && startDate && endDate);
    if (step === 3) return coordinators.some(c => c.name && c.email);
    if (step === 4) {
      if (paymentOverrun) return false;
      return category === "Goods" ? deliverySchedule.some(d => d.item) : milestones.some(m => m.label && m.date);
    }
    return true;
  };

  const handleSubmit = () => {
    const stamp = Date.now();
    const coordsClean: ContractCoordinator[] = coordinators
      .filter(c => c.name && c.email)
      .map((c, i) => ({ id: `cc-reg-${stamp}-${i}`, ...c }));
    const msClean: ContractMilestone[] = milestones
      .filter(m => m.label && m.date)
      .map((m, i) => ({ id: `ms-reg-${stamp}-${i}`, ...m, completed: false }));
    const delSched = category === "Goods" ? deliverySchedule.filter(d => d.item) : undefined;
    const paySched = paymentSchedule
      .filter(p => p.description && p.amount)
      .map(p => ({ ...p, amount: parseFloat(p.amount) || 0 }));

    if (paymentOverrun) {
      setError(`The payment schedule totals ${fmt(paymentTotal)}, above the ${fmt(paymentCeiling)} the contract allows.`);
      return;
    }
    if (!hasExecutedDoc) {
      setError("Attach the signed contract or purchase order before completing registration.");
      return;
    }

    if (enriching && existing) {
      const res = enrichContract(existing.id, {
        title,
        value: parseFloat(value) || existing.value,
        startDate, endDate,
        renewalDate: renewalDate || undefined,
        contractType, paymentFrequency,
        maxAmount: contractType === "Time Based" ? parseFloat(maxAmount) || undefined : undefined,
        coordinators: coordsClean,
        milestones: msClean,
        deliverySchedule: delSched,
        paymentSchedule: paySched.length > 0 ? paySched : undefined,
        budgetLine: budgetLine || undefined,
        fundingSource: fundingSource || undefined,
      }, user.name);
      if (!res.ok) { setError(res.error ?? "The contract could not be updated."); return; }
      attachedSlots.forEach(s => s.file && attachContractDocument(existing.id, s.file, s.label, user.name));
      onClose();
      return;
    }

    const created = registerContract({
      title,
      party,
      sourcePR,
      category,
      method,
      value: parseFloat(value) || 0,
      startDate,
      endDate,
      renewalDate: renewalDate || undefined,
      department,
      owner,
      comments,
      contractType,
      paymentFrequency,
      maxAmount: contractType === "Time Based" ? parseFloat(maxAmount) || undefined : undefined,
      coordinators: coordsClean,
      milestones: msClean,
      deliverySchedule: delSched,
      paymentSchedule: paySched.length > 0 ? paySched : undefined,
      budgetLine: budgetLine || undefined,
      fundingSource: fundingSource || undefined,
    });
    attachedSlots.forEach(s => s.file && attachContractDocument(created.id, s.file, s.label, user.name));
    const fresh = getContracts().find(x => x.id === created.id);
    if (fresh) syncContractReminders(fresh);
    onClose();
  };

  const stepLabels = ["Contract Details", "Type & Dates", "Coordinators", category === "Goods" ? "Delivery & Payment" : "Milestones & Payment", "Documents & Review"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{ fontFamily: F }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[720px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">{enriching ? "Complete Contract Setup" : "Register New Contract"}</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {enriching && <span className="text-amber-600 font-medium">{existing?.contractNumber} · </span>}
              Step {step} of {totalSteps}: {stepLabels[step - 1]}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-3 flex gap-1 shrink-0">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < step ? "bg-[#0B01D0]" : "bg-slate-200")} />
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex-1 overflow-y-auto space-y-4">
          {step === 1 && (
            <>
              {enriching && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-amber-700">
                    This contract was awarded through Sourcing. The award terms below are fixed; capture the coordinators,
                    schedule and documents so delivery and payment can be tracked.
                  </p>
                </div>
              )}
              <div><label className={labelCls}>Requisition Number (Source PR)</label><input className={cn(inputCls, enriching && "bg-slate-50")} value={sourcePR} onChange={e => handlePRChange(e.target.value)} readOnly={enriching} placeholder="e.g. PR-2025-021" /></div>
              <div className="flex items-center gap-2">
                <div className="flex-1"><label className={labelCls}>Contract Number {enriching ? "" : "(Auto-generated)"}</label><input className={cn(inputCls, "bg-slate-50")} value={contractNumber} readOnly /></div>
              </div>
              <div><label className={labelCls}>Contract Title</label><input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Consultant Fees — Survey Design" /></div>
              <div><label className={labelCls}>Vendor / Consultant Name</label><input className={cn(inputCls, enriching && "bg-slate-50")} value={party} onChange={e => setParty(e.target.value)} readOnly={enriching} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Category</label><select className={cn(inputCls, enriching && "bg-slate-50")} value={category} onChange={e => setCategory(e.target.value)} disabled={enriching}>{REG_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className={labelCls}>Procurement Method</label><select className={cn(inputCls, enriching && "bg-slate-50")} value={method} onChange={e => setMethod(e.target.value)} disabled={enriching}>{REG_METHODS.map(m => <option key={m}>{m}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Department</label><select className={cn(inputCls, enriching && "bg-slate-50")} value={department} onChange={e => setDepartment(e.target.value)} disabled={enriching}>{REG_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div><label className={labelCls}>Contract Owner</label><input className={cn(inputCls, enriching && "bg-slate-50")} value={owner} onChange={e => setOwner(e.target.value)} readOnly={enriching} placeholder="Person responsible" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Funding Source</label><select className={inputCls} value={fundingSource} onChange={e => setFundingSource(e.target.value)}><option value="">Select...</option>{REG_FUNDING.map(f => <option key={f}>{f}</option>)}</select></div>
                <div><label className={labelCls}>Budget Line</label><input className={inputCls} value={budgetLine} onChange={e => setBudgetLine(e.target.value)} placeholder="e.g. BL-2025-PROG-001" /></div>
              </div>
              <div><label className={labelCls}>Notes / Comments</label><textarea className={cn(inputCls, "h-16 resize-none", enriching && "bg-slate-50")} value={comments} onChange={e => setComments(e.target.value)} readOnly={enriching} /></div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className={labelCls}>Contract Type</label>
                <div className="flex gap-3 mt-1">
                  {(["Lump Sum", "Time Based"] as const).map(t => (
                    <button key={t} onClick={() => setContractType(t)} className={cn("flex-1 px-4 py-3 rounded-lg border-2 text-[12px] font-medium transition-all", contractType === t ? "border-[#0B01D0] bg-[#0B01D0]/5 text-[#0B01D0]" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
                      <div className="font-semibold">{t}</div>
                      <div className="text-[10px] mt-0.5 font-normal">{t === "Lump Sum" ? "Fixed price, paid on deliverables/milestones" : "Daily, weekly, or monthly rate up to max amount"}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Contract Value (USD)</label><input type="number" className={inputCls} value={value} onChange={e => setValue(e.target.value)} placeholder="0.00" /></div>
                {contractType === "Time Based" && (
                  <div><label className={labelCls}>Maximum Amount (USD)</label><input type="number" className={inputCls} value={maxAmount} onChange={e => setMaxAmount(e.target.value)} placeholder="Cap amount" /></div>
                )}
              </div>

              <div>
                <label className={labelCls}>Payment Frequency</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(contractType === "Time Based"
                    ? ["Daily", "Weekly", "Monthly", "Quarterly"] as const
                    : ["Milestone-Based", "Monthly", "Quarterly"] as const
                  ).map(f => (
                    <button key={f} onClick={() => setPaymentFrequency(f as typeof paymentFrequency)} className={cn("px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors", paymentFrequency === f ? "border-[#0B01D0] bg-[#0B01D0]/5 text-[#0B01D0]" : "border-slate-200 text-slate-500 hover:border-slate-300")}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelCls}>Start Date</label><input type="date" className={inputCls} value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div><label className={labelCls}>End Date</label><input type="date" className={inputCls} value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
                <div><label className={labelCls}>Renewal Date (optional)</label><input type="date" className={inputCls} value={renewalDate} onChange={e => setRenewalDate(e.target.value)} /></div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">Contract Coordinators</p>
                  <p className="text-[10px] text-slate-400">Assign up to 3 coordinators who will receive notifications on this contract</p>
                </div>
                {coordinators.length < 3 && (
                  <button onClick={addCoordinator} className="flex items-center gap-1 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add</button>
                )}
              </div>
              {coordinators.map((c, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-slate-600">Coordinator {i + 1}</p>
                    {coordinators.length > 1 && <button onClick={() => removeCoordinator(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className={labelCls}>Full Name</label><input className={inputCls} value={c.name} onChange={e => updateCoordinator(i, "name", e.target.value)} /></div>
                    <div><label className={labelCls}>Role</label><input className={inputCls} value={c.role} onChange={e => updateCoordinator(i, "role", e.target.value)} placeholder="e.g. Lead Coordinator" /></div>
                    <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={c.email} onChange={e => updateCoordinator(i, "email", e.target.value)} /></div>
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 4 && (
            <>
              {category === "Goods" ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">Delivery Schedule</p>
                      <p className="text-[10px] text-slate-400">Define items, quantities, and expected delivery dates</p>
                    </div>
                    <button onClick={addDelivery} className="flex items-center gap-1 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add Item</button>
                  </div>
                  {deliverySchedule.map((d, i) => (
                    <div key={i} className="flex items-end gap-3">
                      <div className="flex-1"><label className={labelCls}>Item Description</label><input className={inputCls} value={d.item} onChange={e => updateDelivery(i, "item", e.target.value)} /></div>
                      <div className="w-24"><label className={labelCls}>Quantity</label><input className={inputCls} value={d.quantity} onChange={e => updateDelivery(i, "quantity", e.target.value)} /></div>
                      <div className="w-36"><label className={labelCls}>Expected Date</label><input type="date" className={inputCls} value={d.expectedDate} onChange={e => updateDelivery(i, "expectedDate", e.target.value)} /></div>
                      {deliverySchedule.length > 1 && <button onClick={() => removeDelivery(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5"><X size={14} /></button>}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{contractType === "Lump Sum" ? "Project Milestones / Deliverables" : "Timeline-Based Deliverables"}</p>
                      <p className="text-[10px] text-slate-400">{contractType === "Lump Sum" ? "Define deliverables tied to payment milestones" : `Payments made ${paymentFrequency.toLowerCase()} up to ${maxAmount ? fmt(parseFloat(maxAmount)) : "max amount"}`}</p>
                    </div>
                    <button onClick={addMilestone} className="flex items-center gap-1 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add</button>
                  </div>
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-end gap-3">
                      <div className="flex-1"><label className={labelCls}>Milestone / Deliverable</label><input className={inputCls} value={m.label} onChange={e => updateMilestone(i, "label", e.target.value)} placeholder="e.g. Inception Report" /></div>
                      <div className="w-36"><label className={labelCls}>Due Date</label><input type="date" className={inputCls} value={m.date} onChange={e => updateMilestone(i, "date", e.target.value)} /></div>
                      {milestones.length > 1 && <button onClick={() => removeMilestone(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5"><X size={14} /></button>}
                    </div>
                  ))}
                </>
              )}

              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">Payment Schedule</p>
                    <p className="text-[10px] text-slate-400">Tie payments to deliverables or timelines</p>
                  </div>
                  <button onClick={addPayment} className="flex items-center gap-1 text-[11px] text-[#0B01D0] font-medium hover:underline"><Plus size={12} /> Add</button>
                </div>
                {paymentSchedule.map((p, i) => (
                  <div key={i} className="flex items-end gap-3 mb-2">
                    <div className="flex-1"><label className={labelCls}>Description</label><input className={inputCls} value={p.description} onChange={e => updatePayment(i, "description", e.target.value)} placeholder="e.g. Upon Inception Report" /></div>
                    <div className="w-28"><label className={labelCls}>Amount (USD)</label><input type="number" className={inputCls} value={p.amount} onChange={e => updatePayment(i, "amount", e.target.value)} /></div>
                    <div className="w-36"><label className={labelCls}>Due Date</label><input type="date" className={inputCls} value={p.dueDate} onChange={e => updatePayment(i, "dueDate", e.target.value)} /></div>
                    <div className="w-36"><label className={labelCls}>Linked To</label><input className={inputCls} value={p.linkedTo} onChange={e => updatePayment(i, "linkedTo", e.target.value)} placeholder="Milestone / Item" /></div>
                    {paymentSchedule.length > 1 && <button onClick={() => removePayment(i)} className="p-2 text-red-400 hover:text-red-600 mb-0.5"><X size={14} /></button>}
                  </div>
                ))}

                {/* The schedule must not promise more than the contract is worth */}
                <div className={cn(
                  "mt-2 flex items-center justify-between px-3 py-2 rounded-lg border",
                  paymentOverrun ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"
                )}>
                  <span className={cn("text-[11px] font-medium", paymentOverrun ? "text-red-700" : "text-slate-600")}>
                    Scheduled total
                  </span>
                  <span className={cn("text-[12px] font-semibold", paymentOverrun ? "text-red-700" : "text-slate-800")}>
                    {fmt(paymentTotal)} of {paymentCeiling > 0 ? fmt(paymentCeiling) : "—"}
                  </span>
                </div>
                {paymentOverrun && (
                  <p className="text-[10px] text-red-600 mt-1.5">
                    The payment schedule exceeds the {contractType === "Time Based" && parsedMax > 0 ? "maximum amount" : "contract value"} by{" "}
                    {fmt(paymentTotal - paymentCeiling)}. Reduce the scheduled payments or raise the contract value before continuing.
                  </p>
                )}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <p className="text-[13px] font-semibold text-slate-800">Contract Documents</p>
              <p className="text-[10px] text-slate-400 -mt-2">
                The signed contract or purchase order must be attached before the contract can be registered. Files stay
                available to open from the Documents tab.
              </p>

              <div className="space-y-2">
                {docSlots.map((slot, i) => (
                  <div key={`${slot.label}-${i}`} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                    <Upload size={14} className={slot.file ? "text-emerald-500" : "text-slate-400"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-slate-700">{slot.label}</p>
                      {slot.file && (
                        <button onClick={() => slot.file && openFile(slot.file)} className="text-[10px] text-[#0B01D0] font-medium hover:underline truncate block max-w-full text-left">
                          {slot.file.name} · {slot.file.sizeLabel}
                        </button>
                      )}
                    </div>
                    {slot.file ? (
                      <>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Attached</span>
                        <button onClick={() => setDocSlots(slots => slots.map((s, n) => n === i ? { ...s, file: null } : s))} className="text-slate-300 hover:text-red-500"><X size={13} /></button>
                      </>
                    ) : (
                      <button onClick={() => { void pickForSlot(i); }} className="px-2.5 py-1 rounded-lg bg-[#0B01D0] text-white text-[10px] font-medium hover:bg-[#0901A0]">Choose file</button>
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    className={cn(inputCls, "flex-1")}
                    value={newSlotLabel}
                    onChange={e => setNewSlotLabel(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addDocSlot()}
                    placeholder="Add another document, e.g. Bill of Quantities"
                  />
                  <button onClick={addDocSlot} disabled={!newSlotLabel.trim()} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium", newSlotLabel.trim() ? "text-[#0B01D0] hover:bg-[#0B01D0]/5" : "text-slate-300 cursor-not-allowed")}>
                    <Plus size={12} /> Add slot
                  </button>
                </div>
                {!hasExecutedDoc && (
                  <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-amber-700">Attach the signed contract or the purchase order to continue.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4 mt-4">
                <p className="text-[13px] font-semibold text-slate-800 mb-3">Review Summary</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
                  {[
                    ["Contract Number", contractNumber],
                    ["Contract Title", title],
                    ["Vendor / Consultant", party],
                    ["Category", category],
                    ["Contract Type", contractType],
                    ["Value", value ? fmt(parseFloat(value)) : "—"],
                    ["Payment Frequency", paymentFrequency],
                    ["Start Date", startDate ? fmtDate(startDate) : "—"],
                    ["End Date", endDate ? fmtDate(endDate) : "—"],
                    ["Renewal Date", renewalDate ? fmtDate(renewalDate) : "N/A"],
                    ["Department", department],
                    ["Owner", owner],
                    ["Coordinators", coordinators.filter(c => c.name).map(c => c.name).join(", ") || "—"],
                    ["Funding Source", fundingSource || "—"],
                    ["Payment Schedule", paymentTotal > 0 ? `${fmt(paymentTotal)} across ${paymentSchedule.filter(p => p.description && p.amount).length} payment(s)` : "—"],
                    ["Documents Attached", attachedSlots.map(s => s.label).join(", ") || "None"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">{k}</span>
                      <span className="text-slate-800 font-medium text-right max-w-[200px] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 shrink-0 space-y-2">
          {error && <ErrorNote message={error} />}
          <div className="flex items-center justify-between">
            <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="px-4 py-2 text-[12px] font-medium text-slate-600 hover:text-slate-900">{step > 1 ? "Back" : "Cancel"}</button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">{step}/{totalSteps}</span>
              {step < totalSteps ? (
                <button disabled={!canNext()} onClick={() => setStep(step + 1)} className={cn("px-5 py-2 rounded-lg text-[12px] font-medium text-white transition-colors", canNext() ? "bg-[#0B01D0] hover:bg-[#0901A0]" : "bg-slate-300 cursor-not-allowed")}>Next</button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!hasExecutedDoc}
                  className={cn("px-5 py-2 rounded-lg text-[12px] font-medium text-white", hasExecutedDoc ? "bg-[#0B01D0] hover:bg-[#0901A0]" : "bg-slate-300 cursor-not-allowed")}
                >
                  {enriching ? "Save Contract Setup" : "Register Contract"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TAB: Change Management
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Where a change request stands in the Dept → Procurement → Finance → Senior chain. */
function changeChainState(cr: ContractChangeRequest) {
  const trail = cr.approvalTrail ?? [];
  const approvals = trail.filter(t => t.action === "Approved");
  const rejection = trail.find(t => t.action === "Rejected");
  const nextIndex = approvals.length;
  const nextRole: ProcurementRole | undefined =
    cr.status === "Pending Approval" ? CHANGE_APPROVAL_CHAIN[nextIndex] : undefined;
  return { trail, approvals, rejection, nextIndex, nextRole };
}

function ChangeChainProgress({ cr }: { cr: ContractChangeRequest }) {
  const { approvals, rejection, nextRole } = changeChainState(cr);
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2.5">Approval Chain</p>
      <div className="flex items-center gap-1">
        {CHANGE_APPROVAL_CHAIN.map((role, i) => {
          const signed = approvals[i];
          const rejectedHere = rejection && i === approvals.length;
          const current = role === nextRole;
          return (
            <div key={role} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1 min-w-[92px]">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm",
                  signed ? "bg-emerald-500" : rejectedHere ? "bg-red-500" : current ? "bg-amber-400" : "bg-slate-200"
                )}>
                  {signed ? <CheckCircle size={12} className="text-white" />
                    : rejectedHere ? <X size={12} className="text-white" />
                    : current ? <Clock size={12} className="text-white" />
                    : <CircleDot size={12} className="text-slate-400" />}
                </div>
                <p className={cn("text-[9px] font-medium text-center leading-tight", signed ? "text-emerald-700" : current ? "text-amber-700" : "text-slate-400")}>{role}</p>
                {signed && <p className="text-[9px] text-slate-400 text-center leading-tight">{signed.by}<br />{fmtDate(signed.date)}</p>}
                {current && <p className="text-[9px] text-amber-600 font-semibold">Awaiting</p>}
              </div>
              {i < CHANGE_APPROVAL_CHAIN.length - 1 && (
                <div className={cn("h-0.5 flex-1 rounded", approvals[i + 1] || (signed && !rejection) ? "bg-emerald-300" : "bg-slate-200")} />
              )}
            </div>
          );
        })}
      </div>
      {rejection && (
        <p className="text-[10px] text-red-600 mt-2.5">
          Rejected by {rejection.by} ({rejection.role}) on {fmtDate(rejection.date)}: {rejection.comments}
        </p>
      )}
    </div>
  );
}

function ChangesTab({ contract: c, onNewChange }: { contract: AwardedContract; onNewChange: () => void }) {
  const user = useCurrentUser();
  const [decision, setDecision] = useState<{ cr: ContractChangeRequest; action: "approve" | "reject" } | null>(null);
  const changeRequests = c.changeRequests ?? [];

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <p className="text-[12px] text-slate-500">
          {changeRequests.length} change request(s) — {changeRequests.filter(cr => cr.status === "Pending Approval").length} awaiting approval
        </p>
        <GatedButton
          allowed={anyCan(DOC_UPLOAD_CAPS)}
          reason={anyDenial(DOC_UPLOAD_CAPS)}
          onClick={onNewChange}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"
        >
          <Plus size={12} /> New Change Request
        </GatedButton>
      </div>

      {changeRequests.length > 0 ? (
        <div className="max-w-5xl mx-auto py-6 px-4 space-y-4">
          {changeRequests.map(cr => {
            const { nextRole } = changeChainState(cr);
            const isTurn = !!nextRole;
            const canApprove = isTurn && hasRole(nextRole);
            const canReject = isTurn && (hasRole(nextRole) || can("contract.approveChange"));
            return (
              <div key={cr.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold text-slate-800">Amendment #{cr.changeNumber}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", CR_COLORS[cr.status])}>{cr.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Requested {fmtDate(cr.requestedDate)} by {cr.requestedBy}</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {cr.types.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium">{t}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Reason</p>
                      <p className="text-[11px] text-slate-700">{cr.reason}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Description</p>
                      <p className="text-[11px] text-slate-700">{cr.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-center">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Cost Impact</p>
                      <p className="text-[13px] font-semibold text-slate-800">{fmt(cr.estimatedCostImpact)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-center">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Time Impact</p>
                      <p className="text-[13px] font-semibold text-slate-800">{cr.estimatedTimeImpact}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-center">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised Value</p>
                      <p className="text-[13px] font-semibold text-emerald-600">{cr.revisedValue ? fmt(cr.revisedValue) : "—"}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-center">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised End Date</p>
                      <p className="text-[13px] font-semibold text-slate-800">{cr.revisedEndDate ? fmtDate(cr.revisedEndDate) : "—"}</p>
                    </div>
                  </div>

                  {cr.supportingDocs.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1.5">Supporting Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {cr.supportingDocs.map((doc, i) => <AttachmentChip key={i} name={doc} />)}
                      </div>
                    </div>
                  )}

                  <ChangeChainProgress cr={cr} />

                  {cr.approvedBy && (
                    <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-600">
                      <CheckCircle size={12} /> Fully approved — final sign-off by {cr.approvedBy} on {fmtDate(cr.approvedDate)}
                    </div>
                  )}
                  {cr.rejectionReason && (
                    <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle size={13} className="text-red-500 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-red-700">Rejected: {cr.rejectionReason}</p>
                    </div>
                  )}

                  {(cr.status === "Approved" || cr.status === "Implemented") && (
                    <div className="mt-3 bg-emerald-50 rounded-lg border border-emerald-200 p-4">
                      <p className="text-[11px] font-bold text-emerald-800 mb-3 flex items-center gap-1.5"><BarChart3 size={13} /> Impact Summary</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-2.5 border border-emerald-100 text-center">
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised Contract Value</p>
                          <p className="text-[14px] font-semibold text-emerald-700">{cr.revisedValue ? fmt(cr.revisedValue) : fmt(c.value)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2.5 border border-emerald-100 text-center">
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised End Date</p>
                          <p className="text-[14px] font-semibold text-slate-800">{cr.revisedEndDate ? fmtDate(cr.revisedEndDate) : fmtDate(c.endDate)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2.5 border border-emerald-100 text-center">
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Updated Deliverables Schedule</p>
                          <p className="text-[14px] font-semibold text-slate-800">{cr.estimatedTimeImpact && cr.estimatedTimeImpact !== "None" ? `Extended by ${cr.estimatedTimeImpact}` : "No change"}</p>
                        </div>
                      </div>
                      {cr.implementedDate && (
                        <p className="text-[10px] text-emerald-600 mt-2.5">Applied to the contract on {fmtDate(cr.implementedDate)}.</p>
                      )}
                    </div>
                  )}

                  {isTurn && (
                    <div className="pt-2 flex items-center gap-2">
                      <GatedButton
                        allowed={canApprove}
                        reason={stationDenial(nextRole)}
                        onClick={() => setDecision({ cr, action: "approve" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-medium hover:bg-emerald-700"
                      >
                        <CheckCircle size={12} /> Approve as {nextRole}
                      </GatedButton>
                      <GatedButton
                        allowed={canReject}
                        reason={stationDenial(nextRole)}
                        onClick={() => setDecision({ cr, action: "reject" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[11px] font-medium hover:bg-red-700"
                      >
                        <X size={12} /> Reject
                      </GatedButton>
                      <p className="text-[10px] text-slate-400">
                        {canApprove
                          ? `Signing as ${user.name}.`
                          : `Waiting on the ${nextRole} station.`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <Edit2 size={24} className="text-slate-300 mb-2" />
          <p className="text-[13px] text-slate-400">No change requests for this contract</p>
        </div>
      )}

      {decision && (
        <ChangeDecisionModal
          contract={c}
          cr={decision.cr}
          action={decision.action}
          onClose={() => setDecision(null)}
        />
      )}
    </div>
  );
}

function ChangeDecisionModal({ contract: c, cr, action, onClose }: {
  contract: AwardedContract;
  cr: ContractChangeRequest;
  action: "approve" | "reject";
  onClose: () => void;
}) {
  const user = useCurrentUser();
  const [comments, setComments] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { nextRole } = changeChainState(cr);
  const approving = action === "approve";

  const submit = () => {
    if (!nextRole) { setError("This change request is no longer awaiting approval."); return; }
    const res = approving
      ? approveChangeRequestStep(c.id, cr.id, nextRole, user.name, comments)
      : rejectChangeRequest(c.id, cr.id, hasRole(nextRole) ? nextRole : reviewRoleOf(user), user.name, comments);
    if (!res.ok) { setError(res.error ?? "The decision could not be recorded."); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-900">
            {approving ? `Approve as ${nextRole}` : "Reject Change Request"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 space-y-1">
            <p className="text-[12px] font-medium text-slate-800">Amendment #{cr.changeNumber} — {cr.types.join(", ")}</p>
            <p className="text-[10px] text-slate-500">{cr.reason}</p>
            <p className="text-[10px] text-slate-500">
              Cost impact {fmt(cr.estimatedCostImpact)} · revised value {cr.revisedValue ? fmt(cr.revisedValue) : fmt(c.value)}
              {cr.revisedEndDate ? ` · revised end date ${fmtDate(cr.revisedEndDate)}` : ""}
            </p>
          </div>

          {approving && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <p className="text-[10px] text-blue-700">
                {nextRole === CHANGE_APPROVAL_CHAIN[CHANGE_APPROVAL_CHAIN.length - 1]
                  ? "This is the final approval — the amendment will be applied to the contract value, end date and amendment register immediately."
                  : `After your approval the amendment passes to ${CHANGE_APPROVAL_CHAIN[CHANGE_APPROVAL_CHAIN.indexOf(nextRole ?? CHANGE_APPROVAL_CHAIN[0]) + 1]}.`}
              </p>
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">
              {approving ? "Comments" : "Reason for rejection *"}
            </label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20"
              placeholder={approving ? "Optional note recorded on the approval trail..." : "Explain why the change is not approved..."}
            />
          </div>
          <p className="text-[10px] text-slate-400">Recorded against {user.name} ({user.roles.join(", ")}).</p>
          <ErrorNote message={error} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button
            onClick={submit}
            disabled={!approving && !comments.trim()}
            className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white",
              approving ? "bg-emerald-600 hover:bg-emerald-700"
                : comments.trim() ? "bg-red-600 hover:bg-red-700" : "bg-slate-300 cursor-not-allowed")}
          >
            {approving ? "Record Approval" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Change Request
   ═══════════════════════════════════════════════════════════════════════════════ */

function ChangeRequestModal({ contract: c, onClose }: { contract: AwardedContract; onClose: () => void }) {
  const user = useCurrentUser();
  const [types, setTypes] = useState<ContractChangeRequest["types"]>([]);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [costImpact, setCostImpact] = useState("");
  const [timeImpact, setTimeImpact] = useState("");
  const [docs, setDocs] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleType = (t: ContractChangeRequest["types"][0]) => {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  // Recomputed as the user types so the impact is visible before submission.
  const cost = parseFloat(costImpact) || 0;
  const revisedValue = c.value + cost;
  const revisedEndDate = computeRevisedEndDate(c.endDate, timeImpact);
  const timeImpactUnparsed = !!timeImpact.trim() && !revisedEndDate;

  const pick = async () => {
    const picked = await choose(setError, { uploadedBy: user.name });
    if (picked.length) setDocs(prev => [...prev, ...picked]);
  };

  const ready = types.length > 0 && !!reason.trim() && !!description.trim() && docs.length > 0;

  const handleSubmit = () => {
    const res = submitChangeRequest(c.id, {
      contractRef: c.contractNumber,
      types,
      reason: reason.trim(),
      description: description.trim(),
      supportingDocs: docs.map(d => d.name),
      estimatedCostImpact: cost,
      estimatedTimeImpact: timeImpact.trim() || "None",
      requestedBy: user.name,
      requestedDate: todayISO(),
    });
    if (!res.ok) { setError(res.error ?? "The change request could not be submitted."); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">New Change Request</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Change Type(s) *</label>
            <div className="flex flex-wrap gap-2">
              {(["Scope Change", "Time Extension", "Cost Variation", "Amendment to Terms", "Deliverable Change"] as const).map(t => (
                <button key={t} onClick={() => toggleType(t)} className={cn("px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors", types.includes(t) ? "bg-[#0B01D0] text-white border-[#0B01D0]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Reason for Change *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Why is this change needed?" />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Detailed Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Describe the change in detail..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Estimated Cost Impact ($)</label>
              <input type="number" value={costImpact} onChange={e => setCostImpact(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="0" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Estimated Time Impact</label>
              <input type="text" value={timeImpact} onChange={e => setTimeImpact(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="e.g. 2 weeks, 3 months" />
            </div>
          </div>

          {/* Live impact preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised Contract Value</p>
              <p className={cn("text-[15px] font-semibold", cost === 0 ? "text-slate-700" : cost > 0 ? "text-emerald-600" : "text-red-600")}>{fmt(revisedValue)}</p>
              <p className="text-[10px] text-slate-400">from {fmt(c.value)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Revised End Date</p>
              <p className="text-[15px] font-semibold text-slate-700">{revisedEndDate ? fmtDate(revisedEndDate) : fmtDate(c.endDate)}</p>
              <p className={cn("text-[10px]", timeImpactUnparsed ? "text-amber-600" : "text-slate-400")}>
                {timeImpactUnparsed ? "Use a form such as \"2 weeks\" or \"3 months\"" : `from ${fmtDate(c.endDate)}`}
              </p>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Supporting Documents *</label>
            <button
              onClick={() => { void pick(); }}
              className="w-full border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-[#0B01D0]/40 hover:bg-[#0B01D0]/[0.02] transition-colors"
            >
              <Upload size={20} className="text-slate-300 mx-auto mb-2" />
              <p className="text-[11px] text-slate-500 font-medium">Attach the vendor proposal, justification memo or approved change document</p>
              <p className="text-[10px] text-slate-400 mt-0.5">At least one document is required</p>
            </button>
            {docs.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {docs.map(f => (
                  <div key={f.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <FileText size={11} className="text-slate-400 shrink-0" />
                    <button onClick={() => openFile(f)} className="text-[11px] text-[#0B01D0] font-medium truncate hover:underline flex-1 text-left">{f.name}</button>
                    <span className="text-[10px] text-slate-400 shrink-0">{f.sizeLabel}</span>
                    <button onClick={() => setDocs(docs.filter(x => x.id !== f.id))} className="text-slate-300 hover:text-red-500 shrink-0"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <p className="text-[10px] text-blue-700">
              Raised by <span className="font-semibold">{user.name}</span>. The amendment follows the standard chain:{" "}
              {CHANGE_APPROVAL_CHAIN.join(" → ")}.
            </p>
          </div>
          <ErrorNote message={error} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!ready} className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white", ready ? "bg-[#0B01D0] hover:bg-[#0a01b8]" : "bg-slate-300 cursor-not-allowed")}>Submit Change Request</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Performance Evaluation
   ═══════════════════════════════════════════════════════════════════════════════ */

function EvaluationModal({ contract: c, onClose }: { contract: AwardedContract; onClose: () => void }) {
  const user = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [evalType, setEvalType] = useState<"Mid-Term" | "Final">("Final");
  const [criteria, setCriteria] = useState([
    { name: "Quality of deliverables", score: 5, maxScore: 10 },
    { name: "Timeliness", score: 5, maxScore: 10 },
    { name: "Cost control", score: 5, maxScore: 10 },
    { name: "Compliance with terms", score: 5, maxScore: 10 },
    { name: "Professionalism and responsiveness", score: 5, maxScore: 10 },
  ]);
  const [comments, setComments] = useState("");
  const [evaluator, setEvaluator] = useState(getCurrentUser().name);
  const [supervisor, setSupervisor] = useState(getCurrentUser().supervisorName ?? "");
  const [newCriterionName, setNewCriterionName] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const overall = criteria.length > 0 ? criteria.reduce((s, cr) => s + cr.score, 0) / criteria.length : 0;

  const addCriterion = () => {
    if (!newCriterionName.trim()) return;
    setCriteria([...criteria, { name: newCriterionName.trim(), score: 5, maxScore: 10 }]);
    setNewCriterionName("");
  };

  const removeCriterion = (idx: number) => setCriteria(criteria.filter((_, i) => i !== idx));

  const startEdit = (idx: number) => { setEditingIdx(idx); setEditName(criteria[idx].name); };
  const saveEdit = () => {
    if (editingIdx !== null && editName.trim()) {
      const updated = [...criteria];
      updated[editingIdx] = { ...updated[editingIdx], name: editName.trim() };
      setCriteria(updated);
    }
    setEditingIdx(null);
    setEditName("");
  };

  const handleSubmit = () => {
    if (!evaluator.trim()) { setError("An evaluator is required."); return; }
    const res = addPerformanceEvaluation(c.id, {
      evaluationType: evalType,
      evaluationDate: todayISO(),
      evaluator: evaluator.trim(),
      supervisorApproval: supervisor.trim() || undefined,
      status: supervisor.trim() ? "Final" : "CC Approved",
      criteria,
      overallScore: parseFloat(overall.toFixed(1)),
      comments,
    });
    if (!res.ok) { setError(res.error ?? "The evaluation could not be recorded."); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-900">Performance Evaluation</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Evaluation Type</label>
            <div className="flex gap-2">
              {(["Mid-Term", "Final"] as const).map(t => (
                <button key={t} onClick={() => setEvalType(t)} className={cn("px-4 py-2 rounded-lg text-[12px] font-medium border transition-colors", evalType === t ? "bg-[#0B01D0] text-white border-[#0B01D0]" : "bg-white text-slate-600 border-slate-200")}>{t}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Evaluator (CC) *</label>
              <input type="text" value={evaluator} onChange={e => setEvaluator(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Contract Coordinator name" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Supervisor Approval</label>
              <input type="text" value={supervisor} onChange={e => setSupervisor(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Supervisor name" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Criteria (1–10 Likert Scale)</label>
            </div>
            <div className="space-y-2.5">
              {criteria.map((cr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {editingIdx === idx ? (
                    <div className="flex items-center gap-1.5 w-[200px] shrink-0">
                      <input value={editName} onChange={e => setEditName(e.target.value)} onBlur={saveEdit} onKeyDown={e => e.key === "Enter" && saveEdit()} autoFocus className="flex-1 px-2 py-1 border border-[#0B01D0] rounded text-[11px] text-slate-700 focus:outline-none" />
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-600 w-[200px] shrink-0 flex items-center gap-1 group cursor-pointer" onClick={() => startEdit(idx)}>
                      {cr.name}
                      <Edit2 size={9} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                    </span>
                  )}
                  <input
                    type="range" min={1} max={10} value={cr.score}
                    onChange={e => {
                      const updated = [...criteria];
                      updated[idx] = { ...cr, score: parseInt(e.target.value) };
                      setCriteria(updated);
                    }}
                    className="flex-1 h-2 accent-[#0B01D0]"
                  />
                  <span className="text-[12px] font-semibold text-slate-800 w-8 text-right">{cr.score}</span>
                  {criteria.length > 1 && (
                    <button onClick={() => removeCriterion(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={12} /></button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input value={newCriterionName} onChange={e => setNewCriterionName(e.target.value)} onKeyDown={e => e.key === "Enter" && addCriterion()} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0B01D0]" placeholder="Add new criterion..." />
              <button onClick={addCriterion} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-[#0B01D0] font-medium hover:bg-[#0B01D0]/5 rounded-lg"><Plus size={11} /> Add</button>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Overall Score</p>
            <p className={cn("text-[24px] font-semibold", overall >= 7 ? "text-emerald-600" : overall >= 5 ? "text-amber-600" : "text-red-600")}>{overall.toFixed(1)}<span className="text-[12px] text-slate-400">/10</span></p>
            {overall < 5 && <p className="text-[10px] text-red-500 mt-1">Poor performer — will be flagged</p>}
          </div>
          {!supervisor && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-[10px] text-amber-700">Minimum two approvals required: CC evaluator and supervisor. Add supervisor name for full approval.</p>
            </div>
          )}
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Comments</label>
            <textarea value={comments} onChange={e => setComments(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="Additional comments..." />
          </div>
          <p className="text-[10px] text-slate-400">
            Recorded against {user.name} ({user.roles.join(", ")}). The scorecard is pushed onto {c.party}&apos;s vendor profile
            and will inform future sourcing decisions.
          </p>
          <ErrorNote message={error} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!evaluator.trim()} className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white", evaluator.trim() ? "bg-[#0B01D0] hover:bg-[#0a01b8]" : "bg-slate-300 cursor-not-allowed")}>Submit Evaluation</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TAB: Invoices & Payments — the CC → Procurement → Supervisor → Finance chain
   ═══════════════════════════════════════════════════════════════════════════════ */

function InvoicesTab({ contract: c, onRecordInvoice }: { contract: AwardedContract; onRecordInvoice: () => void }) {
  useCurrentUser();
  const invoices = c.invoices ?? [];
  const fin = getContractFinancials(c);
  const openInvoices = invoices.filter(i => i.status !== "Paid");
  const paidInvoices = invoices.filter(i => i.status === "Paid");
  const queried = invoices.filter(i => i.status === "Queried");

  const stageCount = (stage: InvoiceStatus) => invoices.filter(i => i.status === stage).length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[12px] text-slate-500">Total Paid: <span className="font-semibold text-emerald-600">{fmt(fin.totalPaid)}</span></p>
          <div className="h-4 w-px bg-slate-200" />
          <p className="text-[12px] text-slate-500">Awaiting payment: <span className="font-semibold text-amber-600">{fmt(fin.pending)}</span></p>
          <div className="h-4 w-px bg-slate-200" />
          <p className="text-[12px] text-slate-500">Remaining: <span className="font-semibold text-amber-600">{fmt(fin.balance)}</span></p>
        </div>
        <GatedButton
          allowed={anyCan(INVOICE_RECORD_CAPS)}
          reason={anyDenial(INVOICE_RECORD_CAPS)}
          onClick={onRecordInvoice}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"
        >
          <Plus size={12} /> Record Invoice
        </GatedButton>
      </div>

      <table className="w-full">
        <thead style={{ backgroundColor: "#0B01D0" }}>
          <tr>
            {["Invoice #", "Vendor", "Amount", "Submitted", "Via", "Status", "CC Review", "Procurement", "Supervisor", "Paid Date", "Amount Paid"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.map((inv, i) => (
            <tr key={inv.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
              <td className="px-4 py-3 text-[12px] text-purple-700 font-medium">{inv.invoiceNumber}</td>
              <td className="px-4 py-3 text-[11px] text-slate-700">{inv.vendor}</td>
              <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{fmt(inv.amount)}</td>
              <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(inv.dateSubmitted)}</td>
              <td className="px-4 py-3 text-[11px] text-slate-500">{inv.submittedVia}</td>
              <td className="px-4 py-3">
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", INV_COLORS[inv.status])}>{inv.status}</span>
              </td>
              <td className="px-4 py-3 text-[11px] text-slate-500">{inv.reviewedBy || "—"}</td>
              <td className="px-4 py-3 text-[11px] text-slate-500">{inv.procurementApprovedBy || "—"}</td>
              <td className="px-4 py-3 text-[11px] text-slate-500">{inv.supervisorApprovedBy || inv.approvedBy || "—"}</td>
              <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(inv.datePaid)}</td>
              <td className="px-4 py-3 text-[11px] text-emerald-600 font-medium">{inv.amountPaid ? fmt(inv.amountPaid) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {invoices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <DollarSign size={24} className="text-slate-300 mb-2" />
          <p className="text-[13px] text-slate-400">No invoices recorded yet</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
        {/* Remaining Balance */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-amber-600 uppercase tracking-wider font-semibold mb-1">Remaining Balance</p>
            <p className="text-[28px] font-bold text-amber-700">{fmt(fin.balance)}</p>
            <p className="text-[11px] text-amber-600 mt-0.5">
              Contract ceiling {fmt(fin.ceiling)} — Total Paid {fmt(fin.totalPaid)}
              {fin.pending > 0 && ` — ${fmt(fin.pending)} in the approval pipeline`}
            </p>
          </div>
          <DollarSign size={32} className="text-amber-300" />
        </div>

        {/* Budget & Funding Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Budget Line</p>
            <p className="text-[13px] text-slate-800 font-semibold">{c.budgetLine || "Not assigned"}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Funding Source</p>
            <p className="text-[13px] text-slate-800 font-semibold">{c.fundingSource || "Not assigned"}</p>
          </div>
        </div>

        {/* Pipeline — real counts at each station */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 border-b border-slate-200 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"><Clock size={13} className="text-blue-600" /></div>
            <h2 className="text-[13px] font-semibold text-slate-800">Approval Pipeline</h2>
            <span className="ml-auto text-[10px] text-slate-400">{invoices.length} invoice(s) on this contract</span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-1">
              {INVOICE_STAGES.map((stage, i) => {
                const count = stageCount(stage);
                return (
                  <div key={stage} className="flex items-center gap-1 flex-1 last:flex-none">
                    <div className="flex-1 text-center">
                      <div className={cn(
                        "mx-auto w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2",
                        count > 0
                          ? stage === "Paid" ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-[#0B01D0]/5 border-[#0B01D0]/30 text-[#0B01D0]"
                          : "bg-slate-50 border-slate-200 text-slate-300"
                      )}>{count}</div>
                      <p className={cn("text-[9px] font-medium mt-1.5 leading-tight", count > 0 ? "text-slate-600" : "text-slate-400")}>{stage}</p>
                    </div>
                    {i < INVOICE_STAGES.length - 1 && <ChevronRight size={13} className="text-slate-300 shrink-0" />}
                  </div>
                );
              })}
            </div>
            {queried.length > 0 && (
              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle size={13} className="text-red-500 shrink-0" />
                <p className="text-[11px] text-red-700">
                  {queried.length} invoice(s) queried and returned for correction: {queried.map(q => q.invoiceNumber).join(", ")}
                </p>
              </div>
            )}
            <p className="text-[10px] text-slate-400 pt-3">
              Every invoice is matched to an accepted deliverable by the Contract Coordinator, validated by Procurement and
              signed off by the coordinator&apos;s supervisor before Finance can pay it.
            </p>
          </div>
        </section>

        {/* Live approval actions */}
        {openInvoices.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><UserCheck size={13} className="text-[#0B01D0]" /></div>
              <h2 className="text-[13px] font-semibold text-slate-800">Invoice Approvals</h2>
              <span className="ml-auto text-[10px] text-slate-400">{openInvoices.length} awaiting action</span>
            </div>
            <div className="p-5 space-y-4">
              {openInvoices.map(inv => <InvoiceWorkflowCard key={inv.id} invoice={inv} contract={c} />)}
            </div>
          </section>
        )}

        {/* Paid Invoices Summary */}
        {paidInvoices.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><CheckCircle size={13} className="text-emerald-600" /></div>
              <h2 className="text-[13px] font-semibold text-slate-800">Completed Payments</h2>
            </div>
            <div className="p-5 space-y-2">
              {paidInvoices.map(inv => <PaidInvoiceRow key={inv.id} invoice={inv} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function PaidInvoiceRow({ invoice: inv }: { invoice: ContractInvoice }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-emerald-50/50 rounded-lg border border-emerald-100">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-800">{inv.invoiceNumber}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">Paid</span>
          {inv.paymentMethod && <span className="text-[10px] text-slate-500">{inv.paymentMethod}</span>}
          {inv.referenceNumber && <span className="text-[10px] text-slate-400">Ref: {inv.referenceNumber}</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-medium text-emerald-700">{fmt(inv.amountPaid || inv.amount)}</span>
            {inv.datePaid && <p className="text-[9px] text-slate-400">{fmtDate(inv.datePaid)}</p>}
          </div>
          <button onClick={() => setOpen(o => !o)} className="text-[10px] text-[#0B01D0] font-medium hover:underline">
            {open ? "Hide trail" : "Approval trail"}
          </button>
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-emerald-100">
          <InvoiceHistoryTimeline history={inv.approvalHistory ?? []} />
        </div>
      )}
    </div>
  );
}

function InvoiceHistoryTimeline({ history }: { history: InvoiceApprovalEntry[] }) {
  if (history.length === 0) {
    return <p className="text-[10px] text-slate-400 italic">No approval activity recorded against this invoice yet.</p>;
  }
  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
      <div className="space-y-3">
        {history.map((h, i) => (
          <div key={i} className="flex items-start gap-3 relative">
            <div className={cn(
              "w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 shrink-0 mt-0.5",
              h.action === "Queried" ? "bg-red-500"
                : h.action === "Paid" ? "bg-emerald-500"
                : h.action === "Resubmitted" ? "bg-amber-500"
                : "bg-[#0B01D0]"
            )} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-700 font-medium">
                {h.stage} — {h.by} <span className="text-slate-400 font-normal">({h.role})</span>
              </p>
              <p className="text-[9px] text-slate-400">{fmtDate(h.date)}</p>
              {h.comments && <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{h.comments}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type InvoiceAction = "ccReview" | "procurement" | "supervisor" | "query" | "resubmit";

function InvoiceWorkflowCard({ invoice: inv, contract: c }: { invoice: ContractInvoice; contract: AwardedContract }) {
  useCurrentUser();
  const [action, setAction] = useState<InvoiceAction | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const stageIndex = INVOICE_STAGES.indexOf(inv.status);
  const queriedState = inv.status === "Queried";
  const linked = c.deliverables?.find(d => d.id === inv.deliverableId);

  return (
    <div className={cn("rounded-lg border p-4 space-y-3", queriedState ? "bg-red-50/40 border-red-200" : "bg-slate-50 border-slate-200")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-slate-800">{inv.invoiceNumber}</span>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", INV_COLORS[inv.status])}>{inv.status}</span>
          <span className="text-[10px] text-slate-400">{inv.vendor} · {inv.submittedVia} · {fmtDate(inv.dateSubmitted)}</span>
        </div>
        <p className="text-[13px] font-semibold text-slate-700">{fmt(inv.amount)}</p>
      </div>

      {/* Stage strip */}
      <div className="flex items-center gap-1">
        {INVOICE_STAGES.map((stage, i) => {
          const done = !queriedState && stageIndex >= i;
          const current = !queriedState && stageIndex === i;
          return (
            <div key={stage} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm",
                  queriedState && i === 0 ? "bg-red-500"
                    : done ? (stage === "Paid" ? "bg-emerald-500" : "bg-[#0B01D0]")
                    : "bg-slate-200"
                )}>
                  {done ? <CheckCircle size={11} className="text-white" /> : <CircleDot size={11} className="text-slate-400" />}
                </div>
                <p className={cn("text-[9px] text-center leading-tight font-medium", done ? "text-slate-600" : "text-slate-400", current && "text-[#0B01D0]")}>{stage}</p>
              </div>
              {i < INVOICE_STAGES.length - 1 && (
                <div className={cn("h-0.5 flex-1 rounded", stageIndex > i && !queriedState ? "bg-[#0B01D0]/40" : "bg-slate-200")} />
              )}
            </div>
          );
        })}
      </div>

      {linked && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Link2 size={10} className="text-slate-400" />
          Matched to <span className="text-slate-700 font-medium">{linked.description}</span>
          <span className={cn("px-1.5 py-0.5 rounded-full text-[9px] font-medium", DEL_COLORS[linked.status])}>{linked.status}</span>
        </div>
      )}

      {queriedState && inv.queryReason && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={13} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-red-700">Queried: {inv.queryReason}</p>
        </div>
      )}

      {/* Stage action */}
      <InvoiceStageAction invoice={inv} contract={c} onAction={setAction} />

      <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
        <button onClick={() => setShowHistory(h => !h)} className="text-[10px] text-[#0B01D0] font-medium hover:underline flex items-center gap-1">
          <ClipboardList size={10} /> {showHistory ? "Hide approval trail" : `Approval trail (${(inv.approvalHistory ?? []).length})`}
        </button>
        {inv.documents && inv.documents.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {inv.documents.map((doc, i) => <AttachmentChip key={i} name={doc} />)}
          </div>
        )}
      </div>
      {showHistory && (
        <div className="pt-1">
          <InvoiceHistoryTimeline history={inv.approvalHistory ?? []} />
        </div>
      )}

      {action && (
        <InvoiceActionModal contract={c} invoice={inv} action={action} onClose={() => setAction(null)} />
      )}
    </div>
  );
}

/** The one control available at the invoice's current station, plus Query. */
function InvoiceStageAction({ invoice: inv, contract: c, onAction }: {
  invoice: ContractInvoice;
  contract: AwardedContract;
  onAction: (a: InvoiceAction) => void;
}) {
  const canQuery = anyCan(INVOICE_REVIEW_CAPS);

  const primary = (() => {
    switch (inv.status) {
      case "Submitted":
        return {
          action: "ccReview" as const, label: "Match & Review", icon: <Link2 size={12} />,
          cap: "contract.invoiceCCReview" as Capability, tone: "bg-[#0B01D0] hover:bg-[#0a01b8]",
          hint: "The Contract Coordinator must match this invoice to an accepted deliverable and confirm specifications.",
        };
      case "CC Reviewed":
        return {
          action: "procurement" as const, label: "Procurement Review", icon: <Shield size={12} />,
          cap: "contract.invoiceProcurementReview" as Capability, tone: "bg-purple-600 hover:bg-purple-700",
          hint: "Procurement must validate compliance with the contract terms.",
        };
      case "Procurement Approved":
        return {
          action: "supervisor" as const, label: "Supervisor Approval", icon: <UserCheck size={12} />,
          cap: "contract.invoiceSupervisorApprove" as Capability, tone: "bg-amber-600 hover:bg-amber-700",
          hint: "The coordinator's supervisor gives the final approval before Finance can pay.",
        };
      case "Queried":
        return {
          action: "resubmit" as const, label: "Resubmit", icon: <RotateCcw size={12} />,
          cap: "contract.invoiceCCReview" as Capability, tone: "bg-[#0B01D0] hover:bg-[#0a01b8]",
          hint: "Correct the query and return the invoice to the start of the approval chain.",
        };
      default:
        return null;
    }
  })();

  if (inv.status === "Supervisor Approved") {
    return <PaymentProcessingCard invoice={inv} contract={c} onQuery={() => onAction("query")} canQuery={canQuery} />;
  }

  if (!primary) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
      <p className="text-[10px] text-slate-500 leading-relaxed">{primary.hint}</p>
      <div className="flex items-center gap-2">
        <GatedButton
          allowed={can(primary.cap)}
          reason={denialReason(primary.cap)}
          onClick={() => onAction(primary.action)}
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white", primary.tone)}
        >
          {primary.icon} {primary.label}
        </GatedButton>
        {inv.status !== "Queried" && (
          <GatedButton
            allowed={canQuery}
            reason={anyDenial(INVOICE_REVIEW_CAPS)}
            onClick={() => onAction("query")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[11px] font-medium hover:bg-red-100"
          >
            <AlertTriangle size={12} /> Query
          </GatedButton>
        )}
      </div>
    </div>
  );
}

function InvoiceActionModal({ contract: c, invoice: inv, action, onClose }: {
  contract: AwardedContract;
  invoice: ContractInvoice;
  action: InvoiceAction;
  onClose: () => void;
}) {
  const user = useCurrentUser();
  const acceptedDeliverables = (c.deliverables ?? []).filter(d => d.status === "Accepted");
  const [deliverableId, setDeliverableId] = useState(
    inv.deliverableId && acceptedDeliverables.some(d => d.id === inv.deliverableId) ? inv.deliverableId : ""
  );
  const [confirmed, setConfirmed] = useState(false);
  const [comments, setComments] = useState("");
  const [error, setError] = useState<string | null>(null);

  const meta: Record<InvoiceAction, { title: string; cta: string; tone: string }> = {
    ccReview: { title: "Match Invoice to Deliverable", cta: "Confirm Coordinator Review", tone: "bg-[#0B01D0] hover:bg-[#0a01b8]" },
    procurement: { title: "Procurement Review", cta: "Approve — Procurement", tone: "bg-purple-600 hover:bg-purple-700" },
    supervisor: { title: "Supervisor Approval", cta: "Approve for Payment", tone: "bg-amber-600 hover:bg-amber-700" },
    query: { title: "Query Invoice", cta: "Query Invoice", tone: "bg-red-600 hover:bg-red-700" },
    resubmit: { title: "Resubmit Invoice", cta: "Resubmit", tone: "bg-[#0B01D0] hover:bg-[#0a01b8]" },
  };

  const ready =
    action === "ccReview" ? !!deliverableId && confirmed
      : action === "query" ? !!comments.trim()
      : true;

  const submit = () => {
    let res: { ok: boolean; error?: string };
    switch (action) {
      case "ccReview":
        res = ccReviewInvoice(c.id, inv.id, {
          deliverableId, specificationsConfirmed: confirmed, reviewedBy: user.name, comments,
        });
        break;
      case "procurement":
        res = procurementApproveInvoice(c.id, inv.id, user.name, comments);
        break;
      case "supervisor":
        res = supervisorApproveInvoice(c.id, inv.id, user.name, comments);
        break;
      case "query":
        res = queryInvoice(c.id, inv.id, comments, user.name, reviewRoleOf(user));
        break;
      case "resubmit":
        res = resubmitInvoice(c.id, inv.id, user.name, comments);
        break;
    }
    if (!res.ok) { setError(res.error ?? "The action could not be completed."); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">{meta[action].title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold text-slate-800">{inv.invoiceNumber}</p>
              <p className="text-[13px] font-semibold text-slate-700">{fmt(inv.amount)}</p>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {inv.vendor} · submitted {fmtDate(inv.dateSubmitted)} via {inv.submittedVia} · currently {inv.status}
            </p>
          </div>

          {action === "ccReview" && (
            <>
              <div>
                <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Link to Deliverable *</label>
                {acceptedDeliverables.length > 0 ? (
                  <select
                    value={deliverableId}
                    onChange={e => setDeliverableId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20"
                  >
                    <option value="">— Select an accepted deliverable —</option>
                    {acceptedDeliverables.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.description}{d.amount ? ` (${fmt(d.amount)})` : ""} — accepted {fmtDate(d.reviewDate ?? d.actualDate)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-700">
                      No accepted deliverables on this contract. Evidence must be uploaded and accepted by a second reviewer
                      before an invoice can be matched to it.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setConfirmed(v => !v)}
                className={cn("w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors", confirmed ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200 hover:bg-slate-50")}
              >
                <span className={cn("w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5", confirmed ? "bg-emerald-500 border-emerald-500" : "border-slate-300")}>
                  {confirmed && <CheckCircle size={12} className="text-white" />}
                </span>
                <span className={cn("text-[11px] font-medium leading-relaxed", confirmed ? "text-emerald-800" : "text-slate-600")}>
                  I confirm this deliverable meets contract specifications *
                </span>
              </button>
            </>
          )}

          {action === "supervisor" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-[10px] text-amber-700">
                Final approval before payment. It cannot be given by {inv.reviewedBy ?? "the coordinator"}, who performed the
                coordinator review.
              </p>
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">
              {action === "query" ? "Reason for query *" : "Comments"}
            </label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20"
              placeholder={
                action === "query" ? "What is wrong with the invoice and what must be corrected?"
                  : action === "resubmit" ? "How was the query addressed?"
                  : "Optional note recorded on the approval trail..."
              }
            />
          </div>

          <p className="text-[10px] text-slate-400">Recorded against {user.name} ({user.roles.join(", ")}).</p>
          <ErrorNote message={error} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button
            onClick={submit}
            disabled={!ready}
            className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white", ready ? meta[action].tone : "bg-slate-300 cursor-not-allowed")}
          >
            {meta[action].cta}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MODAL: Record Invoice
   ═══════════════════════════════════════════════════════════════════════════════ */

function InvoiceModal({ contract: c, onClose }: { contract: AwardedContract; onClose: () => void }) {
  const user = useCurrentUser();
  const [invoiceNum, setInvoiceNum] = useState("");
  const [amount, setAmount] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState(todayISO());
  const [via, setVia] = useState<ContractInvoice["submittedVia"]>("Email");
  const [docs, setDocs] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fin = getContractFinancials(c);
  const parsed = parseFloat(amount) || 0;
  const committed = (c.invoices ?? []).filter(i => i.status !== "Queried").reduce((s, i) => s + i.amount, 0);
  const wouldExceed = parsed > 0 && committed + parsed > fin.ceiling;

  const pick = async () => {
    const picked = await choose(setError, { uploadedBy: user.name });
    if (picked.length) setDocs(prev => [...prev, ...picked]);
  };

  const handleSubmit = () => {
    const res = addInvoice(
      c.id,
      {
        invoiceNumber: invoiceNum.trim(),
        vendor: c.party,
        amount: parsed,
        dateSubmitted,
        submittedVia: via,
        documents: docs.map(d => d.name),
      },
      user.name
    );
    if (!res.ok) { setError(res.error ?? "The invoice could not be recorded."); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Record Invoice</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Invoice Number *</label>
            <input type="text" value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="INV-..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Amount ($) *</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" placeholder="0" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Date Received</label>
              <input type="date" value={dateSubmitted} onChange={e => setDateSubmitted(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 space-y-0.5">
            <p className="text-[10px] text-slate-500">Contract ceiling <span className="font-semibold text-slate-700">{fmt(fin.ceiling)}</span> · already invoiced <span className="font-semibold text-slate-700">{fmt(committed)}</span></p>
            {wouldExceed && (
              <p className="text-[10px] text-red-600 font-medium">
                This invoice would take the total to {fmt(committed + parsed)}, above the ceiling. Raise a cost variation first.
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Submitted Via</label>
            <div className="flex gap-2">
              {(["Vendor Portal", "Email", "Manual"] as const).map(v => (
                <button key={v} onClick={() => setVia(v)} className={cn("px-3 py-1.5 rounded-lg text-[11px] font-medium border", via === v ? "bg-[#0B01D0] text-white border-[#0B01D0]" : "bg-white text-slate-600 border-slate-200")}>{v}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2 block">Invoice Document</label>
            <button
              onClick={() => { void pick(); }}
              className="w-full border-2 border-dashed border-slate-200 rounded-lg p-5 text-center hover:border-[#0B01D0]/40 hover:bg-[#0B01D0]/[0.02] transition-colors"
            >
              <Upload size={18} className="text-slate-300 mx-auto mb-1.5" />
              <p className="text-[11px] text-slate-500 font-medium">Attach the invoice and any supporting paperwork</p>
            </button>
            {docs.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {docs.map(f => (
                  <div key={f.id} className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <FileText size={11} className="text-slate-400 shrink-0" />
                    <button onClick={() => openFile(f)} className="text-[11px] text-[#0B01D0] font-medium truncate hover:underline flex-1 text-left">{f.name}</button>
                    <span className="text-[10px] text-slate-400 shrink-0">{f.sizeLabel}</span>
                    <button onClick={() => setDocs(docs.filter(x => x.id !== f.id))} className="text-slate-300 hover:text-red-500 shrink-0"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <p className="text-[10px] text-blue-700">
              The invoice is recorded as <span className="font-semibold">Submitted</span>. It is matched to an accepted
              deliverable in the next step — Match &amp; Review on the approvals panel.
            </p>
          </div>
          <ErrorNote message={error} />
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!invoiceNum.trim() || parsed <= 0}
            className={cn("px-4 py-2 rounded-lg text-[12px] font-medium text-white", invoiceNum.trim() && parsed > 0 ? "bg-[#0B01D0] hover:bg-[#0a01b8]" : "bg-slate-300 cursor-not-allowed")}
          >
            Submit Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   INLINE: Payment Processing Card (Finance Integration)
   ═══════════════════════════════════════════════════════════════════════════════ */

function PaymentProcessingCard({ invoice, contract, onQuery, canQuery }: {
  invoice: ContractInvoice;
  contract: AwardedContract;
  onQuery?: () => void;
  canQuery?: boolean;
}) {
  const user = useCurrentUser();
  const [paymentDate, setPaymentDate] = useState(todayISO());
  const [amountPaid, setAmountPaid] = useState(String(invoice.amount));
  const [paymentMethod, setPaymentMethod] = useState<"Wire Transfer" | "Cheque" | "Mobile Money">("Wire Transfer");
  const [refNumber, setRefNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const allowed = can("contract.processPayment");

  const handleProcessPayment = () => {
    const res = recordInvoicePayment(contract.id, invoice.id, {
      datePaid: paymentDate,
      amountPaid: parseFloat(amountPaid) || 0,
      paymentMethod,
      referenceNumber: refNumber.trim(),
      paidBy: user.name,
    });
    if (!res.ok) { setError(res.error ?? "The payment could not be recorded."); return; }
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg border border-emerald-200 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <DollarSign size={13} className="text-emerald-600" />
        <p className="text-[11px] font-semibold text-slate-800">Payment Processing</p>
        <span className="ml-auto text-[10px] text-emerald-600 font-medium">Cleared for payment</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Payment Date</label>
          <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} disabled={!allowed} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 disabled:bg-slate-50" />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Amount Paid ($)</label>
          <input type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} disabled={!allowed} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 disabled:bg-slate-50" />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Payment Method</label>
          <div className="flex gap-1.5">
            {(["Wire Transfer", "Cheque", "Mobile Money"] as const).map(m => (
              <GatedButton
                key={m}
                allowed={allowed}
                reason={denialReason("contract.processPayment")}
                onClick={() => setPaymentMethod(m)}
                className={cn("px-2 py-1 rounded text-[10px] font-medium border transition-colors", paymentMethod === m ? "bg-[#0B01D0] text-white border-[#0B01D0]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}
              >
                {m}
              </GatedButton>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Reference Number *</label>
          <input type="text" value={refNumber} onChange={e => setRefNumber(e.target.value)} disabled={!allowed} placeholder="e.g. TXN-12345" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 disabled:bg-slate-50" />
        </div>
      </div>
      <ErrorNote message={error} />
      <div className="flex justify-end gap-2">
        {onQuery && (
          <GatedButton
            allowed={!!canQuery}
            reason={anyDenial(INVOICE_REVIEW_CAPS)}
            onClick={onQuery}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[11px] font-medium hover:bg-red-100"
          >
            <AlertTriangle size={12} /> Query
          </GatedButton>
        )}
        <GatedButton
          allowed={allowed && !!refNumber.trim()}
          reason={allowed ? "Enter the payment reference number first." : denialReason("contract.processPayment")}
          onClick={handleProcessPayment}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <CheckCircle size={12} /> Process Payment
        </GatedButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TAB: Close-Out
   ═══════════════════════════════════════════════════════════════════════════════ */

function CloseOutTab({ contract: c }: { contract: AwardedContract }) {
  const user = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const closeOut = c.closeOut ?? {
    allDeliverablesCompleted: false, procurementCompliance: false, allPaymentsCompleted: false,
    performanceFinalized: false, allDocsUploaded: false,
  };

  // Every condition except the Procurement sign-off is derived from real state.
  const checks = verifyCloseOutReadiness(c);
  const satisfied = checks.filter(ch => ch.satisfied).length;
  const outstanding = checks.filter(ch => !ch.satisfied);
  const hasCertificate = !!closeOut.completionCertificate;
  const hasReport = !!closeOut.closureReport;
  const canClose = can("contract.close");
  const deliverables = c.deliverables ?? [];
  const invoices = c.invoices ?? [];
  const evaluations = c.performanceEvaluations ?? [];
  const changeRequests = c.changeRequests ?? [];
  const fin = getContractFinancials(c);

  const generate = (key: "completionCertificate" | "closureReport", name: string) => {
    updateCloseOut(c.id, { [key]: name }, user.name);
    setError(null);
  };

  const doClose = () => {
    const res = closeContract(c.id, user.name, {
      completionCertificate: closeOut.completionCertificate ?? "",
      closureReport: closeOut.closureReport ?? "",
    });
    setError(res.ok ? null : res.error ?? "The contract could not be closed.");
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-semibold text-slate-800">Close-Out Readiness</p>
          <p className="text-[12px] font-semibold text-slate-600">{satisfied}/{checks.length} conditions met</p>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className={cn("h-3 rounded-full transition-all duration-500", satisfied === checks.length ? "bg-emerald-500" : satisfied >= 3 ? "bg-amber-500" : "bg-red-400")}
            style={{ width: `${(satisfied / checks.length) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">
          {satisfied === checks.length ? "All close-out conditions satisfied" : `${checks.length - satisfied} condition(s) outstanding`}
        </p>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><Shield size={13} className="text-[#0B01D0]" /></div>
          <h2 className="text-[13px] font-semibold text-slate-800">Contract Close-Out Checklist</h2>
          <span className="ml-auto text-[10px] text-slate-400">Verified against contract records</span>
        </div>
        <div className="p-5 space-y-3">
          {checks.map(item => {
            const manual = item.key === "procurementCompliance";
            return (
              <div key={item.key} className={cn("flex items-start gap-3 p-3 rounded-lg border transition-colors", item.satisfied ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200")}>
                {manual ? (
                  <GatedButton
                    allowed={canClose && c.status !== "Closed"}
                    reason={c.status === "Closed" ? "This contract is already closed." : denialReason("contract.close")}
                    onClick={() => updateCloseOut(c.id, { procurementCompliance: !closeOut.procurementCompliance }, user.name)}
                    title={closeOut.procurementCompliance ? "Withdraw the compliance confirmation" : "Confirm compliance with contract terms"}
                    className={cn("w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5", item.satisfied ? "bg-emerald-500 border-emerald-500" : "border-slate-300")}
                  >
                    {item.satisfied && <CheckCircle size={12} className="text-white" />}
                  </GatedButton>
                ) : (
                  <span
                    title="Derived from the contract's own records — it cannot be ticked by hand."
                    className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5", item.satisfied ? "bg-emerald-500" : "bg-slate-200")}
                  >
                    {item.satisfied ? <CheckCircle size={12} className="text-white" /> : <Lock size={10} className="text-slate-400" />}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-[12px] font-medium", item.satisfied ? "text-emerald-800" : "text-slate-700")}>{item.label}</p>
                  <p className={cn("text-[10px] mt-0.5 leading-relaxed", item.satisfied ? "text-emerald-600" : "text-slate-500")}>{item.detail}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    Responsible: {CLOSEOUT_OWNERS[item.key] ?? "Contract Coordinator"}
                    {manual ? " · manual confirmation" : " · verified automatically"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Generate Documents Section */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><FileText size={13} className="text-emerald-600" /></div>
          <h2 className="text-[13px] font-semibold text-slate-800">Closure Documents</h2>
        </div>
        <div className="p-5 space-y-4">
          {c.status !== "Closed" && (
            <div className="flex items-center gap-3 mb-3">
              <GatedButton
                allowed={canClose && !hasCertificate}
                reason={hasCertificate ? "The certificate has already been generated." : denialReason("contract.close")}
                onClick={() => generate("completionCertificate", `CompletionCert_${c.contractNumber}.pdf`)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium", hasCertificate ? "bg-slate-100 text-slate-400" : "bg-emerald-600 text-white hover:bg-emerald-700")}
              >
                <CheckCircle size={12} /> {hasCertificate ? "Certificate Generated" : "Generate Certificate"}
              </GatedButton>
              <GatedButton
                allowed={canClose && !hasReport}
                reason={hasReport ? "The closure report has already been generated." : denialReason("contract.close")}
                onClick={() => generate("closureReport", `ClosureReport_${c.contractNumber}.pdf`)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium", hasReport ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white hover:bg-blue-700")}
              >
                <FileText size={12} /> {hasReport ? "Report Generated" : "Generate Closure Report"}
              </GatedButton>
            </div>
          )}

          {/* ── Certificate of Completion ── */}
          {hasCertificate && (
            <div className="border-2 border-emerald-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 text-center">
                <p className="text-[10px] text-emerald-200 uppercase tracking-[3px] font-semibold">Certificate of Completion</p>
                <p className="text-[18px] text-white font-bold mt-1">ACET Procurement</p>
              </div>
              <div className="bg-white px-6 py-5 space-y-4">
                <div className="text-center pb-3 border-b border-slate-100">
                  <p className="text-[11px] text-slate-500">This certifies that all obligations under the following contract have been fulfilled.</p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {[
                    ["Contract #", c.contractNumber],
                    ["Vendor / Consultant", c.party],
                    ["Contract Value", fmt(c.value)],
                    ["Category", c.category],
                    ["Start Date", fmtDate(c.startDate)],
                    ["End Date", fmtDate(c.endDate)],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium">{label}</span>
                      <span className="text-[11px] text-slate-800 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
                  <CheckCircle size={16} className="text-emerald-600 mx-auto mb-1" />
                  <p className="text-[11px] text-emerald-800 font-semibold">All deliverables completed and accepted</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">All payments processed and settled</p>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-3 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-medium mb-1">Date of Certification</p>
                    <p className="text-[12px] text-slate-800 font-semibold">{fmtDate(closeOut.closedDate || todayISO())}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-medium mb-1">Signed By</p>
                    <p className="text-[12px] text-slate-800 font-semibold">{closeOut.closedBy || c.owner || "Contract Coordinator"}</p>
                    <div className="mt-2 border-t border-slate-300 w-32 mx-auto" />
                    <p className="text-[9px] text-slate-400 mt-0.5">Authorized Signatory</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-2 flex items-center justify-between border-t border-slate-200">
                <p className="text-[9px] text-slate-400">{closeOut.completionCertificate}</p>
                <button
                  onClick={() => printDocument(`Certificate of Completion — ${c.contractNumber}`, certificateHtml(c))}
                  className="text-[10px] text-[#0B01D0] font-medium flex items-center gap-1 hover:underline"
                >
                  <Printer size={10} /> Print
                </button>
              </div>
            </div>
          )}

          {/* ── Contract Closure Report ── */}
          {hasReport && (() => {
            const reportDelAccepted = deliverables.filter(d => d.status === "Accepted").length;
            const reportDelTotal = deliverables.length;
            const reportLatestScore = evaluations.length > 0 ? evaluations[evaluations.length - 1].overallScore : null;
            const reportAmendments = changeRequests.filter(cr => cr.status === "Approved" || cr.status === "Implemented").length;
            return (
              <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <p className="text-[10px] text-blue-200 uppercase tracking-[3px] font-semibold">Contract Closure Report</p>
                  <p className="text-[16px] text-white font-bold mt-1">{c.contractNumber} — {c.title}</p>
                  <p className="text-[11px] text-blue-200 mt-0.5">{c.party} | {c.category}</p>
                </div>
                <div className="bg-white px-6 py-5 space-y-5">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText size={11} /> Contract Summary</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {[
                        ["Contract Number", c.contractNumber],
                        ["Vendor", c.party],
                        ["Category", c.category],
                        ["Method", c.method],
                        ["Contract Value", fmt(c.value)],
                        ["Duration", `${fmtDate(c.startDate)} — ${fmtDate(c.endDate)}`],
                        ["Department", c.department],
                        ["Contract Type", c.contractType || "—"],
                      ].map(([label, value], i) => (
                        <div key={i} className="flex justify-between items-center py-1 border-b border-dashed border-slate-100">
                          <span className="text-[10px] text-slate-400">{label}</span>
                          <span className="text-[10px] text-slate-700 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3.5 border border-purple-100">
                    <p className="text-[10px] text-purple-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Package size={11} /> Deliverables Summary</p>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-[20px] font-bold text-purple-700">{reportDelAccepted}<span className="text-[12px] text-purple-400">/{reportDelTotal}</span></p>
                        <p className="text-[9px] text-purple-500">Completed</p>
                      </div>
                      <div className="flex-1 bg-purple-100 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: reportDelTotal > 0 ? `${(reportDelAccepted / reportDelTotal) * 100}%` : "0%" }} />
                      </div>
                      <p className="text-[10px] text-purple-600 font-medium">{reportDelTotal > 0 ? Math.round((reportDelAccepted / reportDelTotal) * 100) : 0}%</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3.5 border border-emerald-100">
                    <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><DollarSign size={11} /> Payment Summary</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-[14px] font-bold text-emerald-700">{fmt(fin.totalPaid)}</p>
                        <p className="text-[9px] text-emerald-500">Total Paid</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[14px] font-bold text-slate-700">{fmt(c.value)}</p>
                        <p className="text-[9px] text-slate-400">Contract Value</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[14px] font-bold text-amber-600">{fmt(fin.balance)}</p>
                        <p className="text-[9px] text-amber-500">Remaining</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-emerald-600 mt-2">{invoices.filter(i => i.status === "Paid").length} of {invoices.length} invoice(s) settled</p>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3.5 border border-amber-100">
                    <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Star size={11} /> Performance Summary</p>
                    {reportLatestScore !== null ? (
                      <div className="flex items-center gap-3">
                        <p className={cn("text-[20px] font-bold", reportLatestScore >= 7 ? "text-emerald-600" : reportLatestScore >= 5 ? "text-amber-600" : "text-red-600")}>{reportLatestScore.toFixed(1)}<span className="text-[12px] text-slate-400">/10</span></p>
                        <p className="text-[10px] text-slate-500">{evaluations.length} evaluation(s) on record</p>
                        {reportLatestScore < 5 && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-semibold">Poor Performer</span>}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">No evaluations recorded</p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                    <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Edit2 size={11} /> Change Management Summary</p>
                    <div className="flex items-center gap-4">
                      <p className="text-[20px] font-bold text-slate-700">{changeRequests.length}</p>
                      <div className="text-[10px] text-slate-500">
                        <p>Total change requests ({reportAmendments} approved/implemented)</p>
                        {changeRequests.length > 0 && <p className="text-slate-400 mt-0.5">Types: {[...new Set(changeRequests.flatMap(cr => cr.types))].join(", ")}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar size={11} /> Key Dates</p>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        ["Award Date", fmtDate(c.awardDate)],
                        ["Start Date", fmtDate(c.startDate)],
                        ["End Date", fmtDate(c.endDate)],
                        ["Close Date", fmtDate(closeOut.closedDate || todayISO())],
                      ].map(([label, value], i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-center">
                          <p className="text-[9px] text-slate-400 font-medium">{label}</p>
                          <p className="text-[11px] text-slate-800 font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-2 flex items-center justify-between border-t border-slate-200">
                  <p className="text-[9px] text-slate-400">{closeOut.closureReport}</p>
                  <button
                    onClick={() => printDocument(`Closure Report — ${c.contractNumber}`, closureReportHtml(c))}
                    className="text-[10px] text-[#0B01D0] font-medium flex items-center gap-1 hover:underline"
                  >
                    <Printer size={10} /> Print
                  </button>
                </div>
              </div>
            );
          })()}

          {closeOut.closedDate && (
            <p className="text-[10px] text-slate-400 pt-2">Closed on {fmtDate(closeOut.closedDate)} by {closeOut.closedBy}</p>
          )}
        </div>
      </section>

      {/* Close the contract — the store re-verifies and explains any refusal */}
      {c.status !== "Closed" ? (
        <div className="space-y-3">
          {outstanding.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <p className="text-[11px] text-amber-700 font-medium mb-1">Outstanding before this contract can be closed:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {outstanding.map(o => <li key={o.key} className="text-[10px] text-amber-700">{o.label} — {o.detail}</li>)}
              </ul>
            </div>
          )}
          {(!hasCertificate || !hasReport) && (
            <p className="text-[10px] text-slate-500">
              Generate {[!hasCertificate && "the Certificate of Completion", !hasReport && "the Final Closure Report"].filter(Boolean).join(" and ")} before closing.
            </p>
          )}
          <ErrorNote message={error} />
          <GatedButton
            allowed={canClose}
            reason={denialReason("contract.close")}
            onClick={doClose}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-medium"
          >
            <Shield size={13} /> Close Contract
          </GatedButton>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-600 shrink-0" />
          <p className="text-[11px] text-emerald-700 font-medium">
            This contract was closed on {fmtDate(closeOut.closedDate)} by {closeOut.closedBy}.
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TAB: Documents
   ═══════════════════════════════════════════════════════════════════════════════ */

function DocumentsTab({ contract: c }: { contract: AwardedContract }) {
  const user = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const allowed = anyCan(DOC_UPLOAD_CAPS);

  const upload = async () => {
    const chosen = label.trim();
    if (!chosen) { setError("Give the document a label before choosing a file."); return; }
    const files = await choose(setError, { multiple: false, uploadedBy: user.name });
    if (!files.length) return;
    attachContractDocument(c.id, files[0], chosen, user.name);
    setLabel("");
  };

  const rows = c.documents.flatMap(dg => dg.versions.map(v => ({ ...v, groupLabel: dg.label, isCurrent: v.version === dg.currentVersion })));

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
        <p className="text-[12px] text-slate-500">
          {c.documents.length} document group(s), {rows.length} version(s) on file
        </p>
        <div className="flex items-center gap-2">
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && allowed && void upload()}
            placeholder="Document label, e.g. Signed Contract"
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 w-56 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20"
          />
          <GatedButton
            allowed={allowed}
            reason={anyDenial(DOC_UPLOAD_CAPS)}
            onClick={() => { void upload(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B01D0] text-white rounded-lg text-[11px] font-medium hover:bg-[#0a01b8]"
          >
            <Upload size={12} /> Upload Document
          </GatedButton>
        </div>
      </div>

      {error && <div className="px-6 pt-3"><ErrorNote message={error} /></div>}

      <table className="w-full">
        <thead style={{ backgroundColor: "#0B01D0" }}>
          <tr>
            {["Document", "File Name", "Uploaded By", "Date", "Type", "Size", "Version"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((doc, i) => (
            <tr key={doc.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
              <td className="px-4 py-3 text-[11px] text-slate-700 font-medium">{doc.groupLabel}</td>
              <td className="px-4 py-3 text-[11px]">
                {doc.url ? (
                  <button
                    onClick={() => openFile({ url: doc.url ?? "", name: doc.name })}
                    className="text-[#0B01D0] font-medium hover:underline flex items-center gap-1"
                    title={`Open ${doc.name}`}
                  >
                    {doc.name} <ExternalLink size={9} />
                  </button>
                ) : (
                  <span className="text-slate-600" title="Uploaded in an earlier session — the file is no longer held in the browser.">{doc.name}</span>
                )}
              </td>
              <td className="px-4 py-3 text-[11px] text-slate-600">{doc.uploadedBy}</td>
              <td className="px-4 py-3 text-[11px] text-slate-600">{fmtDate(doc.date)}</td>
              <td className="px-4 py-3 text-[11px] text-slate-500">{doc.type}</td>
              <td className="px-4 py-3 text-[11px] text-slate-500">{doc.size}</td>
              <td className="px-4 py-3 text-[11px]">
                <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-medium", doc.isCurrent ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                  v{doc.version}{doc.isCurrent ? " · current" : ""}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {c.documents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText size={24} className="text-slate-300 mb-2" />
          <p className="text-[13px] text-slate-400">No documents uploaded yet</p>
        </div>
      )}
    </div>
  );
}
