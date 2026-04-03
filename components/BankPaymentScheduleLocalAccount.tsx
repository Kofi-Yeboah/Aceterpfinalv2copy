import { useState } from "react";
import { Download, Search, ChevronDown } from "lucide-react";

const BANKS = ["All Banks", "Ghana Commercial Bank", "Ecobank Ghana", "Zenith Bank", "Standard Chartered", "Barclays Bank"];

export function BankPaymentScheduleLocalAccount() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  const bankPaymentData = [
    { id: "1", employeeId: "EMP-001", employeeName: "John Smith", bankName: "Ghana Commercial Bank", accountNumber: "****5678", branchCode: "GH-ACC-001", netSalary: 8150, paymentDate: "June 30, 2024" },
    { id: "2", employeeId: "EMP-002", employeeName: "Sarah Johnson", bankName: "Ecobank Ghana", accountNumber: "****3421", branchCode: "GH-ACC-002", netSalary: 7380, paymentDate: "June 30, 2024" },
    { id: "3", employeeId: "EMP-003", employeeName: "Michael Brown", bankName: "Zenith Bank", accountNumber: "****7892", branchCode: "GH-ACC-003", netSalary: 6550, paymentDate: "June 30, 2024" },
    { id: "4", employeeId: "EMP-004", employeeName: "Emily Davis", bankName: "Ghana Commercial Bank", accountNumber: "****1234", branchCode: "GH-ACC-001", netSalary: 7320, paymentDate: "June 30, 2024" },
    { id: "5", employeeId: "EMP-006", employeeName: "Lisa Martinez", bankName: "Standard Chartered", accountNumber: "****5566", branchCode: "GH-ACC-004", netSalary: 5935, paymentDate: "June 30, 2024" },
    { id: "6", employeeId: "EMP-007", employeeName: "Tom Anderson", bankName: "Barclays Bank", accountNumber: "****9988", branchCode: "GH-ACC-005", netSalary: 6755, paymentDate: "June 30, 2024" },
    { id: "7", employeeId: "EMP-008", employeeName: "Rachel Green", bankName: "Ecobank Ghana", accountNumber: "****4455", branchCode: "GH-ACC-002", netSalary: 5730, paymentDate: "June 30, 2024" },
  ];

  const filteredData = bankPaymentData.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBank = selectedBank === "All Banks" || record.bankName === selectedBank;
    return matchesSearch && matchesBank;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const totalNetSalary = filteredData.reduce((sum, record) => sum + record.netSalary, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Bank Payment Schedule - Local Account</h1>
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
            <button onClick={() => setShowBankDropdown(!showBankDropdown)} className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              <span className="text-sm text-slate-900">{selectedBank}</span>
              <ChevronDown size={16} className="text-purple-700" />
            </button>
            {showBankDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowBankDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {BANKS.map((bank) => (
                    <button key={bank} onClick={() => { setSelectedBank(bank); setShowBankDropdown(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 transition-colors">{bank}</button>
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Bank Name</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Account Number</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Branch Code</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Net Salary</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr key={record.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{record.employeeId}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{record.employeeName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-600">{record.bankName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500 font-mono">{record.accountNumber}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.branchCode}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-blue-600">{formatCurrency(record.netSalary)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.paymentDate}</p></td>
              </tr>
            ))}
            {filteredData.length > 0 && (
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <td colSpan={5} className="px-4 py-4"><p className="text-[12px] font-semibold text-white">TOTAL</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalNetSalary)}</p></td>
                <td className="px-4 py-4"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
