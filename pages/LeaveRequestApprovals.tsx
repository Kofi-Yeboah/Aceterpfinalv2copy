import { useState } from "react";
import { Search, Download, Eye, Check, X as XIcon } from "lucide-react";

interface LeaveApproval {
  id: string;
  requestId: string;
  employee: string;
  department: string;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockLeaveApprovals: LeaveApproval[] = [
  { id: "1", requestId: "LR-2026-001", employee: "Desmond Tutu", department: "Engineering", leaveType: "Annual", from: "Mar 15, 2026", to: "Mar 20, 2026", days: 5, reason: "Family vacation", submittedDate: "Feb 25, 2026", status: "Pending" },
  { id: "2", requestId: "LR-2026-002", employee: "Nelly Manu", department: "Finance", leaveType: "Medical", from: "Mar 08, 2026", to: "Mar 12, 2026", days: 4, reason: "Medical appointment and recovery", submittedDate: "Mar 01, 2026", status: "Pending" },
  { id: "3", requestId: "LR-2026-003", employee: "Abena Osei", department: "Operations", leaveType: "Annual", from: "Apr 04, 2026", to: "Apr 11, 2026", days: 7, reason: "Personal travel", submittedDate: "Feb 20, 2026", status: "Approved" },
  { id: "4", requestId: "LR-2026-004", employee: "Wangari Maathai", department: "Programs", leaveType: "Casual", from: "Mar 03, 2026", to: "Mar 04, 2026", days: 2, reason: "Personal errands", submittedDate: "Feb 27, 2026", status: "Rejected" },
  { id: "5", requestId: "LR-2026-005", employee: "Kwame Nkunim", department: "Engineering", leaveType: "Annual", from: "Mar 20, 2026", to: "Mar 31, 2026", days: 9, reason: "Holiday travel", submittedDate: "Feb 28, 2026", status: "Pending" },
  { id: "6", requestId: "LR-2026-006", employee: "Kojo Mensah", department: "HR", leaveType: "Medical", from: "Feb 14, 2026", to: "Feb 16, 2026", days: 2, reason: "Dental surgery", submittedDate: "Feb 10, 2026", status: "Approved" },
  { id: "7", requestId: "LR-2026-007", employee: "Kofi Annan", department: "Programs", leaveType: "Annual", from: "Jun 05, 2026", to: "Jun 12, 2026", days: 7, reason: "Annual family reunion", submittedDate: "Feb 15, 2026", status: "Approved" },
  { id: "8", requestId: "LR-2026-008", employee: "Chinua Achebe", department: "Finance", leaveType: "Compassionate", from: "Mar 10, 2026", to: "Mar 17, 2026", days: 7, reason: "Family bereavement", submittedDate: "Mar 01, 2026", status: "Pending" },
  { id: "9", requestId: "LR-2026-009", employee: "Ama Ata Aidoo", department: "Operations", leaveType: "Annual", from: "May 22, 2026", to: "May 29, 2026", days: 7, reason: "Personal vacation", submittedDate: "Feb 18, 2026", status: "Pending" },
  { id: "10", requestId: "LR-2026-010", employee: "Nelson Mandela", department: "Programs", leaveType: "Casual", from: "Mar 05, 2026", to: "Mar 06, 2026", days: 2, reason: "Moving to new house", submittedDate: "Feb 26, 2026", status: "Rejected" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
    case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Rejected": return "bg-red-50 text-red-600 border-red-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export function LeaveRequestApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [data, setData] = useState(mockLeaveApprovals);
  const [viewItem, setViewItem] = useState<LeaveApproval | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leaveType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: "Approved" as const } : item));
  };

  const handleReject = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: "Rejected" as const } : item));
    setRejectingId(null);
    setRejectReason("");
  };

  const pendingCount = data.filter(d => d.status === "Pending").length;
  const approvedCount = data.filter(d => d.status === "Approved").length;
  const rejectedCount = data.filter(d => d.status === "Rejected").length;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Leave Request Approvals</h1>
            <p className="text-[12px] text-slate-500">Review and approve employee leave requests</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-amber-50 text-amber-600 border-amber-200">{pendingCount} Pending</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-emerald-50 text-emerald-600 border-emerald-200">{approvedCount} Approved</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-red-50 text-red-600 border-red-200">{rejectedCount} Rejected</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by ID, employee, leave type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg bg-white text-[12px] text-slate-700 hover:bg-slate-50 transition-colors">
              <Download size={14} className="text-purple-700" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-[5]">
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Request ID</th>
                <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Employee</th>
                <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Department</th>
                <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Leave Type</th>
                <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">From</th>
                <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">To</th>
                <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Days</th>
                <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Status</th>
                <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-6 py-3 text-[12px] text-slate-900">{item.requestId}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-700">{item.employee}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-500">{item.department}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-600">{item.leaveType}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-500">{item.from}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-500">{item.to}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-600">{item.days}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewItem(item)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="View Details"
                      >
                        <Eye size={15} className="text-slate-400" />
                      </button>
                      {item.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                            title="Approve"
                          >
                            <Check size={15} className="text-emerald-600" />
                          </button>
                          <button
                            onClick={() => setRejectingId(item.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                            title="Reject"
                          >
                            <XIcon size={15} className="text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <p className="text-[13px] text-slate-400">No leave request approvals found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>

      {/* View Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Leave Request Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <XIcon size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Request ID</p>
                  <p className="text-[13px] text-slate-900">{viewItem.requestId}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Employee</p>
                  <p className="text-[13px] text-slate-900">{viewItem.employee}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-[13px] text-slate-900">{viewItem.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Leave Type</p>
                  <p className="text-[13px] text-slate-900">{viewItem.leaveType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">From</p>
                  <p className="text-[13px] text-slate-900">{viewItem.from}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">To</p>
                  <p className="text-[13px] text-slate-900">{viewItem.to}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Days</p>
                  <p className="text-[13px] text-slate-900">{viewItem.days} days</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(viewItem.status)}`}>
                    {viewItem.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Submitted Date</p>
                  <p className="text-[13px] text-slate-900">{viewItem.submittedDate}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Reason</p>
                <p className="text-[13px] text-slate-700">{viewItem.reason}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              {viewItem.status === "Pending" && (
                <>
                  <button
                    onClick={() => { setRejectingId(viewItem.id); setViewItem(null); }}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[13px] hover:bg-red-100 transition-colors border border-red-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => { handleApprove(viewItem.id); setViewItem(null); }}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors"
                  >
                    Approve
                  </button>
                </>
              )}
              {viewItem.status !== "Pending" && (
                <button onClick={() => setViewItem(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => { setRejectingId(null); setRejectReason(""); }}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[15px] text-slate-900">Reject Leave Request</h3>
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <XIcon size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6">
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 block">Reason for Rejection</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none"
                placeholder="Please provide a reason for rejecting this request..."
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={() => handleReject(rejectingId)}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-[13px] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default LeaveRequestApprovals;