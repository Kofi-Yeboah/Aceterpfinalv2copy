import { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

export function PayrollApproval() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState<string | null>(null);

  const payrollRecords = [
    { id: "1", period: "June 2024", department: "All Departments", totalEmployees: 48, grossAmount: 425000, netAmount: 368500, submittedBy: "John Smith", submittedDate: "Jun 28, 2024", status: "Pending" },
    { id: "2", period: "May 2024", department: "All Departments", totalEmployees: 45, grossAmount: 385000, netAmount: 332500, submittedBy: "John Smith", submittedDate: "May 29, 2024", status: "Approved", approvedBy: "Sarah Johnson", approvedDate: "May 30, 2024" },
    { id: "3", period: "April 2024", department: "All Departments", totalEmployees: 43, grossAmount: 368000, netAmount: 318400, submittedBy: "John Smith", submittedDate: "Apr 28, 2024", status: "Approved", approvedBy: "Sarah Johnson", approvedDate: "Apr 29, 2024" },
    { id: "4", period: "March 2024 - Engineering", department: "Engineering", totalEmployees: 12, grossAmount: 112700, netAmount: 95795, submittedBy: "Tom Anderson", submittedDate: "Mar 25, 2024", status: "Rejected", rejectedBy: "Sarah Johnson", rejectedDate: "Mar 26, 2024", reason: "Incorrect tax calculations" },
  ];

  const filteredRecords = payrollRecords.filter((record) => {
    const matchesSearch = record.period.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = record.status === activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    return matchesSearch && matchesTab;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "GHS", minimumFractionDigits: 0 }).format(amount);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] bg-orange-50 text-orange-600"><Clock size={12} /> Pending</span>;
      case "Approved":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] bg-green-50 text-green-600"><CheckCircle size={12} /> Approved</span>;
      case "Rejected":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] bg-red-50 text-red-600"><XCircle size={12} /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Payroll Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">Review and approve payroll submissions</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] ${
              activeTab === "pending"
                ? "bg-[#0B01D0] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] ${
              activeTab === "approved"
                ? "bg-[#0B01D0] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] ${
              activeTab === "rejected"
                ? "bg-[#0B01D0] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Pay Period</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employees</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Gross Amount</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Net Amount</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Submitted By</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Submitted Date</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr
                key={record.id}
                className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                onClick={() => setSelectedPayroll(record.id)}
              >
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{record.period}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{record.department}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <p className="text-[12px] text-slate-900">{record.totalEmployees}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-semibold text-slate-900">{formatCurrency(record.grossAmount)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-semibold text-blue-600">{formatCurrency(record.netAmount)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{record.submittedBy}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{record.submittedDate}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  {getStatusBadge(record.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPayroll(record.id);
                      }}
                      className="p-2 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Eye size={16} className="text-blue-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail View Modal */}
      {selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedPayroll(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[15px] text-slate-900">Payroll Details</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {payrollRecords.find(r => r.id === selectedPayroll)?.period}
                </p>
              </div>
              <button onClick={() => setSelectedPayroll(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <XCircle size={16} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {(() => {
                const record = payrollRecords.find(r => r.id === selectedPayroll);
                if (!record) return null;

                return (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 mb-1">Total Employees</p>
                        <p className="text-2xl font-bold text-blue-600">{record.totalEmployees}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 mb-1">Gross Amount</p>
                        <p className="text-xl font-bold text-purple-600">{formatCurrency(record.grossAmount)}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 mb-1">Net Amount</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(record.netAmount)}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-xs text-slate-500 mb-1">Deductions</p>
                        <p className="text-xl font-bold text-orange-600">{formatCurrency(record.grossAmount - record.netAmount)}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Department</p>
                          <p className="text-sm text-slate-900 font-medium">{record.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Submitted By</p>
                          <p className="text-sm text-slate-900 font-medium">{record.submittedBy}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Submitted Date</p>
                          <p className="text-sm text-slate-900 font-medium">{record.submittedDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Status</p>
                          <div className="mt-1">{getStatusBadge(record.status)}</div>
                        </div>
                      </div>

                      {record.status === "Approved" && (
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                          <div>
                            <p className="text-xs text-slate-500">Approved By</p>
                            <p className="text-sm text-green-600 font-medium">{record.approvedBy}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Approved Date</p>
                            <p className="text-sm text-green-600 font-medium">{record.approvedDate}</p>
                          </div>
                        </div>
                      )}

                      {record.status === "Rejected" && (
                        <div className="pt-3 border-t border-slate-200">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-slate-500">Rejected By</p>
                              <p className="text-sm text-red-600 font-medium">{record.rejectedBy}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Rejected Date</p>
                              <p className="text-sm text-red-600 font-medium">{record.rejectedDate}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Reason</p>
                            <p className="text-sm text-red-600 font-medium">{record.reason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Action Buttons - Only for Pending */}
            {payrollRecords.find(r => r.id === selectedPayroll)?.status === "Pending" && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-[13px] hover:bg-red-100 transition-colors flex items-center gap-2">
                  <XCircle size={14} />
                  Reject
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-[13px] hover:bg-green-700 transition-colors flex items-center gap-2">
                  <CheckCircle size={14} />
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
