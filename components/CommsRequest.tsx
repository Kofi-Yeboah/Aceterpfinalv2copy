import { useState, useRef } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  ArrowLeft,
  Paperclip,
  Upload,
  MessageSquare,
  Inbox,
  Send,
  Ban,
  Check,
} from "lucide-react";

const STAFF_LIST = [
  "Ama Darko",
  "Abena Owusu",
  "Daniel Quaye",
  "Ebenezer Adams",
  "Efua Mensah",
  "Grace Tetteh",
  "James Owusu",
  "Kofi Boateng",
  "Kofi Mensah",
  "Kwame Asante",
  "Kwaku Anane",
  "Kwesi Appiah",
  "Mercy Adjei",
  "Nana Yaw",
  "Naomi Ansah",
  "Richard Antwi",
  "Yaw Osei",
];

interface CommsRequestRecord {
  id: string;
  referenceNo: string;
  requestName: string;
  description: string;
  assignedBy: string;
  assignedTo: string;
  status: "Pending" | "Completed" | "Rejected" | "Cancelled";
  submittedOn: string;
  attachments: string[];
  completionAttachments?: string[];
}

const initialIncoming: CommsRequestRecord[] = [
  {
    id: "1",
    referenceNo: "CR-2026-0031",
    requestName: "Press Release Review",
    description: "Review and approve the Q1 press release draft before distribution to media outlets.",
    assignedBy: "Ama Darko",
    assignedTo: "Ebenezer Adams",
    status: "Pending",
    submittedOn: "May 18, 2026",
    attachments: ["press_release_q1.pdf"],
  },
  {
    id: "2",
    referenceNo: "CR-2026-0028",
    requestName: "Social Media Campaign Assets",
    description: "Provide design assets for the upcoming awareness campaign on social media platforms.",
    assignedBy: "Naomi Ansah",
    assignedTo: "Ebenezer Adams",
    status: "Pending",
    submittedOn: "May 14, 2026",
    attachments: ["campaign_brief.docx", "brand_guidelines.pdf"],
  },
  {
    id: "3",
    referenceNo: "CR-2026-0022",
    requestName: "Newsletter Content Submission",
    description: "Submit article content for the monthly internal newsletter by end of week.",
    assignedBy: "Kofi Boateng",
    assignedTo: "Ebenezer Adams",
    status: "Completed",
    submittedOn: "May 05, 2026",
    attachments: [],
    completionAttachments: ["newsletter_article.docx"],
  },
  {
    id: "4",
    referenceNo: "CR-2026-0019",
    requestName: "Event Photography Coordination",
    description: "Coordinate with external photographer for the annual stakeholder event coverage.",
    assignedBy: "Efua Mensah",
    assignedTo: "Ebenezer Adams",
    status: "Rejected",
    submittedOn: "Apr 28, 2026",
    attachments: ["event_schedule.pdf"],
  },
  {
    id: "5",
    referenceNo: "CR-2026-0015",
    requestName: "Website Content Update",
    description: "Update the About Us page with new team member profiles and organizational chart.",
    assignedBy: "Abena Owusu",
    assignedTo: "Ebenezer Adams",
    status: "Pending",
    submittedOn: "Apr 20, 2026",
    attachments: ["new_profiles.docx"],
  },
];

const initialOutgoing: CommsRequestRecord[] = [
  {
    id: "6",
    referenceNo: "CR-2026-0030",
    requestName: "Video Production Request",
    description: "Request video team to produce a short documentary on the community outreach program.",
    assignedBy: "Ebenezer Adams",
    assignedTo: "Daniel Quaye",
    status: "Pending",
    submittedOn: "May 16, 2026",
    attachments: ["video_brief.pdf", "storyboard.pptx"],
  },
  {
    id: "7",
    referenceNo: "CR-2026-0025",
    requestName: "Branding Materials Order",
    description: "Order branded merchandise for the upcoming conference including banners, flyers, and name tags.",
    assignedBy: "Ebenezer Adams",
    assignedTo: "Kwesi Appiah",
    status: "Pending",
    submittedOn: "May 10, 2026",
    attachments: ["order_list.xlsx"],
  },
  {
    id: "8",
    referenceNo: "CR-2026-0020",
    requestName: "Translation Request",
    description: "Translate annual report summary from English to French for distribution to West Africa partners.",
    assignedBy: "Ebenezer Adams",
    assignedTo: "Ama Darko",
    status: "Completed",
    submittedOn: "May 02, 2026",
    attachments: ["annual_report_summary.pdf"],
    completionAttachments: ["rapport_annuel_resume.pdf"],
  },
  {
    id: "9",
    referenceNo: "CR-2026-0014",
    requestName: "Media Contact List Update",
    description: "Update the media contact database with new journalist contacts from recent press events.",
    assignedBy: "Ebenezer Adams",
    assignedTo: "Naomi Ansah",
    status: "Completed",
    submittedOn: "Apr 18, 2026",
    attachments: [],
    completionAttachments: ["media_contacts_updated.xlsx"],
  },
  {
    id: "10",
    referenceNo: "CR-2026-0011",
    requestName: "Infographic Design",
    description: "Design an infographic summarizing project impact data for the donor report.",
    assignedBy: "Ebenezer Adams",
    assignedTo: "Kofi Boateng",
    status: "Cancelled",
    submittedOn: "Apr 10, 2026",
    attachments: ["impact_data.xlsx", "design_reference.png"],
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  Pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Clock size={12} />, label: "Pending" },
  Completed: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <CheckCircle2 size={12} />, label: "Completed" },
  Rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <XCircle size={12} />, label: "Rejected" },
  Cancelled: { bg: "bg-slate-100 border-slate-300", text: "text-slate-500", icon: <Ban size={12} />, label: "Cancelled" },
};

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function CommsRequest() {
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [viewDetail, setViewDetail] = useState<CommsRequestRecord | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ requestName: "", description: "" });
  const [formAssignedTo, setFormAssignedTo] = useState<string[]>([]);
  const [showAssignedDropdown, setShowAssignedDropdown] = useState(false);
  const [assignedSearch, setAssignedSearch] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const [incomingData, setIncomingData] = useState<CommsRequestRecord[]>(initialIncoming);
  const [outgoingData, setOutgoingData] = useState<CommsRequestRecord[]>(initialOutgoing);

  const [showCompleteModal, setShowCompleteModal] = useState<CommsRequestRecord | null>(null);
  const [completionFiles, setCompletionFiles] = useState<File[]>([]);
  const [completionError, setCompletionError] = useState(false);
  const completionFileRef = useRef<HTMLInputElement>(null);

  const currentData = activeTab === "incoming" ? incomingData : outgoingData;

  const filtered = currentData.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      req.referenceNo.toLowerCase().includes(q) ||
      req.requestName.toLowerCase().includes(q) ||
      req.description.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const errors: Record<string, boolean> = {};
    if (!formData.requestName.trim()) errors.requestName = true;
    if (!formData.description.trim()) errors.description = true;
    if (formAssignedTo.length === 0) errors.assignedTo = true;
    if (uploadedFiles.length === 0) errors.documents = true;
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newReq: CommsRequestRecord = {
      id: String(Date.now()),
      referenceNo: `CR-2026-${String(outgoingData.length + incomingData.length + 1).padStart(4, "0")}`,
      requestName: formData.requestName,
      description: formData.description,
      assignedBy: "Ebenezer Adams",
      assignedTo: formAssignedTo.join(", "),
      status: "Pending",
      submittedOn: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      attachments: uploadedFiles.map((f) => f.name),
    };
    setOutgoingData((prev) => [newReq, ...prev]);

    setShowNewForm(false);
    setFormData({ requestName: "", description: "" });
    setFormAssignedTo([]);
    setAssignedSearch("");
    setUploadedFiles([]);
    setFormErrors({});
  };

  const handleTabSwitch = (tab: "incoming" | "outgoing") => {
    setActiveTab(tab);
    setSearchQuery("");
    setStatusFilter("All");
  };

  const handleRejectIncoming = (id: string) => {
    setIncomingData((prev) => prev.map((r) => r.id === id ? { ...r, status: "Rejected" as const } : r));
  };

  const handleCancelOutgoing = (id: string) => {
    setOutgoingData((prev) => prev.map((r) => r.id === id ? { ...r, status: "Cancelled" as const } : r));
  };

  const handleCompletionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setCompletionFiles((prev) => [...prev, ...Array.from(files)]);
      setCompletionError(false);
    }
    if (completionFileRef.current) completionFileRef.current.value = "";
  };

  const handleCompleteSubmit = () => {
    if (completionFiles.length === 0) {
      setCompletionError(true);
      return;
    }
    if (showCompleteModal) {
      const fileNames = completionFiles.map((f) => f.name);
      setIncomingData((prev) =>
        prev.map((r) =>
          r.id === showCompleteModal.id
            ? { ...r, status: "Completed" as const, completionAttachments: fileNames }
            : r
        )
      );
    }
    setShowCompleteModal(null);
    setCompletionFiles([]);
    setCompletionError(false);
  };

  const statusFilterOptions = activeTab === "incoming"
    ? ["All", "Pending", "Completed", "Rejected"]
    : ["All", "Pending", "Completed", "Rejected", "Cancelled"];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Comms Request</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200">
            <Clock size={12} />
            {currentData.filter((r) => r.status === "Pending").length} Pending
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] border border-blue-200">
            <MessageSquare size={12} />
            {currentData.length} Total
          </span>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors"
        >
          <Plus size={14} />
          New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 bg-white border-b border-slate-200 flex items-center gap-0 shrink-0">
        <button
          onClick={() => handleTabSwitch("incoming")}
          className={`flex items-center gap-2 px-5 py-3 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "incoming"
              ? "border-purple-700 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Inbox size={15} />
          Incoming
        </button>
        <button
          onClick={() => handleTabSwitch("outgoing")}
          className={`flex items-center gap-2 px-5 py-3 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "outgoing"
              ? "border-purple-700 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Send size={15} />
          Outgoing
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by reference, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={13} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[12px] transition-colors ${
              statusFilter !== "All"
                ? "border-purple-300 bg-purple-50 text-purple-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter size={13} />
            {statusFilter === "All" ? "All Status" : statusFilter}
            <ChevronDown size={11} />
          </button>
          {showStatusDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2">
                {statusFilterOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-between ${
                      statusFilter === s ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {s === "All" ? "All Status" : s}
                    {statusFilter === s && <CheckCircle2 size={13} className="text-purple-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-[5]" style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Reference No.</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Request Name</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">
                {activeTab === "incoming" ? "Assigned By" : "Assigned To"}
              </th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Submitted On</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Attachments</th>
              <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <FileText size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-[13px] text-slate-400">No comms requests found</p>
                </td>
              </tr>
            ) : (
              filtered.map((req, idx) => {
                const sc = statusConfig[req.status];
                return (
                  <tr key={req.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] text-blue-700">{req.referenceNo}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900">{req.requestName}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-700">
                      {activeTab === "incoming" ? req.assignedBy : req.assignedTo}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.submittedOn}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">
                      {req.attachments.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <Paperclip size={12} />
                          {req.attachments.length}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setViewDetail(req)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="View details">
                          <Eye size={14} className="text-slate-400" />
                        </button>
                        {activeTab === "incoming" && req.status === "Pending" && (
                          <>
                            <button
                              onClick={() => setShowCompleteModal(req)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleRejectIncoming(req.id)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {activeTab === "outgoing" && req.status === "Pending" && (
                          <button
                            onClick={() => handleCancelOutgoing(req.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* View Detail Modal */}
      {viewDetail && (() => {
        const sc = statusConfig[viewDetail.status];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setViewDetail(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-auto">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft size={16} className="text-slate-500" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] text-slate-900">{viewDetail.referenceNo}</h2>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Comms Request Details</p>
                  </div>
                </div>
                <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Request Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailField label="Request Name" value={viewDetail.requestName} />
                    <DetailField label="Assigned By" value={viewDetail.assignedBy} />
                    <DetailField label="Assigned To" value={viewDetail.assignedTo} />
                    <DetailField label="Status" value={viewDetail.status} />
                    <DetailField label="Submitted On" value={viewDetail.submittedOn} />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Description</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{viewDetail.description}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Attachments</p>
                  {viewDetail.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {viewDetail.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <FileText size={14} className="text-slate-400" />
                          <span className="text-[12px] text-slate-700">{file}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] text-slate-400">No attachments</p>
                  )}
                </div>

                {viewDetail.status === "Completed" && viewDetail.completionAttachments && viewDetail.completionAttachments.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <p className="text-[10px] text-emerald-700 uppercase tracking-widest mb-3">Completed Work</p>
                    <div className="space-y-2">
                      {viewDetail.completionAttachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-emerald-200 rounded-lg px-3 py-2">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[12px] text-slate-700">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Complete Request Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[520px] max-h-[85vh] overflow-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-900">Complete Request</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{showCompleteModal.referenceNo} — {showCompleteModal.requestName}</p>
              </div>
              <button onClick={() => { setShowCompleteModal(null); setCompletionFiles([]); setCompletionError(false); }} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Upload Finished Work</p>
              <p className="text-[12px] text-slate-500">Upload the completed document(s) to mark this request as done.</p>

              <input
                ref={completionFileRef}
                type="file"
                multiple
                onChange={handleCompletionUpload}
                className="hidden"
              />
              <button
                onClick={() => completionFileRef.current?.click()}
                className={`w-full flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl text-[13px] transition-colors ${
                  completionError
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-slate-300 hover:border-emerald-300 hover:bg-emerald-50 text-slate-500"
                }`}
              >
                <Upload size={18} />
                Click to upload completed work
              </button>
              {completionError && <p className="text-[10px] text-red-500">Please upload at least one document</p>}

              {completionFiles.length > 0 && (
                <div className="space-y-2">
                  {completionFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-400" />
                        <span className="text-[12px] text-slate-700">{file.name}</span>
                        <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button onClick={() => setCompletionFiles((prev) => prev.filter((_, idx) => idx !== i))} className="p-1 hover:bg-slate-200 rounded">
                        <X size={12} className="text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => { setShowCompleteModal(null); setCompletionFiles([]); setCompletionError(false); }} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={handleCompleteSubmit} className="px-4 py-2 rounded-lg text-[13px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Comms Request Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[620px] max-h-[85vh] overflow-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900">New Comms Request</h2>
              <button onClick={() => { setShowNewForm(false); setFormErrors({}); }} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Request Details</p>

              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">
                  Request Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.requestName}
                  onChange={(e) => { setFormData({ ...formData, requestName: e.target.value }); setFormErrors((prev) => ({ ...prev, requestName: false })); }}
                  placeholder="Enter request name"
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] ${formErrors.requestName ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                />
                {formErrors.requestName && <p className="text-[10px] text-red-500 mt-1">Request name is required</p>}
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setFormErrors((prev) => ({ ...prev, description: false })); }}
                  placeholder="Describe your request"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] resize-none ${formErrors.description ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                />
                {formErrors.description && <p className="text-[10px] text-red-500 mt-1">Description is required</p>}
              </div>

              {/* Assigned To — multi-select */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">
                  Assigned To <span className="text-red-400">*</span>
                </label>
                {/* Selected chips */}
                {formAssignedTo.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formAssignedTo.map((person) => (
                      <span key={person} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-[11px] border border-purple-200">
                        {person}
                        <button onClick={() => { setFormAssignedTo((prev) => prev.filter((p) => p !== person)); setFormErrors((prev) => ({ ...prev, assignedTo: false })); }} className="hover:text-purple-900">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer ${
                      formErrors.assignedTo ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setShowAssignedDropdown(!showAssignedDropdown)}
                  >
                    <Search size={13} className="text-slate-400" />
                    <input
                      type="text"
                      value={assignedSearch}
                      onChange={(e) => { setAssignedSearch(e.target.value); setShowAssignedDropdown(true); }}
                      onClick={(e) => { e.stopPropagation(); setShowAssignedDropdown(true); }}
                      placeholder={formAssignedTo.length > 0 ? "Add more people..." : "Select staff members..."}
                      className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400 bg-transparent"
                    />
                    <ChevronDown size={13} className={`text-slate-400 transition-transform ${showAssignedDropdown ? "rotate-180" : ""}`} />
                  </div>
                  {showAssignedDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => { setShowAssignedDropdown(false); setAssignedSearch(""); }} />
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-[200px] overflow-auto">
                        {STAFF_LIST.filter((s) => s.toLowerCase().includes(assignedSearch.toLowerCase())).map((person) => {
                          const selected = formAssignedTo.includes(person);
                          return (
                            <button
                              key={person}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selected) {
                                  setFormAssignedTo((prev) => prev.filter((p) => p !== person));
                                } else {
                                  setFormAssignedTo((prev) => [...prev, person]);
                                  setFormErrors((prev) => ({ ...prev, assignedTo: false }));
                                }
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-[12px] text-left transition-colors ${
                                selected ? "bg-purple-50 text-purple-700" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span>{person}</span>
                              {selected && <Check size={13} className="text-purple-600" />}
                            </button>
                          );
                        })}
                        {STAFF_LIST.filter((s) => s.toLowerCase().includes(assignedSearch.toLowerCase())).length === 0 && (
                          <p className="px-3 py-3 text-[11px] text-slate-400 text-center">No staff found</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {formErrors.assignedTo && <p className="text-[10px] text-red-500 mt-1">Please assign to at least one person</p>}
              </div>

              <hr className="border-slate-100" />

              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">
                  Documents <span className="text-red-400">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => { handleFileUpload(e); setFormErrors((prev) => ({ ...prev, documents: false })); }}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl text-[13px] transition-colors ${
                    formErrors.documents
                      ? "border-red-300 bg-red-50 text-red-500"
                      : "border-slate-300 hover:border-purple-300 hover:bg-purple-50 text-slate-500"
                  }`}
                >
                  <Upload size={18} />
                  Click to upload documents
                </button>
                {formErrors.documents && <p className="text-[10px] text-red-500 mt-1">At least one document is required</p>}

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-slate-400" />
                          <span className="text-[12px] text-slate-700">{file.name}</span>
                          <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button onClick={() => removeFile(i)} className="p-1 hover:bg-slate-200 rounded">
                          <X size={12} className="text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => { setShowNewForm(false); setFormErrors({}); }} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-[13px] text-white hover:opacity-90" style={{ backgroundColor: "#0B01D0" }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommsRequest;
