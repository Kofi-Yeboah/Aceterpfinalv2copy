import { useState } from "react";
import {
  Settings as SettingsIcon,
  ChevronRight,
  DollarSign,
  Check,
  Search,
  X,
  Globe,
  AlertCircle,
  ArrowRightLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

const currencies: Currency[] = [
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", region: "Africa" },
  { code: "USD", name: "US Dollar", symbol: "$", region: "Americas" },
  { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: "Africa" },
  { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA", region: "Africa" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", region: "Africa" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", region: "Africa" },
  { code: "RWF", name: "Rwandan Franc", symbol: "RF", region: "Africa" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", region: "Americas" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Asia" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: "Asia" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: "Asia" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", region: "Europe" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", region: "Europe" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", region: "Europe" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", region: "Europe" },
];

// Default forex rates: how many GHS per 1 unit of the foreign currency
const defaultForexRates: Record<string, number> = {
  USD: 14.85,
  EUR: 16.12,
  GBP: 18.73,
  NGN: 0.0091,
  KES: 0.115,
  ZAR: 0.82,
  XOF: 0.0246,
  TZS: 0.0056,
  UGX: 0.004,
  RWF: 0.011,
  CAD: 10.48,
  AUD: 9.62,
  JPY: 0.099,
  CNY: 2.04,
  INR: 0.176,
  CHF: 16.58,
  SEK: 1.44,
  NOK: 1.39,
  DKK: 2.16,
};

// Previous day rates for trend indicator
const previousForexRates: Record<string, number> = {
  USD: 14.80,
  EUR: 16.18,
  GBP: 18.65,
  NGN: 0.009,
  KES: 0.116,
  ZAR: 0.83,
  XOF: 0.0246,
  TZS: 0.0056,
  UGX: 0.004,
  RWF: 0.011,
  CAD: 10.52,
  AUD: 9.58,
  JPY: 0.1,
  CNY: 2.03,
  INR: 0.175,
  CHF: 16.62,
  SEK: 1.45,
  NOK: 1.38,
  DKK: 2.15,
};

type SettingsSection = "currency";

export function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("currency");

  // Currency settings state
  const [baseCurrency] = useState("GHS");
  const [enabledCurrencies, setEnabledCurrencies] = useState<string[]>(["GHS", "USD", "EUR", "GBP"]);
  const [currencySearch, setCurrencySearch] = useState("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Forex rates state
  const [forexRates, setForexRates] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.keys(defaultForexRates).forEach((code) => {
      initial[code] = defaultForexRates[code].toString();
    });
    return initial;
  });
  const [rateDate, setRateDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [rateSearch, setRateSearch] = useState("");

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  // Enabled currencies excluding the base for forex table
  const enabledForForex = enabledCurrencies.filter((code) => code !== "GHS");
  const forexCurrencies = currencies
    .filter((c) => enabledForForex.includes(c.code))
    .filter(
      (c) =>
        c.code.toLowerCase().includes(rateSearch.toLowerCase()) ||
        c.name.toLowerCase().includes(rateSearch.toLowerCase())
    );

  const toggleCurrency = (code: string) => {
    if (code === baseCurrency) return;
    setEnabledCurrencies((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
    setHasUnsavedChanges(true);
  };

  const handleRateChange = (code: string, value: string) => {
    // Allow empty, digits, and one decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setForexRates((prev) => ({ ...prev, [code]: value }));
      setHasUnsavedChanges(true);
    }
  };

  const getTrend = (code: string): "up" | "down" | "flat" => {
    const current = parseFloat(forexRates[code] || "0");
    const previous = previousForexRates[code] || 0;
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "flat";
  };

  const getChangePercent = (code: string): string => {
    const current = parseFloat(forexRates[code] || "0");
    const previous = previousForexRates[code] || 0;
    if (previous === 0) return "0.00";
    const change = ((current - previous) / previous) * 100;
    return Math.abs(change).toFixed(2);
  };

  const handleSave = () => {
    setShowSaveConfirm(true);
    setHasUnsavedChanges(false);
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };

  const markChanged = () => setHasUnsavedChanges(true);

  const sidebarItems: { key: SettingsSection; label: string; icon: React.ReactNode; description: string }[] = [
    {
      key: "currency",
      label: "Currency Configuration",
      icon: <DollarSign size={18} />,
      description: "Base currency, forex rates & enabled currencies",
    },
  ];

  const formattedDate = new Date(rateDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
          <SettingsIcon size={18} className="text-purple-700" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="text-[12px] text-slate-500">Manage application preferences and configurations</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-72 bg-white border-r border-slate-200 p-4 shrink-0 overflow-auto">
          <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3 px-2">Configuration</p>
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                  activeSection === item.key
                    ? "bg-purple-50 border border-purple-200"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeSection === item.key ? "bg-purple-700 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[13px] truncate ${
                      activeSection === item.key ? "text-purple-700" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                </div>
                <ChevronRight
                  size={14}
                  className={activeSection === item.key ? "text-purple-400" : "text-slate-300"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === "currency" && (
            <div className="max-w-3xl space-y-6">
              {/* Save confirmation banner */}
              {showSaveConfirm && (
                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-[13px]">
                  <Check size={16} />
                  Currency settings saved successfully.
                </div>
              )}

              {/* Base Currency */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={16} className="text-purple-600" />
                  <h2 className="text-[14px] text-slate-900">Base Currency</h2>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">
                  The primary currency used across all modules for display and calculations. All forex rates are set relative to this currency.
                </p>
                <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg max-w-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center text-[11px]">
                    GH₵
                  </div>
                  <div>
                    <p className="text-[13px] text-slate-900">Ghanaian Cedi (GHS)</p>
                    <p className="text-[10px] text-slate-500">Base currency — all rates are quoted against GHS</p>
                  </div>
                </div>
              </div>

              {/* Forex Rates for Today */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft size={16} className="text-purple-600" />
                    <h2 className="text-[14px] text-slate-900">Daily Forex Rates</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-slate-400" />
                    <input
                      type="date"
                      value={rateDate}
                      onChange={(e) => {
                        setRateDate(e.target.value);
                        markChanged();
                      }}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-purple-400 bg-white text-slate-700"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mb-1">
                  Set the exchange rate for each enabled currency against the Ghanaian Cedi (GHS) for <span className="text-slate-600">{formattedDate}</span>.
                </p>
                <p className="text-[10px] text-slate-400 mb-5">
                  Enter how many GHS equals 1 unit of the foreign currency. e.g. 1 USD = 14.85 GHS
                </p>

                {enabledForForex.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <ArrowRightLeft size={28} className="mx-auto mb-2 opacity-40" />
                    <p className="text-[12px]">No additional currencies enabled.</p>
                    <p className="text-[10px]">Enable currencies below to set their forex rates.</p>
                  </div>
                ) : (
                  <>
                    {/* Rate search */}
                    {enabledForForex.length > 4 && (
                      <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white mb-4 w-64">
                        <Search size={14} className="text-slate-400" />
                        <input
                          type="text"
                          placeholder="Filter rates..."
                          value={rateSearch}
                          onChange={(e) => setRateSearch(e.target.value)}
                          className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
                        />
                        {rateSearch && (
                          <button onClick={() => setRateSearch("")}>
                            <X size={12} className="text-slate-400 hover:text-slate-600" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Rates Table */}
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-blue-600">
                            <th className="text-left px-4 py-2.5 text-[12px] text-white">Currency</th>
                            <th className="text-left px-4 py-2.5 text-[12px] text-white">Rate (1 Foreign = ? GHS)</th>
                            <th className="text-center px-4 py-2.5 text-[12px] text-white">Trend</th>
                            <th className="text-right px-4 py-2.5 text-[12px] text-white">Change</th>
                            <th className="text-right px-4 py-2.5 text-[12px] text-white">Conversion Preview</th>
                          </tr>
                        </thead>
                        <tbody>
                          {forexCurrencies.map((c, idx) => {
                            const trend = getTrend(c.code);
                            const changePct = getChangePercent(c.code);
                            const currentRate = parseFloat(forexRates[c.code] || "0");
                            return (
                              <tr
                                key={c.code}
                                className={`border-t border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-blue-50/30 transition-colors`}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 shrink-0">
                                      {c.symbol}
                                    </div>
                                    <div>
                                      <p className="text-[12px] text-slate-900">{c.code}</p>
                                      <p className="text-[10px] text-slate-400">{c.name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-slate-400">GH₵</span>
                                    <input
                                      type="text"
                                      value={forexRates[c.code] || ""}
                                      onChange={(e) => handleRateChange(c.code, e.target.value)}
                                      className="w-28 px-2.5 py-1.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 bg-white text-right"
                                    />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {trend === "up" && (
                                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50">
                                      <TrendingUp size={13} className="text-red-500" />
                                    </div>
                                  )}
                                  {trend === "down" && (
                                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50">
                                      <TrendingDown size={13} className="text-emerald-500" />
                                    </div>
                                  )}
                                  {trend === "flat" && (
                                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50">
                                      <Minus size={13} className="text-slate-400" />
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span
                                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                                      trend === "up"
                                        ? "bg-red-50 text-red-600"
                                        : trend === "down"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-slate-50 text-slate-400"
                                    }`}
                                  >
                                    {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                                    {changePct}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <p className="text-[11px] text-slate-500">
                                    1,000 {c.code} ={" "}
                                    <span className="text-slate-900">
                                      GH₵{(currentRate * 1000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  </p>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                      <AlertCircle size={11} />
                      <span>
                        Trend compares today's rate against the previous day. <span className="text-red-500">Red (up)</span> means the Cedi weakened; <span className="text-emerald-500">Green (down)</span> means the Cedi strengthened.
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Enabled Currencies */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[14px] text-slate-900">Enabled Currencies</h2>
                  <span className="text-[11px] text-slate-400">
                    {enabledCurrencies.length} of {currencies.length} enabled
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">
                  Select which currencies are available for use across modules (e.g. grants, expenses, invoices).
                </p>

                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white mb-4 w-72">
                  <Search size={14} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search currencies..."
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
                  />
                  {currencySearch && (
                    <button onClick={() => setCurrencySearch("")}>
                      <X size={12} className="text-slate-400 hover:text-slate-600" />
                    </button>
                  )}
                </div>

                {/* Currency Grid */}
                <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-auto pr-1">
                  {filteredCurrencies.map((c) => {
                    const isEnabled = enabledCurrencies.includes(c.code);
                    const isBase = c.code === baseCurrency;
                    return (
                      <button
                        key={c.code}
                        onClick={() => toggleCurrency(c.code)}
                        disabled={isBase}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                          isBase
                            ? "bg-purple-50 border-purple-200 cursor-default"
                            : isEnabled
                            ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                            isBase
                              ? "bg-purple-600"
                              : isEnabled
                              ? "bg-blue-600"
                              : "border border-slate-300"
                          }`}
                        >
                          {(isEnabled || isBase) && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] text-slate-900">{c.code}</span>
                            <span className="text-[11px] text-slate-400">({c.symbol})</span>
                            {isBase && (
                              <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                                Base
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{c.name}</p>
                        </div>
                        <span className="text-[9px] text-slate-300 shrink-0">{c.region}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-2 pb-4">
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className={`px-6 py-2.5 rounded-lg text-[13px] transition-colors ${
                    hasUnsavedChanges
                      ? "bg-purple-700 text-white hover:bg-purple-800"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
