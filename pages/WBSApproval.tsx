import { useState } from "react";
import {
  Search,
  ArrowLeft,
  Eye,
  CheckCircle,
  Flag,
  X,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  Layers,
  AlertTriangle,
  ListChecks,
  FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WBSTask {
  id: string;
  name: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  hours: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: string;
}

interface WBSDeliverable {
  id: string;
  name: string;
  tasks: WBSTask[];
}

interface WBSPhase {
  id: string;
  name: string;
  color: string;
  isMandatory: boolean;
  description: string;
  deliverables: WBSDeliverable[];
}

interface WBSSubmission {
  id: string;
  projectName: string;
  projectManager: string;
  program: string;
  stage: string;
  submittedDate: string;
  totalPhases: number;
  totalDeliverables: number;
  totalTasks: number;
  approvalStatus: "Pending Review" | "Approved" | "Flagged";
  flagReason?: string;
  phases: WBSPhase[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const wbsSubmissions: WBSSubmission[] = [
  {
    id: "WBS-001",
    projectName: "Healthcare System Strengthening Project",
    projectManager: "Ama Serwaa",
    program: "Youth & Social Development Program",
    stage: "Inception & Planning",
    submittedDate: "Feb 25, 2026",
    totalPhases: 7,
    totalDeliverables: 12,
    totalTasks: 18,
    approvalStatus: "Pending Review",
    phases: [
      {
        id: "p1", name: "Procurement & Contracting", color: "bg-amber-500", isMandatory: false,
        description: "Manage procurement processes, vendor selection, and contract management.",
        deliverables: [
          { id: "d1-1", name: "RFP Document", tasks: [
            { id: "t1", name: "Draft Request for Proposals (RFP)", assignedTo: "Yaw Osei", startDate: "Jan 20, 2026", endDate: "Feb 10, 2026", hours: 80, priority: "High", status: "Completed" },
            { id: "t2", name: "Evaluate Vendor Submissions", assignedTo: "Kofi Mensah", startDate: "Feb 01, 2026", endDate: "Feb 28, 2026", hours: 100, priority: "High", status: "Completed" },
          ]},
          { id: "d1-2", name: "Service Agreements", tasks: [
            { id: "t3", name: "Finalize Service Agreements", assignedTo: "Ama Darko", startDate: "Jan 15, 2026", endDate: "Feb 15, 2026", hours: 120, priority: "Medium", status: "Completed" },
          ]},
        ],
      },
      {
        id: "p2", name: "Implementation", color: "bg-blue-500", isMandatory: true,
        description: "Execute core project activities, coordinate field operations, and manage deliverables.",
        deliverables: [
          { id: "d2-1", name: "Stakeholder Engagement Report", tasks: [
            { id: "t4", name: "Conduct Stakeholder Engagement Sessions", assignedTo: "Kofi Mensah", startDate: "Feb 15, 2026", endDate: "Mar 15, 2026", hours: 120, priority: "Critical", status: "In Progress" },
          ]},
          { id: "d2-2", name: "Field Data Package", tasks: [
            { id: "t5", name: "Coordinate Field Data Collection", assignedTo: "Yaw Osei", startDate: "Mar 01, 2026", endDate: "Mar 20, 2026", hours: 100, priority: "Critical", status: "In Progress" },
          ]},
        ],
      },
      {
        id: "p3", name: "Quality Assurance", color: "bg-emerald-500", isMandatory: true,
        description: "Ensure project outputs meet defined quality standards through reviews, testing, and validation.",
        deliverables: [
          { id: "d3-1", name: "Peer Review Report", tasks: [
            { id: "t6", name: "Conduct Internal Peer Review of Draft", assignedTo: "Yaw Osei", startDate: "Apr 01, 2026", endDate: "Apr 15, 2026", hours: 60, priority: "High", status: "Not Started" },
            { id: "t7", name: "Run Data Validation Checks", assignedTo: "Ama Darko", startDate: "Apr 10, 2026", endDate: "Apr 25, 2026", hours: 80, priority: "High", status: "Not Started" },
          ]},
        ],
      },
      {
        id: "p4", name: "Production & Editorial", color: "bg-violet-500", isMandatory: true,
        description: "Manage content creation, design, editing, and production of project materials.",
        deliverables: [
          { id: "d4-1", name: "Final Publication", tasks: [
            { id: "t8", name: "Complete Editorial Review", assignedTo: "Kwesi Appiah", startDate: "Feb 20, 2026", endDate: "Mar 10, 2026", hours: 90, priority: "High", status: "In Progress" },
            { id: "t9", name: "Design and Layout Report", assignedTo: "Kofi Mensah", startDate: "Mar 10, 2026", endDate: "Apr 05, 2026", hours: 40, priority: "Medium", status: "Not Started" },
          ]},
        ],
      },
      {
        id: "p5", name: "Dissemination", color: "bg-cyan-500", isMandatory: false,
        description: "Plan and execute the distribution and sharing of project outputs and findings.",
        deliverables: [
          { id: "d5-1", name: "Distribution Plan", tasks: [
            { id: "t10", name: "Plan Distribution Channels", assignedTo: "Kwesi Appiah", startDate: "Apr 15, 2026", endDate: "Apr 30, 2026", hours: 70, priority: "Medium", status: "Not Started" },
            { id: "t11", name: "Conduct Stakeholder Workshops", assignedTo: "Nana Yaw", startDate: "Apr 20, 2026", endDate: "May 05, 2026", hours: 80, priority: "High", status: "Not Started" },
          ]},
        ],
      },
      {
        id: "p6", name: "Reporting", color: "bg-indigo-500", isMandatory: true,
        description: "Compile progress reports, financial reports, and donor reporting requirements.",
        deliverables: [
          { id: "d6-1", name: "Final Reports Package", tasks: [
            { id: "t12", name: "Compile Lessons Learned", assignedTo: "Nana Yaw", startDate: "May 06, 2026", endDate: "May 15, 2026", hours: 60, priority: "Critical", status: "Not Started" },
            { id: "t13", name: "Submit Final Technical Report", assignedTo: "Kofi Mensah", startDate: "May 01, 2026", endDate: "May 10, 2026", hours: 20, priority: "Low", status: "Not Started" },
          ]},
        ],
      },
      {
        id: "p7", name: "Delivery Stage Complete (Checkpoint)", color: "bg-rose-500", isMandatory: true,
        description: "Final review checkpoint to verify all deliverables are complete.",
        deliverables: [
          { id: "d7-1", name: "Sign-off Package", tasks: [
            { id: "t14", name: "Sign-off and Handover", assignedTo: "Kwaku Anane", startDate: "May 01, 2026", endDate: "May 20, 2026", hours: 100, priority: "Critical", status: "Not Started" },
          ]},
        ],
      },
    ],
  },
  {
    id: "WBS-002",
    projectName: "Urban Infrastructure Development Plan",
    projectManager: "Yaw Osei",
    program: "Infrastructure & Development",
    stage: "Inception & Planning",
    submittedDate: "Feb 28, 2026",
    totalPhases: 5,
    totalDeliverables: 8,
    totalTasks: 14,
    approvalStatus: "Pending Review",
    phases: [
      {
        id: "p1b", name: "Procurement & Contracting", color: "bg-amber-500", isMandatory: false,
        description: "Manage procurement processes for infrastructure project.",
        deliverables: [
          { id: "d1b-1", name: "Contractor Selection Package", tasks: [
            { id: "t1b", name: "Issue Tender for Civil Works", assignedTo: "Yaw Osei", startDate: "Mar 01, 2026", endDate: "Mar 20, 2026", hours: 60, priority: "High", status: "Not Started" },
            { id: "t2b", name: "Evaluate Contractor Bids", assignedTo: "Kwame Asante", startDate: "Mar 25, 2026", endDate: "Apr 10, 2026", hours: 80, priority: "High", status: "Not Started" },
          ]},
        ],
      },
      {
        id: "p2b", name: "Implementation", color: "bg-blue-500", isMandatory: true,
        description: "Execute construction and infrastructure delivery activities.",
        deliverables: [
          { id: "d2b-1", name: "Site Survey Report", tasks: [
            { id: "t3b", name: "Conduct Site Surveys", assignedTo: "Nana Yaw", startDate: "Apr 15, 2026", endDate: "May 05, 2026", hours: 120, priority: "Critical", status: "Not Started" },
          ]},
          { id: "d2b-2", name: "Foundation Works Completion", tasks: [
            { id: "t4b", name: "Supervise Foundation Works", assignedTo: "Yaw Osei", startDate: "May 10, 2026", endDate: "Jun 30, 2026", hours: 200, priority: "Critical", status: "Not Started" },
          ]},
        ],
      },
      {
        id: "p3b", name: "Quality Assurance", color: "bg-emerald-500", isMandatory: true,
        description: "Quality inspections and compliance checks.",
        deliverables: [
          { id: "d3b-1", name: "Inspection Reports", tasks: [
            { id: "t5b", name: "Structural Integrity Inspections", assignedTo: "Kwesi Appiah", startDate: "Jul 01, 2026", endDate: "Jul 15, 2026", hours: 60, priority: "High", status: "Not Started" },
          ]},
        ],
      },
      {
        id: "p4b", name: "Reporting", color: "bg-indigo-500", isMandatory: true,
        description: "Progress and compliance reporting.",
        deliverables: [
          { id: "d4b-1", name: "Monthly Progress Reports", tasks: [
            { id: "t6b", name: "Compile Monthly Site Reports", assignedTo: "Ama Darko", startDate: "Apr 01, 2026", endDate: "Aug 31, 2026", hours: 80, priority: "Medium", status: "Not Started" },
          ]},
        ],
      },
      {
        id: "p5b", name: "Delivery Stage Complete (Checkpoint)", color: "bg-rose-500", isMandatory: true,
        description: "Final checkpoint for handover.",
        deliverables: [
          { id: "d5b-1", name: "Handover Package", tasks: [
            { id: "t7b", name: "Final Handover & Sign-off", assignedTo: "Yaw Osei", startDate: "Sep 01, 2026", endDate: "Sep 15, 2026", hours: 40, priority: "Critical", status: "Not Started" },
          ]},
        ],
      },
    ],
  },
  {
    id: "WBS-003",
    projectName: "West Africa Regional Integration Study",
    projectManager: "Yaw Osei",
    program: "West Africa Economic Development Program",
    stage: "Inception & Planning",
    submittedDate: "Mar 01, 2026",
    totalPhases: 6,
    totalDeliverables: 10,
    totalTasks: 16,
    approvalStatus: "Approved",
    phases: [],
  },
  {
    id: "WBS-004",
    projectName: "Climate Finance Readiness Program",
    projectManager: "Kwesi Appiah",
    program: "Sustainable Communities Initiative",
    stage: "Planning",
    submittedDate: "Mar 03, 2026",
    totalPhases: 5,
    totalDeliverables: 7,
    totalTasks: 11,
    approvalStatus: "Flagged",
    flagReason: "Phase durations exceed project timeline. Implementation phase overlaps with Reporting phase end dates. Please revise schedule.",
    phases: [],
  },
  {
    id: "WBS-005",
    projectName: "Sustainable Agriculture Development Initiative",
    projectManager: "Nana Yaw",
    program: "Sustainable Communities Initiative",
    stage: "Inception & Planning",
    submittedDate: "Mar 05, 2026",
    totalPhases: 7,
    totalDeliverables: 14,
    totalTasks: 22,
    approvalStatus: "Pending Review",
    phases: [],
  },
];

const tabs = ["All", "Pending Review", "Approved", "Flagged"] as const;
type TabType = (typeof tabs)[number];

// ─── Flag Modal ───────────────────────────────────────────────────────────────

function FlagModal({ projectName, onClose, onSubmit }: { projectName: string; onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            <h2 className="text-[15px] font-semibold text-slate-900">Flag WBS</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-[12px] text-slate-600 mb-3">
            Provide reasons for flagging the WBS for <span className="font-semibold text-slate-900">{projectName}</span>:
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reasons for flagging this WBS..."
            className="w-full h-28 px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
           
          />
        </div>
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
          <button
            onClick={() => { if (reason.trim()) onSubmit(reason.trim()); }}
            disabled={!reason.trim()}
            className="px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" />
            Flag WBS
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PHASE_LIGHT: Record<string, string> = {
  "bg-amber-500": "bg-amber-50 border-amber-200 text-amber-700",
  "bg-blue-500": "bg-blue-50 border-blue-200 text-blue-700",
  "bg-emerald-500": "bg-emerald-50 border-emerald-200 text-emerald-700",
  "bg-violet-500": "bg-violet-50 border-violet-200 text-violet-700",
  "bg-cyan-500": "bg-cyan-50 border-cyan-200 text-cyan-700",
  "bg-indigo-500": "bg-indigo-50 border-indigo-200 text-indigo-700",
  "bg-rose-500": "bg-rose-50 border-rose-200 text-rose-700",
};

const priorityStyle = (p: string) => {
  switch (p) {
    case "Critical": return "bg-red-100 text-red-700";
    case "High": return "bg-orange-100 text-orange-700";
    case "Medium": return "bg-yellow-100 text-yellow-700";
    default: return "bg-slate-100 text-slate-600";
  }
};

const statusBadge = (s: WBSSubmission["approvalStatus"]) => {
  switch (s) {
    case "Pending Review": return "bg-amber-100 text-amber-700";
    case "Approved": return "bg-green-100 text-green-700";
    case "Flagged": return "bg-red-100 text-red-700";
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function WBSApproval() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [submissions, setSubmissions] = useState(wbsSubmissions);
  const [selectedProject, setSelectedProject] = useState<WBSSubmission | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [flagModal, setFlagModal] = useState<WBSSubmission | null>(null);

  const filteredSubmissions = submissions.filter((s) => {
    const matchesTab = activeTab === "All" || s.approvalStatus === activeTab;
    const matchesSearch =
      s.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.projectManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<TabType, number> = {
    All: submissions.length,
    "Pending Review": submissions.filter((s) => s.approvalStatus === "Pending Review").length,
    Approved: submissions.filter((s) => s.approvalStatus === "Approved").length,
    Flagged: submissions.filter((s) => s.approvalStatus === "Flagged").length,
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      next.has(phaseId) ? next.delete(phaseId) : next.add(phaseId);
      return next;
    });
  };

  const handleApprove = (id: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, approvalStatus: "Approved" as const, flagReason: undefined } : s)));
    if (selectedProject?.id === id) setSelectedProject((prev) => prev ? { ...prev, approvalStatus: "Approved", flagReason: undefined } : null);
  };

  const handleFlag = (id: string, reason: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, approvalStatus: "Flagged" as const, flagReason: reason } : s)));
    if (selectedProject?.id === id) setSelectedProject((prev) => prev ? { ...prev, approvalStatus: "Flagged", flagReason: reason } : null);
    setFlagModal(null);
  };

  // ─── Detail View ────────────────────────────────────────────────────────

  if (selectedProject) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => { setSelectedProject(null); setExpandedPhases(new Set()); }} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900">{selectedProject.projectName}</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">{selectedProject.projectManager} • {selectedProject.program} • {selectedProject.stage}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusBadge(selectedProject.approvalStatus)}`}>
            {selectedProject.approvalStatus}
          </span>
        </div>

        {/* Summary strip */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-6 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span className="text-[12px] text-slate-600">Phases: <span className="font-semibold text-slate-900">{selectedProject.totalPhases}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-[12px] text-slate-600">Deliverables: <span className="font-semibold text-slate-900">{selectedProject.totalDeliverables}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] text-slate-600">Tasks: <span className="font-semibold text-slate-900">{selectedProject.totalTasks}</span></span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[12px] text-slate-500">Submitted: {selectedProject.submittedDate}</span>
          </div>
        </div>

        {/* Actions strip */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
          {selectedProject.approvalStatus !== "Approved" && (
            <>
              <button onClick={() => handleApprove(selectedProject.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Approve WBS
              </button>
              <button onClick={() => setFlagModal(selectedProject)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">
                <Flag className="w-4 h-4" />
                Flag WBS
              </button>
            </>
          )}
          {selectedProject.approvalStatus === "Flagged" && selectedProject.flagReason && (
            <div className="ml-4 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-red-700">{selectedProject.flagReason}</p>
            </div>
          )}
        </div>

        {/* Phases breakdown */}
        <div className="flex-1 overflow-auto p-6">
          {selectedProject.phases.length === 0 ? (
            <div className="text-center py-16 text-[13px] text-slate-400">No detailed WBS data available for this submission.</div>
          ) : (
            <div className="space-y-3">
              {selectedProject.phases.map((phase) => {
                const isExpanded = expandedPhases.has(phase.id);
                const lightClass = PHASE_LIGHT[phase.color] || "bg-slate-50 border-slate-200 text-slate-700";
                const totalTasks = phase.deliverables.reduce((sum, d) => sum + d.tasks.length, 0);
                return (
                  <div key={phase.id} className={`rounded-xl border ${lightClass.split(" ")[1]} bg-white overflow-hidden`}>
                    {/* Phase header */}
                    <button
                      onClick={() => togglePhase(phase.id)}
                      className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50/50 transition-colors`}
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                      <div className={`w-3 h-3 rounded-full ${phase.color} shrink-0`} />
                      <div className="flex-1 text-left">
                        <span className="text-[13px] font-semibold text-slate-900">{phase.name}</span>
                        {phase.isMandatory && <span className="ml-2 text-[10px] font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Mandatory</span>}
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span>{phase.deliverables.length} deliverable{phase.deliverables.length !== 1 ? "s" : ""}</span>
                        <span>{totalTasks} task{totalTasks !== 1 ? "s" : ""}</span>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-5 pb-4 border-t border-slate-100">
                        <p className="text-[11px] text-slate-500 py-3">{phase.description}</p>
                        {phase.deliverables.map((del) => (
                          <div key={del.id} className="mb-4 last:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[12px] font-semibold text-slate-800">{del.name}</span>
                            </div>
                            {/* Tasks table */}
                            <div className="overflow-auto rounded-lg border border-slate-200">
                              <table className="w-full">
                                <thead style={{ backgroundColor: "#0B01D0" }}>
                                  <tr>
                                    <th className="text-left px-3 py-2 text-white text-[11px] font-semibold">Task</th>
                                    <th className="text-left px-3 py-2 text-white text-[11px] font-semibold">Assigned To</th>
                                    <th className="text-left px-3 py-2 text-white text-[11px] font-semibold">Start</th>
                                    <th className="text-left px-3 py-2 text-white text-[11px] font-semibold">End</th>
                                    <th className="text-center px-3 py-2 text-white text-[11px] font-semibold">Hours</th>
                                    <th className="text-center px-3 py-2 text-white text-[11px] font-semibold">Priority</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {del.tasks.map((task, idx) => (
                                    <tr key={task.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                      <td className="px-3 py-2 text-[11px] text-slate-900">{task.name}</td>
                                      <td className="px-3 py-2 text-[11px] text-slate-600">{task.assignedTo}</td>
                                      <td className="px-3 py-2 text-[11px] text-slate-600">{task.startDate}</td>
                                      <td className="px-3 py-2 text-[11px] text-slate-600">{task.endDate}</td>
                                      <td className="px-3 py-2 text-center text-[11px] text-slate-900 font-medium">{task.hours}</td>
                                      <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle(task.priority)}`}>{task.priority}</span></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {flagModal && (
          <FlagModal
            projectName={flagModal.projectName}
            onClose={() => setFlagModal(null)}
            onSubmit={(reason) => handleFlag(flagModal.id, reason)}
          />
        )}
      </div>
    );
  }

  // ─── Table View ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-[18px] font-semibold text-slate-900">WBS Approval</h1>
        <p className="text-[12px] text-slate-500 mt-1">Review and approve Work Breakdown Structures submitted from project inception & planning</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[100px] flex items-center justify-center gap-1.5 ${
                activeTab === tab ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
             
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project, manager, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
           
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Project Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Project Manager</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Stage</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Submitted</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Phases</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Deliverables</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Tasks</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-[13px] text-slate-400">No WBS submissions found.</td></tr>
            ) : (
              filteredSubmissions.map((sub, index) => (
                <tr
                  key={sub.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  onClick={() => setSelectedProject(sub)}
                >
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium">{sub.id}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">{sub.projectName}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{sub.projectManager}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{sub.stage}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">{sub.submittedDate}</td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-900 font-medium">{sub.totalPhases}</td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-900 font-medium">{sub.totalDeliverables}</td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-900 font-medium">{sub.totalTasks}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusBadge(sub.approvalStatus)}`}>{sub.approvalStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedProject(sub); }} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700" title="View WBS">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}