import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";

const TIME_PERIODS = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year", "All Time"];
const DEPARTMENTS = ["All Departments", "Engineering", "Sales", "Marketing", "Operations", "HR", "Finance"];

export function PayrollManagementPayrollReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const monthlyTrend = [
    { month: "Jan", gross: 245000, deductions: 35000, net: 210000 },
    { month: "Feb", gross: 248000, deductions: 36000, net: 212000 },
    { month: "Mar", gross: 252000, deductions: 37000, net: 215000 },
    { month: "Apr", gross: 255000, deductions: 38000, net: 217000 },
    { month: "May", gross: 258000, deductions: 38500, net: 219500 },
    { month: "Jun", gross: 261000, deductions: 39000, net: 222000 },
  ];

  const departmentBreakdown = [
    { department: "Engineering", gross: 95000, employees: 32 },
    { department: "Sales", gross: 68000, employees: 25 },
    { department: "Marketing", gross: 42000, employees: 15 },
    { department: "Operations", gross: 38000, employees: 18 },
    { department: "HR", gross: 18000, employees: 4 },
  ];

  const expenseBreakdown = [
    { name: "Basic Salaries", value: 185000, color: "#0B01D0" },
    { name: "Allowances", value: 45000, color: "#10b981" },
    { name: "Bonuses", value: 21000, color: "#f59e0b" },
    { name: "Deductions", value: 39000, color: "#ef4444" },
  ];

  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Payroll Report</h1>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => { setShowPeriodDropdown(!showPeriodDropdown); setShowDepartmentDropdown(false); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">{selectedPeriod}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            {showPeriodDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {TIME_PERIODS.map((period) => (
                    <button key={period} onClick={() => { setSelectedPeriod(period); setShowPeriodDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{period}</button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowDepartmentDropdown(!showDepartmentDropdown); setShowPeriodDropdown(false); }} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">{selectedDepartment}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            {showDepartmentDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDepartmentDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {DEPARTMENTS.map((dept) => (
                    <button key={dept} onClick={() => { setSelectedDepartment(dept); setShowDepartmentDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{dept}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <p className="text-sm text-slate-600">Total Gross Payroll</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(261000)}</p>
            <p className="text-xs text-green-600 mt-1">↑ 1.2% from last month</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <p className="text-sm text-slate-600">Total Deductions</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(39000)}</p>
            <p className="text-xs text-orange-600 mt-1">↑ 1.3% from last month</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <p className="text-sm text-slate-600">Net Payroll</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(222000)}</p>
            <p className="text-xs text-green-600 mt-1">↑ 1.1% from last month</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <p className="text-sm text-slate-600">Average Salary</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(2777)}</p>
            <p className="text-xs text-slate-600 mt-1">Per employee</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Payroll Trend (6 Months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="gross" stroke="#0B01D0" strokeWidth={2} name="Gross" />
                <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2} name="Net" />
                <Line type="monotone" dataKey="deductions" stroke="#ef4444" strokeWidth={2} name="Deductions" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" dataKey="value">
                  {expenseBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {expenseBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Department Payroll Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="gross" fill="#0B01D0" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Department Summary</h3>
            <div className="space-y-3">
              {departmentBreakdown.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{dept.department}</p>
                    <p className="text-xs text-slate-600">{dept.employees} employees • {formatCurrency(dept.gross / dept.employees)} avg</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(dept.gross)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
