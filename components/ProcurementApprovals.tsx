import { useState, useEffect } from "react";
import { Search, Download, ChevronDown, MoreHorizontal, Check, X, Eye } from "lucide-react";
import {
  getSourcingApprovals,
  approveSourcing,
  rejectSourcing,
  getGeneratedPRs,
  approvePRProcurement,
  rejectPRProcurement,
  subscribe,
  type GeneratedPR,
} from "../lib/procurementStore";

const PR_STATUSES = ["All Statuses", "Pending", "Approved", "Rejected"];
const SOURCING_STATUSES = ["All Statuses", "Pending", "Approved", "Rejected"];

export function ProcurementApprovals() {
  const [activeTab, setActiveTab] = useState<"pr" | "sourcing">("pr");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPR, setSelectedPR] = useState<GeneratedPR | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  // Force re-render when store changes
  const [, setTick] = useState(0);
  useEffect(() => {
    return subscribe(() => setTick((t) => t + 1));
  }, []);

  const sourcingApprovals = getSourcingApprovals();
  const allGeneratedPRs = getGeneratedPRs();
  // Procurement unit only sees PRs that have reached step 3+ (past dept approval)
  const procurementPRs = allGeneratedPRs.filter(pr => pr.procurementApproval !== "N/A");

  const filteredPRItems = procurementPRs.filter((pr) => {
    const matchesSearch =
      pr.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Statuses" || pr.procurementApproval === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredSourcingItems = sourcingApprovals.filter((item) => {
    const matchesSearch =
      item.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Statuses" || item.approvalStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-50 text-green-600";
      case "Pending": return "bg-orange-50 text-orange-600";
      case "Rejected": return "bg-red-50 text-red-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  const getTimelinessColor = (status: string) => {
    switch (status) {
      case "On Time": return "bg-emerald-50 text-emerald-700";
      case "Overdue": return "bg-red-50 text-red-700";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  const handleApprovePR = (id: string) => {
    approvePRProcurement(id, "Policy and plan alignment verified by Procurement Unit");
    setOpenActionMenuId(null);
    setSelectedPR(null);
  };

  const handleRejectPR = (id: string) => {
    rejectPRProcurement(id, rejectComment || "Rejected by Procurement Unit");
    setRejectModalOpen(null);
    setRejectComment("");
    setOpenActionMenuId(null);
    setSelectedPR(null);
  };

  const handleApproveSourcing = (id: string) => {
    approveSourcing(id);
    setOpenActionMenuId(null);
  };

  const handleRejectSourcing = (id: string) => {
    rejectSourcing(id);
    setOpenActionMenuId(null);
  };

  const tabs = [
    { key: "pr" as const, label: "Purchase Requisitions", count: procurementPRs.filter((pr) => pr.procurementApproval === "Pending").length },
    { key: "sourcing" as const, label: "Sourcing (RFQ)", count: sourcingApprovals.filter((i) => i.approvalStatus === "Pending").length },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Procurement Approvals</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 bg-white border-b border-slate-200">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearchQuery("");
                setSelectedStatus("All Statuses");
                setCurrentPage(1);
              }}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-purple-700 text-purple-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-semibold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">Export</span>
              <Download size={16} className="text-purple-700" />
            </button>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {(activeTab === "pr" ? PR_STATUSES : SOURCING_STATUSES).map((status) => (
                      <button
                        key={status}
                        onClick={() => { setSelectedStatus(status); setShowStatusDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        {activeTab === "pr" ? (
          /* ── PR Approvals Table (Step 3 — Procurement Unit) ── */
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Requisition #</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Description</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Requested By</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Category</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Est. Cost</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Finance</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Procurement</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPRItems.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-[13px] text-slate-400">No procurement requests found.</td></tr>
              ) : filteredPRItems.map((pr) => (
                <tr key={pr.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[12px] font-medium text-slate-900">{pr.requisitionNumber}</p>
                      {pr.sourceType === "ESS Plan" && <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-indigo-50 text-indigo-600">ESS</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-900 max-w-[200px] truncate">{pr.itemDescription}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{pr.requestedBy}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{pr.department}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{pr.category}</p></td>
                  <td className="px-4 py-4 text-right"><p className="text-[12px] text-slate-900">{formatCurrency(pr.estimatedCost)}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(pr.dateRequested)}</p></td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getApprovalStatusColor(pr.financeApproval)}`}>{pr.financeApproval}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getApprovalStatusColor(pr.procurementApproval)}`}>{pr.procurementApproval}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="relative">
                      <button
                        onClick={() => setOpenActionMenuId(openActionMenuId === pr.id ? null : pr.id)}
                        className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal size={20} className="text-blue-800" />
                      </button>
                      {openActionMenuId === pr.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                            <button onClick={() => { console.log("View PR:", pr); setOpenActionMenuId(null); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                              <Eye size={14} /> View Details
                            </button>
                            {pr.procurementApproval === "Pending" && (
                              <>
                                <button onClick={() => handleApprovePR(pr.id)} className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 transition-colors flex items-center gap-2">
                                  <Check size={14} /> Approve
                                </button>
                                <button onClick={() => { setRejectModalOpen(pr.id); setOpenActionMenuId(null); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                                  <X size={14} /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* ── Sourcing Approvals Table ── */
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">RFQ Number</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Title</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Source PR</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Project</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Vendor</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Est. Value</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date Submitted</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSourcingItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{item.rfqNumber}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{item.title}</p></td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-xl text-[12px] bg-indigo-50 text-indigo-700">{item.sourcePR}</span>
                  </td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{item.projectName}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{item.vendor}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(item.estimatedValue)}</p></td>
                  <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{formatDate(item.dateSubmitted)}</p></td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getApprovalStatusColor(item.approvalStatus)}`}>
                      {item.approvalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="relative">
                      <button
                        onClick={() => setOpenActionMenuId(openActionMenuId === item.id ? null : item.id)}
                        className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal size={20} className="text-blue-800" />
                      </button>
                      {openActionMenuId === item.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                            <button onClick={() => { console.log("View Sourcing:", item); setOpenActionMenuId(null); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                              <Eye size={14} /> View Details
                            </button>
                            {item.approvalStatus === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleApproveSourcing(item.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 transition-colors flex items-center gap-2"
                                >
                                  <Check size={14} /> Approve & Create PO
                                </button>
                                <button
                                  onClick={() => handleRejectSourcing(item.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>
          <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">1</button>
          <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <ChevronDown size={16} className="-rotate-90 text-pink-600" />
          </button>
        </div>
      </div>

      {/* Reject Modal for PR */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-3">Reject — Procurement Unit Review</h3>
            <p className="text-[12px] text-slate-500 mb-4">Please specify the policy or plan alignment issue:</p>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-slate-900 outline-none focus:border-red-400 resize-none"
              placeholder="e.g., Not in annual procurement plan, non-compliant procurement method..."
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => { setRejectModalOpen(null); setRejectComment(""); }} className="px-4 py-2 text-[12px] text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleRejectPR(rejectModalOpen)} className="px-4 py-2 text-[12px] text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}