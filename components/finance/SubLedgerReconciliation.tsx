import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import type { SRDAccount } from "./types";
import { mockSubLedgerEntries } from "./mockData";
import { formatCurrency } from "./helpers";

interface SubLedgerReconciliationProps {
  account: SRDAccount;
  onBack: () => void;
}

export function SubLedgerReconciliation({ account, onBack }: SubLedgerReconciliationProps) {
  const subEntries = mockSubLedgerEntries.filter(s => s.controlAccountId === account.id);
  const subTotal = subEntries.reduce((sum, s) => sum + s.amount, 0);
  const difference = account.balance - subTotal;
  const isReconciled = Math.abs(difference) < 0.01;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">Sub-Ledger Reconciliation</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">{account.code.account} - {account.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Comparison Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">GL Balance</p>
            <p className="text-[20px] font-semibold text-slate-900 mt-1 font-mono">{formatCurrency(account.balance, account.currency)}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Sub-Ledger Total</p>
            <p className="text-[20px] font-semibold text-slate-900 mt-1 font-mono">{formatCurrency(subTotal, account.currency)}</p>
          </div>
          <div className={`rounded-xl border p-4 ${isReconciled ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className={`text-[11px] uppercase tracking-wider ${isReconciled ? "text-green-600" : "text-red-600"}`}>Difference</p>
            <div className="flex items-center gap-2 mt-1">
              {isReconciled ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertTriangle size={18} className="text-red-600" />}
              <p className={`text-[20px] font-semibold font-mono ${isReconciled ? "text-green-700" : "text-red-700"}`}>
                {formatCurrency(Math.abs(difference), account.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Ledger Entries */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200">
            <h3 className="text-[13px] font-semibold text-slate-900">Sub-Ledger Detail ({subEntries.length} entries)</h3>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Reference</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Description</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Entity</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Matched</th>
              </tr>
            </thead>
            <tbody>
              {subEntries.map(entry => (
                <tr key={entry.id} className={`border-t border-slate-100 ${entry.isMatched === false ? "bg-red-50/30" : ""}`}>
                  <td className="px-4 py-3 text-[11px] font-mono text-slate-700">{entry.reference}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-600">{entry.date}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-700">{entry.description}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-500">{entry.entityName || entry.sourceModule}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono font-medium text-slate-900">
                    {formatCurrency(entry.amount, account.currency)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.isMatched !== false ? (
                      <CheckCircle2 size={14} className="text-green-500 mx-auto" />
                    ) : (
                      <AlertTriangle size={14} className="text-red-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
              <tr>
                <td colSpan={4} className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-700">Sub-Ledger Total</td>
                <td className="px-4 py-2.5 text-right text-[11px] font-mono font-semibold text-slate-900">{formatCurrency(subTotal, account.currency)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Unmatched Items */}
        {subEntries.some(e => e.isMatched === false) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] text-amber-800 font-medium">Unmatched Items Detected</p>
              <p className="text-[10px] text-amber-700 mt-0.5">
                {subEntries.filter(e => e.isMatched === false).length} sub-ledger entries could not be matched to GL postings. Review and resolve before period close.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
