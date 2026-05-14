import { useState } from "react";
import {
  Search,
  ArrowLeft,
  Eye,
  History,
  CheckCircle,
  Flag,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanDocument {
  id: string;
  title: string;
  version: string;
  submittedBy: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Flagged";
  flagReason?: string;
  versionHistory: { version: string; date: string; author: string; notes: string }[];
}

interface ProjectSubmission {
  id: string;
  projectName: string;
  projectManager: string;
  program: string;
  stage: string;
  submittedDate: string;
  totalDocuments: number;
  approvedCount: number;
  flaggedCount: number;
  pendingCount: number;
  status: "Pending Review" | "Partially Approved" | "Fully Approved" | "Flagged";
  documents: PlanDocument[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const buildVersionHistory = (title: string) => [
  { version: "1.0", date: "Jan 15, 2026", author: "System", notes: "Initial draft created" },
  { version: "1.1", date: "Feb 03, 2026", author: "Project Manager", notes: `Updated ${title} with revised scope` },
  { version: "2.0", date: "Feb 20, 2026", author: "Project Manager", notes: "Final version submitted for approval" },
];

const standardDocs = (prefix: string, submittedBy: string, date: string): PlanDocument[] => [
  { id: `${prefix}-concept`, title: "Concept Notes", version: "2.0", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Concept Notes") },
  { id: `${prefix}-wbs`, title: "Work Breakdown Structure", version: "2.0", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Work Breakdown Structure") },
  { id: `${prefix}-staff`, title: "Staff Allocation", version: "1.1", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Staff Allocation") },
  { id: `${prefix}-budget`, title: "Budget", version: "2.0", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Budget") },
  { id: `${prefix}-procurement`, title: "Procurement Plan", version: "1.0", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Procurement Plan") },
  { id: `${prefix}-resource`, title: "Resource Plan", version: "1.1", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Resource Plan") },
  { id: `${prefix}-risk`, title: "Risk Management Plan", version: "2.0", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Risk Management Plan") },
  { id: `${prefix}-mel`, title: "MEL Plan", version: "1.0", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("MEL Plan") },
  { id: `${prefix}-comms`, title: "Comms Plan", version: "1.1", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Comms Plan") },
  { id: `${prefix}-travel`, title: "Travel Plan", version: "1.0", submittedBy, submittedDate: date, status: "Pending", versionHistory: buildVersionHistory("Travel Plan") },
];

const initialProjects: ProjectSubmission[] = [
  {
    id: "PS-001",
    projectName: "Healthcare System Strengthening Project",
    projectManager: "Ama Serwaa",
    program: "Youth & Social Development Program",
    stage: "Inception & Planning",
    submittedDate: "Feb 25, 2026",
    totalDocuments: 10,
    approvedCount: 0,
    flaggedCount: 0,
    pendingCount: 10,
    status: "Pending Review",
    documents: standardDocs("ps1", "Ama Serwaa", "Feb 25, 2026"),
  },
  {
    id: "PS-002",
    projectName: "Urban Infrastructure Development Plan",
    projectManager: "Yaw Osei",
    program: "Infrastructure & Development",
    stage: "Inception & Planning",
    submittedDate: "Feb 28, 2026",
    totalDocuments: 10,
    approvedCount: 0,
    flaggedCount: 0,
    pendingCount: 10,
    status: "Pending Review",
    documents: standardDocs("ps2", "Yaw Osei", "Feb 28, 2026"),
  },
  {
    id: "PS-003",
    projectName: "West Africa Regional Integration Study",
    projectManager: "Yaw Osei",
    program: "West Africa Economic Development Program",
    stage: "Inception & Planning",
    submittedDate: "Mar 01, 2026",
    totalDocuments: 10,
    approvedCount: 5,
    flaggedCount: 1,
    pendingCount: 4,
    status: "Partially Approved",
    documents: (() => {
      const docs = standardDocs("ps3", "Yaw Osei", "Mar 01, 2026");
      docs[0].status = "Approved";
      docs[1].status = "Approved";
      docs[2].status = "Approved";
      docs[3].status = "Approved";
      docs[4].status = "Approved";
      docs[5].status = "Flagged";
      docs[5].flagReason = "Resource allocation does not align with budget constraints. Please revise staffing levels.";
      return docs;
    })(),
  },
  {
    id: "PS-004",
    projectName: "Climate Finance Readiness Program",
    projectManager: "Kwesi Appiah",
    program: "Sustainable Communities Initiative",
    stage: "Planning",
    submittedDate: "Mar 03, 2026",
    totalDocuments: 10,
    approvedCount: 10,
    flaggedCount: 0,
    pendingCount: 0,
    status: "Fully Approved",
    documents: (() => {
      const docs = standardDocs("ps4", "Kwesi Appiah", "Mar 03, 2026");
      docs.forEach((d) => (d.status = "Approved"));
      return docs;
    })(),
  },
  {
    id: "PS-005",
    projectName: "Sustainable Agriculture Development Initiative",
    projectManager: "Nana Yaw",
    program: "Sustainable Communities Initiative",
    stage: "Inception & Planning",
    submittedDate: "Mar 05, 2026",
    totalDocuments: 10,
    approvedCount: 0,
    flaggedCount: 3,
    pendingCount: 7,
    status: "Flagged",
    documents: (() => {
      const docs = standardDocs("ps5", "Nana Yaw", "Mar 05, 2026");
      docs[3].status = "Flagged";
      docs[3].flagReason = "Budget exceeds approved funding ceiling by 20%. Needs revision.";
      docs[6].status = "Flagged";
      docs[6].flagReason = "Risk matrix incomplete — missing mitigation strategies for high-priority risks.";
      docs[8].status = "Flagged";
      docs[8].flagReason = "Communications plan does not include donor reporting schedule.";
      return docs;
    })(),
  },
  {
    id: "PS-006",
    projectName: "Renewable Energy Transition Framework",
    projectManager: "Kwaku Anane",
    program: "Sustainable Communities Initiative",
    stage: "Closure",
    submittedDate: "Mar 07, 2026",
    totalDocuments: 10,
    approvedCount: 8,
    flaggedCount: 0,
    pendingCount: 2,
    status: "Partially Approved",
    documents: (() => {
      const docs = standardDocs("ps6", "Kwaku Anane", "Mar 07, 2026");
      for (let i = 0; i < 8; i++) docs[i].status = "Approved";
      return docs;
    })(),
  },
];

const tabs = ["All", "Pending Review", "Partially Approved", "Fully Approved", "Flagged"] as const;
type TabType = (typeof tabs)[number];

// ─── Version History Modal ────────────────────────────────────────────────────

function VersionHistoryModal({
  doc,
  onClose,
}: {
  doc: PlanDocument;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-700" />
            <h2 className="text-[15px] font-semibold text-slate-900">Version History — {doc.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[400px] overflow-auto">
          <div className="space-y-4">
            {doc.versionHistory.map((entry, idx) => (
              <div key={idx} className="relative pl-6 pb-4 border-l-2 border-slate-200 last:border-l-0 last:pb-0">
                <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-purple-700 border-2 border-white" />
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold text-slate-900">v{entry.version}</span>
                  <span className="text-[11px] text-slate-400">{entry.date}</span>
                </div>
                <p className="text-[12px] text-slate-600 mb-0.5">{entry.notes}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] text-slate-500">{entry.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[12px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Flag Modal ───────────────────────────────────────────────────────────────

function FlagModal({
  docTitle,
  onClose,
  onSubmit,
}: {
  docTitle: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-600" />
            <h2 className="text-[15px] font-semibold text-slate-900">Flag Document</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-[12px] text-slate-600 mb-3">
            Please provide reasons for flagging <span className="font-semibold text-slate-900">{docTitle}</span>:
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reasons for flagging this document..."
            className="w-full h-28 px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
           
          />
        </div>
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[12px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (reason.trim()) onSubmit(reason.trim());
            }}
            disabled={!reason.trim()}
            className="px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" />
            Flag Document
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Plan Preview Modal ───────────────────────────────────────────────────────

function PlanPreviewModal({
  doc,
  onClose,
}: {
  doc: PlanDocument;
  onClose: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-700" />
            <h2 className="text-[15px] font-semibold text-slate-900">{doc.title} — v{doc.version}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm min-h-[400px]">
            {currentPage === 1 ? (
              <div className="space-y-6">
                <div className="text-center border-b pb-4">
                  <h1 className="text-[18px] font-semibold text-slate-900">{doc.title}</h1>
                  <p className="text-[12px] text-slate-500 mt-1">Version {doc.version} | Submitted: {doc.submittedDate}</p>
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-slate-900 mb-2">1. Overview</h2>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    This document outlines the comprehensive {doc.title.toLowerCase()} for the project.
                    It has been prepared in accordance with organizational standards and best practices,
                    incorporating stakeholder input and lessons learned from previous projects.
                  </p>
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-slate-900 mb-2">2. Scope & Objectives</h2>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    The scope encompasses all activities necessary for successful project delivery.
                    Key objectives have been aligned with the program's strategic goals and donor requirements.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[14px] font-semibold text-slate-900 mb-2">3. Implementation Approach</h2>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    The implementation will follow a phased approach with clear milestones and deliverables
                    at each stage. Regular progress reviews will ensure alignment with project timelines.
                  </p>
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-slate-900 mb-2">4. Monitoring & Control</h2>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    Quality assurance measures and control mechanisms have been integrated throughout
                    the project lifecycle to ensure deliverables meet expected standards.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-[12px] text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocumentCard({
  doc,
  onApprove,
  onFlag,
  onViewHistory,
  onViewPlan,
}: {
  doc: PlanDocument;
  onApprove: () => void;
  onFlag: () => void;
  onViewHistory: () => void;
  onViewPlan: () => void;
}) {
  const statusConfig = {
    Pending: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700", icon: <Clock className="w-3.5 h-3.5" /> },
    Approved: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3.5 h-3.5" /> },
    Flagged: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700", icon: <Flag className="w-3.5 h-3.5" /> },
  };

  const config = statusConfig[doc.status];

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-5 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-slate-900">{doc.title}</h4>
            <p className="text-[11px] text-slate-500">v{doc.version} • {doc.submittedBy}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${config.badge}`}>
          {config.icon}
          {doc.status}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Submitted: {doc.submittedDate}
        </span>
        <span className="flex items-center gap-1">
          <History className="w-3 h-3" />
          {doc.versionHistory.length} versions
        </span>
      </div>

      {doc.status === "Flagged" && doc.flagReason && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-100/60 border border-red-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-red-700">{doc.flagReason}</p>
          </div>
        </div>
      )}

      <div className="h-px bg-slate-200/60 my-3" />

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onViewHistory}
          className="inline-flex items-center gap-1.5 px-3 py-[6px] rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:bg-slate-50 transition-colors"
         
        >
          <History className="w-3.5 h-3.5" />
          Version History
        </button>
        <button
          onClick={onViewPlan}
          className="inline-flex items-center gap-1.5 px-3 py-[6px] rounded-lg border border-blue-200 bg-blue-50 text-[11px] text-blue-700 hover:bg-blue-100 transition-colors"
         
        >
          <Eye className="w-3.5 h-3.5" />
          View Plan
        </button>
        {doc.status !== "Approved" && (
          <button
            onClick={onApprove}
            className="inline-flex items-center gap-1.5 px-3 py-[6px] rounded-lg border border-green-200 bg-green-50 text-[11px] text-green-700 hover:bg-green-100 transition-colors"
           
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Approve
          </button>
        )}
        {doc.status !== "Approved" && (
          <button
            onClick={onFlag}
            className="inline-flex items-center gap-1.5 px-3 py-[6px] rounded-lg border border-red-200 bg-red-50 text-[11px] text-red-700 hover:bg-red-100 transition-colors"
           
          >
            <Flag className="w-3.5 h-3.5" />
            Flag
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProjectDocumentsApproval() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null);

  // Modal state
  const [versionHistoryDoc, setVersionHistoryDoc] = useState<PlanDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PlanDocument | null>(null);
  const [flagDoc, setFlagDoc] = useState<PlanDocument | null>(null);

  const recomputeProjectCounts = (project: ProjectSubmission): ProjectSubmission => {
    const approved = project.documents.filter((d) => d.status === "Approved").length;
    const flagged = project.documents.filter((d) => d.status === "Flagged").length;
    const pending = project.documents.filter((d) => d.status === "Pending").length;
    let status: ProjectSubmission["status"] = "Pending Review";
    if (approved === project.totalDocuments) status = "Fully Approved";
    else if (flagged > 0 && approved === 0) status = "Flagged";
    else if (approved > 0 || flagged > 0) status = "Partially Approved";
    return { ...project, approvedCount: approved, flaggedCount: flagged, pendingCount: pending, status };
  };

  const filteredProjects = projects.filter((p) => {
    const matchesTab = activeTab === "All" || p.status === activeTab;
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<TabType, number> = {
    All: projects.length,
    "Pending Review": projects.filter((p) => p.status === "Pending Review").length,
    "Partially Approved": projects.filter((p) => p.status === "Partially Approved").length,
    "Fully Approved": projects.filter((p) => p.status === "Fully Approved").length,
    Flagged: projects.filter((p) => p.status === "Flagged").length,
  };

  const handleApproveDoc = (docId: string) => {
    if (!selectedProject) return;
    const updated = {
      ...selectedProject,
      documents: selectedProject.documents.map((d) =>
        d.id === docId ? { ...d, status: "Approved" as const, flagReason: undefined } : d
      ),
    };
    const recomputed = recomputeProjectCounts(updated);
    setSelectedProject(recomputed);
    setProjects((prev) => prev.map((p) => (p.id === recomputed.id ? recomputed : p)));
  };

  const handleFlagDoc = (docId: string, reason: string) => {
    if (!selectedProject) return;
    const updated = {
      ...selectedProject,
      documents: selectedProject.documents.map((d) =>
        d.id === docId ? { ...d, status: "Flagged" as const, flagReason: reason } : d
      ),
    };
    const recomputed = recomputeProjectCounts(updated);
    setSelectedProject(recomputed);
    setProjects((prev) => prev.map((p) => (p.id === recomputed.id ? recomputed : p)));
    setFlagDoc(null);
  };

  const statusBadge = (status: ProjectSubmission["status"]) => {
    const map = {
      "Pending Review": "bg-amber-100 text-amber-700",
      "Partially Approved": "bg-blue-100 text-blue-700",
      "Fully Approved": "bg-green-100 text-green-700",
      Flagged: "bg-red-100 text-red-700",
    };
    return map[status];
  };

  // ─── Detail View ──────────────────────────────────────────────────────────

  if (selectedProject) {
    const approvedCount = selectedProject.documents.filter((d) => d.status === "Approved").length;
    const flaggedCount = selectedProject.documents.filter((d) => d.status === "Flagged").length;
    const pendingCount = selectedProject.documents.filter((d) => d.status === "Pending").length;

    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedProject(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900">
              {selectedProject.projectName}
            </h1>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {selectedProject.projectManager} • {selectedProject.program} • {selectedProject.stage}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusBadge(selectedProject.status)}`}>
            {selectedProject.status}
          </span>
        </div>

        {/* Summary strip */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[12px] text-slate-600">
              Pending: <span className="font-semibold text-slate-900">{pendingCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[12px] text-slate-600">
              Approved: <span className="font-semibold text-slate-900">{approvedCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[12px] text-slate-600">
              Flagged: <span className="font-semibold text-slate-900">{flaggedCount}</span>
            </span>
          </div>
          <div className="ml-auto text-[12px] text-slate-500">
            Submitted: {selectedProject.submittedDate}
          </div>
        </div>

        {/* Document Cards */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedProject.documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onApprove={() => handleApproveDoc(doc.id)}
                onFlag={() => setFlagDoc(doc)}
                onViewHistory={() => setVersionHistoryDoc(doc)}
                onViewPlan={() => setPreviewDoc(doc)}
              />
            ))}
          </div>
        </div>

        {/* Modals */}
        {versionHistoryDoc && <VersionHistoryModal doc={versionHistoryDoc} onClose={() => setVersionHistoryDoc(null)} />}
        {previewDoc && <PlanPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
        {flagDoc && (
          <FlagModal
            docTitle={flagDoc.title}
            onClose={() => setFlagDoc(null)}
            onSubmit={(reason) => handleFlagDoc(flagDoc.id, reason)}
          />
        )}
      </div>
    );
  }

  // ─── Table View ───────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">
              Project Documents Approval
            </h1>
            <p className="text-[12px] text-slate-500 mt-1">
              Review and approve project planning documents submitted for approval
            </p>
          </div>
        </div>
      </div>

      {/* Tabs — Document Vault style */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[100px] flex items-center justify-center gap-1.5 ${
                activeTab === tab
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
             
            >
              {tab}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
                }`}
              >
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

      {/* Table — General Ledger pattern */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Project Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Project Manager</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Stage</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Submitted</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Documents</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Progress</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[13px] text-slate-400">
                  No project submissions found.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <td className="px-4 py-3 text-[12px] text-purple-700 font-medium">
                    {project.id}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">
                    {project.projectName}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">
                    {project.projectManager}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">
                    {project.stage}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">
                    {project.submittedDate}
                  </td>
                  <td className="px-4 py-3 text-center text-[12px] text-slate-900 font-medium">
                    {project.totalDocuments}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{ width: `${(project.approvedCount / project.totalDocuments) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {project.approvedCount}/{project.totalDocuments}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusBadge(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700"
                      title="View Documents"
                    >
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
