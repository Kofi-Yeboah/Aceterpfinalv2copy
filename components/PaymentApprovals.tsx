import { useState } from "react";
import { Search, Download, ChevronDown, Calendar, MoreHorizontal, Check, X } from "lucide-react";

interface PaymentApproval {
  id: number;
  requestNo: string;
  date: string;
  requestedBy: string;
  vendor: string;
  description: string;
  amount: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Rejected";
}

const approvalData: PaymentApproval[] = [
  { id: 1, requestNo: "PAY-REQ-001", date: "Dec 02, 2024", requestedBy: "John Smith", vendor: "Tech Solutions Ltd", description: "Software licenses renewal", amount: "$25,000", category: "IT", priority: "High", status: "Pending" },
  { id: 2, requestNo: "PAY-REQ-002", date: "Dec 01, 2024", requestedBy: "Sarah Johnson", vendor: "Marketing Agency", description: "Campaign development", amount: "$32,000", category: "Marketing", priority: "Medium", status: "Pending" },
  { id: 3, requestNo: "PAY-REQ-003", date: "Nov 30, 2024", requestedBy: "Mike Brown", vendor: "Office Supplies Co.", description: "Monthly office supplies", amount: "$12,450", category: "Operations", priority: "Low", status: "Approved" },
  { id: 4, requestNo: "PAY-REQ-004", date: "Nov 28, 2024", requestedBy: "Emily Davis", vendor: "Training Institute", description: "Staff training program", amount: "$15,600", category: "HR", priority: "Medium", status: "Approved" },
  { id: 5, requestNo: "PAY-REQ-005", date: "Nov 25, 2024", requestedBy: "John Smith", vendor: "Healthcare Plus", description: "Health insurance premiums", amount: "$45,800", category: "Benefits", priority: "High", status: "Approved" },
  { id: 6, requestNo: "PAY-REQ-006", date: "Nov 22, 2024", requestedBy: "Sarah Johnson", vendor: "Equipment Rentals", description: "Conference equipment rental", amount: "$5,200", category: "Events", priority: "Low", status: "Rejected" },
  { id: 7, requestNo: "PAY-REQ-007", date: "Nov 20, 2024", requestedBy: "Mike Brown", vendor: "Transport Services", description: "Team travel expenses", amount: "$8,750", category: "Travel", priority: "Medium", status: "Approved" },
  { id: 8, requestNo: "PAY-REQ-008", date: "Nov 18, 2024", requestedBy: "Emily Davis", vendor: "Consulting Firm", description: "Business consulting services", amount: "$18,500", category: "Professional Services", priority: "High", status: "Pending" },
];

export function PaymentApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-50 text-green-700";
      case "Rejected": return "bg-red-50 text-red-700";
      case "Pending": return "bg-yellow-50 text-yellow-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-700";
      case "Medium": return "bg-orange-50 text-orange-700";
      case "Low": return "bg-blue-50 text-blue-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Payment Approvals</h1>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by request no., vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedCategory}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedPriority}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedStatus}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <Calendar className="w-4 h-4" />
              <span>{dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Request No.</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Requested By</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Vendor</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Priority</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {approvalData.map((approval) => (
              <tr key={approval.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{approval.requestNo}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{approval.date}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{approval.requestedBy}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{approval.vendor}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{approval.description}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{approval.amount}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getPriorityColor(approval.priority)}`}>
                    {approval.priority}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(approval.status)}`}>
                    {approval.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    {approval.status === "Pending" && (
                      <>
                        <button className="p-1 hover:bg-green-50 rounded text-green-600">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-red-50 rounded text-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}