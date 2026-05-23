import { useState } from "react";
import { Search, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Plus, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface DonorProfile {
  id: string;
  donorName: string;
  totalProposals: number;
  wonProposals: number;
  lostProposals: number;
  winRate: string;
  totalFunding: string;
  avgResponseTime: string;
  preferredSectors: string;
  relationshipStatus: "Excellent" | "Good" | "Fair" | "New";
  lastEngagement: string;
}

const mockDonors: DonorProfile[] = [
  {
    id: "DNR-001",
    donorName: "WHO",
    totalProposals: 15,
    wonProposals: 13,
    lostProposals: 2,
    winRate: "87%",
    totalFunding: "$2,150,000",
    avgResponseTime: "45 days",
    preferredSectors: "Health, Public Health",
    relationshipStatus: "Excellent",
    lastEngagement: "Jan 20, 2026"
  },
  {
    id: "DNR-002",
    donorName: "Gates Foundation",
    totalProposals: 12,
    wonProposals: 9,
    lostProposals: 3,
    winRate: "75%",
    totalFunding: "$3,200,000",
    avgResponseTime: "60 days",
    preferredSectors: "Agriculture, Health",
    relationshipStatus: "Good",
    lastEngagement: "Jan 10, 2026"
  },
  {
    id: "DNR-003",
    donorName: "UNESCO",
    totalProposals: 14,
    wonProposals: 11,
    lostProposals: 3,
    winRate: "79%",
    totalFunding: "$1,850,000",
    avgResponseTime: "50 days",
    preferredSectors: "Education, Culture",
    relationshipStatus: "Excellent",
    lastEngagement: "Jan 15, 2026"
  },
  {
    id: "DNR-004",
    donorName: "World Bank",
    totalProposals: 8,
    wonProposals: 6,
    lostProposals: 2,
    winRate: "75%",
    totalFunding: "$4,100,000",
    avgResponseTime: "90 days",
    preferredSectors: "Infrastructure, Education",
    relationshipStatus: "Good",
    lastEngagement: "Dec 20, 2025"
  },
  {
    id: "DNR-005",
    donorName: "UNICEF",
    totalProposals: 10,
    wonProposals: 7,
    lostProposals: 3,
    winRate: "70%",
    totalFunding: "$1,650,000",
    avgResponseTime: "55 days",
    preferredSectors: "Children, Health, Education",
    relationshipStatus: "Good",
    lastEngagement: "Nov 28, 2025"
  },
  {
    id: "DNR-006",
    donorName: "Green Climate Fund",
    totalProposals: 6,
    wonProposals: 4,
    lostProposals: 2,
    winRate: "67%",
    totalFunding: "$950,000",
    avgResponseTime: "75 days",
    preferredSectors: "Environment, Climate",
    relationshipStatus: "Fair",
    lastEngagement: "Nov 10, 2025"
  },
  {
    id: "DNR-007",
    donorName: "USAID",
    totalProposals: 11,
    wonProposals: 9,
    lostProposals: 2,
    winRate: "82%",
    totalFunding: "$2,800,000",
    avgResponseTime: "65 days",
    preferredSectors: "Health, Education, Agriculture",
    relationshipStatus: "Excellent",
    lastEngagement: "Oct 20, 2025"
  },
  {
    id: "DNR-008",
    donorName: "UNFPA",
    totalProposals: 7,
    wonProposals: 5,
    lostProposals: 2,
    winRate: "71%",
    totalFunding: "$1,100,000",
    avgResponseTime: "48 days",
    preferredSectors: "Health, Gender",
    relationshipStatus: "Good",
    lastEngagement: "Dec 15, 2025"
  },
  {
    id: "DNR-009",
    donorName: "WFP",
    totalProposals: 5,
    wonProposals: 3,
    lostProposals: 2,
    winRate: "60%",
    totalFunding: "$780,000",
    avgResponseTime: "52 days",
    preferredSectors: "Food Security, Agriculture",
    relationshipStatus: "Fair",
    lastEngagement: "Sep 15, 2025"
  },
  {
    id: "DNR-010",
    donorName: "European Commission",
    totalProposals: 3,
    wonProposals: 2,
    lostProposals: 1,
    winRate: "67%",
    totalFunding: "$1,450,000",
    avgResponseTime: "120 days",
    preferredSectors: "Governance, Human Rights",
    relationshipStatus: "New",
    lastEngagement: "Aug 10, 2025"
  },
];

const lessonsLearned = [
  {
    id: "1",
    donor: "WHO",
    lesson: "Emphasize community participation and local health systems strengthening",
    date: "Jan 2026",
    impact: "High"
  },
  {
    id: "2",
    donor: "Gates Foundation",
    lesson: "Include robust M&E framework with data-driven indicators",
    date: "Dec 2025",
    impact: "High"
  },
  {
    id: "3",
    donor: "UNESCO",
    lesson: "Highlight teacher training and curriculum development components",
    date: "Jan 2026",
    impact: "Medium"
  },
  {
    id: "4",
    donor: "World Bank",
    lesson: "Demonstrate sustainability and government co-financing",
    date: "Dec 2025",
    impact: "High"
  },
];

export function DonorIntelligence() {
  const [searchQuery, setSearchQuery] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState("All Relationships");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLessonsPanel, setShowLessonsPanel] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorProfile | null>(null);

  const getRelationshipColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-emerald-100 text-emerald-700";
      case "Good":
        return "bg-blue-100 text-blue-700";
      case "Fair":
        return "bg-amber-100 text-amber-700";
      case "New":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getWinRateColor = (winRate: string) => {
    const rate = parseInt(winRate);
    if (rate >= 80) return "text-emerald-600";
    if (rate >= 70) return "text-blue-600";
    return "text-amber-600";
  };

  const filteredDonors = mockDonors.filter((donor) => {
    const matchesSearch =
      donor.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.preferredSectors.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRelationship = relationshipFilter === "All Relationships" || donor.relationshipStatus === relationshipFilter;
    return matchesSearch && matchesRelationship;
  });

  const totalResults = filteredDonors.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentDonors = filteredDonors.slice(startIndex, endIndex);

  const handleAction = (action: string, donorId: string) => {
    const donor = mockDonors.find(d => d.id === donorId);
    if (action === "AddNote") {
      setSelectedDonor(donor || null);
      setShowAddNoteModal(true);
    } else {
      console.log(`${action} donor ${donorId}`);
    }
    setActiveDropdown(null);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Donor Intelligence</h1>
            <p className="text-sm text-slate-600 mt-1">Lessons learned, behavioral history, and relationship logs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLessonsPanel(!showLessonsPanel)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <AlertCircle size={18} />
              <span>Lessons Learned</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors">
              <Plus size={18} />
              <span>Add Donor</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by donor name or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={relationshipFilter}
            onChange={(e) => setRelationshipFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Relationships</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
            <option>New</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex">
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#0B01D0]">
                <th className="px-6 py-4 text-left text-xs text-white">Donor ID</th>
                <th className="px-6 py-4 text-left text-xs text-white">Donor Name</th>
                <th className="px-6 py-4 text-left text-xs text-white">Proposals</th>
                <th className="px-6 py-4 text-left text-xs text-white">Win Rate</th>
                <th className="px-6 py-4 text-left text-xs text-white">Total Funding</th>
                <th className="px-6 py-4 text-left text-xs text-white">Avg Response Time</th>
                <th className="px-6 py-4 text-left text-xs text-white">Preferred Sectors</th>
                <th className="px-6 py-4 text-left text-xs text-white">Relationship</th>
                <th className="px-6 py-4 text-left text-xs text-white">Last Engagement</th>
                <th className="px-6 py-4 text-left text-xs text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDonors.map((donor, index) => (
                <tr
                  key={donor.id}
                  className={cn(
                    "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  )}
                >
                  <td className="px-6 py-4 text-[12px] font-semibold text-[#0B01D0]">{donor.id}</td>
                  <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{donor.donorName}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-600">
                    {donor.wonProposals}/{donor.totalProposals}
                  </td>
                  <td className="px-6 py-4 text-[12px] font-semibold">
                    <span className={getWinRateColor(donor.winRate)}>{donor.winRate}</span>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-slate-900">{donor.totalFunding}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-600">{donor.avgResponseTime}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-600">{donor.preferredSectors}</td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-block px-3 py-1 rounded text-xs font-medium", getRelationshipColor(donor.relationshipStatus))}>
                      {donor.relationshipStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-slate-600">{donor.lastEngagement}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === donor.id ? null : donor.id)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        <MoreHorizontal size={16} className="text-slate-600" />
                      </button>
                      {activeDropdown === donor.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                          <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                            <button
                              onClick={() => handleAction("View", donor.id)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye size={14} />
                              View Full Profile
                            </button>
                            <button
                              onClick={() => handleAction("AddNote", donor.id)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Plus size={14} />
                              Add Relationship Note
                            </button>
                            <button
                              onClick={() => handleAction("ViewHistory", donor.id)}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <TrendingUp size={14} />
                              View Engagement History
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

        {/* Lessons Learned Panel */}
        {showLessonsPanel && (
          <div className="w-96 border-l border-slate-200 bg-slate-50 overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold text-slate-900">Lessons Learned</h3>
              <button
                onClick={() => setShowLessonsPanel(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {lessonsLearned.map((lesson) => (
                <div key={lesson.id} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-[#0B01D0]">{lesson.donor}</span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded",
                      lesson.impact === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {lesson.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{lesson.lesson}</p>
                  <p className="text-xs text-slate-500">{lesson.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
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

      {/* Add Relationship Note Modal */}
      {showAddNoteModal && selectedDonor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-8 py-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Add Relationship Note</h2>
              <p className="text-sm text-slate-600 mt-1">Donor: {selectedDonor.donorName}</p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Note Type
                </label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent">
                  <option>Lesson Learned</option>
                  <option>Meeting Notes</option>
                  <option>Behavioral Observation</option>
                  <option>Preference Update</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  placeholder="Enter your notes about this donor relationship..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Impact Level
                </label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddNoteModal(false);
                  setSelectedDonor(null);
                }}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddNoteModal(false);
                  setSelectedDonor(null);
                }}
                className="px-6 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorIntelligence;
