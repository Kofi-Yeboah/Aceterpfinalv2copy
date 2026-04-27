import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, FileText, PenTool, Clock, TrendingUp, Calendar, Link2, PenLine, CheckCircle2, X, AlertCircle } from "lucide-react";
import { getSignature, subscribe as subscribeSignature, getCurrentUserId, canUseSignature } from "../lib/signatureStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DashboardConfigPanel, useDashboardConfig } from "../components/DashboardConfigPanel";
import { getContracts, subscribe as subscribeContracts, type AwardedContract } from "../lib/contractStore";

/* ── Static legacy contracts that aren't in the contract store ── */
const staticLegacyContracts: { id: string; title: string; vendor: string; endDate: string; value: number; type: string; status: string; department: string }[] = [
  { id: "S-003", title: "Employment Contract - Sarah Johnson", vendor: "Sarah Johnson", endDate: "2027-01-14", value: 95000, type: "Employment", status: "Active", department: "HR" },
  { id: "S-004", title: "IT Support Services Agreement", vendor: "TechSupport Inc", endDate: "2026-03-31", value: 28000, type: "Service", status: "Active", department: "IT" },
  { id: "S-005", title: "NDA - Strategic Partnership", vendor: "Global Solutions Ltd", endDate: "2027-05-10", value: 0, type: "NDA", status: "Active", department: "Legal" },
  { id: "S-098", title: "Cleaning Services Contract", vendor: "CleanCo Services", endDate: "2025-12-31", value: 15000, type: "Service", status: "Expiring Soon", department: "Admin" },
  { id: "S-006", title: "Consultant Agreement - Project Management", vendor: "ProjectPro Consulting", endDate: "2025-11-30", value: 75000, type: "Consultant", status: "Active", department: "Projects" },
  { id: "S-045", title: "Internet Service Provider Agreement", vendor: "FastNet Communications", endDate: "2025-01-14", value: 12000, type: "Service", status: "Expired", department: "IT" },
  { id: "S-007", title: "Employment Contract - David Wilson", vendor: "David Wilson", endDate: "2027-03-19", value: 110000, type: "Employment", status: "Active", department: "HR" },
  { id: "S-008", title: "Vehicle Lease Agreement", vendor: "AutoLease Ltd", endDate: "2027-04-14", value: 36000, type: "Lease", status: "Active", department: "Admin" },
  { id: "S-009", title: "Security Services Contract", vendor: "SecureGuard Inc", endDate: "2026-04-30", value: 42000, type: "Service", status: "Active", department: "Admin" },
  { id: "S-010", title: "Supplier Agreement - Office Supplies", vendor: "OfficeMax Solutions", endDate: "2026-12-31", value: 25000, type: "Vendor", status: "Active", department: "Procurement" },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const formatDate = (s: string) => {
  try { return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return s; }
};

const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const pendingSignatures = [
  { id: "1", title: "Employment Contract - Senior Developer", requestedBy: "Sarah Johnson", department: "HR", daysWaiting: 2, priority: "High" },
  { id: "2", title: "NDA - Vendor Partnership", requestedBy: "Michael Chen", department: "Procurement", daysWaiting: 5, priority: "Medium" },
  { id: "3", title: "Consultant Agreement", requestedBy: "Emily Davis", department: "Projects", daysWaiting: 3, priority: "High" },
  { id: "4", title: "Supplier Agreement - Office Supplies", requestedBy: "John Smith", department: "Admin", daysWaiting: 7, priority: "Low" },
];

const monthlyActivity = [
  { month: "Aug", drafted: 12, signed: 10, expired: 2 },
  { month: "Sep", drafted: 15, signed: 13, expired: 1 },
  { month: "Oct", drafted: 18, signed: 16, expired: 3 },
  { month: "Nov", drafted: 14, signed: 12, expired: 2 },
  { month: "Dec", drafted: 16, signed: 14, expired: 1 },
  { month: "Jan", drafted: 20, signed: 18, expired: 4 },
];

const LEGAL_SECTIONS = [
  { id: "kpis", label: "KPI Cards" },
  { id: "contractStatus", label: "Contract Status Distribution" },
  { id: "monthlyTrend", label: "Monthly Contracts Trend" },
  { id: "expiring", label: "Expiring Contracts" },
  { id: "pendingSig", label: "Pending Signatures" },
];

export function LegalContractsDashboard() {
  const [timeframe, setTimeframe] = useState("This Month");
  const [, setTick] = useState(0);
  const { visibleSections, onToggle, onShowAll, onHideAll, isVisible } = useDashboardConfig(LEGAL_SECTIONS);

  // Signature
  const [signatureData, setSignatureData] = useState(getSignature());
  const [showSignModal, setShowSignModal] = useState(false);
  const [signTarget, setSignTarget] = useState<typeof pendingSignatures[0] | null>(null);
  const [signedIds, setSignedIds] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsub = subscribeSignature(() => setSignatureData(getSignature()));
    return unsub;
  }, []);

  const handleApplySignature = () => {
    if (!signTarget || !canUseSignature(getCurrentUserId())) return;
    const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    setSignedIds(prev => ({ ...prev, [signTarget.id]: now }));
    setShowSignModal(false);
    setSignTarget(null);
  };

  // Subscribe to contract store for live updates
  useEffect(() => {
    const unsub = subscribeContracts(() => setTick(t => t + 1));
    return unsub;
  }, []);

  // Build unified contract list from store + static legacy
  const allContracts = useMemo(() => {
    const storeContracts = getContracts();
    const storeNumbers = new Set(storeContracts.map(c => c.contractNumber));
    const fromStore = storeContracts.map(c => ({
      id: c.id, title: c.title, vendor: c.party, endDate: c.endDate,
      value: c.value, type: c.type, status: c.status, department: c.department,
      sourcePR: c.sourcePR,
    }));
    const fromStatic = staticLegacyContracts
      .filter(c => !storeNumbers.has(c.id))
      .map(c => ({ ...c, sourcePR: undefined as string | undefined }));
    return [...fromStore, ...fromStatic];
  }, [/* re-runs via setTick */]);

  // Compute live expiring contracts (ending within 90 days)
  const expiringContracts = useMemo(() => {
    return allContracts
      .map(c => {
        const days = daysUntil(c.endDate);
        return { ...c, daysLeft: days };
      })
      .filter(c => c.daysLeft > 0 && c.daysLeft <= 90)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .map(c => ({
        id: c.id,
        title: c.title,
        vendor: c.vendor,
        expiryDate: formatDate(c.endDate),
        daysLeft: c.daysLeft,
        value: c.value > 0 ? formatCurrency(c.value) : "N/A",
        status: c.daysLeft <= 14 ? "Critical" : c.daysLeft <= 30 ? "Warning" : "Notice",
        sourcePR: c.sourcePR,
      }));
  }, [allContracts]);

  // Live KPI data
  const totalContracts = allContracts.length;
  const expiringSoonCount = expiringContracts.length;
  const totalValue = allContracts.reduce((sum, c) => sum + (c.value || 0), 0);

  // Live status distribution for chart
  const liveContractsByStatus = useMemo(() => {
    const counts: Record<string, number> = { Active: 0, "Expiring Soon": 0, Pending: 0, Expired: 0 };
    allContracts.forEach(c => {
      const days = daysUntil(c.endDate);
      if (days <= 0) counts.Expired++;
      else if (days <= 90) counts["Expiring Soon"]++;
      else if (c.status === "Pending") counts.Pending++;
      else counts.Active++;
    });
    return [
      { name: "Active", value: counts.Active },
      { name: "Expiring Soon", value: counts["Expiring Soon"] },
      { name: "Pending", value: counts.Pending },
      { name: "Expired", value: counts.Expired },
    ];
  }, [allContracts]);

  // Live type distribution for pie chart
  const liveContractsByType = useMemo(() => {
    const counts: Record<string, number> = {};
    allContracts.forEach(c => { counts[c.type] = (counts[c.type] || 0) + 1; });
    const COLORS = ["#0B01D0", "#4338ca", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));
  }, [allContracts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "Warning":
        return "bg-amber-100 text-amber-700";
      case "Notice":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Legal & Contracts Dashboard</h1>
          <div className="flex items-center gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
            <DashboardConfigPanel sections={LEGAL_SECTIONS} visibleSections={visibleSections} onToggle={onToggle} onShowAll={onShowAll} onHideAll={onHideAll} />
          </div>
        </div>

        {/* Summary Cards */}
        {isVisible("kpis") && (
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="text-[#0B01D0]" size={24} />
              </div>
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalContracts}</div>
            <div className="text-sm text-slate-600">Total Contracts</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <span className="text-xs font-medium text-amber-600">Urgent</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{expiringSoonCount}</div>
            <div className="text-sm text-slate-600">Expiring Soon</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <PenTool className="text-purple-600" size={24} />
              </div>
              <Clock className="text-slate-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">12</div>
            <div className="text-sm text-slate-600">Pending Signatures</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Calendar className="text-emerald-600" size={24} />
              </div>
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(totalValue)}</div>
            <div className="text-sm text-slate-600">Total Contract Value</div>
          </div>
        </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Contract Activity Chart */}
          {isVisible("monthlyTrend") && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contract Activity (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="drafted" fill="#0B01D0" name="Drafted" />
                <Bar dataKey="signed" fill="#10b981" name="Signed" />
                <Bar dataKey="expired" fill="#ef4444" name="Expired" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}

          {/* Contracts by Type */}
          {isVisible("contractStatus") && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contracts by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={liveContractsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {liveContractsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          )}
        </div>

        {/* Expiring Contracts Alert */}
        {isVisible("expiring") && (
        <div className="bg-white border border-slate-200 rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="text-amber-600" size={20} />
              Expiring Contracts (Next 90 Days)
            </h3>
            <button className="text-sm text-[#0B01D0] hover:underline">View All</button>
          </div>
          <table className="w-full">
            <thead className="bg-[#0B01D0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-white">Contract Title</th>
                <th className="px-6 py-4 text-left text-xs text-white">Vendor/Party</th>
                <th className="px-6 py-4 text-left text-xs text-white">Expiry Date</th>
                <th className="px-6 py-4 text-left text-xs text-white">Days Left</th>
                <th className="px-6 py-4 text-left text-xs text-white">Contract Value</th>
                <th className="px-6 py-4 text-left text-xs text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {expiringContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[13px] text-slate-400">
                    No contracts expiring in the next 90 days.
                  </td>
                </tr>
              ) : expiringContracts.map((contract, index) => (
                <tr
                  key={contract.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">
                    {contract.title}
                    {contract.sourcePR && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-indigo-50 text-indigo-600 font-medium">
                        <Link2 size={9} className="mr-0.5" /> {contract.sourcePR}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[12px] text-slate-600">{contract.vendor}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-600">{contract.expiryDate}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-900 font-semibold">{contract.daysLeft} days</td>
                  <td className="px-6 py-4 text-[12px] text-slate-900">{contract.value}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Pending Signatures */}
        {isVisible("pendingSig") && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <PenTool className="text-purple-600" size={20} />
              Pending Signatures
            </h3>
            <button className="text-sm text-[#0B01D0] hover:underline">View All</button>
          </div>
          <table className="w-full">
            <thead className="bg-[#0B01D0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-white">Contract Title</th>
                <th className="px-6 py-4 text-left text-xs text-white">Requested By</th>
                <th className="px-6 py-4 text-left text-xs text-white">Department</th>
                <th className="px-6 py-4 text-left text-xs text-white">Days Waiting</th>
                <th className="px-6 py-4 text-left text-xs text-white">Priority</th>
                <th className="px-6 py-4 text-center text-xs text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingSignatures.map((signature, index) => (
                <tr
                  key={signature.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="px-6 py-4 text-[12px] font-semibold text-slate-900">{signature.title}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-600">{signature.requestedBy}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-600">{signature.department}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-900">{signature.daysWaiting} days</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getPriorityColor(signature.priority)}`}>
                      {signature.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {signedIds[signature.id] ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                        <CheckCircle2 size={12} /> Signed
                      </span>
                    ) : signatureData ? (
                      <button
                        onClick={() => { setSignTarget(signature); setShowSignModal(true); }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white hover:opacity-90 transition-colors"
                        style={{ backgroundColor: "#0B01D0" }}
                      >
                        <PenLine size={11} /> Sign
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">No signature</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Sign Modal */}
      {showSignModal && signatureData && signTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowSignModal(false); setSignTarget(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Apply Signature</h3>
              <button onClick={() => { setShowSignModal(false); setSignTarget(null); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">You are about to sign this document with your personal signature:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Document</span>
                  <span className="text-xs text-slate-900">{signTarget.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Requested By</span>
                  <span className="text-xs text-slate-900">{signTarget.requestedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Signed By</span>
                  <span className="text-xs text-slate-900">{signatureData.employeeName}</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-center">
                <img src={signatureData.dataUrl} alt="My Signature" className="max-w-[220px] max-h-[90px] object-contain" />
              </div>
              <p className="text-xs text-slate-400">By clicking "Confirm & Sign", you confirm this is your personal signature.</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => { setShowSignModal(false); setSignTarget(null); }} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleApplySignature}
                className="px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 transition-colors flex items-center gap-1.5"
                style={{ backgroundColor: "#0B01D0" }}>
                <PenLine size={14} />
                Confirm & Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LegalContractsDashboard;