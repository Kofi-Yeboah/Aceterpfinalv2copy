import { useState } from "react";
import { Search, Download, Eye, Check, X as XIcon } from "lucide-react";

interface ExpenseClaimApproval {
  id: string;
  requestId: string;
  employee: string;
  department: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  receiptDate: string;
  project: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
  receipts: string[];
  notes: string;
}

const mockData: ExpenseClaimApproval[] = [
  { id: "1", requestId: "EC-2026-0044", employee: "Kofi Mensah", department: "Project Management", category: "Travel", description: "Flight tickets to Accra for conference", amount: 850, currency: "GHS", receiptDate: "Feb 18, 2026", project: "Climate Finance Readiness Program", requestDate: "Feb 20, 2026", status: "Pending", receipts: ["flight_receipt.pdf", "boarding_pass.pdf"], notes: "Round trip economy class tickets." },
  { id: "2", requestId: "EC-2026-0041", employee: "Abena Owusu", department: "Finance", category: "Accommodation", description: "Hotel stay in Lagos for field research", amount: 450, currency: "GHS", receiptDate: "Feb 19, 2026", project: "West Africa Regional Integration Study", requestDate: "Feb 21, 2026", status: "Pending", receipts: ["hotel_invoice.pdf"], notes: "3 nights at partner-recommended hotel." },
  { id: "3", requestId: "EC-2026-0038", employee: "Richard Antwi", department: "Operations", category: "Meals", description: "Client meeting lunch expenses", amount: 120, currency: "GHS", receiptDate: "Feb 17, 2026", project: "Digital Economy Policy Brief Series", requestDate: "Feb 19, 2026", status: "Approved", receipts: ["restaurant_receipt.jpg"], notes: "Lunch meeting with 3 external stakeholders." },
  { id: "4", requestId: "EC-2026-0035", employee: "Mercy Adjei", department: "Programs", category: "Transportation", description: "Taxi and local transport during field visit", amount: 85, currency: "GHS", receiptDate: "Feb 15, 2026", project: "Renewable Energy Transition Framework", requestDate: "Feb 18, 2026", status: "Approved", receipts: ["taxi_receipts.pdf"], notes: "Multiple taxi rides during 2-day field assessment." },
  { id: "5", requestId: "EC-2026-0032", employee: "Nana Yaw", department: "HR", category: "Office Supplies", description: "Stationery and printing materials", amount: 65, currency: "GHS", receiptDate: "Feb 20, 2026", project: "Sustainable Agriculture Development Initiative", requestDate: "Feb 22, 2026", status: "Pending", receipts: ["store_receipt.jpg"], notes: "Printing materials for stakeholder workshop." },
  { id: "6", requestId: "EC-2026-0029", employee: "Kwame Asante", department: "Engineering", category: "Travel", description: "International flight to Nairobi", amount: 1200, currency: "GHS", receiptDate: "Feb 16, 2026", project: "Climate Finance Readiness Program", requestDate: "Feb 17, 2026", status: "Rejected", receipts: [], notes: "Claim rejected — travel was not pre-approved." },
  { id: "7", requestId: "EC-2026-0026", employee: "Ama Serwaa", department: "Admin", category: "Accommodation", description: "Hotel booking for Dakar workshop", amount: 380, currency: "GHS", receiptDate: "Feb 21, 2026", project: "West Africa Regional Integration Study", requestDate: "Feb 23, 2026", status: "Pending", receipts: ["hotel_booking.pdf", "payment_confirmation.pdf"], notes: "4 nights for UNDP workshop in Dakar." },
  { id: "8", requestId: "EC-2026-0023", employee: "Desmond Tutu", department: "Programs", category: "Other", description: "Conference registration fee", amount: 500, currency: "GHS", receiptDate: "Feb 12, 2026", project: "Digital Economy Policy Brief Series", requestDate: "Feb 14, 2026", status: "Approved", receipts: ["registration_receipt.pdf"], notes: "International development economics conference." },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
    case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Rejected": return "bg-red-50 text-red-600 border-red-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export function HRExpenseClaimApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [data, setData] = useState(mockData);
  const [viewItem, setViewItem] = useState<ExpenseClaimApproval | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
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
            <h1 className="text-2xl font-semibold text-slate-900">Expense Claim Approvals</h1>
            <p className="text-[12px] text-slate-500">Review and approve employee expense claims</p>
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
            <input type="text" placeholder="Search by ID, employee, description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
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
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Reference No.</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Employee</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Category</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Description</th>
                <th className="text-right px-6 py-3 text-[12px] text-white font-semibold">Amount (GHS)</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Receipt Date</th>
                <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
                <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-6 py-3 text-[12px] text-slate-900">{item.requestId}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-700">{item.employee}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-600">{item.category}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-600 max-w-[200px] truncate">{item.description}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-900 text-right">{item.amount.toFixed(2)}</td>
                  <td className="px-6 py-3 text-[12px] text-slate-500">{item.receiptDate}</td>
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
                <tr><td colSpan={8} className="px-6 py-16 text-center"><p className="text-[13px] text-slate-400">No expense claim approvals found</p></td></tr>
              )}
            </tbody>
          </table>
      </div>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Expense Claim Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><XIcon size={18} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Reference No.</p><p className="text-[13px] text-slate-900">{viewItem.requestId}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Employee</p><p className="text-[13px] text-slate-900">{viewItem.employee}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p><p className="text-[13px] text-slate-900">{viewItem.department}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Category</p><p className="text-[13px] text-slate-900">{viewItem.category}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Amount</p><p className="text-[13px] text-slate-900">GHS {viewItem.amount.toFixed(2)}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Receipt Date</p><p className="text-[13px] text-slate-900">{viewItem.receiptDate}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Project</p><p className="text-[13px] text-slate-900">{viewItem.project}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(viewItem.status)}`}>{viewItem.status}</span></div>
              </div>
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description</p><p className="text-[13px] text-slate-700">{viewItem.description}</p></div>
              <div><p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Notes</p><p className="text-[13px] text-slate-700">{viewItem.notes}</p></div>
              {viewItem.receipts.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Receipts / Invoices</p>
                  <div className="flex flex-col gap-1">
                    {viewItem.receipts.map((r, i) => (
                      <span key={i} className="text-[12px] text-blue-700">{r}</span>
                    ))}
                  </div>
                </div>
              )}
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
              <h3 className="text-[15px] text-slate-900">Reject Expense Claim</h3>
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><XIcon size={18} className="text-slate-400" /></button>
            </div>
            <div className="p-6">
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 block">Reason for Rejection</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none" placeholder="Please provide a reason for rejecting this claim..." />
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

export default HRExpenseClaimApprovals;