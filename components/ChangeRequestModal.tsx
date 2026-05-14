import { useState, useMemo } from "react";
import {
  X, Plus, Trash2, ChevronDown, ChevronRight, AlertTriangle,
  CheckCircle2, Clock, FileText, DollarSign, Calendar, Layers,
  ArrowRight, Shield, GitBranch, History, Send, Eye, MoreHorizontal,
  Info, ChevronLeft
} from "lucide-react";
import { cn } from "../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export type CRType = "Timeline Change" | "Budget Reallocation" | "Scope Change";
export type CRStatus = "Draft" | "Pending Approval" | "Approved" | "Rejected";
export type ApprovalTier = "Tier 1 — Program Head" | "Tier 2 — Finance Director";

export interface DeltaLineItem {
  id: string;
  selected: boolean;
  category: "wbs" | "budget";
  phase: string;
  lineLabel: string;
  currentBaseline: number;
  proposedValue: number;
  committed: number; // amount already committed in procurement/POs
  unit: string; // "hours" for WBS, "$" for budget
}

export interface ChangeRequest {
  id: string;
  type: CRType;
  justification: string;
  status: CRStatus;
  createdBy: string;
  createdDate: string;
  approvalTier: ApprovalTier;
  netVariance: number;
  timelineExtensionDays: number;
  deltaLines: DeltaLineItem[];
  version: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

export interface BaselineVersion {
  version: string;
  date: string;
  crId: string;
  snapshotSummary: string;
}

// ── Mock baseline data for the delta grid ────────────────────────────────────

const MOCK_WBS_LINES: DeltaLineItem[] = [
  { id: "wbs-1", selected: false, category: "wbs", phase: "Procurement & Contracting", lineLabel: "Draft RFP Documents", currentBaseline: 120, proposedValue: 120, committed: 120, unit: "hours" },
  { id: "wbs-2", selected: false, category: "wbs", phase: "Procurement & Contracting", lineLabel: "Evaluate Vendor Submissions", currentBaseline: 80, proposedValue: 80, committed: 80, unit: "hours" },
  { id: "wbs-3", selected: false, category: "wbs", phase: "Procurement & Contracting", lineLabel: "Finalize Service Agreements", currentBaseline: 100, proposedValue: 100, committed: 100, unit: "hours" },
  { id: "wbs-4", selected: false, category: "wbs", phase: "Implementation", lineLabel: "Coordinate Field Data Collection", currentBaseline: 200, proposedValue: 200, committed: 140, unit: "hours" },
  { id: "wbs-5", selected: false, category: "wbs", phase: "Implementation", lineLabel: "Conduct Stakeholder Engagement", currentBaseline: 150, proposedValue: 150, committed: 80, unit: "hours" },
  { id: "wbs-6", selected: false, category: "wbs", phase: "Quality Assurance", lineLabel: "Internal Peer Review", currentBaseline: 100, proposedValue: 100, committed: 0, unit: "hours" },
  { id: "wbs-7", selected: false, category: "wbs", phase: "Quality Assurance", lineLabel: "Data Validation Checks", currentBaseline: 60, proposedValue: 60, committed: 0, unit: "hours" },
  { id: "wbs-8", selected: false, category: "wbs", phase: "Production & Editorial", lineLabel: "Design and Layout Report", currentBaseline: 80, proposedValue: 80, committed: 0, unit: "hours" },
  { id: "wbs-9", selected: false, category: "wbs", phase: "Production & Editorial", lineLabel: "Complete Editorial Review", currentBaseline: 60, proposedValue: 60, committed: 0, unit: "hours" },
  { id: "wbs-10", selected: false, category: "wbs", phase: "Reporting", lineLabel: "Submit Final Technical Report", currentBaseline: 60, proposedValue: 60, committed: 0, unit: "hours" },
];

const MOCK_BUDGET_LINES: DeltaLineItem[] = [
  { id: "bgt-1", selected: false, category: "budget", phase: "Procurement & Contracting", lineLabel: "Consultant Fees — RFP Specialist", currentBaseline: 15000, proposedValue: 15000, committed: 15000, unit: "$" },
  { id: "bgt-2", selected: false, category: "budget", phase: "Procurement & Contracting", lineLabel: "Vendor Evaluation Services", currentBaseline: 8000, proposedValue: 8000, committed: 8000, unit: "$" },
  { id: "bgt-3", selected: false, category: "budget", phase: "Implementation", lineLabel: "Field Data Collection Costs", currentBaseline: 25000, proposedValue: 25000, committed: 18200, unit: "$" },
  { id: "bgt-4", selected: false, category: "budget", phase: "Implementation", lineLabel: "Stakeholder Workshop Expenses", currentBaseline: 12000, proposedValue: 12000, committed: 4500, unit: "$" },
  { id: "bgt-5", selected: false, category: "budget", phase: "Implementation", lineLabel: "IT Equipment Procurement", currentBaseline: 35000, proposedValue: 35000, committed: 28000, unit: "$" },
  { id: "bgt-6", selected: false, category: "budget", phase: "Quality Assurance", lineLabel: "QA Consultant Fees", currentBaseline: 10000, proposedValue: 10000, committed: 0, unit: "$" },
  { id: "bgt-7", selected: false, category: "budget", phase: "Production & Editorial", lineLabel: "Design & Layout Services", currentBaseline: 8000, proposedValue: 8000, committed: 0, unit: "$" },
  { id: "bgt-8", selected: false, category: "budget", phase: "Production & Editorial", lineLabel: "Printing & Distribution", currentBaseline: 5000, proposedValue: 5000, committed: 0, unit: "$" },
  { id: "bgt-9", selected: false, category: "budget", phase: "Reporting", lineLabel: "Final Report Production", currentBaseline: 7000, proposedValue: 7000, committed: 0, unit: "$" },
  { id: "bgt-10", selected: false, category: "budget", phase: "Dissemination", lineLabel: "Dissemination Events Budget", currentBaseline: 15000, proposedValue: 15000, committed: 0, unit: "$" },
  { id: "bgt-11", selected: false, category: "budget", phase: "Reporting", lineLabel: "Lessons Learned Compilation", currentBaseline: 5000, proposedValue: 5000, committed: 0, unit: "$" },
  { id: "bgt-12", selected: false, category: "budget", phase: "Implementation", lineLabel: "Travel & Transport", currentBaseline: 5000, proposedValue: 5000, committed: 2800, unit: "$" },
];

// ── Mock existing CRs ────────────────────────────────────────────────────────

const MOCK_EXISTING_CRS: ChangeRequest[] = [
  {
    id: "CR-001",
    type: "Budget Reallocation",
    justification: "Reallocate $5,000 from Dissemination Events to Implementation IT Equipment due to increased laptop costs from vendor price adjustments.",
    status: "Approved",
    createdBy: "Kwame Asante",
    createdDate: "Feb 10, 2026",
    approvalTier: "Tier 1 — Program Head",
    netVariance: 0,
    timelineExtensionDays: 0,
    deltaLines: [],
    version: "v1.0 → v2.0",
    approvedBy: "Dr. Akua Mensah",
    approvedDate: "Feb 14, 2026",
  },
];

const MOCK_VERSIONS: BaselineVersion[] = [
  { version: "v2.0", date: "Feb 14, 2026", crId: "CR-001", snapshotSummary: "Budget reallocation: $5k from Dissemination → IT Equipment" },
  { version: "v1.0", date: "Jan 15, 2026", crId: "—", snapshotSummary: "Original baseline set at project delivery kickoff" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return "$" + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getStatusStyle(status: CRStatus): string {
  switch (status) {
    case "Approved": return "bg-emerald-100 text-emerald-700";
    case "Pending Approval": return "bg-amber-100 text-amber-700";
    case "Rejected": return "bg-red-100 text-red-700";
    default: return "bg-slate-100 text-slate-600";
  }
}

// ── Sub-Components ──────────────────────────────────────────────────────────

interface ChangeRequestListProps {
  context: "wbs" | "budget";
  onCreateNew: () => void;
}

export function ChangeRequestList({ context, onCreateNew }: ChangeRequestListProps) {
  const [showVersions, setShowVersions] = useState(false);
  const [selectedCR, setSelectedCR] = useState<ChangeRequest | null>(null);

  const filteredCRs = MOCK_EXISTING_CRS;
  const currentVersion = MOCK_VERSIONS[0];

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#0B01D0]" />
              <span className="text-[13px] font-semibold text-slate-900">Change Management</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-md border border-blue-100">
              <span className="text-[11px] font-medium text-blue-700">Current Baseline:</span>
              <span className="text-[11px] font-semibold text-blue-900">{currentVersion.version}</span>
            </div>
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-700 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              Version History
              {showVersions ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[13px] font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Change Request
          </button>
        </div>

        {/* Version History Dropdown */}
        {showVersions && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="space-y-2">
              {MOCK_VERSIONS.map((v) => (
                <div key={v.version} className="flex items-center gap-4 p-2.5 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", v.version === currentVersion.version ? "bg-emerald-500" : "bg-slate-300")} />
                    <span className="text-[12px] font-semibold text-slate-900 min-w-[40px]">{v.version}</span>
                  </div>
                  <span className="text-[12px] text-slate-500 min-w-[100px]">{v.date}</span>
                  <span className="text-[12px] text-slate-500 min-w-[50px]">{v.crId}</span>
                  <span className="text-[12px] text-slate-600 flex-1">{v.snapshotSummary}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Existing CRs Table */}
      {filteredCRs.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-slate-900">Change Request History</h3>
            <span className="text-[11px] text-slate-500">{filteredCRs.length} request{filteredCRs.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B01D0" }}>
                <tr>
                  <th className="text-left py-2.5 px-5 text-[12px] font-semibold text-white">CR ID</th>
                  <th className="text-left py-2.5 px-5 text-[12px] font-semibold text-white">Type</th>
                  <th className="text-left py-2.5 px-5 text-[12px] font-semibold text-white">Justification</th>
                  <th className="text-left py-2.5 px-5 text-[12px] font-semibold text-white">Net Variance</th>
                  <th className="text-left py-2.5 px-5 text-[12px] font-semibold text-white">Approval Tier</th>
                  <th className="text-left py-2.5 px-5 text-[12px] font-semibold text-white">Status</th>
                  <th className="text-left py-2.5 px-5 text-[12px] font-semibold text-white">Version</th>
                  <th className="text-left py-2.5 px-5 text-[12px] font-semibold text-white w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCRs.map((cr, idx) => (
                  <tr key={cr.id} className={cn("border-b border-slate-100 hover:bg-slate-50", idx % 2 === 1 && "bg-slate-50/50")}>
                    <td className="py-2.5 px-5 text-[12px] font-medium text-[#0B01D0]">{cr.id}</td>
                    <td className="py-2.5 px-5 text-[12px] text-slate-700">{cr.type}</td>
                    <td className="py-2.5 px-5 text-[12px] text-slate-600 max-w-[280px]">
                      <span className="line-clamp-2">{cr.justification}</span>
                    </td>
                    <td className="py-2.5 px-5 text-[12px] font-medium">
                      <span className={cr.netVariance === 0 ? "text-slate-600" : cr.netVariance > 0 ? "text-red-600" : "text-emerald-600"}>
                        {cr.netVariance === 0 ? "$0 (reallocation)" : cr.netVariance > 0 ? `+${formatCurrency(cr.netVariance)}` : `-${formatCurrency(cr.netVariance)}`}
                      </span>
                    </td>
                    <td className="py-2.5 px-5 text-[12px] text-slate-600">{cr.approvalTier}</td>
                    <td className="py-2.5 px-5">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium", getStatusStyle(cr.status))}>
                        {cr.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-5 text-[12px] text-slate-600">{cr.version}</td>
                    <td className="py-2.5 px-5">
                      <button
                        onClick={() => setSelectedCR(selectedCR?.id === cr.id ? null : cr)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded CR detail */}
          {selectedCR && (
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-[11px] text-slate-500 mb-0.5">Created By</p>
                  <p className="text-[12px] text-slate-900 font-medium">{selectedCR.createdBy}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-0.5">Created Date</p>
                  <p className="text-[12px] text-slate-900">{selectedCR.createdDate}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-0.5">Approved By</p>
                  <p className="text-[12px] text-slate-900 font-medium">{selectedCR.approvedBy || "—"}</p>
                  {selectedCR.approvedDate && <p className="text-[11px] text-slate-400">{selectedCR.approvedDate}</p>}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-0.5">Full Justification</p>
                <p className="text-[12px] text-slate-700">{selectedCR.justification}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Change Request Form Modal ───────────────────────────────────────────────

interface ChangeRequestFormProps {
  context: "wbs" | "budget";
  onClose: () => void;
  onSubmit: (cr: ChangeRequest) => void;
}

export function ChangeRequestForm({ context, onClose, onSubmit }: ChangeRequestFormProps) {
  const [step, setStep] = useState<"form" | "review">("form");
  const [crType, setCrType] = useState<CRType | "">("");
  const [justification, setJustification] = useState("");
  const [timelineExtensionDays, setTimelineExtensionDays] = useState(0);
  const [deltaLines, setDeltaLines] = useState<DeltaLineItem[]>(
    context === "wbs" ? MOCK_WBS_LINES.map(l => ({ ...l })) : MOCK_BUDGET_LINES.map(l => ({ ...l }))
  );
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Group lines by phase
  const groupedLines = useMemo(() => {
    const map = new Map<string, DeltaLineItem[]>();
    deltaLines.forEach(line => {
      const existing = map.get(line.phase) || [];
      existing.push(line);
      map.set(line.phase, existing);
    });
    return map;
  }, [deltaLines]);

  // Calculate totals
  const selectedLines = deltaLines.filter(l => l.selected);
  const totalCurrentBaseline = selectedLines.reduce((s, l) => s + l.currentBaseline, 0);
  const totalProposed = selectedLines.reduce((s, l) => s + l.proposedValue, 0);
  const netVariance = totalProposed - totalCurrentBaseline;

  // Determine approval tier
  const approvalTier: ApprovalTier = useMemo(() => {
    if (netVariance > 0 || timelineExtensionDays > 30) {
      return "Tier 2 — Finance Director";
    }
    return "Tier 1 — Program Head";
  }, [netVariance, timelineExtensionDays]);

  const togglePhase = (phase: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase); else next.add(phase);
      return next;
    });
  };

  const toggleLineSelected = (lineId: string) => {
    setDeltaLines(prev => prev.map(l => l.id === lineId ? { ...l, selected: !l.selected } : l));
    // Clear validation error when toggling
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next[lineId];
      return next;
    });
  };

  const updateProposedValue = (lineId: string, value: number) => {
    setDeltaLines(prev => prev.map(l => {
      if (l.id !== lineId) return l;
      return { ...l, proposedValue: value };
    }));

    // Validate: cannot reduce below committed
    const line = deltaLines.find(l => l.id === lineId);
    if (line && value < line.committed) {
      setValidationErrors(prev => ({
        ...prev,
        [lineId]: `Cannot reduce below committed amount (${line.unit === "$" ? formatCurrency(line.committed) : line.committed + " " + line.unit})`
      }));
    } else {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[lineId];
        return next;
      });
    }
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const isFormValid = crType !== "" && justification.trim().length > 0 && selectedLines.length > 0 && !hasValidationErrors;

  const handleSubmit = () => {
    const cr: ChangeRequest = {
      id: `CR-${String(MOCK_EXISTING_CRS.length + 1).padStart(3, "0")}`,
      type: crType as CRType,
      justification,
      status: "Pending Approval",
      createdBy: "Kwame Asante",
      createdDate: "Mar 9, 2026",
      approvalTier,
      netVariance: context === "budget" ? netVariance : 0,
      timelineExtensionDays,
      deltaLines: selectedLines,
      version: `v${MOCK_VERSIONS.length}.0 → v${MOCK_VERSIONS.length + 1}.0`,
    };
    onSubmit(cr);
  };

  const unit = context === "budget" ? "$" : "hrs";

  const crTypeOptions: CRType[] = ["Timeline Change", "Budget Reallocation", "Scope Change"];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[960px] mx-4 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            {step === "review" && (
              <button onClick={() => setStep("form")} className="p-1 hover:bg-slate-200 rounded transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-[#0B01D0]/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#0B01D0]" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">
                {step === "form" ? "Create Change Request" : "Review & Submit"}
              </h2>
              <p className="text-[11px] text-slate-500">
                {step === "form"
                  ? `Propose changes to the ${context === "wbs" ? "WBS baseline" : "budget baseline"} for this delivery-phase project`
                  : "Review your change request before submitting for approval"
                }
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {step === "form" ? (
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Top Fields */}
            <div className="grid grid-cols-2 gap-6">
              {/* Type Dropdown */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Change Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[13px] text-slate-900 hover:border-slate-400 transition-colors"
                  >
                    <span className={crType ? "text-slate-900" : "text-slate-400"}>
                      {crType || "Select change type..."}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                      {crTypeOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => { setCrType(opt); setShowTypeDropdown(false); }}
                          className={cn(
                            "w-full text-left px-3 py-2.5 text-[13px] hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg",
                            crType === opt ? "bg-blue-50 text-[#0B01D0] font-medium" : "text-slate-700"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline Extension (only for Timeline Change) */}
              {crType === "Timeline Change" && (
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Timeline Extension (Days)</label>
                  <input
                    type="number"
                    min={0}
                    value={timelineExtensionDays}
                    onChange={e => setTimelineExtensionDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0]"
                    placeholder="Number of days..."
                  />
                  {timelineExtensionDays > 30 && (
                    <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Extension &gt;30 days routes to Tier 2 (Finance Director)
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Justification */}
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Justification <span className="text-red-500">*</span></label>
              <textarea
                value={justification}
                onChange={e => setJustification(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-[13px] text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-[#0B01D0]/20 focus:border-[#0B01D0]"
                placeholder="Describe the rationale for this change request..."
              />
            </div>

            {/* Delta Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <h3 className="text-[13px] font-semibold text-slate-900">
                    {context === "wbs" ? "WBS Baseline Lines" : "Budget Baseline Lines"}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Info className="w-3 h-3" />
                  Select lines to modify, then enter proposed values
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {/* Delta Grid Header */}
                <div className="bg-blue-800 grid grid-cols-[40px_1fr_120px_120px_120px_100px] gap-0">
                  <div className="px-3 py-2.5 text-[11px] font-semibold text-white flex items-center justify-center">
                    <input type="checkbox" className="rounded" disabled />
                  </div>
                  <div className="px-3 py-2.5 text-[11px] font-semibold text-white">Line Item</div>
                  <div className="px-3 py-2.5 text-[11px] font-semibold text-white text-right">Current Baseline</div>
                  <div className="px-3 py-2.5 text-[11px] font-semibold text-white text-right">Committed</div>
                  <div className="px-3 py-2.5 text-[11px] font-semibold text-white text-right">Proposed Value</div>
                  <div className="px-3 py-2.5 text-[11px] font-semibold text-white text-right">Variance</div>
                </div>

                {/* Delta Grid Body */}
                {Array.from(groupedLines.entries()).map(([phase, lines]) => {
                  const isExpanded = expandedPhases.has(phase);
                  const phaseHasSelected = lines.some(l => l.selected);
                  const phaseVariance = lines.filter(l => l.selected).reduce((s, l) => s + (l.proposedValue - l.currentBaseline), 0);

                  return (
                    <div key={phase}>
                      {/* Phase Row */}
                      <div
                        className={cn(
                          "grid grid-cols-[40px_1fr_120px_120px_120px_100px] gap-0 bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors",
                          phaseHasSelected && "bg-blue-50/50"
                        )}
                        onClick={() => togglePhase(phase)}
                      >
                        <div className="px-3 py-2.5 flex items-center justify-center">
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        </div>
                        <div className="px-3 py-2.5 text-[12px] font-semibold text-slate-900 flex items-center gap-2">
                          {phase}
                          <span className="text-[11px] font-normal text-slate-400">({lines.length} lines)</span>
                        </div>
                        <div className="px-3 py-2.5 text-[12px] text-slate-600 text-right font-medium">
                          {context === "budget" ? formatCurrency(lines.reduce((s, l) => s + l.currentBaseline, 0)) : `${lines.reduce((s, l) => s + l.currentBaseline, 0)} hrs`}
                        </div>
                        <div className="px-3 py-2.5 text-[12px] text-slate-500 text-right">
                          {context === "budget" ? formatCurrency(lines.reduce((s, l) => s + l.committed, 0)) : `${lines.reduce((s, l) => s + l.committed, 0)} hrs`}
                        </div>
                        <div className="px-3 py-2.5" />
                        <div className="px-3 py-2.5 text-[12px] text-right font-medium">
                          {phaseHasSelected && (
                            <span className={phaseVariance > 0 ? "text-red-600" : phaseVariance < 0 ? "text-emerald-600" : "text-slate-400"}>
                              {phaseVariance > 0 ? "+" : ""}{context === "budget" ? formatCurrency(phaseVariance) : `${phaseVariance} hrs`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Line Items */}
                      {isExpanded && lines.map(line => {
                        const variance = line.proposedValue - line.currentBaseline;
                        const hasError = !!validationErrors[line.id];

                        return (
                          <div
                            key={line.id}
                            className={cn(
                              "grid grid-cols-[40px_1fr_120px_120px_120px_100px] gap-0 border-b border-slate-100",
                              line.selected ? "bg-blue-50/30" : "bg-white",
                              hasError && "bg-red-50/30"
                            )}
                          >
                            <div className="px-3 py-2.5 flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={line.selected}
                                onChange={() => toggleLineSelected(line.id)}
                                className="rounded border-slate-300 text-[#0B01D0] focus:ring-[#0B01D0]/20"
                              />
                            </div>
                            <div className="px-3 py-2.5">
                              <span className="text-[12px] text-slate-700 pl-4">{line.lineLabel}</span>
                              {hasError && (
                                <p className="text-[10px] text-red-600 mt-0.5 pl-4 flex items-center gap-1">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  {validationErrors[line.id]}
                                </p>
                              )}
                            </div>
                            <div className="px-3 py-2.5 text-[12px] text-slate-600 text-right">
                              {context === "budget" ? formatCurrency(line.currentBaseline) : `${line.currentBaseline} hrs`}
                            </div>
                            <div className="px-3 py-2.5 text-[12px] text-slate-400 text-right">
                              {context === "budget" ? formatCurrency(line.committed) : `${line.committed} hrs`}
                            </div>
                            <div className="px-3 py-2.5 flex justify-end">
                              {line.selected ? (
                                <input
                                  type="number"
                                  min={0}
                                  value={line.proposedValue}
                                  onChange={e => updateProposedValue(line.id, Math.max(0, parseFloat(e.target.value) || 0))}
                                  className={cn(
                                    "w-[100px] px-2 py-1 border rounded text-[12px] text-right focus:outline-none focus:ring-1",
                                    hasError
                                      ? "border-red-300 focus:ring-red-300 bg-red-50"
                                      : "border-slate-300 focus:ring-[#0B01D0]/30 focus:border-[#0B01D0]"
                                  )}
                                />
                              ) : (
                                <span className="text-[12px] text-slate-300">—</span>
                              )}
                            </div>
                            <div className="px-3 py-2.5 text-[12px] text-right font-medium">
                              {line.selected ? (
                                <span className={variance > 0 ? "text-red-600" : variance < 0 ? "text-emerald-600" : "text-slate-400"}>
                                  {variance > 0 ? "+" : ""}{context === "budget" ? formatCurrency(variance) : `${variance} hrs`}
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Totals Row */}
                {selectedLines.length > 0 && (
                  <div className="grid grid-cols-[40px_1fr_120px_120px_120px_100px] gap-0 bg-slate-100 border-t-2 border-slate-300">
                    <div className="px-3 py-3" />
                    <div className="px-3 py-3 text-[12px] font-semibold text-slate-900">
                      Total ({selectedLines.length} line{selectedLines.length !== 1 ? "s" : ""} selected)
                    </div>
                    <div className="px-3 py-3 text-[12px] font-semibold text-slate-900 text-right">
                      {context === "budget" ? formatCurrency(totalCurrentBaseline) : `${totalCurrentBaseline} hrs`}
                    </div>
                    <div className="px-3 py-3" />
                    <div className="px-3 py-3 text-[12px] font-semibold text-slate-900 text-right">
                      {context === "budget" ? formatCurrency(totalProposed) : `${totalProposed} hrs`}
                    </div>
                    <div className="px-3 py-3 text-[12px] font-semibold text-right">
                      <span className={netVariance > 0 ? "text-red-600" : netVariance < 0 ? "text-emerald-600" : "text-slate-600"}>
                        {netVariance > 0 ? "+" : ""}{context === "budget" ? formatCurrency(netVariance) : `${netVariance} hrs`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Approval Routing Info */}
            {selectedLines.length > 0 && (
              <div className={cn(
                "flex items-start gap-3 p-4 rounded-lg border",
                approvalTier.includes("Tier 2") ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"
              )}>
                <Shield className={cn("w-5 h-5 mt-0.5 flex-shrink-0", approvalTier.includes("Tier 2") ? "text-amber-600" : "text-blue-600")} />
                <div>
                  <p className={cn("text-[12px] font-semibold", approvalTier.includes("Tier 2") ? "text-amber-900" : "text-blue-900")}>
                    Approval Route: {approvalTier}
                  </p>
                  <p className={cn("text-[11px] mt-0.5", approvalTier.includes("Tier 2") ? "text-amber-700" : "text-blue-700")}>
                    {approvalTier.includes("Tier 2")
                      ? `This CR requires Finance Director approval because ${netVariance > 0 ? `the net budget variance is +${formatCurrency(netVariance)}` : `the timeline extension exceeds 30 days (${timelineExtensionDays} days)`}.`
                      : "This CR is a budget-neutral reallocation and will be routed to the Program Head for approval."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Review Step */
          <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-[11px] text-slate-500 mb-0.5">Type</p>
                <p className="text-[13px] font-semibold text-slate-900">{crType}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-[11px] text-slate-500 mb-0.5">Lines Modified</p>
                <p className="text-[13px] font-semibold text-slate-900">{selectedLines.length}</p>
              </div>
              <div className={cn("rounded-lg p-3 border", netVariance === 0 ? "bg-blue-50 border-blue-200" : netVariance > 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200")}>
                <p className="text-[11px] text-slate-500 mb-0.5">Net Variance</p>
                <p className={cn("text-[13px] font-semibold", netVariance === 0 ? "text-blue-900" : netVariance > 0 ? "text-red-700" : "text-emerald-700")}>
                  {netVariance > 0 ? "+" : ""}{context === "budget" ? formatCurrency(netVariance) : `${netVariance} hrs`}
                </p>
              </div>
              <div className={cn("rounded-lg p-3 border", approvalTier.includes("Tier 2") ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200")}>
                <p className="text-[11px] text-slate-500 mb-0.5">Approval Route</p>
                <p className={cn("text-[13px] font-semibold", approvalTier.includes("Tier 2") ? "text-amber-900" : "text-blue-900")}>{approvalTier}</p>
              </div>
            </div>

            {/* Justification */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-[11px] text-slate-500 mb-1">Justification</p>
              <p className="text-[12px] text-slate-800">{justification}</p>
            </div>

            {/* Delta Summary Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-blue-800 grid grid-cols-[1fr_120px_120px_100px] gap-0">
                <div className="px-4 py-2.5 text-[11px] font-semibold text-white">Line Item</div>
                <div className="px-4 py-2.5 text-[11px] font-semibold text-white text-right">Current</div>
                <div className="px-4 py-2.5 text-[11px] font-semibold text-white text-right">Proposed</div>
                <div className="px-4 py-2.5 text-[11px] font-semibold text-white text-right">Variance</div>
              </div>
              {selectedLines.map((line, idx) => {
                const variance = line.proposedValue - line.currentBaseline;
                return (
                  <div key={line.id} className={cn("grid grid-cols-[1fr_120px_120px_100px] gap-0 border-b border-slate-100", idx % 2 === 1 && "bg-slate-50/50")}>
                    <div className="px-4 py-2.5">
                      <p className="text-[12px] text-slate-900">{line.lineLabel}</p>
                      <p className="text-[11px] text-slate-400">{line.phase}</p>
                    </div>
                    <div className="px-4 py-2.5 text-[12px] text-slate-600 text-right">
                      {context === "budget" ? formatCurrency(line.currentBaseline) : `${line.currentBaseline} hrs`}
                    </div>
                    <div className="px-4 py-2.5 text-[12px] text-slate-900 text-right font-medium">
                      {context === "budget" ? formatCurrency(line.proposedValue) : `${line.proposedValue} hrs`}
                    </div>
                    <div className="px-4 py-2.5 text-[12px] text-right font-medium">
                      <span className={variance > 0 ? "text-red-600" : variance < 0 ? "text-emerald-600" : "text-slate-400"}>
                        {variance > 0 ? "+" : ""}{context === "budget" ? formatCurrency(variance) : `${variance} hrs`}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="grid grid-cols-[1fr_120px_120px_100px] gap-0 bg-slate-100 border-t-2 border-slate-300">
                <div className="px-4 py-2.5 text-[12px] font-semibold text-slate-900">Total</div>
                <div className="px-4 py-2.5 text-[12px] font-semibold text-slate-900 text-right">
                  {context === "budget" ? formatCurrency(totalCurrentBaseline) : `${totalCurrentBaseline} hrs`}
                </div>
                <div className="px-4 py-2.5 text-[12px] font-semibold text-slate-900 text-right">
                  {context === "budget" ? formatCurrency(totalProposed) : `${totalProposed} hrs`}
                </div>
                <div className="px-4 py-2.5 text-[12px] font-semibold text-right">
                  <span className={netVariance > 0 ? "text-red-600" : netVariance < 0 ? "text-emerald-600" : "text-slate-600"}>
                    {netVariance > 0 ? "+" : ""}{context === "budget" ? formatCurrency(netVariance) : `${netVariance} hrs`}
                  </span>
                </div>
              </div>
            </div>

            {/* Version note */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <History className="w-4 h-4 text-slate-500" />
              <p className="text-[12px] text-slate-600">
                Upon approval, the current baseline (<strong>v{MOCK_VERSIONS.length}.0</strong>) will be archived and the active baseline will be updated to <strong>v{MOCK_VERSIONS.length + 1}.0</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            {step === "form" ? (
              <button
                onClick={() => setStep("review")}
                disabled={!isFormValid}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors",
                  isFormValid
                    ? "bg-[#0B01D0] text-white hover:bg-[#0a01b8]"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                Review Change Request
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[13px] font-medium"
              >
                <Send className="w-4 h-4" />
                Submit for Approval
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
