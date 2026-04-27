import { useState } from "react";
import { Plus, ArrowLeft, X, MoreHorizontal } from "lucide-react";

interface RiskItem {
  id: string;
  riskCategory: string;
  riskDescription: string;
  likelihood: "Very Low" | "Low" | "Medium" | "High" | "Very High";
  impact: "Very Low" | "Low" | "Medium" | "High" | "Very High";
  riskLevel: string;
  mitigationStrategy: string;
  contingencyPlan: string;
  riskOwner: string;
  status: "Identified" | "Assessing" | "Mitigating" | "Monitoring" | "Closed";
  reviewDate: string;
  assignedTask: string;
}

interface RiskManagementPlanBuilderProps {
  onBack: () => void;
  hideStatus?: boolean;
}

const RISK_CATEGORIES = [
  "Strategic Risk",
  "Operational Risk",
  "Financial Risk",
  "Compliance/Regulatory Risk",
  "Reputational Risk",
  "Technology Risk",
  "Human Resources Risk",
  "Environmental Risk",
  "Political Risk",
  "Market Risk"
];

// Available tasks for risk assignment
const AVAILABLE_TASKS = [
  { id: "T001", name: "Draft Request for Proposals (RFP)", phase: "Procurement & Contracting" },
  { id: "T002", name: "Evaluate Vendor Submissions", phase: "Procurement & Contracting" },
  { id: "T003", name: "Finalize Service Agreements", phase: "Procurement & Contracting" },
  { id: "T004", name: "Coordinate Field Data Collection", phase: "Implementation" },
  { id: "T005", name: "Conduct Stakeholder Engagement Sessions", phase: "Implementation" },
  { id: "T006", name: "Conduct Internal Peer Review of Draft", phase: "Quality Assurance" },
  { id: "T007", name: "Run Data Validation Checks", phase: "Quality Assurance" },
  { id: "T008", name: "Design and Layout Report", phase: "Production & Editorial" },
  { id: "T009", name: "Complete Editorial Review", phase: "Production & Editorial" },
  { id: "T010", name: "Plan Distribution Channels", phase: "Dissemination" },
  { id: "T011", name: "Conduct Stakeholder Workshops", phase: "Dissemination" },
  { id: "T012", name: "Submit Final Technical Report", phase: "Reporting" },
  { id: "T013", name: "Compile Lessons Learned", phase: "Reporting" },
  { id: "T014", name: "Sign-off and Handover", phase: "Delivery Stage Complete" },
];

export function RiskManagementPlanBuilder({ onBack, hideStatus }: RiskManagementPlanBuilderProps) {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(null);

  const calculateRiskLevel = (likelihood: string, impact: string): string => {
    const scores: { [key: string]: number } = {
      "Very Low": 1,
      "Low": 2,
      "Medium": 3,
      "High": 4,
      "Very High": 5
    };

    const likelihoodScore = scores[likelihood] || 0;
    const impactScore = scores[impact] || 0;
    const totalScore = likelihoodScore * impactScore;

    if (totalScore <= 4) return "Low";
    if (totalScore <= 10) return "Medium";
    if (totalScore <= 15) return "High";
    return "Critical";
  };

  const addRisk = (risk: RiskItem) => {
    setRisks([...risks, risk]);
    setShowAddForm(false);
  };

  const updateRisk = (updatedRisk: RiskItem) => {
    setRisks(risks.map(r => r.id === updatedRisk.id ? updatedRisk : r));
    setShowEditForm(false);
    setSelectedRisk(null);
  };

  const removeRisk = (riskId: string) => {
    setRisks(risks.filter(r => r.id !== riskId));
    setShowActionDropdown(null);
  };

  const handleViewDetails = (risk: RiskItem) => {
    setSelectedRisk(risk);
    setShowViewModal(true);
    setShowActionDropdown(null);
  };

  const handleEdit = (risk: RiskItem) => {
    setSelectedRisk(risk);
    setShowEditForm(true);
    setShowActionDropdown(null);
  };

  const handleSave = () => {
    console.log("Saving Risk Management Plan:", risks);
    onBack();
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "High": return "bg-orange-100 text-orange-700";
      case "Critical": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Identified": return "bg-blue-100 text-blue-700";
      case "Assessing": return "bg-purple-100 text-purple-700";
      case "Mitigating": return "bg-orange-100 text-orange-700";
      case "Monitoring": return "bg-yellow-100 text-yellow-700";
      case "Closed": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-2xl font-semibold text-slate-900">
              Risk Management Plan Builder
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors"
            >
              Save Risk Management Plan
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <div className="space-y-4">
          {/* Add Risk Button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              {risks.length} {risks.length === 1 ? 'risk' : 'risks'} identified
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors"
            >
              <Plus className="size-5" />
              Add Risk
            </button>
          </div>

          {/* Risk Table */}
          {risks.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0B01D0]">
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Risk Category</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Risk Description</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Likelihood</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Impact</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Risk Level</th>
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Risk Owner</th>
                    {!hideStatus && <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Status</th>}
                    <th className="px-4 py-3 text-left text-white text-[12px] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((risk, index) => (
                    <tr key={risk.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-4 py-3 text-[12px] text-slate-900">{risk.riskCategory}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900 max-w-xs truncate">{risk.riskDescription}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900">{risk.likelihood}</td>
                      <td className="px-4 py-3 text-[12px] text-slate-900">{risk.impact}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getRiskLevelColor(risk.riskLevel)}`}>
                          {risk.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-900">{risk.riskOwner}</td>
                      {!hideStatus && (
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusColor(risk.status)}`}>
                            {risk.status}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-[12px] text-slate-900 relative">
                        <button
                          onClick={() => setShowActionDropdown(showActionDropdown === risk.id ? null : risk.id)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                        {showActionDropdown === risk.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(null)} />
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                              <button
                                onClick={() => handleViewDetails(risk)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 first:rounded-t-lg"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(risk)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeRisk(risk.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 last:rounded-b-lg"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
              <p className="text-slate-600">No risks identified yet. Click "Add Risk" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Risk Form Modal */}
      {showAddForm && (
        <RiskForm
          onSave={addRisk}
          onCancel={() => setShowAddForm(false)}
          calculateRiskLevel={calculateRiskLevel}
          title="Add Risk"
          hideStatus={hideStatus}
        />
      )}

      {/* Edit Risk Form Modal */}
      {showEditForm && selectedRisk && (
        <RiskForm
          onSave={updateRisk}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedRisk(null);
          }}
          calculateRiskLevel={calculateRiskLevel}
          title="Edit Risk"
          initialData={selectedRisk}
          hideStatus={hideStatus}
        />
      )}

      {/* View Details Modal */}
      {showViewModal && selectedRisk && (
        <ViewRiskModal
          risk={selectedRisk}
          onClose={() => {
            setShowViewModal(false);
            setSelectedRisk(null);
          }}
          getRiskLevelColor={getRiskLevelColor}
          getStatusColor={getStatusColor}
          hideStatus={hideStatus}
        />
      )}
    </div>
  );
}

interface RiskFormProps {
  onSave: (risk: RiskItem) => void;
  onCancel: () => void;
  calculateRiskLevel: (likelihood: string, impact: string) => string;
  title: string;
  initialData?: RiskItem;
  hideStatus?: boolean;
}

function RiskForm({ onSave, onCancel, calculateRiskLevel, title, initialData, hideStatus }: RiskFormProps) {
  const [assignedTask, setAssignedTask] = useState(initialData?.assignedTask || "");
  const [riskCategory, setRiskCategory] = useState(initialData?.riskCategory || "");
  const [riskDescription, setRiskDescription] = useState(initialData?.riskDescription || "");
  const [likelihood, setLikelihood] = useState<"Very Low" | "Low" | "Medium" | "High" | "Very High">(initialData?.likelihood || "Medium");
  const [impact, setImpact] = useState<"Very Low" | "Low" | "Medium" | "High" | "Very High">(initialData?.impact || "Medium");
  const [mitigationStrategy, setMitigationStrategy] = useState(initialData?.mitigationStrategy || "");
  const [contingencyPlan, setContingencyPlan] = useState(initialData?.contingencyPlan || "");
  const [riskOwner, setRiskOwner] = useState(initialData?.riskOwner || "");
  const [status, setStatus] = useState<"Identified" | "Assessing" | "Mitigating" | "Monitoring" | "Closed">(initialData?.status || "Identified");
  const [reviewDate, setReviewDate] = useState(initialData?.reviewDate || "");

  const riskLevel = calculateRiskLevel(likelihood, impact);

  const handleSubmit = () => {
    if (!riskCategory || !riskDescription || !mitigationStrategy || !riskOwner) {
      alert("Please fill in all required fields");
      return;
    }

    const risk: RiskItem = {
      id: initialData?.id || `risk-${Date.now()}`,
      riskCategory,
      riskDescription,
      likelihood,
      impact,
      riskLevel,
      mitigationStrategy,
      contingencyPlan,
      riskOwner,
      status,
      reviewDate,
      assignedTask
    };

    onSave(risk);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Assigned Task */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Assigned Task
            </label>
            <select
              value={assignedTask}
              onChange={(e) => setAssignedTask(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a task...</option>
              {AVAILABLE_TASKS.map(task => (
                <option key={task.id} value={task.name}>{task.name} ({task.phase})</option>
              ))}
            </select>
          </div>

          {/* Risk Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Risk Category *
            </label>
            <select
              value={riskCategory}
              onChange={(e) => setRiskCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {RISK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Risk Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Risk Description *
            </label>
            <textarea
              value={riskDescription}
              onChange={(e) => setRiskDescription(e.target.value)}
              placeholder="Describe the risk in detail..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Likelihood and Impact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Likelihood
              </label>
              <select
                value={likelihood}
                onChange={(e) => setLikelihood(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Very Low">Very Low</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Impact
              </label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Very Low">Very Low</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
          </div>

          {/* Risk Level (Auto-calculated) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Risk Level (Auto-calculated)
            </label>
            <div className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                riskLevel === "Low" ? "bg-green-100 text-green-700" :
                riskLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                riskLevel === "High" ? "bg-orange-100 text-orange-700" :
                "bg-red-100 text-red-700"
              }`}>
                {riskLevel}
              </span>
            </div>
          </div>

          {/* Mitigation Strategy */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mitigation Strategy *
            </label>
            <textarea
              value={mitigationStrategy}
              onChange={(e) => setMitigationStrategy(e.target.value)}
              placeholder="Describe how this risk will be mitigated..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contingency Plan */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contingency Plan
            </label>
            <textarea
              value={contingencyPlan}
              onChange={(e) => setContingencyPlan(e.target.value)}
              placeholder="What will be done if the risk materializes..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Risk Owner and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Risk Owner *
              </label>
              <select
                value={riskOwner}
                onChange={(e) => setRiskOwner(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Risk Owner</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Technical Lead">Technical Lead</option>
                <option value="Department Head">Department Head</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Procurement Manager">Procurement Manager</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Quality Assurance Lead">Quality Assurance Lead</option>
              </select>
            </div>
            {!hideStatus && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Identified">Identified</option>
                  <option value="Assessing">Assessing</option>
                  <option value="Mitigating">Mitigating</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            )}
          </div>

          {/* Review Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Review Date
            </label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors"
          >
            {initialData ? "Update Risk" : "Add Risk"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ViewRiskModalProps {
  risk: RiskItem;
  onClose: () => void;
  getRiskLevelColor: (level: string) => string;
  getStatusColor: (status: string) => string;
  hideStatus?: boolean;
}

function ViewRiskModal({ risk, onClose, getRiskLevelColor, getStatusColor, hideStatus }: ViewRiskModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-slate-900">Risk Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Risk Category</label>
            <p className="text-slate-900">{risk.riskCategory}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Risk Description</label>
            <p className="text-slate-900 bg-slate-50 p-3 rounded">{risk.riskDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Likelihood</label>
              <p className="text-slate-900">{risk.likelihood}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Impact</label>
              <p className="text-slate-900">{risk.impact}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Risk Level</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(risk.riskLevel)}`}>
              {risk.riskLevel}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mitigation Strategy</label>
            <p className="text-slate-900 bg-slate-50 p-3 rounded">{risk.mitigationStrategy}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contingency Plan</label>
            <p className="text-slate-900 bg-slate-50 p-3 rounded">{risk.contingencyPlan || "No contingency plan specified"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Risk Owner</label>
              <p className="text-slate-900">{risk.riskOwner}</p>
            </div>
            {!hideStatus && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(risk.status)}`}>
                  {risk.status}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Review Date</label>
            <p className="text-slate-900">{risk.reviewDate || "Not set"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Task</label>
            <p className="text-slate-900">{risk.assignedTask || "No task assigned"}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}