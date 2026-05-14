import { useState } from "react";
import { Search, Download, Upload, ChevronDown, Eye, Edit, Trash2, MoreHorizontal, Plus } from "lucide-react";
import { AddNewFramework } from "./AddNewFramework";
import { ViewFramework } from "./ViewFramework";

interface Framework {
  id: string;
  name: string;
  type: string;
  associatedProject: string;
  createdBy: string;
  createdDate: string;
  status: "Active" | "Draft" | "Archived";
}

export function MELFrameworks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddNewFramework, setShowAddNewFramework] = useState(false);
  const [showViewFramework, setShowViewFramework] = useState<Framework | null>(null);
  const itemsPerPage = 8;

  // If showing Add New Framework, show that component
  if (showAddNewFramework) {
    return <AddNewFramework onBack={() => setShowAddNewFramework(false)} />;
  }

  // If showing View Framework, show that component
  if (showViewFramework) {
    return <ViewFramework framework={showViewFramework} onBack={() => setShowViewFramework(null)} />;
  }

  const frameworks: Framework[] = [
    {
      id: "MEL-001",
      name: "Youth Employment Theory of Change",
      type: "Theory of Change",
      associatedProject: "Youth Employment Initiative",
      createdBy: "Dr. Sarah Johnson",
      createdDate: "2024-01-15",
      status: "Active"
    },
    {
      id: "MEL-002",
      name: "Digital Economy Logical Framework",
      type: "Logical Framework",
      associatedProject: "Ghana Digital Economy Project",
      createdBy: "Michael Owusu",
      createdDate: "2024-02-20",
      status: "Active"
    },
    {
      id: "MEL-003",
      name: "ACET 2025 Results Framework",
      type: "Results Framework",
      associatedProject: "Institutional Goals 2025",
      createdBy: "Jennifer Mensah",
      createdDate: "2023-12-10",
      status: "Active"
    },
    {
      id: "MEL-004",
      name: "Climate Finance Impact Assessment",
      type: "Impact Assessment",
      associatedProject: "Climate Resilience Program",
      createdBy: "Dr. Kwame Asante",
      createdDate: "2024-03-05",
      status: "Active"
    },
    {
      id: "MEL-005",
      name: "Trade Policy Logical Framework",
      type: "Logical Framework",
      associatedProject: "AfCFTA Trade Policy Initiative",
      createdBy: "Abena Osei",
      createdDate: "2024-01-28",
      status: "Active"
    },
    {
      id: "MEL-006",
      name: "Agricultural Value Chain ToC",
      type: "Theory of Change",
      associatedProject: "Agribusiness Development Program",
      createdBy: "Dr. Sarah Johnson",
      createdDate: "2023-11-15",
      status: "Active"
    },
    {
      id: "MEL-007",
      name: "Education Quality Results Framework",
      type: "Results Framework",
      associatedProject: "Basic Education Support",
      createdBy: "Michael Owusu",
      createdDate: "2024-02-10",
      status: "Draft"
    },
    {
      id: "MEL-008",
      name: "Gender Equality Impact Assessment",
      type: "Impact Assessment",
      associatedProject: "Women Empowerment Initiative",
      createdBy: "Jennifer Mensah",
      createdDate: "2024-03-18",
      status: "Active"
    },
    {
      id: "MEL-009",
      name: "Health Systems Strengthening LogFrame",
      type: "Logical Framework",
      associatedProject: "Primary Healthcare Initiative",
      createdBy: "Dr. Kwame Asante",
      createdDate: "2023-10-22",
      status: "Active"
    },
    {
      id: "MEL-010",
      name: "Financial Inclusion Theory of Change",
      type: "Theory of Change",
      associatedProject: "Digital Financial Services Project",
      createdBy: "Abena Osei",
      createdDate: "2024-01-05",
      status: "Active"
    },
    {
      id: "MEL-011",
      name: "Infrastructure Development Results",
      type: "Results Framework",
      associatedProject: "National Infrastructure Program",
      createdBy: "Michael Owusu",
      createdDate: "2023-09-30",
      status: "Archived"
    },
    {
      id: "MEL-012",
      name: "SME Growth Impact Framework",
      type: "Impact Assessment",
      associatedProject: "Small Business Support Scheme",
      createdBy: "Dr. Sarah Johnson",
      createdDate: "2024-02-28",
      status: "Draft"
    }
  ];

  // Filter frameworks based on all filters
  const filteredFrameworks = frameworks.filter(framework => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      framework.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      framework.associatedProject.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === "all" || framework.type === typeFilter;
    
    // Time filter (based on created date)
    const matchesTime = (() => {
      if (timeFilter === "all") return true;
      const createdDate = new Date(framework.createdDate);
      const now = new Date();
      
      switch (timeFilter) {
        case "Last 30 Days":
          return createdDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        case "Last 90 Days":
          return createdDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
        case "This Year":
          return createdDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesType && matchesTime;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFrameworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFrameworks = filteredFrameworks.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Draft":
        return "bg-amber-100 text-amber-700";
      case "Archived":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Framework ID", "Framework Name", "Type", "Associated Project/Program", "Created By", "Created Date", "Status"],
      ...filteredFrameworks.map(fw => [
        fw.id, fw.name, fw.type, fw.associatedProject, fw.createdBy, fw.createdDate, fw.status
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mel_frameworks.csv";
    a.click();
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">MEL Frameworks</h1>
        <button
          onClick={() => setShowAddNewFramework(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Add New Framework</span>
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

            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowTimeDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[140px]"
              >
                <span className="text-sm text-slate-900 truncate">{typeFilter === "all" ? "All Types" : typeFilter}</span>
                <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />
              </button>
              {showTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {["all", "Theory of Change", "Logical Framework", "Results Framework"].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setTypeFilter(type);
                          setShowTypeDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        {type === "all" ? "All Types" : type}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Time Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTimeDropdown(!showTimeDropdown);
                  setShowTypeDropdown(false);
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
                    {["all", "Last 30 Days", "Last 90 Days", "This Year"].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setTimeFilter(time);
                          setShowTimeDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        {time}
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
                Framework ID
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 min-w-[197px]">
                Framework Name
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Framework Type
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Associated Project/Program
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100">
                Created By
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-28">
                Status
              </th>
              <th className="px-4 py-4 text-left text-white text-[12px] font-semibold border-b border-slate-100 w-24">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedFrameworks.length > 0 ? (
              paginatedFrameworks.map((framework) => (
                <tr key={framework.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{framework.id}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{framework.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{framework.type}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{framework.associatedProject}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-600">{framework.createdBy}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-[12px] font-medium ${getStatusColor(framework.status)}`}>
                      {framework.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionDropdown(showActionDropdown === framework.id ? null : framework.id)}
                        className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal size={16} className="text-slate-600" />
                      </button>
                      {showActionDropdown === framework.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowActionDropdown(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              onClick={() => setShowViewFramework(framework)}
                            >
                              View
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              Edit
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
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
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                  No frameworks found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredFrameworks.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white">
          <p className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}