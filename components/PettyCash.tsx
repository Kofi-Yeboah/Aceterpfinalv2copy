import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  X,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  DollarSign,
  ArrowLeft,
  Upload,
  Paperclip,
} from "lucide-react";

interface PettyCashRequest {
  id: string;
  referenceNo: string;
  purpose: string;
  amount: number;
  currency: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Disbursed" | "Rejected" | "Retired";
  category: string;
  approvedBy: string | null;
  retirementDue: string | null;
  requestedBy: string;
  notes: string;
}

const mockRequests: PettyCashRequest[] = [
  {
    id: "1",
    referenceNo: "PC-2026-0041",
    purpose: "Office stationery and printing supplies",
    amount: 250.0,
    currency: "GHS",
    requestDate: "Feb 25, 2026",
    status: "Pending",
    category: "Office Supplies",
    approvedBy: null,
    retirementDue: null,
    requestedBy: "Kofi Mensah",
    notes: "Needed urgently for upcoming board meeting preparation.",
  },
  {
    id: "2",
    referenceNo: "PC-2026-0038",
    purpose: "Staff meeting refreshments",
    amount: 180.0,
    currency: "GHS",
    requestDate: "Feb 20, 2026",
    status: "Approved",
    category: "Meals & Refreshments",
    approvedBy: "Ama Darko",
    retirementDue: "Mar 06, 2026",
    requestedBy: "Abena Owusu",
    notes: "Monthly all-hands meeting refreshments for 25 staff.",
  },
  {
    id: "3",
    referenceNo: "PC-2026-0035",
    purpose: "Courier service for document delivery",
    amount: 120.0,
    currency: "GHS",
    requestDate: "Feb 17, 2026",
    status: "Disbursed",
    category: "Logistics",
    approvedBy: "Ama Darko",
    retirementDue: "Mar 03, 2026",
    requestedBy: "Richard Antwi",
    notes: "Urgent document delivery to Kumasi regional office.",
  },
  {
    id: "4",
    referenceNo: "PC-2026-0032",
    purpose: "Emergency plumbing repair materials",
    amount: 450.0,
    currency: "GHS",
    requestDate: "Feb 14, 2026",
    status: "Retired",
    category: "Maintenance",
    approvedBy: "Kwame Asante",
    retirementDue: null,
    requestedBy: "Nana Yaw",
    notes: "Plumbing issue in the ground floor washroom. Retired with receipts attached.",
  },
  {
    id: "5",
    referenceNo: "PC-2026-0029",
    purpose: "Fuel for generator during power outage",
    amount: 300.0,
    currency: "GHS",
    requestDate: "Feb 10, 2026",
    status: "Retired",
    category: "Utilities",
    approvedBy: "Kwame Asante",
    retirementDue: null,
    requestedBy: "Richard Antwi",
    notes: "Extended power outage required generator operation for 2 days.",
  },
  {
    id: "6",
    referenceNo: "PC-2026-0026",
    purpose: "Transport for field visit to Kumasi office",
    amount: 200.0,
    currency: "GHS",
    requestDate: "Feb 06, 2026",
    status: "Rejected",
    category: "Transport",
    approvedBy: null,
    retirementDue: null,
    requestedBy: "Mercy Adjei",
    notes: "Rejected — use official vehicle instead.",
  },
  {
    id: "7",
    referenceNo: "PC-2026-0023",
    purpose: "Kitchen supplies for office pantry",
    amount: 95.0,
    currency: "GHS",
    requestDate: "Feb 03, 2026",
    status: "Retired",
    category: "Office Supplies",
    approvedBy: "Ama Darko",
    retirementDue: null,
    requestedBy: "Abena Owusu",
    notes: "Monthly restocking of kitchen essentials.",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Clock size={12} /> },
  Approved: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: <CheckCircle2 size={12} /> },
  Disbursed: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <DollarSign size={12} /> },
  Retired: { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", icon: <CheckCircle2 size={12} /> },
  Rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <XCircle size={12} /> },
};

const categories = ["All", "Office Supplies", "Meals & Refreshments", "Logistics", "Maintenance", "Utilities", "Transport"];

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function PettyCash() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [viewDetail, setViewDetail] = useState<PettyCashRequest | null>(null);
  const [formData, setFormData] = useState({
    purpose: "",
    amount: "",
    category: categories[1],
  });
  const [pcUploadedFiles, setPcUploadedFiles] = useState<File[]>([]);
  const [pcIsDragging, setPcIsDragging] = useState(false);

  const filtered = mockRequests.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      req.referenceNo.toLowerCase().includes(q) ||
      req.purpose.toLowerCase().includes(q) ||
      req.category.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Petty Cash</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200">
            <Wallet size={12} />
            {mockRequests.filter((r) => r.status === "Pending").length} Pending
          </span>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors"
        >
          <Plus size={14} />
          New Request
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by reference, purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={13} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-[12px] transition-colors ${
              statusFilter !== "All"
                ? "border-purple-300 bg-purple-50 text-purple-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter size={13} />
            {statusFilter === "All" ? "All Status" : statusFilter}
            <ChevronDown size={11} />
          </button>
          {showStatusDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2">
                {["All", "Pending", "Approved", "Disbursed", "Retired", "Rejected"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors flex items-center justify-between ${
                      statusFilter === s ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {s === "All" ? "All Status" : s}
                    {statusFilter === s && <CheckCircle2 size={13} className="text-purple-600" />}
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
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Purpose</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Category</th>
              <th className="text-right px-6 py-3 text-[12px] text-white font-semibold">Amount (GHS)</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Request Date</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Retirement Due</th>
              <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16">
                  <FileText size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No petty cash requests found</p>
                </td>
              </tr>
            ) : (
              filtered.map((req, idx) => {
                const sc = statusConfig[req.status];
                return (
                  <tr key={req.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] text-blue-700">{req.referenceNo}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-700 max-w-[260px] truncate">{req.purpose}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-600">{req.category}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 text-right">{req.amount.toFixed(2)}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.requestDate}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>
                        {sc.icon}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.retirementDue || "—"}</td>
                    <td className="px-6 py-3 text-center">
                      <button onClick={() => setViewDetail(req)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye size={14} className="text-slate-400" />
                      </button>
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
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setViewDetail(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-auto">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft size={16} className="text-slate-500" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] text-slate-900">{viewDetail.referenceNo}</h2>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>
                        {sc.icon}
                        {viewDetail.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Petty Cash Request Details</p>
                  </div>
                </div>
                <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Request Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailField label="Category" value={viewDetail.category} />
                    <DetailField label="Amount" value={`GHS ${viewDetail.amount.toFixed(2)}`} />
                    <DetailField label="Request Date" value={viewDetail.requestDate} />
                    <DetailField label="Requested By" value={viewDetail.requestedBy} />
                    <DetailField label="Approved By" value={viewDetail.approvedBy || "—"} />
                    <DetailField label="Retirement Due" value={viewDetail.retirementDue || "—"} />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Purpose</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{viewDetail.purpose}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Notes</p>
                  <p className="text-[13px] text-slate-700 leading-relaxed">{viewDetail.notes}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Activity</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><FileText size={12} className="text-blue-600" /></div>
                      <div>
                        <p className="text-[12px] text-slate-900">Request submitted</p>
                        <p className="text-[10px] text-slate-400">{viewDetail.requestDate} by {viewDetail.requestedBy}</p>
                      </div>
                    </div>
                    {viewDetail.approvedBy && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 size={12} className="text-emerald-600" /></div>
                        <div>
                          <p className="text-[12px] text-slate-900">Request approved</p>
                          <p className="text-[10px] text-slate-400">Approved by {viewDetail.approvedBy}</p>
                        </div>
                      </div>
                    )}
                    {viewDetail.status === "Disbursed" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><DollarSign size={12} className="text-emerald-600" /></div>
                        <div>
                          <p className="text-[12px] text-slate-900">Funds disbursed</p>
                          <p className="text-[10px] text-slate-400">GHS {viewDetail.amount.toFixed(2)} released to {viewDetail.requestedBy}</p>
                        </div>
                      </div>
                    )}
                    {viewDetail.status === "Retired" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0"><CheckCircle2 size={12} className="text-slate-600" /></div>
                        <div>
                          <p className="text-[12px] text-slate-900">Request retired</p>
                          <p className="text-[10px] text-slate-400">Receipts submitted and verified</p>
                        </div>
                      </div>
                    )}
                    {viewDetail.status === "Rejected" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0"><XCircle size={12} className="text-red-600" /></div>
                        <div>
                          <p className="text-[12px] text-slate-900">Request rejected</p>
                          <p className="text-[10px] text-slate-400">Use official vehicle instead</p>
                        </div>
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
              <h2 className="text-[15px] text-slate-900">New Petty Cash Request</h2>
              <button onClick={() => setShowNewForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Purpose</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Describe the purpose of this request"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Amount (GHS)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 bg-white"
                  >
                    {categories.slice(1).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Invoice Upload */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">Invoice Upload</label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-colors ${pcIsDragging ? "border-purple-400 bg-purple-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                  onDragOver={(e) => { e.preventDefault(); setPcIsDragging(true); }}
                  onDragLeave={() => setPcIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setPcIsDragging(false);
                    const files = Array.from(e.dataTransfer.files).filter(f =>
                      ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(f.type)
                    );
                    setPcUploadedFiles(prev => [...prev, ...files]);
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files) {
                        setPcUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                  />
                  <Upload size={20} className={`mx-auto mb-2 ${pcIsDragging ? "text-purple-500" : "text-slate-400"}`} />
                  <p className="text-[12px] text-slate-600">Drag & drop your invoice here, or <span className="text-purple-700 underline cursor-pointer">browse</span></p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG — Max 10MB per file</p>
                </div>
                {pcUploadedFiles.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {pcUploadedFiles.map((file, i) => (
                      <div key={`${file.name}-${i}`} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                        <Paperclip size={13} className="text-slate-400" />
                        <span className="text-[12px] text-slate-700 flex-1 truncate">{file.name}</span>
                        <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                        <button onClick={() => setPcUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="p-0.5 hover:bg-red-50 rounded transition-colors">
                          <X size={12} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => { setShowNewForm(false); setPcUploadedFiles([]); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => { setShowNewForm(false); setPcUploadedFiles([]); }} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800">Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}