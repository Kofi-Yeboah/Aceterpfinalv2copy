import { useState } from "react";
import { Download, ChevronDown, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const comparisonData = [
  { month: "Jan", budget: 450000, actual: 442000 },
  { month: "Feb", budget: 448000, actual: 465000 },
  { month: "Mar", budget: 460000, actual: 455000 },
  { month: "Apr", budget: 462000, actual: 475000 },
  { month: "May", budget: 470000, actual: 468000 },
  { month: "Jun", budget: 472000, actual: 480000 },
];

interface BudgetVsActual {
  id: number;
  category: string;
  department: string;
  budget: string;
  actual: string;
  variance: string;
  variancePercent: number;
  status: "Over" | "Under" | "On Track";
}

const comparisonTableData: BudgetVsActual[] = [
  { id: 1, category: "Salaries & Wages", department: "All Departments", budget: "$1,200,000", actual: "$995,000", variance: "$205,000", variancePercent: 17, status: "Under" },
  { id: 2, category: "Software & Licenses", department: "IT", budget: "$150,000", actual: "$125,000", variance: "$25,000", variancePercent: 17, status: "Under" },
  { id: 3, category: "Rent & Utilities", department: "Operations", budget: "$220,000", actual: "$203,500", variance: "$16,500", variancePercent: 8, status: "Under" },
  { id: 4, category: "Marketing Campaigns", department: "Marketing", budget: "$180,000", actual: "$195,000", variance: "-$15,000", variancePercent: -8, status: "Over" },
  { id: 5, category: "Professional Services", department: "Finance", budget: "$95,000", actual: "$62,000", variance: "$33,000", variancePercent: 35, status: "Under" },
  { id: 6, category: "Training & Development", department: "HR", budget: "$75,000", actual: "$73,500", variance: "$1,500", variancePercent: 2, status: "On Track" },
  { id: 7, category: "Travel & Transport", department: "Operations", budget: "$125,000", actual: "$118,750", variance: "$6,250", variancePercent: 5, status: "On Track" },
  { id: 8, category: "Hardware & Equipment", department: "IT", budget: "$200,000", actual: "$215,000", variance: "-$15,000", variancePercent: -8, status: "Over" },
];

export function BudgetVsActual() {
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedView, setSelectedView] = useState("Monthly");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under": return "bg-blue-50 text-blue-700";
      case "Over": return "bg-red-50 text-red-700";
      case "On Track": return "bg-green-50 text-green-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Budget vs Actual</h1>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[180px] justify-between">
              <span>{selectedDepartment}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Period Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[140px] justify-between">
              <Calendar className="w-4 h-4" />
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* View Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[140px] justify-between">
              <span>{selectedView}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs text-slate-600 mb-1">Total Budget</p>
              <p className="font-semibold text-slate-900" style={{ fontSize: "20px" }}>$2,245,000</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs text-slate-600 mb-1">Total Actual</p>
              <p className="font-semibold text-slate-900" style={{ fontSize: "20px" }}>$1,987,750</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs text-slate-600 mb-1">Total Variance</p>
              <p className="font-semibold text-green-600" style={{ fontSize: "20px" }}>$257,250</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs text-slate-600 mb-1">Variance %</p>
              <p className="font-semibold text-green-600" style={{ fontSize: "20px" }}>11.5%</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Budget vs Actual Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: "12px" }} />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip />
                <Legend />
                <Bar key="bar-budget" dataKey="budget" fill="#0B01D0" name="Budget" />
                <Bar key="bar-actual" dataKey="actual" fill="#60A5FA" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#0B01D0" }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Category</th>
                    <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Budget</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Actual</th>
                    <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Variance</th>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Variance %</th>
                    <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTableData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="text-[12px] font-medium text-slate-900">{item.category}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-600">{item.department}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-[12px] font-medium text-slate-900">{item.budget}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-[12px] font-medium text-slate-900">{item.actual}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className={`text-[12px] font-medium ${item.variance.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                          {item.variance}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <p className={`text-[12px] font-medium ${item.variancePercent < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {item.variancePercent > 0 ? '+' : ''}{item.variancePercent}%
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}