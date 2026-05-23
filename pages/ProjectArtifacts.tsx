import { useState } from "react";
import { Search, Download, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Upload, Filter } from "lucide-react";
import { cn } from "../lib/utils";

interface Artifact {
  id: string;
  title: string;
  type: "Closure Report" | "Policy Brief" | "Funder Deliverable" | "Annual Report" | "Impact Assessment";
  projectName: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  donor: string;
  sector: string;
}

const mockArtifacts: Artifact[] = [
  {
    id: "ART-2026-001",
    title: "Final Project Closure Report - Health Initiative 2025",
    type: "Closure Report",
    projectName: "Community Health Initiative - Phase 2",
    uploadedBy: "Sarah Johnson",
    uploadDate: "Jan 22, 2026",
    fileSize: "2.4 MB",
    donor: "WHO",
    sector: "Health"
  },
  {
    id: "ART-2026-002",
    title: "Policy Brief - Rural Education Access",
    type: "Policy Brief",
    projectName: "Girls Education Empowerment Program",
    uploadedBy: "Michael Chen",
    uploadDate: "Jan 18, 2026",
    fileSize: "1.8 MB",
    donor: "UNESCO",
    sector: "Education"
  },
  {
    id: "ART-2026-003",
    title: "Q4 2025 Progress Report",
    type: "Funder Deliverable",
    projectName: "Agricultural Innovation for Smallholders",
    uploadedBy: "Emily Davis",
    uploadDate: "Jan 12, 2026",
    fileSize: "3.1 MB",
    donor: "Gates Foundation",
    sector: "Agriculture"
  },
  {
    id: "ART-2025-128",
    title: "Annual Impact Assessment 2025",
    type: "Impact Assessment",
    projectName: "Environmental Conservation Project",
    uploadedBy: "David Wilson",
    uploadDate: "Dec 28, 2025",
    fileSize: "4.5 MB",
    donor: "Green Fund",
    sector: "Environment"
  },
  {
    id: "ART-2025-125",
    title: "Policy Brief - Youth Employment Pathways",
    type: "Policy Brief",
    projectName: "Youth Employment Skills Training",
    uploadedBy: "Sarah Johnson",
    uploadDate: "Dec 15, 2025",
    fileSize: "2.1 MB",
    donor: "World Bank",
    sector: "Education"
  },
  {
    id: "ART-2025-122",
    title: "Mid-Term Evaluation Report",
    type: "Funder Deliverable",
    projectName: "Maternal Health Improvement Program",
    uploadedBy: "Michael Chen",
    uploadDate: "Dec 10, 2025",
    fileSize: "3.8 MB",
    donor: "UNFPA",
    sector: "Health"
  },
  {
    id: "ART-2025-118",
    title: "Final Closure Report - Water & Sanitation",
    type: "Closure Report",
    projectName: "Water & Sanitation Infrastructure",
    uploadedBy: "Emily Davis",
    uploadDate: "Nov 28, 2025",
    fileSize: "5.2 MB",
    donor: "UNICEF",
    sector: "Infrastructure"
  },
  {
    id: "ART-2025-115",
    title: "Climate Resilience Policy Brief",
    type: "Policy Brief",
    projectName: "Climate Resilience Building",
    uploadedBy: "David Wilson",
    uploadDate: "Nov 15, 2025",
    fileSize: "1.5 MB",
    donor: "Green Climate Fund",
    sector: "Environment"
  },
  {
    id: "ART-2025-112",
    title: "Annual Report 2025",
    type: "Annual Report",
    projectName: "Rural Education Access Enhancement",
    uploadedBy: "Sarah Johnson",
    uploadDate: "Nov 5, 2025",
    fileSize: "6.3 MB",
    donor: "USAID",
    sector: "Education"
  },
  {
    id: "ART-2025-108",
    title: "Baseline Assessment Report",
    type: "Funder Deliverable",
    projectName: "Food Security & Nutrition Program",
    uploadedBy: "Michael Chen",
    uploadDate: "Oct 20, 2025",
    fileSize: "2.9 MB",
    donor: "WFP",
    sector: "Agriculture"
  },
];

export function ProjectArtifacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [sectorFilter, setSectorFilter] = useState("All Sectors");
  const [donorFilter, setDonorFilter] = useState("All Donors");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Closure Report":
        return "bg-purple-100 text-purple-700";
      case "Policy Brief":
        return "bg-blue-100 text-blue-700";
      case "Funder Deliverable":
        return "bg-emerald-100 text-emerald-700";
      case "Annual Report":
        return "bg-amber-100 text-amber-700";
      case "Impact Assessment":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredArtifacts = mockArtifacts.filter((artifact) => {
    const matchesSearch =
      artifact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artifact.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artifact.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All Types" || artifact.type === typeFilter;
    const matchesSector = sectorFilter === "All Sectors" || artifact.sector === sectorFilter;
    const matchesDonor = donorFilter === "All Donors" || artifact.donor === donorFilter;
    return matchesSearch && matchesType && matchesSector && matchesDonor;
  });

  const totalResults = filteredArtifacts.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentArtifacts = filteredArtifacts.slice(startIndex, endIndex);

  const handleAction = (action: string, artifactId: string) => {
    console.log(`${action} artifact ${artifactId}`);
    setActiveDropdown(null);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Project Artifacts</h1>
            <p className="text-sm text-slate-600 mt-1">Closure reports, policy briefs, and funder deliverables</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors">
            <Upload size={18} />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, ID, or project name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Types</option>
            <option>Closure Report</option>
            <option>Policy Brief</option>
            <option>Funder Deliverable</option>
            <option>Annual Report</option>
            <option>Impact Assessment</option>
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Sectors</option>
            <option>Health</option>
            <option>Education</option>
            <option>Agriculture</option>
            <option>Environment</option>
            <option>Infrastructure</option>
          </select>

          <select
            value={donorFilter}
            onChange={(e) => setDonorFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Donors</option>
            <option>WHO</option>
            <option>UNESCO</option>
            <option>Gates Foundation</option>
            <option>World Bank</option>
            <option>UNICEF</option>
            <option>USAID</option>
            <option>Green Fund</option>
            <option>UNFPA</option>
            <option>WFP</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0B01D0]">
              <th className="px-6 py-4 text-left text-xs text-white">Document ID</th>
              <th className="px-6 py-4 text-left text-xs text-white">Title</th>
              <th className="px-6 py-4 text-left text-xs text-white">Type</th>
              <th className="px-6 py-4 text-left text-xs text-white">Project Name</th>
              <th className="px-6 py-4 text-left text-xs text-white">Donor</th>
              <th className="px-6 py-4 text-left text-xs text-white">Sector</th>
              <th className="px-6 py-4 text-left text-xs text-white">Uploaded By</th>
              <th className="px-6 py-4 text-left text-xs text-white">Upload Date</th>
              <th className="px-6 py-4 text-left text-xs text-white">File Size</th>
              <th className="px-6 py-4 text-left text-xs text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentArtifacts.map((artifact, index) => (
              <tr
                key={artifact.id}
                className={cn(
                  "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-6 py-4 text-[12px] font-semibold text-[#0B01D0]">{artifact.id}</td>
                <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{artifact.title}</td>
                <td className="px-6 py-4">
                  <span className={cn("inline-block px-3 py-1 rounded text-xs font-medium", getTypeColor(artifact.type))}>
                    {artifact.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{artifact.projectName}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{artifact.donor}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{artifact.sector}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{artifact.uploadedBy}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{artifact.uploadDate}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{artifact.fileSize}</td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === artifact.id ? null : artifact.id)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <MoreHorizontal size={16} className="text-slate-600" />
                    </button>
                    {activeDropdown === artifact.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                          <button
                            onClick={() => handleAction("View", artifact.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Eye size={14} />
                            View Document
                          </button>
                          <button
                            onClick={() => handleAction("Download", artifact.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Download size={14} />
                            Download
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
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-slate-700"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-600">
            {startIndex + 1}-{endIndex} of {totalResults} results
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg transition-colors text-sm",
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-slate-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectArtifacts;
