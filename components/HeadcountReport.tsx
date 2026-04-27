import { useState } from "react";
import { Search, Download, ChevronDown, Users, TrendingUp, TrendingDown, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

const departmentData = [
  { department: "Project Management", count: 45, change: 5 },
  { department: "Financial Management", count: 38, change: 2 },
  { department: "HR Management", count: 22, change: -3 },
  { department: "Monitoring & Evaluation", count: 31, change: 4 },
  { department: "Procurement", count: 28, change: 1 },
  { department: "IT & Systems", count: 19, change: 3 },
];

const employmentTypeData = [
  { name: "Permanent", value: 125, color: "#0B01D0" },
  { name: "Fixed-Term", value: 38, color: "#7C3AED" },
  { name: "Contract", value: 15, color: "#10B981" },
  { name: "Internship", value: 5, color: "#F59E0B" },
];

const monthlyTrendData = [
  { month: "Jan", headcount: 165 },
  { month: "Feb", headcount: 168 },
  { month: "Mar", headcount: 172 },
  { month: "Apr", headcount: 175 },
  { month: "May", headcount: 178 },
  { month: "Jun", headcount: 183 },
];

const locationData = [
  { location: "Accra HQ", count: 98, percentage: 53.6 },
  { location: "Kumasi Office", count: 45, percentage: 24.6 },
  { location: "Tamale Office", count: 28, percentage: 15.3 },
  { location: "Remote", count: 12, percentage: 6.6 },
];

const genderData = [
  { gender: "Male", count: 95, percentage: 51.9 },
  { gender: "Female", count: 88, percentage: 48.1 },
];

const departments = ["All Departments", "Project Management", "Financial Management", "HR Management", "Monitoring & Evaluation", "Procurement", "IT & Systems"];
const quarters = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "2024", "2023"];

export function HeadcountReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4 2025");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);

  const totalHeadcount = 183;
  const monthlyChange = 5;
  const yearlyChange = 18;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Headcount Report</h1>
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
                  setShowQuarterDropdown(false);
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

            {/* Quarter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowQuarterDropdown(!showQuarterDropdown);
                  setShowDepartmentDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedQuarter}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showQuarterDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowQuarterDropdown(false)} />
                  <div className="absolute top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {quarters.map((quarter) => (
                      <button
                        key={quarter}
                        onClick={() => {
                          setSelectedQuarter(quarter);
                          setShowQuarterDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {quarter}
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
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">Total Headcount</p>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{totalHeadcount}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-sm text-green-600">+{monthlyChange} this month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">Permanent Staff</p>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">125</p>
              <p className="text-sm text-slate-500 mt-2">68.3% of total</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">Contract Staff</p>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">58</p>
              <p className="text-sm text-slate-500 mt-2">31.7% of total</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">YoY Growth</p>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <TrendingUp size={20} className="text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">+{yearlyChange}</p>
              <p className="text-sm text-slate-500 mt-2">10.9% increase</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            {/* Headcount by Department */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Headcount by Department</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="department" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0B01D0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Employment Type Distribution */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Employment Type Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={employmentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {employmentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {employmentTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Headcount Trend */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">6-Month Headcount Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="headcount" stroke="#0B01D0" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Headcount by Location */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Headcount by Location</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-800">
                    <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Location</th>
                    <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Count</th>
                    <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.map((location, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-[12px] font-medium text-black">{location.location}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-[12px] text-slate-500">{location.count}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-[12px] text-slate-500">{location.percentage}%</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Gender Distribution</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-800">
                    <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Gender</th>
                    <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Count</th>
                    <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {genderData.map((gender, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-[12px] font-medium text-black">{gender.gender}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-[12px] text-slate-500">{gender.count}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-[12px] text-slate-500">{gender.percentage}%</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Details Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Department Headcount Details</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-blue-800">
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Department</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Current Count</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Last Month</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Change</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((dept, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="text-[12px] font-medium text-black">{dept.department}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[12px] text-slate-500">{dept.count}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[12px] text-slate-500">{dept.count - dept.change}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {dept.change > 0 ? (
                          <>
                            <TrendingUp size={12} className="text-green-600" />
                            <span className="text-[12px] text-green-600">+{dept.change}</span>
                          </>
                        ) : dept.change < 0 ? (
                          <>
                            <TrendingDown size={12} className="text-red-600" />
                            <span className="text-[12px] text-red-600">{dept.change}</span>
                          </>
                        ) : (
                          <span className="text-[12px] text-slate-500">0</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[12px] text-slate-500">{((dept.count / totalHeadcount) * 100).toFixed(1)}%</p>
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
