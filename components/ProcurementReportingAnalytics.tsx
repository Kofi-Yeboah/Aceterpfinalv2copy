import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import {
  Search, Download, TrendingUp,
  FileText, Clock, CheckCircle2, AlertTriangle,
  Users, Package, DollarSign,
  CalendarClock, ShieldCheck, Inbox
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart
} from "recharts";

import {
  getProcurementPlanItems, getPlanPipeline, getPlanBottlenecks,
  getGeneratedPRs, getPRStats, computeDaysInStage, getGeneratedPOs, getSourcingApprovals,
  subscribe as subscribeProcurement,
  type ProcurementPlanItem, type GeneratedPR,
} from "../lib/procurementStore";
import {
  getContracts, getAllInvoices, getAllChangeRequests, getContractRisks,
  getExpiringContracts, getOverdueDeliverables, getUpcomingDeliverables,
  getContractFinancials, verifyCloseOutReadiness, daysUntil,
  subscribe as subscribeContracts,
  type AwardedContract, type ContractInvoice, type ContractDeliverable,
  type ContractChangeRequest, type PerformanceEvaluation,
} from "../lib/contractStore";
import {
  getVendors, getVendorsByCategory, getBlockedVendors, getVendorsWithDocumentIssues,
  getExpiredDocs, getMissingDocs, checkSourcingEligibility, getVendorFlags,
  avgScore, vendorDisplayName,
  subscribe as subscribeVendors,
  type Vendor,
} from "../lib/vendorStore";
import { exportToCSV, exportToExcel, exportToPDF, type ExportColumn } from "../lib/exportUtils";
import { getCurrentUser, can, denialReason, subscribe as subscribeUser } from "../lib/currentUser";
import { ProcurementTabs, ProcurementTabBar, type ProcurementTab } from "./procurement/ProcurementTabs";
import { ProcurementStatCards, type ProcurementStat } from "./procurement/ProcurementStatCards";

/* ══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "'Montserrat Variable', sans-serif";
const BLUE = "#0B01D0";
const TIME_PERIODS = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year", "All Time"] as const;
const PERIOD_FILTERS = ["Monthly", "Quarterly", "Annually", "Custom Range", "All Time"] as const;
const EXPIRY_WINDOWS = [30, 60, 90] as const;

type TabKey = "planning" | "sourcing" | "vendors" | "contracts" | "donors" | "combined";
type PeriodFilter = (typeof PERIOD_FILTERS)[number];
type Lookback = (typeof TIME_PERIODS)[number];
type ExpiryWindow = (typeof EXPIRY_WINDOWS)[number];

const TAB_LABELS: Record<TabKey, string> = {
  planning: "Planning & Orders",
  sourcing: "Sourcing & Contracts",
  vendors: "Vendors & KPIs",
  contracts: "Contract Reports",
  donors: "Donor Reports",
  combined: "Combined Analysis",
};

/** The report tab bar, in reading order. No counts — a report has none. */
const REPORT_TABS: ProcurementTab<TabKey>[] =
  (Object.keys(TAB_LABELS) as TabKey[]).map(key => ({ key, label: TAB_LABELS[key] }));

/** Chart palette, reused wherever a series count is data-driven. */
const PALETTE = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9", "#ec4899", "#14b8a6", "#f97316", "#64748b"];

/**
 * The shared metric-card row is chromed as a full-bleed band — white, padded,
 * ruled underneath — because that is how it sits directly beneath a screen
 * header. Here the rows appear part-way down an already-padded report body on
 * the slate page, so the band chrome comes off and only the cards remain.
 */

/**
 * KPI targets. These are the only fixed numbers in the module: they are the
 * organisation's service standards, not observations, and everything measured
 * against them is derived from the stores.
 */
const KPI_TARGETS = {
  reqToAwardDays: 20,
  awardToContractDays: 5,
  contractToPaymentDays: 15,
  paymentWithinDays: 30,
  cycleTime: 90,
  costSavings: 85,
  vendorQuality: 88,
  onTimeDelivery: 92,
  compliance: 95,
  paymentTimeliness: 90,
};

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ══════════════════════════════════════════════════════════════════════════════
   FORMATTING
   ══════════════════════════════════════════════════════════════════════════════ */

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );

const fmtPct = (n: number) => `${(Number.isFinite(n) ? n : 0).toFixed(1)}%`;

const fmtDays = (n: number | null) => (n === null ? "—" : `${n.toFixed(1)} days`);

const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(Number.isFinite(n) ? n : 0);

function prettyDate(d: string): string {
  if (!d) return "—";
  const [y, m, day] = d.slice(0, 10).split("-");
  const mi = Number(m) - 1;
  if (!y || Number.isNaN(mi) || !MONTHS_SHORT[mi]) return d;
  return `${Number(day)} ${MONTHS_SHORT[mi]} ${y}`;
}

/** Share of `part` in `total`, guarding the empty-denominator case. */
const pct = (part: number, total: number) => (total > 0 ? (part / total) * 100 : 0);

const average = (values: number[]): number | null =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

/* ══════════════════════════════════════════════════════════════════════════════
   DATE RANGE RESOLUTION — drives every period-aware report
   ══════════════════════════════════════════════════════════════════════════════ */

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const todayISO = () => isoDay(new Date());

interface ResolvedRange {
  from: string | null;
  to: string | null;
  label: string;
}

/** The calendar window implied by the period basis. */
function basisWindow(period: PeriodFilter, customFrom: string, customTo: string): { from: string | null; to: string | null } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (period) {
    case "Monthly":
      return { from: isoDay(new Date(Date.UTC(y, m, 1))), to: isoDay(new Date(Date.UTC(y, m + 1, 0))) };
    case "Quarterly": {
      const q = Math.floor(m / 3);
      return { from: isoDay(new Date(Date.UTC(y, q * 3, 1))), to: isoDay(new Date(Date.UTC(y, q * 3 + 3, 0))) };
    }
    case "Annually":
      return { from: isoDay(new Date(Date.UTC(y, 0, 1))), to: isoDay(new Date(Date.UTC(y, 11, 31))) };
    case "Custom Range":
      return { from: customFrom || null, to: customTo || null };
    case "All Time":
      return { from: null, to: null };
  }
}

/** The rolling lookback chosen in the page header. */
function lookbackWindow(lookback: Lookback): { from: string | null; to: string | null } {
  const days: Record<Lookback, number | null> = {
    "Last 30 Days": 30,
    "Last 3 Months": 90,
    "Last 6 Months": 180,
    "Last Year": 365,
    "All Time": null,
  };
  const span = days[lookback];
  if (span === null) return { from: null, to: null };
  return { from: isoDay(new Date(Date.now() - span * 86_400_000)), to: todayISO() };
}

/** Records must satisfy the basis window and the lookback, so the two compose. */
function resolveRange(
  period: PeriodFilter,
  customFrom: string,
  customTo: string,
  lookback: Lookback
): ResolvedRange {
  const a = basisWindow(period, customFrom, customTo);
  const b = lookbackWindow(lookback);
  const from = [a.from, b.from].filter((v): v is string => !!v).sort().pop() ?? null;
  const to = [a.to, b.to].filter((v): v is string => !!v).sort().shift() ?? null;
  const label =
    !from && !to
      ? "All time"
      : from && to
        ? `${prettyDate(from)} – ${prettyDate(to)}`
        : from
          ? `From ${prettyDate(from)}`
          : `Up to ${prettyDate(to as string)}`;
  return { from, to, label };
}

function withinRange(date: string | undefined | null, range: ResolvedRange): boolean {
  if (!range.from && !range.to) return true;
  if (!date) return false;
  const d = date.slice(0, 10);
  if (range.from && d < range.from) return false;
  if (range.to && d > range.to) return false;
  return true;
}

/* ══════════════════════════════════════════════════════════════════════════════
   GENERIC DERIVATION HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

function groupBy<T>(items: T[], keyOf: (item: T) => string | undefined | null): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    if (!key) continue;
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  return map;
}

/** The month buckets actually present in the supplied dates, most recent last. */
function monthAxis(dateSets: (string | undefined | null)[][], max = 12): string[] {
  const keys = new Set<string>();
  dateSets.forEach(set =>
    set.forEach(d => {
      if (d) keys.add(d.slice(0, 7));
    })
  );
  return Array.from(keys).sort().slice(-max);
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  const mi = Number(m) - 1;
  return MONTHS_SHORT[mi] ? `${MONTHS_SHORT[mi]} ${y.slice(2)}` : key;
}

const inMonth = (date: string | undefined | null, key: string) => !!date && date.slice(0, 7) === key;

function daysBetween(from: string | undefined, to: string | undefined): number | null {
  if (!from || !to) return null;
  const ms = new Date(to.slice(0, 10)).getTime() - new Date(from.slice(0, 10)).getTime();
  if (!Number.isFinite(ms)) return null;
  return Math.round(ms / 86_400_000);
}

/** Loose name match so contracts, invoices and vendor records line up. */
function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(ltd|limited|inc|llc|plc|co|company|group|gh|ghana)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/** Procurement methods collapsed into the three families donors report against. */
function methodFamily(method: string): "Open Competition" | "Limited / RFQ" | "Direct" {
  const m = (method || "").toLowerCase();
  if (/(single source|direct|sole)/.test(m)) return "Direct";
  if (/(limited|quotation|rfq|shopping)/.test(m)) return "Limited / RFQ";
  return "Open Competition";
}

function categoryFamily(category: string): "goods" | "services" | "works" {
  const c = (category || "").toLowerCase();
  if (c.includes("work")) return "works";
  if (c.includes("good")) return "goods";
  return "services";
}

const isCompetitive = (method: string) => methodFamily(method) !== "Direct";

/** The point a requisition is considered committed spend. */
const PR_APPROVED_STATES = ["Approved", "Converted to Sourcing"];
const PR_PENDING_STATES = ["Submitted", "Pending Dept Approval", "Pending Procurement & Finance", "Pending Senior Mgmt"];

function prBucket(pr: GeneratedPR): "Approved" | "Pending" | "Rejected" | "Draft" {
  if (PR_APPROVED_STATES.includes(pr.overallApprovalStatus)) return "Approved";
  if (PR_PENDING_STATES.includes(pr.overallApprovalStatus)) return "Pending";
  if (pr.overallApprovalStatus === "Rejected") return "Rejected";
  return "Draft";
}

function prApprover(pr: GeneratedPR): string {
  const last = [...pr.approvalHistory].reverse().find(h => h.action === "Approved" || h.action === "Rejected");
  return last ? `${last.role}${last.action === "Rejected" ? " (rejected)" : ""}` : pr.currentResponsible || "—";
}

/** Invoice submitted / paid dates, preferring the audited approval chain. */
function invoiceSubmittedDate(inv: ContractInvoice): string {
  return inv.approvalHistory?.find(h => h.action === "Submitted")?.date ?? inv.dateSubmitted;
}

function invoicePaidDate(inv: ContractInvoice): string | undefined {
  return inv.approvalHistory?.find(h => h.action === "Paid")?.date ?? inv.datePaid;
}

function invoiceDaysToPay(inv: ContractInvoice): number | null {
  const paid = invoicePaidDate(inv);
  if (!paid) return null;
  return daysBetween(invoiceSubmittedDate(inv), paid);
}

/** Deliverable state as reported, with overdue derived from the due date. */
function deliverableState(d: ContractDeliverable): { label: string; daysLate: number } {
  const left = daysUntil(d.dueDate);
  if (d.status === "Accepted") {
    const late = d.actualDate ? (daysBetween(d.dueDate, d.actualDate) ?? 0) : 0;
    return { label: "Accepted", daysLate: Math.max(0, late) };
  }
  if (left < 0) return { label: "Overdue", daysLate: -left };
  return { label: d.status, daysLate: 0 };
}

function latestEvaluation(c: AwardedContract): PerformanceEvaluation | undefined {
  const evals = c.performanceEvaluations ?? [];
  if (!evals.length) return undefined;
  return [...evals].sort((a, b) => a.evaluationDate.localeCompare(b.evaluationDate))[evals.length - 1];
}

function criterionScore(ev: PerformanceEvaluation | undefined, matcher: RegExp): number | null {
  if (!ev) return null;
  const c = ev.criteria.find(x => matcher.test(x.name));
  if (!c || !c.maxScore) return null;
  return +((c.score / c.maxScore) * 10).toFixed(1);
}

/** Per-contract compliance checks used by every donor compliance figure. */
const COMPLIANCE_METRICS = [
  "Documentation",
  "Procurement Method",
  "Evaluation Process",
  "Reporting",
  "Contract Mgmt",
  "Audit Readiness",
] as const;
type ComplianceMetric = (typeof COMPLIANCE_METRICS)[number];

function complianceChecks(c: AwardedContract): Record<ComplianceMetric, boolean> {
  const deliverables = c.deliverables ?? [];
  return {
    Documentation: c.documents.some(d => /signed contract|purchase order/i.test(d.label)),
    "Procurement Method": isCompetitive(c.method),
    "Evaluation Process": (c.performanceEvaluations ?? []).length > 0,
    Reporting: c.milestones.length > 0,
    "Contract Mgmt": deliverables.every(d => d.status === "Accepted" || daysUntil(d.dueDate) >= 0),
    "Audit Readiness": (c.auditLog?.length ?? 0) > 0 || !!c.closeOut?.closedDate,
  };
}

/** Prequalification standing, derived from status and document currency. */
function prequalBucket(v: Vendor): "Prequalified" | "Pending Review" | "Expired" | "Suspended" | "Flagged" {
  if (v.status === "Blacklisted" || v.status === "Suspended") return "Suspended";
  if (v.status === "Pending Onboarding" || v.status === "Pending Reactivation" || v.pendingReview) return "Pending Review";
  if (getExpiredDocs(v).length > 0) return "Expired";
  if (v.status === "Flagged") return "Flagged";
  return "Prequalified";
}

const PREQUAL_COLORS: Record<string, string> = {
  Prequalified: "#10b981",
  "Pending Review": "#f59e0b",
  Expired: "#ef4444",
  Suspended: "#6b7280",
  Flagged: "#f97316",
};

/* ══════════════════════════════════════════════════════════════════════════════
   LIVE STORE SUBSCRIPTION
   ══════════════════════════════════════════════════════════════════════════════ */

/** Re-renders the reports whenever any upstream module mutates its store. */
function useStoreVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion(v => v + 1);
    const unsubscribers = [
      subscribeProcurement(bump),
      subscribeContracts(bump),
      subscribeVendors(bump),
      subscribeUser(bump),
    ];
    return () => unsubscribers.forEach(u => u());
  }, []);
  return version;
}

/* ══════════════════════════════════════════════════════════════════════════════
   PRESENTATION PRIMITIVES
   ══════════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Approved: { bg: "#dcfce7", text: "#166534" },
    Active: { bg: "#dcfce7", text: "#166534" },
    Prequalified: { bg: "#dcfce7", text: "#166534" },
    Accepted: { bg: "#dcfce7", text: "#166534" },
    Paid: { bg: "#dcfce7", text: "#166534" },
    Completed: { bg: "#dcfce7", text: "#166534" },
    Contracted: { bg: "#dcfce7", text: "#166534" },
    Implemented: { bg: "#dcfce7", text: "#166534" },
    Closed: { bg: "#f1f5f9", text: "#475569" },
    Pending: { bg: "#fef3c7", text: "#92400e" },
    "Pending Review": { bg: "#fef3c7", text: "#92400e" },
    "Pending Payment": { bg: "#fef3c7", text: "#92400e" },
    "Pending Final": { bg: "#fef3c7", text: "#92400e" },
    "Pending Approval": { bg: "#fef3c7", text: "#92400e" },
    "Pending Onboarding": { bg: "#fef3c7", text: "#92400e" },
    "Pending Reactivation": { bg: "#fef3c7", text: "#92400e" },
    "Pending Dept Approval": { bg: "#fef3c7", text: "#92400e" },
    "Pending Procurement & Finance": { bg: "#fef3c7", text: "#92400e" },
    "Pending Senior Mgmt": { bg: "#fef3c7", text: "#92400e" },
    "Under Review": { bg: "#fef3c7", text: "#92400e" },
    "Under Evaluation": { bg: "#fef3c7", text: "#92400e" },
    Submitted: { bg: "#eff6ff", text: "#1e40af" },
    "CC Reviewed": { bg: "#eff6ff", text: "#1e40af" },
    "Procurement Approved": { bg: "#e0e7ff", text: "#3730a3" },
    "Supervisor Approved": { bg: "#ddd6fe", text: "#5b21b6" },
    Queried: { bg: "#fee2e2", text: "#991b1b" },
    Rejected: { bg: "#fee2e2", text: "#991b1b" },
    Expired: { bg: "#fee2e2", text: "#991b1b" },
    Overdue: { bg: "#fee2e2", text: "#991b1b" },
    Blacklisted: { bg: "#fee2e2", text: "#991b1b" },
    Terminated: { bg: "#fee2e2", text: "#991b1b" },
    Delayed: { bg: "#fee2e2", text: "#991b1b" },
    Expiring: { bg: "#fff7ed", text: "#9a3412" },
    "Expiring Soon": { bg: "#fff7ed", text: "#9a3412" },
    Flagged: { bg: "#fff7ed", text: "#9a3412" },
    "Under Variation": { bg: "#fff7ed", text: "#9a3412" },
    Draft: { bg: "#f1f5f9", text: "#475569" },
    Suspended: { bg: "#f1f5f9", text: "#475569" },
    Withdrawn: { bg: "#f1f5f9", text: "#475569" },
    "Not Started": { bg: "#f1f5f9", text: "#475569" },
    "In Progress": { bg: "#eff6ff", text: "#1e40af" },
    Renew: { bg: "#eff6ff", text: "#1e40af" },
    Renewed: { bg: "#eff6ff", text: "#1e40af" },
    Review: { bg: "#fef3c7", text: "#92400e" },
    "Urgent Renewal": { bg: "#fee2e2", text: "#991b1b" },
    Awarded: { bg: "#dcfce7", text: "#166534" },
    "Converted to Sourcing": { bg: "#dcfce7", text: "#166534" },
    "In Review": { bg: "#fef3c7", text: "#92400e" },
    Sent: { bg: "#eff6ff", text: "#1e40af" },
    Cancelled: { bg: "#fee2e2", text: "#991b1b" },
    "On Track": { bg: "#dcfce7", text: "#166534" },
    Goods: { bg: "#eff6ff", text: "#1e40af" },
    Services: { bg: "#f0fdf4", text: "#166534" },
    Works: { bg: "#fff7ed", text: "#9a3412" },
    Consultancy: { bg: "#faf5ff", text: "#6b21a8" },
  };
  const s = map[status] || { bg: "#f1f5f9", text: "#475569" };
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: s.bg, color: s.text, fontFamily: F, fontWeight: 600 }}>
      {status}
    </span>
  );
}

function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
        <Inbox size={18} className="text-slate-400" />
      </div>
      <p className="text-[12px] text-slate-600" style={{ fontFamily: F, fontWeight: 600 }}>{message}</p>
      {hint && <p className="text-[11px] text-slate-400 mt-1 max-w-md" style={{ fontFamily: F }}>{hint}</p>}
    </div>
  );
}

/** A chart panel that swaps to an empty state instead of drawing empty axes. */
function ChartCard({ title, subtitle, height = 220, isEmpty, emptyMessage, emptyHint, className, children }: {
  title: string;
  subtitle?: string;
  height?: number;
  isEmpty: boolean;
  emptyMessage: string;
  emptyHint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-4 ${className ?? ""}`}>
      <h3 className="text-[13px] text-slate-900" style={{ fontFamily: F, fontWeight: 700 }}>{title}</h3>
      {subtitle && <p className="text-[10px] text-slate-500 mt-0.5 mb-3" style={{ fontFamily: F }}>{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {isEmpty ? (
        <div style={{ height }} className="flex items-center justify-center">
          <EmptyState message={emptyMessage} hint={emptyHint} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}

/**
 * The per-report sub-tabs. The six render functions address these by index, so
 * the index stays the public contract and the module-standard tab control is
 * driven with the index rendered as its key.
 */
function SubTabBar({ tabs, active, onChange }: { tabs: string[]; active: number; onChange: (i: number) => void }) {
  return (
    <ProcurementTabBar>
      <ProcurementTabs
        tabs={tabs.map((label, i) => ({ key: String(i), label }))}
        active={String(active)}
        onChange={key => onChange(Number(key))}
      />
    </ProcurementTabBar>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PERIOD FILTER
   ══════════════════════════════════════════════════════════════════════════════ */

function PeriodFilterBar({
  periodFilter, setPeriodFilter, customFrom, setCustomFrom, customTo, setCustomTo, range, scopeNote,
}: {
  periodFilter: PeriodFilter;
  setPeriodFilter: (v: PeriodFilter) => void;
  customFrom: string;
  setCustomFrom: (v: string) => void;
  customTo: string;
  setCustomTo: (v: string) => void;
  range: ResolvedRange;
  scopeNote: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap bg-white border border-slate-200 rounded-xl px-4 py-2.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-slate-500" style={{ fontFamily: F, fontWeight: 600 }}>Period:</span>
        <ProcurementTabs
          tabs={PERIOD_FILTERS.map(p => ({ key: p, label: p }))}
          active={periodFilter}
          onChange={setPeriodFilter}
          minWidth={72}
        />

        {periodFilter === "Custom Range" && (
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={e => setCustomFrom(e.target.value)}
              aria-label="Custom range start date"
              className="px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ fontFamily: F }}
            />
            <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>to</span>
            <input
              type="date"
              value={customTo}
              min={customFrom || undefined}
              onChange={e => setCustomTo(e.target.value)}
              aria-label="Custom range end date"
              className="px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ fontFamily: F }}
            />
          </div>
        )}

        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px]" style={{ fontFamily: F, fontWeight: 600 }}>
          {range.label}
        </span>
      </div>
      <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{scopeNote}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TABLES & EXPORT — one column definition drives the screen and every export
   ══════════════════════════════════════════════════════════════════════════════ */

type ReportRow = Record<string, unknown>;

interface TableColumn {
  key: string;
  header: string;
  /** Plain-text value used by every export; falls back to String(value). */
  format?: (value: unknown, row: ReportRow) => string;
  /** Rich on-screen cell. Exports always use `format`, never this. */
  cell?: (row: ReportRow) => ReactNode;
  align?: "left" | "center" | "right";
}

interface ExportMeta {
  subtitle: string;
  generatedBy: string;
}

function cellText(row: ReportRow, col: TableColumn): string {
  const raw = row[col.key];
  if (col.format) return col.format(raw, row);
  if (raw === null || raw === undefined) return "";
  if (Array.isArray(raw)) return raw.join("; ");
  return String(raw);
}

function toExportColumns(columns: TableColumn[]): ExportColumn<ReportRow>[] {
  return columns.map(({ key, header, format }) => ({ key, header, format }));
}

function filterRows(rows: ReportRow[], columns: TableColumn[], query: string): ReportRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(row => columns.some(col => cellText(row, col).toLowerCase().includes(q)));
}

/** Excel / PDF / CSV for the exact rows currently on screen. */
function ExportBar({ title, columns, rows, meta }: {
  title: string;
  columns: TableColumn[];
  rows: ReportRow[];
  meta: ExportMeta;
}) {
  const allowed = can("report.export");
  const exportColumns = toExportColumns(columns);
  const reason = allowed ? undefined : denialReason("report.export");

  const buttons: { label: string; run: () => void }[] = [
    { label: "Export to Excel", run: () => exportToExcel(title, exportColumns, rows, meta) },
    { label: "Export to PDF", run: () => exportToPDF(title, exportColumns, rows, meta) },
    { label: "Export to CSV", run: () => exportToCSV(title, exportColumns, rows) },
  ];

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
      <div>
        <h3 className="text-[13px] text-slate-900" style={{ fontFamily: F, fontWeight: 700 }}>{title}</h3>
        <p className="text-[10px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
          {fmtNum(rows.length)} record{rows.length === 1 ? "" : "s"} · {meta.subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {buttons.map(b => (
          <button
            key={b.label}
            onClick={allowed ? b.run : undefined}
            disabled={!allowed}
            title={reason}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] transition-colors ${allowed
              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"}`}
            style={{ fontFamily: F, fontWeight: 500 }}>
            <Download size={12} /> {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReportTable({ columns, rows, emptyMessage, emptyHint }: {
  columns: TableColumn[];
  rows: ReportRow[];
  emptyMessage: string;
  emptyHint?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl">
        <EmptyState message={emptyMessage} hint={emptyHint} />
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]" style={{ fontFamily: F }}>
        <thead>
          <tr style={{ backgroundColor: BLUE }}>
            {columns.map(c => (
              <th key={c.key}
                className={`px-3 py-2.5 text-white ${c.align === "center" ? "text-center" : c.align === "right" ? "text-right" : "text-left"}`}
                style={{ fontWeight: 600, fontSize: 11 }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={String(row.__key ?? i)} className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}>
              {columns.map(c => (
                <td key={c.key}
                  className={`px-3 py-2 text-slate-700 ${c.align === "center" ? "text-center" : c.align === "right" ? "text-right" : "text-left"}`}>
                  {c.cell ? c.cell(row) : cellText(row, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A complete register: export bar, optional inline controls, and the table.
 * Search is applied here so what is exported is exactly what is displayed.
 */
function ReportSection({ title, columns, rows, meta, search, controls, emptyMessage, emptyHint }: {
  title: string;
  columns: TableColumn[];
  rows: ReportRow[];
  meta: ExportMeta;
  search: string;
  controls?: ReactNode;
  emptyMessage: string;
  emptyHint?: string;
}) {
  const visible = useMemo(() => filterRows(rows, columns, search), [rows, columns, search]);
  return (
    <div>
      <ExportBar title={title} columns={columns} rows={visible} meta={meta} />
      {controls && <div className="mb-3">{controls}</div>}
      <ReportTable columns={columns} rows={visible} emptyMessage={emptyMessage} emptyHint={emptyHint} />
    </div>
  );
}

/* ── Reusable cell renderers ──────────────────────────────────────────────── */

const badgeCell = (key: string) => (row: ReportRow) => <StatusBadge status={String(row[key] ?? "—")} />;

const moneyCell = (key: string) => (row: ReportRow) => (
  <span className="text-slate-900" style={{ fontWeight: 600 }}>{fmt(Number(row[key] ?? 0))}</span>
);

const refCell = (key: string) => (row: ReportRow) => (
  <span className="text-indigo-700" style={{ fontWeight: 600 }}>{String(row[key] ?? "—")}</span>
);

function progressCell(valueKey: string, totalKey: string) {
  return (row: ReportRow) => {
    const done = Number(row[valueKey] ?? 0);
    const total = Number(row[totalKey] ?? 0);
    const p = pct(done, total);
    return (
      <div className="flex items-center gap-2 min-w-[110px]">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, p)}%`, backgroundColor: total > 0 && done === total ? "#10b981" : BLUE }} />
        </div>
        <span className="text-[10px] text-slate-500" style={{ fontWeight: 600 }}>{done}/{total}</span>
      </div>
    );
  };
}

function scoreCell(key: string, good: number, fair: number, suffix = "") {
  return (row: ReportRow) => {
    const raw = row[key];
    if (raw === null || raw === undefined || raw === "") return <span className="text-slate-400">—</span>;
    const v = Number(raw);
    return (
      <span className={v >= good ? "text-green-600" : v >= fair ? "text-amber-600" : "text-red-500"} style={{ fontWeight: 700 }}>
        {v.toFixed(1)}{suffix}
      </span>
    );
  };
}

function countCell(key: string, warnAbove = 0) {
  return (row: ReportRow) => {
    const v = Number(row[key] ?? 0);
    return <span className={v > warnAbove ? "text-red-600" : "text-slate-500"} style={{ fontWeight: v > warnAbove ? 700 : 500 }}>{fmtNum(v)}</span>;
  };
}

const yesNoCell = (key: string) => (row: ReportRow) => (
  <span className={row[key] ? "text-green-600" : "text-amber-600"} style={{ fontWeight: 600 }}>{row[key] ? "Yes" : "No"}</span>
);

const moneyFormat = (v: unknown) => fmt(Number(v ?? 0));
const pctFormat = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : fmtPct(Number(v)));
const scoreFormat = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : Number(v).toFixed(1));
const yesNoFormat = (v: unknown) => (v ? "Yes" : "No");
/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function ProcurementReportingAnalytics({ initialTab }: { initialTab?: TabKey }) {
  const version = useStoreVersion();

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab || "planning");
  useEffect(() => { if (initialTab) setActiveTab(initialTab); }, [initialTab]);

  const [selectedPeriod, setSelectedPeriod] = useState<Lookback>("All Time");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reqFilter, setReqFilter] = useState<"All" | "Approved" | "Pending" | "Rejected" | "Draft">("All");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("All Time");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState(todayISO());
  const [expiryWindow, setExpiryWindow] = useState<ExpiryWindow>(90);
  const [subTab, setSubTab] = useState(0);
  useEffect(() => { setSubTab(0); }, [activeTab]);

  const range = useMemo(
    () => resolveRange(periodFilter, customFrom, customTo, selectedPeriod),
    [periodFilter, customFrom, customTo, selectedPeriod]
  );

  const currentUser = getCurrentUser();
  const exportMeta: ExportMeta = useMemo(
    () => ({ subtitle: `${TAB_LABELS[activeTab]} · ${range.label}`, generatedBy: currentUser.name }),
    [activeTab, range.label, currentUser.name]
  );

  /* ── Period-scoped source data ─────────────────────────────────────────── */

  const base = useMemo(() => {
    void version; // re-derive whenever any store notifies

    const allPlanItems = getProcurementPlanItems();
    const planItems = allPlanItems.filter(p => withinRange(p.initiationDate, range));
    const approvedPlanItems = planItems.filter(p => p.approvalStatus === "Approved");

    const allPRs = getGeneratedPRs();
    const prs = allPRs.filter(p => withinRange(p.dateRequested, range));
    const pos = getGeneratedPOs().filter(p => withinRange(p.orderDate, range));
    const sourcing = getSourcingApprovals().filter(s => withinRange(s.dateSubmitted, range));

    const allContracts = getContracts();
    const contracts = allContracts.filter(c => withinRange(c.startDate || c.awardDate, range));
    const contractIds = new Set(contracts.map(c => c.id));

    const invoices = getAllInvoices().filter(r => withinRange(invoiceSubmittedDate(r.invoice), range));
    const changeRequests = getAllChangeRequests().filter(r => withinRange(r.changeRequest.requestedDate, range));
    const risks = getContractRisks().filter(r => contractIds.has(r.contract.id));

    const deliverables = contracts.flatMap(c => (c.deliverables ?? []).map(deliverable => ({ contract: c, deliverable })));

    const vendors = getVendors();
    const vendorByName = new Map<string, Vendor>();
    vendors.forEach(v => vendorByName.set(normaliseName(vendorDisplayName(v)), v));
    const lookupVendor = (name: string) => vendorByName.get(normaliseName(name || ""));

    // Cross-module links: contract → requisition → plan item.
    const contractBySourcePR = new Map<string, AwardedContract>();
    allContracts.forEach(c => { if (c.sourcePR) contractBySourcePR.set(c.sourcePR, c); });
    const planByPPId = new Map<string, ProcurementPlanItem>();
    allPlanItems.forEach(p => planByPPId.set(p.ppItemId, p));
    const prByNumber = new Map<string, GeneratedPR>();
    allPRs.forEach(p => prByNumber.set(p.requisitionNumber, p));

    /** The funding source a contract is charged to, falling back to its requisition. */
    const contractFunding = (c: AwardedContract): string => {
      if (c.fundingSource) return c.fundingSource;
      const pr = c.sourcePR ? prByNumber.get(c.sourcePR) : undefined;
      return pr?.fundingSource || "Unattributed";
    };

    return {
      allPlanItems, planItems, approvedPlanItems,
      allPRs, prs, pos, sourcing,
      allContracts, contracts, invoices, changeRequests, risks, deliverables,
      vendors, lookupVendor,
      contractBySourcePR, planByPPId, prByNumber, contractFunding,
    };
  }, [version, range]);

  const scopeNote = `${fmtNum(base.prs.length)} requisitions · ${fmtNum(base.contracts.length)} contracts · ${fmtNum(base.invoices.length)} invoices in scope`;

  /* ── Cross-cutting KPI derivations ─────────────────────────────────────── */

  const kpis = useMemo(() => {
    const prStats = getPRStats();

    const awardToContract = average(
      base.contracts
        .map(c => daysBetween(c.awardDate, c.startDate))
        .filter((d): d is number => d !== null && d >= 0)
    );

    const contractToPayment = average(
      base.invoices
        .map(({ contract, invoice }) => {
          const paid = invoicePaidDate(invoice);
          return paid ? daysBetween(contract.startDate, paid) : null;
        })
        .filter((d): d is number => d !== null && d >= 0)
    );

    const paymentDurations = base.invoices
      .map(r => invoiceDaysToPay(r.invoice))
      .filter((d): d is number => d !== null && d >= 0);
    const onTimePayments = paymentDurations.filter(d => d <= KPI_TARGETS.paymentWithinDays).length;
    const paymentTimeliness = pct(onTimePayments, paymentDurations.length);

    const allDeliverables = base.deliverables.map(d => d.deliverable);
    const settledDeliverables = allDeliverables.filter(d => d.status === "Accepted" && d.actualDate);
    const onTimeDeliveries = settledDeliverables.filter(d => (daysBetween(d.dueDate, d.actualDate) ?? 0) <= 0).length;
    const onTimeDelivery = pct(onTimeDeliveries, settledDeliverables.length);

    const scoredVendors = base.vendors.filter(v => avgScore(v.performance) > 0);
    const vendorQuality = scoredVendors.length
      ? (scoredVendors.reduce((s, v) => s + avgScore(v.performance), 0) / scoredVendors.length) * 10
      : 0;
    const responsiveness = scoredVendors.length
      ? (scoredVendors.reduce((s, v) => s + v.performance.responsiveness, 0) / scoredVendors.length) * 10
      : 0;

    const complianceTotals = base.contracts.reduce(
      (acc, c) => {
        const checks = complianceChecks(c);
        COMPLIANCE_METRICS.forEach(m => { acc.total += 1; if (checks[m]) acc.passed += 1; });
        return acc;
      },
      { passed: 0, total: 0 }
    );
    const compliance = pct(complianceTotals.passed, complianceTotals.total);

    // Procurement efficiency: approved plan lines that reached award or beyond.
    const executedStates = ["Awarded", "Contracted", "Completed"];
    const executed = base.approvedPlanItems.filter(p => executedStates.includes(p.status)).length;
    const executionRate = pct(executed, base.approvedPlanItems.length);

    // Cost savings, only where a plan line can be traced through to an award.
    const savingsPairs = base.approvedPlanItems
      .map(item => {
        const pr = base.allPRs.find(p => p.linkedPlanItemId === item.ppItemId);
        const contract = pr ? base.contractBySourcePR.get(pr.requisitionNumber) : undefined;
        return contract ? { planned: item.estimatedValue, awarded: contract.value } : null;
      })
      .filter((p): p is { planned: number; awarded: number } => p !== null);
    const plannedTotal = savingsPairs.reduce((s, p) => s + p.planned, 0);
    const awardedTotal = savingsPairs.reduce((s, p) => s + p.awarded, 0);
    const totalSavings = plannedTotal - awardedTotal;
    const avgCostSavings = plannedTotal > 0 ? pct(totalSavings, plannedTotal) : null;

    const cycleScore = prStats.avgCycleTimeDays > 0
      ? Math.min(100, pct(KPI_TARGETS.reqToAwardDays, prStats.avgCycleTimeDays))
      : 0;
    const savingsScore = avgCostSavings === null ? 0 : Math.max(0, Math.min(100, avgCostSavings * 10));

    const radar = [
      { metric: "Cycle Time", score: +cycleScore.toFixed(1), target: KPI_TARGETS.cycleTime },
      { metric: "Cost Savings", score: +savingsScore.toFixed(1), target: KPI_TARGETS.costSavings },
      { metric: "Vendor Quality", score: +vendorQuality.toFixed(1), target: KPI_TARGETS.vendorQuality },
      { metric: "On-Time Delivery", score: +onTimeDelivery.toFixed(1), target: KPI_TARGETS.onTimeDelivery },
      { metric: "Compliance", score: +compliance.toFixed(1), target: KPI_TARGETS.compliance },
      { metric: "Payment Timeliness", score: +paymentTimeliness.toFixed(1), target: KPI_TARGETS.paymentTimeliness },
    ];

    return {
      prStats,
      reqToAward: prStats.avgCycleTimeDays > 0 ? prStats.avgCycleTimeDays : null,
      awardToContract,
      contractToPayment,
      paymentTimeliness,
      paidInvoiceCount: paymentDurations.length,
      onTimeDelivery,
      settledDeliverableCount: settledDeliverables.length,
      vendorQuality,
      responsiveness,
      compliance,
      executed,
      plannedCount: base.approvedPlanItems.length,
      executionRate,
      totalSavings,
      avgCostSavings,
      savingsSampleSize: savingsPairs.length,
      radar,
    };
  }, [base]);
  /* ── Planning & Orders derivations ─────────────────────────────────────── */

  const planning = useMemo(() => {
    const months = monthAxis([
      base.planItems.map(p => p.initiationDate),
      base.prs.map(p => p.dateRequested),
      base.pos.map(p => p.orderDate),
    ]);

    const pipelineSeries = months.map(key => ({
      month: monthLabel(key),
      planned: base.planItems.filter(p => inMonth(p.initiationDate, key)).length,
      initiated: base.prs.filter(p => inMonth(p.dateRequested, key)).length,
      completed: base.pos.filter(p => inMonth(p.orderDate, key)).length,
    }));

    const poTrend = months.map(key => {
      const inBucket = base.pos.filter(p => inMonth(p.orderDate, key));
      return {
        month: monthLabel(key),
        orders: inBucket.length,
        value: inBucket.reduce((s, p) => s + p.amount, 0),
      };
    });

    const statusColors: Record<string, string> = {
      Approved: "#10b981", Pending: "#f59e0b", Rejected: "#ef4444", Draft: "#94a3b8",
    };
    const requisitionStatus = (["Approved", "Pending", "Rejected", "Draft"] as const)
      .map(name => ({ name, value: base.prs.filter(p => prBucket(p) === name).length, color: statusColors[name] }))
      .filter(d => d.value > 0);

    // Planned vs committed vs spent. Committed counts awarded contracts plus
    // approved requisitions that have not yet converted into one.
    const departments = new Set<string>();
    base.approvedPlanItems.forEach(p => departments.add(p.department || "Unassigned"));
    base.contracts.forEach(c => departments.add(c.department || "Unassigned"));
    base.prs.forEach(p => departments.add(p.department || "Unassigned"));

    const budgetUtilization = Array.from(departments)
      .map(department => {
        const planned = base.approvedPlanItems
          .filter(p => (p.department || "Unassigned") === department)
          .reduce((s, p) => s + p.estimatedValue, 0);
        const deptContracts = base.contracts.filter(c => (c.department || "Unassigned") === department);
        const contractCommitted = deptContracts.reduce((s, c) => s + c.value, 0);
        const uncontractedPRs = base.prs
          .filter(p => (p.department || "Unassigned") === department)
          .filter(p => prBucket(p) === "Approved" && !base.contractBySourcePR.has(p.requisitionNumber));
        const committed = contractCommitted + uncontractedPRs.reduce((s, p) => s + p.estimatedCost, 0);
        const spent = deptContracts.reduce((s, c) => s + getContractFinancials(c).totalPaid, 0);
        return { department, planned, committed, spent };
      })
      .filter(d => d.planned > 0 || d.committed > 0 || d.spent > 0)
      .sort((a, b) => b.planned + b.committed - (a.planned + a.committed));

    const totalPlanned = budgetUtilization.reduce((s, d) => s + d.planned, 0);
    const totalCommitted = budgetUtilization.reduce((s, d) => s + d.committed, 0);
    const totalSpent = budgetUtilization.reduce((s, d) => s + d.spent, 0);

    const planStatusOrder = ["Not Started", "In Progress", "Under Evaluation", "Awarded", "Contracted", "Completed", "Delayed"];
    const planStatusBreakdown = planStatusOrder
      .map((name, i) => ({ name, value: base.planItems.filter(p => p.status === name).length, color: PALETTE[i % PALETTE.length] }))
      .filter(d => d.value > 0);

    const methodBreakdown = Array.from(groupBy(base.planItems, p => p.procurementMethod))
      .map(([name, items]) => ({ name, count: items.length, value: items.reduce((s, p) => s + p.estimatedValue, 0) }))
      .sort((a, b) => b.count - a.count);

    const cycleStages = [
      { stage: "Requisition to Award", avg: kpis.reqToAward ?? 0, target: KPI_TARGETS.reqToAwardDays, measured: kpis.reqToAward !== null },
      { stage: "Award to Contract", avg: kpis.awardToContract ?? 0, target: KPI_TARGETS.awardToContractDays, measured: kpis.awardToContract !== null },
      { stage: "Contract to Payment", avg: kpis.contractToPayment ?? 0, target: KPI_TARGETS.contractToPaymentDays, measured: kpis.contractToPayment !== null },
    ];

    const poValue = base.pos.reduce((s, p) => s + p.amount, 0);

    return {
      pipelineSeries, poTrend, requisitionStatus, budgetUtilization,
      totalPlanned, totalCommitted, totalSpent,
      planStatusBreakdown, methodBreakdown, cycleStages, poValue,
    };
  }, [base, kpis]);

  /** Forward-looking plan pipeline; anchored on today, not the report period. */
  const pipeline = useMemo(() => {
    void version;
    const buckets = EXPIRY_WINDOWS.map(days => ({ days, items: getPlanPipeline(days) }));
    const bottlenecks = getPlanBottlenecks();
    return {
      buckets,
      upcoming: buckets[buckets.length - 1].items,
      bottlenecks,
    };
  }, [version]);

  /* ── Sourcing derivations ──────────────────────────────────────────────── */

  const sourcingData = useMemo(() => {
    const statusColors: Record<string, string> = { Approved: "#10b981", Pending: "#f59e0b", Rejected: "#ef4444" };
    const rfqStatus = (["Approved", "Pending", "Rejected"] as const)
      .map(name => ({ name, value: base.sourcing.filter(s => s.approvalStatus === name).length, color: statusColors[name] }))
      .filter(d => d.value > 0);

    // Bid submission by sourcing project: cases run vs cases carried to award.
    const byProject = Array.from(groupBy(base.sourcing, s => s.projectName || "Unassigned"))
      .map(([project, rows]) => {
        const submitted = rows.length;
        const awarded = rows.filter(r => r.approvalStatus === "Approved").length;
        return {
          project,
          shortLabel: project.length > 18 ? `${project.slice(0, 18)}…` : project,
          invited: submitted,
          submitted: awarded,
          value: rows.reduce((s, r) => s + r.estimatedValue, 0),
          rate: pct(awarded, submitted),
        };
      })
      .sort((a, b) => b.invited - a.invited);

    const months = monthAxis([base.invoices.map(r => invoiceSubmittedDate(r.invoice))]);
    let runningOutstanding = 0;
    const invoiceTrend = months.map(key => {
      const bucket = base.invoices.filter(r => inMonth(invoiceSubmittedDate(r.invoice), key));
      const invoiced = bucket.reduce((s, r) => s + r.invoice.amount, 0);
      const paid = base.invoices
        .filter(r => inMonth(invoicePaidDate(r.invoice), key))
        .reduce((s, r) => s + (r.invoice.amountPaid ?? r.invoice.amount), 0);
      runningOutstanding += invoiced - paid;
      return { month: monthLabel(key), invoiced, paid, outstanding: Math.max(0, runningOutstanding) };
    });

    const totalInvoiced = base.invoices.reduce((s, r) => s + r.invoice.amount, 0);
    const avgAwardRate = average(byProject.map(p => p.rate));

    return { rfqStatus, byProject, invoiceTrend, totalInvoiced, avgAwardRate };
  }, [base]);

  /** Contracts approaching — or past — their end date, with the window control. */
  const expiry = useMemo(() => {
    void version;
    const rows = base.allContracts
      .filter(c => c.status !== "Closed")
      .map(c => ({ contract: c, daysLeft: daysUntil(c.endDate) }))
      .filter(r => r.daysLeft <= expiryWindow)
      .sort((a, b) => a.daysLeft - b.daysLeft);
    return {
      rows,
      expiringSoon: getExpiringContracts(expiryWindow),
      overdue: rows.filter(r => r.daysLeft < 0).length,
    };
  }, [base.allContracts, expiryWindow, version]);
  /* ── Vendor & KPI derivations ──────────────────────────────────────────── */

  const vendorData = useMemo(() => {
    const prequalCounts = Array.from(groupBy(base.vendors, v => prequalBucket(v)))
      .map(([name, list]) => ({ name, value: list.length, color: PREQUAL_COLORS[name] ?? "#94a3b8" }))
      .sort((a, b) => b.value - a.value);

    const byCategory = getVendorsByCategory().map((c, i) => ({ ...c, color: PALETTE[i % PALETTE.length] }));
    const blocked = getBlockedVendors();
    const docIssues = getVendorsWithDocumentIssues();
    const docIssueIds = new Set(docIssues.map(d => d.vendor.id));

    /** Every counterparty seen on a contract, invoice or sourcing case. */
    interface Party {
      name: string;
      vendor?: Vendor;
      contracts: AwardedContract[];
      invoices: ContractInvoice[];
      sourcingCases: number;
      sourcingWins: number;
    }
    const parties = new Map<string, Party>();
    const partyFor = (name: string): Party => {
      const key = normaliseName(name) || name.toLowerCase();
      let entry = parties.get(key);
      if (!entry) {
        entry = { name, vendor: base.lookupVendor(name), contracts: [], invoices: [], sourcingCases: 0, sourcingWins: 0 };
        parties.set(key, entry);
      }
      return entry;
    };
    base.vendors.forEach(v => partyFor(vendorDisplayName(v)));
    base.contracts.forEach(c => partyFor(c.party).contracts.push(c));
    base.invoices.forEach(r => partyFor(r.invoice.vendor || r.contract.party).invoices.push(r.invoice));
    base.sourcing.forEach(s => {
      const p = partyFor(s.vendor);
      p.sourcingCases += 1;
      if (s.approvalStatus === "Approved") p.sourcingWins += 1;
    });

    const partyList = Array.from(parties.values());

    const participation = partyList
      .map(p => {
        const totalValue = p.contracts.reduce((s, c) => s + c.value, 0);
        return {
          vendor: p.name,
          bidsSubmitted: p.sourcingCases,
          awardsWon: Math.max(p.sourcingWins, p.contracts.length),
          winRate: pct(Math.max(p.sourcingWins, p.contracts.length), p.sourcingCases),
          totalContractValue: totalValue,
          activeContracts: p.contracts.filter(c => c.status === "Active" || c.status === "Expiring Soon" || c.status === "Under Variation").length,
          completedContracts: p.contracts.filter(c => c.status === "Closed" || c.status === "Expired" || c.status === "Renewed").length,
        };
      })
      .filter(p => p.bidsSubmitted > 0 || p.awardsWon > 0)
      .sort((a, b) => b.totalContractValue - a.totalContractValue);

    const payments = partyList
      .map(p => {
        const paid = p.invoices.filter(i => i.status === "Paid");
        const queried = p.invoices.filter(i => i.status === "Queried");
        const pending = p.invoices.filter(i => i.status !== "Paid" && i.status !== "Queried");
        const overdue = pending.filter(i => (daysBetween(invoiceSubmittedDate(i), todayISO()) ?? 0) > KPI_TARGETS.paymentWithinDays);
        const totalInvoiced = p.invoices.reduce((s, i) => s + i.amount, 0);
        const totalPaid = paid.reduce((s, i) => s + (i.amountPaid ?? i.amount), 0);
        const durations = p.invoices.map(invoiceDaysToPay).filter((d): d is number => d !== null && d >= 0);
        return {
          vendor: p.name,
          invoicesSubmitted: p.invoices.length,
          paid: paid.length,
          pending: pending.length,
          queried: queried.length,
          overdue: overdue.length,
          totalInvoiced,
          totalPaid,
          outstanding: totalInvoiced - totalPaid,
          avgDaysToPay: average(durations),
        };
      })
      .filter(p => p.invoicesSubmitted > 0)
      .sort((a, b) => b.totalInvoiced - a.totalInvoiced);

    const engagement = partyList
      .flatMap(p =>
        Array.from(groupBy(p.contracts, c => base.contractFunding(c))).map(([donor, list]) => {
          const evals = list.map(c => latestEvaluation(c)).filter((e): e is PerformanceEvaluation => !!e);
          const perfFromEvals = average(evals.map(e => e.overallScore * 10));
          const perfFromVendor = p.vendor && avgScore(p.vendor.performance) > 0 ? avgScore(p.vendor.performance) * 10 : null;
          return {
            vendor: p.name,
            donor,
            contracts: list.length,
            totalValue: list.reduce((s, c) => s + c.value, 0),
            paid: list.reduce((s, c) => s + getContractFinancials(c).totalPaid, 0),
            avgPerformance: perfFromEvals ?? perfFromVendor,
          };
        })
      )
      .sort((a, b) => b.totalValue - a.totalValue);

    const master = base.vendors.map(v => {
      const p = parties.get(normaliseName(vendorDisplayName(v)));
      const contractValue = p ? p.contracts.reduce((s, c) => s + c.value, 0) : 0;
      return {
        vendor: v,
        name: vendorDisplayName(v),
        contractsInPeriod: p?.contracts.length ?? 0,
        contractValue,
        lifetimeContracts: v.contractHistory?.length ?? v.totalOrders,
        lifetimeSpend: v.totalSpend,
        score: avgScore(v.performance),
        evaluations: v.evaluations?.length ?? 0,
        prequal: prequalBucket(v),
        expired: getExpiredDocs(v),
        missing: getMissingDocs(v),
        hasDocIssue: docIssueIds.has(v.id),
        eligibility: checkSourcingEligibility(v.id),
      };
    });

    // Approval-stage cycle time, bucketed by the month the requisition was raised.
    const cycleMonths = monthAxis([base.prs.map(p => p.dateRequested)]);
    const cycleTrend = cycleMonths
      .map(key => {
        const bucket = base.prs.filter(p => inMonth(p.dateRequested, key));
        const stageValue = (pick: (pr: GeneratedPR) => number | null) =>
          average(bucket.map(pick).filter((d): d is number => d !== null && d >= 0)) ?? 0;

        const reqToApproval = stageValue(pr => {
          const submitted = pr.approvalHistory.find(h => h.action === "Submitted")?.date;
          const dept = pr.approvalHistory.find(h => h.action === "Approved")?.date;
          return daysBetween(submitted, dept);
        });
        const approvalToSourcing = stageValue(pr => {
          const dept = pr.approvalHistory.find(h => h.action === "Approved")?.date;
          const final = [...pr.approvalHistory].reverse().find(h => h.action === "Approved")?.date;
          return dept && final && dept !== final ? daysBetween(dept, final) : null;
        });
        const sourcingToContract = stageValue(pr => {
          const contract = base.contractBySourcePR.get(pr.requisitionNumber);
          const final = [...pr.approvalHistory].reverse().find(h => h.action === "Approved")?.date;
          return contract ? daysBetween(final, contract.startDate) : null;
        });

        return {
          month: monthLabel(key),
          reqToApproval: +reqToApproval.toFixed(1),
          approvalToSourcing: +approvalToSourcing.toFixed(1),
          sourcingToContract: +sourcingToContract.toFixed(1),
          total: +(reqToApproval + approvalToSourcing + sourcingToContract).toFixed(1),
        };
      })
      .filter(m => m.total > 0);

    // Payment timeliness by the month the invoice was settled.
    const paymentMonths = monthAxis([base.invoices.map(r => invoicePaidDate(r.invoice))]);
    const paymentTrend = paymentMonths.map(key => {
      const bucket = base.invoices.filter(r => inMonth(invoicePaidDate(r.invoice), key));
      const durations = bucket.map(r => invoiceDaysToPay(r.invoice)).filter((d): d is number => d !== null);
      const onTime = durations.filter(d => d <= KPI_TARGETS.paymentWithinDays).length;
      const late = durations.filter(d => d > KPI_TARGETS.paymentWithinDays && d <= KPI_TARGETS.paymentWithinDays * 2).length;
      const overdue = durations.filter(d => d > KPI_TARGETS.paymentWithinDays * 2).length;
      const total = durations.length || 1;
      return {
        month: monthLabel(key),
        onTime: +pct(onTime, total).toFixed(1),
        late: +pct(late, total).toFixed(1),
        overdue: +pct(overdue, total).toFixed(1),
      };
    });

    return {
      prequalCounts, byCategory, blocked, docIssues, participation, payments, engagement,
      master, cycleTrend, paymentTrend,
      prequalifiedCount: base.vendors.filter(v => prequalBucket(v) === "Prequalified").length,
    };
  }, [base]);

  /* ── Donor / funding-source derivations ────────────────────────────────── */

  const donorData = useMemo(() => {
    const donors = new Set<string>();
    base.approvedPlanItems.forEach(p => donors.add(p.fundingSource || "Unattributed"));
    base.prs.forEach(p => donors.add(p.fundingSource || "Unattributed"));
    base.contracts.forEach(c => donors.add(base.contractFunding(c)));

    const summary = Array.from(donors)
      .map((donor, i) => {
        const planItems = base.approvedPlanItems.filter(p => (p.fundingSource || "Unattributed") === donor);
        const prs = base.prs.filter(p => (p.fundingSource || "Unattributed") === donor);
        const contracts = base.contracts.filter(c => base.contractFunding(c) === donor);
        const activities = [
          ...planItems.map(p => categoryFamily(p.category)),
          ...contracts.map(c => categoryFamily(c.category)),
        ];
        const checks = contracts.reduce(
          (acc, c) => {
            const result = complianceChecks(c);
            COMPLIANCE_METRICS.forEach(m => { acc.total += 1; if (result[m]) acc.passed += 1; else acc.issues += 1; });
            return acc;
          },
          { passed: 0, total: 0, issues: 0 }
        );

        const planned = planItems.reduce((s, p) => s + p.estimatedValue, 0);
        const contractCommitted = contracts.reduce((s, c) => s + c.value, 0);
        const uncontracted = prs
          .filter(p => prBucket(p) === "Approved" && !base.contractBySourcePR.has(p.requisitionNumber))
          .reduce((s, p) => s + p.estimatedCost, 0);
        const spent = contracts.reduce((s, c) => s + getContractFinancials(c).totalPaid, 0);

        return {
          donor,
          color: PALETTE[i % PALETTE.length],
          projects: planItems.length + contracts.length,
          goods: activities.filter(a => a === "goods").length,
          services: activities.filter(a => a === "services").length,
          works: activities.filter(a => a === "works").length,
          totalProcured: contractCommitted,
          openComp: contracts.filter(c => methodFamily(c.method) === "Open Competition").length,
          limited: contracts.filter(c => methodFamily(c.method) === "Limited / RFQ").length,
          direct: contracts.filter(c => methodFamily(c.method) === "Direct").length,
          approved: prs.filter(p => prBucket(p) === "Approved").length,
          pending: prs.filter(p => prBucket(p) === "Pending").length,
          rejected: prs.filter(p => prBucket(p) === "Rejected").length,
          pendingApprovals:
            prs.filter(p => prBucket(p) === "Pending").length +
            base.planItems.filter(p => (p.fundingSource || "Unattributed") === donor && p.approvalStatus.startsWith("Pending")).length,
          planned,
          committed: contractCommitted + uncontracted,
          spent,
          utilisation: pct(spent, planned || contractCommitted),
          compliancePct: pct(checks.passed, checks.total),
          issues: checks.issues,
          contractCount: contracts.length,
        };
      })
      .filter(d => d.projects > 0 || d.approved + d.pending + d.rejected > 0)
      .sort((a, b) => b.totalProcured - a.totalProcured || b.projects - a.projects);

    const spendChart = summary
      .filter(d => d.spent > 0)
      .map(d => ({ donor: d.donor, spend: d.spent, color: d.color }));

    const countChart = summary
      .filter(d => d.projects > 0)
      .map(d => ({ name: d.donor, value: d.projects, color: d.color }));

    // Compliance metric matrix, per donor, for the radar comparison.
    const complianceRows = summary.filter(d => d.contractCount > 0);
    const radar = COMPLIANCE_METRICS.map(metric => {
      const row: Record<string, string | number> = { metric };
      complianceRows.forEach(d => {
        const contracts = base.contracts.filter(c => base.contractFunding(c) === d.donor);
        const passed = contracts.filter(c => complianceChecks(c)[metric]).length;
        row[d.donor] = +pct(passed, contracts.length).toFixed(1);
      });
      return row;
    });

    return {
      summary, spendChart, countChart, radar,
      donorsWithContracts: complianceRows,
      totalPlanned: summary.reduce((s, d) => s + d.planned, 0),
      totalCommitted: summary.reduce((s, d) => s + d.committed, 0),
      totalSpent: summary.reduce((s, d) => s + d.spent, 0),
      totalActivities: summary.reduce((s, d) => s + d.projects, 0),
      totalPendingApprovals: summary.reduce((s, d) => s + d.pendingApprovals, 0),
    };
  }, [base]);
  /* ── Contract derivations ──────────────────────────────────────────────── */

  const contractData = useMemo(() => {
    void version;

    const withFinancials = base.contracts.map(c => {
      const financials = getContractFinancials(c);
      const deliverables = c.deliverables ?? [];
      const accepted = deliverables.filter(d => d.status === "Accepted").length;
      const invoices = c.invoices ?? [];
      const overdueInvoices = invoices.filter(
        i => i.status !== "Paid" && i.status !== "Queried" && (daysBetween(invoiceSubmittedDate(i), todayISO()) ?? 0) > KPI_TARGETS.paymentWithinDays
      ).length;
      const paymentStatus = overdueInvoices > 0
        ? "Overdue"
        : financials.pending > 0
          ? "Pending Final"
          : "On Track";
      return {
        contract: c,
        funding: base.contractFunding(c),
        totalPaid: financials.totalPaid,
        pending: financials.pending,
        balance: financials.balance,
        deliverablesTotal: deliverables.length,
        deliverablesAccepted: accepted,
        invoiceCount: invoices.length,
        paymentStatus,
      };
    });

    const statusOrder = Array.from(new Set(withFinancials.map(r => r.contract.status)));
    const valueByStatus = statusOrder.map(status => {
      const rows = withFinancials.filter(r => r.contract.status === status);
      return {
        status,
        goods: rows.filter(r => categoryFamily(r.contract.category) === "goods").reduce((s, r) => s + r.contract.value, 0),
        services: rows.filter(r => categoryFamily(r.contract.category) === "services").reduce((s, r) => s + r.contract.value, 0),
        works: rows.filter(r => categoryFamily(r.contract.category) === "works").reduce((s, r) => s + r.contract.value, 0),
      };
    });

    const valueByCategory = Array.from(groupBy(base.contracts, c => c.category))
      .map(([name, list], i) => ({ name, value: list.reduce((s, c) => s + c.value, 0), color: PALETTE[i % PALETTE.length] }));

    const valueByFunding = Array.from(groupBy(base.contracts, c => base.contractFunding(c)))
      .map(([name, list]) => ({ name, value: list.reduce((s, c) => s + c.value, 0) }))
      .sort((a, b) => b.value - a.value);

    const overdueDeliverables = getOverdueDeliverables();
    const upcomingDeliverables = getUpcomingDeliverables(30);
    const overdueIds = new Set(overdueDeliverables.map(d => d.deliverable.id));
    const upcomingIds = new Set(upcomingDeliverables.map(d => d.deliverable.id));

    const deliverableRows = base.deliverables.map(({ contract, deliverable }) => {
      const state = deliverableState(deliverable);
      const overdue = overdueDeliverables.find(o => o.deliverable.id === deliverable.id);
      const upcoming = upcomingDeliverables.find(u => u.deliverable.id === deliverable.id);
      return {
        contract, deliverable, state,
        daysOverdue: overdue?.daysOverdue ?? 0,
        daysLeft: upcoming?.daysLeft ?? null,
        flag: overdueIds.has(deliverable.id) ? "Overdue" : upcomingIds.has(deliverable.id) ? "Due soon" : "—",
      };
    });

    const scorecard = base.contracts
      .map(c => {
        const ev = latestEvaluation(c);
        if (!ev) return null;
        return {
          contract: c,
          evaluation: ev,
          quality: criterionScore(ev, /quality/i),
          timeliness: criterionScore(ev, /timeli/i),
          cost: criterionScore(ev, /cost/i),
          compliance: criterionScore(ev, /complian/i),
          overall: ev.overallScore,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.overall - a.overall);

    const closeOut = base.contracts.map(c => {
      const checks = verifyCloseOutReadiness(c);
      const satisfied = checks.filter(k => k.satisfied).length;
      const find = (key: string) => checks.find(k => k.key === key)?.satisfied ?? false;
      return {
        contract: c,
        checks,
        satisfied,
        total: checks.length,
        deliverablesDone: find("allDeliverablesCompleted"),
        paymentsDone: find("allPaymentsCompleted"),
        performanceDone: find("performanceFinalized"),
        docsDone: find("allDocsUploaded"),
        status: c.status === "Closed"
          ? "Closed"
          : satisfied === checks.length
            ? "Pending Review"
            : find("allDeliverablesCompleted") && !find("allPaymentsCompleted")
              ? "Pending Payment"
              : "In Progress",
      };
    });

    const variationImpact = base.changeRequests.reduce((s, r) => s + (r.changeRequest.estimatedCostImpact || 0), 0);

    return {
      withFinancials, valueByStatus, valueByCategory, valueByFunding,
      deliverableRows, overdueDeliverables, upcomingDeliverables,
      scorecard, closeOut, variationImpact,
      totalValue: base.contracts.reduce((s, c) => s + c.value, 0),
      totalPaid: withFinancials.reduce((s, r) => s + r.totalPaid, 0),
      activeCount: base.contracts.filter(c => c.status === "Active").length,
    };
  }, [base, version]);

  /* ── Combined (vendor × donor) derivations ─────────────────────────────── */

  const combined = useMemo(() => {
    const vendorDonorPerformance = base.contracts.map(c => {
      const vendor = base.lookupVendor(c.party);
      const ev = latestEvaluation(c);
      const score = ev ? ev.overallScore * 10 : vendor && avgScore(vendor.performance) > 0 ? avgScore(vendor.performance) * 10 : null;
      return {
        vendor: c.party,
        donor: base.contractFunding(c),
        contract: c.contractNumber,
        value: c.value,
        paid: getContractFinancials(c).totalPaid,
        performanceScore: score,
        evaluated: !!ev,
        status: c.status,
      };
    }).sort((a, b) => (b.performanceScore ?? -1) - (a.performanceScore ?? -1));

    const spendByDonorVendor = Array.from(
      groupBy(base.contracts, c => `${base.contractFunding(c)}||${c.party}`)
    )
      .map(([key, list]) => {
        const [donor, vendor] = key.split("||");
        const invoiced = list.reduce(
          (s, c) => s + (c.invoices ?? []).reduce((t, i) => t + i.amount, 0), 0
        );
        const paid = list.reduce((s, c) => s + getContractFinancials(c).totalPaid, 0);
        return {
          donor, vendor,
          contracts: list.length,
          awarded: list.reduce((s, c) => s + c.value, 0),
          invoiced,
          paid,
          outstanding: invoiced - paid,
        };
      })
      .sort((a, b) => b.awarded - a.awarded);

    const donorNames = Array.from(new Set(spendByDonorVendor.map(r => r.donor)));
    const vendorNames = Array.from(new Set(spendByDonorVendor.map(r => r.vendor)));
    const spendStack = donorNames.map(donor => {
      const row: Record<string, string | number> = { donor };
      vendorNames.forEach(v => {
        row[v] = spendByDonorVendor.filter(r => r.donor === donor && r.vendor === v).reduce((s, r) => s + r.paid, 0);
      });
      return row;
    });

    const topPerformers = vendorData.participation
      .map(p => {
        const rows = vendorDonorPerformance.filter(r => normaliseName(r.vendor) === normaliseName(p.vendor));
        const scores = rows.map(r => r.performanceScore).filter((s): s is number => s !== null);
        const donors = Array.from(new Set(rows.map(r => r.donor)));
        return {
          vendor: p.vendor,
          contractsWon: p.awardsWon,
          totalValue: p.totalContractValue,
          avgScore: average(scores),
          donors,
          winRate: p.winRate,
        };
      })
      .filter(p => p.contractsWon > 0)
      .sort((a, b) => (b.avgScore ?? -1) - (a.avgScore ?? -1) || b.totalValue - a.totalValue);

    const topPerFunding = donorNames
      .map(donor => {
        const candidates = spendByDonorVendor.filter(r => r.donor === donor);
        const ranked = candidates
          .map(c => {
            const scores = vendorDonorPerformance
              .filter(r => r.donor === donor && r.vendor === c.vendor)
              .map(r => r.performanceScore)
              .filter((s): s is number => s !== null);
            return { ...c, score: average(scores) };
          })
          .sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || b.awarded - a.awarded);
        return ranked[0] ? { ...ranked[0], donor } : null;
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const scored = vendorDonorPerformance.filter(r => r.performanceScore !== null);

    return {
      vendorDonorPerformance, spendByDonorVendor, spendStack, vendorNames,
      topPerformers, topPerFunding,
      avgPerformance: average(scored.map(r => r.performanceScore as number)),
      scoredCount: scored.length,
    };
  }, [base, vendorData.participation]);
  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════════ */

  const screenTitle: Record<TabKey, { title: string; subtitle: string }> = {
    planning: { title: "Planning & Orders Report", subtitle: "Requisition pipeline, budget utilization, and purchase order trends" },
    sourcing: { title: "Sourcing & Contracts Report", subtitle: "RFQ status, bid submissions, invoices, contracts, and renewal alerts" },
    vendors: { title: "Vendors & KPIs Report", subtitle: "Vendor performance, donor procurement, cycle times, and payment timeliness" },
    contracts: { title: "Contract Reports", subtitle: "Contract lifecycle, deliverables, invoices, variations, close-outs, and expiry alerts" },
    donors: { title: "Donor Reports", subtitle: "Donor procurement summaries, budget utilization, and spend analysis" },
    combined: { title: "Combined Analysis", subtitle: "Cross-cutting vendor-donor performance, compliance, and top performers" },
  };

  const { title, subtitle } = screenTitle[activeTab];

  const periodBar = (
    <PeriodFilterBar
      periodFilter={periodFilter}
      setPeriodFilter={setPeriodFilter}
      customFrom={customFrom}
      setCustomFrom={setCustomFrom}
      customTo={customTo}
      setCustomTo={setCustomTo}
      range={range}
      scopeNote={scopeNote}
    />
  );

  const noDataHint = "Adjust the period filter or capture activity in the upstream modules.";

  const expiryControl = (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider" style={{ fontFamily: F }}>Horizon:</span>
      <ProcurementTabs
        tabs={EXPIRY_WINDOWS.map(w => ({ key: String(w), label: `${w} days` }))}
        active={String(expiryWindow)}
        onChange={key => setExpiryWindow(Number(key) as ExpiryWindow)}
        minWidth={72}
      />
      <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
        Renewal horizon is measured from today and is not affected by the report period.
      </span>
    </div>
  );

  const expiryColumns: TableColumn[] = [
    { key: "contract", header: "Contract", cell: refCell("contract") },
    { key: "vendor", header: "Vendor" },
    { key: "endDate", header: "End Date", format: v => prettyDate(String(v ?? "")) },
    {
      key: "daysLeft", header: "Days Left", align: "center",
      format: v => (Number(v) < 0 ? `${Math.abs(Number(v))} days overdue` : `${Number(v)} days`),
      cell: row => {
        const d = Number(row.daysLeft ?? 0);
        return (
          <span className={`text-[11px] ${d < 0 ? "text-red-700" : d <= 30 ? "text-red-600" : d <= 60 ? "text-amber-600" : "text-green-600"}`} style={{ fontWeight: 700 }}>
            {d < 0 ? `${Math.abs(d)} overdue` : `${d} days`}
          </span>
        );
      },
    },
    { key: "value", header: "Value", format: moneyFormat, cell: moneyCell("value") },
    { key: "status", header: "Contract Status", cell: badgeCell("status") },
    { key: "action", header: "Action", cell: badgeCell("action") },
  ];

  const expiryRows: ReportRow[] = expiry.rows.map(({ contract, daysLeft }) => ({
    __key: contract.id,
    contract: contract.contractNumber,
    vendor: contract.party,
    endDate: contract.endDate,
    daysLeft,
    value: contract.value,
    status: contract.status,
    action: daysLeft < 0 ? "Expired" : daysLeft <= 30 ? "Urgent Renewal" : daysLeft <= 60 ? "Renew" : "Review",
  }));

  /* ── Tab 1: Planning & Orders ──────────────────────────────────────────── */

  const planningTabs = ["Charts & Statistics", "Requisition Register", "Procurement Plan Status", "Plan Pipeline", "Efficiency Metrics"];

  const renderPlanning = () => {
    const requisitionRows: ReportRow[] = base.prs
      .filter(pr => reqFilter === "All" || prBucket(pr) === reqFilter)
      .map(pr => ({
        __key: pr.id,
        prNumber: pr.requisitionNumber,
        description: pr.requisitionTitle || pr.itemDescription,
        department: pr.department,
        funding: pr.fundingSource || "Unattributed",
        value: pr.estimatedCost,
        stage: pr.overallApprovalStatus,
        status: prBucket(pr),
        date: pr.dateRequested,
        daysInStage: computeDaysInStage(pr),
        approver: prApprover(pr),
      }));

    const requisitionColumns: TableColumn[] = [
      { key: "prNumber", header: "PR Number", cell: refCell("prNumber") },
      { key: "description", header: "Description" },
      { key: "department", header: "Department" },
      { key: "funding", header: "Funding Source" },
      { key: "value", header: "Value", format: moneyFormat, cell: moneyCell("value") },
      { key: "stage", header: "Stage", cell: badgeCell("stage") },
      { key: "status", header: "Status", cell: badgeCell("status") },
      { key: "date", header: "Date Raised", format: v => prettyDate(String(v ?? "")) },
      { key: "daysInStage", header: "Days in Stage", align: "center", cell: countCell("daysInStage", 14) },
      { key: "approver", header: "Last Action By" },
    ];

    const planColumns: TableColumn[] = [
      { key: "planRef", header: "Plan Ref", cell: refCell("planRef") },
      { key: "activity", header: "Activity" },
      { key: "category", header: "Category" },
      { key: "budget", header: "Budget", format: moneyFormat, cell: moneyCell("budget") },
      { key: "funding", header: "Funding" },
      { key: "method", header: "Method" },
      { key: "initiation", header: "Initiation", format: v => prettyDate(String(v ?? "")) },
      { key: "completion", header: "Completion", format: v => prettyDate(String(v ?? "")) },
      { key: "department", header: "Dept" },
      { key: "status", header: "Status", cell: badgeCell("status") },
      { key: "approval", header: "Approval", cell: badgeCell("approval") },
    ];

    const planRows: ReportRow[] = base.planItems.map(p => ({
      __key: p.id,
      planRef: p.ppItemId,
      activity: p.activityDescription,
      category: p.category,
      budget: p.estimatedValue,
      funding: p.fundingSource,
      method: p.procurementMethod,
      initiation: p.initiationDate,
      completion: p.completionDate,
      department: p.department,
      status: p.status,
      approval: p.approvalStatus,
    }));

    const pipelineColumns: TableColumn[] = [
      { key: "planRef", header: "Plan Ref", cell: refCell("planRef") },
      { key: "activity", header: "Activity" },
      { key: "budget", header: "Budget", format: moneyFormat, cell: moneyCell("budget") },
      { key: "funding", header: "Funding" },
      { key: "method", header: "Method" },
      { key: "initiation", header: "Initiation", format: v => prettyDate(String(v ?? "")) },
      { key: "daysToStart", header: "Starts In", align: "center", format: v => `${Number(v)} days` },
      { key: "owner", header: "Responsible" },
      { key: "status", header: "Status", cell: badgeCell("status") },
    ];

    const pipelineRows: ReportRow[] = pipeline.upcoming.map(p => ({
      __key: p.id,
      planRef: p.ppItemId,
      activity: p.activityDescription,
      budget: p.estimatedValue,
      funding: p.fundingSource,
      method: p.procurementMethod,
      initiation: p.initiationDate,
      daysToStart: daysUntil(p.initiationDate),
      owner: p.responsiblePerson,
      status: p.status,
    }));

    const bottleneckColumns: TableColumn[] = [
      { key: "planRef", header: "Plan Ref", cell: refCell("planRef") },
      { key: "activity", header: "Activity" },
      { key: "stage", header: "Stuck At" },
      { key: "daysStuck", header: "Days Stuck", align: "center", cell: countCell("daysStuck", 7) },
      { key: "responsible", header: "Responsible" },
      { key: "budget", header: "Budget", format: moneyFormat, cell: moneyCell("budget") },
    ];

    const bottleneckRows: ReportRow[] = pipeline.bottlenecks.map(b => ({
      __key: b.item.id,
      planRef: b.item.ppItemId,
      activity: b.item.activityDescription,
      stage: b.stage,
      daysStuck: b.daysStuck,
      responsible: b.responsible,
      budget: b.item.estimatedValue,
    }));

    const efficiencyColumns: TableColumn[] = [
      { key: "metric", header: "Metric" },
      { key: "value", header: "Actual" },
      { key: "target", header: "Target" },
      { key: "basis", header: "Basis" },
      { key: "verdict", header: "Status", cell: badgeCell("verdict") },
    ];

    const verdictOf = (actual: number | null, target: number, lowerIsBetter: boolean) => {
      if (actual === null) return "Pending";
      return (lowerIsBetter ? actual <= target : actual >= target) ? "On Track" : "Review";
    };

    const efficiencyRows: ReportRow[] = [
      {
        __key: "execution", metric: "Plan execution rate", value: fmtPct(kpis.executionRate),
        target: fmtPct(80), basis: `${kpis.executed} of ${kpis.plannedCount} approved plan lines awarded or beyond`,
        verdict: verdictOf(kpis.executionRate, 80, false),
      },
      {
        __key: "savings", metric: "Average cost saving vs plan",
        value: kpis.avgCostSavings === null ? "—" : fmtPct(kpis.avgCostSavings),
        target: "≥ 0%", basis: `${kpis.savingsSampleSize} plan lines traced through to an award`,
        verdict: verdictOf(kpis.avgCostSavings, 0, false),
      },
      {
        __key: "reqAward", metric: "Requisition → award", value: fmtDays(kpis.reqToAward),
        target: `${KPI_TARGETS.reqToAwardDays} days`, basis: "Submitted to final approval on approved requisitions",
        verdict: verdictOf(kpis.reqToAward, KPI_TARGETS.reqToAwardDays, true),
      },
      {
        __key: "awardContract", metric: "Award → contract start", value: fmtDays(kpis.awardToContract),
        target: `${KPI_TARGETS.awardToContractDays} days`, basis: "Award date to contract start date",
        verdict: verdictOf(kpis.awardToContract, KPI_TARGETS.awardToContractDays, true),
      },
      {
        __key: "contractPayment", metric: "Contract → first payment", value: fmtDays(kpis.contractToPayment),
        target: `${KPI_TARGETS.contractToPaymentDays} days`, basis: "Contract start to invoice payment date",
        verdict: verdictOf(kpis.contractToPayment, KPI_TARGETS.contractToPaymentDays, true),
      },
      {
        __key: "paymentTimeliness", metric: "Payments settled within 30 days",
        value: kpis.paidInvoiceCount ? fmtPct(kpis.paymentTimeliness) : "—",
        target: fmtPct(KPI_TARGETS.paymentTimeliness), basis: `${kpis.paidInvoiceCount} settled invoices`,
        verdict: kpis.paidInvoiceCount ? verdictOf(kpis.paymentTimeliness, KPI_TARGETS.paymentTimeliness, false) : "Pending",
      },
      {
        __key: "onTimeDelivery", metric: "Deliverables accepted on time",
        value: kpis.settledDeliverableCount ? fmtPct(kpis.onTimeDelivery) : "—",
        target: fmtPct(KPI_TARGETS.onTimeDelivery), basis: `${kpis.settledDeliverableCount} accepted deliverables`,
        verdict: kpis.settledDeliverableCount ? verdictOf(kpis.onTimeDelivery, KPI_TARGETS.onTimeDelivery, false) : "Pending",
      },
      {
        __key: "responsiveness", metric: "Vendor responsiveness",
        value: kpis.responsiveness ? fmtPct(kpis.responsiveness) : "—",
        target: fmtPct(80), basis: "Average responsiveness score across rated vendors",
        verdict: kpis.responsiveness ? verdictOf(kpis.responsiveness, 80, false) : "Pending",
      },
    ];

    return (
      <div>
        <SubTabBar tabs={planningTabs} active={subTab} onChange={setSubTab} />
        <div className="space-y-6 p-6">
          {periodBar}

          {subTab === 0 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Total Requisitions", value: fmtNum(base.prs.length), sub: fmt(base.prs.reduce((s, p) => s + p.estimatedCost, 0)), icon: <FileText size={18} />, tone: "info" },
              { label: "Approved", value: fmtNum(base.prs.filter(p => prBucket(p) === "Approved").length), sub: fmtPct(pct(base.prs.filter(p => prBucket(p) === "Approved").length, base.prs.length)), icon: <CheckCircle2 size={18} />, tone: "success" },
              { label: "Purchase Orders", value: fmtNum(base.pos.length), sub: fmt(planning.poValue), icon: <Package size={18} />, tone: "accent" },
              { label: "Budget Utilization", value: fmtPct(pct(planning.totalSpent, planning.totalPlanned)), sub: `${fmt(planning.totalSpent)} spent of ${fmt(planning.totalPlanned)} planned`, icon: <DollarSign size={18} />, tone: "warning" },
            ]} />

            <div className="grid grid-cols-3 gap-4">
              <ChartCard title="Procurement Pipeline" className="col-span-2" isEmpty={planning.pipelineSeries.length === 0}
                emptyMessage="No planning or requisition activity in this period" emptyHint={noDataHint}>
                <BarChart data={planning.pipelineSeries} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: F }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: F }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                  <Bar dataKey="planned" fill="#c7d2fe" name="Planned" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="initiated" fill="#818cf8" name="Requisitioned" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="completed" fill={BLUE} name="Ordered" radius={[2, 2, 0, 0]} />
                  <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </BarChart>
              </ChartCard>
              <ChartCard title="Requisition Status" isEmpty={planning.requisitionStatus.length === 0}
                emptyMessage="No requisitions in this period" emptyHint={noDataHint}>
                <PieChart>
                  <Pie data={planning.requisitionStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {planning.requisitionStatus.map(entry => <Cell key={`req-cell-${entry.name}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </PieChart>
              </ChartCard>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ChartCard title="Budget Utilization by Department" subtitle="Planned vs committed vs spent" height={200}
                isEmpty={planning.budgetUtilization.length === 0}
                emptyMessage="No budget activity in this period" emptyHint={noDataHint}>
                <BarChart data={planning.budgetUtilization} layout="vertical" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fontFamily: F }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 10, fontFamily: F }} width={90} />
                  <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} formatter={(value: any) => fmt(Number(value))} />
                  <Bar dataKey="planned" fill="#c7d2fe" name="Planned" radius={[0, 2, 2, 0]} />
                  <Bar dataKey="committed" fill="#818cf8" name="Committed" radius={[0, 2, 2, 0]} />
                  <Bar dataKey="spent" fill={BLUE} name="Spent" radius={[0, 2, 2, 0]} />
                  <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </BarChart>
              </ChartCard>

              <ChartCard title="Purchase Order Trends" height={200} isEmpty={planning.poTrend.length === 0}
                emptyMessage="No purchase orders in this period" emptyHint={noDataHint}>
                <LineChart data={planning.poTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: F }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fontFamily: F }} allowDecimals={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fontFamily: F }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke={BLUE} strokeWidth={2} name="PO Count" dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="PO Value" dot={{ r: 3 }} />
                  <Legend iconType="line" wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </LineChart>
              </ChartCard>
            </div>

            <ProcurementStatCards variant="flush" stats={[
              { label: "Plan Activities", value: fmtNum(base.planItems.length), sub: `${fmtNum(base.approvedPlanItems.length)} approved`, icon: <FileText size={18} />, tone: "info" },
              { label: "Completed", value: fmtNum(base.planItems.filter(p => p.status === "Completed").length), icon: <CheckCircle2 size={18} />, tone: "success" },
              { label: "In Progress", value: fmtNum(base.planItems.filter(p => ["In Progress", "Under Evaluation", "Awarded", "Contracted"].includes(p.status)).length), icon: <Clock size={18} />, tone: "info" },
              { label: "Not Started / Delayed", value: fmtNum(base.planItems.filter(p => p.status === "Not Started" || p.status === "Delayed").length), icon: <AlertTriangle size={18} />, tone: "warning" },
            ]} />

            <div className="grid grid-cols-2 gap-4">
              <ChartCard title="Plan Status Breakdown" height={210} isEmpty={planning.planStatusBreakdown.length === 0}
                emptyMessage="No plan activities in this period" emptyHint={noDataHint}>
                <PieChart>
                  <Pie data={planning.planStatusBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                    label={(props: any) => `${props.name}: ${props.value}`}>
                    {planning.planStatusBreakdown.map(entry => <Cell key={`plan-${entry.name}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </PieChart>
              </ChartCard>

              <ChartCard title="By Procurement Method" height={210} isEmpty={planning.methodBreakdown.length === 0}
                emptyMessage="No plan activities in this period" emptyHint={noDataHint}>
                <BarChart data={planning.methodBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: F }} />
                  <YAxis tick={{ fontSize: 9, fontFamily: F }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} />
                  <Bar dataKey="count" fill={BLUE} radius={[4, 4, 0, 0]} name="Activities" />
                </BarChart>
              </ChartCard>
            </div>

            <ProcurementStatCards variant="flush" stats={[
              { label: "Execution Rate", value: fmtPct(kpis.executionRate), sub: `${kpis.executed} of ${kpis.plannedCount} planned`, icon: <TrendingUp size={18} />, tone: "success" },
              { label: "Cost Saving vs Plan", value: kpis.avgCostSavings === null ? "—" : fmtPct(kpis.avgCostSavings), sub: kpis.savingsSampleSize ? `${fmt(kpis.totalSavings)} across ${kpis.savingsSampleSize} awards` : "No plan-linked awards yet", icon: <DollarSign size={18} />, tone: "info" },
              { label: "Sourcing Cases", value: fmtNum(base.sourcing.length), sub: `${fmtNum(base.sourcing.filter(s => s.approvalStatus === "Approved").length)} approved`, icon: <FileText size={18} />, tone: "info" },
              { label: "Committed Budget", value: fmt(planning.totalCommitted), sub: `${fmtPct(pct(planning.totalCommitted, planning.totalPlanned))} of plan`, icon: <Package size={18} />, tone: "warning" },
            ]} />

            <ChartCard title="Cycle Time: Actual vs Target" height={220} isEmpty={planning.cycleStages.every(s => !s.measured)}
              emptyMessage="No completed cycles to measure in this period" emptyHint={noDataHint}>
              <ComposedChart data={planning.cycleStages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 9, fontFamily: F }} />
                <YAxis tick={{ fontSize: 9, fontFamily: F }} label={{ value: "Days", angle: -90, position: "insideLeft", style: { fontSize: 10, fontFamily: F } }} />
                <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} />
                <Bar dataKey="avg" fill={BLUE} radius={[4, 4, 0, 0]} name="Actual (days)" />
                <Line dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target (days)" dot={{ r: 4 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </ComposedChart>
            </ChartCard>
          </>}

          {subTab === 1 && (
            <ReportSection
              title="Requisition Register"
              columns={requisitionColumns}
              rows={requisitionRows}
              meta={exportMeta}
              search={searchQuery}
              emptyMessage="No requisitions match the current filters"
              emptyHint={noDataHint}
              controls={
                <ProcurementTabs
                  tabs={(["All", "Approved", "Pending", "Rejected", "Draft"] as const).map(f => ({ key: f, label: f }))}
                  active={reqFilter}
                  onChange={setReqFilter}
                  minWidth={72}
                />
              }
            />
          )}

          {subTab === 2 && (
            <ReportSection title="Procurement Plan Status" columns={planColumns} rows={planRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No plan activities in this period" emptyHint={noDataHint} />
          )}

          {subTab === 3 && <>
            <ProcurementStatCards variant="flush" stats={[
              ...pipeline.buckets.map((b): ProcurementStat => ({
                label: `Starting in ${b.days} days`,
                value: fmtNum(b.items.length),
                sub: fmt(b.items.reduce((s, p) => s + p.estimatedValue, 0)),
                icon: <CalendarClock size={18} />,
                tone: b.days === 30 ? "danger" : b.days === 60 ? "warning" : "success",
              })),
              { label: "Bottlenecks", value: fmtNum(pipeline.bottlenecks.length), sub: "stalled plan lines", icon: <AlertTriangle size={18} />, tone: "accent" },
            ]} />
            <ReportSection title="Plan Pipeline (next 90 days)" columns={pipelineColumns} rows={pipelineRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No approved plan activities start in the next 90 days"
              emptyHint="The pipeline is measured from today, independently of the report period." />
            <ReportSection title="Plan Bottlenecks" columns={bottleneckColumns} rows={bottleneckRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No stalled plan activities"
              emptyHint="Every plan line is either approved and on schedule, or newly modified." />
          </>}

          {subTab === 4 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Execution Rate", value: fmtPct(kpis.executionRate), sub: `${kpis.executed} of ${kpis.plannedCount} planned`, icon: <TrendingUp size={18} />, tone: "success" },
              { label: "Requisition → Award", value: fmtDays(kpis.reqToAward), sub: `target ${KPI_TARGETS.reqToAwardDays} days`, icon: <Clock size={18} />, tone: "info" },
              { label: "Award → Contract", value: fmtDays(kpis.awardToContract), sub: `target ${KPI_TARGETS.awardToContractDays} days`, icon: <FileText size={18} />, tone: "info" },
              { label: "Contract → Payment", value: fmtDays(kpis.contractToPayment), sub: `target ${KPI_TARGETS.contractToPaymentDays} days`, icon: <DollarSign size={18} />, tone: "warning" },
            ]} />
            <ReportSection title="Efficiency Metrics" columns={efficiencyColumns} rows={efficiencyRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No metrics available" emptyHint={noDataHint} />
          </>}
        </div>
      </div>
    );
  };

  /* ── Tab 2: Sourcing & Contracts ───────────────────────────────────────── */

  const sourcingTabs = ["Charts & Statistics", "Sourcing Status", "Bid Submission", "Invoice & Payment", "Contract Expiry"];

  const renderSourcing = () => {
    const sourcingColumns: TableColumn[] = [
      { key: "ref", header: "Sourcing Ref", cell: refCell("ref") },
      { key: "title", header: "Title" },
      { key: "vendor", header: "Vendor" },
      { key: "project", header: "Project" },
      { key: "sourcePR", header: "Source PR", cell: refCell("sourcePR") },
      { key: "value", header: "Estimated Value", format: moneyFormat, cell: moneyCell("value") },
      { key: "date", header: "Submitted", format: v => prettyDate(String(v ?? "")) },
      { key: "status", header: "Status", cell: badgeCell("status") },
    ];

    const sourcingRows: ReportRow[] = base.sourcing.map(s => ({
      __key: s.id,
      ref: s.rfqNumber,
      title: s.title,
      vendor: s.vendor,
      project: s.projectName,
      sourcePR: s.sourcePR,
      value: s.estimatedValue,
      date: s.dateSubmitted,
      status: s.approvalStatus,
    }));

    const bidColumns: TableColumn[] = [
      { key: "project", header: "Project" },
      { key: "invited", header: "Cases Run", align: "center", cell: countCell("invited") },
      { key: "submitted", header: "Carried to Award", align: "center", cell: countCell("submitted") },
      { key: "rate", header: "Award Rate", format: pctFormat, cell: scoreCell("rate", 60, 30, "%") },
      { key: "value", header: "Total Value", format: moneyFormat, cell: moneyCell("value") },
    ];

    const bidRows: ReportRow[] = sourcingData.byProject.map((p, i) => ({
      __key: `bid-${i}`,
      project: p.project,
      invited: p.invited,
      submitted: p.submitted,
      rate: p.rate,
      value: p.value,
    }));

    const invoiceColumns: TableColumn[] = [
      { key: "invoice", header: "Invoice", cell: refCell("invoice") },
      { key: "contract", header: "Contract", cell: refCell("contract") },
      { key: "vendor", header: "Vendor" },
      { key: "via", header: "Received Via" },
      { key: "submitted", header: "Submitted", format: v => prettyDate(String(v ?? "")) },
      { key: "amount", header: "Amount", format: moneyFormat, cell: moneyCell("amount") },
      { key: "paidAmount", header: "Paid", format: moneyFormat, cell: moneyCell("paidAmount") },
      { key: "paidDate", header: "Date Paid", format: v => (v ? prettyDate(String(v)) : "—") },
      { key: "daysToPay", header: "Days to Pay", align: "center", format: v => (v === null || v === undefined ? "—" : `${v}`) },
      { key: "status", header: "Status", cell: badgeCell("status") },
    ];

    const invoiceRows: ReportRow[] = base.invoices.map(({ contract, invoice }) => {
      const paid = invoicePaidDate(invoice);
      return {
        __key: invoice.id,
        invoice: invoice.invoiceNumber,
        contract: contract.contractNumber,
        vendor: invoice.vendor,
        via: invoice.submittedVia,
        submitted: invoiceSubmittedDate(invoice),
        amount: invoice.amount,
        paidAmount: invoice.amountPaid ?? 0,
        paidDate: paid ?? "",
        daysToPay: paid ? daysBetween(invoiceSubmittedDate(invoice), paid) : null,
        status: invoice.status,
      };
    });

    const unpaid = base.invoices.filter(r => r.invoice.status !== "Paid" && r.invoice.status !== "Queried");
    const queried = base.invoices.filter(r => r.invoice.status === "Queried");

    return (
      <div>
        <SubTabBar tabs={sourcingTabs} active={subTab} onChange={setSubTab} />
        <div className="space-y-6 p-6">
          {periodBar}

          {subTab === 0 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Sourcing Cases", value: fmtNum(base.sourcing.length), sub: `${fmtNum(base.sourcing.filter(s => s.approvalStatus === "Approved").length)} approved`, icon: <FileText size={18} />, tone: "info" },
              { label: "Average Award Rate", value: fmtPct(sourcingData.avgAwardRate ?? 0), sub: "cases carried to award", icon: <TrendingUp size={18} />, tone: "success" },
              { label: "Total Invoiced", value: fmt(sourcingData.totalInvoiced), sub: `${fmtNum(base.invoices.length)} invoices`, icon: <DollarSign size={18} />, tone: "info" },
              { label: "Awaiting Payment", value: fmtNum(unpaid.length), sub: fmt(unpaid.reduce((s, r) => s + r.invoice.amount, 0)), icon: <Clock size={18} />, tone: "warning" },
            ]} />

            <div className="grid grid-cols-3 gap-4">
              <ChartCard title="Sourcing Case Status" isEmpty={sourcingData.rfqStatus.length === 0}
                emptyMessage="No sourcing cases in this period" emptyHint={noDataHint}>
                <PieChart>
                  <Pie data={sourcingData.rfqStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value"
                    label={(props: any) => `${props.name}: ${props.value}`}>
                    {sourcingData.rfqStatus.map(e => <Cell key={`src-${e.name}`} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </PieChart>
              </ChartCard>

              <ChartCard title="Sourcing Activity by Project" className="col-span-2" isEmpty={sourcingData.byProject.length === 0}
                emptyMessage="No sourcing activity in this period" emptyHint={noDataHint}>
                <BarChart data={sourcingData.byProject.slice(0, 8)} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="shortLabel" tick={{ fontSize: 9, fontFamily: F }} />
                  <YAxis tick={{ fontSize: 9, fontFamily: F }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} />
                  <Bar dataKey="invited" fill="#c7d2fe" name="Cases run" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="submitted" fill={BLUE} name="Carried to award" radius={[2, 2, 0, 0]} />
                  <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </BarChart>
              </ChartCard>
            </div>

            <ChartCard title="Invoiced vs Paid" height={230} isEmpty={sourcingData.invoiceTrend.length === 0}
              emptyMessage="No invoices in this period" emptyHint={noDataHint}>
              <ComposedChart data={sourcingData.invoiceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontFamily: F }} />
                <YAxis tick={{ fontSize: 9, fontFamily: F }} />
                <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} formatter={(v: any) => fmt(Number(v))} />
                <Bar dataKey="invoiced" fill="#c7d2fe" name="Invoiced" radius={[2, 2, 0, 0]} />
                <Bar dataKey="paid" fill={BLUE} name="Paid" radius={[2, 2, 0, 0]} />
                <Line dataKey="outstanding" stroke="#ef4444" strokeWidth={2} name="Outstanding" dot={{ r: 3 }} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </ComposedChart>
            </ChartCard>
          </>}

          {subTab === 1 && (
            <ReportSection title="Sourcing Status Report" columns={sourcingColumns} rows={sourcingRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No sourcing cases in this period" emptyHint={noDataHint} />
          )}

          {subTab === 2 && (
            <ReportSection title="Bid Submission Report" columns={bidColumns} rows={bidRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No bid activity in this period" emptyHint={noDataHint} />
          )}

          {subTab === 3 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Invoices Received", value: fmtNum(base.invoices.length), sub: fmt(sourcingData.totalInvoiced), icon: <FileText size={18} />, tone: "info" },
              { label: "Paid", value: fmtNum(base.invoices.filter(r => r.invoice.status === "Paid").length), sub: fmt(base.invoices.reduce((s, r) => s + (r.invoice.amountPaid ?? 0), 0)), icon: <CheckCircle2 size={18} />, tone: "success" },
              { label: "In Approval Chain", value: fmtNum(unpaid.length), sub: "awaiting a decision", icon: <Clock size={18} />, tone: "info" },
              { label: "Queried", value: fmtNum(queried.length), sub: "returned to vendor", icon: <AlertTriangle size={18} />, tone: "danger" },
            ]} />
            <ReportSection title="Invoice and Payment Report" columns={invoiceColumns} rows={invoiceRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No invoices in this period" emptyHint={noDataHint} />
          </>}

          {subTab === 4 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Expiring Within Window", value: fmtNum(expiry.rows.filter(r => r.daysLeft >= 0).length), sub: `next ${expiryWindow} days`, icon: <CalendarClock size={18} />, tone: "warning" },
              { label: "Past End Date", value: fmtNum(expiry.overdue), sub: "not yet closed out", icon: <AlertTriangle size={18} />, tone: "danger" },
              { label: "Active Contracts", value: fmtNum(base.allContracts.filter(c => c.status === "Active").length), sub: "across the portfolio", icon: <FileText size={18} />, tone: "success" },
            ]} />
            <ReportSection title="Contract Expiry and Renewal" columns={expiryColumns} rows={expiryRows} meta={exportMeta}
              search={searchQuery} controls={expiryControl}
              emptyMessage={`No contracts reach their end date within ${expiryWindow} days`}
              emptyHint="The renewal horizon is measured from today." />
          </>}
        </div>
      </div>
    );
  };

  /* ── Tab 3: Vendors & KPIs ─────────────────────────────────────────────── */

  const vendorTabs = ["Charts & Statistics", "Vendor Master List", "Participation", "Payments", "Prequalification", "Cycle & Timeliness"];

  const renderVendors = () => {
    const masterColumns: TableColumn[] = [
      { key: "vendorId", header: "Vendor ID", cell: refCell("vendorId") },
      { key: "name", header: "Vendor / Consultant" },
      { key: "type", header: "Type" },
      { key: "category", header: "Category" },
      { key: "status", header: "Status", cell: badgeCell("status") },
      { key: "risk", header: "Risk", cell: badgeCell("risk") },
      { key: "score", header: "Score", align: "center", format: scoreFormat, cell: scoreCell("score", 8, 5) },
      { key: "contracts", header: "Contracts", align: "center", cell: countCell("contracts") },
      { key: "spend", header: "Lifetime Spend", format: moneyFormat, cell: moneyCell("spend") },
      { key: "docIssues", header: "Doc Issues", align: "center", cell: countCell("docIssues", 0) },
      { key: "eligible", header: "Sourcing Eligible", format: yesNoFormat, cell: yesNoCell("eligible") },
    ];

    const masterRows: ReportRow[] = base.vendors.map(v => {
      const flags = getVendorFlags(v);
      const eligibility = checkSourcingEligibility(v.id);
      return {
        __key: v.id,
        vendorId: v.vendorId,
        name: vendorDisplayName(v),
        type: v.type,
        category: v.category,
        status: v.status,
        risk: v.riskLevel,
        score: avgScore(v.performance) || "",
        contracts: v.contractHistory?.length ?? v.totalOrders,
        spend: v.totalSpend,
        docIssues: flags.expiredDocs.length + flags.missingDocs.length,
        eligible: eligibility.eligible,
      };
    });

    const participationColumns: TableColumn[] = [
      { key: "vendor", header: "Vendor" },
      { key: "bids", header: "Bids Submitted", align: "center", cell: countCell("bids") },
      { key: "awards", header: "Awards Won", align: "center", cell: countCell("awards") },
      { key: "winRate", header: "Win Rate", format: pctFormat, cell: scoreCell("winRate", 50, 25, "%") },
      { key: "value", header: "Contract Value", format: moneyFormat, cell: moneyCell("value") },
      { key: "active", header: "Active", align: "center", cell: countCell("active") },
      { key: "completed", header: "Completed", align: "center", cell: countCell("completed") },
    ];

    const participationRows: ReportRow[] = vendorData.participation.map((p, i) => ({
      __key: `part-${i}`,
      vendor: p.vendor,
      bids: p.bidsSubmitted,
      awards: p.awardsWon,
      winRate: p.winRate,
      value: p.totalContractValue,
      active: p.activeContracts,
      completed: p.completedContracts,
    }));

    const paymentColumns: TableColumn[] = [
      { key: "vendor", header: "Vendor" },
      { key: "submitted", header: "Invoices", align: "center", cell: countCell("submitted") },
      { key: "paid", header: "Paid", align: "center", cell: countCell("paid") },
      { key: "pending", header: "In Chain", align: "center", cell: countCell("pending") },
      { key: "queried", header: "Queried", align: "center", cell: countCell("queried", 0) },
      { key: "outstanding", header: "Outstanding", format: moneyFormat, cell: moneyCell("outstanding") },
      { key: "avgDays", header: "Avg Days to Pay", align: "center", format: v => (v === null || v === undefined || v === "" ? "—" : `${Number(v).toFixed(1)}`) },
    ];

    const paymentRows: ReportRow[] = vendorData.payments.map((p, i) => ({
      __key: `pay-${i}`,
      vendor: p.vendor,
      submitted: p.invoicesSubmitted,
      paid: p.paid,
      pending: p.pending,
      queried: p.queried,
      outstanding: p.outstanding,
      avgDays: p.avgDaysToPay ?? "",
    }));

    const prequalColumns: TableColumn[] = [
      { key: "vendorId", header: "Vendor ID", cell: refCell("vendorId") },
      { key: "name", header: "Vendor / Consultant" },
      { key: "category", header: "Category" },
      { key: "prequal", header: "Prequalification", cell: badgeCell("prequal") },
      { key: "score", header: "Score", align: "center", format: scoreFormat, cell: scoreCell("score", 8, 5) },
      { key: "expired", header: "Expired Docs", align: "center", cell: countCell("expired", 0) },
      { key: "missing", header: "Missing Docs", align: "center", cell: countCell("missing", 0) },
      { key: "reason", header: "Eligibility" },
    ];

    const prequalRows: ReportRow[] = base.vendors.map(v => {
      const flags = getVendorFlags(v);
      const eligibility = checkSourcingEligibility(v.id);
      return {
        __key: `pq-${v.id}`,
        vendorId: v.vendorId,
        name: vendorDisplayName(v),
        category: v.category,
        prequal: prequalBucket(v),
        score: avgScore(v.performance) || "",
        expired: flags.expiredDocs.length,
        missing: flags.missingDocs.length,
        reason: eligibility.eligible
          ? eligibility.requiresManagementApproval ? "Eligible with management approval" : "Eligible"
          : eligibility.blockingReasons[0] ?? "Blocked",
      };
    });

    const blockedCount = base.vendors.filter(v => !checkSourcingEligibility(v.id).eligible).length;
    const docIssueCount = base.vendors.filter(v => {
      const f = getVendorFlags(v);
      return f.expiredDocs.length > 0 || f.missingDocs.length > 0 || f.expiringDocs.length > 0;
    }).length;

    return (
      <div>
        <SubTabBar tabs={vendorTabs} active={subTab} onChange={setSubTab} />
        <div className="space-y-6 p-6">
          {periodBar}

          {subTab === 0 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Registered Vendors", value: fmtNum(base.vendors.length), sub: `${fmtNum(base.vendors.filter(v => v.status === "Active").length)} active`, icon: <Users size={18} />, tone: "info" },
              { label: "Prequalified", value: fmtNum(vendorData.prequalifiedCount), sub: "eligible for sourcing", icon: <CheckCircle2 size={18} />, tone: "success" },
              { label: "Blocked or Restricted", value: fmtNum(blockedCount), sub: "cannot be awarded", icon: <AlertTriangle size={18} />, tone: "danger" },
              { label: "Document Issues", value: fmtNum(docIssueCount), sub: "expired, expiring or missing", icon: <FileText size={18} />, tone: "warning" },
            ]} />

            <div className="grid grid-cols-2 gap-4">
              <ChartCard title="Prequalification Status" height={215} isEmpty={vendorData.prequalCounts.length === 0}
                emptyMessage="No vendors registered" emptyHint={noDataHint}>
                <PieChart>
                  <Pie data={vendorData.prequalCounts} cx="50%" cy="50%" innerRadius={45} outerRadius={78} paddingAngle={3} dataKey="value"
                    label={(props: any) => `${props.name}: ${props.value}`}>
                    {vendorData.prequalCounts.map(e => <Cell key={`pq-${e.name}`} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: F, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </PieChart>
              </ChartCard>

              <ChartCard title="Payment Timeliness" height={215} isEmpty={vendorData.paymentTrend.length === 0}
                emptyMessage="No settled invoices in this period" emptyHint={noDataHint}>
                <BarChart data={vendorData.paymentTrend} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fontFamily: F }} />
                  <YAxis tick={{ fontSize: 9, fontFamily: F }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} />
                  <Bar dataKey="onTime" stackId="p" fill="#22c55e" name="On time" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="late" stackId="p" fill="#f59e0b" name="Late" />
                  <Bar dataKey="overdue" stackId="p" fill="#ef4444" name="Still outstanding" />
                  <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
                </BarChart>
              </ChartCard>
            </div>

            <ChartCard title="Requisition-to-Contract Cycle Time" height={230} isEmpty={vendorData.cycleTrend.length === 0}
              emptyMessage="No completed cycles in this period" emptyHint={noDataHint}>
              <ComposedChart data={vendorData.cycleTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontFamily: F }} />
                <YAxis tick={{ fontSize: 9, fontFamily: F }} label={{ value: "Days", angle: -90, position: "insideLeft", style: { fontSize: 10, fontFamily: F } }} />
                <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} />
                <Bar dataKey="reqToApproval" stackId="c" fill="#c7d2fe" name="Raise → approve" radius={[2, 2, 0, 0]} />
                <Bar dataKey="approvalToSourcing" stackId="c" fill="#818cf8" name="Approve → source" />
                <Bar dataKey="sourcingToContract" stackId="c" fill={BLUE} name="Source → contract" />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </ComposedChart>
            </ChartCard>
          </>}

          {subTab === 1 && (
            <ReportSection title="Vendor and Consultant Master List" columns={masterColumns} rows={masterRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No vendors registered" emptyHint={noDataHint} />
          )}

          {subTab === 2 && (
            <ReportSection title="Vendor Procurement Participation" columns={participationColumns} rows={participationRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No vendor participation in this period" emptyHint={noDataHint} />
          )}

          {subTab === 3 && (
            <ReportSection title="Vendor Payment and Invoice Report" columns={paymentColumns} rows={paymentRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No vendor invoices in this period" emptyHint={noDataHint} />
          )}

          {subTab === 4 && (
            <ReportSection title="Prequalification Status Report" columns={prequalColumns} rows={prequalRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No vendors registered" emptyHint={noDataHint} />
          )}

          {subTab === 5 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Requisition → Award", value: fmtDays(kpis.reqToAward), sub: `target ${KPI_TARGETS.reqToAwardDays} days`, icon: <Clock size={18} />, tone: "info" },
              { label: "Award → Contract", value: fmtDays(kpis.awardToContract), sub: `target ${KPI_TARGETS.awardToContractDays} days`, icon: <FileText size={18} />, tone: "info" },
              { label: "Contract → Payment", value: fmtDays(kpis.contractToPayment), sub: `target ${KPI_TARGETS.contractToPaymentDays} days`, icon: <DollarSign size={18} />, tone: "warning" },
              { label: "Invoice → Payment", value: fmtDays(average(base.invoices.map(r => invoiceDaysToPay(r.invoice)).filter((d): d is number => d !== null))), sub: `target ${KPI_TARGETS.paymentWithinDays} days`, icon: <CheckCircle2 size={18} />, tone: "success" },
            ]} />
            <ReportSection title="Vendor Payment Timeliness" columns={paymentColumns} rows={paymentRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No vendor invoices in this period" emptyHint={noDataHint} />
          </>}
        </div>
      </div>
    );
  };

  /* ── Tab 4: Contracts ──────────────────────────────────────────────────── */

  const contractTabs = ["Charts & Statistics", "Active Contracts", "Deliverables", "Variations", "Close-Out", "Contract Risk", "Expiry Alerts"];

  const renderContracts = () => {
    const activeColumns: TableColumn[] = [
      { key: "contract", header: "Contract", cell: refCell("contract") },
      { key: "title", header: "Title" },
      { key: "vendor", header: "Vendor" },
      { key: "category", header: "Category" },
      { key: "funding", header: "Funding Source" },
      { key: "value", header: "Value", format: moneyFormat, cell: moneyCell("value") },
      { key: "paid", header: "Paid", format: moneyFormat, cell: moneyCell("paid") },
      { key: "balance", header: "Balance", format: moneyFormat, cell: moneyCell("balance") },
      { key: "start", header: "Start", format: v => prettyDate(String(v ?? "")) },
      { key: "end", header: "End", format: v => prettyDate(String(v ?? "")) },
      { key: "deliverables", header: "Deliverables", cell: progressCell("deliverablesAccepted", "deliverablesTotal") },
      { key: "status", header: "Status", cell: badgeCell("status") },
    ];

    const activeRows: ReportRow[] = base.contracts.map(c => {
      const f = getContractFinancials(c);
      const dels = c.deliverables ?? [];
      return {
        __key: c.id,
        contract: c.contractNumber,
        title: c.title,
        vendor: c.party,
        category: c.category,
        funding: base.contractFunding(c),
        value: c.value,
        paid: f.totalPaid,
        balance: f.balance,
        start: c.startDate,
        end: c.endDate,
        deliverablesAccepted: dels.filter(d => d.status === "Accepted").length,
        deliverablesTotal: dels.length,
        deliverables: "",
        status: c.status,
      };
    });

    const deliverableColumns: TableColumn[] = [
      { key: "contract", header: "Contract", cell: refCell("contract") },
      { key: "vendor", header: "Vendor" },
      { key: "description", header: "Deliverable" },
      { key: "due", header: "Due", format: v => prettyDate(String(v ?? "")) },
      { key: "actual", header: "Submitted", format: v => (v ? prettyDate(String(v)) : "—") },
      { key: "daysLate", header: "Timing", align: "center", format: v => (v === null || v === undefined ? "—" : Number(v) > 0 ? `${v} days late` : `${Math.abs(Number(v))} days early`) },
      { key: "amount", header: "Value", format: moneyFormat, cell: moneyCell("amount") },
      { key: "reviewer", header: "Reviewed By" },
      { key: "status", header: "Status", cell: badgeCell("status") },
    ];

    const deliverableRows: ReportRow[] = base.contracts.flatMap(c =>
      (c.deliverables ?? []).map(d => ({
        __key: d.id,
        contract: c.contractNumber,
        vendor: c.party,
        description: d.description,
        due: d.dueDate,
        actual: d.actualDate ?? "",
        daysLate: d.actualDate ? daysBetween(d.dueDate, d.actualDate) : null,
        amount: d.amount ?? 0,
        reviewer: d.reviewedBy ?? "—",
        status: d.status,
      }))
    );

    const variationColumns: TableColumn[] = [
      { key: "contract", header: "Contract", cell: refCell("contract") },
      { key: "number", header: "Amendment", align: "center" },
      { key: "types", header: "Type" },
      { key: "reason", header: "Reason" },
      { key: "costImpact", header: "Cost Impact", format: moneyFormat, cell: moneyCell("costImpact") },
      { key: "timeImpact", header: "Time Impact" },
      { key: "revisedValue", header: "Revised Value", format: moneyFormat, cell: moneyCell("revisedValue") },
      { key: "requestedBy", header: "Requested By" },
      { key: "status", header: "Status", cell: badgeCell("status") },
    ];

    const variationRows: ReportRow[] = base.changeRequests.map(({ contract, changeRequest }) => ({
      __key: changeRequest.id,
      contract: contract.contractNumber,
      number: `#${changeRequest.changeNumber}`,
      types: changeRequest.types.join(", "),
      reason: changeRequest.reason,
      costImpact: changeRequest.estimatedCostImpact,
      timeImpact: changeRequest.estimatedTimeImpact || "—",
      revisedValue: changeRequest.revisedValue ?? contract.value,
      requestedBy: changeRequest.requestedBy,
      status: changeRequest.status,
    }));

    const closeOutColumns: TableColumn[] = [
      { key: "contract", header: "Contract", cell: refCell("contract") },
      { key: "vendor", header: "Vendor" },
      { key: "value", header: "Value", format: moneyFormat, cell: moneyCell("value") },
      { key: "paid", header: "Final Payments", format: moneyFormat, cell: moneyCell("paid") },
      { key: "readiness", header: "Close-Out Readiness", cell: progressCell("satisfied", "totalChecks") },
      { key: "score", header: "Final Score", align: "center", format: scoreFormat, cell: scoreCell("score", 8, 5) },
      { key: "certificate", header: "Certificate Issued", format: yesNoFormat, cell: yesNoCell("certificate") },
      { key: "closedDate", header: "Closed", format: v => (v ? prettyDate(String(v)) : "—") },
      { key: "status", header: "Status", cell: badgeCell("status") },
    ];

    const closeOutRows: ReportRow[] = base.contracts.map(c => {
      const checks = verifyCloseOutReadiness(c);
      const f = getContractFinancials(c);
      const finalEval = (c.performanceEvaluations ?? []).find(e => e.evaluationType === "Final");
      return {
        __key: `co-${c.id}`,
        contract: c.contractNumber,
        vendor: c.party,
        value: c.value,
        paid: f.totalPaid,
        satisfied: checks.filter(ch => ch.satisfied).length,
        totalChecks: checks.length,
        readiness: "",
        score: finalEval?.overallScore ?? "",
        certificate: !!c.closeOut?.completionCertificate,
        closedDate: c.closeOut?.closedDate ?? "",
        status: c.status,
      };
    });

    const riskColumns: TableColumn[] = [
      { key: "contract", header: "Contract", cell: refCell("contract") },
      { key: "vendor", header: "Vendor" },
      { key: "value", header: "Value", format: moneyFormat, cell: moneyCell("value") },
      { key: "severity", header: "Severity", cell: badgeCell("severity") },
      { key: "riskCount", header: "Signals", align: "center", cell: countCell("riskCount", 1) },
      { key: "risks", header: "Risk Signals" },
    ];

    const riskRows: ReportRow[] = base.risks.map(r => ({
      __key: `risk-${r.contract.id}`,
      contract: r.contract.contractNumber,
      vendor: r.contract.party,
      value: r.contract.value,
      severity: r.severity,
      riskCount: r.risks.length,
      risks: r.risks.join("; "),
    }));

    const overdueCount = deliverableRows.filter(r => r.status !== "Accepted" && daysUntil(String(r.due)) < 0).length;

    return (
      <div>
        <SubTabBar tabs={contractTabs} active={subTab} onChange={setSubTab} />
        <div className="space-y-6 p-6">
          {periodBar}

          {subTab === 0 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Contract Portfolio", value: fmt(contractData.totalValue), sub: `${fmtNum(base.contracts.length)} contracts`, icon: <FileText size={18} />, tone: "info" },
              { label: "Paid to Date", value: fmt(contractData.totalPaid), sub: fmtPct(pct(contractData.totalPaid, contractData.totalValue)), icon: <DollarSign size={18} />, tone: "success" },
              { label: "Active", value: fmtNum(contractData.activeCount), sub: "in delivery", icon: <CheckCircle2 size={18} />, tone: "info" },
              { label: "Overdue Deliverables", value: fmtNum(overdueCount), sub: "past due date", icon: <AlertTriangle size={18} />, tone: "danger" },
            ]} />

            <div className="grid grid-cols-2 gap-4">
              <ChartCard title="Contract Value by Status" height={215} isEmpty={base.contracts.length === 0}
                emptyMessage="No contracts in this period" emptyHint={noDataHint}>
                <BarChart data={Array.from(groupBy(base.contracts, c => c.status)).map(([name, list]) => ({ name, value: list.reduce((s, c) => s + c.value, 0), count: list.length }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: F }} />
                  <YAxis tick={{ fontSize: 9, fontFamily: F }} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} formatter={(v: any) => fmt(Number(v))} />
                  <Bar dataKey="value" fill={BLUE} name="Value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>

              <ChartCard title="Contract Value by Category" height={215} isEmpty={base.contracts.length === 0}
                emptyMessage="No contracts in this period" emptyHint={noDataHint}>
                <BarChart data={Array.from(groupBy(base.contracts, c => c.category)).map(([name, list]) => ({ name, value: list.reduce((s, c) => s + c.value, 0) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: F }} />
                  <YAxis tick={{ fontSize: 9, fontFamily: F }} />
                  <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} formatter={(v: any) => fmt(Number(v))} />
                  <Bar dataKey="value" fill="#8b5cf6" name="Value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartCard>
            </div>
          </>}

          {subTab === 1 && (
            <ReportSection title="Active Contracts Report" columns={activeColumns} rows={activeRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No contracts in this period" emptyHint={noDataHint} />
          )}

          {subTab === 2 && (
            <ReportSection title="Deliverables Status Report" columns={deliverableColumns} rows={deliverableRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No deliverables recorded" emptyHint={noDataHint} />
          )}

          {subTab === 3 && (
            <ReportSection title="Contract Variation Report" columns={variationColumns} rows={variationRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No variations raised in this period"
              emptyHint="Amendments appear here once a change request is submitted against a contract." />
          )}

          {subTab === 4 && (
            <ReportSection title="Contract Close-Out Report" columns={closeOutColumns} rows={closeOutRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No contracts in this period" emptyHint={noDataHint} />
          )}

          {subTab === 5 && (
            <ReportSection title="Contract Risk Report" columns={riskColumns} rows={riskRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No contract risks detected"
              emptyHint="Risk signals include overdue deliverables, repeated invoice queries, excessive variations and approaching expiry." />
          )}

          {subTab === 6 && (
            <ReportSection title="Contract Expiry Alerts" columns={expiryColumns} rows={expiryRows} meta={exportMeta}
              search={searchQuery} controls={expiryControl}
              emptyMessage={`No contracts reach their end date within ${expiryWindow} days`}
              emptyHint="The renewal horizon is measured from today." />
          )}
        </div>
      </div>
    );
  };

  /* ── Tab 5: Donors ─────────────────────────────────────────────────────── */

  const donorTabs = ["Charts & Statistics", "Donor Procurement Summary", "Donor Budget Utilization"];

  const renderDonors = () => {
    const donors = new Map<string, {
      planned: number; committed: number; spent: number;
      activities: number; contracts: number; pending: number;
      goods: number; services: number; works: number; consultancy: number;
    }>();

    const bucket = (name: string) => {
      const key = name || "Unattributed";
      if (!donors.has(key)) {
        donors.set(key, { planned: 0, committed: 0, spent: 0, activities: 0, contracts: 0, pending: 0, goods: 0, services: 0, works: 0, consultancy: 0 });
      }
      return donors.get(key)!;
    };

    base.approvedPlanItems.forEach(p => {
      const d = bucket(p.fundingSource);
      d.planned += p.estimatedValue;
      d.activities += 1;
      if (p.category === "Goods") d.goods += 1;
      else if (p.category === "Services") d.services += 1;
      else if (p.category === "Works") d.works += 1;
      else d.consultancy += 1;
    });

    base.prs.forEach(p => {
      const d = bucket(p.fundingSource ?? "");
      if (["Pending Dept Approval", "Pending Procurement & Finance", "Pending Senior Mgmt"].includes(p.overallApprovalStatus)) {
        d.pending += 1;
      }
    });

    base.contracts.forEach(c => {
      const d = bucket(base.contractFunding(c));
      d.committed += c.value;
      d.spent += getContractFinancials(c).totalPaid;
      d.contracts += 1;
    });

    const donorRows: ReportRow[] = Array.from(donors, ([donor, d]) => ({
      __key: `donor-${donor}`,
      donor,
      activities: d.activities,
      contracts: d.contracts,
      goods: d.goods,
      services: d.services,
      works: d.works,
      consultancy: d.consultancy,
      planned: d.planned,
      committed: d.committed,
      spent: d.spent,
      remaining: d.planned - d.spent,
      utilization: pct(d.spent, d.planned),
      pending: d.pending,
    })).sort((a, b) => Number(b.committed) - Number(a.committed));

    const summaryColumns: TableColumn[] = [
      { key: "donor", header: "Donor / Funding Source" },
      { key: "activities", header: "Plan Activities", align: "center", cell: countCell("activities") },
      { key: "goods", header: "Goods", align: "center", cell: countCell("goods") },
      { key: "services", header: "Services", align: "center", cell: countCell("services") },
      { key: "works", header: "Works", align: "center", cell: countCell("works") },
      { key: "consultancy", header: "Consultancy", align: "center", cell: countCell("consultancy") },
      { key: "contracts", header: "Contracts", align: "center", cell: countCell("contracts") },
      { key: "committed", header: "Committed", format: moneyFormat, cell: moneyCell("committed") },
      { key: "pending", header: "Pending Approvals", align: "center", cell: countCell("pending", 0) },
    ];

    const utilizationColumns: TableColumn[] = [
      { key: "donor", header: "Donor / Funding Source" },
      { key: "planned", header: "Planned", format: moneyFormat, cell: moneyCell("planned") },
      { key: "committed", header: "Committed", format: moneyFormat, cell: moneyCell("committed") },
      { key: "spent", header: "Spent", format: moneyFormat, cell: moneyCell("spent") },
      { key: "remaining", header: "Remaining", format: moneyFormat, cell: moneyCell("remaining") },
      { key: "utilization", header: "Utilization", format: pctFormat, cell: scoreCell("utilization", 0, 0, "%") },
    ];

    const chartData = donorRows.slice(0, 8).map(r => ({
      name: String(r.donor).length > 14 ? `${String(r.donor).slice(0, 14)}…` : String(r.donor),
      planned: Number(r.planned),
      committed: Number(r.committed),
      spent: Number(r.spent),
      contracts: Number(r.contracts),
    }));

    return (
      <div>
        <SubTabBar tabs={donorTabs} active={subTab} onChange={setSubTab} />
        <div className="space-y-6 p-6">
          {periodBar}

          {subTab === 0 && <>
            <ProcurementStatCards variant="flush" stats={[
              { label: "Funding Sources", value: fmtNum(donorRows.length), sub: "with activity in scope", icon: <Users size={18} />, tone: "info" },
              { label: "Total Planned", value: fmt(donorRows.reduce((s, r) => s + Number(r.planned), 0)), sub: "approved plan value", icon: <FileText size={18} />, tone: "info" },
              { label: "Total Committed", value: fmt(donorRows.reduce((s, r) => s + Number(r.committed), 0)), sub: "contracted", icon: <Package size={18} />, tone: "accent" },
              { label: "Total Spent", value: fmt(donorRows.reduce((s, r) => s + Number(r.spent), 0)), sub: "paid to vendors", icon: <DollarSign size={18} />, tone: "success" },
            ]} />

            <ChartCard title="Planned vs Committed vs Spent by Donor" height={260} isEmpty={chartData.length === 0}
              emptyMessage="No donor-attributed activity in this period" emptyHint={noDataHint}>
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: F }} />
                <YAxis tick={{ fontSize: 9, fontFamily: F }} />
                <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} formatter={(v: any) => fmt(Number(v))} />
                <Bar dataKey="planned" fill="#c7d2fe" name="Planned" radius={[2, 2, 0, 0]} />
                <Bar dataKey="committed" fill="#818cf8" name="Committed" radius={[2, 2, 0, 0]} />
                <Bar dataKey="spent" fill={BLUE} name="Spent" radius={[2, 2, 0, 0]} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: F }} />
              </BarChart>
            </ChartCard>

            <ChartCard title="Contracts per Donor" height={220} isEmpty={chartData.length === 0}
              emptyMessage="No donor-attributed contracts in this period" emptyHint={noDataHint}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: F }} />
                <YAxis tick={{ fontSize: 9, fontFamily: F }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 10, fontFamily: F }} />
                <Bar dataKey="contracts" fill="#22c55e" name="Contracts" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartCard>
          </>}

          {subTab === 1 && (
            <ReportSection title="Donor Procurement Summary" columns={summaryColumns} rows={donorRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No donor-attributed activity in this period" emptyHint={noDataHint} />
          )}

          {subTab === 2 && (
            <ReportSection title="Donor Budget Utilization" columns={utilizationColumns} rows={donorRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No donor-attributed activity in this period" emptyHint={noDataHint} />
          )}
        </div>
      </div>
    );
  };

  /* ── Tab 6: Combined analysis ──────────────────────────────────────────── */

  const combinedTabs = ["Vendor × Donor Performance", "Top Performers", "Spend per Donor by Vendor", "Procurement Compliance"];

  const renderCombined = () => {
    const vdColumns: TableColumn[] = [
      { key: "vendor", header: "Vendor" },
      { key: "donor", header: "Donor / Funding Source" },
      { key: "contract", header: "Contract", cell: refCell("contract") },
      { key: "value", header: "Contract Value", format: moneyFormat, cell: moneyCell("value") },
      { key: "paid", header: "Paid", format: moneyFormat, cell: moneyCell("paid") },
      { key: "performanceScore", header: "Performance", align: "center", format: scoreFormat, cell: scoreCell("performanceScore", 80, 50, "%") },
      { key: "evaluated", header: "Evaluated", format: yesNoFormat, cell: yesNoCell("evaluated") },
      { key: "status", header: "Status", cell: badgeCell("status") },
    ];

    const vdRows: ReportRow[] = combined.vendorDonorPerformance.map((r, i) => ({
      __key: `vd-${i}`,
      vendor: r.vendor,
      donor: r.donor,
      contract: r.contract,
      value: r.value,
      paid: r.paid,
      performanceScore: r.performanceScore ?? "",
      evaluated: r.evaluated,
      status: r.status,
    }));

    const topColumns: TableColumn[] = [
      { key: "vendor", header: "Vendor" },
      { key: "avgScore", header: "Average Score", align: "center", format: scoreFormat, cell: scoreCell("avgScore", 8, 5) },
      { key: "contractsWon", header: "Contracts Won", align: "center", cell: countCell("contractsWon") },
      { key: "totalValue", header: "Total Value", format: moneyFormat, cell: moneyCell("totalValue") },
      { key: "winRate", header: "Win Rate", format: pctFormat, cell: scoreCell("winRate", 50, 25, "%") },
    ];

    const topRows: ReportRow[] = combined.topPerformers.map((t, i) => ({
      __key: `top-${i}`,
      vendor: t.vendor,
      avgScore: t.avgScore,
      contractsWon: t.contractsWon,
      totalValue: t.totalValue,
      winRate: t.winRate,
    }));

    // Spend per donor broken down by vendor.
    const spendMap = new Map<string, Map<string, number>>();
    base.contracts.forEach(c => {
      const donor = base.contractFunding(c);
      if (!spendMap.has(donor)) spendMap.set(donor, new Map());
      const inner = spendMap.get(donor)!;
      inner.set(c.party, (inner.get(c.party) ?? 0) + getContractFinancials(c).totalPaid);
    });

    const spendRows: ReportRow[] = Array.from(spendMap).flatMap(([donor, vendorsMap]) =>
      Array.from(vendorsMap, ([vendor, spend]) => ({
        __key: `sp-${donor}-${vendor}`,
        donor,
        vendor,
        spend,
        share: pct(spend, Array.from(vendorsMap.values()).reduce((s, v) => s + v, 0)),
      }))
    ).sort((a, b) => Number(b.spend) - Number(a.spend));

    const spendColumns: TableColumn[] = [
      { key: "donor", header: "Donor / Funding Source" },
      { key: "vendor", header: "Vendor" },
      { key: "spend", header: "Spend", format: moneyFormat, cell: moneyCell("spend") },
      { key: "share", header: "Share of Donor Spend", format: pctFormat, cell: scoreCell("share", 0, 0, "%") },
    ];

    // Compliance per donor: are contracts under this funding source running clean?
    const complianceRows: ReportRow[] = Array.from(
      groupBy(base.contracts, c => base.contractFunding(c))
    ).map(([donor, list]) => {
      const withRisk = list.filter(c => base.risks.some(r => r.contract.id === c.id)).length;
      const overdueDels = list.reduce(
        (s, c) => s + (c.deliverables ?? []).filter(d => d.status !== "Accepted" && daysUntil(d.dueDate) < 0).length, 0
      );
      const queriedInv = list.reduce((s, c) => s + (c.invoices ?? []).filter(i => i.status === "Queried").length, 0);
      const evaluated = list.filter(c => (c.performanceEvaluations ?? []).length > 0).length;
      return {
        __key: `comp-${donor}`,
        donor,
        contracts: list.length,
        clean: list.length - withRisk,
        atRisk: withRisk,
        overdueDeliverables: overdueDels,
        queriedInvoices: queriedInv,
        evaluated,
        complianceRate: pct(list.length - withRisk, list.length),
      };
    }).sort((a, b) => Number(b.contracts) - Number(a.contracts));

    const complianceColumns: TableColumn[] = [
      { key: "donor", header: "Donor / Funding Source" },
      { key: "contracts", header: "Contracts", align: "center", cell: countCell("contracts") },
      { key: "clean", header: "Running Clean", align: "center", cell: countCell("clean") },
      { key: "atRisk", header: "Carrying Risk", align: "center", cell: countCell("atRisk", 0) },
      { key: "overdueDeliverables", header: "Overdue Deliverables", align: "center", cell: countCell("overdueDeliverables", 0) },
      { key: "queriedInvoices", header: "Queried Invoices", align: "center", cell: countCell("queriedInvoices", 0) },
      { key: "evaluated", header: "Evaluated", align: "center", cell: countCell("evaluated") },
      { key: "complianceRate", header: "Compliance Rate", format: pctFormat, cell: scoreCell("complianceRate", 80, 50, "%") },
    ];

    return (
      <div>
        <SubTabBar tabs={combinedTabs} active={subTab} onChange={setSubTab} />
        <div className="space-y-6 p-6">
          {periodBar}

          <ProcurementStatCards variant="flush" stats={[
            { label: "Average Performance", value: combined.scoredCount ? fmtPct(combined.avgPerformance ?? 0) : "—", sub: `${fmtNum(combined.scoredCount)} scored contracts`, icon: <TrendingUp size={18} />, tone: "success" },
            { label: "Vendors Engaged", value: fmtNum(new Set(base.contracts.map(c => c.party)).size), sub: "under contract in period", icon: <Users size={18} />, tone: "info" },
            { label: "Funding Sources", value: fmtNum(new Set(base.contracts.map(c => base.contractFunding(c))).size), sub: "with contracted spend", icon: <Package size={18} />, tone: "accent" },
            { label: "Contracts at Risk", value: fmtNum(base.risks.length), sub: "carrying one or more signals", icon: <AlertTriangle size={18} />, tone: "danger" },
          ]} />

          {subTab === 0 && (
            <ReportSection title="Vendor Performance on Donor-Funded Contracts" columns={vdColumns} rows={vdRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No contracts in this period" emptyHint={noDataHint} />
          )}

          {subTab === 1 && (
            <ReportSection title="Top Performing Vendors" columns={topColumns} rows={topRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No vendors have been scored yet"
              emptyHint="Scores arrive from contract performance evaluations at mid-term and close-out." />
          )}

          {subTab === 2 && (
            <ReportSection title="Procurement Spend per Donor by Vendor" columns={spendColumns} rows={spendRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No spend recorded in this period" emptyHint={noDataHint} />
          )}

          {subTab === 3 && (
            <ReportSection title="Procurement Compliance per Donor" columns={complianceColumns} rows={complianceRows} meta={exportMeta}
              search={searchQuery} emptyMessage="No contracts in this period" emptyHint={noDataHint} />
          )}
        </div>
      </div>
    );
  };

  /* ── Screen ────────────────────────────────────────────────────────────── */

  const renderers: Record<TabKey, () => ReactNode> = {
    planning: renderPlanning,
    sourcing: renderSourcing,
    vendors: renderVendors,
    contracts: renderContracts,
    donors: renderDonors,
    combined: renderCombined,
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: F }}>{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5" style={{ fontFamily: F }}>{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white shadow-sm w-64">
            <Search size={16} className="text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter the table below"
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              style={{ fontFamily: F }}
            />
          </div>
        </div>
      </div>

      <ProcurementTabBar>
        <ProcurementTabs tabs={REPORT_TABS} active={activeTab} onChange={setActiveTab} />
      </ProcurementTabBar>

      <div className="flex-1 overflow-auto">{renderers[activeTab]()}</div>
    </div>
  );
}

export default ProcurementReportingAnalytics;
