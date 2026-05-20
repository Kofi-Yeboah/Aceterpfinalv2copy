import { useState, useRef } from "react";
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
  Plane,
  Search as SearchIcon,
  ArrowLeft,
  MapPin,
  Paperclip,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface TravelRequestData {
  id: string;
  referenceNo: string;
  destination: string;
  purpose: string;
  departureDate: string;
  returnDate: string;
  estimatedCost: number;
  currency: string;
  requestDate: string;
  status: "Pending" | "In Review" | "Approved" | "Rejected";
  requestedBy: string;
  justification: string;
  travelMode: string;
  accommodationType: string;
}

const mockRequests: TravelRequestData[] = [
  {
    id: "1", referenceNo: "TR-2026-0031", destination: "Accra, Ghana", purpose: "Regional Conference on Climate Change",
    departureDate: "Mar 10, 2026", returnDate: "Mar 15, 2026", estimatedCost: 2500, currency: "GHS", requestDate: "Feb 20, 2026",
    status: "Approved", requestedBy: "Kofi Mensah", justification: "Mandatory attendance as ACET representative for West Africa climate policy discussions.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
  {
    id: "2", referenceNo: "TR-2026-0028", destination: "Lagos, Nigeria", purpose: "Field Research and Data Collection",
    departureDate: "Mar 05, 2026", returnDate: "Mar 12, 2026", estimatedCost: 1800, currency: "GHS", requestDate: "Feb 22, 2026",
    status: "Pending", requestedBy: "Abena Owusu", justification: "Data collection visits to 5 partner organizations for the West Africa Regional Integration Study.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
  {
    id: "3", referenceNo: "TR-2026-0025", destination: "Nairobi, Kenya", purpose: "Stakeholder Engagement Meeting",
    departureDate: "Mar 20, 2026", returnDate: "Mar 23, 2026", estimatedCost: 3200, currency: "GHS", requestDate: "Feb 18, 2026",
    status: "In Review", requestedBy: "Richard Antwi", justification: "Meeting with East African development partners for potential collaboration on renewable energy framework.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
  {
    id: "4", referenceNo: "TR-2026-0022", destination: "Abidjan, Côte d'Ivoire", purpose: "Project Monitoring and Evaluation",
    departureDate: "Feb 28, 2026", returnDate: "Mar 02, 2026", estimatedCost: 2100, currency: "GHS", requestDate: "Feb 15, 2026",
    status: "Approved", requestedBy: "Mercy Adjei", justification: "Quarterly M&E visit to Abidjan field office for project progress assessment.",
    travelMode: "Flight", accommodationType: "Guest House",
  },
  {
    id: "5", referenceNo: "TR-2026-0019", destination: "Dakar, Senegal", purpose: "Training Workshop on Data Analysis",
    departureDate: "Mar 15, 2026", returnDate: "Mar 20, 2026", estimatedCost: 2800, currency: "GHS", requestDate: "Feb 25, 2026",
    status: "Pending", requestedBy: "Nana Yaw", justification: "Capacity building workshop organized by UNDP on advanced data analysis for development practitioners.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
  {
    id: "6", referenceNo: "TR-2026-0016", destination: "Addis Ababa, Ethiopia", purpose: "Policy Dialogue Session",
    departureDate: "Mar 01, 2026", returnDate: "Mar 05, 2026", estimatedCost: 4500, currency: "GHS", requestDate: "Feb 10, 2026",
    status: "Rejected", requestedBy: "Kwame Asante", justification: "AU Policy Dialogue on digital transformation. Request rejected due to budget constraints — virtual attendance approved instead.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Clock size={12} /> },
  "In Review": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: <SearchIcon size={12} /> },
  Approved: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <CheckCircle2 size={12} /> },
  Rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <XCircle size={12} /> },
};

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function TravelRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [viewDetail, setViewDetail] = useState<TravelRequestData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    staffName: "Ebenezer Adams",
    supervisor: "",
    travelType: "",
    departingFrom: "",
    travelDate: "",
    travelTimeHour: "00",
    travelTimeMinute: "00",
    destination: "",
    returnDate: "",
    returnTimeHour: "00",
    returnTimeMinute: "00",
    project: "",
    reasonForTravel: "",
    hotelRequired: true,
    shuttleRequired: true,
    perDiemRequired: true,
    specialRequirements: false,
    requestingOnBehalf: true,
    userOnBehalf: "",
  });
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const todayDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  const filtered = mockRequests.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || req.referenceNo.toLowerCase().includes(q) || req.destination.toLowerCase().includes(q) || req.purpose.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Travel Request</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200"><Clock size={12} />{mockRequests.filter((r) => r.status === "Pending").length} Pending</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] border border-blue-200"><Plane size={12} />{mockRequests.length} Total Trips</span>
        </div>
        <button onClick={() => setShowNewForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors"><Plus size={14} />New Request</button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input type="text" placeholder="Search by reference, destination, purpose..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400" />
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
                {["All", "Pending", "In Review", "Approved", "Rejected"].map((s) => (
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
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Destination</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Purpose</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Departure</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Return</th>
              <th className="text-right px-6 py-3 text-[12px] text-white font-semibold">Est. Cost (GHS)</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Request Date</th>
              <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-16"><FileText size={40} className="text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400">No travel requests found</p></td></tr>
            ) : (
              filtered.map((req, idx) => {
                const sc = statusConfig[req.status];
                return (
                  <tr key={req.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] text-blue-700">{req.referenceNo}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900">{req.destination}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-600 max-w-[240px] truncate">{req.purpose}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.departureDate}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.returnDate}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 text-right">{req.estimatedCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
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
                    <p className="text-[11px] text-slate-400">Travel Request Details</p>
                  </div>
                </div>
                <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
              <div className="p-6 space-y-5">
                {/* Destination highlight */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><MapPin size={18} className="text-blue-600" /></div>
                  <div>
                    <p className="text-[14px] text-slate-900">{viewDetail.destination}</p>
                    <p className="text-[11px] text-slate-500">{viewDetail.departureDate} — {viewDetail.returnDate}</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Trip Details</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailField label="Purpose" value={viewDetail.purpose} />
                    <DetailField label="Travel Mode" value={viewDetail.travelMode} />
                    <DetailField label="Accommodation" value={viewDetail.accommodationType} />
                    <DetailField label="Estimated Cost" value={`GHS ${viewDetail.estimatedCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
                    <DetailField label="Requested By" value={viewDetail.requestedBy} />
                    <DetailField label="Request Date" value={viewDetail.requestDate} />
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
                    {viewDetail.status === "In Review" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><SearchIcon size={12} className="text-blue-600" /></div>
                        <div><p className="text-[12px] text-slate-900">Under review</p><p className="text-[10px] text-slate-400">Request is being reviewed by the approving manager</p></div>
                      </div>
                    )}
                    {viewDetail.status === "Approved" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 size={12} className="text-emerald-600" /></div>
                        <div><p className="text-[12px] text-slate-900">Request approved</p><p className="text-[10px] text-slate-400">Travel arrangements can proceed</p></div>
                      </div>
                    )}
                    {viewDetail.status === "Rejected" && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0"><XCircle size={12} className="text-red-600" /></div>
                        <div><p className="text-[12px] text-slate-900">Request rejected</p><p className="text-[10px] text-slate-400">Budget constraints — virtual attendance approved instead</p></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* New Request Full-Page Form */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
          {/* Dark blue header bar */}
          <div className="bg-[#2c3e6b] px-6 py-4 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#3d5a99] flex items-center justify-center">
              <Plane size={16} className="text-white" />
            </div>
            <span className="text-white text-lg font-medium">Travel Request</span>
            <span className="text-slate-300 text-lg mx-1">&rarr;</span>
            <span className="text-white text-lg">New</span>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-48 bg-slate-50 border-r border-slate-200 py-4 shrink-0">
              <button
                onClick={() => setShowNewForm(false)}
                className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                My Travel Requests
              </button>
              <button
                className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                All Travel Requests
              </button>
            </div>

            {/* Form Area */}
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-3xl space-y-6">
                {/* Row: Staff Name / Today's Date */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <span className="text-red-500">*</span> Staff Name
                    </label>
                    <input
                      type="text"
                      value={formData.staffName}
                      readOnly
                      className="w-full border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Today's Date</label>
                    <p className="px-3 py-2.5 text-sm text-slate-700">{todayDate}</p>
                  </div>
                </div>

                {/* Row: Supervisor / Travel Type */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Supervisor</label>
                    <div className="relative">
                      <select
                        value={formData.supervisor}
                        onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-600 bg-white appearance-none pr-10"
                      >
                        <option value="">Find items</option>
                        <option value="Ama Darko">Ama Darko</option>
                        <option value="Kwame Asante">Kwame Asante</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-[#4a6fa5] rounded-sm pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Travel Type</label>
                    <div className="relative">
                      <select
                        value={formData.travelType}
                        onChange={(e) => setFormData({ ...formData, travelType: e.target.value })}
                        className="w-full border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-600 bg-white appearance-none pr-10"
                      >
                        <option value="">Find items</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                        <option value="Regional">Regional</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-[#4a6fa5] rounded-sm pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row: Departing From / Travel Date + Time */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <span className="text-red-500">*</span> Departing From
                    </label>
                    <input
                      type="text"
                      value={formData.departingFrom}
                      onChange={(e) => setFormData({ ...formData, departingFrom: e.target.value })}
                      className="w-full border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-900 bg-white outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <span className="text-red-500">*</span> Travel Date
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={formData.travelDate}
                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                        className="flex-1 border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-900 bg-white outline-none focus:border-blue-400"
                      />
                      <select value={formData.travelTimeHour} onChange={(e) => setFormData({ ...formData, travelTimeHour: e.target.value })} className="w-16 border-2 border-slate-300 rounded px-2 py-2.5 text-sm bg-white">
                        {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span className="text-slate-500 font-bold">:</span>
                      <select value={formData.travelTimeMinute} onChange={(e) => setFormData({ ...formData, travelTimeMinute: e.target.value })} className="w-16 border-2 border-slate-300 rounded px-2 py-2.5 text-sm bg-white">
                        {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row: Destination / Return Date + Time */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <span className="text-red-500">*</span> Destination
                    </label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-900 bg-white outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <span className="text-red-500">*</span> Return Date
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        className="flex-1 border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-900 bg-white outline-none focus:border-blue-400"
                      />
                      <select value={formData.returnTimeHour} onChange={(e) => setFormData({ ...formData, returnTimeHour: e.target.value })} className="w-16 border-2 border-slate-300 rounded px-2 py-2.5 text-sm bg-white">
                        {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span className="text-slate-500 font-bold">:</span>
                      <select value={formData.returnTimeMinute} onChange={(e) => setFormData({ ...formData, returnTimeMinute: e.target.value })} className="w-16 border-2 border-slate-300 rounded px-2 py-2.5 text-sm bg-white">
                        {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row: Project / Reason For Travel */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <span className="text-red-500">*</span> Project
                    </label>
                    <input
                      type="text"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-900 bg-white outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <span className="text-red-500">*</span> Reason For Travel
                    </label>
                    <textarea
                      value={formData.reasonForTravel}
                      onChange={(e) => setFormData({ ...formData, reasonForTravel: e.target.value })}
                      rows={4}
                      className="w-full border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-900 bg-white outline-none focus:border-blue-400 resize-none"
                    />
                  </div>
                </div>

                {/* Toggle Switches - 2 column grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Hotel Accomodation Required?</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.hotelRequired} onCheckedChange={(v) => setFormData({ ...formData, hotelRequired: v })} />
                      <span className="text-sm text-slate-600">{formData.hotelRequired ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Hotel/Airport Shuttle Required?</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.shuttleRequired} onCheckedChange={(v) => setFormData({ ...formData, shuttleRequired: v })} />
                      <span className="text-sm text-slate-600">{formData.shuttleRequired ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Per Diem Required?</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.perDiemRequired} onCheckedChange={(v) => setFormData({ ...formData, perDiemRequired: v })} />
                      <span className="text-sm text-slate-600">{formData.perDiemRequired ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Special Requirements?</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.specialRequirements} onCheckedChange={(v) => setFormData({ ...formData, specialRequirements: v })} />
                      <span className="text-sm text-slate-600">{formData.specialRequirements ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Requesting on behalf</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.requestingOnBehalf} onCheckedChange={(v) => setFormData({ ...formData, requestingOnBehalf: v })} />
                      <span className="text-sm text-slate-600">{formData.requestingOnBehalf ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  {formData.requestingOnBehalf && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-1.5 block">User on behalf</label>
                      <div className="relative">
                        <select
                          value={formData.userOnBehalf}
                          onChange={(e) => setFormData({ ...formData, userOnBehalf: e.target.value })}
                          className="w-full border-2 border-slate-300 rounded px-3 py-2.5 text-sm text-slate-600 bg-white appearance-none pr-10"
                        >
                          <option value="">Find items</option>
                          <option value="Kofi Mensah">Kofi Mensah</option>
                          <option value="Abena Owusu">Abena Owusu</option>
                          <option value="Richard Antwi">Richard Antwi</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-[#4a6fa5] rounded-sm pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Attachments</label>
                  <div className="border-2 border-slate-300 rounded p-4">
                    {uploadedFiles.length === 0 ? (
                      <p className="text-sm text-slate-400 mb-2">There is nothing attached.</p>
                    ) : (
                      <div className="space-y-2 mb-2">
                        {uploadedFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                            <Paperclip size={14} className="text-slate-400" />
                            <span className="flex-1 truncate">{file.name}</span>
                            <button onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                      <Paperclip size={14} /> Attach file
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-center pt-2 pb-6">
                  <button
                    onClick={() => setShowNewForm(false)}
                    className="px-16 py-2.5 bg-slate-200 text-slate-600 text-sm hover:bg-slate-300 transition-colors rounded"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
