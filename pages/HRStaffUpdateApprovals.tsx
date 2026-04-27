import { useState } from "react";
import { Search, Download, Eye, Check, X as XIcon, User, GraduationCap, BookOpen } from "lucide-react";

interface StaffUpdateApproval {
  id: string;
  requestId: string;
  employee: string;
  department: string;
  updateType: "Personal Info" | "Qualification" | "Training";
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy: string | null;
  notes: string;
}

const mockData: StaffUpdateApproval[] = [
  { id: "1", requestId: "SUP-2026-0021", employee: "Kofi Mensah", department: "Project Management", updateType: "Personal Info", fieldChanged: "Phone Number", oldValue: "+233 24 555 1234", newValue: "+233 24 555 9876", requestDate: "Mar 05, 2026", status: "Pending", approvedBy: null, notes: "Changed to new personal number." },
  { id: "2", requestId: "SUP-2026-0020", employee: "Abena Owusu", department: "Finance", updateType: "Qualification", fieldChanged: "Highest Degree", oldValue: "BSc Accounting", newValue: "MSc Finance (University of Ghana)", requestDate: "Mar 03, 2026", status: "Pending", approvedBy: null, notes: "Completed MSc program in February 2026. Certificate attached." },
  { id: "3", requestId: "SUP-2026-0019", employee: "Richard Antwi", department: "Operations", updateType: "Training", fieldChanged: "Certification", oldValue: "—", newValue: "PMP Certification (PMI)", requestDate: "Mar 01, 2026", status: "Approved", approvedBy: "Dr. Akua Mensah", notes: "PMP exam passed. Certificate uploaded." },
  { id: "4", requestId: "SUP-2026-0018", employee: "Mercy Adjei", department: "Programs", updateType: "Personal Info", fieldChanged: "Emergency Contact", oldValue: "Kwasi Adjei (+233 20 111 2222)", newValue: "Ama Adjei (+233 20 333 4444)", requestDate: "Feb 28, 2026", status: "Approved", approvedBy: "Dr. Akua Mensah", notes: "Updated emergency contact to spouse." },
  { id: "5", requestId: "SUP-2026-0017", employee: "Nana Yaw", department: "IT", updateType: "Personal Info", fieldChanged: "Residential Address", oldValue: "12 Osu Avenue, Accra", newValue: "45 Cantonments Road, Accra", requestDate: "Feb 25, 2026", status: "Pending", approvedBy: null, notes: "Relocated to new residence." },
  { id: "6", requestId: "SUP-2026-0016", employee: "Kwame Asante", department: "Engineering", updateType: "Training", fieldChanged: "Training Program", oldValue: "—", newValue: "Advanced Data Analytics (Coursera)", requestDate: "Feb 20, 2026", status: "Rejected", approvedBy: null, notes: "Certificate not recognized by HR policy. Resubmit with accredited equivalent." },
  { id: "7", requestId: "SUP-2026-0015", employee: "Ama Serwaa", department: "Admin", updateType: "Qualification", fieldChanged: "Professional Membership", oldValue: "—", newValue: "ICAG (Institute of Chartered Accountants, Ghana)", requestDate: "Feb 18, 2026", status: "Approved", approvedBy: "Dr. Akua Mensah", notes: "Membership verified. HR records updated." },
  { id: "8", requestId: "SUP-2026-0014", employee: "Desmond Tutu", department: "Programs", updateType: "Personal Info", fieldChanged: "Marital Status", oldValue: "Single", newValue: "Married", requestDate: "Feb 15, 2026", status: "Approved", approvedBy: "Dr. Akua Mensah", notes: "Marriage certificate submitted." },
  { id: "9", requestId: "SUP-2026-0013", employee: "Akosua Badu", department: "M&E", updateType: "Training", fieldChanged: "Training Program", oldValue: "—", newValue: "Results-Based M&E (CLEAR Initiative)", requestDate: "Feb 10, 2026", status: "Pending", approvedBy: null, notes: "Completed 5-day workshop. Certificate pending upload." },
  { id: "10", requestId: "SUP-2026-0012", employee: "Emmanuel Ofori", department: "Finance", updateType: "Qualification", fieldChanged: "Highest Degree", oldValue: "HND Accounting", newValue: "BSc Accounting (UPSA)", requestDate: "Feb 05, 2026", status: "Approved", approvedBy: "Dr. Akua Mensah", notes: "Top-up degree completed. Transcript verified." },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
    case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Rejected": return "bg-red-50 text-red-600 border-red-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case "Personal Info": return { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: <User size={11} /> };
    case "Qualification": return { bg: "bg-purple-50 text-purple-700 border-purple-200", icon: <GraduationCap size={11} /> };
    case "Training": return { bg: "bg-teal-50 text-teal-700 border-teal-200", icon: <BookOpen size={11} /> };
    default: return { bg: "bg-slate-50 text-slate-700 border-slate-200", icon: null };
  }
}

export function HRStaffUpdateApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [data, setData] = useState(mockData);
  const [viewItem, setViewItem] = useState<StaffUpdateApproval | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fieldChanged.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter;
    const matchesType = typeFilter === "All Types" || item.updateType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApprove = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: "Approved" as const, approvedBy: "Dr. Akua Mensah" } : item));
  };
  const handleReject = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: "Rejected" as const, notes: rejectReason || item.notes } : item));
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
            <h1 className="text-2xl font-semibold text-slate-900">Staff Profile Update Approvals</h1>
            <p className="text-[12px] text-slate-500">Review and approve employee updates to personal information, qualifications and training records</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-amber-50 text-amber-600 border-amber-200">{pendingCount} Pending</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-emerald-50 text-emerald-600 border-emerald-200">{approvedCount} Approved</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-red-50 text-red-600 border-red-200">{rejectedCount} Rejected</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white flex-1 max-w-sm">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, employee, or field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 bg-white outline-none"
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 bg-white outline-none"
          >
            <option>All Types</option>
            <option>Personal Info</option>
            <option>Qualification</option>
            <option>Training</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-[5]">
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Request ID</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Employee</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Department</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Update Type</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Field Changed</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Date</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-sm text-slate-400">No update requests found</td></tr>
            ) : (
              filtered.map((item, idx) => {
                const typeBadge = getTypeBadge(item.updateType);
                return (
                  <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] font-medium text-[#0B01D0]">{item.requestId}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 font-medium">{item.employee}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{item.department}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium ${typeBadge.bg}`}>
                        {typeBadge.icon} {item.updateType}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-slate-700">{item.fieldChanged}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{item.requestDate}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-medium ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setViewItem(item)} className="p-1.5 hover:bg-slate-100 rounded-lg" title="View Details">
                          <Eye size={14} className="text-slate-400" />
                        </button>
                        {item.status === "Pending" && (
                          <>
                            <button onClick={() => handleApprove(item.id)} className="p-1.5 hover:bg-emerald-50 rounded-lg" title="Approve">
                              <Check size={14} className="text-emerald-500" />
                            </button>
                            <button onClick={() => setRejectingId(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Reject">
                              <XIcon size={14} className="text-red-400" />
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

      {/* View Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-semibold text-slate-900">{viewItem.requestId}</h2>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-medium ${getStatusBadge(viewItem.status)}`}>
                    {viewItem.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{viewItem.employee} · {viewItem.updateType}</p>
              </div>
              <button onClick={() => setViewItem(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><XIcon size={16} className="text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4 font-medium">Update Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Employee</p><p className="text-[13px] text-slate-900">{viewItem.employee}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p><p className="text-[13px] text-slate-900">{viewItem.department}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Update Type</p><p className="text-[13px] text-slate-900">{viewItem.updateType}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Field Changed</p><p className="text-[13px] text-slate-900">{viewItem.fieldChanged}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Request Date</p><p className="text-[13px] text-slate-900">{viewItem.requestDate}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Approved By</p><p className="text-[13px] text-slate-900">{viewItem.approvedBy || "—"}</p></div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3 font-medium">Change Comparison</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-[10px] text-red-500 uppercase tracking-wider mb-1">Previous Value</p>
                    <p className="text-[12px] text-slate-800">{viewItem.oldValue || "—"}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">New Value</p>
                    <p className="text-[12px] text-slate-800">{viewItem.newValue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-2 font-medium">Notes</p>
                <p className="text-[12px] text-slate-700">{viewItem.notes}</p>
              </div>
              {viewItem.status === "Pending" && (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => { handleApprove(viewItem.id); setViewItem({ ...viewItem, status: "Approved", approvedBy: "Dr. Akua Mensah" }); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-[12px] font-medium hover:bg-emerald-700"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => { setRejectingId(viewItem.id); setViewItem(null); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-[12px] font-medium hover:bg-red-700"
                  >
                    <XIcon size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setRejectingId(null); setRejectReason(""); }} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-1">Reject Update Request</h3>
            <p className="text-[12px] text-slate-500 mb-4">Provide a reason for rejecting this profile update request.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-slate-200 rounded-lg p-3 text-[12px] outline-none focus:border-purple-400 resize-none h-24"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => handleReject(rejectingId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-[12px] font-medium hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HRStaffUpdateApprovals;
