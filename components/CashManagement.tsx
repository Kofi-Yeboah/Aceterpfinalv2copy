import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar, MoreHorizontal, X } from "lucide-react";

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

const initialCashData: CashTransaction[] = [
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
  const [cashData, setCashData] = useState<CashTransaction[]>(initialCashData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    transactionType: "Receipt" as "Receipt" | "Payment",
    referenceNo: "",
    description: "",
    category: "Operations",
    amount: "",
    paymentMethod: "Bank Transfer",
  });

  const handleAddTransaction = () => {
    const newTransaction: CashTransaction = {
      id: cashData.length > 0 ? Math.max(...cashData.map((t) => t.id)) + 1 : 1,
      date: formData.date,
      transactionType: formData.transactionType,
      referenceNo: formData.referenceNo,
      description: formData.description,
      category: formData.category,
      amount: `$${formData.amount}`,
      balance: "$0",
      paymentMethod: formData.paymentMethod,
    };
    setCashData([newTransaction, ...cashData]);
    setShowAddModal(false);
    setFormData({
      date: "",
      transactionType: "Receipt",
      referenceNo: "",
      description: "",
      category: "Operations",
      amount: "",
      paymentMethod: "Bank Transfer",
    });
  };

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
              onClick={() => setShowAddModal(true)}
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

      {/* New Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <div>
                <h3 className="text-[16px] text-slate-900">New Transaction</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">TXN-2024-{String(cashData.length + 1).padStart(3, "0")}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Date + Transaction Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Transaction Type</label>
                  <select
                    value={formData.transactionType}
                    onChange={(e) => setFormData({ ...formData, transactionType: e.target.value as "Receipt" | "Payment" })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Receipt">Receipt</option>
                    <option value="Payment">Payment</option>
                  </select>
                </div>
              </div>

              {/* Reference No */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Reference No</label>
                <input
                  type="text"
                  value={formData.referenceNo}
                  onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                  placeholder="e.g. PAY-2024-007"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Transaction description"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="border-t border-slate-100" />

              {/* Category + Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Funding">Funding</option>
                    <option value="IT">IT</option>
                    <option value="Benefits">Benefits</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleAddTransaction} className="px-5 py-2 rounded-lg text-[13px] text-white hover:bg-purple-800 transition-colors bg-purple-700">Add Transaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}