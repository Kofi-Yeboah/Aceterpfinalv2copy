import { useState } from "react";
import { Search, Download, Eye, Check, X as XIcon } from "lucide-react";

interface AdvanceApproval {
  id: string;
  requestId: string;
  employee: string;
  department: string;
  amount: string;
  purpose: string;
  requestDate: string;
  repaymentPeriod: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy: string | null;
  notes: string;
}

const mockData: AdvanceApproval[] = [
  { id: "1", requestId: "ADV-2026-0015", employee: "Kofi Mensah", department: "Project Management", amount: "GHS 2,500", purpose: "Medical emergency", requestDate: "Feb 28, 2026", repaymentPeriod: "6 months", status: "Pending", approvedBy: null, notes: "Urgent medical expenses for family member." },
  { id: "2", requestId: "ADV-2026-0014", employee: "Abena Owusu", department: "Finance", amount: "GHS 1,000", purpose: "Home repairs", requestDate: "Feb 22, 2026", repaymentPeriod: "3 months", status: "Approved", approvedBy: "Ama Darko", notes: "Roof repair due to storm damage." },
  { id: "3", requestId: "ADV-2026-0013", employee: "Richard Antwi", department: "Operations", amount: "GHS 3,000", purpose: "Education fees", requestDate: "Feb 18, 2026", repaymentPeriod: "12 months", status: "Pending", approvedBy: null, notes: "University tuition fee for part-time MBA program." },
  { id: "4", requestId: "ADV-2026-0012", employee: "Mercy Adjei", department: "Programs", amount: "GHS 500", purpose: "Emergency travel", requestDate: "Feb 15, 2026", repaymentPeriod: "2 months", status: "Approved", approvedBy: "Kwame Asante", notes: "Emergency family travel." },
  { id: "5", requestId: "ADV-2026-0011", employee: "Nana Yaw", department: "IT", amount: "GHS 5,000", purpose: "Personal project", requestDate: "Feb 10, 2026", repaymentPeriod: "12 months", status: "Rejected", approvedBy: null, notes: "Request exceeds allowable advance limit for current grade." },
  { id: "6", requestId: "ADV-2026-0010", employee: "Kwame Asante", department: "Engineering", amount: "GHS 1,500", purpose: "Vehicle repairs", requestDate: "Feb 06, 2026", repaymentPeriod: "4 months", status: "Pending", approvedBy: null, notes: "Vehicle needed for daily commute to project site." },
  { id: "7", requestId: "ADV-2026-0009", employee: "Ama Serwaa", department: "Admin", amount: "GHS 800", purpose: "Rent deposit", requestDate: "Feb 02, 2026", repaymentPeriod: "6 months", status: "Pending", approvedBy: null, notes: "Relocating to Accra for new assignment." },
  { id: "8", requestId: "ADV-2026-0008", employee: "Desmond Tutu", department: "Programs", amount: "GHS 2,000", purpose: "Wedding expenses", requestDate: "Jan 28, 2026", repaymentPeriod: "8 months", status: "Approved", approvedBy: "Ama Darko", notes: "Upcoming wedding in April." },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
    case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Rejected": return "bg-red-50 text-red-600 border-red-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export function HRAdvanceApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [data, setData] = useState(mockData);
  const [viewItem, setViewItem] = useState<AdvanceApproval | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
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
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Advance Request Approvals</h1>
            <p className="text-[12px] text-slate-500">Review and approve salary advance requests</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-amber-50 text-amber-600 border-amber-200">{pendingCount} Pending</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-emerald-50 text-emerald-600 border-emerald-200">{approvedCount} Approved</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-red-50 text-red-600 border-red-200">{rejectedCount} Rejected</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search by ID, employee, purpose..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg bg-white text-[12px] text-slate-700 hover:bg-slate-50 transition-colors">
              <Download size={14} className="text-purple-700" />Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-[5]" style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Request ID</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Employee</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Department</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Amount</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Purpose</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Repayment</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Request Date</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
                <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-6 py-3 text-[12px] text-slate-900">{item.requestId}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-700">{item.employee}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-500">{item.department}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-900">{item.amount}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-600 max-w-[160px] truncate">{item.purpose}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-600">{item.repaymentPeriod}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-500">{item.requestDate}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setViewItem(item)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="View Details"><Eye size={15} className="text-slate-400" /></button>
                      {item.status === "Pending" && (
                        <>
                          <button onClick={() => handleApprove(item.id)} className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors" title="Approve"><Check size={15} className="text-emerald-600" /></button>
                          <button onClick={() => setRejectingId(item.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors" title="Reject"><XIcon size={15} className="text-red-600" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-6 py-16 text-center"><p className="text-[13px] text-slate-400">No advance request approvals found</p></td></tr>
              )}
            </tbody>
          </table>
      </div>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Advance Request Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><XIcon size={18} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Request ID</p><p className="text-[13px] text-slate-900">{viewItem.requestId}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Employee</p><p className="text-[13px] text-slate-900">{viewItem.employee}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p><p className="text-[13px] text-slate-900">{viewItem.department}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Amount</p><p className="text-[13px] text-slate-900">{viewItem.amount}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Repayment Period</p><p className="text-[13px] text-slate-900">{viewItem.repaymentPeriod}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Request Date</p><p className="text-[13px] text-slate-900">{viewItem.requestDate}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Approved By</p><p className="text-[13px] text-slate-900">{viewItem.approvedBy || "—"}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(viewItem.status)}`}>{viewItem.status}</span></div>
              </div>
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Purpose</p><p className="text-[13px] text-slate-700">{viewItem.purpose}</p></div>
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Notes</p><p className="text-[13px] text-slate-700">{viewItem.notes}</p></div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              {viewItem.status === "Pending" && (
                <>
                  <button onClick={() => { setRejectingId(viewItem.id); setViewItem(null); }} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[13px] hover:bg-red-100 transition-colors border border-red-200">Reject</button>
                  <button onClick={() => { handleApprove(viewItem.id); setViewItem(null); }} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">Approve</button>
                </>
              )}
              {viewItem.status !== "Pending" && (
                <button onClick={() => setViewItem(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">Close</button>
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
              <h3 className="text-[15px] text-slate-900">Reject Advance Request</h3>
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><XIcon size={18} className="text-slate-400" /></button>
            </div>
            <div className="p-6">
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 block">Reason for Rejection</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none" placeholder="Please provide a reason for rejecting this request..." />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleReject(rejectingId)} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg text-[13px] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HRAdvanceApprovals;