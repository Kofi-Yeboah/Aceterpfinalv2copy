import { useState } from "react";
import { Search, Download, ChevronDown, Plus, MoreHorizontal, X } from "lucide-react";

interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: string;
  lastTransaction: string;
  status: "Active" | "Inactive" | "Frozen";
}

const initialBankAccounts: BankAccount[] = [
  { id: 1, bankName: "First National Bank", accountNumber: "****4523", accountType: "Business Checking", currency: "USD", balance: "$485,230", lastTransaction: "Dec 01, 2024", status: "Active" },
  { id: 2, bankName: "Global Commerce Bank", accountNumber: "****7891", accountType: "Savings", currency: "USD", balance: "$250,000", lastTransaction: "Nov 28, 2024", status: "Active" },
  { id: 3, bankName: "International Trust Bank", accountNumber: "****3456", accountType: "Business Checking", currency: "EUR", balance: "€125,450", lastTransaction: "Nov 30, 2024", status: "Active" },
  { id: 4, bankName: "Capital Reserve Bank", accountNumber: "****9012", accountType: "Money Market", currency: "USD", balance: "$180,750", lastTransaction: "Nov 25, 2024", status: "Active" },
  { id: 5, bankName: "Eastern Financial Bank", accountNumber: "****2345", accountType: "Business Checking", currency: "USD", balance: "$95,620", lastTransaction: "Nov 22, 2024", status: "Active" },
  { id: 6, bankName: "Metropolitan Bank", accountNumber: "****6789", accountType: "Savings", currency: "GBP", balance: "£75,300", lastTransaction: "Nov 20, 2024", status: "Inactive" },
  { id: 7, bankName: "Regional Commerce Bank", accountNumber: "****4567", accountType: "Business Checking", currency: "USD", balance: "$0", lastTransaction: "Oct 15, 2024", status: "Frozen" },
  { id: 8, bankName: "United Trust Bank", accountNumber: "****8901", accountType: "Savings", currency: "USD", balance: "$325,480", lastTransaction: "Dec 01, 2024", status: "Active" },
];

export function BankingManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [selectedAccountType, setSelectedAccountType] = useState("All Account Types");
  const [selectedCurrency, setSelectedCurrency] = useState("All Currencies");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountType: "Business Checking",
    currency: "USD",
    balance: "",
  });

  const handleAddAccount = () => {
    const currencySymbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", GHS: "₵" };
    const symbol = currencySymbols[formData.currency] || "$";
    const formatted = `${symbol}${Number(formData.balance).toLocaleString()}`;
    const today = new Date();
    const lastTransaction = today.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).replace(/(\w+) (\d+), (\d+)/, "$1 $2, $3");
    const newAccount: BankAccount = {
      id: Date.now(),
      bankName: formData.bankName,
      accountNumber: `****${formData.accountNumber.slice(-4)}`,
      accountType: formData.accountType,
      currency: formData.currency,
      balance: formatted,
      lastTransaction,
      status: "Active",
    };
    setBankAccounts((prev) => [newAccount, ...prev]);
    setFormData({ bankName: "", accountNumber: "", accountType: "Business Checking", currency: "USD", balance: "" });
    setShowAddModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700";
      case "Inactive": return "bg-slate-50 text-slate-700";
      case "Frozen": return "bg-red-50 text-red-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Banking Management</h1>
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
                placeholder="Search by bank, account number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bank Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedBank}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Account Type Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[180px] justify-between">
              <span>{selectedAccountType}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Currency Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedCurrency}</span>
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
              Add Account
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Bank Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account Number</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account Type</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Currency</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Balance</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Last Transaction</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {bankAccounts.map((account) => (
              <tr key={account.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{account.bankName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{account.accountNumber}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{account.accountType}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] text-slate-600">{account.currency}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{account.balance}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{account.lastTransaction}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(account.status)}`}>
                    {account.status}
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

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <div>
                <h3 className="text-[16px] text-slate-900">Add Bank Account</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Register a new bank account</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter account number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Business Checking</option>
                    <option>Savings</option>
                    <option>Money Market</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>GHS</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Opening Balance</label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                className="px-5 py-2 rounded-lg text-[13px] text-white hover:bg-purple-800 transition-colors bg-purple-700"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}