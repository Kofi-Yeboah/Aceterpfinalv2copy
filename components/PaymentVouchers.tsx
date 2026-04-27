import { useState, useRef, useEffect } from "react";
import { Search, Download, ChevronDown, Plus, MoreHorizontal, ArrowLeft, X, Upload } from "lucide-react";

// ─── Types ─────────────────────────────────────────
type VoucherStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | "Paid";

interface PaymentVoucher {
  id: string;
  voucherNo: string;
  date: string;
  budgetLine: string;
  budgetLineCode: string;
  account: string;
  accountCode: string;
  project: string;
  projectCode: string;
  payee: string;
  description: string;
  amount: number;
  currency: string;
  status: VoucherStatus;
  preparedBy: string;
  approvedBy: string;
  paymentMethod: string;
  glEntryRef: string;
  department: string;
  createdDate: string;
}

// Budget lines with linked account/project/amount from WBS
interface BudgetLineItem {
  id: string;
  code: string;
  name: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  currency: string;
  department: string;
  // Linked from WBS / project creation
  linkedAccount: string;
  linkedAccountCode: string;
  linkedProject: string;
  linkedProjectCode: string;
}

const budgetLines: BudgetLineItem[] = [
  { id: "bl-1", code: "BL-5100-001", name: "Salaries & Wages", category: "Personnel", allocated: 1200000, spent: 995000, remaining: 205000, currency: "USD", department: "HR", linkedAccount: "Payroll Account", linkedAccountCode: "1001-002", linkedProject: "General Operations", linkedProjectCode: "OP-2026-GEN" },
  { id: "bl-2", code: "BL-5200-001", name: "Employee Benefits", category: "Personnel", allocated: 350000, spent: 280000, remaining: 70000, currency: "USD", department: "HR", linkedAccount: "Main Operating Account", linkedAccountCode: "1001-001", linkedProject: "General Operations", linkedProjectCode: "OP-2026-GEN" },
  { id: "bl-3", code: "BL-5300-001", name: "Office Rent & Utilities", category: "Operations", allocated: 220000, spent: 203500, remaining: 16500, currency: "USD", department: "Operations", linkedAccount: "Main Operating Account", linkedAccountCode: "1001-001", linkedProject: "General Operations", linkedProjectCode: "OP-2026-GEN" },
  { id: "bl-4", code: "BL-5400-001", name: "Travel & Transportation", category: "Operations", allocated: 125000, spent: 95000, remaining: 30000, currency: "USD", department: "Operations", linkedAccount: "Main Operating Account", linkedAccountCode: "1001-001", linkedProject: "Community Health Initiative", linkedProjectCode: "PRJ-2025-001" },
  { id: "bl-5", code: "BL-5500-001", name: "Training & Development", category: "Personnel", allocated: 75000, spent: 48500, remaining: 26500, currency: "USD", department: "HR", linkedAccount: "USAID Grant Fund", linkedAccountCode: "4001-001", linkedProject: "Youth Empowerment Program", linkedProjectCode: "PRJ-2025-002" },
  { id: "bl-6", code: "BL-5600-001", name: "Software & Licenses", category: "IT", allocated: 150000, spent: 125000, remaining: 25000, currency: "USD", department: "IT", linkedAccount: "Main Operating Account", linkedAccountCode: "1001-001", linkedProject: "Digital Literacy Campaign", linkedProjectCode: "PRJ-2026-001" },
  { id: "bl-7", code: "BL-5700-001", name: "Office Supplies & Materials", category: "Operations", allocated: 60000, spent: 42000, remaining: 18000, currency: "USD", department: "Operations", linkedAccount: "Office Petty Cash", linkedAccountCode: "1002-001", linkedProject: "General Operations", linkedProjectCode: "OP-2026-GEN" },
  { id: "bl-8", code: "BL-5800-001", name: "Professional Services", category: "Services", allocated: 95000, spent: 62000, remaining: 33000, currency: "USD", department: "Finance", linkedAccount: "Main Operating Account", linkedAccountCode: "1001-001", linkedProject: "General Operations", linkedProjectCode: "OP-2026-GEN" },
  { id: "bl-9", code: "BL-5900-001", name: "Marketing & Communications", category: "Marketing", allocated: 180000, spent: 165000, remaining: 15000, currency: "USD", department: "Marketing", linkedAccount: "Main Operating Account", linkedAccountCode: "1001-001", linkedProject: "Clean Water Access Project", linkedProjectCode: "PRJ-2026-002" },
  { id: "bl-10", code: "BL-6000-001", name: "Equipment & Hardware", category: "IT", allocated: 200000, spent: 185000, remaining: 15000, currency: "USD", department: "IT", linkedAccount: "Main Operating Account", linkedAccountCode: "1001-001", linkedProject: "Digital Literacy Campaign", linkedProjectCode: "PRJ-2026-001" },
  { id: "bl-11", code: "BL-6100-001", name: "Field Operations", category: "Programs", allocated: 300000, spent: 210000, remaining: 90000, currency: "USD", department: "Programs", linkedAccount: "EU Co-Financing Fund", linkedAccountCode: "4001-002", linkedProject: "Agricultural Extension Services", linkedProjectCode: "PRJ-2025-003" },
  { id: "bl-12", code: "BL-6200-001", name: "Community Outreach", category: "Programs", allocated: 150000, spent: 95000, remaining: 55000, currency: "USD", department: "Programs", linkedAccount: "USAID Grant Fund", linkedAccountCode: "4001-001", linkedProject: "Community Health Initiative", linkedProjectCode: "PRJ-2025-001" },
];

const mockVouchers: PaymentVoucher[] = [
  { id: "v1", voucherNo: "PV-2026-0045", date: "Mar 01, 2026", budgetLine: "Office Rent & Utilities", budgetLineCode: "BL-5300-001", account: "Main Operating Account", accountCode: "1001-001", project: "General Operations", projectCode: "OP-2026-GEN", payee: "City Properties Ltd", description: "Office rent - March 2026", amount: 18500, currency: "USD", status: "Paid", preparedBy: "Ama Darko", approvedBy: "Kofi Mensah", paymentMethod: "Bank Transfer", glEntryRef: "GL-2026-0312", department: "Operations", createdDate: "Feb 28, 2026" },
  { id: "v2", voucherNo: "PV-2026-0044", date: "Feb 28, 2026", budgetLine: "Software & Licenses", budgetLineCode: "BL-5600-001", account: "Main Operating Account", accountCode: "1001-001", project: "Digital Literacy Campaign", projectCode: "PRJ-2026-001", payee: "TechPro Solutions", description: "Annual software licenses renewal", amount: 12500, currency: "USD", status: "Paid", preparedBy: "Richard Antwi", approvedBy: "Nelly Manu", paymentMethod: "Bank Transfer", glEntryRef: "GL-2026-0308", department: "IT", createdDate: "Feb 27, 2026" },
  { id: "v3", voucherNo: "PV-2026-0043", date: "Feb 27, 2026", budgetLine: "Travel & Transportation", budgetLineCode: "BL-5400-001", account: "Main Operating Account", accountCode: "1001-001", project: "Community Health Initiative", projectCode: "PRJ-2025-001", payee: "Ghana Airways", description: "Field visit flights to Kumasi region", amount: 3200, currency: "USD", status: "Approved", preparedBy: "Abena Osei", approvedBy: "Kofi Mensah", paymentMethod: "Bank Transfer", glEntryRef: "GL-2026-0305", department: "Programs", createdDate: "Feb 26, 2026" },
  { id: "v4", voucherNo: "PV-2026-0042", date: "Feb 25, 2026", budgetLine: "Office Supplies & Materials", budgetLineCode: "BL-5700-001", account: "Office Petty Cash", accountCode: "1002-001", project: "General Operations", projectCode: "OP-2026-GEN", payee: "Stationery World", description: "Monthly office stationery supplies", amount: 850, currency: "USD", status: "Paid", preparedBy: "Wangari Maathai", approvedBy: "Ama Darko", paymentMethod: "Petty Cash", glEntryRef: "GL-2026-0298", department: "Operations", createdDate: "Feb 24, 2026" },
  { id: "v5", voucherNo: "PV-2026-0041", date: "Feb 24, 2026", budgetLine: "Professional Services", budgetLineCode: "BL-5800-001", account: "Main Operating Account", accountCode: "1001-001", project: "General Operations", projectCode: "OP-2026-GEN", payee: "Audit Partners Ghana", description: "External audit fees - Q4 2025", amount: 25000, currency: "USD", status: "Submitted", preparedBy: "Chinua Achebe", approvedBy: "--", paymentMethod: "Bank Transfer", glEntryRef: "--", department: "Finance", createdDate: "Feb 23, 2026" },
  { id: "v6", voucherNo: "PV-2026-0040", date: "Feb 22, 2026", budgetLine: "Training & Development", budgetLineCode: "BL-5500-001", account: "USAID Grant Fund", accountCode: "4001-001", project: "Youth Empowerment Program", projectCode: "PRJ-2025-002", payee: "Training Institute Ghana", description: "Staff capacity building workshop", amount: 8500, currency: "USD", status: "Approved", preparedBy: "Desmond Tutu", approvedBy: "Nelly Manu", paymentMethod: "Bank Transfer", glEntryRef: "GL-2026-0290", department: "HR", createdDate: "Feb 21, 2026" },
  { id: "v7", voucherNo: "PV-2026-0039", date: "Feb 20, 2026", budgetLine: "Field Operations", budgetLineCode: "BL-6100-001", account: "EU Co-Financing Fund", accountCode: "4001-002", project: "Agricultural Extension Services", projectCode: "PRJ-2025-003", payee: "AgriSupport Services", description: "Farming tools and seeds distribution", amount: 15000, currency: "USD", status: "Paid", preparedBy: "Kofi Annan", approvedBy: "Kofi Mensah", paymentMethod: "Bank Transfer", glEntryRef: "GL-2026-0285", department: "Programs", createdDate: "Feb 19, 2026" },
  { id: "v8", voucherNo: "PV-2026-0038", date: "Feb 18, 2026", budgetLine: "Community Outreach", budgetLineCode: "BL-6200-001", account: "USAID Grant Fund", accountCode: "4001-001", project: "Community Health Initiative", projectCode: "PRJ-2025-001", payee: "Health Comms Agency", description: "Community health awareness campaign materials", amount: 6200, currency: "USD", status: "Rejected", preparedBy: "Abena Osei", approvedBy: "Kofi Mensah", paymentMethod: "Bank Transfer", glEntryRef: "--", department: "Programs", createdDate: "Feb 17, 2026" },
  { id: "v9", voucherNo: "PV-2026-0037", date: "Feb 15, 2026", budgetLine: "Equipment & Hardware", budgetLineCode: "BL-6000-001", account: "Main Operating Account", accountCode: "1001-001", project: "Digital Literacy Campaign", projectCode: "PRJ-2026-001", payee: "CompTech Ltd", description: "20x Laptops for digital training centres", amount: 28000, currency: "USD", status: "Paid", preparedBy: "Richard Antwi", approvedBy: "Nelly Manu", paymentMethod: "Bank Transfer", glEntryRef: "GL-2026-0278", department: "IT", createdDate: "Feb 14, 2026" },
  { id: "v10", voucherNo: "PV-2026-0036", date: "Feb 12, 2026", budgetLine: "Marketing & Communications", budgetLineCode: "BL-5900-001", account: "Main Operating Account", accountCode: "1001-001", project: "Clean Water Access Project", projectCode: "PRJ-2026-002", payee: "MediaHouse Ghana", description: "Donor visibility materials and event branding", amount: 4500, currency: "USD", status: "Paid", preparedBy: "Wangari Maathai", approvedBy: "Ama Darko", paymentMethod: "Bank Transfer", glEntryRef: "GL-2026-0272", department: "Marketing", createdDate: "Feb 11, 2026" },
  { id: "v11", voucherNo: "PV-2026-0035", date: "Feb 10, 2026", budgetLine: "Employee Benefits", budgetLineCode: "BL-5200-001", account: "Main Operating Account", accountCode: "1001-001", project: "General Operations", projectCode: "OP-2026-GEN", payee: "HealthPlus Insurance", description: "Staff health insurance premiums - Feb 2026", amount: 22400, currency: "USD", status: "Paid", preparedBy: "Ama Darko", approvedBy: "Kofi Mensah", paymentMethod: "Bank Transfer", glEntryRef: "GL-2026-0265", department: "HR", createdDate: "Feb 09, 2026" },
  { id: "v12", voucherNo: "PV-2026-0034", date: "Feb 05, 2026", budgetLine: "Field Operations", budgetLineCode: "BL-6100-001", account: "Field Office Petty Cash", accountCode: "1002-002", project: "Agricultural Extension Services", projectCode: "PRJ-2025-003", payee: "Local Transport Provider", description: "Vehicle hire for field monitoring visits", amount: 1200, currency: "GHS", status: "Paid", preparedBy: "Kofi Annan", approvedBy: "Desmond Tutu", paymentMethod: "Petty Cash", glEntryRef: "GL-2026-0258", department: "Programs", createdDate: "Feb 04, 2026" },
];

// ─── Helpers ───────────────────────────────────────
function getStatusColor(status: VoucherStatus) {
  switch (status) {
    case "Draft": return "bg-slate-50 text-slate-600";
    case "Submitted": return "bg-blue-50 text-blue-700";
    case "Approved": return "bg-emerald-50 text-emerald-700";
    case "Rejected": return "bg-red-50 text-red-700";
    case "Paid": return "bg-green-50 text-green-700";
  }
}

function fmt(amount: number, currency: string) {
  if (currency === "GHS") return `GHS ${amount.toLocaleString()}`;
  return `$${amount.toLocaleString()}`;
}

// ─── Searchable Budget Line Dropdown ───────────────
function BudgetLineDropdown({ selected, onSelect }: {
  selected: BudgetLineItem | null;
  onSelect: (bl: BudgetLineItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = budgetLines.filter(bl => {
    const q = search.toLowerCase();
    return !q || bl.name.toLowerCase().includes(q) || bl.code.toLowerCase().includes(q) || bl.category.toLowerCase().includes(q) || bl.department.toLowerCase().includes(q);
  });

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-left bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {selected ? (
          <span className="text-slate-900 truncate">
            <span className="font-mono text-slate-400 mr-1.5">{selected.code}</span>
            {selected.name}
          </span>
        ) : (
          <span className="text-slate-400">Select a budget line...</span>
        )}
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
      </button>

      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search budget lines..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>
          {/* Options */}
          <div className="max-h-[260px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-[12px] text-slate-400">No budget lines found</div>
            )}
            {filtered.map(bl => {
              const isSelected = selected?.id === bl.id;
              const pct = Math.round((bl.spent / bl.allocated) * 100);
              return (
                <button
                  key={bl.id}
                  type="button"
                  onClick={() => { onSelect(bl); setOpen(false); setSearch(""); }}
                  className={`w-full text-left px-4 py-2.5 border-b border-slate-50 last:border-0 transition-colors ${
                    isSelected ? "bg-purple-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">{bl.code}</span>
                      <span className="text-[12px] text-slate-900 truncate">{bl.name}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500 shrink-0">{bl.category}</span>
                    </div>
                    <span className={`text-[11px] font-mono shrink-0 ml-3 ${bl.remaining < 5000 ? "text-red-500" : "text-emerald-600"}`}>
                      ${bl.remaining.toLocaleString()} left
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 90 ? "bg-red-400" : pct > 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0">{pct}%</span>
                    <span className="text-[9px] text-slate-400 shrink-0">{bl.department}</span>
                    <span className="text-[9px] text-slate-400 shrink-0">{bl.linkedProject}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Component ─────────────────────────────────────
export function PaymentVouchers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<PaymentVoucher | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vouchers, setVouchers] = useState<PaymentVoucher[]>(mockVouchers);

  const filtered = vouchers.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || v.voucherNo.toLowerCase().includes(q) || v.payee.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.budgetLine.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All Statuses" || v.status === statusFilter;
    const matchDept = departmentFilter === "All Departments" || v.department === departmentFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const totalVouchers = vouchers.length;
  const paidCount = vouchers.filter(v => v.status === "Paid").length;
  const pendingCount = vouchers.filter(v => v.status === "Submitted" || v.status === "Approved").length;
  const totalAmount = vouchers.filter(v => v.currency === "USD").reduce((s, v) => s + v.amount, 0);
  const nextVoucherNo = `PV-2026-${String(vouchers.length + 34).padStart(4, "0")}`;

  function handleCreate(newVoucher: PaymentVoucher) {
    setVouchers(prev => [newVoucher, ...prev]);
    setShowCreateModal(false);
  }

  // ==================== VIEW VOUCHER DETAIL ====================
  if (viewItem) {
    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <button onClick={() => setViewItem(null)} className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 mb-3 transition-colors">
            <ArrowLeft size={15} /> Back to Payment Vouchers
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">{viewItem.voucherNo}</h1>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[12px] ${getStatusColor(viewItem.status)}`}>{viewItem.status}</span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">{viewItem.description}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Amount</p>
              <p className="text-[20px] text-slate-900">{fmt(viewItem.amount, viewItem.currency)}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="text-[13px] text-slate-900">Voucher Information</h3>
              </div>
              <div className="px-5 py-4 grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Voucher No</p>
                  <p className="text-[13px] text-slate-900 font-mono">{viewItem.voucherNo}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-[13px] text-slate-900">{viewItem.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-[13px] text-slate-900">{viewItem.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-[13px] text-slate-900">{viewItem.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="text-[13px] text-slate-900">Budget & Funding Source</h3>
              </div>
              <div className="px-5 py-4 grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Budget Line</p>
                  <p className="text-[13px] text-slate-900">{viewItem.budgetLine}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{viewItem.budgetLineCode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Funding Account</p>
                  <p className="text-[13px] text-slate-900">{viewItem.account}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{viewItem.accountCode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Project</p>
                  <p className="text-[13px] text-slate-900">{viewItem.project}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{viewItem.projectCode}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="text-[13px] text-slate-900">Payment Details</h3>
              </div>
              <div className="px-5 py-4 grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Payee</p>
                  <p className="text-[13px] text-slate-900">{viewItem.payee}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-[13px] text-slate-900 font-mono">{fmt(viewItem.amount, viewItem.currency)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Currency</p>
                  <p className="text-[13px] text-slate-900">{viewItem.currency}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-[13px] text-slate-700">{viewItem.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="text-[13px] text-slate-900">Approval & Ledger</h3>
              </div>
              <div className="px-5 py-4 grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Prepared By</p>
                  <p className="text-[13px] text-slate-900">{viewItem.preparedBy}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Approved By</p>
                  <p className="text-[13px] text-slate-900">{viewItem.approvedBy}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">GL Entry Reference</p>
                  <p className="text-[13px] text-blue-600 font-mono">{viewItem.glEntryRef}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Created Date</p>
                  <p className="text-[13px] text-slate-900">{viewItem.createdDate}</p>
                </div>
              </div>
              {viewItem.glEntryRef !== "--" && (
                <div className="mx-5 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-[11px] text-emerald-700">
                    This voucher has been posted to the General Ledger under reference <span className="font-mono font-medium">{viewItem.glEntryRef}</span>.
                  </p>
                </div>
              )}
              {viewItem.status === "Rejected" && (
                <div className="mx-5 mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-[11px] text-red-700">
                    This voucher was rejected. Reason: Insufficient supporting documentation for the requested amount.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN LIST VIEW ====================
  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Payment Vouchers</h1>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-blue-50 text-blue-600 border-blue-200">{totalVouchers} Total</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-green-50 text-green-600 border-green-200">{paidCount} Paid</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border bg-amber-50 text-amber-600 border-amber-200">{pendingCount} Pending</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 pt-4 pb-0 bg-white border-b border-slate-200">
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-blue-500 uppercase tracking-wider mb-1">Total Voucher Value</p>
            <p className="text-[16px] text-blue-700">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-green-500 uppercase tracking-wider mb-1">Paid Vouchers</p>
            <p className="text-[16px] text-green-700">{paidCount}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-amber-500 uppercase tracking-wider mb-1">Awaiting Approval</p>
            <p className="text-[16px] text-amber-700">{vouchers.filter(v => v.status === "Submitted").length}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-[10px] text-red-500 uppercase tracking-wider mb-1">Rejected</p>
            <p className="text-[16px] text-red-700">{vouchers.filter(v => v.status === "Rejected").length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by voucher no, payee, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors bg-white min-w-[160px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Statuses</option>
              <option>Draft</option>
              <option>Submitted</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Paid</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors bg-white min-w-[180px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Departments</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Operations</option>
              <option>IT</option>
              <option>Programs</option>
              <option>Marketing</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: "#0B01D0" }}
            >
              <Plus className="w-4 h-4" />
              New Voucher
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Voucher No</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Payee</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Budget Line</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Project</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account</th>
              <th className="text-right px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Amount</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900 font-mono">{v.voucherNo}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{v.date}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{v.payee}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{v.budgetLine}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{v.project}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{v.account}</p></td>
                <td className="px-4 py-4 text-right"><p className="text-[12px] font-medium text-slate-900">{fmt(v.amount, v.currency)}</p></td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getStatusColor(v.status)}`}>{v.status}</span>
                </td>
                <td className="px-4 py-4 text-center relative">
                  <button className="p-1 hover:bg-slate-100 rounded" onClick={() => setShowActionMenu(showActionMenu === v.id ? null : v.id)}>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                  {showActionMenu === v.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                      <div className="absolute right-4 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                        <button onClick={() => { setViewItem(v); setShowActionMenu(null); }} className="w-full text-left px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50">View Details</button>
                        {v.status === "Draft" && <button className="w-full text-left px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50">Edit Voucher</button>}
                        <button className="w-full text-left px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50">Print Voucher</button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-6 py-16 text-center"><p className="text-[13px] text-slate-400">No payment vouchers found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ══════ CREATE VOUCHER MODAL ══════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <CreateVoucherModal
              nextVoucherNo={nextVoucherNo}
              onClose={() => setShowCreateModal(false)}
              onSubmit={handleCreate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SINGLE-SCREEN CREATE VOUCHER MODAL
// ═══════════════════════════════════════════════════
function CreateVoucherModal({ nextVoucherNo, onClose, onSubmit }: {
  nextVoucherNo: string;
  onClose: () => void;
  onSubmit: (v: PaymentVoucher) => void;
}) {
  const [selectedBL, setSelectedBL] = useState<BudgetLineItem | null>(null);
  const [payee, setPayee] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [voucherDate, setVoucherDate] = useState("2026-03-02");

  // Auto-fill when budget line changes
  function handleBudgetLineSelect(bl: BudgetLineItem) {
    setSelectedBL(bl);
    // Pre-fill amount with remaining budget
    setAmount(String(bl.remaining));
    // Infer payment method from account type
    if (bl.linkedAccount.toLowerCase().includes("petty cash")) {
      setPaymentMethod("Petty Cash");
    } else {
      setPaymentMethod("Bank Transfer");
    }
  }

  const canSubmit = !!selectedBL && payee.trim() !== "" && description.trim() !== "" && Number(amount) > 0;

  function handleSubmit() {
    if (!selectedBL) return;
    const voucher: PaymentVoucher = {
      id: `v-new-${Date.now()}`,
      voucherNo: nextVoucherNo,
      date: new Date(voucherDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      budgetLine: selectedBL.name,
      budgetLineCode: selectedBL.code,
      account: selectedBL.linkedAccount,
      accountCode: selectedBL.linkedAccountCode,
      project: selectedBL.linkedProject,
      projectCode: selectedBL.linkedProjectCode,
      payee,
      description,
      amount: Number(amount),
      currency: selectedBL.currency,
      status: "Submitted",
      preparedBy: "Current User",
      approvedBy: "--",
      paymentMethod,
      glEntryRef: "--",
      department: selectedBL.department,
      createdDate: "Mar 02, 2026",
    };
    onSubmit(voucher);
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
        <div>
          <h3 className="text-[16px] text-slate-900">New Payment Voucher</h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{nextVoucherNo}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Budget Line (searchable dropdown) */}
        <div>
          <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Budget Line <span className="text-red-500">*</span></label>
          <BudgetLineDropdown selected={selectedBL} onSelect={handleBudgetLineSelect} />
        </div>

        {/* Auto-filled fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Funding Account</label>
            <input
              type="text"
              value={selectedBL ? `${selectedBL.linkedAccount} (${selectedBL.linkedAccountCode})` : ""}
              disabled
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-500 bg-slate-50"
              placeholder="Auto-filled from budget line"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Project</label>
            <input
              type="text"
              value={selectedBL ? `${selectedBL.linkedProject} (${selectedBL.linkedProjectCode})` : ""}
              disabled
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-500 bg-slate-50"
              placeholder="Auto-filled from budget line"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Department</label>
            <input
              type="text"
              value={selectedBL?.department || ""}
              disabled
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-500 bg-slate-50"
              placeholder="Auto-filled from budget line"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Amount ({selectedBL?.currency || "USD"}) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedBL && Number(amount) > selectedBL.remaining && (
              <p className="text-[11px] text-red-500 mt-1">Exceeds budget line remaining (${selectedBL.remaining.toLocaleString()})</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* User-entered fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Voucher Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={voucherDate}
              onChange={(e) => setVoucherDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option>Bank Transfer</option>
              <option>Petty Cash</option>
              <option>Cheque</option>
              <option>Mobile Money</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Payee / Beneficiary <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
            placeholder="Enter payee name"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Description <span className="text-red-500">*</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter payment description"
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Supporting Documents */}
        <div>
          <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Supporting Documents</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-purple-300 transition-colors cursor-pointer">
            <Upload className="w-5 h-5 mx-auto text-slate-300 mb-1.5" />
            <p className="text-[12px] text-slate-500">Drag & drop files here or <span className="text-purple-700">browse</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG up to 10MB each</p>
          </div>
        </div>

        {/* GL info */}
        {selectedBL && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-[11px] text-blue-700">
              Upon submission, this voucher will be sent for approval. Once approved, it will post to the General Ledger as a debit against <span className="font-medium">{selectedBL.name}</span> and a credit against <span className="font-medium">{selectedBL.linkedAccount}</span>.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
        <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-700 hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-5 py-2 rounded-lg text-[13px] text-white hover:bg-purple-800 transition-colors bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Voucher
        </button>
      </div>
    </>
  );
}
