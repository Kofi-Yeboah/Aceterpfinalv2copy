import { useState } from "react";
import { ChevronLeft, ChevronRight, X, FileText, Upload, RotateCcw, Trash2, Eye, Download, ClipboardEdit, History, Clock, User, FileUp, ExternalLink, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";

// ─── PDF Preview Modal ─────────────────────────────────────────────────────────
interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

function PDFPreviewModal({ isOpen, onClose, fileName }: PDFPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  if (!isOpen) return null;

  const pages = [
    {
      content: (
        <div className="space-y-6">
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-slate-900">Project Concept: Warehouse Automation v2</h1>
            <p className="text-sm text-slate-600 mt-2">ID: P000001 | Status: Inception - Draft</p>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Project Overview</h2>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-800 mb-2">Project Title:</h3>
                <p className="text-slate-700">Warehouse Automation & Digitization Phase 1</p>
              </div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-800 mb-2">Problem Statement:</h3>
                <p className="text-slate-700">
                  Currently, inventory tracking is manual, leading to a 15% stock variance and 3-day delays in reporting.
                  We are losing money on expired goods due to poor visibility.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-800 mb-2">Proposed Solution (Description):</h3>
                <p className="text-slate-700">
                  Implement a barcode scanning system and integrate it with the central ERP. This includes procuring
                  50 handheld scanners and training warehouse staff.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-800 mb-2">Strategic Alignment:</h3>
                <p className="text-slate-700">Select Goal: ☒ Operational Efficiency ☐ Market Expansion ☐ Compliance</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Objectives & Scope (The "What")</h2>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2">Primary Objective:</h3>
              <p className="text-slate-700">Reduce inventory variance to &lt;1% by Q4 2026.</p>
            </div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2">Secondary Objective:</h3>
              <p className="text-slate-700">Real-time visibility of stock levels for the Sales Team.</p>
            </div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2">In Scope:</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>Procurement of Hardware (Scanners, Servers).</li>
                <li>Software Installation.</li>
                <li>Staff Training (Accra & Kumasi branches).</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2">Out of Scope:</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>Renovation of the physical warehouse building.</li>
                <li>Automation of the Transport Fleet.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">3. High-Level Estimates</h2>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2">Estimated Duration:</h3>
              <p className="text-slate-700">6 Months (Start: Jan 1, 2026 | End: June 30, 2026).</p>
            </div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2">Estimated Budget:</h3>
              <p className="text-slate-700">$150,000.</p>
            </div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2">Funding Source:</h3>
              <p className="text-slate-700">Dropdown: IT Modernization Fund</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Key Deliverables</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              <li>Fully functional Barcode System.</li>
              <li>Updated Standard Operating Procedures (SOPs).</li>
              <li>Training Completion Certificates for 20 staff.</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X className="size-8" />
      </button>
      {currentPage > 1 && (
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        >
          <ChevronLeft className="size-12" />
        </button>
      )}
      {currentPage < totalPages && (
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        >
          <ChevronRight className="size-12" />
        </button>
      )}
      <div
        className="bg-white max-w-4xl w-full mx-auto my-8 rounded shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        <div className="bg-white p-12 overflow-y-auto" style={{ height: "calc(90vh - 60px)" }}>
          {pages[currentPage - 1].content}
        </div>
        <div className="bg-[#2d2d2d] h-[60px] flex items-center justify-center">
          <div className="bg-[#3d3d3d] px-4 py-2 rounded flex items-center gap-4">
            <span className="text-white text-sm">
              page {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Version History Modal ──────────────────────────────────────────────────────
interface VersionEntry {
  version: string;
  date: string;
  uploadedBy: string;
  fileSize: string;
  notes: string;
}

const MOCK_VERSION_HISTORY: Record<string, VersionEntry[]> = {
  wbs: [
    { version: "v2.0", date: "Feb 8, 2026", uploadedBy: "Yaw Osei", fileSize: "420 KB", notes: "Added Phase 4 tasks and milestones" },
    { version: "v1.0", date: "Jan 22, 2026", uploadedBy: "Yaw Osei", fileSize: "380 KB", notes: "Initial WBS structure" },
  ],
  "staff-allocation": [
    { version: "v1.0", date: "Feb 5, 2026", uploadedBy: "Nana Yaw", fileSize: "340 KB", notes: "Staff allocation plan generated from budget" },
  ],
  budget: [
    { version: "v2.0", date: "Feb 12, 2026", uploadedBy: "Kwame Asante", fileSize: "560 KB", notes: "Revised line items after procurement review" },
    { version: "v1.0", date: "Jan 28, 2026", uploadedBy: "Kwame Asante", fileSize: "510 KB", notes: "Initial budget breakdown" },
  ],
  procurement: [
    { version: "v1.0", date: "Feb 5, 2026", uploadedBy: "Nana Yaw", fileSize: "340 KB", notes: "Procurement plan generated from budget" },
  ],
  resource: [
    { version: "v1.0", date: "Feb 5, 2026", uploadedBy: "Nana Yaw", fileSize: "290 KB", notes: "Resource plan generated from budget" },
  ],
  risk: [
    { version: "v2.0", date: "Feb 14, 2026", uploadedBy: "Ama Serwaa", fileSize: "480 KB", notes: "Updated risk matrix with mitigation strategies" },
    { version: "v1.0", date: "Jan 30, 2026", uploadedBy: "Ama Serwaa", fileSize: "440 KB", notes: "Initial risk register" },
  ],
  mel: [
    { version: "v1.0", date: "Feb 1, 2026", uploadedBy: "Kwesi Appiah", fileSize: "520 KB", notes: "MEL framework with indicators" },
  ],
  comms: [
    { version: "v1.0", date: "Feb 3, 2026", uploadedBy: "Kofi Mensah", fileSize: "310 KB", notes: "Communications plan draft" },
  ],
  travel: [
    { version: "v1.0", date: "Feb 6, 2026", uploadedBy: "Yaw Osei", fileSize: "260 KB", notes: "Initial travel plan" },
  ],
};

function VersionHistoryModal({
  isOpen,
  onClose,
  docTitle,
  docId,
}: {
  isOpen: boolean;
  onClose: () => void;
  docTitle: string;
  docId: string;
}) {
  if (!isOpen) return null;

  const versions = MOCK_VERSION_HISTORY[docId] || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <History className="w-[18px] h-[18px] text-indigo-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">Version History</h2>
              <p className="text-[12px] text-slate-500">{docTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto p-6">
          {versions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-[13px] text-slate-500">No version history available.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[17px] top-8 bottom-4 w-px bg-slate-200" />

              <div className="space-y-0">
                {versions.map((v, i) => (
                  <div key={v.version} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Timeline dot */}
                    <div className="relative z-10 mt-1">
                      <div
                        className={`w-[9px] h-[9px] rounded-full border-2 ${
                          i === 0
                            ? "bg-indigo-600 border-indigo-600"
                            : "bg-white border-slate-300"
                        }`}
                        style={{ marginLeft: "13px" }}
                      />
                    </div>

                    {/* Version content card */}
                    <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-4 ml-2 hover:border-slate-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[12px] font-semibold px-2 py-0.5 rounded ${
                              i === 0
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {v.version}
                          </span>
                          {i === 0 && (
                            <span className="text-[11px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <button className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                      <p className="text-[12px] text-slate-700 mb-2">{v.notes}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {v.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {v.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileUp className="w-3 h-3" />
                          {v.fileSize}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[12px] text-slate-500">
            {versions.length} version{versions.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[12px] text-slate-700 border border-slate-200 rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Document Icon Helper ───────────────────────────────────────────────────────
function getDocIcon(docId: string) {
  const iconMap: Record<string, { bg: string; color: string }> = {
    wbs: { bg: "bg-violet-50", color: "text-violet-600" },
    "staff-allocation": { bg: "bg-orange-50", color: "text-orange-600" },
    budget: { bg: "bg-green-50", color: "text-green-600" },
    procurement: { bg: "bg-cyan-50", color: "text-cyan-600" },
    resource: { bg: "bg-amber-50", color: "text-amber-600" },
    risk: { bg: "bg-red-50", color: "text-red-600" },
    mel: { bg: "bg-indigo-50", color: "text-indigo-600" },
    comms: { bg: "bg-pink-50", color: "text-pink-600" },
    travel: { bg: "bg-teal-50", color: "text-teal-600" },
  };
  return iconMap[docId] || { bg: "bg-slate-50", color: "text-slate-600" };
}

// ─── Redesigned Document Card ───────────────────────────────────────────────────
interface DocumentCardProps {
  id: string;
  title: string;
  uploaded: boolean;
  fileName?: string;
  disabled?: boolean;
  onDownloadTemplate: () => void;
  onInputDetails: () => void;
  onUpload: () => void;
  onReupload: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onView: () => void;
  onVersionHistory: () => void;
}

function DocumentCard({
  id,
  title,
  uploaded,
  fileName,
  disabled,
  onDownloadTemplate,
  onInputDetails,
  onUpload,
  onReupload,
  onDelete,
  onPreview,
  onView,
  onVersionHistory,
}: DocumentCardProps) {
  const iconStyle = getDocIcon(id);
  const isPlanView = title === "Procurement Plan" || title === "Resource Plan" || title === "Staff Allocation";

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm overflow-hidden">
      <div className="p-5">
        {/* Top Row: Icon + Title + Badge */}
        <div className="flex items-start gap-4">
          {/* Document type icon */}
          <div className={`w-11 h-11 rounded-xl ${iconStyle.bg} flex items-center justify-center shrink-0`}>
            <FileText className={`w-5 h-5 ${iconStyle.color}`} />
          </div>

          {/* Title and meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <h3 className="text-[15px] font-semibold text-slate-900 truncate">{title}</h3>
              {uploaded ? (
                <Badge className="bg-green-50 text-green-700 hover:bg-green-50 text-[11px] border-0 shadow-none shrink-0">
                  Uploaded
                </Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 text-[11px] border-0 shadow-none shrink-0">
                  Not uploaded
                </Badge>
              )}
            </div>

            {/* File name or placeholder */}
            {uploaded && fileName ? (
              <button
                onClick={onPreview}
                className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:text-blue-800 hover:underline transition-colors group"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600" />
                {fileName}
              </button>
            ) : (
              <p className="text-[13px] text-slate-400 italic">No document uploaded yet</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 my-4" />

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {isPlanView ? (
            /* Plan-type cards only show View */
            <button
              onClick={onView}
              className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border border-blue-200 bg-blue-50 text-[12px] text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </button>
          ) : (
            <>
              {/* Download Template */}
              <button
                onClick={disabled ? undefined : onDownloadTemplate}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border text-[12px] transition-colors ${
                  disabled
                    ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50"
                    : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                Download Template
              </button>

              {/* Input Details */}
              <button
                onClick={disabled ? undefined : onInputDetails}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border text-[12px] transition-colors ${
                  disabled
                    ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50"
                    : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <ClipboardEdit className="w-3.5 h-3.5" />
                Input Details
              </button>

              {/* Upload or Reupload */}
              {uploaded ? (
                <button
                  onClick={disabled ? undefined : onReupload}
                  disabled={disabled}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border text-[12px] transition-colors ${
                    disabled
                      ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50"
                      : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reupload
                </button>
              ) : (
                <button
                  onClick={disabled ? undefined : onUpload}
                  disabled={disabled}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border text-[12px] transition-colors ${
                    disabled
                      ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50"
                      : "border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Document
                </button>
              )}

              {/* Preview (uploaded) */}
              {uploaded && (
                <button
                  onClick={onPreview}
                  className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border border-blue-200 bg-blue-50 text-[12px] text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
              )}

              {/* Delete (uploaded) */}
              {uploaded && (
                <button
                  onClick={disabled ? undefined : onDelete}
                  disabled={disabled}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border text-[12px] transition-colors ${
                    disabled
                      ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50"
                      : "border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </>
          )}

          {/* Spacer to push Version History to the right */}
          {uploaded && <div className="flex-1" />}

          {/* Version History (uploaded) */}
          {uploaded && (
            <button
              onClick={onVersionHistory}
              className="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border border-slate-200 bg-white text-[12px] text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              Version History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
interface Document {
  id: string;
  title: string;
  uploaded: boolean;
  fileName?: string;
  disabled?: boolean;
}

interface InceptionDocumentCardsProps {
  onNavigateToWBS?: () => void;
  onNavigateToProcurementPlan?: () => void;
  onNavigateToBudget?: () => void;
  onNavigateToRiskManagement?: () => void;
  onNavigateToCommsPlan?: () => void;
  onOpenDocumentInput?: (docId: string, title: string) => void;
  onNavigateToResourcePlan?: () => void;
  onNavigateToStaffAllocation?: () => void;
  onNavigateToTravelPlan?: () => void;
  projectName?: string;
  onSubmitPlansForApproval?: () => void;
}

export function InceptionDocumentCards({
  onNavigateToWBS,
  onNavigateToProcurementPlan,
  onNavigateToBudget,
  onNavigateToRiskManagement,
  onNavigateToCommsPlan,
  onOpenDocumentInput,
  onNavigateToResourcePlan,
  onNavigateToStaffAllocation,
  onNavigateToTravelPlan,
  projectName,
  onSubmitPlansForApproval,
}: InceptionDocumentCardsProps) {
  const isPendingApproval =
    projectName === "Healthcare System Strengthening Project" ||
    projectName === "Urban Infrastructure Development Plan";

  const [documents, setDocuments] = useState<Document[]>(
    isPendingApproval
      ? [
          { id: "wbs", title: "Work Breakdown Structure", uploaded: true, fileName: "Work_Breakdown_Structure_document.pdf", disabled: true },
          { id: "staff-allocation", title: "Staff Allocation", uploaded: true, fileName: "Staff_Allocation_document.pdf", disabled: true },
          { id: "budget", title: "Budget", uploaded: true, fileName: "Budget_document.pdf", disabled: true },
          { id: "procurement", title: "Procurement Plan", uploaded: true, fileName: "Procurement_Plan_document.pdf", disabled: true },
          { id: "resource", title: "Resource Plan", uploaded: true, fileName: "Resource_Plan_document.pdf", disabled: true },
          { id: "risk", title: "Risk Management Plan", uploaded: true, fileName: "Risk_Management_Plan_document.pdf", disabled: true },
          { id: "mel", title: "MEL Plan", uploaded: true, fileName: "MEL_Plan_document.pdf", disabled: true },
          { id: "comms", title: "Comms Plan", uploaded: true, fileName: "Comms_Plan_document.pdf", disabled: true },
          { id: "travel", title: "Travel Plan", uploaded: true, fileName: "Travel_Plan_document.pdf", disabled: true },
        ]
      : [
          { id: "wbs", title: "Work Breakdown Structure", uploaded: false },
          { id: "staff-allocation", title: "Staff Allocation", uploaded: false },
          { id: "budget", title: "Budget", uploaded: false },
          { id: "procurement", title: "Procurement Plan", uploaded: false },
          { id: "resource", title: "Resource Plan", uploaded: false },
          { id: "risk", title: "Risk Management Plan", uploaded: false },
          { id: "mel", title: "MEL Plan", uploaded: false },
          { id: "comms", title: "Comms Plan", uploaded: false },
          { id: "travel", title: "Travel Plan", uploaded: false },
        ]
  );

  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const [versionHistoryDoc, setVersionHistoryDoc] = useState<{ id: string; title: string } | null>(null);

  const handleDownloadTemplate = (docId: string) => {
    console.log("Download template for:", docId);
  };

  const handleInputDetails = (docId: string) => {
    console.log("Input details for:", docId);

    if (docId === "wbs" && onNavigateToWBS) {
      onNavigateToWBS();
      return;
    }
    if (docId === "budget" && onNavigateToBudget) {
      onNavigateToBudget();
      return;
    }
    if (docId === "procurement" && onNavigateToProcurementPlan) {
      onNavigateToProcurementPlan();
      return;
    }
    if (docId === "risk" && onNavigateToRiskManagement) {
      onNavigateToRiskManagement();
      return;
    }
    if (docId === "comms" && onNavigateToCommsPlan) {
      onNavigateToCommsPlan();
      return;
    }
    if (docId === "resource") {
      if (onNavigateToResourcePlan) onNavigateToResourcePlan();
      return;
    }
    if (docId === "travel") {
      if (onNavigateToTravelPlan) onNavigateToTravelPlan();
      return;
    }
    if (docId === "staff-allocation") {
      if (onNavigateToStaffAllocation) onNavigateToStaffAllocation();
      return;
    }

    const doc = documents.find((d) => d.id === docId);
    if (doc && onOpenDocumentInput) {
      onOpenDocumentInput(docId, doc.title);
    }
  };

  const handleUpload = (docId: string) => {
    console.log("Upload document for:", docId);
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === docId ? { ...doc, uploaded: true, fileName: `${doc.title.replace(/ /g, "_")}_document.pdf` } : doc
      )
    );
  };

  const handleReupload = (docId: string) => {
    console.log("Reupload document for:", docId);
  };

  const handleDelete = (docId: string) => {
    console.log("Delete document for:", docId);
    setDocuments((docs) =>
      docs.map((doc) => (doc.id === docId ? { ...doc, uploaded: false, fileName: undefined } : doc))
    );
  };

  const handlePreview = (docId: string) => {
    console.log("Preview document for:", docId);
    setPreviewDocId(docId);
  };

  const handleView = (docId: string) => {
    console.log("View for:", docId);
    if (docId === "procurement" && onNavigateToProcurementPlan) {
      onNavigateToProcurementPlan();
    }
    if (docId === "resource" && onNavigateToResourcePlan) {
      onNavigateToResourcePlan();
    }
    if (docId === "staff-allocation" && onNavigateToStaffAllocation) {
      onNavigateToStaffAllocation();
    }
  };

  const handleVersionHistory = (docId: string, title: string) => {
    setVersionHistoryDoc({ id: docId, title });
  };

  const allPlansComplete = documents.every((doc) => doc.uploaded);
  const uploadedCount = documents.filter((doc) => doc.uploaded).length;
  const totalCount = documents.length;
  const [plansSubmitted, setPlansSubmitted] = useState(isPendingApproval);

  const handleSubmitPlans = () => {
    setPlansSubmitted(true);
    // Lock all documents after submission
    setDocuments((docs) => docs.map((doc) => ({ ...doc, disabled: true })));
    if (onSubmitPlansForApproval) onSubmitPlansForApproval();
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            title={doc.title}
            uploaded={doc.uploaded}
            fileName={doc.fileName}
            disabled={doc.disabled}
            onDownloadTemplate={() => handleDownloadTemplate(doc.id)}
            onInputDetails={() => handleInputDetails(doc.id)}
            onUpload={() => handleUpload(doc.id)}
            onReupload={() => handleReupload(doc.id)}
            onDelete={() => handleDelete(doc.id)}
            onPreview={() => handlePreview(doc.id)}
            onView={() => handleView(doc.id)}
            onVersionHistory={() => handleVersionHistory(doc.id, doc.title)}
          />
        ))}
      </div>

      {/* Submit Project Plans for Approval */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {plansSubmitted ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-900">Plans Submitted for Approval</h3>
                  <p className="text-[12px] text-amber-600 mt-0.5">All {totalCount} project plans are pending review by the approving authority</p>
                </div>
              </>
            ) : allPlansComplete ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-900">All Plans Complete</h3>
                  <p className="text-[12px] text-emerald-600 mt-0.5">{totalCount} of {totalCount} documents uploaded — ready for submission</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-900">Plans Incomplete</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">{uploadedCount} of {totalCount} documents uploaded — complete all plans before submitting</p>
                </div>
              </>
            )}
          </div>

          {plansSubmitted ? (
            <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 text-[12px] border border-amber-200 shadow-none px-4 py-1.5">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Pending Approval
            </Badge>
          ) : (
            <button
              onClick={handleSubmitPlans}
              disabled={!allPlansComplete}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
                allPlansComplete
                  ? "bg-[#0B01D0] text-white hover:bg-[#0900a5] shadow-sm"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
              Submit Project Plans for Approval
            </button>
          )}
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewDocId && (
        <PDFPreviewModal
          isOpen={true}
          onClose={() => setPreviewDocId(null)}
          fileName={documents.find((doc) => doc.id === previewDocId)?.fileName || ""}
        />
      )}

      {/* Version History Modal */}
      {versionHistoryDoc && (
        <VersionHistoryModal
          isOpen={true}
          onClose={() => setVersionHistoryDoc(null)}
          docTitle={versionHistoryDoc.title}
          docId={versionHistoryDoc.id}
        />
      )}
    </>
  );
}