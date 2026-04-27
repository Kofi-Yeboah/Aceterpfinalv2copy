import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar, MoreHorizontal } from "lucide-react";

interface JournalEntry {
  id: number;
  entryNo: string;
  date: string;
  description: string;
  account: string;
  debit: string;
  credit: string;
  reference: string;
  createdBy: string;
  status: "Posted" | "Draft" | "Pending";
}

const journalData: JournalEntry[] = [
  { id: 1, entryNo: "JE-2024-001", date: "Dec 01, 2024", description: "Payroll expense entry", account: "Salaries & Wages", debit: "$495,000", credit: "-", reference: "PAY-DEC-2024", createdBy: "John Smith", status: "Posted" },
  { id: 2, entryNo: "JE-2024-002", date: "Nov 30, 2024", description: "Grant revenue recognition", account: "Grant Income", debit: "-", credit: "$250,000", reference: "GR-2024-45", createdBy: "Sarah Johnson", status: "Posted" },
  { id: 3, entryNo: "JE-2024-003", date: "Nov 28, 2024", description: "Office supplies expense", account: "Office Expenses", debit: "$12,450", credit: "-", reference: "INV-2024-123", createdBy: "Mike Brown", status: "Posted" },
  { id: 4, entryNo: "JE-2024-004", date: "Nov 25, 2024", description: "Insurance premium adjustment", account: "Prepaid Insurance", debit: "$45,800", credit: "-", reference: "INS-2024-11", createdBy: "John Smith", status: "Posted" },
  { id: 5, entryNo: "JE-2024-005", date: "Nov 22, 2024", description: "Depreciation expense", account: "Accumulated Depreciation", debit: "-", credit: "$8,500", reference: "DEP-NOV-2024", createdBy: "Sarah Johnson", status: "Posted" },
  { id: 6, entryNo: "JE-2024-006", date: "Nov 20, 2024", description: "Marketing expense accrual", account: "Marketing Expenses", debit: "$32,000", credit: "-", reference: "MKT-2024-45", createdBy: "Mike Brown", status: "Pending" },
  { id: 7, entryNo: "JE-2024-007", date: "Nov 18, 2024", description: "Rent expense allocation", account: "Rent Expense", debit: "$18,500", credit: "-", reference: "RENT-NOV-2024", createdBy: "John Smith", status: "Posted" },
  { id: 8, entryNo: "JE-2024-008", date: "Nov 15, 2024", description: "Equipment purchase entry", account: "Fixed Assets", debit: "$25,000", credit: "-", reference: "FA-2024-12", createdBy: "Sarah Johnson", status: "Draft" },
];

export function JournalEntries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("All Accounts");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Posted": return "bg-green-50 text-green-700";
      case "Draft": return "bg-slate-50 text-slate-700";
      case "Pending": return "bg-yellow-50 text-yellow-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Journal Entries</h1>
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
                placeholder="Search by entry number, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Account Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedAccount}</span>
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
            <button 
              className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: "#0B01D0" }}
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Entry No.</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Debit</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Credit</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Reference</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Created By</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {journalData.map((entry) => (
              <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{entry.entryNo}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.date}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.description}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{entry.account}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{entry.debit}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{entry.credit}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.reference}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.createdBy}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(entry.status)}`}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}