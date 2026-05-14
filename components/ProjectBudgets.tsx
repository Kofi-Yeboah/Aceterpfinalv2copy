import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Eye, Calendar } from "lucide-react";
import { ProjectBudgetDetailsModal } from "./ProjectBudgetDetailsModal";

interface ProjectBudget {
  id: number;
  projectName: string;
  projectType: "New Construction" | "Software Implementation" | "R&D" | "Infrastructure";
  projectManager: string;
  startDate: string;
  endDate: string;
  totalBudget: string;
  spent: string;
  remaining: string;
  percentage: number;
  status: "On Track" | "Over Budget" | "Under Budget" | "At Risk";
}

const projectBudgetData: ProjectBudget[] = [
  { 
    id: 1, 
    projectName: "New HQ Building Construction", 
    projectType: "New Construction", 
    projectManager: "Sarah Johnson",
    startDate: "Jan 2024",
    endDate: "Dec 2025",
    totalBudget: "$5,200,000", 
    spent: "$2,850,000", 
    remaining: "$2,350,000", 
    percentage: 55, 
    status: "On Track" 
  },
  { 
    id: 2, 
    projectName: "ERP System Implementation", 
    projectType: "Software Implementation", 
    projectManager: "Michael Chen",
    startDate: "Mar 2024",
    endDate: "Sep 2024",
    totalBudget: "$850,000", 
    spent: "$720,000", 
    remaining: "$130,000", 
    percentage: 85, 
    status: "On Track" 
  },
  { 
    id: 3, 
    projectName: "AI Research Initiative", 
    projectType: "R&D", 
    projectManager: "Dr. Emily Rodriguez",
    startDate: "Feb 2024",
    endDate: "Feb 2025",
    totalBudget: "$1,200,000", 
    spent: "$950,000", 
    remaining: "$250,000", 
    percentage: 79, 
    status: "On Track" 
  },
  { 
    id: 4, 
    projectName: "Data Center Upgrade", 
    projectType: "Infrastructure", 
    projectManager: "James Wilson",
    startDate: "Apr 2024",
    endDate: "Aug 2024",
    totalBudget: "$675,000", 
    spent: "$710,000", 
    remaining: "-$35,000", 
    percentage: 105, 
    status: "Over Budget" 
  },
  { 
    id: 5, 
    projectName: "Mobile App Development", 
    projectType: "Software Implementation", 
    projectManager: "Lisa Anderson",
    startDate: "May 2024",
    endDate: "Nov 2024",
    totalBudget: "$425,000", 
    spent: "$280,000", 
    remaining: "$145,000", 
    percentage: 66, 
    status: "On Track" 
  },
  { 
    id: 6, 
    projectName: "Product Innovation Lab", 
    projectType: "R&D", 
    projectManager: "Dr. Robert Kim",
    startDate: "Jan 2024",
    endDate: "Jun 2025",
    totalBudget: "$2,100,000", 
    spent: "$1,150,000", 
    remaining: "$950,000", 
    percentage: 55, 
    status: "Under Budget" 
  },
  { 
    id: 7, 
    projectName: "Regional Office Expansion", 
    projectType: "New Construction", 
    projectManager: "Amanda Foster",
    startDate: "Jun 2024",
    endDate: "Mar 2025",
    totalBudget: "$1,850,000", 
    spent: "$1,100,000", 
    remaining: "$750,000", 
    percentage: 59, 
    status: "At Risk" 
  },
  { 
    id: 8, 
    projectName: "Cloud Migration Project", 
    projectType: "Infrastructure", 
    projectManager: "David Park",
    startDate: "Mar 2024",
    endDate: "Dec 2024",
    totalBudget: "$950,000", 
    spent: "$580,000", 
    remaining: "$370,000", 
    percentage: 61, 
    status: "On Track" 
  },
];

export function ProjectBudgets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedProject, setSelectedProject] = useState<ProjectBudget | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-50 text-green-700";
      case "Over Budget": return "bg-red-50 text-red-700";
      case "Under Budget": return "bg-blue-50 text-blue-700";
      case "At Risk": return "bg-orange-50 text-orange-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Project Budgets</h1>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by project name, manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Project Type Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[180px] justify-between">
              <span>{selectedType}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[120px] justify-between">
              <Calendar className="w-4 h-4" />
              <span>{selectedYear}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedStatus}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Add Project Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0B01D0] text-white">
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Project Name</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Project Type</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Project Manager</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Timeline</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Total Budget</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Spent</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Remaining</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Usage %</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Status</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {projectBudgetData.map((project, index) => (
              <tr 
                key={project.id}
                className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                  index % 2 === 1 ? 'bg-slate-50/50' : ''
                }`}
              >
                <td className="px-6 py-4 text-[12px] text-slate-900 font-medium">{project.projectName}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{project.projectType}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{project.projectManager}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">
                  {project.startDate} - {project.endDate}
                </td>
                <td className="px-6 py-4 text-[12px] text-slate-900 font-medium">{project.totalBudget}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{project.spent}</td>
                <td className={`px-6 py-4 text-[12px] font-medium ${
                  project.remaining.startsWith('-') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {project.remaining}
                </td>
                <td className="px-6 py-4 text-[12px] text-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[80px]">
                      <div 
                        className={`h-2 rounded-full ${
                          project.percentage > 100 ? 'bg-red-500' : 
                          project.percentage > 85 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(project.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="font-medium">{project.percentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[12px]">
                  <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[12px]">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedProject && (
        <ProjectBudgetDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
