import { useState } from "react";
import {
  Search,
  Plus,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  DollarSign,
  ArrowLeft,
  Upload,
  Paperclip,
  Trash2,
  Calendar,
  User,
} from "lucide-react";

interface LoanRequestRecord {
  id: string;
  referenceNo: string;
  loanType: string;
  amount: number;
  currency: string;
  purpose: string;
  repaymentPeriod: string;
  monthlyDeduction: number;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Disbursed" | "Fully Repaid";
  submittedOn: string;
  approvedBy: string | null;
  disbursedDate: string | null;
  outstandingBalance: number;
  guarantor: string | null;
  attachments: string[];
  rejectionReason: string | null;
}

const mockLoanRequests: LoanRequestRecord[] = [
  {
    id: "1",
    referenceNo: "LN-2026-001",
    loanType: "Staff Loan",
    amount: 5000,
    currency: "USD",
    purpose: "Housing deposit for new apartment",
    repaymentPeriod: "12 months",
    monthlyDeduction: 416.67,
    requestDate: "Feb 20, 2026",
    status: "Pending",
    submittedOn: "Feb 20, 2026",
    approvedBy: null,
    disbursedDate: null,
    outstandingBalance: 5000,
    guarantor: "Kofi Annan",
    attachments: ["Tenancy_Agreement.pdf"],
    rejectionReason: null,
  },
  {
    id: "2",
    referenceNo: "LN-2026-002",
    loanType: "Emergency Loan",
    amount: 2000,
    currency: "USD",
    purpose: "Medical expenses - surgery",
    repaymentPeriod: "6 months",
    monthlyDeduction: 333.33,
    requestDate: "Feb 10, 2026",
    status: "Approved",
    submittedOn: "Feb 10, 2026",
    approvedBy: "Sarah Johnson",
    disbursedDate: "Feb 14, 2026",
    outstandingBalance: 1666.67,
    guarantor: "Abena Osei",
    attachments: ["Medical_Report.pdf", "Hospital_Invoice.pdf"],
    rejectionReason: null,
  },
  {
    id: "3",
    referenceNo: "LN-2025-018",
    loanType: "Staff Loan",
    amount: 8000,
    currency: "USD",
    purpose: "Vehicle purchase",
    repaymentPeriod: "24 months",
    monthlyDeduction: 333.33,
    requestDate: "Nov 05, 2025",
    status: "Disbursed",
    submittedOn: "Nov 05, 2025",
    approvedBy: "Michael Chen",
    disbursedDate: "Nov 12, 2025",
    outstandingBalance: 6666.67,
    guarantor: "Kwame Nkunim",
    attachments: ["Vehicle_Proforma.pdf"],
    rejectionReason: null,
  },
  {
    id: "4",
    referenceNo: "LN-2025-015",
    loanType: "Education Loan",
    amount: 3500,
    currency: "USD",
    purpose: "Professional certification - PMP training and exam",
    repaymentPeriod: "10 months",
    monthlyDeduction: 350,
    requestDate: "Sep 15, 2025",
    status: "Fully Repaid",
    submittedOn: "Sep 15, 2025",
    approvedBy: "Sarah Johnson",
    disbursedDate: "Sep 22, 2025",
    outstandingBalance: 0,
    guarantor: null,
    attachments: ["PMP_Enrollment.pdf"],
    rejectionReason: null,
  },
  {
    id: "5",
    referenceNo: "LN-2026-003",
    loanType: "Staff Loan",
    amount: 10000,
    currency: "USD",
    purpose: "Home renovation project",
    repaymentPeriod: "18 months",
    monthlyDeduction: 555.56,
    requestDate: "Feb 25, 2026",
    status: "Pending",
    submittedOn: "Feb 25, 2026",
    approvedBy: null,
    disbursedDate: null,
    outstandingBalance: 10000,
    guarantor: "Desmond Tutu",
    attachments: ["Renovation_Estimate.pdf"],
    rejectionReason: null,
  },
  {
    id: "6",
    referenceNo: "LN-2025-012",
    loanType: "Emergency Loan",
    amount: 1500,
    currency: "USD",
    purpose: "Family emergency - funeral expenses",
    repaymentPeriod: "6 months",
    monthlyDeduction: 250,
    requestDate: "Aug 10, 2025",
    status: "Fully Repaid",
    submittedOn: "Aug 10, 2025",
    approvedBy: "Michael Chen",
    disbursedDate: "Aug 12, 2025",
    outstandingBalance: 0,
    guarantor: null,
    attachments: [],
    rejectionReason: null,
  },
  {
    id: "7",
    referenceNo: "LN-2026-004",
    loanType: "Education Loan",
    amount: 6000,
    currency: "USD",
    purpose: "MBA tuition fees - first semester",
    repaymentPeriod: "12 months",
    monthlyDeduction: 500,
    requestDate: "Mar 01, 2026",
    status: "Pending",
    submittedOn: "Mar 01, 2026",
    approvedBy: null,
    disbursedDate: null,
    outstandingBalance: 6000,
    guarantor: "Wangari Maathai",
    attachments: ["University_Admission.pdf", "Fee_Structure.pdf"],
    rejectionReason: null,
  },
  {
    id: "8",
    referenceNo: "LN-2025-020",
    loanType: "Staff Loan",
    amount: 4000,
    currency: "USD",
    purpose: "Relocation expenses",
    repaymentPeriod: "8 months",
    monthlyDeduction: 500,
    requestDate: "Dec 01, 2025",
    status: "Rejected",
    submittedOn: "Dec 01, 2025",
    approvedBy: null,
    disbursedDate: null,
    outstandingBalance: 0,
    guarantor: "Nelly Manu",
    attachments: ["Moving_Quote.pdf"],
    rejectionReason: "Employee has an existing outstanding loan. Please settle current loan before applying for a new one.",
  },
];

const loanTypes = ["All Types", "Staff Loan", "Emergency Loan", "Education Loan"];

function getStatusBadge(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
    case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Rejected": return "bg-red-50 text-red-600 border-red-200";
    case "Disbursed": return "bg-blue-50 text-blue-600 border-blue-200";
    case "Fully Repaid": return "bg-slate-100 text-slate-500 border-slate-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Pending": return <Clock size={13} className="text-amber-500" />;
    case "Approved":
    case "Disbursed": return <CheckCircle2 size={13} className="text-emerald-500" />;
    case "Rejected": return <XCircle size={13} className="text-red-500" />;
    case "Fully Repaid": return <CheckCircle2 size={13} className="text-slate-400" />;
    default: return null;
  }
}

function getLoanTypeBadge(type: string) {
  switch (type) {
    case "Staff Loan": return "bg-blue-50 text-blue-600";
    case "Emergency Loan": return "bg-red-50 text-red-600";
    case "Education Loan": return "bg-purple-50 text-purple-600";
    default: return "bg-slate-50 text-slate-600";
  }
}

export function LoanRequest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [showNewForm, setShowNewForm] = useState(false);
  const [viewItem, setViewItem] = useState<LoanRequestRecord | null>(null);
  const [data, setData] = useState(mockLoanRequests);

  // New request form state
  const [formLoanType, setFormLoanType] = useState("Staff Loan");
  const [formAmount, setFormAmount] = useState("");
  const [formPurpose, setFormPurpose] = useState("");
  const [formRepaymentPeriod, setFormRepaymentPeriod] = useState("6 months");
  const [formGuarantor, setFormGuarantor] = useState("");
  const [formAttachments, setFormAttachments] = useState<File[]>([]);

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.loanType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter;
    const matchesType = typeFilter === "All Types" || item.loanType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = data.filter(d => d.status === "Pending").length;
  const approvedCount = data.filter(d => d.status === "Approved" || d.status === "Disbursed").length;
  const rejectedCount = data.filter(d => d.status === "Rejected").length;
  const totalOutstanding = data.filter(d => d.status !== "Rejected" && d.status !== "Fully Repaid").reduce((sum, d) => sum + d.outstandingBalance, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFormAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const amount = parseFloat(formAmount);
    const months = parseInt(formRepaymentPeriod);
    const newRequest: LoanRequestRecord = {
      id: String(data.length + 1),
      referenceNo: `LN-2026-${String(data.length + 1).padStart(3, "0")}`,
      loanType: formLoanType,
      amount,
      currency: "USD",
      purpose: formPurpose,
      repaymentPeriod: formRepaymentPeriod,
      monthlyDeduction: parseFloat((amount / months).toFixed(2)),
      requestDate: "Mar 01, 2026",
      status: "Pending",
      submittedOn: "Mar 01, 2026",
      approvedBy: null,
      disbursedDate: null,
      outstandingBalance: amount,
      guarantor: formGuarantor || null,
      attachments: formAttachments.map(f => f.name),
      rejectionReason: null,
    };
    setData(prev => [newRequest, ...prev]);
    resetForm();
    setShowNewForm(false);
  };

  const resetForm = () => {
    setFormLoanType("Staff Loan");
    setFormAmount("");
    setFormPurpose("");
    setFormRepaymentPeriod("6 months");
    setFormGuarantor("");
    setFormAttachments([]);
  };

  // View Details modal
  if (viewItem) {
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <button onClick={() => setViewItem(null)} className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 mb-2">
            <ArrowLeft size={15} /> Back to Loan Requests
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Loan Request Details</h1>
              <p className="text-[12px] text-slate-500">{viewItem.referenceNo}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] border ${getStatusBadge(viewItem.status)}`}>
              {getStatusIcon(viewItem.status)}
              {viewItem.status}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Loan Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-[13px] text-slate-900 mb-4 pb-2 border-b border-slate-100">Loan Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Reference No</p>
                  <p className="text-[13px] text-slate-900 font-mono">{viewItem.referenceNo}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Loan Type</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${getLoanTypeBadge(viewItem.loanType)}`}>{viewItem.loanType}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Loan Amount</p>
                  <p className="text-[13px] text-slate-900">${viewItem.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Repayment Period</p>
                  <p className="text-[13px] text-slate-900">{viewItem.repaymentPeriod}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Monthly Deduction</p>
                  <p className="text-[13px] text-slate-900">${viewItem.monthlyDeduction.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
                  <p className={`text-[13px] ${viewItem.outstandingBalance === 0 ? "text-emerald-600" : "text-red-600"}`}>
                    ${viewItem.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Purpose</p>
                  <p className="text-[13px] text-slate-700">{viewItem.purpose}</p>
                </div>
              </div>
            </div>

            {/* Approval & Dates */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-[13px] text-slate-900 mb-4 pb-2 border-b border-slate-100">Timeline & Approval</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Submitted On</p>
                  <p className="text-[13px] text-slate-900">{viewItem.submittedOn}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Approved By</p>
                  <p className="text-[13px] text-slate-900">{viewItem.approvedBy || "--"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Disbursed Date</p>
                  <p className="text-[13px] text-slate-900">{viewItem.disbursedDate || "--"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Guarantor</p>
                  <p className="text-[13px] text-slate-900">{viewItem.guarantor || "Not required"}</p>
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            {viewItem.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <p className="text-[10px] text-red-500 uppercase tracking-wider mb-1">Reason for Rejection</p>
                <p className="text-[13px] text-red-700">{viewItem.rejectionReason}</p>
              </div>
            )}

            {/* Attachments */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-[13px] text-slate-900 mb-4 pb-2 border-b border-slate-100">Attachments</h3>
              {viewItem.attachments.length > 0 ? (
                <div className="space-y-2">
                  {viewItem.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                      <Paperclip size={14} className="text-slate-400" />
                      <span className="text-[12px] text-blue-600">{file}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-slate-400">No attachments</p>
              )}
            </div>

            {/* Repayment info for active loans */}
            {(viewItem.status === "Disbursed" || viewItem.status === "Approved") && viewItem.outstandingBalance > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <p className="text-[11px] text-blue-700">
                  A loan account has been created for this request. Monthly deductions of <span className="font-medium">${viewItem.monthlyDeduction.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> will be automatically applied to your salary until the outstanding balance of <span className="font-medium">${viewItem.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> is fully repaid.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Loan Requests</h1>
            <p className="text-[12px] text-slate-500">Apply for and manage your staff loan requests</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-amber-50 text-amber-600 border-amber-200">{pendingCount} Pending</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-emerald-50 text-emerald-600 border-emerald-200">{approvedCount} Active</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-red-50 text-red-600 border-red-200">{rejectedCount} Rejected</span>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-700 text-white text-[12px] hover:bg-purple-800 transition-colors ml-2"
            >
              <Plus size={14} />
              New Request
            </button>
          </div>
        </div>

        {/* Outstanding summary */}
        <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-purple-600" />
            <span className="text-[12px] text-purple-700">Total Outstanding Loan Balance:</span>
            <span className="text-[14px] text-purple-800">${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by reference, purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
              {loanTypes.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Disbursed</option>
              <option>Rejected</option>
              <option>Fully Repaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="sticky top-0 z-[5]">
              <tr className="bg-blue-600 text-white">
                <th className="text-left px-5 py-3 text-[12px]">Reference No</th>
                <th className="text-left px-5 py-3 text-[12px]">Loan Type</th>
                <th className="text-left px-5 py-3 text-[12px]">Purpose</th>
                <th className="text-right px-5 py-3 text-[12px]">Amount</th>
                <th className="text-left px-5 py-3 text-[12px]">Repayment</th>
                <th className="text-right px-5 py-3 text-[12px]">Monthly Deduction</th>
                <th className="text-right px-5 py-3 text-[12px]">Outstanding</th>
                <th className="text-left px-5 py-3 text-[12px]">Status</th>
                <th className="text-center px-5 py-3 text-[12px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-5 py-3 text-[12px] text-slate-900 font-mono">{item.referenceNo}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] ${getLoanTypeBadge(item.loanType)}`}>{item.loanType}</span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-slate-600 max-w-[200px] truncate">{item.purpose}</td>
                  <td className="px-5 py-3 text-[12px] text-slate-900 text-right font-mono">${item.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[12px] text-slate-500">{item.repaymentPeriod}</td>
                  <td className="px-5 py-3 text-[12px] text-slate-600 text-right font-mono">${item.monthlyDeduction.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3 text-[12px] text-right font-mono">
                    <span className={item.outstandingBalance === 0 ? "text-emerald-600" : "text-red-600"}>
                      ${item.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center">
                      <button onClick={() => setViewItem(item)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="View Details">
                        <Eye size={15} className="text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <p className="text-[13px] text-slate-400">No loan requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Loan Request Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowNewForm(false); resetForm(); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <h3 className="text-[16px] text-slate-900">New Loan Request</h3>
              <button onClick={() => { setShowNewForm(false); resetForm(); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Loan Type */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Loan Type</label>
                <select value={formLoanType} onChange={(e) => setFormLoanType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400">
                  <option>Staff Loan</option>
                  <option>Emergency Loan</option>
                  <option>Education Loan</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Loan Amount (USD)</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Purpose</label>
                <textarea
                  value={formPurpose}
                  onChange={(e) => setFormPurpose(e.target.value)}
                  rows={3}
                  placeholder="Describe the purpose of this loan..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400 resize-none"
                />
              </div>

              {/* Repayment Period */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Repayment Period</label>
                <select value={formRepaymentPeriod} onChange={(e) => setFormRepaymentPeriod(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400">
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>8 months</option>
                  <option>10 months</option>
                  <option>12 months</option>
                  <option>18 months</option>
                  <option>24 months</option>
                </select>
              </div>

              {/* Monthly Deduction Preview */}
              {formAmount && (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                  <p className="text-[11px] text-purple-600 uppercase tracking-wider mb-1">Estimated Monthly Deduction</p>
                  <p className="text-[14px] text-purple-800">
                    ${(parseFloat(formAmount) / parseInt(formRepaymentPeriod)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / month
                  </p>
                </div>
              )}

              {/* Guarantor */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Guarantor (Optional)</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formGuarantor}
                    onChange={(e) => setFormGuarantor(e.target.value)}
                    placeholder="Enter guarantor name"
                    className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Supporting Documents</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-purple-300 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("loan-file-input")?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) setFormAttachments(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}
                >
                  <Upload size={20} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-[12px] text-slate-500">Click or drag files here to upload</p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG up to 10MB each</p>
                </div>
                <input id="loan-file-input" type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                {formAttachments.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {formAttachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Paperclip size={12} className="text-slate-400" />
                          <span className="text-[11px] text-slate-600">{file.name}</span>
                        </div>
                        <button onClick={() => removeFile(i)} className="p-0.5 hover:bg-red-50 rounded">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button onClick={() => { setShowNewForm(false); resetForm(); }} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!formAmount || !formPurpose}
                className="px-5 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanRequest;
