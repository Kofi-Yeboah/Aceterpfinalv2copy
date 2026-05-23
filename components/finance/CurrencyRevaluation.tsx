import { useState } from "react";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import type { RevaluationEntry } from "./types";
import { mockRevaluationEntries, mockSRDAccounts } from "./mockData";
import { formatCurrency } from "./helpers";

export function CurrencyRevaluation() {
  const [entries] = useState<RevaluationEntry[]>(mockRevaluationEntries);
  const [selectedPeriod, setSelectedPeriod] = useState("2026-P04");

  const totalGainLoss = entries.reduce((sum, e) => sum + e.unrealizedGainLoss, 0);

  return (
    <div className="p-6 space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white"
          >
            <option value="2026-P04">2026-P04 (April)</option>
            <option value="2026-P03">2026-P03 (March)</option>
            <option value="2026-P02">2026-P02 (February)</option>
          </select>
        </div>
        <button className="px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <RefreshCw size={14} />Run Revaluation
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Accounts Revalued</p>
          <p className="text-[20px] font-semibold text-slate-900 mt-1">{entries.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Net Gain/Loss</p>
          <p className={`text-[20px] font-semibold mt-1 ${totalGainLoss >= 0 ? "text-green-700" : "text-red-700"}`}>
            {formatCurrency(Math.abs(totalGainLoss), "GHS")}
            {totalGainLoss >= 0 ? " Gain" : " Loss"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Revaluation Period</p>
          <p className="text-[20px] font-semibold text-slate-900 mt-1">{selectedPeriod}</p>
        </div>
      </div>

      {/* Revaluation Detail */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200">
          <h3 className="text-[13px] font-semibold text-slate-900">Revaluation Results</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Account</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Currency</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Original Amount</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Original Rate</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Closing Rate</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Revalued Amount</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => {
              const acct = mockSRDAccounts.find(a => a.id === entry.accountId);
              return (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <p className="text-[11px] font-mono text-slate-700">{acct?.code.account}</p>
                    <p className="text-[10px] text-slate-500">{acct?.name}</p>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-slate-700">{entry.currency}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono">{formatCurrency(entry.originalAmount, entry.currency)}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono text-slate-600">{entry.originalRate.toFixed(4)}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono text-slate-600">{entry.closingRate.toFixed(4)}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono">{formatCurrency(entry.revaluedAmount, "GHS")}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-[11px] font-mono font-medium flex items-center gap-1 justify-end ${entry.unrealizedGainLoss >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {entry.unrealizedGainLoss >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {formatCurrency(Math.abs(entry.unrealizedGainLoss), "GHS")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-200">
            <tr>
              <td colSpan={6} className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-700">Net Gain/Loss</td>
              <td className="px-4 py-2.5 text-right">
                <span className={`text-[11px] font-mono font-semibold ${totalGainLoss >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {formatCurrency(Math.abs(totalGainLoss), "GHS")}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
