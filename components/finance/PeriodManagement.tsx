import { useState } from "react";
import { Calendar, Lock, Unlock, AlertCircle, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import type { FiscalYear, FiscalPeriod, PeriodState } from "./types";
import { mockFiscalYears } from "./mockData";
import { PeriodCloseWorkflow } from "./PeriodCloseWorkflow";

const PERIOD_STATE_COLORS: Record<PeriodState, string> = {
  NotOpened: "bg-slate-100 text-slate-600",
  Open: "bg-green-50 text-green-700 border border-green-200",
  SoftClose: "bg-amber-50 text-amber-700 border border-amber-200",
  HardClose: "bg-red-50 text-red-700 border border-red-200",
};

const PERIOD_STATE_ICONS: Record<PeriodState, React.ReactNode> = {
  NotOpened: <Clock size={11} />,
  Open: <Unlock size={11} />,
  SoftClose: <AlertCircle size={11} />,
  HardClose: <Lock size={11} />,
};

type SubView = "overview" | "closeWorkflow";

export function PeriodManagement() {
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>(mockFiscalYears);
  const [selectedYear, setSelectedYear] = useState<FiscalYear>(fiscalYears[1]); // 2026
  const [subView, setSubView] = useState<SubView>("overview");
  const [closingPeriod, setClosingPeriod] = useState<FiscalPeriod | null>(null);

  const handlePeriodStateChange = (periodId: string, newState: PeriodState) => {
    setFiscalYears(prev => prev.map(fy => ({
      ...fy,
      periods: fy.periods.map(p => p.id === periodId ? { ...p, state: newState } : p),
    })));
    setSelectedYear(prev => ({
      ...prev,
      periods: prev.periods.map(p => p.id === periodId ? { ...p, state: newState } : p),
    }));
  };

  const handleStartClose = (period: FiscalPeriod) => {
    setClosingPeriod(period);
    setSubView("closeWorkflow");
  };

  if (subView === "closeWorkflow" && closingPeriod) {
    return (
      <PeriodCloseWorkflow
        period={closingPeriod}
        onBack={() => { setSubView("overview"); setClosingPeriod(null); }}
        onComplete={(periodId) => {
          handlePeriodStateChange(periodId, "HardClose");
          setSubView("overview");
          setClosingPeriod(null);
        }}
      />
    );
  }

  const openPeriods = selectedYear.periods.filter(p => p.state === "Open").length;
  const closedPeriods = selectedYear.periods.filter(p => p.state === "HardClose").length;
  const softClosedPeriods = selectedYear.periods.filter(p => p.state === "SoftClose").length;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Period Management</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Fiscal year setup with 13-period structure and sequential close workflow</p>
          </div>
        </div>
      </div>

      {/* Year Selector + Summary */}
      <div className="px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {fiscalYears.map(fy => (
              <button
                key={fy.id}
                onClick={() => setSelectedYear(fy)}
                className={`px-4 py-2 rounded-lg text-[12px] font-medium transition-colors ${
                  selectedYear.id === fy.id ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                FY {fy.year} {fy.isClosed && <Lock size={10} className="inline ml-1" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-green-600 font-medium">{openPeriods} Open</span>
            <span className="text-amber-600 font-medium">{softClosedPeriods} Soft Closed</span>
            <span className="text-red-600 font-medium">{closedPeriods} Hard Closed</span>
            <span className="text-slate-500">{selectedYear.periods.filter(p => p.state === "NotOpened").length} Not Opened</span>
          </div>
        </div>
      </div>

      {/* Period Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Period</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">Start Date</th>
                <th className="text-left px-4 py-3 text-white text-[11px] font-semibold">End Date</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">State</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Close Progress</th>
                <th className="text-center px-4 py-3 text-white text-[11px] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedYear.periods.map(period => {
                const completedSteps = period.closingSteps.filter(s => s.status === "Completed").length;
                const totalSteps = period.closingSteps.length;
                const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                return (
                  <tr key={period.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono font-medium text-slate-700">{period.periodNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-slate-800">{period.name}</span>
                      {period.isAdjusting && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-200">ADJ</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">{period.startDate}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">{period.endDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium ${PERIOD_STATE_COLORS[period.state]}`}>
                        {PERIOD_STATE_ICONS[period.state]}
                        {period.state === "NotOpened" ? "Not Opened" : period.state === "SoftClose" ? "Soft Close" : period.state === "HardClose" ? "Hard Close" : period.state}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500">{completedSteps}/{totalSteps}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PeriodActions
                        period={period}
                        onStateChange={handlePeriodStateChange}
                        onStartClose={handleStartClose}
                      />
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

function PeriodActions({ period, onStateChange, onStartClose }: {
  period: FiscalPeriod;
  onStateChange: (id: string, state: PeriodState) => void;
  onStartClose: (period: FiscalPeriod) => void;
}) {
  switch (period.state) {
    case "NotOpened":
      return (
        <button
          onClick={() => onStateChange(period.id, "Open")}
          className="text-[10px] px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-medium"
        >
          Open Period
        </button>
      );
    case "Open":
      return (
        <button
          onClick={() => onStartClose(period)}
          className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-medium flex items-center gap-1 mx-auto"
        >
          Start Close <ChevronRight size={10} />
        </button>
      );
    case "SoftClose":
      return (
        <div className="flex items-center gap-1.5 justify-center">
          <button
            onClick={() => onStateChange(period.id, "Open")}
            className="text-[10px] px-2 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 font-medium"
          >
            Reopen
          </button>
          <button
            onClick={() => onStartClose(period)}
            className="text-[10px] px-2 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-medium"
          >
            Continue Close
          </button>
        </div>
      );
    case "HardClose":
      return (
        <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-center">
          <Lock size={10} /> Closed
        </span>
      );
  }
}
