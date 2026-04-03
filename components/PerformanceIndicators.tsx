import { useState } from "react";
import { Search, Download, Upload, ChevronDown, Plus, MoreHorizontal } from "lucide-react";
import { AddNewIndicator } from "./AddNewIndicator";
import { ViewIndicator } from "./ViewIndicator";

interface Indicator {
  id: string;
  level: string;
  name: string;
  project: string;
  unit: string;
  dataSource: string;
  frequency: string;
  target: number;
  actual: number;
  status: "On Track" | "At Risk" | "Behind";
}

export function PerformanceIndicators() {
  const [searchQuery, setSearchQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showAddNewIndicator, setShowAddNewIndicator] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [viewingIndicator, setViewingIndicator] = useState<any | null>(null);

  // If viewing indicator details, show ViewIndicator component
  if (viewingIndicator) {
    return <ViewIndicator indicator={viewingIndicator} onBack={() => setViewingIndicator(null)} />;
  }

  // If showing Add New Indicator, show that component
  if (showAddNewIndicator) {
    return <AddNewIndicator onBack={() => setShowAddNewIndicator(false)} />;
  }

  const indicators: Indicator[] = [
    {
      id: "IND-001",
      level: "Program level indicator",
      name: "Policy briefs cited in media",
      project: "West Africa Regional Integration Study",
      unit: "Number",
      dataSource: "Theory of Change",
      frequency: "Quarterly",
      target: 20,
      actual: 18,
      status: "On Track"
    },
    {
      id: "IND-002",
      level: "Institutional KPI",
      name: "Overall budget variance",
      project: "Digital Economy Policy Brief Series",
      unit: "%",
      dataSource: "Logical Framework",
      frequency: "Quarterly",
      target: 5,
      actual: 3,
      status: "On Track"
    },
    {
      id: "IND-003",
      level: "Project level indicator",
      name: "Youth trained in digital skills",
      project: "Youth Employment Skills Development",
      unit: "Number",
      dataSource: "Results Framework",
      frequency: "Monthly",
      target: 500,
      actual: 420,
      status: "At Risk"
    },
    {
      id: "IND-004",
      level: "Project level indicator",
      name: "Donor reporting deadlines met",
      project: "Climate Finance Readiness Program",
      unit: "%",
      dataSource: "Project Impact Assessment",
      frequency: "Annually",
      target: 100,
      actual: 85,
      status: "At Risk"
    },
    {
      id: "IND-005",
      level: "Institutional KPI",
      name: "Staff satisfaction score",
      project: "Healthcare System Strengthening Project",
      unit: "Score (1-5)",
      dataSource: "Logical Framework",
      frequency: "Annually",
      target: 4.5,
      actual: 3.8,
      status: "Behind"
    },
    {
      id: "IND-006",
      level: "Program level indicator",
      name: "Communities reached with awareness campaigns",
      project: "Sustainable Agriculture Development Initiative",
      unit: "Number",
      dataSource: "Theory of Change",
      frequency: "Quarterly",
      target: 150,
      actual: 165,
      status: "On Track"
    },
    {
      id: "IND-007",
      level: "Project level indicator",
      name: "Advocacy events conducted",
      project: "Renewable Energy Transition Framework",
      unit: "Number",
      dataSource: "Results Framework",
      frequency: "Monthly",
      target: 12,
      actual: 10,
      status: "At Risk"
    },
    {
      id: "IND-008",
      level: "Institutional KPI",
      name: "Grant utilization rate",
      project: "West Africa Regional Integration Study",
      unit: "%",
      dataSource: "Logical Framework",
      frequency: "Monthly",
      target: 90,
      actual: 88,
      status: "On Track"
    }
  ];

  // Filter indicators based on all filters
  const filteredIndicators = indicators.filter(indicator => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      indicator.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Unit filter
    const matchesUnit = unitFilter === "all" || indicator.unit === unitFilter;
    
    // Level filter
    const matchesLevel = levelFilter === "all" || indicator.level === levelFilter;
    
    // Time filter (based on frequency)
    const matchesTime = timeFilter === "all" || indicator.frequency === timeFilter;
    
    return matchesSearch && matchesUnit && matchesLevel && matchesTime;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-700";
      case "At Risk":
        return "bg-amber-100 text-amber-700";
      case "Behind":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleExport = () => {
    // Export functionality
    const csvContent = [
      ["Indicator ID", "Level", "Indicator Name", "Project", "Unit", "Data Source", "Frequency", "Target", "Actual", "Status"],
      ...filteredIndicators.map(ind => [
        ind.id, ind.level, ind.name, ind.project, ind.unit, ind.dataSource, ind.frequency, 
        ind.target.toString(), ind.actual.toString(), ind.status
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "indicators_metrics.csv";
    a.click();
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Performance Indicators</h1>
        <button
          onClick={() => setShowAddNewIndicator(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Add New Indicator</span>
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
            {/* Upload CSV */}
            <button className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <Upload size={16} className="text-slate-600" />
              <span className="text-sm text-slate-900">Upload CSV</span>
            </button>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span>
              <Download size={16} className="text-slate-600" />
            </button>

            {/* Unit Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUnitDropdown(!showUnitDropdown);
                  setShowLevelDropdown(false);
                  setShowTimeDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{unitFilter === "all" ? "All Units" : unitFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showUnitDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUnitDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["all", "Number", "Percentage", "Score"].map((unit) => (
                      <button
                        key={unit}
                        onClick={() => {
                          setUnitFilter(unit);
                          setShowUnitDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        {unit === "all" ? "All Units" : unit}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Level Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLevelDropdown(!showLevelDropdown);
                  setShowUnitDropdown(false);
                  setShowTimeDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{levelFilter === "all" ? "All Levels" : levelFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showLevelDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowLevelDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["all", "Program level indicator", "Outcome Indicator", "Output Indicator"].map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setLevelFilter(level);
                          setShowLevelDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        {level === "all" ? "All Levels" : level}
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
                  setShowUnitDropdown(false);
                  setShowLevelDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{timeFilter === "all" ? "All Time" : timeFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showTimeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTimeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["all", "Quarterly", "Monthly", "Annually"].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setTimeFilter(time);
                          setShowTimeDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        {time === "all" ? "All Time" : time}
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
          <thead className="bg-blue-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">
                Indicator ID
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 min-w-[147px]">
                Level
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 min-w-[155px]">
                Indicator Name
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Project
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Unit of Measure
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Data Source
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Frequency
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Target
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Actual
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                Status
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIndicators.length > 0 ? (
              filteredIndicators.map((indicator) => (
                <tr key={indicator.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.id}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.level}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.project}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.unit}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.dataSource}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.frequency}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.target}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{indicator.actual}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-[12px] font-medium ${getStatusColor(indicator.status)}`}>
                      {indicator.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === indicator.id ? null : indicator.id)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal size={16} className="text-slate-600" />
                      </button>
                      {showActionMenu === indicator.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                            <button
                              onClick={() => {
                                setViewingIndicator(indicator);
                                setShowActionMenu(null);
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
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-500">
                  No indicators found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}