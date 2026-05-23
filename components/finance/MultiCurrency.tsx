import { useState } from "react";
import { DollarSign, TrendingUp, RefreshCw, BarChart3 } from "lucide-react";
import { FXRateTable } from "./FXRateTable";
import { CurrencyRevaluation } from "./CurrencyRevaluation";
import { FXExposureReport } from "./FXExposureReport";
import { mockCurrencies } from "./mockData";

type SubTab = "rates" | "revaluation" | "exposure";

export function MultiCurrency() {
  const [activeTab, setActiveTab] = useState<SubTab>("rates");

  const tabs: { key: SubTab; label: string; icon: React.ReactNode }[] = [
    { key: "rates", label: "FX Rates", icon: <DollarSign size={14} /> },
    { key: "revaluation", label: "Revaluation", icon: <RefreshCw size={14} /> },
    { key: "exposure", label: "Exposure Report", icon: <BarChart3 size={14} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Multi-Currency Management</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {mockCurrencies.length} currencies configured | Base currency: GHS (Ghana Cedi)
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-[12px] font-medium flex items-center gap-2 transition-colors ${
                activeTab === tab.key ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "rates" && <FXRateTable />}
        {activeTab === "revaluation" && <CurrencyRevaluation />}
        {activeTab === "exposure" && <FXExposureReport />}
      </div>
    </div>
  );
}
