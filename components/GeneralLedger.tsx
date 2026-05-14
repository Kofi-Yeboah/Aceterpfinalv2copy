import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar, Pencil, X } from "lucide-react";

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

const initialLedgerData: LedgerEntry[] = [
  { id: 1, date: "Dec 01, 2024", accountCode: "5100", accountName: "Salaries & Wages", description: "Monthly payroll - December", debit: "$495,000", credit: "-", balance: "$495,000", category: "Expense" },
  { id: 2, date: "Nov 30, 2024", accountCode: "2100", accountName: "Accounts Payable", description: "Vendor payment - Office supplies", debit: "-", credit: "$12,450", balance: "$48,250", category: "Liability" },
  { id: 3, date: "Nov 28, 2024", accountCode: "1100", accountName: "Cash", description: "Grant disbursement received", debit: "$250,000", credit: "-", balance: "$785,000", category: "Asset" },
  { id: 4, date: "Nov 25, 2024", accountCode: "5200", accountName: "Employee Benefits", description: "Health insurance premiums", debit: "$45,800", credit: "-", balance: "$45,800", category: "Expense" },
  { id: 5, date: "Nov 20, 2024", accountCode: "1200", accountName: "Accounts Receivable", description: "Invoice payment received", debit: "$75,000", credit: "-", balance: "$125,000", category: "Asset" },
  { id: 6, date: "Nov 15, 2024", accountCode: "5100", accountName: "Salaries & Wages", description: "Bonus payments - Sales team", debit: "$45,000", credit: "-", balance: "$540,000", category: "Expense" },
  { id: 7, date: "Nov 12, 2024", accountCode: "5300", accountName: "Rent Expense", description: "Office rent - November", debit: "$18,500", credit: "-", balance: "$18,500", category: "Expense" },
  { id: 8, date: "Nov 10, 2024", accountCode: "1100", accountName: "Cash", description: "Payment to supplier", debit: "-", credit: "$32,100", balance: "$535,000", category: "Asset" },
];

const ACCOUNT_OPTIONS = [
  { code: "1100", name: "Cash", category: "Asset" },
  { code: "1200", name: "Accounts Receivable", category: "Asset" },
  { code: "2100", name: "Accounts Payable", category: "Liability" },
  { code: "3100", name: "Retained Earnings", category: "Equity" },
  { code: "4100", name: "Grant Revenue", category: "Revenue" },
  { code: "5100", name: "Salaries & Wages", category: "Expense" },
  { code: "5200", name: "Employee Benefits", category: "Expense" },
  { code: "5300", name: "Rent Expense", category: "Expense" },
  { code: "5400", name: "Office Supplies", category: "Expense" },
  { code: "5500", name: "Travel & Transport", category: "Expense" },
];

const emptyForm = {
  date: "",
  accountCode: "",
  description: "",
  entryType: "debit" as "debit" | "credit",
  amount: "",
};

export function GeneralLedger() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAccount, setSelectedAccount] = useState("All Accounts");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [ledgerData, setLedgerData] = useState(initialLedgerData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const nextEntryRef = `GL-${new Date().getFullYear()}-${String(ledgerData.length + 1).padStart(4, "0")}`;

  const handleAdd = () => {
    const account = ACCOUNT_OPTIONS.find((a) => a.code === formData.accountCode);
    if (!account || !formData.date || !formData.amount) return;
    const newEntry: LedgerEntry = {
      id: Date.now(),
      date: new Date(formData.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      accountCode: account.code,
      accountName: account.name,
      description: formData.description,
      debit: formData.entryType === "debit" ? `$${Number(formData.amount).toLocaleString()}` : "-",
      credit: formData.entryType === "credit" ? `$${Number(formData.amount).toLocaleString()}` : "-",
      balance: `$${Number(formData.amount).toLocaleString()}`,
      category: account.category,
    };
    setLedgerData([newEntry, ...ledgerData]);
    setFormData(emptyForm);
    setShowAddModal(false);
  };

  const handleEditOpen = (entry: LedgerEntry) => {
    setEditingEntry(entry);
    const isDebit = entry.debit !== "-";
    const rawAmount = (isDebit ? entry.debit : entry.credit).replace(/[$,]/g, "");
    setFormData({
      date: "",
      accountCode: entry.accountCode,
      description: entry.description,
      entryType: isDebit ? "debit" : "credit",
      amount: rawAmount,
    });
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!editingEntry || !formData.accountCode || !formData.amount) return;
    const account = ACCOUNT_OPTIONS.find((a) => a.code === formData.accountCode);
    if (!account) return;
    setLedgerData(ledgerData.map((e) =>
      e.id === editingEntry.id
        ? {
            ...e,
            accountCode: account.code,
            accountName: account.name,
            description: formData.description,
            debit: formData.entryType === "debit" ? `$${Number(formData.amount).toLocaleString()}` : "-",
            credit: formData.entryType === "credit" ? `$${Number(formData.amount).toLocaleString()}` : "-",
            balance: `$${Number(formData.amount).toLocaleString()}`,
            category: account.category,
          }
        : e
    ));
    setEditingEntry(null);
    setFormData(emptyForm);
    setShowEditModal(false);
  };

  const renderModal = (title: string, subtitle: string, onSubmit: () => void, submitLabel: string, onClose: () => void, showDate: boolean) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h3 className="text-[16px] text-slate-900">{title}</h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {showDate && (
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Date <span className="text-red-500">*</span></label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Account <span className="text-red-500">*</span></label>
            <select value={formData.accountCode} onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Select account</option>
              {ACCOUNT_OPTIONS.map((a) => (<option key={a.code} value={a.code}>{a.code} - {a.name}</option>))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Description <span className="text-red-500">*</span></label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter transaction description" rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="border-t border-slate-100" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Entry Type <span className="text-red-500">*</span></label>
              <select value={formData.entryType} onChange={(e) => setFormData({ ...formData, entryType: e.target.value as "debit" | "credit" })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Amount (USD) <span className="text-red-500">*</span></label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {formData.accountCode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-[11px] text-blue-700">
                This entry will post a <span className="font-medium">{formData.entryType}</span> of <span className="font-medium">${Number(formData.amount || 0).toLocaleString()}</span> to <span className="font-medium">{ACCOUNT_OPTIONS.find(a => a.code === formData.accountCode)?.name}</span>.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onSubmit} className="px-5 py-2 rounded-lg text-[13px] text-white hover:bg-purple-800 transition-colors bg-purple-700">{submitLabel}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">General Ledger</h1>
      </div>

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by account, description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedCategory}</span><ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedAccount}</span><ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <Calendar className="w-4 h-4" /><span>{dateRange}</span><ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />Export
            </button>
            <button onClick={() => { setFormData(emptyForm); setShowAddModal(true); }} className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity flex items-center gap-2" style={{ backgroundColor: "#0B01D0" }}>
              <Plus className="w-4 h-4" />New Entry
            </button>
          </div>
        </div>
      </div>

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
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.map((entry) => (
              <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{entry.date}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900 font-mono">{entry.accountCode}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{entry.accountName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{entry.description}</p></td>
                <td className="px-4 py-4 text-right"><p className="text-[12px] font-medium text-slate-900">{entry.debit}</p></td>
                <td className="px-4 py-4 text-right"><p className="text-[12px] font-medium text-slate-900">{entry.credit}</p></td>
                <td className="px-4 py-4 text-right"><p className="text-[12px] font-medium text-slate-900">{entry.balance}</p></td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${
                    entry.category === "Asset" ? "bg-blue-50 text-blue-700" :
                    entry.category === "Expense" ? "bg-orange-50 text-orange-700" :
                    entry.category === "Revenue" ? "bg-green-50 text-green-700" :
                    entry.category === "Equity" ? "bg-indigo-50 text-indigo-700" :
                    "bg-purple-50 text-purple-700"
                  }`}>{entry.category}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button onClick={() => handleEditOpen(entry)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Edit entry">
                    <Pencil className="w-4 h-4 text-slate-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && renderModal("New Ledger Entry", nextEntryRef, handleAdd, "Submit Entry", () => { setFormData(emptyForm); setShowAddModal(false); }, true)}
      {showEditModal && renderModal("Edit Ledger Entry", editingEntry ? `${editingEntry.accountCode} - ${editingEntry.accountName}` : "", handleEditSave, "Save Changes", () => { setEditingEntry(null); setFormData(emptyForm); setShowEditModal(false); }, false)}
    </div>
  );
}
