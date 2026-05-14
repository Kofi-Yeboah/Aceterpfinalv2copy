import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  X,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  Briefcase,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface ManpowerReq {
  id: string;
  referenceNo: string;
  jobTitle: string;
  department: string;
  positions: number;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Intern";
  priority: "High" | "Medium" | "Low";
  requestDate: string;
  neededBy: string;
  status: "Draft" | "Pending" | "Approved" | "Rejected" | "Filled";
  requestedBy: string;
  justification: string;
  reportingTo: string;
  location: string;
}

const mockRequests: ManpowerReq[] = [
  {
    id: "1", referenceNo: "MPR-2026-0018", jobTitle: "Senior Project Officer", department: "Project Management",
    positions: 2, employmentType: "Full-Time", priority: "High", requestDate: "Feb 24, 2026", neededBy: "Apr 01, 2026",
    status: "Pending", requestedBy: "Kofi Mensah",
    justification: "New Clean Water Initiative project requires additional project officers for field coordination.",
    reportingTo: "Ama Darko", location: "Accra Head Office",
  },
  {
    id: "2", referenceNo: "MPR-2026-0016", jobTitle: "M&E Data Analyst", department: "Monitoring & Evaluation",
    positions: 1, employmentType: "Full-Time", priority: "High", requestDate: "Feb 20, 2026", neededBy: "Mar 15, 2026",
    status: "Approved", requestedBy: "Ama Darko",
    justification: "Growing data collection needs require a dedicated analyst for the MEL team.",
    reportingTo: "Kwame Asante", location: "Accra Head Office",
  },
  {
    id: "3", referenceNo: "MPR-2026-0014", jobTitle: "Finance Assistant", department: "Finance",
    positions: 1, employmentType: "Full-Time", priority: "Medium", requestDate: "Feb 17, 2026", neededBy: "Mar 30, 2026",
    status: "Pending", requestedBy: "Abena Owusu",
    justification: "Additional support needed for grant financial reporting and reconciliation.",
    reportingTo: "Abena Owusu", location: "Accra Head Office",
  },
  {
    id: "4", referenceNo: "MPR-2026-0012", jobTitle: "IT Support Technician", department: "IT",
    positions: 1, employmentType: "Contract", priority: "Medium", requestDate: "Feb 14, 2026", neededBy: "Mar 01, 2026",
    status: "Approved", requestedBy: "Richard Antwi",
    justification: "6-month contract to support office network upgrade and hardware deployment.",
    reportingTo: "Richard Antwi", location: "Accra Head Office",
  },
  {
    id: "5", referenceNo: "MPR-2026-0010", jobTitle: "Communications Intern", department: "Communications",
    positions: 2, employmentType: "Intern", priority: "Low", requestDate: "Feb 10, 2026", neededBy: "Mar 15, 2026",
    status: "Filled", requestedBy: "Mercy Adjei",
    justification: "Interns needed to assist with social media management and content creation.",
    reportingTo: "Mercy Adjei", location: "Accra Head Office",
  },
  {
    id: "6", referenceNo: "MPR-2026-0008", jobTitle: "Procurement Officer", department: "Procurement",
    positions: 1, employmentType: "Full-Time", priority: "High", requestDate: "Feb 06, 2026", neededBy: "Mar 01, 2026",
    status: "Rejected", requestedBy: "Nana Yaw",
    justification: "Request to replace resigned procurement officer.",
    reportingTo: "Kwame Asante", location: "Accra Head Office",
  },
  {
    id: "7", referenceNo: "MPR-2026-0005", jobTitle: "Driver", department: "Administration",
    positions: 1, employmentType: "Part-Time", priority: "Low", requestDate: "Jan 28, 2026", neededBy: "Feb 15, 2026",
    status: "Filled", requestedBy: "Kwame Asante",
    justification: "Part-time driver needed for Kumasi regional office operations.",
    reportingTo: "Nana Yaw", location: "Kumasi Regional Office",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", icon: <FileText size={12} /> },
  Pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Clock size={12} /> },
  Approved: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <CheckCircle2 size={12} /> },
  Rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <XCircle size={12} /> },
  Filled: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: <Users size={12} /> },
};

const priorityConfig: Record<string, { bg: string; text: string }> = {
  High: { bg: "bg-red-50 border-red-200", text: "text-red-700" },
  Medium: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  Low: { bg: "bg-green-50 border-green-200", text: "text-green-700" },
};

const employmentTypeConfig: Record<string, { bg: string; text: string }> = {
  "Full-Time": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  "Part-Time": { bg: "bg-violet-50 border-violet-200", text: "text-violet-700" },
  Contract: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
  Intern: { bg: "bg-teal-50 border-teal-200", text: "text-teal-700" },
};

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function ManpowerRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [viewDetail, setViewDetail] = useState<ManpowerReq | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: "", department: "", positions: "1", employmentType: "Full-Time", priority: "Medium", neededBy: "", justification: "",
  });

  const filtered = mockRequests.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || req.referenceNo.toLowerCase().includes(q) || req.jobTitle.toLowerCase().includes(q) || req.department.toLowerCase().includes(q) || req.requestedBy.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Manpower Request</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200"><Clock size={12} />{mockRequests.filter((r) => r.status === "Pending").length} Pending</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] border border-blue-200"><Briefcase size={12} />{mockRequests.reduce((sum, r) => sum + r.positions, 0)} Total Positions</span>
        </div>
        <button onClick={() => setShowNewForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors"><Plus size={14} />New Request</button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input type="text" placeholder="Search by title, department, reference..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400" />
          {searchQuery && (<button onClick={() => setSearchQuery("")}><X size={13} className="text-slate-400 hover:text-slate-600" /></button>)}
        </div>
        <div className="relative">
          <button onClick={() => setShowStatusDropdown(!showStatusDropdown)} className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[12px] transition-colors ${statusFilter !== "All" ? "border-purple-300 bg-purple-50 text-purple-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
            <Filter size={13} />{statusFilter === "All" ? "All Status" : statusFilter}<ChevronDown size={11} />
          </button>
          {showStatusDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2">
                {["All", "Draft", "Pending", "Approved", "Rejected", "Filled"].map((s) => (
                  <button key={s} onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }} className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-between ${statusFilter === s ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"}`}>
                    {s === "All" ? "All Status" : s}{statusFilter === s && <CheckCircle2 size={13} className="text-purple-600" />}
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
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Job Title</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Department</th>
              <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Positions</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Type</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Priority</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Needed By</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
              <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-16"><Users size={40} className="text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No manpower requests found</p></td></tr>
            ) : (
              filtered.map((req, idx) => {
                const sc = statusConfig[req.status];
                const pc = priorityConfig[req.priority];
                const etc = employmentTypeConfig[req.employmentType];
                return (
                  <tr key={req.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] text-blue-700">{req.referenceNo}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900">{req.jobTitle}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-600">{req.department}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 text-center">{req.positions}</td>
                    <td className="px-6 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${etc.bg} ${etc.text}`}>{req.employmentType}</span></td>
                    <td className="px-6 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${pc.bg} ${pc.text}`}>{req.priority === "High" && <AlertCircle size={10} />}{req.priority}</span></td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.neededBy}</td>
                    <td className="px-6 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>{sc.icon}{req.status}</span></td>
                    <td className="px-6 py-3 text-center">
                      <button onClick={() => setViewDetail(req)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><Eye size={14} className="text-slate-400" /></button>
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
        const pc = priorityConfig[viewDetail.priority];
        const etc = employmentTypeConfig[viewDetail.employmentType];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setViewDetail(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-auto">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ArrowLeft size={16} className="text-slate-500" /></button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] text-slate-900">{viewDetail.referenceNo}</h2>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>{sc.icon}{viewDetail.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Manpower Request Details</p>
                  </div>
                </div>
                <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Position Details</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailField label="Job Title" value={viewDetail.jobTitle} />
                    <DetailField label="Department" value={viewDetail.department} />
                    <DetailField label="No. of Positions" value={viewDetail.positions} />
                    <DetailField label="Employment Type" value={<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${etc.bg} ${etc.text}`}>{viewDetail.employmentType}</span>} />
                    <DetailField label="Priority" value={<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${pc.bg} ${pc.text}`}>{viewDetail.priority === "High" && <AlertCircle size={10} />}{viewDetail.priority}</span>} />
                    <DetailField label="Reporting To" value={viewDetail.reportingTo} />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Request Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailField label="Requested By" value={viewDetail.requestedBy} />
                    <DetailField label="Request Date" value={viewDetail.requestDate} />
                    <DetailField label="Needed By" value={viewDetail.neededBy} />
                    <DetailField label="Location" value={viewDetail.location} />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Justification</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{viewDetail.justification}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Activity</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><FileText size={12} className="text-blue-600" /></div>
                      <div><p className="text-[12px] text-slate-900">Request submitted</p><p className="text-[10px] text-slate-400">{viewDetail.requestDate} by {viewDetail.requestedBy}</p></div>
                    </div>
                    {viewDetail.status === "Approved" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 size={12} className="text-emerald-600" /></div>
                        <div><p className="text-[12px] text-slate-900">Request approved</p><p className="text-[10px] text-slate-400">Position approved for recruitment</p></div>
                      </div>
                    )}
                    {viewDetail.status === "Filled" && (
                      <>
                        <div className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 size={12} className="text-emerald-600" /></div>
                          <div><p className="text-[12px] text-slate-900">Request approved</p><p className="text-[10px] text-slate-400">Position approved for recruitment</p></div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><Users size={12} className="text-blue-600" /></div>
                          <div><p className="text-[12px] text-slate-900">Position filled</p><p className="text-[10px] text-slate-400">All {viewDetail.positions} position(s) successfully filled</p></div>
                        </div>
                      </>
                    )}
                    {viewDetail.status === "Rejected" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0"><XCircle size={12} className="text-red-600" /></div>
                        <div><p className="text-[12px] text-slate-900">Request rejected</p><p className="text-[10px] text-slate-400">Budget constraints — consider internal reassignment</p></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* New Request Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNewForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] text-slate-900">New Manpower Request</h2>
              <button onClick={() => setShowNewForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Job Title</label>
                <input type="text" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="e.g. Senior Project Officer" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Department</label><input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Project Management" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400" /></div>
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">No. of Positions</label><input type="number" min="1" value={formData.positions} onChange={(e) => setFormData({ ...formData, positions: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Employment Type</label><select value={formData.employmentType} onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 bg-white"><option value="Full-Time">Full-Time</option><option value="Part-Time">Part-Time</option><option value="Contract">Contract</option><option value="Intern">Intern</option></select></div>
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Priority</label><select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 bg-white"><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Needed By</label><input type="date" value={formData.neededBy} onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400" /></div>
              </div>
              <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Justification</label><textarea value={formData.justification} onChange={(e) => setFormData({ ...formData, justification: e.target.value })} placeholder="Explain why this position is needed..." rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none" /></div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setShowNewForm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => setShowNewForm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Save as Draft</button>
                <button onClick={() => setShowNewForm(false)} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800">Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
