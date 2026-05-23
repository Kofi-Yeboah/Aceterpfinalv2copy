import { useState } from "react";
import { Search, Download, ChevronDown, MoreHorizontal, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const projectTimelineData = [
  { project: "Community Health Initiative", planned: 180, actual: 165, variance: -15, status: "Ahead" },
  { project: "Education Support Program", planned: 150, actual: 178, variance: 28, status: "Delayed" },
  { project: "Water Sanitation Project", planned: 200, actual: 195, variance: -5, status: "On Track" },
  { project: "Youth Empowerment Campaign", planned: 120, actual: 145, variance: 25, status: "Delayed" },
  { project: "Women's Rights Advocacy", planned: 90, actual: 88, variance: -2, status: "Ahead" },
];

const milestoneCompletionData = [
  { month: "Jan", planned: 12, completed: 11 },
  { month: "Feb", planned: 15, completed: 14 },
  { month: "Mar", planned: 18, completed: 16 },
  { month: "Apr", planned: 14, completed: 15 },
  { month: "May", planned: 16, completed: 14 },
  { month: "Jun", planned: 20, completed: 18 },
];

const projectDetailsData = [
  { id: "PRJ-2025-001", name: "Community Health Initiative", startDate: "2025-01-15", plannedEnd: "2025-06-30", actualEnd: "2025-06-15", daysAhead: 15, status: "Ahead of Schedule", milestones: 12, milestonesCompleted: 10 },
  { id: "PRJ-2025-002", name: "Education Support Program", startDate: "2025-02-01", plannedEnd: "2025-07-15", actualEnd: "2025-08-12", daysDelayed: 28, status: "Delayed", milestones: 10, milestonesCompleted: 6 },
  { id: "PRJ-2025-003", name: "Water Sanitation Project", startDate: "2025-01-20", plannedEnd: "2025-08-20", actualEnd: "2025-08-15", daysAhead: 5, status: "On Track", milestones: 15, milestonesCompleted: 11 },
  { id: "PRJ-2025-004", name: "Youth Empowerment Campaign", startDate: "2025-01-10", plannedEnd: "2025-05-30", actualEnd: "2025-06-24", daysDelayed: 25, status: "Delayed", milestones: 8, milestonesCompleted: 5 },
  { id: "PRJ-2025-005", name: "Women's Rights Advocacy", startDate: "2025-01-05", plannedEnd: "2025-04-30", actualEnd: "2025-04-28", daysAhead: 2, status: "Ahead of Schedule", milestones: 6, milestonesCompleted: 5 },
  { id: "PRJ-2025-006", name: "Climate Action Initiative", startDate: "2025-02-15", plannedEnd: "2025-09-15", actualEnd: "-", daysDelayed: 0, status: "On Track", milestones: 14, milestonesCompleted: 6 },
  { id: "PRJ-2025-007", name: "Food Security Program", startDate: "2025-01-01", plannedEnd: "2025-06-01", actualEnd: "2025-07-08", daysDelayed: 37, status: "Delayed", milestones: 11, milestonesCompleted: 7 },
  { id: "PRJ-2024-089", name: "Digital Literacy Workshop", startDate: "2024-10-01", plannedEnd: "2024-12-31", actualEnd: "2024-12-31", daysAhead: 0, status: "Completed on Time", milestones: 5, milestonesCompleted: 5 },
];

const departments = ["All Departments", "Project Management", "Monitoring & Evaluation", "Stakeholders & Donors", "Financial Management", "HR Management"];
const statuses = ["All Statuses", "Ahead of Schedule", "On Track", "Delayed", "Completed on Time"];
const quarters = ["Q4 2025", "Q3 2025", "Q2 2025", "Q1 2025", "2024", "2023"];

export function TimelineReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4 2025");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalProjects = 93;
  const onTime = 48;
  const delayed = 18;
  const ahead = 12;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Timeline Report</h1>
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
                  <div className="absolute top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
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
                <Calendar size={20} className="text-[#0B01D0]" />
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
            <div className="text-3xl font-semibold text-slate-900 mb-1">{onTime}</div>
            <div className="text-sm text-slate-600">On Time</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{delayed}</div>
            <div className="text-sm text-slate-600">Delayed</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{ahead}</div>
            <div className="text-sm text-slate-600">Ahead of Schedule</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Timeline Variance */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Timeline Variance (Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="project" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="variance" fill="#0B01D0" name="Variance (Days)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Milestone Completion */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Milestone Completion Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={milestoneCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke="#E2E8F0" strokeWidth={2} name="Planned" />
                <Line type="monotone" dataKey="completed" stroke="#0B01D0" strokeWidth={2} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Details Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0B01D0]">
                  <th className="px-6 py-4 text-left text-[12px] text-white">Project ID</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Project Name</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Start Date</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Planned End</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Actual/Est. End</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Variance</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Status</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Milestones</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Progress</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectDetailsData.map((project, index) => (
                  <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.id}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.name}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.startDate}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.plannedEnd}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.actualEnd}</td>
                    <td className="px-6 py-4 text-[12px]">
                      {project.daysAhead > 0 ? (
                        <span className="text-green-600">-{project.daysAhead} days</span>
                      ) : project.daysDelayed > 0 ? (
                        <span className="text-red-600">+{project.daysDelayed} days</span>
                      ) : (
                        <span className="text-slate-900">On time</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[12px] ${
                        project.status === "Ahead of Schedule" ? "bg-green-100 text-green-800" :
                        project.status === "Delayed" ? "bg-red-100 text-red-800" :
                        project.status === "Completed on Time" ? "bg-blue-100 text-blue-800" :
                        "bg-slate-100 text-slate-800"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{project.milestonesCompleted}/{project.milestones}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[80px]">
                          <div 
                            className="h-full bg-[#0B01D0]" 
                            style={{ width: `${(project.milestonesCompleted / project.milestones) * 100}%` }}
                          />
                        </div>
                        <span>{Math.round((project.milestonesCompleted / project.milestones) * 100)}%</span>
                      </div>
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
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50 first:rounded-t-lg">View Timeline</button>
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50">View Milestones</button>
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50 last:rounded-b-lg">Export Timeline</button>
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
