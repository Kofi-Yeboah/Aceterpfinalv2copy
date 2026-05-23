import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar } from "lucide-react";

interface Budget {
  id: number;
  department: string;
  category: string;
  budgetYear: string;
  allocated: string;
  spent: string;
  remaining: string;
  percentage: number;
  status: "On Track" | "Over Budget" | "Under Budget";
}

const budgetData: Budget[] = [
  { id: 1, department: "HR", category: "Salaries & Wages", budgetYear: "2024", allocated: "$1,200,000", spent: "$995,000", remaining: "$205,000", percentage: 83, status: "On Track" },
  { id: 2, department: "IT", category: "Software & Licenses", budgetYear: "2024", allocated: "$150,000", spent: "$125,000", remaining: "$25,000", percentage: 83, status: "On Track" },
  { id: 3, department: "Operations", category: "Rent & Utilities", budgetYear: "2024", allocated: "$220,000", spent: "$203,500", remaining: "$16,500", percentage: 93, status: "On Track" },
  { id: 4, department: "Marketing", category: "Campaigns", budgetYear: "2024", allocated: "$180,000", spent: "$195,000", remaining: "-$15,000", percentage: 108, status: "Over Budget" },
  { id: 5, department: "Finance", category: "Professional Services", budgetYear: "2024", allocated: "$95,000", spent: "$62,000", remaining: "$33,000", percentage: 65, status: "Under Budget" },
  { id: 6, department: "HR", category: "Training & Development", budgetYear: "2024", allocated: "$75,000", spent: "$48,500", remaining: "$26,500", percentage: 65, status: "Under Budget" },
  { id: 7, department: "Operations", category: "Travel & Transport", budgetYear: "2024", allocated: "$125,000", spent: "$118,750", remaining: "$6,250", percentage: 95, status: "On Track" },
  { id: 8, department: "IT", category: "Hardware & Equipment", budgetYear: "2024", allocated: "$200,000", spent: "$215,000", remaining: "-$15,000", percentage: 108, status: "Over Budget" },
];

export function Budgeting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-50 text-green-700";
      case "Over Budget": return "bg-red-50 text-red-700";
      case "Under Budget": return "bg-blue-50 text-blue-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Budgeting</h1>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by department, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedDepartment}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedCategory}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[120px] justify-between">
              <Calendar className="w-4 h-4" />
              <span>{selectedYear}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between">
              <span>{selectedStatus}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: "#0B01D0" }}
            >
              <Plus className="w-4 h-4" />
              New Budget
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Category</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Year</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Allocated</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Spent</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Remaining</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Utilization</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {budgetData.map((budget) => (
              <tr key={budget.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{budget.department}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-600">{budget.category}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] text-slate-600">{budget.budgetYear}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] font-medium text-slate-900">{budget.allocated}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="text-[12px] text-slate-900">{budget.spent}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className={`text-[12px] font-medium ${budget.remaining.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                    {budget.remaining}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${budget.percentage > 100 ? 'bg-red-600' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-slate-600">{budget.percentage}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(budget.status)}`}>
                    {budget.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}