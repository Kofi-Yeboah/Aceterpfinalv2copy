import { useState } from "react";
import {
  Search, Download, ChevronDown, FileText, Eye,
  TrendingUp, Users, BarChart3, Briefcase, Target,
  CheckCircle, Clock, AlertTriangle, Printer, X,
  ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const projectPerformanceData = [
  { project: "YEP Grant", budget: 85, timeline: 78, quality: 92 },
  { project: "Climate Initiative", budget: 72, timeline: 88, quality: 85 },
  { project: "Digital Skills", budget: 90, timeline: 95, quality: 88 },
  { project: "Health Systems", budget: 65, timeline: 60, quality: 75 },
  { project: "Women Econ.", budget: 88, timeline: 82, quality: 90 },
];

const resourceUtilData = [
  { month: "Jan", utilization: 78, capacity: 100 },
  { month: "Feb", utilization: 82, capacity: 100 },
  { month: "Mar", utilization: 85, capacity: 100 },
  { month: "Apr", utilization: 79, capacity: 100 },
  { month: "May", utilization: 88, capacity: 100 },
  { month: "Jun", utilization: 91, capacity: 100 },
];

const riskDistData = [
  { name: "Low", value: 12, color: "#10B981" },
  { name: "Medium", value: 8, color: "#F59E0B" },
  { name: "High", value: 4, color: "#EF4444" },
  { name: "Critical", value: 1, color: "#991B1B" },
];

const managementReportsTable = [
  { id: "MR-2025-001", title: "Monthly Portfolio Performance Summary", category: "Portfolio", frequency: "Monthly", period: "Mar 2025", generatedDate: "Apr 01, 2025", generatedBy: "System Auto", status: "Final", trend: "up" },
  { id: "MR-2025-002", title: "Budget Burn Rate Analysis", category: "Financial", frequency: "Monthly", period: "Mar 2025", generatedDate: "Apr 02, 2025", generatedBy: "Finance Team", status: "Final", trend: "down" },
  { id: "MR-2025-003", title: "Resource Utilization Report", category: "Operations", frequency: "Monthly", period: "Mar 2025", generatedDate: "Apr 03, 2025", generatedBy: "HR Team", status: "Final", trend: "up" },
  { id: "MR-2025-004", title: "Risk Register Summary", category: "Risk", frequency: "Quarterly", period: "Q1 2025", generatedDate: "Apr 05, 2025", generatedBy: "Risk Manager", status: "Draft", trend: "flat" },
  { id: "MR-2025-005", title: "Staff Capacity & Allocation Report", category: "Operations", frequency: "Monthly", period: "Mar 2025", generatedDate: "Apr 01, 2025", generatedBy: "HR Team", status: "Final", trend: "up" },
  { id: "MR-2025-006", title: "Procurement Status Report", category: "Procurement", frequency: "Monthly", period: "Mar 2025", generatedDate: "Apr 04, 2025", generatedBy: "Procurement", status: "Final", trend: "flat" },
  { id: "MR-2025-007", title: "Quarterly Board Report", category: "Governance", frequency: "Quarterly", period: "Q1 2025", generatedDate: "Apr 10, 2025", generatedBy: "Executive Team", status: "Draft", trend: "up" },
  { id: "MR-2025-008", title: "Cash Flow Forecast", category: "Financial", frequency: "Monthly", period: "Apr 2025", generatedDate: "Apr 01, 2025", generatedBy: "Finance Team", status: "Final", trend: "down" },
  { id: "MR-2025-009", title: "Compliance & Audit Tracker", category: "Governance", frequency: "Quarterly", period: "Q1 2025", generatedDate: "Apr 08, 2025", generatedBy: "Compliance Officer", status: "Under Review", trend: "flat" },
  { id: "MR-2025-010", title: "KPI Dashboard Summary", category: "Portfolio", frequency: "Monthly", period: "Mar 2025", generatedDate: "Apr 01, 2025", generatedBy: "M&E Team", status: "Final", trend: "up" },
];

const categories = ["All Categories", "Portfolio", "Financial", "Operations", "Risk", "Procurement", "Governance"];
const frequencies = ["All Frequencies", "Monthly", "Quarterly", "Semi-Annual", "Annual"];

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function ManagementReports() {
  const [activeTab, setActiveTab] = useState<"all" | "final" | "draft" | "review">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedFrequency, setSelectedFrequency] = useState("All Frequencies");
  const [showCatDD, setShowCatDD] = useState(false);
  const [showFreqDD, setShowFreqDD] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof managementReportsTable[0] | null>(null);

  const tabs = [
    { key: "all" as const, label: "All Reports", count: managementReportsTable.length },
    { key: "final" as const, label: "Final", count: managementReportsTable.filter(r => r.status === "Final").length },
    { key: "draft" as const, label: "Draft", count: managementReportsTable.filter(r => r.status === "Draft").length },
    { key: "review" as const, label: "Under Review", count: managementReportsTable.filter(r => r.status === "Under Review").length },
  ];

  const filteredReports = managementReportsTable.filter(r => {
    if (activeTab === "final" && r.status !== "Final") return false;
    if (activeTab === "draft" && r.status !== "Draft") return false;
    if (activeTab === "review" && r.status !== "Under Review") return false;
    if (selectedCategory !== "All Categories" && r.category !== selectedCategory) return false;
    if (selectedFrequency !== "All Frequencies" && r.frequency !== selectedFrequency) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Final": return "bg-emerald-100 text-emerald-700";
      case "Draft": return "bg-slate-100 text-slate-600";
      case "Under Review": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUpRight size={12} className="text-emerald-500" />;
      case "down": return <ArrowDownRight size={12} className="text-red-500" />;
      default: return <Minus size={12} className="text-slate-400" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      "Portfolio": "bg-indigo-100 text-indigo-700",
      "Financial": "bg-emerald-100 text-emerald-700",
      "Operations": "bg-purple-100 text-purple-700",
      "Risk": "bg-red-100 text-red-700",
      "Procurement": "bg-amber-100 text-amber-700",
      "Governance": "bg-blue-100 text-blue-700",
    };
    return colors[cat] || "bg-slate-100 text-slate-600";
  };

  // Detail view
  if (selectedReport) {
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="bg-white border-b border-slate-200 shrink-0">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedReport(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <X size={18} />
                <span className="text-[13px] font-medium">Close</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <h1 className="text-[16px] font-semibold text-slate-900">{selectedReport.title}</h1>
                <p className="text-[11px] text-slate-400">{selectedReport.id} — {selectedReport.category} — {selectedReport.period}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium", getStatusStyle(selectedReport.status))}>
                {selectedReport.status}
              </span>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Printer size={13} /> Print</button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] text-[12px] font-medium"><Download size={13} /> Export</button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            {/* Report info */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><FileText size={13} className="text-[#0B01D0]" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Report Information</h2>
              </div>
              <div className="p-6 divide-y divide-slate-100">
                {[
                  { label: "Report ID", value: selectedReport.id },
                  { label: "Title", value: selectedReport.title },
                  { label: "Category", value: selectedReport.category },
                  { label: "Frequency", value: selectedReport.frequency },
                  { label: "Reporting Period", value: selectedReport.period },
                  { label: "Generated Date", value: selectedReport.generatedDate },
                  { label: "Generated By", value: selectedReport.generatedBy },
                  { label: "Status", value: selectedReport.status },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-[11px] text-slate-500">{row.label}</span>
                    <span className="text-[11px] text-slate-800 font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Metrics */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center"><BarChart3 size={13} className="text-emerald-600" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Key Metrics Snapshot</h2>
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { label: "Portfolio Health", value: "85%", trend: "up" },
                  { label: "Avg Budget Burn", value: "72%", trend: "flat" },
                  { label: "Resource Util.", value: "88%", trend: "up" },
                  { label: "Risk Score", value: "Medium", trend: "down" },
                ].map((m, i) => (
                  <div key={i} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">{m.label}</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[16px] text-slate-800 font-semibold">{m.value}</span>
                      {getTrendIcon(m.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex items-center gap-3">
              {selectedReport.status === "Draft" && (
                <button className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] hover:bg-[#0a01b8] text-white rounded-lg text-[12px] font-medium"><CheckCircle size={13} /> Finalize Report</button>
              )}
              {selectedReport.status === "Under Review" && (
                <button className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-medium"><CheckCircle size={13} /> Approve</button>
              )}
              <button className="flex items-center gap-1.5 px-5 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={13} /> Export PDF</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-slate-900">Management Reports</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={14} /> Export All</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] text-[12px] font-medium"><FileText size={14} /> Generate Report</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Reports", value: "42", sub: "This Quarter", icon: <FileText size={14} className="text-[#0B01D0]" />, bg: "bg-[#0B01D0]/10" },
            { label: "Portfolio Health", value: "85%", sub: "+3% vs last month", icon: <TrendingUp size={14} className="text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Active Projects", value: "18", sub: "Across 5 programs", icon: <Briefcase size={14} className="text-purple-600" />, bg: "bg-purple-50" },
            { label: "Resource Utilization", value: "88%", sub: "Above 85% target", icon: <Users size={14} className="text-amber-600" />, bg: "bg-amber-50" },
            { label: "Open Risks", value: "25", sub: "4 High / 1 Critical", icon: <AlertTriangle size={14} className="text-red-600" />, bg: "bg-red-50" },
          ].map((card, i) => (
            <div key={i} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", card.bg)}>{card.icon}</div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{card.label}</p>
              </div>
              <p className="text-[18px] text-slate-800 font-semibold">{card.value}</p>
              <p className="text-[10px] text-slate-400">{card.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-3 gap-4">
          {/* Project Performance */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Project Performance Scores</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={projectPerformanceData} margin={{ left: 0, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="project" tick={{ fontSize: 8, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Bar dataKey="budget" fill="#818cf8" name="Budget" radius={[3, 3, 0, 0]} barSize={8} />
                <Bar dataKey="timeline" fill="#34d399" name="Timeline" radius={[3, 3, 0, 0]} barSize={8} />
                <Bar dataKey="quality" fill="#0B01D0" name="Quality" radius={[3, 3, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resource Util Trend */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Resource Utilization Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={resourceUtilData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => `${v}%`} />
                <Area type="monotone" dataKey="utilization" stroke="#0B01D0" fill="#0B01D0" fillOpacity={0.15} strokeWidth={2} name="Utilization %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={riskDistData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {riskDistData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1.5 font-medium",
                  activeTab === tab.key ? "bg-[#0B01D0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab.label}
                <span className={cn("px-1.5 py-0.5 rounded-full text-[9px]", activeTab === tab.key ? "bg-white/20" : "bg-slate-200/80")}>{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white w-48">
              <Search size={13} className="text-slate-400" />
              <input type="text" placeholder="Search reports..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent outline-none text-[11px] text-slate-700 placeholder:text-slate-400" />
            </div>
            <div className="relative">
              <button onClick={() => { setShowCatDD(!showCatDD); setShowFreqDD(false); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {selectedCategory} <ChevronDown size={12} />
              </button>
              {showCatDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[150px]">
                  {categories.map(c => (
                    <button key={c} onClick={() => { setSelectedCategory(c); setShowCatDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", selectedCategory === c && "bg-slate-50 font-medium text-[#0B01D0]")}>{c}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => { setShowFreqDD(!showFreqDD); setShowCatDD(false); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {selectedFrequency} <ChevronDown size={12} />
              </button>
              {showFreqDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[150px]">
                  {frequencies.map(f => (
                    <button key={f} onClick={() => { setSelectedFrequency(f); setShowFreqDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", selectedFrequency === f && "bg-slate-50 font-medium text-[#0B01D0]")}>{f}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              {["Report ID", "Title", "Category", "Frequency", "Period", "Generated", "By", "Status", "Trend"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReports.map((r, i) => (
              <tr key={r.id} onClick={() => setSelectedReport(r)} className={cn("hover:bg-slate-50 cursor-pointer transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3 text-[11px] text-[#0B01D0] font-medium">{r.id}</td>
                <td className="px-4 py-3 text-[11px] text-slate-800 font-medium max-w-[220px] truncate">{r.title}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getCategoryColor(r.category))}>{r.category}</span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.frequency}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.period}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.generatedDate}</td>
                <td className="px-4 py-3 text-[11px] text-slate-500">{r.generatedBy}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getStatusStyle(r.status))}>{r.status}</span>
                </td>
                <td className="px-4 py-3">{getTrendIcon(r.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredReports.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText size={24} className="text-slate-300 mb-2" />
            <p className="text-[13px] text-slate-400">No reports match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
