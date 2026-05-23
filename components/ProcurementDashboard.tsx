import { ShoppingCart, Users, FileText, DollarSign, TrendingUp, Package, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { DashboardConfigPanel, useDashboardConfig } from "./DashboardConfigPanel";

const PROC_SECTIONS = [
  { id: "kpis", label: "KPI Cards" },
  { id: "poTrend", label: "Purchase Orders Trend" },
  { id: "spending", label: "Spending by Category" },
  { id: "supplierPerf", label: "Vendor Performance" },
  { id: "recentPOs", label: "Recent Purchase Orders" },
  { id: "donorSpend", label: "Spend by Donor" },
  { id: "activeCompleted", label: "Active vs Completed" },
  { id: "pipeline", label: "Procurement Pipeline" },
  { id: "bottlenecks", label: "Bottlenecks & Delays" },
];

export function ProcurementDashboard() {
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(PROC_SECTIONS);

  // Mock data for charts
  const purchaseOrderData = [
    { month: "Jan", orders: 45, value: 125000 },
    { month: "Feb", orders: 52, value: 142000 },
    { month: "Mar", orders: 48, value: 135000 },
    { month: "Apr", orders: 61, value: 168000 },
    { month: "May", orders: 55, value: 152000 },
    { month: "Jun", orders: 58, value: 159000 },
  ];

  const supplierData = [
    { name: "Active", value: 45, color: "#10b981" },
    { name: "Pending", value: 12, color: "#f59e0b" },
    { name: "Inactive", value: 8, color: "#6b7280" },
  ];

  const categorySpendData = [
    { category: "IT Equipment", spend: 285000 },
    { category: "Office Supplies", spend: 145000 },
    { category: "Professional Services", spend: 325000 },
    { category: "Facilities", spend: 198000 },
    { category: "Marketing", spend: 112000 },
  ];

  const recentPurchaseOrders = [
    { id: "PO-2024-156", supplier: "Tech Solutions Inc.", amount: 45600, status: "Approved", date: "2024-11-28" },
    { id: "PO-2024-157", supplier: "Office Depot Ltd.", amount: 12300, status: "Pending", date: "2024-11-29" },
    { id: "PO-2024-158", supplier: "Global Services Co.", amount: 78900, status: "Approved", date: "2024-11-30" },
    { id: "PO-2024-159", supplier: "Premier Supplies", amount: 23400, status: "Processing", date: "2024-12-01" },
    { id: "PO-2024-160", supplier: "Elite Partners", amount: 56700, status: "Approved", date: "2024-12-02" },
  ];

  const donorSpendData = [
    { name: "TAP", value: 320000, color: "#0B01D0" },
    { name: "ATTP", value: 245000, color: "#10b981" },
    { name: "Gates Foundation", value: 198000, color: "#f59e0b" },
    { name: "World Bank", value: 175000, color: "#8b5cf6" },
    { name: "Other", value: 127000, color: "#6b7280" },
  ];

  const activeCompletedData = [
    { name: "Active", count: 84, color: "#0B01D0" },
    { name: "Completed", count: 143, color: "#10b981" },
    { name: "Cancelled", count: 9, color: "#ef4444" },
  ];

  const pipelineNext30 = [
    { title: "Server Infrastructure Upgrade", value: 85000, status: "Approved" },
    { title: "Office Furniture Renewal", value: 32000, status: "In Review" },
    { title: "Security System Installation", value: 54000, status: "Pending" },
    { title: "Vehicle Fleet Maintenance", value: 27000, status: "Approved" },
  ];

  const pipelineNext60 = [
    { title: "IT Network Expansion", value: 120000, status: "Planning" },
    { title: "Staff Training Program", value: 45000, status: "Draft" },
    { title: "Warehouse Equipment", value: 67000, status: "Planning" },
  ];

  const pipelineNext90 = [
    { title: "Annual Software Licenses", value: 95000, status: "Draft" },
    { title: "Building Renovation Phase 2", value: 210000, status: "Concept" },
    { title: "Regional Office Setup", value: 150000, status: "Concept" },
  ];

  const bottlenecks = [
    { description: "Medical Supply Procurement", daysOverdue: 18, responsible: "Sarah Johnson", stage: "Vendor Evaluation" },
    { description: "IT Hardware Replacement", daysOverdue: 12, responsible: "Michael Chen", stage: "Budget Approval" },
    { description: "Logistics Vehicle Purchase", daysOverdue: 25, responsible: "David Osei", stage: "Contract Negotiation" },
    { description: "Field Equipment Order", daysOverdue: 8, responsible: "Amina Diallo", stage: "Technical Review" },
    { description: "Office Lease Renewal", daysOverdue: 15, responsible: "James Mwangi", stage: "Legal Review" },
  ];

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
        return "bg-green-50 text-green-600";
      case "Pending":
        return "bg-orange-50 text-orange-600";
      case "Processing":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Procurement Dashboard</h1>
          <DashboardConfigPanel sections={PROC_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Stats Cards */}
        {isVisible("kpis") && (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Vendors</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">65</p>
                <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Purchase Orders</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">127</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-[#0B01D0]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Requisitions</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">23</p>
                <p className="text-xs text-orange-600 mt-1">↓ 3% from last month</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Spend (YTD)</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(1065000)}</p>
                <p className="text-xs text-green-600 mt-1">↑ 15% from last year</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-amber-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Approvals</p>
                <p className="text-2xl font-semibold text-amber-600 mt-1">14</p>
                <p className="text-xs text-amber-600 mt-1">5 urgent, 9 routine</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Planned vs Executed</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">78%</p>
                <p className="text-xs text-green-600 mt-1">↑ 5% from last quarter</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Purchase Orders Trend */}
          {isVisible("poTrend") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Purchase Orders Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart id="proc-dash-line" data={purchaseOrderData}>
                <CartesianGrid key="pd-line-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis key="pd-line-xaxis" dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis key="pd-line-yaxis-left" yAxisId="left" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis key="pd-line-yaxis-right" yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip key="pd-line-tooltip" />
                <Legend key="pd-line-legend" />
                <Line key="pd-line-orders" yAxisId="left" type="monotone" dataKey="orders" stroke="#0B01D0" strokeWidth={2} name="Orders" />
                <Line key="pd-line-value" yAxisId="right" type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Value ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          )}

          {/* Supplier Distribution */}
          {isVisible("supplierPerf") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Vendor Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart id="proc-dash-pie">
                <Pie
                  key="pd-pie-main"
                  data={supplierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {supplierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="pd-pie-tooltip" />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {supplierData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
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
            <ResponsiveContainer width="100%" height={250}>
              <BarChart id="proc-dash-bar" data={categorySpendData}>
                <CartesianGrid key="pd-bar-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis key="pd-bar-xaxis" dataKey="category" tick={{ fontSize: 11 }} stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                <YAxis key="pd-bar-yaxis" tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip key="pd-bar-tooltip" formatter={(value) => formatCurrency(Number(value))} />
                <Bar key="pd-bar-spend" dataKey="spend" fill="#0B01D0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}

          {/* Recent Purchase Orders */}
          {isVisible("recentPOs") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Purchase Orders</h3>
            <div className="space-y-3">
              {recentPurchaseOrders.map((order) => (
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
            <ResponsiveContainer width="100%" height={250}>
              <PieChart id="proc-donor-pie">
                <Pie
                  key="pd-donor-pie"
                  data={donorSpendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {donorSpendData.map((entry, index) => (
                    <Cell key={`donor-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="pd-donor-tooltip" formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {donorSpendData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
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
              <BarChart id="proc-active-bar" data={activeCompletedData} layout="vertical">
                <CartesianGrid key="pd-ac-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis key="pd-ac-xaxis" type="number" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis key="pd-ac-yaxis" dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#64748b" width={80} />
                <Tooltip key="pd-ac-tooltip" />
                <Bar key="pd-ac-bar" dataKey="count" radius={[0, 4, 4, 0]}>
                  {activeCompletedData.map((entry, index) => (
                    <Cell key={`ac-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {activeCompletedData.map((item) => (
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

        {/* Procurement Pipeline */}
        {isVisible("pipeline") && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 mt-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-700" />
            Procurement Pipeline
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Next 30 Days */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Next 30 Days</span>
                <span className="text-xs text-slate-500">{formatCurrency(pipelineNext30.reduce((s, i) => s + i.value, 0))}</span>
              </div>
              <div className="space-y-2">
                {pipelineNext30.map((item) => (
                  <div key={item.title} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-600">{formatCurrency(item.value)}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        item.status === "Approved" ? "bg-green-50 text-green-600" :
                        item.status === "In Review" ? "bg-blue-50 text-blue-600" :
                        "bg-orange-50 text-orange-600"
                      }`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next 60 Days */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Next 60 Days</span>
                <span className="text-xs text-slate-500">{formatCurrency(pipelineNext60.reduce((s, i) => s + i.value, 0))}</span>
              </div>
              <div className="space-y-2">
                {pipelineNext60.map((item) => (
                  <div key={item.title} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-600">{formatCurrency(item.value)}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next 90 Days */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Next 90 Days</span>
                <span className="text-xs text-slate-500">{formatCurrency(pipelineNext90.reduce((s, i) => s + i.value, 0))}</span>
              </div>
              <div className="space-y-2">
                {pipelineNext90.map((item) => (
                  <div key={item.title} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-600">{formatCurrency(item.value)}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">Days Overdue</th>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase">Responsible</th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase">Stage Stuck At</th>
                </tr>
              </thead>
              <tbody>
                {bottlenecks.map((item) => (
                  <tr key={item.description} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                        {item.daysOverdue} days
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{item.responsible}</td>
                    <td className="py-3 text-slate-600">{item.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}