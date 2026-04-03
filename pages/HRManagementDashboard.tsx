import { useState } from "react";
import {
  Users, Briefcase, Clock, UserCheck, UserMinus, TrendingUp, TrendingDown,
  CalendarDays, GraduationCap, AlertTriangle, DollarSign, Award, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ComposedChart, Area
} from "recharts";
import { DashboardConfigPanel, useDashboardConfig } from "../components/DashboardConfigPanel";

// ─── Data ──────────────────────────────────────────

const departmentData = [
  { name: "Engineering", value: 85, color: "#0B01D0" },
  { name: "Programs", value: 62, color: "#7C3AED" },
  { name: "Finance", value: 40, color: "#3B82F6" },
  { name: "Operations", value: 38, color: "#60A5FA" },
  { name: "Marketing", value: 30, color: "#93C5FD" },
  { name: "HR", value: 25, color: "#BFDBFE" },
  { name: "IT", value: 20, color: "#DBEAFE" },
];

const genderData = [
  { name: "Male", value: 165, color: "#0B01D0" },
  { name: "Female", value: 135, color: "#60A5FA" },
];

const employmentTypeData = [
  { name: "Full-Time", value: 240, color: "#7C3AED" },
  { name: "Contract", value: 35, color: "#A78BFA" },
  { name: "Part-Time", value: 15, color: "#C4B5FD" },
  { name: "Intern", value: 10, color: "#DDD6FE" },
];

const headcountTrend = [
  { month: "Sep", headcount: 268, hires: 8, exits: 3 },
  { month: "Oct", headcount: 272, hires: 7, exits: 3 },
  { month: "Nov", headcount: 278, hires: 10, exits: 4 },
  { month: "Dec", headcount: 280, hires: 5, exits: 3 },
  { month: "Jan", headcount: 288, hires: 12, exits: 4 },
  { month: "Feb", headcount: 295, hires: 10, exits: 3 },
  { month: "Mar", headcount: 300, hires: 8, exits: 3 },
];

const turnoverByDept = [
  { dept: "Engineering", rate: 5.2 },
  { dept: "Programs", rate: 8.1 },
  { dept: "Finance", rate: 3.5 },
  { dept: "Operations", rate: 6.8 },
  { dept: "Marketing", rate: 4.2 },
  { dept: "HR", rate: 2.0 },
  { dept: "IT", rate: 7.5 },
];

const leaveOverview = [
  { type: "Annual Leave", active: 12, pending: 5, color: "#3B82F6" },
  { type: "Sick Leave", active: 4, pending: 2, color: "#EF4444" },
  { type: "Maternity", active: 3, pending: 1, color: "#EC4899" },
  { type: "Study Leave", active: 2, pending: 0, color: "#8B5CF6" },
  { type: "Compassionate", active: 1, pending: 1, color: "#F59E0B" },
];

const recruitmentPipeline = [
  { stage: "Applied", count: 186, color: "#DBEAFE" },
  { stage: "Screened", count: 94, color: "#93C5FD" },
  { stage: "Interview", count: 40, color: "#3B82F6" },
  { stage: "Offered", count: 12, color: "#7C3AED" },
  { stage: "Hired", count: 8, color: "#0B01D0" },
];

const trainingData = [
  { month: "Oct", completed: 12, ongoing: 4 },
  { month: "Nov", completed: 18, ongoing: 6 },
  { month: "Dec", completed: 8, ongoing: 3 },
  { month: "Jan", completed: 22, ongoing: 8 },
  { month: "Feb", completed: 15, ongoing: 5 },
  { month: "Mar", completed: 10, ongoing: 7 },
];

const ageDistribution = [
  { range: "18-25", count: 28 },
  { range: "26-30", count: 65 },
  { range: "31-35", count: 82 },
  { range: "36-40", count: 58 },
  { range: "41-50", count: 45 },
  { range: "51+", count: 22 },
];

const tenureDistribution = [
  { range: "<1yr", count: 48 },
  { range: "1-2yr", count: 72 },
  { range: "3-5yr", count: 95 },
  { range: "5-10yr", count: 58 },
  { range: "10+yr", count: 27 },
];

const upcomingEvents = [
  { type: "Probation End", name: "Akua Mensah", date: "Mar 08", dept: "Finance" },
  { type: "Contract Expiry", name: "James Asante", date: "Mar 12", dept: "IT" },
  { type: "Work Anniversary", name: "Nana Ama", date: "Mar 15", dept: "Programs" },
  { type: "Birthday", name: "Kofi Boateng", date: "Mar 18", dept: "Operations" },
  { type: "Probation End", name: "Abena Serwah", date: "Mar 22", dept: "Marketing" },
  { type: "Contract Expiry", name: "Yaw Darko", date: "Mar 28", dept: "Engineering" },
];

const pendingApprovals = [
  { type: "Leave Request", count: 14, urgent: 3 },
  { type: "Expense Claim", count: 8, urgent: 2 },
  { type: "Loan Request", count: 4, urgent: 1 },
  { type: "Travel Request", count: 6, urgent: 0 },
  { type: "Manpower Request", count: 3, urgent: 1 },
];

const complianceAlerts = [
  { item: "Expired contracts", count: 3, severity: "high" as const },
  { item: "Missing documents", count: 7, severity: "medium" as const },
  { item: "Overdue training", count: 5, severity: "medium" as const },
  { item: "Pending evaluations", count: 12, severity: "low" as const },
];

const HR_DASHBOARD_SECTIONS = [
  { id: "kpi1", label: "Key Metrics (Row 1)" },
  { id: "kpi2", label: "Key Metrics (Row 2)" },
  { id: "headcount", label: "Headcount Trend & Hiring vs Exits" },
  { id: "recruitment", label: "Recruitment Pipeline" },
  { id: "deptDist", label: "Department Distribution" },
  { id: "genderDist", label: "Gender Distribution" },
  { id: "empType", label: "Employment Type" },
  { id: "turnover", label: "Turnover Rate by Department" },
  { id: "leave", label: "Leave Overview" },
  { id: "training", label: "Training & Development" },
  { id: "ageDist", label: "Age Distribution" },
  { id: "tenureDist", label: "Tenure Distribution" },
  { id: "approvals", label: "Pending HR Approvals" },
  { id: "events", label: "Upcoming Events & Milestones" },
  { id: "compliance", label: "Compliance & Alerts" },
];

// ─── Component ─────────────────────────────────────

export function HRManagementDashboard() {
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(HR_DASHBOARD_SECTIONS);
  const totalEmployees = 300;
  const openRoles = 12;
  const pendingInterviews = 40;
  const newHiresThisMonth = 8;
  const attritionRate = 5.4;
  const avgTenure = 3.8;
  const onLeaveToday = 21;
  const trainingCompletionRate = 78;
  const payrollCost = 485000;
  const avgSatisfaction = 4.2;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          {label && <p className="text-[11px] text-slate-500 mb-1">{label}</p>}
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-[12px] text-slate-900">
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
              {p.name}: {typeof p.value === "number" && p.value > 1000 ? `$${p.value.toLocaleString()}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          <p className="text-[12px] text-slate-900 font-medium">{payload[0].name}</p>
          <p className="text-[12px] text-slate-600">{payload[0].value} employees</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">HR Management Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-slate-400">Last updated: Mar 02, 2026</span>
            <DashboardConfigPanel sections={HR_DASHBOARD_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-5 space-y-5">

          {/* ═══ ROW 1: Key Metric Cards ═══ */}
          {isVisible("kpi1") && (
            <div className="grid grid-cols-5 gap-4">
              <MetricCard icon={<Users className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" label="Total Employees" value={totalEmployees} change="+3.2%" up />
              <MetricCard icon={<Briefcase className="w-5 h-5 text-purple-700" />} iconBg="bg-purple-50" label="Open Positions" value={openRoles} change="-2" up={false} />
              <MetricCard icon={<UserCheck className="w-5 h-5 text-emerald-600" />} iconBg="bg-emerald-50" label="New Hires (Mar)" value={newHiresThisMonth} change="+4" up />
              <MetricCard icon={<UserMinus className="w-5 h-5 text-red-500" />} iconBg="bg-red-50" label="Attrition Rate" value={`${attritionRate}%`} change="-0.8%" up />
              <MetricCard icon={<CalendarDays className="w-5 h-5 text-amber-600" />} iconBg="bg-amber-50" label="On Leave Today" value={onLeaveToday} />
            </div>
          )}

          {/* ═══ ROW 2: More stat cards ═══ */}
          {isVisible("kpi2") && (
            <div className="grid grid-cols-5 gap-4">
              <MetricCard icon={<Clock className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-50" label="Pending Interviews" value={pendingInterviews} />
              <MetricCard icon={<Award className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" label="Avg Tenure (yrs)" value={avgTenure} />
              <MetricCard icon={<GraduationCap className="w-5 h-5 text-indigo-600" />} iconBg="bg-indigo-50" label="Training Completion" value={`${trainingCompletionRate}%`} change="+5%" up />
              <MetricCard icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" label="Monthly Payroll" value={`$${(payrollCost / 1000).toFixed(0)}K`} />
              <MetricCard icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} iconBg="bg-emerald-50" label="Satisfaction Score" value={`${avgSatisfaction}/5`} change="+0.3" up />
            </div>
          )}

          {/* ═══ ROW 3: Headcount Trend + Recruitment Pipeline ═══ */}
          <div className="grid grid-cols-3 gap-5">
            {/* Headcount trend */}
            {isVisible("headcount") && (
              <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Headcount Trend & Hiring vs Exits</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={headcountTrend}>
                    <defs>
                      <linearGradient id="headcountGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0B01D0" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#0B01D0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={["dataMin - 10", "dataMax + 5"]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area key="area-headcount" type="monotone" dataKey="headcount" stroke="#0B01D0" strokeWidth={2} fill="url(#headcountGrad)" name="Headcount" />
                    <Bar key="bar-hires" dataKey="hires" fill="#22c55e" barSize={8} name="Hires" radius={[2, 2, 0, 0]} />
                    <Bar key="bar-exits" dataKey="exits" fill="#ef4444" barSize={8} name="Exits" radius={[2, 2, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recruitment pipeline */}
            {isVisible("recruitment") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Recruitment Pipeline</h2>
                <div className="space-y-3">
                  {recruitmentPipeline.map((s) => (
                    <div key={s.stage}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-slate-600">{s.stage}</span>
                        <span className="text-[12px] text-slate-900 font-medium">{s.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${(s.count / 186) * 100}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Conversion Rate</span>
                    <span className="text-emerald-600 font-medium">4.3%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-1">
                    <span className="text-slate-400">Avg Time to Hire</span>
                    <span className="text-slate-900 font-medium">32 days</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-1">
                    <span className="text-slate-400">Offer Acceptance Rate</span>
                    <span className="text-emerald-600 font-medium">85%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ═══ ROW 4: Dept Distribution + Gender + Employment Type ═══ */}
          <div className="grid grid-cols-3 gap-5">
            {/* Department Distribution */}
            {isVisible("deptDist") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Department Distribution</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" nameKey="name" paddingAngle={2}>
                      {departmentData.map((entry, index) => <Cell key={`dept-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {departmentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] text-slate-600 truncate">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gender Distribution */}
            {isVisible("genderDist") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Gender Distribution</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" nameKey="name" paddingAngle={2}>
                      {genderData.map((entry, index) => <Cell key={`gender-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 flex items-center justify-center gap-6">
                  {genderData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] text-slate-600">{item.name}: {item.value} ({Math.round((item.value / 300) * 100)}%)</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-400">Gender Pay Gap: </span>
                  <span className="text-[11px] text-emerald-600 font-medium">2.1% (Target &lt;5%)</span>
                </div>
              </div>
            )}

            {/* Employment Type */}
            {isVisible("empType") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Employment Type</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={employmentTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" nameKey="name" paddingAngle={2}>
                      {employmentTypeData.map((entry, index) => <Cell key={`emptype-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {employmentTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] text-slate-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══ ROW 5: Turnover by Dept + Leave Overview + Training ═══ */}
          <div className="grid grid-cols-3 gap-5">
            {/* Turnover by dept */}
            {isVisible("turnover") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Turnover Rate by Department</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={turnoverByDept} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                    <YAxis type="category" dataKey="dept" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar key="bar-turnover-rate" dataKey="rate" fill="#7C3AED" barSize={14} radius={[0, 4, 4, 0]} name="Turnover %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Leave Overview */}
            {isVisible("leave") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Leave Overview</h2>
                <div className="space-y-3">
                  {leaveOverview.map((l) => (
                    <div key={l.type} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                        <span className="text-[12px] text-slate-700">{l.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{l.active} active</span>
                        {l.pending > 0 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{l.pending} pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                    <p className="text-[16px] text-slate-900">87%</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Utilization</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                    <p className="text-[16px] text-slate-900">4.2 days</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Per Month</p>
                  </div>
                </div>
              </div>
            )}

            {/* Training Progress */}
            {isVisible("training") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Training & Development</h2>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar key="bar-training-completed" dataKey="completed" fill="#0B01D0" barSize={12} radius={[2, 2, 0, 0]} name="Completed" stackId="training" />
                    <Bar key="bar-training-ongoing" dataKey="ongoing" fill="#A78BFA" barSize={12} radius={[2, 2, 0, 0]} name="Ongoing" stackId="training" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[14px] text-slate-900">85</p>
                    <p className="text-[9px] text-slate-400 uppercase">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] text-slate-900">33</p>
                    <p className="text-[9px] text-slate-400 uppercase">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] text-emerald-600">78%</p>
                    <p className="text-[9px] text-slate-400 uppercase">Completion</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ═══ ROW 6: Age Distribution + Tenure + Pending Approvals ═══ */}
          <div className="grid grid-cols-3 gap-5">
            {/* Age Distribution */}
            {isVisible("ageDist") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Age Distribution</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar key="bar-age-count" dataKey="count" fill="#3B82F6" barSize={28} radius={[4, 4, 0, 0]} name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Avg Age: <span className="text-slate-900 font-medium">34.2 yrs</span></span>
                  <span>Median: <span className="text-slate-900 font-medium">33 yrs</span></span>
                </div>
              </div>
            )}

            {/* Tenure Distribution */}
            {isVisible("tenureDist") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Tenure Distribution</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={tenureDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar key="bar-tenure-count" dataKey="count" fill="#7C3AED" barSize={28} radius={[4, 4, 0, 0]} name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Avg Tenure: <span className="text-slate-900 font-medium">3.8 yrs</span></span>
                  <span>Retention: <span className="text-emerald-600 font-medium">94.6%</span></span>
                </div>
              </div>
            )}

            {/* Pending Approvals */}
            {isVisible("approvals") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Pending HR Approvals</h2>
                <div className="space-y-2.5">
                  {pendingApprovals.map((a) => (
                    <div key={a.type} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                      <span className="text-[12px] text-slate-700">{a.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-slate-900 font-medium">{a.count}</span>
                        {a.urgent > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">{a.urgent} urgent</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                  <p className="text-[20px] text-slate-900">{pendingApprovals.reduce((s, a) => s + a.count, 0)}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Pending</p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ ROW 7: Upcoming Events + Compliance Alerts ═══ */}
          <div className="grid grid-cols-2 gap-5">
            {/* Upcoming Events */}
            {isVisible("events") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Upcoming Events & Milestones</h2>
                <div className="space-y-0.5">
                  {upcomingEvents.map((e, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                          e.type === "Probation End" ? "bg-amber-50 text-amber-700" :
                          e.type === "Contract Expiry" ? "bg-red-50 text-red-600" :
                          e.type === "Work Anniversary" ? "bg-purple-50 text-purple-700" :
                          "bg-blue-50 text-blue-600"
                        }`}>{e.type}</span>
                        <span className="text-[12px] text-slate-900">{e.name}</span>
                        <span className="text-[11px] text-slate-400">{e.dept}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono shrink-0">{e.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance & Alerts */}
            {isVisible("compliance") && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-[13px] text-slate-900 mb-4 pb-3 border-b border-slate-100">Compliance & Alerts</h2>
                <div className="space-y-2.5">
                  {complianceAlerts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className={`w-4 h-4 shrink-0 ${
                          c.severity === "high" ? "text-red-500" : c.severity === "medium" ? "text-amber-500" : "text-blue-400"
                        }`} />
                        <span className="text-[12px] text-slate-700">{c.item}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[12px] font-medium ${
                          c.severity === "high" ? "text-red-600" : c.severity === "medium" ? "text-amber-600" : "text-blue-600"
                        }`}>{c.count}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                          c.severity === "high" ? "bg-red-50 text-red-600" : c.severity === "medium" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-500"
                        }`}>{c.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-[11px] text-red-700">
                    <span className="font-medium">Action Required:</span> 3 employee contracts expire within the next 30 days. Review and process renewals.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Metric Card ───────────────────────────────────
function MetricCard({ icon, iconBg, label, value, change, up }: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  change?: string;
  up?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`p-2 rounded-full ${iconBg}`}>{icon}</div>
        <p className="text-[11px] text-slate-500 leading-tight">{label}</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-[20px] text-slate-900">{value}</p>
        {change && (
          <span className={`flex items-center gap-0.5 text-[11px] font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default HRManagementDashboard;