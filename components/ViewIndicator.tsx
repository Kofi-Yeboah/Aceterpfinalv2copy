import { useState } from "react";
import {
  ArrowLeft, Edit2, FileText, Download, Circle, Printer,
  Target, BarChart3, Layers, BookOpen, Clock, TrendingUp,
  CheckCircle, AlertTriangle, Activity, GitBranch, ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

interface Indicator {
  id: string;
  name: string;
  level: string;
  unit: string;
  dataSource: string;
  frequency: string;
  target: string;
  actual: string;
  status: string;
}

interface ViewIndicatorProps {
  indicator: Indicator;
  onBack: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function ViewIndicator({ indicator, onBack }: ViewIndicatorProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "data" | "metadata" | "context">("overview");

  // Derived values
  const actualVal = parseInt(indicator.actual) || 0;
  const targetVal = parseInt(indicator.target) || 0;
  const achievement = targetVal > 0 ? Math.round((actualVal / targetVal) * 100) : 0;
  const variance = targetVal > 0 ? (((actualVal - targetVal) / targetVal) * 100) : 0;
  const varianceText = variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`;

  const getStatusBadge = () => {
    if (achievement >= 100) return { text: "On Track", color: "bg-emerald-100 text-emerald-700", dotColor: "bg-emerald-500" };
    if (achievement >= 85) return { text: "At Risk", color: "bg-amber-100 text-amber-700", dotColor: "bg-amber-500" };
    return { text: "Behind", color: "bg-red-100 text-red-700", dotColor: "bg-red-500" };
  };
  const statusBadge = getStatusBadge();
  const healthColor = achievement >= 100 ? "text-emerald-600" : achievement >= 85 ? "text-amber-600" : "text-red-600";
  const healthBg = achievement >= 100 ? "bg-emerald-500" : achievement >= 85 ? "bg-amber-500" : "bg-red-500";

  // Chart data
  const trendData = [
    { period: "Q3 2024", targetValue: 300, actualValue: 280 },
    { period: "Q4 2024", targetValue: 400, actualValue: 380 },
    { period: "Q1 2025", targetValue: 500, actualValue: 550 },
    { period: "Q2 2025", targetValue: 520, actualValue: 0 },
  ];

  // Data history
  const dataHistory = [
    { id: "DH-001", period: "Q1 2025", targetVal: 500, actualVal: 550, variance: "+10%", evidence: "YEP_Attendance_Q1.pdf", status: "Verified", notes: "Exceeded target due to extra workshop" },
    { id: "DH-002", period: "Q4 2024", targetVal: 400, actualVal: 380, variance: "-5%", evidence: "YEP_Attendance_Q4.pdf", status: "Verified", notes: "Holiday season affected attendance" },
    { id: "DH-003", period: "Q3 2024", targetVal: 300, actualVal: 280, variance: "-6.7%", evidence: "YEP_Attendance_Q3.pdf", status: "Verified", notes: "New hub not yet operational" },
  ];

  // Tabs
  const tabs = [
    { key: "overview" as const, label: "Overview", icon: <BarChart3 size={13} /> },
    { key: "data" as const, label: "Data History", icon: <Clock size={13} /> },
    { key: "metadata" as const, label: "Metadata (PIRS)", icon: <BookOpen size={13} /> },
    { key: "context" as const, label: "Strategic Context", icon: <GitBranch size={13} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={18} />
              <span className="text-[13px] font-medium">Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-[16px] font-semibold text-slate-900">{indicator.id}: {indicator.name}</h1>
              <p className="text-[11px] text-slate-400">{indicator.level} &middot; {indicator.frequency} Reporting &middot; {indicator.unit}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium", statusBadge.color)}>
              <Circle size={6} fill="currentColor" />
              {statusBadge.text}
            </span>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium">
              <Edit2 size={13} />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Target</p>
            <p className="text-[16px] text-slate-800 font-semibold">{indicator.target}</p>
            <p className="text-[10px] text-slate-400">{indicator.unit}</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Actual (YTD)</p>
            <p className="text-[16px] text-slate-800 font-semibold">{indicator.actual}</p>
            <p className="text-[10px] text-slate-400">{indicator.unit}</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Achievement</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", healthBg)} style={{ width: `${Math.min(achievement, 100)}%` }} />
              </div>
              <span className={cn("text-[13px] font-semibold", healthColor)}>{achievement}%</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Variance</p>
            <p className={cn("text-[16px] font-semibold", variance >= 0 ? "text-emerald-600" : "text-red-600")}>{varianceText}</p>
            <p className="text-[10px] text-slate-400">{variance >= 0 ? "Exceeded" : "Below Target"}</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">Data Source</p>
            <p className="text-[12px] text-slate-800 font-medium">{indicator.dataSource}</p>
            <p className="text-[10px] text-slate-400">{indicator.frequency}</p>
          </div>
        </div>
      </div>

      {/* ── Tabs (Document Vault pill style) ─────────────────────────────── */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[130px] flex items-center justify-center gap-1.5 font-medium",
                activeTab === tab.key
                  ? "bg-[#0B01D0] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {/* ═══ OVERVIEW TAB ═══════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            {/* Trend Chart */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                    <TrendingUp size={13} className="text-[#0B01D0]" />
                  </div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Performance Trend</h2>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 transition-colors text-[11px] text-slate-600 font-medium">
                  <Download size={12} />
                  Export
                </button>
              </div>
              <div className="p-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="targetValue" fill="#818cf8" name="Target" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actualValue" fill="#34d399" name="Actual" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Quick metrics row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Disaggregation snapshot */}
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                    <Layers size={13} className="text-purple-600" />
                  </div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Disaggregation (Latest)</h2>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: "Male", value: Math.floor(actualVal * 0.45), pct: 45 },
                    { label: "Female", value: Math.ceil(actualVal * 0.55), pct: 55 },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="w-16 text-[11px] text-slate-500 font-medium">{row.label}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", row.label === "Male" ? "bg-indigo-400" : "bg-pink-400")}
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-700 font-medium w-12 text-right">{row.value}</span>
                      <span className="text-[10px] text-slate-400 w-10 text-right">({row.pct}%)</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Total</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-slate-800 font-semibold">{actualVal}</span>
                      <CheckCircle size={12} className="text-emerald-400" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Reporting info */}
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                    <Activity size={13} className="text-emerald-600" />
                  </div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Reporting Summary</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {[
                      { label: "Frequency", value: indicator.frequency },
                      { label: "Last Reported", value: "Q1 2025 (Jan – Mar)" },
                      { label: "Next Due", value: "Q2 2025 (Apr – Jun)" },
                      { label: "Data Points", value: `${dataHistory.length} periods recorded` },
                      { label: "Baseline", value: "0" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">{row.label}</span>
                        <span className="text-[11px] text-slate-800 font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ═══ DATA HISTORY TAB ═══════════════════════════════════════════ */}
        {activeTab === "data" && (
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Period</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Target</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Actual</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Variance</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Evidence</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Status</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white">Notes / Narrative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataHistory.map((row, i) => (
                  <tr key={row.id} className={cn("hover:bg-slate-50 transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                    <td className="px-5 py-3 text-[11px] text-slate-800 font-medium">{row.period}</td>
                    <td className="px-5 py-3 text-[11px] text-slate-600">{row.targetVal}</td>
                    <td className="px-5 py-3 text-[11px] text-slate-900 font-medium">{row.actualVal}</td>
                    <td className="px-5 py-3">
                      <span className={cn("text-[11px] font-medium", row.variance.startsWith("+") ? "text-emerald-600" : "text-red-600")}>
                        {row.variance}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700">
                        <FileText size={12} />
                        {row.evidence}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle size={10} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[11px] text-slate-600 max-w-[220px] truncate">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ═══ METADATA (PIRS) TAB ════════════════════════════════════════ */}
        {activeTab === "metadata" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                  <BookOpen size={13} className="text-[#0B01D0]" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Performance Indicator Reference Sheet (PIRS)</h2>
              </div>
              <div className="p-6 space-y-0 divide-y divide-slate-100">
                {[
                  { label: "Indicator Name", value: indicator.name },
                  { label: "Definition", value: "Count of unique individuals completing digital skills training program" },
                  { label: "Calculation Method", value: "Sum of unique attendees across all training cohorts within the reporting period" },
                  { label: "Unit of Measure", value: indicator.unit },
                  { label: "Data Source", value: indicator.dataSource },
                  { label: "Collection Frequency", value: indicator.frequency },
                  { label: "Disaggregation", value: "By Gender: Male / Female\nBy Region: Urban / Rural\nBy Age: 18–24 / 25–35" },
                  { label: "Data Quality Limitations", value: "Attendance records may undercount walk-ins who don't register. Self-reported data on prior employment status." },
                  { label: "Responsible Officer", value: "M&E Coordinator — Regional Hub Manager" },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-4 py-3.5">
                    <div className="w-[180px] shrink-0">
                      <span className="text-[11px] text-slate-500 font-medium">{row.label}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] text-slate-800 whitespace-pre-line leading-relaxed">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ═══ STRATEGIC CONTEXT TAB ══════════════════════════════════════ */}
        {activeTab === "context" && (
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            {/* Framework linkage */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                  <GitBranch size={13} className="text-emerald-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Framework & Linkage</h2>
              </div>
              <div className="p-6 space-y-0 divide-y divide-slate-100">
                {[
                  { label: "Framework", value: "Youth Employment Theory of Change" },
                  { label: "Framework Level", value: indicator.level },
                  { label: "Parent Objective", value: "Outcome 2: Increased Youth Employability" },
                  { label: "Project", value: "Youth Employment Program (YEP Grant)" },
                  { label: "Baseline Value", value: "0" },
                  { label: "End-of-Project Target", value: indicator.target + " " + indicator.unit },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-4 py-3.5">
                    <div className="w-[180px] shrink-0">
                      <span className="text-[11px] text-slate-500 font-medium">{row.label}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] text-slate-800">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Causal chain breadcrumb */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                  <Layers size={13} className="text-purple-600" />
                </div>
                <h2 className="text-[13px] font-semibold text-slate-800">Causal Chain Position</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { level: "Goal", text: "Reduce youth unemployment by 20%", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
                    { level: "Outcome", text: "Youth acquire market-relevant digital skills", color: "bg-purple-50 border-purple-200 text-purple-700" },
                    { level: "Output", text: "Digital training hubs established", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                  ].map((node, i, arr) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={cn("px-3 py-2 rounded-lg border text-[11px] font-medium", node.color)}>
                        <span className="text-[9px] uppercase tracking-wider opacity-70 block">{node.level}</span>
                        {node.text}
                      </div>
                      {i < arr.length - 1 && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2">
                  <Target size={12} className="text-[#0B01D0] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    This indicator measures the direct output of digital skills training. Results feed into
                    Outcome 2 (youth employability) which contributes to the overarching impact goal.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
