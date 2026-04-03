import { useState, useMemo } from "react";
import {
  ArrowLeft, Upload, Link as LinkIcon, Save, ChevronDown,
  Target, BarChart3, Layers, ClipboardList, FileText, Calendar,
  Info, Plus, Trash2, CheckCircle2, AlertCircle, X, Eye, Check,
  Edit3
} from "lucide-react";
import { cn } from "../lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

type AssignmentLevel = "Project" | "Phase" | "Deliverable" | "Task";

interface Phase {
  number: number;
  name: string;
  tasks: { id: string; name: string }[];
}

interface Deliverable {
  id: string;
  title: string;
}

interface DocumentDetailsInputProps {
  onBack: () => void;
  documentTitle: string;
  projectName?: string;
  phases?: Phase[];
  deliverables?: Deliverable[];
}

/* ═══════════════════════════════════════════════════════════════════════════════
   FALLBACK DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const DEFAULT_PHASES: Phase[] = [
  { number: 1, name: "Procurement & Contracting", tasks: [
    { id: "T1-1", name: "Draft Request for Proposals (RFP)" },
    { id: "T1-2", name: "Evaluate Vendor Submissions" },
    { id: "T1-3", name: "Finalize Service Agreements" },
  ]},
  { number: 2, name: "Implementation", tasks: [
    { id: "T2-1", name: "Coordinate Field Data Collection" },
    { id: "T2-2", name: "Conduct Stakeholder Engagement Sessions" },
    { id: "T2-3", name: "Procure IT Equipment" },
  ]},
  { number: 3, name: "Quality Assurance", tasks: [
    { id: "T3-1", name: "Conduct Internal Peer Review of Draft" },
    { id: "T3-2", name: "Run Data Validation Checks" },
  ]},
  { number: 4, name: "Reporting", tasks: [
    { id: "T4-1", name: "Submit Final Technical Report" },
    { id: "T4-2", name: "Compile Lessons Learned" },
  ]},
  { number: 5, name: "Dissemination", tasks: [
    { id: "T5-1", name: "Plan Distribution Channels" },
    { id: "T5-2", name: "Conduct Stakeholder Workshops" },
  ]},
];

const DEFAULT_DELIVERABLES: Deliverable[] = [
  { id: "d1", title: "Baseline Study Report" },
  { id: "d2", title: "Stakeholder Consultation Summary" },
  { id: "d3", title: "Final Policy Recommendations" },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export function DocumentDetailsInput({
  onBack,
  documentTitle,
  projectName = "Youth Employment Skills Development",
  phases: propPhases,
  deliverables: propDeliverables,
}: DocumentDetailsInputProps) {
  const phases = propPhases ?? DEFAULT_PHASES;
  const deliverables = propDeliverables ?? DEFAULT_DELIVERABLES;

  // Form state
  const [indicatorName, setIndicatorName] = useState("");
  const [definition, setDefinition] = useState("");
  const [indicatorLevel, setIndicatorLevel] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [framework, setFramework] = useState("");
  const [linkedOutcome, setLinkedOutcome] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [reportingFrequency, setReportingFrequency] = useState("");
  const [pirsFile, setPirsFile] = useState<File | null>(null);
  const [pirsLink, setPirsLink] = useState("");
  const [baselineValue, setBaselineValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");

  // Assignment level state
  const [assignmentLevel, setAssignmentLevel] = useState<AssignmentLevel>("Task");
  const [assignedTo, setAssignedTo] = useState("");

  // Review confirmation state
  const [showReview, setShowReview] = useState(false);

  // Computed options for cascading dropdown
  const allTasks = useMemo(() => phases.flatMap(p => p.tasks.map(t => ({ id: t.id, name: t.name }))), [phases]);
  const phaseNames = useMemo(() => phases.map(p => p.name), [phases]);
  const deliverableNames = useMemo(() => deliverables.map(d => d.title), [deliverables]);

  const getAssignmentOptions = (level: AssignmentLevel): string[] => {
    switch (level) {
      case "Project": return [projectName];
      case "Phase": return phaseNames;
      case "Deliverable": return deliverableNames;
      case "Task": return allTasks.map(t => t.name);
    }
  };

  const getAssignmentLabel = (level: AssignmentLevel): string => {
    switch (level) {
      case "Project": return "Assigned Project";
      case "Phase": return "Assigned Phase";
      case "Deliverable": return "Assigned Deliverable";
      case "Task": return "Assigned Task";
    }
  };

  const getAssignmentPlaceholder = (level: AssignmentLevel): string => {
    switch (level) {
      case "Project": return projectName;
      case "Phase": return "Select a phase...";
      case "Deliverable": return "Select a deliverable...";
      case "Task": return "Select a task...";
    }
  };

  const handleAssignmentLevelChange = (level: AssignmentLevel) => {
    setAssignmentLevel(level);
    setAssignedTo(level === "Project" ? projectName : "");
  };

  const isProjectLevel = indicatorLevel === "Project Level Indicator (Donor Requirement)";

  const handleSave = () => {
    console.log("Saving MEL indicator...", {
      indicatorName, definition, indicatorLevel, assignmentLevel, assignedTo,
      framework, linkedOutcome, unitOfMeasure, dataSource, reportingFrequency,
      baselineValue, targetValue, startDate, targetDate,
    });
    onBack();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPirsFile(e.target.files[0]);
    }
  };

  // Completion tracker
  const completedFields = [
    indicatorName, assignedTo || (assignmentLevel === "Project" ? projectName : ""),
    indicatorLevel, framework, unitOfMeasure, dataSource, reportingFrequency,
    baselineValue, targetValue, startDate, targetDate,
  ].filter(Boolean).length;
  const totalFields = 11;
  const completionPct = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-[13px] font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-[16px] font-semibold text-slate-900">{documentTitle}</h1>
              <p className="text-[11px] text-slate-400">Define indicators, targets, and measurement methodology</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Completion indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    completionPct >= 80 ? "bg-emerald-500" : completionPct >= 50 ? "bg-blue-500" : "bg-amber-400"
                  )}
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{completionPct}%</span>
            </div>

            <button
              onClick={() => setShowReview(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium"
            >
              <Eye size={14} />
              Review & Save
            </button>
          </div>
        </div>
      </div>

      {/* ── Form Content ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">

          {/* ───────────────────────────────────────────────────────────────
              SECTION 1: BASIC INFORMATION
              ─────────────────────────────────────────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                <Target size={13} className="text-[#0B01D0]" />
              </div>
              <h2 className="text-[13px] font-semibold text-slate-800">Basic Information</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Indicator Name */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Indicator Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={indicatorName}
                  onChange={e => setIndicatorName(e.target.value)}
                  placeholder="e.g., Number of policy briefs cited in media"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 transition-colors"
                />
              </div>

              {/* Indicator ID */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Indicator ID
                </label>
                <input
                  type="text"
                  value="IND-006"
                  disabled
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-50 text-slate-500 font-mono outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Auto-generated identifier</p>
              </div>

              {/* ── Assignment Level + Assigned To (cascading) ───────────── */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Layers size={13} className="text-indigo-600" />
                  <p className="text-[10px] text-indigo-700 uppercase tracking-widest font-semibold">Assignment</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Level Selector */}
                  <div>
                    <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                      Level <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={assignmentLevel}
                        onChange={e => handleAssignmentLevelChange(e.target.value as AssignmentLevel)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                      >
                        <option value="Project">Project</option>
                        <option value="Phase">Phase</option>
                        <option value="Deliverable">Deliverable</option>
                        <option value="Task">Task</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Assigned To (dynamic based on level) */}
                  <div>
                    <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                      {getAssignmentLabel(assignmentLevel)} <span className="text-red-400">*</span>
                    </label>
                    {assignmentLevel === "Project" ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={projectName}
                          readOnly
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] bg-slate-100 text-slate-700 cursor-not-allowed outline-none font-medium"
                        />
                        <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={assignedTo}
                          onChange={e => setAssignedTo(e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                        >
                          <option value="">{getAssignmentPlaceholder(assignmentLevel)}</option>
                          {getAssignmentOptions(assignmentLevel).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Context hint */}
                <div className="flex items-start gap-2 mt-1">
                  <Info size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-indigo-500 leading-relaxed">
                    {assignmentLevel === "Project"
                      ? "This indicator will be tracked at the overall project level and auto-assigned to the current project."
                      : assignmentLevel === "Phase"
                      ? "Select a project phase to link this indicator to specific phase-level outcomes."
                      : assignmentLevel === "Deliverable"
                      ? "Link this indicator to a specific deliverable for deliverable-level tracking."
                      : "Associate this indicator with a specific task for granular task-level monitoring."
                    }
                  </p>
                </div>
              </div>

              {/* Definition */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Definition (Description)
                </label>
                <textarea
                  value={definition}
                  onChange={e => setDefinition(e.target.value)}
                  placeholder='Define exactly what counts as a "citation" here...'
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 resize-none"
                />
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────────
              SECTION 2: CLASSIFICATION & STRATEGY
              ─────────────────────────────────────���───────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                <BarChart3 size={13} className="text-purple-600" />
              </div>
              <h2 className="text-[13px] font-semibold text-slate-800">Classification & Strategy</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Indicator Level */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Indicator Level <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={indicatorLevel}
                    onChange={e => setIndicatorLevel(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                  >
                    <option value="">Select level...</option>
                    <option value="Project Level Indicator (Donor Requirement)">
                      Project Level Indicator (Donor Requirement)
                    </option>
                    <option value="Institutional KPI">Institutional KPI</option>
                    <option value="Program Level Indicator">Program Level Indicator</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Conditional: Select Project */}
              {isProjectLevel && (
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Select Project
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProject}
                      onChange={e => setSelectedProject(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                    >
                      <option value="">Select project...</option>
                      <option value="Youth Employment Program (YEP)">Youth Employment Program (YEP)</option>
                      <option value="Digital Literacy Initiative">Digital Literacy Initiative</option>
                      <option value="Community Health Project">Community Health Project</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Framework Link */}
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Framework Link <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={framework}
                      onChange={e => setFramework(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                    >
                      <option value="">Select framework...</option>
                      <option value="Theory of Change">Theory of Change</option>
                      <option value="Logical Framework">Logical Framework</option>
                      <option value="Results Framework">Results Framework</option>
                      <option value="Project Impact Assessment">Project Impact Assessment</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Linked Outcome/Output */}
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Linked Outcome / Output
                  </label>
                  <input
                    type="text"
                    value={linkedOutcome}
                    onChange={e => setLinkedOutcome(e.target.value)}
                    placeholder="e.g., Outcome 2: Increased digital literacy"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────────
              SECTION 3: MEASUREMENT RULES (PIRS)
              ─────────────────────────────────────────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                <ClipboardList size={13} className="text-emerald-600" />
              </div>
              <h2 className="text-[13px] font-semibold text-slate-800">Measurement Rules (PIRS)</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {/* Unit of Measure */}
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Unit of Measure
                  </label>
                  <div className="relative">
                    <select
                      value={unitOfMeasure}
                      onChange={e => setUnitOfMeasure(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                    >
                      <option value="">Select unit...</option>
                      <option value="Number (#)">Number (#)</option>
                      <option value="Percentage (%)">Percentage (%)</option>
                      <option value="Score (1-5)">Score (1-5)</option>
                      <option value="Currency ($)">Currency ($)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Data Source */}
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Data Source
                  </label>
                  <div className="relative">
                    <select
                      value={dataSource}
                      onChange={e => setDataSource(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                    >
                      <option value="">Select source...</option>
                      <option value="Survey / Impact Assessment">Survey / Impact Assessment</option>
                      <option value="Administrative Data">Administrative Data</option>
                      <option value="Third-party Evaluation">Third-party Evaluation</option>
                      <option value="Field Reports">Field Reports</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Reporting Frequency */}
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Reporting Frequency
                  </label>
                  <div className="relative">
                    <select
                      value={reportingFrequency}
                      onChange={e => setReportingFrequency(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20 bg-white cursor-pointer appearance-none pr-8"
                    >
                      <option value="">Select frequency...</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Semi-Annually">Semi-Annually</option>
                      <option value="Annually">Annually</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* PIRS Upload */}
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Performance Indicator Reference Sheet (PIRS)
                </label>
                <p className="text-[10px] text-slate-400 mb-2">
                  Attach the technical methodology document
                </p>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors group">
                    <Upload size={14} className="text-slate-400 group-hover:text-slate-600" />
                    <span className="text-[12px] text-slate-600">
                      {pirsFile ? pirsFile.name : "Upload File"}
                    </span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">or</span>
                  <div className="flex-1 relative">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={pirsLink}
                      onChange={e => setPirsLink(e.target.value)}
                      placeholder="Paste Link"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────────
              SECTION 4: BENCHMARKS
              ─────────────────��───────────────────────────────────────────── */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                <Calendar size={13} className="text-amber-600" />
              </div>
              <h2 className="text-[13px] font-semibold text-slate-800">Benchmarks</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Baseline and Target Values */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Baseline Value (Start)
                  </label>
                  <input
                    type="number"
                    value={baselineValue}
                    onChange={e => setBaselineValue(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Target Value (Goal)
                  </label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={e => setTargetValue(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                  />
                </div>
              </div>

              {/* Start Date and Target Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 outline-none focus:border-[#0B01D0] focus:ring-1 focus:ring-[#0B01D0]/20"
                  />
                </div>
              </div>

              {/* Visual preview when both values are set */}
              {baselineValue && targetValue && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Target Progress Preview</span>
                    <span className="text-[11px] text-slate-500">0 / {Number(targetValue).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: "0%" }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-slate-400">Baseline: {Number(baselineValue).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">Target: {Number(targetValue).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          REVIEW CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowReview(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#0B01D0]/5 to-indigo-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B01D0]/10 flex items-center justify-center">
                  <Eye size={16} className="text-[#0B01D0]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Review Indicator</h2>
                  <p className="text-[11px] text-slate-500">Verify all details before saving</p>
                </div>
              </div>
              <button
                onClick={() => setShowReview(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">

              {/* Section: Basic Information */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-[#0B01D0]/10 flex items-center justify-center">
                    <Target size={11} className="text-[#0B01D0]" />
                  </div>
                  <h3 className="text-[12px] text-slate-900 font-semibold uppercase tracking-wider">Basic Information</h3>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Indicator Name" value={indicatorName} required />
                  <ReviewRow label="Indicator ID" value="IND-006" />
                  <ReviewRow label="Assignment Level" value={assignmentLevel} />
                  <ReviewRow label={getAssignmentLabel(assignmentLevel)} value={assignmentLevel === "Project" ? projectName : assignedTo} required />
                  <ReviewRow label="Definition" value={definition} multiline />
                </div>
              </div>

              {/* Section: Classification & Strategy */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-purple-50 flex items-center justify-center">
                    <BarChart3 size={11} className="text-purple-600" />
                  </div>
                  <h3 className="text-[12px] text-slate-900 font-semibold uppercase tracking-wider">Classification & Strategy</h3>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Indicator Level" value={indicatorLevel} required />
                  {isProjectLevel && <ReviewRow label="Select Project" value={selectedProject} />}
                  <ReviewRow label="Framework Link" value={framework} required />
                  <ReviewRow label="Linked Outcome / Output" value={linkedOutcome} />
                </div>
              </div>

              {/* Section: Measurement Rules */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                    <ClipboardList size={11} className="text-emerald-600" />
                  </div>
                  <h3 className="text-[12px] text-slate-900 font-semibold uppercase tracking-wider">Measurement Rules (PIRS)</h3>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Unit of Measure" value={unitOfMeasure} />
                  <ReviewRow label="Data Source" value={dataSource} />
                  <ReviewRow label="Reporting Frequency" value={reportingFrequency} />
                  <ReviewRow label="PIRS Document" value={pirsFile?.name || pirsLink || ""} />
                </div>
              </div>

              {/* Section: Benchmarks */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center">
                    <Calendar size={11} className="text-amber-600" />
                  </div>
                  <h3 className="text-[12px] text-slate-900 font-semibold uppercase tracking-wider">Benchmarks</h3>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                  <ReviewRow label="Baseline Value" value={baselineValue ? Number(baselineValue).toLocaleString() : ""} />
                  <ReviewRow label="Target Value" value={targetValue ? Number(targetValue).toLocaleString() : ""} />
                  <ReviewRow label="Start Date" value={startDate ? new Date(startDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""} />
                  <ReviewRow label="Target Date" value={targetDate ? new Date(targetDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""} />
                </div>
              </div>

              {/* Completion summary */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-[11px] text-slate-500 mb-1.5">Form Completion</p>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        completionPct >= 80 ? "bg-emerald-500" : completionPct >= 50 ? "bg-blue-500" : "bg-amber-400"
                      )}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
                <span className={cn(
                  "text-[13px] font-semibold",
                  completionPct >= 80 ? "text-emerald-600" : completionPct >= 50 ? "text-blue-600" : "text-amber-600"
                )}>
                  {completionPct}%
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                onClick={() => setShowReview(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-white hover:border-slate-300 transition-colors font-medium"
              >
                <Edit3 size={13} />
                Go Back & Edit
              </button>
              <button
                onClick={() => { setShowReview(false); handleSave(); }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0B01D0] text-white rounded-lg hover:bg-[#0a01b8] transition-colors text-[12px] font-medium"
              >
                <Check size={14} />
                Confirm & Save Indicator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   REVIEW ROW COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

function ReviewRow({ label, value, required, multiline }: {
  label: string;
  value: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const isEmpty = !value || value.trim() === "";

  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <div className="w-[160px] shrink-0 flex items-center gap-1">
        <span className="text-[11px] text-slate-500">{label}</span>
        {required && isEmpty && (
          <AlertCircle size={11} className="text-amber-500 shrink-0" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {isEmpty ? (
          <span className="text-[12px] text-slate-400 italic">Not provided</span>
        ) : multiline ? (
          <p className="text-[12px] text-slate-800 leading-relaxed whitespace-pre-wrap">{value}</p>
        ) : (
          <span className="text-[12px] text-slate-800">{value}</span>
        )}
      </div>
      {!isEmpty && (
        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
      )}
    </div>
  );
}