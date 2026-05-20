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
  CalendarDays,
  Paperclip,
  ArrowLeft,
} from "lucide-react";

interface LeaveRequestRecord {
  id: string;
  referenceNo: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  returningToWork: string;
  days: number;
  reason: string;
  status: "Pending Line Manager" | "Pending HR" | "Approved" | "Rejected";
  submittedOn: string;
  lineManager: string;
  lineManagerApproval: "Pending" | "Approved" | "Rejected" | null;
  lineManagerDate: string | null;
  hrOfficer: string;
  hrApproval: "Pending" | "Approved" | "Rejected" | null;
  hrDate: string | null;
  attachments: string[];
  rejectionReason: string | null;
}

const mockLeaveRequests: LeaveRequestRecord[] = [
  {
    id: "1",
    referenceNo: "LR-2026-0052",
    leaveType: "Annual",
    startDate: "Mar 15, 2026",
    endDate: "Mar 20, 2026",
    returningToWork: "Mar 23, 2026",
    days: 6,
    reason: "Family vacation",
    status: "Pending Line Manager",
    submittedOn: "Feb 28, 2026",
    lineManager: "Ama Darko",
    lineManagerApproval: "Pending",
    lineManagerDate: null,
    hrOfficer: "Abena Owusu",
    hrApproval: null,
    hrDate: null,
    attachments: [],
    rejectionReason: null,
  },
  {
    id: "2",
    referenceNo: "LR-2026-0049",
    leaveType: "Sickness Absence",
    startDate: "Feb 10, 2026",
    endDate: "Feb 12, 2026",
    returningToWork: "Feb 13, 2026",
    days: 3,
    reason: "Medical appointment",
    status: "Pending HR",
    submittedOn: "Feb 08, 2026",
    lineManager: "Ama Darko",
    lineManagerApproval: "Approved",
    lineManagerDate: "Feb 08, 2026",
    hrOfficer: "Abena Owusu",
    hrApproval: "Pending",
    hrDate: null,
    attachments: ["medical_certificate.pdf"],
    rejectionReason: null,
  },
  {
    id: "3",
    referenceNo: "LR-2026-0045",
    leaveType: "Annual",
    startDate: "Jan 25, 2026",
    endDate: "Jan 30, 2026",
    returningToWork: "Feb 02, 2026",
    days: 6,
    reason: "Personal matters",
    status: "Approved",
    submittedOn: "Jan 10, 2026",
    lineManager: "Ama Darko",
    lineManagerApproval: "Approved",
    lineManagerDate: "Jan 11, 2026",
    hrOfficer: "Abena Owusu",
    hrApproval: "Approved",
    hrDate: "Jan 12, 2026",
    attachments: [],
    rejectionReason: null,
  },
  {
    id: "4",
    referenceNo: "LR-2025-0041",
    leaveType: "Bereavement",
    startDate: "Dec 05, 2025",
    endDate: "Dec 06, 2025",
    returningToWork: "Dec 08, 2025",
    days: 2,
    reason: "Family bereavement",
    status: "Approved",
    submittedOn: "Dec 04, 2025",
    lineManager: "Ama Darko",
    lineManagerApproval: "Approved",
    lineManagerDate: "Dec 04, 2025",
    hrOfficer: "Abena Owusu",
    hrApproval: "Approved",
    hrDate: "Dec 04, 2025",
    attachments: ["death_certificate.pdf"],
    rejectionReason: null,
  },
  {
    id: "5",
    referenceNo: "LR-2025-0038",
    leaveType: "Annual",
    startDate: "Nov 20, 2025",
    endDate: "Nov 25, 2025",
    returningToWork: "Nov 26, 2025",
    days: 6,
    reason: "Wedding attendance",
    status: "Rejected",
    submittedOn: "Nov 05, 2025",
    lineManager: "Kwame Asante",
    lineManagerApproval: "Rejected",
    lineManagerDate: "Nov 06, 2025",
    hrOfficer: "Abena Owusu",
    hrApproval: null,
    hrDate: null,
    attachments: [],
    rejectionReason: "Insufficient leave balance for the requested period. Please apply for a shorter duration.",
  },
  {
    id: "6",
    referenceNo: "LR-2025-0035",
    leaveType: "Sickness Absence",
    startDate: "Oct 15, 2025",
    endDate: "Oct 17, 2025",
    returningToWork: "Oct 20, 2025",
    days: 3,
    reason: "Flu recovery",
    status: "Approved",
    submittedOn: "Oct 15, 2025",
    lineManager: "Ama Darko",
    lineManagerApproval: "Approved",
    lineManagerDate: "Oct 15, 2025",
    hrOfficer: "Abena Owusu",
    hrApproval: "Approved",
    hrDate: "Oct 16, 2025",
    attachments: [],
    rejectionReason: null,
  },
  {
    id: "7",
    referenceNo: "LR-2025-0031",
    leaveType: "Unpaid",
    startDate: "Sep 01, 2025",
    endDate: "Sep 10, 2025",
    returningToWork: "Sep 11, 2025",
    days: 10,
    reason: "Extended personal travel",
    status: "Rejected",
    submittedOn: "Aug 15, 2025",
    lineManager: "Kwame Asante",
    lineManagerApproval: "Approved",
    lineManagerDate: "Aug 16, 2025",
    hrOfficer: "Abena Owusu",
    hrApproval: "Rejected",
    hrDate: "Aug 17, 2025",
    attachments: [],
    rejectionReason: "Unpaid leave requests exceeding 5 days require Director-level approval. Please resubmit through your Director.",
  },
  {
    id: "8",
    referenceNo: "LR-2025-0027",
    leaveType: "Maternity",
    startDate: "Jun 01, 2025",
    endDate: "Aug 31, 2025",
    returningToWork: "Sep 01, 2025",
    days: 92,
    reason: "Maternity leave",
    status: "Approved",
    submittedOn: "May 01, 2025",
    lineManager: "Ama Darko",
    lineManagerApproval: "Approved",
    lineManagerDate: "May 02, 2025",
    hrOfficer: "Abena Owusu",
    hrApproval: "Approved",
    hrDate: "May 03, 2025",
    attachments: ["maternity_note.pdf", "hospital_letter.pdf"],
    rejectionReason: null,
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  "Pending Line Manager": { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Clock size={12} />, label: "Pending Line Manager" },
  "Pending HR": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: <Clock size={12} />, label: "Pending HR" },
  Approved: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <CheckCircle2 size={12} />, label: "Approved" },
  Rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <XCircle size={12} />, label: "Rejected" },
};

const leaveTypes = ["Paternity", "Maternity", "Annual", "Sickness Absence", "Bereavement", "Unpaid"];

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function LeaveRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [viewDetail, setViewDetail] = useState<LeaveRequestRecord | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: "Ebenezer",
    lastName: "Adams",
    department: "",
    lineManager: "",
    contactOnLeave: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    returningToWork: "",
    noOfHolidays: "",
    totalDaysTaken: "",
    handingOverTo: "",
  });

  const filtered = mockLeaveRequests.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      req.referenceNo.toLowerCase().includes(q) ||
      req.leaveType.toLowerCase().includes(q) ||
      req.reason.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Leave Request</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200">
            <Clock size={12} />
            {mockLeaveRequests.filter((r) => r.status === "Pending Line Manager").length} Pending
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] border border-emerald-200">
            <CalendarDays size={12} />
            {mockLeaveRequests.reduce((sum, r) => sum + r.days, 0)} Total Days
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

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by reference, type, reason..."
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
                {["All", "Pending Line Manager", "Pending HR", "Approved", "Rejected"].map((s) => (
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
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Leave Type</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">From</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">To</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Returning to Work</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Line Manager</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Submitted On</th>
              <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16">
                  <FileText size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-[13px] text-slate-400">No leave requests found</p>
                </td>
              </tr>
            ) : (
              filtered.map((req, idx) => {
                const sc = statusConfig[req.status];
                return (
                  <tr key={req.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] text-blue-700">{req.referenceNo}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900">{req.leaveType}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.startDate}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.endDate}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.returningToWork}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-700">{req.lineManager}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.submittedOn}</td>
                    <td className="px-6 py-3 text-center">
                      <button onClick={() => setViewDetail(req)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye size={14} className="text-slate-400" />
                      </button>
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
              {/* Modal Header */}
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
                    <p className="text-[11px] text-slate-400">Leave Request Details</p>
                  </div>
                </div>
                <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Request Information */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Request Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailField label="Leave Type" value={viewDetail.leaveType} />
                    <DetailField label="Start Date" value={viewDetail.startDate} />
                    <DetailField label="End Date" value={viewDetail.endDate} />
                    <DetailField label="Duration" value={`${viewDetail.days} day${viewDetail.days !== 1 ? "s" : ""}`} />
                    <DetailField label="Submitted On" value={viewDetail.submittedOn} />
                    <DetailField label="Line Manager" value={viewDetail.lineManager || "—"} />
                    <DetailField label="Line Manager Approval" value={viewDetail.lineManagerApproval || "—"} />
                    <DetailField label="Line Manager Date" value={viewDetail.lineManagerDate || "—"} />
                    <DetailField label="HR Officer" value={viewDetail.hrOfficer || "—"} />
                    <DetailField label="HR Approval" value={viewDetail.hrApproval || "—"} />
                    <DetailField label="HR Date" value={viewDetail.hrDate || "—"} />
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Reason</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{viewDetail.reason}</p>
                </div>

                {/* Attachments */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Attachments</p>
                  {viewDetail.attachments.length === 0 ? (
                    <p className="text-[12px] text-slate-400">No attachments</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {viewDetail.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                          <Paperclip size={13} className="text-slate-400" />
                          <span className="text-[12px] text-blue-700 flex-1">{file}</span>
                          <span className="text-[10px] text-slate-400">PDF</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity Timeline */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Approval Workflow</p>
                  
                  {/* Two-step approval tracker */}
                  <div className="flex items-center gap-0 mb-6 px-2">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        viewDetail.lineManagerApproval === "Approved" ? "bg-emerald-100" :
                        viewDetail.lineManagerApproval === "Rejected" ? "bg-red-100" :
                        viewDetail.lineManagerApproval === "Pending" ? "bg-amber-100" : "bg-slate-100"
                      }`}>
                        {viewDetail.lineManagerApproval === "Approved" && <CheckCircle2 size={14} className="text-emerald-600" />}
                        {viewDetail.lineManagerApproval === "Rejected" && <XCircle size={14} className="text-red-600" />}
                        {viewDetail.lineManagerApproval === "Pending" && <Clock size={14} className="text-amber-600" />}
                        {!viewDetail.lineManagerApproval && <Clock size={14} className="text-slate-300" />}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1.5">Line Manager</p>
                      <p className="text-[9px] text-slate-400">{viewDetail.lineManager}</p>
                    </div>
                    {/* Connector */}
                    <div className={`h-0.5 w-16 shrink-0 -mt-5 ${
                      viewDetail.lineManagerApproval === "Approved" ? "bg-emerald-300" :
                      viewDetail.lineManagerApproval === "Rejected" ? "bg-red-300" : "bg-slate-200"
                    }`} />
                    {/* Step 2 */}
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        viewDetail.hrApproval === "Approved" ? "bg-emerald-100" :
                        viewDetail.hrApproval === "Rejected" ? "bg-red-100" :
                        viewDetail.hrApproval === "Pending" ? "bg-amber-100" : "bg-slate-100"
                      }`}>
                        {viewDetail.hrApproval === "Approved" && <CheckCircle2 size={14} className="text-emerald-600" />}
                        {viewDetail.hrApproval === "Rejected" && <XCircle size={14} className="text-red-600" />}
                        {viewDetail.hrApproval === "Pending" && <Clock size={14} className="text-amber-600" />}
                        {!viewDetail.hrApproval && <Clock size={14} className="text-slate-300" />}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1.5">HR Officer</p>
                      <p className="text-[9px] text-slate-400">{viewDetail.hrOfficer}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 space-y-4">
                    {/* Submitted */}
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <FileText size={12} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[12px] text-slate-900">Request submitted</p>
                        <p className="text-[10px] text-slate-400">{viewDetail.submittedOn} — Sent to Line Manager ({viewDetail.lineManager})</p>
                      </div>
                    </div>
                    {/* Line Manager decision */}
                    {viewDetail.lineManagerApproval === "Approved" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[12px] text-slate-900">Line Manager approved</p>
                          <p className="text-[10px] text-slate-400">{viewDetail.lineManagerDate} by {viewDetail.lineManager} — Forwarded to HR Officer ({viewDetail.hrOfficer})</p>
                        </div>
                      </div>
                    )}
                    {viewDetail.lineManagerApproval === "Rejected" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                          <XCircle size={12} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-[12px] text-slate-900">Line Manager rejected</p>
                          <p className="text-[10px] text-slate-400">{viewDetail.lineManagerDate} by {viewDetail.lineManager}</p>
                          {viewDetail.rejectionReason && (
                            <p className="text-[11px] text-red-600 mt-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{viewDetail.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {/* HR decision */}
                    {viewDetail.hrApproval === "Approved" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[12px] text-slate-900">HR Officer approved</p>
                          <p className="text-[10px] text-slate-400">{viewDetail.hrDate} by {viewDetail.hrOfficer} — Leave request fully approved</p>
                        </div>
                      </div>
                    )}
                    {viewDetail.hrApproval === "Rejected" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                          <XCircle size={12} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-[12px] text-slate-900">HR Officer rejected</p>
                          <p className="text-[10px] text-slate-400">{viewDetail.hrDate} by {viewDetail.hrOfficer}</p>
                          {viewDetail.rejectionReason && (
                            <p className="text-[11px] text-red-600 mt-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{viewDetail.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Pending indicator */}
                    {viewDetail.lineManagerApproval === "Pending" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <Clock size={12} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-[12px] text-slate-900">Awaiting Line Manager approval</p>
                          <p className="text-[10px] text-slate-400">Pending review by {viewDetail.lineManager}</p>
                        </div>
                      </div>
                    )}
                    {viewDetail.hrApproval === "Pending" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <Clock size={12} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-[12px] text-slate-900">Awaiting HR Officer approval</p>
                          <p className="text-[10px] text-slate-400">Pending review by {viewDetail.hrOfficer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* New Leave Request Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[620px] max-h-[85vh] overflow-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900">New Leave Request</h2>
              <button onClick={() => setShowNewForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Employee Information */}
              <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Employee Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">First Name</label>
                  <input type="text" value={formData.firstName} readOnly className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-slate-50 text-slate-500 cursor-default" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Last Name</label>
                  <input type="text" value={formData.lastName} readOnly className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-slate-50 text-slate-500 cursor-default" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Department <span className="text-red-400">*</span></label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option value="">Select...</option>
                    <option>Executive Office</option><option>Research</option><option>Programs</option>
                    <option>Finance</option><option>HR</option><option>Communications</option><option>IT</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Line Manager <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.lineManager} onChange={(e) => setFormData({ ...formData, lineManager: e.target.value })} placeholder="Enter name" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Contact While on Leave <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.contactOnLeave} onChange={(e) => setFormData({ ...formData, contactOnLeave: e.target.value })} placeholder="Phone or email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Leave Type <span className="text-red-400">*</span></label>
                  <select value={formData.leaveType} onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option value="">Select...</option>
                    {leaveTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Leave Details */}
              <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Leave Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">From <span className="text-red-400">*</span></label>
                  <input type="date" value={formData.fromDate} onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">To <span className="text-red-400">*</span></label>
                  <input type="date" value={formData.toDate} onChange={(e) => setFormData({ ...formData, toDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Returning to Work <span className="text-red-400">*</span></label>
                  <input type="date" value={formData.returningToWork} onChange={(e) => setFormData({ ...formData, returningToWork: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">No. of Holidays <span className="text-red-400">*</span></label>
                  <input type="number" min="0" value={formData.noOfHolidays} onChange={(e) => setFormData({ ...formData, noOfHolidays: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Total Days Taken</label>
                  <input
                    type="text"
                    readOnly
                    value={
                      formData.fromDate && formData.toDate
                        ? `${Math.max(0, Math.round((new Date(formData.toDate).getTime() - new Date(formData.fromDate).getTime()) / 86400000) + 1)} day(s)`
                        : ""
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-slate-50 text-slate-500 cursor-default"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Handing Over To <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.handingOverTo} onChange={(e) => setFormData({ ...formData, handingOverTo: e.target.value })} placeholder="Enter name" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowNewForm(false)} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
              <button onClick={() => setShowNewForm(false)} className="px-4 py-2 rounded-lg text-[13px] text-white hover:opacity-90" style={{ backgroundColor: "#0B01D0" }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveRequest;