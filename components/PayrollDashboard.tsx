import {
  DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, FileText, ArrowUpRight,
  ArrowDownRight, Landmark, PiggyBank, Receipt, AlertTriangle, CheckCircle, Clock, BarChart3
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from "recharts";
import { DashboardConfigPanel, useDashboardConfig } from "./DashboardConfigPanel";

// ─── Data ──────────────────────────────────────────

const revenueExpenseMonthly = [
  { month: "Oct", revenue: 620000, expenses: 485000, net: 135000 },
  { month: "Nov", revenue: 680000, expenses: 510000, net: 170000 },
  { month: "Dec", revenue: 590000, expenses: 525000, net: 65000 },
  { month: "Jan", revenue: 720000, expenses: 498000, net: 222000 },
  { month: "Feb", revenue: 695000, expenses: 512000, net: 183000 },
  { month: "Mar", revenue: 710000, expenses: 495000, net: 215000 },
];

const cashFlowTrend = [
  { month: "Oct", inflow: 680000, outflow: 520000, balance: 1450000 },
  { month: "Nov", inflow: 720000, outflow: 545000, balance: 1625000 },
  { month: "Dec", inflow: 610000, outflow: 560000, balance: 1675000 },
  { month: "Jan", inflow: 780000, outflow: 530000, balance: 1925000 },
  { month: "Feb", inflow: 730000, outflow: 548000, balance: 2107000 },
  { month: "Mar", inflow: 750000, outflow: 510000, balance: 2347000 },
];

const budgetUtilization = [
  { dept: "Personnel", allocated: 1550000, spent: 1275000, color: "#0B01D0" },
  { dept: "Operations", allocated: 405000, spent: 340500, color: "#3B82F6" },
  { dept: "IT", allocated: 350000, spent: 310000, color: "#7C3AED" },
  { dept: "Programs", allocated: 450000, spent: 305000, color: "#60A5FA" },
  { dept: "Marketing", allocated: 180000, spent: 165000, color: "#A78BFA" },
  { dept: "Services", allocated: 95000, spent: 62000, color: "#93C5FD" },
];

const expenseByCategory = [
  { name: "Salaries & Benefits", value: 1275000, color: "#0B01D0" },
  { name: "Operating Costs", value: 340500, color: "#3B82F6" },
  { name: "Program Activities", value: 305000, color: "#7C3AED" },
  { name: "IT & Technology", value: 310000, color: "#60A5FA" },
  { name: "Marketing", value: 165000, color: "#A78BFA" },
  { name: "Professional Services", value: 62000, color: "#93C5FD" },
  { name: "Other", value: 45000, color: "#DBEAFE" },
];

const fundingSourceBreakdown = [
  { name: "USAID Grant", value: 1200000, color: "#0B01D0" },
  { name: "EU Co-Financing", value: 850000, color: "#7C3AED" },
  { name: "Own Revenue", value: 420000, color: "#3B82F6" },
  { name: "World Bank", value: 380000, color: "#60A5FA" },
  { name: "Other Grants", value: 150000, color: "#BFDBFE" },
];

const accountsReceivable = [
  { aging: "Current", amount: 185000, color: "#22c55e" },
  { aging: "1-30 days", amount: 92000, color: "#3B82F6" },
  { aging: "31-60 days", amount: 45000, color: "#f59e0b" },
  { aging: "61-90 days", amount: 28000, color: "#f97316" },
  { aging: "90+ days", amount: 15000, color: "#ef4444" },
];

const accountsPayable = [
  { aging: "Current", amount: 125000, color: "#22c55e" },
  { aging: "1-30 days", amount: 68000, color: "#3B82F6" },
  { aging: "31-60 days", amount: 32000, color: "#f59e0b" },
  { aging: "61-90 days", amount: 12000, color: "#f97316" },
  { aging: "90+ days", amount: 8000, color: "#ef4444" },
];

const payrollByDept = [
  { name: "Engineering", value: 165000, color: "#0B01D0" },
  { name: "Programs", value: 128000, color: "#7C3AED" },
  { name: "Finance", value: 85000, color: "#3B82F6" },
  { name: "Operations", value: 72000, color: "#60A5FA" },
  { name: "HR", value: 55000, color: "#93C5FD" },
  { name: "IT", value: 48000, color: "#A78BFA" },
  { name: "Marketing", value: 42000, color: "#BFDBFE" },
];

const glActivityMonthly = [
  { month: "Oct", entries: 245, adjustments: 18 },
  { month: "Nov", entries: 268, adjustments: 22 },
  { month: "Dec", entries: 312, adjustments: 35 },
  { month: "Jan", entries: 258, adjustments: 15 },
  { month: "Feb", entries: 275, adjustments: 20 },
  { month: "Mar", entries: 242, adjustments: 12 },
];

const vouchersByStatus = [
  { name: "Paid", value: 142, color: "#22c55e" },
  { name: "Approved", value: 18, color: "#0B01D0" },
  { name: "Submitted", value: 12, color: "#3B82F6" },
  { name: "Rejected", value: 5, color: "#ef4444" },
  { name: "Draft", value: 8, color: "#94a3b8" },
];

const recentTransactions = [
  { date: "Mar 02, 2026", ref: "GL-2026-0315", description: "USAID Grant Disbursement - Q1", type: "Credit", amount: 320000, account: "USAID Grant Fund" },
  { date: "Mar 01, 2026", ref: "GL-2026-0312", description: "Office rent - March 2026", type: "Debit", amount: 18500, account: "Main Operating Account" },
  { date: "Feb 28, 2026", ref: "GL-2026-0308", description: "Software licenses renewal", type: "Debit", amount: 12500, account: "Main Operating Account" },
  { date: "Feb 27, 2026", ref: "GL-2026-0305", description: "Field visit flights - Kumasi", type: "Debit", amount: 3200, account: "Main Operating Account" },
  { date: "Feb 25, 2026", ref: "GL-2026-0298", description: "Monthly office stationery", type: "Debit", amount: 850, account: "Office Petty Cash" },
  { date: "Feb 24, 2026", ref: "GL-2026-0295", description: "External audit fees - Q4 2025", type: "Debit", amount: 25000, account: "Main Operating Account" },
  { date: "Feb 22, 2026", ref: "GL-2026-0290", description: "Staff capacity building workshop", type: "Debit", amount: 8500, account: "USAID Grant Fund" },
];

const pendingFinanceActions = [
  { type: "Payment Vouchers", pending: 12, urgent: 3 },
  { type: "Expense Claims", pending: 8, urgent: 2 },
  { type: "Budget Amendments", pending: 3, urgent: 1 },
  { type: "GL Reconciliation", pending: 5, urgent: 0 },
  { type: "Donor Reports", pending: 2, urgent: 2 },
];

const financialAlerts = [
  { item: "Budget line near exhaustion (Marketing)", severity: "high" as const },
  { item: "3 accounts overdue for reconciliation", severity: "high" as const },
  { item: "USAID Q1 report due Mar 15", severity: "medium" as const },
  { item: "Petty cash replenishment needed", severity: "medium" as const },
  { item: "EU fund disbursement expected Mar 10", severity: "low" as const },
];

const bankAccounts = [
  { name: "Main Operating Account", code: "1001-001", balance: 785550, currency: "USD", trend: "up" as const },
  { name: "Payroll Account", code: "1001-002", balance: 342000, currency: "USD", trend: "stable" as const },
  { name: "USAID Grant Fund", code: "4001-001", balance: 450000, currency: "USD", trend: "up" as const },
  { name: "EU Co-Financing Fund", code: "4001-002", balance: 280000, currency: "USD", trend: "down" as const },
  { name: "Office Petty Cash", code: "1002-001", balance: 2500, currency: "GHS", trend: "down" as const },
  { name: "Field Office Petty Cash", code: "1002-002", balance: 1800, currency: "GHS", trend: "stable" as const },
];

// ─── Component ─────────────────────────────────────

const FIN_DASHBOARD_SECTIONS = [
  { id: "kpi1", label: "Financial KPIs (Row 1)" },
  { id: "kpi2", label: "Financial KPIs (Row 2)" },
  { id: "revenueExpenses", label: "Revenue vs Expenses" },
  { id: "cashFlow", label: "Cash Flow & Balance Trend" },
  { id: "budgetUtil", label: "Budget Utilization" },
  { id: "expenseBreakdown", label: "Expense Breakdown" },
  { id: "fundingSources", label: "Funding Sources" },
  { id: "arAging", label: "Accounts Receivable Aging" },
  { id: "apAging", label: "Accounts Payable Aging" },
  { id: "payrollDept", label: "Payroll by Department" },
  { id: "bankBalances", label: "Bank & Fund Balances" },
  { id: "glActivity", label: "General Ledger Activity" },
  { id: "voucherStatus", label: "Payment Voucher Status" },
  { id: "pendingActions", label: "Pending Finance Actions" },
  { id: "alerts", label: "Financial Alerts" },
  { id: "recentGL", label: "Recent GL Transactions" },
];

export function PayrollDashboard() {
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(FIN_DASHBOARD_SECTIONS);
  const totalRevenue = 4015000;
  const totalExpenses = 3025000;
  const netIncome = totalRevenue - totalExpenses;
  const cashPosition = 2347000;
  const totalBudget = 3030000;
  const totalSpent = 2457500;
  const budgetPct = Math.round((totalSpent / totalBudget) * 100);
  const arTotal = accountsReceivable.reduce((s, a) => s + a.amount, 0);
  const apTotal = accountsPayable.reduce((s, a) => s + a.amount, 0);
  const totalPayroll = 495000;
  const totalVouchers = 185;
  const burnRate = 504000;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          {label && <p className="text-[11px] text-slate-500 mb-1">{label}</p>}
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-[12px] text-slate-900">
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color || p.fill }} />
              {p.name}: ${(p.value as number).toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const SimpleTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          {label && <p className="text-[11px] text-slate-500 mb-1">{label}</p>}
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-[12px] text-slate-900">
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color || p.fill }} />
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          <p className="text-[12px] text-slate-900 font-medium">{payload[0].name}</p>
          <p className="text-[12px] text-slate-600">${(payload[0].value as number).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Finance Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Fiscal Year 2025/2026</span>
            <span className="text-[11px] text-slate-400">|</span>
            <span className="text-[12px] text-slate-400">Last updated: Mar 02, 2026</span>
            <DashboardConfigPanel sections={FIN_DASHBOARD_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-5 space-y-5">

          {/* ═══ ROW 1: Key Financial KPIs ═══ */}
          {isVisible("kpi1") && (
            <div className="grid grid-cols-5 gap-4">
              <MetricCard icon={<DollarSign className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" label="Total Revenue (YTD)" value={`$${(totalRevenue / 1000000).toFixed(2)}M`} change="+8.2%" up />
              <MetricCard icon={<CreditCard className="w-5 h-5 text-red-500" />} iconBg="bg-red-50" label="Total Expenses (YTD)" value={`$${(totalExpenses / 1000000).toFixed(2)}M`} change="+3.5%" up={false} />
              <MetricCard icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} iconBg="bg-emerald-50" label="Net Income (YTD)" value={`$${(netIncome / 1000).toFixed(0)}K`} change="+18.4%" up />
              <MetricCard icon={<Wallet className="w-5 h-5 text-purple-700" />} iconBg="bg-purple-50" label="Cash Position" value={`$${(cashPosition / 1000000).toFixed(2)}M`} change="+11.4%" up />
              <MetricCard icon={<PiggyBank className="w-5 h-5 text-amber-600" />} iconBg="bg-amber-50" label="Monthly Burn Rate" value={`$${(burnRate / 1000).toFixed(0)}K`} change="-2.1%" up />
            </div>
          )}

          {/* ═══ ROW 2: More KPIs ═══ */}
          {isVisible("kpi2") && (
            <div className="grid grid-cols-5 gap-4">
              <MetricCard icon={<Landmark className="w-5 h-5 text-indigo-600" />} iconBg="bg-indigo-50" label="Budget Utilization" value={`${budgetPct}%`} change={`$${((totalBudget - totalSpent) / 1000).toFixed(0)}K left`} />
              <MetricCard icon={<Receipt className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" label="Accounts Receivable" value={`$${(arTotal / 1000).toFixed(0)}K`} />
              <MetricCard icon={<FileText className="w-5 h-5 text-orange-500" />} iconBg="bg-orange-50" label="Accounts Payable" value={`$${(apTotal / 1000).toFixed(0)}K`} />
              <MetricCard icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" label="Monthly Payroll" value={`$${(totalPayroll / 1000).toFixed(0)}K`} change="+1.0%" up={false} />
              <MetricCard icon={<BarChart3 className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-50" label="Payment Vouchers" value={totalVouchers} change="12 pending" />
            </div>
          )}

          {/* ═══ ROW 3: Revenue vs Expenses + Cash Flow Trend ═══ */}
          {isVisible("revenueExpenses") && (
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Revenue vs Expenses (Monthly)</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={revenueExpenseMonthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#0B01D0" barSize={18} radius={[3, 3, 0, 0]} name="Revenue" />
                    <Bar dataKey="expenses" fill="#93C5FD" barSize={18} radius={[3, 3, 0, 0]} name="Expenses" />
                    <Line type="monotone" dataKey="net" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} name="Net Income" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Cash Flow & Balance Trend</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={cashFlowTrend}>
                    <defs>
                      <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="balance" stroke="#7C3AED" strokeWidth={2} fill="url(#balanceGrad)" name="Cash Balance" />
                    <Bar dataKey="inflow" fill="#22c55e" barSize={8} name="Inflow" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="outflow" fill="#ef4444" barSize={8} name="Outflow" radius={[2, 2, 0, 0]} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ═══ ROW 4: Budget Utilization + Expense Breakdown + Funding Sources ═══ */}
          {isVisible("budgetUtil") && (
            <div className="grid grid-cols-3 gap-5">
              {/* Budget Utilization by Category */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Budget Utilization by Category</h2>
                <div className="space-y-3">
                  {budgetUtilization.map((b) => {
                    const pct = Math.round((b.spent / b.allocated) * 100);
                    return (
                      <div key={b.dept}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-slate-600">{b.dept}</span>
                          <span className="text-[11px] text-slate-900 font-medium">{pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: pct > 90 ? "#ef4444" : pct > 75 ? "#f59e0b" : b.color }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[9px] text-slate-400">${(b.spent / 1000).toFixed(0)}K spent</span>
                          <span className="text-[9px] text-slate-400">${(b.allocated / 1000).toFixed(0)}K budget</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expense Breakdown */}
              {isVisible("expenseBreakdown") && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Expense Breakdown</h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                        {expenseByCategory.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-1.5">
                    {expenseByCategory.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] text-slate-600 truncate">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-900 font-medium shrink-0">${(item.value / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Funding Sources */}
              {isVisible("fundingSources") && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Funding Sources</h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={fundingSourceBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                        {fundingSourceBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-1.5">
                    {fundingSourceBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] text-slate-600 truncate">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-900 font-medium shrink-0">${(item.value / 1000000).toFixed(2)}M</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                    <p className="text-[14px] text-slate-900">${(fundingSourceBreakdown.reduce((s, f) => s + f.value, 0) / 1000000).toFixed(2)}M</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Total Funding</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ ROW 5: AR Aging + AP Aging + Payroll by Dept ═══ */}
          {(isVisible("arAging") || isVisible("apAging") || isVisible("payrollDept")) && (
            <div className="grid grid-cols-3 gap-5">
              {isVisible("arAging") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Accounts Receivable Aging</h2>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={accountsReceivable}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="aging" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]} barSize={28}>
                      {accountsReceivable.map((entry) => <Cell key={entry.aging} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] text-slate-900">${(arTotal / 1000).toFixed(0)}K</p>
                    <p className="text-[9px] text-slate-400 uppercase">Total Outstanding</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] text-amber-600">${((accountsReceivable[3].amount + accountsReceivable[4].amount) / 1000).toFixed(0)}K</p>
                    <p className="text-[9px] text-slate-400 uppercase">Overdue (60+)</p>
                  </div>
                </div>
              </div>
              )}

              {isVisible("apAging") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Accounts Payable Aging</h2>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={accountsPayable}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="aging" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]} barSize={28}>
                      {accountsPayable.map((entry) => <Cell key={entry.aging} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] text-slate-900">${(apTotal / 1000).toFixed(0)}K</p>
                    <p className="text-[9px] text-slate-400 uppercase">Total Payable</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] text-red-500">${((accountsPayable[3].amount + accountsPayable[4].amount) / 1000).toFixed(0)}K</p>
                    <p className="text-[9px] text-slate-400 uppercase">Overdue (60+)</p>
                  </div>
                </div>
              </div>
              )}

              {isVisible("payrollDept") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Payroll by Department</h2>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={payrollByDept} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {payrollByDept.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                  {payrollByDept.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[9px] text-slate-600 truncate">{item.name}: ${(item.value / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          )}

          {/* ═══ ROW 6: Bank Accounts + GL Activity + Voucher Status ═══ */}
          {(isVisible("bankBalances") || isVisible("glActivity") || isVisible("voucherStatus")) && (
            <div className="grid grid-cols-3 gap-5">
              {isVisible("bankBalances") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Bank & Fund Balances</h2>
                <div className="space-y-2">
                  {bankAccounts.map((acc) => (
                    <div key={acc.code} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-900 truncate">{acc.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{acc.code}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[12px] text-slate-900 font-medium font-mono">
                          {acc.currency === "GHS" ? `GHS ${acc.balance.toLocaleString()}` : `$${acc.balance.toLocaleString()}`}
                        </span>
                        {acc.trend === "up" && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                        {acc.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {isVisible("glActivity") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">General Ledger Activity</h2>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={glActivityMonthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<SimpleTooltip />} />
                    <Bar dataKey="entries" fill="#0B01D0" barSize={14} radius={[3, 3, 0, 0]} name="Entries" stackId="a" />
                    <Bar dataKey="adjustments" fill="#A78BFA" barSize={14} radius={[3, 3, 0, 0]} name="Adjustments" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[14px] text-slate-900">1,600</p>
                    <p className="text-[9px] text-slate-400 uppercase">Total Entries</p>
                  </div>
                  <div>
                    <p className="text-[14px] text-slate-900">122</p>
                    <p className="text-[9px] text-slate-400 uppercase">Adjustments</p>
                  </div>
                  <div>
                    <p className="text-[14px] text-emerald-600">Balanced</p>
                    <p className="text-[9px] text-slate-400 uppercase">Status</p>
                  </div>
                </div>
              </div>
              )}

              {isVisible("voucherStatus") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Payment Voucher Status</h2>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={vouchersByStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={2}>
                      {vouchersByStatus.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1.5">
                  {vouchersByStatus.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-[11px] text-slate-600">{s.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-900 font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          )}

          {/* ═══ ROW 7: Pending Actions + Alerts ═══ */}
          {(isVisible("pendingActions") || isVisible("alerts")) && (
            <div className="grid grid-cols-2 gap-5">
              {isVisible("pendingActions") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Pending Finance Actions</h2>
                <div className="space-y-2.5">
                  {pendingFinanceActions.map((a) => (
                    <div key={a.type} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[12px] text-slate-700">{a.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-slate-900 font-medium">{a.pending}</span>
                        {a.urgent > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">{a.urgent} urgent</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                  <p className="text-[20px] text-slate-900">{pendingFinanceActions.reduce((s, a) => s + a.pending, 0)}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Pending Items</p>
                </div>
              </div>
              )}

              {isVisible("alerts") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Financial Alerts & Notifications</h2>
                <div className="space-y-2.5">
                  {financialAlerts.map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-100">
                      <AlertTriangle className={`w-4 h-4 shrink-0 ${
                        a.severity === "high" ? "text-red-500" : a.severity === "medium" ? "text-amber-500" : "text-blue-400"
                      }`} />
                      <span className="text-[12px] text-slate-700 flex-1">{a.item}</span>
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded shrink-0 ${
                        a.severity === "high" ? "bg-red-50 text-red-600" : a.severity === "medium" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-500"
                      }`}>{a.severity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-[11px] text-amber-700">
                    <span className="font-medium">Reminder:</span> USAID Q1 financial report deadline is Mar 15, 2026. Ensure all GL entries are reconciled before submission.
                  </p>
                </div>
              </div>
              )}
            </div>
          )}

          {/* ═══ ROW 8: Recent GL Transactions Table ═══ */}
          {isVisible("recentGL") && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-[13px] text-slate-900">Recent General Ledger Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Date</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Reference</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Description</th>
                      <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Account</th>
                      <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Type</th>
                      <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((t, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3"><span className="text-[12px] text-slate-600">{t.date}</span></td>
                        <td className="px-4 py-3"><span className="text-[12px] text-blue-600 font-mono">{t.ref}</span></td>
                        <td className="px-4 py-3"><span className="text-[12px] text-slate-900">{t.description}</span></td>
                        <td className="px-4 py-3"><span className="text-[12px] text-slate-600">{t.account}</span></td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            t.type === "Credit" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                          }`}>{t.type}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-[12px] font-medium font-mono ${t.type === "Credit" ? "text-emerald-700" : "text-slate-900"}`}>
                            {t.type === "Credit" ? "+" : "-"}${t.amount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Metric Card ───────────────────────────────────
function MetricCard({ icon, iconBg, label, value, change, up }: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  change?: string;
  up?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`p-2 rounded-full ${iconBg}`}>{icon}</div>
        <p className="text-[11px] text-slate-500 leading-tight">{label}</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-[20px] text-slate-900">{value}</p>
        {change && (
          <span className={`flex items-center gap-0.5 text-[11px] font-medium ${
            up === true ? "text-emerald-600" : up === false ? "text-red-500" : "text-slate-500"
          }`}>
            {up === true && <ArrowUpRight className="w-3 h-3" />}
            {up === false && <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default PayrollDashboard;