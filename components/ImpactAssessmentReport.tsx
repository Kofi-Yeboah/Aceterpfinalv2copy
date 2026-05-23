import { useState } from "react";
import {
  Search, Download, ChevronDown, FileText, Eye,
  TrendingUp, Target, Activity, Globe, BarChart3,
  CheckCircle, Clock, AlertTriangle, Printer, X,
  Users, Sparkles, ArrowUpRight, Layers,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const impactDimensionData = [
  { dimension: "Economic", score: 82 },
  { dimension: "Social", score: 88 },
  { dimension: "Environmental", score: 65 },
  { dimension: "Governance", score: 75 },
  { dimension: "Gender Equity", score: 90 },
];

const radarData = [
  { subject: "Economic", A: 82, fullMark: 100 },
  { subject: "Social", A: 88, fullMark: 100 },
  { subject: "Environmental", A: 65, fullMark: 100 },
  { subject: "Governance", A: 75, fullMark: 100 },
  { subject: "Gender", A: 90, fullMark: 100 },
  { subject: "Innovation", A: 78, fullMark: 100 },
];

const beneficiaryOutcomeData = [
  { category: "Employment", baseline: 12, endline: 38 },
  { category: "Income Level", baseline: 25, endline: 52 },
  { category: "Health Access", baseline: 45, endline: 72 },
  { category: "Education", baseline: 60, endline: 85 },
  { category: "Food Security", baseline: 30, endline: 55 },
];

const assessmentPhaseData = [
  { name: "Completed", value: 8, color: "#10B981" },
  { name: "In Progress", value: 4, color: "#0B01D0" },
  { name: "Planned", value: 3, color: "#94A3B8" },
  { name: "Cancelled", value: 1, color: "#EF4444" },
];

const impactAssessmentTable = [
  { id: "IA-2025-001", title: "Youth Employment Impact Evaluation", type: "Quasi-Experimental", project: "Youth Employment Program", scope: "National", startDate: "Jan 2024", endDate: "Jun 2025", status: "In Progress", beneficiaries: 12500, impactScore: 82 },
  { id: "IA-2025-002", title: "Digital Literacy Outcome Assessment", type: "Pre-Post Design", project: "Digital Skills for Youth", scope: "Regional", startDate: "Mar 2025", endDate: "Sep 2025", status: "Data Collection", beneficiaries: 5200, impactScore: 0 },
  { id: "IA-2025-003", title: "Climate Resilience Community Assessment", type: "Mixed Methods", project: "Climate Resilience Initiative", scope: "Multi-District", startDate: "Jul 2024", endDate: "Dec 2024", status: "Completed", beneficiaries: 8800, impactScore: 75 },
  { id: "IA-2025-004", title: "Women's Economic Empowerment RCT", type: "RCT", project: "Women's Economic Empowerment", scope: "National", startDate: "Feb 2024", endDate: "Feb 2026", status: "In Progress", beneficiaries: 15000, impactScore: 88 },
  { id: "IA-2025-005", title: "Health Systems Strengthening Evaluation", type: "Contribution Analysis", project: "Health Systems Strengthening", scope: "Provincial", startDate: "Sep 2024", endDate: "Mar 2025", status: "Completed", beneficiaries: 22000, impactScore: 71 },
  { id: "IA-2025-006", title: "Agricultural Modernization ROI Study", type: "Cost-Benefit Analysis", project: "Agricultural Modernization", scope: "National", startDate: "Jun 2025", endDate: "Dec 2025", status: "Planned", beneficiaries: 9500, impactScore: 0 },
  { id: "IA-2025-007", title: "Urban Infrastructure Social Impact", type: "Mixed Methods", project: "Urban Infrastructure Upgrade", scope: "Municipal", startDate: "Apr 2024", endDate: "Oct 2024", status: "Completed", beneficiaries: 45000, impactScore: 68 },
  { id: "IA-2025-008", title: "Clean Water Program Health Outcomes", type: "Pre-Post Design", project: "Clean Water Access Program", scope: "Multi-District", startDate: "Nov 2024", endDate: "May 2025", status: "Analysis", beneficiaries: 18000, impactScore: 0 },
  { id: "IA-2025-009", title: "Education Support Longitudinal Study", type: "Longitudinal", project: "Education Support Program", scope: "National", startDate: "Jan 2023", endDate: "Dec 2027", status: "In Progress", beneficiaries: 30000, impactScore: 79 },
  { id: "IA-2025-010", title: "Governance Program Process Evaluation", type: "Theory-Based", project: "Governance & Rule of Law", scope: "National", startDate: "Aug 2025", endDate: "Feb 2026", status: "Planned", beneficiaries: 0, impactScore: 0 },
];

const assessmentTypes = ["All Types", "Quasi-Experimental", "Pre-Post Design", "Mixed Methods", "RCT", "Contribution Analysis", "Cost-Benefit Analysis", "Longitudinal", "Theory-Based"];
const scopes = ["All Scopes", "National", "Regional", "Multi-District", "Provincial", "Municipal"];

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function ImpactAssessmentReport() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "progress" | "planned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedScope, setSelectedScope] = useState("All Scopes");
  const [showTypeDD, setShowTypeDD] = useState(false);
  const [showScopeDD, setShowScopeDD] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<typeof impactAssessmentTable[0] | null>(null);

  const tabs = [
    { key: "all" as const, label: "All Assessments", count: impactAssessmentTable.length },
    { key: "completed" as const, label: "Completed", count: impactAssessmentTable.filter(r => r.status === "Completed").length },
    { key: "progress" as const, label: "In Progress", count: impactAssessmentTable.filter(r => r.status === "In Progress" || r.status === "Data Collection" || r.status === "Analysis").length },
    { key: "planned" as const, label: "Planned", count: impactAssessmentTable.filter(r => r.status === "Planned").length },
  ];

  const filteredAssessments = impactAssessmentTable.filter(r => {
    if (activeTab === "completed" && r.status !== "Completed") return false;
    if (activeTab === "progress" && !["In Progress", "Data Collection", "Analysis"].includes(r.status)) return false;
    if (activeTab === "planned" && r.status !== "Planned") return false;
    if (selectedType !== "All Types" && r.type !== selectedType) return false;
    if (selectedScope !== "All Scopes" && r.scope !== selectedScope) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-100 text-emerald-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Data Collection": return "bg-purple-100 text-purple-700";
      case "Analysis": return "bg-amber-100 text-amber-700";
      case "Planned": return "bg-slate-100 text-slate-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return "text-slate-400";
    if (score >= 80) return "text-emerald-600";
    if (score >= 65) return "text-amber-600";
    return "text-red-600";
  };

  // Detail view
  if (selectedAssessment) {
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="bg-white border-b border-slate-200 shrink-0">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedAssessment(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <X size={18} />
                <span className="text-[13px] font-medium">Close</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <h1 className="text-[16px] font-semibold text-slate-900">{selectedAssessment.title}</h1>
                <p className="text-[11px] text-slate-400">{selectedAssessment.id} — {selectedAssessment.type} — {selectedAssessment.scope}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium", getStatusStyle(selectedAssessment.status))}>{selectedAssessment.status}</span>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Printer size={13} /> Print</button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] text-[12px] font-medium"><Download size={13} /> Export</button>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Impact Score", value: selectedAssessment.impactScore > 0 ? `${selectedAssessment.impactScore}/100` : "Pending" },
              { label: "Beneficiaries", value: selectedAssessment.beneficiaries > 0 ? selectedAssessment.beneficiaries.toLocaleString() : "TBD" },
              { label: "Methodology", value: selectedAssessment.type },
              { label: "Duration", value: `${selectedAssessment.startDate} – ${selectedAssessment.endDate}` },
            ].map((c, i) => (
              <div key={i} className="bg-slate-50 rounded-xl border border-slate-100 p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-1">{c.label}</p>
                <p className="text-[14px] text-slate-800 font-semibold">{c.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center"><FileText size={13} className="text-[#0B01D0]" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Assessment Details</h2>
              </div>
              <div className="p-6 divide-y divide-slate-100">
                {[
                  { label: "Assessment ID", value: selectedAssessment.id },
                  { label: "Title", value: selectedAssessment.title },
                  { label: "Methodology", value: selectedAssessment.type },
                  { label: "Project", value: selectedAssessment.project },
                  { label: "Geographic Scope", value: selectedAssessment.scope },
                  { label: "Start Date", value: selectedAssessment.startDate },
                  { label: "End Date", value: selectedAssessment.endDate },
                  { label: "Target Beneficiaries", value: selectedAssessment.beneficiaries > 0 ? selectedAssessment.beneficiaries.toLocaleString() : "TBD" },
                  { label: "Impact Score", value: selectedAssessment.impactScore > 0 ? `${selectedAssessment.impactScore}/100` : "Pending" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-[11px] text-slate-500">{row.label}</span>
                    <span className={cn("text-[11px] font-medium", row.label === "Impact Score" ? getScoreColor(selectedAssessment.impactScore) : "text-slate-800")}>{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Impact radar */}
            {selectedAssessment.impactScore > 0 && (
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center"><Sparkles size={13} className="text-purple-600" /></div>
                  <h2 className="text-[13px] font-semibold text-slate-800">Impact Dimensions</h2>
                </div>
                <div className="p-6 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "#94a3b8" }} />
                      <Radar name="Impact Score" dataKey="A" stroke="#0B01D0" fill="#0B01D0" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {/* Key Findings */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center"><TrendingUp size={13} className="text-emerald-600" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Key Findings & Recommendations</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { type: "Finding", text: "82% of youth participants reported improved employability within 6 months of program completion." },
                  { type: "Finding", text: "Female participants showed 15% higher retention rates compared to male counterparts." },
                  { type: "Recommendation", text: "Expand community-based training model to underserved districts in Phase 2." },
                  { type: "Recommendation", text: "Strengthen post-program mentorship to improve sustained employment outcomes." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={cn("shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider",
                      item.type === "Finding" ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                    )}>{item.type}</span>
                    <p className="text-[12px] text-slate-700 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] hover:bg-[#0a01b8] text-white rounded-lg text-[12px] font-medium"><Download size={13} /> Export Full Report</button>
              <button className="flex items-center gap-1.5 px-5 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Eye size={13} /> View Executive Summary</button>
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
          <h1 className="text-[20px] font-semibold text-slate-900">Impact Assessment</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium"><Download size={14} /> Export</button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] text-[12px] font-medium"><FileText size={14} /> New Assessment</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Assessments", value: "16", sub: "Since inception", icon: <FileText size={14} className="text-[#0B01D0]" />, bg: "bg-[#0B01D0]/10" },
            { label: "Avg Impact Score", value: "78", sub: "Across completed", icon: <Sparkles size={14} className="text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Beneficiaries Reached", value: "165K", sub: "Total tracked", icon: <Users size={14} className="text-purple-600" />, bg: "bg-purple-50" },
            { label: "Active Evaluations", value: "5", sub: "In field currently", icon: <Activity size={14} className="text-amber-600" />, bg: "bg-amber-50" },
            { label: "Publications", value: "3", sub: "Peer reviewed", icon: <Globe size={14} className="text-blue-600" />, bg: "bg-blue-50" },
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
          {/* Impact Radar */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Impact Dimension Scores</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: "#64748b" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Score" dataKey="A" stroke="#0B01D0" fill="#0B01D0" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Beneficiary Outcomes */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Baseline vs Endline (% Improvement)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={beneficiaryOutcomeData} margin={{ left: 0, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 8, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} formatter={(v: any) => `${v}%`} />
                <Bar dataKey="baseline" fill="#cbd5e1" name="Baseline" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="endline" fill="#0B01D0" name="Endline" radius={[3, 3, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Assessment Phase */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Assessment Status Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={assessmentPhaseData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {assessmentPhaseData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
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
              <input type="text" placeholder="Search assessments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent outline-none text-[11px] text-slate-700 placeholder:text-slate-400" />
            </div>
            <div className="relative">
              <button onClick={() => { setShowTypeDD(!showTypeDD); setShowScopeDD(false); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {selectedType} <ChevronDown size={12} />
              </button>
              {showTypeDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[180px] max-h-60 overflow-auto">
                  {assessmentTypes.map(t => (
                    <button key={t} onClick={() => { setSelectedType(t); setShowTypeDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", selectedType === t && "bg-slate-50 font-medium text-[#0B01D0]")}>{t}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => { setShowScopeDD(!showScopeDD); setShowTypeDD(false); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {selectedScope} <ChevronDown size={12} />
              </button>
              {showScopeDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[150px]">
                  {scopes.map(s => (
                    <button key={s} onClick={() => { setSelectedScope(s); setShowScopeDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", selectedScope === s && "bg-slate-50 font-medium text-[#0B01D0]")}>{s}</button>
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
              {["Assessment ID", "Title", "Methodology", "Project", "Scope", "Timeline", "Status", "Beneficiaries", "Impact Score"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssessments.map((r, i) => (
              <tr key={r.id} onClick={() => setSelectedAssessment(r)} className={cn("hover:bg-slate-50 cursor-pointer transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3 text-[11px] text-[#0B01D0] font-medium">{r.id}</td>
                <td className="px-4 py-3 text-[11px] text-slate-800 font-medium max-w-[200px] truncate">{r.title}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.type}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600 max-w-[150px] truncate">{r.project}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.scope}</td>
                <td className="px-4 py-3 text-[11px] text-slate-500">{r.startDate} – {r.endDate}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getStatusStyle(r.status))}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.beneficiaries > 0 ? r.beneficiaries.toLocaleString() : "TBD"}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[11px] font-medium", getScoreColor(r.impactScore))}>{r.impactScore > 0 ? `${r.impactScore}/100` : "—"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssessments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText size={24} className="text-slate-300 mb-2" />
            <p className="text-[13px] text-slate-400">No assessments match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
