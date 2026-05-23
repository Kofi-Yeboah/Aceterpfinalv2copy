import { useState } from "react";
import { Search, Download, Plus, ChevronDown, CheckCircle2, Clock, FileText, XCircle, RotateCcw, Eye } from "lucide-react";
import type { SRDJournalEntry, JournalStatus, JournalEntryType, JournalLine } from "./finance/types";
import { mockJournalEntries, mockSRDAccounts } from "./finance/mockData";
import { JOURNAL_ENTRY_TYPES, JOURNAL_STATUSES, LEDGER_TYPES } from "./finance/constants";
import { formatCurrency, getJournalTotals, validateDoubleEntry, generateEntryNo } from "./finance/helpers";
import { JournalEntryForm } from "./finance/JournalEntryForm";
type SubView = "list" | "create" | "detail";

const STATUS_ICONS: Record<JournalStatus, React.ReactNode> = {
  Draft: <FileText size={12} />,
  Submitted: <Clock size={12} />,
  Approved: <CheckCircle2 size={12} />,
  Posted: <CheckCircle2 size={12} />,
  Reversed: <XCircle size={12} />,
};

const STATUS_COLORS: Record<JournalStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Submitted: "bg-amber-50 text-amber-700",
  Approved: "bg-blue-50 text-blue-700",
  Posted: "bg-green-50 text-green-700",
  Reversed: "bg-red-50 text-red-600",
};

export function JournalEntries() {
  const [view, setView] = useState<SubView>("list");
  const [entries, setEntries] = useState<SRDJournalEntry[]>(mockJournalEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<JournalEntryType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<JournalStatus | "All">("All");
  const [selectedEntry, setSelectedEntry] = useState<SRDJournalEntry | null>(null);

  const filteredEntries = entries.filter(e => {
    if (filterType !== "All" && e.entryType !== filterType) return false;
    if (filterStatus !== "All" && e.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.entryNo.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateEntry = (entry: SRDJournalEntry) => {
    setEntries([entry, ...entries]);
    setView("list");
  };

  const handleStatusChange = (id: string, newStatus: JournalStatus) => {
    setEntries(prev => prev.map(e => e.id === id ? {
      ...e,
      status: newStatus,
      ...(newStatus === "Posted" ? { postedDate: "2026-05-17", postedBy: "System Admin" } : {}),
      ...(newStatus === "Approved" ? { approvedBy: "CFO" } : {}),
    } : e));
  };

  const handleReverse = (entry: SRDJournalEntry) => {
    const reversalEntry: SRDJournalEntry = {
      ...entry,
      id: `je-rev-${Date.now()}`,
      entryNo: generateEntryNo("JE"),
      description: `Reversal of ${entry.entryNo}: ${entry.description}`,
      status: "Draft",
      entryType: "Reversing",
      reversalOf: entry.entryNo,
      lines: entry.lines.map(l => ({ ...l, id: `${l.id}-rev`, debit: l.credit, credit: l.debit })),
      createdBy: "Current User",
      approvedBy: undefined,
      postedBy: undefined,
      postedDate: undefined,
    };
    handleStatusChange(entry.id, "Reversed");
    setEntries(prev => [reversalEntry, ...prev]);
    setView("list");
  };

  if (view === "create") {
    return <JournalEntryForm onSave={handleCreateEntry} onCancel={() => setView("list")} />;
  }

  if (view === "detail" && selectedEntry) {
    return (
      <JournalEntryDetail
        entry={selectedEntry}
        onBack={() => { setView("list"); setSelectedEntry(null); }}
        onStatusChange={handleStatusChange}
        onReverse={handleReverse}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Create Entries</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Multi-line double-entry journal management with 10 entry types</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <Download size={14} />Export
            </button>
            <button
              onClick={() => setView("create")}
              className="px-4 py-2 rounded-lg text-[13px] text-white flex items-center gap-2"
              style={{ backgroundColor: "#0B01D0" }}
            >
              <Plus size={14} />New Entry
            </button>
          </div>
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as JournalEntryType | "All")}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white"
          >
            <option value="All">All Types</option>
            {JOURNAL_ENTRY_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as JournalStatus | "All")}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 bg-white"
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
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Ref. Number</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Date</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Description</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Type</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Ledger</th>
              <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Debit</th>
              <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Credit</th>
              <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Lines</th>
              <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Status</th>
              <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(entry => {
              const { totalDebit, totalCredit } = getJournalTotals(entry);
              return (
                <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-medium text-blue-700 font-mono">{entry.entryNo}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{entry.date}</td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-slate-800 truncate max-w-[220px]">{entry.description}</p>
                    {entry.reversalOf && (
                      <p className="text-[10px] text-red-500 mt-0.5">Reversal of {entry.reversalOf}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{entry.entryType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded font-medium">{entry.ledgerType}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] font-mono text-slate-900">{formatCurrency(totalDebit, entry.currency)}</td>
                  <td className="px-4 py-3 text-right text-[12px] font-mono text-slate-900">{formatCurrency(totalCredit, entry.currency)}</td>
                  <td className="px-4 py-3 text-center text-[11px] text-slate-500">{entry.lines.length}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium ${STATUS_COLORS[entry.status]}`}>
                      {STATUS_ICONS[entry.status]}
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => { setSelectedEntry(entry); setView("detail"); }}
                      className="p-1.5 hover:bg-slate-100 rounded-lg"
                      title="View details"
                    >
                      <Eye size={14} className="text-slate-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredEntries.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-[13px] text-slate-500">
                  No journal entries match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JournalEntryDetail({ entry, onBack, onStatusChange, onReverse }: {
  entry: SRDJournalEntry;
  onBack: () => void;
  onStatusChange: (id: string, status: JournalStatus) => void;
  onReverse: (entry: SRDJournalEntry) => void;
}) {
  const { totalDebit, totalCredit, isBalanced } = getJournalTotals(entry);

  const transitions: Record<JournalStatus, JournalStatus[]> = {
    Draft: ["Submitted"],
    Submitted: ["Approved", "Draft"],
    Approved: ["Posted", "Submitted"],
    Posted: [],
    Reversed: [],
  };

  const available = transitions[entry.status];
  const canReverse = entry.status === "Posted";

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-auto">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[12px] text-blue-600 hover:text-blue-800">&larr; Back to Journal Entries</button>
          <div className="flex items-center gap-2">
            {canReverse && (
              <button
                onClick={() => onReverse(entry)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1.5"
              >
                <RotateCcw size={12} />Reverse
              </button>
            )}
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
      </div>

      <div className="p-6 space-y-5">
        {/* Entry Info Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[16px] font-semibold text-slate-900">{entry.entryNo}</h2>
              <p className="text-[12px] text-slate-500 mt-0.5">{entry.description}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium ${STATUS_COLORS[entry.status]}`}>
              {STATUS_ICONS[entry.status]}
              {entry.status}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <InfoCell label="Date" value={entry.date} />
            <InfoCell label="Entry Type" value={entry.entryType} />
            <InfoCell label="Ledger Type" value={entry.ledgerType} />
            <InfoCell label="Period" value={entry.fiscalPeriod || entry.periodId || "-"} />
            <InfoCell label="Currency" value={entry.currency || "USD"} />
            <InfoCell label="Reference" value={entry.reference || "-"} />
          </div>
        </div>

        {/* Journal Lines Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-slate-900">Journal Lines ({entry.lines.length})</h3>
            <div className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${isBalanced ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {isBalanced ? "Balanced" : "UNBALANCED"}
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">#</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Account Code</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Account Name</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Description</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Debit</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Credit</th>
              </tr>
            </thead>
            <tbody>
              {entry.lines.map((line, i) => {
                const acct = mockSRDAccounts.find(a => a.id === line.accountId);
                return (
                  <tr key={line.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-[11px] text-slate-400">{i + 1}</td>
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-700">{acct?.code.account || line.accountId}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-700">{acct?.name || "-"}</td>
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
            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
              <tr>
                <td colSpan={4} className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-700">Totals</td>
                <td className="px-4 py-2.5 text-right text-[11px] font-mono font-semibold text-slate-900">{formatCurrency(totalDebit, entry.currency)}</td>
                <td className="px-4 py-2.5 text-right text-[11px] font-mono font-semibold text-slate-900">{formatCurrency(totalCredit, entry.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Audit Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-semibold text-slate-900 mb-3">Audit Trail</h3>
          <div className="grid grid-cols-4 gap-4">
            <InfoCell label="Created By" value={entry.createdBy} />
            <InfoCell label="Created Date" value={entry.date} />
            {entry.approvedBy && <InfoCell label="Approved By" value={entry.approvedBy} />}
            {entry.postedBy && <InfoCell label="Posted By" value={entry.postedBy} />}
            {entry.postedDate && <InfoCell label="Posted Date" value={entry.postedDate} />}
            {entry.reversalOf && <InfoCell label="Reversal Of" value={entry.reversalOf} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-[12px] text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}
