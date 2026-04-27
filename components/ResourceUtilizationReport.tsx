import { useState } from "react";
import { Search, Download, ChevronDown, Users, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const resourceAllocationData = [
  { name: "Sarah Johnson", allocation: 95, available: 5, projects: 3 },
  { name: "Michael Chen", allocation: 85, available: 15, projects: 2 },
  { name: "Emily Rodriguez", allocation: 78, available: 22, projects: 2 },
  { name: "David Kim", allocation: 92, available: 8, projects: 4 },
  { name: "Lisa Anderson", allocation: 68, available: 32, projects: 2 },
  { name: "James Wilson", allocation: 88, available: 12, projects: 3 },
];

const monthlyUtilizationData = [
  { month: "Jan", utilization: 72, capacity: 100 },
  { month: "Feb", utilization: 78, capacity: 100 },
  { month: "Mar", utilization: 85, capacity: 100 },
  { month: "Apr", utilization: 82, capacity: 100 },
  { month: "May", utilization: 88, capacity: 100 },
  { month: "Jun", utilization: 84, capacity: 100 },
];

const departmentUtilizationData = [
  { department: "Project Management", utilization: 85, overAllocated: 2, underAllocated: 1 },
  { department: "Monitoring & Evaluation", utilization: 78, overAllocated: 1, underAllocated: 3 },
  { department: "Financial Management", utilization: 92, overAllocated: 3, underAllocated: 0 },
  { department: "Stakeholders & Donors", utilization: 72, overAllocated: 0, underAllocated: 4 },
  { department: "HR Management", utilization: 88, overAllocated: 2, underAllocated: 1 },
];

const resourceDetailsData = [
  { id: "EMP-001", name: "Sarah Johnson", role: "Project Manager", department: "Project Management", utilization: 95, hoursAllocated: 152, hoursAvailable: 160, projectsAssigned: 3, status: "Over-allocated" },
  { id: "EMP-002", name: "Michael Chen", role: "Senior Developer", department: "Project Management", utilization: 85, hoursAllocated: 136, hoursAvailable: 160, projectsAssigned: 2, status: "Optimal" },
  { id: "EMP-003", name: "Emily Rodriguez", role: "M&E Specialist", department: "Monitoring & Evaluation", utilization: 78, hoursAllocated: 125, hoursAvailable: 160, projectsAssigned: 2, status: "Optimal" },
  { id: "EMP-004", name: "David Kim", role: "Financial Analyst", department: "Financial Management", utilization: 92, hoursAllocated: 147, hoursAvailable: 160, projectsAssigned: 4, status: "Over-allocated" },
  { id: "EMP-005", name: "Lisa Anderson", role: "Communications Officer", department: "Stakeholders & Donors", utilization: 68, hoursAllocated: 109, hoursAvailable: 160, projectsAssigned: 2, status: "Under-utilized" },
  { id: "EMP-006", name: "James Wilson", role: "HR Coordinator", department: "HR Management", utilization: 88, hoursAllocated: 141, hoursAvailable: 160, projectsAssigned: 3, status: "Optimal" },
  { id: "EMP-007", name: "Amanda Foster", role: "Data Analyst", department: "Monitoring & Evaluation", utilization: 62, hoursAllocated: 99, hoursAvailable: 160, projectsAssigned: 1, status: "Under-utilized" },
  { id: "EMP-008", name: "Robert Chang", role: "Procurement Officer", department: "Financial Management", utilization: 91, hoursAllocated: 146, hoursAvailable: 160, projectsAssigned: 3, status: "Over-allocated" },
];

const departments = ["All Departments", "Project Management", "Monitoring & Evaluation", "Financial Management", "Stakeholders & Donors", "HR Management"];
const utilizationLevels = ["All Levels", "Over-allocated (>90%)", "Optimal (70-90%)", "Under-utilized (<70%)"];
const quarters = ["Q4 2025", "Q3 2025", "Q2 2025", "Q1 2025", "2024", "2023"];

export function ResourceUtilizationReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedUtilization, setSelectedUtilization] = useState("All Levels");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4 2025");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showUtilizationDropdown, setShowUtilizationDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);

  const totalResources = 48;
  const avgUtilization = 84;
  const overAllocated = 8;
  const underUtilized = 9;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Staff Utilization Report</h1>
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
                  setShowUtilizationDropdown(false);
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

            {/* Utilization Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowUtilizationDropdown(!showUtilizationDropdown);
                  setShowDepartmentDropdown(false);
                  setShowQuarterDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedUtilization}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showUtilizationDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUtilizationDropdown(false)} />
                  <div className="absolute top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {utilizationLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setSelectedUtilization(level);
                          setShowUtilizationDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {level}
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
                  setShowUtilizationDropdown(false);
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
                <Users size={20} className="text-[#0B01D0]" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{totalResources}</div>
            <div className="text-sm text-slate-600">Total Resources</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{avgUtilization}%</div>
            <div className="text-sm text-slate-600">Avg Utilization</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{overAllocated}</div>
            <div className="text-sm text-slate-600">Over-allocated</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Clock size={20} className="text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{underUtilized}</div>
            <div className="text-sm text-slate-600">Under-utilized</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Utilization Trend */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Utilization Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="utilization" stroke="#0B01D0" strokeWidth={2} name="Utilization %" />
                <Line type="monotone" dataKey="capacity" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="5 5" name="Capacity" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Utilization */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Utilization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="utilization" fill="#0B01D0" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Details Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0B01D0]">
                  <th className="px-6 py-4 text-left text-[12px] text-white">Employee ID</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Name</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Role</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Department</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Utilization %</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Hours Allocated</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Hours Available</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Projects</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {resourceDetailsData.map((resource, index) => (
                  <tr key={resource.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{resource.id}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{resource.name}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{resource.role}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{resource.department}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[80px]">
                          <div 
                            className={`h-full ${resource.utilization > 90 ? 'bg-red-500' : resource.utilization < 70 ? 'bg-orange-500' : 'bg-[#0B01D0]'}`}
                            style={{ width: `${resource.utilization}%` }}
                          />
                        </div>
                        <span>{resource.utilization}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{resource.hoursAllocated}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{resource.hoursAvailable}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{resource.projectsAssigned}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[12px] ${
                        resource.status === "Over-allocated" ? "bg-red-100 text-red-800" :
                        resource.status === "Under-utilized" ? "bg-orange-100 text-orange-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {resource.status}
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
