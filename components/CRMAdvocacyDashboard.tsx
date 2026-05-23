import { useState } from "react";
import { ChevronDown, Download, Upload } from "lucide-react";
import { cn } from "../lib/utils";
import { DashboardConfigPanel, useDashboardConfig } from "./DashboardConfigPanel";

// Mock data for the dashboard
const GRANT_DATA = [
  { name: "Grant A", spent: 75.0, budget: 100000 },
  { name: "Grant B", spent: 80.0, budget: 120000 },
  { name: "Grant C", spent: 66.7, budget: 95000 },
  { name: "Grant D", spent: 66.7, budget: 110000 },
  { name: "Grant E", spent: 86.4, budget: 135000 }
];

const CASH_FLOW_DATA = [
  { month: "Jan", amount: 2800000 },
  { month: "Feb", amount: 2500000 },
  { month: "Mar", amount: 2400000 },
  { month: "Apr", amount: 2800000 },
  { month: "May", amount: 2550000 },
  { month: "Jun", amount: 2100000 },
  { month: "Jul", amount: 1900000 },
  { month: "Aug", amount: 2300000 },
  { month: "Sep", amount: 2700000 },
  { month: "Oct", amount: 3100000 },
  { month: "Nov", amount: 3400000 },
  { month: "Dec", amount: 3800000 }
];

const GENDER_DISTRIBUTION = [
  { label: "Female", value: 163, color: "#E900AB" },
  { label: "Male", value: 102, color: "#0346FF" }
];

const DONOR_SEGMENTATION = [
  { label: "Government", value: 190, color: "#FFC803" },
  { label: "Foundations", value: 200, color: "#1DAB4B" },
  { label: "Bilateral", value: 190, color: "#075985" },
  { label: "Private Sector", value: 750, color: "#6B21A8" },
  { label: "Multilateral", value: 202, color: "#00B3DB" }
];

const FILTER_OPTIONS = {
  timeRange: ["All Time", "Last 7 Days", "Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year"],
  status: ["All Status", "Active", "Pending", "Completed", "Expired"],
  category: ["All Categories", "Government", "Foundations", "Bilateral", "Private Sector", "Multilateral"]
};

const CRM_SECTIONS = [
  { id: "filters", label: "Filter Controls" },
  { id: "stats", label: "Statistics Cards" },
  { id: "gender", label: "Gender Distribution" },
  { id: "segmentation", label: "Donor Segmentation" },
  { id: "grant", label: "Grant Utilization" },
  { id: "cashflow", label: "Cash Flow" },
];

export function CRMAdvocacyDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 6 Months");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(CRM_SECTIONS);

  // Calculate total and percentage for donut charts
  const totalGender = GENDER_DISTRIBUTION.reduce((sum, item) => sum + item.value, 0);
  const totalSegmentation = DONOR_SEGMENTATION.reduce((sum, item) => sum + item.value, 0);

  // Calculate cash flow max for scaling
  const maxCashFlow = Math.max(...CASH_FLOW_DATA.map(d => d.amount));

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">CRM Dashboard</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
            <span className="text-sm text-slate-900">Export</span>
            <Download size={16} className="text-slate-600" />
          </button>
          <DashboardConfigPanel sections={CRM_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
        </div>
      </div>

      {/* Filters Bar */}
      {isVisible("filters") && (
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTimeDropdown(!showTimeDropdown);
                setShowStatusDropdown(false);
                setShowCategoryDropdown(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span className="text-sm text-slate-900">{selectedTimeRange}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            {showTimeDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTimeDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {FILTER_OPTIONS.timeRange.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedTimeRange(option);
                        setShowTimeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                        selectedTimeRange === option ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowTimeDropdown(false);
                setShowCategoryDropdown(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span className="text-sm text-slate-900">{selectedStatus}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            {showStatusDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {FILTER_OPTIONS.status.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedStatus(option);
                        setShowStatusDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                        selectedStatus === option ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowTimeDropdown(false);
                setShowStatusDropdown(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span className="text-sm text-slate-900">{selectedCategory}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            {showCategoryDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {FILTER_OPTIONS.category.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedCategory(option);
                        setShowCategoryDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                        selectedCategory === option ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-5">
          {/* Statistics Cards */}
          {isVisible("stats") && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex gap-6 divide-x divide-slate-200">
                {/* Total Number of Grants */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 19 19">
                        <path d="M9.5 2.5v14M2.5 9.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600">Total Number of Grants</p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">20</p>
                </div>

                {/* Active Grants */}
                <div className="flex-1 flex flex-col gap-4 pl-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                      <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 19 19">
                        <rect x="3" y="5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M7 8h5M7 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600">Active Grants</p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">12</p>
                </div>

                {/* Total Number of Donors */}
                <div className="flex-1 flex flex-col gap-4 pl-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 19 19">
                        <path d="M9.5 2.5v14M2.5 9.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600">Total Number of Donors</p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">47</p>
                </div>
              </div>
            </div>
          )}

          {/* Donut Charts Row */}
          <div className="grid grid-cols-2 gap-5">
            {/* Donor Gender Distribution */}
            {isVisible("gender") && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-base font-semibold text-[#030047] mb-4 pb-4 border-b border-slate-200">
                  Donor Gender Distribution
                </h2>
                <div className="flex items-center justify-center gap-14 py-4">
                  {/* Donut Chart */}
                  <div className="relative w-[270px] h-[270px] rounded-full bg-slate-100 flex items-center justify-center">
                    <div className="absolute inset-8 rounded-full" style={{
                      background: 'conic-gradient(from 0deg, #E900AB 0deg 221deg, #0346FF 221deg 360deg)'
                    }} />
                    <div className="absolute inset-16 rounded-full bg-white" />
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-12">
                    {GENDER_DISTRIBUTION.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-1 h-12 rounded" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="text-[15px] text-slate-600 mb-2">{item.label}</p>
                          <p className="text-[19px] font-bold text-slate-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Donor Segmentation */}
            {isVisible("segmentation") && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-base font-semibold text-[#030047] mb-4 pb-4 border-b border-slate-200">
                  Donor Segmentation
                </h2>
                <div className="flex items-center justify-center gap-14 py-4">
                  {/* Donut Chart */}
                  <div className="relative w-[270px] h-[270px] rounded-full bg-slate-100 flex items-center justify-center">
                    <div className="absolute inset-8 rounded-full" style={{
                      background: 'conic-gradient(from 0deg, #FFC803 0deg 51deg, #1DAB4B 51deg 102deg, #075985 102deg 153deg, #6B21A8 153deg 309deg, #00B3DB 309deg 360deg)'
                    }} />
                    <div className="absolute inset-16 rounded-full bg-white" />
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col justify-between h-full py-2">
                    {DONOR_SEGMENTATION.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-1 h-10 rounded" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="text-[15px] text-slate-600">{item.label}</p>
                          <p className="text-[19px] font-bold text-slate-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grant Utilization */}
          {isVisible("grant") && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-[#030047] mb-4 pb-4 border-b border-slate-200">
                Grant Utilization: % Spent vs. Budget for Active Grants
              </h2>
              <div className="space-y-6 py-4 px-5">
                {GRANT_DATA.map((grant) => (
                  <div key={grant.name} className="flex items-center gap-3">
                    <p className="text-base font-medium text-slate-600 w-20">{grant.name}</p>
                    <div className="flex-1 h-9 bg-slate-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-[#0B01D0] rounded-md transition-all"
                        style={{ width: `${grant.spent}%` }}
                      />
                    </div>
                    <p className="text-base font-medium text-slate-800 w-20 text-right">{grant.spent}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cash Flow */}
          {isVisible("cashflow") && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-[#030047] mb-4 pb-4 border-b border-slate-200">
                Cash Flow
              </h2>
              <div className="py-4 px-5">
                <div className="flex gap-6">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between h-56 text-sm font-medium text-slate-600">
                    <span>GHS 4,000,000</span>
                    <span>GHS 3,000,000</span>
                    <span>GHS 2,000,000</span>
                    <span>GHS 1,000,000</span>
                    <span>GHS 0</span>
                  </div>

                  {/* Chart */}
                  <div className="flex-1 flex flex-col gap-2.5">
                    <div className="flex items-end gap-4 h-56">
                      {CASH_FLOW_DATA.map((data) => (
                        <div 
                          key={data.month} 
                          className="relative flex-1 flex items-end justify-center group cursor-pointer"
                          onMouseEnter={() => setHoveredMonth(data.month)}
                          onMouseLeave={() => setHoveredMonth(null)}
                        >
                          <div
                            className={cn(
                              "w-full bg-[#0B01D0] rounded-md transition-all",
                              hoveredMonth === data.month && "bg-[#0D02FF]"
                            )}
                            style={{ height: `${(data.amount / maxCashFlow) * 100}%` }}
                          />
                          {/* Tooltip */}
                          {hoveredMonth === data.month && (
                            <div className="absolute bottom-full mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                              <div className="font-semibold">{data.month}</div>
                              <div>GHS {data.amount.toLocaleString()}</div>
                              <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-px">
                                <div className="border-4 border-transparent border-t-slate-900" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {CASH_FLOW_DATA.map((data) => (
                        <div key={data.month} className="flex-1 text-center">
                          <p className="text-[15px] font-medium text-slate-600">{data.month}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}