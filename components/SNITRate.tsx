import { useState } from "react";
import { Save } from "lucide-react";

export function SNITRate() {
  const [employeeRate, setEmployeeRate] = useState("5.5");
  const [employerRate, setEmployerRate] = useState("13.0");
  const [effectiveDate, setEffectiveDate] = useState("2024-01-01");

  const totalContribution = parseFloat(employeeRate) + parseFloat(employerRate);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">SNIT (Social Security) Rate</h1>
        <p className="text-sm text-slate-500 mt-1">Configure Social Security contribution rates</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Current Rates Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Current SNIT Rates</h2>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Employee Contribution</p>
                <p className="text-2xl font-bold text-blue-600">{employeeRate}%</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Employer Contribution</p>
                <p className="text-2xl font-bold text-purple-600">{employerRate}%</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Total Contribution</p>
                <p className="text-2xl font-bold text-green-600">{totalContribution.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Edit Rates Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Update SNIT Rates</h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500 font-medium">Employee Contribution Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={employeeRate}
                  onChange={(e) => setEmployeeRate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="5.5"
                />
                <p className="text-xs text-slate-400">Percentage deducted from employee's gross salary</p>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] text-slate-500 font-medium">Employer Contribution Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={employerRate}
                  onChange={(e) => setEmployerRate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="13.0"
                />
                <p className="text-xs text-slate-400">Percentage contributed by employer</p>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] text-slate-500 font-medium">Effective Date</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-slate-400">Date when this rate becomes active</p>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button className="flex-1 px-4 py-3 bg-[#0B01D0] text-white rounded-lg font-semibold hover:bg-[#0901a8] transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Save size={16} />
                  Save Changes
                </button>
                <button className="px-6 py-3 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Information Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Information</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• SNIT is mandatory for all employees under the Social Security scheme</li>
              <li>• Employee contribution is deducted from gross salary</li>
              <li>• Employer contribution is additional to employee's salary</li>
              <li>• Changes take effect from the specified effective date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
