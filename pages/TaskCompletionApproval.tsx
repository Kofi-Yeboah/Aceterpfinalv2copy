import { useState } from "react";
import { Search, Download, Eye, Check, X as XIcon, ArrowLeft, CheckCircle } from "lucide-react";

interface TaskCompletionRequest {
  id: string;
  requestId: string;
  taskName: string;
  project: string;
  phase: string;
  assignee: string;
  department: string;
  completionDate: string;
  submittedDate: string;
  hoursSpent: number;
  estimatedHours: number;
  completionPercentage: number;
  deliverables: string[];
  notes: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockTaskCompletionRequests: TaskCompletionRequest[] = [
  {
    id: "1", requestId: "TC-2026-001", taskName: "Backend API Development", project: "Digital Payments Platform",
    phase: "Implementation", assignee: "Desmond Tutu", department: "Engineering",
    completionDate: "Mar 05, 2026", submittedDate: "Mar 06, 2026",
    hoursSpent: 64, estimatedHours: 60, completionPercentage: 100,
    deliverables: ["REST API endpoints", "Unit tests", "API documentation"],
    notes: "All endpoints developed and tested. Minor scope increase for additional validation.",
    status: "Pending"
  },
  {
    id: "2", requestId: "TC-2026-002", taskName: "UI/UX Design Review", project: "Mobile Health App",
    phase: "Quality Assurance", assignee: "Nelly Manu", department: "Design",
    completionDate: "Mar 04, 2026", submittedDate: "Mar 05, 2026",
    hoursSpent: 24, estimatedHours: 24, completionPercentage: 100,
    deliverables: ["Design review report", "Accessibility audit", "Updated mockups"],
    notes: "All screens reviewed and accessibility issues documented.",
    status: "Pending"
  },
  {
    id: "3", requestId: "TC-2026-003", taskName: "Stakeholder Training", project: "Green Initiative",
    phase: "Closure", assignee: "Wangari Maathai", department: "Programs",
    completionDate: "Mar 03, 2026", submittedDate: "Mar 04, 2026",
    hoursSpent: 16, estimatedHours: 20, completionPercentage: 100,
    deliverables: ["Training materials", "Attendance register", "Feedback summary"],
    notes: "Training completed ahead of schedule. All stakeholders attended.",
    status: "Approved"
  },
  {
    id: "4", requestId: "TC-2026-004", taskName: "Data Migration Script", project: "ERP Upgrade",
    phase: "Implementation", assignee: "Kwame Nkunim", department: "Engineering",
    completionDate: "Mar 02, 2026", submittedDate: "Mar 03, 2026",
    hoursSpent: 40, estimatedHours: 32, completionPercentage: 100,
    deliverables: ["Migration script", "Rollback procedure", "Test results"],
    notes: "Additional complexity due to legacy data formats required extra hours.",
    status: "Pending"
  },
  {
    id: "5", requestId: "TC-2026-005", taskName: "Monthly Reconciliation Report", project: "Finance Operations",
    phase: "Reporting", assignee: "Abena Osei", department: "Finance",
    completionDate: "Feb 28, 2026", submittedDate: "Mar 01, 2026",
    hoursSpent: 12, estimatedHours: 16, completionPercentage: 100,
    deliverables: ["Reconciliation report", "Variance analysis"],
    notes: "Completed within budget. No significant variances found.",
    status: "Approved"
  },
  {
    id: "6", requestId: "TC-2026-006", taskName: "Vendor Onboarding Process", project: "Logistics Improvement",
    phase: "Procurement", assignee: "Kojo Mensah", department: "Operations",
    completionDate: "Mar 01, 2026", submittedDate: "Mar 02, 2026",
    hoursSpent: 20, estimatedHours: 24, completionPercentage: 100,
    deliverables: ["Vendor contracts", "Onboarding checklist", "System setup confirmation"],
    notes: "Three new vendors onboarded successfully.",
    status: "Rejected"
  },
  {
    id: "7", requestId: "TC-2026-007", taskName: "Security Audit", project: "Digital Payments Platform",
    phase: "Quality Assurance", assignee: "Ama Asante", department: "Engineering",
    completionDate: "Mar 07, 2026", submittedDate: "Mar 08, 2026",
    hoursSpent: 32, estimatedHours: 28, completionPercentage: 100,
    deliverables: ["Security audit report", "Vulnerability assessment", "Remediation plan"],
    notes: "Two medium-severity issues identified and remediation plan created.",
    status: "Pending"
  },
];

const tabs = ["All", "Pending", "Approved", "Rejected"] as const;
type TabType = (typeof tabs)[number];

export function TaskCompletionApproval() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<TaskCompletionRequest | null>(null);
  const [requests, setRequests] = useState(mockTaskCompletionRequests);

  const filteredRequests = requests.filter((r) => {
    const matchesTab = activeTab === "All" || r.status === activeTab;
    const matchesSearch =
      r.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" as const } : r)));
    setSelectedRequest(null);
  };

  if (selectedRequest) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedRequest(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-slate-900">
              Task Completion Details — {selectedRequest.requestId}
            </h1>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {selectedRequest.taskName}
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

        {/* Detail Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-[11px] text-slate-500">Completion</span>
              </div>
              <p className="text-[20px] font-semibold text-green-600">
                {selectedRequest.completionPercentage}%
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] text-slate-500">Deliverables</span>
              </div>
              <p className="text-[20px] font-semibold text-slate-900">
                {selectedRequest.deliverables.length}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">items submitted</p>
            </div>
          </div>

          {/* Task Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Task Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Task Name</p>
                <p className="text-[13px] text-slate-900">{selectedRequest.taskName}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Project</p>
                <p className="text-[13px] text-slate-900">{selectedRequest.project}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Phase</p>
                <p className="text-[13px] text-slate-900">{selectedRequest.phase}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Assignee</p>
                <p className="text-[13px] text-slate-900">{selectedRequest.assignee}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Department</p>
                <p className="text-[13px] text-slate-900">{selectedRequest.department}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Completion Date</p>
                <p className="text-[13px] text-slate-900">{selectedRequest.completionDate}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Submitted Date</p>
                <p className="text-[13px] text-slate-900">{selectedRequest.submittedDate}</p>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Deliverables</h3>
            <div className="space-y-2">
              {selectedRequest.deliverables.map((d, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-[13px] text-slate-700">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Completion Notes</h3>
            <p className="text-[13px] text-slate-600 leading-relaxed">{selectedRequest.notes}</p>
          </div>

          {/* Action Buttons */}
          {selectedRequest.status === "Pending" && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2"
               
              >
                <Check className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => handleReject(selectedRequest.id)}
                className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
               
              >
                <XIcon className="w-4 h-4" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">
              Task Completion Approval
            </h1>
            <p className="text-[12px] text-slate-500 mt-1">
              Review and approve completed tasks submitted by team members
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#0B01D0" }}
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Tabs - Document Vault style */}
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
            placeholder="Search by task, assignee, project, or ID..."
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
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Request ID</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Task Name</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Project</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Assignee</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Hours</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Submitted</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[13px] text-slate-400">
                    No task completion requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-[12px] text-purple-700 font-medium">
                      {request.requestId}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-900">
                      {request.taskName}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {request.project}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] text-slate-900">{request.assignee}</p>
                        <p className="text-[11px] text-slate-400">{request.department}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] text-slate-900">{request.hoursSpent}h</p>
                        <p className="text-[11px] text-slate-400">
                          est. {request.estimatedHours}h
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {request.submittedDate}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          request.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : request.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                       
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-1.5 rounded-lg hover:bg-green-50 transition-colors text-slate-500 hover:text-green-600"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600"
                              title="Reject"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
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