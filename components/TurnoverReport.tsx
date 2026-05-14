import { useState } from "react";
import { Search, Download, ChevronDown, UserMinus, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";

const monthlyTurnoverData = [
  { month: "Jan", voluntary: 2, involuntary: 1, total: 3 },
  { month: "Feb", voluntary: 3, involuntary: 0, total: 3 },
  { month: "Mar", voluntary: 4, involuntary: 2, total: 6 },
  { month: "Apr", voluntary: 2, involuntary: 1, total: 3 },
  { month: "May", voluntary: 5, involuntary: 1, total: 6 },
  { month: "Jun", voluntary: 3, involuntary: 2, total: 5 },
];

const departmentTurnoverData = [
  { department: "Project Management", turnoverCount: 8, turnoverRate: 17.8, avgRate: 15.2 },
  { department: "Financial Management", turnoverCount: 5, turnoverRate: 13.2, avgRate: 15.2 },
  { department: "HR Management", turnoverCount: 3, turnoverRate: 13.6, avgRate: 15.2 },
  { department: "Monitoring & Evaluation", turnoverCount: 4, turnoverRate: 12.9, avgRate: 15.2 },
  { department: "Procurement", turnoverCount: 4, turnoverRate: 14.3, avgRate: 15.2 },
  { department: "IT & Systems", turnoverCount: 2, turnoverRate: 10.5, avgRate: 15.2 },
];

const reasonsData = [
  { name: "Better Opportunity", value: 12, color: "#0B01D0" },
  { name: "Career Growth", value: 8, color: "#7C3AED" },
  { name: "Relocation", value: 3, color: "#10B981" },
  { name: "Personal Reasons", value: 3, color: "#F59E0B" },
  { name: "Performance Issues", value: 2, color: "#EF4444" },
  { name: "Other", value: 2, color: "#6B7280" },
];

const recentExits = [
  { id: 1, name: "Kwame Asante", position: "Project Manager", department: "Project Management", exitDate: "Nov 28, 2025", reason: "Better Opportunity", tenure: "3.5 years" },
  { id: 2, name: "Abena Owusu", position: "Finance Intern", department: "Financial Management", exitDate: "Nov 30, 2025", reason: "Contract End", tenure: "3 months" },
  { id: 3, name: "John Mensah", position: "HR Coordinator", department: "HR Management", exitDate: "Nov 15, 2025", reason: "Career Growth", tenure: "2.2 years" },
  { id: 4, name: "Sarah Osei", position: "M&E Officer", department: "Monitoring & Evaluation", exitDate: "Nov 10, 2025", reason: "Relocation", tenure: "4.1 years" },
  { id: 5, name: "David Appiah", position: "Procurement Officer", department: "Procurement", exitDate: "Nov 5, 2025", reason: "Personal Reasons", tenure: "1.8 years" },
];

const departments = ["All Departments", "Project Management", "Financial Management", "HR Management", "Monitoring & Evaluation", "Procurement", "IT & Systems"];
const years = ["2025", "2024", "2023", "2022"];

export function TurnoverReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const totalExits = 26;
  const turnoverRate = 14.2;
  const voluntaryExits = 21;
  const involuntaryExits = 5;
  const avgTenure = 2.8;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Turnover Report</h1>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export Report</span>
              <Download size={16} className="text-purple-700" />
            </button>

            {/* Department Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowDepartmentDropdown(!showDepartmentDropdown);
                  setShowYearDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedDepartment}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showDepartmentDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDepartmentDropdown(false)} />
                  <div className="absolute top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setShowDepartmentDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowDepartmentDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedYear}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showYearDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowYearDropdown(false)} />
                  <div className="absolute top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setShowYearDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">Total Exits</p>
                <div className="p-2 bg-red-50 rounded-lg">
                  <UserMinus size={20} className="text-red-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{totalExits}</p>
              <p className="text-sm text-slate-500 mt-2">YTD 2025</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">Turnover Rate</p>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <TrendingUp size={20} className="text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{turnoverRate}%</p>
              <p className="text-sm text-slate-500 mt-2">Annual rate</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">Voluntary Exits</p>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UserMinus size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{voluntaryExits}</p>
              <p className="text-sm text-slate-500 mt-2">80.8% of exits</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">Involuntary Exits</p>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <UserMinus size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{involuntaryExits}</p>
              <p className="text-sm text-slate-500 mt-2">19.2% of exits</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">Avg Tenure</p>
                <div className="p-2 bg-green-50 rounded-lg">
                  <AlertCircle size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{avgTenure}</p>
              <p className="text-sm text-slate-500 mt-2">years</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Monthly Turnover Trend */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Monthly Turnover Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTurnoverData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="voluntary" stroke="#0B01D0" strokeWidth={2} dot={{ r: 4 }} name="Voluntary" />
                  <Line type="monotone" dataKey="involuntary" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} name="Involuntary" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Turnover Reasons */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Reasons for Leaving</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reasonsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reasonsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {reasonsData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Turnover Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Turnover Rate by Department</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentTurnoverData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: 'Turnover Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="turnoverRate" fill="#0B01D0" radius={[4, 4, 0, 0]} name="Turnover Rate" />
                <Bar dataKey="avgRate" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Company Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Turnover Details Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Department Turnover Analysis</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Department</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Total Exits</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Turnover Rate</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">vs Company Avg</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentTurnoverData.map((dept, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="text-[12px] font-medium text-black">{dept.department}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[12px] text-slate-500">{dept.turnoverCount}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[12px] text-slate-500">{dept.turnoverRate}%</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {dept.turnoverRate > dept.avgRate ? (
                          <>
                            <TrendingUp size={12} className="text-red-600" />
                            <span className="text-[12px] text-red-600">+{(dept.turnoverRate - dept.avgRate).toFixed(1)}%</span>
                          </>
                        ) : dept.turnoverRate < dept.avgRate ? (
                          <>
                            <TrendingDown size={12} className="text-green-600" />
                            <span className="text-[12px] text-green-600">{(dept.turnoverRate - dept.avgRate).toFixed(1)}%</span>
                          </>
                        ) : (
                          <span className="text-[12px] text-slate-500">0%</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                        dept.turnoverRate > dept.avgRate 
                          ? "bg-red-50 text-red-600" 
                          : dept.turnoverRate < dept.avgRate
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {dept.turnoverRate > dept.avgRate ? "Above Average" : dept.turnoverRate < dept.avgRate ? "Below Average" : "Average"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Exits Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Recent Employee Exits</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Employee Name</th>
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Position</th>
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Department</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Exit Date</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Tenure</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody>
                {recentExits.map((exit) => (
                  <tr key={exit.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="text-[12px] font-medium text-black">{exit.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] text-slate-500">{exit.position}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] text-slate-500">{exit.department}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[12px] text-slate-500">{exit.exitDate}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[12px] text-slate-500">{exit.tenure}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-xl text-[12px] bg-blue-50 text-blue-600">
                        {exit.reason}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
