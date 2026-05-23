import { useState } from "react";
import { Plus, Search, Eye } from "lucide-react";

export function LoanDeductions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const loanDeductions = [
    { id: "1", employeeId: "EMP-001", employeeName: "John Smith", loanAmount: 50000, monthlyDeduction: 5000, totalDeducted: 20000, remainingBalance: 30000, startDate: "Jan 2024", endDate: "Oct 2024", status: "Active" },
    { id: "2", employeeId: "EMP-003", employeeName: "Michael Brown", loanAmount: 30000, monthlyDeduction: 3000, totalDeducted: 12000, remainingBalance: 18000, startDate: "Feb 2024", endDate: "Jul 2024", status: "Active" },
    { id: "3", employeeId: "EMP-005", employeeName: "David Wilson", loanAmount: 45000, monthlyDeduction: 4500, totalDeducted: 22500, remainingBalance: 22500, startDate: "Dec 2023", endDate: "Sep 2024", status: "Active" },
    { id: "4", employeeId: "EMP-002", employeeName: "Sarah Johnson", loanAmount: 25000, monthlyDeduction: 2500, totalDeducted: 25000, remainingBalance: 0, startDate: "Jan 2023", endDate: "Oct 2023", status: "Completed" },
    { id: "5", employeeId: "EMP-007", employeeName: "Tom Anderson", loanAmount: 35000, monthlyDeduction: 3500, totalDeducted: 35000, remainingBalance: 0, startDate: "Mar 2023", endDate: "Dec 2023", status: "Completed" },
  ];

  const filteredLoans = loanDeductions.filter((loan) => {
    const matchesSearch = loan.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || loan.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "active" ? loan.status === "Active" : loan.status === "Completed";
    return matchesSearch && matchesTab;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "GHS", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Loan Deductions</h1>
        <button className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} />
          New Loan Deduction
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] ${
              activeTab === "active"
                ? "bg-[#0B01D0] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Active Loans
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[140px] ${
              activeTab === "completed"
                ? "bg-[#0B01D0] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Completed Loans
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Loan Amount</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Monthly Deduction</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Deducted</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Remaining Balance</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Period</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan, index) => (
              <tr key={loan.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-medium text-slate-900">{loan.employeeId}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-900">{loan.employeeName}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] font-semibold text-slate-900">{formatCurrency(loan.loanAmount)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-red-600">{formatCurrency(loan.monthlyDeduction)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-blue-600">{formatCurrency(loan.totalDeducted)}</p>
                </td>
                <td className="px-4 py-4">
                  <p className={`text-[12px] font-semibold ${loan.remainingBalance > 0 ? "text-orange-600" : "text-green-600"}`}>
                    {formatCurrency(loan.remainingBalance)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-[12px] text-slate-500">{loan.startDate} - {loan.endDate}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    <button className="p-2 hover:bg-blue-50 rounded transition-colors">
                      <Eye size={16} className="text-blue-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
