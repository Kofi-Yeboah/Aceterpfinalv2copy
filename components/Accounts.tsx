import { useState, useMemo } from "react";
import { Search, Download, Plus, Building2, Landmark, CreditCard, TrendingUp, TrendingDown, ChevronDown, ArrowLeft, ArrowUpRight, ArrowDownLeft, X, Shield, FileText, GitBranch, Eye, Layers, DollarSign, CheckCircle2, Trash2, Pencil } from "lucide-react";
import type { SRDAccount, AccountType, AccountStatus } from "./finance/types";
import { mockSRDAccounts } from "./finance/mockData";
import { formatCurrency, formatSegmentedCode } from "./finance/helpers";
import { AccountHierarchyTree } from "./finance/AccountHierarchyTree";

type ViewMode = "table" | "hierarchy";

function getTypeBadge(type: AccountType) {
  switch (type) {
    case "Asset": return "bg-blue-50 text-blue-600";
    case "Liability": return "bg-orange-50 text-orange-600";
    case "Revenue": return "bg-emerald-50 text-emerald-600";
    case "Expense": return "bg-red-50 text-red-600";
    case "Equity": return "bg-purple-50 text-purple-600";
    default: return "bg-slate-50 text-slate-600";
  }
}

function getTypeBadgeBorder(type: AccountType) {
  switch (type) {
    case "Asset": return "bg-blue-50 text-blue-600 border-blue-200";
    case "Liability": return "bg-orange-50 text-orange-600 border-orange-200";
    case "Revenue": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Expense": return "bg-red-50 text-red-600 border-red-200";
    case "Equity": return "bg-purple-50 text-purple-600 border-purple-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getTypeIcon(type: AccountType) {
  switch (type) {
    case "Asset": return <TrendingUp size={14} />;
    case "Liability": return <TrendingDown size={14} />;
    case "Revenue": return <Landmark size={14} />;
    case "Expense": return <CreditCard size={14} />;
    case "Equity": return <Building2 size={14} />;
  }
}

function getStatusBadge(status: AccountStatus) {
  switch (status) {
    case "Active": return "bg-green-50 text-green-700 border-green-200";
    case "Draft": return "bg-slate-50 text-slate-600 border-slate-200";
    case "PendingApproval": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Approved": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Inactive": return "bg-red-50 text-red-700 border-red-200";
  }
}

export function Accounts() {
  const [accounts, setAccounts] = useState<SRDAccount[]>(mockSRDAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [viewItem, setViewItem] = useState<SRDAccount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountType, setNewAccountType] = useState("Asset");
  const [detailTab, setDetailTab] = useState<"overview" | "transactions">("overview");
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");
  const [txnFromDate, setTxnFromDate] = useState("");
  const [txnToDate, setTxnToDate] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const filtered = useMemo(() => {
    return accounts.filter((item) => {
      const matchesSearch =
        item.code.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.accountGroup.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "All Types" || item.type === typeFilter;
      const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, searchQuery, typeFilter, statusFilter]);

  const totalAccounts = accounts.length;
  const activeCount = accounts.filter(a => a.status === "Active").length;
  const controlCount = accounts.filter(a => a.isControlAccount).length;
  const totalAssets = accounts.filter(a => a.type === "Asset" && a.normalBalance === "Debit").reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === "Liability").reduce((sum, a) => sum + a.balance, 0);

  const handleStatusChange = (accountId: string, newStatus: AccountStatus) => {
    setAccounts(prev => prev.map(a => a.id === accountId ? {
      ...a, status: newStatus,
      versionHistory: [...a.versionHistory, {
        version: a.versionHistory.length + 1,
        changedBy: "Current User",
        changedDate: new Date().toISOString().split("T")[0],
        changes: `Status changed to ${newStatus}`,
        effectiveDate: new Date().toISOString().split("T")[0],
      }]
    } : a));
    setShowGovernanceModal(null);
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(a => a.id !== accountId));
    setDeleteConfirmId(null);
    if (viewItem?.id === accountId) setViewItem(null);
  };

  const handleRenameAccount = (accountId: string) => {
    if (editNameValue.trim()) {
      setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, name: editNameValue.trim() } : a));
      if (viewItem?.id === accountId) {
        setViewItem({ ...viewItem, name: editNameValue.trim() });
      }
    }
    setEditingNameId(null);
    setEditNameValue("");
  };

  // ========== VIEW ACCOUNT DETAILS ==========
  if (viewItem) {
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <button onClick={() => setViewItem(null)} className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 mb-3">
            <ArrowLeft size={15} /> Back to Accounts
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeBadge(viewItem.type)}`}>
                {getTypeIcon(viewItem.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-slate-900">{viewItem.name}</h1>
                  {viewItem.isControlAccount && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-600 border border-purple-200">
                      <Shield size={10} /> Control Account
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-slate-500 font-mono">{viewItem.code.account}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] border ${getStatusBadge(viewItem.status)}`}>
                {viewItem.status === "PendingApproval" ? "Pending Approval" : viewItem.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 bg-white border-b border-slate-200 flex items-center gap-0 shrink-0">
          <button
            onClick={() => setDetailTab("overview")}
            className={`px-5 py-3 text-[13px] font-medium border-b-2 transition-colors ${
              detailTab === "overview" ? "border-purple-700 text-purple-700" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setDetailTab("transactions")}
            className={`px-5 py-3 text-[13px] font-medium border-b-2 transition-colors ${
              detailTab === "transactions" ? "border-purple-700 text-purple-700" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Transactions
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          {detailTab === "overview" && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Balance</p>
                  <p className="text-[18px] text-slate-900">{formatCurrency(viewItem.balance, viewItem.currency)}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{viewItem.currency}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Account Group</p>
                  <p className="text-[18px] text-slate-900">{viewItem.accountGroup}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Last Activity</p>
                  <p className="text-[18px] text-slate-900">{viewItem.lastTransaction}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Effective {viewItem.effectiveDate}</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white border border-slate-200 rounded-xl">
                <div className="px-5 py-3 border-b border-slate-100">
                  <h3 className="text-[13px] font-medium text-slate-900">Account Information</h3>
                </div>
                <div className="px-5 py-4 grid grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Type</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${getTypeBadgeBorder(viewItem.type)}`}>
                      {getTypeIcon(viewItem.type)} {viewItem.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p>
                    <p className="text-[13px] text-slate-900">{viewItem.department}</p>
                  </div>
                  {viewItem.controlType && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Control Type</p>
                      <p className="text-[13px] text-purple-700">{viewItem.controlType}</p>
                    </div>
                  )}
                  {viewItem.parentAccountId && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Parent Account</p>
                      <p className="text-[13px] text-blue-600">{accounts.find(a => a.id === viewItem.parentAccountId)?.name || "—"}</p>
                    </div>
                  )}
                </div>

                {viewItem.isControlAccount && (
                  <div className="mx-5 mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-[11px] text-purple-700">
                      This is a <strong>control account</strong>. Direct postings are restricted. All entries must flow through the {viewItem.controlType} sub-ledger.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {detailTab === "transactions" && (() => {
            const allTxns = [
              { date: "Feb 28, 2026", isoDate: "2026-02-28", ref: "JE-2026-0003", desc: "Monthly depreciation", debit: 0, credit: 10417, bal: viewItem.balance },
              { date: "Feb 25, 2026", isoDate: "2026-02-25", ref: "JE-2026-0001", desc: "Payroll expense", debit: 285000, credit: 0, bal: viewItem.balance + 10417 },
              { date: "Feb 15, 2026", isoDate: "2026-02-15", ref: "JE-2026-0005", desc: "Grant receivable adjustment", debit: 0, credit: 45000, bal: viewItem.balance + 10417 - 285000 },
              { date: "Feb 01, 2026", isoDate: "2026-02-01", ref: "JE-2026-0008", desc: "Opening balance transfer", debit: 120000, credit: 0, bal: viewItem.balance + 10417 - 285000 + 45000 },
              { date: "Jan 31, 2026", isoDate: "2026-01-31", ref: "JE-2026-0002", desc: "Period close adjustment", debit: 0, credit: 8500, bal: viewItem.balance + 10417 - 285000 + 45000 - 120000 },
            ];
            const filteredTxns = allTxns.filter((txn) => {
              if (txnFromDate && txn.isoDate < txnFromDate) return false;
              if (txnToDate && txn.isoDate > txnToDate) return false;
              return true;
            });
            return (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">From</label>
                  <input type="date" value={txnFromDate} onChange={(e) => setTxnFromDate(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-[12px]" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">To</label>
                  <input type="date" value={txnToDate} onChange={(e) => setTxnToDate(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-[12px]" />
                </div>
                {(txnFromDate || txnToDate) && (
                  <button onClick={() => { setTxnFromDate(""); setTxnToDate(""); }} className="mt-4 px-3 py-2 text-[11px] text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                    Clear
                  </button>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "#0B01D0" }}>
                      <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Date</th>
                      <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Reference</th>
                      <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Description</th>
                      <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Debit</th>
                      <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Credit</th>
                      <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12">
                          <FileText size={32} className="text-slate-200 mx-auto mb-2" />
                          <p className="text-[13px] text-slate-400">No transactions in selected date range</p>
                        </td>
                      </tr>
                    ) : filteredTxns.map((txn, i) => (
                    <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-4 py-3 text-[12px] text-slate-500">{txn.date}</td>
                      <td className="px-4 py-3 text-[12px] text-blue-700">{txn.ref}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900">{txn.desc}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900 text-right font-mono">{txn.debit > 0 ? formatCurrency(txn.debit) : "—"}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900 text-right font-mono">{txn.credit > 0 ? formatCurrency(txn.credit) : "—"}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900 text-right font-mono">{formatCurrency(txn.bal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
            );
          })()}
        </div>

      </div>
    );
  }

  // ========== MAIN LIST VIEW ==========
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Chart of Accounts</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">SRD-compliant segmented account structure</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg text-[13px] text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#0B01D0" }}
          >
            <Plus size={14} /> New Account
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="p-2 rounded-full bg-slate-50"><Layers className="w-5 h-5 text-slate-600" /></div>
              <p className="text-[11px] text-slate-500 leading-tight">Total Accounts</p>
            </div>
            <p className="text-[20px] text-slate-900">{totalAccounts}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="p-2 rounded-full bg-green-50"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
              <p className="text-[11px] text-slate-500 leading-tight">Active</p>
            </div>
            <p className="text-[20px] text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="p-2 rounded-full bg-purple-50"><Shield className="w-5 h-5 text-purple-700" /></div>
              <p className="text-[11px] text-slate-500 leading-tight">Control Accounts</p>
            </div>
            <p className="text-[20px] text-purple-600">{controlCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="p-2 rounded-full bg-blue-50"><DollarSign className="w-5 h-5 text-blue-600" /></div>
              <p className="text-[11px] text-slate-500 leading-tight">Total Assets</p>
            </div>
            <p className="text-[20px] text-blue-600">{formatCurrency(totalAssets)}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="p-2 rounded-full bg-orange-50"><CreditCard className="w-5 h-5 text-orange-500" /></div>
              <p className="text-[11px] text-slate-500 leading-tight">Total Liabilities</p>
            </div>
            <p className="text-[20px] text-orange-600">{formatCurrency(totalLiabilities)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by code, name, description, group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowStatusDropdown(false); }}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 bg-white min-w-[140px] justify-between"
            >
              <span>{typeFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                {["All Types", "Asset", "Liability", "Equity", "Revenue", "Expense", "Bank"].map(t => (
                  <button key={t} onClick={() => { setTypeFilter(t); setShowTypeDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">{t}</button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowTypeDropdown(false); }}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 bg-white min-w-[150px] justify-between"
            >
              <span>{statusFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                {["All Statuses", "Active", "Inactive"].map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">{s === "PendingApproval" ? "Pending Approval" : s}</button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 text-[11px] ${viewMode === "table" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("hierarchy")}
              className={`px-3 py-2 text-[11px] ${viewMode === "hierarchy" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              Hierarchy
            </button>
          </div>

          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 bg-white">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === "hierarchy" ? (
          <div className="p-6">
            <AccountHierarchyTree accounts={filtered} onSelect={setViewItem} />
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0">
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Account Code</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Account Name</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Type</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Group</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Balance</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Status</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((account, i) => (
                <tr
                  key={account.id}
                  className={`border-b border-slate-100 hover:bg-blue-50/50 cursor-pointer transition-colors ${i % 2 === 1 ? "bg-slate-50/50" : "bg-white"}`}
                  onClick={() => setViewItem(account)}
                >
                  <td className="px-4 py-3">
                    <p className="font-mono text-[11px] text-slate-700">{account.code.account}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-900 font-medium">{account.name}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{account.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${getTypeBadgeBorder(account.type)}`}>
                      {getTypeIcon(account.type)} {account.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{account.accountGroup}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-[11px] text-slate-900">{formatCurrency(account.balance, account.currency)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(account.status)}`}>
                      {account.status === "PendingApproval" ? "Pending" : account.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setViewItem(account); }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingNameId(account.id); setEditNameValue(account.name); }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        title="Edit Name"
                      >
                        <Pencil size={14} />
                      </button>
                      {account.balance === 0 && !account.lastTransaction && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(account.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          title="Delete Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">Showing {filtered.length} of {totalAccounts} accounts</p>
        <p className="text-[11px] text-slate-400">Segmented Code: Entity-BU-Dept-Account-CostCenter-IC</p>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] max-h-[85vh] overflow-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900">Create New Account</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase">Account Name</label>
                <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" placeholder="Enter account name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Account Type</label>
                  <select value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option>Asset</option><option>Liability</option><option>Equity</option><option>Revenue</option><option>Expense</option><option>Bank</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Account Group</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option value="">Select...</option>
                    {newAccountType === "Asset" && <>
                      <option>Current Assets — Cash & Equivalents</option>
                      <option>Current Assets — Receivables</option>
                      <option>Current Assets — Inventory</option>
                      <option>Current Assets — Prepaid & Other</option>
                      <option>Non-Current Assets — Fixed Assets</option>
                      <option>Non-Current Assets — Acc. Depreciation</option>
                      <option>Non-Current Assets — Intangibles</option>
                      <option>Non-Current Assets — Investments</option>
                    </>}
                    {newAccountType === "Liability" && <>
                      <option>Current Liabilities</option>
                      <option>Non-Current Liabilities</option>
                    </>}
                    {newAccountType === "Equity" && <>
                      <option>Equity — Capital</option>
                      <option>Equity — Reserves & Retained Earnings</option>
                    </>}
                    {newAccountType === "Revenue" && <>
                      <option>Revenue — Operating</option>
                      <option>Revenue — Non-Operating</option>
                      <option>Cost of Goods Sold</option>
                      <option>Operating Expenses — Personnel</option>
                    </>}
                    {newAccountType === "Expense" && <>
                      <option>Operating Expenses — General & Admin</option>
                      <option>Operating Expenses — Selling</option>
                      <option>Depreciation & Amortization</option>
                      <option>Finance Costs</option>
                      <option>Tax</option>
                    </>}
                    {newAccountType === "Bank" && <>
                      <option>Current Assets — Cash & Equivalents</option>
                      <option>Current Assets — Bank Accounts</option>
                    </>}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase">Currency</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                  <option>USD</option><option>GHS</option><option>EUR</option><option>GBP</option>
                </select>
              </div>
              {newAccountType === "Bank" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase">Account Number</label>
                    <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" placeholder="Enter account number" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase">Opening Balance</label>
                    <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" placeholder="0.00" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="controlAccount" className="rounded border-slate-300" />
                  <label htmlFor="controlAccount" className="text-[12px] text-slate-700">Control Account</label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-[13px] text-white hover:opacity-90" style={{ backgroundColor: "#0B01D0" }}>
                Create as Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Name Modal */}
      {editingNameId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900">Edit Account Name</h2>
              <button onClick={() => { setEditingNameId(null); setEditNameValue(""); }} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="px-6 py-5">
              <label className="text-[10px] text-slate-500 uppercase block mb-1">Account Name</label>
              <input
                type="text"
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleRenameAccount(editingNameId); }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]"
                autoFocus
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => { setEditingNameId(null); setEditNameValue(""); }} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
              <button onClick={() => handleRenameAccount(editingNameId)} className="px-4 py-2 rounded-lg text-[13px] text-white hover:opacity-90" style={{ backgroundColor: "#0B01D0" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (() => {
        const acct = accounts.find(a => a.id === deleteConfirmId);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[420px] shadow-xl">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-slate-900">Delete Account</h2>
                <button onClick={() => setDeleteConfirmId(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
              <div className="px-6 py-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <Trash2 size={18} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-[13px] text-slate-900 font-medium">Are you sure you want to delete this account?</p>
                    {acct && (
                      <p className="text-[12px] text-slate-500 mt-1">{acct.code.account} — {acct.name}</p>
                    )}
                    <p className="text-[12px] text-slate-400 mt-2">This action cannot be undone.</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
                <button onClick={() => handleDeleteAccount(deleteConfirmId)} className="px-4 py-2 rounded-lg text-[13px] text-white bg-red-600 hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
