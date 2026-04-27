import { useState } from "react";
import { Search, Download } from "lucide-react";

interface Refund {
  id: string;
  refundId: string;
  date: string;
  amount: string;
  reason: string;
  status: string;
  statusColor: string;
}

const mockRefunds: Refund[] = [];

export function MyRefunds() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const filteredRefunds = mockRefunds.filter((refund) => {
    const matchesSearch =
      refund.refundId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.amount.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || refund.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalResults = filteredRefunds.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
  const currentRefunds = filteredRefunds.slice(startIndex, endIndex);

  const handleRequestRefund = () => {
    setShowRequestModal(true);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">My Refunds</h1>
        
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
              <th className="px-6 py-4 text-left text-xs text-white">Refund ID</th>
              <th className="px-6 py-4 text-left text-xs text-white">Date</th>
              <th className="px-6 py-4 text-left text-xs text-white">Amount</th>
              <th className="px-6 py-4 text-left text-xs text-white">Reason</th>
              <th className="px-6 py-4 text-left text-xs text-white">Status</th>
              <th className="px-6 py-4 text-center text-xs text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRefunds.length > 0 ? (
              currentRefunds.map((refund, index) => (
                <tr
                  key={refund.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } border-b border-slate-100 hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-6 py-4 text-sm text-slate-900">{refund.refundId}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{refund.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{refund.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{refund.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${refund.statusColor}`}>
                      {refund.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-32">
                  <div className="flex flex-col items-center justify-center gap-8">
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-medium text-slate-700">
                        No Information to show yet
                      </h3>
                      <p className="text-base text-slate-400 max-w-md">
                        There is nothing to view right now. A request has to be placed to show up here.
                      </p>
                    </div>
                    <button
                      onClick={handleRequestRefund}
                      className="px-6 py-3.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors shadow-sm"
                    >
                      Request Refund
                    </button>
                  </div>
                </td>
              </tr>
            )}
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

export default MyRefunds;
