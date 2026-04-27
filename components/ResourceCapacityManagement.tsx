import { useState } from "react";
import { Search, ChevronDown, Download, Upload, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { ViewResourceDetails } from "./ViewResourceDetails";

// Types
type WorkStatus = "Available" | "Partially Available" | "Fully Utilized" | "Overallocated";

type Availability = "Available" | "Limited" | "Unavailable";

interface ResourceEntry {
  id: string;
  staffName: string;
  role: string;
  unit: string;
  department: string;
  projectAssignment: string;
  assignmentDate: string;
  roleInProject: string;
  workStatus: WorkStatus;
  utilization: number; // percentage
  plannedLOE: number;
  actualLOE: number;
  varianceLOE: number;
  skills: string[];
  availability: Availability;
}

// Mock Data
const MOCK_RESOURCES: ResourceEntry[] = [
  {
    id: "1",
    staffName: "Yaw Osei",
    role: "Project Manager",
    unit: "Operations",
    department: "Project Management Office",
    projectAssignment: "West Africa Regional Integration Study",
    assignmentDate: "Jan 15, 2025",
    roleInProject: "Lead PM",
    workStatus: "Fully Utilized",
    utilization: 100,
    plannedLOE: 160,
    actualLOE: 160,
    varianceLOE: 0,
    skills: ["Project Management", "Stakeholder Engagement"],
    availability: "Unavailable"
  },
  {
    id: "2",
    staffName: "Kofi Mensah",
    role: "Senior Researcher",
    unit: "Research",
    department: "Policy & Research",
    projectAssignment: "Digital Economy Policy Brief Series",
    assignmentDate: "Feb 1, 2025",
    roleInProject: "Research Lead",
    workStatus: "Partially Available",
    utilization: 65,
    plannedLOE: 120,
    actualLOE: 78,
    varianceLOE: -42,
    skills: ["Policy Analysis", "Data Research"],
    availability: "Limited"
  },
  {
    id: "3",
    staffName: "Kwesi Appiah",
    role: "Research Assistant",
    unit: "Research",
    department: "Economic Analysis",
    projectAssignment: "Climate Finance Readiness Program",
    assignmentDate: "Mar 10, 2025",
    roleInProject: "Data Analyst",
    workStatus: "Overallocated",
    utilization: 120,
    plannedLOE: 100,
    actualLOE: 120,
    varianceLOE: 20,
    skills: ["Data Analysis", "Climate Finance"],
    availability: "Unavailable"
  },
  {
    id: "4",
    staffName: "Nana Yaw",
    role: "Research Assistant",
    unit: "HR",
    department: "Human Resources",
    projectAssignment: "Renewable Energy Transition Framework",
    assignmentDate: "Feb 20, 2025",
    roleInProject: "Junior Researcher",
    workStatus: "Available",
    utilization: 40,
    plannedLOE: 80,
    actualLOE: 32,
    varianceLOE: -48,
    skills: ["Literature Review", "Report Writing"],
    availability: "Available"
  },
  {
    id: "5",
    staffName: "Kwaku Anane",
    role: "Project Manager",
    unit: "Operations",
    department: "Project Management Office",
    projectAssignment: "Sustainable Agriculture Development Initiative",
    assignmentDate: "Jan 5, 2025",
    roleInProject: "Co-Lead",
    workStatus: "Fully Utilized",
    utilization: 95,
    plannedLOE: 150,
    actualLOE: 142,
    varianceLOE: -8,
    skills: ["Project Management", "Agriculture"],
    availability: "Limited"
  },
  {
    id: "6",
    staffName: "Ama Darko",
    role: "Senior Researcher",
    unit: "Research",
    department: "Policy & Research",
    projectAssignment: "West Africa Regional Integration Study",
    assignmentDate: "Jan 20, 2025",
    roleInProject: "Senior Analyst",
    workStatus: "Partially Available",
    utilization: 70,
    plannedLOE: 130,
    actualLOE: 91,
    varianceLOE: -39,
    skills: ["Regional Integration", "Policy Research"],
    availability: "Limited"
  },
  {
    id: "7",
    staffName: "Adjoa Mensah",
    role: "Research Assistant",
    unit: "Operations",
    department: "Field Operations",
    projectAssignment: "Digital Economy Policy Brief Series",
    assignmentDate: "Mar 1, 2025",
    roleInProject: "Field Coordinator",
    workStatus: "Available",
    utilization: 50,
    plannedLOE: 90,
    actualLOE: 45,
    varianceLOE: -45,
    skills: ["Field Coordination", "Digital Economy"],
    availability: "Available"
  },
  {
    id: "8",
    staffName: "Kwame Asante",
    role: "Project Manager",
    unit: "Finance",
    department: "Financial Management",
    projectAssignment: "Climate Finance Readiness Program",
    assignmentDate: "Feb 15, 2025",
    roleInProject: "Project Lead",
    workStatus: "Overallocated",
    utilization: 115,
    plannedLOE: 140,
    actualLOE: 161,
    varianceLOE: 21,
    skills: ["Financial Management", "Climate Finance"],
    availability: "Unavailable"
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

const STATUSES: WorkStatus[] = ["Available", "Partially Available", "Fully Utilized", "Overallocated"];
const ALL_STATUSES = ["All Statuses", ...STATUSES];

const TIME_PERIODS = ["All Time", "This Month", "This Quarter", "This Year", "Last 30 Days", "Last 90 Days"];

export function ResourceCapacityManagement() {
  const [resources] = useState<ResourceEntry[]>(MOCK_RESOURCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("All Time");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [viewingResourceId, setViewingResourceId] = useState<string | null>(null);

  // If viewing a resource, render the view resource page
  if (viewingResourceId) {
    const resource = resources.find(r => r.id === viewingResourceId);
    if (resource) {
      return <ViewResourceDetails resource={resource} onBack={() => setViewingResourceId(null)} />;
    }
  }

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.projectAssignment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === "All Projects" || resource.projectAssignment === selectedProject;
    const matchesStatus = selectedStatus === "All Statuses" || resource.workStatus === selectedStatus;
    
    return matchesSearch && matchesProject && matchesStatus;
  });

  // Calculate summary statistics
  const totalResources = filteredResources.length;
  const availableResources = filteredResources.filter(r => r.workStatus === "Available").length;
  const fullyUtilized = filteredResources.filter(r => r.workStatus === "Fully Utilized").length;
  const overallocated = filteredResources.filter(r => r.workStatus === "Overallocated").length;
  const avgUtilization = filteredResources.length > 0
    ? Math.round(filteredResources.reduce((sum, r) => sum + r.utilization, 0) / filteredResources.length)
    : 0;

  const getStatusColor = (status: WorkStatus) => {
    switch (status) {
      case "Available": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Partially Available": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Fully Utilized": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Overallocated": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 100) return "text-red-600";
    if (utilization >= 80) return "text-amber-600";
    if (utilization >= 50) return "text-blue-600";
    return "text-emerald-600";
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Staff Allocation</h1>
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

            {/* Upload CSV Button */}
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Upload CSV</span>
              <Upload size={16} className="text-purple-700" />
            </button>

            {/* Project Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProjectDropdown(!showProjectDropdown);
                  setShowStatusDropdown(false);
                  setShowTimeDropdown(false);
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
                  setShowTimeDropdown(false);
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

            {/* Time Period Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTimeDropdown(!showTimeDropdown);
                  setShowProjectDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedTimePeriod}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showTimeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTimeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {TIME_PERIODS.map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedTimePeriod(period);
                          setShowTimeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedTimePeriod === period ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {period}
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
          <thead className="bg-blue-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Staff/Expert
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-40">
                Role
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                Unit
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-40">
                Department
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Project Assignment
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Assignment Date
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Role in Project
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-40">
                Work Status
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                Utilization
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Planned LOE
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Actual LOE
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Variance LOE
              </th>
              <th className="px-4 py-4 text-center text-white text-[12px] font-semibold border-b border-slate-100 w-20">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {filteredResources.map((resource) => (
              <tr key={resource.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-600">{resource.staffName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{resource.role}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{resource.unit}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{resource.department}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{resource.projectAssignment}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{resource.assignmentDate}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-600">{resource.roleInProject}</p>
                </td>
                <td className="px-4 py-4">
                  <Badge className={cn("text-[12px] font-medium shadow-none border-0", getStatusColor(resource.workStatus))}>
                    {resource.workStatus}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className={cn("text-[12px] font-semibold", getUtilizationColor(resource.utilization))}>
                    {resource.utilization}%
                  </p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] font-semibold text-slate-600">{resource.plannedLOE}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] font-semibold text-slate-600">{resource.actualLOE}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] font-semibold text-slate-600">{resource.varianceLOE}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === resource.id ? null : resource.id)}
                      className="p-1 hover:bg-slate-100 rounded"
                    >
                      <MoreHorizontal size={16} className="text-slate-600" />
                    </button>
                    {showActionMenu === resource.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <button
                            onClick={() => {
                              setViewingResourceId(resource.id);
                              setShowActionMenu(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50"
                          >
                            View Details
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50">
                            Edit Assignment
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50">
                            Update Status
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50">
                            View History
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredResources.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">No resources found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}