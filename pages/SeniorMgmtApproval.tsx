import { useState, useEffect } from "react";
import { Search, Download, Eye, Check, X as XIcon, ArrowLeft, DollarSign, AlertTriangle, ChevronRight, Shield } from "lucide-react";
import {
  getGeneratedPRs,
  approvePRSeniorMgmt,
  rejectPRSeniorMgmt,
  subscribe,
  type GeneratedPR,
} from "../lib/procurementStore";

const tabs = ["All", "Pending", "Approved", "Rejected"] as const;
type TabType = (typeof tabs)[number];

export function SeniorMgmtApproval() {
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
  // Only PRs that require senior management and have reached step 5
  const seniorPRs = allPRs.filter(pr => pr.requiresSeniorApproval && pr.seniorMgmtApproval !== "N/A");

  const filteredRequests = seniorPRs.filter((pr) => {
    const matchesTab = activeTab === "All" || pr.seniorMgmtApproval === activeTab;
    const matchesSearch =
      pr.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<TabType, number> = {
    All: seniorPRs.length,
    Pending: seniorPRs.filter(pr => pr.seniorMgmtApproval === "Pending").length,
    Approved: seniorPRs.filter(pr => pr.seniorMgmtApproval === "Approved").length,
    Rejected: seniorPRs.filter(pr => pr.seniorMgmtApproval === "Rejected").length,
  };

  const handleApprove = (id: string) => {
    approvePRSeniorMgmt(id);
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    rejectPRSeniorMgmt(id, rejectComment);
    setRejectModalOpen(null);
    setRejectComment("");
    setSelectedRequest(null);
  };

  if (selectedRequest) {
    const freshPR = allPRs.find(pr => pr.id === selectedRequest.id) || selectedRequest;
    return (
      <div className="flex flex-col h-full bg-slate-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedRequest(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-semibold text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Senior Management Review — {freshPR.requisitionNumber}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-100 text-amber-700">&gt; $10,000 Threshold</span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Final approval for high-value procurement requests
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${
            freshPR.seniorMgmtApproval === "Pending" ? "bg-amber-100 text-amber-700" :
            freshPR.seniorMgmtApproval === "Approved" ? "bg-green-100 text-green-700" :
            "bg-red-100 text-red-700"
          }`}>{freshPR.overallApprovalStatus}</span>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Workflow */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <h3 className="text-[13px] font-semibold text-slate-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Approval Workflow — Final Step</h3>
            <div className="flex items-center gap-3">
              {[
                { label: "Submitted", step: 1, status: "Approved" as const },
                { label: "Dept Head", step: 2, status: freshPR.deptApproval },
                { label: "Procurement", step: 3, status: freshPR.procurementApproval },
                { label: "Finance", step: 4, status: freshPR.financeApproval },
                { label: "Senior Mgmt", step: 5, status: freshPR.seniorMgmtApproval },
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
                       s.status === "Rejected" ? <XIcon className="w-4 h-4" /> : s.step}
                    </div>
                    <span className="text-[10px] text-slate-500 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className="h-0.5 flex-1 bg-slate-200 -mt-5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-[11px] text-slate-500" style={{ fontFamily: "Montserrat, sans-serif" }}>Estimated Cost</span>
              </div>
              <p className="text-[20px] font-semibold text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>${freshPR.estimatedCost.toLocaleString()}</p>
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Exceeds $10,000 threshold</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-[11px] text-slate-500" style={{ fontFamily: "Montserrat, sans-serif" }}>Prior Approvals</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">Dept: {freshPR.deptApproval}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">Proc: {freshPR.procurementApproval}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">Fin: {freshPR.financeApproval}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] text-slate-500" style={{ fontFamily: "Montserrat, sans-serif" }}>Priority</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                freshPR.priority === "Urgent" ? "bg-red-100 text-red-700" :
                freshPR.priority === "High" ? "bg-amber-100 text-amber-700" :
                "bg-blue-100 text-blue-700"
              }`}>{freshPR.priority}</span>
              <p className="text-[11px] text-slate-500 mt-2" style={{ fontFamily: "Montserrat, sans-serif" }}>{freshPR.category} — {freshPR.purchaseType}</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Request Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Requested By</p>
                <p className="text-[13px] text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{freshPR.requestedBy} — {freshPR.department}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Date Requested</p>
                <p className="text-[13px] text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{freshPR.dateRequested}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Quantity</p>
                <p className="text-[13px] text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{freshPR.quantity} {freshPR.unit}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Source</p>
                <p className="text-[13px] text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{freshPR.sourceType}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] text-slate-500 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Description</p>
                <p className="text-[13px] text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{freshPR.itemDescription}</p>
              </div>
            </div>
          </div>

          {/* Approval History */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Full Approval Chain</h3>
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
                      <p className="text-[12px] font-medium text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>Step {entry.step} — {entry.role}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        entry.action === "Approved" ? "bg-green-100 text-green-700" :
                        entry.action === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{entry.action}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>{entry.comments}</p>
                    <p className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {freshPR.seniorMgmtApproval === "Pending" && (
            <div className="flex items-center gap-3">
              <button onClick={() => handleApprove(freshPR.id)} className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <Check className="w-4 h-4" /> Grant Final Approval
              </button>
              <button onClick={() => setRejectModalOpen(freshPR.id)} className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <XIcon className="w-4 h-4" /> Reject
              </button>
            </div>
          )}
        </div>

        {rejectModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-[15px] font-semibold text-slate-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Reject — Senior Management</h3>
              <p className="text-[12px] text-slate-500 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>Provide reason for rejection:</p>
              <textarea value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 outline-none focus:border-red-400 resize-none" style={{ fontFamily: "Montserrat, sans-serif" }} placeholder="e.g., Exceeds budget ceiling, requires board approval..." />
              <div className="flex items-center justify-end gap-3 mt-4">
                <button onClick={() => { setRejectModalOpen(null); setRejectComment(""); }} className="px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>Cancel</button>
                <button onClick={() => handleReject(rejectModalOpen)} className="px-4 py-2 text-[12px] text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>Confirm Rejection</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>Senior Management Approval</h1>
            <p className="text-[12px] text-slate-500 mt-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Final approval for procurement requests exceeding $10,000 (Step 5)</p>
          </div>
          <button className="px-4 py-2 rounded-lg text-[12px] font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: "#0B01D0", fontFamily: "Montserrat, sans-serif" }}>
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors min-w-[100px] flex items-center justify-center gap-1.5 ${activeTab === tab ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`} style={{ fontFamily: "Montserrat, sans-serif" }}>
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"}`}>{tabCounts[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by PR number, description, requester..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" style={{ fontFamily: "Montserrat, sans-serif" }} />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }} className="sticky top-0 z-[5]">
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>PR Number</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Description</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Requester</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Est. Cost</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Category</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Priority</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Status</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-[13px] text-slate-400" style={{ fontFamily: "Montserrat, sans-serif" }}>No high-value procurement requests pending senior approval.</td></tr>
            ) : filteredRequests.map((pr, index) => (
              <tr key={pr.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`} onClick={() => setSelectedRequest(pr)}>
                <td className="px-4 py-3"><span className="text-[12px] text-purple-700 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>{pr.requisitionNumber}</span></td>
                <td className="px-4 py-3 text-[12px] text-slate-900 max-w-[220px] truncate" style={{ fontFamily: "Montserrat, sans-serif" }}>{pr.itemDescription}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-[12px] text-slate-900" style={{ fontFamily: "Montserrat, sans-serif" }}>{pr.requestedBy}</p>
                    <p className="text-[11px] text-slate-400" style={{ fontFamily: "Montserrat, sans-serif" }}>{pr.department}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-slate-900 text-right font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>${pr.estimatedCost.toLocaleString()}</td>
                <td className="px-4 py-3 text-[12px] text-slate-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{pr.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    pr.priority === "Urgent" ? "bg-red-100 text-red-700" :
                    pr.priority === "High" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>{pr.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                    pr.seniorMgmtApproval === "Pending" ? "bg-amber-100 text-amber-700" :
                    pr.seniorMgmtApproval === "Approved" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`} style={{ fontFamily: "Montserrat, sans-serif" }}>{pr.seniorMgmtApproval}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setSelectedRequest(pr)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-purple-700" title="View Details"><Eye className="w-4 h-4" /></button>
                    {pr.seniorMgmtApproval === "Pending" && (
                      <>
                        <button onClick={() => handleApprove(pr.id)} className="p-1.5 rounded-lg hover:bg-green-50 transition-colors text-slate-500 hover:text-green-600" title="Approve"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setRejectModalOpen(pr.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600" title="Reject"><XIcon className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectModalOpen && !selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>Reject — Senior Management</h3>
            <textarea value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 outline-none focus:border-red-400 resize-none" style={{ fontFamily: "Montserrat, sans-serif" }} placeholder="Reason for rejection..." />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => { setRejectModalOpen(null); setRejectComment(""); }} className="px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>Cancel</button>
              <button onClick={() => handleReject(rejectModalOpen)} className="px-4 py-2 text-[12px] text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
