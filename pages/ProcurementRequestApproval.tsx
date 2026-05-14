import { useState, useEffect } from "react";
import { Search, Download, Eye, Check, X as XIcon, ArrowLeft, CheckCircle, Clock, AlertTriangle, DollarSign, Package, FileText, ChevronRight } from "lucide-react";
import {
  getGeneratedPRs,
  approvePRDept,
  rejectPRDept,
  subscribe,
  type GeneratedPR,
} from "../lib/procurementStore";

const tabs = ["All", "Pending", "Approved", "Rejected"] as const;
type TabType = (typeof tabs)[number];

function getTabStatus(pr: GeneratedPR): "Pending" | "Approved" | "Rejected" {
  if (pr.deptApproval === "Pending") return "Pending";
  if (pr.deptApproval === "Rejected") return "Rejected";
  return "Approved";
}

export function ProcurementRequestApproval() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<GeneratedPR | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribe(() => setTick((t) => t + 1));
  }, []);

  const allPRs = getGeneratedPRs();

  const filteredRequests = allPRs.filter((pr) => {
    const tabStatus = getTabStatus(pr);
    const matchesTab = activeTab === "All" || tabStatus === activeTab;
    const matchesSearch =
      pr.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<TabType, number> = {
    All: allPRs.length,
    Pending: allPRs.filter((pr) => pr.deptApproval === "Pending").length,
    Approved: allPRs.filter((pr) => pr.deptApproval === "Approved").length,
    Rejected: allPRs.filter((pr) => pr.deptApproval === "Rejected").length,
  };

  const handleApprove = (id: string) => {
    approvePRDept(id);
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    rejectPRDept(id, rejectComment);
    setRejectModalOpen(null);
    setRejectComment("");
    setSelectedRequest(null);
  };

  if (selectedRequest) {
    // Refresh from store
    const freshPR = allPRs.find(pr => pr.id === selectedRequest.id) || selectedRequest;
    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedRequest(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-semibold text-slate-900">
                Procurement Request — {freshPR.requisitionNumber}
              </h1>
              {freshPR.sourceType === "ESS Plan" && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-indigo-100 text-indigo-700">Source: ESS Plan</span>
              )}
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {freshPR.itemDescription}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-medium ${
              freshPR.deptApproval === "Pending"
                ? "bg-amber-100 text-amber-700"
                : freshPR.deptApproval === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {freshPR.overallApprovalStatus}
          </span>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Approval Flow Indicator */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <h3 className="text-[13px] font-semibold text-slate-900 mb-4">Approval Workflow Progress</h3>
            <div className="flex items-center gap-3">
              {[
                { label: "Submitted", step: 1, status: "Approved" },
                { label: "Dept Head", step: 2, status: freshPR.deptApproval },
                { label: "Procurement", step: 3, status: freshPR.procurementApproval },
                { label: "Finance", step: 4, status: freshPR.financeApproval },
                ...(freshPR.requiresSeniorApproval ? [{ label: "Senior Mgmt", step: 5, status: freshPR.seniorMgmtApproval }] : []),
              ].map((s, i, arr) => (
                <div key={s.step} className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                      s.status === "Approved" ? "bg-green-500 text-white" :
                      s.status === "Rejected" ? "bg-red-500 text-white" :
                      s.status === "Pending" ? "bg-amber-500 text-white animate-pulse" :
                      "bg-slate-200 text-slate-400"
                    }`}>
                      {s.status === "Approved" ? <Check className="w-4 h-4" /> :
                       s.status === "Rejected" ? <XIcon className="w-4 h-4" /> :
                       s.step}
                    </div>
                    <span className="text-[10px] text-slate-500 text-center">{s.label}</span>
                    {s.step === 3 && <span className="text-[8px] text-purple-600 font-medium">PARALLEL</span>}
                    {s.step === 4 && <span className="text-[8px] text-purple-600 font-medium">PARALLEL</span>}
                  </div>
                  {i < arr.length - 1 && <div className="h-0.5 flex-1 bg-slate-200 -mt-5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-[11px] text-slate-500">Est. Cost</span>
              </div>
              <p className="text-[18px] font-semibold text-slate-900">
                ${freshPR.estimatedCost.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] text-slate-500">Quantity</span>
              </div>
              <p className="text-[18px] font-semibold text-slate-900">
                {freshPR.quantity} {freshPR.unit}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-[11px] text-slate-500">Category</span>
              </div>
              <p className="text-[18px] font-semibold text-slate-900">
                {freshPR.category}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                {freshPR.requiresSeniorApproval ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                <span className="text-[11px] text-slate-500">Threshold</span>
              </div>
              <p className="text-[13px] font-semibold text-slate-900">
                {freshPR.requiresSeniorApproval ? "Requires Sr. Mgmt" : "Standard Flow"}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {freshPR.requiresSeniorApproval ? "> $10,000 threshold" : "<= $10,000"}
              </p>
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Request Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Requisition Number</p>
                <p className="text-[13px] text-slate-900">{freshPR.requisitionNumber}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Requested By</p>
                <p className="text-[13px] text-slate-900">{freshPR.requestedBy}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Department</p>
                <p className="text-[13px] text-slate-900">{freshPR.department}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Date Requested</p>
                <p className="text-[13px] text-slate-900">{freshPR.dateRequested}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Purchase Type</p>
                <p className="text-[13px] text-slate-900">{freshPR.purchaseType}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Priority</p>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                  freshPR.priority === "Urgent" ? "bg-red-100 text-red-700" :
                  freshPR.priority === "High" ? "bg-amber-100 text-amber-700" :
                  "bg-blue-100 text-blue-700"
                }`}>{freshPR.priority}</span>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] text-slate-500 mb-1">Item Description</p>
                <p className="text-[13px] text-slate-900">{freshPR.itemDescription}</p>
              </div>
            </div>
          </div>

          {/* Approval History */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">Approval History</h3>
            <div className="space-y-3">
              {freshPR.approvalHistory.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 bg-slate-50 rounded-lg">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    entry.action === "Approved" ? "bg-green-100 text-green-600" :
                    entry.action === "Rejected" ? "bg-red-100 text-red-600" :
                    "bg-blue-100 text-blue-600"
                  }`}>
                    {entry.action === "Approved" ? <Check className="w-3 h-3" /> :
                     entry.action === "Rejected" ? <XIcon className="w-3 h-3" /> :
                     <ChevronRight className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-medium text-slate-900">
                        Step {entry.step} — {entry.role}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        entry.action === "Approved" ? "bg-green-100 text-green-700" :
                        entry.action === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{entry.action}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{entry.comments}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons — only show if Dept approval is pending */}
          {freshPR.deptApproval === "Pending" && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApprove(freshPR.id)}
                className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2"
               
              >
                <Check className="w-4 h-4" /> Approve & Route to Procurement & Finance
              </button>
              <button
                onClick={() => setRejectModalOpen(freshPR.id)}
                className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
               
              >
                <XIcon className="w-4 h-4" /> Reject
              </button>
            </div>
          )}
        </div>

        {/* Reject Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-[15px] font-semibold text-slate-900 mb-3">Reject Procurement Request</h3>
              <p className="text-[12px] text-slate-500 mb-4">Please provide a reason for rejection:</p>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 outline-none focus:border-red-400 resize-none"
               
                placeholder="e.g., Budget not available, use existing resources..."
              />
              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={() => { setRejectModalOpen(null); setRejectComment(""); }}
                  className="px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                 
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(rejectModalOpen)}
                  className="px-4 py-2 text-[12px] text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
                 
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

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">
              Procurement Request Approval
            </h1>
            <p className="text-[12px] text-slate-500 mt-1">
              Review and approve procurement requests from your department (Step 2 — Department Head)
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
            placeholder="Search by PR number, description, requester..."
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">PR Number</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Description</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Requested By</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Dept</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Est. Cost</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Dept Status</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-[13px] text-slate-400">
                  No procurement requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((pr, index) => {
                const tabStatus = getTabStatus(pr);
                return (
                  <tr
                    key={pr.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                    onClick={() => setSelectedRequest(pr)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] text-purple-700 font-medium">
                          {pr.requisitionNumber}
                        </span>
                        {pr.sourceType === "ESS Plan" && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-indigo-50 text-indigo-600">ESS</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-900 max-w-[220px] truncate">
                      {pr.itemDescription}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-900">
                      {pr.requestedBy}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {pr.department}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-900 text-right font-medium">
                      ${pr.estimatedCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">
                      {pr.dateRequested}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          tabStatus === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : tabStatus === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                       
                      >
                        {tabStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedRequest(pr)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {pr.deptApproval === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(pr.id)}
                              className="p-1.5 rounded-lg hover:bg-green-50 transition-colors text-slate-500 hover:text-green-600"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRejectModalOpen(pr.id)}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal (from table actions) */}
      {rejectModalOpen && !selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-3">Reject Procurement Request</h3>
            <p className="text-[12px] text-slate-500 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 outline-none focus:border-red-400 resize-none"
             
              placeholder="e.g., Budget not available, use existing resources..."
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => { setRejectModalOpen(null); setRejectComment(""); }}
                className="px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
               
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectModalOpen)}
                className="px-4 py-2 text-[12px] text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
               
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