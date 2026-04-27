import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  Receipt,
  Search as SearchIcon,
  ArrowLeft,
  Paperclip,
  Upload,
} from "lucide-react";

interface ExpenseClaimData {
  id: string;
  referenceNo: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  receiptDate: string;
  project: string;
  requestDate: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  claimedBy: string;
  approvedBy: string | null;
  receipts: string[];
  notes: string;
}

const mockClaims: ExpenseClaimData[] = [
  {
    id: "1", referenceNo: "EC-2026-0044", category: "Travel", description: "Flight tickets to Accra for conference",
    amount: 850, currency: "GHS", receiptDate: "Feb 18, 2026", project: "Climate Finance Readiness Program",
    requestDate: "Feb 20, 2026", status: "Approved", claimedBy: "Kofi Mensah", approvedBy: "Ama Darko",
    receipts: ["flight_receipt.pdf", "boarding_pass.pdf"], notes: "Round trip economy class tickets.",
  },
  {
    id: "2", referenceNo: "EC-2026-0041", category: "Accommodation", description: "Hotel stay in Lagos for field research",
    amount: 450, currency: "GHS", receiptDate: "Feb 19, 2026", project: "West Africa Regional Integration Study",
    requestDate: "Feb 21, 2026", status: "Pending", claimedBy: "Abena Owusu", approvedBy: null,
    receipts: ["hotel_invoice.pdf"], notes: "3 nights at partner-recommended hotel.",
  },
  {
    id: "3", referenceNo: "EC-2026-0038", category: "Meals", description: "Client meeting lunch expenses",
    amount: 120, currency: "GHS", receiptDate: "Feb 17, 2026", project: "Digital Economy Policy Brief Series",
    requestDate: "Feb 19, 2026", status: "Under Review", claimedBy: "Richard Antwi", approvedBy: null,
    receipts: ["restaurant_receipt.jpg"], notes: "Lunch meeting with 3 external stakeholders.",
  },
  {
    id: "4", referenceNo: "EC-2026-0035", category: "Transportation", description: "Taxi and local transport during field visit",
    amount: 85, currency: "GHS", receiptDate: "Feb 15, 2026", project: "Renewable Energy Transition Framework",
    requestDate: "Feb 18, 2026", status: "Approved", claimedBy: "Mercy Adjei", approvedBy: "Kwame Asante",
    receipts: ["taxi_receipts.pdf"], notes: "Multiple taxi rides during 2-day field assessment.",
  },
  {
    id: "5", referenceNo: "EC-2026-0032", category: "Office Supplies", description: "Stationery and printing materials",
    amount: 65, currency: "GHS", receiptDate: "Feb 20, 2026", project: "Sustainable Agriculture Development Initiative",
    requestDate: "Feb 22, 2026", status: "Pending", claimedBy: "Nana Yaw", approvedBy: null,
    receipts: ["store_receipt.jpg"], notes: "Printing materials for stakeholder workshop.",
  },
  {
    id: "6", referenceNo: "EC-2026-0029", category: "Travel", description: "International flight to Nairobi",
    amount: 1200, currency: "GHS", receiptDate: "Feb 16, 2026", project: "Climate Finance Readiness Program",
    requestDate: "Feb 17, 2026", status: "Rejected", claimedBy: "Kwame Asante", approvedBy: null,
    receipts: [], notes: "Claim rejected — travel was not pre-approved. Please submit a travel request first.",
  },
  {
    id: "7", referenceNo: "EC-2026-0026", category: "Accommodation", description: "Hotel booking for Dakar workshop",
    amount: 380, currency: "GHS", receiptDate: "Feb 21, 2026", project: "West Africa Regional Integration Study",
    requestDate: "Feb 23, 2026", status: "Under Review", claimedBy: "Abena Owusu", approvedBy: null,
    receipts: ["hotel_booking.pdf", "payment_confirmation.pdf"], notes: "4 nights for UNDP workshop in Dakar.",
  },
  {
    id: "8", referenceNo: "EC-2026-0023", category: "Other", description: "Conference registration fee",
    amount: 250, currency: "GHS", receiptDate: "Feb 14, 2026", project: "Digital Economy Policy Brief Series",
    requestDate: "Feb 16, 2026", status: "Approved", claimedBy: "Richard Antwi", approvedBy: "Ama Darko",
    receipts: ["registration_confirmation.pdf"], notes: "Early bird registration for Pan-African Digital Economy Forum.",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Clock size={12} /> },
  "Under Review": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: <SearchIcon size={12} /> },
  Approved: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <CheckCircle2 size={12} /> },
  Rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <XCircle size={12} /> },
};

const categoryConfig: Record<string, { bg: string; text: string }> = {
  Travel: { bg: "bg-violet-50 border-violet-200", text: "text-violet-700" },
  Accommodation: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  Meals: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
  Transportation: { bg: "bg-teal-50 border-teal-200", text: "text-teal-700" },
  "Office Supplies": { bg: "bg-slate-50 border-slate-200", text: "text-slate-600" },
  Other: { bg: "bg-gray-50 border-gray-200", text: "text-gray-600" },
};

const categories = ["Travel", "Accommodation", "Meals", "Transportation", "Office Supplies", "Other"];

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function ExpenseClaim() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [viewDetail, setViewDetail] = useState<ExpenseClaimData | null>(null);
  const [formData, setFormData] = useState({ category: "Travel", description: "", amount: "", receiptDate: "", project: "" });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const filtered = mockClaims.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || req.referenceNo.toLowerCase().includes(q) || req.description.toLowerCase().includes(q) || req.project.toLowerCase().includes(q) || req.category.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Expense Claim</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200"><Clock size={12} />{mockClaims.filter((r) => r.status === "Pending").length} Pending</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] border border-emerald-200"><Receipt size={12} />{mockClaims.length} Total Claims</span>
        </div>
        <button onClick={() => setShowNewForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors"><Plus size={14} />New Claim</button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input type="text" placeholder="Search by reference, description, project..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400" />
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
                {["All", "Pending", "Under Review", "Approved", "Rejected"].map((s) => (
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
          <thead className="sticky top-0 z-[5]">
            <tr className="bg-blue-600 text-white">
              <th className="text-left px-6 py-3 text-[12px]">Reference No.</th>
              <th className="text-left px-6 py-3 text-[12px]">Category</th>
              <th className="text-left px-6 py-3 text-[12px]">Description</th>
              <th className="text-right px-6 py-3 text-[12px]">Amount (GHS)</th>
              <th className="text-left px-6 py-3 text-[12px]">Receipt Date</th>
              <th className="text-left px-6 py-3 text-[12px]">Project</th>
              <th className="text-left px-6 py-3 text-[12px]">Status</th>
              <th className="text-left px-6 py-3 text-[12px]">Request Date</th>
              <th className="text-center px-6 py-3 text-[12px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-16"><FileText size={40} className="text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No expense claims found</p></td></tr>
            ) : (
              filtered.map((req, idx) => {
                const sc = statusConfig[req.status];
                const cc = categoryConfig[req.category] || categoryConfig["Other"];
                return (
                  <tr key={req.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] text-blue-700">{req.referenceNo}</td>
                    <td className="px-6 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${cc.bg} ${cc.text}`}>{req.category}</span></td>
                    <td className="px-6 py-3 text-[12px] text-slate-600 max-w-[220px] truncate">{req.description}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 text-right">{req.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.receiptDate}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-600 max-w-[200px] truncate">{req.project}</td>
                    <td className="px-6 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>{sc.icon}{req.status}</span></td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.requestDate}</td>
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
        const cc = categoryConfig[viewDetail.category] || categoryConfig["Other"];
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${cc.bg} ${cc.text}`}>{viewDetail.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Expense Claim Details</p>
                  </div>
                </div>
                <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Claim Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailField label="Description" value={viewDetail.description} />
                    <DetailField label="Amount" value={`GHS ${viewDetail.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
                    <DetailField label="Category" value={<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${cc.bg} ${cc.text}`}>{viewDetail.category}</span>} />
                    <DetailField label="Receipt Date" value={viewDetail.receiptDate} />
                    <DetailField label="Request Date" value={viewDetail.requestDate} />
                    <DetailField label="Claimed By" value={viewDetail.claimedBy} />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Project & Approval</p>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField label="Project" value={viewDetail.project} />
                    <DetailField label="Approved By" value={viewDetail.approvedBy || "—"} />
                  </div>
                </div>
                {/* Receipts */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Receipts & Attachments</p>
                  {viewDetail.receipts.length === 0 ? (
                    <p className="text-[12px] text-slate-400">No receipts attached</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {viewDetail.receipts.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                          <Paperclip size={13} className="text-slate-400" />
                          <span className="text-[12px] text-blue-700 flex-1">{file}</span>
                          <span className="text-[10px] text-slate-400">{file.endsWith(".pdf") ? "PDF" : "Image"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Notes */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Notes</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{viewDetail.notes}</p>
                </div>
                {/* Activity */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Activity</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><FileText size={12} className="text-blue-600" /></div>
                      <div><p className="text-[12px] text-slate-900">Claim submitted</p><p className="text-[10px] text-slate-400">{viewDetail.requestDate} by {viewDetail.claimedBy}</p></div>
                    </div>
                    {viewDetail.status === "Under Review" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><SearchIcon size={12} className="text-blue-600" /></div>
                        <div><p className="text-[12px] text-slate-900">Under review</p><p className="text-[10px] text-slate-400">Claim is being verified by the finance team</p></div>
                      </div>
                    )}
                    {viewDetail.status === "Approved" && viewDetail.approvedBy && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 size={12} className="text-emerald-600" /></div>
                        <div><p className="text-[12px] text-slate-900">Claim approved</p><p className="text-[10px] text-slate-400">Approved by {viewDetail.approvedBy} — reimbursement processing</p></div>
                      </div>
                    )}
                    {viewDetail.status === "Rejected" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0"><XCircle size={12} className="text-red-600" /></div>
                        <div><p className="text-[12px] text-slate-900">Claim rejected</p><p className="text-[10px] text-slate-400">Travel was not pre-approved</p></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* New Claim Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNewForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] text-slate-900">New Expense Claim</h2>
              <button onClick={() => setShowNewForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 bg-white">{categories.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Amount (GHS)</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400" /></div>
              </div>
              <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Description</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the expense..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Receipt Date</label><input type="date" value={formData.receiptDate} onChange={(e) => setFormData({ ...formData, receiptDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400" /></div>
                <div><label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Project</label><input type="text" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} placeholder="e.g. Climate Finance Program" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400" /></div>
              </div>
              {/* Receipt / Invoice Upload */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Receipt / Invoice Upload</label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-colors ${isDragging ? "border-purple-400 bg-purple-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = Array.from(e.dataTransfer.files).filter(f =>
                      ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(f.type)
                    );
                    setUploadedFiles(prev => [...prev, ...files]);
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files) {
                        setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                  />
                  <Upload size={20} className={`mx-auto mb-2 ${isDragging ? "text-purple-500" : "text-slate-400"}`} />
                  <p className="text-[12px] text-slate-600">Drag & drop your receipt or invoice here, or <span className="text-purple-700 underline cursor-pointer">browse</span></p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG — Max 10MB per file</p>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {uploadedFiles.map((file, i) => (
                      <div key={`${file.name}-${i}`} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                        <Paperclip size={13} className="text-slate-400" />
                        <span className="text-[12px] text-slate-700 flex-1 truncate">{file.name}</span>
                        <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                        <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="p-0.5 hover:bg-red-50 rounded transition-colors">
                          <X size={12} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => { setShowNewForm(false); setUploadedFiles([]); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => { setShowNewForm(false); setUploadedFiles([]); }} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800">Submit Claim</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}