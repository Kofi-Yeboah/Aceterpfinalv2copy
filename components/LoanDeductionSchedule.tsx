import { useState } from "react";
import { Download, Search, ChevronDown } from "lucide-react";

const DEPARTMENTS = ["All Departments", "Engineering", "Sales", "Marketing", "Operations", "HR", "Finance"];

export function LoanDeductionSchedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const loanData = [
    { id: "1", employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", loanType: "Personal Loan", loanAmount: 5000, monthlyDeduction: 250, outstandingBalance: 2500, paymentStatus: "Active" },
    { id: "2", employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", loanType: "Emergency Loan", loanAmount: 3000, monthlyDeduction: 300, outstandingBalance: 900, paymentStatus: "Active" },
    { id: "3", employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", loanType: "Personal Loan", loanAmount: 4000, monthlyDeduction: 200, outstandingBalance: 1800, paymentStatus: "Active" },
    { id: "4", employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", loanType: "Salary Advance", loanAmount: 2000, monthlyDeduction: 500, outstandingBalance: 500, paymentStatus: "Active" },
  ];

  const filteredData = loanData.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || record.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const totalLoanAmount = filteredData.reduce((sum, record) => sum + record.loanAmount, 0);
  const totalMonthlyDeduction = filteredData.reduce((sum, record) => sum + record.monthlyDeduction, 0);
  const totalOutstandingBalance = filteredData.reduce((sum, record) => sum + record.outstandingBalance, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Loan Deduction Schedule</h1>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400" />
          </div>

          <div className="relative">
            <button onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">{selectedDepartment}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            {showDepartmentDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDepartmentDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {DEPARTMENTS.map((dept) => (
                    <button key={dept} onClick={() => { setSelectedDepartment(dept); setShowDepartmentDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{dept}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#0B01D0" }}>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee ID</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Department</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Loan Type</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Loan Amount</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Monthly Deduction</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Outstanding Balance</th>
              <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr key={record.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{record.employeeId}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{record.employeeName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.department}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{record.loanType}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(record.loanAmount)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-red-600">{formatCurrency(record.monthlyDeduction)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-orange-600">{formatCurrency(record.outstandingBalance)}</p></td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-xl text-[12px] bg-green-50 text-green-600">
                    {record.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
            {filteredData.length > 0 && (
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <td colSpan={4} className="px-4 py-4"><p className="text-[12px] font-semibold text-white">TOTAL</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalLoanAmount)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalMonthlyDeduction)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalOutstandingBalance)}</p></td>
                <td className="px-4 py-4"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
