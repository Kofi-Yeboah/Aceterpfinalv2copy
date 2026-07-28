import { useEffect, useMemo, useState } from "react";
import {
  Search, Download, ChevronDown, ChevronLeft, ChevronRight, X, FileSpreadsheet, FileText,
  AlertTriangle, CheckCircle2, Clock, ArrowRight, Lock, Receipt, Plus, Upload, Paperclip, Printer, FileUp,
} from "lucide-react";
import {
  getAllInvoices, subscribe as subscribeContracts,
  ccReviewInvoice, procurementApproveInvoice, supervisorApproveInvoice,
  queryInvoice, resubmitInvoice, recordInvoicePayment,
  type AwardedContract, type ContractInvoice, type InvoiceStatus,
} from "../lib/contractStore";
import { getCurrentUser, can, denialReason, subscribe as subscribeUser } from "../lib/currentUser";
import { getContracts, addInvoice as recordInvoice } from "../lib/contractStore";
import { pickFiles, openFile, downloadFile, FileValidationError, type UploadedFile } from "../lib/fileUpload";
import { exportToCSV, exportToExcel, exportToPDF, type ExportColumn } from "../lib/exportUtils";
import { ProcurementStatCards, type StatTone } from "./procurement/ProcurementStatCards";

/* ══════════════════════════════════════════════════════════════════════════════
   Cross-contract invoice register.

   Contract Management shows the invoices on one contract; this is the workbench
   for the people who work the queue across all of them — Procurement clearing
   compliance reviews, a supervisor signing off, Finance paying. Every action
   routes through the same guarded store functions, so nothing here can skip a
   stage that the contract screen enforces.
   ══════════════════════════════════════════════════════════════════════════════ */

const STATUS_ORDER: InvoiceStatus[] = [
  "Submitted", "CC Reviewed", "Procurement Approved", "Supervisor Approved", "Paid", "Queried",
];

const STAGE_TONE: Record<InvoiceStatus, StatTone> = {
  Submitted: "neutral",
  "CC Reviewed": "info",
  "Procurement Approved": "info",
  "Supervisor Approved": "accent",
  Paid: "success",
  Queried: "danger",
};

const STAGE_ICON: Record<InvoiceStatus, JSX.Element> = {
  Submitted: <Clock size={14} />,
  "CC Reviewed": <CheckCircle2 size={14} />,
  "Procurement Approved": <CheckCircle2 size={14} />,
  "Supervisor Approved": <CheckCircle2 size={14} />,
  Paid: <Receipt size={14} />,
  Queried: <AlertTriangle size={14} />,
};

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  Submitted: "bg-slate-100 text-slate-700",
  "CC Reviewed": "bg-sky-50 text-sky-700",
  "Procurement Approved": "bg-indigo-50 text-indigo-700",
  "Supervisor Approved": "bg-violet-50 text-violet-700",
  Paid: "bg-green-50 text-green-700",
  Queried: "bg-red-50 text-red-600",
};

type Row = { contract: AwardedContract; invoice: ContractInvoice };

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export function Invoices() {
  const [, force] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "All Statuses">("All Statuses");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selected, setSelected] = useState<Row | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const bump = () => force((n) => n + 1);
    const unsubs = [subscribeContracts(bump), subscribeUser(bump)];
    return () => unsubs.forEach((u) => u());
  }, []);

  const rows = getAllInvoices();
  const suppliers = useMemo(
    () => ["All Suppliers", ...Array.from(new Set(rows.map((r) => r.invoice.supplier))).sort()],
    [rows]
  );

  const filtered = rows.filter(({ contract, invoice }) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      invoice.invoiceNumber.toLowerCase().includes(q) ||
      contract.contractNumber.toLowerCase().includes(q) ||
      invoice.supplier.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All Statuses" || invoice.status === statusFilter;
    const matchesSupplier = supplierFilter === "All Suppliers" || invoice.supplier === supplierFilter;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const counts = STATUS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = rows.filter((r) => r.invoice.status === s).length;
    return acc;
  }, {});

  const exportColumns: ExportColumn<Record<string, unknown>>[] = [
    { key: "invoiceNumber", header: "Invoice #" },
    { key: "contractNumber", header: "Contract" },
    { key: "contractTitle", header: "Contract Title" },
    { key: "supplier", header: "Supplier" },
    { key: "submittedVia", header: "Received Via" },
    { key: "dateSubmitted", header: "Date Submitted" },
    { key: "amount", header: "Amount (USD)" },
    { key: "amountPaid", header: "Amount Paid (USD)" },
    { key: "status", header: "Status" },
    { key: "reviewedBy", header: "Coordinator Review" },
    { key: "procurementApprovedBy", header: "Procurement Approval" },
    { key: "supervisorApprovedBy", header: "Supervisor Approval" },
    { key: "datePaid", header: "Date Paid" },
    { key: "referenceNumber", header: "Payment Reference" },
  ];

  const exportRows = filtered.map(({ contract, invoice }) => ({
    invoiceNumber: invoice.invoiceNumber,
    contractNumber: contract.contractNumber,
    contractTitle: contract.title,
    supplier: invoice.supplier,
    submittedVia: invoice.submittedVia,
    dateSubmitted: invoice.dateSubmitted,
    amount: invoice.amount,
    amountPaid: invoice.amountPaid ?? "",
    status: invoice.status,
    reviewedBy: invoice.reviewedBy ?? "",
    procurementApprovedBy: invoice.procurementApprovedBy ?? "",
    supervisorApprovedBy: invoice.supervisorApprovedBy ?? "",
    datePaid: invoice.datePaid ?? "",
    referenceNumber: invoice.referenceNumber ?? "",
  }));

  const exportMeta = {
    subtitle: `Status: ${statusFilter} · Supplier: ${supplierFilter}`,
    generatedBy: getCurrentUser().name,
  };

  if (selected) {
    // Re-read from the store so the panel reflects the latest transition.
    const live = getAllInvoices().find(
      (r) => r.invoice.id === selected.invoice.id && r.contract.id === selected.contract.id
    );
    if (live) return <InvoiceWorkbench row={live} onBack={() => setSelected(null)} />;
    setSelected(null);
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Every supplier invoice across all contracts, and the approval stage each one is waiting at.
        </p>
      </div>

      {/* Pipeline summary — the module-standard metric cards, each one a filter */}
      <ProcurementStatCards
        stats={STATUS_ORDER.map((s) => ({
          label: s,
          value: counts[s] ?? 0,
          icon: STAGE_ICON[s],
          tone: STAGE_TONE[s],
          sub: statusFilter === s ? "Filtering by this stage" : undefined,
          onClick: () => { setStatusFilter(statusFilter === s ? "All Statuses" : s); setCurrentPage(1); },
        }))}
      />

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-72">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Invoice, contract or supplier"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!can("contract.invoiceRecord")}
              title={can("contract.invoiceRecord") ? "Record an invoice received from a supplier" : denialReason("contract.invoiceRecord")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={16} /> Add Invoice
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={!can("report.export")}
                title={can("report.export") ? "Export the filtered register" : denialReason("report.export")}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40"
              >
                <span className="text-sm text-slate-900">Export</span>
                <Download size={16} className="text-purple-700" />
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={() => { exportToExcel("Invoice and Payment Report", exportColumns, exportRows, exportMeta); setShowExportMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileSpreadsheet size={14} className="text-green-600" /> Excel
                    </button>
                    <button
                      onClick={() => { exportToPDF("Invoice and Payment Report", exportColumns, exportRows, exportMeta); setShowExportMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText size={14} className="text-red-600" /> PDF
                    </button>
                    <button
                      onClick={() => { exportToCSV("Invoice and Payment Report", exportColumns, exportRows); setShowExportMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Download size={14} className="text-slate-500" /> CSV
                    </button>
                  </div>
                </>
              )}
            </div>

            <Dropdown
              value={supplierFilter}
              options={suppliers}
              open={showSupplierDropdown}
              setOpen={(v) => { setShowSupplierDropdown(v); setShowStatusDropdown(false); }}
              onSelect={(v) => { setSupplierFilter(v); setCurrentPage(1); }}
              width="w-64"
            />
            <Dropdown
              value={statusFilter}
              options={["All Statuses", ...STATUS_ORDER]}
              open={showStatusDropdown}
              setOpen={(v) => { setShowStatusDropdown(v); setShowSupplierDropdown(false); }}
              onSelect={(v) => { setStatusFilter(v as InvoiceStatus | "All Statuses"); setCurrentPage(1); }}
              width="w-52"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {paged.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <p className="text-slate-500 text-sm">No invoices match these filters.</p>
            <p className="text-slate-400 text-xs mt-1">
              Invoices arrive from the supplier portal, or are recorded by a contract coordinator in Contract Management.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                {["Invoice #", "Contract", "Supplier", "Received", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(({ contract, invoice }) => (
                <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{invoice.invoiceNumber}</p></td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-900">{contract.contractNumber}</p>
                    <p className="text-[11px] text-slate-400 max-w-[180px] truncate">{contract.title}</p>
                  </td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{invoice.supplier}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(invoice.dateSubmitted)}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-900 tabular-nums">{formatCurrency(invoice.amount)}</p></td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[11px] font-medium ${STATUS_STYLE[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setSelected({ contract, invoice })}
                      className="px-3 py-1.5 text-[12px] font-medium text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} per page</option>)}
          </select>
          <span className="text-sm text-slate-500">
            {filtered.length === 0 ? "No records" : `${(page - 1) * itemsPerPage + 1}–${Math.min(page * itemsPerPage, filtered.length)} of ${filtered.length}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ChevronLeft size={16} className="text-pink-600" />
          </button>
          <span className="text-sm text-slate-600 tabular-nums">Page {page} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ChevronRight size={16} className="text-pink-600" />
          </button>
        </div>
      </div>

      {showAddModal && <AddInvoiceModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

function awaitingLabel(inv: ContractInvoice): string {
  switch (inv.status) {
    case "Submitted": return "Contract Coordinator";
    case "CC Reviewed": return "Procurement";
    case "Procurement Approved": return "Supervisor";
    case "Supervisor Approved": return "Finance";
    case "Queried": return "Supplier / Coordinator";
    case "Paid": return "—";
  }
}

function Dropdown({
  value, options, open, setOpen, onSelect, width,
}: {
  value: string; options: string[]; open: boolean;
  setOpen: (v: boolean) => void; onSelect: (v: string) => void; width: string;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
      >
        <span className="text-sm text-slate-900">{value}</span>
        <ChevronDown size={16} className="text-purple-700" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className={`absolute right-0 top-full mt-1 ${width} bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-72 overflow-y-auto`}>
            {options.map((o) => (
              <button
                key={o}
                onClick={() => { onSelect(o); setOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Detail workbench — the approval chain for one invoice
   ──────────────────────────────────────────────────────────────────────────── */

function InvoiceWorkbench({ row, onBack }: { row: Row; onBack: () => void }) {
  const { contract, invoice } = row;
  const user = getCurrentUser();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [comments, setComments] = useState("");
  const [queryOpen, setQueryOpen] = useState(false);
  const [queryReason, setQueryReason] = useState("");
  const [matchOpen, setMatchOpen] = useState(false);
  const [deliverableId, setDeliverableId] = useState("");
  const [specsConfirmed, setSpecsConfirmed] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payment, setPayment] = useState({
    datePaid: new Date().toISOString().split("T")[0],
    amountPaid: String(invoice.amount),
    paymentMethod: "Wire Transfer" as "Wire Transfer" | "Cheque" | "Mobile Money",
    referenceNumber: "",
  });

  const acceptedDeliverables = (contract.deliverables ?? []).filter((d) => d.status === "Accepted");

  function run(result: { ok: boolean; error?: string }, successMessage: string) {
    if (!result.ok) {
      setError(result.error ?? "That action could not be completed.");
      setNotice("");
      return false;
    }
    setError("");
    setNotice(successMessage);
    setComments("");
    return true;
  }

  const stages: { status: InvoiceStatus; label: string; by?: string }[] = [
    { status: "Submitted", label: "Received", by: invoice.submittedVia },
    { status: "CC Reviewed", label: "Coordinator review", by: invoice.reviewedBy },
    { status: "Procurement Approved", label: "Procurement", by: invoice.procurementApprovedBy },
    { status: "Supervisor Approved", label: "Supervisor", by: invoice.supervisorApprovedBy },
    { status: "Paid", label: "Payment", by: invoice.paidBy },
  ];
  const reachedIndex = stages.findIndex((s) => s.status === invoice.status);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-auto">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-1">
            <ChevronLeft size={15} /> Back to invoices
          </button>
          <h1 className="text-xl font-semibold text-slate-900">{invoice.invoiceNumber}</h1>
          <p className="text-sm text-slate-500">
            {invoice.supplier} · {contract.contractNumber} — {contract.title}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${STATUS_STYLE[invoice.status]}`}>
          {invoice.status}
        </span>
      </div>

      <div className="p-6 space-y-5 max-w-5xl">
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 flex gap-2.5">
            <AlertTriangle size={17} className="shrink-0 mt-0.5" /> <span>{error}</span>
          </div>
        )}
        {notice && (
          <div className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-800 flex gap-2.5">
            <CheckCircle2 size={17} className="shrink-0 mt-0.5" /> <span>{notice}</span>
          </div>
        )}

        {/* Chain */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Approval chain</h2>
          <div className="flex flex-wrap gap-3">
            {stages.map((s, i) => {
              const done = invoice.status === "Paid" ? true : reachedIndex >= 0 && i <= reachedIndex;
              const current = i === reachedIndex + 1 && invoice.status !== "Paid" && invoice.status !== "Queried";
              return (
                <div
                  key={s.status}
                  className={`flex-1 min-w-[150px] rounded-lg border p-3 ${
                    done ? "border-green-200 bg-green-50" : current ? "border-purple-300 bg-purple-50" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {done ? <CheckCircle2 size={14} className="text-green-600" />
                      : current ? <Clock size={14} className="text-purple-600" />
                      : <Lock size={14} className="text-slate-300" />}
                    <p className="text-[12px] font-medium text-slate-900">{s.label}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{s.by || (current ? "Awaiting action" : "—")}</p>
                </div>
              );
            })}
          </div>
          {invoice.status === "Queried" && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-[12px] font-medium text-red-800">Queried</p>
              <p className="text-[12px] text-red-700 mt-0.5">{invoice.queryReason}</p>
            </div>
          )}
        </div>

        {/* Facts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Fact label="Amount" value={formatCurrency(invoice.amount)} />
          <Fact label="Received" value={`${formatDate(invoice.dateSubmitted)} via ${invoice.submittedVia}`} />
          <Fact
            label="Matched deliverable"
            value={
              invoice.deliverableId
                ? (contract.deliverables ?? []).find((d) => d.id === invoice.deliverableId)?.description ?? "—"
                : "Not yet matched"
            }
          />
          <Fact
            label="Payment"
            value={invoice.datePaid ? `${formatCurrency(invoice.amountPaid ?? 0)} on ${formatDate(invoice.datePaid)} · ${invoice.referenceNumber}` : "Not paid"}
          />
        </div>

        {/* The invoice document itself */}
        <InvoiceDocument invoice={invoice} />

        {/* Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Actions available to you</h2>
          <p className="text-xs text-slate-500 mb-4">Signed in as {user.name} — {user.roles.join(", ")}.</p>

          <div className="flex flex-wrap gap-3">
            {invoice.status === "Submitted" && (
              <ActionButton
                capability="contract.invoiceCCReview"
                label="Match to deliverable & review"
                onClick={() => { setMatchOpen(true); setError(""); }}
              />
            )}
            {invoice.status === "CC Reviewed" && (
              <ActionButton
                capability="contract.invoiceProcurementReview"
                label="Approve — procurement review"
                onClick={() => run(procurementApproveInvoice(contract.id, invoice.id, user.name, comments), "Procurement review recorded. The invoice now awaits supervisor approval.")}
              />
            )}
            {invoice.status === "Procurement Approved" && (
              <ActionButton
                capability="contract.invoiceSupervisorApprove"
                label="Approve — supervisor sign-off"
                onClick={() => run(supervisorApproveInvoice(contract.id, invoice.id, user.name, comments), "Supervisor approval recorded. Finance may now process payment.")}
              />
            )}
            {invoice.status === "Supervisor Approved" && (
              <ActionButton
                capability="contract.processPayment"
                label="Process payment"
                onClick={() => { setPayOpen(true); setError(""); }}
              />
            )}
            {invoice.status === "Queried" && (
              <ActionButton
                capability="contract.invoiceCCReview"
                label="Resubmit after correction"
                onClick={() => run(resubmitInvoice(contract.id, invoice.id, user.name, comments), "Invoice resubmitted for coordinator review.")}
              />
            )}
            {invoice.status !== "Paid" && invoice.status !== "Queried" && (
              <button
                onClick={() => { setQueryOpen(true); setError(""); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-700 border border-red-300 hover:bg-red-50 transition-colors"
              >
                Query this invoice
              </button>
            )}
            {invoice.status === "Paid" && (
              <p className="text-sm text-slate-500">This invoice is settled. No further action is required.</p>
            )}
          </div>

          {invoice.status !== "Paid" && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">Comments (optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>
          )}
        </div>

        {/* History */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">History</h2>
          {(invoice.approvalHistory ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No transitions recorded yet.</p>
          ) : (
            <ol className="space-y-3">
              {(invoice.approvalHistory ?? []).map((h, i) => (
                <li key={i} className="flex gap-3">
                  <div className="size-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[13px] text-slate-900">
                      <span className="font-medium">{h.action}</span> by {h.by} ({h.role}) · {formatDate(h.date)}
                    </p>
                    {h.comments && <p className="text-[12px] text-slate-500 mt-0.5">{h.comments}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Match & review modal */}
      {matchOpen && (
        <Modal title="Match invoice to deliverable" onClose={() => setMatchOpen(false)}>
          <p className="text-sm text-slate-600 mb-4">
            An invoice can only progress once it is linked to an accepted deliverable and you confirm that deliverable
            meets the contract specifications.
          </p>
          {acceptedDeliverables.length === 0 ? (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              This contract has no accepted deliverables yet. A deliverable must be submitted and accepted by a second
              reviewer before an invoice against it can be approved.
            </div>
          ) : (
            <>
              <label className="block text-xs font-medium text-slate-600 mb-1">Deliverable *</label>
              <select
                value={deliverableId}
                onChange={(e) => setDeliverableId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm mb-4"
              >
                <option value="">Select an accepted deliverable…</option>
                {acceptedDeliverables.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.description}{d.amount ? ` — ${formatCurrency(d.amount)}` : ""}
                  </option>
                ))}
              </select>
              <label className="flex items-start gap-2 text-sm text-slate-700 mb-4">
                <input
                  type="checkbox"
                  checked={specsConfirmed}
                  onChange={(e) => setSpecsConfirmed(e.target.checked)}
                  className="mt-0.5"
                />
                I confirm this deliverable meets the contract specifications.
              </label>
            </>
          )}
          <div className="flex justify-end gap-3">
            <button onClick={() => setMatchOpen(false)} className="px-4 py-2 rounded-lg text-sm border border-slate-300 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={() => {
                if (run(
                  ccReviewInvoice(contract.id, invoice.id, {
                    deliverableId, specificationsConfirmed: specsConfirmed, reviewedBy: user.name, comments,
                  }),
                  "Invoice matched and reviewed. It now awaits procurement validation."
                )) {
                  setMatchOpen(false);
                  setDeliverableId("");
                  setSpecsConfirmed(false);
                }
              }}
              disabled={!deliverableId || !specsConfirmed}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-40"
            >
              Confirm review
            </button>
          </div>
        </Modal>
      )}

      {/* Query modal */}
      {queryOpen && (
        <Modal title="Query invoice" onClose={() => setQueryOpen(false)}>
          <p className="text-sm text-slate-600 mb-3">
            The invoice is returned to the supplier for correction. A reason is required and will be sent with the query.
          </p>
          <textarea
            value={queryReason}
            onChange={(e) => setQueryReason(e.target.value)}
            rows={4}
            placeholder="Explain what must be corrected…"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm mb-4"
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setQueryOpen(false)} className="px-4 py-2 rounded-lg text-sm border border-slate-300 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={() => {
                if (run(
                  queryInvoice(contract.id, invoice.id, queryReason, user.name, user.roles[0]),
                  "Invoice queried and returned to the supplier."
                )) {
                  setQueryOpen(false);
                  setQueryReason("");
                }
              }}
              disabled={!queryReason.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40"
            >
              Send query
            </button>
          </div>
        </Modal>
      )}

      {/* Payment modal */}
      {payOpen && (
        <Modal title="Process payment" onClose={() => setPayOpen(false)}>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Payment date *</label>
              <input
                type="date"
                value={payment.datePaid}
                onChange={(e) => setPayment({ ...payment, datePaid: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amount paid (USD) *</label>
              <input
                type="number"
                min="0"
                value={payment.amountPaid}
                onChange={(e) => setPayment({ ...payment, amountPaid: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Method *</label>
              <select
                value={payment.paymentMethod}
                onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value as typeof payment.paymentMethod })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              >
                <option>Wire Transfer</option>
                <option>Cheque</option>
                <option>Mobile Money</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Reference number *</label>
              <input
                value={payment.referenceNumber}
                onChange={(e) => setPayment({ ...payment, referenceNumber: e.target.value })}
                placeholder="Bank or cheque reference"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setPayOpen(false)} className="px-4 py-2 rounded-lg text-sm border border-slate-300 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={() => {
                if (run(
                  recordInvoicePayment(contract.id, invoice.id, {
                    datePaid: payment.datePaid,
                    amountPaid: Number(payment.amountPaid),
                    paymentMethod: payment.paymentMethod,
                    referenceNumber: payment.referenceNumber,
                    paidBy: user.name,
                  }),
                  "Payment recorded. The contract balance has been updated."
                )) {
                  setPayOpen(false);
                }
              }}
              disabled={!payment.referenceNumber.trim() || !payment.amountPaid}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 disabled:opacity-40"
            >
              Record payment
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ActionButton({
  capability, label, onClick,
}: {
  capability: Parameters<typeof can>[0]; label: string; onClick: () => void;
}) {
  const allowed = can(capability);
  return (
    <button
      onClick={onClick}
      disabled={!allowed}
      title={allowed ? undefined : denialReason(capability)}
      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────────────────────
   The uploaded invoice, shown inline
   ──────────────────────────────────────────────────────────────────────────── */

function InvoiceDocument({ invoice }: { invoice: ContractInvoice }) {
  const files = invoice.documentFiles ?? [];
  const [active, setActive] = useState(0);
  const file = files[active];

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Invoice document</h2>
        <div className="border border-dashed border-slate-300 rounded-lg py-10 text-center">
          <FileText size={22} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No document was attached to this invoice.</p>
          <p className="text-xs text-slate-400 mt-1">Invoices recorded before documents were captured will show nothing here.</p>
        </div>
      </div>
    );
  }

  // PDFs and images render in the browser; anything else only offers download.
  const isPdf = /pdf/i.test(file.type) || /\.pdf$/i.test(file.name);
  const isImage = /^(png|jpe?g|gif|webp)$/i.test(file.type) || /\.(png|jpe?g|gif|webp)$/i.test(file.name);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="shrink-0" />
          <span className="text-[12px] font-medium truncate">{file.name}</span>
          <span className="text-[11px] text-slate-400 shrink-0">{file.size}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => openFile(file)} className="p-1.5 hover:bg-slate-700 rounded" title="Open in a new tab">
            <Printer size={13} />
          </button>
          <button onClick={() => downloadFile(file)} className="p-1.5 hover:bg-slate-700 rounded" title="Download">
            <Download size={13} />
          </button>
        </div>
      </div>

      {files.length > 1 && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5">
          {files.map((f, i) => (
            <button
              key={f.url}
              onClick={() => setActive(i)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                i === active ? "bg-purple-700 text-white" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      <div className="bg-slate-100 p-4">
        {isPdf ? (
          <iframe src={file.url} title={file.name} className="w-full h-[620px] bg-white rounded shadow-sm border-0" />
        ) : isImage ? (
          <img src={file.url} alt={file.name} className="max-w-full mx-auto bg-white rounded shadow-sm" />
        ) : (
          <div className="bg-white rounded shadow-sm py-12 text-center">
            <Paperclip size={22} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600">{file.name}</p>
            <p className="text-xs text-slate-400 mt-1">This file type can't be previewed in the browser.</p>
            <button onClick={() => downloadFile(file)} className="mt-3 px-3 py-1.5 text-[12px] font-medium text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50">
              Download to view
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Add Invoice — the document comes first, then the details it belongs to
   ──────────────────────────────────────────────────────────────────────────── */

function AddInvoiceModal({ onClose }: { onClose: () => void }) {
  const user = getCurrentUser();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [contractId, setContractId] = useState("");
  const [form, setForm] = useState({ invoiceNumber: "", amount: "", dateSubmitted: new Date().toISOString().split("T")[0], note: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);

  // Only contracts that can still receive a bill.
  const contracts = getContracts().filter((c) => c.status !== "Closed");
  const contract = contracts.find((c) => c.id === contractId);

  async function attach() {
    setError("");
    try {
      const picked = await pickFiles({ multiple: true, uploadedBy: user.name });
      if (picked.length) setFiles((f) => [...f, ...picked]);
    } catch (err) {
      setError(err instanceof FileValidationError ? err.message : "That file could not be attached.");
    }
  }

  function submit() {
    setError("");
    if (!contract) { setError("Select the contract this invoice belongs to."); return; }
    const res = recordInvoice(
      contract.id,
      {
        invoiceNumber: form.invoiceNumber.trim(),
        supplier: contract.party,
        amount: Number(form.amount),
        dateSubmitted: form.dateSubmitted,
        submittedVia: "Manual",
        documents: files.map((f) => f.name),
        documentFiles: files.map((f) => ({ name: f.name, url: f.url, type: f.type, size: f.sizeLabel })),
      },
      user.name
    );
    if (!res.ok) { setError(res.error ?? "The invoice could not be recorded."); return; }
    setDone(res.invoice!.invoiceNumber);
  }

  const ready = files.length > 0;
  const complete = ready && !!contract && form.invoiceNumber.trim() !== "" && Number(form.amount) > 0;

  return (
    <Modal title="Add Invoice" onClose={onClose}>
      {done ? (
        <div className="text-center py-4">
          <CheckCircle2 size={34} className="text-green-600 mx-auto mb-3" />
          <p className="text-sm text-slate-900 font-medium">Invoice {done} recorded</p>
          <p className="text-sm text-slate-500 mt-1">
            It now sits at <strong>Submitted</strong>, waiting for the contract coordinator to match it to a deliverable.
          </p>
          <button onClick={onClose} className="mt-5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-700 hover:bg-purple-800">
            Done
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 mb-4 flex gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" /> <span>{error}</span>
            </div>
          )}

          {/* Step 1 — the document */}
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">1 &middot; Upload the invoice</p>
          {files.length === 0 ? (
            <button
              onClick={attach}
              className="w-full border-2 border-dashed border-slate-300 rounded-xl py-8 hover:border-purple-400 hover:bg-purple-50/40 transition-colors"
            >
              <FileUp size={24} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Choose the invoice document</p>
              <p className="text-xs text-slate-400 mt-0.5">PDF, image or Office file, up to 25 MB</p>
            </button>
          ) : (
            <div className="space-y-1.5">
              {files.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                  <button onClick={() => openFile(f)} className="flex items-center gap-2 min-w-0 text-sm text-slate-800 hover:underline">
                    <Paperclip size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </button>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-500">{f.sizeLabel}</span>
                    <button onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))} title="Remove">
                      <X size={15} className="text-slate-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={attach} className="text-[12px] text-purple-700 hover:underline flex items-center gap-1 mt-1">
                <Upload size={12} /> Add another file
              </button>
            </div>
          )}

          {/* Step 2 — the details, revealed once there is something to describe */}
          <div className={`mt-6 transition-opacity ${ready ? "" : "opacity-40 pointer-events-none select-none"}`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              2 &middot; Invoice details {!ready && <span className="normal-case font-normal text-slate-400">— upload a document first</span>}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Contract *</label>
                <select
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <option value="">Select the contract this invoice is against…</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>{c.contractNumber} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Supplier</label>
                <input
                  value={contract?.party ?? ""}
                  readOnly
                  placeholder="Filled in from the contract"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Invoice number *</label>
                <input
                  value={form.invoiceNumber}
                  onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Amount (USD) *</label>
                <input
                  type="number" min="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date received *</label>
                <input
                  type="date"
                  value={form.dateSubmitted}
                  onChange={(e) => setForm({ ...form, dateSubmitted: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Contract balance</label>
                <input
                  value={contract ? formatCurrency(contract.value) : ""}
                  readOnly
                  placeholder="—"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Note (optional)</label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm border border-slate-300 hover:bg-slate-50">Cancel</button>
            <button
              onClick={submit}
              disabled={!complete}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Record invoice
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
