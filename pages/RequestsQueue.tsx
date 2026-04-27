import { useState } from "react";
import { Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "../lib/utils";

interface ContractRequest {
  id: string;
  requestType: string;
  title: string;
  requestedBy: string;
  department: string;
  dateRequested: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending Review" | "In Progress" | "Approved" | "Rejected" | "Completed";
  assignedTo?: string;
  dueDate: string;
  description: string;
}

const mockRequests: ContractRequest[] = [
  {
    id: "REQ-2026-001",
    requestType: "Employment Contract",
    title: "Senior Developer - Full Stack",
    requestedBy: "Sarah Johnson",
    department: "HR",
    dateRequested: "Jan 25, 2026",
    priority: "High",
    status: "Pending Review",
    dueDate: "Jan 30, 2026",
    description: "Need employment contract for new senior full-stack developer hire"
  },
  {
    id: "REQ-2026-002",
    requestType: "NDA",
    title: "Strategic Partnership - TechCorp",
    requestedBy: "Michael Chen",
    department: "Business Development",
    dateRequested: "Jan 24, 2026",
    priority: "High",
    status: "In Progress",
    assignedTo: "David Wilson",
    dueDate: "Jan 27, 2026",
    description: "NDA required for potential partnership discussions with TechCorp"
  },
  {
    id: "REQ-2026-003",
    requestType: "Consultant Agreement",
    title: "Project Management Consultant",
    requestedBy: "Emily Davis",
    department: "Projects",
    dateRequested: "Jan 23, 2026",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "David Wilson",
    dueDate: "Jan 29, 2026",
    description: "Agreement for 6-month project management consulting engagement"
  },
  {
    id: "REQ-2026-004",
    requestType: "Service Agreement",
    title: "Office Cleaning Services",
    requestedBy: "John Smith",
    department: "Admin",
    dateRequested: "Jan 22, 2026",
    priority: "Low",
    status: "Pending Review",
    dueDate: "Feb 5, 2026",
    description: "Renewal of office cleaning services contract"
  },
  {
    id: "REQ-2026-005",
    requestType: "Vendor Agreement",
    title: "Cloud Hosting Services",
    requestedBy: "Michael Chen",
    department: "IT",
    dateRequested: "Jan 21, 2026",
    priority: "High",
    status: "Approved",
    assignedTo: "David Wilson",
    dueDate: "Jan 28, 2026",
    description: "Agreement for cloud hosting and infrastructure services"
  },
  {
    id: "REQ-2026-006",
    requestType: "Employment Contract",
    title: "Junior Marketing Associate",
    requestedBy: "Sarah Johnson",
    department: "HR",
    dateRequested: "Jan 20, 2026",
    priority: "Medium",
    status: "Completed",
    assignedTo: "David Wilson",
    dueDate: "Jan 26, 2026",
    description: "Employment contract for entry-level marketing position"
  },
  {
    id: "REQ-2026-007",
    requestType: "Lease Agreement",
    title: "Vehicle Lease - Company Fleet",
    requestedBy: "John Smith",
    department: "Admin",
    dateRequested: "Jan 19, 2026",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Lisa Anderson",
    dueDate: "Feb 2, 2026",
    description: "Lease agreement for 3 additional vehicles for company fleet"
  },
  {
    id: "REQ-2026-008",
    requestType: "NDA",
    title: "Vendor Evaluation - Multiple Suppliers",
    requestedBy: "Lisa Anderson",
    department: "Procurement",
    dateRequested: "Jan 18, 2026",
    priority: "Low",
    status: "Rejected",
    assignedTo: "David Wilson",
    dueDate: "Jan 25, 2026",
    description: "NDA for vendor evaluation process - Rejected due to incomplete information"
  },
  {
    id: "REQ-2026-009",
    requestType: "Service Agreement",
    title: "IT Support Services",
    requestedBy: "Michael Chen",
    department: "IT",
    dateRequested: "Jan 17, 2026",
    priority: "High",
    status: "Completed",
    assignedTo: "David Wilson",
    dueDate: "Jan 24, 2026",
    description: "Managed IT support and helpdesk services agreement"
  },
  {
    id: "REQ-2026-010",
    requestType: "Consultant Agreement",
    title: "HR Policy Consultant",
    requestedBy: "Emily Davis",
    department: "HR",
    dateRequested: "Jan 16, 2026",
    priority: "Medium",
    status: "Pending Review",
    dueDate: "Jan 31, 2026",
    description: "Agreement for HR policy review and compliance consulting"
  },
];

export function RequestsQueue() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    requestType: "",
    title: "",
    priority: "Medium",
    dueDate: "",
    description: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review":
        return "bg-amber-100 text-amber-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Approved":
        return "bg-purple-100 text-purple-700";
      case "Completed":
        return "bg-emerald-100 text-emerald-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All Types" || request.requestType === typeFilter;
    const matchesStatus = statusFilter === "All Statuses" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "All Priorities" || request.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const totalResults = filteredRequests.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handleAction = (action: string, requestId: string) => {
    console.log(`${action} request ${requestId}`);
    setActiveDropdown(null);
  };

  const handleCreateRequest = () => {
    console.log("Creating request:", newRequest);
    setShowCreateModal(false);
    setNewRequest({
      requestType: "",
      title: "",
      priority: "Medium",
      dueDate: "",
      description: ""
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Requests Queue</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors"
          >
            <Plus size={18} />
            <span>New Request</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search requests..."
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
            <option>Employment Contract</option>
            <option>NDA</option>
            <option>Service Agreement</option>
            <option>Vendor Agreement</option>
            <option>Consultant Agreement</option>
            <option>Lease Agreement</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Statuses</option>
            <option>Pending Review</option>
            <option>In Progress</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0B01D0]">
              <th className="px-6 py-4 text-left text-xs text-white">Request ID</th>
              <th className="px-6 py-4 text-left text-xs text-white">Type</th>
              <th className="px-6 py-4 text-left text-xs text-white">Title</th>
              <th className="px-6 py-4 text-left text-xs text-white">Requested By</th>
              <th className="px-6 py-4 text-left text-xs text-white">Department</th>
              <th className="px-6 py-4 text-left text-xs text-white">Date Requested</th>
              <th className="px-6 py-4 text-left text-xs text-white">Priority</th>
              <th className="px-6 py-4 text-left text-xs text-white">Status</th>
              <th className="px-6 py-4 text-left text-xs text-white">Assigned To</th>
              <th className="px-6 py-4 text-left text-xs text-white">Due Date</th>
              <th className="px-6 py-4 text-left text-xs text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request, index) => (
              <tr
                key={request.id}
                className={cn(
                  "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-6 py-4 text-[12px] font-semibold text-[#0B01D0]">{request.id}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.requestType}</td>
                <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{request.title}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.requestedBy}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.department}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.dateRequested}</td>
                <td className="px-6 py-4">
                  <span className={cn("inline-block px-3 py-1 rounded text-xs font-medium", getPriorityColor(request.priority))}>
                    {request.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("inline-block px-3 py-1 rounded text-xs font-medium", getStatusColor(request.status))}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.assignedTo || "-"}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.dueDate}</td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === request.id ? null : request.id)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <MoreHorizontal size={16} className="text-slate-600" />
                    </button>
                    {activeDropdown === request.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                          <button
                            onClick={() => handleAction("View", request.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Clock size={14} />
                            View Details
                          </button>
                          <button
                            onClick={() => handleAction("Approve", request.id)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction("Reject", request.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <XCircle size={14} />
                            Reject
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

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-8 py-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">New Contract Request</h2>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Request Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newRequest.requestType}
                  onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="NDA">NDA</option>
                  <option value="Service Agreement">Service Agreement</option>
                  <option value="Vendor Agreement">Vendor Agreement</option>
                  <option value="Consultant Agreement">Consultant Agreement</option>
                  <option value="Lease Agreement">Lease Agreement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contract Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  placeholder="e.g., Senior Developer Position"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newRequest.dueDate}
                    onChange={(e) => setNewRequest({ ...newRequest, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  placeholder="Provide details about the contract request..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B01D0] focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRequest({
                    requestType: "",
                    title: "",
                    priority: "Medium",
                    dueDate: "",
                    description: ""
                  });
                }}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                className="px-6 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestsQueue;
