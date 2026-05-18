import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import type { FXRate } from "./types";
import { mockFXRates, mockCurrencies } from "./mockData";

export function FXRateTable() {
  const [rates, setRates] = useState<FXRate[]>(mockFXRates);
  const [filterCurrency, setFilterCurrency] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");

  const filtered = rates.filter(r => {
    if (filterCurrency !== "All" && r.fromCurrency !== filterCurrency && r.toCurrency !== filterCurrency) return false;
    if (filterType !== "All" && r.rateType !== filterType) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={filterCurrency}
          onChange={e => setFilterCurrency(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white"
        >
          <option value="All">All Currencies</option>
          {mockCurrencies.map(c => (
            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white"
        >
          <option value="All">All Rate Types</option>
          <option value="Spot">Spot</option>
          <option value="Average">Average</option>
          <option value="Closing">Closing</option>
        </select>
        <div className="ml-auto">
          <button className="px-4 py-2 rounded-lg text-[12px] text-white flex items-center gap-2" style={{ backgroundColor: "#0B01D0" }}>
            <Plus size={14} />Add Rate
          </button>
        </div>
      </div>

      {/* Rate Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">From</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">To</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Rate Type</th>
              <th className="text-right px-4 py-3 text-white text-[11px] font-semibold">Rate</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Effective Date</th>
              <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Source</th>
              <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(rate => (
              <tr key={rate.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium text-slate-800">{rate.fromCurrency}</span>
                    <span className="text-[10px] text-slate-400">{mockCurrencies.find(c => c.code === rate.fromCurrency)?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium text-slate-800">{rate.toCurrency}</span>
                    <span className="text-[10px] text-slate-400">{mockCurrencies.find(c => c.code === rate.toCurrency)?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    rate.rateType === "Spot" ? "bg-blue-50 text-blue-700" :
                    rate.rateType === "Average" ? "bg-purple-50 text-purple-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {rate.rateType}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[12px] font-mono font-medium text-slate-900">{rate.rate.toFixed(4)}</span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{rate.effectiveDate}</td>
                <td className="px-4 py-3 text-[11px] text-slate-500">{rate.source}</td>
                <td className="px-4 py-3 text-center">
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <Pencil size={12} className="text-slate-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {["Spot", "Average", "Closing"].map(type => {
          const count = rates.filter(r => r.rateType === type).length;
          return (
            <div key={type} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">{type} Rates</p>
              <p className="text-[20px] font-semibold text-slate-900 mt-1">{count}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Active rate entries</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
