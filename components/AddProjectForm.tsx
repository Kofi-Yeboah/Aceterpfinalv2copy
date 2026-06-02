import { useState, useRef } from "react";
import {
  ArrowLeft,
  Plus,
  X,
  ChevronDown,
  Lock,
  Unlock,
  FileText,
  Upload,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Flag,
  Trash2,
  Link2,
  FileSignature,
  Info,
  History,
  RotateCcw,
  Users,
  ChevronUp,
} from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";
import { getPotentialProjects } from "../lib/donorPipelineStore";

// ── Dropdown rendered via portal (avoids clipping) ──
function PortalDropdown({
  anchorRef,
  children,
  onClose,
  width,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  onClose: () => void;
  width?: number;
}) {
  const rect = anchorRef.current?.getBoundingClientRect();
  if (!rect) return null;
  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div
        className="fixed z-[9999] bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto"
        style={{ top: rect.bottom + 4, left: rect.left, width: width || rect.width }}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

// ── Reference data ──
const PROGRAMS = [
  { id: "PRG-001", name: "West Africa Economic Development Program" },
  { id: "PRG-002", name: "Sustainable Communities Initiative" },
  { id: "PRG-003", name: "Youth & Social Development Program" },
  { id: "PRG-004", name: "Urban Development & Infrastructure Program" },
  { id: "PRG-005", name: "Education Access & Quality Program" },
  { id: "PRG-006", name: "Gender Equality & Social Inclusion Program" },
  { id: "PRG-007", name: "Water & Sanitation Improvement Program" },
];

const DONORS = [
  "WHO", "Gates Foundation", "UNESCO", "World Bank", "USAID",
  "UNFPA", "UNICEF", "Green Climate Fund", "Green Fund", "WFP",
  "DFID", "EU Commission", "AfDB",
];

// Staff members for Project Lead and Project Coordinator selection
const STAFF_MEMBERS = [
  { id: "STF-001", name: "Yaw Osei", role: "Senior Project Manager", department: "Project Management" },
  { id: "STF-002", name: "Kofi Mensah", role: "Program Director", department: "Programs" },
  { id: "STF-003", name: "Kwesi Appiah", role: "Project Coordinator", department: "Project Management" },
  { id: "STF-004", name: "Nana Yaw", role: "Technical Lead", department: "Technical" },
  { id: "STF-005", name: "Kwaku Anane", role: "M&E Specialist", department: "MEL" },
  { id: "STF-006", name: "Ama Serwaa", role: "Project Manager", department: "Project Management" },
  { id: "STF-007", name: "Kwame Asante", role: "Senior Program Officer", department: "Programs" },
  { id: "STF-008", name: "Akosua Mensah", role: "Project Coordinator", department: "Project Management" },
  { id: "STF-009", name: "Esi Baiden", role: "Finance Manager", department: "Finance" },
  { id: "STF-010", name: "Kojo Owusu", role: "Operations Manager", department: "Operations" },
  { id: "STF-011", name: "Abena Adjei", role: "Communications Lead", department: "Communications" },
  { id: "STF-012", name: "Fiifi Yankey", role: "Program Coordinator", department: "Programs" },
];

// Won proposals from the Donor/Partnership module
const LINKED_PROPOSALS = [
  { id: "PROP-2026-001", title: "Community Health Initiative - Phase 2", donor: "WHO", date: "Dec 15, 2025", budget: "$250,000" },
  { id: "PROP-2025-098", title: "Girls Education Empowerment Program", donor: "UNESCO", date: "Nov 20, 2025", budget: "$180,000" },
  { id: "PROP-2025-092", title: "Environmental Conservation Project", donor: "Green Fund", date: "Sep 25, 2025", budget: "$150,000" },
  { id: "PROP-2025-088", title: "Youth Employment Skills Training", donor: "World Bank", date: "Aug 15, 2025", budget: "$420,000" },
  { id: "PROP-2025-085", title: "Maternal Health Improvement Program", donor: "UNFPA", date: "Jul 30, 2025", budget: "$280,000" },
  { id: "PROP-2025-078", title: "Climate Resilience Building", donor: "Green Climate Fund", date: "May 15, 2025", budget: "$380,000" },
  { id: "PROP-2025-075", title: "Rural Education Access Enhancement", donor: "USAID", date: "Apr 25, 2025", budget: "$220,000" },
];

// Signed contracts from Legal & Contracts module
const LINKED_CONTRACTS = [
  { id: "CTR-2026-001", title: "WHO – Community Health Initiative Phase 2 Contract", donor: "WHO", signedDate: "Jan 28, 2026", value: "$250,000" },
  { id: "CTR-2025-042", title: "UNESCO – Girls Education Program Agreement", donor: "UNESCO", signedDate: "Dec 22, 2025", value: "$180,000" },
  { id: "CTR-2025-038", title: "World Bank – Youth Employment Contract", donor: "World Bank", signedDate: "Nov 10, 2025", value: "$420,000" },
  { id: "CTR-2025-035", title: "UNFPA – Maternal Health MoU", donor: "UNFPA", signedDate: "Oct 15, 2025", value: "$280,000" },
  { id: "CTR-2025-030", title: "Green Climate Fund – Climate Resilience Agreement", donor: "Green Climate Fund", signedDate: "Aug 22, 2025", value: "$380,000" },
  { id: "CTR-2025-028", title: "USAID – Rural Education Contract", donor: "USAID", signedDate: "Jul 05, 2025", value: "$220,000" },
];

// ── Types ──
interface Deliverable {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isPrimary: boolean; // locked as primary deliverable
}

interface ReportingReq {
  id: string;
  reportType: string;
  frequency: string;
  dueOffset: string; // e.g. "30 days after period end"
  recipient: string;
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  description: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  version: number;
  uploadedAt: string;
  uploadedBy: string;
}

interface LinkedDocumentUpload {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface AdditionalDonor {
  id: string;
  donor: string;
  contractStart: string;
  contractEnd: string;
  totalBudget: string;
  linkedProposal: string;
  deliverables: Deliverable[];
  reportingReqs: ReportingReq[];
  milestones: Milestone[];
}

// ── Props ──
interface AddProjectFormProps {
  onBack: () => void;
  onSave: (projectData: any) => void;
}

const REPORT_TYPES = ["Narrative Report", "Financial Report", "Audit Report", "Progress Report", "Completion Report", "M&E Report"];
const FREQUENCIES = ["Monthly", "Quarterly", "Semi-Annually", "Annually", "At Completion", "Ad-hoc"];

export function AddProjectForm({ onBack, onSave }: AddProjectFormProps) {
  // ── Basic fields ──
  const [projectName, setProjectName] = useState("");
  const [program, setProgram] = useState("");
  const [donor, setDonor] = useState("");
  const [contractStart, setContractStart] = useState("");
  const [contractEnd, setContractEnd] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const [projectCoordinator, setProjectCoordinator] = useState("");

  // ── Linked documents ──
  const [linkedProposal, setLinkedProposal] = useState("");
  const [linkedContract, setLinkedContract] = useState("");
  const [selectedConceptNote, setSelectedConceptNote] = useState("");
  const [linkedProposalUpload, setLinkedProposalUpload] = useState<LinkedDocumentUpload | null>(null);
  const [linkedContractUpload, setLinkedContractUpload] = useState<LinkedDocumentUpload | null>(null);

  // ── Deliverables ──
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: "d1", title: "", description: "", dueDate: "", isPrimary: false },
  ]);

  // ── Reporting requirements ──
  const [reportingReqs, setReportingReqs] = useState<ReportingReq[]>([
    { id: "r1", reportType: "", frequency: "", dueOffset: "", recipient: "" },
  ]);

  // ── Contract milestones ──
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "m1", title: "", targetDate: "", description: "" },
  ]);

  // ── Step state ──
  const [step, setStep] = useState<"main" | "donors">("main");

  // ── Additional Donors ──
  const [additionalDonors, setAdditionalDonors] = useState<AdditionalDonor[]>([]);
  const [collapsedDonors, setCollapsedDonors] = useState<Record<string, boolean>>({});

  // ── File uploads ──
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: "uf1", name: "Contract-Draft-v1.pdf", size: "2.4 MB", version: 1, uploadedAt: "Feb 20, 2026", uploadedBy: "PMO Admin" },
  ]);

  // ── Dropdown state ──
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const programRef = useRef<HTMLButtonElement>(null);
  const donorRef = useRef<HTMLButtonElement>(null);
  const conceptNoteRef = useRef<HTMLButtonElement>(null);
  const projectLeadRef = useRef<HTMLButtonElement>(null);
  const projectCoordinatorRef = useRef<HTMLButtonElement>(null);
  const reportTypeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const frequencyRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const additionalDonorRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // ── Lock confirmation ──
  const [lockConfirm, setLockConfirm] = useState<string | null>(null);

  const closeAllDropdowns = () => setOpenDropdown(null);

  // ── Deliverable helpers ──
  const addDeliverable = () => {
    setDeliverables([...deliverables, { id: `d${Date.now()}`, title: "", description: "", dueDate: "", isPrimary: false }]);
  };
  const removeDeliverable = (id: string) => {
    if (deliverables.length > 1) setDeliverables(deliverables.filter((d) => d.id !== id));
  };
  const updateDeliverable = (id: string, field: keyof Deliverable, value: any) => {
    setDeliverables(deliverables.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };
  const togglePrimary = (id: string) => {
    const del = deliverables.find((d) => d.id === id);
    if (del?.isPrimary) {
      // Unlock
      updateDeliverable(id, "isPrimary", false);
    } else {
      // Show confirmation
      setLockConfirm(id);
    }
  };
  const confirmLock = () => {
    if (lockConfirm) {
      updateDeliverable(lockConfirm, "isPrimary", true);
      setLockConfirm(null);
    }
  };

  // ── Reporting helpers ──
  const addReportingReq = () => {
    setReportingReqs([...reportingReqs, { id: `r${Date.now()}`, reportType: "", frequency: "", dueOffset: "", recipient: "" }]);
  };
  const removeReportingReq = (id: string) => {
    if (reportingReqs.length > 1) setReportingReqs(reportingReqs.filter((r) => r.id !== id));
  };
  const updateReportingReq = (id: string, field: keyof ReportingReq, value: string) => {
    setReportingReqs(reportingReqs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // ── Milestone helpers ──
  const addMilestone = () => {
    setMilestones([...milestones, { id: `m${Date.now()}`, title: "", targetDate: "", description: "" }]);
  };
  const removeMilestone = (id: string) => {
    if (milestones.length > 1) setMilestones(milestones.filter((m) => m.id !== id));
  };
  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  // ── Additional Donor helpers ──
  const addAdditionalDonor = () => {
    setAdditionalDonors([
      ...additionalDonors,
      {
        id: `ad${Date.now()}`,
        donor: "",
        contractStart: "",
        contractEnd: "",
        totalBudget: "",
        linkedProposal: "",
        deliverables: [{ id: `add${Date.now()}`, title: "", description: "", dueDate: "", isPrimary: false }],
        reportingReqs: [{ id: `adr${Date.now()}`, reportType: "", frequency: "", dueOffset: "", recipient: "" }],
        milestones: [{ id: `adm${Date.now()}`, title: "", targetDate: "", description: "" }],
      },
    ]);
  };
  const removeAdditionalDonor = (id: string) => {
    setAdditionalDonors(additionalDonors.filter((d) => d.id !== id));
  };
  const updateAdditionalDonor = (id: string, field: string, value: unknown) => {
    setAdditionalDonors(additionalDonors.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };
  // Sub-item helpers for additional donors
  const addAdDonorDeliverable = (adId: string) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, deliverables: [...d.deliverables, { id: `add${Date.now()}`, title: "", description: "", dueDate: "", isPrimary: false }] } : d));
  };
  const removeAdDonorDeliverable = (adId: string, delId: string) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, deliverables: d.deliverables.filter((x) => x.id !== delId) } : d));
  };
  const updateAdDonorDeliverable = (adId: string, delId: string, field: keyof Deliverable, value: string | boolean) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, deliverables: d.deliverables.map((x) => x.id === delId ? { ...x, [field]: value } : x) } : d));
  };
  const addAdDonorReportingReq = (adId: string) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, reportingReqs: [...d.reportingReqs, { id: `adr${Date.now()}`, reportType: "", frequency: "", dueOffset: "", recipient: "" }] } : d));
  };
  const removeAdDonorReportingReq = (adId: string, reqId: string) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, reportingReqs: d.reportingReqs.filter((x) => x.id !== reqId) } : d));
  };
  const updateAdDonorReportingReq = (adId: string, reqId: string, field: keyof ReportingReq, value: string) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, reportingReqs: d.reportingReqs.map((x) => x.id === reqId ? { ...x, [field]: value } : x) } : d));
  };
  const addAdDonorMilestone = (adId: string) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, milestones: [...d.milestones, { id: `adm${Date.now()}`, title: "", targetDate: "", description: "" }] } : d));
  };
  const removeAdDonorMilestone = (adId: string, msId: string) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, milestones: d.milestones.filter((x) => x.id !== msId) } : d));
  };
  const updateAdDonorMilestone = (adId: string, msId: string, field: keyof Milestone, value: string) => {
    setAdditionalDonors(additionalDonors.map((d) => d.id === adId ? { ...d, milestones: d.milestones.map((x) => x.id === msId ? { ...x, [field]: value } : x) } : d));
  };

  const createLinkedDocumentUpload = (label: string, donorName?: string): LinkedDocumentUpload => ({
    id: `doc-${Date.now()}`,
    name: `${label.replace(/\s+/g, "-")}${donorName ? `-${donorName.replace(/\s+/g, "-")}` : ""}-v1.pdf`,
    size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
    uploadedAt: "Apr 28, 2026",
    uploadedBy: "PMO Admin",
  });

  const handleLinkedProposalUpload = () => {
    const matchedProposal = LINKED_PROPOSALS.find((proposal) => proposal.donor === donor);
    const uploadedDoc = createLinkedDocumentUpload(matchedProposal?.title || "Proposal-Document", donor);
    setLinkedProposalUpload(uploadedDoc);
    setLinkedProposal(uploadedDoc.name);
  };

  const handleLinkedContractUpload = () => {
    const matchedContract = LINKED_CONTRACTS.find((contract) => contract.donor === donor);
    const uploadedDoc = createLinkedDocumentUpload(matchedContract?.title || "Signed-Contract", donor);
    setLinkedContractUpload(uploadedDoc);
    setLinkedContract(uploadedDoc.name);
  };

  const handleAdditionalProposalUpload = (adId: string, donorName: string) => {
    const matchedProposal = LINKED_PROPOSALS.find((proposal) => proposal.donor === donorName);
    const uploadedDoc = createLinkedDocumentUpload(matchedProposal?.title || "Proposal-Document", donorName);
    updateAdditionalDonor(adId, "linkedProposal", uploadedDoc.name);
  };

  // ── File upload simulation ──
  const handleFileUpload = () => {
    const nextVersion = uploadedFiles.length + 1;
    setUploadedFiles([
      {
        id: `uf${Date.now()}`,
        name: `Contract-Draft-v${nextVersion}.pdf`,
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        version: nextVersion,
        uploadedAt: "Feb 23, 2026",
        uploadedBy: "PMO Admin",
      },
      ...uploadedFiles,
    ]);
  };

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      projectName,
      program,
      donor,
      contractStart,
      contractEnd,
      totalBudget,
      projectLead,
      projectCoordinator,
      linkedProposal,
      linkedContract,
      deliverables,
      reportingReqs,
      milestones,
      additionalDonors,
      uploadedFiles,
    };
    onSave(projectData);
  };

  const primaryCount = deliverables.filter((d) => d.isPrimary).length;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Add New Project</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Initial project configuration from signed contract</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* PMO Authorization Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
            <Shield size={13} className="text-purple-600" />
            <span className="text-[11px] text-purple-700">PMO Configuration</span>
          </div>
        </div>
      </div>

      {/* PMO Notice */}
      <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2.5 shrink-0">
        <AlertTriangle size={14} className="text-amber-600 shrink-0" />
        <p className="text-[11px] text-amber-800">
          <strong>PMO-Only Access:</strong> Initial project configuration can only be completed by authorized PMO personnel.
          Contractual deliverables locked as "Primary" cannot be modified without PMO approval.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-5">

          {step === "main" && (
          <>
          {/* ═══ Section 1: Contract Details ═══ */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-200 flex items-center gap-2 bg-[#ffffff]">
              <FileSignature size={15} className="text-purple-600" />
              <h2 className="text-[13px] text-slate-900">Contract Details</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-[12px] text-slate-600 mb-1.5">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                  placeholder="Enter project name as per contract"
                />
              </div>

              {/* Program & Donor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1.5">
                    Program <span className="text-red-500">*</span>
                  </label>
                  <button
                    ref={programRef}
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "program" ? null : "program")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className={cn("text-sm", program ? "text-slate-900" : "text-slate-400")}>
                      {program || "Select program"}
                    </span>
                    <ChevronDown size={15} className="text-slate-400" />
                  </button>
                  {openDropdown === "program" && (
                    <PortalDropdown anchorRef={programRef} onClose={closeAllDropdowns}>
                      {PROGRAMS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setProgram(p.name); closeAllDropdowns(); }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                            program === p.name ? "bg-blue-50 text-blue-700" : "text-slate-700"
                          )}
                        >
                          <span className="text-[10px] text-slate-400 mr-1.5">{p.id}</span>
                          {p.name}
                        </button>
                      ))}
                    </PortalDropdown>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] text-slate-600 mb-1.5">
                    Donor <span className="text-red-500">*</span>
                  </label>
                  <button
                    ref={donorRef}
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "donor" ? null : "donor")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className={cn("text-sm", donor ? "text-slate-900" : "text-slate-400")}>
                      {donor || "Select donor"}
                    </span>
                    <ChevronDown size={15} className="text-slate-400" />
                  </button>
                  {openDropdown === "donor" && (
                    <PortalDropdown anchorRef={donorRef} onClose={closeAllDropdowns}>
                      {DONORS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => { setDonor(d); setLinkedProposal(""); setLinkedContract(""); closeAllDropdowns(); }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                            donor === d ? "bg-blue-50 text-blue-700" : "text-slate-700"
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </PortalDropdown>
                  )}
                </div>
              </div>

              {/* Contract Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1.5">
                    Contract Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={contractStart}
                      onChange={(e) => setContractStart(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1.5">
                    Contract End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={contractEnd}
                    onChange={(e) => setContractEnd(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Total Budget */}
              <div>
                <label className="block text-[12px] text-slate-600 mb-1.5">
                  Total Budget <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                    placeholder="e.g. 250,000"
                  />
                </div>
              </div>

              {/* Project Lead & Project Coordinator */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-slate-600 mb-1.5">
                    Project Lead <span className="text-red-500">*</span>
                  </label>
                  <button
                    ref={projectLeadRef}
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "projectLead" ? null : "projectLead")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className={cn("text-sm flex items-center gap-2", projectLead ? "text-slate-900" : "text-slate-400")}>
                      {projectLead ? (
                        <>
                          <Users size={14} className="text-purple-500 shrink-0" />
                          {STAFF_MEMBERS.find((s) => s.id === projectLead)?.name}
                        </>
                      ) : (
                        "Select project lead"
                      )}
                    </span>
                    <ChevronDown size={15} className="text-slate-400" />
                  </button>
                  {openDropdown === "projectLead" && (
                    <PortalDropdown anchorRef={projectLeadRef} onClose={closeAllDropdowns} width={420}>
                      {STAFF_MEMBERS
                        .filter((s) => s.id !== projectCoordinator)
                        .map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setProjectLead(s.id); closeAllDropdowns(); }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-3",
                            projectLead === s.id ? "bg-blue-50" : ""
                          )}
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                            <span className="text-[11px] text-purple-700 font-semibold">
                              {s.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-slate-900">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.role} &middot; {s.department}</p>
                          </div>
                          {projectLead === s.id && (
                            <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </PortalDropdown>
                  )}
                  {projectLead && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center shrink-0">
                        <span className="text-[9px] text-purple-700 font-semibold">
                          {STAFF_MEMBERS.find((s) => s.id === projectLead)?.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-purple-800 font-medium">
                          {STAFF_MEMBERS.find((s) => s.id === projectLead)?.name}
                        </span>
                        <span className="text-[10px] text-purple-600 ml-1.5">
                          {STAFF_MEMBERS.find((s) => s.id === projectLead)?.role}
                        </span>
                      </div>
                      <button type="button" onClick={() => setProjectLead("")} className="p-0.5 hover:bg-purple-100 rounded">
                        <X size={12} className="text-purple-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] text-slate-600 mb-1.5">
                    Project Coordinator <span className="text-red-500">*</span>
                  </label>
                  <button
                    ref={projectCoordinatorRef}
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "projectCoordinator" ? null : "projectCoordinator")}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className={cn("text-sm flex items-center gap-2", projectCoordinator ? "text-slate-900" : "text-slate-400")}>
                      {projectCoordinator ? (
                        <>
                          <Users size={14} className="text-cyan-500 shrink-0" />
                          {STAFF_MEMBERS.find((s) => s.id === projectCoordinator)?.name}
                        </>
                      ) : (
                        "Select project coordinator"
                      )}
                    </span>
                    <ChevronDown size={15} className="text-slate-400" />
                  </button>
                  {openDropdown === "projectCoordinator" && (
                    <PortalDropdown anchorRef={projectCoordinatorRef} onClose={closeAllDropdowns} width={420}>
                      {STAFF_MEMBERS
                        .filter((s) => s.id !== projectLead)
                        .map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setProjectCoordinator(s.id); closeAllDropdowns(); }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-3",
                            projectCoordinator === s.id ? "bg-blue-50" : ""
                          )}
                        >
                          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                            <span className="text-[11px] text-cyan-700 font-semibold">
                              {s.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-slate-900">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.role} &middot; {s.department}</p>
                          </div>
                          {projectCoordinator === s.id && (
                            <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </PortalDropdown>
                  )}
                  {projectCoordinator && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-cyan-200 flex items-center justify-center shrink-0">
                        <span className="text-[9px] text-cyan-700 font-semibold">
                          {STAFF_MEMBERS.find((s) => s.id === projectCoordinator)?.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-cyan-800 font-medium">
                          {STAFF_MEMBERS.find((s) => s.id === projectCoordinator)?.name}
                        </span>
                        <span className="text-[10px] text-cyan-600 ml-1.5">
                          {STAFF_MEMBERS.find((s) => s.id === projectCoordinator)?.role}
                        </span>
                      </div>
                      <button type="button" onClick={() => setProjectCoordinator("")} className="p-0.5 hover:bg-cyan-100 rounded">
                        <X size={12} className="text-cyan-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Concept Note */}
              <div>
                <label className="block text-[12px] text-slate-600 mb-1.5">
                  Concept Note
                </label>
                <button
                  ref={conceptNoteRef}
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "conceptNote" ? null : "conceptNote")}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className={cn("text-sm truncate", selectedConceptNote ? "text-slate-900" : "text-slate-400")}>
                    {selectedConceptNote || "Select a concept note"}
                  </span>
                  <ChevronDown size={15} className="text-slate-400 shrink-0" />
                </button>
                {openDropdown === "conceptNote" && (
                  <PortalDropdown anchorRef={conceptNoteRef} onClose={closeAllDropdowns} width={440}>
                    {getPotentialProjects().map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setSelectedConceptNote(p.name); closeAllDropdowns(); }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0",
                          selectedConceptNote === p.name && "bg-purple-50"
                        )}
                      >
                        <p className={cn("text-sm", selectedConceptNote === p.name ? "text-purple-700 font-medium" : "text-slate-700")}>{p.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.programArea} · {p.status} · {p.leadContact}</p>
                      </button>
                    ))}
                    {getPotentialProjects().length === 0 && (
                      <p className="px-4 py-3 text-sm text-slate-400">No concept notes available</p>
                    )}
                  </PortalDropdown>
                )}
                {selectedConceptNote && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg">
                    <FileText size={14} className="text-violet-600 shrink-0" />
                    <span className="text-[11px] text-violet-800 flex-1 truncate">{selectedConceptNote}</span>
                    <button type="button" onClick={() => setSelectedConceptNote("")} className="p-0.5 hover:bg-violet-100 rounded">
                      <X size={12} className="text-violet-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </>
          )}

          {step === "donors" && (
          <>
          {/* ═══ Section 1.5: Additional Donors ═══ */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-indigo-600" />
                <h2 className="text-[13px] text-slate-900">Additional Donors</h2>
                <span className="text-[10px] text-slate-400 ml-1">Multi-donor project funding</span>
              </div>
              <button
                type="button"
                onClick={addAdditionalDonor}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] hover:bg-indigo-700 transition-colors"
              >
                <Plus size={12} />
                Add New Donor
              </button>
            </div>
            {additionalDonors.length > 0 ? (
              <div className="p-6 space-y-4">
                {additionalDonors.map((ad, idx) => {
                  const isCollapsed = collapsedDonors[ad.id] ?? false;
                  return (
                    <div key={ad.id} className="border border-indigo-200 rounded-xl bg-indigo-50/40 overflow-hidden">
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-indigo-50/60 transition-colors"
                        onClick={() => setCollapsedDonors((prev) => ({ ...prev, [ad.id]: !prev[ad.id] }))}
                      >
                        <div className="flex items-center gap-2">
                          <ChevronUp size={14} className={cn("text-indigo-400 transition-transform", isCollapsed && "rotate-180")} />
                          <span className="text-[12px] font-medium text-indigo-700">Additional Donor #{idx + 1}</span>
                          {isCollapsed && ad.donor && (
                            <span className="text-[11px] text-indigo-400">— {ad.donor}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeAdditionalDonor(ad.id); }}
                          className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                      {!isCollapsed && (
                      <div className="px-4 pb-4 pt-1">

                      {/* Donor Selection */}
                      <div className="mb-3">
                        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                          Donor <span className="text-red-500">*</span>
                        </label>
                        <button
                          ref={(el) => { additionalDonorRefs.current[ad.id] = el; }}
                          type="button"
                          onClick={() => setOpenDropdown(openDropdown === `ad-donor-${ad.id}` ? null : `ad-donor-${ad.id}`)}
                          className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                        >
                          <span className={cn("text-[12px]", ad.donor ? "text-slate-900" : "text-slate-400")}>
                            {ad.donor || "Select donor"}
                          </span>
                          <ChevronDown size={13} className="text-slate-400" />
                        </button>
                        {openDropdown === `ad-donor-${ad.id}` && (
                          <PortalDropdown anchorRef={{ current: additionalDonorRefs.current[ad.id] } as React.RefObject<HTMLElement>} onClose={closeAllDropdowns}>
                            {DONORS.map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => {
                                  updateAdditionalDonor(ad.id, "donor", d);
                                  updateAdditionalDonor(ad.id, "linkedProposal", "");
                                  closeAllDropdowns();
                                }}
                                className={cn(
                                  "w-full px-4 py-2 text-left text-[12px] hover:bg-slate-50 transition-colors",
                                  ad.donor === d ? "bg-blue-50 text-blue-700" : "text-slate-700"
                                )}
                              >
                                {d}
                              </button>
                            ))}
                          </PortalDropdown>
                        )}
                      </div>

                      {/* Contract Dates */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                            Contract Start Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={ad.contractStart}
                            onChange={(e) => updateAdditionalDonor(ad.id, "contractStart", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                            Contract End Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={ad.contractEnd}
                            onChange={(e) => updateAdditionalDonor(ad.id, "contractEnd", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Total Budget */}
                      <div className="mb-3">
                        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                          Total Budget <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={ad.totalBudget}
                            onChange={(e) => updateAdditionalDonor(ad.id, "totalBudget", e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                            placeholder="e.g. 150,000"
                          />
                        </div>
                      </div>

                      {/* Linked Proposal Document */}
                      <div className="mb-3">
                        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                          Linked Proposal Document
                        </label>
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <Upload size={14} className="text-blue-600" />
                              </div>
                              <div className="min-w-0">
                                <p className={cn("text-[12px] font-medium truncate", ad.linkedProposal ? "text-slate-900" : "text-slate-500")}>
                                  {ad.linkedProposal || "Upload proposal document for this donor"}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, XLSX accepted</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAdditionalProposalUpload(ad.id, ad.donor)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                            >
                              <Upload size={12} />
                              {ad.linkedProposal ? "Replace" : "Upload"}
                            </button>
                          </div>
                          {ad.linkedProposal && (
                            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50">
                              <FileText size={13} className="text-blue-600 shrink-0" />
                              <span className="text-[11px] text-blue-800 truncate flex-1">{ad.linkedProposal}</span>
                              <button
                                type="button"
                                onClick={() => updateAdditionalDonor(ad.id, "linkedProposal", "")}
                                className="p-0.5 hover:bg-blue-100 rounded"
                              >
                                <X size={12} className="text-blue-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contractual Deliverables */}
                      <div className="mb-3 border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-green-600" />
                            <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Contractual Deliverables</span>
                          </div>
                          <button type="button" onClick={() => addAdDonorDeliverable(ad.id)} className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] hover:bg-blue-700 transition-colors">
                            <Plus size={10} /> Add
                          </button>
                        </div>
                        <div className="p-3 space-y-2">
                          {ad.deliverables.map((del, dIdx) => (
                            <div key={del.id} className="border border-slate-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-slate-400">#{dIdx + 1}</span>
                                {ad.deliverables.length > 1 && (
                                  <button type="button" onClick={() => removeAdDonorDeliverable(ad.id, del.id)} className="p-0.5 hover:bg-red-50 rounded transition-colors">
                                    <Trash2 size={11} className="text-red-400" />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Title</label>
                                  <input type="text" value={del.title} onChange={(e) => updateAdDonorDeliverable(ad.id, del.id, "title", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. Inception Report" />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Due Date</label>
                                  <input type="date" value={del.dueDate} onChange={(e) => updateAdDonorDeliverable(ad.id, del.id, "dueDate", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                              </div>
                              <div className="mt-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                <textarea value={del.description} onChange={(e) => updateAdDonorDeliverable(ad.id, del.id, "description", e.target.value)} rows={2} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-400" placeholder="Deliverable description and acceptance criteria" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reporting Requirements */}
                      <div className="mb-3 border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-orange-500" />
                            <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Reporting Requirements</span>
                          </div>
                          <button type="button" onClick={() => addAdDonorReportingReq(ad.id)} className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] hover:bg-blue-700 transition-colors">
                            <Plus size={10} /> Add
                          </button>
                        </div>
                        <div className="p-3 space-y-2">
                          {ad.reportingReqs.map((req, rIdx) => (
                            <div key={req.id} className="border border-slate-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-slate-400">Requirement #{rIdx + 1}</span>
                                {ad.reportingReqs.length > 1 && (
                                  <button type="button" onClick={() => removeAdDonorReportingReq(ad.id, req.id)} className="p-0.5 hover:bg-red-50 rounded transition-colors">
                                    <Trash2 size={11} className="text-red-400" />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Report Type</label>
                                  <select value={req.reportType} onChange={(e) => updateAdDonorReportingReq(ad.id, req.id, "reportType", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value="">Select type</option>
                                    {REPORT_TYPES.map((rt) => <option key={rt} value={rt}>{rt}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Frequency</label>
                                  <select value={req.frequency} onChange={(e) => updateAdDonorReportingReq(ad.id, req.id, "frequency", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value="">Select frequency</option>
                                    {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Due Offset</label>
                                  <input type="text" value={req.dueOffset} onChange={(e) => updateAdDonorReportingReq(ad.id, req.id, "dueOffset", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. 30 days after period end" />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Recipient</label>
                                  <input type="text" value={req.recipient} onChange={(e) => updateAdDonorReportingReq(ad.id, req.id, "recipient", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. Donor Programme Officer" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contract Milestones */}
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Flag size={12} className="text-emerald-600" />
                            <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Contract Milestones</span>
                          </div>
                          <button type="button" onClick={() => addAdDonorMilestone(ad.id)} className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] hover:bg-blue-700 transition-colors">
                            <Plus size={10} /> Add
                          </button>
                        </div>
                        <div className="p-3 space-y-2">
                          {ad.milestones.map((ms, mIdx) => (
                            <div key={ms.id} className="border border-slate-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-slate-400">Milestone #{mIdx + 1}</span>
                                {ad.milestones.length > 1 && (
                                  <button type="button" onClick={() => removeAdDonorMilestone(ad.id, ms.id)} className="p-0.5 hover:bg-red-50 rounded transition-colors">
                                    <Trash2 size={11} className="text-red-400" />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Milestone Title</label>
                                  <input type="text" value={ms.title} onChange={(e) => updateAdDonorMilestone(ad.id, ms.id, "title", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. Inception Phase Complete" />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Target Date</label>
                                  <input type="date" value={ms.targetDate} onChange={(e) => updateAdDonorMilestone(ad.id, ms.id, "targetDate", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                              </div>
                              <div className="mt-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description / Conditions</label>
                                <input type="text" value={ms.description} onChange={(e) => updateAdDonorMilestone(ad.id, ms.id, "description", e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400" placeholder="Conditions for payment release" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-2">
                  <Users size={20} className="text-slate-400" />
                </div>
                <p className="text-[12px] text-slate-500">No additional donors added yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Click "Add New Donor" to include co-funding partners</p>
              </div>
            )}
          </div>

          {/* Back to Project button on donors screen */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <button
              type="button"
              onClick={() => setStep("main")}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Back to Project
            </button>
          </div>
          </>
          )}

          {step === "main" && (
          <>
          {/* ═══ Section 2: Linked Documents (Donor/Partnership Module) ═══ */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <Link2 size={15} className="text-blue-600" />
                <h2 className="text-[13px] text-slate-900">Linked Documents</h2>
                <span className="text-[10px] text-slate-400 ml-1">upload the signed source files for project setup</span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Linked Proposal */}
              <div>
                <label className="block text-[12px] text-slate-600 mb-1.5">
                  Linked Proposal Document <span className="text-red-500">*</span>
                </label>
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Upload size={16} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className={cn("text-sm font-medium truncate", linkedProposalUpload ? "text-slate-900" : "text-slate-500")}>
                          {linkedProposalUpload?.name || "Upload the approved proposal document"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Drag in or upload the donor-approved proposal file</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLinkedProposalUpload}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12px] text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                    >
                      <Upload size={13} />
                      {linkedProposalUpload ? "Replace file" : "Upload file"}
                    </button>
                  </div>
                </div>
                {linkedProposalUpload && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <FileText size={14} className="text-blue-600 shrink-0" />
                    <span className="text-[11px] text-blue-800 flex-1 truncate">
                      {linkedProposalUpload.name}
                    </span>
                    <span className="text-[10px] text-blue-700 shrink-0">{linkedProposalUpload.size}</span>
                    <button type="button" onClick={() => { setLinkedProposal(""); setLinkedProposalUpload(null); }} className="p-0.5 hover:bg-blue-100 rounded">
                      <X size={12} className="text-blue-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Linked Signed Contract */}
              <div>
                <label className="block text-[12px] text-slate-600 mb-1.5">
                  Linked Signed Contract Document <span className="text-red-500">*</span>
                </label>
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                        <Upload size={16} className="text-cyan-600" />
                      </div>
                      <div className="min-w-0">
                        <p className={cn("text-sm font-medium truncate", linkedContractUpload ? "text-slate-900" : "text-slate-500")}>
                          {linkedContractUpload?.name || "Upload the signed contract document"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Add the executed contract file for PMO setup</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLinkedContractUpload}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12px] text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                    >
                      <Upload size={13} />
                      {linkedContractUpload ? "Replace file" : "Upload file"}
                    </button>
                  </div>
                </div>
                {linkedContractUpload && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg">
                    <FileSignature size={14} className="text-cyan-600 shrink-0" />
                    <span className="text-[11px] text-cyan-800 flex-1 truncate">
                      {linkedContractUpload.name}
                    </span>
                    <span className="text-[10px] text-cyan-700 shrink-0">{linkedContractUpload.size}</span>
                    <button type="button" onClick={() => { setLinkedContract(""); setLinkedContractUpload(null); }} className="p-0.5 hover:bg-cyan-100 rounded">
                      <X size={12} className="text-cyan-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Document Upload & Versioning */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Upload size={14} className="text-slate-500" />
                    <span className="text-[12px] text-slate-700">Supporting Documents & Versions</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-700 transition-colors"
                  >
                    <Upload size={12} />
                    Upload New Version
                  </button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={file.id}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg border",
                          idx === 0
                            ? "bg-green-50 border-green-200"
                            : "bg-slate-50 border-slate-200"
                        )}
                      >
                        <FileText size={14} className={idx === 0 ? "text-green-600" : "text-slate-400"} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-slate-900 truncate">{file.name}</span>
                            {idx === 0 && (
                              <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full">LATEST</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-slate-400">v{file.version}</span>
                            <span className="text-[10px] text-slate-400">{file.size}</span>
                            <span className="text-[10px] text-slate-400">{file.uploadedAt}</span>
                            <span className="text-[10px] text-slate-400">by {file.uploadedBy}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button type="button" className="p-1 hover:bg-slate-200 rounded transition-colors" title="Restore this version">
                              <RotateCcw size={12} className="text-slate-400" />
                            </button>
                          )}
                          <button type="button" className="p-1 hover:bg-slate-200 rounded transition-colors" title="View version history">
                            <History size={12} className="text-slate-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ Section 3: Contractual Deliverables ═══ */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-600" />
                <h2 className="text-[13px] text-slate-900">Contractual Deliverables</h2>
                {primaryCount > 0 && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    {primaryCount} locked as Primary
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={addDeliverable}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] hover:bg-blue-700 transition-colors"
              >
                <Plus size={12} />
                Add Deliverable
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                <Info size={13} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-[10px] text-blue-800 leading-relaxed">
                  Deliverables marked as <strong>"Primary"</strong> are locked to the contract and cannot be modified without PMO authorization.
                  These represent binding contractual obligations tied to milestone payments.
                </p>
              </div>

              {deliverables.map((del, idx) => (
                <div
                  key={del.id}
                  className={cn(
                    "border rounded-xl p-4 transition-all",
                    del.isPrimary
                      ? "border-amber-300 bg-amber-50/30"
                      : "border-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">#{idx + 1}</span>
                      {del.isPrimary && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] border border-amber-200">
                          <Lock size={9} />
                          Primary Deliverable — Locked
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => togglePrimary(del.id)}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] transition-colors border",
                          del.isPrimary
                            ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                        )}
                        title={del.isPrimary ? "Unlock deliverable" : "Lock as Primary Deliverable"}
                      >
                        {del.isPrimary ? <Lock size={10} /> : <Unlock size={10} />}
                        {del.isPrimary ? "Unlock" : "Lock as Primary"}
                      </button>
                      {!del.isPrimary && deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDeliverable(del.id)}
                          className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Title</label>
                      <input
                        type="text"
                        value={del.title}
                        onChange={(e) => updateDeliverable(del.id, "title", e.target.value)}
                        disabled={del.isPrimary}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500",
                          del.isPrimary
                            ? "bg-amber-50 border-amber-200 text-amber-900 cursor-not-allowed"
                            : "border-slate-300 text-slate-900"
                        )}
                        placeholder="e.g. Inception Report"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Due Date</label>
                      <input
                        type="date"
                        value={del.dueDate}
                        onChange={(e) => updateDeliverable(del.id, "dueDate", e.target.value)}
                        disabled={del.isPrimary}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500",
                          del.isPrimary
                            ? "bg-amber-50 border-amber-200 text-amber-900 cursor-not-allowed"
                            : "border-slate-300 text-slate-900"
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      value={del.description}
                      onChange={(e) => updateDeliverable(del.id, "description", e.target.value)}
                      disabled={del.isPrimary}
                      rows={2}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
                        del.isPrimary
                          ? "bg-amber-50 border-amber-200 text-amber-900 cursor-not-allowed"
                          : "border-slate-300 text-slate-900"
                      )}
                      placeholder="Deliverable description and acceptance criteria"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Section 4: Reporting Requirements ═══ */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-orange-500" />
                <h2 className="text-[13px] text-slate-900">Reporting Requirements</h2>
              </div>
              <button
                type="button"
                onClick={addReportingReq}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] hover:bg-blue-700 transition-colors"
              >
                <Plus size={12} />
                Add Requirement
              </button>
            </div>
            <div className="p-6 space-y-3">
              {reportingReqs.map((req, idx) => (
                <div key={req.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-slate-400">Requirement #{idx + 1}</span>
                    {reportingReqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReportingReq(req.id)}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Report Type</label>
                      <button
                        ref={(el) => { reportTypeRefs.current[req.id] = el; }}
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === `rtype-${req.id}` ? null : `rtype-${req.id}`)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                      >
                        <span className={cn("text-[12px]", req.reportType ? "text-slate-900" : "text-slate-400")}>
                          {req.reportType || "Select type"}
                        </span>
                        <ChevronDown size={13} className="text-slate-400" />
                      </button>
                      {openDropdown === `rtype-${req.id}` && (
                        <PortalDropdown anchorRef={{ current: reportTypeRefs.current[req.id] } as React.RefObject<HTMLElement>} onClose={closeAllDropdowns}>
                          {REPORT_TYPES.map((rt) => (
                            <button
                              key={rt}
                              type="button"
                              onClick={() => { updateReportingReq(req.id, "reportType", rt); closeAllDropdowns(); }}
                              className={cn(
                                "w-full px-4 py-2 text-left text-[12px] hover:bg-slate-50 transition-colors",
                                req.reportType === rt ? "bg-blue-50 text-blue-700" : "text-slate-700"
                              )}
                            >
                              {rt}
                            </button>
                          ))}
                        </PortalDropdown>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Frequency</label>
                      <button
                        ref={(el) => { frequencyRefs.current[req.id] = el; }}
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === `freq-${req.id}` ? null : `freq-${req.id}`)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                      >
                        <span className={cn("text-[12px]", req.frequency ? "text-slate-900" : "text-slate-400")}>
                          {req.frequency || "Select frequency"}
                        </span>
                        <ChevronDown size={13} className="text-slate-400" />
                      </button>
                      {openDropdown === `freq-${req.id}` && (
                        <PortalDropdown anchorRef={{ current: frequencyRefs.current[req.id] } as React.RefObject<HTMLElement>} onClose={closeAllDropdowns}>
                          {FREQUENCIES.map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => { updateReportingReq(req.id, "frequency", f); closeAllDropdowns(); }}
                              className={cn(
                                "w-full px-4 py-2 text-left text-[12px] hover:bg-slate-50 transition-colors",
                                req.frequency === f ? "bg-blue-50 text-blue-700" : "text-slate-700"
                              )}
                            >
                              {f}
                            </button>
                          ))}
                        </PortalDropdown>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Due Offset</label>
                      <input
                        type="text"
                        value={req.dueOffset}
                        onChange={(e) => updateReportingReq(req.id, "dueOffset", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                        placeholder="e.g. 30 days after period end"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Recipient</label>
                      <input
                        type="text"
                        value={req.recipient}
                        onChange={(e) => updateReportingReq(req.id, "recipient", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                        placeholder="e.g. Donor Programme Officer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Section 5: Contract Milestones ═══ */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-[#ffffff]">
              <div className="flex items-center gap-2">
                <Flag size={15} className="text-emerald-600" />
                <h2 className="text-[13px] text-slate-900">Contract Milestones</h2>
              </div>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] hover:bg-blue-700 transition-colors"
              >
                <Plus size={12} />
                Add Milestone
              </button>
            </div>
            <div className="p-6 space-y-3">
              {milestones.map((ms, idx) => (
                <div key={ms.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-slate-400">Milestone #{idx + 1}</span>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(ms.id)}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Milestone Title</label>
                      <input
                        type="text"
                        value={ms.title}
                        onChange={(e) => updateMilestone(ms.id, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                        placeholder="e.g. Inception Phase Complete"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Target Date</label>
                      <input
                        type="date"
                        value={ms.targetDate}
                        onChange={(e) => updateMilestone(ms.id, "targetDate", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description / Conditions</label>
                    <input
                      type="text"
                      value={ms.description}
                      onChange={(e) => updateMilestone(ms.id, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      placeholder="Conditions for payment release"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Action Buttons ═══ */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Shield size={12} className="text-purple-500" />
              Configuration will be saved as PMO-authorized. Changes to Primary Deliverables require PMO approval.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep("donors")}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <Users size={14} />
                Add New Donors
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <CheckCircle2 size={14} />
                Create Project
              </button>
            </div>
          </div>
          </>
          )}
        </form>
      </div>

      {/* ═══ Lock Confirmation Modal ═══ */}
      {lockConfirm && (() => {
        const del = deliverables.find((d) => d.id === lockConfirm);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setLockConfirm(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Lock size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm text-slate-900">Lock as Primary Deliverable?</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">This action restricts editing</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Locking <strong>"{del?.title || `Deliverable #${deliverables.findIndex(d => d.id === lockConfirm) + 1}`}"</strong> as a
                      Primary Deliverable will:
                    </p>
                    <ul className="mt-1.5 space-y-1 text-[11px] text-amber-700">
                      <li className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                        Prevent modifications without PMO authorization
                      </li>
                      <li className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                        Link this deliverable to milestone payment conditions
                      </li>
                      <li className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                        Mark it as a binding contractual obligation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 justify-end">
                <button
                  onClick={() => setLockConfirm(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLock}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors flex items-center gap-1.5"
                >
                  <Lock size={13} />
                  Confirm & Lock
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
