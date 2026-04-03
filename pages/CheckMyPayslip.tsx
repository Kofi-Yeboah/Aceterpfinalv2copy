import { useState } from "react";
import {
  Search,
  Download,
  Filter,
  ChevronDown,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  DollarSign,
  Eye,
  ArrowLeft,
  Banknote,
} from "lucide-react";

interface PayslipRecord {
  id: string;
  period: string;
  payDate: string;
  grossPay: number;
  netPay: number;
  deductions: number;
  allowances: number;
  status: "Pending" | "Unpaid" | "Payslip";
}

const mockPayslips: PayslipRecord[] = [
  { id: "1", period: "07-2025", payDate: "Jul 12, 2025", grossPay: 17500, netPay: 15000, deductions: 3500, allowances: 1000, status: "Pending" },
  { id: "2", period: "06-2025", payDate: "Jun 07, 2025", grossPay: 17500, netPay: 15000, deductions: 3500, allowances: 1000, status: "Unpaid" },
  { id: "3", period: "05-2025", payDate: "May 23, 2025", grossPay: 17500, netPay: 15000, deductions: 3500, allowances: 1000, status: "Payslip" },
  { id: "4", period: "04-2025", payDate: "Apr 18, 2025", grossPay: 17500, netPay: 15000, deductions: 3500, allowances: 1000, status: "Payslip" },
  { id: "5", period: "03-2025", payDate: "Mar 30, 2025", grossPay: 17500, netPay: 15000, deductions: 3500, allowances: 1000, status: "Payslip" },
  { id: "6", period: "02-2025", payDate: "Feb 18, 2025", grossPay: 15000, netPay: 12500, deductions: 3500, allowances: 1000, status: "Payslip" },
  { id: "7", period: "01-2025", payDate: "Jan 05, 2025", grossPay: 15000, netPay: 12500, deductions: 3500, allowances: 1000, status: "Payslip" },
  { id: "8", period: "12-2024", payDate: "Dec 20, 2024", grossPay: 15000, netPay: 12500, deductions: 3500, allowances: 1000, status: "Payslip" },
  { id: "9", period: "11-2024", payDate: "Nov 18, 2024", grossPay: 15000, netPay: 12500, deductions: 3500, allowances: 1000, status: "Payslip" },
  { id: "10", period: "10-2024", payDate: "Oct 22, 2024", grossPay: 15000, netPay: 12500, deductions: 3500, allowances: 1000, status: "Payslip" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Clock size={12} /> },
  Unpaid: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <XCircle size={12} /> },
  Payslip: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <CheckCircle2 size={12} /> },
};

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] text-slate-900">{value || "—"}</p>
    </div>
  );
}

export function CheckMyPayslip() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [viewDetail, setViewDetail] = useState<PayslipRecord | null>(null);

  const filtered = mockPayslips.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.period.toLowerCase().includes(q) || p.payDate.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Check My Payslip</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] border border-amber-200">
            <Clock size={12} />
            {mockPayslips.filter((r) => r.status === "Pending").length} Pending
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] border border-emerald-200">
            <Banknote size={12} />
            {mockPayslips.length} Total
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 px-3.5 py-2 border border-slate-200 rounded-lg bg-white w-72">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by period, pay date..."
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
                {["All", "Pending", "Unpaid", "Payslip"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}
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
          <thead className="sticky top-0 z-[5]">
            <tr className="bg-blue-600 text-white">
              <th className="text-left px-6 py-3 text-[12px]">Period</th>
              <th className="text-left px-6 py-3 text-[12px]">Pay Date</th>
              <th className="text-right px-6 py-3 text-[12px]">Gross Pay (GHS)</th>
              <th className="text-right px-6 py-3 text-[12px]">Net Pay (GHS)</th>
              <th className="text-right px-6 py-3 text-[12px]">Deductions</th>
              <th className="text-right px-6 py-3 text-[12px]">Allowances</th>
              <th className="text-left px-6 py-3 text-[12px]">Status</th>
              <th className="text-center px-6 py-3 text-[12px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16">
                  <FileText size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No payslips found</p>
                </td>
              </tr>
            ) : (
              filtered.map((p, idx) => {
                const sc = statusConfig[p.status];
                return (
                  <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-3 text-[12px] text-blue-700">{p.period}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500">{p.payDate}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 text-right">{p.grossPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-900 text-right">{p.netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500 text-right">{p.deductions.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-[12px] text-slate-500 text-right">{p.allowances.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>
                        {sc.icon}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setViewDetail(p)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                          <Eye size={14} className="text-slate-400" />
                        </button>
                        {p.status === "Payslip" && (
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                            <Download size={14} className="text-slate-400" />
                          </button>
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
                      <h2 className="text-[15px] text-slate-900">Payslip — {viewDetail.period}</h2>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.bg} ${sc.text}`}>
                        {sc.icon}
                        {viewDetail.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Payslip Details</p>
                  </div>
                </div>
                <button onClick={() => setViewDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Pay Summary</p>
                  <div className="grid grid-cols-3 gap-4">
                    <DetailField label="Period" value={viewDetail.period} />
                    <DetailField label="Pay Date" value={viewDetail.payDate} />
                    <DetailField label="Status" value={viewDetail.status} />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Earnings & Deductions</p>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField label="Gross Pay" value={`GHS ${viewDetail.grossPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
                    <DetailField label="Net Pay" value={`GHS ${viewDetail.netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
                    <DetailField label="Total Deductions" value={`GHS ${viewDetail.deductions.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
                    <DetailField label="Total Allowances" value={`GHS ${viewDetail.allowances.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Deduction Breakdown</p>
                  <div className="space-y-2">
                    {[
                      { label: "SSNIT (5.5%)", amount: (viewDetail.grossPay * 0.055) },
                      { label: "Income Tax", amount: (viewDetail.grossPay * 0.10) },
                      { label: "Health Insurance", amount: (viewDetail.grossPay * 0.025) },
                      { label: "Pension (Tier 2)", amount: (viewDetail.grossPay * 0.05) },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <span className="text-[12px] text-slate-600">{item.label}</span>
                        <span className="text-[12px] text-slate-900">GHS {item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {viewDetail.status === "Payslip" && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                    <Download size={14} />
                    Download Payslip PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default CheckMyPayslip;
