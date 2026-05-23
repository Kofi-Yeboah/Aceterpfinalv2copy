import { useState } from "react";
import {
  Search, Download, ChevronDown, Filter, FileText, Eye,
  TrendingUp, DollarSign, Users, Calendar, BarChart3,
  CheckCircle, Clock, AlertTriangle, Send, Printer, X,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const fundUtilizationData = [
  { donor: "USAID", allocated: 2500000, spent: 1875000 },
  { donor: "World Bank", allocated: 1800000, spent: 1260000 },
  { donor: "EU", allocated: 1200000, spent: 960000 },
  { donor: "DFID", allocated: 900000, spent: 585000 },
  { donor: "JICA", allocated: 600000, spent: 480000 },
];

const reportStatusData = [
  { name: "Submitted", value: 24, color: "#10B981" },
  { name: "Due Soon", value: 8, color: "#F59E0B" },
  { name: "Overdue", value: 3, color: "#EF4444" },
  { name: "In Draft", value: 5, color: "#94A3B8" },
];

const complianceTrendData = [
  { quarter: "Q1 2024", onTime: 92, late: 8 },
  { quarter: "Q2 2024", onTime: 88, late: 12 },
  { quarter: "Q3 2024", onTime: 95, late: 5 },
  { quarter: "Q4 2024", onTime: 90, late: 10 },
  { quarter: "Q1 2025", onTime: 96, late: 4 },
];

const donorReportsTable = [
  { id: "DR-2025-001", donor: "USAID", project: "Youth Employment Program", reportType: "Quarterly Financial", period: "Q1 2025", dueDate: "Apr 15, 2025", submittedDate: "Apr 12, 2025", status: "Submitted", compliance: "On Time" },
  { id: "DR-2025-002", donor: "World Bank", project: "Climate Resilience Initiative", reportType: "Annual Progress", period: "FY 2024", dueDate: "Mar 31, 2025", submittedDate: "Mar 30, 2025", status: "Submitted", compliance: "On Time" },
  { id: "DR-2025-003", donor: "EU", project: "Digital Skills for Youth", reportType: "Mid-Term Evaluation", period: "H1 2025", dueDate: "Jul 15, 2025", submittedDate: "-", status: "In Draft", compliance: "Pending" },
  { id: "DR-2025-004", donor: "USAID", project: "Health Systems Strengthening", reportType: "Quarterly Narrative", period: "Q1 2025", dueDate: "Apr 30, 2025", submittedDate: "May 02, 2025", status: "Submitted", compliance: "Late" },
  { id: "DR-2025-005", donor: "DFID", project: "Women's Economic Empowerment", reportType: "Quarterly Financial", period: "Q1 2025", dueDate: "Apr 20, 2025", submittedDate: "-", status: "Due Soon", compliance: "Pending" },
  { id: "DR-2025-006", donor: "JICA", project: "Agricultural Modernization", reportType: "Semi-Annual Progress", period: "H1 2025", dueDate: "Jul 31, 2025", submittedDate: "-", status: "In Draft", compliance: "Pending" },
  { id: "DR-2025-007", donor: "World Bank", project: "Urban Infrastructure Upgrade", reportType: "Quarterly Financial", period: "Q1 2025", dueDate: "Apr 15, 2025", submittedDate: "Apr 14, 2025", status: "Submitted", compliance: "On Time" },
  { id: "DR-2025-008", donor: "EU", project: "Governance & Rule of Law", reportType: "Annual Audit Report", period: "FY 2024", dueDate: "Mar 15, 2025", submittedDate: "-", status: "Overdue", compliance: "Overdue" },
  { id: "DR-2025-009", donor: "USAID", project: "Youth Employment Program", reportType: "Performance Indicator Report", period: "Q1 2025", dueDate: "Apr 30, 2025", submittedDate: "Apr 28, 2025", status: "Submitted", compliance: "On Time" },
  { id: "DR-2025-010", donor: "DFID", project: "Clean Water Access Program", reportType: "Quarterly Narrative", period: "Q1 2025", dueDate: "May 15, 2025", submittedDate: "-", status: "Due Soon", compliance: "Pending" },
];

const donors = ["All Donors", "USAID", "World Bank", "EU", "DFID", "JICA"];
const reportTypes = ["All Types", "Quarterly Financial", "Quarterly Narrative", "Annual Progress", "Semi-Annual Progress", "Mid-Term Evaluation", "Annual Audit Report", "Performance Indicator Report"];
const statuses = ["All Statuses", "Submitted", "Due Soon", "Overdue", "In Draft"];

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function DonorReports() {
  const [activeTab, setActiveTab] = useState<"all" | "submitted" | "due" | "overdue" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonor, setSelectedDonor] = useState("All Donors");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showDonorDD, setShowDonorDD] = useState(false);
  const [showTypeDD, setShowTypeDD] = useState(false);
  const [showStatusDD, setShowStatusDD] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof donorReportsTable[0] | null>(null);

  const tabs = [
    { key: "all" as const, label: "All Reports", count: donorReportsTable.length },
    { key: "submitted" as const, label: "Submitted", count: donorReportsTable.filter(r => r.status === "Submitted").length },
    { key: "due" as const, label: "Due Soon", count: donorReportsTable.filter(r => r.status === "Due Soon").length },
    { key: "overdue" as const, label: "Overdue", count: donorReportsTable.filter(r => r.status === "Overdue").length },
    { key: "draft" as const, label: "In Draft", count: donorReportsTable.filter(r => r.status === "In Draft").length },
  ];

  const filteredReports = donorReportsTable.filter(r => {
    if (activeTab === "submitted" && r.status !== "Submitted") return false;
    if (activeTab === "due" && r.status !== "Due Soon") return false;
    if (activeTab === "overdue" && r.status !== "Overdue") return false;
    if (activeTab === "draft" && r.status !== "In Draft") return false;
    if (selectedDonor !== "All Donors" && r.donor !== selectedDonor) return false;
    if (selectedType !== "All Types" && r.reportType !== selectedType) return false;
    if (selectedStatus !== "All Statuses" && r.status !== selectedStatus) return false;
    if (searchQuery && !r.project.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-emerald-100 text-emerald-700";
      case "Due Soon": return "bg-amber-100 text-amber-700";
      case "Overdue": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getComplianceStyle = (compliance: string) => {
    switch (compliance) {
      case "On Time": return "text-emerald-600";
      case "Late": return "text-red-600";
      case "Overdue": return "text-red-600";
      default: return "text-slate-500";
    }
  };

  // Detail slide-over
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
                <h1 className="text-[16px] font-semibold text-slate-900">{selectedReport.id}</h1>
                <p className="text-[11px] text-slate-400">{selectedReport.reportType} — {selectedReport.donor}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium", getStatusStyle(selectedReport.status))}>
                {selectedReport.status}
              </span>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium">
                <Printer size={13} /> Print
              </button>
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
                  { label: "Donor", value: selectedReport.donor },
                  { label: "Project", value: selectedReport.project },
                  { label: "Report Type", value: selectedReport.reportType },
                  { label: "Reporting Period", value: selectedReport.period },
                  { label: "Due Date", value: selectedReport.dueDate },
                  { label: "Submitted Date", value: selectedReport.submittedDate },
                  { label: "Compliance", value: selectedReport.compliance },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-[11px] text-slate-500">{row.label}</span>
                    <span className={cn("text-[11px] font-medium", row.label === "Compliance" ? getComplianceStyle(row.value) : "text-slate-800")}>{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center"><DollarSign size={13} className="text-emerald-600" /></div>
                <h2 className="text-[13px] font-semibold text-slate-800">Financial Summary</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Budget Allocated", value: "$2,500,000" },
                    { label: "Amount Spent", value: "$1,875,000" },
                    { label: "Burn Rate", value: "75.0%" },
                  ].map((c, i) => (
                    <div key={i} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-2">{c.label}</p>
                      <p className="text-[18px] text-slate-800 font-semibold">{c.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] hover:bg-[#0a01b8] text-white rounded-lg text-[12px] font-medium"><Send size={13} /> Submit to Donor</button>
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
          <h1 className="text-[20px] font-semibold text-slate-900">Donor Reports</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-[12px] text-slate-600 font-medium">
              <Download size={14} /> Export
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] text-[12px] font-medium">
              <FileText size={14} /> Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Reports", value: "40", sub: "This Fiscal Year", icon: <FileText size={14} className="text-[#0B01D0]" />, bg: "bg-[#0B01D0]/10" },
            { label: "Submitted On Time", value: "24", sub: "92% compliance", icon: <CheckCircle size={14} className="text-emerald-600" />, bg: "bg-emerald-50" },
            { label: "Due Within 30 Days", value: "8", sub: "Action needed", icon: <Clock size={14} className="text-amber-600" />, bg: "bg-amber-50" },
            { label: "Overdue", value: "3", sub: "Requires attention", icon: <AlertTriangle size={14} className="text-red-600" />, bg: "bg-red-50" },
            { label: "Active Donors", value: "5", sub: "$7M total funding", icon: <Users size={14} className="text-purple-600" />, bg: "bg-purple-50" },
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
          {/* Fund Utilization */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Fund Utilization by Donor</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={fundUtilizationData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="donor" type="category" width={65} tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => `$${(v / 1000000).toFixed(1)}M`} />
                <Bar dataKey="allocated" fill="#cbd5e1" name="Allocated" radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="spent" fill="#0B01D0" name="Spent" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Report Status */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Report Status Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={reportStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {reportStatusData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance Trend */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">Submission Compliance Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={complianceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => `${v}%`} />
                <Line type="monotone" dataKey="onTime" stroke="#10B981" strokeWidth={2} name="On Time %" dot={{ r: 3 }} />
              </LineChart>
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
            {/* Donor filter */}
            <div className="relative">
              <button onClick={() => { setShowDonorDD(!showDonorDD); setShowTypeDD(false); setShowStatusDD(false); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {selectedDonor} <ChevronDown size={12} />
              </button>
              {showDonorDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                  {donors.map(d => (
                    <button key={d} onClick={() => { setSelectedDonor(d); setShowDonorDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", selectedDonor === d && "bg-slate-50 font-medium text-[#0B01D0]")}>{d}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Type filter */}
            <div className="relative">
              <button onClick={() => { setShowTypeDD(!showTypeDD); setShowDonorDD(false); setShowStatusDD(false); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px] text-slate-600 font-medium hover:bg-slate-50">
                {selectedType} <ChevronDown size={12} />
              </button>
              {showTypeDD && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[180px]">
                  {reportTypes.map(t => (
                    <button key={t} onClick={() => { setSelectedType(t); setShowTypeDD(false); }} className={cn("block w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50", selectedType === t && "bg-slate-50 font-medium text-[#0B01D0]")}>{t}</button>
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
              {["Report ID", "Donor", "Project", "Report Type", "Period", "Due Date", "Submitted", "Status", "Compliance"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReports.map((r, i) => (
              <tr key={r.id} onClick={() => setSelectedReport(r)} className={cn("hover:bg-slate-50 cursor-pointer transition-colors", i % 2 === 1 && "bg-slate-50/50")}>
                <td className="px-4 py-3 text-[11px] text-[#0B01D0] font-medium">{r.id}</td>
                <td className="px-4 py-3 text-[11px] text-slate-800 font-medium">{r.donor}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600 max-w-[180px] truncate">{r.project}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.reportType}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.period}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.dueDate}</td>
                <td className="px-4 py-3 text-[11px] text-slate-600">{r.submittedDate}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium", getStatusStyle(r.status))}>{r.status}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-medium", getComplianceStyle(r.compliance))}>{r.compliance}</span>
                </td>
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
