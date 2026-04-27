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

type TabKey = "planning" | "sourcing" | "vendors";

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
    Pending: { bg: "#fef3c7", text: "#92400e" },
    "Pending Review": { bg: "#fef3c7", text: "#92400e" },
    "Under Review": { bg: "#fef3c7", text: "#92400e" },
    Rejected: { bg: "#fee2e2", text: "#991b1b" },
    Expired: { bg: "#fee2e2", text: "#991b1b" },
    Expiring: { bg: "#fff7ed", text: "#9a3412" },
    Draft: { bg: "#f1f5f9", text: "#475569" },
    Suspended: { bg: "#f1f5f9", text: "#475569" },
    Renew: { bg: "#eff6ff", text: "#1e40af" },
    Review: { bg: "#fef3c7", text: "#92400e" },
    "Urgent Renewal": { bg: "#fee2e2", text: "#991b1b" },
    Awarded: { bg: "#dcfce7", text: "#166534" },
    "In Review": { bg: "#fef3c7", text: "#92400e" },
    Sent: { bg: "#eff6ff", text: "#1e40af" },
    Closed: { bg: "#f1f5f9", text: "#475569" },
    Cancelled: { bg: "#fee2e2", text: "#991b1b" },
  };
  const s = map[status] || { bg: "#f1f5f9", text: "#475569" };
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: s.bg, color: s.text, fontFamily: F, fontWeight: 600 }}>
      {status}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function ProcurementReportingAnalytics({ initialTab }: { initialTab?: TabKey }) {
  const activeTab = initialTab || "planning";
  const [selectedPeriod, setSelectedPeriod] = useState("Last 3 Months");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reqFilter, setReqFilter] = useState<"All" | "Approved" | "Pending" | "Rejected" | "Draft">("All");

  const screenTitle: Record<TabKey, { title: string; subtitle: string }> = {
    planning: { title: "Planning & Orders Report", subtitle: "Requisition pipeline, budget utilization, and purchase order trends" },
    sourcing: { title: "Sourcing & Contracts Report", subtitle: "RFQ status, bid submissions, invoices, contracts, and renewal alerts" },
    vendors: { title: "Vendors & KPIs Report", subtitle: "Vendor performance, donor procurement, cycle times, and payment timeliness" },
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

          {/* Purchase Order Trends (merged from PurchaseOrderReports) */}
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
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total RFQs" value={String(totalRFQs)} sub="this period" trend="15%" trendDir="up" icon={<FileText size={18} />} color="#6366f1" />
          <StatCard label="Avg Bid Rate" value={fmtPct(avgBidRate)} trend="5%" trendDir="up" icon={<TrendingUp size={18} />} color="#10b981" />
          <StatCard label="Total Invoiced" value={fmt(totalInvoiced)} sub="this period" icon={<DollarSign size={18} />} color="#8b5cf6" />
          <StatCard label="Expiring (90 days)" value={String(expiryAlerts.length)} sub="contracts" icon={<AlertTriangle size={18} />} color="#f59e0b" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* RFQ Status Distribution (merged from RFQReports) */}
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

        {/* Vendor Performance Table (merged vendor master + responsiveness) */}
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

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "planning" && renderPlanning()}
        {activeTab === "sourcing" && renderSourcing()}
        {activeTab === "vendors" && renderVendors()}
      </div>
    </div>
  );
}