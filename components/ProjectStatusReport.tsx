import { useState } from "react";
import { Search, Download, ChevronDown, MoreHorizontal, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const projectStatusData = [
  { status: "On Track", count: 28, color: "#10B981" },
  { status: "At Risk", count: 12, color: "#F59E0B" },
  { status: "Delayed", count: 8, color: "#EF4444" },
  { status: "Completed", count: 45, color: "#0B01D0" },
];

const departmentProjectsData = [
  { department: "Project Management", onTrack: 8, atRisk: 3, delayed: 2 },
  { department: "Monitoring & Evaluation", onTrack: 6, atRisk: 2, delayed: 1 },
  { department: "Stakeholders & Donors", onTrack: 5, atRisk: 3, delayed: 2 },
  { department: "Financial Management", onTrack: 4, atRisk: 2, delayed: 1 },
  { department: "HR Management", onTrack: 5, atRisk: 2, delayed: 2 },
];

const projectsTableData = [
  { id: "PRJ-2025-001", name: "Community Health Initiative", department: "Project Management", status: "On Track", progress: 85, startDate: "2025-01-15", endDate: "2025-06-30", budget: "$125,000", spent: "$95,000" },
  { id: "PRJ-2025-002", name: "Education Support Program", department: "Monitoring & Evaluation", status: "At Risk", progress: 62, startDate: "2025-02-01", endDate: "2025-07-15", budget: "$98,000", spent: "$75,000" },
  { id: "PRJ-2025-003", name: "Water Sanitation Project", department: "Stakeholders & Donors", status: "On Track", progress: 78, startDate: "2025-01-20", endDate: "2025-08-20", budget: "$215,000", spent: "$145,000" },
  { id: "PRJ-2025-004", name: "Youth Empowerment Campaign", department: "Financial Management", status: "Delayed", progress: 45, startDate: "2025-01-10", endDate: "2025-05-30", budget: "$67,000", spent: "$52,000" },
  { id: "PRJ-2025-005", name: "Women's Rights Advocacy", department: "HR Management", status: "On Track", progress: 92, startDate: "2025-01-05", endDate: "2025-04-30", budget: "$82,000", spent: "$76,000" },
  { id: "PRJ-2025-006", name: "Climate Action Initiative", department: "Project Management", status: "At Risk", progress: 58, startDate: "2025-02-15", endDate: "2025-09-15", budget: "$178,000", spent: "$98,000" },
  { id: "PRJ-2025-007", name: "Food Security Program", department: "Stakeholders & Donors", status: "Delayed", progress: 38, startDate: "2025-01-01", endDate: "2025-06-01", budget: "$142,000", spent: "$89,000" },
  { id: "PRJ-2024-089", name: "Digital Literacy Workshop", department: "Monitoring & Evaluation", status: "Completed", progress: 100, startDate: "2024-10-01", endDate: "2024-12-31", budget: "$52,000", spent: "$48,000" },
];

const departments = ["All Departments", "Project Management", "Monitoring & Evaluation", "Stakeholders & Donors", "Financial Management", "HR Management"];
const statuses = ["All Statuses", "On Track", "At Risk", "Delayed", "Completed"];
const quarters = ["Q4 2025", "Q3 2025", "Q2 2025", "Q1 2025", "2024", "2023"];

export function ProjectStatusReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4 2025");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalProjects = 93;
  const activeProjects = 48;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Project Status Report</h1>
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
                <CheckCircle size={20} className="text-[#0B01D0]" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{totalProjects}</div>
            <div className="text-sm text-slate-600">Total Projects</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{activeProjects}</div>
            <div className="text-sm text-slate-600">Active Projects</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Clock size={20} className="text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">12</div>
            <div className="text-sm text-slate-600">At Risk</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">8</div>
            <div className="text-sm text-slate-600">Delayed</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Projects by Status */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Projects by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {projectStatusData.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.status}: {item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects by Department */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Projects by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentProjectsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTrack" fill="#10B981" name="On Track" />
                <Bar dataKey="atRisk" fill="#F59E0B" name="At Risk" />
                <Bar dataKey="delayed" fill="#EF4444" name="Delayed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0B01D0]">
                  <th className="px-6 py-4 text-left text-[12px] text-white">Project ID</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Project Name</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Department</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Status</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Progress</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Start Date</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">End Date</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Budget</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Spent</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map((project, index) => (
                  <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.id}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.name}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.department}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[12px] ${
                        project.status === "On Track" ? "bg-green-100 text-green-800" :
                        project.status === "At Risk" ? "bg-orange-100 text-orange-800" :
                        project.status === "Delayed" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#0B01D0]" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span>{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.startDate}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.endDate}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.budget}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.spent}</td>
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
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50">Edit Project</button>
                              <button className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-slate-50 last:rounded-b-lg">Delete</button>
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
