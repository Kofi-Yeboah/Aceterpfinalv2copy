import { useState } from "react";
import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import type { SRDAccount, SubLedgerEntry } from "./types";
import { mockSRDAccounts, mockSubLedgerEntries } from "./mockData";
import { formatCurrency } from "./helpers";
import { SubLedgerReconciliation } from "./SubLedgerReconciliation";

export function ControlAccountsView() {
  const [selectedAccount, setSelectedAccount] = useState<SRDAccount | null>(null);

  const controlAccounts = mockSRDAccounts.filter(a => a.isControlAccount);

  if (selectedAccount) {
    return (
      <SubLedgerReconciliation
        account={selectedAccount}
        onBack={() => setSelectedAccount(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Control Accounts</h1>
        <p className="text-[12px] text-slate-500 mt-0.5">GL control account balances vs sub-ledger reconciliation</p>
      </div>

      {/* Summary */}
      <div className="px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
            <span className="text-[11px] text-slate-500">Control Accounts:</span>
            <span className="text-[13px] font-semibold text-slate-900">{controlAccounts.length}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
            <CheckCircle2 size={14} className="text-green-600" />
            <span className="text-[11px] text-green-600">Reconciled:</span>
            <span className="text-[13px] font-semibold text-green-700">
              {controlAccounts.filter(a => {
                const subEntries = mockSubLedgerEntries.filter(s => s.controlAccountId === a.id);
                const subTotal = subEntries.reduce((sum, s) => sum + s.amount, 0);
                return Math.abs(a.balance - subTotal) < 0.01;
              }).length}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
            <AlertTriangle size={14} className="text-red-600" />
            <span className="text-[11px] text-red-600">Unreconciled:</span>
            <span className="text-[13px] font-semibold text-red-700">
              {controlAccounts.filter(a => {
                const subEntries = mockSubLedgerEntries.filter(s => s.controlAccountId === a.id);
                const subTotal = subEntries.reduce((sum, s) => sum + s.amount, 0);
                return Math.abs(a.balance - subTotal) >= 0.01;
              }).length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Account Code</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Account Name</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Type</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">GL Balance</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Sub-Ledger Total</th>
                <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Difference</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Status</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {controlAccounts.map(account => {
                const subEntries = mockSubLedgerEntries.filter(s => s.controlAccountId === account.id);
                const subTotal = subEntries.reduce((sum, s) => sum + s.amount, 0);
                const difference = account.balance - subTotal;
                const isReconciled = Math.abs(difference) < 0.01;

                return (
                  <tr key={account.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-[11px] font-mono text-slate-700">{account.displayCode}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-800">{account.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded">{account.controlType || "General"}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] font-mono font-medium text-slate-900">
                      {formatCurrency(account.balance, account.currency)}
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] font-mono font-medium text-slate-900">
                      {formatCurrency(subTotal, account.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-[11px] font-mono font-medium ${isReconciled ? "text-green-700" : "text-red-700"}`}>
                        {formatCurrency(Math.abs(difference), account.currency)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isReconciled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-lg border border-green-200">
                          <CheckCircle2 size={10} />Reconciled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-red-50 text-red-700 rounded-lg border border-red-200">
                          <AlertTriangle size={10} />Mismatch
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedAccount(account)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg"
                        title="View reconciliation"
                      >
                        <Eye size={14} className="text-slate-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
