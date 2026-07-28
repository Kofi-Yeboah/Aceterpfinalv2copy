import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Users, FileText, DollarSign, TrendingUp, Package, AlertTriangle, Clock, CheckCircle2, Layers, Briefcase, CalendarClock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { DashboardConfigPanel, useDashboardConfig } from "./DashboardConfigPanel";
import { ProcurementStatCards, ProcurementStatCard } from "./procurement/ProcurementStatCards";
import {
  getPlanStats,
  getPRStats,
  getPlanPipeline,
  getPlanBottlenecks,
  getProcurementPlanItems,
  getGeneratedPOs,
  subscribe as subscribeProcurement,
  type ProcurementPlanItem,
} from "../lib/procurementStore";
import { getSupplierStats, subscribe as subscribeSuppliers } from "../lib/supplierStore";
import { getContractStats, subscribe as subscribeContracts } from "../lib/contractStore";

const PROC_SECTIONS = [
  { id: "kpis", label: "KPI Cards" },
  { id: "poTrend", label: "Purchase Orders Trend" },
  { id: "spending", label: "Spending by Category" },
  { id: "supplierPerf", label: "Supplier Performance" },
  { id: "recentPOs", label: "Recent Purchase Orders" },
  { id: "donorSpend", label: "Spend by Donor" },
  { id: "activeCompleted", label: "Active vs Completed" },
  { id: "procType", label: "Totals by Procurement Type" },
  { id: "contracts", label: "Contract Portfolio" },
  { id: "pipeline", label: "Procurement Pipeline" },
  { id: "bottlenecks", label: "Bottlenecks & Delays" },
];

const DONOR_COLORS = ["#0B01D0", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#0ea5e9", "#6b7280"];

const PROCUREMENT_TYPES: { type: ProcurementPlanItem["category"]; color: string; icon: typeof Package }[] = [
  { type: "Goods", color: "#0B01D0", icon: Package },
  { type: "Services", color: "#8b5cf6", icon: Layers },
  { type: "Works", color: "#f59e0b", icon: Briefcase },
  { type: "Consultancy", color: "#10b981", icon: Users },
];

const EXECUTED_STATUSES: ProcurementPlanItem["status"][] = ["Awarded", "Contracted", "Completed"];

export function ProcurementDashboard() {
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(PROC_SECTIONS);

  // A single revision counter drives a recompute whenever any source store fires.
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const bump = () => setRevision((r) => r + 1);
    const unsubs = [subscribeProcurement(bump), subscribeSuppliers(bump), subscribeContracts(bump)];
    return () => unsubs.forEach((u) => u());
  }, []);

  const data = useMemo(() => {
    const planStats = getPlanStats();
    const prStats = getPRStats();
    const supplierStats = getSupplierStats();
    const contractStats = getContractStats();
    const planItems = getProcurementPlanItems();
    const pos = getGeneratedPOs();

    const approvedItems = planItems.filter((i) => i.approvalStatus === "Approved");
    const executedItems = approvedItems.filter((i) => EXECUTED_STATUSES.includes(i.status));
    const executedValue = executedItems.reduce((s, i) => s + i.estimatedValue, 0);
    const executionRate = planStats.totalValue > 0 ? Math.round((executedValue / planStats.totalValue) * 100) : 0;

    // ── Purchase order trend, grouped by the month the order was raised ──────
    const byMonth = new Map<string, { orders: number; value: number }>();
    pos.forEach((po) => {
      const key = (po.orderDate || "").slice(0, 7);
      if (!key) return;
      const cell = byMonth.get(key) ?? { orders: 0, value: 0 };
      byMonth.set(key, { orders: cell.orders + 1, value: cell.value + po.amount });
    });
    const purchaseOrderData = Array.from(byMonth, ([month, v]) => ({ key: month, ...v }))
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-12)
      .map((row) => ({
        month: new Date(`${row.key}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        orders: row.orders,
        value: row.value,
      }));

    // ── Supplier status distribution ──────────────────────────────────────────
    const otherSuppliers = Math.max(
      supplierStats.total - supplierStats.active - supplierStats.pending - supplierStats.flagged,
      0
    );
    const supplierData = [
      { name: "Active", value: supplierStats.active, color: "#10b981" },
      { name: "Pending", value: supplierStats.pending, color: "#f59e0b" },
      { name: "Flagged", value: supplierStats.flagged, color: "#ef4444" },
      { name: "Other", value: otherSuppliers, color: "#6b7280" },
    ].filter((d) => d.value > 0);

    // ── Spend by category and donor, from approved plan items ───────────────
    const categorySpendData = [...planStats.byCategory]
      .sort((a, b) => b.value - a.value)
      .map((c) => ({ category: c.category, spend: c.value, count: c.count }));

    const donorSpendData = [...planStats.byDonor]
      .sort((a, b) => b.value - a.value)
      .map((d, index) => ({ name: d.donor, value: d.value, count: d.count, color: DONOR_COLORS[index % DONOR_COLORS.length] }));

    // ── Totals by procurement type ──────────────────────────────────────────
    const typeTotals = PROCUREMENT_TYPES.map(({ type, color, icon }) => {
      const items = approvedItems.filter((i) => i.category === type);
      const value = items.reduce((s, i) => s + i.estimatedValue, 0);
      const executed = items.filter((i) => EXECUTED_STATUSES.includes(i.status)).reduce((s, i) => s + i.estimatedValue, 0);
      return {
        type,
        color,
        icon,
        count: items.length,
        value,
        executed,
        share: planStats.totalValue > 0 ? Math.round((value / planStats.totalValue) * 100) : 0,
      };
    });

    // ── Active vs completed ─────────────────────────────────────────────────
    const activeCompletedData = [
      { name: "Active", count: planStats.active, color: "#0B01D0" },
      { name: "Completed", count: planStats.completed, color: "#10b981" },
      { name: "Delayed", count: planStats.delayed, color: "#ef4444" },
    ];

    // ── Pipeline, split into mutually exclusive 30 / 60 / 90-day buckets ────
    const p30 = getPlanPipeline(30);
    const p60All = getPlanPipeline(60);
    const p90All = getPlanPipeline(90);
    const ids30 = new Set(p30.map((i) => i.id));
    const ids60 = new Set(p60All.map((i) => i.id));
    const pipelineNext30 = p30;
    const pipelineNext60 = p60All.filter((i) => !ids30.has(i.id));
    const pipelineNext90 = p90All.filter((i) => !ids60.has(i.id));

    // ── Recent purchase orders ──────────────────────────────────────────────
    const recentPurchaseOrders = [...pos]
      .sort((a, b) => (b.orderDate || "").localeCompare(a.orderDate || ""))
      .slice(0, 5)
      .map((po) => ({
        id: po.poNumber,
        supplier: po.supplier,
        amount: po.amount,
        status: po.status ?? "Signed",
        date: po.orderDate,
      }));

    return {
      planStats,
      prStats,
      supplierStats,
      contractStats,
      executedValue,
      executionRate,
      purchaseOrderData,
      supplierData,
      categorySpendData,
      donorSpendData,
      typeTotals,
      activeCompletedData,
      pipelineNext30,
      pipelineNext60,
      pipelineNext90,
      recentPurchaseOrders,
      bottlenecks: getPlanBottlenecks(),
      totalPOs: pos.length,
      totalPOValue: pos.reduce((s, po) => s + po.amount, 0),
    };
    // `revision` is the store-change signal; the stores themselves are modules.
  }, [revision]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Signed":
        return "bg-green-50 text-green-600";
      case "Pending":
      case "Pending Signature":
        return "bg-orange-50 text-orange-600";
      case "Processing":
      case "Dispatched":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const pendingApprovals =
    data.planStats.pendingApproval + data.planStats.pendingAmendments + data.prStats.awaitingAction;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Procurement Dashboard</h1>
          <DashboardConfigPanel sections={PROC_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
        </div>
      </div>

      {/* Stats Cards */}
      {isVisible("kpis") && (
        <ProcurementStatCards
          stats={[
            {
              label: "Total Suppliers",
              value: data.supplierStats.total,
              icon: <Users size={14} />,
              tone: "accent",
              sub: `${data.supplierStats.active} active, ${data.supplierStats.pending} pending`,
            },
            {
              label: "Purchase Orders",
              value: data.totalPOs,
              icon: <ShoppingCart size={14} />,
              tone: "info",
              sub: `${formatCurrency(data.totalPOValue)} ordered`,
            },
            {
              label: "Pending Requisitions",
              value: data.prStats.awaitingAction,
              icon: <FileText size={14} />,
              tone: "warning",
              sub: `of ${data.prStats.total} raised`,
            },
            {
              label: "Approved Plan Value",
              value: formatCurrency(data.planStats.totalValue),
              icon: <DollarSign size={14} />,
              tone: "success",
              sub: `${data.planStats.approved} of ${data.planStats.total} items approved`,
            },
            {
              label: "Pending Approvals",
              value: pendingApprovals,
              icon: <Clock size={14} />,
              tone: "warning",
              sub: `${data.planStats.pendingApproval} plan, ${data.planStats.pendingAmendments} amendment, ${data.prStats.awaitingAction} requisition`,
            },
            {
              label: "Planned vs Executed",
              value: `${data.executionRate}%`,
              icon: <TrendingUp size={14} />,
              tone: "success",
              sub: `${formatCurrency(data.executedValue)} of ${formatCurrency(data.planStats.totalValue)}`,
            },
          ]}
        />
      )}

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Purchase Orders Trend */}
          {isVisible("poTrend") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Purchase Orders Trend</h3>
            {data.purchaseOrderData.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-slate-400">
                No purchase orders have been raised yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart id="proc-dash-line" data={data.purchaseOrderData}>
                  <CartesianGrid key="pd-line-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis key="pd-line-xaxis" dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
                  <YAxis key="pd-line-yaxis-left" yAxisId="left" tick={{ fontSize: 12 }} stroke="#64748b" allowDecimals={false} />
                  <YAxis key="pd-line-yaxis-right" yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip key="pd-line-tooltip" />
                  <Legend key="pd-line-legend" />
                  <Line key="pd-line-orders" yAxisId="left" type="monotone" dataKey="orders" stroke="#0B01D0" strokeWidth={2} name="Orders" />
                  <Line key="pd-line-value" yAxisId="right" type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Value ($)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          )}

          {/* Supplier Distribution */}
          {isVisible("supplierPerf") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Supplier Status Distribution</h3>
              <span className="text-xs text-slate-500">Avg performance {data.supplierStats.avgPerformance}/5</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart id="proc-dash-pie">
                <Pie
                  key="pd-pie-main"
                  data={data.supplierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.supplierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="pd-pie-tooltip" />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {data.supplierData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
              {data.supplierStats.expiring > 0 && (
                <div className="col-span-2 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {data.supplierStats.expiring} supplier{data.supplierStats.expiring === 1 ? " has" : "s have"} expiring or expired documents
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        {/* Category Spend & Recent Orders */}
        <div className="grid grid-cols-2 gap-6">
          {/* Category Spend */}
          {isVisible("spending") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Spend by Category</h3>
            {data.categorySpendData.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-slate-400">
                No approved plan items to report on yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart id="proc-dash-bar" data={data.categorySpendData}>
                  <CartesianGrid key="pd-bar-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis key="pd-bar-xaxis" dataKey="category" tick={{ fontSize: 11 }} stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                  <YAxis key="pd-bar-yaxis" tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip key="pd-bar-tooltip" formatter={(value) => formatCurrency(Number(value))} />
                  <Bar key="pd-bar-spend" dataKey="spend" fill="#0B01D0" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          )}

          {/* Recent Purchase Orders */}
          {isVisible("recentPOs") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Purchase Orders</h3>
            <div className="space-y-3">
              {data.recentPurchaseOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{order.id}</p>
                    <p className="text-xs text-slate-600">{order.supplier}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(order.amount)}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {data.recentPurchaseOrders.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No purchase orders have been generated yet.</p>
              )}
            </div>
          </div>
          )}
        </div>

        {/* Donor Spend & Active vs Completed Row */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Spend by Donor */}
          {isVisible("donorSpend") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Procurement Spend by Donor</h3>
            {data.donorSpendData.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-slate-400">
                No approved plan items to report on yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart id="proc-donor-pie">
                  <Pie
                    key="pd-donor-pie"
                    data={data.donorSpendData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.donorSpendData.map((entry, index) => (
                      <Cell key={`donor-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip key="pd-donor-tooltip" formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {data.donorSpendData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600">{item.name}: {formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Active vs Completed */}
          {isVisible("activeCompleted") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Active vs Completed Procurements</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart id="proc-active-bar" data={data.activeCompletedData} layout="vertical">
                <CartesianGrid key="pd-ac-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis key="pd-ac-xaxis" type="number" tick={{ fontSize: 12 }} stroke="#64748b" allowDecimals={false} />
                <YAxis key="pd-ac-yaxis" dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#64748b" width={80} />
                <Tooltip key="pd-ac-tooltip" />
                <Bar key="pd-ac-bar" dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.activeCompletedData.map((entry, index) => (
                    <Cell key={`ac-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {data.activeCompletedData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  <span className="text-sm font-semibold text-slate-900 ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Totals by Procurement Type & Contract Portfolio */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {isVisible("procType") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              Totals by Procurement Type
            </h3>
            <div className="space-y-3">
              {data.typeTotals.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.type} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md" style={{ backgroundColor: `${t.color}1A` }}>
                          <Icon className="w-4 h-4" style={{ color: t.color }} />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{t.type}</span>
                        <span className="text-xs text-slate-500">{t.count} item{t.count === 1 ? "" : "s"}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{formatCurrency(t.value)}</p>
                        <p className="text-xs text-slate-500">{t.share}% of plan · {formatCurrency(t.executed)} executed</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${t.share}%`, backgroundColor: t.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {isVisible("contracts") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-700" />
              Contract Portfolio
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Contracts", value: String(data.contractStats.total), icon: <FileText size={14} />, tone: "neutral" as const },
                { label: "Active", value: String(data.contractStats.active), icon: <CheckCircle2 size={14} />, tone: "success" as const },
                { label: "Contracted Value", value: formatCurrency(data.contractStats.totalValue), icon: <DollarSign size={14} />, tone: "info" as const },
                { label: "Paid to Date", value: formatCurrency(data.contractStats.totalPaid), icon: <DollarSign size={14} />, tone: "success" as const },
                { label: "Pending Deliverables", value: String(data.contractStats.pendingDeliverables), icon: <Clock size={14} />, tone: "warning" as const },
                { label: "Unpaid Invoices", value: String(data.contractStats.unpaidInvoices), icon: <Clock size={14} />, tone: "warning" as const },
                { label: "Pending Variations", value: String(data.contractStats.pendingVariations), icon: <AlertTriangle size={14} />, tone: "danger" as const },
                { label: "Expiring in 60 Days", value: String(data.contractStats.expiringSoon), icon: <CalendarClock size={14} />, tone: "danger" as const },
              ].map((stat) => (
                <ProcurementStatCard key={stat.label} {...stat} />
              ))}
            </div>
            {data.contractStats.overdueDeliverables > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {data.contractStats.overdueDeliverables} deliverable{data.contractStats.overdueDeliverables === 1 ? " is" : "s are"} past their due date
              </div>
            )}
          </div>
          )}
        </div>

        {/* Procurement Pipeline */}
        {isVisible("pipeline") && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 mt-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-700" />
            Procurement Pipeline
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {([
              { label: "Next 30 Days", chip: "bg-green-100 text-green-700", items: data.pipelineNext30 },
              { label: "Next 60 Days", chip: "bg-blue-100 text-blue-700", items: data.pipelineNext60 },
              { label: "Next 90 Days", chip: "bg-purple-100 text-purple-700", items: data.pipelineNext90 },
            ] as const).map((bucket) => (
              <div key={bucket.label}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bucket.chip}`}>
                    {bucket.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatCurrency(bucket.items.reduce((s, i) => s + i.estimatedValue, 0))}
                  </span>
                </div>
                <div className="space-y-2">
                  {bucket.items.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{item.activityDescription}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.ppItemId} · starts {item.initiationDate}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-600">{formatCurrency(item.estimatedValue)}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          item.status === "Delayed" ? "bg-red-50 text-red-600" :
                          item.status === "Not Started" ? "bg-orange-50 text-orange-600" :
                          "bg-blue-50 text-blue-600"
                        }`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                  {bucket.items.length === 0 && (
                    <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      Nothing scheduled to start in this window.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Bottlenecks & Delays */}
        {isVisible("bottlenecks") && (
        <div className="bg-white rounded-lg border border-red-200 p-5 mt-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Bottlenecks &amp; Delays
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">Item</th>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">Days Stuck</th>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">Responsible</th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">Stage Stuck At</th>
                </tr>
              </thead>
              <tbody>
                {data.bottlenecks.map((row) => (
                  <tr key={row.item.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {row.item.activityDescription}
                      <span className="block text-xs font-normal text-slate-500">{row.item.ppItemId}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.daysStuck > 14 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {row.daysStuck} days
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{row.responsible}</td>
                    <td className="py-3 text-slate-600">{row.stage}</td>
                  </tr>
                ))}
                {data.bottlenecks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-slate-400">
                      Nothing is currently stuck — every plan item is approved and on schedule.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
