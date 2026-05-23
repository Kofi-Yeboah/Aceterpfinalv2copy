import { Users, DollarSign, TrendingUp, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { DashboardConfigPanel, useDashboardConfig } from "./DashboardConfigPanel";

const PAYROLL_SECTIONS = [
  { id: "kpis", label: "KPI Cards" },
  { id: "payrollTrend", label: "Monthly Payroll Trend" },
  { id: "deptDist", label: "Department Distribution" },
  { id: "recentPayroll", label: "Recent Payroll Runs" },
];

export function PayrollManagementDashboard() {
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(PAYROLL_SECTIONS);

  const monthlyPayrollData = [
    { month: "Jan", amount: 245000, employees: 85 },
    { month: "Feb", amount: 248000, employees: 87 },
    { month: "Mar", amount: 252000, employees: 88 },
    { month: "Apr", amount: 255000, employees: 90 },
    { month: "May", amount: 258000, employees: 92 },
    { month: "Jun", amount: 261000, employees: 94 },
  ];

  const payrollBreakdownData = [
    { name: "Salaries", value: 185000, color: "#0B01D0" },
    { name: "Allowances", value: 45000, color: "#10b981" },
    { name: "Bonuses", value: 21000, color: "#f59e0b" },
    { name: "Other", value: 10000, color: "#6b7280" },
  ];

  const departmentPayrollData = [
    { department: "Engineering", amount: 95000, employees: 32 },
    { department: "Sales", amount: 68000, employees: 25 },
    { department: "Marketing", amount: 42000, employees: 15 },
    { department: "Operations", amount: 38000, employees: 18 },
    { department: "HR", amount: 18000, employees: 4 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-auto">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Payroll Management Dashboard</h1>
          <DashboardConfigPanel sections={PAYROLL_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
        </div>
      </div>

      <div className="flex-1 p-6">
        {isVisible("kpis") && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Employees</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">94</p>
                <p className="text-xs text-green-600 mt-1">↑ 5% from last month</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Payroll (Monthly)</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(261000)}</p>
                <p className="text-xs text-green-600 mt-1">↑ 1.2% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#0B01D0]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Average Salary</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(2777)}</p>
                <p className="text-xs text-orange-600 mt-1">↓ 2% from last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Approvals</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">12</p>
                <p className="text-xs text-slate-600 mt-1">Requires attention</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
        )}

        {isVisible("payrollTrend") && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Payroll Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyPayrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line key="payroll-amount" type="monotone" dataKey="amount" stroke="#0B01D0" strokeWidth={2} name="Payroll Amount" />
                <Line key="payroll-employees" type="monotone" dataKey="employees" stroke="#10b981" strokeWidth={2} name="Employees" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Payroll Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={payrollBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
                >
                  {payrollBreakdownData.map((entry, index) => (
                    <Cell key={`pie-cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {payrollBreakdownData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {isVisible("deptDist") && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Payroll by Department</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentPayrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar key="department-payroll" dataKey="amount" fill="#0B01D0" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {isVisible("recentPayroll") && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Department Summary</h3>
            <div className="space-y-3">
              {departmentPayrollData.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{dept.department}</p>
                    <p className="text-xs text-slate-600">{dept.employees} employees</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(dept.amount)}</p>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}