import { useState } from "react";
import { Search, ChevronDown, Plus, AlertCircle, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/utils";
import { AddNewOpportunityForm } from "./AddNewOpportunityForm";

// Types
type Stage = "Identified Opportunity" | "Proposal Submitted" | "Active Grant" | "Closed";
type ComplianceStatus = "On Track" | "At Risk" | "Overdue";

interface Grant {
  id: string;
  opportunityName: string;
  donor: string;
  stage: Stage;
  amount: number;
  nextDeadline: string;
  deadlineDate: Date;
  complianceStatus: ComplianceStatus;
  theme: string;
}

// Mock Data
const MOCK_GRANTS: Grant[] = [
  {
    id: "GR-001",
    opportunityName: "Youth Employment and Skills Development Initiative",
    donor: "Ford Foundation",
    stage: "Active Grant",
    amount: 2500000,
    nextDeadline: "Dec 15, 2025 - Quarterly Report",
    deadlineDate: new Date("2025-12-15"),
    complianceStatus: "On Track",
    theme: "Economic Development"
  },
  {
    id: "GR-002",
    opportunityName: "Climate Resilience Fund",
    donor: "Bill & Melinda Gates Foundation",
    stage: "Proposal Submitted",
    amount: 1800000,
    nextDeadline: "Jan 10, 2026 - Decision Expected",
    deadlineDate: new Date("2026-01-10"),
    complianceStatus: "On Track",
    theme: "Climate & Environment"
  },
  {
    id: "GR-003",
    opportunityName: "Digital Infrastructure Expansion Program",
    donor: "World Bank",
    stage: "Active Grant",
    amount: 5000000,
    nextDeadline: "Dec 5, 2025 - Financial Report",
    deadlineDate: new Date("2025-12-05"),
    complianceStatus: "At Risk",
    theme: "Digital Economy"
  },
  {
    id: "GR-004",
    opportunityName: "Women Empowerment Through Agriculture",
    donor: "USAID",
    stage: "Active Grant",
    amount: 3200000,
    nextDeadline: "Nov 28, 2025 - Progress Report",
    deadlineDate: new Date("2025-11-28"),
    complianceStatus: "Overdue",
    theme: "Gender & Agriculture"
  },
  {
    id: "GR-005",
    opportunityName: "Health Systems Strengthening Grant",
    donor: "Global Fund",
    stage: "Identified Opportunity",
    amount: 4500000,
    nextDeadline: "Jan 20, 2026 - Concept Note Due",
    deadlineDate: new Date("2026-01-20"),
    complianceStatus: "On Track",
    theme: "Health"
  },
  {
    id: "GR-006",
    opportunityName: "Education Access and Quality Improvement",
    donor: "Ford Foundation",
    stage: "Proposal Submitted",
    amount: 1500000,
    nextDeadline: "Dec 20, 2025 - Proposal Review",
    deadlineDate: new Date("2025-12-20"),
    complianceStatus: "On Track",
    theme: "Education"
  },
  {
    id: "GR-007",
    opportunityName: "Regional Trade Integration Study",
    donor: "African Development Bank",
    stage: "Active Grant",
    amount: 800000,
    nextDeadline: "Dec 1, 2025 - Interim Report",
    deadlineDate: new Date("2025-12-01"),
    complianceStatus: "At Risk",
    theme: "Economic Development"
  },
  {
    id: "GR-008",
    opportunityName: "Renewable Energy Transition Framework",
    donor: "World Bank",
    stage: "Closed",
    amount: 2200000,
    nextDeadline: "Completed - Oct 30, 2025",
    deadlineDate: new Date("2025-10-30"),
    complianceStatus: "On Track",
    theme: "Climate & Environment"
  },
  {
    id: "GR-009",
    opportunityName: "Innovation Hub Development",
    donor: "Bill & Melinda Gates Foundation",
    stage: "Identified Opportunity",
    amount: 1200000,
    nextDeadline: "Feb 1, 2026 - LOI Submission",
    deadlineDate: new Date("2026-02-01"),
    complianceStatus: "On Track",
    theme: "Digital Economy"
  },
  {
    id: "GR-010",
    opportunityName: "Community Health Worker Training Program",
    donor: "USAID",
    stage: "Active Grant",
    amount: 950000,
    nextDeadline: "Dec 10, 2025 - Activity Report",
    deadlineDate: new Date("2025-12-10"),
    complianceStatus: "On Track",
    theme: "Health"
  }
];

const STAGES = ["All Stages", "Identified Opportunity", "Proposal Submitted", "Active Grant", "Closed"];
const THEMES = ["All Themes", "Economic Development", "Climate & Environment", "Digital Economy", "Gender & Agriculture", "Health", "Education"];
const STATUSES = ["All Status", "On Track", "At Risk", "Overdue", "Deadline Approaching"];

export function GrantPipelineCompliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [themeFilter, setThemeFilter] = useState("All Themes");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Helper function to check if deadline is approaching (within 14 days)
  const isDeadlineApproaching = (deadlineDate: Date): boolean => {
    const today = new Date();
    const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil > 0 && daysUntil <= 14;
  };

  // Filter grants
  const filteredGrants = MOCK_GRANTS.filter((grant) => {
    const matchesSearch = 
      searchQuery === "" ||
      grant.opportunityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.theme.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = stageFilter === "All Stages" || grant.stage === stageFilter;
    const matchesTheme = themeFilter === "All Themes" || grant.theme === themeFilter;
    
    let matchesStatus = true;
    if (statusFilter === "On Track" || statusFilter === "At Risk" || statusFilter === "Overdue") {
      matchesStatus = grant.complianceStatus === statusFilter;
    } else if (statusFilter === "Deadline Approaching") {
      matchesStatus = isDeadlineApproaching(grant.deadlineDate);
    }

    return matchesSearch && matchesStage && matchesTheme && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-700";
      case "At Risk":
        return "bg-amber-100 text-amber-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Get stage badge color
  const getStageColor = (stage: Stage) => {
    switch (stage) {
      case "Identified Opportunity":
        return "bg-blue-100 text-blue-700";
      case "Proposal Submitted":
        return "bg-purple-100 text-purple-700";
      case "Active Grant":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate statistics
  const totalPipeline = MOCK_GRANTS.filter(g => g.stage === "Identified Opportunity" || g.stage === "Proposal Submitted")
    .reduce((sum, g) => sum + g.amount, 0);
  const activeGrants = MOCK_GRANTS.filter(g => g.stage === "Active Grant").length;
  const atRiskCount = MOCK_GRANTS.filter(g => g.complianceStatus === "At Risk" || g.complianceStatus === "Overdue").length;

  const handleSave = (data: any) => {
    console.log("Saving grant data:", data);
    // Here you would typically save to a database or state management
    setShowForm(false);
  };

  // If form is shown, render the form instead of the table
  if (showForm) {
    return <AddNewOpportunityForm onBack={() => setShowForm(false)} onSave={handleSave} />;
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-slate-900">Grant Pipeline & Compliance</h1>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">Add New Opportunity</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-xs text-blue-700 mb-1">Total Pipeline Value</div>
            <div className="text-2xl font-semibold text-blue-900">{formatCurrency(totalPipeline)}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-xs text-green-700 mb-1">Active Grants</div>
            <div className="text-2xl font-semibold text-green-900">{activeGrants}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
            <div className="text-xs text-amber-700 mb-1">At Risk / Overdue</div>
            <div className="text-2xl font-semibold text-amber-900">{atRiskCount}</div>
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
            {/* Stage Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStageDropdown(!showStageDropdown);
                  setShowThemeDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{stageFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showStageDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStageDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {STAGES.map((stage) => (
                      <button
                        key={stage}
                        onClick={() => {
                          setStageFilter(stage);
                          setShowStageDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          stageFilter === stage ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme/Program Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowThemeDropdown(!showThemeDropdown);
                  setShowStageDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{themeFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showThemeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {THEMES.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => {
                          setThemeFilter(theme);
                          setShowThemeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          themeFilter === theme ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {theme}
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
                  setShowStageDropdown(false);
                  setShowThemeDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{statusFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          statusFilter === status ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
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
          <thead className="sticky top-0 z-10" style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Grant ID
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 min-w-[200px]">
                Opportunity/Grant Name
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Donor
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-40">
                Stage
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Theme/Program
              </th>
              <th className="px-4 py-4 text-right text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Amount
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 min-w-[180px]">
                Next Deadline
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Compliance Status
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredGrants.length > 0 ? (
              filteredGrants.map((grant) => {
                const deadlineApproaching = isDeadlineApproaching(grant.deadlineDate);
                return (
                  <tr key={grant.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-600">{grant.id}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] font-medium text-slate-900">{grant.opportunityName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-blue-600 hover:text-blue-800 cursor-pointer">{grant.donor}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-block px-2 py-1 rounded text-[12px] font-medium", getStageColor(grant.stage))}>
                        {grant.stage}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[12px] text-slate-600">{grant.theme}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-[12px] font-medium text-slate-900">{formatCurrency(grant.amount)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {deadlineApproaching && grant.stage !== "Closed" && (
                          <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
                        )}
                        <p className={cn(
                          "text-[12px]",
                          deadlineApproaching && grant.stage !== "Closed" ? "text-amber-700 font-medium" : "text-slate-600"
                        )}>
                          {grant.nextDeadline}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-block px-2 py-1 rounded text-[12px] font-medium", getStatusColor(grant.complianceStatus))}>
                        {grant.complianceStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === grant.id ? null : grant.id)}
                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={16} className="text-slate-600" />
                        </button>
                        {showActionMenu === grant.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                onClick={() => {
                                  setShowActionMenu(null);
                                  // View functionality would go here
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setShowActionMenu(null);
                                  // Edit functionality would go here
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setShowActionMenu(null);
                                  // Delete functionality would go here
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <p className="text-sm text-slate-500">No grants found matching your criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}