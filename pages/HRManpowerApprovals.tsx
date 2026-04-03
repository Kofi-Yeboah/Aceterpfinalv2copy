import { useState } from "react";
import { Search, Download, Eye, Check, X as XIcon } from "lucide-react";

interface ManpowerApproval {
  id: string;
  requestId: string;
  requestedBy: string;
  department: string;
  jobTitle: string;
  positions: number;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Intern";
  priority: "High" | "Medium" | "Low";
  requestDate: string;
  neededBy: string;
  reportingTo: string;
  location: string;
  justification: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockData: ManpowerApproval[] = [
  { id: "1", requestId: "MPR-2026-0018", requestedBy: "Kofi Mensah", department: "Project Management", jobTitle: "Senior Project Officer", positions: 2, employmentType: "Full-Time", priority: "High", requestDate: "Feb 24, 2026", neededBy: "Apr 01, 2026", reportingTo: "Ama Darko", location: "Accra Head Office", justification: "New Clean Water Initiative project requires additional project officers for field coordination.", status: "Pending" },
  { id: "2", requestId: "MPR-2026-0016", requestedBy: "Ama Darko", department: "Monitoring & Evaluation", jobTitle: "M&E Data Analyst", positions: 1, employmentType: "Full-Time", priority: "High", requestDate: "Feb 20, 2026", neededBy: "Mar 15, 2026", reportingTo: "Kwame Asante", location: "Accra Head Office", justification: "Growing data collection needs require a dedicated analyst for the MEL team.", status: "Approved" },
  { id: "3", requestId: "MPR-2026-0014", requestedBy: "Richard Antwi", department: "Finance", jobTitle: "Finance Assistant", positions: 1, employmentType: "Contract", priority: "Medium", requestDate: "Feb 18, 2026", neededBy: "Mar 31, 2026", reportingTo: "Abena Owusu", location: "Accra Head Office", justification: "Temporary support needed for annual audit preparation.", status: "Pending" },
  { id: "4", requestId: "MPR-2026-0012", requestedBy: "Mercy Adjei", department: "Programs", jobTitle: "Program Coordinator", positions: 1, employmentType: "Full-Time", priority: "High", requestDate: "Feb 15, 2026", neededBy: "Apr 15, 2026", reportingTo: "Kofi Mensah", location: "Kumasi Regional Office", justification: "New regional program launch requires dedicated coordination.", status: "Pending" },
  { id: "5", requestId: "MPR-2026-0010", requestedBy: "Nana Yaw", department: "IT", jobTitle: "Junior Developer", positions: 2, employmentType: "Intern", priority: "Low", requestDate: "Feb 12, 2026", neededBy: "May 01, 2026", reportingTo: "Kwame Asante", location: "Accra Head Office", justification: "Summer internship program to support internal tool development.", status: "Approved" },
  { id: "6", requestId: "MPR-2026-0008", requestedBy: "Kwame Asante", department: "Engineering", jobTitle: "Senior Software Engineer", positions: 1, employmentType: "Full-Time", priority: "High", requestDate: "Feb 08, 2026", neededBy: "Mar 15, 2026", reportingTo: "Ama Darko", location: "Accra Head Office", justification: "Critical role for platform expansion project.", status: "Rejected" },
  { id: "7", requestId: "MPR-2026-0006", requestedBy: "Abena Owusu", department: "HR", jobTitle: "HR Officer", positions: 1, employmentType: "Part-Time", priority: "Medium", requestDate: "Feb 05, 2026", neededBy: "Mar 01, 2026", reportingTo: "Mercy Adjei", location: "Accra Head Office", justification: "Additional HR support for recruitment surge.", status: "Pending" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
    case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Rejected": return "bg-red-50 text-red-600 border-red-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "High": return "bg-red-50 text-red-600 border-red-200";
    case "Medium": return "bg-amber-50 text-amber-600 border-amber-200";
    case "Low": return "bg-blue-50 text-blue-600 border-blue-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export function HRManpowerApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [data, setData] = useState(mockData);
  const [viewItem, setViewItem] = useState<ManpowerApproval | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());
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
            <h1 className="text-2xl font-semibold text-slate-900">Manpower Request Approvals</h1>
            <p className="text-[12px] text-slate-500">Review and approve manpower/staffing requests</p>
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
            <input type="text" placeholder="Search by ID, employee, job title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
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

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="sticky top-0 z-[5]">
              <tr className="bg-blue-600 text-white">
                <th className="text-left px-6 py-3 text-[12px]">Reference No.</th>
                <th className="text-left px-6 py-3 text-[12px]">Requested By</th>
                <th className="text-left px-6 py-3 text-[12px]">Job Title</th>
                <th className="text-left px-6 py-3 text-[12px]">Department</th>
                <th className="text-center px-6 py-3 text-[12px]">Positions</th>
                <th className="text-left px-6 py-3 text-[12px]">Type</th>
                <th className="text-left px-6 py-3 text-[12px]">Priority</th>
                <th className="text-left px-6 py-3 text-[12px]">Needed By</th>
                <th className="text-left px-6 py-3 text-[12px]">Status</th>
                <th className="text-center px-6 py-3 text-[12px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-6 py-3 text-[12px] text-slate-900">{item.requestId}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-700">{item.requestedBy}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-600">{item.jobTitle}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-500">{item.department}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-900 text-center">{item.positions}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-600">{item.employmentType}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getPriorityBadge(item.priority)}`}>{item.priority}</span>
                  </td>
                  <td className="px-6 py-3 text-[12px] text-slate-500">{item.neededBy}</td>
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
                <tr><td colSpan={10} className="px-6 py-16 text-center"><p className="text-[13px] text-slate-400">No manpower request approvals found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Manpower Request Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><XIcon size={18} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Reference No.</p><p className="text-[13px] text-slate-900">{viewItem.requestId}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Requested By</p><p className="text-[13px] text-slate-900">{viewItem.requestedBy}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Job Title</p><p className="text-[13px] text-slate-900">{viewItem.jobTitle}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p><p className="text-[13px] text-slate-900">{viewItem.department}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Positions</p><p className="text-[13px] text-slate-900">{viewItem.positions}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Employment Type</p><p className="text-[13px] text-slate-900">{viewItem.employmentType}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Priority</p><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getPriorityBadge(viewItem.priority)}`}>{viewItem.priority}</span></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Request Date</p><p className="text-[13px] text-slate-900">{viewItem.requestDate}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Needed By</p><p className="text-[13px] text-slate-900">{viewItem.neededBy}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Reporting To</p><p className="text-[13px] text-slate-900">{viewItem.reportingTo}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Location</p><p className="text-[13px] text-slate-900">{viewItem.location}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(viewItem.status)}`}>{viewItem.status}</span></div>
              </div>
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Justification</p><p className="text-[13px] text-slate-700">{viewItem.justification}</p></div>
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
              <h3 className="text-[15px] text-slate-900">Reject Manpower Request</h3>
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

export default HRManpowerApprovals;