import { useState, useMemo } from "react";
import { Search, Download, Plus, Building2, Landmark, CreditCard, TrendingUp, TrendingDown, ChevronDown, ArrowLeft, ArrowUpRight, ArrowDownLeft, X, Shield, FileText, GitBranch, Eye } from "lucide-react";
import type { SRDAccount, AccountType, AccountStatus } from "./finance/types";
import { mockSRDAccounts } from "./finance/mockData";
import { formatCurrency, formatSegmentedCode } from "./finance/helpers";
import { SegmentFilter } from "./finance/SegmentFilter";
import { AccountGovernanceModal } from "./finance/AccountGovernanceModal";
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
  const [segmentFilters, setSegmentFilters] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [viewItem, setViewItem] = useState<SRDAccount | null>(null);
  const [showGovernanceModal, setShowGovernanceModal] = useState<SRDAccount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const filtered = useMemo(() => {
    return accounts.filter((item) => {
      const matchesSearch =
        item.displayCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.accountGroup.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "All Types" || item.type === typeFilter;
      const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter;
      const matchesSegments = Object.entries(segmentFilters).every(([key, value]) => {
        if (!value) return true;
        const segValue = item.code[key as keyof typeof item.code];
        return segValue.includes(value);
      });
      return matchesSearch && matchesType && matchesStatus && matchesSegments;
    });
  }, [accounts, searchQuery, typeFilter, statusFilter, segmentFilters]);

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
                <p className="text-[12px] text-slate-500 font-mono">{viewItem.displayCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowGovernanceModal(viewItem)} className="px-3 py-1.5 rounded-lg text-[11px] border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5">
                <GitBranch size={12} /> Governance
              </button>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] border ${getStatusBadge(viewItem.status)}`}>
                {viewItem.status === "PendingApproval" ? "Pending Approval" : viewItem.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Balance</p>
              <p className="text-[18px] text-slate-900">{formatCurrency(viewItem.balance, viewItem.currency)}</p>
              <p className="text-[10px] text-slate-400 mt-1">{viewItem.currency}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Normal Balance</p>
              <p className="text-[18px] text-slate-900">{viewItem.normalBalance}</p>
              <p className="text-[10px] text-slate-400 mt-1">{viewItem.normalBalance === "Debit" ? "Increases with debits" : "Increases with credits"}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Posting Level</p>
              <p className="text-[18px] text-slate-900">{viewItem.postingLevel}</p>
              <p className="text-[10px] text-slate-400 mt-1">{viewItem.postingLevel === "Summary" ? "No direct posting" : "Accepts direct posting"}</p>
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
            <div className="px-5 py-4 grid grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Type</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${getTypeBadgeBorder(viewItem.type)}`}>
                  {getTypeIcon(viewItem.type)} {viewItem.type}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Account Group</p>
                <p className="text-[13px] text-slate-900">{viewItem.accountGroup}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p>
                <p className="text-[13px] text-slate-900">{viewItem.department}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Tax Applicable</p>
                <p className="text-[13px] text-slate-900">{viewItem.taxApplicable ? "Yes" : "No"}</p>
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
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description</p>
                <p className="text-[13px] text-slate-700">{viewItem.description}</p>
              </div>
            </div>

            {viewItem.isControlAccount && (
              <div className="mx-5 mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-[11px] text-purple-700">
                  This is a <strong>control account</strong>. Direct postings are restricted. All entries must flow through the {viewItem.controlType} sub-ledger.
                </p>
              </div>
            )}
          </div>

          {/* Segmented Code Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-[13px] font-medium text-slate-900">Segmented Account Code</h3>
            </div>
            <div className="px-5 py-4 flex items-center gap-1">
              {[
                { label: "Entity", value: viewItem.code.entity },
                { label: "Bus. Unit", value: viewItem.code.businessUnit },
                { label: "Dept", value: viewItem.code.department },
                { label: "Account", value: viewItem.code.account },
                { label: "Cost Ctr", value: viewItem.code.costCenter },
                { label: "IC", value: viewItem.code.intercompany },
              ].map((seg, i) => (
                <div key={seg.label} className="flex items-center">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 uppercase">{seg.label}</p>
                    <p className="font-mono text-[14px] text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-200 mt-0.5">{seg.value}</p>
                  </div>
                  {i < 5 && <span className="text-slate-300 mx-1 text-[16px]">-</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Version History */}
          <div className="bg-white border border-slate-200 rounded-xl">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-[13px] font-medium text-slate-900">Version History</h3>
            </div>
            <div className="px-5 py-3">
              {viewItem.versionHistory.map((v) => (
                <div key={v.version} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <span className="text-[10px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 font-mono">v{v.version}</span>
                  <div className="flex-1">
                    <p className="text-[12px] text-slate-800">{v.changes}</p>
                    <p className="text-[10px] text-slate-500">By {v.changedBy} on {v.changedDate}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">Effective: {v.effectiveDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showGovernanceModal && (
          <AccountGovernanceModal
            account={showGovernanceModal}
            onClose={() => setShowGovernanceModal(null)}
            onStatusChange={handleStatusChange}
          />
        )}
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
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Total Accounts</p>
            <p className="text-[18px] font-semibold text-slate-900">{totalAccounts}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Active</p>
            <p className="text-[18px] font-semibold text-green-600">{activeCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Control Accounts</p>
            <p className="text-[18px] font-semibold text-purple-600">{controlCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Total Assets</p>
            <p className="text-[18px] font-semibold text-blue-600">{formatCurrency(totalAssets)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase">Total Liabilities</p>
            <p className="text-[18px] font-semibold text-orange-600">{formatCurrency(totalLiabilities)}</p>
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
                {["All Types", "Asset", "Liability", "Equity", "Revenue", "Expense"].map(t => (
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
                {["All Statuses", "Active", "Draft", "PendingApproval", "Approved", "Inactive"].map(s => (
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

        {/* Segment Filter */}
        <SegmentFilter onFilterChange={setSegmentFilters} />
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
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Normal Bal.</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Group</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Balance</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Status</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Flags</th>
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
                    <p className="font-mono text-[11px] text-slate-700">{account.displayCode}</p>
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
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium ${account.normalBalance === "Debit" ? "text-blue-600" : "text-orange-600"}`}>
                      {account.normalBalance === "Debit" ? <ArrowUpRight size={11} className="inline" /> : <ArrowDownLeft size={11} className="inline" />}
                      {" "}{account.normalBalance}
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
                      {account.isControlAccount && (
                        <span className="text-[8px] bg-purple-50 text-purple-600 border border-purple-200 px-1 py-0.5 rounded" title="Control Account">CTRL</span>
                      )}
                      {account.taxApplicable && (
                        <span className="text-[8px] bg-amber-50 text-amber-600 border border-amber-200 px-1 py-0.5 rounded" title="Tax Applicable">TAX</span>
                      )}
                      {account.postingLevel === "Summary" && (
                        <span className="text-[8px] bg-slate-100 text-slate-600 border border-slate-200 px-1 py-0.5 rounded" title="Summary - No Direct Posting">SUM</span>
                      )}
                    </div>
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
                        onClick={(e) => { e.stopPropagation(); setShowGovernanceModal(account); }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        title="Governance"
                      >
                        <GitBranch size={14} />
                      </button>
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

      {/* Governance Modal */}
      {showGovernanceModal && (
        <AccountGovernanceModal
          account={showGovernanceModal}
          onClose={() => setShowGovernanceModal(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] max-h-[85vh] overflow-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900">Create New Account</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-[12px] text-slate-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
                New accounts are created in <strong>Draft</strong> status and require approval before activation. Use the segmented code format: Entity(2)-BU(2)-Dept(2)-Account(4)-CostCenter(3)-IC(2)
              </p>
              <div className="grid grid-cols-6 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Entity</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-[12px] font-mono text-center" placeholder="01" maxLength={2} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">BU</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-[12px] font-mono text-center" placeholder="03" maxLength={2} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Dept</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-[12px] font-mono text-center" placeholder="01" maxLength={2} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Account</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-[12px] font-mono text-center" placeholder="1001" maxLength={4} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Cost Ctr</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-[12px] font-mono text-center" placeholder="001" maxLength={3} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">IC</label>
                  <input className="w-full px-2 py-1.5 border border-slate-200 rounded text-[12px] font-mono text-center" placeholder="00" maxLength={2} />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase">Account Name</label>
                <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" placeholder="Enter account name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Account Type</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option>Asset</option><option>Liability</option><option>Equity</option><option>Revenue</option><option>Expense</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Normal Balance</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option>Debit</option><option>Credit</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Currency</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option>USD</option><option>GHS</option><option>EUR</option><option>GBP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Posting Level</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option>Detail</option><option>Summary</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Account Group</label>
                  <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" placeholder="e.g. Cash & Bank" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="controlAccount" className="rounded border-slate-300" />
                  <label htmlFor="controlAccount" className="text-[12px] text-slate-700">Control Account</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="taxApplicable" className="rounded border-slate-300" />
                  <label htmlFor="taxApplicable" className="text-[12px] text-slate-700">Tax Applicable</label>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase">Description</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] h-16 resize-none" placeholder="Account description..." />
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
    </div>
  );
}
