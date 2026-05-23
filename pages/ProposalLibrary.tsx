import { useState } from "react";
import { Search, Download, Eye, MoreHorizontal, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { cn } from "../lib/utils";

interface Proposal {
  id: string;
  title: string;
  donor: string;
  sector: string;
  budgetSize: string;
  status: "Won" | "Lost" | "Pending";
  submittedDate: string;
  decisionDate: string;
  leadWriter: string;
  partnership: string;
}

const mockProposals: Proposal[] = [
  {
    id: "PROP-2026-001",
    title: "Community Health Initiative - Phase 2",
    donor: "WHO",
    sector: "Health",
    budgetSize: "$250,000",
    status: "Won",
    submittedDate: "Dec 15, 2025",
    decisionDate: "Jan 20, 2026",
    leadWriter: "Sarah Johnson",
    partnership: "Ministry of Health"
  },
  {
    id: "PROP-2025-098",
    title: "Girls Education Empowerment Program",
    donor: "UNESCO",
    sector: "Education",
    budgetSize: "$180,000",
    status: "Won",
    submittedDate: "Nov 20, 2025",
    decisionDate: "Jan 15, 2026",
    leadWriter: "Michael Chen",
    partnership: "Education Ministry"
  },
  {
    id: "PROP-2025-095",
    title: "Agricultural Innovation for Smallholders",
    donor: "Gates Foundation",
    sector: "Agriculture",
    budgetSize: "$320,000",
    status: "Lost",
    submittedDate: "Oct 10, 2025",
    decisionDate: "Jan 10, 2026",
    leadWriter: "Emily Davis",
    partnership: "Farmers Association"
  },
  {
    id: "PROP-2025-092",
    title: "Environmental Conservation Project",
    donor: "Green Fund",
    sector: "Environment",
    budgetSize: "$150,000",
    status: "Won",
    submittedDate: "Sep 25, 2025",
    decisionDate: "Jan 5, 2026",
    leadWriter: "David Wilson",
    partnership: "Wildlife Trust"
  },
  {
    id: "PROP-2025-088",
    title: "Youth Employment Skills Training",
    donor: "World Bank",
    sector: "Education",
    budgetSize: "$420,000",
    status: "Won",
    submittedDate: "Aug 15, 2025",
    decisionDate: "Dec 20, 2025",
    leadWriter: "Sarah Johnson",
    partnership: "Labor Department"
  },
  {
    id: "PROP-2025-085",
    title: "Maternal Health Improvement Program",
    donor: "UNFPA",
    sector: "Health",
    budgetSize: "$280,000",
    status: "Won",
    submittedDate: "Jul 30, 2025",
    decisionDate: "Dec 15, 2025",
    leadWriter: "Michael Chen",
    partnership: "Health Partners Network"
  },
  {
    id: "PROP-2025-082",
    title: "Water & Sanitation Infrastructure",
    donor: "UNICEF",
    sector: "Infrastructure",
    budgetSize: "$500,000",
    status: "Lost",
    submittedDate: "Jun 20, 2025",
    decisionDate: "Nov 30, 2025",
    leadWriter: "Emily Davis",
    partnership: "Water Authority"
  },
  {
    id: "PROP-2025-078",
    title: "Climate Resilience Building",
    donor: "Green Climate Fund",
    sector: "Environment",
    budgetSize: "$380,000",
    status: "Won",
    submittedDate: "May 15, 2025",
    decisionDate: "Nov 10, 2025",
    leadWriter: "David Wilson",
    partnership: "Climate Action Group"
  },
  {
    id: "PROP-2025-075",
    title: "Rural Education Access Enhancement",
    donor: "USAID",
    sector: "Education",
    budgetSize: "$220,000",
    status: "Won",
    submittedDate: "Apr 25, 2025",
    decisionDate: "Oct 20, 2025",
    leadWriter: "Sarah Johnson",
    partnership: "Rural Schools Network"
  },
  {
    id: "PROP-2025-072",
    title: "Food Security & Nutrition Program",
    donor: "WFP",
    sector: "Agriculture",
    budgetSize: "$310,000",
    status: "Pending",
    submittedDate: "Jan 15, 2026",
    decisionDate: "-",
    leadWriter: "Michael Chen",
    partnership: "Food Alliance"
  },
];

export function ProposalLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [donorFilter, setDonorFilter] = useState("All Donors");
  const [sectorFilter, setSectorFilter] = useState("All Sectors");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [budgetFilter, setBudgetFilter] = useState("All Budget Sizes");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Won":
        return "bg-emerald-100 text-emerald-700";
      case "Lost":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredProposals = mockProposals.filter((proposal) => {
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.donor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDonor = donorFilter === "All Donors" || proposal.donor === donorFilter;
    const matchesSector = sectorFilter === "All Sectors" || proposal.sector === sectorFilter;
    const matchesStatus = statusFilter === "All Statuses" || proposal.status === statusFilter;
    
    // Budget filter logic
    let matchesBudget = true;
    if (budgetFilter !== "All Budget Sizes") {
      const budgetValue = parseInt(proposal.budgetSize.replace(/[$,]/g, ""));
      if (budgetFilter === "Under $100K") matchesBudget = budgetValue < 100000;
      else if (budgetFilter === "$100K - $250K") matchesBudget = budgetValue >= 100000 && budgetValue <= 250000;
      else if (budgetFilter === "$250K - $500K") matchesBudget = budgetValue >= 250000 && budgetValue <= 500000;
      else if (budgetFilter === "Over $500K") matchesBudget = budgetValue > 500000;
    }
    
    return matchesSearch && matchesDonor && matchesSector && matchesStatus && matchesBudget;
  });

  const totalResults = filteredProposals.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentProposals = filteredProposals.slice(startIndex, endIndex);

  const handleAction = (action: string, proposalId: string) => {
    console.log(`${action} proposal ${proposalId}`);
    setActiveDropdown(null);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Proposal Library</h1>
            <p className="text-sm text-slate-600 mt-1">Search past proposals to avert reinventing the wheel</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors">
            <Download size={18} />
            <span>Export Library</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, ID, or donor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Budget Sizes</option>
            <option>Under $100K</option>
            <option>$100K - $250K</option>
            <option>$250K - $500K</option>
            <option>Over $500K</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Statuses</option>
            <option>Won</option>
            <option>Lost</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0B01D0]">
              <th className="px-6 py-4 text-left text-xs text-white">Proposal ID</th>
              <th className="px-6 py-4 text-left text-xs text-white">Title</th>
              <th className="px-6 py-4 text-left text-xs text-white">Donor</th>
              <th className="px-6 py-4 text-left text-xs text-white">Sector</th>
              <th className="px-6 py-4 text-left text-xs text-white">Budget Size</th>
              <th className="px-6 py-4 text-left text-xs text-white">Status</th>
              <th className="px-6 py-4 text-left text-xs text-white">Submitted Date</th>
              <th className="px-6 py-4 text-left text-xs text-white">Decision Date</th>
              <th className="px-6 py-4 text-left text-xs text-white">Lead Writer</th>
              <th className="px-6 py-4 text-left text-xs text-white">Partnership</th>
              <th className="px-6 py-4 text-left text-xs text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProposals.map((proposal, index) => (
              <tr
                key={proposal.id}
                className={cn(
                  "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-6 py-4 text-[12px] font-semibold text-[#0B01D0]">{proposal.id}</td>
                <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{proposal.title}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.donor}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.sector}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{proposal.budgetSize}</td>
                <td className="px-6 py-4">
                  <span className={cn("inline-block px-3 py-1 rounded text-xs font-medium", getStatusColor(proposal.status))}>
                    {proposal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.submittedDate}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.decisionDate}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.leadWriter}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{proposal.partnership}</td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === proposal.id ? null : proposal.id)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <MoreHorizontal size={16} className="text-slate-600" />
                    </button>
                    {activeDropdown === proposal.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                          <button
                            onClick={() => handleAction("View", proposal.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Eye size={14} />
                            View Proposal
                          </button>
                          <button
                            onClick={() => handleAction("Download", proposal.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Download size={14} />
                            Download
                          </button>
                          <button
                            onClick={() => handleAction("Reuse", proposal.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <FileText size={14} />
                            Reuse Template
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

export default ProposalLibrary;
