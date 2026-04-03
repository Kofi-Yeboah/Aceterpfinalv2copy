import { useState } from "react";
import {
  Search, Download, ChevronDown, FileText, Eye,
  TrendingUp, Target, Activity, Layers, BarChart3,
  CheckCircle, Clock, AlertTriangle, Printer, X,
  Users, GitBranch, Database,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const indicatorAchievementData = [
  { outcome: "Youth Employment", achievementRate: 92 },
  { outcome: "Health Access", achievementRate: 78 },
  { outcome: "Digital Literacy", achievementRate: 95 },
  { outcome: "Women Empower.", achievementRate: 85 },
  { outcome: "Climate Resil.", achievementRate: 70 },
];

const dataQualityTrend = [
  { quarter: "Q1 2024", score: 82 },
  { quarter: "Q2 2024", score: 85 },
  { quarter: "Q3 2024", score: 88 },
  { quarter: "Q4 2024", score: 91 },
  { quarter: "Q1 2025", score: 93 },
];

const frameworkCoverageData = [
  { name: "Goal / Impact", value: 3, color: "#4f46e5" },
  { name: "Outcome", value: 8, color: "#7c3aed" },
  { name: "Output", value: 15, color: "#10B981" },
  { name: "Activity", value: 24, color: "#F59E0B" },
];

const melReportsTable = [
  { id: "MEL-2025-001", title: "Quarterly Performance Indicator Report", type: "Performance", project: "Youth Employment Program", period: "Q1 2025", dueDate: "Apr 15, 2025", status: "Submitted", dataQuality: 95, indicatorsTracked: 12 },
  { id: "MEL-2025-002", title: "Annual Results Framework Review", type: "Framework", project: "All Programs", period: "FY 2024", dueDate: "Mar 31, 2025", status: "Submitted", dataQuality: 92, indicatorsTracked: 45 },
  { id: "MEL-2025-003", title: "Beneficiary Reach Analysis Report", type: "Beneficiary", project: "Digital Skills for Youth", period: "Q1 2025", dueDate: "Apr 20, 2025", status: "In Progress", dataQuality: 88, indicatorsTracked: 8 },
  { id: "MEL-2025-004", title: "Data Quality Assessment Report", type: "Data Quality", project: "Health Systems Strengthening", period: "Q1 2025", dueDate: "Apr 30, 2025", status: "Draft", dataQuality: 78, indicatorsTracked: 10 },
  { id: "MEL-2025-005", title: "Learning & Adaptation Brief", type: "Learning", project: "Climate Resilience Initiative", period: "H1 2025", dueDate: "Jul 15, 2025", status: "Draft", dataQuality: 85, indicatorsTracked: 6 },
  { id: "MEL-2025-006", title: "Gender & Inclusion Tracking Report", type: "Cross-Cutting", project: "Women's Economic Empowerment", period: "Q1 2025", dueDate: "Apr 25, 2025", status: "Submitted", dataQuality: 90, indicatorsTracked: 14 },
  { id: "MEL-2025-007", title: "Mid-Term M&E Review", type: "Review", project: "Agricultural Modernization", period: "Mid-Term", dueDate: "May 31, 2025", status: "In Progress", dataQuality: 82, indicatorsTracked: 11 },
  { id: "MEL-2025-008", title: "Outcome Harvesting Summary", type: "Learning", project: "Youth Employment Program", period: "Q1 2025", dueDate: "Apr 30, 2025", status: "Submitted", dataQuality: 94, indicatorsTracked: 5 },
  { id: "MEL-2025-009", title: "Logical Framework Progress Report", type: "Framework", project: "Urban Infrastructure Upgrade", period: "Q1 2025", dueDate: "Apr 15, 2025", status: "Overdue", dataQuality: 75, indicatorsTracked: 9 },
  { id: "MEL-2025-010", title: "Indicator Disaggregation Report", type: "Performance", project: "Clean Water Access Program", period: "Q1 2025", dueDate: "May 10, 2025", status: "Draft", dataQuality: 87, indicatorsTracked: 7 },
];

const reportTypesList = ["All Types", "Performance", "Framework", "Beneficiary", "Data Quality", "Learning", "Cross-Cutting", "Review"];
const projects = ["All Projects", "Youth Employment Program", "Digital Skills for Youth", "Health Systems Strengthening", "Climate Resilience Initiative", "Women's Economic Empowerment", "Agricultural Modernization", "Urban Infrastructure Upgrade", "Clean Water Access Program"];

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function MELReports() {
  const [activeTab, setActiveTab] = useState<"all" | "submitted" | "progress" | "draft" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [showTypeDD, setShowTypeDD] = useState(false);
  const [showProjectDD, setShowProjectDD] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof melReportsTable[0] | null>(null);

  const tabs = [
    { key: "all" as const, label: "All Reports", count: melReportsTable.length },
    { key: "submitted" as const, label: "Submitted", count: melReportsTable.filter(r => r.status === "Submitted").length },
    { key: "progress" as const, label: "In Progress", count: melReportsTable.filter(r => r.status === "In Progress").length },
    { key: "draft" as const, label: "Draft", count: melReportsTable.filter(r => r.status === "Draft").length },
    { key: "overdue" as const, label: "Overdue", count: melReportsTable.filter(r => r.status === "Overdue").length },
  ];

  const filteredReports = melReportsTable.filter(r => {
    if (activeTab === "submitted" && r.status !== "Submitted") return false;
    if (activeTab === "progress" && r.status !== "In Progress") return false;
    if (activeTab === "draft" && r.status !== "Draft") return false;
    if (activeTab === "overdue" && r.status !== "Overdue") return false;
    if (selectedType !== "All Types" && r.type !== selectedType) return false;
    if (selectedProject !== "All Projects" && r.project !== selectedProject) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-emerald-100 text-emerald-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Draft": return "bg-slate-100 text-slate-600";
      case "Overdue": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Performance": "bg-indigo-100 text-indigo-700",
      "Framework": "bg-purple-100 text-purple-700",
      "Beneficiary": "bg-emerald-100 text-emerald-700",
      "Data Quality": "bg-amber-100 text-amber-700",
      "Learning": "bg-blue-100 text-blue-700",
      "Cross-Cutting": "bg-pink-100 text-pink-700",
      "Review": "bg-slate-100 text-slate-700",
    };
    return colors[type] || "bg-slate-100 text-slate-600";
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 80) return "text-amber-600";
    return "text-red-600";
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
                <p className="text-[11px] text-slate-400">{selectedReport.id} — {selectedReport.type} — {selectedReport.project}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium", getStatusStyle(selectedReport.status))}>{selectedReport.status}</span>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Printer size={13} /> Print</button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] text-[12px] font-medium"><Download size={13} /> Export</button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><FileText size={13} className="text-[#0B01D0]" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Report Details</h2>
              </div>
              <div className="p-6 divide-y divide-slate-100">
                {[
                  { label: "Report ID", value: selectedReport.id },
                  { label: "Title", value: selectedReport.title },
                  { label: "Type", value: selectedReport.type },
                  { label: "Project", value: selectedReport.project },
                  { label: "Reporting Period", value: selectedReport.period },
                  { label: "Due Date", value: selectedReport.dueDate },
                  { label: "Indicators Tracked", value: String(selectedReport.indicatorsTracked) },
                  { label: "Data Quality Score", value: `${selectedReport.dataQuality}%` },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-[11px] text-slate-500">{row.label}</span>
                    <span className={cn("text-[11px] font-medium", row.label === "Data Quality Score" ? getQualityColor(selectedReport.dataQuality) : "text-slate-800")}>{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center"><Target size={13} className="text-emerald-600" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Indicator Performance Summary</h2>
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { label: "Total Indicators", value: String(selectedReport.indicatorsTracked) },
                  { label: "On Track", value: String(Math.round(selectedReport.indicatorsTracked * 0.7)) },
                  { label: "At Risk", value: String(Math.round(selectedReport.indicatorsTracked * 0.2)) },
                  { label: "Behind", value: String(Math.round(selectedReport.indicatorsTracked * 0.1)) },
                ].map((m, i) => (
                  <div key={i} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">{m.label}</p>
                    <p className="text-[16px] text-slate-800 font-semibold">{m.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex items-center gap-3">
              {selectedReport.status === "Draft" && (
                <button className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] hover:bg-[#0a01b8] text-white rounded-lg text-[12px] font-medium"><CheckCircle size={13} /> Submit Report</button>
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
          <h1 className="text-[20px] font-semibold text-slate-900">M&E Reports</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={14} /> Export</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] text-[12px] font-medium"><FileText size={14} /> Generate Report</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total M&E Reports", value: "38", sub: "This Fiscal Year", icon: <FileText size={14} className="text-[#0B01D0]" />, bg: "bg-[#0B01D0]/10" },
            { label: "Indicators Tracked", value: "87", sub: "Across all frameworks", icon: <Target size={14} className="text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Avg Data Quality", value: "93%", sub: "+5% vs last quarter", icon: <Database size={14} className="text-purple-600" />, bg: "bg-purple-50" },
            { label: "Frameworks Active", value: "6", sub: "ToC, LogFrame, RF...", icon: <GitBranch size={14} className="text-amber-600" />, bg: "bg-amber-50" },
            { label: "Overdue Reports", value: "1", sub: "Needs attention", icon: <AlertTriangle size={14} className="text-red-600" />, bg: "bg-red-50" },
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
          {/* Achievement by Outcome */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Indicator Achievement by Outcome</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={indicatorAchievementData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: "#64748b" }} />
                <YAxis dataKey="outcome" type="category" width={80} tick={{ fontSize: 8, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => `${v}%`} />
                <Bar dataKey="achievementRate" fill="#0B01D0" name="Achievement %" radius={[0, 4, 4, 0]} barSize={14}>
                  {indicatorAchievementData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.achievementRate >= 85 ? "#10B981" : entry.achievementRate >= 70 ? "#F59E0B" : "#EF4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Quality Trend */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Data Quality Score Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={dataQualityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: "#64748b" }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 9, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => `${v}/100`} />
                <Line type="monotone" dataKey="score" stroke="#0B01D0" strokeWidth={2} name="Quality Score" dot={{ r: 3, fill: "#0B01D0" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Framework Coverage */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Framework Level Coverage</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={frameworkCoverageData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {frameworkCoverageData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
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
              <button onClick={() => { setShowTypeDD(!showTypeDD); setShowProjectDD(false); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {selectedType} <ChevronDown size={12} />
              </button>
              {showTypeDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                  {reportTypesList.map(t => (
                    <button key={t} onClick={() => { setSelectedType(t); setShowTypeDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", selectedType === t && "bg-slate-50 font-medium text-[#0B01D0]")}>{t}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => { setShowProjectDD(!showProjectDD); setShowTypeDD(false); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {selectedProject === "All Projects" ? "All Projects" : selectedProject.substring(0, 18) + "..."} <ChevronDown size={12} />
              </button>
              {showProjectDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[220px] max-h-60 overflow-auto">
                  {projects.map(p => (
                    <button key={p} onClick={() => { setSelectedProject(p); setShowProjectDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", selectedProject === p && "bg-slate-50 font-medium text-[#0B01D0]")}>{p}</button>
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
              {["Report ID", "Title", "Type", "Project", "Period", "Due Date", "Status", "Data Quality", "Indicators"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReports.map((r, i) => (
              <tr key={r.id} onClick={() => setSelectedReport(r)} className={cn("hover:bg-slate-50 cursor-pointer transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3 text-[11px] text-[#0B01D0] font-medium">{r.id}</td>
                <td className="px-4 py-3 text-[11px] text-slate-800 font-medium max-w-[200px] truncate">{r.title}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getTypeColor(r.type))}>{r.type}</span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600 max-w-[160px] truncate">{r.project}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.period}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.dueDate}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getStatusStyle(r.status))}>{r.status}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("text-[11px] font-medium", getQualityColor(r.dataQuality))}>{r.dataQuality}%</span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.indicatorsTracked}</td>
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
