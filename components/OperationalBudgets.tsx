import { useState } from "react";
import { Search, Download, ChevronDown, Plus, Calendar, X } from "lucide-react";

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

const initialBudgetData: Budget[] = [
  { id: 1, department: "HR", category: "Salaries & Wages", budgetYear: "2024", allocated: "$1,200,000", spent: "$995,000", remaining: "$205,000", percentage: 83, status: "On Track" },
  { id: 2, department: "IT", category: "Software & Licenses", budgetYear: "2024", allocated: "$150,000", spent: "$125,000", remaining: "$25,000", percentage: 83, status: "On Track" },
  { id: 3, department: "Operations", category: "Rent & Utilities", budgetYear: "2024", allocated: "$220,000", spent: "$203,500", remaining: "$16,500", percentage: 93, status: "On Track" },
  { id: 4, department: "Marketing", category: "Campaigns", budgetYear: "2024", allocated: "$180,000", spent: "$195,000", remaining: "-$15,000", percentage: 108, status: "Over Budget" },
  { id: 5, department: "Finance", category: "Professional Services", budgetYear: "2024", allocated: "$95,000", spent: "$62,000", remaining: "$33,000", percentage: 65, status: "Under Budget" },
  { id: 6, department: "HR", category: "Training & Development", budgetYear: "2024", allocated: "$75,000", spent: "$48,500", remaining: "$26,500", percentage: 65, status: "Under Budget" },
  { id: 7, department: "Operations", category: "Travel & Transport", budgetYear: "2024", allocated: "$125,000", spent: "$118,750", remaining: "$6,250", percentage: 95, status: "On Track" },
  { id: 8, department: "IT", category: "Hardware & Equipment", budgetYear: "2024", allocated: "$200,000", spent: "$215,000", remaining: "-$15,000", percentage: 108, status: "Over Budget" },
];

export function OperationalBudgets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [budgetData, setBudgetData] = useState<Budget[]>(initialBudgetData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    department: "HR",
    category: "",
    budgetYear: "2024",
    allocated: "",
  });

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
        <h1 className="text-2xl font-semibold text-slate-900">Operational Budgets</h1>
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
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Budget Line</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0B01D0] text-white">
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Department</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Category</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Budget Year</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Allocated</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Spent</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Remaining</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Usage %</th>
              <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-white">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {budgetData.map((budget, index) => (
              <tr 
                key={budget.id}
                className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                  index % 2 === 1 ? 'bg-slate-50/50' : ''
                }`}
              >
                <td className="px-6 py-4 text-[12px] text-slate-900">{budget.department}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{budget.category}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{budget.budgetYear}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900 font-medium">{budget.allocated}</td>
                <td className="px-6 py-4 text-[12px] text-slate-900">{budget.spent}</td>
                <td className={`px-6 py-4 text-[12px] font-medium ${
                  budget.remaining.startsWith('-') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {budget.remaining}
                </td>
                <td className="px-6 py-4 text-[12px] text-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[80px]">
                      <div 
                        className={`h-2 rounded-full ${
                          budget.percentage > 100 ? 'bg-red-500' : 
                          budget.percentage > 85 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="font-medium">{budget.percentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[12px]">
                  <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusColor(budget.status)}`}>
                    {budget.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Budget Line Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <div>
                <h3 className="text-[16px] text-slate-900">New Budget Line</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Add a new budget allocation</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Programs">Programs</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Salaries & Wages"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Budget Year</label>
                  <select
                    value={formData.budgetYear}
                    onChange={(e) => setFormData({ ...formData, budgetYear: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Allocated Amount</label>
                  <input
                    type="number"
                    value={formData.allocated}
                    onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                    placeholder="e.g. 100000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const allocatedNum = Number(formData.allocated);
                  const formatted = `$${allocatedNum.toLocaleString()}`;
                  const newEntry: Budget = {
                    id: Date.now(),
                    department: formData.department,
                    category: formData.category,
                    budgetYear: formData.budgetYear,
                    allocated: formatted,
                    spent: "$0",
                    remaining: formatted,
                    percentage: 0,
                    status: "Under Budget",
                  };
                  setBudgetData([newEntry, ...budgetData]);
                  setFormData({ department: "HR", category: "", budgetYear: "2024", allocated: "" });
                  setShowAddModal(false);
                }}
                className="px-5 py-2 rounded-lg text-[13px] text-white hover:bg-purple-800 transition-colors bg-purple-700"
              >
                Add Budget Line
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
