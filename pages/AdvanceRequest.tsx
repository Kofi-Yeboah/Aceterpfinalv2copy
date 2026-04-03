import { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { cn } from "../lib/utils";

interface AdvanceRequestRecord {
  id: string;
  amount: string;
  purpose: string;
  requestDate: string;
  repaymentPeriod: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedOn: string;
  approvedBy?: string;
}

const mockAdvanceRequests: AdvanceRequestRecord[] = [
  {
    id: "1",
    amount: "$2,500",
    purpose: "Medical emergency",
    requestDate: "Nov 28, 2025",
    repaymentPeriod: "6 months",
    status: "Pending",
    submittedOn: "Nov 28, 2025"
  },
  {
    id: "2",
    amount: "$1,000",
    purpose: "Home repairs",
    requestDate: "Nov 15, 2025",
    repaymentPeriod: "3 months",
    status: "Approved",
    submittedOn: "Nov 15, 2025",
    approvedBy: "Sarah Johnson"
  },
  {
    id: "3",
    amount: "$3,000",
    purpose: "Education fees",
    requestDate: "Oct 20, 2025",
    repaymentPeriod: "12 months",
    status: "Approved",
    submittedOn: "Oct 20, 2025",
    approvedBy: "Michael Chen"
  },
  {
    id: "4",
    amount: "$500",
    purpose: "Emergency travel",
    requestDate: "Oct 5, 2025",
    repaymentPeriod: "2 months",
    status: "Approved",
    submittedOn: "Oct 5, 2025",
    approvedBy: "Sarah Johnson"
  },
  {
    id: "5",
    amount: "$5,000",
    purpose: "Personal project",
    requestDate: "Sep 10, 2025",
    repaymentPeriod: "12 months",
    status: "Rejected",
    submittedOn: "Sep 10, 2025",
    approvedBy: "HR Department"
  },
  {
    id: "6",
    amount: "$1,500",
    purpose: "Vehicle maintenance",
    requestDate: "Aug 22, 2025",
    repaymentPeriod: "4 months",
    status: "Approved",
    submittedOn: "Aug 22, 2025",
    approvedBy: "Michael Chen"
  }
];

export function AdvanceRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    requestDate: "",
    repaymentPeriod: "",
    supportingDocuments: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Approved":
        return "bg-emerald-100 text-emerald-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredRequests = mockAdvanceRequests.filter((request) => {
    const matchesSearch =
      request.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestDate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalResults = filteredRequests.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handleCreateRequest = () => {
    setShowCreateModal(true);
  };

  const handleSubmit = () => {
    console.log("Creating advance request:", formData);
    setShowCreateModal(false);
    setFormData({
      amount: "",
      purpose: "",
      requestDate: "",
      repaymentPeriod: "",
      supportingDocuments: ""
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Advance Request</h1>
          <button
            onClick={handleCreateRequest}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors"
          >
            <Plus size={18} />
            <span>Request Advance</span>
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0B01D0]">
              <th className="px-6 py-4 text-left text-xs text-white">Amount</th>
              <th className="px-6 py-4 text-left text-xs text-white">Purpose</th>
              <th className="px-6 py-4 text-left text-xs text-white">Request Date</th>
              <th className="px-6 py-4 text-left text-xs text-white">Repayment Period</th>
              <th className="px-6 py-4 text-left text-xs text-white">Status</th>
              <th className="px-6 py-4 text-left text-xs text-white">Submitted On</th>
              <th className="px-6 py-4 text-left text-xs text-white">Approved By</th>
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
                <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{request.amount}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600 max-w-xs truncate">{request.purpose}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.requestDate}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.repaymentPeriod}</td>
                <td className="px-6 py-4">
                  <span className={cn("inline-block px-3 py-1 rounded text-xs font-medium", getStatusColor(request.status))}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.submittedOn}</td>
                <td className="px-6 py-4 text-[12px] text-slate-600">{request.approvedBy || "-"}</td>
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

      {/* Create Advance Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Request Advance</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Amount Requested <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select purpose</option>
                  <option>Medical Emergency</option>
                  <option>Education Fees</option>
                  <option>Home Repairs</option>
                  <option>Vehicle Maintenance</option>
                  <option>Emergency Travel</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date Needed <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.requestDate}
                  onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Repayment Period <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.repaymentPeriod}
                  onChange={(e) => setFormData({ ...formData, repaymentPeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select repayment period</option>
                  <option>1 month</option>
                  <option>2 months</option>
                  <option>3 months</option>
                  <option>4 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide additional details about your advance request"
                  value={formData.supportingDocuments}
                  onChange={(e) => setFormData({ ...formData, supportingDocuments: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Supporting Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <div className="text-slate-400 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOC, or image files</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0900a5] transition-colors"
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

export default AdvanceRequest;
