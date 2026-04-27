import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar, MoreHorizontal } from "lucide-react";

interface CashTransaction {
  id: number;
  date: string;
  transactionType: "Receipt" | "Payment";
  referenceNo: string;
  description: string;
  category: string;
  amount: string;
  balance: string;
  paymentMethod: string;
}

const cashData: CashTransaction[] = [
  { id: 1, date: "Dec 01, 2024", transactionType: "Payment", referenceNo: "PAY-2024-001", description: "Office supplies purchase", category: "Operations", amount: "$12,450", balance: "$785,550", paymentMethod: "Bank Transfer" },
  { id: 2, date: "Nov 30, 2024", transactionType: "Receipt", referenceNo: "REC-2024-045", description: "Grant disbursement", category: "Funding", amount: "$250,000", balance: "$798,000", paymentMethod: "Wire Transfer" },
  { id: 3, date: "Nov 28, 2024", transactionType: "Payment", referenceNo: "PAY-2024-002", description: "Software licenses", category: "IT", amount: "$25,000", balance: "$548,000", paymentMethod: "Credit Card" },
  { id: 4, date: "Nov 25, 2024", transactionType: "Payment", referenceNo: "PAY-2024-003", description: "Health insurance premiums", category: "Benefits", amount: "$45,800", balance: "$573,000", paymentMethod: "Bank Transfer" },
  { id: 5, date: "Nov 22, 2024", transactionType: "Receipt", referenceNo: "REC-2024-046", description: "Invoice payment received", category: "Revenue", amount: "$75,000", balance: "$618,800", paymentMethod: "Bank Transfer" },
  { id: 6, date: "Nov 20, 2024", transactionType: "Payment", referenceNo: "PAY-2024-004", description: "Office rent - November", category: "Operations", amount: "$18,500", balance: "$543,800", paymentMethod: "Check" },
  { id: 7, date: "Nov 18, 2024", transactionType: "Payment", referenceNo: "PAY-2024-005", description: "Marketing campaign", category: "Marketing", amount: "$32,000", balance: "$562,300", paymentMethod: "Bank Transfer" },
  { id: 8, date: "Nov 15, 2024", transactionType: "Payment", referenceNo: "PAY-2024-006", description: "Staff training program", category: "Training", amount: "$15,600", balance: "$594,300", paymentMethod: "Credit Card" },
];

export function CashManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All Methods");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Cash Management</h1>
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
                placeholder="Search by reference, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[140px] justify-between">
              <span>{selectedType}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedCategory}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedPaymentMethod}</span>
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
              New Transaction
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
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Type</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Reference No.</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Category</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Balance</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Payment Method</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {cashData.map((transaction) => (
              <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{transaction.date}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                    transaction.transactionType === "Receipt" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {transaction.transactionType}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{transaction.referenceNo}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{transaction.description}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{transaction.category}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className={`text-[12px] font-medium ${
                    transaction.transactionType === "Receipt" ? "text-green-700" : "text-red-700"
                  }`}>
                    {transaction.transactionType === "Receipt" ? "+" : "-"}{transaction.amount}
                  </p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{transaction.balance}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{transaction.paymentMethod}</p>
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