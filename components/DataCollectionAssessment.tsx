import { useState } from "react";
import { Search, Plus, Upload, ChevronDown, Paperclip, MoreHorizontal, AlertTriangle, X } from "lucide-react";
import { DataEntryForm } from "./DataEntryForm";
import { ViewDataCollectionRecord } from "./ViewDataCollectionRecord";

interface DataRecord {
  id: string;
  indicator: string;
  indicatorId: string;
  project: string;
  reportingPeriod: string;
  actualValue: number;
  targetValue: number;
  hasEvidence: boolean;
  evidenceCount: number;
  qaStatus: "Draft" | "Pending" | "Verified" | "Flagged";
  explanation?: string;
}

export function DataCollectionAssessment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [frameworkFilter, setFrameworkFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showFrameworkDropdown, setShowFrameworkDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDataEntryForm, setShowDataEntryForm] = useState(false);
  const [viewingRecordId, setViewingRecordId] = useState<string | null>(null);
  const [showProjectSelectDropdown, setShowProjectSelectDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");

  const dataRecords: DataRecord[] = [
    {
      id: "REC-001",
      indicator: "Youth trained in digital skills",
      indicatorId: "IND-003",
      project: "Youth Employment Program (YEP)",
      reportingPeriod: "Q1 2025 (Jan-Mar)",
      actualValue: 550,
      targetValue: 500,
      hasEvidence: true,
      evidenceCount: 3,
      qaStatus: "Verified",
      explanation: "Exceeded target due to additional training cohort"
    },
    {
      id: "REC-002",
      indicator: "Policy briefs cited in media",
      indicatorId: "IND-001",
      project: "Digital Literacy Initiative",
      reportingPeriod: "Q1 2025 (Jan-Mar)",
      actualValue: 12,
      targetValue: 20,
      hasEvidence: false,
      evidenceCount: 0,
      qaStatus: "Flagged"
    },
    {
      id: "REC-003",
      indicator: "Communities reached with awareness campaigns",
      indicatorId: "IND-006",
      project: "Community Health Project",
      reportingPeriod: "Q4 2024 (Oct-Dec)",
      actualValue: 145,
      targetValue: 150,
      hasEvidence: true,
      evidenceCount: 2,
      qaStatus: "Verified"
    },
    {
      id: "REC-004",
      indicator: "Advocacy events conducted",
      indicatorId: "IND-007",
      project: "Youth Employment Program (YEP)",
      reportingPeriod: "Q1 2025 (Jan-Mar)",
      actualValue: 8,
      targetValue: 12,
      hasEvidence: true,
      evidenceCount: 1,
      qaStatus: "Pending",
      explanation: "Delayed due to venue availability"
    },
    {
      id: "REC-005",
      indicator: "Staff satisfaction score",
      indicatorId: "IND-005",
      project: "Digital Literacy Initiative",
      reportingPeriod: "Q4 2024 (Oct-Dec)",
      actualValue: 3.8,
      targetValue: 4.5,
      hasEvidence: false,
      evidenceCount: 0,
      qaStatus: "Draft"
    },
    {
      id: "REC-006",
      indicator: "Grant utilization rate",
      indicatorId: "IND-008",
      project: "Community Health Project",
      reportingPeriod: "Q1 2025 (Jan-Mar)",
      actualValue: 88,
      targetValue: 90,
      hasEvidence: true,
      evidenceCount: 4,
      qaStatus: "Verified"
    }
  ];

  // If showing Data Entry Form page, render it
  if (showDataEntryForm) {
    return <DataEntryForm onBack={() => setShowDataEntryForm(false)} selectedProject={selectedProject} />;
  }

  // If viewing a record, render the view record page
  if (viewingRecordId) {
    const record = dataRecords.find(r => r.id === viewingRecordId);
    if (record) {
      return <ViewDataCollectionRecord onBack={() => setViewingRecordId(null)} record={record} />;
    }
  }

  // Filter records
  const filteredRecords = dataRecords.filter(record => {
    const matchesSearch = searchQuery === "" || 
      record.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.indicatorId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProject = projectFilter === "all" || record.project === projectFilter;
    const matchesPeriod = periodFilter === "all" || record.reportingPeriod === periodFilter;
    const matchesStatus = statusFilter === "all" || record.qaStatus === statusFilter;
    
    return matchesSearch && matchesProject && matchesPeriod && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Verified":
        return "bg-green-100 text-green-700";
      case "Flagged":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Check if variance is > 20%
  const hasVarianceAlert = (actual: number, target: number) => {
    const variance = Math.abs(((actual - target) / target) * 100);
    return variance >= 20;
  };

  return (
    <>
      <div className="h-full flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Data Collection & Assessment</h1>
          <div className="relative">
            <button 
              onClick={() => setShowProjectSelectDropdown(!showProjectSelectDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Submit New Impact Record</span>
            </button>
            {showProjectSelectDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProjectSelectDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                    <p className="text-xs font-medium text-slate-700">Select Project</p>
                  </div>
                  {["Youth Employment Program (YEP)", "Digital Literacy Initiative", "Community Health Project", "Education Access Program", "Climate Action Initiative"].map((project) => (
                    <button
                      key={project}
                      onClick={() => {
                        setSelectedProject(project);
                        setShowProjectSelectDropdown(false);
                        setShowDataEntryForm(true);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-slate-900 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                    >
                      {project}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between gap-3">
            {/* Search Bar */}
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
              {/* Import CSV */}
              <button className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <Upload size={16} className="text-slate-600" />
                <span className="text-sm text-slate-900">Import CSV</span>
              </button>

              {/* Project Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProjectDropdown(!showProjectDropdown);
                    setShowFrameworkDropdown(false);
                    setShowPeriodDropdown(false);
                    setShowStatusDropdown(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
                >
                  <span className="text-sm text-slate-900 truncate">
                    {projectFilter === "all" ? "All Projects" : projectFilter}
                  </span>
                  <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
                </button>
                {showProjectDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProjectDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      {["all", "Youth Employment Program (YEP)", "Digital Literacy Initiative", "Community Health Project"].map((project) => (
                        <button
                          key={project}
                          onClick={() => {
                            setProjectFilter(project);
                            setShowProjectDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {project === "all" ? "All Projects" : project}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Framework Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowFrameworkDropdown(!showFrameworkDropdown);
                    setShowProjectDropdown(false);
                    setShowPeriodDropdown(false);
                    setShowStatusDropdown(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
                >
                  <span className="text-sm text-slate-900 truncate">
                    {frameworkFilter === "all" ? "All Frameworks" : frameworkFilter}
                  </span>
                  <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
                </button>
                {showFrameworkDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFrameworkDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      {["all", "Theory of Change", "Logical Framework", "Results Framework"].map((framework) => (
                        <button
                          key={framework}
                          onClick={() => {
                            setFrameworkFilter(framework);
                            setShowFrameworkDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {framework === "all" ? "All Frameworks" : framework}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Period Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowPeriodDropdown(!showPeriodDropdown);
                    setShowProjectDropdown(false);
                    setShowFrameworkDropdown(false);
                    setShowStatusDropdown(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
                >
                  <span className="text-sm text-slate-900 truncate">
                    {periodFilter === "all" ? "All Periods" : periodFilter}
                  </span>
                  <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
                </button>
                {showPeriodDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      {["all", "Q1 2025 (Jan-Mar)", "Q4 2024 (Oct-Dec)", "Q3 2024 (Jul-Sep)"].map((period) => (
                        <button
                          key={period}
                          onClick={() => {
                            setPeriodFilter(period);
                            setShowPeriodDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {period === "all" ? "All Periods" : period}
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
                    setShowFrameworkDropdown(false);
                    setShowPeriodDropdown(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
                >
                  <span className="text-sm text-slate-900 truncate">
                    {statusFilter === "all" ? "All Status" : statusFilter}
                  </span>
                  <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
                </button>
                {showStatusDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      {["all", "Draft", "Pending", "Verified", "Flagged"].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setShowStatusDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {status === "all" ? "All Status" : status}
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
                <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">Indicator</th>
                <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">Project/Grant</th>
                <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">Reporting Period</th>
                <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-32">Actual Value</th>
                <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">Evidence</th>
                <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">QA Status</th>
                <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const hasVariance = hasVarianceAlert(record.actualValue, record.targetValue);
                  return (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-[12px] text-slate-900 font-medium">{record.indicator}</span>
                          <span className="text-[12px] text-slate-500">{record.indicatorId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-700">{record.project}</td>
                      <td className="px-4 py-4 text-[12px] text-slate-700">{record.reportingPeriod}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[12px] font-semibold ${hasVariance ? 'text-amber-600' : 'text-slate-900'}`}>
                            {record.actualValue}
                          </span>
                          {hasVariance && (
                            <div className="group relative">
                              <AlertTriangle size={16} className="text-amber-500" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-slate-900 text-white text-xs rounded py-1 px-2 z-10">
                                Variance &gt; 20% from target ({record.targetValue})
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {record.hasEvidence ? (
                            <>
                              <Paperclip size={14} className="text-blue-600" />
                              <span className="text-[12px] text-slate-600">{record.evidenceCount} file(s)</span>
                            </>
                          ) : (
                            <div className="flex items-center gap-1">
                              <AlertTriangle size={14} className="text-red-500" />
                              <span className="text-[12px] text-red-600">Missing</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.qaStatus)}`}>
                          {record.qaStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === record.id ? null : record.id)}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <MoreHorizontal size={16} className="text-slate-600" />
                          </button>
                          {showActionMenu === record.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                <button 
                                  onClick={() => {
                                    setViewingRecordId(record.id);
                                    setShowActionMenu(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50"
                                >
                                  View Details
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50">
                                  Edit
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50">
                                  Verify
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                    No records found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}