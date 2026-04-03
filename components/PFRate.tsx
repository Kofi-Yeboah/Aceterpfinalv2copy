import { useState } from "react";
import { Save } from "lucide-react";

export function PFRate() {
  const [employeeRate, setEmployeeRate] = useState("5.0");
  const [employerRate, setEmployerRate] = useState("10.0");
  const [effectiveDate, setEffectiveDate] = useState("2024-01-01");
  const [isVoluntary, setIsVoluntary] = useState(true);

  const totalContribution = parseFloat(employeeRate) + parseFloat(employerRate);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Provident Fund (PF) Rate</h1>
        <p className="text-sm text-slate-500 mt-1">Configure Provident Fund contribution rates</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Current Rates Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Current PF Rates</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${isVoluntary ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                {isVoluntary ? "Voluntary" : "Mandatory"}
              </span>
            </div>
            
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
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Update PF Rates</h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[12px] text-slate-500 font-medium">Employee Contribution Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={employeeRate}
                  onChange={(e) => setEmployeeRate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="5.0"
                />
                <p className="text-xs text-slate-400">Percentage deducted from employee's basic salary</p>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] text-slate-500 font-medium">Employer Contribution Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={employerRate}
                  onChange={(e) => setEmployerRate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="10.0"
                />
                <p className="text-xs text-slate-400">Percentage contributed by employer</p>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] text-slate-500 font-medium">Scheme Type</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isVoluntary}
                      onChange={() => setIsVoluntary(true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">Voluntary</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isVoluntary}
                      onChange={() => setIsVoluntary(false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">Mandatory</span>
                  </label>
                </div>
                <p className="text-xs text-slate-400">Whether PF contribution is optional or required</p>
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
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-emerald-900 mb-2">Information</h3>
            <ul className="text-xs text-emerald-700 space-y-1">
              <li>• Provident Fund is a retirement savings scheme</li>
              <li>• Contributions are calculated on basic salary (not gross)</li>
              <li>• Both employee and employer contributions accumulate with interest</li>
              <li>• Employees can access funds upon retirement or resignation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
