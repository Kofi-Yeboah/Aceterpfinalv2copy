import { useState } from "react";
import { Search, ChevronDown, Download, Clock } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";

// Types
type TimeStatus = "Under Time" | "On Time" | "Overdue";

interface TimeEntry {
  id: string;
  staffName: string;
  taskName: string;
  projectName: string;
  allocatedHours: number;
  actualHours: number;
  status: TimeStatus;
  startDate: string;
  endDate: string;
  efficiency: number; // percentage
}

// Mock Data
const MOCK_TIME_ENTRIES: TimeEntry[] = [
  {
    id: "1",
    staffName: "Yaw Osei",
    taskName: "Finalize Survey Instrument Design",
    projectName: "West Africa Regional Integration Study",
    allocatedHours: 40,
    actualHours: 35,
    status: "Under Time",
    startDate: "Nov 1, 2025",
    endDate: "Nov 28, 2025",
    efficiency: 114
  },
  {
    id: "2",
    staffName: "Kofi Mensah",
    taskName: "Conduct Internal Peer Review of Draft",
    projectName: "Digital Economy Policy Brief Series",
    allocatedHours: 24,
    actualHours: 24,
    status: "On Time",
    startDate: "Nov 15, 2025",
    endDate: "Nov 30, 2025",
    efficiency: 100
  },
  {
    id: "3",
    staffName: "Ama Darko",
    taskName: "Complete Literature Review",
    projectName: "West Africa Regional Integration Study",
    allocatedHours: 60,
    actualHours: 72,
    status: "Overdue",
    startDate: "Oct 15, 2025",
    endDate: "Nov 30, 2025",
    efficiency: 83
  },
  {
    id: "4",
    staffName: "Kwesi Appiah",
    taskName: "Schedule Project Kick-off Meeting",
    projectName: "Climate Finance Readiness Program",
    allocatedHours: 8,
    actualHours: 6,
    status: "Under Time",
    startDate: "Nov 20, 2025",
    endDate: "Nov 22, 2025",
    efficiency: 133
  },
  {
    id: "5",
    staffName: "Nana Yaw",
    taskName: "Draft Stakeholder Engagement Plan",
    projectName: "Renewable Energy Transition Framework",
    allocatedHours: 32,
    actualHours: 32,
    status: "On Time",
    startDate: "Nov 5, 2025",
    endDate: "Nov 30, 2025",
    efficiency: 100
  },
  {
    id: "6",
    staffName: "Yaw Osei",
    taskName: "Prepare Budget Allocation Report",
    projectName: "West Africa Regional Integration Study",
    allocatedHours: 16,
    actualHours: 20,
    status: "Overdue",
    startDate: "Nov 10, 2025",
    endDate: "Nov 25, 2025",
    efficiency: 80
  },
  {
    id: "7",
    staffName: "Kwaku Anane",
    taskName: "Coordinate Field Data Collection",
    projectName: "Sustainable Agriculture Development Initiative",
    allocatedHours: 80,
    actualHours: 65,
    status: "Under Time",
    startDate: "Oct 1, 2025",
    endDate: "Nov 28, 2025",
    efficiency: 123
  },
  {
    id: "8",
    staffName: "Kofi Mensah",
    taskName: "Review Policy Recommendations",
    projectName: "Digital Economy Policy Brief Series",
    allocatedHours: 20,
    actualHours: 28,
    status: "Overdue",
    startDate: "Nov 8, 2025",
    endDate: "Nov 30, 2025",
    efficiency: 71
  },
  {
    id: "9",
    staffName: "Kwesi Appiah",
    taskName: "Submit Final Technical Report",
    projectName: "Climate Finance Readiness Program",
    allocatedHours: 48,
    actualHours: 48,
    status: "On Time",
    startDate: "Nov 1, 2025",
    endDate: "Nov 29, 2025",
    efficiency: 100
  },
  {
    id: "10",
    staffName: "Nana Yaw",
    taskName: "Conduct Stakeholder Workshops",
    projectName: "Renewable Energy Transition Framework",
    allocatedHours: 40,
    actualHours: 52,
    status: "Overdue",
    startDate: "Oct 20, 2025",
    endDate: "Nov 28, 2025",
    efficiency: 77
  }
];

const PROJECTS = [
  "All Projects",
  "West Africa Regional Integration Study",
  "Digital Economy Policy Brief Series",
  "Climate Finance Readiness Program",
  "Sustainable Agriculture Development Initiative",
  "Renewable Energy Transition Framework"
];

const STAFF_MEMBERS = [
  "All Staff",
  "Yaw Osei",
  "Kofi Mensah",
  "Ama Darko",
  "Kwesi Appiah",
  "Nana Yaw",
  "Kwaku Anane"
];

const STATUSES: TimeStatus[] = ["Under Time", "On Time", "Overdue"];
const ALL_STATUSES = ["All Statuses", ...STATUSES];

export function TimeTracking() {
  const [timeEntries] = useState<TimeEntry[]>(MOCK_TIME_ENTRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedStaff, setSelectedStaff] = useState("All Staff");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Filter time entries
  const filteredEntries = timeEntries.filter((entry) => {
    const matchesSearch = entry.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === "All Projects" || entry.projectName === selectedProject;
    const matchesStaff = selectedStaff === "All Staff" || entry.staffName === selectedStaff;
    const matchesStatus = selectedStatus === "All Statuses" || entry.status === selectedStatus;
    
    return matchesSearch && matchesProject && matchesStaff && matchesStatus;
  });

  // Calculate summary statistics
  const totalAllocatedHours = filteredEntries.reduce((sum, entry) => sum + entry.allocatedHours, 0);
  const totalActualHours = filteredEntries.reduce((sum, entry) => sum + entry.actualHours, 0);
  const averageEfficiency = filteredEntries.length > 0
    ? Math.round(filteredEntries.reduce((sum, entry) => sum + entry.efficiency, 0) / filteredEntries.length)
    : 0;
  const onTimeCount = filteredEntries.filter(e => e.status === "On Time").length;
  const underTimeCount = filteredEntries.filter(e => e.status === "Under Time").length;
  const overdueCount = filteredEntries.filter(e => e.status === "Overdue").length;

  const getStatusColor = (status: TimeStatus) => {
    switch (status) {
      case "Under Time": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "On Time": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Overdue": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 100) return "text-emerald-600";
    if (efficiency >= 80) return "text-blue-600";
    if (efficiency >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Time Tracking</h1>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-xs text-blue-700 mb-1">Total Allocated Hours</div>
            <div className="text-2xl font-semibold text-blue-900">{totalAllocatedHours}h</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-xs text-purple-700 mb-1">Total Hours Spent</div>
            <div className="text-2xl font-semibold text-purple-900">{totalActualHours}h</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
            <div className="text-xs text-emerald-700 mb-1">Average Efficiency</div>
            <div className="text-2xl font-semibold text-emerald-900">{averageEfficiency}%</div>
          </div>

        </div>
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

          <div className="flex items-center gap-2.5">
            {/* Export Button */}
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span>
              <Download size={16} className="text-purple-700" />
            </button>

            {/* Staff Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStaffDropdown(!showStaffDropdown);
                  setShowProjectDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{selectedStaff}</span>
                <ChevronDown size={16} className="text-purple-700 flex-shrink-0" />
              </button>
              {showStaffDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStaffDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {STAFF_MEMBERS.map((staff) => (
                      <button
                        key={staff}
                        onClick={() => {
                          setSelectedStaff(staff);
                          setShowStaffDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedStaff === staff ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {staff}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Project Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProjectDropdown(!showProjectDropdown);
                  setShowStaffDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{selectedProject}</span>
                <ChevronDown size={16} className="text-purple-700 flex-shrink-0" />
              </button>
              {showProjectDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProjectDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {PROJECTS.map((project) => (
                      <button
                        key={project}
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedProject === project ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {project}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowProjectDropdown(false);
                  setShowStaffDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {ALL_STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedStatus === status ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          {/* Table Header */}
          <thead className="sticky top-0 z-10" style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Staff Name
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Task Name
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Project Name
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                Start Date
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                End Date
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Allocated Hours
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Hours Spent
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Efficiency
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                Status
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{entry.staffName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.taskName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.projectName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.startDate}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.endDate}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] font-medium text-slate-900">{entry.allocatedHours}h</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] font-medium text-slate-900">{entry.actualHours}h</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className={cn("text-[12px] font-semibold", getEfficiencyColor(entry.efficiency))}>
                    {entry.efficiency}%
                  </p>
                </td>
                <td className="px-4 py-4">
                  <Badge className={cn("text-[12px] font-medium shadow-none border-0", getStatusColor(entry.status))}>
                    {entry.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEntries.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">No time entries found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}