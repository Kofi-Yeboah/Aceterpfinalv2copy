import { useState } from "react";
import { Download, Search, ChevronDown } from "lucide-react";

const DEPARTMENTS = ["All Departments", "Engineering", "Sales", "Marketing", "Operations", "HR", "Finance"];

export function PAYESchedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const payeData = [
    { id: "1", employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", grossIncome: 9700, taxRelief: 2400, taxableIncome: 7300, payeTax: 803, employeePension: 485, netPAYE: 318 },
    { id: "2", employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", grossIncome: 8700, taxRelief: 2400, taxableIncome: 6300, payeTax: 693, employeePension: 435, netPAYE: 258 },
    { id: "3", employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", grossIncome: 7700, taxRelief: 2400, taxableIncome: 5300, payeTax: 583, employeePension: 385, netPAYE: 198 },
    { id: "4", employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", grossIncome: 8600, taxRelief: 2400, taxableIncome: 6200, payeTax: 682, employeePension: 430, netPAYE: 252 },
    { id: "5", employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", grossIncome: 7300, taxRelief: 2400, taxableIncome: 4900, payeTax: 539, employeePension: 365, netPAYE: 174 },
    { id: "6", employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", grossIncome: 6950, taxRelief: 2400, taxableIncome: 4550, payeTax: 501, employeePension: 348, netPAYE: 153 },
    { id: "7", employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", grossIncome: 7950, taxRelief: 2400, taxableIncome: 5550, payeTax: 611, employeePension: 398, netPAYE: 213 },
    { id: "8", employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", grossIncome: 6700, taxRelief: 2400, taxableIncome: 4300, payeTax: 473, employeePension: 335, netPAYE: 138 },
  ];

  const filteredData = payeData.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || record.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const totalGrossIncome = filteredData.reduce((sum, record) => sum + record.grossIncome, 0);
  const totalTaxRelief = filteredData.reduce((sum, record) => sum + record.taxRelief, 0);
  const totalTaxableIncome = filteredData.reduce((sum, record) => sum + record.taxableIncome, 0);
  const totalPayeTax = filteredData.reduce((sum, record) => sum + record.payeTax, 0);
  const totalEmployeePension = filteredData.reduce((sum, record) => sum + record.employeePension, 0);
  const totalNetPAYE = filteredData.reduce((sum, record) => sum + record.netPAYE, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">PAYE Schedule</h1>
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Gross Income</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Tax Relief</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Taxable Income</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">PAYE Tax</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee Pension</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Net PAYE</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr key={record.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{record.employeeId}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{record.employeeName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.department}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(record.grossIncome)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-green-600">{formatCurrency(record.taxRelief)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(record.taxableIncome)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-red-600">{formatCurrency(record.payeTax)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(record.employeePension)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-blue-600">{formatCurrency(record.netPAYE)}</p></td>
              </tr>
            ))}
            {filteredData.length > 0 && (
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <td colSpan={3} className="px-4 py-4"><p className="text-[12px] font-semibold text-white">TOTAL</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalGrossIncome)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalTaxRelief)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalTaxableIncome)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalPayeTax)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalEmployeePension)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalNetPAYE)}</p></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
