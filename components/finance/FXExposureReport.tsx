import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { mockSRDAccounts, mockCurrencies, mockFXRates } from "./mockData";
import { formatCurrency } from "./helpers";

interface CurrencyExposure {
  currency: string;
  currencyName: string;
  assets: number;
  liabilities: number;
  netExposure: number;
  currentRate: number;
}

export function FXExposureReport() {
  // Build exposure per foreign currency
  const exposures: CurrencyExposure[] = mockCurrencies
    .filter(c => c.code !== "GHS")
    .map(currency => {
      const currencyAccounts = mockSRDAccounts.filter(a => a.currency === currency.code);
      const assets = currencyAccounts.filter(a => a.type === "Asset").reduce((sum, a) => sum + a.balance, 0);
      const liabilities = currencyAccounts.filter(a => a.type === "Liability").reduce((sum, a) => sum + a.balance, 0);
      const rate = mockFXRates.find(r => r.fromCurrency === currency.code && r.toCurrency === "GHS" && r.rateType === "Spot");
      return {
        currency: currency.code,
        currencyName: currency.name,
        assets,
        liabilities,
        netExposure: assets - liabilities,
        currentRate: rate?.rate || 1,
      };
    });

  const totalExposureGHS = exposures.reduce((sum, e) => sum + (e.netExposure * e.currentRate), 0);

  return (
    <div className="p-6 space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Foreign Currencies</p>
          <p className="text-[20px] font-semibold text-slate-900 mt-1">{exposures.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Total FX Assets (GHS)</p>
          <p className="text-[20px] font-semibold text-blue-700 mt-1">
            {formatCurrency(exposures.reduce((s, e) => s + e.assets * e.currentRate, 0), "GHS")}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Total FX Liabilities (GHS)</p>
          <p className="text-[20px] font-semibold text-orange-700 mt-1">
            {formatCurrency(exposures.reduce((s, e) => s + e.liabilities * e.currentRate, 0), "GHS")}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Net Exposure (GHS)</p>
          <p className={`text-[20px] font-semibold mt-1 ${totalExposureGHS >= 0 ? "text-green-700" : "text-red-700"}`}>
            {formatCurrency(Math.abs(totalExposureGHS), "GHS")}
          </p>
        </div>
      </div>

      {/* Exposure Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200">
          <h3 className="text-[13px] font-semibold text-slate-900">Net Exposure by Currency</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Currency</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Assets (FCY)</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Liabilities (FCY)</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Net (FCY)</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Rate to GHS</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Net (GHS)</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase">Risk</th>
            </tr>
          </thead>
          <tbody>
            {exposures.map(exp => {
              const netGHS = exp.netExposure * exp.currentRate;
              const riskLevel = Math.abs(netGHS) > 500000 ? "high" : Math.abs(netGHS) > 100000 ? "medium" : "low";
              return (
                <tr key={exp.currency} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-mono font-medium text-slate-800">{exp.currency}</span>
                    <span className="text-[10px] text-slate-500 ml-2">{exp.currencyName}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono text-blue-700">{formatCurrency(exp.assets, exp.currency)}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono text-orange-700">{formatCurrency(exp.liabilities, exp.currency)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-[11px] font-mono font-medium flex items-center gap-1 justify-end ${exp.netExposure >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {exp.netExposure >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {formatCurrency(Math.abs(exp.netExposure), exp.currency)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] font-mono text-slate-600">{exp.currentRate.toFixed(4)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-[11px] font-mono font-medium ${netGHS >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {formatCurrency(Math.abs(netGHS), "GHS")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-medium ${
                      riskLevel === "high" ? "bg-red-50 text-red-700 border border-red-200" :
                      riskLevel === "medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {riskLevel.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Risk Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
        <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[11px] text-amber-800 font-medium">FX Risk Advisory</p>
          <p className="text-[10px] text-amber-700 mt-0.5">
            High exposure currencies should be reviewed for hedging opportunities. Consider running period-end revaluation to capture unrealized gains/losses.
          </p>
        </div>
      </div>
    </div>
  );
}
