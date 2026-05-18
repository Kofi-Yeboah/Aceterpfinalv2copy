import { useState } from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { SRDJournalEntry, JournalEntryType, LedgerType, JournalLine } from "./types";
import { mockSRDAccounts } from "./mockData";
import { JOURNAL_ENTRY_TYPES, LEDGER_TYPES } from "./constants";
import { generateEntryNo, validateDoubleEntry } from "./helpers";

interface JournalEntryFormProps {
  onSave: (entry: SRDJournalEntry) => void;
  onCancel: () => void;
}

interface LineInput {
  tempId: string;
  accountId: string;
  description: string;
  debit: string;
  credit: string;
}

export function JournalEntryForm({ onSave, onCancel }: JournalEntryFormProps) {
  const [date, setDate] = useState("2026-05-17");
  const [description, setDescription] = useState("");
  const [entryType, setEntryType] = useState<JournalEntryType>("Standard");
  const [ledgerType, setLedgerType] = useState<LedgerType>("Primary");
  const [currency, setCurrency] = useState("GHS");
  const [reference, setReference] = useState("");
  const [fiscalPeriod, setFiscalPeriod] = useState("2026-P05");
  const [lines, setLines] = useState<LineInput[]>([
    { tempId: "1", accountId: "", description: "", debit: "", credit: "" },
    { tempId: "2", accountId: "", description: "", debit: "", credit: "" },
  ]);

  const addLine = () => {
    setLines([...lines, { tempId: String(Date.now()), accountId: "", description: "", debit: "", credit: "" }]);
  };

  const removeLine = (tempId: string) => {
    if (lines.length <= 2) return;
    setLines(lines.filter(l => l.tempId !== tempId));
  };

  const updateLine = (tempId: string, field: keyof LineInput, value: string) => {
    setLines(lines.map(l => {
      if (l.tempId !== tempId) return l;
      if (field === "debit" && value) return { ...l, debit: value, credit: "" };
      if (field === "credit" && value) return { ...l, credit: value, debit: "" };
      return { ...l, [field]: value };
    }));
  };

  const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const canSave = description && date && isBalanced && lines.every(l => l.accountId);

  const handleSave = () => {
    if (!canSave) return;
    const journalLines: JournalLine[] = lines.map((l, i) => ({
      id: `line-${Date.now()}-${i}`,
      accountId: l.accountId,
      description: l.description,
      debit: parseFloat(l.debit) || 0,
      credit: parseFloat(l.credit) || 0,
    }));

    const entry: SRDJournalEntry = {
      id: `je-${Date.now()}`,
      entryNo: generateEntryNo("JE"),
      date,
      description,
      entryType,
      ledgerType,
      status: "Draft",
      currency,
      fiscalPeriod,
      reference,
      lines: journalLines,
      createdBy: "Current User",
    };
    onSave(entry);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">New Journal Entry</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Create a multi-line double-entry journal entry</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg text-[12px] border border-slate-200 text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`px-5 py-2 rounded-lg text-[12px] font-medium text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"}`}
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Entry Header Fields */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[13px] font-semibold text-slate-900 mb-4">Entry Details</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Date *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Entry Type *</label>
              <select value={entryType} onChange={e => setEntryType(e.target.value as JournalEntryType)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {JOURNAL_ENTRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Ledger Type *</label>
              <select value={ledgerType} onChange={e => setLedgerType(e.target.value as LedgerType)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {LEDGER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="GHS">GHS - Ghana Cedi</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="KES">KES - Kenyan Shilling</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="col-span-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Description *</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter journal entry description" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Reference</label>
              <input type="text" value={reference} onChange={e => setReference(e.target.value)} placeholder="Optional reference" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Journal Lines */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-slate-900">Journal Lines</h3>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg ${
                isBalanced ? "bg-green-50 text-green-700" : totalDebit > 0 || totalCredit > 0 ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-500"
              }`}>
                {isBalanced ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {isBalanced ? "Balanced" : `Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}`}
              </div>
              <button onClick={addLine} className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Plus size={12} />Add Line
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase w-8">#</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Account</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Description</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase w-32">Debit</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase w-32">Credit</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, i) => (
                <tr key={line.tempId} className="border-t border-slate-100">
                  <td className="px-4 py-2 text-[11px] text-slate-400">{i + 1}</td>
                  <td className="px-4 py-2">
                    <select
                      value={line.accountId}
                      onChange={e => updateLine(line.tempId, "accountId", e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select account...</option>
                      {mockSRDAccounts.filter(a => a.postingLevel === "Detail").map(a => (
                        <option key={a.id} value={a.id}>{a.displayCode} - {a.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={line.description}
                      onChange={e => updateLine(line.tempId, "description", e.target.value)}
                      placeholder="Line description"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={line.debit}
                      onChange={e => updateLine(line.tempId, "debit", e.target.value)}
                      placeholder="0.00"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-[11px] text-right font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={line.credit}
                      onChange={e => updateLine(line.tempId, "credit", e.target.value)}
                      placeholder="0.00"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-[11px] text-right font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    {lines.length > 2 && (
                      <button onClick={() => removeLine(line.tempId)} className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
              <tr>
                <td colSpan={3} className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-700">Totals</td>
                <td className="px-4 py-2.5 text-right text-[11px] font-mono font-semibold text-slate-900">{totalDebit.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right text-[11px] font-mono font-semibold text-slate-900">{totalCredit.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
