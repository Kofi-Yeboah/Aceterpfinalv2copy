import { useState } from "react";
import { ChevronLeft, Upload } from "lucide-react";

interface AddNewOpportunityFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

export function AddNewOpportunityForm({ onBack, onSave }: AddNewOpportunityFormProps) {
  const [formData, setFormData] = useState({
    opportunityName: "",
    donor: "",
    theme: "",
    stage: "Identified Opportunity (Pre-Award)",
    amountValue: "",
    currency: "USD",
    winProbability: "50% - Medium",
    submissionDeadline: "",
    grantStartDate: "",
    grantEndDate: "",
    nextReportingDeadline: "",
    complianceStatus: "On Track",
    brandingRequired: false,
    quarterlyAudit: false,
    noSubgranting: false,
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Back to Pipeline</span>
            </button>
            <h1 className="text-2xl font-semibold text-slate-900">ADD NEW OPPORTUNITY</h1>
          </div>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-4xl space-y-8">
          {/* Section 1: Core Details */}
          <div className="space-y-4">
            <div className="pb-2">
              <h2 className="text-base font-semibold text-slate-900">1. CORE DETAILS</h2>
              <div className="h-px bg-slate-300 mt-3" />
            </div>

            {/* Opportunity Name */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">
                Opportunity / Grant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.opportunityName}
                onChange={(e) => setFormData({ ...formData, opportunityName: e.target.value })}
                placeholder="e.g., Youth Digital Skills Transformation Grant"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Donor */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">
                Donor <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.donor}
                onChange={(e) => setFormData({ ...formData, donor: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="">Select Donor from Stakeholder DB...</option>
                <option value="MasterCard Foundation">MasterCard Foundation</option>
                <option value="Ford Foundation">Ford Foundation</option>
                <option value="Bill & Melinda Gates Foundation">Bill & Melinda Gates Foundation</option>
                <option value="World Bank">World Bank</option>
                <option value="USAID">USAID</option>
                <option value="Global Fund">Global Fund</option>
                <option value="African Development Bank">African Development Bank</option>
              </select>
              <p className="text-xs text-slate-500">(e.g., MasterCard Foundation)</p>
            </div>

            {/* Theme / Program */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">
                Theme / Program (Matching Engine) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="">Select Theme...</option>
                <option value="Economic Transformation Program">Economic Transformation Program</option>
                <option value="Economic Development">Economic Development</option>
                <option value="Climate & Environment">Climate & Environment</option>
                <option value="Digital Economy">Digital Economy</option>
                <option value="Gender & Agriculture">Gender & Agriculture</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
              </select>
              <p className="text-xs text-slate-500">*Matches opportunity to internal think tank themes</p>
            </div>
          </div>

          {/* Section 2: Pipeline Status & Value */}
          <div className="space-y-4">
            <div className="pb-2">
              <h2 className="text-base font-semibold text-slate-900">2. PIPELINE STATUS & VALUE</h2>
              <div className="h-px bg-slate-300 mt-3" />
            </div>

            {/* Current Stage */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">
                Current Stage <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="Identified Opportunity (Pre-Award)">Identified Opportunity (Pre-Award)</option>
                <option value="Proposal Submitted">Proposal Submitted</option>
                <option value="Active Grant (Awarded)">Active Grant (Awarded)</option>
                <option value="Closed / Archived">Closed / Archived</option>
              </select>
              <p className="text-xs text-slate-500">
                (Options: Identified Opportunity, Proposal Submitted, Active Grant (Awarded), Closed / Archived)
              </p>
            </div>

            {/* Estimated / Actual Amount */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">
                Estimated / Actual Amount <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-32">
                  <span className="text-sm text-slate-700">$</span>
                </div>
                <input
                  type="text"
                  value={formData.amountValue}
                  onChange={(e) => setFormData({ ...formData, amountValue: e.target.value })}
                  placeholder="500,000.00"
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-24 px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                  }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Win Probability */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">Win Probability (If Pre-Award)</label>
              <select
                value={formData.winProbability}
                onChange={(e) => setFormData({ ...formData, winProbability: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="10% - Low">10% - Low</option>
                <option value="25% - Low-Medium">25% - Low-Medium</option>
                <option value="50% - Medium">50% - Medium</option>
                <option value="75% - High">75% - High</option>
                <option value="90% - Very High">90% - Very High</option>
              </select>
            </div>
          </div>

          {/* Section 3: Critical Dates */}
          <div className="space-y-4">
            <div className="pb-2">
              <h2 className="text-base font-semibold text-slate-900">3. CRITICAL DATES (DEADLINES)</h2>
              <div className="h-px bg-slate-300 mt-3" />
            </div>
            <p className="text-xs text-slate-500">*This drives the "Next Deadline" alert in your table</p>

            {/* Submission Deadline */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">Submission Deadline (If Opportunity)</label>
              <input
                type="date"
                value={formData.submissionDeadline}
                onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Grant Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-slate-700">Grant Start Date (If Active)</label>
                <input
                  type="date"
                  value={formData.grantStartDate}
                  onChange={(e) => setFormData({ ...formData, grantStartDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-slate-700">Grant End Date (If Active)</label>
                <input
                  type="date"
                  value={formData.grantEndDate}
                  onChange={(e) => setFormData({ ...formData, grantEndDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Next Reporting Deadline */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">Next Reporting Deadline (If Active)</label>
              <input
                type="date"
                value={formData.nextReportingDeadline}
                onChange={(e) => setFormData({ ...formData, nextReportingDeadline: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500">(e.g., Q1 Financial Report due)</p>
            </div>
          </div>

          {/* Section 4: Compliance & Rules */}
          <div className="space-y-4 pb-8">
            <div className="pb-2">
              <h2 className="text-base font-semibold text-slate-900">4. COMPLIANCE & RULES (For Active Grants)</h2>
              <div className="h-px bg-slate-300 mt-3" />
            </div>
            <p className="text-xs text-slate-500">*Only required if Stage = "Active Grant"</p>

            {/* Compliance Status */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">Compliance Status</label>
              <select
                value={formData.complianceStatus}
                onChange={(e) => setFormData({ ...formData, complianceStatus: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* Donor-Specific Rules */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">Donor-Specific Rules (Tags)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.brandingRequired}
                    onChange={(e) => setFormData({ ...formData, brandingRequired: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Branding Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.quarterlyAudit}
                    onChange={(e) => setFormData({ ...formData, quarterlyAudit: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Quarterly Audit</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.noSubgranting}
                    onChange={(e) => setFormData({ ...formData, noSubgranting: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">No Sub-granting</span>
                </label>
              </div>
            </div>

            {/* Upload Documents */}
            <div className="space-y-2">
              <label className="block text-sm text-slate-700">Upload Documents (Repository)</label>
              <button className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Upload size={16} />
                <span>Upload RFP / Concept Note / Grant Agreement...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
