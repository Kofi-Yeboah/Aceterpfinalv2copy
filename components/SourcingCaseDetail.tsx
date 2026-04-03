import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Upload, FileText, Check, Clock, ChevronDown, Lock,
  Globe, Users, Send, ClipboardList, Handshake, Award, Eye,
  AlertTriangle, CheckCircle2, X, Paperclip, CalendarDays,
  Bell, ExternalLink, ShieldCheck, RotateCcw, History, Trash2, Download,
  PenLine, AlertCircle
} from "lucide-react";
import { getSignature, subscribe as subscribeSignature, getCurrentUserId, canUseSignature } from "../lib/signatureStore";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════════════════════ */

export type SourcingMethod =
  | "Open Competition"
  | "Limited Competition"
  | "Direct Selection"
  | "Request for Quotation";

export type CategoryType = "Goods" | "Services" | "Works" | "Consultancy";

export type StepStatus = "completed" | "active" | "locked";

export interface DocVersion {
  versionNumber: number;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  type: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  uploadedBy: string;
  date: string;
  type: string;
  size: string;
  version: number;
  versions: DocVersion[];
  label: string; // category label e.g. "ITB Document", "Evaluation Report"
}

export interface SourcingStep {
  key: string;
  label: string;
  icon: React.ReactNode;
  status: StepStatus;
  description: string;
  optional?: boolean;
  documents: UploadedDoc[];
}

export interface VendorBid {
  id: string;
  vendorName: string;
  dateReceived: string;
  bidReference?: string;
  notes?: string;
}

export interface SourcingCase {
  id: string;
  caseNumber: string;
  sourcePR: string;
  description: string;
  category: CategoryType;
  method: SourcingMethod;
  budget: number;
  requestedBy: string;
  department: string;
  projectName: string;
  dateCreated: string;
  currentStepKey: string;
  overallStatus: "In Progress" | "Completed" | "Cancelled";
  steps: SourcingStep[];
  awardedVendor?: string;
  contractNumber?: string;
  vendorsBidding?: VendorBid[];
}

export interface ContractAwardPayload {
  caseId: string;
  contractNumber: string;
  vendor: string;
  comments: string;
}

export interface DocUploadPayload {
  caseId: string;
  stepKey: string;
  doc: UploadedDoc;
}

export interface VendorBidUpdatePayload {
  caseId: string;
  vendorsBidding: VendorBid[];
}

interface SourcingCaseDetailProps {
  sourcingCase: SourcingCase;
  onBack: () => void;
  onMethodChange: (caseId: string, newMethod: SourcingMethod) => void;
  onStepAdvance: (caseId: string, stepKey: string) => void;
  onContractAward: (payload: ContractAwardPayload) => void;
  onDocUpload: (payload: DocUploadPayload) => void;
  onVendorBidUpdate: (payload: VendorBidUpdatePayload) => void;
  onNavigateToContract?: () => void;
  onGeneratePO?: () => void;
  poGenerated?: boolean;
  poNumber?: string;
}

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════════ */

const F = "Montserrat, sans-serif";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = { pdf: "PDF", docx: "DOCX", doc: "DOC", xlsx: "XLSX", xls: "XLS", png: "PNG", jpg: "JPEG", jpeg: "JPEG", csv: "CSV", zip: "ZIP" };
  return map[ext] || ext.toUpperCase() || "FILE";
}

function getStepIcon(key: string, size: number = 16) {
  switch (key) {
    case "solicitation": return <FileText size={size} />;
    case "advertisement": return <Globe size={size} />;
    case "eoi_shortlisting": return <ClipboardList size={size} />;
    case "invitation": return <Send size={size} />;
    case "submission_portal": return <Lock size={size} />;
    case "bid_opening": return <Eye size={size} />;
    case "evaluation": return <ClipboardList size={size} />;
    case "negotiations": return <Handshake size={size} />;
    case "contract_award": return <Award size={size} />;
    default: return <FileText size={size} />;
  }
}

function getDocLabelsForStep(key: string, category: CategoryType): string[] {
  switch (key) {
    case "solicitation":
      return category === "Services" || category === "Consultancy"
        ? ["RFP Document", "Evaluation Criteria Matrix", "Terms of Reference", "Draft Contract Template"]
        : ["ITB Document", "Evaluation Criteria Matrix", "Specifications", "Draft Contract Template"];
    case "advertisement":
      return ["Portal Posting Confirmation", "External Ad Proof"];
    case "eoi_shortlisting":
      return ["EoI Evaluation Report", "Shortlist Matrix"];
    case "invitation":
      return ["Invitation Letters", "Bidder Instructions"];
    case "submission_portal":
      return ["Submission Log", "Encryption Certificates"];
    case "bid_opening":
      return ["Bid Opening Minutes", "Attendance Sheet", "Bid Summary Table", "Supporting Notes"];
    case "evaluation":
      return category === "Services" || category === "Consultancy"
        ? ["Combined Evaluation Report", "Score Matrix", "Interview Scores", "Approval Recommendation"]
        : ["Standard Evaluation Report", "Score Matrix", "Approval Recommendation"];
    case "negotiations":
      return ["Negotiation Report", "Meeting Minutes", "Revised Terms / Pricing"];
    case "contract_award":
      return ["Signed Contract / Award Letter", "Performance Bond / Guarantee"];
    default: return [];
  }
}

const METHODS: SourcingMethod[] = ["Open Competition", "Limited Competition", "Direct Selection", "Request for Quotation"];

const AVAILABLE_VENDORS = [
  { id: "v1", name: "Tech Solutions Inc.", category: "Goods" },
  { id: "v2", name: "Office Depot Ltd.", category: "Goods" },
  { id: "v3", name: "PrintWorks Ghana Ltd", category: "Goods" },
  { id: "v4", name: "MedSupply GH", category: "Goods" },
  { id: "v5", name: "Dr. Kwesi Appiah", category: "Consultancy" },
  { id: "v6", name: "Prof. Ama Benyiwa", category: "Consultancy" },
  { id: "v7", name: "Nana Yaw Mensah", category: "Consultancy" },
  { id: "v8", name: "Akosua Frimpong", category: "Services" },
  { id: "v9", name: "Kwame Construction Ltd", category: "Works" },
  { id: "v10", name: "La Palm Royal Beach Hotel", category: "Services" },
  { id: "v11", name: "CreativeEdge Designs", category: "Services" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function SourcingCaseDetail({
  sourcingCase, onBack, onMethodChange, onStepAdvance, onContractAward, onDocUpload, onVendorBidUpdate, onNavigateToContract,
  onGeneratePO, poGenerated, poNumber: generatedPONumber,
}: SourcingCaseDetailProps) {
  const [selectedStepKey, setSelectedStepKey] = useState<string>(sourcingCase.currentStepKey);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStepKey, setUploadStepKey] = useState("");
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLabelDropdown, setUploadLabelDropdown] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Version history modal
  const [showVersionHistory, setShowVersionHistory] = useState<UploadedDoc | null>(null);

  // Vendor bid recording modal
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidVendorName, setBidVendorName] = useState("");
  const [bidReference, setBidReference] = useState("");
  const [bidNotes, setBidNotes] = useState("");
  const [bidDate, setBidDate] = useState(new Date().toISOString().split("T")[0]);
  const [bidError, setBidError] = useState("");

  // Other modals
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showAdvertiseModal, setShowAdvertiseModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [proposalType, setProposalType] = useState<"Technical" | "Financial" | "Both">("Both");

  // Award form
  const [awardVendor, setAwardVendor] = useState("");
  const [contractComment, setContractComment] = useState("");

  // Signature
  const [signatureData, setSignatureData] = useState(getSignature());
  const [showSignModal, setShowSignModal] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeSignature(() => setSignatureData(getSignature()));
    return unsub;
  }, []);

  const handleApplySignature = () => {
    if (!canUseSignature(getCurrentUserId())) return;
    setSigned(true);
    setSignedAt(new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
    setShowSignModal(false);
  };

  const sc = sourcingCase;
  const selectedStep = sc.steps.find(s => s.key === selectedStepKey);

  const getMethodColor = (m: SourcingMethod) => {
    switch (m) {
      case "Open Competition": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Limited Competition": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Direct Selection": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Request for Quotation": return "bg-green-50 text-green-700 border-green-200";
    }
  };

  // ── Upload Handlers ──

  const openUploadModal = (stepKey: string, presetLabel?: string) => {
    setUploadStepKey(stepKey);
    setUploadLabel(presetLabel || "");
    setUploadFile(null);
    setUploadError("");
    setUploadSuccess(false);
    setShowUploadModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (25MB)
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File exceeds 25MB limit.");
      return;
    }

    // Validate type
    const allowed = [
      "application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/png", "image/jpeg", "text/csv", "application/zip",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx?|xlsx?|png|jpe?g|csv|zip)$/i)) {
      setUploadError("Unsupported file type. Allowed: PDF, DOCX, XLSX, PNG, JPG, CSV, ZIP.");
      return;
    }

    setUploadFile(file);
    setUploadError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as any;
      handleFileSelect(fakeEvent);
    }
  };

  const handleUploadConfirm = () => {
    if (!uploadFile) { setUploadError("Please select a file."); return; }
    if (!uploadLabel.trim()) { setUploadError("Please select a document category."); return; }

    const step = sc.steps.find(s => s.key === uploadStepKey);
    const existingDoc = step?.documents.find(d => d.label === uploadLabel);

    const versionNum = existingDoc ? existingDoc.version + 1 : 1;
    const newVersion: DocVersion = {
      versionNumber: versionNum,
      name: uploadFile.name,
      size: formatFileSize(uploadFile.size),
      uploadedBy: "Current User",
      date: new Date().toISOString().split("T")[0],
      type: getFileType(uploadFile.name),
    };

    const doc: UploadedDoc = existingDoc
      ? {
          ...existingDoc,
          name: uploadFile.name,
          size: formatFileSize(uploadFile.size),
          date: newVersion.date,
          type: newVersion.type,
          version: versionNum,
          versions: [...existingDoc.versions, newVersion],
        }
      : {
          id: `doc-${Date.now()}`,
          name: uploadFile.name,
          uploadedBy: "Current User",
          date: newVersion.date,
          type: newVersion.type,
          size: formatFileSize(uploadFile.size),
          version: 1,
          versions: [newVersion],
          label: uploadLabel,
        };

    onDocUpload({ caseId: sc.id, stepKey: uploadStepKey, doc });
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
    }, 1200);
  };

  const handleCompleteStep = (stepKey: string) => {
    onStepAdvance(sc.id, stepKey);
  };

  const toggleVendor = (id: string) => {
    setSelectedVendors(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  // ── Vendor Bid Handlers ──
  const openBidModal = () => {
    setBidVendorName("");
    setBidReference("");
    setBidNotes("");
    setBidDate(new Date().toISOString().split("T")[0]);
    setBidError("");
    setShowBidModal(true);
  };

  const handleAddBid = () => {
    if (!bidVendorName.trim()) { setBidError("Vendor name is required."); return; }
    const newBid: VendorBid = {
      id: `bid-${Date.now()}`,
      vendorName: bidVendorName.trim(),
      dateReceived: bidDate,
      bidReference: bidReference.trim() || undefined,
      notes: bidNotes.trim() || undefined,
    };
    const current = sc.vendorsBidding || [];
    onVendorBidUpdate({ caseId: sc.id, vendorsBidding: [...current, newBid] });
    setShowBidModal(false);
  };

  const handleRemoveBid = (bidId: string) => {
    const current = sc.vendorsBidding || [];
    onVendorBidUpdate({ caseId: sc.id, vendorsBidding: current.filter(b => b.id !== bidId) });
  };

  // Available labels for upload (minus already-uploaded ones)
  const getAvailableLabels = () => {
    const step = sc.steps.find(s => s.key === uploadStepKey);
    const allLabels = getDocLabelsForStep(uploadStepKey, sc.category);
    // Allow re-upload (new version) for existing labels too
    return allLabels;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" style={{ fontFamily: F }}>
      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[16px] font-semibold text-slate-900 truncate" style={{ fontFamily: F }}>
              {sc.caseNumber}
            </h1>
            <span className="text-[11px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded shrink-0">
              {sc.sourcePR}
            </span>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded border ${getMethodColor(sc.method)}`}>
              {sc.method}
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5 truncate" style={{ fontFamily: F }}>
            {sc.description} &middot; {sc.category} &middot; {formatCurrency(sc.budget)}
          </p>
        </div>
        {/* Method Change */}
        <div className="relative shrink-0">
          <button onClick={() => setShowMethodDropdown(!showMethodDropdown)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] bg-white hover:bg-slate-50 flex items-center gap-2 transition-colors"
            style={{ fontFamily: F }}>
            Change Method <ChevronDown size={13} className="text-purple-700" />
          </button>
          {showMethodDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMethodDropdown(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                {METHODS.map(m => (
                  <button key={m} onClick={() => { onMethodChange(sc.id, m); setShowMethodDropdown(false); }}
                    className={`w-full px-4 py-2.5 text-left text-[12px] hover:bg-slate-50 flex items-center justify-between ${
                      m === sc.method ? "bg-purple-50 text-purple-700 font-medium" : "text-slate-700"
                    }`} style={{ fontFamily: F }}>
                    {m}
                    {m === sc.method && <Check size={14} className="text-purple-700" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Main Content: Stepper + Detail Panel ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Stepper Rail */}
        <div className="w-[260px] bg-white border-r border-slate-200 p-4 overflow-y-auto shrink-0">
          <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-wider" style={{ fontFamily: F }}>Workflow Steps</p>
          <div className="space-y-1">
            {sc.steps.map((step) => {
              const isActive = step.key === selectedStepKey;
              const isCompleted = step.status === "completed";
              const isCurrent = step.key === sc.currentStepKey;
              const docCount = step.documents.length;

              return (
                <button key={step.key} onClick={() => setSelectedStepKey(step.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                    isActive ? "bg-purple-50 border border-purple-200" :
                    step.status === "locked" ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"
                  }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted ? "bg-green-100 text-green-600" :
                    isCurrent ? "bg-purple-100 text-purple-700" :
                    "bg-slate-100 text-slate-400"
                  }`}>
                    {isCompleted ? <Check size={14} /> : getStepIcon(step.key, 14)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] truncate ${
                      isCompleted ? "text-green-700 font-medium" :
                      isCurrent ? "text-purple-700 font-medium" :
                      "text-slate-400"
                    }`} style={{ fontFamily: F }}>
                      {step.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {step.optional && <span className="text-[9px] text-slate-400" style={{ fontFamily: F }}>Optional</span>}
                      {docCount > 0 && (
                        <span className="text-[9px] text-purple-500 flex items-center gap-0.5" style={{ fontFamily: F }}>
                          <Paperclip size={8} /> {docCount}
                        </span>
                      )}
                    </div>
                  </div>
                  {isCompleted && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                  {isCurrent && !isCompleted && <Clock size={14} className="text-purple-500 shrink-0" />}
                  {step.status === "locked" && <Lock size={12} className="text-slate-300 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Progress</span>
              <span className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>
                {sc.steps.filter(s => s.status === "completed").length}/{sc.steps.length}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${(sc.steps.filter(s => s.status === "completed").length / sc.steps.length) * 100}%` }} />
            </div>
          </div>

          {/* Vendors Bidding */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Vendors Bidding</span>
              <span className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>
                {sc.vendorsBidding?.length || 0}
              </span>
            </div>
            {(sc.vendorsBidding || []).length > 0 && (
              <div className="space-y-1.5 mb-2">
                {(sc.vendorsBidding || []).map(bid => (
                  <div key={bid.id} className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded text-[10px] text-slate-700" style={{ fontFamily: F }}>
                    <Users size={10} className="text-purple-500 shrink-0" />
                    <span className="flex-1 truncate">{bid.vendorName}</span>
                    {sc.overallStatus !== "Completed" && (
                      <button onClick={() => handleRemoveBid(bid.id)} className="text-slate-400 hover:text-red-500 shrink-0">
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {sc.overallStatus !== "Completed" && (
              <button onClick={openBidModal}
                className="w-full px-2 py-1.5 border border-dashed border-purple-300 rounded-lg text-[10px] text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-1"
                style={{ fontFamily: F }}>
                <Users size={10} /> Record Bid Received
              </button>
            )}
          </div>
        </div>

        {/* Right: Step Detail Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedStep ? (
            <>
              {/* Step Header Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedStep.status === "completed" ? "bg-green-100 text-green-600" :
                      selectedStep.status === "active" ? "bg-purple-100 text-purple-700" :
                      "bg-slate-100 text-slate-400"
                    }`}>
                      {selectedStep.status === "completed" ? <Check size={20} /> : getStepIcon(selectedStep.key, 20)}
                    </div>
                    <div>
                      <h2 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>{selectedStep.label}</h2>
                      <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>{selectedStep.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                    selectedStep.status === "completed" ? "bg-green-50 text-green-700" :
                    selectedStep.status === "active" ? "bg-purple-50 text-purple-700" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {selectedStep.status === "completed" ? "Completed" : selectedStep.status === "active" ? "In Progress" : "Locked"}
                  </span>
                </div>

                {/* Action Buttons */}
                {selectedStep.status === "active" && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                    <button onClick={() => openUploadModal(selectedStep.key)}
                      className="px-3.5 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                      <Upload size={13} /> Upload Document
                    </button>
                    {selectedStep.key === "advertisement" && (
                      <button onClick={() => setShowAdvertiseModal(true)}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-blue-300 bg-blue-50 text-blue-700 flex items-center gap-1.5 hover:bg-blue-100 transition-colors" style={{ fontFamily: F }}>
                        <Globe size={13} /> Post to Portal
                      </button>
                    )}
                    {selectedStep.key === "invitation" && (
                      <button onClick={() => setShowInviteModal(true)}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-purple-300 bg-purple-50 text-purple-700 flex items-center gap-1.5 hover:bg-purple-100 transition-colors" style={{ fontFamily: F }}>
                        <Users size={13} /> Select & Invite Bidders
                      </button>
                    )}
                    {selectedStep.key === "bid_opening" && (
                      <>
                        <button className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-amber-300 bg-amber-50 text-amber-700 flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                          style={{ fontFamily: F }} onClick={() => alert("Automated notifications sent to internal stakeholders.")}>
                          <Bell size={13} /> Notify Stakeholders
                        </button>
                        <button onClick={openBidModal}
                          className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-purple-300 bg-purple-50 text-purple-700 flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
                          style={{ fontFamily: F }}>
                          <Users size={13} /> Record Bid Received
                        </button>
                      </>
                    )}
                    {selectedStep.key === "contract_award" && (
                      <button onClick={() => setShowAwardModal(true)}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-green-300 bg-green-50 text-green-700 flex items-center gap-1.5 hover:bg-green-100 transition-colors" style={{ fontFamily: F }}>
                        <Award size={13} /> Award Contract
                      </button>
                    )}
                    {selectedStep.documents.length > 0 && selectedStep.key !== "contract_award" && (
                      <button onClick={() => handleCompleteStep(selectedStep.key)}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-green-300 bg-green-50 text-green-700 flex items-center gap-1.5 hover:bg-green-100 transition-colors ml-auto" style={{ fontFamily: F }}>
                        <CheckCircle2 size={13} /> Complete Step
                      </button>
                    )}
                    {selectedStep.optional && selectedStep.documents.length === 0 && (
                      <button onClick={() => handleCompleteStep(selectedStep.key)}
                        className="px-3.5 py-2 rounded-lg text-[12px] font-medium border border-slate-300 bg-slate-50 text-slate-600 flex items-center gap-1.5 hover:bg-slate-100 transition-colors ml-auto" style={{ fontFamily: F }}>
                        Skip Step
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Step-specific Guidance & Document Slots */}
              {selectedStep.status !== "locked" && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 mb-3" style={{ fontFamily: F }}>
                    {selectedStep.key === "contract_award" ? "Contract Award" : "Required Documents"}
                  </h3>

                  {selectedStep.key === "contract_award" && (
                    <p className="text-[12px] text-slate-600 mb-4" style={{ fontFamily: F }}>
                      Upload the signed contract. The PR number ({sc.sourcePR}) will convert to a Contract Number and push to the Contract Management Module.
                    </p>
                  )}

                  {selectedStep.key === "submission_portal" && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="border border-slate-200 rounded-lg p-4 bg-white text-center">
                        <Lock size={18} className="text-purple-600 mx-auto mb-2" />
                        <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>Encrypted</p>
                      </div>
                      <div className="border border-slate-200 rounded-lg p-4 bg-white text-center">
                        <CalendarDays size={18} className="text-purple-600 mx-auto mb-2" />
                        <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>Timestamped</p>
                      </div>
                      <div className="border border-slate-200 rounded-lg p-4 bg-white text-center">
                        <ShieldCheck size={18} className="text-purple-600 mx-auto mb-2" />
                        <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: F }}>Locked</p>
                      </div>
                    </div>
                  )}

                  {/* Bids Received Table — shown on bid_opening or evaluation steps */}
                  {(selectedStep.key === "bid_opening" || selectedStep.key === "evaluation") && (sc.vendorsBidding || []).length > 0 && (
                    <div className="mb-4">
                      <p className="text-[12px] font-medium text-slate-700 mb-2 flex items-center gap-1.5" style={{ fontFamily: F }}>
                        <Users size={13} className="text-purple-600" />
                        Bids Received ({sc.vendorsBidding!.length})
                      </p>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-left px-3 py-2 text-[10px] text-slate-500 font-medium" style={{ fontFamily: F }}>Vendor</th>
                              <th className="text-left px-3 py-2 text-[10px] text-slate-500 font-medium" style={{ fontFamily: F }}>Date Received</th>
                              <th className="text-left px-3 py-2 text-[10px] text-slate-500 font-medium" style={{ fontFamily: F }}>Ref #</th>
                              <th className="text-left px-3 py-2 text-[10px] text-slate-500 font-medium" style={{ fontFamily: F }}>Notes</th>
                              {sc.overallStatus !== "Completed" && (
                                <th className="text-center px-3 py-2 text-[10px] text-slate-500 font-medium" style={{ fontFamily: F }}></th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {sc.vendorsBidding!.map((bid, idx) => (
                              <tr key={bid.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                <td className="px-3 py-2 text-[11px] text-slate-900 font-medium" style={{ fontFamily: F }}>{bid.vendorName}</td>
                                <td className="px-3 py-2 text-[11px] text-slate-600" style={{ fontFamily: F }}>{formatDate(bid.dateReceived)}</td>
                                <td className="px-3 py-2 text-[11px] text-slate-600" style={{ fontFamily: F }}>{bid.bidReference || "—"}</td>
                                <td className="px-3 py-2 text-[10px] text-slate-500 max-w-[180px] truncate" style={{ fontFamily: F }}>{bid.notes || "—"}</td>
                                {sc.overallStatus !== "Completed" && (
                                  <td className="px-3 py-2 text-center">
                                    <button onClick={() => handleRemoveBid(bid.id)} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Remove bid">
                                      <X size={11} />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {selectedStep.key === "advertisement" && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="border border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50 text-center">
                        <Globe size={20} className="text-blue-500 mx-auto mb-2" />
                        <p className="text-[12px] font-medium text-blue-700" style={{ fontFamily: F }}>ACET Portal</p>
                        <p className="text-[10px] text-blue-500" style={{ fontFamily: F }}>Post directly from system</p>
                      </div>
                      <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 text-center">
                        <ExternalLink size={20} className="text-slate-400 mx-auto mb-2" />
                        <p className="text-[12px] font-medium text-slate-600" style={{ fontFamily: F }}>External Ad</p>
                        <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Upload ad proof</p>
                      </div>
                    </div>
                  )}

                  {sc.contractNumber && selectedStep.key === "contract_award" && (
                    <>
                      <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[12px] font-medium text-green-800" style={{ fontFamily: F }}>
                            Contract Awarded: {sc.contractNumber}
                          </p>
                          <p className="text-[11px] text-green-600" style={{ fontFamily: F }}>
                            Awarded to {sc.awardedVendor} &middot; Pushed to Contract Management Module
                          </p>
                        </div>
                        {onNavigateToContract && (
                          <button onClick={onNavigateToContract}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5 hover:opacity-90 shrink-0 transition-colors"
                            style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                            <ExternalLink size={12} /> View in Contract Repository
                          </button>
                        )}
                      </div>

                      {/* Signature Section */}
                      <div className="mb-4 px-4 py-3 bg-white border border-slate-200 rounded-lg">
                        <p className="text-[12px] font-semibold text-slate-900 mb-3 flex items-center gap-1.5" style={{ fontFamily: F }}>
                          <PenLine size={13} className="text-purple-600" /> Digital Signature
                        </p>
                        {signed && signatureData ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                              <CheckCircle2 size={13} className="text-emerald-600" />
                              <span className="text-[11px] text-emerald-700" style={{ fontFamily: F }}>
                                Signed by {signatureData.employeeName} on {signedAt}
                              </span>
                            </div>
                            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 inline-flex items-center justify-center">
                              <img src={signatureData.dataUrl} alt="Signature" className="max-w-[180px] max-h-[70px] object-contain" />
                            </div>
                          </div>
                        ) : signatureData ? (
                          <button
                            onClick={() => setShowSignModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium text-white hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#0B01D0", fontFamily: F }}
                          >
                            <PenLine size={13} />
                            Apply My Signature
                          </button>
                        ) : (
                          <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <AlertCircle size={13} className="text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-amber-700" style={{ fontFamily: F }}>
                              No signature uploaded. Go to My Personal Information &rarr; My Signature tab.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Generate PO Button */}
                      <div className="mb-4 px-4 py-3 bg-white border border-slate-200 rounded-lg">
                        <p className="text-[12px] font-semibold text-slate-900 mb-3 flex items-center gap-1.5" style={{ fontFamily: F }}>
                          <FileText size={13} className="text-blue-600" /> Purchase Order
                        </p>
                        {poGenerated ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle2 size={13} className="text-green-600" />
                            <span className="text-[11px] text-green-700" style={{ fontFamily: F }}>
                              PO Generated: <span className="font-semibold">{generatedPONumber}</span> — Signed & dispatched to vendor.
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={onGeneratePO}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium text-white hover:opacity-90 transition-colors"
                            style={{ backgroundColor: "#0B01D0", fontFamily: F }}
                          >
                            <FileText size={13} />
                            Generate Purchase Order
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {/* Document Slots — clickable to upload */}
                  <div className="grid grid-cols-2 gap-3">
                    {getDocLabelsForStep(selectedStep.key, sc.category).map(label => {
                      const uploaded = selectedStep.documents.find(d => d.label === label);
                      return (
                        <div key={label}
                          className={`border rounded-lg p-3 flex items-center gap-3 transition-colors ${
                            uploaded
                              ? "border-green-200 bg-green-50/50 cursor-default"
                              : selectedStep.status === "active"
                              ? "border-dashed border-slate-300 bg-slate-50/50 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30"
                              : "border-dashed border-slate-200 bg-slate-50/30"
                          }`}
                          onClick={() => {
                            if (selectedStep.status === "active") openUploadModal(selectedStep.key, label);
                          }}
                        >
                          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                            uploaded ? "bg-green-100" : "bg-slate-100"
                          }`}>
                            {uploaded ? <CheckCircle2 size={14} className="text-green-600" /> : <FileText size={14} className="text-slate-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] truncate ${uploaded ? "text-green-800 font-medium" : "text-slate-600"}`} style={{ fontFamily: F }}>
                              {label}
                            </p>
                            {uploaded ? (
                              <p className="text-[9px] text-green-600" style={{ fontFamily: F }}>
                                v{uploaded.version} &middot; {uploaded.size} &middot; {formatDate(uploaded.date)}
                              </p>
                            ) : (
                              <p className="text-[9px] text-slate-400" style={{ fontFamily: F }}>
                                {selectedStep.status === "active" ? "Click to upload" : "Required"}
                              </p>
                            )}
                          </div>
                          {uploaded && (
                            <div className="flex items-center gap-1 shrink-0">
                              {uploaded.versions.length > 1 && (
                                <button
                                  onClick={e => { e.stopPropagation(); setShowVersionHistory(uploaded); }}
                                  className="p-1 rounded hover:bg-green-100 transition-colors"
                                  title="Version History"
                                >
                                  <History size={12} className="text-green-600" />
                                </button>
                              )}
                              {selectedStep.status === "active" && (
                                <button
                                  onClick={e => { e.stopPropagation(); openUploadModal(selectedStep.key, label); }}
                                  className="p-1 rounded hover:bg-green-100 transition-colors"
                                  title="Upload New Version"
                                >
                                  <RotateCcw size={12} className="text-green-600" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Uploaded Documents for this Step */}
              {selectedStep.documents.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
                  <h3 className="text-[13px] font-semibold text-slate-900 mb-3 flex items-center gap-2" style={{ fontFamily: F }}>
                    <Paperclip size={14} className="text-purple-700" /> Uploaded Documents ({selectedStep.documents.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedStep.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                            <FileText size={15} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{doc.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{doc.label}</span>
                              <span className="text-[10px] text-slate-300">&middot;</span>
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>v{doc.version}</span>
                              <span className="text-[10px] text-slate-300">&middot;</span>
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{doc.size}</span>
                              <span className="text-[10px] text-slate-300">&middot;</span>
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{doc.uploadedBy}</span>
                              <span className="text-[10px] text-slate-300">&middot;</span>
                              <span className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{formatDate(doc.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {doc.versions.length > 1 && (
                            <button onClick={() => setShowVersionHistory(doc)}
                              className="px-2 py-1 rounded text-[10px] text-purple-600 bg-purple-50 hover:bg-purple-100 flex items-center gap-1 transition-colors"
                              style={{ fontFamily: F }}>
                              <History size={10} /> {doc.versions.length} versions
                            </button>
                          )}
                          <button className="p-1.5 rounded hover:bg-slate-100 transition-colors" title="Download">
                            <Download size={13} className="text-slate-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked State */}
              {selectedStep.status === "locked" && (
                <div className="bg-slate-100 rounded-xl border border-slate-200 p-8 text-center">
                  <Lock size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-[13px] text-slate-500" style={{ fontFamily: F }}>
                    This step is locked. Complete the preceding steps to unlock.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-[13px] text-slate-400" style={{ fontFamily: F }}>Select a step from the left panel.</p>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         UPLOAD MODAL — real file handling + versioning
         ══════════════════════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Upload Document</h3>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>
                  {sc.steps.find(s => s.key === uploadStepKey)?.label} &middot; {sc.caseNumber}
                </p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5">
              {uploadSuccess ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <CheckCircle2 size={28} className="text-green-600" />
                  </div>
                  <p className="text-[14px] font-semibold text-green-800" style={{ fontFamily: F }}>Document Uploaded</p>
                  <p className="text-[11px] text-green-600 mt-1" style={{ fontFamily: F }}>
                    {uploadFile?.name} — {uploadLabel}
                    {(() => {
                      const step = sc.steps.find(s => s.key === uploadStepKey);
                      const ex = step?.documents.find(d => d.label === uploadLabel);
                      return ex ? ` (v${ex.version + 1})` : " (v1)";
                    })()}
                  </p>
                </div>
              ) : (
                <>
                  {/* Document Category */}
                  <div className="mb-4">
                    <label className="text-[12px] font-medium text-slate-700 mb-1.5 block" style={{ fontFamily: F }}>
                      Document Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button onClick={() => setUploadLabelDropdown(!uploadLabelDropdown)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-left text-[12px] text-slate-900 bg-white hover:bg-slate-50 flex items-center justify-between"
                        style={{ fontFamily: F }}>
                        {uploadLabel || "Select document type..."}
                        <ChevronDown size={14} className="text-slate-400" />
                      </button>
                      {uploadLabelDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setUploadLabelDropdown(false)} />
                          <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                            {getAvailableLabels().map(l => {
                              const step = sc.steps.find(s => s.key === uploadStepKey);
                              const existing = step?.documents.find(d => d.label === l);
                              return (
                                <button key={l} onClick={() => { setUploadLabel(l); setUploadLabelDropdown(false); }}
                                  className="w-full px-4 py-2.5 text-left text-[12px] text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                                  style={{ fontFamily: F }}>
                                  <span>{l}</span>
                                  {existing && (
                                    <span className="text-[10px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded">v{existing.version} — replace</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                    {uploadLabel && (() => {
                      const step = sc.steps.find(s => s.key === uploadStepKey);
                      const existing = step?.documents.find(d => d.label === uploadLabel);
                      if (!existing) return null;
                      return (
                        <div className="mt-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2">
                          <RotateCcw size={12} className="text-purple-600" />
                          <p className="text-[11px] text-purple-700" style={{ fontFamily: F }}>
                            Existing: <span className="font-medium">{existing.name}</span> (v{existing.version}) — uploading will create v{existing.version + 1}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* File Drop Zone */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      uploadFile ? "border-green-300 bg-green-50/50" : "border-slate-300 bg-slate-50"
                    }`}
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {uploadFile ? (
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <FileText size={18} className="text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{uploadFile.name}</p>
                          <p className="text-[10px] text-slate-500" style={{ fontFamily: F }}>
                            {formatFileSize(uploadFile.size)} &middot; {getFileType(uploadFile.name)}
                          </p>
                        </div>
                        <button onClick={() => setUploadFile(null)} className="p-1 hover:bg-red-50 rounded" title="Remove">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} className="text-slate-400 mx-auto mb-2" />
                        <p className="text-[13px] text-slate-600" style={{ fontFamily: F }}>Drag & drop file here</p>
                        <p className="text-[11px] text-slate-400 mt-1" style={{ fontFamily: F }}>PDF, DOCX, XLSX, PNG, JPG, CSV, ZIP — Max 25MB</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden"
                      accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg,.csv,.zip"
                      onChange={handleFileSelect} />
                    {!uploadFile && (
                      <button onClick={() => fileInputRef.current?.click()}
                        className="mt-3 px-4 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                        Browse Files
                      </button>
                    )}
                  </div>

                  {/* Error */}
                  {uploadError && (
                    <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertTriangle size={12} className="text-red-500" />
                      <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{uploadError}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            {!uploadSuccess && (
              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>
                  Cancel
                </button>
                <button onClick={handleUploadConfirm}
                  disabled={!uploadFile || !uploadLabel}
                  className="px-5 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  Upload
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         VERSION HISTORY MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showVersionHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Version History</h3>
                <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: F }}>{showVersionHistory.label}</p>
              </div>
              <button onClick={() => setShowVersionHistory(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {[...showVersionHistory.versions].reverse().map((v, i) => (
                  <div key={v.versionNumber} className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${
                    i === 0 ? "border-green-200 bg-green-50/50" : "border-slate-100 bg-slate-50"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      i === 0 ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-500"
                    }`}>
                      <span className="text-[11px] font-semibold" style={{ fontFamily: F }}>v{v.versionNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-slate-900 truncate" style={{ fontFamily: F }}>{v.name}</p>
                      <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>
                        {v.uploadedBy} &middot; {formatDate(v.date)} &middot; {v.size}
                      </p>
                    </div>
                    {i === 0 && (
                      <span className="text-[9px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded font-medium" style={{ fontFamily: F }}>Current</span>
                    )}
                    <button className="p-1 rounded hover:bg-slate-100" title="Download">
                      <Download size={13} className="text-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowVersionHistory(null)}
                className="px-4 py-2 text-[12px] text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50" style={{ fontFamily: F }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         ADVERTISE MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showAdvertiseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Post Advertisement</h3>
              <button onClick={() => setShowAdvertiseModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-[12px] text-slate-600 mb-4" style={{ fontFamily: F }}>Select where to post this solicitation:</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" defaultChecked className="accent-purple-700 w-4 h-4" />
                  <div>
                    <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>ACET Procurement Portal</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Auto-post to internal portal</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="accent-purple-700 w-4 h-4" />
                  <div>
                    <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>ACET Website</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Post to public-facing website</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="accent-purple-700 w-4 h-4" />
                  <div>
                    <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>External (Manual Upload)</p>
                    <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>Upload proof of newspaper/website ad</p>
                  </div>
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setShowAdvertiseModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
                <button onClick={() => { alert("Advertisement posted (simulated)."); setShowAdvertiseModal(false); }}
                  className="px-4 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  Post Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         INVITE BIDDERS MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[580px] max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>
                {sc.method === "Direct Selection" ? "Select Vendor" : "Select & Invite Bidders"}
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {(sc.category === "Services" || sc.category === "Consultancy") && (
                <div className="mb-4">
                  <p className="text-[12px] font-medium text-slate-700 mb-2" style={{ fontFamily: F }}>Proposal Requirement</p>
                  <div className="flex gap-2">
                    {(["Technical", "Financial", "Both"] as const).map(t => (
                      <button key={t} onClick={() => setProposalType(t)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${
                          proposalType === t ? "bg-purple-700 text-white border-purple-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`} style={{ fontFamily: F }}>
                        {t === "Both" ? "Technical + Financial" : `${t} Only`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-[12px] text-slate-600 mb-3" style={{ fontFamily: F }}>Select vendors from the database:</p>
              <div className="space-y-2">
                {AVAILABLE_VENDORS.map(v => (
                  <label key={v.id} className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedVendors.includes(v.id) ? "border-purple-300 bg-purple-50" : "border-slate-200 hover:bg-slate-50"
                  }`}>
                    <input type={sc.method === "Direct Selection" ? "radio" : "checkbox"} name="vendor"
                      checked={selectedVendors.includes(v.id)}
                      onChange={() => sc.method === "Direct Selection" ? setSelectedVendors([v.id]) : toggleVendor(v.id)}
                      className="accent-purple-700 w-4 h-4" />
                    <div className="flex-1">
                      <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: F }}>{v.name}</p>
                      <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>{v.category}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>{selectedVendors.length} selected</span>
              <div className="flex gap-3">
                <button onClick={() => { setShowInviteModal(false); setSelectedVendors([]); }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
                <button onClick={() => { alert(`Invitations sent to ${selectedVendors.length} vendor(s).`); setShowInviteModal(false); setSelectedVendors([]); }}
                  disabled={selectedVendors.length === 0}
                  className="px-4 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  Send Invitations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         CONTRACT AWARD MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showAwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-6 py-4 border-b border-green-200 bg-green-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-green-600" />
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Award Contract</h3>
              </div>
              <button onClick={() => setShowAwardModal(false)} className="p-1.5 hover:bg-green-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-[12px] text-slate-600 mb-4" style={{ fontFamily: F }}>
                The PR number <span className="font-medium text-indigo-700">{sc.sourcePR}</span> will be converted to a Contract Number and pushed to the Contract Management Module.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Awarded Vendor *</label>
                  <select value={awardVendor} onChange={e => setAwardVendor(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                    style={{ fontFamily: F }}>
                    <option value="">Select vendor...</option>
                    {AVAILABLE_VENDORS.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Contract Number (auto-generated)</label>
                  <input type="text" readOnly value={`CNT-${sc.sourcePR.replace("PR-", "")}`}
                    className="bg-slate-100 border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-700 font-medium"
                    style={{ fontFamily: F }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Comments</label>
                  <textarea value={contractComment} onChange={e => setContractComment(e.target.value)} rows={2}
                    placeholder="Any remarks..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:border-green-400"
                    style={{ fontFamily: F }} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowAwardModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
              <button
                onClick={() => {
                  if (!awardVendor) { alert("Please select a vendor."); return; }
                  const contractNumber = `CNT-${sc.sourcePR.replace("PR-", "")}`;
                  onContractAward({ caseId: sc.id, contractNumber, vendor: awardVendor, comments: contractComment });
                  setShowAwardModal(false);
                  setAwardVendor("");
                  setContractComment("");
                }}
                disabled={!awardVendor}
                className="px-5 py-2 text-[12px] font-medium text-white rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: F }}>
                Award & Push to Contracts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         RECORD VENDOR BID MODAL — manual bid submission tracking
         ══════════════════════════════════════════════════════════════════════ */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden">
            <div className="px-6 py-4 border-b border-purple-200 bg-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-purple-600" />
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Record Vendor Bid</h3>
                  <p className="text-[10px] text-purple-600 mt-0.5" style={{ fontFamily: F }}>Manual entry — bids received physically or via email</p>
                </div>
              </div>
              <button onClick={() => setShowBidModal(false)} className="p-1.5 hover:bg-purple-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800" style={{ fontFamily: F }}>
                  Bids are received manually (physical delivery, email, or courier). Use this form to log each bid as it is received.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Vendor / Bidder Name <span className="text-red-500">*</span></label>
                  <input type="text" value={bidVendorName} onChange={e => { setBidVendorName(e.target.value); setBidError(""); }}
                    placeholder="Enter vendor or bidder name..."
                    className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    style={{ fontFamily: F }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Date Received</label>
                    <input type="date" value={bidDate} onChange={e => setBidDate(e.target.value)}
                      className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      style={{ fontFamily: F }} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Bid / Reference Number</label>
                    <input type="text" value={bidReference} onChange={e => setBidReference(e.target.value)}
                      placeholder="e.g. BID-001"
                      className="border border-slate-200 rounded-lg h-[36px] px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      style={{ fontFamily: F }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-600" style={{ fontFamily: F }}>Notes (delivery method, condition, etc.)</label>
                  <textarea value={bidNotes} onChange={e => setBidNotes(e.target.value)} rows={2}
                    placeholder="e.g. Received via courier, sealed envelope, 2 copies..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:ring-2 focus:ring-purple-400"
                    style={{ fontFamily: F }} />
                </div>
              </div>
              {bidError && (
                <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={12} className="text-red-500" />
                  <p className="text-[11px] text-red-600" style={{ fontFamily: F }}>{bidError}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400" style={{ fontFamily: F }}>
                Current bids recorded: {sc.vendorsBidding?.length || 0}
              </span>
              <div className="flex gap-3">
                <button onClick={() => setShowBidModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50" style={{ fontFamily: F }}>Cancel</button>
                <button onClick={handleAddBid}
                  disabled={!bidVendorName.trim()}
                  className="px-5 py-2 text-[12px] font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                  Record Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Contract Modal */}
      {showSignModal && signatureData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSignModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[15px] font-semibold text-slate-900" style={{ fontFamily: F }}>Apply Signature</h3>
              <button onClick={() => setShowSignModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[12px] text-slate-600" style={{ fontFamily: F }}>You are about to sign this contract with your personal signature:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Contract</span>
                  <span className="text-[11px] text-slate-900 font-medium" style={{ fontFamily: F }}>{sc.contractNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Vendor</span>
                  <span className="text-[11px] text-slate-900" style={{ fontFamily: F }}>{sc.awardedVendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: F }}>Signed By</span>
                  <span className="text-[11px] text-slate-900" style={{ fontFamily: F }}>{signatureData.employeeName}</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center">
                <img src={signatureData.dataUrl} alt="My Signature" className="max-w-[220px] max-h-[90px] object-contain" />
              </div>
              <p className="text-[10px] text-slate-400" style={{ fontFamily: F }}>By clicking "Confirm & Sign", you confirm this is your personal signature.</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setShowSignModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-[12px] hover:bg-slate-50" style={{ fontFamily: F }}>
                Cancel
              </button>
              <button onClick={handleApplySignature}
                className="px-4 py-2 text-white rounded-lg text-[12px] hover:opacity-90 flex items-center gap-1.5"
                style={{ backgroundColor: "#0B01D0", fontFamily: F }}>
                <PenLine size={13} />
                Confirm & Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
