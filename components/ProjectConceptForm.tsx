import { ArrowLeft, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface ProjectConceptFormProps {
  project: {
    id: string;
    name: string;
    stage?: string;
    status?: string;
  };
  onBack: () => void;
  onSubmitForApproval?: () => void;
}

export function ProjectConceptForm({ project, onBack, onSubmitForApproval }: ProjectConceptFormProps) {
  const [projectTitle, setProjectTitle] = useState("Warehouse Automation & Digitization Phase 1");
  const [problemStatement, setProblemStatement] = useState("Currently, inventory tracking is manual, leading to a 15% stock variance and 3-day delays in reporting. We are losing money on expired goods due to poor visibility.");
  const [proposedSolution, setProposedSolution] = useState("Implement a barcode scanning system and integrate it with the central ERP. This includes procuring 50 handheld scanners and training warehouse staff.");
  const [strategicAlignment, setStrategicAlignment] = useState<string[]>(["Operational Efficiency"]);
  
  const [primaryObjective, setPrimaryObjective] = useState("Reduce inventory variance to <1% by Q4 2026.");
  const [secondaryObjective, setSecondaryObjective] = useState("Real-time visibility of stock levels for the Sales Team.");
  const [inScope, setInScope] = useState("Procurement of Hardware (Scanners, Servers).\nSoftware Installation.\nStaff Training (Accra & Kumasi branches).");
  const [outOfScope, setOutOfScope] = useState("Renovation of the physical warehouse building.\nAutomation of the Transport Fleet.");
  
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [estimatedBudget, setEstimatedBudget] = useState("$150,000");
  const [fundingSource, setFundingSource] = useState("IT Modernization Fund");
  
  const [deliverables, setDeliverables] = useState([
    { id: "1", text: "Fully functional Barcode System.", checked: false },
    { id: "2", text: "Updated Standard Operating Procedures (SOPs).", checked: false },
    { id: "3", text: "Training Completion Certificates for 20 staff.", checked: false }
  ]);

  const [showFundingDropdown, setShowFundingDropdown] = useState(false);

  const FUNDING_SOURCES = [
    "IT Modernization Fund",
    "Operational Budget",
    "Capital Investment",
    "External Grant",
    "Donor Funding",
    "Private Investment",
    "Government Grant",
    "Internal Reserves"
  ];

  const STRATEGIC_GOALS = [
    "Operational Efficiency",
    "Market Expansion",
    "Compliance"
  ];

  const toggleStrategicGoal = (goal: string) => {
    if (strategicAlignment.includes(goal)) {
      setStrategicAlignment(strategicAlignment.filter(g => g !== goal));
    } else {
      setStrategicAlignment([...strategicAlignment, goal]);
    }
  };

  const toggleDeliverable = (id: string) => {
    setDeliverables(deliverables.map(d =>
      d.id === id ? { ...d, checked: !d.checked } : d
    ));
  };

  const addDeliverable = () => {
    const newDeliverable = {
      id: Date.now().toString(),
      text: "",
      checked: false
    };
    setDeliverables([...deliverables, newDeliverable]);
  };

  const updateDeliverable = (id: string, text: string) => {
    setDeliverables(deliverables.map(d =>
      d.id === id ? { ...d, text } : d
    ));
  };

  const removeDeliverable = (id: string) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter(d => d.id !== id));
    }
  };

  const handleSaveDraft = () => {
    console.log("Saving draft...");
    // Add save logic here
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF preview...");
    // Add PDF download logic here
  };

  const handleSubmitForApproval = () => {
    console.log("Submitting for approval...");
    // Add submit logic here
    if (onSubmitForApproval) {
      onSubmitForApproval();
    }
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return `${diffMonths} Months`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-slate-900">
              Project Concept: {project.name}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
              <span>ID: {project.id}</span>
              <span>|</span>
              <span>Status: Inception - {project.status || "Draft"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* 1. Project Overview */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">1. Project Overview</h2>
            
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project title"
              />
            </div>

            {/* Problem Statement */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Problem Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe the problem or opportunity this project addresses"
              />
            </div>

            {/* Proposed Solution */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Proposed Solution (Description) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe the proposed solution"
              />
            </div>

            {/* Strategic Alignment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Strategic Alignment <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {STRATEGIC_GOALS.map((goal) => (
                  <label key={goal} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={strategicAlignment.includes(goal)}
                      onChange={() => toggleStrategicGoal(goal)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Objectives & Scope */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">2. Objectives & Scope (The "What")</h2>
            
            {/* Primary Objective */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Primary Objective <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={primaryObjective}
                onChange={(e) => setPrimaryObjective(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the primary objective"
              />
            </div>

            {/* Secondary Objective */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Secondary Objective
              </label>
              <input
                type="text"
                value={secondaryObjective}
                onChange={(e) => setSecondaryObjective(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the secondary objective"
              />
            </div>

            {/* In Scope */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                In Scope <span className="text-red-500">*</span>
              </label>
              <textarea
                value={inScope}
                onChange={(e) => setInScope(e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="List what is included in this project (one item per line)"
              />
            </div>

            {/* Out of Scope */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Out of Scope <span className="text-red-500">*</span>
              </label>
              <textarea
                value={outOfScope}
                onChange={(e) => setOutOfScope(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="List what is explicitly excluded from this project (one item per line)"
              />
            </div>
          </div>

          {/* 3. High-Level Estimates */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">3. High-Level Estimates</h2>
            
            {/* Estimated Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estimated Duration <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              {startDate && endDate && (
                <div className="text-sm text-slate-600">
                  Duration: <span className="font-medium">{calculateDuration()}</span>
                </div>
              )}
            </div>

            {/* Estimated Budget */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estimated Budget <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., $150,000"
              />
            </div>

            {/* Funding Source */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Funding Source <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFundingDropdown(!showFundingDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-slate-900">{fundingSource}</span>
                  <svg
                    className={cn(
                      "w-4 h-4 text-slate-400 transition-transform",
                      showFundingDropdown && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showFundingDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFundingDropdown(false)} />
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                      {FUNDING_SOURCES.map((source) => (
                        <button
                          key={source}
                          type="button"
                          onClick={() => {
                            setFundingSource(source);
                            setShowFundingDropdown(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                            fundingSource === source ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                          )}
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 4. Key Deliverables */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">4. Key Deliverables</h2>
              <button
                type="button"
                onClick={addDeliverable}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Deliverable
              </button>
            </div>
            
            <div className="space-y-3">
              {deliverables.map((deliverable) => (
                <div key={deliverable.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={deliverable.checked}
                    onChange={() => toggleDeliverable(deliverable.id)}
                    className="w-4 h-4 mt-1 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={deliverable.text}
                    onChange={(e) => updateDeliverable(deliverable.id, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter deliverable description"
                  />
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverable(deliverable.id)}
                      className="px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 py-6">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              <Download size={16} />
              Download PDF Preview
            </button>
            <button
              type="button"
              onClick={handleSubmitForApproval}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}