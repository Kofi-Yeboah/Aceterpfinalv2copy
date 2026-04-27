import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

export function TaxTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const taxBrackets = [
    { id: "1", minIncome: 0, maxIncome: 4380, rate: 0, description: "Tax-free bracket" },
    { id: "2", minIncome: 4381, maxIncome: 6000, rate: 5, description: "First taxable bracket" },
    { id: "3", minIncome: 6001, maxIncome: 8500, rate: 10, description: "Second taxable bracket" },
    { id: "4", minIncome: 8501, maxIncome: 50000, rate: 17.5, description: "Third taxable bracket" },
    { id: "5", minIncome: 50001, maxIncome: 999999999, rate: 25, description: "Highest taxable bracket" },
  ];

  const filteredTaxBrackets = taxBrackets.filter((bracket) =>
    bracket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "GHS", minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Tax Table</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Add Tax Bracket
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Min Income</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Max Income</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Tax Rate (%)</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTaxBrackets.map((bracket, index) => (
              <tr key={bracket.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{formatCurrency(bracket.minIncome)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">
                    {bracket.maxIncome === 999999999 ? "Above" : formatCurrency(bracket.maxIncome)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-semibold text-blue-600">{bracket.rate}%</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{bracket.description}</p>
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

      {/* Add Tax Bracket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[15px] text-slate-900">Add Tax Bracket</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <Plus size={16} className="text-slate-500 rotate-45" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500">Min Income (GHS)</label>
                <input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500">Max Income (GHS)</label>
                <input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="4380" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500">Tax Rate (%)</label>
                <input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="5" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500">Description</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter description" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                Add Tax Bracket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
