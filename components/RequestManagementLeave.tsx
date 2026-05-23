import { useState } from "react";
import { Search, Download, Upload, ChevronDown, Check, X } from "lucide-react";

interface LeaveRequest {
  id: string;
  requestId: string;
  employee: string;
  department: string;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  submittedOn: string;
  reason: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    requestId: "LR-2025-001",
    employee: "Kwame Asante",
    department: "Project Management",
    leaveType: "Annual",
    from: "Dec 10, 2025",
    to: "Dec 15, 2025",
    days: 5,
    status: "Pending",
    submittedOn: "Dec 1, 2025",
    reason: "Family vacation"
  },
  {
    id: "2",
    requestId: "LR-2025-002",
    employee: "Abena Owusu",
    department: "Financial Management",
    leaveType: "Sickness Absence",
    from: "Dec 8, 2025",
    to: "Dec 12, 2025",
    days: 4,
    status: "Pending",
    submittedOn: "Nov 30, 2025",
    reason: "Medical appointment"
  },
  {
    id: "3",
    requestId: "LR-2025-003",
    employee: "Nana Yaw",
    department: "HR Management",
    leaveType: "Annual",
    from: "Dec 20, 2025",
    to: "Dec 31, 2025",
    days: 11,
    status: "Pending",
    submittedOn: "Nov 28, 2025",
    reason: "Christmas holiday"
  },
  {
    id: "4",
    requestId: "LR-2025-004",
    employee: "Kofi Mensah",
    department: "Monitoring & Evaluation",
    leaveType: "Bereavement",
    from: "Dec 5, 2025",
    to: "Dec 7, 2025",
    days: 2,
    status: "Approved",
    submittedOn: "Nov 25, 2025",
    reason: "Family bereavement"
  },
  {
    id: "5",
    requestId: "LR-2025-005",
    employee: "Ama Darko",
    department: "Procurement",
    leaveType: "Annual",
    from: "Nov 15, 2025",
    to: "Nov 22, 2025",
    days: 7,
    status: "Approved",
    submittedOn: "Nov 1, 2025",
    reason: "Personal matters"
  },
  {
    id: "6",
    requestId: "LR-2025-006",
    employee: "Yaw Osei",
    department: "Project Management",
    leaveType: "Sickness Absence",
    from: "Nov 10, 2025",
    to: "Nov 11, 2025",
    days: 1,
    status: "Rejected",
    submittedOn: "Nov 8, 2025",
    reason: "Doctor's appointment"
  }
];

const departments = ["All Departments", "Project Management", "Financial Management", "HR Management", "Monitoring & Evaluation", "Procurement"];
const leaveTypes = ["All Types", "Paternity", "Maternity", "Annual", "Sickness Absence", "Bereavement", "Unpaid"];
const statuses = ["All Statuses", "Pending", "Approved", "Rejected"];

export function RequestManagementLeave() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedLeaveType, setSelectedLeaveType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  
  // Dropdown states
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Filter requests
  const filteredRequests = mockLeaveRequests.filter((request) => {
    const matchesSearch = request.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || request.department === selectedDepartment;
    const matchesType = selectedLeaveType === "All Types" || request.leaveType === selectedLeaveType;
    const matchesStatus = selectedStatus === "All Statuses" || request.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });

  const totalResults = filteredRequests.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handleApprove = (id: string) => {
    console.log("Approve request:", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject request:", id, "Reason:", rejectReason);
    setRejectingId(null);
    setRejectReason("");
  };

  const getLeaveTypeColor = (leaveType: string) => {
    switch (leaveType) {
      case "Annual":
        return "bg-blue-50 text-blue-600";
      case "Sickness Absence":
        return "bg-red-50 text-red-600";
      case "Bereavement":
        return "bg-orange-50 text-orange-600";
      case "Maternity":
        return "bg-pink-50 text-pink-600";
      case "Paternity":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
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
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Leave Requests</h1>
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
                  setShowTypeDropdown(false);
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

            {/* Leave Type Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowDepartmentDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedLeaveType}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showTypeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTypeDropdown(false)} />
                  <div className="absolute top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {leaveTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedLeaveType(type);
                          setShowTypeDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {type}
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
                  setShowTypeDropdown(false);
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
                Leave Type
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                From
              </th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                To
              </th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">
                Days
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
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getLeaveTypeColor(request.leaveType)}`}>
                    {request.leaveType}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{request.from}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{request.to}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] font-medium text-slate-900">{request.days}</p>
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
            <p className="text-slate-500">No leave requests found matching your filters.</p>
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

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => { setRejectingId(null); setRejectReason(""); }}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[15px] text-slate-900">Reject Leave Request</h3>
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