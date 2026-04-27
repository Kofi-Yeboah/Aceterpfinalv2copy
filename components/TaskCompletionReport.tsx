import { useState } from "react";
import { Search, Download, ChevronDown, MoreHorizontal, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

const taskStatusData = [
  { status: "Completed", count: 156, color: "#10B981" },
  { status: "In Progress", count: 68, color: "#0B01D0" },
  { status: "Overdue", count: 24, color: "#EF4444" },
  { status: "Not Started", count: 15, color: "#94A3B8" },
];

const completionTrendData = [
  { month: "Jan", completed: 48, total: 65 },
  { month: "Feb", completed: 52, total: 70 },
  { month: "Mar", completed: 58, total: 72 },
  { month: "Apr", completed: 61, total: 68 },
  { month: "May", completed: 54, total: 75 },
  { month: "Jun", completed: 65, total: 78 },
];

const departmentTaskData = [
  { department: "Project Management", completed: 42, inProgress: 18, overdue: 5 },
  { department: "Monitoring & Evaluation", completed: 35, inProgress: 12, overdue: 4 },
  { department: "Financial Management", completed: 28, inProgress: 10, overdue: 6 },
  { department: "Stakeholders & Donors", completed: 31, inProgress: 15, overdue: 5 },
  { department: "HR Management", completed: 20, inProgress: 13, overdue: 4 },
];

const tasksTableData = [
  { id: "TSK-2025-001", title: "Develop Project Proposal", project: "Community Health Initiative", assignee: "Sarah Johnson", priority: "High", status: "Completed", dueDate: "2025-06-15", completedDate: "2025-06-12", duration: "12 days" },
  { id: "TSK-2025-002", title: "Conduct Baseline Survey", project: "Education Support Program", assignee: "Michael Chen", priority: "Medium", status: "In Progress", dueDate: "2025-06-30", completedDate: "-", duration: "18 days" },
  { id: "TSK-2025-003", title: "Procurement of Equipment", project: "Water Sanitation Project", assignee: "Emily Rodriguez", priority: "High", status: "Overdue", dueDate: "2025-06-20", completedDate: "-", duration: "25 days" },
  { id: "TSK-2025-004", title: "Stakeholder Engagement Meeting", project: "Youth Empowerment Campaign", assignee: "David Kim", priority: "Low", status: "Completed", dueDate: "2025-06-18", completedDate: "2025-06-18", duration: "5 days" },
  { id: "TSK-2025-005", title: "Training Materials Development", project: "Women's Rights Advocacy", assignee: "Lisa Anderson", priority: "Medium", status: "In Progress", dueDate: "2025-07-05", completedDate: "-", duration: "10 days" },
  { id: "TSK-2025-006", title: "Budget Review and Approval", project: "Climate Action Initiative", assignee: "James Wilson", priority: "High", status: "Completed", dueDate: "2025-06-25", completedDate: "2025-06-22", duration: "8 days" },
  { id: "TSK-2025-007", title: "Community Mobilization", project: "Food Security Program", assignee: "Amanda Foster", priority: "Medium", status: "Overdue", dueDate: "2025-06-15", completedDate: "-", duration: "30 days" },
  { id: "TSK-2025-008", title: "Data Entry and Analysis", project: "Digital Literacy Workshop", assignee: "Robert Chang", priority: "Low", status: "Not Started", dueDate: "2025-07-10", completedDate: "-", duration: "0 days" },
  { id: "TSK-2025-009", title: "Final Report Writing", project: "Community Health Initiative", assignee: "Sarah Johnson", priority: "High", status: "In Progress", dueDate: "2025-06-28", completedDate: "-", duration: "15 days" },
  { id: "TSK-2025-010", title: "Monitoring Field Visit", project: "Education Support Program", assignee: "Michael Chen", priority: "Medium", status: "Completed", dueDate: "2025-06-20", completedDate: "2025-06-19", duration: "7 days" },
];

const departments = ["All Departments", "Project Management", "Monitoring & Evaluation", "Financial Management", "Stakeholders & Donors", "HR Management"];
const statuses = ["All Statuses", "Completed", "In Progress", "Overdue", "Not Started"];
const priorities = ["All Priorities", "High", "Medium", "Low"];
const quarters = ["Q4 2025", "Q3 2025", "Q2 2025", "Q1 2025", "2024", "2023"];

export function TaskCompletionReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4 2025");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalTasks = 263;
  const completedTasks = 156;
  const completionRate = 59.3;
  const overdueTasks = 24;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Task Completion Report</h1>
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
                  setShowPriorityDropdown(false);
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
                  setShowPriorityDropdown(false);
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

            {/* Priority Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowPriorityDropdown(!showPriorityDropdown);
                  setShowDepartmentDropdown(false);
                  setShowStatusDropdown(false);
                  setShowQuarterDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedPriority}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showPriorityDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPriorityDropdown(false)} />
                  <div className="absolute top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {priorities.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => {
                          setSelectedPriority(priority);
                          setShowPriorityDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {priority}
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
                  setShowPriorityDropdown(false);
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
            <div className="text-3xl font-semibold text-slate-900 mb-1">{totalTasks}</div>
            <div className="text-sm text-slate-600">Total Tasks</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{completedTasks}</div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{completionRate}%</div>
            <div className="text-sm text-slate-600">Completion Rate</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-slate-900 mb-1">{overdueTasks}</div>
            <div className="text-sm text-slate-600">Overdue</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Task Status Distribution */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {taskStatusData.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.status}: {item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Trend */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Completion Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={completionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#E2E8F0" strokeWidth={2} name="Total Tasks" />
                <Line type="monotone" dataKey="completed" stroke="#0B01D0" strokeWidth={2} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0B01D0]">
                  <th className="px-6 py-4 text-left text-[12px] text-white">Task ID</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Task Title</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Project</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Assignee</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Priority</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Status</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Due Date</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Completed Date</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Duration</th>
                  <th className="px-6 py-4 text-left text-[12px] text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasksTableData.map((task, index) => (
                  <tr key={task.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{task.id}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{task.title}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{task.project}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{task.assignee}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[12px] ${
                        task.priority === "High" ? "bg-red-100 text-red-800" :
                        task.priority === "Medium" ? "bg-orange-100 text-orange-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[12px] ${
                        task.status === "Completed" ? "bg-green-100 text-green-800" :
                        task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                        task.status === "Overdue" ? "bg-red-100 text-red-800" :
                        "bg-slate-100 text-slate-800"
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{task.dueDate}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{task.completedDate}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-900">{task.duration}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <MoreHorizontal size={16} className="text-slate-600" />
                        </button>
                        {activeMenuId === task.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 top-8 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50 first:rounded-t-lg">View Details</button>
                              <button className="w-full text-left px-4 py-2 text-[12px] text-slate-900 hover:bg-slate-50">Edit Task</button>
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
