import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Search, Download, FileSpreadsheet, FileText, ClipboardList, ShoppingCart,
  DollarSign, Clock, CheckCircle2, AlertTriangle, Users, TrendingUp, CalendarClock, Receipt,
} from "lucide-react";
import {
  getProcurementPlanItems, getPlanStats, getGeneratedPRs, getPRStats,
  computeDaysInStage, subscribe as subscribeProcurement,
} from "../lib/procurementStore";
import {
  getContracts, getContractStats, getAllInvoices, getContractFinancials,
  getExpiringContracts, daysUntil, subscribe as subscribeContracts,
} from "../lib/contractStore";
import {
  getSuppliers, getSupplierStats, avgScore, supplierDisplayName,
  getSupplierFlags, checkSourcingEligibility, subscribe as subscribeSuppliers,
} from "../lib/supplierStore";
import { getCurrentUser, can, denialReason, subscribe as subscribeUser } from "../lib/currentUser";
import { exportToCSV, exportToExcel, exportToPDF, type ExportColumn } from "../lib/exportUtils";
import { ProcurementStatCards, type ProcurementStat } from "./procurement/ProcurementStatCards";

/* ══════════════════════════════════════════════════════════════════════════════
   Procurement reports.

   Five reports, one per stage of the procurement cycle. Each is the same shape
   deliberately — a row of figures, then the records behind them — so moving
   between reports needs no relearning, and the numbers are always one glance
   above the rows that produced them.
   ══════════════════════════════════════════════════════════════════════════════ */

export type ReportKey = "plan" | "requisitions" | "contracts" | "invoices" | "suppliers";

type Row = Record<string, unknown>;

interface Column {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  /** Plain text for search and export. */
  text?: (row: Row) => string;
  /** Rich cell; falls back to the plain text. */
  cell?: (row: Row) => ReactNode;
}

interface Report {
  title: string;
  subtitle: string;
  stats: ProcurementStat[];
  columns: Column[];
  rows: Row[];
  empty: string;
}

const fmt = (n: number) =>
  `$${Math.round(n).toLocaleString()}`;
const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const cellText = (row: Row, c: Column) =>
  c.text ? c.text(row) : row[c.key] === null || row[c.key] === undefined ? "" : String(row[c.key]);

/* ── Shared cell renderers ─────────────────────────────────────────────────── */

const REF = (k: string) => (r: Row) => (
  <span className="text-[12px] text-purple-700 font-medium">{String(r[k] ?? "—")}</span>
);
const MONEY = (k: string) => (r: Row) => (
  <span className="text-[12px] text-slate-900 font-medium tabular-nums">{fmt(Number(r[k] ?? 0))}</span>
);
const DATE = (k: string) => (r: Row) => (
  <span className="text-[12px] text-slate-600 whitespace-nowrap">{fmtDate(String(r[k] ?? ""))}</span>
);

const STATUS_TONE: Record<string, string> = {
  Approved: "bg-green-50 text-green-700", Active: "bg-green-50 text-green-700",
  Completed: "bg-green-50 text-green-700", Paid: "bg-green-50 text-green-700",
  Closed: "bg-slate-100 text-slate-600", Draft: "bg-slate-100 text-slate-600",
  "Not Started": "bg-slate-100 text-slate-600",
  Rejected: "bg-red-50 text-red-600", Blacklisted: "bg-red-50 text-red-600",
  Suspended: "bg-red-50 text-red-600", Delayed: "bg-red-50 text-red-600", Queried: "bg-red-50 text-red-600",
  Flagged: "bg-amber-50 text-amber-700", "Under Review": "bg-amber-50 text-amber-700",
  "Under Variation": "bg-amber-50 text-amber-700", "Pending Onboarding": "bg-amber-50 text-amber-700",
};
const BADGE = (k: string) => (r: Row) => {
  const v = String(r[k] ?? "—");
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
      STATUS_TONE[v] ?? "bg-blue-50 text-blue-700"
    }`}>{v}</span>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function ProcurementReports({ report }: { report: ReportKey }) {
  const [, force] = useState(0);
  const [query, setQuery] = useState("");
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const bump = () => force((n) => n + 1);
    const unsubs = [subscribeProcurement(bump), subscribeContracts(bump), subscribeSuppliers(bump), subscribeUser(bump)];
    return () => unsubs.forEach((u) => u());
  }, []);

  useEffect(() => { setQuery(""); }, [report]);

  const def = useMemo(() => buildReport(report), [report, force]);

  const visible = def.rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return def.columns.some((c) => cellText(r, c).toLowerCase().includes(q));
  });

  const exportColumns: ExportColumn<Row>[] = def.columns.map((c) => ({
    key: c.key,
    header: c.header,
    format: (_v, row) => cellText(row as Row, c),
  }));

  const runExport = (kind: "excel" | "pdf" | "csv") => {
    const meta = { subtitle: `${visible.length} records`, generatedBy: getCurrentUser().name };
    if (kind === "excel") exportToExcel(def.title, exportColumns, visible, meta);
    else if (kind === "pdf") exportToPDF(def.title, exportColumns, visible, meta);
    else exportToCSV(def.title, exportColumns, visible);
    setShowExport(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <h1 className="text-2xl font-semibold text-slate-900">{def.title}</h1>
        <p className="text-[12px] text-slate-500 mt-1">{def.subtitle}</p>
      </div>

      {/* Search + export */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-72">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              disabled={!can("report.export")}
              title={can("report.export") ? undefined : denialReason("report.export")}
              className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40"
            >
              <span className="text-sm text-slate-900">Export Report</span>
              <Download size={16} className="text-purple-700" />
            </button>
            {showExport && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExport(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <button onClick={() => runExport("excel")} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                    <FileSpreadsheet size={14} className="text-green-600" /> Excel
                  </button>
                  <button onClick={() => runExport("pdf")} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                    <FileText size={14} className="text-red-600" /> PDF
                  </button>
                  <button onClick={() => runExport("csv")} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2">
                    <Download size={14} className="text-slate-500" /> CSV
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Figures */}
      <ProcurementStatCards stats={def.stats} />

      {/* Records */}
      <div className="flex-1 overflow-auto bg-white">
        {visible.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <FileText size={28} className="text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">{query ? "No records match your search." : def.empty}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
              <tr>
                {def.columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap ${
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={String(r.__key ?? i)} className={`border-b border-slate-100 hover:bg-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                  {def.columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
                    >
                      {c.cell ? c.cell(r) : <span className="text-[12px] text-slate-600">{cellText(r, c)}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Count */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white shrink-0">
        <p className="text-[12px] text-slate-500">
          {visible.length} of {def.rows.length} record{def.rows.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   THE FIVE REPORTS
   ══════════════════════════════════════════════════════════════════════════════ */

function buildReport(key: ReportKey): Report {
  switch (key) {
    case "plan":         return planReport();
    case "requisitions": return requisitionReport();
    case "contracts":    return contractReport();
    case "invoices":     return invoiceReport();
    case "suppliers":    return supplierReport();
  }
}

/* ── 1. Procurement plan ───────────────────────────────────────────────────── */

function planReport(): Report {
  const items = getProcurementPlanItems();
  const s = getPlanStats();

  return {
    title: "Procurement Plan Report",
    subtitle: "What was planned for the year, and how far each activity has progressed",
    stats: [
      { label: "Plan Activities", value: s.total, icon: <ClipboardList size={14} />, tone: "neutral", sub: `${s.approved} approved` },
      { label: "Planned Value", value: fmt(s.totalValue), icon: <DollarSign size={14} />, tone: "info", sub: "approved activities" },
      { label: "Awaiting Review", value: s.pendingApproval, icon: <Clock size={14} />, tone: "warning", sub: "procurement or finance" },
      { label: "Delayed", value: s.delayed, icon: <AlertTriangle size={14} />, tone: "danger", sub: "past completion date" },
    ],
    columns: [
      { key: "ref", header: "Plan Ref", cell: REF("ref") },
      { key: "activity", header: "Activity" },
      { key: "category", header: "Category" },
      { key: "funding", header: "Funding Source" },
      { key: "value", header: "Planned Value", align: "right", cell: MONEY("value"), text: (r) => fmt(Number(r.value ?? 0)) },
      { key: "method", header: "Method" },
      { key: "completion", header: "Completion", cell: DATE("completion"), text: (r) => fmtDate(String(r.completion ?? "")) },
      { key: "status", header: "Status", cell: BADGE("status") },
    ],
    rows: items.map((p) => ({
      __key: p.id,
      ref: p.ppItemId,
      activity: p.activityDescription,
      category: p.category,
      funding: p.fundingSource,
      value: p.estimatedValue,
      method: p.procurementMethod,
      completion: p.completionDate,
      status: p.approvalStatus === "Approved" ? p.status : p.approvalStatus,
    })),
    empty: "No plan activities have been created yet.",
  };
}

/* ── 2. Requisitions ───────────────────────────────────────────────────────── */

function requisitionReport(): Report {
  const prs = getGeneratedPRs();
  const s = getPRStats();

  return {
    title: "Purchase Requisition Report",
    subtitle: "Every request raised, where it sits in the approval chain, and how long it has been there",
    stats: [
      { label: "Requisitions", value: s.total, icon: <ClipboardList size={14} />, tone: "neutral", sub: fmt(s.totalValue) },
      { label: "Awaiting Action", value: s.awaitingAction, icon: <Clock size={14} />, tone: "warning", sub: "sitting with an approver" },
      { label: "Approved", value: s.approved + s.converted, icon: <CheckCircle2 size={14} />, tone: "success", sub: `${s.converted} sent to sourcing` },
      { label: "Avg Cycle Time", value: `${s.avgCycleTimeDays} days`, icon: <TrendingUp size={14} />, tone: "info", sub: "raise to final approval" },
    ],
    columns: [
      { key: "ref", header: "PR Number", cell: REF("ref") },
      { key: "title", header: "Title" },
      { key: "department", header: "Department" },
      { key: "funding", header: "Funding Source" },
      { key: "value", header: "Value", align: "right", cell: MONEY("value"), text: (r) => fmt(Number(r.value ?? 0)) },
      { key: "days", header: "Days in Stage", align: "center",
        cell: (r) => {
          const d = Number(r.days ?? 0);
          return <span className={`text-[12px] tabular-nums ${d > 14 ? "text-red-600 font-semibold" : "text-slate-600"}`}>{d}</span>;
        } },
      { key: "responsible", header: "With" },
      { key: "status", header: "Status", cell: BADGE("status") },
    ],
    rows: prs.map((p) => ({
      __key: p.id,
      ref: p.requisitionNumber,
      title: p.requisitionTitle || p.itemDescription,
      department: p.department,
      funding: p.fundingSource || "Unattributed",
      value: p.estimatedCost,
      days: computeDaysInStage(p),
      responsible: p.currentResponsible || "—",
      status: p.overallApprovalStatus,
    })),
    empty: "No requisitions have been raised yet.",
  };
}

/* ── 3. Contracts ──────────────────────────────────────────────────────────── */

function contractReport(): Report {
  const contracts = getContracts();
  const s = getContractStats();
  const expiring = getExpiringContracts(60).length;

  return {
    title: "Contract Report",
    subtitle: "Active contracts, what has been paid against them, and which are approaching their end date",
    stats: [
      { label: "Contracts", value: s.total, icon: <FileText size={14} />, tone: "neutral", sub: `${s.active} active` },
      { label: "Contracted Value", value: fmt(s.totalValue), icon: <DollarSign size={14} />, tone: "info" },
      { label: "Paid to Date", value: fmt(s.totalPaid), icon: <CheckCircle2 size={14} />, tone: "success",
        sub: s.totalValue > 0 ? `${Math.round((s.totalPaid / s.totalValue) * 100)}% of value` : undefined },
      { label: "Expiring in 60 Days", value: expiring, icon: <CalendarClock size={14} />, tone: "warning" },
    ],
    columns: [
      { key: "ref", header: "Contract", cell: REF("ref") },
      { key: "title", header: "Title" },
      { key: "supplier", header: "Supplier" },
      { key: "value", header: "Value", align: "right", cell: MONEY("value"), text: (r) => fmt(Number(r.value ?? 0)) },
      { key: "paid", header: "Paid", align: "right", cell: MONEY("paid"), text: (r) => fmt(Number(r.paid ?? 0)) },
      { key: "balance", header: "Balance", align: "right", cell: MONEY("balance"), text: (r) => fmt(Number(r.balance ?? 0)) },
      { key: "end", header: "End Date", cell: DATE("end"), text: (r) => fmtDate(String(r.end ?? "")) },
      { key: "status", header: "Status", cell: BADGE("status") },
    ],
    rows: contracts.map((c) => {
      const f = getContractFinancials(c);
      return {
        __key: c.id,
        ref: c.contractNumber,
        title: c.title,
        supplier: c.party,
        value: c.value,
        paid: f.totalPaid,
        balance: f.balance,
        end: c.endDate,
        status: daysUntil(c.endDate) < 0 && c.status !== "Closed" ? "Expired" : c.status,
      };
    }),
    empty: "No contracts have been awarded yet.",
  };
}

/* ── 4. Invoices and payments ──────────────────────────────────────────────── */

function invoiceReport(): Report {
  const all = getAllInvoices();
  const paid = all.filter((r) => r.invoice.status === "Paid");
  const inChain = all.filter((r) => r.invoice.status !== "Paid" && r.invoice.status !== "Queried");
  const outstanding = inChain.reduce((sum, r) => sum + r.invoice.amount, 0);

  return {
    title: "Invoice & Payment Report",
    subtitle: "Every invoice received, the stage it has reached, and what is still owed",
    stats: [
      { label: "Invoices", value: all.length, icon: <Receipt size={14} />, tone: "neutral",
        sub: fmt(all.reduce((s, r) => s + r.invoice.amount, 0)) },
      { label: "Awaiting Approval", value: inChain.length, icon: <Clock size={14} />, tone: "warning", sub: "in the approval chain" },
      { label: "Paid", value: paid.length, icon: <CheckCircle2 size={14} />, tone: "success",
        sub: fmt(paid.reduce((s, r) => s + (r.invoice.amountPaid ?? r.invoice.amount), 0)) },
      { label: "Outstanding", value: fmt(outstanding), icon: <DollarSign size={14} />, tone: "danger", sub: "approved but unpaid" },
    ],
    columns: [
      { key: "ref", header: "Invoice", cell: REF("ref") },
      { key: "contract", header: "Contract" },
      { key: "supplier", header: "Supplier" },
      { key: "received", header: "Received", cell: DATE("received"), text: (r) => fmtDate(String(r.received ?? "")) },
      { key: "amount", header: "Amount", align: "right", cell: MONEY("amount"), text: (r) => fmt(Number(r.amount ?? 0)) },
      { key: "paidDate", header: "Date Paid", cell: DATE("paidDate"), text: (r) => fmtDate(String(r.paidDate ?? "")) },
      { key: "status", header: "Status", cell: BADGE("status") },
    ],
    rows: all.map(({ contract, invoice }) => ({
      __key: invoice.id,
      ref: invoice.invoiceNumber,
      contract: contract.contractNumber,
      supplier: invoice.supplier,
      received: invoice.dateSubmitted,
      amount: invoice.amount,
      paidDate: invoice.datePaid ?? "",
      status: invoice.status,
    })),
    empty: "No invoices have been recorded yet.",
  };
}

/* ── 5. Suppliers ──────────────────────────────────────────────────────────── */

function supplierReport(): Report {
  const suppliers = getSuppliers();
  const s = getSupplierStats();

  return {
    title: "Supplier Performance Report",
    subtitle: "Who is on the approved list, how they have performed, and who is restricted",
    stats: [
      { label: "Suppliers", value: s.total, icon: <Users size={14} />, tone: "neutral", sub: `${s.active} active` },
      { label: "Average Rating", value: s.avgPerformance > 0 ? `${s.avgPerformance}/10` : "—", icon: <TrendingUp size={14} />, tone: "info",
        sub: "across rated suppliers" },
      { label: "Flagged or Blocked", value: s.flagged, icon: <AlertTriangle size={14} />, tone: "danger", sub: "restricted from award" },
      { label: "Document Issues", value: s.expiring, icon: <CalendarClock size={14} />, tone: "warning", sub: "expired or expiring" },
    ],
    columns: [
      { key: "ref", header: "Supplier ID", cell: REF("ref") },
      { key: "name", header: "Supplier / Consultant" },
      { key: "category", header: "Category" },
      { key: "rating", header: "Rating", align: "center",
        text: (r) => (Number(r.rating) > 0 ? `${r.rating}/10` : "Not rated"),
        cell: (r) => {
          const v = Number(r.rating ?? 0);
          if (v <= 0) return <span className="text-[12px] text-slate-400">Not rated</span>;
          return (
            <span className={`text-[12px] font-semibold tabular-nums ${
              v >= 8 ? "text-green-600" : v >= 5 ? "text-amber-600" : "text-red-600"
            }`}>{v}/10</span>
          );
        } },
      { key: "contracts", header: "Contracts", align: "center" },
      { key: "spend", header: "Total Spend", align: "right", cell: MONEY("spend"), text: (r) => fmt(Number(r.spend ?? 0)) },
      { key: "eligibility", header: "Sourcing" },
      { key: "status", header: "Status", cell: BADGE("status") },
    ],
    rows: suppliers.map((v) => {
      const flags = getSupplierFlags(v);
      const e = checkSourcingEligibility(v.id);
      return {
        __key: v.id,
        ref: v.supplierId,
        name: supplierDisplayName(v),
        category: v.category,
        rating: avgScore(v.performance),
        contracts: v.contractHistory?.length ?? v.totalOrders,
        spend: v.totalSpend,
        eligibility: !e.eligible ? "Blocked" : e.requiresManagementApproval ? "Needs approval" : "Eligible",
        status: flags.expiredDocs.length > 0 && v.status === "Active" ? "Active" : v.status,
      };
    }),
    empty: "No suppliers have been registered yet.",
  };
}

export default ProcurementReports;
