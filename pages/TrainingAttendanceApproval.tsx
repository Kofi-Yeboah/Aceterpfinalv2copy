import { useState } from "react";
import { Search, ArrowLeft, Download, Eye, Check, X as XIcon, CheckCircle, AlertCircle, FileText, Calendar, User, GraduationCap, Clock } from "lucide-react";

interface TrainingAttendanceRequest {
  id: string;
  requestId: string;
  employeeName: string;
  employeeId: string;
  department: string;
  lineManager: string;
  trainingTitle: string;
  trainingCategory: string;
  trainingProvider: string;
  startDate: string;
  endDate: string;
  hoursCompleted: number;
  certificateFileName: string;
  certificateFileSize: string;
  certificateUploadDate: string;
  submittedDate: string;
  notes: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
}

const mockTrainingAttendanceRequests: TrainingAttendanceRequest[] = [
  {
    id: "1",
    requestId: "TA-2026-001",
    employeeName: "Joyce Blessing",
    employeeId: "EMP0042",
    department: "HR Management",
    lineManager: "David Bannerman",
    trainingTitle: "Advanced Leadership Skills",
    trainingCategory: "Leadership",
    trainingProvider: "Leadership Institute",
    startDate: "Mar 15, 2024",
    endDate: "Apr 15, 2024",
    hoursCompleted: 40,
    certificateFileName: "leadership_certificate.pdf",
    certificateFileSize: "245.3 KB",
    certificateUploadDate: "Apr 20, 2024",
    submittedDate: "Apr 20, 2024",
    notes: "Successfully completed all modules and passed final assessment with distinction.",
    status: "Pending"
  },
  {
    id: "2",
    requestId: "TA-2026-002",
    employeeName: "Kofi Mensah",
    employeeId: "EMP0128",
    department: "Finance",
    lineManager: "Yaw Osei",
    trainingTitle: "Financial Management for NGOs",
    trainingCategory: "Technical",
    trainingProvider: "NGO Training Center",
    startDate: "Jul 01, 2024",
    endDate: "Jul 30, 2024",
    hoursCompleted: 32,
    certificateFileName: "financial_mgmt_cert.pdf",
    certificateFileSize: "189.7 KB",
    certificateUploadDate: "Aug 05, 2024",
    submittedDate: "Aug 05, 2024",
    notes: "Attended all sessions and completed practical exercises.",
    status: "Approved"
  },
  {
    id: "3",
    requestId: "TA-2026-003",
    employeeName: "Akosua Agyei",
    employeeId: "EMP0217",
    department: "IT",
    lineManager: "Kwesi Appiah",
    trainingTitle: "Advanced Excel for Data Analysis",
    trainingCategory: "Technical",
    trainingProvider: "Online Learning Platform",
    startDate: "Feb 01, 2024",
    endDate: "Feb 28, 2024",
    hoursCompleted: 24,
    certificateFileName: "excel_certificate.jpg",
    certificateFileSize: "512.1 KB",
    certificateUploadDate: "Mar 05, 2024",
    submittedDate: "Mar 05, 2024",
    notes: "Completed all advanced modules including Power Query and Pivot Tables.",
    status: "Pending"
  },
  {
    id: "4",
    requestId: "TA-2026-004",
    employeeName: "Kwame Asante",
    employeeId: "EMP0365",
    department: "M&E",
    lineManager: "Nana Yaw",
    trainingTitle: "Data Analysis and Reporting",
    trainingCategory: "Technical",
    trainingProvider: "Online Learning Platform",
    startDate: "Nov 10, 2025",
    endDate: "Dec 20, 2025",
    hoursCompleted: 32,
    certificateFileName: "data_analysis_honor.pdf",
    certificateFileSize: "298.4 KB",
    certificateUploadDate: "Dec 22, 2025",
    submittedDate: "Dec 22, 2025",
    notes: "Completed with honors, excellent understanding of statistical analysis.",
    status: "Approved"
  },
  {
    id: "5",
    requestId: "TA-2026-005",
    employeeName: "Ama Darko",
    employeeId: "EMP0511",
    department: "Procurement",
    lineManager: "Kojo Williams",
    trainingTitle: "Effective Communication Workshop",
    trainingCategory: "Soft Skills",
    trainingProvider: "HR Department",
    startDate: "Sep 10, 2024",
    endDate: "Sep 12, 2024",
    hoursCompleted: 16,
    certificateFileName: "comm_workshop_honor.jpg",
    certificateFileSize: "415.8 KB",
    certificateUploadDate: "Sep 20, 2024",
    submittedDate: "Sep 20, 2024",
    notes: "Actively participated in all group activities and role-playing exercises.",
    status: "Rejected",
    rejectionReason: "Certificate does not match training dates. Please resubmit with correct documentation."
  },
  {
    id: "6",
    requestId: "TA-2026-006",
    employeeName: "Yaa Frimpong",
    employeeId: "EMP0643",
    department: "Communications",
    lineManager: "Abena Owusu",
    trainingTitle: "Digital Marketing Strategy",
    trainingCategory: "Marketing",
    trainingProvider: "Digital Skills Academy",
    startDate: "Jan 15, 2026",
    endDate: "Feb 28, 2026",
    hoursCompleted: 40,
    certificateFileName: "digital_marketing_cert.pdf",
    certificateFileSize: "332.5 KB",
    certificateUploadDate: "Mar 02, 2026",
    submittedDate: "Mar 02, 2026",
    notes: "Excellent performance in final project on social media campaign strategy.",
    status: "Pending"
  },
  {
    id: "7",
    requestId: "TA-2026-007",
    employeeName: "Kwabena Boateng",
    employeeId: "EMP0789",
    department: "M&E",
    lineManager: "Nana Yaw",
    trainingTitle: "Project Management Fundamentals",
    trainingCategory: "Management",
    trainingProvider: "John Smith",
    startDate: "Jan 15, 2024",
    endDate: "Feb 15, 2024",
    hoursCompleted: 30,
    certificateFileName: "pm_fundamentals.pdf",
    certificateFileSize: "267.9 KB",
    certificateUploadDate: "Feb 20, 2024",
    submittedDate: "Feb 20, 2024",
    notes: "Perfect attendance and active participation throughout the program.",
    status: "Pending"
  },
];

const tabs = ["All", "Pending", "Approved", "Rejected"] as const;
type TabType = (typeof tabs)[number];

export function TrainingAttendanceApproval() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<TrainingAttendanceRequest | null>(null);
  const [requests, setRequests] = useState(mockTrainingAttendanceRequests);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredRequests = requests.filter((r) => {
    const matchesTab = activeTab === "All" || r.status === activeTab;
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.trainingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<TabType, number> = {
    All: requests.length,
    Pending: requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" as const } : r)));
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setRequests((prev) => 
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" as const, rejectionReason } : r))
    );
    setShowRejectModal(false);
    setRejectionReason("");
    setSelectedRequest(null);
  };

  const handleDownloadCertificate = (request: TrainingAttendanceRequest) => {
    const content = `
────────────────────────────────────────────
  TRAINING CERTIFICATE — SIMULATED DOWNLOAD
────────────────────────────────────────────

Certificate:     ${request.certificateFileName}
Employee:        ${request.employeeName} (${request.employeeId})
Department:      ${request.department}
Training:        ${request.trainingTitle}
Provider:        ${request.trainingProvider}
Training Period: ${request.startDate} - ${request.endDate}
Hours Completed: ${request.hoursCompleted}
Upload Date:     ${request.certificateUploadDate}
File Size:       ${request.certificateFileSize}

────────────────────────────────────────────
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = request.certificateFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Detail View
  if (selectedRequest) {
    return (
      <div className="flex flex-col h-full bg-slate-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedRequest(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Training Attendance Details — {selectedRequest.requestId}
            </h1>
            <p className="text-[12px] text-slate-500 mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {selectedRequest.trainingTitle}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-medium ${
              selectedRequest.status === "Pending"
                ? "bg-amber-100 text-amber-700"
                : selectedRequest.status === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {selectedRequest.status}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Employee Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-[14px] font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-600" />
                Employee Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Employee Name</p>
                  <p className="text-[13px] text-slate-900 font-medium">{selectedRequest.employeeName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Employee ID</p>
                  <p className="text-[13px] text-slate-900 font-medium">{selectedRequest.employeeId}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-[13px] text-slate-900">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Line Manager</p>
                  <p className="text-[13px] text-slate-900">{selectedRequest.lineManager}</p>
                </div>
              </div>
            </div>

            {/* Training Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-[14px] font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-600" />
                Training Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Training Title</p>
                  <p className="text-[13px] text-slate-900 font-medium">{selectedRequest.trainingTitle}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-[13px] text-slate-900">{selectedRequest.trainingCategory}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Provider</p>
                  <p className="text-[13px] text-slate-900">{selectedRequest.trainingProvider}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Training Period</p>
                  <p className="text-[13px] text-slate-900">{selectedRequest.startDate} - {selectedRequest.endDate}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Hours Completed</p>
                  <p className="text-[13px] text-slate-900">{selectedRequest.hoursCompleted} hours</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Submitted Date</p>
                  <p className="text-[13px] text-slate-900">{selectedRequest.submittedDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">{selectedRequest.notes}</p>
                </div>
              </div>
            </div>

            {/* Certificate Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-[14px] font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                Certificate Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[13px] text-slate-900 font-medium">{selectedRequest.certificateFileName}</p>
                      <p className="text-[11px] text-slate-500">{selectedRequest.certificateFileSize} • Uploaded {selectedRequest.certificateUploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadCertificate(selectedRequest)}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Download Certificate"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Reason (if rejected) */}
            {selectedRequest.status === "Rejected" && selectedRequest.rejectionReason && (
              <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                <h2 className="text-[14px] font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Rejection Reason
                </h2>
                <p className="text-[13px] text-red-700 leading-relaxed">{selectedRequest.rejectionReason}</p>
              </div>
            )}

            {/* Action Buttons */}
            {selectedRequest.status === "Pending" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-[13px] transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve Attendance
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-[13px] transition-colors flex items-center justify-center gap-2"
                >
                  <XIcon className="w-4 h-4" />
                  Reject Attendance
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-[16px] font-semibold text-slate-900">Reject Training Attendance</h3>
                <p className="text-[12px] text-slate-500 mt-1">Please provide a reason for rejecting this attendance submission</p>
              </div>
              <div className="p-6">
                <label className="block text-[12px] text-slate-700 mb-2 font-medium">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Enter reason for rejection..."
                />
              </div>
              <div className="px-6 py-4 bg-slate-50 rounded-b-xl flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  className="px-4 py-2 text-[13px] bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main List View
  return (
    <div className="flex flex-col h-full bg-slate-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Training Attendance Approval
          </h1>
          <p className="text-[12px] text-slate-500 mt-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Review and approve training attendance submissions from your team members
          </p>
        </div>
      </div>

      {/* Tabs - Document Vault style */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-[11px] ${
                  activeTab === tab
                    ? "bg-slate-100 text-slate-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee, training, department, or request ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table - General Ledger pattern */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Request ID
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Training Title
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Training Period
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Hours
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-12 h-12 text-slate-300" />
                    <p className="text-[13px] text-slate-500">No training attendance requests found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((request, index) => (
                <tr
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <td className="px-4 py-3 text-[12px] text-slate-900 font-medium">
                    {request.requestId}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-[12px] text-slate-900 font-medium">{request.employeeName}</p>
                      <p className="text-[11px] text-slate-500">{request.employeeId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-700">
                    {request.department}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-900">
                    {request.trainingTitle}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-700">
                    {request.trainingCategory}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[11px] text-slate-700">
                      <p>{request.startDate}</p>
                      <p className="text-slate-500">to {request.endDate}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-700">
                    {request.hoursCompleted}h
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-700">
                    {request.submittedDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${
                        request.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : request.status === "Approved"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {request.status === "Pending" && <Clock className="w-3 h-3" />}
                      {request.status === "Approved" && <CheckCircle className="w-3 h-3" />}
                      {request.status === "Rejected" && <XIcon className="w-3 h-3" />}
                      {request.status}
                    </span>
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