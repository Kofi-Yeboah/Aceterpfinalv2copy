import { useState } from "react";
import { Search, Download, ChevronDown, MoreHorizontal, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const budgetComparisonData = [
  { project: "Community Health Initiative", budget: 125000, actual: 95000, variance: -30000 },
  { project: "Education Support Program", budget: 98000, actual: 105000, variance: 7000 },
  { project: "Water Sanitation Project", budget: 215000, actual: 198000, variance: -17000 },
  { project: "Youth Empowerment Campaign", budget: 67000, actual: 72000, variance: 5000 },
  { project: "Women's Rights Advocacy", budget: 82000, actual: 79000, variance: -3000 },
];

const monthlySpendData = [
  { month: "Jan", budget: 125000, actual: 118000 },
  { month: "Feb", budget: 135000, actual: 142000 },
  { month: "Mar", budget: 145000, actual: 138000 },
  { month: "Apr", budget: 152000, actual: 159000 },
  { month: "May", budget: 148000, actual: 145000 },
  { month: "Jun", budget: 165000, actual: 172000 },
];

const categorySpendData = [
  { category: "Personnel", budget: 450000, actual: 432000, variance: -18000 },
  { category: "Equipment", budget: 185000, actual: 198000, variance: 13000 },
  { category: "Materials", budget: 125000, actual: 118000, variance: -7000 },
  { category: "Travel", budget: 78000, actual: 85000, variance: 7000 },
  { category: "Training", budget: 92000, actual: 88000, variance: -4000 },
];

const projectBudgetData = [
  { id: "PRJ-2025-001", name: "Community Health Initiative", budget: "$125,000", actualSpend: "$95,000", variance: "$30,000", variancePercent: -24, status: "Under Budget", utilizationRate: 76 },
  { id: "PRJ-2025-002", name: "Education Support Program", budget: "$98,000", actualSpend: "$105,000", variance: "$7,000", variancePercent: 7.1, status: "Over Budget", utilizationRate: 107 },
  { id: "PRJ-2025-003", name: "Water Sanitation Project", budget: "$215,000", actualSpend: "$198,000", variance: "$17,000", variancePercent: -7.9, status: "Under Budget", utilizationRate: 92 },
  { id: "PRJ-2025-004", name: "Youth Empowerment Campaign", budget: "$67,000", actualSpend: "$72,000", variance: "$5,000", variancePercent: 7.5, status: "Over Budget", utilizationRate: 107 },
  { id: "PRJ-2025-005", name: "Women's Rights Advocacy", budget: "$82,000", actualSpend: "$79,000", variance: "$3,000", variancePercent: -3.7, status: "On Budget", utilizationRate: 96 },
  { id: "PRJ-2025-006", name: "Climate Action Initiative", budget: "$178,000", actualSpend: "$98,000", variance: "$80,000", variancePercent: -44.9, status: "Under Budget", utilizationRate: 55 },
  { id: "PRJ-2025-007", name: "Food Security Program", budget: "$142,000", actualSpend: "$155,000", variance: "$13,000", variancePercent: 9.2, status: "Over Budget", utilizationRate: 109 },
  { id: "PRJ-2024-089", name: "Digital Literacy Workshop", budget: "$52,000", actualSpend: "$48,000", variance: "$4,000", variancePercent: -7.7, status: "Under Budget", utilizationRate: 92 },
];

const departments = ["All Departments", "Project Management", "Monitoring & Evaluation", "Stakeholders & Donors", "Financial Management", "HR Management"];
const statuses = ["All Statuses", "Under Budget", "On Budget", "Over Budget"];
const quarters = ["Q4 2025", "Q3 2025", "Q2 2025", "Q1 2025", "2024", "2023"];

export function BudgetVsActualProjectReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4 2025");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalBudget = 1245000;
  const totalSpent = 1187000;
  const variance = 58000;
  const variancePercent = -4.7;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Budget vs Actual Report</h1>
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
                  setShowStatusDropdown(false);
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
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowDepartmentDropdown(false);
                  setShowQuarterDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {status}
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
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedQuarter}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showQuarterDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowQuarterDropdown(false)} />
                  <div className="absolute top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {quarters.map((quarter) => (
                      <button
                        key={quarter}
                        onClick={() => {
                          setSelectedQuarter(quarter);
                          setShowQuarterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
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
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <DollarSign size={20} className="text-[#0B01D0]" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">${(totalBudget / 1000).toFixed(0)}K</div>
            <div className="text-sm text-slate-600">Total Budget</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <DollarSign size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">${(totalSpent / 1000).toFixed(0)}K</div>
            <div className="text-sm text-slate-600">Total Spent</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingDown size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">${(variance / 1000).toFixed(0)}K</div>
            <div className="text-sm text-slate-600">Variance</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{variancePercent}%</div>
            <div className="text-sm text-slate-600">Variance %</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Budget vs Actual by Project */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget vs Actual by Project</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="project" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="budget" fill="#E2E8F0" name="Budget" />
                <Bar dataKey="actual" fill="#0B01D0" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Spend Trend */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Spend Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="budget" stroke="#E2E8F0" strokeWidth={2} name="Budget" />
                <Line type="monotone" dataKey="actual" stroke="#0B01D0" strokeWidth={2} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Budget Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0B01D0]">
                  <th className="px-6 py-4 text-left text-[12px] text-white">Project ID</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Project Name</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Budget</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Actual Spend</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Variance</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Variance %</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Utilization</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Status</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectBudgetData.map((project, index) => (
                  <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.id}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.name}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.budget}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.actualSpend}</td>
                    <td className="px-6 py-4 text-[12px]">
                      <span className={project.variancePercent < 0 ? "text-green-600" : "text-red-600"}>
                        {project.variance}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[12px]">
                      <span className={project.variancePercent < 0 ? "text-green-600" : "text-red-600"}>
                        {project.variancePercent}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[80px]">
                          <div 
                            className={`h-full ${project.utilizationRate > 100 ? 'bg-red-500' : 'bg-[#0B01D0]'}`}
                            style={{ width: `${Math.min(project.utilizationRate, 100)}%` }}
                          />
                        </div>
                        <span>{project.utilizationRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[12px] ${
                        project.status === "Under Budget" ? "bg-green-100 text-green-800" :
                        project.status === "Over Budget" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <MoreHorizontal size={16} className="text-slate-600" />
                        </button>
                        {activeMenuId === project.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 top-8 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50 first:rounded-t-lg">View Details</button>
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50">View Breakdown</button>
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50 last:rounded-b-lg">Export Report</button>
                            </div>
                          </>
                        )}
                      </div>
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
