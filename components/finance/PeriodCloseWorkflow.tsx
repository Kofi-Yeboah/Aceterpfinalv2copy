import { useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, Lock, AlertTriangle } from "lucide-react";
import type { FiscalPeriod, ClosingStep } from "./types";

interface PeriodCloseWorkflowProps {
  period: FiscalPeriod;
  onBack: () => void;
  onComplete: (periodId: string) => void;
}

export function PeriodCloseWorkflow({ period, onBack, onComplete }: PeriodCloseWorkflowProps) {
  const [steps, setSteps] = useState<ClosingStep[]>(period.closingSteps);

  const completedCount = steps.filter(s => s.status === "Completed").length;
  const totalCount = steps.length;
  const allComplete = completedCount === totalCount;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const handleToggleStep = (stepId: string) => {
    setSteps(prev => {
      const idx = prev.findIndex(s => s.id === stepId);
      if (idx === -1) return prev;
      const step = prev[idx];
      if (step.status !== "Completed") {
        // Can only complete steps in order
        for (let i = 0; i < idx; i++) {
          if (prev[i].status !== "Completed") return prev;
        }
      }
      const newStatus = step.status === "Completed" ? "Pending" as const : "Completed" as const;
      return prev.map((s, i) => i === idx ? { ...s, status: newStatus, completedBy: newStatus === "Completed" ? "Current User" : undefined, completedDate: newStatus === "Completed" ? "2026-05-17" : undefined } : s);
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg">
              <ArrowLeft size={16} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-[18px] font-semibold text-slate-900">Period Close Workflow</h1>
              <p className="text-[12px] text-slate-500 mt-0.5">{period.name} ({period.startDate} - {period.endDate})</p>
            </div>
          </div>
          {allComplete && (
            <button
              onClick={() => onComplete(period.id)}
              className="px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <Lock size={14} />Hard Close Period
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-600 font-medium">Close Progress</span>
              <span className="text-[11px] text-slate-500">{completedCount} of {totalCount} steps complete</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${allComplete ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {allComplete ? "Ready for Hard Close" : `${progressPct}% Complete`}
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "Completed";
            const isAvailable = idx === 0 || steps[idx - 1].status === "Completed";
            const isLocked = !isCompleted && !isAvailable;

            return (
              <div
                key={step.id}
                className={`px-5 py-4 flex items-center gap-4 ${isLocked ? "opacity-50" : ""}`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : isLocked ? (
                    <Lock size={18} className="text-slate-300" />
                  ) : (
                    <button onClick={() => handleToggleStep(step.id)} className="hover:scale-110 transition-transform">
                      <Circle size={20} className="text-slate-300 hover:text-blue-400" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">Step {step.stepNumber}</span>
                    <h4 className="text-[13px] font-medium text-slate-900">{step.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                </div>

                <div className="text-right flex-shrink-0 w-36">
                  {isCompleted ? (
                    <div>
                      <p className="text-[10px] text-green-600 font-medium">{step.completedBy}</p>
                      <p className="text-[10px] text-slate-400">{step.completedDate}</p>
                    </div>
                  ) : isAvailable ? (
                    <button
                      onClick={() => handleToggleStep(step.id)}
                      className="text-[10px] px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium"
                    >
                      Mark Complete
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!allComplete && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-600" />
            <p className="text-[11px] text-amber-700">All steps must be completed sequentially before the period can be hard-closed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
