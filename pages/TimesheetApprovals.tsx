import { useState } from "react";
import { Search, Download, Eye, Check, X as XIcon, Layers, Briefcase, Coffee, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";

interface TimesheetEntryRecord {
  task: string;
  project: string;
  phase: string;
  week: string;
  hours: number;
  type: "paid" | "unpaid";
}

interface TimesheetApproval {
  id: string;
  requestId: string;
  employee: string;
  department: string;
  period: string;
  entries: TimesheetEntryRecord[];
  totalHours: number;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockTimesheetApprovals: TimesheetApproval[] = [
  {
    id: "1", requestId: "TS-2026-001", employee: "Desmond Tutu", department: "Engineering", period: "Feb 01 – Feb 15, 2026",
    entries: [
      { task: "Backend API Development", project: "Digital Payments Platform", phase: "Implementation", week: "Week 1", hours: 32, type: "paid" },
      { task: "Code Review Sessions", project: "Digital Payments Platform", phase: "Quality Assurance", week: "Week 1", hours: 8, type: "paid" },
      { task: "Sprint Planning", project: "Digital Payments Platform", phase: "Implementation", week: "Week 2", hours: 24, type: "paid" },
      { task: "Team Knowledge Sharing", project: "Internal", phase: "—", week: "Week 2", hours: 8, type: "paid" },
      { task: "Internal Admin", project: "Internal", phase: "—", week: "Week 1", hours: 8, type: "unpaid" },
    ],
    totalHours: 80, submittedDate: "Feb 16, 2026", status: "Pending"
  },
  {
    id: "2", requestId: "TS-2026-002", employee: "Nelly Manu", department: "Finance", period: "Feb 01 – Feb 15, 2026",
    entries: [
      { task: "Monthly Reconciliation", project: "Finance Operations", phase: "Reporting", week: "Week 1", hours: 36, type: "paid" },
      { task: "Budget Variance Analysis", project: "Finance Operations", phase: "Reporting", week: "Week 2", hours: 32, type: "paid" },
      { task: "Annual Leave", project: "Internal", phase: "—", week: "Week 2", hours: 8, type: "unpaid" },
    ],
    totalHours: 76, submittedDate: "Feb 16, 2026", status: "Pending"
  },
  {
    id: "3", requestId: "TS-2026-003", employee: "Abena Osei", department: "Operations", period: "Feb 01 – Feb 15, 2026",
    entries: [
      { task: "Supply Chain Coordination", project: "Logistics Improvement", phase: "Implementation", week: "Week 1", hours: 40, type: "paid" },
      { task: "Vendor Negotiations", project: "Logistics Improvement", phase: "Procurement", week: "Week 2", hours: 32, type: "paid" },
      { task: "Process Documentation", project: "Logistics Improvement", phase: "Reporting", week: "Week 2", hours: 8, type: "paid" },
    ],
    totalHours: 80, submittedDate: "Feb 16, 2026", status: "Approved"
  },
  {
    id: "4", requestId: "TS-2026-004", employee: "Wangari Maathai", department: "Programs", period: "Feb 01 – Feb 15, 2026",
    entries: [
      { task: "Community Outreach", project: "Green Initiative", phase: "Implementation", week: "Week 1", hours: 28, type: "paid" },
      { task: "Field Data Collection", project: "Green Initiative", phase: "Implementation", week: "Week 2", hours: 32, type: "paid" },
      { task: "Sick Leave", project: "Internal", phase: "—", week: "Week 1", hours: 12, type: "unpaid" },
    ],
    totalHours: 72, submittedDate: "Feb 16, 2026", status: "Rejected"
  },
  {
    id: "5", requestId: "TS-2026-005", employee: "Kwame Nkunim", department: "Engineering", period: "Feb 16 – Feb 28, 2026",
    entries: [
      { task: "Frontend Development", project: "Mobile Health App", phase: "Implementation", week: "Week 3", hours: 36, type: "paid" },
      { task: "UI Testing", project: "Mobile Health App", phase: "Quality Assurance", week: "Week 4", hours: 24, type: "paid" },
      { task: "Design Review", project: "Mobile Health App", phase: "Quality Assurance", week: "Week 3", hours: 16, type: "paid" },
      { task: "Internal Admin", project: "Internal", phase: "—", week: "Week 4", hours: 4, type: "unpaid" },
    ],
    totalHours: 80, submittedDate: "Mar 01, 2026", status: "Pending"
  },
  {
    id: "6", requestId: "TS-2026-006", employee: "Kojo Mensah", department: "HR", period: "Feb 16 – Feb 28, 2026",
    entries: [
      { task: "Recruitment Screening", project: "HR Operations", phase: "Implementation", week: "Week 3", hours: 28, type: "paid" },
      { task: "Interview Coordination", project: "HR Operations", phase: "Implementation", week: "Week 4", hours: 20, type: "paid" },
      { task: "Policy Review", project: "HR Operations", phase: "Reporting", week: "Week 3", hours: 16, type: "paid" },
      { task: "Capacity Building", project: "Internal", phase: "—", week: "Week 4", hours: 8, type: "unpaid" },
      { task: "Internal Admin", project: "Internal", phase: "—", week: "Week 3", hours: 8, type: "unpaid" },
    ],
    totalHours: 80, submittedDate: "Mar 01, 2026", status: "Pending"
  },
  {
    id: "7", requestId: "TS-2026-007", employee: "Kofi Annan", department: "Programs", period: "Jan 16 – Jan 31, 2026",
    entries: [
      { task: "Stakeholder Workshop", project: "Peace Building Initiative", phase: "Implementation", week: "Week 3", hours: 40, type: "paid" },
      { task: "Report Drafting", project: "Peace Building Initiative", phase: "Reporting", week: "Week 4", hours: 32, type: "paid" },
      { task: "Annual Leave", project: "Internal", phase: "—", week: "Week 4", hours: 8, type: "unpaid" },
    ],
    totalHours: 80, submittedDate: "Feb 01, 2026", status: "Approved"
  },
  {
    id: "8", requestId: "TS-2026-008", employee: "Chinua Achebe", department: "Finance", period: "Jan 16 – Jan 31, 2026",
    entries: [
      { task: "Audit Preparation", project: "Annual Audit 2025", phase: "Reporting", week: "Week 3", hours: 40, type: "paid" },
      { task: "Financial Statements Review", project: "Annual Audit 2025", phase: "Quality Assurance", week: "Week 4", hours: 38, type: "paid" },
      { task: "Internal Admin", project: "Internal", phase: "—", week: "Week 4", hours: 2, type: "unpaid" },
    ],
    totalHours: 80, submittedDate: "Feb 01, 2026", status: "Approved"
  },
  {
    id: "9", requestId: "TS-2026-009", employee: "Ama Ata Aidoo", department: "Operations", period: "Jan 01 – Jan 15, 2026",
    entries: [
      { task: "Inventory Management", project: "Warehouse Optimization", phase: "Implementation", week: "Week 1", hours: 32, type: "paid" },
      { task: "Capacity Building", project: "Internal", phase: "—", week: "Week 1", hours: 16, type: "paid" },
      { task: "Sick Leave", project: "Internal", phase: "—", week: "Week 2", hours: 16, type: "unpaid" },
    ],
    totalHours: 64, submittedDate: "Jan 16, 2026", status: "Rejected"
  },
  {
    id: "10", requestId: "TS-2026-010", employee: "Nelson Mandela", department: "Programs", period: "Feb 16 – Feb 28, 2026",
    entries: [
      { task: "Youth Mentorship Program", project: "Community Development", phase: "Implementation", week: "Week 3", hours: 36, type: "paid" },
      { task: "Impact Assessment Survey", project: "Community Development", phase: "Implementation", week: "Week 4", hours: 34, type: "paid" },
      { task: "Internal Admin", project: "Internal", phase: "—", week: "Week 3", hours: 10, type: "unpaid" },
    ],
    totalHours: 80, submittedDate: "Mar 01, 2026", status: "Pending"
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
    case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Rejected": return "bg-red-50 text-red-600 border-red-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export function TimesheetApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [data, setData] = useState(mockTimesheetApprovals);
  const [viewItem, setViewItem] = useState<TimesheetApproval | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Timesheet Approvals</h1>
            <p className="text-[12px] text-slate-500">Review and approve employee timesheet submissions</p>
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
              placeholder="Search by ID, employee, department..."
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
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Period</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Entries</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Total Hours</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Submitted</th>
              <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Status</th>
              <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                <td className="px-6 py-3 text-[12px] text-[#0B01D0] font-medium">{item.requestId}</td>
                <td className="px-6 py-3 text-[12px] text-slate-700">{item.employee}</td>
                <td className="px-6 py-3 text-[12px] text-slate-500">{item.department}</td>
                <td className="px-6 py-3 text-[12px] text-slate-500">{item.period}</td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full text-[11px] text-slate-600 font-medium">
                    <Layers size={11} />
                    {item.entries.length}
                  </span>
                </td>
                <td className="px-6 py-3 text-[12px] text-slate-600 text-center font-medium">{item.totalHours} hrs</td>
                <td className="px-6 py-3 text-[12px] text-slate-500">{item.submittedDate}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-medium ${getStatusBadge(item.status)}`}>
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
                <td colSpan={10} className="px-6 py-16 text-center">
                  <p className="text-[13px] text-slate-400">No timesheet approvals found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl mx-4 max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setViewItem(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <ArrowLeft size={16} className="text-slate-500" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-slate-900">Timesheet Details</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-medium ${getStatusBadge(viewItem.status)}`}>
                      {viewItem.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{viewItem.requestId} · {viewItem.entries.length} {viewItem.entries.length === 1 ? "entry" : "entries"}</p>
                </div>
              </div>
              <button onClick={() => setViewItem(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <XIcon size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Hours</p>
                  <p className="text-[18px] font-semibold text-slate-900">{viewItem.totalHours}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-blue-500 uppercase tracking-wider mb-1">Entries</p>
                  <p className="text-[18px] font-semibold text-blue-700">{viewItem.entries.length}</p>
                </div>
              </div>

              {/* Timesheet info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4 font-medium">Submission Info</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Request ID</p><p className="text-[13px] text-slate-900">{viewItem.requestId}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Employee</p><p className="text-[13px] text-slate-900">{viewItem.employee}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p><p className="text-[13px] text-slate-900">{viewItem.department}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Period</p><p className="text-[13px] text-slate-900">{viewItem.period}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Submitted Date</p><p className="text-[13px] text-slate-900">{viewItem.submittedDate}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-medium ${getStatusBadge(viewItem.status)}`}>
                      {viewItem.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Entries table */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} className="text-[#0B01D0]" />
                  <span className="text-[13px] font-semibold text-slate-900">Timesheet Entries ({viewItem.entries.length})</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: "#0B01D0" }}>
                        <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">#</th>
                        <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">Task</th>
                        <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">Project</th>
                        <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">Phase</th>
                        <th className="text-left px-4 py-2.5 text-white text-[11px] font-semibold">Week</th>
                        <th className="text-center px-4 py-2.5 text-white text-[11px] font-semibold">Hours</th>
                        <th className="text-center px-4 py-2.5 text-white text-[11px] font-semibold">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewItem.entries.map((entry, i) => (
                        <tr key={i} className={cn("border-b border-slate-100", i % 2 === 0 ? "bg-white" : "bg-slate-50/50")}>
                          <td className="px-4 py-2.5 text-[11px] text-slate-400">{i + 1}</td>
                          <td className="px-4 py-2.5 text-[12px] text-slate-900 font-medium">{entry.task}</td>
                          <td className="px-4 py-2.5 text-[12px] text-slate-600">{entry.project}</td>
                          <td className="px-4 py-2.5 text-[12px] text-slate-500">{entry.phase}</td>
                          <td className="px-4 py-2.5 text-[12px] text-slate-600">{entry.week}</td>
                          <td className="px-4 py-2.5 text-[12px] text-slate-900 text-center font-medium">{entry.hours} hrs</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border font-medium",
                              entry.type === "paid" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"
                            )}>
                              {entry.type === "paid" ? <Briefcase size={9} /> : <Coffee size={9} />}
                              {entry.type === "paid" ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {/* Totals row */}
                      <tr className="bg-slate-100 border-t-2 border-slate-300">
                        <td colSpan={5} className="px-4 py-2.5 text-[12px] font-semibold text-slate-700 text-right">Total</td>
                        <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-900 text-center">{viewItem.totalHours} hrs</td>
                        <td className="px-4 py-2.5"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 sticky bottom-0 bg-white rounded-b-2xl">
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
              <h3 className="text-[15px] font-semibold text-slate-900">Reject Timesheet</h3>
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
                placeholder="Please provide a reason for rejecting this timesheet..."
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

export default TimesheetApprovals;