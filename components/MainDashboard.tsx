import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronDown, Users, TrendingUp, TrendingDown, Briefcase, DollarSign, LayoutDashboard } from "lucide-react";
import { cn } from "../lib/utils";
import { DashboardConfigPanel, useDashboardConfig } from "./DashboardConfigPanel";
import { ProjectManagementDashboard } from "./ProjectManagementDashboard";
import { HRManagementDashboard } from "../pages/HRManagementDashboard";
import { PayrollDashboard } from "./PayrollDashboard";
import { PayrollManagementDashboard } from "./PayrollManagementDashboard";
import { ProcurementDashboard } from "./ProcurementDashboard";
import { MELDashboard } from "./MELDashboard";
import { CRMAdvocacyDashboard } from "./CRMAdvocacyDashboard";
import { LegalContractsDashboard } from "../pages/LegalContractsDashboard";
import { KnowledgeHubDashboard } from "../pages/KnowledgeHubDashboard";

// Data for charts
const genderDistributionData = [
  { name: "Female", value: 163, color: "#E900AB" },
  { name: "Male", value: 102, color: "#0346FF" }
];

const donorSegmentationData = [
  { name: "Government", value: 190, color: "#FFC803" },
  { name: "Foundations", value: 200, color: "#1DAB4B" },
  { name: "Bilateral", value: 185, color: "#075985" },
  { name: "Private Sector", value: 750, color: "#6B21A8" },
  { name: "Multilateral", value: 202, color: "#00B3DB" }
];

const grantUtilizationData = [
  { grant: "Grant A", percentage: 75.0 },
  { grant: "Grant B", percentage: 80.0 },
  { grant: "Grant C", percentage: 66.7 },
  { grant: "Grant D", percentage: 67.2 },
  { grant: "Grant E", percentage: 86.4 }
];

const cashFlowData = [
  { month: "Jan", amount: 2500000 },
  { month: "Feb", amount: 2200000 },
  { month: "Mar", amount: 2100000 },
  { month: "Apr", amount: 2450000 },
  { month: "May", amount: 2300000 },
  { month: "Jun", amount: 1800000 },
  { month: "Jul", amount: 1600000 },
  { month: "Aug", amount: 1700000 },
  { month: "Sep", amount: 50000 },
  { month: "Oct", amount: 30000 },
  { month: "Nov", amount: 20000 },
  { month: "Dec", amount: 10000 }
];

const DASHBOARD_SECTIONS = [
  { id: "metrics", label: "Key Metrics Cards" },
  { id: "gender", label: "Gender Distribution" },
  { id: "donor", label: "Donor Segmentation" },
  { id: "grant", label: "Grant Utilization" },
  { id: "cashflow", label: "Cash Flow" },
];

const DASHBOARD_OPTIONS = [
  { id: "project-management", label: "Project Management" },
  { id: "hr-management", label: "HR Management" },
  { id: "finance", label: "Finance" },
  { id: "payroll-management", label: "Payroll Management" },
  { id: "procurement", label: "Procurement" },
  { id: "monitoring-evaluation", label: "Monitoring & Evaluation" },
  { id: "crm", label: "CRM" },
  { id: "legal-contracts", label: "Legal & Contracts" },
  { id: "knowledge-hub", label: "Knowledge Hub" },
  { id: "overview", label: "Overview" },
];

export function MainDashboard() {
  const [selectedDashboard, setSelectedDashboard] = useState("project-management");
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 12 Months");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(DASHBOARD_SECTIONS);

  const periods = ["Last 6 Months", "Last 12 Months", "This Year", "Custom"];

  const selectedDashboardLabel = DASHBOARD_OPTIONS.find(d => d.id === selectedDashboard)?.label ?? "Project Management";

  // If not overview, render the selected module dashboard directly
  if (selectedDashboard !== "overview") {
    const renderModuleDashboard = () => {
      switch (selectedDashboard) {
        case "project-management": return <ProjectManagementDashboard />;
        case "hr-management": return <HRManagementDashboard />;
        case "finance": return <PayrollDashboard />;
        case "payroll-management": return <PayrollManagementDashboard />;
        case "procurement": return <ProcurementDashboard />;
        case "monitoring-evaluation": return <MELDashboard />;
        case "crm": return <CRMAdvocacyDashboard />;
        case "legal-contracts": return <LegalContractsDashboard />;
        case "knowledge-hub": return <KnowledgeHubDashboard />;
        default: return <ProjectManagementDashboard />;
      }
    };

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        {/* Header with dashboard filter */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <span className="text-slate-300">|</span>
            <div className="relative">
              <button
                onClick={() => setShowDashboardDropdown(!showDashboardDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <LayoutDashboard size={14} className="text-[#0B01D0]" />
                <span className="text-[13px] text-slate-900 font-medium">{selectedDashboardLabel}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>
              {showDashboardDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDashboardDropdown(false)} />
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden py-1">
                    {DASHBOARD_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedDashboard(option.id);
                          setShowDashboardDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-[13px] hover:bg-slate-50 transition-colors flex items-center gap-2",
                          selectedDashboard === option.id ? "bg-blue-50 text-[#0B01D0] font-medium" : "text-slate-700"
                        )}
                      >
                        {selectedDashboard === option.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0B01D0]" />
                        )}
                        <span className={selectedDashboard === option.id ? "" : "ml-[14px]"}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Render the selected module dashboard */}
        <div className="flex-1 overflow-auto">
          {renderModuleDashboard()}
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalEmployees = genderDistributionData.reduce((sum, item) => sum + item.value, 0);
  const totalDonors = donorSegmentationData.reduce((sum, item) => sum + item.value, 0);
  const avgGrantUtilization = Math.round(
    grantUtilizationData.reduce((sum, item) => sum + item.percentage, 0) / grantUtilizationData.length
  );
  const totalCashFlow = cashFlowData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <span className="text-slate-300">|</span>
          <div className="relative">
            <button
              onClick={() => setShowDashboardDropdown(!showDashboardDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              <LayoutDashboard size={14} className="text-[#0B01D0]" />
              <span className="text-[13px] text-slate-900 font-medium">{selectedDashboardLabel}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            {showDashboardDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDashboardDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden py-1">
                  {DASHBOARD_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedDashboard(option.id);
                        setShowDashboardDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-[13px] hover:bg-slate-50 transition-colors flex items-center gap-2",
                        selectedDashboard === option.id ? "bg-blue-50 text-[#0B01D0] font-medium" : "text-slate-700"
                      )}
                    >
                      {selectedDashboard === option.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0B01D0]" />
                      )}
                      <span className={selectedDashboard === option.id ? "" : "ml-[14px]"}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
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
          <DashboardConfigPanel sections={DASHBOARD_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-[rgb(255,255,255)]">
        {/* Key Metrics Cards */}
        {isVisible("metrics") && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">+12%</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900 mb-1">GHS 2,000,000</p>
            <p className="text-sm text-slate-600">Total Number of Employees</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase size={20} className="text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-amber-600">
                <TrendingDown size={14} />
                <span className="text-xs font-medium">-3%</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900 mb-1">GHS 1,800,000</p>
            <p className="text-sm text-slate-600">Pending Evaluations</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-cyan-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">+8%</span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900 mb-1">GHS 200,000</p>
            <p className="text-sm text-slate-600">Active Projects</p>
          </div>
        </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Gender Distribution */}
          {isVisible("gender") && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-6">GENDER DISTRIBUTION</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart id="gender-pie-chart">
                <Pie
                  data={genderDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {genderDistributionData.map((entry, index) => (
                    <Cell key={`gender-cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {genderDistributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Donor Segmentation */}
          {isVisible("donor") && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-6">DONOR SEGMENTATION</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart id="donor-pie-chart">
                <Pie
                  data={donorSegmentationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {donorSegmentationData.map((entry, index) => (
                    <Cell key={`donor-cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {donorSegmentationData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Charts Row 2 */}
        {isVisible("grant") && (
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Grant Utilization */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-6">GRANT UTILIZATION: % SPENT VS. BUDGET FOR ACTIVE GRANTS</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart id="grant-bar-chart" data={grantUtilizationData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} domain={[0, 100]} />
                <YAxis dataKey="grant" type="category" width={80} stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="percentage" fill="#0B01D0" name="Utilization %" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}

        {/* Charts Row 3 */}
        {isVisible("cashflow") && (
        <div className="grid grid-cols-1 gap-6">
          {/* Cash Flow */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-6">CASH FLOW</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart id="cashflow-bar-chart" data={cashFlowData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month" 
                  stroke="#64748b" 
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#64748b" 
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `GHS ${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`GHS ${value.toLocaleString()}`, 'Cash Flow']}
                />
                <Bar dataKey="amount" fill="#0B01D0" name="Cash Flow" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}