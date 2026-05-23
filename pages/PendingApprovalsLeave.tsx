import { useState } from "react";
import { Search, Download, Check, X } from "lucide-react";

interface LeaveApproval {
  id: string;
  requestId: string;
  employee: string;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: string;
  statusColor: string;
}

const mockApprovals: LeaveApproval[] = [
  {
    id: "1",
    requestId: "LR-23-ABCD1",
    employee: "Desmond Tutu",
    leaveType: "Annual",
    from: "Mar 15, 2025",
    to: "Mar 20, 2025",
    days: 5,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "2",
    requestId: "LR-23-IJKL3",
    employee: "Nelly Manu",
    leaveType: "Medical",
    from: "Nov 8, 2025",
    to: "Nov 12, 2025",
    days: 4,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "3",
    requestId: "LR-23-QRST5",
    employee: "Abena Osei",
    leaveType: "Annual",
    from: "Jul 4, 2025",
    to: "Jul 11, 2025",
    days: 7,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "4",
    requestId: "LR-23-YZAB7",
    employee: "Wangari Maathai",
    leaveType: "Annual",
    from: "Sep 1, 2025",
    to: "Sep 10, 2025",
    days: 9,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "5",
    requestId: "LR-23-GHIJ9",
    employee: "Kwame Nkunim",
    leaveType: "Annual",
    from: "Dec 20, 2025",
    to: "Dec 31, 2025",
    days: 11,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "6",
    requestId: "LR-23-OPQR1",
    employee: "Kojo Mensah",
    leaveType: "Medical",
    from: "Feb 14, 2025",
    to: "Feb 16, 2025",
    days: 2,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "7",
    requestId: "LR-23-WXYZ3",
    employee: "Kofi Annan",
    leaveType: "Medical",
    from: "Jun 5, 2025",
    to: "Jun 7, 2025",
    days: 2,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "8",
    requestId: "LR-23-56782",
    employee: "Chinua Achebe",
    leaveType: "Annual",
    from: "Aug 10, 2025",
    to: "Aug 17, 2025",
    days: 7,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "9",
    requestId: "LR-23-11214",
    employee: "Ama Ata Aidoo",
    leaveType: "Annual",
    from: "Oct 22, 2025",
    to: "Oct 29, 2025",
    days: 7,
    status: "Pending",
    statusColor: "text-amber-600"
  },
  {
    id: "10",
    requestId: "LR-23-51616",
    employee: "Nelson Mandela",
    leaveType: "Annual",
    from: "Apr 1, 2025",
    to: "Apr 5, 2025",
    days: 4,
    status: "Pending",
    statusColor: "text-amber-600"
  }
];

export function PendingApprovalsLeave() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApprovals = mockApprovals.filter((approval) => {
    const matchesSearch =
      approval.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.leaveType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || approval.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalResults = filteredApprovals.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentApprovals = filteredApprovals.slice(startIndex, endIndex);

  const handleApprove = (id: string) => {
    console.log("Approve:", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject:", id);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">
          <span className="text-slate-300">Approvals / </span>
          <span>Leave</span>
        </h1>
        
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
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 hover:bg-slate-50 transition-colors">
              <span>Export</span>
              <Download size={16} className="text-purple-700" />
            </button>

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
              <th className="px-6 py-4 text-left text-xs text-white">Request ID</th>
              <th className="px-6 py-4 text-left text-xs text-white">Employee</th>
              <th className="px-6 py-4 text-left text-xs text-white">Leave Type</th>
              <th className="px-6 py-4 text-left text-xs text-white">From</th>
              <th className="px-6 py-4 text-left text-xs text-white">To</th>
              <th className="px-6 py-4 text-left text-xs text-white">Days</th>
              <th className="px-6 py-4 text-left text-xs text-white">Status</th>
              <th className="px-6 py-4 text-center text-xs text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentApprovals.map((approval, index) => (
              <tr
                key={approval.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                } border-b border-slate-100 hover:bg-blue-50 transition-colors`}
              >
                <td className="px-6 py-4 text-xs text-slate-600">{approval.requestId}</td>
                <td className="px-6 py-4 text-xs text-slate-600">{approval.employee}</td>
                <td className="px-6 py-4 text-xs text-slate-600 capitalize">{approval.leaveType}</td>
                <td className="px-6 py-4 text-xs text-slate-600">{approval.from}</td>
                <td className="px-6 py-4 text-xs text-slate-600">{approval.to}</td>
                <td className="px-6 py-4 text-xs text-slate-600">{approval.days}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs ${approval.statusColor}`}>
                    {approval.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="p-1.5 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 border-t border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
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
          
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white border-r border-slate-200"
            >
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 16 16">
                <path d="M10 3.33333L6 8L10 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            <div className="px-3 py-2 bg-pink-50 min-w-[32px] flex items-center justify-center">
              <span className="text-sm font-medium text-green-600">{currentPage}</span>
            </div>
            
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages || 1, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white border-l border-slate-200"
            >
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 16 16">
                <path d="M6 3.33333L10 8L6 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingApprovalsLeave;
