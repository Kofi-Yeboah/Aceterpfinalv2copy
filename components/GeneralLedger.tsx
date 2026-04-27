import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar } from "lucide-react";

interface LedgerEntry {
  id: number;
  date: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
  category: string;
}

const ledgerData: LedgerEntry[] = [
  { id: 1, date: "Dec 01, 2024", accountCode: "5100", accountName: "Salaries & Wages", description: "Monthly payroll - December", debit: "$495,000", credit: "-", balance: "$495,000", category: "Expense" },
  { id: 2, date: "Nov 30, 2024", accountCode: "2100", accountName: "Accounts Payable", description: "Vendor payment - Office supplies", debit: "-", credit: "$12,450", balance: "$48,250", category: "Liability" },
  { id: 3, date: "Nov 28, 2024", accountCode: "1100", accountName: "Cash", description: "Grant disbursement received", debit: "$250,000", credit: "-", balance: "$785,000", category: "Asset" },
  { id: 4, date: "Nov 25, 2024", accountCode: "5200", accountName: "Employee Benefits", description: "Health insurance premiums", debit: "$45,800", credit: "-", balance: "$45,800", category: "Expense" },
  { id: 5, date: "Nov 20, 2024", accountCode: "1200", accountName: "Accounts Receivable", description: "Invoice payment received", debit: "$75,000", credit: "-", balance: "$125,000", category: "Asset" },
  { id: 6, date: "Nov 15, 2024", accountCode: "5100", accountName: "Salaries & Wages", description: "Bonus payments - Sales team", debit: "$45,000", credit: "-", balance: "$540,000", category: "Expense" },
  { id: 7, date: "Nov 12, 2024", accountCode: "5300", accountName: "Rent Expense", description: "Office rent - November", debit: "$18,500", credit: "-", balance: "$18,500", category: "Expense" },
  { id: 8, date: "Nov 10, 2024", accountCode: "1100", accountName: "Cash", description: "Payment to supplier", debit: "-", credit: "$32,100", balance: "$535,000", category: "Asset" },
];

export function GeneralLedger() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAccount, setSelectedAccount] = useState("All Accounts");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">General Ledger</h1>
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
                placeholder="Search by account, description..."
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

          {/* Account Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedAccount}</span>
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account Code</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Debit</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Credit</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Balance</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Category</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.map((entry) => (
              <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{entry.date}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{entry.accountCode}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{entry.accountName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{entry.description}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{entry.debit}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{entry.credit}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{entry.balance}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                    entry.category === "Asset" ? "bg-blue-50 text-blue-700" :
                    entry.category === "Expense" ? "bg-orange-50 text-orange-700" :
                    "bg-purple-50 text-purple-700"
                  }`}>
                    {entry.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}