import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Filter, CheckCircle2, Clock, FileText, XCircle, Layers, BarChart3, BookOpen } from "lucide-react";
import type { SRDJournalEntry, JournalStatus, LedgerType } from "./finance/types";
import { mockJournalEntries, mockSRDAccounts } from "./finance/mockData";
import { LEDGER_TYPES, JOURNAL_STATUSES } from "./finance/constants";
import { formatCurrency, getJournalTotals } from "./finance/helpers";
import { BatchPostingModal } from "./finance/BatchPostingModal";

const STATUS_ICONS: Record<JournalStatus, React.ReactNode> = {
  Draft: <FileText size={12} />,
  Submitted: <Clock size={12} />,
  Approved: <CheckCircle2 size={12} />,
  Posted: <CheckCircle2 size={12} />,
  Reversed: <XCircle size={12} />,
};

export function GeneralLedger() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLedger, setSelectedLedger] = useState<LedgerType | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<JournalStatus | "All">("All");
  const [entries, setEntries] = useState<SRDJournalEntry[]>(mockJournalEntries);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [detailEntry, setDetailEntry] = useState<SRDJournalEntry | null>(null);

  const filteredEntries = entries.filter(e => {
    if (selectedLedger !== "All" && e.ledgerType !== selectedLedger) return false;
    if (selectedStatus !== "All" && e.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.entryNo.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedEntries);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedEntries(next);
  };

  const toggleSelectAll = () => {
    if (selectedEntries.size === filteredEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(filteredEntries.map(e => e.id)));
    }
  };

  const handleBatchPost = (ids: string[]) => {
    setEntries(prev => prev.map(e => ids.includes(e.id) ? { ...e, status: "Posted" as JournalStatus, postedDate: "2026-05-17", postedBy: "System Admin" } : e));
    setSelectedEntries(new Set());
    setShowBatchModal(false);
  };

  const handleStatusChange = (id: string, newStatus: JournalStatus) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  // Summary stats
  const totalEntries = entries.length;
  const postedCount = entries.filter(e => e.status === "Posted").length;
  const pendingCount = entries.filter(e => e.status === "Submitted" || e.status === "Approved").length;
  const draftCount = entries.filter(e => e.status === "Draft").length;

  const postableEntries = filteredEntries.filter(e => e.status === "Approved" && selectedEntries.has(e.id));

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">General Ledger</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Multi-ledger posting with full lifecycle management</p>
          </div>
          <div className="flex items-center gap-2">
            {postableEntries.length > 0 && (
              <button
                onClick={() => setShowBatchModal(true)}
                className="px-4 py-2 rounded-lg text-[13px] text-white bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Layers size={14} />
                Batch Post ({postableEntries.length})
              </button>
            )}
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 bg-white">
              <Download size={14} />Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
            <BookOpen size={14} className="text-slate-500" />
            <span className="text-[11px] text-slate-500">Total</span>
            <span className="text-[13px] font-semibold text-slate-900">{totalEntries}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
            <CheckCircle2 size={14} className="text-green-600" />
            <span className="text-[11px] text-green-600">Posted</span>
            <span className="text-[13px] font-semibold text-green-700">{postedCount}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
            <Clock size={14} className="text-amber-600" />
            <span className="text-[11px] text-amber-600">Pending</span>
            <span className="text-[13px] font-semibold text-amber-700">{pendingCount}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
            <FileText size={14} className="text-slate-500" />
            <span className="text-[11px] text-slate-500">Draft</span>
            <span className="text-[13px] font-semibold text-slate-700">{draftCount}</span>
          </div>
        </div>
      </div>

      {/* Ledger Type Tabs */}
      <div className="px-6 py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setSelectedLedger("All")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
              selectedLedger === "All" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Ledgers
          </button>
          {LEDGER_TYPES.map(lt => (
            <button
              key={lt.value}
              onClick={() => setSelectedLedger(lt.value as LedgerType)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                selectedLedger === lt.value ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {lt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as JournalStatus | "All")}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            {JOURNAL_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {detailEntry ? (
          <EntryDetail entry={detailEntry} onBack={() => setDetailEntry(null)} onStatusChange={handleStatusChange} />
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedEntries.size === filteredEntries.length && filteredEntries.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-white/50"
                  />
                </th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Entry No.</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Date</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Description</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Type</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Ledger</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Total</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Lines</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => {
                const { totalDebit } = getJournalTotals(entry);
                return (
                  <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => setDetailEntry(entry)}>
                    <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedEntries.has(entry.id)}
                        onChange={() => toggleSelect(entry.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-medium text-blue-700 font-mono">{entry.entryNo}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] text-slate-600">{entry.date}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] text-slate-800 truncate max-w-[250px]">{entry.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                        {entry.entryType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded font-medium">
                        {entry.ledgerType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-[12px] font-medium text-slate-900 font-mono">{formatCurrency(totalDebit, entry.currency)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[11px] text-slate-500">{entry.lines.length}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={entry.status} />
                    </td>
                  </tr>
                );
              })}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[13px] text-slate-500">
                    No entries match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showBatchModal && (
        <BatchPostingModal
          entries={entries.filter(e => selectedEntries.has(e.id) && e.status === "Approved")}
          onPost={handleBatchPost}
          onClose={() => setShowBatchModal(false)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: JournalStatus }) {
  const colors: Record<JournalStatus, string> = {
    Draft: "bg-slate-100 text-slate-600",
    Submitted: "bg-amber-50 text-amber-700",
    Approved: "bg-blue-50 text-blue-700",
    Posted: "bg-green-50 text-green-700",
    Reversed: "bg-red-50 text-red-600",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium ${colors[status]}`}>
      {STATUS_ICONS[status]}
      {status}
    </span>
  );
}

function EntryDetail({ entry, onBack, onStatusChange }: { entry: SRDJournalEntry; onBack: () => void; onStatusChange: (id: string, status: JournalStatus) => void }) {
  const { totalDebit, totalCredit, isBalanced } = getJournalTotals(entry);

  const transitions: Record<JournalStatus, JournalStatus[]> = {
    Draft: ["Submitted"],
    Submitted: ["Approved", "Draft"],
    Approved: ["Posted", "Submitted"],
    Posted: ["Reversed"],
    Reversed: [],
  };

  const available = transitions[entry.status];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[12px] text-blue-600 hover:text-blue-800">&larr; Back to list</button>
        <div className="flex items-center gap-2">
          {available.map(target => (
            <button
              key={target}
              onClick={() => onStatusChange(entry.id, target)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700"
            >
              Move to {target}
            </button>
          ))}
        </div>
      </div>

      {/* Entry Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-900">{entry.entryNo}</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">{entry.description}</p>
          </div>
          <StatusBadge status={entry.status} />
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Date</p>
            <p className="text-[12px] text-slate-800 mt-0.5">{entry.date}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Entry Type</p>
            <p className="text-[12px] text-slate-800 mt-0.5">{entry.entryType}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ledger</p>
            <p className="text-[12px] text-slate-800 mt-0.5">{entry.ledgerType}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Period</p>
            <p className="text-[12px] text-slate-800 mt-0.5">{entry.fiscalPeriod}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Currency</p>
            <p className="text-[12px] text-slate-800 mt-0.5">{entry.currency}</p>
          </div>
        </div>
        {entry.reference && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Reference</p>
            <p className="text-[12px] text-slate-800 mt-0.5">{entry.reference}</p>
          </div>
        )}
      </div>

      {/* Journal Lines */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-slate-900">Journal Lines</h3>
          <div className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${isBalanced ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {isBalanced ? "Balanced" : "UNBALANCED"}
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">#</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Account</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Debit</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Credit</th>
            </tr>
          </thead>
          <tbody>
            {entry.lines.map((line, i) => {
              const acct = mockSRDAccounts.find(a => a.id === line.accountId);
              return (
                <tr key={line.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-[11px] text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="text-[11px] font-mono text-slate-700">{acct?.displayCode || line.accountId}</p>
                    <p className="text-[10px] text-slate-500">{acct?.name || ""}</p>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{line.description}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono text-slate-900">
                    {line.debit > 0 ? formatCurrency(line.debit, entry.currency) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono text-slate-900">
                    {line.credit > 0 ? formatCurrency(line.credit, entry.currency) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td colSpan={3} className="px-4 py-2.5 text-[11px] font-semibold text-slate-700 text-right">Totals</td>
              <td className="px-4 py-2.5 text-right text-[11px] font-mono font-semibold text-slate-900">{formatCurrency(totalDebit, entry.currency)}</td>
              <td className="px-4 py-2.5 text-right text-[11px] font-mono font-semibold text-slate-900">{formatCurrency(totalCredit, entry.currency)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Audit Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-[13px] font-semibold text-slate-900 mb-3">Audit Information</h3>
        <div className="grid grid-cols-4 gap-4 text-[11px]">
          <div>
            <p className="text-slate-500">Created By</p>
            <p className="text-slate-800 mt-0.5">{entry.createdBy}</p>
          </div>
          <div>
            <p className="text-slate-500">Created Date</p>
            <p className="text-slate-800 mt-0.5">{entry.date}</p>
          </div>
          {entry.approvedBy && (
            <div>
              <p className="text-slate-500">Approved By</p>
              <p className="text-slate-800 mt-0.5">{entry.approvedBy}</p>
            </div>
          )}
          {entry.postedBy && (
            <div>
              <p className="text-slate-500">Posted By</p>
              <p className="text-slate-800 mt-0.5">{entry.postedBy}</p>
            </div>
          )}
          {entry.postedDate && (
            <div>
              <p className="text-slate-500">Posted Date</p>
              <p className="text-slate-800 mt-0.5">{entry.postedDate}</p>
            </div>
          )}
          {entry.reversalOf && (
            <div>
              <p className="text-slate-500">Reversal Of</p>
              <p className="text-slate-800 mt-0.5 font-mono">{entry.reversalOf}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
