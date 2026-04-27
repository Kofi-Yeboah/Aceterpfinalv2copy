import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

export function OtherDeductionsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const otherDeductions = [
    { id: "1", name: "Union Dues", description: "Monthly union membership fee", amount: 50, frequency: "Monthly", isPercentage: false, applicableTo: "All Employees" },
    { id: "2", name: "Medical Insurance", description: "Health insurance premium", amount: 150, frequency: "Monthly", isPercentage: false, applicableTo: "Full-Time Only" },
    { id: "3", name: "Staff Welfare", description: "Contribution to staff welfare fund", amount: 2, frequency: "Monthly", isPercentage: true, applicableTo: "All Employees" },
    { id: "4", name: "Loan Repayment - Bank", description: "Third-party bank loan deduction", amount: 200, frequency: "Monthly", isPercentage: false, applicableTo: "Specific Employees" },
    { id: "5", name: "Pension Top-up", description: "Additional voluntary pension contribution", amount: 3, frequency: "Monthly", isPercentage: true, applicableTo: "Opt-in" },
  ];

  const filteredDeductions = otherDeductions.filter((deduction) =>
    deduction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deduction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatAmount = (amount: number, isPercentage: boolean) => {
    if (isPercentage) return `${amount}%`;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "GHS", minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Other Deductions</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Add Deduction Type
        </button>
      </div>

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Deduction Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Frequency</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Applicable To</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeductions.map((deduction, index) => (
              <tr key={deduction.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{deduction.name}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{deduction.description}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-semibold text-red-600">
                    {formatAmount(deduction.amount, deduction.isPercentage)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{deduction.frequency}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] bg-blue-50 text-blue-600">
                    {deduction.applicableTo}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded transition-colors">
                      <Pencil size={16} className="text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Deduction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[15px] text-slate-900">Add Deduction Type</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <Plus size={16} className="text-slate-500 rotate-45" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500">Deduction Name</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g., Union Dues" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500">Description</label>
                <textarea className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none" rows={3} placeholder="Brief description of the deduction"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] text-slate-500">Amount/Rate</label>
                  <input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] text-slate-500">Type</label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500">
                    <option>Fixed Amount (GHS)</option>
                    <option>Percentage (%)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500">Frequency</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500">
                  <option>Monthly</option>
                  <option>Bi-Weekly</option>
                  <option>One-Time</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500">Applicable To</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500">
                  <option>All Employees</option>
                  <option>Full-Time Only</option>
                  <option>Part-Time Only</option>
                  <option>Specific Employees</option>
                  <option>Opt-in</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                Add Deduction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
