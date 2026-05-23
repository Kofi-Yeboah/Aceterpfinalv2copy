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
import { Switch } from "./ui/switch";

interface TravelRequestData {
  id: string;
  referenceNo: string;
  destination: string;
  departingFrom: string;
  travelType: string;
  project: string;
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
    id: "1", referenceNo: "TR-2026-0031", destination: "Accra, Ghana", departingFrom: "Accra, Ghana", travelType: "Domestic", project: "West Africa Climate Policy",
    purpose: "Regional Conference on Climate Change", departureDate: "Mar 10, 2026", returnDate: "Mar 15, 2026", estimatedCost: 2500, currency: "GHS", requestDate: "Feb 20, 2026",
    status: "Approved", requestedBy: "Kofi Mensah", justification: "Mandatory attendance as ACET representative for West Africa climate policy discussions.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
  {
    id: "2", referenceNo: "TR-2026-0028", destination: "Lagos, Nigeria", departingFrom: "Accra, Ghana", travelType: "International", project: "West Africa Regional Integration Study",
    purpose: "Field Research and Data Collection", departureDate: "Mar 05, 2026", returnDate: "Mar 12, 2026", estimatedCost: 1800, currency: "GHS", requestDate: "Feb 22, 2026",
    status: "Pending", requestedBy: "Abena Owusu", justification: "Data collection visits to 5 partner organizations for the West Africa Regional Integration Study.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
  {
    id: "3", referenceNo: "TR-2026-0025", destination: "Nairobi, Kenya", departingFrom: "Accra, Ghana", travelType: "International", project: "East Africa Energy Partnership",
    purpose: "Stakeholder Engagement Meeting", departureDate: "Mar 20, 2026", returnDate: "Mar 23, 2026", estimatedCost: 3200, currency: "GHS", requestDate: "Feb 18, 2026",
    status: "In Review", requestedBy: "Richard Antwi", justification: "Meeting with East African development partners for potential collaboration on renewable energy framework.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
  {
    id: "4", referenceNo: "TR-2026-0022", destination: "Abidjan, Côte d'Ivoire", departingFrom: "Accra, Ghana", travelType: "Regional", project: "Field Office Monitoring",
    purpose: "Project Monitoring and Evaluation", departureDate: "Feb 28, 2026", returnDate: "Mar 02, 2026", estimatedCost: 2100, currency: "GHS", requestDate: "Feb 15, 2026",
    status: "Approved", requestedBy: "Mercy Adjei", justification: "Quarterly M&E visit to Abidjan field office for project progress assessment.",
    travelMode: "Flight", accommodationType: "Guest House",
  },
  {
    id: "5", referenceNo: "TR-2026-0019", destination: "Dakar, Senegal", departingFrom: "Accra, Ghana", travelType: "International", project: "Capacity Building Programme",
    purpose: "Training Workshop on Data Analysis", departureDate: "Mar 15, 2026", returnDate: "Mar 20, 2026", estimatedCost: 2800, currency: "GHS", requestDate: "Feb 25, 2026",
    status: "Pending", requestedBy: "Nana Yaw", justification: "Capacity building workshop organized by UNDP on advanced data analysis for development practitioners.",
    travelMode: "Flight", accommodationType: "Hotel",
  },
  {
    id: "6", referenceNo: "TR-2026-0016", destination: "Addis Ababa, Ethiopia", departingFrom: "Accra, Ghana", travelType: "International", project: "AU Digital Transformation",
    purpose: "Policy Dialogue Session", departureDate: "Mar 01, 2026", returnDate: "Mar 05, 2026", estimatedCost: 4500, currency: "GHS", requestDate: "Feb 10, 2026",
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
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Departing From</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Travel Date</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Return Date</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Travel Type</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Project</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
              <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Request Date</th>
              <th className="text-center px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-16"><FileText size={40} className="text-slate-200 mx-auto mb-3" /><p className="text-[13px] text-slate-400">No travel requests found</p></td></tr>
            ) : (
              filtered.map((req, idx) => {
                const sc = statusConfig[req.status];
                return (
                  <tr key={req.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] text-blue-700">{req.referenceNo}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900">{req.destination}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.departingFrom}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.departureDate}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{req.returnDate}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-600">{req.travelType}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-600 max-w-[180px] truncate">{req.project}</td>
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

      {/* New Travel Request Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-[680px] max-h-[85vh] overflow-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900">New Travel Request</h2>
              <button onClick={() => setShowNewForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Trip Information */}
              <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Trip Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Staff Name</label>
                  <input type="text" value={formData.staffName} readOnly className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-slate-50 text-slate-500 cursor-default" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Today's Date</label>
                  <p className="px-3 py-2 text-[13px] text-slate-600">{todayDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Supervisor</label>
                  <select value={formData.supervisor} onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option value="">Select...</option>
                    <option>Ama Darko</option><option>Kwame Asante</option><option>Abena Owusu</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Travel Type</label>
                  <select value={formData.travelType} onChange={(e) => setFormData({ ...formData, travelType: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                    <option value="">Select...</option>
                    <option>Domestic</option><option>International</option><option>Regional</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Departing From <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.departingFrom} onChange={(e) => setFormData({ ...formData, departingFrom: e.target.value })} placeholder="e.g. Accra, Ghana" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Destination <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} placeholder="e.g. Nairobi, Kenya" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Travel Date <span className="text-red-400">*</span></label>
                  <input type="date" value={formData.travelDate} onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Return Date <span className="text-red-400">*</span></label>
                  <input type="date" value={formData.returnDate} onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Project <span className="text-red-400">*</span></label>
                <input type="text" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} placeholder="Enter project name" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Reason For Travel <span className="text-red-400">*</span></label>
                <textarea value={formData.reasonForTravel} onChange={(e) => setFormData({ ...formData, reasonForTravel: e.target.value })} rows={3} placeholder="Describe the purpose of this trip..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] resize-none" />
              </div>

              <hr className="border-slate-100" />

              {/* Requirements */}
              <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Requirements</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-700">Hotel Accommodation Required?</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.hotelRequired} onCheckedChange={(v: boolean) => setFormData({ ...formData, hotelRequired: v })} />
                    <span className="text-[12px] text-slate-500 w-6">{formData.hotelRequired ? "Yes" : "No"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-700">Hotel/Airport Shuttle Required?</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.shuttleRequired} onCheckedChange={(v: boolean) => setFormData({ ...formData, shuttleRequired: v })} />
                    <span className="text-[12px] text-slate-500 w-6">{formData.shuttleRequired ? "Yes" : "No"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-700">Per Diem Required?</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.perDiemRequired} onCheckedChange={(v: boolean) => setFormData({ ...formData, perDiemRequired: v })} />
                    <span className="text-[12px] text-slate-500 w-6">{formData.perDiemRequired ? "Yes" : "No"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-700">Special Requirements?</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.specialRequirements} onCheckedChange={(v: boolean) => setFormData({ ...formData, specialRequirements: v })} />
                    <span className="text-[12px] text-slate-500 w-6">{formData.specialRequirements ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-700">Requesting on Behalf</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.requestingOnBehalf} onCheckedChange={(v: boolean) => setFormData({ ...formData, requestingOnBehalf: v })} />
                    <span className="text-[12px] text-slate-500 w-6">{formData.requestingOnBehalf ? "Yes" : "No"}</span>
                  </div>
                </div>
                {formData.requestingOnBehalf && (
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-1">User on Behalf</label>
                    <select value={formData.userOnBehalf} onChange={(e) => setFormData({ ...formData, userOnBehalf: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px]">
                      <option value="">Select...</option>
                      <option>Kofi Mensah</option><option>Abena Owusu</option><option>Richard Antwi</option>
                    </select>
                  </div>
                )}
              </div>

              <hr className="border-slate-100" />

              {/* Attachments */}
              <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Attachments</p>
              <div className="border border-slate-200 rounded-lg p-4">
                {uploadedFiles.length === 0 ? (
                  <p className="text-[12px] text-slate-400 mb-2">There is nothing attached.</p>
                ) : (
                  <div className="space-y-1.5 mb-2">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] text-slate-700">
                        <Paperclip size={12} className="text-slate-400" />
                        <span className="flex-1 truncate">{file.name}</span>
                        <button onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700">
                  <Paperclip size={13} /> Attach file
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowNewForm(false)} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</button>
              <button onClick={() => setShowNewForm(false)} className="px-4 py-2 rounded-lg text-[13px] text-white hover:opacity-90" style={{ backgroundColor: "#0B01D0" }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
