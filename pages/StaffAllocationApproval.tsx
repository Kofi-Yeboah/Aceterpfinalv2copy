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
  Users,
  Briefcase,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskAssignment {
  id: string;
  taskName: string;
  phase: string;
  startDate: string;
  endDate: string;
  hours: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: string;
}

interface StaffMember {
  name: string;
  role: string;
  totalHours: number;
  totalTasks: number;
  utilization: number;
  tasks: TaskAssignment[];
}

interface StaffAllocationSubmission {
  id: string;
  projectName: string;
  projectManager: string;
  program: string;
  stage: string;
  submittedDate: string;
  totalStaff: number;
  totalHoursAllocated: number;
  avgUtilization: number;
  approvalStatus: "Pending Review" | "Approved" | "Flagged";
  flagReason?: string;
  staffMembers: StaffMember[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const staffSubmissions: StaffAllocationSubmission[] = [
  {
    id: "SA-001",
    projectName: "Healthcare System Strengthening Project",
    projectManager: "Ama Serwaa",
    program: "Youth & Social Development Program",
    stage: "Inception & Planning",
    submittedDate: "Feb 25, 2026",
    totalStaff: 6,
    totalHoursAllocated: 1120,
    avgUtilization: 65,
    approvalStatus: "Pending Review",
    staffMembers: [
      {
        name: "Yaw Osei", role: "Project Lead", totalHours: 240, totalTasks: 3, utilization: 85,
        tasks: [
          { id: "T1-1", taskName: "Draft Request for Proposals (RFP)", phase: "Procurement & Contracting", startDate: "Jan 20, 2026", endDate: "Feb 10, 2026", hours: 80, priority: "High", status: "Completed" },
          { id: "T2-3", taskName: "Coordinate Field Data Collection", phase: "Implementation", startDate: "Mar 01, 2026", endDate: "Mar 20, 2026", hours: 100, priority: "Critical", status: "In Progress" },
          { id: "T3-1", taskName: "Conduct Internal Peer Review of Draft", phase: "Quality Assurance", startDate: "Apr 01, 2026", endDate: "Apr 15, 2026", hours: 60, priority: "High", status: "Not Started" },
        ],
      },
      {
        name: "Kofi Mensah", role: "Technical Specialist", totalHours: 280, totalTasks: 4, utilization: 95,
        tasks: [
          { id: "T1-3", taskName: "Evaluate Vendor Submissions", phase: "Procurement & Contracting", startDate: "Feb 01, 2026", endDate: "Feb 28, 2026", hours: 100, priority: "High", status: "Completed" },
          { id: "T2-1", taskName: "Conduct Stakeholder Engagement Sessions", phase: "Implementation", startDate: "Feb 15, 2026", endDate: "Mar 15, 2026", hours: 120, priority: "Critical", status: "In Progress" },
          { id: "T2-4", taskName: "Design and Layout Report", phase: "Production & Editorial", startDate: "Mar 10, 2026", endDate: "Apr 05, 2026", hours: 40, priority: "Medium", status: "Not Started" },
          { id: "T4-2", taskName: "Submit Final Technical Report", phase: "Reporting", startDate: "May 01, 2026", endDate: "May 10, 2026", hours: 20, priority: "Low", status: "Not Started" },
        ],
      },
      {
        name: "Ama Darko", role: "Research Analyst", totalHours: 200, totalTasks: 2, utilization: 70,
        tasks: [
          { id: "T1-1b", taskName: "Finalize Service Agreements", phase: "Procurement & Contracting", startDate: "Jan 15, 2026", endDate: "Feb 15, 2026", hours: 120, priority: "Medium", status: "Completed" },
          { id: "T3-2", taskName: "Run Data Validation Checks", phase: "Quality Assurance", startDate: "Apr 10, 2026", endDate: "Apr 25, 2026", hours: 80, priority: "High", status: "Not Started" },
        ],
      },
      {
        name: "Kwesi Appiah", role: "UI/UX Designer", totalHours: 160, totalTasks: 2, utilization: 55,
        tasks: [
          { id: "T2-2", taskName: "Complete Editorial Review", phase: "Production & Editorial", startDate: "Feb 20, 2026", endDate: "Mar 10, 2026", hours: 90, priority: "High", status: "In Progress" },
          { id: "T3-3", taskName: "Plan Distribution Channels", phase: "Dissemination", startDate: "Apr 15, 2026", endDate: "Apr 30, 2026", hours: 70, priority: "Medium", status: "Not Started" },
        ],
      },
      {
        name: "Nana Yaw", role: "QA Engineer", totalHours: 140, totalTasks: 2, utilization: 48,
        tasks: [
          { id: "T3-4", taskName: "Conduct Stakeholder Workshops", phase: "Dissemination", startDate: "Apr 20, 2026", endDate: "May 05, 2026", hours: 80, priority: "High", status: "Not Started" },
          { id: "T4-1", taskName: "Compile Lessons Learned", phase: "Reporting", startDate: "May 06, 2026", endDate: "May 15, 2026", hours: 60, priority: "Critical", status: "Not Started" },
        ],
      },
      {
        name: "Kwaku Anane", role: "DevOps Engineer", totalHours: 100, totalTasks: 1, utilization: 35,
        tasks: [
          { id: "T4-3", taskName: "Sign-off and Handover", phase: "Delivery Stage Complete", startDate: "May 01, 2026", endDate: "May 20, 2026", hours: 100, priority: "Critical", status: "Not Started" },
        ],
      },
    ],
  },
  {
    id: "SA-002",
    projectName: "Urban Infrastructure Development Plan",
    projectManager: "Yaw Osei",
    program: "Infrastructure & Development",
    stage: "Inception & Planning",
    submittedDate: "Feb 28, 2026",
    totalStaff: 4,
    totalHoursAllocated: 640,
    avgUtilization: 72,
    approvalStatus: "Pending Review",
    staffMembers: [
      {
        name: "Yaw Osei", role: "Project Lead", totalHours: 200, totalTasks: 3, utilization: 80,
        tasks: [
          { id: "U1", taskName: "Issue Tender for Civil Works", phase: "Procurement & Contracting", startDate: "Mar 01, 2026", endDate: "Mar 20, 2026", hours: 60, priority: "High", status: "Not Started" },
          { id: "U2", taskName: "Supervise Foundation Works", phase: "Implementation", startDate: "May 10, 2026", endDate: "Jun 30, 2026", hours: 100, priority: "Critical", status: "Not Started" },
          { id: "U3", taskName: "Final Handover & Sign-off", phase: "Delivery Stage Complete", startDate: "Sep 01, 2026", endDate: "Sep 15, 2026", hours: 40, priority: "Critical", status: "Not Started" },
        ],
      },
      {
        name: "Kwame Asante", role: "Procurement Specialist", totalHours: 180, totalTasks: 2, utilization: 75,
        tasks: [
          { id: "U4", taskName: "Evaluate Contractor Bids", phase: "Procurement & Contracting", startDate: "Mar 25, 2026", endDate: "Apr 10, 2026", hours: 80, priority: "High", status: "Not Started" },
          { id: "U5", taskName: "Contract Negotiations", phase: "Procurement & Contracting", startDate: "Apr 15, 2026", endDate: "May 05, 2026", hours: 100, priority: "Medium", status: "Not Started" },
        ],
      },
      {
        name: "Nana Yaw", role: "Site Engineer", totalHours: 180, totalTasks: 2, utilization: 70,
        tasks: [
          { id: "U6", taskName: "Conduct Site Surveys", phase: "Implementation", startDate: "Apr 15, 2026", endDate: "May 05, 2026", hours: 120, priority: "Critical", status: "Not Started" },
          { id: "U7", taskName: "Quality Inspections", phase: "Quality Assurance", startDate: "Jul 01, 2026", endDate: "Jul 15, 2026", hours: 60, priority: "High", status: "Not Started" },
        ],
      },
      {
        name: "Ama Darko", role: "Reporting Analyst", totalHours: 80, totalTasks: 1, utilization: 35,
        tasks: [
          { id: "U8", taskName: "Compile Monthly Site Reports", phase: "Reporting", startDate: "Apr 01, 2026", endDate: "Aug 31, 2026", hours: 80, priority: "Medium", status: "Not Started" },
        ],
      },
    ],
  },
  {
    id: "SA-003",
    projectName: "West Africa Regional Integration Study",
    projectManager: "Yaw Osei",
    program: "West Africa Economic Development Program",
    stage: "Inception & Planning",
    submittedDate: "Mar 01, 2026",
    totalStaff: 6,
    totalHoursAllocated: 1120,
    avgUtilization: 65,
    approvalStatus: "Approved",
    staffMembers: [],
  },
  {
    id: "SA-004",
    projectName: "Climate Finance Readiness Program",
    projectManager: "Kwesi Appiah",
    program: "Sustainable Communities Initiative",
    stage: "Planning",
    submittedDate: "Mar 03, 2026",
    totalStaff: 4,
    totalHoursAllocated: 480,
    avgUtilization: 58,
    approvalStatus: "Flagged",
    flagReason: "Kofi Mensah allocated at 95% utilization across multiple projects simultaneously. Reduce allocation or redistribute tasks to avoid burnout.",
    staffMembers: [],
  },
  {
    id: "SA-005",
    projectName: "Sustainable Agriculture Development Initiative",
    projectManager: "Nana Yaw",
    program: "Sustainable Communities Initiative",
    stage: "Inception & Planning",
    submittedDate: "Mar 05, 2026",
    totalStaff: 5,
    totalHoursAllocated: 920,
    avgUtilization: 71,
    approvalStatus: "Pending Review",
    staffMembers: [],
  },
];

const tabs = ["All", "Pending Review", "Approved", "Flagged"] as const;
type TabType = (typeof tabs)[number];

// ─── Flag Modal ───────────────────────────────────────────────────────────────

function FlagModal({ projectName, onClose, onSubmit }: { projectName: string; onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            <h2 className="text-[15px] font-semibold text-slate-900">Flag Staff Allocation</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-[12px] text-slate-600 mb-3">
            Provide reasons for flagging the staff allocation for <span className="font-semibold text-slate-900">{projectName}</span>:
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reasons for flagging this staff allocation..."
            className="w-full h-28 px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            style={{ fontFamily: "Montserrat, sans-serif" }}
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
            Flag Allocation
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const priorityStyle = (p: string) => {
  switch (p) {
    case "Critical": return "bg-red-100 text-red-700";
    case "High": return "bg-orange-100 text-orange-700";
    case "Medium": return "bg-yellow-100 text-yellow-700";
    default: return "bg-slate-100 text-slate-600";
  }
};

const utilizationColor = (u: number) => {
  if (u >= 85) return "text-red-700 bg-red-50";
  if (u >= 70) return "text-amber-700 bg-amber-50";
  if (u >= 50) return "text-emerald-700 bg-emerald-50";
  return "text-slate-700 bg-slate-50";
};

const utilizationBarColor = (u: number) => {
  if (u >= 85) return "bg-red-500";
  if (u >= 70) return "bg-amber-500";
  if (u >= 50) return "bg-emerald-500";
  return "bg-slate-400";
};

const statusBadge = (s: StaffAllocationSubmission["approvalStatus"]) => {
  switch (s) {
    case "Pending Review": return "bg-amber-100 text-amber-700";
    case "Approved": return "bg-green-100 text-green-700";
    case "Flagged": return "bg-red-100 text-red-700";
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function StaffAllocationApproval() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [submissions, setSubmissions] = useState(staffSubmissions);
  const [selectedProject, setSelectedProject] = useState<StaffAllocationSubmission | null>(null);
  const [expandedStaff, setExpandedStaff] = useState<Set<string>>(new Set());
  const [flagModal, setFlagModal] = useState<StaffAllocationSubmission | null>(null);

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

  const toggleStaff = (name: string) => {
    setExpandedStaff((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
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
    const totalTasks = selectedProject.staffMembers.reduce((sum, s) => sum + s.totalTasks, 0);
    const completedTasks = selectedProject.staffMembers.flatMap((s) => s.tasks).filter((t) => t.status === "Completed").length;
    const inProgressTasks = selectedProject.staffMembers.flatMap((s) => s.tasks).filter((t) => t.status === "In Progress").length;

    return (
      <div className="flex flex-col h-full bg-slate-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => { setSelectedProject(null); setExpandedStaff(new Set()); }} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
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
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-[12px] text-slate-600">Staff: <span className="font-semibold text-slate-900">{selectedProject.totalStaff}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-600" />
            <span className="text-[12px] text-slate-600">Total Hours: <span className="font-semibold text-slate-900">{selectedProject.totalHoursAllocated}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] text-slate-600">Avg Utilization: <span className="font-semibold text-slate-900">{selectedProject.avgUtilization}%</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span className="text-[12px] text-slate-600">Tasks: <span className="font-semibold text-slate-900">{totalTasks}</span> ({completedTasks} done, {inProgressTasks} active)</span>
          </div>
          <div className="ml-auto text-[12px] text-slate-500">Submitted: {selectedProject.submittedDate}</div>
        </div>

        {/* Actions strip */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
          {selectedProject.approvalStatus !== "Approved" && (
            <>
              <button onClick={() => handleApprove(selectedProject.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Approve Allocation
              </button>
              <button onClick={() => setFlagModal(selectedProject)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">
                <Flag className="w-4 h-4" />
                Flag Allocation
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

        {/* Staff members */}
        <div className="flex-1 overflow-auto p-6">
          {selectedProject.staffMembers.length === 0 ? (
            <div className="text-center py-16 text-[13px] text-slate-400">No detailed staff allocation data available for this submission.</div>
          ) : (
            <div className="space-y-3">
              {selectedProject.staffMembers.map((staff) => {
                const isExpanded = expandedStaff.has(staff.name);
                return (
                  <div key={staff.name} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    {/* Staff header */}
                    <button onClick={() => toggleStaff(staff.name)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-purple-700" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-[13px] font-semibold text-slate-900">{staff.name}</span>
                        <span className="ml-2 text-[11px] text-slate-500">{staff.role}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500">{staff.totalHours} hrs • {staff.totalTasks} tasks</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${utilizationBarColor(staff.utilization)} transition-all`} style={{ width: `${staff.utilization}%` }} />
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${utilizationColor(staff.utilization)}`}>{staff.utilization}%</span>
                        </div>
                      </div>
                    </button>

                    {/* Expanded task list */}
                    {isExpanded && (
                      <div className="border-t border-slate-100">
                        <div className="overflow-auto">
                          <table className="w-full">
                            <thead style={{ backgroundColor: "#0B01D0" }}>
                              <tr>
                                <th className="text-left px-4 py-2 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Task</th>
                                <th className="text-left px-4 py-2 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Phase</th>
                                <th className="text-left px-4 py-2 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Start</th>
                                <th className="text-left px-4 py-2 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>End</th>
                                <th className="text-center px-4 py-2 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Hours</th>
                                <th className="text-center px-4 py-2 text-white text-[11px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Priority</th>
                              </tr>
                            </thead>
                            <tbody>
                              {staff.tasks.map((task, idx) => (
                                <tr key={task.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                  <td className="px-4 py-2 text-[11px] text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{task.taskName}</td>
                                  <td className="px-4 py-2 text-[11px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{task.phase}</td>
                                  <td className="px-4 py-2 text-[11px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{task.startDate}</td>
                                  <td className="px-4 py-2 text-[11px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{task.endDate}</td>
                                  <td className="px-4 py-2 text-center text-[11px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{task.hours}</td>
                                  <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle(task.priority)}`}>{task.priority}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
    <div className="flex flex-col h-full bg-slate-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-[18px] font-semibold text-slate-900">Staff Allocation Approvals</h1>
        <p className="text-[12px] text-slate-500 mt-1">Review and approve staff allocations submitted from project inception & planning</p>
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
              style={{ fontFamily: "Montserrat, sans-serif" }}
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
            style={{ fontFamily: "Montserrat, sans-serif" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Project Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Project Manager</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Stage</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Submitted</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Staff</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Hours</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Avg Util.</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-[13px] text-slate-400">No staff allocation submissions found.</td></tr>
            ) : (
              filteredSubmissions.map((sub, index) => (
                <tr
                  key={sub.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  onClick={() => setSelectedProject(sub)}
                >
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.id}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.projectName}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.projectManager}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.stage}</td>
                  <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.submittedDate}</td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.totalStaff}</td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-900 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.totalHoursAllocated.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${utilizationBarColor(sub.avgUtilization)} transition-all`} style={{ width: `${sub.avgUtilization}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{sub.avgUtilization}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusBadge(sub.approvalStatus)}`}>{sub.approvalStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedProject(sub); }} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700" title="View Allocation">
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