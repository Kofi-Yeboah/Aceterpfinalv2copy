import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronDown, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { cn } from "../lib/utils";
import { DashboardConfigPanel, useDashboardConfig } from "./DashboardConfigPanel";

// Data for charts
const projectStatusData = [
  { name: "On Track", value: 12, color: "#10b981" },
  { name: "At Risk", value: 5, color: "#f59e0b" },
  { name: "Delayed", value: 3, color: "#ef4444" },
  { name: "Completed", value: 8, color: "#3b82f6" }
];

const budgetUtilizationData = [
  { project: "West Africa Study", allocated: 250000, spent: 180000, percentage: 72 },
  { project: "Digital Economy", allocated: 180000, spent: 165000, percentage: 92 },
  { project: "Climate Finance", allocated: 300000, spent: 210000, percentage: 70 },
  { project: "Urban Dev Strategy", allocated: 220000, spent: 198000, percentage: 90 },
  { project: "Health Systems", allocated: 150000, spent: 120000, percentage: 80 }
];

const monthlyProgressData = [
  { month: "Jul", planned: 15, actual: 14 },
  { month: "Aug", planned: 20, actual: 18 },
  { month: "Sep", planned: 25, actual: 26 },
  { month: "Oct", planned: 30, actual: 28 },
  { month: "Nov", planned: 35, actual: 33 },
  { month: "Dec", planned: 40, actual: 38 }
];

const resourceAllocationData = [
  { category: "Staff Time", allocated: 85, color: "#3b82f6" },
  { category: "Equipment", allocated: 60, color: "#8b5cf6" },
  { category: "Consultants", allocated: 45, color: "#ec4899" },
  { category: "Travel", allocated: 30, color: "#f59e0b" },
  { category: "Materials", allocated: 50, color: "#10b981" }
];

const projectPhaseData = [
  { phase: "Procurement", projects: 3 },
  { phase: "Implementation", projects: 8 },
  { phase: "Quality Assurance", projects: 5 },
  { phase: "Production", projects: 4 },
  { phase: "Dissemination", projects: 2 },
  { phase: "Reporting", projects: 4 },
  { phase: "Checkpoint", projects: 2 },
];

const PM_DASHBOARD_SECTIONS = [
  { id: "metrics", label: "Key Metrics Cards" },
  { id: "statusOverview", label: "Project Status Overview" },
  { id: "monthlyProgress", label: "Monthly Progress" },
  { id: "budgetUtil", label: "Budget Utilization by Project" },
  { id: "projectPhase", label: "Projects by Phase" },
];

export function ProjectManagementDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(PM_DASHBOARD_SECTIONS);

  const periods = ["Last 6 Months", "Last 12 Months", "This Year", "Custom"];

  // Calculate totals
  const totalProjects = projectStatusData.reduce((sum, item) => sum + item.value, 0);
  const totalBudget = budgetUtilizationData.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = budgetUtilizationData.reduce((sum, item) => sum + item.spent, 0);
  const avgUtilization = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Project Management Dashboard</h1>
          
          <div className="flex items-center gap-3">
            {/* Period Filter */}
            <div className="relative">
              <button
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[160px]"
              >
                <span className="text-sm text-slate-900">{selectedPeriod}</span>
                <ChevronDown size={16} className="text-slate-600" />
              </button>
              {showPeriodDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period);
                          setShowPeriodDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                          selectedPeriod === period ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <DashboardConfigPanel sections={PM_DASHBOARD_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-white">
        {/* Key Metrics Cards */}
        {isVisible("metrics") && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={20} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">+8%</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900 mb-1">{totalProjects}</p>
            <p className="text-sm text-slate-600">Active Projects</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">+5%</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900 mb-1">${(totalBudget / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-slate-600">Total Budget</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
              <div className="flex items-center gap-1 text-amber-600">
                <TrendingDown size={14} />
                <span className="text-xs font-medium">-2%</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900 mb-1">{avgUtilization}%</p>
            <p className="text-sm text-slate-600">Avg Budget Utilization</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">+3</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900 mb-1">{projectStatusData.find(p => p.name === "At Risk")?.value || 0}</p>
            <p className="text-sm text-slate-600">Projects At Risk</p>
          </div>
        </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Project Status Overview */}
          {isVisible("statusOverview") && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-6">PROJECT STATUS OVERVIEW</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  key="pie-status"
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="pie-tooltip" />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {projectStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Monthly Progress */}
          {isVisible("monthlyProgress") && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-6">MONTHLY PROGRESS: PLANNED VS ACTUAL</h2>
            <p className="text-sm text-[rgb(255,255,255)] mb-4">Tracking planned vs. actual project milestones achieved each month</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProgressData}>
                <CartesianGrid key="line-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  key="line-xaxis"
                  dataKey="month" 
                  stroke="#64748b" 
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Month', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#64748b' } }}
                />
                <YAxis 
                  key="line-yaxis"
                  stroke="#64748b" 
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Milestones Completed', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }}
                />
                <Tooltip 
                  key="line-tooltip"
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value} milestones`, '']}
                />
                <Legend key="line-legend" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line key="line-planned" type="monotone" dataKey="planned" stroke="#94a3b8" strokeWidth={2} name="Planned Milestones" dot={{ fill: '#94a3b8', r: 4 }} />
                <Line key="line-actual" type="monotone" dataKey="actual" stroke="#0B01D0" strokeWidth={2} name="Actual Milestones" dot={{ fill: '#0B01D0', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          )}
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Budget Utilization by Project */}
          {isVisible("budgetUtil") && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-6">BUDGET UTILIZATION BY PROJECT</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetUtilizationData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid key="bar1-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis key="bar1-xaxis" type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis key="bar1-yaxis" dataKey="project" type="category" width={150} stroke="#64748b" style={{ fontSize: '11px' }} />
                <Tooltip 
                  key="bar1-tooltip"
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                  formatter={(value) => `$${(value as number).toLocaleString()}`}
                />
                <Legend key="bar1-legend" wrapperStyle={{ fontSize: '12px' }} />
                <Bar key="bar1-allocated" dataKey="allocated" fill="#94a3b8" name="Allocated" radius={[0, 4, 4, 0]} />
                <Bar key="bar1-spent" dataKey="spent" fill="#0B01D0" name="Spent" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}

          {/* Projects by Phase */}
          {isVisible("projectPhase") && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-6">PROJECTS BY PHASE</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectPhaseData}>
                <CartesianGrid key="bar2-grid" strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis key="bar2-xaxis" dataKey="phase" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis key="bar2-yaxis" stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  key="bar2-tooltip"
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar key="bar2-projects" dataKey="projects" fill="#0B01D0" name="Number of Projects" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}
        </div>

        {/* Resource Allocation */}

      </div>
    </div>
  );
}