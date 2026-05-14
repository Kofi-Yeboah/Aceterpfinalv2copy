import { useState } from "react";
import { Search, ChevronDown, Upload, Download, Plus, MoreHorizontal, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { ProjectDetailsView } from "./ProjectDetailsView";
import { AddProjectForm } from "./AddProjectForm";

// Types
type RiskLevel = "Low" | "Medium" | "High" | "Critical";
type ProjectStatus = "Draft" | "Pending Approval" | "Approved" | "Rejected" | "In Progress" | "Revision Required" | "Active" | "On Hold" | "At Risk" | "Closed" | "Completed";
type ProjectStage = "Inception & Planning" | "Delivery" | "Closure";

interface Project {
  id: string;
  name: string;
  projectManager: string;
  startDate: string;
  endDate: string;
  progress: number;
  milestoneStatus: string;
  riskLevel: RiskLevel;
  estimatedBudget: string;
  status: ProjectStatus;
  stage: ProjectStage;
  program?: string;
}

// Mock Data
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "West Africa Regional Integration Study",
    projectManager: "Yaw Osei",
    startDate: "Jan 15, 2025",
    endDate: "Aug 30, 2025",
    progress: 65,
    milestoneStatus: "13 of 20 tasks completed",
    riskLevel: "Medium",
    estimatedBudget: "$450,000",
    status: "Draft",
    stage: "Inception & Planning",
    program: "West Africa Economic Development Program"
  },
  {
    id: "2",
    name: "Digital Economy Policy Brief Series",
    projectManager: "Kofi Mensah",
    startDate: "Mar 1, 2024",
    endDate: "Nov 15, 2024",
    progress: 100,
    milestoneStatus: "All phases done",
    riskLevel: "Low",
    estimatedBudget: "$320,000",
    status: "Closed",
    stage: "Closure",
    program: "West Africa Economic Development Program"
  },
  {
    id: "3",
    name: "Climate Finance Readiness Program",
    projectManager: "Kwesi Appiah",
    startDate: "Nov 1, 2025",
    endDate: "Jun 30, 2026",
    progress: 5,
    milestoneStatus: "Phase 1 planning tasks ongoing",
    riskLevel: "High",
    estimatedBudget: "$25,000",
    status: "Draft",
    stage: "Inception & Planning"
  },
  {
    id: "4",
    name: "Sustainable Agriculture Development Initiative",
    projectManager: "Nana Yaw",
    startDate: "Apr 10, 2025",
    endDate: "Dec 20, 2025",
    progress: 75,
    milestoneStatus: "Phase 3 tasks in progress",
    riskLevel: "Medium",
    estimatedBudget: "$580,000",
    status: "Active",
    stage: "Delivery",
    program: "Sustainable Communities Initiative"
  },
  {
    id: "5",
    name: "Renewable Energy Transition Framework",
    projectManager: "Kwaku Anane",
    startDate: "Feb 5, 2025",
    endDate: "Oct 15, 2025",
    progress: 90,
    milestoneStatus: "Final phase review tasks",
    riskLevel: "Low",
    estimatedBudget: "$690,000",
    status: "Pending Approval",
    stage: "Closure",
    program: "Sustainable Communities Initiative"
  },
  {
    id: "6",
    name: "Healthcare System Strengthening Project",
    projectManager: "Ama Serwaa",
    startDate: "Jun 1, 2025",
    endDate: "Dec 31, 2025",
    progress: 35,
    milestoneStatus: "Awaiting program head approval",
    riskLevel: "Low",
    estimatedBudget: "$750,000",
    status: "Pending Approval",
    stage: "Inception & Planning",
    program: "Youth & Social Development Program"
  },
  {
    id: "7",
    name: "Youth Employment Skills Development",
    projectManager: "Kwame Asante",
    startDate: "May 15, 2025",
    endDate: "Oct 30, 2025",
    progress: 44,
    milestoneStatus: "Procurement phase — vendor selection in progress",
    riskLevel: "Medium",
    estimatedBudget: "$150,000",
    status: "Active",
    stage: "Delivery",
    program: "Youth & Social Development Program"
  },
  {
    id: "8",
    name: "Urban Infrastructure Development Plan",
    projectManager: "Yaw Osei",
    startDate: "Feb 10, 2025",
    endDate: "Sep 20, 2025",
    progress: 15,
    milestoneStatus: "Initial concept review incomplete",
    riskLevel: "High",
    estimatedBudget: "$1,200,000",
    status: "Rejected",
    stage: "Inception & Planning"
  }
];

const PROJECT_MANAGERS = ["All PMs", "Yaw Osei", "Kofi Mensah", "Kwesi Appiah", "Nana Yaw", "Kwaku Anane", "Ama Serwaa", "Kwame Asante"];
const STATUSES = ["All Statuses", "Draft", "Pending Approval", "Approved", "Rejected", "In Progress", "Revision Required", "Active", "On Hold", "At Risk", "Closed", "Completed"];
const TIME_PERIODS = ["All Time", "Last 7 Days", "Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year"];

interface ProjectPlanningProps {
  onNavigateToWBS?: () => void;
  onNavigateToProcurementPlan?: () => void;
  onNavigateToBudget?: () => void;
  onNavigateToRiskManagement?: () => void;
  onNavigateToCommsPlan?: () => void;
}

export function ProjectPlanning({ onNavigateToWBS, onNavigateToProcurementPlan, onNavigateToBudget, onNavigateToRiskManagement, onNavigateToCommsPlan }: ProjectPlanningProps = {}) {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPM, setSelectedPM] = useState("All PMs");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("All Time");
  const [showPMDropdown, setShowPMDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [selectedStage, setSelectedStage] = useState<ProjectStage>("Inception & Planning");

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.projectManager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPM = selectedPM === "All PMs" || project.projectManager === selectedPM;
    const matchesStatus = selectedStatus === "All Statuses" || project.status === selectedStatus;
    const matchesStage = project.stage === selectedStage;
    
    return matchesSearch && matchesPM && matchesStatus && matchesStage;
  });

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "Low": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Medium": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "High": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "Critical": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "Draft": return "bg-slate-100 text-slate-700 hover:bg-slate-100";
      case "Pending Approval": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Approved": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Rejected": return "bg-red-100 text-red-700 hover:bg-red-100";
      case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Revision Required": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "Active": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "On Hold": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "At Risk": return "bg-red-100 text-red-700 hover:bg-red-100";
      case "Closed": return "bg-slate-200 text-slate-800 hover:bg-slate-200";
      case "Completed": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  const getStageColor = (stage: ProjectStage) => {
    switch (stage) {
      case "Inception & Planning": return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100";
      case "Delivery": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Closure": return "bg-slate-100 text-slate-700 hover:bg-slate-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  return (
    <>
      {selectedProject ? (
        <ProjectDetailsView
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
          onNavigateToWBS={onNavigateToWBS}
          onNavigateToProcurementPlan={onNavigateToProcurementPlan}
          onNavigateToBudget={onNavigateToBudget}
          onNavigateToRiskManagement={onNavigateToRiskManagement}
          onNavigateToCommsPlan={onNavigateToCommsPlan}
        />
      ) : showAddProjectForm ? (
        <AddProjectForm
          onBack={() => setShowAddProjectForm(false)}
          onSave={(projectData) => {
            console.log("New project:", projectData);
            setShowAddProjectForm(false);
          }}
        />
      ) : (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-900">Project Planning & Tracking</h1>
            <button
              onClick={() => setShowAddProjectForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Add New Project</span>
            </button>
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

                {/* Project Manager Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowPMDropdown(!showPMDropdown);
                      setShowStatusDropdown(false);
                      setShowTimeDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm text-slate-900">{selectedPM}</span>
                    <ChevronDown size={16} className="text-purple-700" />
                  </button>
                  {showPMDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowPMDropdown(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {PROJECT_MANAGERS.map((pm) => (
                          <button
                            key={pm}
                            onClick={() => {
                              setSelectedPM(pm);
                              setShowPMDropdown(false);
                            }}
                            className={cn(
                              "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                              selectedPM === pm ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                            )}
                          >
                            {pm}
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
                      setShowPMDropdown(false);
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
                        {STATUSES.map((status) => (
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
                      setShowPMDropdown(false);
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
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
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

          {/* Stage Tabs */}
          <div className="px-6 py-5 bg-white border-b border-slate-200">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
              <button
                onClick={() => setSelectedStage("Inception & Planning")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px]",
                  selectedStage === "Inception & Planning"
                    ? "bg-purple-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Inception & Planning
              </button>
              <button
                onClick={() => setSelectedStage("Delivery")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px]",
                  selectedStage === "Delivery"
                    ? "bg-purple-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Delivery
              </button>
              <button
                onClick={() => setSelectedStage("Closure")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px]",
                  selectedStage === "Closure"
                    ? "bg-purple-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Closure
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full">
              {/* Table Header */}
              <thead className="sticky top-0 z-10" style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                    Project Name
                  </th>
                  <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-48">
                    Program
                  </th>
                  <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-36">
                    Project Manager
                  </th>
                  <th className="px-3 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                    Start Date
                  </th>
                  <th className="px-3 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                    End Date
                  </th>
                  {(selectedStage === "Delivery" || selectedStage === "Closure") && (
                    <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                      Progress (%)
                    </th>
                  )}
                  <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                    Risk Level
                  </th>
                  <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-40">
                    System Status
                  </th>
                  <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                    Estimated Budget
                  </th>
                  <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-slate-600">{project.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`text-[12px] font-medium ${project.program ? "text-slate-600" : "text-slate-400"}`}>{project.program || "–"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-slate-600">{project.projectManager}</p>
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-[12px] text-slate-600">{project.startDate}</p>
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-[12px] text-slate-600">{project.endDate}</p>
                    </td>
                    {(selectedStage === "Delivery" || selectedStage === "Closure") && (
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-600">{project.progress}%</p>
                      </td>
                    )}
                    <td className="px-4 py-4">
                      <Badge className={cn("text-[12px] font-medium shadow-none border-0", getRiskColor(project.riskLevel))}>
                        {project.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={cn("text-[12px] font-medium shadow-none border-0", getStatusColor(project.status))}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-slate-600">{project.status === "Draft" ? "-" : project.estimatedBudget}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionDropdown(showActionDropdown === project.id ? null : project.id)}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={16} className="text-slate-600" />
                        </button>
                        {showActionDropdown === project.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowActionDropdown(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowActionDropdown(null);
                                }}
                              >
                                View Details
                              </button>
                              <button 
                                className={cn(
                                  "w-full px-4 py-2 text-left text-sm transition-colors",
                                  project.status === "Pending Approval"
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-slate-700 hover:bg-slate-50"
                                )}
                                disabled={project.status === "Pending Approval"}
                              >
                                Edit
                              </button>
                              <button 
                                className={cn(
                                  "w-full px-4 py-2 text-left text-sm transition-colors",
                                  project.status === "Pending Approval"
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-slate-700 hover:bg-slate-50"
                                )}
                                disabled={project.status === "Pending Approval"}
                              >
                                Duplicate
                              </button>
                              <button 
                                className={cn(
                                  "w-full px-4 py-2 text-left text-sm transition-colors",
                                  project.status === "Pending Approval"
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-red-600 hover:bg-red-50"
                                )}
                                disabled={project.status === "Pending Approval"}
                              >
                                Delete
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

            {filteredProjects.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-500">No projects found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}