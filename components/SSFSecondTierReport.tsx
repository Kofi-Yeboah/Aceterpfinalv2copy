import { useState } from "react";
import { Download, Search, ChevronDown } from "lucide-react";

const DEPARTMENTS = ["All Departments", "Engineering", "Sales", "Marketing", "Operations", "HR", "Finance"];

export function SSFSecondTierReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const ssfData = [
    { id: "1", employeeId: "EMP-001", employeeName: "John Smith", department: "Engineering", basicSalary: 8500, employeeContribution: 425, employerContribution: 425, totalContribution: 850 },
    { id: "2", employeeId: "EMP-002", employeeName: "Sarah Johnson", department: "Sales", basicSalary: 7200, employeeContribution: 360, employerContribution: 360, totalContribution: 720 },
    { id: "3", employeeId: "EMP-003", employeeName: "Michael Brown", department: "Marketing", basicSalary: 6800, employeeContribution: 340, employerContribution: 340, totalContribution: 680 },
    { id: "4", employeeId: "EMP-004", employeeName: "Emily Davis", department: "Operations", basicSalary: 7500, employeeContribution: 375, employerContribution: 375, totalContribution: 750 },
    { id: "5", employeeId: "EMP-005", employeeName: "David Wilson", department: "HR", basicSalary: 6500, employeeContribution: 325, employerContribution: 325, totalContribution: 650 },
    { id: "6", employeeId: "EMP-006", employeeName: "Lisa Martinez", department: "Finance", basicSalary: 6200, employeeContribution: 310, employerContribution: 310, totalContribution: 620 },
    { id: "7", employeeId: "EMP-007", employeeName: "Tom Anderson", department: "Engineering", basicSalary: 7000, employeeContribution: 350, employerContribution: 350, totalContribution: 700 },
    { id: "8", employeeId: "EMP-008", employeeName: "Rachel Green", department: "Sales", basicSalary: 5500, employeeContribution: 275, employerContribution: 275, totalContribution: 550 },
  ];

  const filteredData = ssfData.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || record.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const totalBasicSalary = filteredData.reduce((sum, record) => sum + record.basicSalary, 0);
  const totalEmployeeContribution = filteredData.reduce((sum, record) => sum + record.employeeContribution, 0);
  const totalEmployerContribution = filteredData.reduce((sum, record) => sum + record.employerContribution, 0);
  const totalContribution = filteredData.reduce((sum, record) => sum + record.totalContribution, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">SSF - Second Tier Report</h1>
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
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Basic Salary</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employee Contribution (5%)</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Employer Contribution (5%)</th>
              <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Total Contribution</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr key={record.id} className={`border-b border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <td className="px-4 py-4"><p className="text-[12px] font-medium text-slate-900">{record.employeeId}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{record.employeeName}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-500">{record.department}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-slate-900">{formatCurrency(record.basicSalary)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-blue-600">{formatCurrency(record.employeeContribution)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] text-purple-600">{formatCurrency(record.employerContribution)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-slate-900">{formatCurrency(record.totalContribution)}</p></td>
              </tr>
            ))}
            {filteredData.length > 0 && (
              <tr style={{ backgroundColor: "#0B01D0" }}>
                <td colSpan={3} className="px-4 py-4"><p className="text-[12px] font-semibold text-white">TOTAL</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalBasicSalary)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalEmployeeContribution)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalEmployerContribution)}</p></td>
                <td className="px-4 py-4"><p className="text-[12px] font-semibold text-white">{formatCurrency(totalContribution)}</p></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
