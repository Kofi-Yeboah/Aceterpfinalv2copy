import { useState } from "react";
import { Search, Download, Upload, ChevronDown, Check, X } from "lucide-react";

interface TravelRequest {
  id: string;
  requestId: string;
  employee: string;
  department: string;
  destination: string;
  purpose: string;
  from: string;
  to: string;
  days: number;
  estimatedCost: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedOn: string;
}

const mockTravelRequests: TravelRequest[] = [
  {
    id: "1",
    requestId: "TR-2025-001",
    employee: "Kwame Asante",
    department: "Project Management",
    destination: "Kumasi, Ghana",
    purpose: "Project site visit",
    from: "Dec 12, 2025",
    to: "Dec 15, 2025",
    days: 3,
    estimatedCost: "$850",
    status: "Pending",
    submittedOn: "Dec 1, 2025"
  },
  {
    id: "2",
    requestId: "TR-2025-002",
    employee: "Abena Owusu",
    department: "Financial Management",
    destination: "Lagos, Nigeria",
    purpose: "Financial audit meeting",
    from: "Dec 18, 2025",
    to: "Dec 22, 2025",
    days: 4,
    estimatedCost: "$1,450",
    status: "Pending",
    submittedOn: "Nov 29, 2025"
  },
  {
    id: "3",
    requestId: "TR-2025-003",
    employee: "Nana Yaw",
    department: "HR Management",
    destination: "Nairobi, Kenya",
    purpose: "HR conference",
    from: "Jan 10, 2026",
    to: "Jan 14, 2026",
    days: 4,
    estimatedCost: "$2,100",
    status: "Pending",
    submittedOn: "Nov 28, 2025"
  },
  {
    id: "4",
    requestId: "TR-2025-004",
    employee: "Kofi Mensah",
    department: "Monitoring & Evaluation",
    destination: "Takoradi, Ghana",
    purpose: "M&E field assessment",
    from: "Dec 5, 2025",
    to: "Dec 8, 2025",
    days: 3,
    estimatedCost: "$600",
    status: "Approved",
    submittedOn: "Nov 20, 2025"
  },
  {
    id: "5",
    requestId: "TR-2025-005",
    employee: "Ama Darko",
    department: "Procurement",
    destination: "Dubai, UAE",
    purpose: "Supplier meeting",
    from: "Nov 15, 2025",
    to: "Nov 20, 2025",
    days: 5,
    estimatedCost: "$3,200",
    status: "Approved",
    submittedOn: "Oct 28, 2025"
  },
  {
    id: "6",
    requestId: "TR-2025-006",
    employee: "Yaw Osei",
    department: "Project Management",
    destination: "Cape Town, South Africa",
    purpose: "Project management workshop",
    from: "Nov 5, 2025",
    to: "Nov 7, 2025",
    days: 2,
    estimatedCost: "$1,800",
    status: "Rejected",
    submittedOn: "Oct 25, 2025"
  }
];

const departments = ["All Departments", "Project Management", "Financial Management", "HR Management", "Monitoring & Evaluation", "Procurement"];
const statuses = ["All Statuses", "Pending", "Approved", "Rejected"];

export function RequestManagementTravel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  
  // Dropdown states
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Filter requests
  const filteredRequests = mockTravelRequests.filter((request) => {
    const matchesSearch = request.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || request.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All Statuses" || request.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalResults = filteredRequests.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handleApprove = (id: string) => {
    console.log("Approve travel request:", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject travel request:", id, "Reason:", rejectReason);
    setRejectingId(null);
    setRejectReason("");
  };

  const getStatusColor = (status: "Pending" | "Approved" | "Rejected") => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-600";
      case "Approved":
        return "bg-green-50 text-green-600";
      case "Rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Travel Requests</h1>
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

          {/* Filter Buttons */}
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span>
              <Download size={16} className="text-purple-700" />
            </button>

            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Upload CSV</span>
              <Upload size={16} className="text-purple-700" />
            </button>

            {/* Department Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowDepartmentDropdown(!showDepartmentDropdown);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedDepartment}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showDepartmentDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDepartmentDropdown(false)} />
                  <div className="absolute top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setShowDepartmentDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowDepartmentDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
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

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Request ID
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Employee
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Department
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Destination
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Purpose
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Travel Dates
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Est. Cost
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Status
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr key={request.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-black">{request.requestId}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{request.employee}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{request.department}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{request.destination}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{request.purpose}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[12px] text-slate-900">{request.from}</p>
                    <p className="text-[12px] text-slate-500">{request.to}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{request.estimatedCost}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {request.status === "Pending" ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="p-1.5 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setRejectingId(request.id)}
                        className="p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-xs text-slate-400">-</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRequests.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">No travel requests found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-600">
            {totalResults > 0 ? `${startIndex + 1}-${endIndex}` : "0-0"} of {totalResults} results
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} className="rotate-90 text-pink-600" />
            </button>
            
            <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">
              {currentPage}
            </button>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} className="-rotate-90 text-pink-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => { setRejectingId(null); setRejectReason(""); }}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[15px] text-slate-900">Reject Travel Request</h3>
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="p-6">
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 block">Reason for Rejection</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none" placeholder="Please provide a reason for rejecting this request..." />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleReject(rejectingId)} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg text-[13px] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}