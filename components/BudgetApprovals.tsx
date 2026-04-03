import { useState } from "react";
import { Search, Download, ChevronDown, Calendar, MoreHorizontal, Check, X } from "lucide-react";

interface BudgetApproval {
  id: number;
  requestNo: string;
  date: string;
  department: string;
  fiscalYear: string;
  requestedBy: string;
  budgetCategory: string;
  requestedAmount: string;
  currentBudget: string;
  status: "Pending" | "Approved" | "Rejected";
}

const budgetApprovalData: BudgetApproval[] = [
  { id: 1, requestNo: "BUD-REQ-001", date: "Dec 02, 2024", department: "Marketing", fiscalYear: "2025", requestedBy: "Sarah Johnson", budgetCategory: "Campaign Budget", requestedAmount: "$180,000", currentBudget: "$150,000", status: "Pending" },
  { id: 2, requestNo: "BUD-REQ-002", date: "Dec 01, 2024", department: "IT", fiscalYear: "2025", requestedBy: "John Smith", budgetCategory: "Infrastructure", requestedAmount: "$250,000", currentBudget: "$200,000", status: "Pending" },
  { id: 3, requestNo: "BUD-REQ-003", date: "Nov 30, 2024", department: "HR", fiscalYear: "2025", requestedBy: "Emily Davis", budgetCategory: "Training & Development", requestedAmount: "$95,000", currentBudget: "$75,000", status: "Approved" },
  { id: 4, requestNo: "BUD-REQ-004", date: "Nov 28, 2024", department: "Operations", fiscalYear: "2025", requestedBy: "Mike Brown", budgetCategory: "Facility Management", requestedAmount: "$220,000", currentBudget: "$200,000", status: "Approved" },
  { id: 5, requestNo: "BUD-REQ-005", date: "Nov 25, 2024", department: "Finance", fiscalYear: "2025", requestedBy: "Lisa White", budgetCategory: "Professional Services", requestedAmount: "$120,000", currentBudget: "$95,000", status: "Approved" },
  { id: 6, requestNo: "BUD-REQ-006", date: "Nov 22, 2024", department: "Sales", fiscalYear: "2025", requestedBy: "David Lee", budgetCategory: "Travel & Entertainment", requestedAmount: "$85,000", currentBudget: "$125,000", status: "Rejected" },
  { id: 7, requestNo: "BUD-REQ-007", date: "Nov 20, 2024", department: "Research", fiscalYear: "2025", requestedBy: "Anna Martinez", budgetCategory: "R&D Projects", requestedAmount: "$350,000", currentBudget: "$300,000", status: "Pending" },
  { id: 8, requestNo: "BUD-REQ-008", date: "Nov 18, 2024", department: "Customer Success", fiscalYear: "2025", requestedBy: "Tom Wilson", budgetCategory: "Customer Support", requestedAmount: "$140,000", currentBudget: "$120,000", status: "Approved" },
];

export function BudgetApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("All Years");
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

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Budget Approvals</h1>
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
                placeholder="Search by request no., department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[180px] justify-between">
              <span>{selectedDepartment}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Fiscal Year Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[140px] justify-between">
              <span>{selectedFiscalYear}</span>
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Fiscal Year</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Requested By</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Budget Category</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Requested</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Current</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {budgetApprovalData.map((approval) => (
              <tr key={approval.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{approval.requestNo}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{approval.date}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{approval.department}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] text-slate-600">{approval.fiscalYear}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{approval.requestedBy}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{approval.budgetCategory}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{approval.requestedAmount}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] text-slate-600">{approval.currentBudget}</p>
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